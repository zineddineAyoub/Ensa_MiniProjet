const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true}).catch((reason) => {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.listen(PORT,()=>console.log(`server started at PORT ${PORT}`));

