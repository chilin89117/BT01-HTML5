$(document).ready(function(){
	//Open Database
	var request = indexedDB.open('customermanager',1);
	
	request.onupgradeneeded = function(e){
		var db = e.target.result;
		
		if(!db.objectStoreNames.contains('customers')){
			var os = db.createObjectStore('customers',{keyPath: "id", autoIncrement:true});
			//Create Index for Name
			os.createIndex('name','name',{unique:false});
		}
	}
	
	request.onsuccess = function(e){
		console.log('Success: Opened Database...');
		db = e.target.result;
		//Show Customers
		showCustomers();
	}
	
	request.onerror = function(e){
		console.log('Error: Could Not Open Database...');
	}
});

//Add Customer
$("#addBtn").click(function () {
	var cName = $('#name').val();
	var cEmail = $('#email').val();
	
	var tx = db.transaction(["customers"], "readwrite");
	var os = tx.objectStore("customers");
	
	//Define Customer
	var customer = {
		name: cName,
		email: cEmail
	}
	
	//Perform the Add
	var request = os.add(customer);
	
	request.onsuccess = function(e){
		window.location.href="index.html";
	}
	
	request.onerror = function(e){
		alert("Sorry, the customer was not added");
		console.log('Error', e.target.error.name);
	}
});

//Display Customers
function showCustomers(e){
	var tx = db.transaction(["customers"], "readonly");
	var os = tx.objectStore("customers");
	var idx = os.index('name');
	
	var output = '';
	idx.openCursor().onsuccess = function(e){
		var cursor = e.target.result;
		if(cursor){
			output += "<tr id='customer_"+cursor.value.id+"'>";
			output += "<td>"+cursor.value.id+"</td>";
			output += "<td><span class='cursor customer' contenteditable='true' " +
								"data-field='name' data-id='" + cursor.value.id + "'>" +
								cursor.value.name + "</span></td>";
			output += "<td><span class='cursor customer' contenteditable='true' " +
								"data-field='email' data-id='" + cursor.value.id + "'>" +
								cursor.value.email + "</span></td>";
			output += "<td><a onclick='removeCustomer("+cursor.value.id+")' " +
								"href=''>Delete</a></td></tr>";
			cursor.continue();
		}
		$('#customers').html(output);
	}
}

//Delete A Customer
function removeCustomer(id){
	var tx = db.transaction(["customers"],"readwrite");
	var os = tx.objectStore("customers");

	var request = os.delete(id);
	
	//Success
	request.onsuccess = function(){
		console.log('Customer ' + id + ' deleted.');
		$('#customer_' + id).remove();
	}
	
	//Error
	request.onerror = function(e){
		alert("Sorry, the customer was not removed.");
		console.log('Error', e.target.error.name);
	}
}

//Clear ALL Customers
$("#danger").click(function () {
	if (confirm("Are you sure?")) {
		indexedDB.deleteDatabase('customermanager');
		window.location.href="index.html";	
	}
});

//Update Customers
$('#customers').on('blur','.customer',function(){
	//Newly entered text
	var newText = $(this).text();
	//Field that was edited
	var field = $(this).data('field');
	//Customer ID
	var id = $(this).data('id');
	
	var tx = db.transaction(["customers"], "readwrite");
	var os = tx.objectStore("customers");
	
	var request = os.get(id);
	
	request.onsuccess = function(){
		var data = request.result;
		if(field == 'name'){
			data.name = newText;
		} else if(field == 'email'){
			data.email = newText;
		}
		
		//Store Updated Text
		var requestUpdate = os.put(data);
		
		requestUpdate.onsuccess = function(){
			console.log('Customer field updated...');
		}
		
		requestUpdate.onerror = function(){
			console.log('Error: Customer field NOT updated...');
		}
	}
});