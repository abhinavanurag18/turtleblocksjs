var pr = null;
$(document).ready(function(){
	var mask = $(".mask");
	var collabBox = $(".collabBox");
	var share = $("#share");
	$("#sideElem").click(function(){
		if(mask.css("display") == "none"){
			mask.css("display","block");
			collabBox.css("display","block");
		}
		else {
			mask.css("display","none");
			collabBox.css("display","none");
		}
		
	});
	mask.click(function(){
		mask.css("display","none");
		collabBox.css("display","none");
	});
});

// function collabBox(presence){
// 	$("#share").click(function(){
// 		alert("it still works!!");
// 		presence.share();
// 	})
// }