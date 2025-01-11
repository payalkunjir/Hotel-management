!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const areaController = require('../../controllers/master/area.controller');
    const checkAuth = require('../../../check-auth.middleware');

    router.post('/addArea',  areaController.addArea);
    router.put('/updateArea/:id', areaController.updateArea);
    router.post('/deleteArea/:id', areaController.deleteArea);
    router.get('/getArea/:id', areaController.getAreaById);
    router.get('/getAreas', areaController.getAreas);
    module.exports = router;
})();