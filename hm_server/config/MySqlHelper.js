const mysql = require('mysql');

//local
// var mySqlConnection = mysql.createConnection({ 
//     host: 'localhost',
//     user: 'root',
//     password: 'redhat',
//     database: 'Hotel_Management',
//     multipleStatements: true
// })

//local
var mySqlConnection = mysql.createConnection({ 
    host: 'localhost',
    user: 'root',
    password: 'root@123',
    database: 'Hotel_Management',
    multipleStatements: true
})

mySqlConnection.connect((err)=>{
    if(!err){
        console.log("connected");
    }
    else {
        console.log("Connection failed", err);
    }
});
module.exports = mySqlConnection;