
const mySqlConnection = require('../../../config/MySqlHelper');

const areaController = {

    addArea: async function (req, res) {
        const data = req.body;
        try {
            const query = `INSERT INTO Area (AreaName, AreaCode, IsDeleted, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy) 
                SELECT '${data.AreaName}', '${data.AreaCode}', false, NOW(), ${(data.CreatedBy == '' || data.CreatedBy == undefined) ? null : `'${data.CreatedBy}'`}, NOW(), ${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`}
                WHERE NOT EXISTS (
                    SELECT AreaName, AreaCode FROM Area WHERE AreaName = '${data.AreaName}' OR AreaCode = '${data.AreaCode}'
                )`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    if (result.affectedRows === 0) {
                        return res.json({
                            success: false,
                            message: 'Area name or code already exists!'
                        });
                    } else {
                        return res.json({
                            success: true,
                            message: 'Area added successfully!'
                        });
                    }
                }
            });
        } catch (ex) {
            res.json({
                success: false,
                message: ex.message
            });
        }
    },
    
    

    updateArea: function (req, res) {
        const data = req.body;
        const areaId = req.params.id;
        try {
            // Check if the AreaName or AreaCode already exist
            const countQuery = `SELECT COUNT(*) AS count FROM Area WHERE AreaId != ${areaId} AND (AreaName = '${data.AreaName}' OR AreaCode = '${data.AreaCode}')`;
            mySqlConnection.query(countQuery, function (countErr, countResult) {
                if (countErr) {
                    return res.json({
                        success: false,
                        message: countErr
                    })
                } else {
                    const count = countResult[0].count;
                    if (count > 0) {
                        // AreaName or AreaCode already exists, return error
                        return res.json({
                            success: false,
                            message: 'Area name or code already exists'
                        })
                    } else {
                        // AreaName and AreaCode are unique, update the record
                        const updateQuery = `UPDATE Area SET AreaName='${data.AreaName}', AreaCode='${data.AreaCode}', ModifiedDate=now(), ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} WHERE AreaId=${areaId}`;
                        mySqlConnection.query(updateQuery, function (updateErr, updateResult) {
                            if (updateErr) {
                                return res.json({
                                    success: false,
                                    message: updateErr
                                })
                            } else {
                                return res.json({
                                    success: true,
                                    message: 'Area updated successfully!'
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

    deleteArea: function (req, res) {
        const data=req.body;
        const areaId=req.params.id;
        try {
            const query = `Update Area Set IsDeleted=${data.IsDeleted},ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where AreaId= ${areaId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "Area deleted successfully!"
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

    getAreaById: function (req, res) {
        const areaId=req.params.id;
        try {
            const query = `Select * From Area Where AreaId= ${areaId}`;
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

    getAreas: function (req, res) {
        try {
            const query = `Select * From Area Order By AreaId Desc`;
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
module.exports = areaController;
