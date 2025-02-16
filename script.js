$(document).ready(function(){
	var count = parseInt($("#breakNum").html());
 
    $("#reset").hide();


	$("#minus5Clock").click(function(){
		count -= 5;
		$("#num").html(count);

	});
    
});
