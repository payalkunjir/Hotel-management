!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const guestCategoryController = require('../../controllers/master/guestCategory.controller');
    const checkAuth = require('../../../check-auth.middleware');

    router.post('/addGuestCategory',  guestCategoryController.addGuestCategory);
    router.put('/updateGuestCategory/:id', guestCategoryController.updateGuestCategory);
    router.post('/deleteGuestCategory/:id', guestCategoryController.deleteGuestCategory);
    router.get('/getGuestCategory/:id', guestCategoryController.getGuestCategoryById);
    router.get('/getGuestCategories', guestCategoryController.getGuestCategories);
    module.exports = router;
})();
