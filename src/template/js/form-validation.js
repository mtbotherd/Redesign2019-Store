$(function () {

	'use strict';

	// Globals
	$('form').validate({
		debug: true,
		rules: {
			firstName: 'required',
			lastName: 'required',
			address: 'required',
			city: 'required',
			state: 'required',
			zipcode: 'required',
			phoneNumber: {
				required: true,
				minlength: 10,
				maxlength: 17
			},
			emailAddress: 'required',
			confirmEmailAddress: {
				required: true,
				equalTo: '#emailAddress'
			},
			creditCardNumber: 'required',
			expirationMonth: 'required',
			expirationYear: 'required',
			cvc: 'required'
		},
		messages: {
			firstName: 'Please enter your first name.',
			lastName: 'Please enter your last name.',
			address: 'Please enter your street address.',
			city: 'Please enter the city.',
			state: 'Please select a state.',
			zipcode: 'Please enter the zip code.',
			phoneNumber: {
				required: 'Please enter your phone number.',
				minlength: 'Phone number must be at least 10 characters.'
			},
			emailAddress: 'Please enter a valid email address.',
			confirmEmailAddress: {
				required: 'Please enter a valid email address.',
				equalTo: 'The email addresses do not match.'
			},
			creditCardNumber: 'Please enter a valid card number.',
			expirationMonth: 'Please select a month.',
			expirationYear: 'Please select a year.',
			cvc: 'Please enter the 3-digit CVC.'
		},
		onfocusout: function(element) {
            this.element(element); // triggers validation
        },
		errorElement: 'div',
	
		// Replaces default .has-error class with Bootstrap 4 .is-valid class
        errorClass: "is-invalid",
        // Replaces default .has-succes class with Bootstrap 4 .is-valid class
        validClass: "is-valid",

        errorPlacement: function(error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            element.parents(".form-group, .input-group").addClass("has-feedback");

            if (element.prop("type") === "checkbox" ||
                element.prop("type") === "radio" ||
                element.prop("type") === "file") {
                //$("<img src='template/img/svg/alert-red.svg'/>").appendTo(element.parents(".form-group, input-group"));
                error.appendTo(element.parents(".form-group"));
            } else {
				// $("<img src='template/img/svg/alert-red.svg'/>").appendTo(element.parents(".form-group, input-group"));
				// error.appendTo(element.parents(".form-group, input-group"));
				$("<img class='alert-red' src='template/img/svg/alert-red.svg'/>").appendTo(element.parents(".form-group, .input-group"));
				error.appendTo(element.parents(".form-group, .input-group"));
			}
        },
        success: function(label, element) {
            // Add the span element, if doesn't exists, and apply the icon classes to it.
            // if ( !$( element ).next( "span" )[ 0 ] ) {
            // 	$( "<span class='fas fa-check form-control-feedback'></span>" ).insertAfter( $( laebl ) );
            // }
        },
        highlight: function(element, errorClass, validClass) {
            // Adds error ".is-invalid" for Bootstrap 4 styles.
            $(element).parents(".form-group, .input-group").addClass(errorClass).removeClass(validClass);

            // Sets error icon.
            $(element).next(".alert-red").show()/*addClass("fa-exclamation-triangle").removeClass("fa-check")*/;
        },
        unhighlight: function(element, errorClass, validClass) {
            // Adds valid class ".is-valid" for Bootstrap 4 styles.
			$(element).parents(".form-group, .input-group").addClass(validClass).removeClass(errorClass);
			$(element).next(".alert-red").remove()
        }
	});
});