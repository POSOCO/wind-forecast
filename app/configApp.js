var data_strategy_ = "csv";

var secs_ = 15 * 60;
var type_ = "average";
var serverBaseAddress_ = "http://localhost:62448";
var eDNAPnt_ = "WRLDCMP.SCADA1.A0047236";

var latestPlottedTB_ = -1;
var realTimeForecastTimerId_ = null;
var hourAheadForecastPlotIntervalMins_ = 5; // 5 mins
