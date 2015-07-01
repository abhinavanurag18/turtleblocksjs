var ownerColor = 0;
var xoPalette = xocolor;
var colorizedColor = null;
var icons = {directory:"icons",icon:"module-about_me.svg"};

$(document).ready(function(){
	// var name = localStorage.name;
	// var color = localStorage.color;
	// // var xoPalette = new xoPalette();
	// // alert(xocolor.colors.length);
	// if(name == undefined && color == undefined){

	// }
	colorizedColor = xoPalette.colors[ownerColor];
	render();
	$('.icon').click(function(){
		ownerColor = ownerColor + 1;
		if (ownerColor >= xoPalette.colors.length)
			ownerColor = 0;
		colorizedColor = xoPalette.colors[ownerColor];
		render();
	});
});

function render(){
	var colorToUse = colorizedColor;
	var name = icons.directory+"/"+icons.icon;
	var cachename;
	var node = document.getElementById("gfg");
	node.style.backgroundImage = "url('" + name + "')";			
	if (colorToUse == null) {
		// Try to find colorized version in cache
		// colorToUse = preferences.getColor();
		// cachename = name+"_"+colorToUse.stroke+"_"+colorToUse.fill;				
		// for (var i = 0 ; i < iconColorCache.names.length ; i++)
		// 	if (iconColorCache.names[i] == cachename) {
		// 		node.style.backgroundImage = iconColorCache.values[i];
		// 		return;
		// 	}
	} else {
		cachename = name+"_"+colorToUse.stroke+"_"+colorToUse.fill;			
	}
	
	// Build it
	colorize(node, colorToUse, function() {
		// Cache it			
		// iconColorCache.names.push(cachename);
		// iconColorCache.values.push(node.style.backgroundImage);
	});
}

function colorize(elem, colors, callback){
	var iconInfo = {
        "uri": getBackgroundURL(elem),
        "strokeColor": colors.stroke,
        "fillColor": colors.fill
    };

    load(iconInfo, function (url) {
        setBackgroundURL(elem, url);
        if (callback) {
            callback();
        }
    });
}

function setBackgroundURL(elem, url) {
    elem.style.backgroundImage = "url('" + url + "')";
}

function getBackgroundURL(elem) {
    var style = elem.currentStyle || window.getComputedStyle(elem, '');
    // Remove prefix 'url(' and suffix ')' before return
    var res = style.backgroundImage.slice(4, -1);
	var last = res.length-1;
	if (res[0] == '"' && res[last] == '"') {
		res = res.slice(1, last);
	}
	return res;
}

function load(iconInfo, callback){
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
        var newData = changeColors(iconData, fillColor, strokeColor);
        callback(dataHeader + escape(newData));
        return;
    }

    var client = new XMLHttpRequest();

    client.onload = function () {
        var iconData = this.responseText;
        var newData = changeColors(iconData, fillColor, strokeColor);
        callback(dataHeader + escape(newData));
    };

    client.open("GET", source);
    client.send();
}

function changeColors(iconData, fillColor, strokeColor) {
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