/*==========================
	NAVBAR CONTROL	
============================*/
$(document).ready(function navMenu(){

	let navButton = document.querySelector(".nav-btn");

	navButton.addEventListener("click", (e) => { 
		e.preventDefault();
		
		// toggle nav state
		document.body.classList.toggle("menu-visible");
	});
})



/*==========================
	CAROUSELS
============================*/




/*===========================
	SMOOTH SCROLLING FEATURE
=============================*/
$(function () {
	$.srSmoothscroll({
	  // defaults
	  step: 55,
	  speed: 400,
	  ease: 'swing',
	  target: $('body'),
	  container: $(window)
	})
 })


/*================================
	SKILL BAR ANIMATION W. JQUERY
==================================*/
/*main method to call function to toggle skill bar animation*/
$(document).ready(function(){
	
	$('.skill-bar').skillBars({
		from: 0,
		speed: 2000, 
		interval: 100,
		decimals: 0,
	});
	
});
 
/*skill bar animation function*/
$(document).ready(function(){
	
	$('.skill-bar').skillBars({
		from: 0,
		speed: 2000, 
		interval: 100,
		decimals: 0,
	});
	
});
 
/*skill bar animation function*/
(function ( $ ) {
 
	$.fn.skillBars = function( options ) {
 
		var settings = $.extend({
			//number start
			from: 0, 
			//number end
			to: false, 
			//how long it should take to count between the target numbers
			speed: 1000, 
			//how often the element should be updated
			interval: 100, 
			//the number of decimal places to show
			decimals: 0, 
			//method for every time an element is updated
			onUpdate: null, 
			//method for when an element finishes updating
			onComplete: null,	

			/*classes created for elements that will be animated*/
			classes:{

				bar : '.bar',
				barPercent : '.bar-percent',

			}

		}, options );
		  
		/*function will run for each element -> ensures that all skills will have an animated bar*/
		return this.each(function(){
		
			var element = $(this),
				to = (settings.to != false) ? settings.to : parseInt(element.attr('skill-percent'));
				if(to > 100){
					to = 100;
				};

			var from = settings.from,
			loops = Math.ceil(settings.speed / settings.interval),
			increment = (to - from) / loops,
			loopCount = 0,
			interval = setInterval(updateValue, settings.interval);

			element.find(settings.classes.bar).animate({
				width: parseInt(element.attr('skill-percent'))+'%'
			}, settings.speed);
				
			function updateValue(){
				from += increment;
				loopCount++;

				$(element).find(settings.classes.barPercent).text(from.toFixed(settings.decimals)+'%');

				if (typeof(settings.onUpdate) == 'function') {

					settings.onUpdate.call(element, from);

				}

				if (loopCount >= loops) {

					clearInterval(interval);
					from = to;

					if (typeof(settings.onComplete) == 'function') {

						settings.onComplete.call(obj, from);

					}
				}
			}
		});
	};
}( jQuery ));










