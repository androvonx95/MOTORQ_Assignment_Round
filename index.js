const express = require('express');
const cors = require('cors');

const telemetry = require('./data/telemetry.js');
const vehicles = require('./data/vehicles.js');
const alerts = require('./data/alerts.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/alerts', require('./routes/alerts.js'));
app.use('/analytics', require('./routes/analytics.js'));
app.use('/telemetry', require('./routes/telemetry'));
app.use('/vehicles', require('./routes/vehicles.js'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
