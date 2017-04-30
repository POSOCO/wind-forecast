function updateEdnaPntId() {
    eDNAPnt_ = document.getElementById("eDNApntIdInput").value;
}

function determineLatestElapsedTB(dateObj) {
    var mins = dateObj.getMinutes();
    var hrs = dateObj.getHours();
    var blk = Math.floor((hrs * 60 + mins) / 15);
    return blk;
}

function makeTwoDigits(x) {
    if (x < 10) {
        return "0" + x;
    }
    else {
        return x;
    }
}

function getDateUrlString(strtimeDate) {
    return makeTwoDigits(strtimeDate.getDate()) + "/" + makeTwoDigits(strtimeDate.getMonth() + 1) + "/" + strtimeDate.getFullYear() + "/" + "00:00:00";
}

function createUrl(pnt, strTimeDate, endtimeDate) {
    var strtime = getDateUrlString(strTimeDate);
    var endtime = getDateUrlString(endtimeDate);
    var url = "";
    url = serverBaseAddress_ + "/api/values/history?pnt=" + pnt + "&strtime=" + strtime + "&endtime=" + endtime + "&secs=" + secs_ + "&type=" + type_;
    return url;
}

function convertJSONtoArray(data) {
    var res = [];
    if (data.constructor !== Array) {
        return res;
    }
    for (var i = 0; i < data.length - 1; i++) {
        res[i] = data[i + 1].dval;
    }
    return res;
}

function getDayHistoryArray(pnt, dayObj, callback) {
    //var dayObj = new Date(2017, 3, 28);
    var tomm = new Date(dayObj);
    tomm.setDate(tomm.getDate() + 1);
    $.ajax({
        //fetch categories from sever
        url: createUrl(pnt, dayObj, tomm),
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(convertJSONtoArray(data));

            callback(null, convertJSONtoArray(data));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            callback(jqXHR);
            //toastr.error("The error from server is --- " + jqXHR.responseJSON.message);
        }
    });
}

function updateDayArrays(totalDayOffsets, callback) {
    var todayDate = new Date(document.getElementById("forecastDate").value);
    var getFourDaysData = function (callback) {
        var dayIterators = Array.apply(null, {length: totalDayOffsets}).map(Function.call, Number);
        var getDayData = function (dayIterator, callback) {
            var dayOffset = dayIterator;
            var target_date = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
            target_date = new Date(target_date - dayOffset * 86400000);
            getDayHistoryArray(eDNAPnt_, target_date, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        };
        //finding each substation Id
        async.mapSeries(dayIterators, getDayData, function (err, results) {
            if (err) return callback(err);
            callback(null, results);
        });
    };
    var functionsArray = [getFourDaysData];
    async.waterfall(functionsArray, function (err, daysValsArray) {
        if (err) return callback(err);
        console.log(daysValsArray);
        for (var i = 0; i < daysValsArray.length; i++) {
            for (var blk = 0; blk < daysValsArray[0].length; blk++) {
                dataReader_.filesAfterReadArrays["dataReadButton"][0][blk][i] = daysValsArray[i][blk];
            }
        }
        callback(null, daysValsArray);
    });
}

function fetchFromServer() {
    updateDayArrays(4, function (err, result) {
        if (err) {
            console.log("Error");
            console.log(err);
            return;
        }
        console.log("Result");
        console.log(result);
        changePlotTitle();
        plotForecast();
    });
}

function startRealTimeForecast() {
    pauseRealTimeForecast();
    plotRealTimeForecast();
    realTimeForecastTimerId_ = setInterval(plotRealTimeForecast, hourAheadForecastPlotIntervalMins_ * 60000);
}

function pauseRealTimeForecast() {
    clearInterval(realTimeForecastTimerId_);
}

function plotRealTimeForecast() {
    // determine the current time block
    var currTb = determineLatestElapsedTB(new Date());
    if (currTb == latestPlottedTB_) {
        // already plotted the data so no need to do anything
        return;
    }
    // update the current day mw data array
    updateDayArrays(1, function (err, result) {
        if (err) {
            console.log("Error");
            console.log(err);
            return;
        }
        console.log("Result");
        console.log(result);
        // do hour ahead forecast
        // plot the hour ahead forecast
        doHourAheadForecast(currTb);
        document.getElementById("blkNumView").innerHTML = currTb;
        plotHourAhead();
        latestPlottedTB_ = currTb;
    });
}