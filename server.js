const express = require('express');
const app = express();
const mongoose = require('mongoose')
const AdminRouter = require('./routes/admin')
const etudiantRouter = require('./routes/etudiant')
const profRouter = require('./routes/prof')
const NiveauFiliereRouter = require('./routes/niveauFiliere');
const cors=require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const PORT = process.env.PORT || 5000;

// Routes
app.use('/admin', AdminRouter);
app.use('/etudiant', etudiantRouter);
app.use('/prof', profRouter);
app.use('/niveauFiliere', NiveauFiliereRouter);

// Mongo Connection 
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true}).catch((reason) => {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


//Starting Server
app.listen(PORT,()=>console.log(`server started at PORT ${PORT}`));

