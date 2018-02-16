function showMood() {
	var name = document.getElementById("name").value;
	var mood = document.getElementById("mood").value;
	
	if (!name || !mood) {
		alert("Please fill in all fields.");
		return false;
	}
	
	if (mood === "happy") {
		face = " :)";
	}else if (mood === "sad") {
		face = " :(";
	} else {
		face = " :|";
	}
	
	moodString = name + ' is ' + mood + ' today.' + face;
	
	var holder = document.getElementById("holder");
	holder.innerHTML = moodString;
}

function clearMood() {
	document.getElementById("moodForm").reset();
	var holder = document.getElementById("holder");
	holder.innerHTML = "";
}