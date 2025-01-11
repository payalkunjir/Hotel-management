
const mySqlConnection = require('../../../config/MySqlHelper');

const designationController = {

    addDesignation: async function (req, res) {
        const data = req.body;
        try {
            const query = `SELECT * FROM Designation WHERE DesignationName='${data.DesignationName}' OR DesignationCode='${data.DesignationCode}'`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else if (result && result.length > 0) {
                    return res.json({
                        success: false,
                        message: 'Designation name or code already exists!'
                    })
                } else {
                    const insertQuery = `Insert Into Designation (DesignationName,DesignationCode,IsDeleted,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) Values ('${data.DesignationName}','${data.DesignationCode}',false,now(),${(data.CreatedBy == '' || data.CreatedBy == undefined) ? null : `'${data.CreatedBy}'`},now(),${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`})`;
                    mySqlConnection.query(insertQuery, function (err, result) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            return res.json({
                                success: true,
                                message: 'Designation added successfully!'
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

    updateDesignation: function (req, res) {
        const data = req.body;
        const designationId = req.params.id;
        try {
            const selectQuery = `SELECT DesignationId FROM Designation WHERE (DesignationName='${data.DesignationName}' OR DesignationCode='${data.DesignationCode}') AND DesignationId != ${designationId}`;
            mySqlConnection.query(selectQuery, function (err, rows) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else if (rows.length > 0) {
                    return res.json({
                        success: false,
                        message: "Designation name or code already exists!"
                    });
                } else {
                    const updateQuery = `UPDATE Designation SET DesignationName='${data.DesignationName}',DesignationCode='${data.DesignationCode}',ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} WHERE DesignationId=${designationId}`;
                    mySqlConnection.query(updateQuery, function (err, result) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            });
                        } else {
                            return res.json({
                                success: true,
                                message: "Designation updated successfully!"
                            });
                        }
                    });
                }
            });
        } catch (ex) {
            res.json({
                success: false,
                message: ex.message
            });
        }
    },    

    deleteDesignation: function (req, res) {
        const data=req.body;
        const designationId=req.params.id;
        try {
            const query = `Update Designation Set IsDeleted=${data.IsDeleted},ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where DesignationId= ${designationId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "Designation deleted successfully!"
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

    getDesignationById: function (req, res) {
        const designationId=req.params.id;
        try {
            const query = `Select * From Designation Where DesignationId= ${designationId}`;
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

    getDesignations: function (req, res) {
        try {
            const query = `Select * From Designation Order By DesignationId Desc`;
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
module.exports = designationController;
