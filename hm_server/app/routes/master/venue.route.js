!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const venueController = require('../../controllers/master/venue.controller');
    const checkAuth = require('../../../check-auth.middleware');

    router.post('/addVenue',  venueController.addVenue);
    router.put('/updateVenue/:id', venueController.updateVenue);
    router.post('/deleteVenue/:id', venueController.deleteVenue);
    router.get('/getVenue/:id', venueController.getVenueById);
    router.get('/getVenues', venueController.getVenues);
    module.exports = router;

})();