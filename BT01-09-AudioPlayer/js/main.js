var audio;

// hide pause button and show only play button
$("#pause").hide();

// setup first song in the list to be played
initAudio($("#playlist li:first-child"));

// setup song by getting .mp3, title, cover image and artist name
// and add 'active' class to the song
function initAudio(element) {
	var song = element.attr("song");
	var title = element.text();
	var cover = element.attr("cover");
	var artist = element.attr("artist");
	
	audio = new Audio("media/" + song);
	
	$("#artist").text(artist);
	$("#title").text(title);
	
	$("img.cover").attr("src", "images/covers/" + cover);
	
	$("#playlist li").removeClass("active");
	element.addClass("active");
}

// play button - change play button to pause button
$("#play").click(function () {
	$("#volume").trigger("change");	// use current volume setting
	audio.play();
	$("#play").hide();
	$("#pause").show();
	showDuration();
});

// pause button - change pause button to play button
$("#pause").click(function () {
	audio.pause();
	$("#pause").hide();
	$("#play").show();
});

// stop button - change pause button to play button
$("#stop").click(function () {
	audio.pause();
	audio.currentTime = 0;
	$("#pause").hide();
	$("#play").show();
});

// next song button
$("#next").click(function () {
	audio.pause();
	audio.currentTime = 0;
	
	// get the song after the current active song
	var nextSong = $("#playlist li.active").next();
	
	// if current song is the last one, go back to the 1st song
	if (nextSong.length == 0) {
		nextSong = $("#playlist li:first-child");
	}
	initAudio(nextSong);
	
	// trigger play button being clicked
	$("#play").trigger("click");
});

// previous song button
$("#prev").click(function () {
	audio.pause();
	audio.currentTime = 0;
	
	// get the song prior to the current active song
	var prevSong = $("#playlist li.active").prev();
	
	// if current song is the 1st one, loop back to the final song	
	if (prevSong.length == 0) {
		prevSong = $("#playlist li:last-child");
	}
	initAudio(prevSong);
	
	// trigger play button being clicked
	$("#play").trigger("click");
});

// when any song is clicked, setup the song and click play
$("#playlist li").click(function () {
	audio.pause();
	audio.currentTime = 0;
	initAudio($(this));
	$("#play").trigger("click");
});

// adjust volume
$("#volume").change(function () {
	audio.volume = parseFloat(this.value / 10);
});

// show time of song in minutes:seconds and also display as a 
// progress bar
function showDuration() {
	$(audio).bind("timeupdate", function () {
		var s = parseInt(audio.currentTime % 60);
		var m = parseInt(audio.currentTime / 60) % 60;
		if (s < 10) {
			s = "0" + s;
		}
		$("#duration").html(m + ":" + s);
		var value = 0;
		if (audio.currentTime > 0) {
			value = Math.floor((audio.currentTime / audio.duration) * 100);
		}
		$("#progress").css("width", value + "%");
		
		// when song is finished, trigger stop button being clicked
		audio.onended = function () {
			$("#stop").trigger("click");
		}
	});
}

