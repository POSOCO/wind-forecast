function convertUnixTimeToDateObj(unixTimestamp) {
    return new Date(unixTimestamp * 1000);
}

function convertDateObjToDBStr(dateObj) {
    var dd = dateObj.getDate();
    var mm = dateObj.getMonth() + 1; //January is 0!
    var yyyy = dateObj.getFullYear();
    var hrs = dateObj.getHours();
    var mins = dateObj.getMinutes();
    var secs = dateObj.getSeconds();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (hrs < 10) {
        hrs = '0' + hrs;
    }
    if (mins < 10) {
        mins = '0' + mins;
    }
    if (secs < 10) {
        secs = '0' + secs;
    }
    return yyyy + '-' + mm + '-' + dd + " " + hrs + ":" + mins + ":" + secs;
}

function convertDateObjToDateStr(dateObj) {
    var dd = dateObj.getDate();
    var mm = dateObj.getMonth() + 1; //January is 0!
    var yyyy = dateObj.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd;
}

function convertDateObjToUnixTime(dateObj) {
    return Math.floor(dateObj.getTime() / 1000);
}

function isDateObjectValid(dateObj) {
    if (Object.prototype.toString.call(dateObj) === "[object Date]") {
        // it is a date
        if (isNaN(dateObj.getTime())) {  // d.valueOf() could also work
            // date is not valid
            return false;
        }
        else {
            // date is valid
            return true;
        }
    }
    else {
        // not a date
        return false;
    }
}