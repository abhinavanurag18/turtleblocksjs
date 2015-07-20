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
var msgBlockData = 9;
var msgTurtleData = 10;
var groupId = null;
var shared = 0;
var xoPalette = xocolor;
var colorizedColor = null;
var ownerColor = 0;
var TURTLESVG = '<svg xmlns="http://www.w3.org/2000/svg" width="55" height="55">' + '<g transform="matrix(1,0,0,1,-1.5,-0.60)">' + '<path d="m 27.5,48.3 c -0.6,0 -1.1,-0.1 -1.6,-0.1 l 1.3,2.3 1.4,-2.3 c -0.4,0 -0.7,0.1 -1.1,0.1 z" style="fill:fill_color;stroke:stroke_color;stroke-width:3.5" />' + '<path d="m 40.2,11.7 c -2.2,0 -4,1.6 -4.4,3.6 1.9,1.4 3.5,3.1 4.7,5.2 2.3,-0.1 4.1,-2 4.1,-4.3 0,-2.5 -2,-4.5 -4.4,-4.5 z" style="fill:fill_color;stroke:stroke_color;stroke-width:3.5" />' + '<path d="m 40.7,39.9 c -1.2,2.2 -2.8,4.1 -4.8,5.5 0.5,1.9 2.2,3.3 4.3,3.3 2.4,0 4.4,-2 4.4,-4.4 0,-2.3 -1.7,-4.1 -3.9,-4.4 z" style="fill:fill_color;stroke:stroke_color;stroke-width:3.5" />' + '<path d="m 14.3,39.9 c -2.3,0.2 -4.1,2.1 -4.1,4.4 0,2.4 2,4.4 4.5,4.4 2,0 3.8,-1.4 4.2,-3.3 -1.8,-1.5 -3.4,-3.3 -4.6,-5.5 z" style="fill:fill_color;stroke:stroke_color;stroke-width:3.5" />' + '<path d="m 19,15.4 c -0.3,-2.1 -2.1,-3.7 -4.3,-3.7 -2.5,0 -4.5,2 -4.5,4.5 0,2.3 1.9,4.3 4.3,4.4 1.2,-2.1 2.7,-3.8 4.5,-5.2 z" style="fill:fill_color;stroke:stroke_color;stroke-width:3.5" />' + '<path d="m 27.5,12.56 c 1.91,0 3.73,0.41 5.42,1.13 0.74,-1.07 1.91,-2.42 1.33,-3.69 -1.3,-2.76 -3.06,-7.69 -6.75,-7.69 -3.69,0 -5.08,4.93 -6.75,7.69 -0.74,1.22 0.44,2.66 1.21,3.74 1.72,-0.75 3.6,-1.18 5.54,-1.18 z" style="fill:fill_color;stroke:stroke_color;stroke-width:3.5" />' + '<path d="m 43.1,30.4 c 0,4.8 -1.6,9.3 -4.6,12.6 -2.9,3.4 -6.9,5.3 -11,5.3 -4.1,0 -8.1,-1.9 -11,-5.3 -3,-3.3 -4.6,-7.8 -4.6,-12.6 0,-9.8 7,-17.8 15.6,-17.8 8.6,0 15.6,8 15.6,17.8 z" style="fill:fill_color;stroke:stroke_color;stroke-width:3.5" />' + '<path d="m 25.9,33.8 -1.6,-4.7 3.2,-2.6 3.6,2.7 -1.5,4.6 z" style="fill:stroke_color;stroke:none" />' + '<path d="M 27.5,41.6 C 23.5,41.4 22,39.5 22,39.5 l 3.5,-4.1 4.5,0.1 3.1,4.2 c 0,0 -2.9,2 -5.6,1.9 z" style="fill:stroke_color;stroke:none" />' + '<path d="M 18.5,33.8 C 17.6,30.9 18.6,27 18.6,27 l 4,2.1 1.5,4.7 -3.6,4.2 c 0,0 -1.4,-2 -2.1,-4.2 z" style="fill:stroke_color;stroke:none" />' + '<path d="m 19.5,25.1 c 0,0 0.5,-1.9 3,-3.8 2.2,-1.6 4.5,-1.7 4.5,-1.7 l -0.1,5 -3.5,2.7 -3.9,-2.2 z" style="fill:stroke_color;stroke:none" />' + '<path d="M 32.1,27.8 28.6,25 29,19.8 c 0,0 1.8,-0.1 4,1.6 2.2,1.8 3.3,5 3.3,5 l -4.2,1.4 z" style="fill:stroke_color;stroke:none" />' + '<path d="m 31.3,34 1.3,-4.4 4.2,-1.6 c 0,0 0.7,2.7 0,5.7 -0.6,2.3 -2.1,4.4 -2.1,4.4 L 31.3,34 z" style="fill:stroke_color;stroke:none" />' + '</g>' + '</svg>';

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
	this.server = "ws://localhost:8039";
	this.socket = null;
	this.testSocket = null;
	this.collab = null;
	this.usersRes = null;
	this.groupsRes = null;
	this.connected_to = 0;
	this.OnlineUsers = null;
	this.activeGroups = null;
	var me = this;
	this.testServer = function(){
		me.testSocket = new WebSocket(me.server);
		me.testSocket.onopen = function(){
			var sideElem = docById("sideElem");
			sideElem.style.display = "block";
			this.close();
		}

		me.testSocket.onerror = function(){
			alert("Please check your internet connection. You are disconnected from the collaboration server");
			var sideElem = docById("sideElem");
			sideElem.style.display = "none";
		}
	}
	this.connectToServer = function(callback){
		me.socket = new WebSocket(me.server);
		me.socket.onopen = function(){
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
		me.socket.onerror = function(){
			alert("Please check your internet connection. You are disconnected from the collaboration server");
			var sideElem = docById("sideElem");
			sideElem.style.display = "none";
		}

		me.socket.onclose = function(){
			alert("Disconnected");
			var sideElem = docById("sideElem");
			sideElem.style.display = "none";
		}
		me.socket.onmessage = function(evt){
			var res = JSON.parse(evt.data);

			switch(res.type){
				case msgListUsers :
					// console.log(res);
					me.OnlineUsers = res.data;
					me.collab.userList = res.data;
					// me.collab.fillUsers(res,groupId);
					break;
				case msgCreateSharedActivity :
					groupId = res.data;
					me.collab.groupId = groupId;
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
					me.activeGroups = res.data;
					me.collab.groupList = res;
					me.collab.fillGroups(res);
					break;
				case msgJoinSharedActivity :
					groupId = res.data.id;
					var groupDiv = docById('groupMessage');
					me.connected_to = res.data.users[0];
					me.collab.groupId = groupId;
					var user = me.getUser(res.data.users[0]);
					groupDiv.innerHTML = "Present Group : " + user.name;
					// var syncEl = docById('syncElem');
					// syncEl.style.display = "block";
					var sideElem = docById('sideElem');
					sideElem.style.backgroundColor = res.data.colorvalue.fill;
					
					break;
				case msgSendMessage :
					switch(res.data.datatype){
						case msgBlockData :
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
								console.log("Its loaded");
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
											afterLoadTurtles[i].peername = res.data.user.name;
											afterLoadTurtles[i].peerntid = res.data.user.networkId;
											afterLoadTurtles[i].peercolorvalue = res.data.user.colorvalue;
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
										sendStackToTrashCollab(me.blocks,peerTurtles[h].startBlock);
										// var img = 
										// peerTurtles[h].doTurtleShell(55,TURTLESVG.replace(/fill_color/g, res.data.user.colorvalue.fill).replace(/stroke_color/g, res.data.user.colorvalue.stroke));
										// console.log(peerTurtles[h].bitmap);

									}
								},500); 
							}
							break;
						case msgTurtleData :
							var data1 = res.data.content;
							for(var i in me.turtles.turtleList){
								alert("uuid : " + me.turtles.turtleList[i].uuid);
								if(me.turtles.turtleList[i].uuid == data1.uuid){
									var clog = docById('console');
						            // if(myTurtle.peerntid != null){
						            clog.innerHTML = myTurtle.peername + "'s turtle is moving :  x : " + myTurtle.x + " y : " + myTurtle.y;
								}
							}
							break;
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

	this.getUsersGroup = function(gid){
		for(var i in me.activeGroups){
			if(me.activeGroups[i].id == gid){
				return me.activeGroups[i].users;
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
			me.turtleSync();
			setTimeout(function(){me.sync();},500);
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

	this.turtleSync = function(){
		var data = [];
		for(var i in me.turtles.turtleList){
			var uuid = me.turtles.turtleList[i].uuid;
			var x = me.turtles.turtleList[i].x;
			var y = me.turtles.turtleList[i].y;
			var deg = me.turtles.turtleList[i].orientation;
			var data1 = {uuid : uuid, x : x , y : y , deg : deg};
			data.push(data1);
		}
		// me.sendMessage(data);
		var msg3 = {type : msgSendMessage, group : groupId, data : {user : message1 , datatype : msgTurtleData, content : data}};
		me.socket.send(JSON.stringify(msg3));
	}

	this.moveTurtle = function(uuid,x,y,deg){
		var data = {uuid : uuid, x : x , y : y , deg : deg};
		var msg3 = {type : msgSendMessage, group : groupId, data : {user : message1 , datatype : msgTurtleData, content : data}};
		me.socket.send(JSON.stringify(msg3));
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
		var msg3 = {type : msgSendMessage, group : groupId, data : {user : message1 , datatype : msgBlockData, content : data}};
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

function sendStackToTrashCollab(blocks, myBlock) {
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

    // if (myBlock.name == 'start') {
    //     turtle = myBlock.value;
    //     if (turtle != null) {
    //         console.log('putting turtle ' + turtle + ' in the trash');
    //         blocks.turtles.turtleList[turtle].trash = true;
    //         blocks.turtles.turtleList[turtle].container.visible = false;
    //     } else {
    //         console.log('null turtle');
    //     }
    // }

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

