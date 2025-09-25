const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const path = require('path');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// Define the API prefix
const API_PREFIX = '/api/v1';

// Directory for JSON files
const dataDir = path.join(__dirname, 'data');

// Create a map of resource names to lowdb instances
const dbMap = {};
fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.json')) {
    const resourceName = file.replace('.json', ''); // e.g., 'customer', 'product'
    const adapter = new FileSync(path.join(dataDir, file));
    dbMap[resourceName] = low(adapter);
  }
});

// Create a merged DB for json-server router
const db = {};
Object.keys(dbMap).forEach(resource => {
  db[resource] = dbMap[resource].get(resource).value() || [];
});

// Create router with merged data
const router = jsonServer.router(db, { id: 'id' });

// Custom ID generation
router.db._.id = 'id';
router.db._.createId = function (coll) {
  return String(coll.length + 1);
};

// Apply middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Import response constants
const { loginResponses, profileResponses } = require('./responses');

// Custom API handlers
const apiHandlers = {
  'auth/login': (req, res) => {
    const { name, password } = req.body;
    console.log("name and password ", name, password);
    if (!name || !password || name.length <= 3 || password.length <= 6) {
      return res.status(400).jsonp(loginResponses.badRequest);
    }
    const users = dbMap.users.get('users').value() || [];
    const user = users.find(u => u.name === name && u.password === password);
    console.log(loginResponses.success['jwt'], "users details ", user);

    if (user) {
      // Use the success response constant and add the token dynamically
      res.jsonp({ ...user, ['jwt']:loginResponses.success['jwt'] });
    } else {
      // Use the failure response constant
      res.status(401).jsonp(loginResponses.failure);
    }
  },

  'profile': (req, res) => {
    const userProfile = db.users[0];

    if (userProfile) {
      // Use the success response constant and add the profile data
      res.jsonp({ ...profileResponses.success, profile: { name: userProfile.name, id: userProfile.id } });
    } else {
      res.status(404).jsonp(profileResponses.failure);
    }
  },

  'auth/register': (req, res) => {
    const { name, phone, email, password, address, role } = req.body;
    if (!name || !phone || !email || !password || !address) {
      return res.status(400).jsonp({ message: 'All fields are required.' });
    }
    const users = dbMap.users.get('users').value() || [];
    // Check for duplicate email or name
    if (users.find(u => u.email === email || u.name === name)) {
      return res.status(409).jsonp({ message: 'User already exists.' });
    }
    const newUser = {
      id: String(users.length + 1),
      name,
      phone,
      email,
      password,
      address,
      role: role || 'customer',
    };
    dbMap.users.get('users').push(newUser).write();
    res.jsonp(newUser);
  },

  'cart': (req, res) => {
    if (req.method === 'GET') {
      // Fetch all cart items
      const cartItems = dbMap.cart.get('cart').value() || [];
      res.jsonp(cartItems);
    } else if (req.method === 'POST') {
      // Add new cart item
      const newItem = req.body;
      if (!newItem.productId || !newItem.size || !newItem.quantity) {
        return res.status(400).jsonp({ message: 'Missing required cart item fields.' });
      }
      newItem.id = String(dbMap.cart.get('cart').value().length + 1);
      dbMap.cart.get('cart').push(newItem).write();
      res.jsonp(newItem);
    } else {
      res.status(405).jsonp({ message: 'Method Not Allowed' });
    }
  }
};

// Register custom routes with API prefix
Object.entries(apiHandlers).forEach(([path, handler]) => {
  const fullPath = `${API_PREFIX}/${path}`;
  // Use POST for login and register, GET for profile
  if (path === 'auth/login' || path === 'auth/register') {
    server.post(fullPath, handler);
  } else {
    server.get(fullPath, handler);
  }
  console.log(`Registered handler for: ${fullPath}`);
});

// Custom middleware to handle POST requests and write to correct file
// Custom middleware to handle POST, PUT, and DELETE requests
server.use((req, res, next) => {
  const resource = req.path.replace(`${API_PREFIX}/`, '').split('/')[0]; // e.g., 'products'
  if (!dbMap[resource]) return next(); // Skip if resource doesn't exist

  if (req.method === 'POST') {
    const data = req.body;
    // Ensure the data has an 'id' (string, per createId)
    if (!data.id) {
      data.id = String(dbMap[resource].get(resource).value().length + 1);
    }
    try {
      // Persist to the correct JSON file
      dbMap[resource].get(resource).push(data).write();
      // Update in-memory db for router consistency
      db[resource] = dbMap[resource].get(resource).value();
      return res.jsonp(data);
    } catch (e) {
      return res.status(500).jsonp({ error: 'Failed to save data' });
    }
  } else if (req.method === 'PUT') {
    const id = req.path.split('/').pop(); // e.g., '/api/v1/products/1' -> '1'
    const data = req.body;
    try {
      // Update the resource in the correct JSON file
      const resourceData = dbMap[resource].get(resource);
      const index = resourceData.findIndex(item=> String(item.id) === String(id)).value();
      //const index = resourceData.findIndex({ id }).value();
      if (index === -1) {
        return res.status(404).jsonp({ error: `${resource} not found` });
      }
      resourceData.splice(index, 1, { ...data, id }).write();
      // Update in-memory db
      db[resource] = dbMap[resource].get(resource).value();
      return res.jsonp(data);
    } catch (e) {
      return res.status(500).jsonp({ error: 'Failed to update data' });
    }
  } else if (req.method === 'DELETE') {
    const id = req.path.split('/').pop();
    try {
      // Delete from the correct JSON file
      const resourceData = dbMap[resource].get(resource);
     const index = resourceData.findIndex(item=> String(item.id) === String(id)).value();
      if (index === -1) {
        return res.status(404).jsonp({ error: `${resource} not found` });
      }
      resourceData.splice(index, 1).write();
      // Update in-memory db
      db[resource] = dbMap[resource].get(resource).value();
      return res.status(204).jsonp({});
    } catch (e) {
      return res.status(500).jsonp({ error: 'Failed to delete data' });
    }
  }

  next();
});

server.put(`${API_PREFIX}/cart/:id`, (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;
  const cartData = dbMap.cart.get('cart');
  const index = cartData.findIndex(item => String(item.id) === String(id)).value();
  if (index === -1) {
    return res.status(404).jsonp({ message: 'Cart item not found.' });
  }
  cartData.splice(index, 1, { ...updatedItem, id }).write();
  res.jsonp(updatedItem);
});

server.get(`${API_PREFIX}/users`, (req, res) => {
  const users = dbMap.users.get('users').value() || [];
  res.jsonp(users);
});

server.put(`${API_PREFIX}/users/:id`, (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  const usersData = dbMap.users.get('users');
  const index = usersData.findIndex(item => String(item.id) === String(id)).value();
  if (index === -1) {
    return res.status(404).jsonp({ message: 'User not found.' });
  }
  usersData.splice(index, 1, { ...updatedUser, id }).write();
  res.jsonp({ ...updatedUser, id });
});

server.get(`${API_PREFIX}/orders`, (req, res) => {
  const userId = req.query.userId;
  const orders = dbMap.orders.get('orders').value() || [];
  if (userId) {
    const userOrders = orders.filter(order => String(order.userId) === String(userId));
    return res.jsonp(userOrders);
  }
  res.jsonp(orders);
});

server.put(`${API_PREFIX}/products/:id`, (req, res) => {
  const id = req.params.id;
  const updatedProduct = req.body;
  const productsData = dbMap.products.get('products');
  const index = productsData.findIndex(item => String(item.id) === String(id)).value();
  if (index === -1) {
    return res.status(404).jsonp({ message: 'Product not found.' });
  }
  productsData.splice(index, 1, { ...updatedProduct, id }).write();
  res.jsonp({ ...updatedProduct, id });
});

// Apply router for other CRUD operations
server.use(API_PREFIX, router);

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});