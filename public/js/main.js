import "@babel/polyfill";

import{showWishlistMessage, showMessage } from './showMessage '
import { renderMaplocationView } from './renderViewsOnFrontEnd'
import { makeApiRequestForLogin, 
	makeApiRequestForLogout ,
	  makeApiRequestForSignup,
	   makeApiRequestForgotPassword,
	   makeApiRequestForresetPassword,
	   makeApiRequestToFindCarNearTheZipcode
	}  from './makeApiRequestforUserAuth'
import { makeBingMap } from './makeBingMap'
import{  makeApiRequestForStripeSessionId } from './makeApiRequestForPurchase'

 AOS.init({
 	duration: 800,
 	easing: 'slide',
 	once: false
 });

jQuery(document).ready(function($) {

	"use strict";

	
	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function() {
			
			var counter = 0;
      $('.site-mobile-menu .has-children').each(function(){
        var $this = $(this);
        
        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find('.arrow-collapse').attr({
          'data-toggle' : 'collapse',
          'data-target' : '#collapseItem' + counter,
        });

        $this.find('> ul').attr({
          'class' : 'collapse',
          'id' : 'collapseItem' + counter,
        });

        counter++;

      });

    }, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
      var $this = $(this);
      if ( $this.closest('li').find('.collapse').hasClass('show') ) {
        $this.removeClass('active');
      } else {
        $this.addClass('active');
      }
      e.preventDefault();  
      
    });

		$(window).resize(function() {
			var $this = $(this),
				w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 

		// click outisde offcanvas
		$(document).mouseup(function(e) {
	    var container = $(".site-mobile-menu");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
	    }
		});
	}; 
	siteMenuClone();


	var sitePlusMinus = function() {
		$('.js-btn-minus').on('click', function(e){
			e.preventDefault();
			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function(e){
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	// sitePlusMinus();


	var siteSliderRange = function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	};
	// siteSliderRange();


	

	var siteCarousel = function () {
		if ( $('.nonloop-block-13').length > 0 ) {
			$('.nonloop-block-13').owlCarousel({
		    center: false,
		    items: 1,
		    loop: true,
				stagePadding: 0,
		    margin: 20,
		    smartSpeed: 1000,
		    autoplay: true,
		    nav: true,
		    responsive:{
	        600:{
	        	margin: 20,
	        	nav: true,
	          items: 2
	        },
	        1000:{
	        	margin: 20,
	        	stagePadding: 0,
	        	nav: true,
	          items: 2
	        }
		    }
			});
			$('.custom-next').click(function(e) {
				e.preventDefault();
				$('.nonloop-block-13').trigger('next.owl.carousel');
			})
			$('.custom-prev').click(function(e) {
				e.preventDefault();
				$('.nonloop-block-13').trigger('prev.owl.carousel');
			})

			
		}

		$('.slide-one-item').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    smartSpeed: 1500,
	    autoplay: true,
	    pauseOnHover: false,
	    dots: true,
	    nav: true,
	    navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
	  });

	  if ( $('.owl-all').length > 0 ) {
			$('.owl-all').owlCarousel({
		    center: false,
		    items: 1,
		    loop: false,
				stagePadding: 0,
		    margin: 0,
		    autoplay: false,
		    nav: false,
		    dots: true,
		    touchDrag: true,
  			mouseDrag: true,
  			smartSpeed: 1000,
				navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
		    responsive:{
	        768:{
	        	margin: 30,
	        	nav: false,
	        	responsiveRefreshRate: 10,
	          items: 1
	        },
	        992:{
	        	margin: 30,
	        	stagePadding: 0,
	        	nav: false,
	        	responsiveRefreshRate: 10,
	        	touchDrag: false,
  					mouseDrag: false,
	          items: 3
	        },
	        1200:{
	        	margin: 30,
	        	stagePadding: 0,
	        	nav: false,
	        	responsiveRefreshRate: 10,
	        	touchDrag: false,
  					mouseDrag: false,
	          items: 3
	        }
		    }
			});
		}
		
	};
	siteCarousel();

	

	var siteCountDown = function() {

		$('#date-countdown').countdown('2020/10/10', function(event) {
		  var $this = $(this).html(event.strftime(''
		    + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
		    + '<span class="countdown-block"><span class="label">%d</span> days </span>'
		    + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
		    + '<span class="countdown-block"><span class="label">%M</span> min </span>'
		    + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
		});
				
	};
	// siteCountDown();

	var siteDatePicker = function() {

		if ( $('.datepicker').length > 0 ) {
			$('.datepicker').datepicker();
		}

	};
	siteDatePicker();

	var siteSticky = function() {
		$(".js-sticky-header").sticky({topSpacing:0});
	};
	siteSticky();

	// navigation
  var OnePageNavigation = function() {
    var navToggler = $('.site-menu-toggle');

   	$("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a[href^='#']", function(e) {
      e.preventDefault();

      var hash = this.hash;

      $('html, body').animate({
        'scrollTop': $(hash).offset().top - 50
      }, 600, 'easeInOutExpo', function() {
        // window.location.hash = hash;

      });

    });
  };
  OnePageNavigation();

  var siteScroll = function() {

  	

  	$(window).scroll(function() {

  		var st = $(this).scrollTop();

  		if (st > 100) {
  			$('.js-sticky-header').addClass('shrink');
  		} else {
  			$('.js-sticky-header').removeClass('shrink');
  		}

  	}) 

  };
  siteScroll();


  var counter = function() {
		
		$('#about-section').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number > span').each(function(){
					var $this = $(this),
						num = $this.data('number');
					$this.animateNumber(
					  {
					    number: num,
					    numberStep: comma_separator_number_step
					  }, 7000
					);
				});
				
			}

		} , { offset: '95%' } );

	}
	counter();



});

// --------------find me button event

$(function(){
	$('.btn-findme').each(function(){
		this.addEventListener('click', function(){
			this.nextSibling.classList.toggle("active")
		})
	})
})
// ---------------------form functionality
$(function() {
	$(".login-form").validate({
	  rules: {
		
		email: {
		  required: true,
		  email: true
		},
		password: {
		  required: true,
		  minlength: 6,
		  maxlength: 15
		}
	  },
	   messages: {
		email: "Please enter a valid email address",
	   
		password: {
		  required: "Please enter password",
		  minlength:'at least 6 characters',
		  maxlength:'max 15 characters'
		}
		
	  },
	
	//   submitHandler: function(form) {
	// 	form.submit();
	//   }
	});
  });
  
// sigup form validation
$(function() {
	$(".signup-form").validate({
	  rules: {
		username: {
			required: true,
			maxlength: 4
		  },
		
		email: {
		  required: true,
		  email: true
		},
		password: {
		  required: true,
		  minlength: 6,
		  maxlength: 15
		},
		confirmPassword: {
		  required: true,
		  minlength: 6,
		  maxlength: 15,
		  equalTo : "#password"
		}
	  },
	   messages: {

		username: {required:'Enter User name', maxlength:'Sorry user name can only be 4 characters long'}, 
		email: "Please enter a valid email address",
	   
		password: {required:'Enter Password', minlength:'at least 6 characters', maxlength:'max 15 characters' }, 
		confirmPassword:{required:'Enter Confirm Password', minlength:'at least 6 characters',equalTo:'Confirm password not match', maxlength:'max 15 characters' }, 
		
	  },
	

	});
  });

//   validate and api request for forgot password to get for got password form
  
  $(function() {
	$(".forgotPassword-form").validate({
	  rules: {
		
		email: {
		  required: true,
		  email: true
		}
	  },
	   messages: {
		email: "Please enter a valid email address",
	   
		
		
	  },
	
	  submitHandler:async function(form, evt) {
		let email = form.email.value
		let _csrf = form._csrf.value
		evt.preventDefault()		
	
		try {
				let response = 	await makeApiRequestForgotPassword(  email,_csrf)
		// console.log(response)
		//display suscessful message using notifying jquery package
			$.notify(response.data.message,  {  className: 'success'});
			setTimeout(function(){ location.assign('/'); }, 1500);
		} catch (error) {
			
			// console.log(error)
			// console.log(error.response)
			$.notify( error.response.data.message,  {  className: 'error', globalPosition:'top left'});
		}			
					
	
		
					
		
	  }
	});
  });


//   validate and api request for reset password to update with new pass word for unsign in user 
  $(function() {
	$(".newpassword-form").validate({
	  rules: {
		
		password: {
		  required: true,
		  minlength: 6,
		  maxlength: 15
		},
		confirmPassword:{
			required: true,
			minlength: 6,
		  maxlength: 15,
		  equalTo : "#password"
		} 
	  },
	  messages:{
		password: {required:'Enter Password', minlength:'at least 6 characters', maxlength:'max 15 characters' }, 
		confirmPassword:{required:'Enter Confirm Password', minlength:'at least 6 characters',equalTo:'Confirm password not match', maxlength:'max 15 characters' }, 
	  },
	  
	
	  submitHandler:async function(form, evt) {
		let password = form.password.value
		let confirmedPassword =  form.confirmPassword.value
		let _csrf = form._csrf.value
		evt.preventDefault()	
		let resetPasswordtoken = window.location.pathname.split('/')[5]
		// console.log(resetPasswordtoken)
		try {
				let response = 	await makeApiRequestForresetPassword( password,confirmedPassword,_csrf, resetPasswordtoken )
		//  console.log(response)
		// console.log(password,confirmedPassword,_csrf)

		//display suscessful message using notifying jquery package
		$.notify(response.data.message,  {  className: 'success'});
				if(response.data.savedUrlLocation){
					setTimeout(function(){ location.assign(response.data.savedUrlLocation); }, 1500);
				}else{
					setTimeout(function(){ location.assign('/'); }, 1500);
				}	

		
		} catch (error) {
			// console.log(error)
			// console.log(error.response)
			$.notify( error.response.data.message,  {  className: 'error', globalPosition:'top left'});
		}			
					
	
		
					
		
	  }
	});
  });



// find car coordinates
  $(function() {

	jQuery.validator.addMethod("checkZipcode", function(value, element) {
		let result =	 this.optional(element) || /^\d{5}(?:-\d{4})?$/.test(value);
			result = result && value.startsWith('9')&&!value.includes('-');
			return result
	  }, "Please provide a valid  California zipcode.");


	$(".zipcodeForm").each(function(){
		$(this).validate({
			rules: {
			  
			  zipcode:{
				  required:true,
				  checkZipcode: true
			  },
	  
			  miles:{
				  required:true
			  }
			},
			messages:{
			  zipcode: {required:'Enter Zipcode'}, 
			  miles:{required:'Enter miles' }, 
			},
			
		  
			submitHandler:async function(form, evt) {
				try {
					evt.preventDefault()
					let carId = form.carId.value
					let zipcode = form.zipcode.value
					let withinMiles =  form.miles.value
					let _csrf = form._csrf.value
				
				
							let response = 	await  makeApiRequestToFindCarNearTheZipcode(  carId, zipcode,withinMiles,_csrf )
				// console.log(response)
				if(response.data.data.foundCarLoc.length){
					 
					document.querySelector('.site-section').scrollIntoView({ behavior: 'smooth'});
						if(document.querySelector('.notifyjs-corner')){
							document.querySelector('.notifyjs-corner').innerHTML =''
						}
						
						$.notify('We Found Location Has the Car You Looking For!',  {  className: 'success', globalPosition:'top center', autoHideDelay: 10000});

				
			
				
					setTimeout(function(){  
										//  scroll to the top of car container 
										let carUserIsllokingfor = 	 response.data.data.foundCarLoc[0].carsAvalaibleAtThisLocation.find((car)=>{
											return car._id === carId
							})
							// console.log(carUserIsllokingfor)
							//render view for found cars near by
						renderMaplocationView(response.data.data, 	carUserIsllokingfor )
							//   // console.log(password,confirmedPassword,_csrf)
							//render bing map
							
							makeBingMap(response.data.data)
		
					
					
					       }, 350);
					
				}else{
				
					$.notify('Sorry ThIs Car Is Not Near You, Try to Increase Miles or diffrent Zipcode',  { 	className: 'error' , autoHideDelay: 10000});
				}
					
					  
				} catch (error) {
					// console.log(error)
					// console.log(error.response)
					$.notify( error.response.data.message,  {  className: 'error', globalPosition:'top left'});
				}
			  
		  
			  
						  
			  
			}
		  });
	})
	
	

  });


// biiling address form
  $(function() {

	// jQuery.validator.addMethod("checkZipcode", function(value, element) {
	// 	let result =	 this.optional(element) || /^\d{5}(?:-\d{4})?$/.test(value);
	// 		result = result && value.startsWith('9');
	// 		return result
	//   }, "Please provide a valid  California zipcode.");


	$(".billing-address").validate({
		rules: {
			
		street1:{
			required: true
		} , 
		city:{
			required: true
		} , 
		zip:{
			required:true,
			checkZipcode: true
		  }
  
		
		},
		// messages:{
		// 	street1:{required:'Enter Street Address'},
		//   zipcode: {required:'Enter Zipcode'}, 
		  
		// },
		
	  
		submitHandler:async function(form, evt) {


			// ++++++++++++++++++  write a logic here 
			// if form with adreess /checkout then hit submit the form if

			// if address is /checkout/payment send the api resquest to the server to make stripe session 
			// and redirect to stripe in the client
			// cause stripe check out can only redirect on client         
			try {
				evt.preventDefault()
				
				// let carId = form.carId.value
				// let zipcode = form.zipcode.value
				// let withinMiles =  form.miles.value
				// let _csrf = form._csrf.value
			
				if(form.action.includes('/checkout')){
					// console.log(123)
					form.submit()
				}
				if(form.action.includes('/payment')){
					
					
					let carId = form.carId.value
					let _csrf = form._csrf.value
					// console.log(carId, '   ', _csrf)
						// make api request for stripe payment
						let response = await makeApiRequestForStripeSessionId (carId, _csrf)
								let stripe = Stripe('pk_test_lxZQXKcE4jVLYkbXvs2cDC1700xddXCak1');
								// console.log(response.data)
								
								await stripe.redirectToCheckout({
									// Make the id field from the Checkout Session creation API response
									// available to this file, so you can provide it as parameter here
									// instead of the {{CHECKOUT_SESSION_ID}} placeholder.
									sessionId: `${response.data.stripeSessionId}`
								  })
							


					// stripe.redirectToCheckout({
					// 	// Make the id field from the Checkout Session creation API response
					// 	// available to this file, so you can provide it as parameter here
					// 	// instead of the {{CHECKOUT_SESSION_ID}} placeholder.
					// 	sessionId: session.id
					//   })

				}
		
		




			} catch (error) {
				
				// console.dir(error)
				// console.log(error.response)
				// console.log(error.name)
				if(error.name ==="IntegrationError"){
					// error from checkout if cannot redirect
					 $.notify( error.message,  {  className: 'error', globalPosition:'top left'});
				}else{
					// response from your own server
					$.notify( error.response.data.message,  {  className: 'error', globalPosition:'top left'});
				}
			
				
			}


		  
	  
		  
					  
		  
		}
	  });
	

  });








(function(){


	// show wishlist message
		const wishlistMessage =document.querySelector('.nav-wishlist').dataset.wishlist
	
		showWishlistMessage (wishlistMessage )

})();



(function(){

 
	// show message using meta tag ; a better way for showing message 
	// this is more genneric and flexible way  for showing different messages
		const metaMessage =document.querySelector('.meta-message')
		if( metaMessage.name && metaMessage.content){
			showMessage(metaMessage.name, metaMessage.content )
			metaMessage.name = ''
			metaMessage.content = ''
		}
		

})();



function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


$(function(){
	//  make api request for login
let form = document.querySelector('.login-form') 
if(form ){



	form.addEventListener('submit',async (evt)=>{

	try {
			evt.preventDefault();
			let email = evt.target.email.value
			let password = evt.target.password.value
			let _csrf = evt.target._csrf.value
		if 	( validateEmail(email) && password && password.length>=6 && password.length<=15){
				let response = 	await makeApiRequestForLogin(email,password,_csrf)
		
				//display suscessful message using notifying jquery package
				$.notify(response.data.message,  {  className: 'success'});
				if(response.data.savedUrlLocation){
					setTimeout(function(){ location.assign(response.data.savedUrlLocation); }, 1500);
				}else{
					setTimeout(function(){ location.assign('/'); }, 1500);
				}
				
				
		}
	
			
		
 


			} catch (error) {
				 $.notify( error.response.data.message,  {  className: 'error', globalPosition:'top left'});
				// console.log('wrong', error.response.data.message)
			}


		}) ;
}


});

// log out api request
$(function(){
let logoutSpans = document.querySelectorAll('.logout') 

if(logoutSpans.length){
		
	logoutSpans.forEach((span)=>{

		span.addEventListener('click',async function(evt){

			try {
				
					let _csrf = evt.target.previousSibling.value
					// console.log(_csrf)
					let response = 	await makeApiRequestForLogout(_csrf)
				
					//display suscessful message using notifying jquery package
					$.notify(response.data.message,  {  className: 'success'});
					setTimeout(function(){ location.assign('/'); }, 1500);	
				
	
	
	
					} catch (error) {
						// console.log('wrong', error.response)
						$.notify( error.response.data.message,  {  className: 'error', globalPosition:'top left'});
					}
	
	
				}) ;

	})
	
	


}	


});

	// sign up api request
$(function(){

let signUpform = document.querySelector('.signup-form') 
if(signUpform ){



	signUpform.addEventListener('submit',async (evt)=>{

	try {
			evt.preventDefault();
			let userName = evt.target.username.value
			let email = evt.target.email.value
			let password = evt.target.password.value
			let confirmPassword = evt.target.confirmPassword.value
			let _csrf = evt.target._csrf.value
		if 	(  userName&& userName.length <=4 &&validateEmail(email)  && password && password.length>=6 &&   password.length<=15  &&confirmPassword.length>=6 && confirmPassword.length<=15 &&password=== confirmPassword){
				let response = 	await makeApiRequestForSignup(  userName,email,password,confirmPassword,_csrf)
			// console.log(response)
				//display suscessful message using notifying jquery package
				//  $.notify(response.data.message,  {  className: 'success'});
				//  setTimeout(function(){ location.assign('/'); }, 1500);

				 //display suscessful message using notifying jquery package
				$.notify(response.data.message,  {  className: 'success'});
				if(response.data.savedUrlLocation){
					setTimeout(function(){ location.assign(response.data.savedUrlLocation); }, 1500);
				}else{
					setTimeout(function(){ location.assign('/'); }, 1500);
				}
				
				
		}
	
			
		
 


			} catch (error) {
				 $.notify( error.response.data.message,  {  className: 'error', globalPosition:'top left'});
				// to see any syxntax error in this function
				// console.log('wrong', error)
				// to see the error from back end
				// console.log('wrong', error.response)
			}


		}) ;
}


});


//forgot password api request you use with the jquery vilation above cause it can validate email 
// at the same time and if it is valid it will have a call back submit handler for you which you can use and make api request





// form submition for select pagination

$(function(){

	let selectPaginationElement = document.querySelector('#select-pages') 
	
	
	if(selectPaginationElement){
			selectPaginationElement.addEventListener('change',async (evt)=>{
	
		try {
				
				// let selectPageValue= evt.target.value
				// let Form = document.createElement("form");
					
				// 	Form.method = "get";
				// 	Form.action = `/cars?page=${selectPageValue}`;

				// 	document.body.appendChild(Form);
				// 	Form.submit();
			let form = 	document.querySelector('.form-select-page')
			// form.action = `/cars?page=${selectPageValue}`
			console.dir(form)
			 form.submit()
	
				
			
	 
	
	
				} catch (error) {
					//  $.notify( error.response.data.message,  {  className: 'error', globalPosition:'top left'});
					// to see any syxntax error in this function
				//  console.log('wrong', error)
					// to see the error from back end
					// console.log('wrong', error.response)
					
				}
	
	
			}) ;
	
	}
	

	
	
	});


//form submision for sort price 
$(function(){

		let selectPaginationElement = document.querySelector('.sort-price-select') 
		
		if(selectPaginationElement){

			selectPaginationElement.addEventListener('change', (evt)=>{
		
				try {
						
						// let selectSortValue= evt.target.value
						// let currentPage = evt.target.dataset.currentPage
							
					
					// console.log(selectSortValue)
						
					let form = 	document.querySelector('.sort-price-form')
					// if( selectSortValue!=='rec'){
					// 		form.action = `/cars?sort=${selectSortValue}%26page=${currentPage}`
					// }else{
					// 	form.action = `/cars?page=${currentPage}`
					// }
				
					console.dir(form)
					  form.submit()
			
						
					
			 
			
			
						} catch (error) {
							//  $.notify( error.response.data.message,  {  className: 'error', globalPosition:'top left'});
							// to see any syxntax error in this function
							// console.log('wrong', error)
							// to see the error from back end
							// console.log('wrong', error.response)
						}
			
			
					}) ;
		}
		
		
		
		
		 
		
});


