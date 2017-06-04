var mysql = require('mysql')
    , async = require('async');

var PRODUCTION_DB = 'wrldc_wind_info'
    , TEST_DB = 'wrldc_wind_info_test';

exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

var state = {
    pool: null,
    mode: null
};

exports.connect = function (mode, done, connInfo) {
    var connDetails = {
        host: 'localhost',
        user: 'root',
        password: '123'
    };
    if (connInfo) {
        if (typeof connInfo.host != 'undefined' && connInfo.host != null) {
            connDetails.host = connInfo.host;
        }
        if (typeof connInfo.user != 'undefined' && connInfo.user != null) {
            connDetails.user = connInfo.user;
        }
        if (typeof connInfo.password != 'undefined' && connInfo.password != null) {
            connDetails.password = connInfo.password;
        }
    }
    state.pool = mysql.createPool({
        host: connDetails.host,
        user: connDetails.user,
        password: connDetails.password,
        database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB,
        multipleStatements: true
    });

    state.mode = mode;
    done();
};

exports.getPoolConnection = function (done) {
    if (state.pool == null) {
        return done(new Error("Connection pool was null"));
    }
    state.pool.getConnection(function (err, connection) {
        return done(err, connection);
    });
};

exports.get = function () {
    return state.pool;
};

exports.disconnect = function (done) {
    if (state.pool == null) {
        return done(null);
    }
    state.pool.end(function (err) {
        if (err) {
            console.log("Unable to disconnect to pool...");
            console.log(err);
            return done(err);
        }
        console.log("disconnected the database connection pool...");
        return done(null);
    });
};

exports.fixtures = function (data) {
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));

    var names = Object.keys(data.tables);
    async.each(names, function (name, cb) {
        async.each(data.tables[name], function (row, cb) {
            var keys = Object.keys(row)
                , values = keys.map(function (key) {
                    return "'" + row[key] + "'"
                });

            pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb);
        }, cb);
    }, done);
};

exports.drop = function (tables, done) {
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));

    async.each(tables, function (name, cb) {
        pool.query('DELETE * FROM ' + name, cb);
    }, done);
};