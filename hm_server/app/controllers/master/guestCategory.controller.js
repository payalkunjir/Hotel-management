
const mySqlConnection = require('../../../config/MySqlHelper');

const guestCategoryController = {

    addGuestCategory: async function (req, res) {
        const data = req.body;
        try {
            const query = `SELECT * FROM GuestCategory WHERE GuestCategoryName='${data.GuestCategoryName}' OR GuestCategoryCode='${data.GuestCategoryCode}'`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else if (result && result.length > 0) {
                    return res.json({
                        success: false,
                        message: 'Guest category name or code already exists!'
                    })
                } else {
                    const insertQuery = `Insert Into GuestCategory (GuestCategoryName,GuestCategoryCode,IsDeleted,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) Values ('${data.GuestCategoryName}','${data.GuestCategoryCode}',false,now(),${(data.CreatedBy == '' || data.CreatedBy == undefined) ? null : `'${data.CreatedBy}'`},now(),${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`})`;
                    mySqlConnection.query(insertQuery, function (err, result) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            return res.json({
                                success: true,
                                message: 'Guest category added successfully!'
                            })
                        }
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

    updateGuestCategory: function (req, res) {
        const data = req.body;
        const guestCategoryId = req.params.id;
        try {
            const checkQuery = `SELECT COUNT(*) as count FROM GuestCategory WHERE (GuestCategoryName='${data.GuestCategoryName}' OR GuestCategoryCode='${data.GuestCategoryCode}') AND GuestCategoryId != ${guestCategoryId}`;
            mySqlConnection.query(checkQuery, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else if (result[0].count > 0) {
                    return res.json({
                        success: false,
                        message: "Guest category name or code already exists!"
                    });
                } else {
                    const query = `UPDATE GuestCategory SET GuestCategoryName='${data.GuestCategoryName}', GuestCategoryCode='${data.GuestCategoryCode}', ModifiedDate=NOW(), ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} WHERE GuestCategoryId=${guestCategoryId}`;
                    mySqlConnection.query(query, function (err, result) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            return res.json({
                                success: true,
                                message: "Guest category updated successfully!"
                            })
                        }
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
    

    deleteGuestCategory: function (req, res) {
        const data=req.body;
        const guestCategoryId=req.params.id;
        try {
            const query = `Update GuestCategory Set IsDeleted=${data.IsDeleted},ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where GuestCategoryId= ${guestCategoryId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "Guest category deleted successfully!"
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

    getGuestCategoryById: function (req, res) {
        const guestCategoryId=req.params.id;
        try {
            const query = `Select * From GuestCategory Where GuestCategoryId= ${guestCategoryId}`;
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

    getGuestCategories: function (req, res) {
        try {
            const query = `Select * From GuestCategory  Order By GuestCategoryId Desc`;
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
}
module.exports = guestCategoryController;
