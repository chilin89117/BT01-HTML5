// get the todo list from localStorage and parse it into JS object
var todoList = JSON.parse(localStorage.getItem("todos"));

$(document).ready(function () {
	
	// use jQuery UI datepicker widget for date inputs
	$("#todo_date_add, #todo_date_edit").datepicker({
		changeMonth: true,
		changeYear: true	,
		showOtherMonths: true
	});
	
	// if todos exist, add them to home page 
	if (todoList != undefined) {
		var i = 0;
		
		// use prepend() to display the last entered/edited one on top
		$.each(todoList, function (k, v) {
			$("#todos").prepend('<li id="Task-' + i + '">' + 
			'<a id="todo_link" href="#edit" data-todo_name="' + 
			v.todo_name +'" data-todo_date="' + v.todo_date + '" ' +
			'data-transition="flip">' +	v.todo_name + '<span>' + 
			v.todo_date + '</span></a></li>');
			i++;
		});
		$("#todos").listview("refresh");
	}

	// save button on add page to add a Todo
	$("#addSave-btn").click(function (event) {
		var todo_name = $("#todo_name_add").val();
		var todo_date = $("#todo_date_add").val();
		
		if (todo_name == "") {
			alert("Please give the todo a name.");
			event.preventDefault();
		} else if (todo_date == "") {
			alert("Please select a date.");
			event.preventDefault();
		} else {
			var todoList = JSON.parse(localStorage.getItem("todos"));
			if (todoList == null) {
				todoList = [];
			}
			var new_todo = {
				"todo_name": todo_name,
				"todo_date": todo_date		
			}
			todoList.push(new_todo);
			localStorage.setItem("todos", JSON.stringify(todoList));
		}
	});
	
	// select a single Todo to edit from home page and add data
	// to localStorage as the currently selected item
	$("#todos #todo_link").click(function () {
		localStorage.setItem("currentTodoName", $(this).data("todo_name"));
		localStorage.setItem("currentTodoDate", $(this).data("todo_date"));
	});
	
	// when edit page is shown, load currently selected Todo
	$(document).on("pageshow", "#edit", function () {
		$("#todo_name_edit").val(localStorage.getItem("currentTodoName"));
		$("#todo_date_edit").val(localStorage.getItem("currentTodoDate"));
	});
	
	// edit a Todo
	$("#editSave-btn").click(function () {
		var currentTodoName = localStorage.getItem("currentTodoName");
		var currentTodoDate = localStorage.getItem("currentTodoDate");
		var todo_name = $("#todo_name_edit").val();
		var todo_date = $("#todo_date_edit").val();
		
		if (todo_name == "") {
			alert("Please give the todo a name.");
		} else if (todo_date == "") {
			alert("Please select a date.");
		} else {
			
			// if Todo has been changed, delete it from localStorage
			if (todo_name != currentTodoName || todo_date != currentTodoDate) {
				var todoList = JSON.parse(localStorage.getItem("todos"));
				for (var i = 0; i < todoList.length; i++) {
					if (todoList[i].todo_name == currentTodoName &&
						todoList[i].todo_date == currentTodoDate) {
						todoList.splice(i, 1);
					}
				}
				// add edited Todo as a new Todo
				var updated_todo = {
					"todo_name": todo_name,
					"todo_date": todo_date		
				}
				todoList.push(updated_todo);
				localStorage.setItem("todos", JSON.stringify(todoList));
			}		
		}
	});
	
	// delete a single Todo from edit page
	$("#edit_form #delete").click(function () {
		if (confirm("Are you sure?")) {
			var currentTodoName = localStorage.getItem("currentTodoName");
			var currentTodoDate = localStorage.getItem("currentTodoDate");
			var todoList = JSON.parse(localStorage.getItem("todos"));
			for (var i = 0; i < todoList.length; i++) {
				if (todoList[i].todo_name == currentTodoName &&
						todoList[i].todo_date == currentTodoDate) {
					todoList.splice(i, 1);
				}
			}
			localStorage.setItem("todos", JSON.stringify(todoList));
			$.mobile.changePage($("#home"), {transition:"flip"});
		}
	});
	
	// refreshing home page to show new or updated Todos
	$(document).on("pageshow", "#home", function () {
		window.location.reload();
	});
	
	// clear Todos
	$("#clear_btn").click(function () {
		if (confirm("Are you sure?")) {
			localStorage.clear();	
		}
	});
});