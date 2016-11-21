$(document).ready(function(){
	// buttons to hide/show schedule info
	$(".greythree").click(function(){
		$(".friday, .redthree").fadeIn(200);
		$(".saturday, .sunday, .redfour, .redfive, .question").fadeOut(200);
		$(".schedulebox2").animate({"left": "-=50px"}, "slow");
		
	});
	$(".greyfour").click(function(){
		$(".saturday, .redfour").fadeIn(200);
		$(".friday, .sunday, .redthree, .redfive, .question").fadeOut(200);
	});
	$(".greyfive").click(function(){
		$(".sunday, .redfive").fadeIn(200);
		$(".friday, .saturday, .redthree, .redfour, .question").fadeOut(200);
	});
	
	
	var currentPosition = 0;
	var slideWidth = 960;
	var slides = $('.slide');
	var numberOfSlides = slides.length;

	// remove scrollbar 
	$('#slidesContainer').css('overflow', 'hidden');

	slides
	.wrapAll('<div id="slideInner"></div>')
	
	.css({
		'float' : 'left',
		'width' : slideWidth
	});

	  
	  
	$('#slideInner').css('width', slideWidth * numberOfSlides);

	
	$('#slideshow')
		.prepend('<span class="control" id="leftControl">Clicking moves left</span>')
		.append('<span class="control" id="rightControl">Clicking moves right</span>');

	  
	manageControls(currentPosition);

	
	$('.control')
		.bind('click', function(){
		currentPosition = ($(this).attr('id')=='rightControl') ? currentPosition+1 : currentPosition-1;
		

		manageControls(currentPosition);

		$('#slideInner').animate({
		  'marginLeft' : slideWidth*(-currentPosition)
		});
	});


	function manageControls(position){

		if(position==0){ $('#leftControl').hide() } else{ $('#leftControl').show() }

		if(position==numberOfSlides-1){ $('#rightControl').hide() } else{ $('#rightControl').show() }
	}	
	
/*slideshow built using Jonathan 
Snook's basic Jquery slideshow:
 http://snook.ca/archives/javascript/simplest-jquery-slideshow
 */
});
