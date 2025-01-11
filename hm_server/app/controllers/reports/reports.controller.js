
const mySqlConnection = require('../../../config/MySqlHelper');

const reportsController = {

    detailedAllocationReport: function (req, res) {
        try {
            const filterOptions = req.body;
            const query = `SELECT pd.ParticipantFirstName,pd.ParticipantMiddleName, pd.ParticipantLastName,pd.IdentityNo,pd.ContactNo,pd.State,pd.ExpectedArrivalTime,pd.ExpectedDepartureTime,pd.CheckinTime,pd.CheckinDate,pd.CheckoutDate,pd.AllotedRoomNo,pd.OccupanyType, v.venuename,h.AreaId, a.AreaName, h.hotelname
            FROM participantdetails pd
            LEFT JOIN venue v ON v.VenueId = pd.VenueId
            LEFT JOIN hotel h ON h.HotelId = pd.HotelId 
            LEFT JOIN area a on a.AreaId=h.AreaId
            WHERE DATE(pd.CheckinDate) >= '${filterOptions.CheckinDate}' 
            AND DATE(pd.CheckoutDate) <= '${filterOptions.CheckoutDate}' 
            AND a.AreaId IN (${filterOptions.areaid.join(',')}) 
            AND h.HotelId IN (${filterOptions.hotelid.join(',')})`;            
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        data: result.length> 0? result:[]
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

    detailedOccupancyReport: function (req, res) {
        try {
            const filterOptions = req.body;
            const occupancyType = filterOptions.OccupanyType.map(name => `'${name}'`).join(',');
            const query = `SELECT pd.ParticipantFirstName,pd.ParticipantMiddleName, pd.ParticipantLastName,pd.IdentityNo,pd.ContactNo,pd.State,pd.ExpectedArrivalTime,pd.ExpectedDepartureTime,pd.CheckinTime,pd.CheckinDate,pd.CheckoutDate,pd.AllotedRoomNo,pd.OccupanyType, v.VenueName, a.AreaName, h.HotelName
            FROM participantdetails pd
            LEFT JOIN area a ON a.AreaId = pd.HotelId
            LEFT JOIN venue v ON v.VenueId = pd.VenueId
            LEFT JOIN hotel h ON h.HotelId = pd.HotelId 
            WHERE DATE(pd.CheckinDate) >= '${filterOptions.CheckinDate}' AND DATE(pd.CheckoutDate) <= '${filterOptions.CheckoutDate}' AND pd.OccupanyType IN (${occupancyType})`;
            mySqlConnection.query(query, function (err, result) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    })
                } else {
                    return res.json({
                        success: true,
                        data: result.length> 0? result:[]
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
module.exports = reportsController;
