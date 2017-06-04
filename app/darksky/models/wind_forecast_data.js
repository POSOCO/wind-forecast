var db = require('../db.js');
var vsprintf = require("sprintf-js").vsprintf;

var tableName = "dark_sky_wind_speeds_forecast";
var tableAttributes = ["id", "time", "location_tag", "wind_speed"];
var squel = require("squel");
var async = require("async");
//id is primary key
//("time", "location_tag") is unique

exports.create = function (speeds_rows, done, conn) {
    if (!(speeds_rows.constructor === Array)) {
        return done("Input is not an array...");
    }
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.insert()
        .into(tableName)
        .setFieldsRows(speeds_rows);
    var query = sql.toParam().text;
    query += vsprintf(" ON DUPLICATE KEY UPDATE %s = VALUES(%s);", [tableAttributes[3], tableAttributes[3]]);
    var vals = sql.toParam().values;
    //console.log(query);
    //console.log(sql.toParam().values);
    tempConn.query(query, vals, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};