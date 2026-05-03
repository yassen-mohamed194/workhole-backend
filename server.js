const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    if (error && error.name === 'MongooseServerSelectionError') {
      console.error(
        'MongoDB connection failed. Check Atlas Network Access (IP allowlist), cluster status, and MONGO_URI.'
      );
    }
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
