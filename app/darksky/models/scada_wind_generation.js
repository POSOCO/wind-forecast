var db = require('../db.js');
var vsprintf = require("sprintf-js").vsprintf;

var tableName = "scada_wind_generations";
var tableAttributes = ["id", "time", "location_tag", "generation_mw"];
var squel = require("squel");
var async = require("async");
//id is primary key
//("time", "location_tag") is unique

exports.create = function (wind_gen_objects, done, conn) {
    if (!(wind_gen_objects.constructor === Array)) {
        return done("Input is not an array...");
    }
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.insert()
        .into(tableName)
        .setFieldsRows(wind_gen_objects);
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

exports.getForLocation = function (locationTag, startDate, endDate, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.select()
        .from(tableName)
        .where("location_tag = " + locationTag)
        .where("time >= ?", startDate)
        .where("time <= ?", endDate);
    var query = sql.toParam().text;
    var vals = sql.toParam().values;
    tempConn.query(query, vals, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};