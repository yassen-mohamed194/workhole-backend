const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 8009;
const MONGO_URI = process.env.MONGO_URI;





async function startServer() {
    try {
        if (MONGO_URI) {
            mongoose.connection.on('error', (error) => {
                console.error('[DB] MongoDB connection error:', error.message || error);
            });

            await mongoose.connect(MONGO_URI);
            console.log('[DB] Connected to MongoDB');
        } else {
            console.log('[DB] MONGO_URI not provided, starting without DB connection');
        }

        app.listen(PORT, () => {
            console.log(`[SERVER] Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('[SERVER] Failed to start server:', error.message || error);
        process.exit(1);
    }
}


startServer();