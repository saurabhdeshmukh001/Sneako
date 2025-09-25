// responses.js

const loginResponses = {
    success: {
        "jwt": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc1NzY2NTcxOCwiZXhwIjoxNzU3NjY2NjE4LCJpc3MiOiJnZW5jX2NvaG9ydCIsImF1ZCI6WyJHZW5DIl19.TomHldZbSpcIc6bb6gRqpGPw6bm2RSwaHWmwzL_cXmo",
        "userId": "admin",
        "firstName": "quickbyte",
        "lastName": "genc",
        "role": "Admin",
        "email": "quickbytegenc@cognizant.com",
        "phone": "7567171234"
    },
    failure: {
        success: false,
        message: 'Invalid username or password',
    },
};

const profileResponses = {
    success: {
        success: true,
        message: 'User profile retrieved successfully',
    },
    failure: {
        success: false,
        message: 'User not found',
    },
};

module.exports = {
    loginResponses,
    profileResponses,
};