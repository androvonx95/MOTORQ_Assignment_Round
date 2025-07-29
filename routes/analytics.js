const express = require('express');
const router = express.Router();
const analytics = require('../data/analytics');
const telemetry = require('../data/telemetry.js');
const vehicles = require('../data/vehicles.js');
const alerts = require('../data/alerts.js');

// Get all fleet analytics
router.get('/fleet', (req, res) => {
    try {
        const fleetAnalytics = Object.entries(analytics.fleetData).map(([fleetId, data]) => ({
            fleetId,
            ...data,
            inactiveVehicles: data.vehicleCount - data.activeVehicles
        }));
        
        res.json(fleetAnalytics);
    } catch (error) {
        console.error('Error fetching fleet analytics:', error);
        res.status(500).json({ error: 'Failed to fetch fleet analytics' });
    }
});

// Get specific fleet analytics
router.get('/fleet/:fleetId', (req, res) => {
    const { fleetId } = req.params;
    try {
        const fleetData = analytics.fleetData[fleetId];
        if (!fleetData) {
            return res.status(404).json({ error: 'Fleet not found' });
        }

        res.json({
            fleetId,
            ...fleetData,
            inactiveVehicles: fleetData.vehicleCount - fleetData.activeVehicles
        });
    } catch (error) {
        console.error(`Error fetching analytics for fleet ${fleetId}:`, error);
        res.status(500).json({ error: 'Failed to fetch fleet analytics' });
    }
});

// Get alert summary for all fleets
router.get('/alerts', (req, res) => {
    try {
        const alertSummary = {
            byType: {},
            bySeverity: {}
        };

        // collect out the alerts from all fleets
        Object.values(analytics.fleetData).forEach(fleet => {
            Object.entries(fleet.alerts.byType).forEach(([type, count]) => {
                alertSummary.byType[type] = (alertSummary.byType[type] || 0) + count;
            });
            Object.entries(fleet.alerts.bySeverity).forEach(([severity, count]) => {
                alertSummary.bySeverity[severity] = (alertSummary.bySeverity[severity] || 0) + count;
            });
        });

        res.json(alertSummary);
    } catch (error) {
        console.error('Error fetching alert summary:', error);
        res.status(500).json({ error: 'Failed to fetch alert summary' });
    }
});

router.get('/overview', (req, res) => {
    try {
        // Get total counts for all fleets
        const totalData = {
            totalVehicles: 0,
            totalActive: 0,
            totalInactive: 0,
            totalDistance: 0,
            avgFuelLevel: 0,
            alerts: {
                byType: {},
                bySeverity: {}
            }
        };

        // collect and avg out data from all fleets
        Object.values(analytics.fleetData).forEach(fleet => {
            totalData.totalVehicles += fleet.vehicleCount;
            totalData.totalActive += fleet.activeVehicles;
            totalData.totalInactive += fleet.vehicleCount - fleet.activeVehicles;
            totalData.totalDistance += fleet.totalDistance;
            totalData.avgFuelLevel += fleet.avgFuelLevel;

            Object.entries(fleet.alerts.byType).forEach(([type, count]) => {
                totalData.alerts.byType[type] = (totalData.alerts.byType[type] || 0) + count;
            });
            Object.entries(fleet.alerts.bySeverity).forEach(([severity, count]) => {
                totalData.alerts.bySeverity[severity] = (totalData.alerts.bySeverity[severity] || 0) + count;
            });
        });

        // Calculate average fuel level across all vehicles
        if (totalData.totalVehicles > 0) {
            totalData.avgFuelLevel /= totalData.totalVehicles;
        }

        res.json(totalData);
    } catch (error) {
        console.error('Error fetching overview:', error);
        res.status(500).json({ error: 'Failed to fetch overview' });
    }
});

router.get('/distance', (req, res) => {
    try {
        const totalDistance = Object.values(analytics.fleetData)
            .reduce((sum, fleet) => sum + fleet.totalDistance, 0);

        res.json({ totalDistance });
    } catch (error) {
        console.error('Error fetching distance:', error);
        res.status(500).json({ error: 'Failed to fetch distance' });
    }
});

router.get('/alerts', (req, res) => {
    try {
        const alertSummary = {
            byType: {},
            bySeverity: {}
        };

        Object.values(analytics.fleetData).forEach(fleet => {
            Object.entries(fleet.alerts.byType).forEach(([type, count]) => {
                alertSummary.byType[type] = (alertSummary.byType[type] || 0) + count;
            });
            Object.entries(fleet.alerts.bySeverity).forEach(([severity, count]) => {
                alertSummary.bySeverity[severity] = (alertSummary.bySeverity[severity] || 0) + count;
            });
        });

        res.json(alertSummary);
    } catch (error) {
        console.error('Error fetching alert summary:', error);
        res.status(500).json({ error: 'Failed to fetch alert summary' });
    }
});

module.exports = router;
