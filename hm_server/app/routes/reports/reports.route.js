!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const reportsController = require('../../controllers/reports/reports.controller');
    const checkAuth = require('../../../check-auth.middleware');

    router.post('/detailedAllocationReport', reportsController.detailedAllocationReport);
    router.post('/detailedOccupancyReport',reportsController.detailedOccupancyReport);
    module.exports = router;

})();
