import express from 'express';


require('dotenv').config();


const app = express();

app.use('/hello-world', (req, res) => {
  res.send('hello world');
})

export default app;
