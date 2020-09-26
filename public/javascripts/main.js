/*when website is ready*/
$(document).ready(function() {
	setTimeout(function(){
		$('body').addClass('loaded');
		$('h1').css('color','#222222');
	}, 3000);
});