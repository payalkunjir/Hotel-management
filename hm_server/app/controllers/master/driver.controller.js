
const mySqlConnection = require('../../../config/MySqlHelper');

const driverController = {

    addDriver: async function (req, res) {
        const data = req.body;
        try {
            const query = `SELECT * FROM Driver WHERE DriverName='${data.DriverName}' OR DriverCode='${data.DriverCode}'`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else if (result && result.length > 0) {
                    return res.json({
                        success: false,
                        message: 'Driver name or code already exists!'
                    })
                } else {
                    const insertQuery = `Insert Into Driver (DriverName,DriverCode,DriverNumber,IsDeleted,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) Values ('${data.DriverName}','${data.DriverCode}','${data.DriverNumber}',false,now(),${(data.CreatedBy == '' || data.CreatedBy == undefined) ? null : `'${data.CreatedBy}'`},now(),${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`})`;
                    mySqlConnection.query(insertQuery, function (err, result) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            return res.json({
                                success: true,
                                message: 'Driver added successfully!'
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

    updateDriver: function (req, res) {
        const data = req.body;
        const driverId = req.params.id;
        try {
            const checkQuery = `SELECT * FROM Driver WHERE (DriverName = '${data.DriverName}' OR DriverCode = '${data.DriverCode}') AND DriverId != ${driverId}`;
            mySqlConnection.query(checkQuery, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else if (result.length > 0) {
                    return res.json({
                        success: false,
                        message: "Driver name or code already exists!"
                    })
                } else {
                    const query = `Update Driver Set DriverName='${data.DriverName}',DriverCode='${data.DriverCode}',DriverNumber='${data.DriverNumber}',ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where DriverId= ${driverId}`;
                    mySqlConnection.query(query, function (err, result) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            return res.json({
                                success: true,
                                message: "Driver updated successfully!"
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
    

    deleteDriver: function (req, res) {
        const data=req.body;
        const driverId=req.params.id;
        try {
            const query = `Update Driver Set IsDeleted=${data.IsDeleted},ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where DriverId= ${driverId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "Driver deleted successfully!"
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

    getDriverById: function (req, res) {
        const driverId=req.params.id;
        try {
            const query = `Select * From Driver Where DriverId= ${driverId}`;
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

    getDrivers: function (req, res) {
        try {
            const query = `Select * From Driver  Order By DriverId Desc`;
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
module.exports = driverController;
