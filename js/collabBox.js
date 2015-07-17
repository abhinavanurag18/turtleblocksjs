var xoPalette = xocolor;
var colorizedColor = null;
var ownerColor = 0;
var icons = {directory:"icons",icon:"module-about_me.svg"};
var iconColorCache = { names : [], values : []};

function CollaborationBox(presence){

	this.presence = presence;
	var me = this;
	this.openCollab = function(){
		var state = 1;
		var nameHolder = document.getElementById("name-holder");
		var colorChooser = document.getElementById("color-chooser");
		var settings = document.getElementById("settings");
		var lbtn = document.getElementById("lbtn");
		var rbtn = document.getElementById("rbtn");
		var submit = document.getElementById("submit");
		if(localStorage.name == undefined && localStorage.color == undefined){
			state = 1;
		}
		else {
			state = 2;
		}

		switch(state){
			case 1 :
				nameHolder.style.display = "block";
				colorChooser.style.display = "none";
				settings.style.display = "none";
				lbtn.style.display = "none";
				rbtn.style.display = "block";
				submit.style.display = "none";
				me.register(state,nameHolder,colorChooser,settings,lbtn,rbtn,submit);
				break;
			case 2 :
				nameHolder.style.display = "none";
				colorChooser.style.display = "none";
				// settings.style.display = "block";
				lbtn.style.display = "none";
				rbtn.style.display = "none";
				submit.style.display = "none";
				// presence.connectToServer();
				setTimeout(function(){me.activateSettings(settings);},1000);
				break;
		}
	}

	this.register = function(state,nameHolder,colorChooser,settings,lbtn,rbtn,submit){
		lbtn.onclick = function(){
			nameHolder.style.display = "block";
			colorChooser.style.display = "none";
			settings.style.display = "none";
			lbtn.style.display = "none";
			rbtn.style.display = "block";
			submit.style.display = "none";
		}

		rbtn.onclick = function(){
			var namediv = document.getElementById("name");
			var name = namediv.value;
			localStorage.name = name;
			var welcome = document.getElementById("welcome");
			welcome.innerHTML = "<b>Welcome " + localStorage.name + ", Choose the color you like.<br/> Click on the icon to change color</b>";
			nameHolder.style.display = "none";
			colorChooser.style.display = "block";
			settings.style.display = "none";
			lbtn.style.display = "block";
			rbtn.style.display = "none";
			submit.style.display = "block";
			colorizedColor = xoPalette.colors[ownerColor];
			me.render("gfg",colorizedColor);
			// alert("returned render");
			var node = document.getElementById("gfg");
			node.onclick = function(){
				ownerColor = ownerColor + 1;
				if (ownerColor >= xoPalette.colors.length)
					ownerColor = 0;
				colorizedColor = xoPalette.colors[ownerColor];
				me.render("gfg",colorizedColor);
			}
		}

		submit.onclick = function(){
			localStorage.color = ownerColor;
			nameHolder.style.display = "none";
			colorChooser.style.display = "none";
			lbtn.style.display = "none";
			rbtn.style.display = "none";
			submit.style.display = "none";
			// presence.connectToServer();
			presence.registerUser();
			// setTimeout(function(){me.activateSettings(settings);},500);
			me.activateSettings(settings);
		}
		
	}

	this.activateSettings = function(settings){
		settings.style.display = "block";
		var shareHeader = document.getElementById("shareHeader");
		var listUsers = document.getElementById("listUsers");
		var listGroup = document.getElementById("listGroup");
		var shareHolder = document.getElementById('share-holder');
		var userHolder = document.getElementById('user-holder');
		var groupHolder = document.getElementById('group-holder');
		// var headerButton = document.getElementsByClassName('header-button');
		me.fillShare();
		
		

		shareHeader.onclick = function(){
			// alert(this.className);
			this.className = this.className + " active";
			listUsers.className = "header-button";
			listGroup.className = "header-button";
			// var shareHolder = document.getElementById('share-holder');
			shareHolder.style.display = "block";
			userHolder.style.display = "none";
			groupHolder.style.display = "none";
		}

		listUsers.onclick = function(){
			// alert(this.className);
			this.className = this.className + " active";
			shareHeader.className = "header-button";
			listGroup.className = "header-button";
			shareHolder.style.display = "none";
			userHolder.style.display = "block";
			groupHolder.style.display = "none";
			// me.presence.getUsersList();
			// me.presence.getGroupsList();
			// if(!me.presence.connected_to){
			// 	var userholder = docById('user-holder');
			// 	userHolder.innerHTML = "<h3> Oops !! There are no active users. :( </h3>";
			// }
			// else {
				//get users list
				//get group list
				//list all the users in the joined group
				me.presence.getUsersList();
				// me.presence.getGroupsList();
			// }
		}

		listGroup.onclick = function(){
			// alert(this.className);
			// alert("listUsers clicked");
			this.className = this.className + " active";
			listUsers.className = "header-button";
			shareHeader.className = "header-button";
			shareHolder.style.display = "none";
			userHolder.style.display = "none";
			groupHolder.style.display = "block";
			me.presence.getUsersList();
			me.presence.getGroupsList();
		}

	}

	this.fillShare = function(){
		me.render("gfgi",colorizedColor);
		document.getElementById('hello').innerHTML = "<h3>Hello <b>" + localStorage.name + "</b></h3>";
	}

	this.fillUsers = function(res,groupId){
		// var userholder = document.getElementById("user-holder");
		// userholder.innerHTML = "";
		// for(var i = 1; i < 11; i++){
			// me.render(i.toString());
			// var username = document.getElementById("user"+i);
			// username.innerHTML = "<b>"+localStorage.name+"</b>";
			// document.getElementById(i.toString()).onmouseover = function(){
			// 	// if(document.getElementById("user"+this.getAttribute('id')).style.display == "block"){
			// 		// document.getElementById("user"+this.getAttribute('id')).style.display = "none";
			// 	// }
			// 	// else {
			// 		document.getElementById("user"+this.getAttribute('id')).style.display = "block";
			// 	// }
				
			// }

			// document.getElementById(i.toString()).onmouseout = function(){
			// 	// if(document.getElementById("user"+this.getAttribute('id')).style.display == "block"){
			// 		// document.getElementById("user"+this.getAttribute('id')).style.display = "none";
			// 	// }
			// 	// else {
			// 		document.getElementById("user"+this.getAttribute('id')).style.display = "none";
			// 	// }
				
			// }

		// }

		var part1 = '<div class="row">';
		var part2 = '<div class="col-md-3">';
		var part3 = '<div class="iconGroup" id="';
		var part4 = '"><div class="userName" id="user';
		var part5 = '"></div></div>';
		var end = '</div>';
		
		var len = res.data.length;
		var userHolder = docById('user-holder');
		if(len == 0){
			userHolder.innerHTML = "<h3> Oops !! There are no active users. :( </h3>";
		}
		else {
			userHolder.innerHTML = part1;
			for(var i = 1; i <= len; i++){
				userHolder.innerHTML += part2 + part3 + i + part4 + i + part5 + end;
				if((i%3 == 0) && (i == len)){
					userHolder.innerHTML += end; 
				}
				else if(i%3 == 0){
					userHolder.innerHTML += end + part1;
				}
			}
			for(var i = 1; i <= len; i++){
				me.render(i.toString(),res.data[i-1].colorvalue);
				var username = document.getElementById("user"+i);
				username.innerHTML = "<b>"+res.data[i-1].name+"</b>";
			}
		}
	}

	this.fillGroups = function(res){
		// alert("fill groups called");
		var part0 = "";

		if(!me.presence.connected_to){
			part0 = '<center><div id="groupMessage">You are not a member of any group.</div></center>';
		}
		else {
			var user = me.presence.getUser(ntId);
			part0 = '<center><div id="groupMessage">Present Group Admin : '+ user.name  +'.</div></center>';
		} 
		var part1 = '<div class="row">';
		var part2 = '<div class="col-md-3">';
		var part3 = '<div class="iconGroup" id="g';
		var parttemp = '" data11 = "';
		var part4 = '"><div class="userName" id="group';
		var part5 = '"></div></div>';
		var end = '</div>';
		var len = res.data.length;
		var groupHolder = docById('group-holder');
		if(len == 0){
			groupHolder.innerHTML = "<h3> Oops !! There are no active groups. :( </h3>";
		}
		else {
			groupHolder.innerHTML = part0 + part1;
			for(var i = 1; i <= len; i++){
				groupHolder.innerHTML += part2 + part3 + i + parttemp + part4 + i + part5 + end;
				// if((i%3 == 0) && (i == len)){
				// 	groupHolder.innerHTML += end; 
				// }
				// else if(i%3 == 0){
				// 	groupHolder.innerHTML += end + part1;
				// }
			}
			groupHolder.innerHTML += end;
			
			

			for(var i = 1; i <= len; i++){

				var username = document.getElementById("group"+i);
				var user = me.presence.getUser(res.data[i-1].users[0]);
				username.innerHTML = "<b>"+user.name+"</b>";
				me.render("g"+i,res.data[i-1].colorvalue);
				var temp = document.getElementById("g"+i);
				temp.setAttribute("data11",res.data[i-1].id);
				temp.onclick = function(){
					var gid = this.getAttribute("data11");
					var msg = {type : msgJoinSharedActivity, group : gid};
					presence.socket.send(JSON.stringify(msg));
				}
			}
		}
	}

	this.render = function(id,color){
		var colorToUse = color;
		var name = icons.directory+"/"+icons.icon;
		var cachename;
		var node = document.getElementById(id);
		node.style.backgroundImage = "url('" + name + "')";			
		if (colorToUse == null) {
			// Try to find colorized version in cache
			colorToUse = xoPalette.colors[localStorage.color];
			cachename = name+"_"+colorToUse.stroke+"_"+colorToUse.fill;				
			for (var i = 0 ; i < iconColorCache.names.length ; i++)
				if (iconColorCache.names[i] == cachename) {
					node.style.backgroundImage = iconColorCache.values[i];
					return;
				}
		} else {
			cachename = name+"_"+colorToUse.stroke+"_"+colorToUse.fill;			
		}
		
		// Build it
		me.colorize(node, colorToUse, function() {
			// Cache it			
			iconColorCache.names.push(cachename);
			iconColorCache.values.push(node.style.backgroundImage);
		});
	}

	this.colorize = function(elem, colors, callback){
		var iconInfo = {
	        "uri": me.getBackgroundURL(elem),
	        "strokeColor": colors.stroke,
	        "fillColor": colors.fill
	    };

	    me.load(iconInfo, function (url) {
	        me.setBackgroundURL(elem, url);
	        if (callback) {
	            callback();
	        }
	    });
	}

	this.setBackgroundURL = function(elem, url) {
	    elem.style.backgroundImage = "url('" + url + "')";
	}

	this.getBackgroundURL = function(elem) {
	    var style = elem.currentStyle || window.getComputedStyle(elem, '');
	    // Remove prefix 'url(' and suffix ')' before return
	    var res = style.backgroundImage.slice(4, -1);
		var last = res.length-1;
		if (res[0] == '"' && res[last] == '"') {
			res = res.slice(1, last);
		}
		return res;
	}

	this.load = function(iconInfo, callback){
		var source;
	    var dataHeader = "data:image/svg+xml,";

	    if ("uri" in iconInfo) {
	        source = iconInfo.uri;
	    } else if ("name" in iconInfo) {
	        source = "lib/graphics/icons/" + iconInfo.name + ".svg";
	    }

	    var fillColor = iconInfo.fillColor;
	    var strokeColor = iconInfo.strokeColor;

	    // If source is already a data uri, read it instead of doing
	    // the XMLHttpRequest
	    if (source.substring(0, 4) == 'data') {
	        var iconData = unescape(source.slice(dataHeader.length));
	        var newData = me.changeColors(iconData, fillColor, strokeColor);
	        callback(dataHeader + escape(newData));
	        return;
	    }

	    var client = new XMLHttpRequest();

	    client.onload = function () {
	        var iconData = this.responseText;
	        var newData = me.changeColors(iconData, fillColor, strokeColor);
	        callback(dataHeader + escape(newData));
	    };

	    client.open("GET", source);
	    client.send();
	}

	this.changeColors = function(iconData, fillColor, strokeColor) {
	    var re;

	    if (fillColor) {
	        re = /(<!ENTITY fill_color ")(.*)(">)/;
	        iconData = iconData.replace(re, "$1" + fillColor + "$3");
	    }

	    if (strokeColor) {
	        re = /(<!ENTITY stroke_color ")(.*)(">)/;
	        iconData = iconData.replace(re, "$1" + strokeColor + "$3");
	    }

	    return iconData;
	}
}

