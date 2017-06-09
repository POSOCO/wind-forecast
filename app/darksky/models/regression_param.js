var db = require('../db.js');
var vsprintf = require("sprintf-js").vsprintf;

var tableName = "wind_speed_power_regression_params";
var tableAttributes = ["id", "solution_id", "param_degree", "param_value"];
var squel = require("squel");
var async = require("async");
//id is primary key
//("solution_id", "param_degree") is unique

exports.create = function (param_rows, done, conn) {
    if (!(param_rows.constructor === Array)) {
        return done("Input is not an array...");
    }
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    for (var i = 0; i < param_rows.length; i++) {
        param_rows[i]['param_value'] *= 10000;
    }
    var sql = squel.insert()
        .into(tableName)
        .setFieldsRows(param_rows);
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

exports.getForSolutionId = function (solution_id, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.select()
        .from(tableName)
        .where("solution_id = ?", solution_id);
    var query = sql.toParam().text;
    var vals = sql.toParam().values;
    tempConn.query(query, vals, function (err, rows) {
        if (err) return done(err);
        for (var i = 0; i < rows.length; i++) {
            rows[i]['param_value'] *= 0.0001;
        }
        done(null, rows);
    });
};