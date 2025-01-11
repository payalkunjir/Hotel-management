
const mySqlConnection = require('../../../config/MySqlHelper');

const hotelController = {

    addHotel: async function (req, res) {
        const data = req.body;
        try {
          const checkQuery = `SELECT * FROM Hotel WHERE HotelName='${data.HotelName}' AND IsDeleted=false`;
          mySqlConnection.query(checkQuery, function (err, result) {
            if (err) {
              return res.json({
                success: false,
                message: err
              });
            } else {
              if (result.length > 0) {
                return res.json({
                  success: false,
                  message: 'Hotel name already exists!'
                });
              } else {
                const query = `Insert Into Hotel (HotelName,HotelCategory,HotelAddress,RoomCategory,TotalRoom,HotelDistanceFromVenue,HotelContactNo,AreaId,HotelImage,IsDeleted,CreatedDate,CreatedBy,ModifiedDate,ModifiedBy) Values ('${data.HotelName}','${data.HotelCategory}','${data.HotelAddress}','${data.RoomCategory}','${data.TotalRoom}','${data.HotelDistanceFromVenue}','${data.HotelContactNo}','${data.AreaId}','${data.HotelImage}',false,now(),${(data.CreatedBy == '' || data.CreatedBy == undefined) ? null : `'${data.CreatedBy}'`},now(),${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`})`;
                mySqlConnection.query(query, function (err, result) {
                  if (err) {
                    return res.json({
                      success: false,
                      message: err
                    });
                  } else {
                    return res.json({
                      success: true,
                      message: 'Hotel added successfully!'
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
      
      updateHotel: function (req, res) {
        const data = req.body;
        const hotelId = req.params.id;
        try {
            const checkQuery = `SELECT COUNT(*) as count FROM Hotel WHERE HotelName='${data.HotelName}' AND HotelId != ${hotelId}`;
            mySqlConnection.query(checkQuery, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else if (result[0].count > 0) {
                    return res.json({
                        success: false,
                        message: "Hotel name already exists!"
                    });
                } else {
                    const query = `UPDATE Hotel SET HotelName='${data.HotelName}', HotelCategory='${data.HotelCategory}', HotelAddress='${data.HotelAddress}', RoomCategory='${data.RoomCategory}', TotalRoom='${data.TotalRoom}', HotelDistanceFromVenue='${data.HotelDistanceFromVenue}', HotelContactNo='${data.HotelContactNo}', AreaId='${data.AreaId}',HotelImage='${data.HotelImage}', ModifiedDate=NOW(), ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} WHERE HotelId=${hotelId}`;
                    mySqlConnection.query(query, function (err, result) {
                        if (err) {
                            return res.json({
                                success: false,
                                message: err
                            })
                        } else {
                            return res.json({
                                success: true,
                                message: "Hotel updated successfully!"
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

    deleteHotel: function (req, res) {
        const data=req.body;
        const hotelId=req.params.id;
        try {
            const query = `Update Hotel Set IsDeleted=${data.IsDeleted},ModifiedDate=now(),ModifiedBy=${(data.ModifiedBy == '' || data.ModifiedBy == undefined) ? null : `'${data.ModifiedBy}'`} where HotelId= ${hotelId}`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        message: "Hotel deleted successfully!"
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

    getHotelById: function (req, res) {
        const hotelId=req.params.id;
        try {
            // const query = `Select * From Hotel Where HotelId= ${hotelId}`;
            const query = `Select h.HotelId, H.HotelName, h.HotelCategory, h.HotelAddress, h.RoomCategory, h.TotalRoom, h.HotelDistanceFromVenue, h.HotelContactNo, h.AreaId, a.AreaName,h.HotelImage, h.IsDeleted, h.CreatedDate, h.CreatedBy, h.ModifiedDate, h.ModifiedBy From Hotel h left join Area a on  h.AreaId = a.AreaId  Where h.HotelId= ${hotelId} And h.IsDeleted=false Order By h.HotelId Desc`;
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

    getHotels: function (req, res) {
        try {
            // const query = `Select * From Hotel  Order By HotelId Desc`;
            const query = `Select h.HotelId, H.HotelName, h.HotelCategory, h.HotelAddress, h.RoomCategory, h.TotalRoom, h.HotelDistanceFromVenue, h.HotelContactNo, h.AreaId, a.AreaName,h.HotelImage, h.IsDeleted, h.CreatedDate, h.CreatedBy, h.ModifiedDate, h.ModifiedBy From Hotel h left join Area a on  h.AreaId = a.AreaId Order By h.HotelId Desc`;
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
    getHotelsByArea: function (req, res) {
        const data=req.body;
        try {
            // const query = `Select * From Hotel  Order By HotelId Desc`;
            const query = `Select h.HotelId, H.HotelName, h.HotelCategory, h.HotelAddress, h.RoomCategory, h.TotalRoom, h.HotelDistanceFromVenue, h.HotelContactNo, h.AreaId, a.AreaName,h.HotelImage, h.IsDeleted, h.CreatedDate, h.CreatedBy, h.ModifiedDate, h.ModifiedBy From Hotel h left join Area a on  h.AreaId = a.AreaId where h.AreaId=${data.AreaId} Order By h.HotelId Desc`;
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
module.exports = hotelController;
