const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const usersRoutes = require('./modules/users/users.routes');
const authRoutes = require('./modules/auth/auth.routes');
const errorHandler = require('./shared/middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

module.exports = app;
