const telemetry = {
    data: {},
    addTelemetry: (vin, data) => {
        if (!telemetry.data[vin]) {
            telemetry.data[vin] = [];
        }
        telemetry.data[vin].push({
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
        });
    },
    getLatest: (vin) => {
        if (telemetry.data[vin]) {
            return telemetry.data[vin][telemetry.data[vin].length - 1];
        }
        return null;
    },
    getHistory: (vin) => {
        if (!telemetry.data[vin]) return [];
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        return telemetry.data[vin].filter(record => 
            new Date(record.Timestamp) >= twentyFourHoursAgo
        );
    }
};

module.exports = telemetry;
