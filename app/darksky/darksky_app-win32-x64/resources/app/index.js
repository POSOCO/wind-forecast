/* Started on 03.06.2017 Saturday by Nagasudhir */

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {

    } else if (document.readyState == "complete") {
        var todayDate = new Date();
        var dateElem = document.getElementById("date_input");
        if (dateElem) {
            dateElem.value = convertDateObjToDateStr(todayDate);
        }
        loadPresets();
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
    fetchDarkSkyForecastData(key, lat, lng, function (err, data) {
        if (err) {
            WriteLineConsole(JSON.stringify(err));
            return;
        }
        if (typeof data.hourly != 'undefined' && typeof data.hourly.data != 'undefined') {
            var hourlyDataArray = data.hourly.data;
            var resultArray = [];
            if (hourlyDataArray.constructor === Array) {
                for (var i = 0; i < hourlyDataArray.length; i++) {
                    var timeStr = convertDateObjToDBStr(convertUnixTimeToDateObj(hourlyDataArray[i]['time']));
                    var windSpeed = hourlyDataArray[i]['windSpeed'];
                    windSpeed = convertToNumberString(windSpeed);
                    resultArray[i] = [timeStr, windSpeed];
                    WriteLineConsole(timeStr + " " + windSpeed);
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
    fetchDarkSkyTimeMachineData(key, lat, lng, unixTime, function (err, data) {
        if (err) {
            WriteLineConsole(JSON.stringify(err));
            return;
        }
        if (typeof data.hourly != 'undefined' && typeof data.hourly.data != 'undefined') {
            var hourlyDataArray = data.hourly.data;
            var resultArray = [];
            if (hourlyDataArray.constructor === Array) {
                for (var i = 0; i < hourlyDataArray.length; i++) {
                    var timeStr = convertDateObjToDBStr(convertUnixTimeToDateObj(hourlyDataArray[i]['time']));
                    var windSpeed = hourlyDataArray[i]['windSpeed'];
                    windSpeed = convertToNumberString(windSpeed);
                    resultArray[i] = [timeStr, windSpeed];
                    WriteLineConsole(timeStr + " " + windSpeed);
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