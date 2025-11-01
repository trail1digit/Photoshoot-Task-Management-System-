const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('../src/db/connection');
const routes = require("./routes/index");

// Calling db connection
db();

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

app.use('/uploads', express.static('uploads'));

// Define a route
app.get('/', (req, res) => {
    res.send('Backend Running!');
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
