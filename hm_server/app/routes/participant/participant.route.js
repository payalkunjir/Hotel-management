!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const participantController = require('../../controllers/participant/participant.controller');
    const checkAuth = require('../../../check-auth.middleware');

    router.post('/addParticipant',  participantController.addParticipant);
    router.put('/updateParticipant/:id', participantController.updateParticipant);
    router.post('/deleteParticipant/:id', participantController.deleteParticipant);
    router.get('/getParticipant/:id', participantController.getParticipantById);
    router.get('/getParticipants', participantController.getParticipants);
    module.exports = router;

})();
