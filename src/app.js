import express from 'express';


const {sequelize} = require('../models');
const todos = require('../routes/todos');

require('dotenv').config();


const app = express();
sequelize.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/hello-world', (req, res) => {
  res.send('hello world');
})

app.use('/todos',todos);

export default app;
