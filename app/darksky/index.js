/* Started on 03.06.2017 Saturday by Nagasudhir */
var windSpeedsArray_g = [];
var Forecast_Data = require("./models/wind_forecast_data");
var Time_Data = require("./models/wind_time_data");
var Scada_Wind_Generation = require("./models/scada_wind_generation");

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
                            "wind_speed": windSpeed * 100
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
                            "wind_speed": windSpeed * 100
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

function loadPresets() {
    var selElement = document.getElementById("lat_lng_preset_select_input");
    var optionText = selElement.options[selElement.selectedIndex].value;
    var latLng = optionText.split(",");
    document.getElementById("lat_input").value = latLng[0].trim();
    document.getElementById("lng_input").value = latLng[1].trim();
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
        // Saving data*1000 so that three decimals places can be preserved
        for (var i = 0; i < scadaObjectsArray.length; i++) {
            scadaObjectsArray[i]['generation_mw'] *= 1000;
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