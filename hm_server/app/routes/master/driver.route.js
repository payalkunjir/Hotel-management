!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const driverController = require('../../controllers/master/driver.controller');
    const checkAuth = require('../../../check-auth.middleware');

    router.post('/addDriver',  driverController.addDriver);
    router.put('/updateDriver/:id', driverController.updateDriver);
    router.post('/deleteDriver/:id', driverController.deleteDriver);
    router.get('/getDriver/:id', driverController.getDriverById);
    router.get('/getDrivers', driverController.getDrivers);
    module.exports = router;

})();