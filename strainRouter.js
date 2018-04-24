const express = require('express');
const strainRouter = express.Router();

import {createNewStrain, getStrains, updateStrain, deleteStrain} from './strains/strains.js';

strainRouter.post('/strains/new', createNewStrain);
strainRouter.get('/strains', getStrains);
strainRouter.put('/strains/:id', updateStrain);
strainRouter.delete('/strains/:id', deleteStrain);

app.use('/', strainRouter);
app.use('/', function(req, res) {
    res.status(404).send("Sorry, that route doesn't exist.");
})