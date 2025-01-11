
const mySqlConnection = require('../../../config/MySqlHelper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const authController = {

    login: function (req, res) {
        const data = req.body;
        try {
            let query = `Select * From User Where LOWER(Username)=LOWER('${data.Username}') and IsDeleted=0`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    if (result.length == 0) {
                        res.json({
                            success: false,
                            message: 'Invalid EmailId or Password.'
                        });
                    }
                    else {
                        var user = result[0];
                        bcrypt.compare(data.Password, user.Password)
                            .then(result => { //In case password doesn't match. result will be boolean
                                if (!result) {
                                    res.json({
                                        success: false,
                                        message: 'Invalid EmailId or Password.'
                                    });
                                } else {
                                    const userData = {
                                        UserId: user.UserId,
                                        UserFirstName: user.UserFirstName,
                                        UserMiddleName: user.UserMiddleName,
                                        UserLastName: user.UserLastName,
                                        UserEmail: user.UserEmail,
                                        IsDeleted: user.IsDeleted,
                                    }
                                    const token = jwt.sign(userData, config.secret, {
                                        expiresIn: 2400 //expires in 24 hrs
                                    });
                                    return res.json({
                                        success: true,
                                        message: 'Login Success!',
                                        token: token
                                    })
                                }
                            })

                    }

                }
            })
        } catch (ex) {
            res.json({
                success: false,
                message: ex.message
            })
        }
    },

    addUser: async function (req, res) {
        const data = req.body;
        data.UserEmail = (data.UserEmail.toLowerCase());
        try {
            data.password = await bcrypt.hash(data.UserEmail, 10)
                .then(hash => { return hash });
            const query = `Insert Into User (UserFirstName,UserMiddleName,UserLastName,UserEmail,UserContactNo,Username,Password,ProfilePicture,IsDeleted,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) Values ('${data.UserFirstName}','${data.UserMiddleName}','${data.UserLastName}','${data.UserEmail}','${data.UserContactNo}','${data.UserEmail}','${data.password}','${data.ProfilePicture}',false,now(),${(data.CreatedBy == '' || data.CreatedBy == undefined) ? null : `'${data.CreatedBy}'`},now(),${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`})`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: 'User added successfully!'
                    })
                }
            })
        } catch (ex) {
            res.json({
                success: false,
                message: ex.message
            })
        }
    },

    updateUser: function (req, res) {
        const data = req.body;
        const userId = req.params.id;
        try {
            const query = `Update User Set UserFirstName='${data.UserFirstName}',UserMiddleName='${data.UserMiddleName}',UserLastName='${data.UserLastName}',UserContactNo='${data.UserContactNo}',ProfilePicture='${data.ProfilePicture}',ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where UserId= ${userId}`;

            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "User updated successfully!"
                    })
                }
            })
        } catch (ex) {
            res.json({
                success: false,
                message: ex.message
            })
        }
    },

    deleteUser: function (req, res) {
        const data=req.body;
        const userId=req.params.id;
        try {
            const query = `Update User Set IsDeleted=${data.IsDeleted},ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where UserId= ${userId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "User deleted successfully!"
                    })
                }
            })
        } catch (ex) {
            res.json({
                success: false,
                message: ex.message
            })
        }
    },

    getUserById: function (req, res) {
        const userId=req.params.id;
        try {
            const query = `Select * From User Where UserId= ${userId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        data:result[0]
                    })
                }
            })
        } catch (ex) {
            res.json({
                success: false,
                message: ex.message
            })
        }
    },

    getUsers: function (req, res) {
        try {
            const query = `Select * From User Order By UserId Desc`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        data:result
                    })
                }
            })
        } catch (ex) {
            res.json({
                success: false,
                message: ex.message
            })
        }
    },

    // login: function (req, res) {
    //     const payload = req.body;
    //     try {
    //         mySqlConnection.query('call login(?)', [payload.emailId, payload.password], function (err, result) {
    //             if (err) {
    //                 return res.json({
    //                     success: false,
    //                     message: err
    //                 })
    //             } else {
    //                 if (result[0][0].status == 0) {
    //                     res.json({
    //                         success: false,
    //                         message: 'Invalid emailId or password.'
    //                     });
    //                 }
    //                 else {
    //                     var user = result[1][0];
    //                     bcrypt.compare(payload.password, user.password)
    //                         .then(result => { //In case password doesn't match. result willl be boolean
    //                             if (!result) {
    //                                 res.json({
    //                                     success: false,
    //                                     message: 'Invalid emailId or password.'
    //                                 });
    //                             } else {
    //                                 const userData = {
    //                                     userId: user.userId,
    //                                     emailId: user.emailId,
    //                                     fisrtName: user.firstName,
    //                                     lastName: user.lastName,
    //                                     roleId: user.roleId,
    //                                     isActive: user.isActive,
    //                                 }
    //                                 const token = jwt.sign(userData, config.secret, {
    //                                     expiresIn: 2400 //expires in 24 hrs
    //                                 });
    //                                 return res.json({
    //                                     success: true,
    //                                     message: 'Login Success!',
    //                                     token: token,
    //                                     role: user.roleId,
    //                                 })
    //                             }
    //                         })

    //                 }

    //             }
    //         })
    //     } catch (ex) {
    //         res.json({
    //             success: false,
    //             message: ex.message
    //         })
    //     }
    // },
    // addUser: async function (req, res) {
    //     const payload = req.body;
    //     try {
    //         payload.password = await bcrypt.hash(payload.password, 10)
    //                                             .then(hash => { return hash });
    //         const query = `call addUser(?,?,?,?,?,?,?)`;
    //         mySqlConnection.query(query, 
    //             [payload.firstName, payload.lastName, payload.designation, payload.emailId, payload.password, req.userData ? req.userData.userId : null, payload.roleId], 
    //             function(err, result) {
    //                 if(err) {
    //                     return res.json({
    //                         success: false,
    //                         message: err
    //                     })
    //                 } else {
    //                     if(result[0][0].userExists == 1) {
    //                         return res.json({
    //                             success: false,
    //                             message: 'User already exists!',
    //                         })
    //                     } else {
    //                         const insertedUser = result[1][0]; // To get newly added user.
    //                         insertedUser.password = null;
    //                         return res.json({
    //                             success: true,
    //                             message: 'User added successfully!',
    //                             user: insertedUser
    //                         })
    //                     }
    //                 }
    //             })
    //     } catch(ex) {
    //        res.json({
    //         success: false,
    //         message: ex.message
    //        })
    //     }
    // },
    // updateUser: function (req, res) {
    //     const payload = req.body;
    //     try {
    //         const query = `call updateUser(?,?,?,?,?,?,?)`;
    //         mySqlConnection.query(query,
    //             [
    //                 req.params.id,
    //                 payload.firstName,
    //                 payload.lastName,
    //                 payload.designation,
    //                 payload.roleId,
    //                 req.userData.userId,
    //                 payload.isActive
    //             ], function(err, result) {
    //                 if(err) {
    //                     return res.json({
    //                         success: false,
    //                         message: err
    //                     })
    //                 } else {
    //                     let user = result[0][0]; // To get updated user details
    //                     user.password = undefined;
    //                    return res.json({
    //                         success: true,
    //                         message: "User updated successfully!",
    //                         user: user
    //                     })
    //                 }
    //             })
    //     } catch (ex) {
    //         res.json({
    //             success: false,
    //             message: ex.message
    //         })
    //     }
    // },
    // deleteUser: function (req, res) {
    //     try {
    //         const query = `call deleteUser(?,?)`;
    //         mySqlConnection.query(query,
    //             [ req.params.id, req.userData.userId ], function(err, result) {
    //                 if(err) {
    //                     return res.json({
    //                         success: false,
    //                         message: err
    //                     })
    //                 } else {
    //                    return res.json({
    //                         success: true,
    //                         message: "User deleted successfully!"
    //                     })
    //                 }
    //             })
    //     } catch (ex) {
    //         res.json({
    //             success: false,
    //             message: ex.message
    //         })
    //     }
    // }
}
module.exports = authController;
