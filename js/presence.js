require(['activity/xocolor']);

var maximum = 100;
var minimum = 1;
var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
var username = "User "+randomnumber;
var ntId = randomnumber;
var message1 = {name : username, networkId : ntId, colorvalue : {stroke : "#5E008C", fill : "#FF8F00"}};
var msgInit = 0;
var msgListUsers = 1;
var msgCreateSharedActivity = 2;
var msgListSharedActivities = 3;
var msgJoinSharedActivity = 4;
var msgLeaveSharedActivity = 5;
var msgOnConnectionClosed = 6;
var msgOnSharedActivityUserChanged = 7;
var msgSendMessage = 8;
var groupId = null;
var shared = 0;
var xoPalette = xocolor;
var colorizedColor = null;
var ownerColor = 0;

var icons = {directory:"icons",icon:"module-about_me.svg"};
var iconColorCache = { names : [], values : []};

function SugarPresence(loadRawProject,saveLocally,turtles,blocks){
	this.loadRawProject = loadRawProject;
	this.saveLocally = saveLocally;
	this.peers = [];
	this.turtles = turtles;
	this.blocks = blocks;
	this.logo = null;
	this.shared = false;
	this.server = "ws://server.sugarizer.org:8039";
	this.socket = null;
	this.testSocket = null;
	this.collab = null;
	this.usersRes = null;
	this.groupsRes = null;
	this.connected_to = 0;
	this.OnlineUsers = null;
	var me = this;
	this.testServer = function(){
		this.testSocket = new WebSocket(this.server);
		this.testSocket.onopen = function(){
			var sideElem = docById("sideElem");
			sideElem.style.display = "block";
			this.close();
		}

		this.testSocket.onerror = function(){
			alert("Please check your internet connection. You are disconnected from the collaboration server");
			var sideElem = docById("sideElem");
			sideElem.style.display = "none";
		}
	}
	this.connectToServer = function(callback){
		this.socket = new WebSocket(this.server);
		this.socket.onopen = function(){
			var sideElem = docById("sideElem");
			sideElem.style.display = "block";
			if(callback){
				callback();
			}
			// message1.name = localStorage.name;
			// message1.colorvalue.stroke = xoPalette.colors[localStorage.color].stroke;
			// message1.colorvalue.fill = xoPalette.colors[localStorage.color].fill;
			// me.socket.send(JSON.stringify(message1));
			// me.setDispatch();
		}
		this.socket.onerror = function(){
			alert("Please check your internet connection. You are disconnected from the collaboration server");
			var sideElem = docById("sideElem");
			sideElem.style.display = "none";
		}

		this.socket.onclose = function(){
			alert("Disconnected");
			var sideElem = docById("sideElem");
			sideElem.style.display = "none";
		}
		this.socket.onmessage = function(evt){
			var res = JSON.parse(evt.data);

			switch(res.type){
				case msgListUsers :
					// console.log(res);
					me.OnlineUsers = res.data;
					me.collab.fillUsers(res);
					break;
				case msgCreateSharedActivity :
					groupId = res.data;
					shared = 1;
					me.shared = true;
					var groupDiv = docById('share');
					me.connected_to = ntId;
					var sideel = docById('sideElem');
					sideel.style.backgroundColor = xocolor.colors[localStorage.color].fill;
					// var gdiv = docById('groupMessage');
					groupDiv.innerHTML = "<h4><b>THIS ACTIVITY IS SHARED</b></h4>";
					groupDiv.className = "button-shared";
					// gdiv.innerHTML = "<h4>Present Group : " + ntId + "</h4>";
					break;
				case msgListSharedActivities :
					me.collab.fillGroups(res);
					break;
				case msgJoinSharedActivity :
					groupId = res.data.id;
					var groupDiv = docById('groupMessage');
					me.connected_to = res.data.users[0];
					var user = me.getUser(res.data.users[0]);
					groupDiv.innerHTML = "Present Group : " + user.name;
					// var syncEl = docById('syncElem');
					// syncEl.style.display = "block";
					var sideElem = docById('sideElem');
					sideElem.style.backgroundColor = res.data.colorvalue.fill;
					sideElem.style.
					break;
				case msgSendMessage :
					if(res.data.user.networkId != ntId){
						var user = res.data.user;
						var tid = me.getTurtleList(user);
						if(tid == null){
							console.log("inside if");
						}
						else {
							console.log("Inside else");
							for(var i in tid){
								var myBlock = tid[i].startBlock;
								sendStackToTrash(me.blocks,myBlock);
							}
						}
						var currentTurtles = turtles.turtleList;
						var prelen = currentTurtles.length;
						me.loadRawProject(res.data.content);
						var peerTurtles = [];
						setTimeout(function(){
							var afterLoadTurtles = turtles.turtleList;
							var j = 0;
							for(var i in afterLoadTurtles){
								if(j < prelen){
									j++;
									continue;
								}
								else {
									peerTurtles.push(afterLoadTurtles[i]);
								}
								j++;
							}
							for(var i in me.peers){
								if(me.peers[i].user.networkId == res.data.user.networkId){
									for(var j in peerTurtles){
										me.peers[i].turtleList.push(peerTurtles[j]);
									}
								}
								else {
									var peerdata = { user : res.data.user, turtleList : []};
									for(var j in peerTurtles){
										peerdata.turtleList.push(peerTurtles[j]);
									}
									me.peers.push(peerdata);
								}
							}
							for(var h in peerTurtles){
								me.logo.runLogoCommands(me.blocks.blockList.indexOf(peerTurtles[h].startBlock));
							}
						},500); 
					}
					
					
					break;
				case msgOnSharedActivityUserChanged :
					me.getUsersList();
					var peerdata = { user : res.data.user, turtleList : []};
					if(res.data.move == -1){

					}
					else {
						me.peers.push(peerdata);

					}
					
					break;
			}
		}
		
	}

	this.getUser = function(ntId){
		for(var i in me.OnlineUsers){
			if(me.OnlineUsers[i].networkId == ntId){
				return me.OnlineUsers[i];
			}
		}
	}

	this.registerUser = function(){
		message1.name = localStorage.name;
		message1.colorvalue.stroke = xoPalette.colors[localStorage.color].stroke;
		message1.colorvalue.fill = xoPalette.colors[localStorage.color].fill;
		me.socket.send(JSON.stringify(message1));
	}

	this.syncer = function(){
		if(groupId != null){
			me.sync();
		}
	}

	this.setCollab = function(collab){
		me.collab = collab;
	}
	

	this.share = function(){
        var message2 = {type : msgCreateSharedActivity, activityId : "org.sugarlabs.TurtleBlocks"};
        me.socket.send(JSON.stringify(message2));
	}

	this.sync = function(){
		me.saveLocally();
        var p = localStorage.currentProject;
        var data = localStorage['SESSION' + p];
        me.sendMessage(data);
	}

	this.fillContentUsers = function(res){
		
		
	}

	this.fillContentGroups = function(res){

	}

	this.fillContentInShare = function(res){
		var j,k;
		// var shareElem = docById('shareElem');
		var groupList = docById('groupList');
		// shareElem.innerHTML = "<p>Present Group : "+groupId+"</p>";
		groupList.innerHTML = "";
		for(j in res.data){
			groupList.innerHTML += "<div class='groupItem' id='groupId' data11='"+res.data[j].id+"'><b>User "+res.data[j].users[0]+"</b></div><br />";				
		}
		// $('.group').on('click',groupClick);
		// var group = document.getElementsByClassName("groupItem");
		var group = docById('groupId');
		// alert(group);
		group.onclick = function(){
			me.groupClick(this);
		}
	}

	this.getUsersList = function(){
		me.sendRequestToListUsers();
	}

	this.getGroupsList = function(){
		// alert("getGroupsList called");
		me.sendRequestToListGroups();
	}

	this.sendRequestToListGroups = function(){
		me.socket.send(JSON.stringify({type : msgListSharedActivities}));
	}

	this.sendRequestToListUsers = function(){
		me.socket.send(JSON.stringify({type : msgListUsers}));
	}

	this.groupClick = function(that){
		
		var group = that.getAttribute('data11');
		// alert(group);
		var msg = {type : msgJoinSharedActivity, group : group};
		me.socket.send(JSON.stringify(msg));
	}

	this.sendMessage = function(data){
		var msg3 = {type : msgSendMessage, group : groupId, data : {user : message1 , content : data}};
		me.socket.send(JSON.stringify(msg3));
	}

	this.getTurtleList = function(user){
		for(var i in me.peers){
			if(me.peers[i].user.networkId == user.networkId){
				return me.peers[i].turtleList;
			}
		}
	}

	this.extractTurtles = function(blockList){
		for(var i in blockList){
			if(blockList[i].name == 'start'){

			}
		}
	}

	this.setLogo = function(logo){
		me.logo = logo;
	}

	this.setDispatch = function(){
		me.dispatch_methods = {
			't': me.turtle_request,
			'T': me.receive_turtle_dict,
			'R': me.reskin_turtle,
			'f': me.move_forward,
			'a': me.move_in_arc,
			'r': me.rotate_turtle,
			'x': me.set_xy,
			'W': me.draw_text,
			'c': me.set_pen_color,
			'g': me.set_pen_gray_level,
			's': me.set_pen_shade,
			'w': me.set_pen_width,
			'p': me.set_pen_state,
			'F': me.fill_polygon,
			'P': me.draw_pixbuf,
			'B': me.paste,
			'S': me.speak
		}
			
	}

	this.turtle_request = function(){
		// var name = me.turtles.turtleList.length;
		// var turtle = new Turtle(name,me.turtles);
		me.turtles.add();
	}

	this.receive_turtle_dict = function(){

	}

	this.reskin_turtle = function(){

	}

	this.move_forward = function(){

	}

	this.move_in_arc = function(){

	}

	this.rotate_turtle = function(){

	}

	this.set_xy = function(){

	}

	this.draw_text = function(){

	}

	this.set_pen_color = function(){

	}

	this.set_pen_gray_level = function(){

	}

	this.set_pen_shade = function(){

	}

	this.set_pen_width = function(){

	}

	this.set_pen_state = function(){

	}

	this.fill_polygon = function(){

	}

	this.draw_pixbuf = function(){

	}

	this.paste = function(){

	}

	this.speak = function(){

	}

	

}

function sendStackToTrash(blocks, myBlock) {
    var thisBlock = blocks.blockList.indexOf(myBlock);
    // disconnect block
    var b = myBlock.connections[0];
    if (b != null) {
        for (var c in blocks.blockList[b].connections) {
            if (blocks.blockList[b].connections[c] == thisBlock) {
                blocks.blockList[b].connections[c] = null;
                break;
            }
        }
        myBlock.connections[0] = null;
    }

    if (myBlock.name == 'start') {
        turtle = myBlock.value;
        if (turtle != null) {
            console.log('putting turtle ' + turtle + ' in the trash');
            blocks.turtles.turtleList[turtle].trash = true;
            blocks.turtles.turtleList[turtle].container.visible = false;
        } else {
            console.log('null turtle');
        }
    }

    if (myBlock.name == 'action') {
        var actionArg = blocks.blockList[myBlock.connections[1]];
        if (actionArg) {
            var actionName = actionArg.value;
            for (var blockId = 0; blockId < blocks.blockList.length; blockId++) {
                var myBlock = blocks.blockList[blockId];
                var blkParent = blocks.blockList[myBlock.connections[0]];
                if (blkParent == null) {
                    continue;
                }
                if (['nameddo', 'do', 'action'].indexOf(blkParent.name) != -1) {
                    continue;
                }
                var blockValue = myBlock.value;
                if (blockValue == _('action')) {
                    continue;
                }
                if (blockValue == actionName) {
                    blkParent.hide();
                    myBlock.hide();
                    myBlock.trash = true;
                    blkParent.trash = true;
                }
            }

            var blockPalette = blocks.palettes.dict['actions'];
            var blockRemoved = false;
            for (var blockId = 0; blockId < blockPalette.protoList.length; blockId++) {
                var block = blockPalette.protoList[blockId];
                // if (block.name == 'do' && block.defaults[0] != _('action') && block.defaults[0] == actionName) {
                if (block.name == 'nameddo' && block.privateData != _('action')) {
                    blockPalette.protoList.splice(blockPalette.protoList.indexOf(block), 1);
                    delete blocks.protoBlockDict['myDo_' + actionName];
                    blockPalette.y = 0;
                    blockRemoved = true;
                }
            }
            // Force an update if a block was removed.
            if (blockRemoved) {
                regeneratePalette(blockPalette);
            }
        }
    }

    // put drag group in trash
    blocks.findDragGroup(thisBlock);
    for (var b = 0; b < blocks.dragGroup.length; b++) {
        var blk = blocks.dragGroup[b];
        console.log('putting ' + blocks.blockList[blk].name + ' in the trash');
        blocks.blockList[blk].trash = true;
        blocks.blockList[blk].hide();
        blocks.refreshCanvas();
    }
}