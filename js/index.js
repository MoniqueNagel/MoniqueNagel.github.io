/*==========================
   MOBILE DEVICE
============================*/





/*==========================
   PRELOADER
============================*/
(function($){
	"use strict";

	//Show preloader until webpage is fully loaded
	$(window).ready(function(){
		window.onload=function(){
			$('#loader').fadeOut(500,function(){
				$('#loader').remove();
			});
		}
	});
})(jQuery);


/*====================================
	HOW & WHEN ELEMENTS ARE DISPLAYED
======================================*/




/*==========================
   EVENT HANDLERS
============================*/
/*navbar*/
/*window.onscroll=function(){stickyNavbar()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function stickyNavbar(){
	if(window.pageYOffset > sticky){
		navbar.classList.add("sticky");
	}
	else{
		navbar.classList.remove("sticky");
	}
}*/






