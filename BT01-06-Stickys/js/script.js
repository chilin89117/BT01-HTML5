var db = null;

if(window.openDatabase){
	db = openDatabase("NoteTest","1.0","Stickys Database",1024*1024);
	if(!db){
		alert("Failed to open database");
	}
} else {
	alert("Failed to open database, make sure your browser supports HTML5 web storage");
}

var captured = null;		// boolean to indicate if a sticky is selected by mouse
var highestZ = 0;			// z-index to put latest/selected sticky on top
var highestId = 0;			// id of sticky

// function to create a new sticky note on DOM document
function Note() {
	var self = this;
	
	// create main div for the sticky
	var stickyDiv = document.createElement('div');
	stickyDiv.className = 'note';
	
	// see prototype definition
	stickyDiv.addEventListener('mousedown', function(e) { 
		return self.onMouseDown(e)
	}, false	);
	
	// see prototype definition
	stickyDiv.addEventListener('click', function() {
		return self.onNoteClick()
	}, false	);
	
	self.note = stickyDiv;
	
	// create a div for the close button & append to main div
	var closeBtn = document.createElement('div');
	closeBtn.className = 'closebutton';
	closeBtn.addEventListener('click',	function(event) {
		return self.close(event)
	}, false	);
	stickyDiv.appendChild(closeBtn);
	
	// create a div for the edit field & append to main div
	var edit = document.createElement('div');
	edit.className = 'edit';
	edit.setAttribute('contenteditable', true);
	edit.addEventListener('keyup', function() {
		return self.onKeyUp()
	}, 	false);
	stickyDiv.appendChild(edit);
	self.editField = edit;
	
	// create a div for the timestamp & append to main div
	var ts = document.createElement('div');
	ts.className = 'timestamp';
	ts.addEventListener('mousedown', function(e) {
		return self.onMouseDown(e)
	}, false);
	stickyDiv.appendChild(ts);
	self.lastModified = ts;
	
	document.body.appendChild(stickyDiv);
	return self;
}

// define prototype properties for the Note object
Note.prototype = {
	get id() {
		if (!("_id" in this)) this._id = 0;
		return this._id;
	},
	
	set id(x) {
		this._id = x;
	},
	
	get text() {
		return this.editField.innerHTML;
	},
	
	set text(x) {
		this.editField.innerHTML = x;
	},
	
	get timestamp() {
		if (!("_timestamp" in this))	this._timestamp = 0;
		return this._timestamp;
	},
	
	set timestamp(x) {
		if (this._timestamp == x) return;
		this._timestamp = x;
		var date = new Date();
		date.setTime(parseFloat(x));
		this.lastModified.textContent = modifiedString(date);
	},
	
	get left() {
		return this.note.style.left;
	},
	
	set left(x){
		this.note.style.left = x;
	},
	
	get top(){
		return this.note.style.top;
	},
	
	set top(x){
		this.note.style.top = x;
	},
	
	get zIndex(){
		return this.note.style.zIndex;
	},
	
	set zIndex(x){
		this.note.style.zIndex = x;
	},

	// when close button is clicked, delete sticky from database and
	// remove it from DOM
	close: function(event) {
		this.cancelPendingSave();
		var note = this;
		db.transaction(function(tx){
			tx.executeSql("DELETE FROM MyStickys WHERE id = ?", [note.id]);
		});
		document.body.removeChild(this.note);
	},
	
	saveSoon: function() {
		this.cancelPendingSave();
		var self = this;
		this._saveTimer = setTimeout(function() {
			self.save()
		}, 200);
	},
	
	cancelPendingSave: function() {
		if (!("_saveTimer" in this)) return;
		clearTimeout(this._saveTimer);
		delete this._saveTimer;
	},

	save: function() {
		this.cancelPendingSave();
		if ("dirty" in this) {
			this.timestamp = new Date().getTime();
			delete this.dirty;
		}
	
		var note = this;
		db.transaction(function (tx) {
			tx.executeSql(
				"UPDATE MyStickys SET note = ?, timestamp = ?, left = ?, top = ?, zindex = ? WHERE id = ?", 
				[note.text, note.timestamp, note.left, note.top, note.zIndex, note.id]
			);
		});
	},
	
	// save the sticky as a new entry in database
	saveAsNew: function() {
		//this.timestamp = new Date().getTime();
		var note = this;
		db.transaction(function (tx) {
			tx.executeSql(
				"INSERT INTO MyStickys (id, note, timestamp, left, top, zindex) VALUES (?, ?, ?, ?, ?, ?)", 
				[note.id, note.text, note.timestamp, note.left, note.top, note.zIndex]
			);
		}); 
	},
	
	onMouseDown: function(e){
		captured = this;
		var self = this;
		self.startX = e.clientX - self.note.offsetLeft;
		self.startY = e.clientY - self.note.offsetTop;
		self.zIndex = ++highestZ;
	
		if (!("mouseMoveHandler" in self)) {
			self.mouseMoveHandler = function(e) {return self.onMouseMove(e)}
			self.mouseUpHandler = function(e) {return self.onMouseUp(e)}
		} 
	
		document.addEventListener('mousemove', self.mouseMoveHandler, true);
		document.addEventListener('mouseup', self.mouseUpHandler, true);
		return false;
	},

	onMouseMove: function(e){
		if (this != captured) return true;
		this.left = e.clientX - this.startX + 'px';
		this.top = e.clientY - this.startY + 'px';
		return false;
	},

	onMouseUp: function(e){
		document.removeEventListener('mousemove', this.mouseMoveHandler, true);
		document.removeEventListener('mouseup', this.mouseUpHandler, true);
		this.save();
		return false;
	},

	onNoteClick: function(e){
		this.editField.focus();
		getSelection().collapseToEnd();
	},
	
	onKeyUp: function(){
		this.dirty = true;
		this.saveSoon();
	},
}

function loaded(){
	db.transaction(function(tx) {
		tx.executeSql(
			"SELECT COUNT(*) FROM MyStickys", [], 
			function(result) {
				loadNotes();
			}, 
			function(tx, error) {
				tx.executeSql(
					"CREATE TABLE MyStickys (id REAL UNIQUE, note TEXT, timestamp REAL, left TEXT, top TEXT, zindex REAL)", 
					[], 
					function(result) { 
						loadNotes(); 
					}
				);
			}
		);
	});
}

function loadNotes(){
	db.transaction(function(tx) {
		tx.executeSql(
			"SELECT id, note, timestamp, left, top, zindex FROM MyStickys", [], 
			function(tx, result) {
				for (var i = 0; i < result.rows.length; ++i) {
					var row = result.rows.item(i);
					var note = new Note();
					note.id = row['id'];
					note.text = row['note'];
					note.timestamp = row['timestamp'];
					note.left = row['left'];
					note.top = row['top'];
					note.zIndex = row['zindex'];
	
					if (row['id'] > highestId) highestId = row['id'];
					if (row['zindex'] > highestZ) highestZ = row['zindex'];
				}
	
				if (!result.rows.length) newNote();
			}, 
			function(tx, error) {
				alert('Failed to retrieve notes from database - ' + error.message);
				return;
			} 
		);
	});
}

function modifiedString(date){
	return 'Note Last Modified: ' + date.getFullYear() + '-' + 
		(date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + 
		':' + date.getMinutes() + ':' + date.getSeconds();
}

// this function is called when "Add New Sticky" button is clicked
// (see index.html)
// create a new Note object, set id, timestamp, position, and z-index
// properties; insert into database using saveAsNew() defined in its
// prototype
function newNote () {
	var note = new Note();
	note.id = ++highestId;
	note.timestamp = new Date().getTime();
	note.left = Math.round(Math.random() * 400) + 'px';
	note.top = Math.round(Math.random() * 500) + 'px';
	note.zIndex = ++highestZ;
	note.saveAsNew();
}

if (db != null) addEventListener('load', loaded, false);