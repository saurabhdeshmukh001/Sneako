import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiClock,
  FiAlertTriangle,
  FiSettings,
} from "react-icons/fi";

const DollarIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
           {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-2-1v-2h4v2m-4 0v-2h4m-4 0a4 4 0 0 0 8 0v-2a4 4 0 0 0-8 0m-4 0a4 4 0 0 1 8 0v-2a4 4 0 0 1-8 0"
    />
       {" "}
  </svg>
);
const ShoppingCartIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
           {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.023.824l.798 4.792a3 3 0 0 0 2.493 2.527l9.746.541a3 3 0 0 0 2.493-2.527l.798-4.792c.068-.481.513-.824 1.023-.824H21m-2.5 14.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM13.5 16.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
    />
       {" "}
  </svg>
);
const BoxIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
           {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 7.5l-.625 10.5M5 7.5l.625 10.5m1.5-12h11.25m-6.75 6.75l-4.75 4.75M12 12.75h.008v.008H12v-.008ZM12 18.75h.008v.008H12v-.008ZM6.375 14.25l-.168 1.008c-.287 1.25.753 2.536 2.078 2.536h12.336c1.325 0 2.365-1.286 2.078-2.536l-.168-1.008M6.375 14.25H4.281l-.145.869c-.198 1.18.59 2.378 1.768 2.378h13.25c1.178 0 1.966-1.198 1.768-2.378l-.145-.869H17.625"
    />
       {" "}
  </svg>
);
const UsersIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
           {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 4.743A9.75 9.75 0 0 1 12 19.5c-4.142 0-7.756-2.613-9.155-6.236m18.31 0c-1.399 3.623-5.013 6.236-9.155 6.236m-.918-16.5a12.72 12.72 0 0 1 10.933 6.55m-10.933-6.55A12.72 12.72 0 0 0 12 14.25M12 6.75a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
    />
       {" "}
  </svg>
);
const ClockIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
           {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 9a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
       {" "}
  </svg>
);
const ExclamationTriangleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
           {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.3 9.3c.797 0 1.57-.308 2.147-.852l7.006-6.877c.4-.4.92-.622 1.458-.622s1.058.222 1.458.622l7.006 6.877c.577.544 1.35.852 2.147.852h1.5A.75.75 0 0 0 22.5 21v-3.324a.75.75 0 0 0-.214-.528l-7.25-7.085c-.45-.45-.45-1.18 0-1.63L21.786 5.25a.75.75 0 0 0 .214-.528V2.25A.75.75 0 0 0 21.324 1.5H2.676A.75.75 0 0 0 2 2.25v2.472c0 .204.081.4.214.528l7.25 7.085c.45.45.45 1.18 0 1.63L2.214 20.147a.75.75 0 0 0-.214.528v3.324A.75.75 0 0 0 3.3 21.75Z"
    />
       {" "}
  </svg>
);
const CogIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
           {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.018a.75.75 0 0 1 .436-.889L12 1.5l1.97.629a.75.75 0 0 1 .436.89l-.265 1.325a.75.75 0 0 0 .521.841l1.325.265a.75.75 0 0 1 .89.436L22.5 12l-.629 1.97a.75.75 0 0 1-.89.436l-1.325-.265a.75.75 0 0 0-.841.521l-.265 1.325a.75.75 0 0 1-.436.89L12 22.5l-1.97-.629a.75.75 0 0 1-.436-.89l.265-1.325a.75.75 0 0 0-.521-.841l-1.325-.265a.75.75 0 0 1-.89-.436L1.5 12l.629-1.97a.75.75 0 0 1 .89-.436l1.325.265a.75.75 0 0 0 .841-.521l.265-1.325a.75.75 0 0 1 .436-.89ZM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
    />
       {" "}
  </svg>
);

const DollarIcon_Simple = (props) => (
  <DollarIcon className="w-6 h-6" {...props} />
);
const ShoppingCartIcon_Simple = (props) => (
  <ShoppingCartIcon className="w-6 h-6" {...props} />
);
const BoxIcon_Simple = (props) => <BoxIcon className="w-6 h-6" {...props} />;
const UsersIcon_Simple = (props) => (
  <UsersIcon className="w-6 h-6" {...props} />
);
const ClockIcon_Simple = (props) => (
  <ClockIcon className="w-6 h-6" {...props} />
);
const ExclamationTriangleIcon_Simple = (props) => (
  <ExclamationTriangleIcon className="w-6 h-6" {...props} />
);
const CogIcon_Simple = (props) => <CogIcon className="w-6 h-6" {...props} />;

const StatCard = ({ title, value, change, icon: IconComponent, color }) => {
  const changeColor = change.startsWith("+")
    ? "text-green-600 bg-green-50"
    : "text-red-600 bg-red-50";

  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
                 {" "}
      <div>
                       {" "}
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </span>
                       {" "}
        <div className="text-3xl font-extrabold text-gray-900 mt-1">
          {value}
        </div>
                       {" "}
        <div
          className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-2 ${changeColor}`}
        >
                              {change}               {" "}
        </div>
                   {" "}
      </div>
                 {" "}
      <div
        className={`w-14 h-14 flex items-center justify-center ${color} rounded-full text-white text-2xl shadow-lg`}
      >
                        {IconComponent}           {" "}
      </div>
             {" "}
    </div>
  );
};

const StatusActionCard = ({
  label,
  value,
  bgColor,
  icon: IconComponent,
  color,
}) => (
  <div
    className={`p-6 rounded-xl text-center shadow-lg border border-gray-200 ${bgColor} transition duration-300 hover:scale-[1.02] cursor-pointer`}
  >
           {" "}
    <div className={`text-5xl mx-auto mb-3 ${color}`}>
                  {IconComponent}       {" "}
    </div>
           {" "}
    <div className="text-lg font-bold text-gray-800">
                  {label}       {" "}
    </div>
           {" "}
    {value && (
      <div className="text-3xl font-extrabold text-gray-900 mt-1">
                        {value}           {" "}
      </div>
    )}
       {" "}
  </div>
);

const AdminOverview = () => {
  // --- State to hold the fetched data ---
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // --- useEffect Hook for data fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders and calculate total revenue and count
        const ordersResponse = await axios.get(
          "http://localhost:3000/api/v1/orders"
        );
        const ordersData = ordersResponse.data;
        const revenue = ordersData.reduce(
          (sum, order) => sum + order.totalPrice,
          0
        );
        setTotalRevenue(revenue);
        setTotalOrders(ordersData.length);

        // Fetch products and get the total count
        const productsResponse = await axios.get(
          "http://localhost:3000/api/v1/products"
        );
        const productsData = productsResponse.data;
        setTotalProducts(productsData.length);

        // Fetch users and filter for customers
        const usersResponse = await axios.get(
          "http://localhost:3000/api/v1/users"
        );
        const usersData = usersResponse.data;
        const customers = usersData.filter((user) => user.role === "customer");
        setTotalCustomers(customers.length);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${(totalRevenue / 1000).toFixed(2)}K`,
      change: "+12.5%",
      icon: <DollarIcon_Simple />,
      color: "bg-green-600",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      change: "+8.2%",
      icon: <ShoppingCartIcon_Simple />,
      color: "bg-blue-600",
    },
    {
      title: "Total Products",
      value: totalProducts,
      change: "+3.1%",
      icon: <BoxIcon_Simple />,
      color: "bg-indigo-600",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      change: "+15.3%",
      icon: <UsersIcon_Simple />,
      color: "bg-teal-600",
    },
  ];

  const statusItems = [
    {
      label: "Pending Orders",
      value: "12",
      bgColor: "bg-amber-50",
      icon: <ClockIcon_Simple />,
      color: "text-amber-600",
    },
    {
      label: "Low Stock Items",
      value: "25",
      bgColor: "bg-red-50",
      icon: <ExclamationTriangleIcon_Simple />,
      color: "text-red-600",
    },
  ];

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-3">
          Dashboard Overview 📊
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Alerts & Actions
            </h2>

            {statusItems.map((item, index) => (
              <StatusActionCard
                key={index}
                label={item.label}
                value={item.value}
                bgColor={item.bgColor}
                icon={item.icon}
                color={item.color}
              />
            ))}

            <StatusActionCard
              label={"Manage Inventory"}
              bgColor={"bg-blue-50"}
              icon={<CogIcon_Simple />}
              color={"text-blue-600"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
