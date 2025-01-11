
const mySqlConnection = require('../../../config/MySqlHelper');

const participantController = {

    addParticipant: async function (req, res) {
        const data = req.body;
        try {
            const checkQuery = `SELECT COUNT(*) AS count FROM ParticipantDetails WHERE ContactNo = '${data.ContactNo}'`;
            mySqlConnection.query(checkQuery, function (checkErr, checkResult) {
                if (checkErr) {
                    return res.json({
                        success: false,
                        message: checkErr
                    });
                } else {
                    if (checkResult[0].count > 0) {
                        return res.json({
                            success: false,
                            message: 'Participant with this ContactNo already exists!'
                        });
                    } else {
                        const insertQuery = `INSERT INTO ParticipantDetails (ParticipantFirstName,ParticipantMiddleName,ParticipantLastName,IdentityNo,DesignationId,ContactNo,State,GuestCategoryId,ExpectedArrivalTime,ExpectedDepartureTime,CheckinTime,CheckinDate,CheckoutTime,CheckoutDate,AreaId,HotelId,AllotedRoomNo,OccupanyType,LOFirstName,LOMiddleName,LOLastName,IdentityNoOfLO,ContactNoOfLO,VehicleId,AllotedVehicle,DriverId,VenueId,IsDeleted,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) VALUES ('${data.ParticipantFirstName}','${data.ParticipantMiddleName}','${data.ParticipantLastName}','${data.IdentityNo}','${data.DesignationId}','${data.ContactNo}','${data.State}','${data.GuestCategoryId}','${data.ExpectedArrivalTime}','${data.ExpectedDepartureTime}','${data.CheckinTime}','${data.CheckinDate}','${data.CheckoutTime}','${data.CheckoutDate}','${data.AreaId}','${data.HotelId}','${data.AllotedRoomNo}','${data.OccupanyType}','${data.LOFirstName}','${data.LOMiddleName}','${data.LOLastName}','${data.IdentityNoOfLO}','${data.ContactNoOfLO}','${data.VehicleId}','${data.AllotedVehicle}','${data.DriverId}','${data.VenueId}',false,now(),${(data.CreatedBy == '' || data.CreatedBy == undefined) ? null : `'${data.CreatedBy}'`},now(),${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`})`;
                        mySqlConnection.query(insertQuery, function (insertErr, insertResult) {
                            if (insertErr) {
                                return res.json({
                                    success: false,
                                    message: insertErr
                                });
                            } else {
                                return res.json({
                                    success: true,
                                    message: 'Participant added successfully!'
                                });
                            }
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

    updateParticipant: function (req, res) {
        const data = req.body;
        const participantDetailsId = req.params.id;
        try {
            // Check if ContactNo already exists
            const checkContactNoQuery = `SELECT COUNT(*) AS count FROM ParticipantDetails WHERE ContactNo='${data.ContactNo}' AND ParticipantDetailsId <> ${participantDetailsId}`;
            mySqlConnection.query(checkContactNoQuery, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    if (result[0].count > 0) {
                        return res.json({
                            success: false,
                            message: "ContactNo already exists for another participant!"
                        })
                    } else {
                        const updateQuery = `UPDATE ParticipantDetails SET ParticipantFirstName='${data.ParticipantFirstName}', ParticipantMiddleName='${data.ParticipantMiddleName}', ParticipantLastName='${data.ParticipantLastName}', IdentityNo='${data.IdentityNo}', DesignationId='${data.DesignationId}', ContactNo='${data.ContactNo}', State='${data.State}', GuestCategoryId='${data.GuestCategoryId}', ExpectedArrivalTime='${data.ExpectedArrivalTime}', ExpectedDepartureTime='${data.ExpectedDepartureTime}', CheckinTime='${data.CheckinTime}', CheckinDate='${data.CheckinDate}', CheckoutTime='${data.CheckoutTime}', CheckoutDate='${data.CheckoutDate}', AreaId='${data.AreaId}',HotelId='${data.HotelId}', AllotedRoomNo='${data.AllotedRoomNo}', OccupanyType='${data.OccupanyType}', LOFirstName='${data.LOFirstName}', LOMiddleName='${data.LOMiddleName}', LOLastName='${data.LOLastName}', IdentityNoOfLO='${data.IdentityNoOfLO}', ContactNoOfLO='${data.ContactNoOfLO}', VehicleId='${data.VehicleId}', AllotedVehicle='${data.AllotedVehicle}', DriverId='${data.DriverId}', VenueId='${data.VenueId}', ModifiedDate=now(), ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} WHERE ParticipantDetailsId=${participantDetailsId}`;
                        mySqlConnection.query(updateQuery, function (err, result) {
                            if (err) {
                                return res.json({
                                    success: false,
                                    message: err
                                })
                            } else {
                                return res.json({
                                    success: true,
                                    message: "Participant updated successfully!"
                                })
                            }
                        });
                    }
                }
            });
        } catch (ex) {
            res.json({
                success: false,
                message: ex.message
            })
        }
    },

    deleteParticipant: function (req, res) {
        const data=req.body;
        const participantDetailsIdId=req.params.id;
        try {
            const query = `Update ParticipantDetails Set IsDeleted=${data.IsDeleted},ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where ParticipantDetailsId= ${participantDetailsIdId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "Participant deleted successfully!"
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

    getParticipantById: function (req, res) {
        const participantDetailsIdId=req.params.id;
        try {
            // const query = `Select * From ParticipantDetails Where ParticipantDetailsId= ${participantDetailsIdId}`;
            const query = `Select pd.ParticipantDetailsId, pd.ParticipantFirstName,pd.ParticipantMiddleName,pd.ParticipantLastName,pd.IdentityNo,
            pd.DesignationId,d.DesignationName,pd.ContactNo,pd.State,
            pd.GuestCategoryId,gc.GuestCategoryName,pd.ExpectedArrivalTime,
            pd.ExpectedDepartureTime,pd.CheckinTime,pd.CheckinDate,pd.CheckoutTime,
            pd.CheckoutDate,pd.AreaId,a.AreaName,pd.HotelId,h.HotelName,pd.AllotedRoomNo,
            pd.OccupanyType,pd.LOFirstName,pd.LOMiddleName,pd.LOLastName,pd.IdentityNoOfLO,pd.ContactNoOfLO,
             pd.VehicleId,v.NameOfVehicle,pd.AllotedVehicle,pd.DriverId,dr.DriverName,
             pd.VenueId,vn.VenueName,pd.IsDeleted,pd.CreatedDate,pd.CreatedBy,
             pd.ModifiedDate,pd.ModifiedBy
             From ParticipantDetails pd left join Designation d on pd.DesignationId=d.DesignationId 
             left join GuestCategory gc on pd.GuestCategoryId=gc.GuestCategoryId
             left join Area a on pd.AreaId=a.AreaId
             left join Hotel h on pd.HotelId=h.HotelId left join Vehicle v on pd.VehicleId=v.VehicleId 
             left join Driver dr on pd.DriverId=dr.DriverId left join Venue vn on  pd.VenueId=vn.VenueId
             Where pd.ParticipantDetailsId = ${participantDetailsIdId} Order By pd.ParticipantDetailsId Desc
            `;
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

    getParticipants: function (req, res) {
        try {
            // const query = `Select * From ParticipantDetails  Order By ParticipantDetailsId Desc`;
            const query = `Select pd.ParticipantDetailsId, pd.ParticipantFirstName,pd.ParticipantMiddleName,
            pd.ParticipantLastName,pd.IdentityNo,pd.DesignationId,d.DesignationName,pd.ContactNo,pd.State,
            pd.GuestCategoryId,gc.GuestCategoryName,pd.ExpectedArrivalTime,pd.ExpectedDepartureTime,
            pd.CheckinTime,pd.CheckinDate,pd.CheckoutTime,pd.CheckoutDate,pd.AreaId,a.AreaName,pd.HotelId,h.HotelName,
            pd.AllotedRoomNo,pd.OccupanyType,pd.LOFirstName,pd.LOMiddleName,pd.LOLastName,pd.IdentityNoOfLO,
            pd.ContactNoOfLO, pd.VehicleId,v.NameOfVehicle,pd.AllotedVehicle,pd.DriverId,dr.DriverName,
            pd.VenueId,vn.VenueName,pd.IsDeleted,pd.CreatedDate,pd.CreatedBy,pd.ModifiedDate,
            pd.ModifiedBy  From ParticipantDetails pd 
            left join Designation d on pd.DesignationId=d.DesignationId
            left join GuestCategory gc on pd.GuestCategoryId=gc.GuestCategoryId
            left join Hotel h on pd.HotelId=h.HotelId 
           left join Area a on pd.AreaId=a.AreaId
            left join Vehicle v on pd.VehicleId=v.VehicleId
            left join Driver dr on pd.DriverId=dr.DriverId
            left join Venue vn on  pd.VenueId=vn.VenueId Order By pd.ParticipantDetailsId Desc
           `;
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
module.exports = participantController;
