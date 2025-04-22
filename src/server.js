const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./api/routes/v1/auth_routes');
const userRoutes = require('./api/routes/v1/user_routes');
const morgan = require('morgan');
require('./databases/mongodb');
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the User Management API',
    version: 'v1',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users'
    }
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
