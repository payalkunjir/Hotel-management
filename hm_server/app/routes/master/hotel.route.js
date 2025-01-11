!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const hotelController = require('../../controllers/master/hotel.controller');
    const checkAuth = require('../../../check-auth.middleware');
    var multer = require('multer');
    var path = require('path');
    var fileName ='';

    router.post('/addHotel',  hotelController.addHotel);
    router.put('/updateHotel/:id', hotelController.updateHotel);
    router.post('/deleteHotel/:id', hotelController.deleteHotel);
    router.get('/getHotel/:id', hotelController.getHotelById);
    router.get('/getHotels', hotelController.getHotels);
    router.post('/getHotelsByArea', hotelController.getHotelsByArea);






    var storage_hotel = multer.diskStorage({
        destination: (req, file, cb) => {
            // cb(null, 'F:\\seal\\');
            cb(null, 'uploads/hotel/');
        },
        filename: (req, file, cb) => {
            var ext = path.extname(file.originalname);
            fileName = (file.originalname).split(".")[0]+"_"+Date.now()+""+ext;
            cb(null, fileName);
        }
    });
    
    var upload_hotel = multer({
        storage: storage_hotel,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            callback(null, true)
        }
    });
    
    router.post('/uploadHotel/', upload_hotel.single('hotel'),
        function (req, res) {
            if (!req.file) {
                return res.json({
                    success: false,
                    message: "No file received"
                });
            } else {
                return res.json({
                    success: true,
                    message: "File uploaded successfully",
                    filename: fileName,
                    uploadpath: 'uploads/hotel/' + fileName
                    // filename: req.file.filename,
                    // uploadpath: 'uploads/hotel/' + req.file.filename
                })
            }
        });
        
    module.exports = router;
})();
