!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const designationController = require('../../controllers/master/designation.controller');
    const checkAuth = require('../../../check-auth.middleware');

    router.post('/addDesignation',  designationController.addDesignation);
    router.put('/updateDesignation/:id', designationController.updateDesignation);
    router.post('/deleteDesignation/:id', designationController.deleteDesignation);
    router.get('/getDesignation/:id', designationController.getDesignationById);
    router.get('/getDesignations', designationController.getDesignations);
    module.exports = router;
})();
