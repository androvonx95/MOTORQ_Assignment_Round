const express = require('express');
const cors = require('cors');


const telemetry = require('./data/telemetry.js');
const vehicles = require('./data/vehicles.js');
const alerts = require('./data/alerts.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
