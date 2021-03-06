/* Started on 03.06.2017 Saturday by Nagasudhir */
var windSpeedsArray_g = [];
var Forecast_Data = require("./models/wind_forecast_data");
var Time_Data = require("./models/wind_time_data");
var Scada_Wind_Generation = require("./models/scada_wind_generation");
var Regression_Solution = require("./models/regression_param_solution");
var Regression_Param = require("./models/regression_param");
var async = require("async");
var vsprintf = require("sprintf-js").vsprintf;

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {

    } else if (document.readyState == "complete") {
        var todayDate = new Date();
        var dateElem = document.getElementById("date_input");
        if (dateElem) {
            dateElem.value = convertDateObjToDateStr(todayDate);
        }
        loadPresets();
        connectToDB();
    }
};

function fetchDarkSkyForecastData(key, lat, lng, done) {
    // https://api.darksky.net/forecast/[key]/[latitude],[longitude]
    var darkSkyBaseUrl = "https://api.darksky.net/forecast/";
    var fetchUrl = darkSkyBaseUrl + key + "/" + lat + "," + lng;
    $.ajax({
            //create code through post request
            url: fetchUrl,
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data);
                done(null, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                done(jqXHR);
            }
        }
    );
}

function fetchDarkSkyTimeMachineData(key, lat, lng, unixTimestamp, done) {
    // https://api.darksky.net/forecast/[key]/[latitude],[longitude],[time]
    var darkSkyBaseUrl = "https://api.darksky.net/forecast/";
    var fetchUrl = darkSkyBaseUrl + key + "/" + lat + "," + lng + "," + unixTimestamp;
    $.ajax({
            //create code through post request
            url: fetchUrl,
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data);
                done(null, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                done(jqXHR);
            }
        }
    );
}

function getDarkSkyForecastData() {
    var key = document.getElementById("api_key_input").value;
    var lat = document.getElementById("lat_input").value;
    var lng = document.getElementById("lng_input").value;
    var location_tag_el = document.getElementById("lat_lng_preset_select_input");
    var location_tag = location_tag_el.options[location_tag_el.selectedIndex].innerHTML;
    fetchDarkSkyForecastData(key, lat, lng, function (err, data) {
        if (err) {
            WriteLineConsole(JSON.stringify(err));
            return;
        }
        if (typeof data.hourly != 'undefined' && typeof data.hourly.data != 'undefined') {
            var hourlyDataArray = data.hourly.data;
            var resultArray = [];
            if (hourlyDataArray.constructor === Array) {
                windSpeedsArray_g = [];
                for (var i = 0; i < hourlyDataArray.length; i++) {
                    var timeStr = convertDateObjToDBStr(convertUnixTimeToDateObj(hourlyDataArray[i]['time']));
                    var windSpeed = hourlyDataArray[i]['windSpeed'];
                    windSpeed = convertToNumberString(windSpeed);
                    resultArray[i] = [timeStr, windSpeed];
                    WriteLineConsole(timeStr + " " + windSpeed);
                    if (windSpeed != "") {
                        windSpeedsArray_g.push({
                            "time": timeStr,
                            "location_tag": location_tag,
                            "wind_speed": windSpeed
                        });
                    }
                }
                //WriteLineConsole(resultArray);
                clearTablesDiv();
                appendTable(resultArray, "tablesDiv");
                return;
            }
            else {
                WriteLineConsole("Response was not in required format...");
            }
        }
        else {
            WriteLineConsole("Response was not in required format...");
        }
    });
}

function getDarkSkyTimeMachineData() {
    var key = document.getElementById("api_key_input").value;
    var lat = document.getElementById("lat_input").value;
    var lng = document.getElementById("lng_input").value;
    var dateInp = document.getElementById("date_input").value;
    var unixTime = convertDateObjToUnixTime(new Date(dateInp));
    var location_tag_el = document.getElementById("lat_lng_preset_select_input");
    var location_tag = location_tag_el.options[location_tag_el.selectedIndex].innerHTML;
    fetchDarkSkyTimeMachineData(key, lat, lng, unixTime, function (err, data) {
        if (err) {
            WriteLineConsole(JSON.stringify(err));
            return;
        }
        if (typeof data.hourly != 'undefined' && typeof data.hourly.data != 'undefined') {
            var hourlyDataArray = data.hourly.data;
            var resultArray = [];
            if (hourlyDataArray.constructor === Array) {
                windSpeedsArray_g = [];
                for (var i = 0; i < hourlyDataArray.length; i++) {
                    var timeStr = convertDateObjToDBStr(convertUnixTimeToDateObj(hourlyDataArray[i]['time']));
                    var windSpeed = hourlyDataArray[i]['windSpeed'];
                    windSpeed = convertToNumberString(windSpeed);
                    resultArray[i] = [timeStr, windSpeed];
                    WriteLineConsole(timeStr + " " + windSpeed);
                    if (windSpeed != "") {
                        windSpeedsArray_g.push({
                            "time": timeStr,
                            "location_tag": location_tag,
                            "wind_speed": windSpeed
                        });
                    }
                }
                //WriteLineConsole(resultArray);
                clearTablesDiv();
                appendTable(resultArray, "tablesDiv");
                return;
            }
            else {
                WriteLineConsole("Response was not in required format...");
            }
        }
        else {
            WriteLineConsole("Response was not in required format...");
        }
    });
}

function saveDataArrayToDB(isForecastData) {
    var callback = function (err, result) {
        if (err) {
            WriteLineConsole("Couldn't save the data. " + JSON.stringify(err));
            return;
        }
        WriteLineConsole("Saved the data successfully...");
    };
    if (isForecastData) {
        Forecast_Data.create(windSpeedsArray_g, callback, null);
    } else {
        Time_Data.create(windSpeedsArray_g, callback, null);
    }
}

function showTimeWindSpeedsFromDB() {
    var dateInp = new Date(document.getElementById("date_input").value);
    dateInp.setHours(0);
    dateInp.setMinutes(0);
    var location_tag_el = document.getElementById("lat_lng_preset_select_input");
    var location_tag = location_tag_el.options[location_tag_el.selectedIndex].innerHTML;
    Time_Data.getForLocation(location_tag, convertDateObjToDBStr(dateInp), convertDateObjToDBStr(new Date(dateInp.getTime() + 24 * 60 * 60 * 1000)), function (err, rows) {
        if (err) {
            return WriteLineConsole("Error in fetching wind time data: " + JSON.stringify(err));
        }
        var resultArray = [];
        for (var i = 0; i < rows.length; i++) {
            resultArray.push([convertDateObjToDBStr(rows[i]['time']), rows[i]['wind_speed']]);
        }
        clearTablesDiv();
        appendTable(resultArray, "tablesDiv");
        return;
    }, null);
}

function showForecastWindSpeedsFromDB() {
    var dateInp = new Date(document.getElementById("date_input").value);
    dateInp.setHours(0);
    dateInp.setMinutes(0);
    var location_tag_el = document.getElementById("lat_lng_preset_select_input");
    var location_tag = location_tag_el.options[location_tag_el.selectedIndex].innerHTML;
    Forecast_Data.getForLocation(location_tag, convertDateObjToDBStr(dateInp), convertDateObjToDBStr(new Date(dateInp.getTime() + 24 * 60 * 60 * 1000)), function (err, rows) {
        if (err) {
            return WriteLineConsole("Error in fetching wind time data: " + JSON.stringify(err));
        }
        var resultArray = [];
        for (var i = 0; i < rows.length; i++) {
            resultArray.push([convertDateObjToDBStr(rows[i]['time']), rows[i]['wind_speed']]);
        }
        clearTablesDiv();
        appendTable(resultArray, "tablesDiv");
        return;
    }, null);
}

function loadPresets() {
    var selElement = document.getElementById("lat_lng_preset_select_input");
    var scadaPntText = selElement.options[selElement.selectedIndex].getAttribute("data-scada_pnt");
    var latText = selElement.options[selElement.selectedIndex].getAttribute("data-lat");
    var lngText = selElement.options[selElement.selectedIndex].getAttribute("data-lng");
    document.getElementById("lat_input").value = latText.trim();
    document.getElementById("lng_input").value = lngText.trim();
    document.getElementById("scada_id_input").value = scadaPntText;
}

function clearTablesDiv() {
    clearDiv('tablesDiv');
}

function connectToDB() {
    var db = require('./db.js');
    var host = document.getElementById("wind_db_host_input").value;
    var username = document.getElementById("wind_db_username_input").value;
    var password = document.getElementById("wind_db_password_input").value;
    // Connect to MySQL on start
    db.connect(db.MODE_PRODUCTION, function (err) {
        if (err) {
            WriteLineConsole('Unable to connect to the Wind Info Database.');
            return;
        } else {
            WriteLineConsole('Connected to the Wind Info Database!');
        }
    }, {'host': host, 'user': username, 'password': password});
}

function scada_file_upload_click() {
    readFileText("scada_file_input", function (fileText) {
        var dataArray = CSVToArray(fileText);
        console.log(dataArray);
        var scadaObjectsArray = convertArrayToObjects(dataArray);
        if (scadaObjectsArray.length == 0) {
            return WriteLineConsole("Zero rows present the csv file");
        }
        console.log(scadaObjectsArray);
        Scada_Wind_Generation.create(scadaObjectsArray, function (err, result) {
            if (err) {
                WriteLineConsole("Couldn't save the scada data in the DB. " + JSON.stringify(err));
                return;
            }
            WriteLineConsole("Saved the scada data in DB successfully...");
        }, null);
    });
}

function getScadaDataFromDB() {
    var scadaId = document.getElementById("scada_id_input").value;
    var startDate = new Date(document.getElementById("date_input").value);
    startDate.setHours(0);
    startDate.setMinutes(0);
    var endDate = new Date();
    var hrs = 24;
    endDate.setTime(startDate.getTime() + (hrs * 60 * 60 * 1000));
    Scada_Wind_Generation.getForLocation(scadaId, convertDateObjToDBStr(startDate), convertDateObjToDBStr(endDate), function (err, rows) {
        console.log(rows);
        var scadaRowsArray = [];
        for (var i = 0; i < rows.length; i++) {
            scadaRowsArray.push([convertDateObjToDBStr(rows[i]["time"]), rows[i]["generation_mw"]]);
        }
        clearTablesDiv();
        appendTable(scadaRowsArray, "tablesDiv");
    }, null);
}

function fitWindPowerData() {
    var scada_tag = document.getElementById("scada_id_input").value;
    var startDate = new Date(document.getElementById("date_input").value);
    startDate.setHours(0);
    startDate.setMinutes(0);
    var endDate = new Date();
    var hrs = 24;
    endDate.setTime(startDate.getTime() + (hrs * 60 * 60 * 1000));
    var location_tag_el = document.getElementById("lat_lng_preset_select_input");
    var location_tag = location_tag_el.options[location_tag_el.selectedIndex].innerHTML;
    fitDataWindPowerFromDB(scada_tag, location_tag, startDate, endDate, function (err, theta) {
        if (err) {
            console.log(err);
            return WriteLineConsole("Data not fitted due to Error: " + JSON.stringify(err));
        }
        WriteLineConsole("Solution for regression is " + theta.toString());
        var thetaRows = [];
        for (var i = 0; i < theta.length; i++) {
            thetaRows.push({"param_degree": i, "param_value": theta[i][0]});
        }
        Regression_Solution.getWithCreation(location_tag, convertDateObjToDBStr(startDate), convertDateObjToDBStr(endDate), function (err, rows) {
            if (err) {
                return WriteLineConsole("Error in saving the solution results: " + JSON.stringify(err));
            }
            var solution_id = rows[0].id;
            for (var i = 0; i < thetaRows.length; i++) {
                thetaRows[i]["solution_id"] = solution_id;
            }
            Regression_Param.create(thetaRows, function (err, rows) {
                if (err) {
                    return WriteLineConsole("Error in saving the Theta Values: " + JSON.stringify(err));
                }
                WriteLineConsole("Successfully saved the regression results in DB");
            }, null);
        }, null);
    });
}


function fitDataWindPowerFromDB(scada_tag, location_tag, startDate, endDate, done) {
    // Utility Function
    var findIndexInObjectsArray = function (arr, key, value) {
        var index = -1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key].toString() == value.toString()) {
                index = i;
                break;
            }
        }
        return index;
    };
    // get hourly wind speeds from DB
    var getWindSpeeds = function (callback) {
        Time_Data.getForLocation(location_tag, convertDateObjToDBStr(startDate), convertDateObjToDBStr(endDate), function (err, rows) {
            console.log(rows);
            if (err) return callback(err);
            callback(null, {'wind_time_data': rows});
        }, null);
    };
    // get hourly scada generation MW from DB
    var getScadaData = function (prevRes, callback) {
        Scada_Wind_Generation.getForLocation(scada_tag, convertDateObjToDBStr(startDate), convertDateObjToDBStr(endDate), function (err, rows) {
            console.log(rows);
            if (err) return callback(err);
            prevRes['scada_wind_data'] = rows;
            callback(null, prevRes);
        }, null);
    };

    var functionsArray = [getWindSpeeds, getScadaData];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        console.log(prevRes);
        var scadaGenObjectsArray = prevRes.scada_wind_data;
        var windObjectsArray = prevRes.wind_time_data;
        var dataSet = {"windsArray": [], "scadaGenArray": []};
        // Creating the data set for regression
        for (var i = 0; i < scadaGenObjectsArray.length; i++) {
            var sampleTime = scadaGenObjectsArray[i].time;
            var index = findIndexInObjectsArray(windObjectsArray, "time", sampleTime);
            if (index != -1) {
                dataSet.windsArray.push([windObjectsArray[index]["wind_speed"]]);
                dataSet.scadaGenArray.push([scadaGenObjectsArray[index]["generation_mw"]]);
            }
        }
        // check if we have at least 3 samples
        if (dataSet.scadaGenArray.length < 3) {
            return done(new Error(vsprintf("Insufficient samples %s(< 3) for solving 2nd order polynomial regression in 1 variable", dataSet.scadaGenArray.length + "")));
        }
        // fit scada and wind arrays to get the parameter matrix Theta
        var theta = second_degree_regression(dataSet.windsArray, dataSet.scadaGenArray, true);
        done(null, theta);
    });
}

function predictPower() {
    var dateInp = new Date(document.getElementById("date_input").value);
    dateInp.setHours(0);
    dateInp.setMinutes(0);
    var location_tag_el = document.getElementById("lat_lng_preset_select_input");
    var location_tag = location_tag_el.options[location_tag_el.selectedIndex].innerHTML;
    predictForDateFromDB(location_tag, dateInp, function (err, results) {
        if (err) {
            return WriteLineConsole("Error in predicting wind speeds: " + JSON.stringify(err));
        }
        console.log(results.predictedPowers);
        var resultArray = [];
        for (var i = 0; i < results.predictedPowers.length; i++) {
            resultArray.push([convertDateObjToDBStr(results['times'][i][0]), results['predictedPowers'][i][0]]);
        }
        clearTablesDiv();
        appendTable(resultArray, "tablesDiv");
        return;
    });
}

function predictForDateFromDB(location_tag, dateObj, done) {
    Regression_Solution.getLatestForLocation(location_tag, convertDateObjToDBStr(dateObj), function (err, rows) {
        if (err) {
            return done(err);
        }
        var solution_id = rows[0].id;
        Regression_Param.getForSolutionId(solution_id, function (err, rows) {
            if (err) {
                return done(err);
            }
            var theta = [];
            for (var i = 0; i < rows.length; i++) {
                theta[rows[i]['param_degree']] = [rows[i]['param_value']];
            }
        }, null);
    }, null);
    var getSolutionId = function (callback) {
        Regression_Solution.getLatestForLocation(location_tag, convertDateObjToDBStr(dateObj), function (err, rows) {
            if (err) return callback(err);
            var solution_id = rows[0].id;
            callback(null, {'solution_id': solution_id});
        }, null);
    };
    var getRegressionParams = function (prevRes, callback) {
        Regression_Param.getForSolutionId(prevRes.solution_id, function (err, rows) {
            if (err) return callback(err);
            var theta = [];
            for (var i = 0; i < rows.length; i++) {
                theta[rows[i]['param_degree']] = [rows[i]['param_value']];
            }
            prevRes.theta = theta;
            callback(null, prevRes);
        }, null);
    };
    var getWindSpeeds = function (prevRes, callback) {
        Time_Data.getForLocation(location_tag, convertDateObjToDBStr(dateObj), convertDateObjToDBStr(new Date(dateObj.getTime() + 24 * 60 * 60 * 1000)), function (err, rows) {
            if (err) return callback(err);
            // sort the objects array by the time key
            rows.sort(function (a, b) {
                var keyA = new Date(a.time),
                    keyB = new Date(b.time);
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            prevRes.windSpeeds = rows;
            callback(null, prevRes);
        }, null);
    };
    var functionsArray = [getSolutionId, getRegressionParams, getWindSpeeds];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        console.log(prevRes);
        // use rows and theta to predict the scada wind speeds
        var windSpeeds = prevRes.windSpeeds;
        var windSpeedsArray = [];
        var timesArray = [];
        for (var i = 0; i < windSpeeds.length; i++) {
            windSpeedsArray.push([windSpeeds[i].wind_speed]);
            timesArray.push([windSpeeds[i].time]);
        }
        var theta = prevRes.theta;
        var predictedPowers = math.multiply(math.matrix(math.concat(math.ones(windSpeedsArray.length, 1), math.matrix(windSpeedsArray), math.dotMultiply(math.matrix(windSpeedsArray), math.matrix(windSpeedsArray)))), theta);
        done(null, {'predictedPowers': predictedPowers._data, 'times': timesArray});
    });
}