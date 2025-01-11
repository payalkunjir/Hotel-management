!(function () {
    'use strict';
    const express = require('express');
    const router = express.Router();
    const authController = require('../../controllers/auth/auth.controller');
    const checkAuth = require('../../../check-auth.middleware');
    var multer = require('multer');
    var path = require('path');
    var fileName ='';

    router.post('/login', authController.login);
    router.post('/sampleuser', authController.addUser);

    router.post('/user',  authController.addUser);
    router.put('/user/:id', authController.updateUser);
    router.post('/user/:id', authController.deleteUser);
    router.get('/user/:id', authController.getUserById);
    router.get('/user', authController.getUsers);
    // router.post('/user', checkAuth, authController.addUser);
    // router.put('/user/:id', checkAuth, authController.updateUser);
    // router.delete('/user/:id', checkAuth, authController.deleteUser);

    var storage_user = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/user/');
        },
        filename: (req, file, cb) => {
            var ext = path.extname(file.originalname);
            fileName = (file.originalname).split(".")[0]+"_"+Date.now()+""+ext;
            cb(null, fileName);
        }
    });
    
    var upload_user = multer({
        storage: storage_user,
        fileFilter: function (req, file, callback) {
            callback(null, true)
        }
    });

    router.post('/uploadUser/', upload_user.single('user'),
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
                    uploadpath: 'uploads/user/' + fileName
                })
            }
        });


    module.exports = router;
})();