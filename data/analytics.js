const analytics = {
    fleetData: {},
    updateAnalytics: () => {
        // Get all vehicles and their telemetry data
        const vehicles = require('../data/vehicles').vehicles;
        const telemetry = require('../data/telemetry').telemetry;
        const alerts = require('../data/alerts').alerts;

        analytics.fleetData = {};

        // do the processng for each vehicle
        vehicles.forEach(vehicle => {
            const fleetId = vehicle.Fleet_ID;
            if (!analytics.fleetData[fleetId]) {
                analytics.fleetData[fleetId] = {
                    vehicleCount: 0,
                    activeVehicles: 0,
                    totalFuelLevel: 0,
                    totalDistance: 0,
                    alerts: {
                        byType: {},
                        bySeverity: {}
                    }
                };
            }

            analytics.fleetData[fleetId].vehicleCount++;

            if (vehicle.Registration_status === 'Active') {
                analytics.fleetData[fleetId].activeVehicles++;
            }

            // Get latest telemetry data
            const latestTelemetry = telemetry.getLatest(vehicle.VIN);
            if (latestTelemetry) {
                analytics.fleetData[fleetId].totalFuelLevel += latestTelemetry.Fuel_Battery_level;

                const history = telemetry.getHistory(vehicle.VIN);
                if (history.length > 1) {
                    const firstOdometer = history[0].Odometer_reading;
                    const lastOdometer = history[history.length - 1].Odometer_reading;
                    analytics.fleetData[fleetId].totalDistance += (lastOdometer - firstOdometer);
                }
            }

            const vehicleAlerts = alerts.filter(alert => alert.vin === vehicle.VIN);
            vehicleAlerts.forEach(alert => {
                if (!analytics.fleetData[fleetId].alerts.byType[alert.type]) {
                    analytics.fleetData[fleetId].alerts.byType[alert.type] = 0;
                }
                analytics.fleetData[fleetId].alerts.byType[alert.type]++;

                if (!analytics.fleetData[fleetId].alerts.bySeverity[alert.severity]) {
                    analytics.fleetData[fleetId].alerts.bySeverity[alert.severity] = 0;
                }
                analytics.fleetData[fleetId].alerts.bySeverity[alert.severity]++;
            });
        });

        Object.values(analytics.fleetData).forEach(fleet => {
            if (fleet.vehicleCount > 0) {
                fleet.avgFuelLevel = fleet.totalFuelLevel / fleet.vehicleCount;
            }
        });
    }
};

setInterval(analytics.updateAnalytics, 5 * 60 * 1000);

module.exports = analytics;
