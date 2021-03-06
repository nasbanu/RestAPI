$(document).ready(function () {
	getAllStationAndBikes();
});
/*****************************************************************************************************
 * A call to the REST-API getting all cycle stations
 *****************************************************************************************************/
function getStationInformation(data, callback) {
    $.ajax({
        url: "https://oslobysykkel.no/api/v1/stations",    
		headers: {"Client-Identifier" : "fd551dae28817b72217ed589d942ecc1"},
        type: 'GET',
        success: function(data) {
            console.dir(data);
            callback(data);
        }
    });
}

/*****************************************************************************************************
 * A call to the REST-API getting available cycles and locks from cycle stations
 *****************************************************************************************************/
 
function getAvailableBikesAndLocks(data, callback) {
    $.ajax({
        url: "https://oslobysykkel.no/api/v1/stations/availability",    
		headers: {"Client-Identifier" : "fd551dae28817b72217ed589d942ecc1"},
        type: 'GET',
        success: function(data) {
            console.dir(data);
            callback(data);
        }
    });
}

/***************************************************************************************************************
 * Getting overview of stations, availabile bikes and locks
 ***************************************************************************************************************/
 
function getAllStationAndBikes(stationData) {
    getStationInformation(stationData, function (getStationInformationResult) { 
	var stationInfo = getStationInformationResult.stations;
		
	getAvailableBikesAndLocks(stationData, function (getAvailableBikesAndLocksResults) { 
	var availableInfo = getAvailableBikesAndLocksResults.stations;
	
	var mergeBothTable = concatTable(availableInfo, stationInfo, "id", "id", function (stationInfo, availableBikesAndLocks) {
    return {               
                Stasjon: stationInfo.title,                				             
                TilgjengeligLåser: availableBikesAndLocks.availability.locks,
				TilgjengeligSykler: availableBikesAndLocks.availability.bikes
            };
        });

        var addToHTML = document.getElementById("getAllInformation");
        displayTable(mergeBothTable, addToHTML);
});
});
}
	
	
function concatTable(availabilityDB, allDB, availabilityDBRef, allDBRef, select) {
    var l = availabilityDB.length,
        m = allDB.length,
        availableArr = [],
        result = [];
    for (var i = 0; i < l; i++) { 
        var row = availabilityDB[i];
        availableArr[row[availabilityDBRef]] = row; 
    }
    for (var j = 0; j < m; j++) { 
        var y = allDB[j];
        var x = availableArr[y[allDBRef]]; 
        if (typeof x != 'undefined') {
            result.push(select(y, x)); 
        } else {
            console.log("Not availabile");
        }
    }
    return result;
};


function displayTable(inputarray, divContainer) {
    var col = [];
    for (var i = 0; i < inputarray.length; i++) {
        for (var key in inputarray[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    var table = document.createElement("table");
    var tr = table.insertRow(-1);               
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");  
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    
    for (var i = 0; i < inputarray.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = inputarray[i][col[j]];
        }
    }
    //divContainer.innerHTML = "";
    divContainer.appendChild(table);
}
