var startPos;
var watchId;


function startTracking () {
	
	// if browser supports geolocation, change button to show stop
	if (navigator.geolocation) {
		document.getElementById("startBtn").style.display = "none";
		document.getElementById("stopBtn").style.display = "inline";
		
		// get current location with success and fail callback functions
		navigator.geolocation.getCurrentPosition (successCallback, errorCallback);
		
		// watchPosition() is called automatically each time the device
		// position changes; also has callback functions for success and fail
		watchId = navigator.geolocation.watchPosition (watchCallback, errorCallback);
	} else {
		alert("Geolocation is not supported by your browser.")
	}
}

// when getCurrentPosition() is successful, this callback function 
// is run with Position object as its input parameter 
function successCallback (pos) {
	document.getElementById("startLat").innerHTML = pos.coords.latitude;
	document.getElementById("startLon").innerHTML = pos.coords.longitude;
}

// callback function when watchPosition() is successful
function watchCallback (pos) {
	document.getElementById("currentLat").innerHTML = pos.coords.latitude;
	document.getElementById("currentLon").innerHTML = pos.coords.longitude;
	
	// update distance (since this is not on a mobile device, distance
	// is calucated from current position to Devil's Tower, Wyoming)
	document.getElementById("distance").innerHTML = 
		calculateDistance(	pos.coords.latitude,
											pos.coords.longitude,
											44.588646,
											-104.698546);
}

// when getCurrentPosition() fails, this callback function is run
// with positionError object as its input parameter 
function errorCallback (err) {
	switch(err.code) {
		case err.PERMISSION_DENIED :
			alert("User denied the request for geolocation");
			break;
		case err.POSITION_UNAVAILABLE :
			alert("User position not available");
			break;
		case err.TIMEOUT :
			alert("User request has timed out");
			break;
		case err.UNKNOWN_ERROR :
			alert("There was an unknown error");
			break;
	}
	stopTracking();
}

// calculate distance between 2 coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
	var R = 6371;
	var dLat = (lat2 - lat1).toRad();
	var dLon = (lon2 - lon1).toRad();
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
					Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;	
}

Number.prototype.toRad = function () {
	return this * Math.PI / 180;
}

// stop tracking by clearing watchPosition() id
function stopTracking() {
	navigator.geolocation.clearWatch(watchId);
	alert("Tracking has stopped");
	document.getElementById("stopBtn").style.display = "none";
	document.getElementById("startBtn").style.display = "inline";
}