const telemetry = {
    data: {},
    
    validateTelemetry(data) {
        if (!data.vin) throw new Error('VIN is required');
        if (data.speed < 0 || data.speed > 300) 
            throw new Error('Invalid speed value');
        if (data.gps?.latitude < -90 || data.gps?.latitude > 90)
            throw new Error('Invalid latitude');
        if (data.gps?.longitude < -180 || data.gps?.longitude > 180)
            throw new Error('Invalid longitude');
        if (data.fuelLevel < 0 || data.fuelLevel > 100)
            throw new Error('Invalid fuel level');
    },
    
    addAlert(vin, alert) {
        if (!telemetry.data[vin]) {
            telemetry.data[vin] = {
                history: [],
                alerts: [],
                latest: null
            };
        }
        telemetry.data[vin].alerts.push(alert);
    },
    
    addTelemetry: (data) => {
    telemetry.validateTelemetry(data);
    const { vin } = data;

    if (!telemetry.data[vin]) {
        telemetry.data[vin] = {
            history: [],
            alerts: [],
            latest: null
        };
    }

    const telemetryData = {
            GPS_coordinates: {
                latitude: data.gps?.latitude,
                longitude: data.gps?.longitude
            },
            Speed: data.speed,
            Engine_status: data.engineStatus,
            Fuel_Battery_level: data.fuelLevel,
            Odometer_reading: data.odometer,
            Diagnostic_codes: data.diagnosticCodes || [],
            Timestamp: new Date().toISOString()
        };

        telemetry.data[vin].history.push(telemetryData);
        telemetry.data[vin].latest = telemetryData;

        telemetry.checkAlerts(vin, telemetryData);
    },

    
    checkAlerts(vin, data) {
        const now = new Date();
        
        // Speed alert
        if (data.Speed && data.Speed > 120) {
            telemetry.addAlert(vin, {
                id: Date.now(),
                type: 'Speed',
                severity: 'High',
                message: `Vehicle ${vin} exceeded speed limit`,
                timestamp: now.toISOString(),
                value: data.Speed
            });
        }
        
        // Fuel alert
        if (data.Fuel_Battery_level && data.Fuel_Battery_level < 10) {
            telemetry.addAlert(vin, {
                id: Date.now(),
                type: 'Fuel',
                severity: 'Medium',
                message: `Vehicle ${vin} has low fuel level`,
                timestamp: now.toISOString(),
                value: data.Fuel_Battery_level
            });
        }
    },
    
    getLatest: (vin) => {
        return telemetry.data[vin]?.latest || null;
    },
    
    getHistory: (vin) => {
        return telemetry.data[vin]?.history || [];
    },
    
    getAlerts: (vin) => {
        return telemetry.data[vin]?.alerts || [];
    }
};

module.exports = telemetry;
