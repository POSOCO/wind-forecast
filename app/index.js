var dataReader_ = new DataReader();
dataReader_.setConsIDs(["dataReadButton"]);

function stateSelectChangeFunction(targ) {
    eDNAPnt_ = targ.value;
    //update eDNA Point input value
    document.getElementById("eDNApntIdInput").value = eDNAPnt_;
    // fetch n to n-4 data from server
    updateDayArrays(4, function (err, result) {
        if (err) {
            console.log("Error");
            console.log(err);
            return;
        }
        console.log("Result");
        console.log(result);
        // plot day ahead forecast
        changePlotTitle();
        plotForecast();
    });
}

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {

    } else if (document.readyState == "complete") {
        initializePlotting();
        var todayDate = new Date();
        var dateElem = document.getElementById("forecastDate");
        if (dateElem) {
            dateElem.value = todayDate.getFullYear() + "-" + makeTwoDigits(todayDate.getMonth() + 1) + "-" + makeTwoDigits(todayDate.getDate());
        }
        //update eDNA Point input value
        document.getElementById("eDNApntIdInput").value = eDNAPnt_;
    }
};

function seedData(num) {
    if (num == 0) {
        dataReader_.filesAfterReadArrays["dataReadButton"] = [[["765.0402222", "510.6144104", "635.4666138", "970.4547729"], ["780.8251953", "514.1004028", "564.0671997", "919.869873"], ["791.8881226", "510.4750061", "574.9252319", "882.7645264"], ["797.9597778", "514.6140137", "586.6956787", "853.1843872"], ["775.5571289", "522.5767822", "596.7474976", "790.7017212"], ["753.2492065", "537.4567871", "635.6911621", "755.1777954"], ["752.9558105", "532.0137939", "665.4332886", "756.1685791"], ["750.9904785", "504.8918152", "676.1079102", "770.1489258"], ["752.5571289", "505.1828003", "681.5423584", "815.5316162"], ["748.4912109", "504.2880859", "680.1513672", "823.2401733"], ["755.3970947", "540.3770142", "673.0452271", "824.2329102"], ["777.3682251", "541.2244873", "650.93927", "826.1008911"], ["805.0150146", "547.3538818", "638.1072388", "789.4235229"], ["842.3963013", "560.2733765", "610.5455322", "763.022522"], ["842.7210083", "558.4752197", "605.7494507", "716.7321777"], ["830.6829224", "571.550415", "566.1481934", "673.6887207"], ["820.7745972", "569.6970215", "574.4096069", "652.0321045"], ["789.2789917", "548.6151733", "569.5215454", "635.9926147"], ["771.6998291", "530.1381836", "557.8447876", "612.1604004"], ["783.9954834", "525.0167847", "550.8331299", "609.5407715"], ["765.5114746", "517.4240723", "565.8251343", "612.4968872"], ["762.9066162", "516.7631226", "557.0123291", "599.9730225"], ["764.7352905", "498.2471924", "539.7463379", "552.8771973"], ["795.8649902", "471.249115", "516.3859863", "543.8690186"], ["812.7623291", "473.4096069", "508.8500977", "527.8447876"], ["914.3430176", "469.7167053", "508.9848022", "506.9978943"], ["952.8109741", "466.478302", "478.3628845", "484.6478882"], ["984.2213135", "466.478302", "457.6567993", "459.6123047"], ["987.7645874", "466.478302", "445.571228", "433.2019043"], ["981.5252075", "466.478302", "424.6541138", "425.4371948"], ["991.4356079", "466.478302", "410.8248901", "426.1672974"], ["998.1865845", "466.478302", "403.0786133", "403.3327026"], ["951.5117188", "466.478302", "396.2177124", "351.6087952"], ["889.7078857", "466.478302", "387.9663696", "300.111908"], ["887.626709", "466.478302", "378.6230164", "251.6195984"], ["965.9240723", "466.478302", "372.1524048", "202.763504"], ["1068.394409", "466.478302", "325.2489014", "193.1791992"], ["1309.228271", "466.478302", "295.615509", "231.8641968"], ["1380.784058", "466.478302", "269.4835205", "265.1364136"], ["1376.526733", "466.478302", "261.4532166", "324.4753113"], ["1296.559326", "466.478302", "260.8115845", "381.6138916"], ["1296.488159", "466.478302", "289.5637817", "435.8673096"], ["1224.931519", "401.3369141", "299.9857788", "498.9176941"], ["1149.109375", "404.0649109", "303.7166443", "553.4758911"], ["1108.725098", "397.0692139", "311.8422852", "575.8488159"], ["1074.12915", "364.290802", "316.4105835", "590.7293091"], ["1008.843628", "352.1669922", "344.0214844", "618.6334839"], ["975.0247192", "346.3651123", "353.2746887", "604.232605"], ["988.2532959", "367.524292", "376.4960938", "612.6651001"], ["1018.873596", "395.3826904", "392.1311035", "681.7163696"], ["1035.288818", "434.6547852", "419.9064026", "717.7177734"], ["1012.552917", "465.0083923", "414.4184875", "712.421875"], ["977.5150757", "493.5256042", "440.678894", "762.5974121"], ["943.4423218", "543.5059814", "453.4153137", "857.0272217"], ["933.7404785", "567.7360229", "492.189209", "864.5878296"], ["953.1121826", "585.0515747", "482.047699", "929.5861206"], ["928.8585815", "608.9453125", "525.5634766", "996.036377"], ["988.2625732", "642.4802856", "546.0861816", "1065.31604"], ["1055.003906", "664.1248779", "506.5010986", "1141.47937"], ["1072.265869", "691.3873901", "550.5872803", "1190.140137"], ["1133.791626", "694.1680298", "577.4368896", "1257.567505"], ["1169.280273", "706.3336182", "599.9893799", "1306.744263"], ["1165.142822", "746.0667725", "601.8997192", "1350.976929"], ["1160.243408", "774.6287842", "631.3718262", "1346.700439"], ["1226.387695", "809.9567871", "653.9019165", "1357.875488"], ["1273.880859", "859.4376221", "641.911499", "1323.730591"], ["1374.957764", "917.4188843", "653.3110962", "1339.62561"], ["1444.921265", "967.8582764", "676.2938232", "1285.473022"], ["1505.331909", "1015.768372", "696.6439819", "1238.975586"], ["1556.585205", "1032.645996", "706.2769775", "1193.749878"], ["1616.673096", "997.9005127", "702.0161133", "1127.286743"], ["1645.649536", "986.8381958", "718.3803101", "1115.761475"], ["1639.157715", "950.9641724", "718.5249023", "1087.181396"], ["1586.078613", "939.425415", "696.9210815", "1042.548706"], ["1587.721802", "921.7758179", "674.4876709", "967.8582764"], ["1525.125366", "858.3928833", "673.3496704", "921.1685791"], ["1457.200195", "838.2564697", "645.1409912", "845.5189209"], ["1358.446655", "836.3057861", "655.1832886", "785.4733887"], ["1252.82019", "814.670105", "621.1693726", "752.0637207"], ["1193.203247", "787.4641113", "597.2069702", "715.0780029"], ["1128.920166", "761.5825806", "576.1334229", "692.5229492"], ["1072.073486", "745.1456299", "539.5457764", "687.9180298"], ["1048.505615", "729.2177734", "537.5739746", "673.2838745"], ["1097.860352", "759.940918", "549.322876", "644.8946533"], ["1180.039551", "782.4697876", "488.6856079", "660.6611328"], ["1321.123291", "803.65448", "491.3861084", "659.8792114"], ["1366.904175", "822.1923828", "491.493988", "656.9632568"], ["1372.567505", "854.7166138", "485.9395142", "678.5509033"], ["1449.577271", "841.0332031", "494.3304138", "674.9776001"], ["1519.236328", "845.1312256", "506.5754089", "672.2255249"], ["1525.974609", "797.8405762", "514.4160767", "657.1929321"], ["1511.90625", "758.9348145", "498.2078857", "653.3745117"], ["1537.737671", "738.2410889", "495.8826904", "658.4656982"], ["1628.234131", "731.2156982", "503.4303894", "658.6157227"], ["1696.90918", "733.3984985", "505.9407043", "648.3258667"], ["1759.019531", "745.3582764", "510.190094", "638.8650513"], [""]]];
    } else {
        dataReader_.filesAfterReadArrays["dataReadButton"] = [[["510.6144104", "635.4666138", "970.4547729", "508.2304993"], ["514.1004028", "564.0671997", "919.869873", "506.6601868"], ["510.4750061", "574.9252319", "882.7645264", "503.9908142"], ["514.6140137", "586.6956787", "853.1843872", "520.62323"], ["522.5767822", "596.7474976", "790.7017212", "540.121521"], ["537.4567871", "635.6911621", "755.1777954", "535.1799927"], ["532.0137939", "665.4332886", "756.1685791", "517.3516846"], ["504.8918152", "676.1079102", "770.1489258", "529.4940796"], ["505.1828003", "681.5423584", "815.5316162", "562.2324829"], ["504.2880859", "680.1513672", "823.2401733", "610.2758789"], ["540.3770142", "673.0452271", "824.2329102", "635.2131958"], ["541.2244873", "650.93927", "826.1008911", "653.4359131"], ["547.3538818", "638.1072388", "789.4235229", "688.5083008"], ["560.2733765", "610.5455322", "763.022522", "695.885498"], ["558.4752197", "605.7494507", "716.7321777", "701.4990234"], ["571.550415", "566.1481934", "673.6887207", "704.3508301"], ["569.6970215", "574.4096069", "652.0321045", "676.4655151"], ["548.6151733", "569.5215454", "635.9926147", "640.4467773"], ["530.1381836", "557.8447876", "612.1604004", "608.4296875"], ["525.0167847", "550.8331299", "609.5407715", "591.1884155"], ["517.4240723", "565.8251343", "612.4968872", "584.24823"], ["516.7631226", "557.0123291", "599.9730225", "580.8494873"], ["498.2471924", "539.7463379", "552.8771973", "579.1223145"], ["471.249115", "516.3859863", "543.8690186", "584.3886719"], ["473.4096069", "508.8500977", "527.8447876", "529.3779297"], ["469.7167053", "508.9848022", "506.9978943", "483.6068115"], ["466.478302", "478.3628845", "484.6478882", "456.3778076"], ["466.478302", "457.6567993", "459.6123047", "408.6026001"], ["466.478302", "445.571228", "433.2019043", "412.4749146"], ["466.478302", "424.6541138", "425.4371948", "411.5103149"], ["466.478302", "410.8248901", "426.1672974", "423.3252869"], ["466.478302", "403.0786133", "403.3327026", "426.5419006"], ["466.478302", "396.2177124", "351.6087952", "432.213501"], ["466.478302", "387.9663696", "300.111908", "423.8568115"], ["466.478302", "378.6230164", "251.6195984", "379.3399963"], ["466.478302", "372.1524048", "202.763504", "299.8435059"], ["466.478302", "325.2489014", "193.1791992", "219.5991058"], ["466.478302", "295.615509", "231.8641968", "171.0686951"], ["466.478302", "269.4835205", "265.1364136", "151.7490997"], ["466.478302", "261.4532166", "324.4753113", "147.7317963"], ["466.478302", "260.8115845", "381.6138916", "142.3553925"], ["466.478302", "289.5637817", "435.8673096", "148.0975037"], ["401.3369141", "299.9857788", "498.9176941", "153.5182953"], ["404.0649109", "303.7166443", "553.4758911", "150.4629059"], ["397.0692139", "311.8422852", "575.8488159", "144.4694061"], ["364.290802", "316.4105835", "590.7293091", "151.7541962"], ["352.1669922", "344.0214844", "618.6334839", "145.6313934"], ["346.3651123", "353.2746887", "604.232605", "133.4938965"], ["367.524292", "376.4960938", "612.6651001", "110.1047974"], ["395.3826904", "392.1311035", "681.7163696", "113.0195007"], ["434.6547852", "419.9064026", "717.7177734", "106.6648026"], ["465.0083923", "414.4184875", "712.421875", "128.8551025"], ["493.5256042", "440.678894", "762.5974121", "173.9629059"], ["543.5059814", "453.4153137", "857.0272217", "218.2577972"], ["567.7360229", "492.189209", "864.5878296", "291.1763916"], ["585.0515747", "482.047699", "929.5861206", "320.5747986"], ["608.9453125", "525.5634766", "996.036377", "338.9877014"], ["642.4802856", "546.0861816", "1065.31604", "383.5795898"], ["664.1248779", "506.5010986", "1141.47937", "415.8352966"], ["691.3873901", "550.5872803", "1190.140137", "470.442688"], ["694.1680298", "577.4368896", "1257.567505", "521.4979248"], ["706.3336182", "599.9893799", "1306.744263", "510.2872925"], ["746.0667725", "601.8997192", "1350.976929", "455.9585876"], ["774.6287842", "631.3718262", "1346.700439", "465.7059937"], ["809.9567871", "653.9019165", "1357.875488", "501.5440979"], ["859.4376221", "641.911499", "1323.730591", "540.6936035"], ["917.4188843", "653.3110962", "1339.62561", "547.0233154"], ["967.8582764", "676.2938232", "1285.473022", "530.012207"], ["1015.768372", "696.6439819", "1238.975586", "560.6829224"], ["1032.645996", "706.2769775", "1193.749878", "570.3660889"], ["997.9005127", "702.0161133", "1127.286743", "567.3937988"], ["986.8381958", "718.3803101", "1115.761475", "556.2832031"], ["950.9641724", "718.5249023", "1087.181396", "541.6049805"], ["939.425415", "696.9210815", "1042.548706", "540.0587158"], ["921.7758179", "674.4876709", "967.8582764", "524.4478149"], ["858.3928833", "673.3496704", "921.1685791", "519.7250977"], ["838.2564697", "645.1409912", "845.5189209", "555.3867798"], ["836.3057861", "655.1832886", "785.4733887", "618.727478"], ["814.670105", "621.1693726", "752.0637207", "690.4096069"], ["787.4641113", "597.2069702", "715.0780029", "772.5744019"], ["761.5825806", "576.1334229", "692.5229492", "774.8737183"], ["745.1456299", "539.5457764", "687.9180298", "775.9251099"], ["729.2177734", "537.5739746", "673.2838745", "791.6873169"], ["759.940918", "549.322876", "644.8946533", "774.8775024"], ["782.4697876", "488.6856079", "660.6611328", "748.2799072"], ["803.65448", "491.3861084", "659.8792114", "763.1807251"], ["822.1923828", "491.493988", "656.9632568", "794.8383789"], ["854.7166138", "485.9395142", "678.5509033", "817.7338867"], ["841.0332031", "494.3304138", "674.9776001", "816.9985962"], ["845.1312256", "506.5754089", "672.2255249", "832.2103271"], ["797.8405762", "514.4160767", "657.1929321", "846.9650879"], ["758.9348145", "498.2078857", "653.3745117", "858.3491211"], ["738.2410889", "495.8826904", "658.4656982", "911.9091187"], ["731.2156982", "503.4303894", "658.6157227", "946.7888794"], ["733.3984985", "505.9407043", "648.3258667", "934.9229736"], ["745.3582764", "510.190094", "638.8650513", "980.7404785"], [""]]];
    }
}

seedData(1);
var same_day_forecast_error_threshold_mw = 100;
var error_influence_perc = 70;
var same_day_forecast_modify_threshold_perc = 50;
var num_days = 3; //num of days for forecast
var n_blocks = 96;
var get_day_avg_mw_weight = function (d) {
    return ([0, 3, 1, 0.5])[d];
};
var get_day_block_mw_weight = function (d) {
    return ([0, 3, 1, 0.5])[d];
};

var forecast_block_mw_ = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
    return 0;
});

var hour_ahead_forecast_block_mw_ = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
    return 0;
});

function initializePlotting() {
    var fileInput = document.getElementById("dataReadButton");
    fileInput.addEventListener('change', function (e) {
        var fileInput = e.target;
        dataReader_.resetAndCreateArrays(fileInput.getAttribute("id"));
        for (var b = 0; b < fileInput.files.length; b++) {
            dataReader_.pushFiles(fileInput.files[b], fileInput.getAttribute("id"));
        }
        dataReader_.afterEachRead(fileInput.getAttribute("id"));
    });
    initializePlotDiv();
}

function initializePlotDiv() {
    var plotDiv = document.getElementById('plotArea');
    var blockLabels = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
        return k + 1
    });
    var trace1 = {
        x: blockLabels,
        y: forecast_block_mw_,
        name: 'Day Ahead Forecast'
    };
    var trace2 = {
        x: blockLabels,
        y: [],
        name: 'Hour Ahead Forecast'
    };
    var trace3 = {
        x: blockLabels,
        y: [],
        name: 'Actual'
    };
    var trace4 = {
        x: blockLabels,
        y: [],
        name: 'N-1'
    };
    var trace5 = {
        x: blockLabels,
        y: [],
        name: 'N-2'
    };
    var trace6 = {
        x: blockLabels,
        y: [],
        name: 'N-3'
    };
    var plotData = [trace1, trace2, trace3, trace4, trace5, trace6];
    var layoutOpt = {
        title: "Wind Forecast",
        xaxis: {
            dtick: 1
        },
        yaxis: {
            dtick: 100
        },
        margin: {l: 50, pad: 4, t: 50}
    };
    Plotly.newPlot(plotDiv, plotData, layoutOpt);
}

function changePlotTitle() {
    var stateSelElem = document.getElementById("stateSelectInput");
    var stateText = stateSelElem.options[stateSelElem.selectedIndex].text;
    var plotDiv = document.getElementById('plotArea');
    plotDiv.layout.title = stateText + " for " + document.getElementById("forecastDate").value;
    document.title = "" + stateText;
}

function calculateAvgMWofDay(d) {
    if (data_strategy_ == "csv") {
        var avgMW = 0;
        for (var i = 0; i < n_blocks; i++) {
            avgMW += Number(dataReader_.filesAfterReadArrays["dataReadButton"][0][i][d]);
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
            dayMWsArray.push(Number(dataReader_.filesAfterReadArrays["dataReadButton"][0][i][d]));
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
    calculateRMSEValsTill(n_blocks - 1);
}

function plotForecast() {
    var plotDiv = document.getElementById('plotArea');
    var blockLabels = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
        return k + 1
    });
    doForecast();
    // check the show day ahead forecast checkbox
    document.getElementById("showForecastChk").checked = true;
    // initializing hour_ahead_forecast_block_mw_
    plotDiv.data[0].y = forecast_block_mw_;
    Plotly.redraw(plotDiv);
}

function doHourAheadForecast(time_blk) {
    var actual_mws = getDayMWs(0);
    //todo calculate the avg forecast error of last 4 blks or 2 blks
    var forecast_error = actual_mws[time_blk] - forecast_block_mw_[time_blk];
    if (Math.abs(forecast_error) > same_day_forecast_error_threshold_mw) {
        //Calculate the compensation to add to the forthcoming blocks
        var compensateMW = forecast_error * error_influence_perc * 0.01;
        for (var blk = time_blk + 3; blk < n_blocks; blk++) {
            var compensationLimit = forecast_block_mw_[blk] * same_day_forecast_modify_threshold_perc * 0.01;
            var adjustment = compensateMW;
            if (Math.abs(adjustment) > Math.abs(compensationLimit)) {
                adjustment = compensationLimit;
            }
            hour_ahead_forecast_block_mw_[blk] = forecast_block_mw_[blk] + adjustment;
        }
    } else {
        for (var blk = time_blk + 3; blk < n_blocks; blk++) {
            hour_ahead_forecast_block_mw_[blk] = forecast_block_mw_[blk];
        }
    }
    calculateRMSEValsTill(time_blk);
}

function doHourAheadForecastTill(time_blk) {
    for (var blk = 0; blk < n_blocks; blk++) {
        hour_ahead_forecast_block_mw_[blk] = forecast_block_mw_[blk];
    }
    for (var i = 0; i < time_blk; i++) {
        doHourAheadForecast(i);
    }
}

function plotHourAheadForecast() {
    for (var blk = 0; blk < n_blocks; blk++) {
        hour_ahead_forecast_block_mw_[blk] = forecast_block_mw_[blk];
    }
    // check the show hour ahead forecast checkbox
    document.getElementById("showHrAheadChk").checked = true;

    /*for (var i = 0; i < n_blocks; i++) {
     doHourAheadForecast(i);
     }
     plotHourAhead();*/
    var animObj = {
        animFunc: function () {
            if (animObj.animIter >= 96) {
                return;
            }
            requestAnimationFrame(animObj.animFunc);
            doHourAheadForecast(animObj.animIter);
            document.getElementById("blkNumView").innerHTML = animObj.animIter + 1;
            plotHourAhead();
            animObj.animIter++;
        },
        animIter: 1
    };
    animObj.animFunc();
}

function plotHourAhead() {
    var plotDiv = document.getElementById('plotArea');
    var blockLabels = Array.apply(null, {length: n_blocks}).map(Function.call, function (k) {
        return k + 1
    });
    plotDiv.data[1].y = hour_ahead_forecast_block_mw_;
    Plotly.redraw(plotDiv);
}

function showActual(bool) {
    var plotDiv = document.getElementById('plotArea');
    if (!bool) {
        plotDiv.data[2].y = [];
        Plotly.redraw(plotDiv);
        return
    }
    var actual_mws = getDayMWs(0);
    plotDiv.data[2].y = actual_mws;
    Plotly.redraw(plotDiv);
}

function showForecast(bool) {
    var plotDiv = document.getElementById('plotArea');
    if (!bool) {
        plotDiv.data[0].y = [];
        Plotly.redraw(plotDiv);
        return
    }
    plotDiv.data[0].y = forecast_block_mw_;
    Plotly.redraw(plotDiv);
}

function showHourAheadForecast(bool) {
    var plotDiv = document.getElementById('plotArea');
    if (!bool) {
        plotDiv.data[1].y = [];
        Plotly.redraw(plotDiv);
        return
    }
    plotDiv.data[1].y = hour_ahead_forecast_block_mw_;
    Plotly.redraw(plotDiv);
}

function showNMinus(num, bool) {
    var plotDiv = document.getElementById('plotArea');
    if (!bool) {
        plotDiv.data[2 + num].y = [];
        Plotly.redraw(plotDiv);
        return
    }
    var yst_mws = getDayMWs(num);
    plotDiv.data[2 + num].y = yst_mws;
    Plotly.redraw(plotDiv);
}

function calculateRMSEValsTill(time_blk) {
    if (time_blk < 0) {
        return;
    }
    var dayMWs = getDayMWs(0);
    var dayAheadErrorSquareSigma = 0;
    var hourAheadErrorSquareSigma = 0;
    var actualSigma = 0;
    for (var i = 0; i < time_blk; i++) {
        //stub
        dayAheadErrorSquareSigma += Math.pow((forecast_block_mw_[i] - dayMWs[i]), 2);
        hourAheadErrorSquareSigma += Math.pow((hour_ahead_forecast_block_mw_[i] - dayMWs[i]), 2);
        actualSigma += dayMWs[i];
    }
    var dayAheadRMSEMW = Math.sqrt(dayAheadErrorSquareSigma / (time_blk + 1));
    var hourAheadRMSEMW = Math.sqrt(hourAheadErrorSquareSigma / (time_blk + 1));
    var dayAheadRMSEPerc = (dayAheadRMSEMW * ((time_blk + 1) * 100)) / actualSigma;
    var hourAheadRMSEPerc = (hourAheadRMSEMW * ((time_blk + 1) * 100)) / actualSigma;
    updateRMSEViews({
        dayAheadRMSEMW: dayAheadRMSEMW,
        hourAheadRMSEMW: hourAheadRMSEMW,
        dayAheadRMSEPerc: dayAheadRMSEPerc,
        hourAheadRMSEPerc: hourAheadRMSEPerc
    });
}

function updateRMSEViews(obj) {
    if (obj == undefined || obj == null) {
        return;
    }
    if (obj.dayAheadRMSEMW != undefined) {
        document.getElementById("dayAheadRMSEMWView").innerHTML = getTwoDecimals(obj.dayAheadRMSEMW);
    }
    if (obj.hourAheadRMSEMW != undefined) {
        document.getElementById("hourAheadRMSEMWView").innerHTML = getTwoDecimals(obj.hourAheadRMSEMW);
    }
    if (obj.dayAheadRMSEPerc != undefined) {
        document.getElementById("dayAheadRMSEPercView").innerHTML = getTwoDecimals(obj.dayAheadRMSEPerc);
    }
    if (obj.hourAheadRMSEPerc != undefined) {
        document.getElementById("hourAheadRMSEPercView").innerHTML = getTwoDecimals(obj.hourAheadRMSEPerc);
    }
}

function getTwoDecimals(num3) {
    return parseFloat(Math.round(num3 * 100) / 100).toFixed(2);
}