/**
 * @author Next Sphere Technologies
 * Script javascript.
 * 
 * Script Javascript will contains util functions which can be used across xiim application. 
 * 
 */

$(document).ready(function(e) {
	$("#calendarOneByOneContainer #jqxWidget").css("max-height","240px");
	$("#cellTableViewjqxWidget tr td .jqx-calendar-cell").css("height","30px");
	$("#twoByTwoCalanderThumbNail").css({"height":"170px","width":"175px"});
	//$("#calendarOneByOneContainer #cellTableViewjqxWidget td").css("height","35px");
	//$("#jqxWidgets").removeAttr("style");
	/* Gridster dropdown width auto fixed */
	$('.filter-sm-icons').on('click',function(){
		$(".widget-dp").css("width","auto");
	});
	/* Gridster dropdown width auto fixed */
	
	
	
	var allowClose = false;	
	$('#categoriesMenuDiv').on('shown.bs.dropdown', function () {
		
		allowClose = false;
	});
	 /*$('#friendrequest-dropdown-holder').on('click', function () {		
		allowClose = false;
	}); */
	$('#categoriesMenuDiv').on('click',function(){
		//$("#connection-holder").on("show.bs.dropdown", function(e) {   $(this).find('.dropdown-menu').first().stop(false, false).slideDown(); }); 

		//alert("Clicked");
		 allowClose = false;
	});
	
	$('#categoriesMenuDiv').on('hide.bs.dropdown', function () {
		
		if (!allowClose) return false;
	});
	$("#categoriesMenuDiv").mouseleave(function(){
		//$('#connection-holder').on('hide.bs.dropdown', function(e) { $(this).find('.dropdown-menu').first().stop(true, true).slideUp(); });
		 allowClose = true;
		 
	});
	$(function () {
		  $('[data-toggle="tooltip"]').tooltip({
			  container:'body'			   
		  });
	});
		
	/*$("#connectionRequests").click(function(){
		alert("connection clicked");
		 
	});
	
	jQuery(function () {
	    jQuery('[data-toggle=tooltip]').tooltip();
	});*/
	//$(".notification-sm-icons").jqxTooltip({ position: 'bottom', content: 'This is a jqxButton.', theme: 'energyblue' });
	
	
	/*Font Family change based on Operating System */
	/*var os = navigator.platform;
	if (os.indexOf("Win") != -1) {
		$('body').css( 'font-weight', '"700"');
		//if (isChrome) alert("You are using Chrome!");
	}	*/	
	/*<!-- Left Affix Panel -->*/
	
	
	$(function() {
		
	    $( "body" ).on('click','#affix-shift',function() {
	    	$(".expandwindow-icon").toggleClass('selected');
	    	$("#left-affix-panel").toggleClass('clicked', 100, left_menu_callback);	      
	    });
	 
	    function left_menu_callback() {
	   /*   setTimeout(function() {
	    	  $("#left-affix-content").toggleClass('hide');
	      }, 200 );*/
	    }
	  });
	
	
	var affixheight = $('#menu-affix-container').height()+"px";
	//alert(affixheight);
	var affixpanel = $("#left-affix-panel");
	//(affixpanel).height("550px");
		
		$(document).click(function(event) { 
		    if(!$(event.target).closest('#left-affix-panel').length) {
		        if($('.clicked').is(":visible")) {
		        	$("#left-affix-panel .selected").trigger('click');		        	
		        }
		    }        
		});		
	/*<!-- Left Affix Panel End -->*/
	
	// dropdown slow animation down
	//$(".dropdown").on("show.bs.dropdown", function(e) {   $(this).find('.dropdown-menu').first().stop(true, true).slideDown(); }); 
	//$('.dropdown').on('hide.bs.dropdown', function(e) { $(this).find('.dropdown-menu').first().stop(true, true).slideUp(); });
	
	// info image dropdown for group members home page
	$(".info-img").click(function(){
		$(".memberinfo-fullview").fadeIn(700);
		$(".memberinfo-fullview").removeClass('hide');				
	});
	
	$(".memebr-fv-remove").click(function(){
		$(".memberinfo-fullview").fadeOut(1000);
		$(".memberinfo-fullview").addClass('hide');
	});
	
	$(".group-members-div").click(function(){
	$(".members-fullview1").fadeIn(700);
	$(".members-fullview1").removeClass('hide');
	
	});
	$(".memebr-fv-remove").click(function(){
		$(".members-fullview1").fadeOut(1000);
		$(".members-fullview1").addClass('hide');	
	});
	
	$(".group-members-blocks li").click(function(){
		$(".members-fullview").fadeIn(700);
		$(".members-fullview").removeClass('hide');	
	});
	$(".memebr-fv-remove").click(function(){
		$(".members-fullview").fadeOut(1000);
		$(".members-fullview").addClass('hide');
		$(".members-fullview").fadeOut(1000);	
	});
	
	$(".group-members-blocks li").click(function(){
		$(".childGroupinfo-fullview").fadeIn(700);
		$(".childGroupinfo-fullview").removeClass('hide');	
	});
	$(".childGroup-fv-remove").click(function(){
		$(".childGroupinfo-fullview").fadeOut(1000);
		$(".childGroupinfo-fullview").addClass('hide');
		$(".childGroupinfo-fullview").fadeOut(1000);	
	});
	

	/* Group Face Edit Button Click */
	$(".group-face-edit").click(function(){
		$(".group-face-view-panel").fadeOut(1000);
		$(".group-face-view-panel").addClass('hide');
		$(".groupFace-Edit-View").removeClass('hide');	
		$(".groupFace-Edit-View").fadeIn(1000);
		});
		
		/* Group Face Edit Button Click */
	$(".summary-edit-button").click(function(){
		$(this).addClass('hide');
		$(".summary-view-mode").fadeOut(1000);
		$(".summary-view-mode").addClass('hide');
		$(".summary-edit-mode").removeClass('hide');	
		$(".summary-edit-mode").fadeIn(1000);
		});
		
	/*<!--Password Hints Popover-->*/
	$(".popover_display a").popover({
		trigger:"hover focus",
		placement : 'right',
	});

	/*Group Face Header afffix on scroll 360px down */	
	//commented below code as Carlos suggested we don't need the group breif view as we have Group Information icon so that user can see group information.
/*	$(window).scroll(function(){
		 var height = $(window).scrollTop();
		 //$('#profileInformationHeading').toggleClass('profileinfoheading-fixed', $(this).scrollTop() > 0);	
		 //commented below line to fix the bug number XIP-3208 which raised by carlos
		//$('.group-header').toggleClass('group-header-scrolled', $(this).scrollTop() > 0);		
	
		if(height  > 255) {
			$('.groupheader-mini-strip').removeClass('hide');
			$("#stripgrouptypeid").html($("#groupTypeExistingName").html());
			$("#stripgroupcategoryid").html($("#groupCategoryExistingName").html());
			$("#stripgroupnameid").html($("#headergroupnameid").html());
		}
		else
		{
			$('.groupheader-mini-strip').addClass('hide');
		}
	});	*/
	//	New Course Widget from menu click
	$("#newCourseHyperLinkID").click(function(){		
		$('.newCourse-block').removeClass('hide');		
	});
	
	/*$(".courseName-remove-but").click(function(){
		$(".newCourse-block").fadeOut(1000);
		$(".newCourse-block").addClass('hide');		
	});*/
	
		
	//Add Invitees script
	$(".remove-block").click(function(){
		$(this).toggleClass("lightbluebg");
	});
	$(".remove-block").click(function(){
		$(this).addClass("lightbluebg");
	});
	$(".minus-icon").click(function(){
		$(this).parent().remove();
	});
	
	/**
	// My profile links
	$(".profileinfo-link").click(function(){		
		$('html, body').animate({scrollTop: $("#profileInformationEditMode").offset().top -250}, 1000);//scrolling to id		
		leftMenuLinks(this);
	});
	$(".contactinfo-link").click(function(){
		$('html, body').animate({scrollTop: $("#contactInformation_container").offset().top -290}, 1000);
		leftMenuLinks(this);
	});
	$(".education-link").click(function(){		
		$('html, body').animate({scrollTop: $("#educationContainer").offset().top -250}, 1000);
		leftMenuLinks(this);
	});
	$(".experience-link").click(function(){		
		$('html, body').animate({scrollTop: $("#experienceContainer").offset().top -250}, 1000);
		leftMenuLinks(this);
	});
	$(".skills-link").click(function(){
		$('html, body').animate({scrollTop: $("#skillsContainer").offset().top -250}, 1000);
		leftMenuLinks(this);
	});
	$(".projects-link").click(function(){
			$('html, body').animate({scrollTop: $("#projectContainer").offset().top -250}, 1000);
			leftMenuLinks(this);
	});
	// My profile links ends
	
	// View Profile Links	
	
	$(".profileinfo-vlink").click(function(){
		$('html, body').animate({scrollTop: $("#profileInformationView").offset().top -200}, 1000);
		leftMenuLinks(this);
	});
	$(".contactinfo-vlink").click(function(){
		$('html, body').animate({scrollTop: $("#contactInformationView").offset().top -250}, 1000);
		leftMenuLinks(this);
	});
	$(".education-vlink").click(function(){
		$('html, body').animate({scrollTop: $("#userEducationView").offset().top -180}, 1000);
		leftMenuLinks(this);
	});
	$(".experience-vlink").click(function(){
		$('html, body').animate({scrollTop: $("#userExperienceView").offset().top -180}, 1000);
		leftMenuLinks(this);
	});
	$(".skills-vlink").click(function(){
		$('html, body').animate({scrollTop: $("#userSkillsView").offset().top -180}, 1000);
		leftMenuLinks(this);
	});
	$(".projects-vlink").click(function(){
		$('html, body').animate({scrollTop: $("#userProjectsView").offset().top -250}, 1000);
		leftMenuLinks(this);
	});
	*/
	
	
	$('body').on('click','#left-affix-panel a.menuitems',function(e){
		var menu_offset_top = ($(this).data('shift')) ? $(this).data('shift') : 250;
		if($('.gridster').length){
			$('#viewProfileMainDiv').mCustomScrollbar("scrollTo",$(this).attr('href'));
		}
		else{
			$('html, body').animate({scrollTop: $(''+$(this).attr('href')).offset().top - menu_offset_top}, 1000);
		}
		leftMenuLinks(this);
	});
	
	
	
	$('').modal().on('shown', function(){
	    $('body').css('overflow', 'hidden');
	}).on('hidden', function(){
	    $('body').css('overflow', 'auto');
	});
	
	$(document).on('gapslideIntit',function(){
		if($(".slide-photos").length){
		    $(".slide-photos").each(function(){
		    	if($(this).find('li').length>3){
		    		$(this).parent().find('.slide-next,.slide-prev').show();
			    	$(this).jCarouselLite({
				        btnNext: ".slide-next",
				        btnPrev: ".slide-prev",
				        start:0,
				        visible: 3
				    });
		    	}
		    	else{
		    		$(this).parent().find('.slide-next,.slide-prev').hide();
		    	}
		    });
		}
	});
	
	slidePhotos=function(isInfo){
		var element;
		if(isInfo.skip)
			element=$(document).find('.slide-photos').not('#groupfaceoverlay .slide-photos');
		else if(isInfo.only)
			element=$(document).find('#groupfaceoverlay .slide-photos');

		else
			element=$(document).find('.slide-photos');
		
    	if($(element).find('li').length>3){
    		$(element).parent().find('.slide-next,.slide-prev').show();
	    	$(element).jCarouselLite({
		        btnNext: ".slide-next",
		        btnPrev: ".slide-prev",
		        start:0,
		        visible: 3
		    });
    	}
    	else{
    		$(element).parent().find('.slide-next,.slide-prev').hide();
    	}
    
	};
	
	/** on escape close popups  */
	$(document).keyup(function(e) {
		var e=window.event || e;
		if (e.keyCode == 27){
			globalPopupClose();
			globalModalClose();
			//will close events list view popover on dashboard.
			if($('#close-events-list-view').length > 0){
				$('#close-events-list-view').trigger('click');
			}
			//will close date and time picker on event creation window
			if($('.xdsoft_datetimepicker:visible').length > 0){
				$('.xdsoft_datetimepicker:visible').css('display','none');
			}
			//triggers close on course popover on dashboard. 
			if($('#remove-coursepopover:visible').length > 0){
				$('#remove-coursepopover').trigger('click');
			}
		}
	});
	
	var globalPopupClose = function(){
		if($('.popover').hasClass('in')){
	 		var open_popup_id = $(".popover.in").attr('id');
	 		var popup_open_ele = $('div[aria-describedby="'+open_popup_id+'"],li[aria-describedby="'+open_popup_id+'"]');
			popup_open_ele.popover('destroy');
		}
	};
	var globalModalClose = function(){
		//$('.modal.in').removeClass('in').css('display','none');
		$('.modal.in').modal('hide')
	};
});

var leftMenuLinks = function(event){
	//$("[class$='-link']").attr('style','');	
	//$("[class$='-vlink']").attr('style','');
	$(event).parent().children("a").removeClass('activemenu');
	//$(event).parent().children("a").css({"color":"#FFFFFF"});
	$(event).addClass('activemenu'); //add color offwhite color
	$("#affix-shift .selected").trigger('click'); // close left menu panel
	//$(".menuitems span").removeClass("menuactive");// remove from all span menuactive which is prev added
	//$(event).children("span").addClass("menuactive"); // this span add class "menuactive" class
};