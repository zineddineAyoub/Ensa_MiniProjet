const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors=require('cors');
const admin=require('./routes/admin');
const prof=require('./routes/prof');
const etudiant=require('./routes/etudiant');
require('dotenv').config();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true}).catch((reason) => {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

//routes
app.use('/admin',admin);
app.use('/prof',prof);
app.use('/etudiant',etudiant);

app.listen(PORT,()=>console.log(`server started at PORT ${PORT}`));

