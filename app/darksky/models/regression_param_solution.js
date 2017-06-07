var db = require('../db.js');
var vsprintf = require("sprintf-js").vsprintf;

var tableName = "wind_speed_power_regression_solutions";
var tableAttributes = ["id", "location_tag", "start_time", "end_time"];
var squel = require("squel");
var async = require("async");
//id is primary key
//("time", "location_tag") is unique

exports.getWithCreation = function (location_tag, start_time, end_time, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.insert()
        .into(tableName)
        .set(tableAttributes[1], location_tag)
        .set(tableAttributes[2], start_time)
        .set(tableAttributes[3], end_time);
    var query = sql.toParam().text;
    query += " ON DUPLICATE KEY UPDATE location_tag = location_tag;";
    var getSql = squel.select()
        .from(tableName)
        .where(
        squel.expr()
            .and(tableAttributes[1] + " = ?", location_tag)
            .and(tableAttributes[2] + " = ?", start_time)
            .and(tableAttributes[3] + " = ?", end_time)
    );
    query += getSql.toParam().text;
    var vals = sql.toParam().values.concat(getSql.toParam().values);
    //console.log(query + getSql.toParam().text);
    //console.log(sql.toParam().values.concat(getSql.toParam().values));
    tempConn.query(query, vals, function (err, rows) {
        if (err) return done(err);
        done(null, rows[1]);
    });
};

exports.getLatestForLocation = function (locationTag, lastDateTime, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.select()
        .from(tableName)
        .where("location_tag = ?", locationTag)
        .where("start_time = ?", squel.select().from(tableName).field("MAX(start_time)").where("location_tag = ?", locationTag).where("start_time <= ?", lastDateTime));
    var query = sql.toParam().text;
    var vals = sql.toParam().values;
    //console.log(query);
    //console.log(vals);
    tempConn.query(query, vals, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};