function appendTable(tableData, divStr) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    tableData.forEach(function (rowData) {
        var row = document.createElement('tr');

        rowData.forEach(function (cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.getElementById(divStr).appendChild(table);
}

function clearDiv(divStr) {
    document.getElementById(divStr).innerHTML = "";
}

function exportTableAsCsv() {
    var elem = document.getElementById("tablesDiv").childNodes[0];
    var data = [];
    for (var i = 0; i < elem.rows.length; i++) {
        var rowElem = elem.rows[i];
        var row = [];
        for (var k = 0; k < rowElem.cells.length; k++) {
            row.push(rowElem.cells[k].textContent.trim());
        }
        data.push(row);
    }
    var csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function (infoArray, index) {

        var dataString = infoArray.join(",");
        csvContent += index < data.length ? dataString + "\n" : dataString;
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
}

function convertToNumberString(valIn) {
    val = valIn;
    if (!(!isNaN(val) && val != null)) {
        val = "";
    }
    return val;
}

function readFileText(fileInpId, callback) {
    var reader = new FileReader();
    var file = document.getElementById(fileInpId).files[0];
    reader.onload = function (e) {
        callback(reader.result);
    };
    reader.readAsText(file);
}

function convertArrayToObjects(arr) {
    if (arr.constructor != Array && arr.length < 1) {
        return [];
    }
    if (arr[0].constructor != Array && arr.length < 1) {
        return [];
    }
    var objectsArray = [];
    var colsArray = arr[0];
    for (var i = 1; i < arr.length; i++) {
        var arrRow = arr[i];
        if (arrRow.length < colsArray.length) {
            continue;
        }
        var timeStr = arrRow[0];
        for (var k = 1; k < colsArray.length; k++) {
            objectsArray.push({'time': timeStr, 'location_tag': colsArray[k], 'generation_mw': arrRow[k]});
        }
    }
    return objectsArray;
}