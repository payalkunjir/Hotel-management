!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const vehicleController = require('../../controllers/master/vehicle.controller');
    const checkAuth = require('../../../check-auth.middleware');

    router.post('/addVehicle',  vehicleController.addVehicle);
    router.put('/updateVehicle/:id', vehicleController.updateVehicle);
    router.post('/deleteVehicle/:id', vehicleController.deleteVehicle);
    router.get('/getVehicle/:id', vehicleController.getVehicleById);
    router.get('/getVehicles', vehicleController.getVehicles);
    module.exports = router;

})();
