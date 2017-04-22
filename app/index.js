var dataReader = new DataReader();
dataReader.setConsIDs(["dataReadButton"]);
var data_strategy_ = "csv";

window.onload = function () {
    var fileInput = document.getElementById("dataReadButton");
    fileInput.addEventListener('change', function (e) {
        var fileInput = e.target;
        dataReader.resetAndCreateArrays(fileInput.getAttribute("id"));
        for (var b = 0; b < fileInput.files.length; b++) {
            dataReader.pushFiles(fileInput.files[b], fileInput.getAttribute("id"));
        }
        dataReader.afterEachRead(fileInput.getAttribute("id"));
    });
};

var same_day_forecast_error_threshold_mw = 100;
var error_influence_perc = 60;
var same_day_forecast_modify_threshold_perc = 100;
var num_days = 3; //num of days for forecast
var n_blocks = 96;
var get_day_avg_mw_weight = function (d) {
    return ([0, 2, 1, 0.5])[d];
};
var get_day_block_mw_weight = function (d) {
    return ([0, 2, 1, 0.5])[d];
};

var forecast_block_mw_ = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
    return 0;
});

var hour_ahead_forecast_block_mw_ = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
    return 0;
});

function calculateAvgMWofDay(d) {
    if (data_strategy_ == "csv") {
        var avgMW = 0;
        for (var i = 0; i < n_blocks; i++) {
            avgMW += Number(dataReader.filesAfterReadArrays["dataReadButton"][0][i][d]);
        }
        avgMW = avgMW / n_blocks;
        return avgMW;
    }
    return null;
}

function getDayMWs(d) {
    if (data_strategy_ == "csv") {
        var dayMWsArray = [];
        for (var i = 0; i < n_blocks; i++) {
            dayMWsArray.push(Number(dataReader.filesAfterReadArrays["dataReadButton"][0][i][d]));
        }
        return dayMWsArray;
    }
    return null;
}

function doForecast() {
    forecast_block_mw_ = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
        return 0;
    });

    var forecast_block_mw = [];

    // Avg MW of the forecast day
    var forecast_avg_mw = 0;
    var sigma_day_avg_mw_weights_temp = 0;

    // Block MW factors of the forecast day
    var forecast_block_mw_factors = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
        return 0;
    });
    var sigma_block_mw_weights_temp = 0;

    for (var i = 1; i <= num_days; i++) {
        // Avg MW calculation section
        var day_avg_mw_temp = calculateAvgMWofDay(i);
        forecast_avg_mw += calculateAvgMWofDay(i) * get_day_avg_mw_weight(i);
        sigma_day_avg_mw_weights_temp += get_day_avg_mw_weight(i);
        // Block factor calculation section
        sigma_block_mw_weights_temp += get_day_block_mw_weight(i);
        var day_mw_array_temp = getDayMWs(i);
        for (var blk = 0; blk < n_blocks; blk++) {
            var blockMwFactor = day_mw_array_temp[blk] / day_avg_mw_temp;
            forecast_block_mw_factors[blk] += blockMwFactor * get_day_block_mw_weight(i);
        }
    }
    // Normalise the factors
    forecast_avg_mw = forecast_avg_mw / sigma_day_avg_mw_weights_temp;
    for (var blk = 0; blk < n_blocks; blk++) {
        forecast_block_mw_factors[blk] = forecast_block_mw_factors[blk] / sigma_block_mw_weights_temp;
    }
    //derive the forecast block mws
    for (var blk = 0; blk < n_blocks; blk++) {
        forecast_block_mw[blk] = forecast_block_mw_factors[blk] * forecast_avg_mw;
    }
    forecast_block_mw_ = forecast_block_mw;
}

function plotForecast() {
    var plotDiv = document.getElementById('plotArea');
    var blockLabels = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
        return k + 1
    });
    doForecast();
    // initializing hour_ahead_forecast_block_mw_
    Plotly.newPlot(plotDiv, [{
        x: blockLabels,
        y: forecast_block_mw_
    }], {
        xaxis: {
            autorange: true,
            range: [Math.min(blockLabels), Math.max(blockLabels)],
            dtick: 1
        },
        yaxis: {
            autorange: true,
            range: [0, 1.25 * Math.max(forecast_block_mw_)],
            dtick: 100
        },
        margin: {t: 0}
    });
}

function doHourAheadForecast(cur_blk) {
    var actual_mws = getDayMWs(0);
    //todo calculate the avg forecast error of last 4 blks or 2 blks
    var forecast_error = actual_mws[cur_blk] - forecast_block_mw_[cur_blk];
    if (Math.abs(forecast_error) > same_day_forecast_error_threshold_mw) {
        //Calculate the compensation to add to the forthcoming blocks
        var compensateMW = forecast_error * error_influence_perc * 0.01;
        for (var blk = cur_blk + 3; blk < n_blocks; blk++) {
            var compensationLimit = forecast_block_mw_[blk] * same_day_forecast_modify_threshold_perc * 0.01;
            var adjustment = compensateMW;
            if (Math.abs(adjustment) > Math.abs(compensationLimit)) {
                adjustment = compensationLimit;
            }
            hour_ahead_forecast_block_mw_[blk] = forecast_block_mw_[blk] + adjustment;
        }
    }
}

function plotHourAheadForecast() {
    for (var i = 0; i < n_blocks; i++) {
        doHourAheadForecast(i);
    }
    plotHourAhead();
}

function plotHourAhead() {
    var actual_mws = getDayMWs(0);
    var plotDiv = document.getElementById('plotArea');
    var blockLabels = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
        return k + 1
    });
    Plotly.newPlot(plotDiv, [{
        x: blockLabels,
        y: forecast_block_mw_
    }], {
        xaxis: {
            autorange: true,
            range: [Math.min(blockLabels), Math.max(blockLabels)],
            dtick: 1
        },
        yaxis: {
            autorange: true,
            range: [0, 1.25 * Math.max(forecast_block_mw_)],
            dtick: 100
        },
        margin: {t: 0}
    });
    Plotly.plot(plotDiv, [{
        x: blockLabels,
        y: hour_ahead_forecast_block_mw_
    }]);
    Plotly.plot(plotDiv, [{
        x: blockLabels,
        y: actual_mws
    }]);
}