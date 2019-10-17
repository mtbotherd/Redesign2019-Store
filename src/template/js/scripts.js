$(document).ready(function() {

    'use strict';

    $('#header img.active').hide();

    var navImg = $('#header .nav-item');
    $(navImg).hover(function() {
        $(this).find('img.inactive').hide();
        $(this).find('img.active').show();
    }, function() {
        $(this).find('img.inactive').show();
        $(this).find('img.active').hide();
    });
	
	// Initialize tooltips
	$('[data-toggle="popover"]').popover();

	// Show/hide shipping address
	$("#saShippingAddress").change(function() {
		if(this.checked) {
			$(".shipping-info").fadeOut();
		} else {
			$(".shipping-info").fadeIn();
		}
	});

});
