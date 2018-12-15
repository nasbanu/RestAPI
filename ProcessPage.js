$(document).ready(function () {
    try {
        if ($(("#allStation").length > 0) {
            getAllStations();           
        }       
        if ($(("#availableCyclesLocks").length > 0) {
            getAvailableCyclesAndLocks();           
        }           
    }
    catch (ex) {
        console.log(ex.message);
    }
});
 
/*****************************************************************************************************
 * A call to the REST-API getting all cycle stations
 *****************************************************************************************************/
function getStationProperties(onSuccess, onError) {
    rootUrl =  https://oslobysykkel.no
    var searchUrl = _spPageContextInfo.webAbsoluteUrl + "/api/v1/stations";
    var executor = new SP.RequestExecutor(rootUrl);
    executor.executeAsync(
        {
            url: searchUrl,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: onSuccess,
            error: onError 
        }
    );
}
 
/***************************************************************************************************************
 * Getting overview of all stations
 ***************************************************************************************************************/
function getAllStations() {
    try {
           getStationProperties(onGetAllStationsSuccess, onGetAllStationsError);
    }
    catch (ex) {
        var unsortedList = "<ul class=\"webpartcontent\"><li>Kunne ikke hente sykkelstasjon " + ex.message + "</li></ul>";
        $(("#allStation").html(unsortedList);
    }
}
 
function onGetAllStationsSuccess(data) {
    var resultsAsJson = JSON.parse(data.body);
    var stationProperties = resultsAsJson.d.stations.results;
 
    var unsortedList = null;
    if (stationProperties.length == 0) {
        unsortedList = "<ul class=\"webpartcontent\"><li>Det finner ingen stasjon</li><ul>";
    }
    else {
        unsortedList = "<ul class=\"webpartcontent\">";
        $(.each(stationProperties, function (index, result) {         
            unsortedList += "<li>" + result.title + "</li>";
        });         
        unsortedList += "</ul>";
    }
    // Inject HTML into page
    $(("#allStation").html(unsortedList);
}
function onGetAllStationsError(data) {
    var unsortedList = "<ul class=\"webpartcontent\"><li>Fant ingen sykkelstasjon.</li><ul>";
    $(("#allStation").html(unsortedList);
}
 
/*****************************************************************************************************
 * A call to the REST-API getting available cycles and locks from cycle stations
 *****************************************************************************************************/
function getCykleAndLockProperties(onSuccess, onError) {
    rootUrl =  https://oslobysykkel.no
    var searchUrl = _spPageContextInfo.webAbsoluteUrl + "/api/v1/stations/availability"
    var executor = new SP.RequestExecutor(rootUrl);
    executor.executeAsync(
        {
            url: searchUrl,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: onSuccess,
            error: onError 
        }
    );
}
 
/***************************************************************************************************************
 * Getting overview of available cycles and locks in Oslo Bysykkel ***************************************************************************************************************/
function getAvailableCyclesAndLocks() {
    try {
           getCykleAndLockProperties(onGetAvailableSuccess, onGetAvailableError);
    }
    catch (ex) {
        var unsortedListCycles = "<ul class=\"cyclecontent\"><li>Kunne ikke hente tilgjengelig sykler " + ex.message + "</li></ul>";
        var unsortedListLocks = "<ul class=\"lockcontent\"><li>Kunne ikke hente tilgjengelig låser " + ex.message + "</li></ul>";
         
        $(("#cycles").html(unsortedListCycles);
        $(("#locks").html(unsortedListLocks);       
    }
}
 
function onGetAvailableSuccess(data) {
    var resultsAsJson = JSON.parse(data.body);
    var availableProperties = resultsAsJson.d.stations.results;
 
    var unsortedListCycles = null;
    var unsortedListLocks = null;
    if (availableProperties.length == 0) {
        unsortedListCycles = "<ul class=\"cyclecontent\"><li>Det finner ingen sykler</li><ul>";
        unsortedListLocks = "<ul class=\"lockcontent\"><li>Det finner ingen låser</li><ul>";
    }
     
    else {
        unsortedListCycles = "<ul class=\"cyclecontent\">";
        unsortedListLocks = "<ul class=\"lockcontent\">";
        $(.each(stationProperties, function (index, result) {         
            unsortedListCycles += "<li>" + result.availability[bikes] + "</li>";
            unsortedListLocks += "<li>" + result.availability[locks] + "</li>";
        });         
        unsortedListCycles += "</ul>";
        unsortedListLocks += "</ul>";
    }
    // Inject HTML into page
    $(("#cycles").html(unsortedListCycles);
    $(("#locks").html(unsortedListLocks);
}
function onGetAvailableError(data) {
    var unsortedListCycles = "<ul class=\"cyclecontent\"><li>Fant ingen stasjon.</li><ul>";
    var unsortedListLocks = "<ul class=\"lockcontent\"><li>Fant ingen låser.</li><ul>";
    $(("#cycles").html(unsortedListCycles);
    $(("#locks").html(unsortedListLocks);
}
