const express = require('express');
const cors = require('cors');
const { vehicles, telemetry, alerts } = require('./data');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Vehicles
app.post('/vehicles', (req, res) => {
  const { vin, manufacturer, model, fleetId, owner, status = 'Active' } = req.body;
  
  if (vehicles[vin]) {
    return res.status(400).json({ error: 'Vehicle exists' });
  }
  
  vehicles[vin] = { vin, manufacturer, model, fleetId, owner, status };
  res.json(vehicles[vin]);
});

app.get('/vehicles', (req, res) => {
  const { fleetId } = req.query;
  if (fleetId) {
    res.json(Object.values(vehicles).filter(v => v.fleetId === fleetId));
  } else {
    res.json(Object.values(vehicles));
  }
});

app.get('/vehicles/:vin', (req, res) => {
  res.json(vehicles[req.params.vin] || { error: 'Not found' });
});

app.delete('/vehicles/:vin', (req, res) => {
  delete vehicles[req.params.vin];
  res.status(204).send();
});

// Telemetry
app.post('/telemetry', (req, res) => {
  const { vin, lat, lon, speed, engineStatus, fuelLevel, odometer, diagnosticCodes } = req.body;
  
  if (!telemetry[vin]) telemetry[vin] = [];
  
  const data = {
    vin,
    lat,
    lon,
    speed,
    engineStatus,
    fuelLevel,
    odometer,
    diagnosticCodes,
    timestamp: new Date().toISOString()
  };
  
  telemetry[vin].push(data);
  checkAlerts(data);
  res.json(data);
});

app.get('/telemetry/:vin', (req, res) => {
  const data = telemetry[req.params.vin] || [];
  const last24Hours = data.filter(t => new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000));
  res.json(last24Hours);
});

app.get('/telemetry/:vin/latest', (req, res) => {
  const data = telemetry[req.params.vin] || [];
  res.json(data[data.length - 1] || null);
});

// Alerts
function checkAlerts(telemetry) {
  const timestamp = telemetry.timestamp;
  
  if (telemetry.speed > 120) {
    alerts.push({
      id: Date.now().toString(),
      vin: telemetry.vin,
      type: 'Speed',
      severity: 'High',
      message: `Speed limit exceeded: ${telemetry.speed} km/h`,
      timestamp
    });
  }
  
  if (telemetry.fuelLevel < 15) {
    alerts.push({
      id: Date.now().toString(),
      vin: telemetry.vin,
      type: 'Fuel',
      severity: 'Medium',
      message: `Low fuel level: ${telemetry.fuelLevel}%`,
      timestamp
    });
  }
  
  if (telemetry.diagnosticCodes?.length) {
    telemetry.diagnosticCodes.forEach(code => {
      alerts.push({
        id: Date.now().toString(),
        vin: telemetry.vin,
        type: 'Diagnostic',
        severity: code.startsWith('P') ? 'Medium' : 'Low',
        message: `Diagnostic code: ${code}`,
        timestamp
      });
    });
  }
}

app.get('/alerts', (req, res) => {
  res.json(alerts);
});

app.get('/alerts/:id', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  res.json(alert || { error: 'Not found' });
});

// Analytics
app.get('/analytics', (req, res) => {
  const allTelemetry = Object.values(telemetry).flat();
  const last24Hours = allTelemetry.filter(t => new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000));
  
  const analytics = {
    activeVehicles: Object.values(vehicles).filter(v => v.status === 'Active').length,
    avgFuelLevel: last24Hours.reduce((sum, t) => sum + t.fuelLevel, 0) / last24Hours.length,
    totalKmTraveled: last24Hours.reduce((sum, t) => sum + t.odometer, 0),
    alertSummary: alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {})
  };
  
  res.json(analytics);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
