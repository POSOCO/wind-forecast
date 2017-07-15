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
    var toDateInp = document.getElementById("to_date_input").value;
    var unixTime = convertDateObjToUnixTime(new Date(dateInp));
    var location_tag_el = document.getElementById("lat_lng_preset_select_input");
    var location_tag = location_tag_el.options[location_tag_el.selectedIndex].innerHTML;
    if (toDateInp == "") {
        toDateInp = dateInp;
    }
    var numDays = ((new Date(toDateInp)).getTime() - (new Date(dateInp)).getTime()) / (24 * 60 * 60 * 1000);
    var dayIterators = Array.apply(null, {length: numDays + 1}).map(Function.call, Number);
    //console.log(dayIterators);
    var getDayData = function (dayIterator, callback) {
        fetchDarkSkyTimeMachineData(key, lat, lng, (unixTime + dayIterator * 24 * 60 * 60), function (err, data) {
            if (err) {
                return callback(err);
            }
            //WriteLineConsole(JSON.stringify(data));
            if (typeof data.hourly != 'undefined' && typeof data.hourly.data != 'undefined') {
                var hourlyDataArray = data.hourly.data;
                if (hourlyDataArray.constructor === Array) {
                    for (var i = 0; i < hourlyDataArray.length; i++) {
                        var timeStr = convertDateObjToDBStr(convertUnixTimeToDateObj(hourlyDataArray[i]['time']));
                        var windSpeed = hourlyDataArray[i]['windSpeed'];
                        windSpeed = convertToNumberString(windSpeed);
                        WriteLineConsole(timeStr + " " + windSpeed);
                        if (windSpeed != "") {
                            windSpeedsArray_g.push({
                                "time": timeStr,
                                "location_tag": location_tag,
                                "wind_speed": windSpeed
                            });
                        }
                    }
                    return callback(null);
                }
                WriteLineConsole("Response was not in required format...");
                return callback(null);
            }
            WriteLineConsole("Response was not in required format...");
            return callback(null);
        });
    };
    //finding each owner Id
    var temp_windSpeedsArray_g = windSpeedsArray_g;
    windSpeedsArray_g = [];
    async.mapSeries(dayIterators, getDayData, function (err, results) {
        if (err) {
            WriteLineConsole(JSON.stringify(err));
        }
        if (windSpeedsArray_g.length < 0) {
            windSpeedsArray_g = temp_windSpeedsArray_g;
            return
        }
        var resultArray = [];
        for (var i = 0; i < windSpeedsArray_g.length; i++) {
            resultArray[i] = [windSpeedsArray_g[i].time, windSpeedsArray_g[i].wind_speed, windSpeedsArray_g[i].location_tag];
        }
        clearTablesDiv();
        appendTable(resultArray, "tablesDiv");
        return;
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

function getLatLngLocFromUI() {
    //stub
    var selElement = document.getElementById("lat_lng_preset_select_input");
    var scadaPntText = selElement.options[selElement.selectedIndex].getAttribute("data-scada_pnt");
    var key = document.getElementById("api_key_input").value;
    var lat = document.getElementById("lat_input").value;
    var lng = document.getElementById("lng_input").value;
    var location_tag = selElement.options[selElement.selectedIndex].innerHTML;
    if (location_tag.toLowerCase() == 'gujarat') {
        lat = [23.1310443, 23.0333339, 23.0963047, 23.240534, 23.2453161, 23.2453161, 23.2215293, 21.9374563, 21.9916328, 22.0581784, 22.1304097, 21.6346825, 21.8567251, 21.325629, 23.5333141, 21.6770205, 22.8570958, 22.8570958, 20.6280484, 22.1028112, 22.0085666, 22.6907419, 21.8998088, 22.9493141, 23.1233208, 22.0085666, 21.5670087, 21.7577664, 22.7368837, 21.331021, 22.3374546, 22.0881251, 23.3888118, 21.9553832, 21.1062613, 22.4058062, 23.374364, 21.7747137, 21.7289681, 22.0721563, 23.9217204, 21.7577664, 23.0208789, 21.583029, 23.3493677, 22.3539441, 21.325629, 22.3080207, 22.850231, 20.8139291, 21.9189855, 22.2475747, 22.6716698, 22.4248734];
        lng = [70.0702211, 68.906443, 68.7948178, 70.6094287, 70.6681504, 70.6681504, 70.5601859, 69.2273902, 69.2403021, 70.2044391, 69.9038333, 72.1284478, 69.3397895, 70.5749553, 72.5565702, 69.5454312, 69.2265487, 69.2265487, 73.1676613, 69.9190703, 69.7120392, 73.5513662, 69.3087745, 69.0940352, 68.8512754, 69.7120392, 72.1424532, 72.1135572, 70.4215049, 69.8906818, 71.0075338, 71.0468458, 69.0944338, 71.1858699, 73.2560634, 70.6885503, 72.6984604, 70.1263947, 70.1059863, 69.3453353, 72.9956242, 72.1135572, 72.5352713, 70.4510653, 69.118048, 70.2531753, 70.5749553, 70.3098907, 70.9855703, 73.0750753, 71.440841, 70.115229, 70.7591165, 71.1904835];
        location_tag = ["Vershamedi(SUZLON)", "Suthari (SUZLON)", "Sindhodi (SUZLON)", "Vandhiya (VESTAS)", "132KV Sikharpur (VESTAS)", "66KV Sikharpur (SUZLON)", "Jangi (SUZLON)", "Navadra (GEDA)", "Bhogat (GEDA)", "Sadodar (WWIL)", "132 KV Enercon (WWIL)", "Ukharla (SUZLON)", "Gandhvi (SUZLON)", "Baradiya (SUZLON)", "Vasai(SUZLON)", "Kuchhdi(SUZLON)", "Layza(SUZLON)", "Tunkar(SUZLON)", "Jamanwada (SUZLON)", "Tebhda (WWIL)", "Mota Gunda (ELECON)", "Vinjalpar (ELECON)", "Lamba (GEDA)", "Changdai (SUZLON)", "Vanku(SUZLON)", "132 KV Mota gunda (SUZLON)", "Sanodar (SUZLON)", "Rajapara (SUZLON)", "Balambha (SUZLON)", "Gorsar(SUZLON)", "Parevada(SUZLON)", "Halenda(SUZLON)", "Rasaliya (WWIL)", "Kotda Pitha(SH.RAM EPC)", "TITHWA(AZALEA)", "Anandpar(INOX)", "220KV Amarapur (KINTECH)", "Dhank(GEDA)", "Mervadar (GEDA)", "Patelka(GEDA)", "Vadali(WWIL)", "Rajpara(SUZLON)", "Koblavadar(POWERICA)", "Sukhpur(INOX)", "Ukheda(SUZLON)", "Nanimatli(POINEER)", "Baradiya(KP ENERGY)", "Dhudesiya(POINEER)", "Ratabhe(SITEC)", "Degam(KP ENERGY)", "Nanikundal(STEC)", "Galla(SITEC)", "Parabadi(WWIL)", "Chotila(INOX)"];
        scadaPntText = ["Vershamedi(SUZLON)", "Suthari (SUZLON)", "Sindhodi (SUZLON)", "Vandhiya (VESTAS)", "132KV Sikharpur (VESTAS)", "66KV Sikharpur (SUZLON)", "Jangi (SUZLON)", "Navadra (GEDA)", "Bhogat (GEDA)", "Sadodar (WWIL)", "132 KV Enercon (WWIL)", "Ukharla (SUZLON)", "Gandhvi (SUZLON)", "Baradiya (SUZLON)", "Vasai(SUZLON)", "Kuchhdi(SUZLON)", "Layza(SUZLON)", "Tunkar(SUZLON)", "Jamanwada (SUZLON)", "Tebhda (WWIL)", "Mota Gunda (ELECON)", "Vinjalpar (ELECON)", "Lamba (GEDA)", "Changdai (SUZLON)", "Vanku(SUZLON)", "132 KV Mota gunda (SUZLON)", "Sanodar (SUZLON)", "Rajapara (SUZLON)", "Balambha (SUZLON)", "Gorsar(SUZLON)", "Parevada(SUZLON)", "Halenda(SUZLON)", "Rasaliya (WWIL)", "Kotda Pitha(SH.RAM EPC)", "TITHWA(AZALEA)", "Anandpar(INOX)", "220KV Amarapur (KINTECH)", "Dhank(GEDA)", "Mervadar (GEDA)", "Patelka(GEDA)", "Vadali(WWIL)", "Rajpara(SUZLON)", "Koblavadar(POWERICA)", "Sukhpur(INOX)", "Ukheda(SUZLON)", "Nanimatli(POINEER)", "Baradiya(KP ENERGY)", "Dhudesiya(POINEER)", "Ratabhe(SITEC)", "Degam(KP ENERGY)", "Nanikundal(STEC)", "Galla(SITEC)", "Parabadi(WWIL)", "Chotila(INOX)"];
    }
    return {key: key, lat: lat, lng: lng, location_tag: location_tag, scadaPntText: scadaPntText};
}