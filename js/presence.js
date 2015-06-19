
var maximum = 100;
var minimum = 1;
var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
var username = "User "+randomnumber;
var ntId = randomnumber;
var message1 = {name : username, networkId : ntId, colorValue : {stroke : "#5E008C", fill : "#FF8F00"}};
var msgInit = 0;
var msgListUsers = 1;
var msgCreateSharedActivity = 2;
var msgListSharedActivities = 3;
var msgJoinSharedActivity = 4;
var msgLeaveSharedActivity = 5;
var msgOnConnectionClosed = 6;
var msgOnSharedActivityUserChanged = 7;
var msgSendMessage = 8;
var msgSendTurtleData = 9;
var groupId = null;
var ldrp = null;
var shared = 0;

var socket = new WebSocket("ws://localhost:8039");
socket.onopen = function(){
	alert("Connected to the server");
	socket.send(JSON.stringify(message1));
}

socket.onmessage = function(evt){
	var res = JSON.parse(evt.data);

	switch(res.type){
		case msgCreateSharedActivity :
			groupId = res.data;
			shared = 1;
			break;
		case msgListSharedActivities :
			fillContentInShare(res);
			break;
		case msgJoinSharedActivity :
			groupId = res.data.id;
			break;
		case msgSendTurtleData :
			ldrp(res.data);
			break;
	}
}



function getInitMessage(){
	
	// return message1;
}

function SugarPresence(){

}

function sync(){
	alert("sync works");
	var msg4 = {type:9, group: groupId};
	socket.send(JSON.stringify(msg4));
	// loadRawProject(data);

}

function share(){
    var message2 = {type : msgCreateSharedActivity, activityId : "org.sugarlabs.ChatPrototype"};
    socket.send(JSON.stringify(message2));
}

function fillContentInShare(res){
	var j,k;
	var shareElem = docById('shareElem');
	shareElem.innerHTML = "<p>Present Group : "+groupId+"</p>";
	for(j in res.data){
		shareElem.innerHTML += "<button id='group' class='"+res.data[j].id+"'>"+res.data[j].id+"</button><br />";				
	}
	// $('.group').on('click',groupClick);
	var group = docById('group');
	group.onclick = function(){
		groupClick(this);
	}
}

function sendRequestToListGroups(){
	socket.send(JSON.stringify({type : msgListSharedActivities}));
}

function groupClick(that){
	
	var group = that.getAttribute('class');
	// alert(group);
	var msg = {type : msgJoinSharedActivity, group : group};
	socket.send(JSON.stringify(msg));
}
