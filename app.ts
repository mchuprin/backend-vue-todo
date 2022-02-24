export {};

const express = require ('express');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(bodyParser.json());

const routes = require('./src/modules/routes/index');

app.use(cors());
app.use('/api', routes);

const url = process.env.mongoURL;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('MongoDB is here')
    app.listen(8000, () => {
      console.log('I am listening')
    });
  })
  .catch((e: string) => console.log(e))

