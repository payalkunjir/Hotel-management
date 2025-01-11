// Server setup
const express = require('express');
const morgan = require('morgan'); 
var path = require('path');
const app = express();

//logger
app.use(morgan('dev'));  //logger
app.enable('trust-proxy');
const bodyParser = require('body-parser');

const http = require('http').createServer(app);
const port = process.env.PORT || 2208;
const query = require('./config/MySqlHelper'); // database configuration


//Import routes
const authRoutes = require('./app/routes/auth/auth.route');
const areaRoutes = require('./app/routes/master/area.route');
const designationRoutes = require('./app/routes/master/designation.route');
const vehicleRoutes = require('./app/routes/master/vehicle.route');
const venueRoutes = require('./app/routes/master/venue.route');
const guestCategoryRoutes = require('./app/routes/master/guestCategory.route');
const driverRoutes = require('./app/routes/master/driver.route');
const hotelRoutes = require('./app/routes/master/hotel.route');
const participantRoutes = require('./app/routes/participant/participant.route');
const reportRoutes= require('./app/routes/reports/reports.route');

const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //Not to use exttende features of body parser. Only for default body parser. (Optional)

// Enable cors 
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/", express.static(path.join(__dirname, "angular")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Import routes
app.use("/api/auth", authRoutes);
app.use("/api/area", areaRoutes);
app.use("/api/designation", designationRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/venue", venueRoutes);
app.use("/api/guestCategory", guestCategoryRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/participant", participantRoutes);
app.use("/api/reports",reportRoutes);


//Listen server on specified port number
http.listen(port, function() {
    console.log("listening for requests on port " + port);
})


