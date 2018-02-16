var score = 0;			// initialize score to 0
var total = 5;			// total number of questions
var point = 1;			// point value per correct answer
var highest = point * total;		// highest possible score

function init() {
	
	// use sessionStorage for correct answers
	sessionStorage.setItem("a1", "c");
	sessionStorage.setItem("a2", "b");
	sessionStorage.setItem("a3", "a");
	sessionStorage.setItem("a4", "c");
	sessionStorage.setItem("a5", "d");
}

$(document).ready(function () {
	
	// hide all questions and show the 1st question
	$(".questionForm").hide();
	$("#q1").show();
	
	$(".questionForm #submit").click(function () {
		
		// get the current and next question numbers from the data-question 
		// tag of the current form
		current = $(this).parent("form:first").data("question");
		next = $(this).parent("form:first").data("question") + 1;
		
		// hide all questions then show the next question
		$(".questionForm").hide();
		$("#q"+next).fadeIn(600);
		
		// check the answer to the current question
		process(current);
		return false;
	});
});

function process(n) {
	var checkBox = "input[name=q" + n + "]:checked";
	var submitted = $(checkBox).val();					// value of checked box
	var answer = "a" + n;											// answer key in sessionStorage
	
	// increase score for correct answer
	if (submitted == sessionStorage.getItem(answer)) {
			score += point;
	}
	
	// display score when all questions have been answered
	if (n == total) {
		$("#results").html("<h3>Your final score is: " + 
			score + " out of " + highest + ".</h3>");
		
		// show comment only when maximum score is achieved
		if (score == highest) {
			$("#results").append("<p>Congratulations, you know your Henry VIII !</p>")
		}
		
		// add a link to retake quiz
		$("#results").append("<a href='index.html'>Take Quiz Again</a>");
		
		score = 0;
	}
	return false;
}

// start init function when window is loaded
window.addEventListener("load", init, false);