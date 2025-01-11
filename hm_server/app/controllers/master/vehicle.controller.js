
const mySqlConnection = require('../../../config/MySqlHelper');

const vehicleController = {

    addVehicle: async function (req, res) {
        const data = req.body;
        try {
            const selectQuery = `SELECT * FROM Vehicle WHERE VehicleNo = '${data.VehicleNo}'`;
            mySqlConnection.query(selectQuery, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else if (result.length > 0) {
                    return res.json({
                        success: false,
                        message: 'Vehicle number already exists!'
                    })
                } else {
                    const insertQuery = `INSERT INTO Vehicle (NameOfVehicle, TypeOfVehicle, VehicleNo, IsDeleted, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy) VALUES ('${data.NameOfVehicle}', '${data.TypeOfVehicle}', '${data.VehicleNo}', false, now(), ${(data.CreatedBy == '' || data.CreatedBy == undefined) ? null : `'${data.CreatedBy}'`}, now(), ${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`})`;
                    mySqlConnection.query(insertQuery, function (err, result) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            return res.json({
                                success: true,
                                message: 'Vehicle added successfully!'
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
    

    updateVehicle: function (req, res) {
        const data = req.body;
        const vehicleId = req.params.id;
        try {
            const checkQuery = `SELECT COUNT(*) as count FROM Vehicle WHERE VehicleNo='${data.VehicleNo}' AND VehicleId != ${vehicleId}`;
            mySqlConnection.query(checkQuery, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else if (result[0].count > 0) {
                    return res.json({
                        success: false,
                        message: "Vehicle number already exists"
                    });
                } else {
                    const query = `UPDATE Vehicle SET NameOfVehicle='${data.NameOfVehicle}', TypeOfVehicle='${data.TypeOfVehicle}', VehicleNo='${data.VehicleNo}', ModifiedDate=NOW(), ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} WHERE VehicleId=${vehicleId}`;
                    mySqlConnection.query(query, function (err, result) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            return res.json({
                                success: true,
                                message: "Vehicle updated successfully!"
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
    
    deleteVehicle: function (req, res) {
        const data=req.body;
        const vehicleId=req.params.id;
        try {
            const query = `Update Vehicle Set IsDeleted=${data.IsDeleted},ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where VehicleId= ${vehicleId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "Vehicle deleted successfully!"
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

    getVehicleById: function (req, res) {
        const vehicleId=req.params.id;
        try {
            const query = `Select * From Vehicle Where VehicleId= ${vehicleId}`;
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

    getVehicles: function (req, res) {
        try {
            const query = `Select * From Vehicle  Order By VehicleId Desc`;
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
module.exports = vehicleController;
