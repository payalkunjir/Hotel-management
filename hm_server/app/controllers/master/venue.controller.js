
const mySqlConnection = require('../../../config/MySqlHelper');

const venueController = {

    addVenue: async function (req, res) {
        const data = req.body;
        try {
            const selectQuery = `SELECT COUNT(*) AS count FROM Venue WHERE VenueName='${data.VenueName}' OR VenueCode='${data.VenueCode}'`;
            mySqlConnection.query(selectQuery, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    if (result[0].count > 0) {
                        // A venue with the same name or code already exists
                        return res.json({
                            success: false,
                            message: 'Venue name or code already exists!'
                        })
                    } else {
                        // No matching venue found, insert the new record
                        const insertQuery = `Insert Into Venue (VenueName,VenueCode,IsDeleted,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) Values ('${data.VenueName}','${data.VenueCode}',false,now(),${(data.CreatedBy == '' || data.CreatedBy == undefined) ? null : `'${data.CreatedBy}'`},now(),${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`})`;
                        mySqlConnection.query(insertQuery, function (err, result) {
                            if (err) {
                                return res.json({
                                    success: false,
                                    message: err
                                })
                            } else {
                                return res.json({
                                    success: true,
                                    message: 'Venue added successfully!'
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
    

    updateVenue: function (req, res) {
        const data = req.body;
        const VenueId = req.params.id;
        try {
            const query = `
                SELECT COUNT(*) as count FROM Venue 
                WHERE (VenueName='${data.VenueName}' OR VenueCode='${data.VenueCode}')
                AND VenueId != ${VenueId}
            `;
            
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    const count = result[0].count;
                    if (count > 0) {
                        return res.json({
                            success: false,
                            message: 'Venue name or code already exists!'
                        });
                    } else {
                        const updateQuery = `
                            UPDATE Venue 
                            SET VenueName='${data.VenueName}', VenueCode='${data.VenueCode}',
                                ModifiedDate=now(), ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`}
                            WHERE VenueId= ${VenueId}
                        `;
                        mySqlConnection.query(updateQuery, function (err, result) {
                            if (err) {
                                return res.json({
                                    success: false,
                                    message: err
                                })
                            } else {
                                return res.json({
                                    success: true,
                                    message: "Venue updated successfully!"
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

    deleteVenue: function (req, res) {
        const data=req.body;
        const VenueId=req.params.id;
        try {
            const query = `Update Venue Set IsDeleted=${data.IsDeleted},ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where VenueId= ${VenueId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "Venue deleted successfully!"
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

    getVenueById: function (req, res) {
        const VenueId=req.params.id;
        try {
            const query = `Select * From Venue Where VenueId= ${VenueId}`;
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

    getVenues: function (req, res) {
        try {
            const query = `Select * From Venue  Order By VenueId Desc`;
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
module.exports = venueController;
