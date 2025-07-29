curl -X POST http://localhost:3000/telemetry \
-H "Content-Type: application/json" \
-d '{"vin": "1HGCM82633A123456", "gps": {"latitude": 40.7128, "longitude": -74.0060}, "speed": 135, "engineStatus": "On", "fuelLevel": 10, "odometer": 123456, "diagnosticCodes": []}'


curl http://localhost:3000/telemetry/1HGCM82633A123456

curl http://localhost:3000/telemetry/1HGCM82633A123456/latest

curl -X POST http://localhost:3000/vehicles/new -H "Content-Type: application/json" -d '{"vin": "1HGCM82633A123456", "Model": "Honda Accord", "fleetID": "FleetA", "operator": "MotorQ Ops", "regStatus": "Active"}'

curl http://localhost:3000/vehicles/all


curl http://localhost:3000/vehicles/1HGCM82633A123456

curl -X DELETE http://localhost:3000/vehicles/1HGCM82633A123456



curl http://localhost:3000/alerts/all

curl http://localhost:3000/alerts/0



curl http://localhost:3000/analytics/fleet

curl http://localhost:3000/analytics/fleet/FleetA

curl http://localhost:3000/analytics/alerts

curl http://localhost:3000/analytics/overview

curl http://localhost:3000/analytics/distance







# -- new one ---
# curl -X POST http://localhost:3000/vehicles/new \
# -H "Content-Type: application/json" \
# -d '{
#   "vin": "1HGCM82633A123456",
#   "Model": "Honda Accord",
#   "fleetID": "FleetA",
#   "operator": "MotorQ Ops",
#   "regStatus": "Active"
# }'
