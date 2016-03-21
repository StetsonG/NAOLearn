/**
 * @author Next Sphere Technologies
 * My Calendar (2x2) view  widget
 * 
 * My Calendar (2x2) view widget is used get all Events, Draft and Pending invitations as an list view both for 
 * Group and Personal Calendar based on association type.
 * 
 * 1. Calendar view for Group and Personal Calendar Events based on association type
 * 2. Create event
 * 3. Edit Event
 * 4. Delete Event
 * 5. View Event
 * 6. Create Event Categories
 * 7. Delete Event Categories
 * 8. View Event Categories
 * 9. Filter View of Event Categories
 * 
 */

var getEventsURL = "";
var isEditable = 'false'; 

/** Course Categories **/
var circleType = 'All';
var eventTypes = [];
var allCircles = [];

/** Personal Categories */
var categorySelectView = 'month';
var categoryDate = new Date();
var associationIds = [];
var groupCategories = [];
var courseCategories = [];
var personalCategories = [];
var categoryIds = [];
var allCategories = [];
var isCategoryChecked = false;
var allActiveCategoryIds = [];
var isActiveCategory = false;
var categoryFilter = 'ALL';
var isAllCategoriesChecked = false;
var globalSelectView = 'month';
var globalDate = '';
var courseStatus = '';//UNPUBLISHED
var associationType = '';//COURSE,GROUP
var loggedInUserRoleName = '';//PUBLISHER
var loggedInUserCircle = '';//Educator


var FullCalendarWidget =  function(){
	var accessToken =  $("#accessToken_meta").val();
	var langId = $("#langId_meta").val();
	//var userId = $("#loggedInUserId-meta").val();
	return {
		defaults:{
		/*fcAssociationType:'CONNECTION',
			isEditable:'false'*/
	},
		settings:{

	},
		connections:[],
		groupMembers:[],
		courseMembers:[],
		eventIdentifiers:[],
		categories:[],
		init :function(options) {
		this.settings = $.extend(this.defaults, options);
		this.tempDate = new Date();
		this.createUI(this.settings);
		FullCalendarWidget.loadAllCategories();
		
	},

		sortByKey:function(array,key) {
		return array.sort(function(a, b) {
			var x = a[key]; var y = b[key];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	},

		createUI :function(options){
		var html =  '';
		//var htmlData;
		//htmlData= CalendarElements.group();

		/*        	  if( options.isPersonalCategories ){
        		  htmlData.isPersonalCategories = true;
        	  }

        	  if( options.isCourseCategories ){
        		  htmlData.isCourseCategories = true;
        	  }*/


		// html+= FullCalendarHTML.group();
		// var fullCalendarDiv = Mustache.to_html(html,htmlData);
		var fullCalendarDiv =''; 
		fullCalendarDiv = ''
				+'<div class="whitebg hide" id="new-event-container"></div>'
				+'<div id="calenderbodycontentid" class="calenderbodycontentclass two-column min-height-450 max-height-750 float-left calendar-padding width-100-percent">'
				+'  <div class="">'
				+'	<div id="">'
				+'       <div class="col-xs-2" id="calendar2X2Menu">'
				+'		<a href="#" data-toggle="dropdown" class="dropdown-toggle"><div class="col-xs-2 text-left"><span class="filter-sm-icons mar-top-min-4"></span></div> </a>'
				+'		<ul class="common-dropdown-menus dropdown-menu arrow-right widget-dp" style="padding:10px 0 10px 0;width:auto !important;">'
				/*+'			<li class="create-an-event"><a href="javascript:void(0);" id="newEventHyperLinkID">New Event</a></li>'*/
				+'			<li><a href="javascript:void(0);" liid="Calendar2x2" class= "clickedType" id="myCalendar2X2view">My Calendar</a></li>'
				+'	 		<li><a href="javascript:void(0);" liid="Calendar2x2" class= "clickedType" id="myEvent2X2view">Pending Invitations</a></li>'
				+'			<li><a href="javascript:void(0);" liid="Calendar2x2" class= "clickedType" id="upComingEvents2X2view">Events</a></li>'
				+'			<!-- <li><a href="javascript:void(0);" liid="Calendar2x2" class= "clickedType" id="pendingInvitations2X2view">Pending Invitations</a></li> -->'                                        
				+'			<li><a href="javascript:void(0);" liid="Calendar2x2" class= "clickedType" id="draftEvents2X2view">Draft Events</a></li>'
				+'		</ul>'
				+'       </div>'
				+'       <div class="col-xs-8 text-center" >'
				/*+'        	<span id="calenderTitle" class="font-26 mar-left-minus-19 mar-right-20"></span>'*/
				+'			<span id="headerDiv" class="display-inline"></span>'
				+'	   </div>'
				+'       <div class="col-xs-2 text-right" id="widgetShiftContainer">'
				+'		<span class="view-icons twobytwo display-inline cursor-hand" id="showOptions2X2Calendar"></span>'                                        
				+'		<div class="view-dropdown hide" id="removeHideCalendar2X2OptionsID">'
				+'			<a class="" href="javascript:void(0);" id="minimize_maximize_Calendar_11" idd="1" liid = "Calendar1x1" minmax="max">'
				+'				<span class="view-icons onebyone display-inline mar-trbl-0-2-0-2"></span>'
				+'			</a>'
				+'			<a class="" href="javascript:void(0);" id="minimize_maximize_Calendar21" idd="1" liid = "Calendar1x2" minmax="max">'
				+'				<span class="view-icons onebytwo display-inline mar-trbl-0-1-0-1"></span>'
				+'			</a>'
				+'			<a href="javascript:void(0);" id="minimize_maximize_Calendar_22" idd="1" liid = "Calendar2x2" minmax="max">'
				+'				<span class="view-icons twobytwo display-inline mar-trbl-0-2-0-2"></span>'
				+'			</a>'
				+'		</div>'
				+'       </div>'
				+'    </div>'
				+'	<div class="text-right pad-tb-7 clear-float" id="neweventbuttondivid"><input value="New Event" class="def-button font-17 small-button" id="fullcalendar-new-event-button" type="button">'

				+'    </div>'
				+'	<div id="calendarContainer" class="pull-right"><div id="miniCalendarContainer"  class="pull-left width-180 hide minicalendar-padding-left"><div class="pad-left-8 font-16px height-24"><span title="Select Date" class="calendar-sm-icons selected-sm mar-right-8"></span>Events</div><div id="miniCalendar"></div><div class="mar-top-50 font-14px"><div class="pad-bot-10">Category</div><div id="categoriesFilterContainer"></div></div></div><div id="calendar" class="pad-right-1"></div></div>'
				+'  </div>'
				+'</div>';
		$(options.element).html(fullCalendarDiv);

		if(options.type == 'GROUP' || options.type == 'COURSE'){
			$("#widgetShiftContainer").addClass('hide');
			//$("#calendar2X2Menu").addClass('hide');
		}else{
			$("#widgetShiftContainer").removeClass('hide');
			// $("#calendar2X2Menu").removeClass('hide');
		}
		if(options.isEditable != 'true'){
			//	alert(" hiding new event button ");
			  $("#fullcalendar-new-event-button").attr('disabled','disabled'); 
			  $("#fullcalendar-new-event-button").addClass('hide'); 
			  $('#neweventbuttondivid').addClass("height-40");
		}else{
			$("#fullcalendar-new-event-button").removeAttr('disabled'); 
			$("#fullcalendar-new-event-button").removeClass('hide'); 
			$('#neweventbuttondivid').removeClass("height-40");
		}
		/* We don't need this custom scroll bar for calendar 2x2 window. commented by naveen::       	 
		 *  if(options.isAutoscrollenable){
        		  var xiimcustomScrollbarOptions = {elementid:"#calendarTwoBytwoContainer",isUpdateOnContentResize:true,setHeight:"580px",vertical:'y'};
        		  xiimcustomScrollbar(xiimcustomScrollbarOptions);
        	  }*/

		var selectable = false;
		if( options.type == 'PERSONAL' ){
			selectable = true;
		}else if(options.type == 'GROUP' || options.type == 'COURSE'){
			if(options.isEditable == 'true'){
				selectable = true;
			}else{
				selectable = false;
			}
		}
		if(options.fcAssociationType == 'COURSE'){
			courseStatus = $('#courseStatus').val();//UNPUBLISHED
			associationType = $('#associationType').val();//COURSE,GROUP
			loggedInUserRoleName = $('#loggedInUserRoleName').val();//PUBLISHER
			loggedInUserCircle = $('#loggedInUserCircle').val();//Educator
		}

		if(options.fcAssociationType == 'GROUP' || options.fcAssociationType == 'COURSE'){
			$("#myEvent2X2view").addClass("hide");
			$("#upComingEvents2X2view").text("Events");
			$("#myCalendar2X2view").text("Calendar");
			$('#calenderTitle').html('Group Calendar');
			if(FullCalendarWidget.settings.isEditable == 'false'){
				$("#draftEvents2X2view").addClass("hide");
			}else if(FullCalendarWidget.settings.isEditable == 'true'){
				$("#draftEvents2X2view").removeClass("hide");
			}
		} 

		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			 eventAfterRender: function(event, element, view) {
				 if(view.name == 'agendaWeek' ||  view.name == 'agendaDay')
					 $(element).css('width','40px');
               		},
			height: 500,
			width: 553,
			defaultDate: new Date(),
			selectable: selectable,
			defaultView: 'month',
			selectHelper: true,
			firstDay:0,//To make calendar starts with monday(1)  0--sunday,1--monday,...etc.
			nextDayThreshold: '00:00:00',//To decide day starts at mid night
			select: function(start, end) {
			var tempDate = new Date();
			var viewObj = $('#calendar').fullCalendar('getView');
			if(viewObj.name == 'month'){
				if(((tempDate - start) / (1000 * 60 * 60 ) > 24) ){
					return;
				}
			}

			if(viewObj.name == 'agendaWeek' || viewObj.name == 'agendaDay'){
				if(tempDate - start > 0){
					return;
				}
			}

			var statDateValue = new Date(start);
			var endDateValue = new Date(end);

			var startDateHours = (viewObj.name == 'agendaWeek' || viewObj.name == 'agendaDay')?statDateValue.getHours():00;
			var startDateMinutes = (viewObj.name == 'agendaWeek' || viewObj.name == 'agendaDay')?statDateValue.getMinutes():00;
			var endDateHours = (viewObj.name == 'agendaWeek' || viewObj.name == 'agendaDay')?endDateValue.getHours():23;
			var endDateMinutes = (viewObj.name == 'agendaWeek' || viewObj.name == 'agendaDay')?endDateValue.getMinutes():30;

			if(viewObj.name == 'month'){
				endDateValue = statDateValue;
			}

			statDateValue = new Date(statDateValue.getUTCFullYear(), statDateValue.getUTCMonth(), statDateValue.getUTCDate(),  statDateValue.getUTCHours(), statDateValue.getUTCMinutes(), statDateValue.getUTCSeconds());
			endDateValue = new Date(endDateValue.getUTCFullYear(), endDateValue.getUTCMonth(), endDateValue.getUTCDate(),  endDateValue.getUTCHours(), endDateValue.getUTCMinutes(), endDateValue.getUTCSeconds());


			var startDate = new Date(statDateValue.getFullYear(),statDateValue.getMonth(), statDateValue.getDate(), startDateHours,startDateMinutes, 00, 00);
			var endDate = new Date(endDateValue.getFullYear(),endDateValue.getMonth(), endDateValue.getDate(), endDateHours,endDateMinutes, 00, 00);

			var options={
					ele:"#new-event-container",
					mode:'New',
					photoId:FullCalendarWidget.settings.fcAssociationPhotoId,
					associationType:FullCalendarWidget.settings.fcAssociationType,
					associationId:FullCalendarWidget.settings.fcAssociationId,
					associationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier,
					userName:FullCalendarWidget.settings.userName,
					fromDate:startDate,
					toDate:endDate,
					onExit:function(){
				if(FullCalendarWidget.settings.onEventExit && $.isFunction(FullCalendarWidget.settings.onEventExit)){
					FullCalendarWidget.settings.onEventExit();
				}
				return;//this is the function executes after closing the event.
			}

			};

			if(options.associationType == 'COURSE'){
				options.isCourseManageCategories = true;
			}
			Event.init(options);
			//$('#calendar').fullCalendar('unselect');
		},
			editable: false,
			eventLimit: 3, // allow "more" link when too many events
			/*eventLimit: {
  			        'month': 3, // adjust to 6 only for agendaWeek/agendaDay
  			        'default': true // give the default value to other views
  			    },*/
		events: function(start, end, timezone, callback) {
		
		// REMOVED THE DUPLICATE LOAD EVENT REQUESTS - THE OTHER REQUEST IS IN FULLCALENDAR.JS
		//	var calOptions = FullCalendarWidget.loadEventsRequest('month',new Date());

		//	calOptions.requestInfo['associationType'] = FullCalendarWidget.settings.fcAssociationType;
		//	doAjax.PostServiceInvocation(calOptions);
		},
			timezone: 'local',
			slotDuration: '00:30:00',
			/*				eventMouseover:function( event, jsEvent, view ) { 
					alert(event.name+"::event---jsEvent::"+jsEvent+"----::view"+view.name);
				},*/
		eventClick: function(calEvent, jsEvent, view) {
			// alert('Event: ' + calEvent.title);
			//  alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
			// alert('View: ' + view.name);

			var options={
					ele:"#new-event-container",
					mode:'View',
					photoId:FullCalendarWidget.settings.fcAssociationPhotoId,
					uniqueIdentfier:calEvent.id,
					associationType:FullCalendarWidget.settings.fcAssociationType,
					associationId:FullCalendarWidget.settings.fcAssociationId,
					userName:FullCalendarWidget.settings.userName,
					eventIdentifiers:FullCalendarWidget.eventIdentifiers,
					removeEvent:FullCalendarWidget.removeFullCalendarEvent,
					associationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier,
					source:FullCalendarWidget.settings.fcAssociationType,
					isPuborAdmin:FullCalendarWidget.settings.isPuborAdmin,
					onExit:function(){

				if(FullCalendarWidget.settings.onEventExit && $.isFunction(FullCalendarWidget.settings.onEventExit)){
					FullCalendarWidget.settings.onEventExit();
				}
				return;//to do nothing when closing the event.
			}
			};
			Event.init(options);

		},
			categories:FullCalendarWidget.categories,
			photoId:FullCalendarWidget.settings.fcAssociationPhotoId,
			associationType:FullCalendarWidget.settings.fcAssociationType,
			associationId:FullCalendarWidget.settings.fcAssociationId,
			associationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier,
			userName:FullCalendarWidget.settings.userName,
			isEditable:options.isEditable
			/*				,dayNamesShort : ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
  		  				 'Thursday', 'Friday', 'Saturday']*/
		});

		$("#monthButton").addClass('selectedview');
		var calendarDate = new Date();
		
	//	alert(" creating mini calendar ");
		
		$("#miniCalendar").jqxCalendar({
		
			width: 180, 
			height: 160,
			showOtherMonthDays: false,
			navigationDelay: 0,
			firstDayOfWeek:0
		});


		$('#miniCalendar').on('viewChange', function (event){

		//	 console.log(" miniCalendar viewChange");
			var date = event.args.date;
			//var view = event.args.view;
			//var viewFrom = view.from;
			//var viewTo = view.to;

			calendarDate = date;

			$('#calendar').fullCalendar( 'gotoDate', date );

			//	 alert(" going to date : " + date);
			
			/*
					var calOptions = FullCalendarWidget.loadEventsRequest('agendaDay',new Date());

  					calOptions.requestInfo['associationType'] = FullCalendarWidget.settings.fcAssociationType;
  					doAjax.PostServiceInvocation(calOptions);
			 */
		});

		$('#miniCalendar').on('change', function (event) {

			//	  console.log(" miniCalendar change");
			//  alert("change");
			var date = event.args.date;
			//var view = event.args.view;
			//var viewFrom = view.from;
			//var viewTo = view.to;
			if (event.type == 'change') {
				calendarDate = date;
				$('#calendar').fullCalendar( 'gotoDate', date );
			}

			//      $('#miniCalendar').trigger( "viewChange" ) ;
		});

		var categoryFilterOptions={
				ele:"#categoriesFilterContainer",
				associationType:FullCalendarWidget.settings.fcAssociationType,
				associationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier,
				mode:'Filter',
				isEditable:FullCalendarWidget.settings.isEditable,
				onClick:function(data){
					var categories = data;
					var calOptions = FullCalendarWidget.loadEventsRequest('agendaDay',calendarDate);
					calOptions.requestInfo['callBack']=FullCalendarWidget.renderFullCalendarEvents;
					var req = $.parseJSON(calOptions.data);
					var eventSearchCriteria = req.eventSearchCriteria;
					for(var i=0;i<categories.length;i++){
						if($.isNumeric(categories[i])){
							eventSearchCriteria.push({
								"eventSearchCriteria": "CATEGORY",
								"eventSearchCriteriaValue": categories[i]
							});
						}else{
							eventSearchCriteria.push({
								"eventSearchCriteria": "EVENTASSOCIATIONTYPE",
								"eventSearchCriteriaValue": categories[i]
							});
						}
				}

				req.eventSearchCriteria = eventSearchCriteria;
				req =  JSON.stringify(req);
				calOptions.data = req;
				doAjax.PostServiceInvocation(calOptions);

			}
		};

		EventCategories.init(categoryFilterOptions);

		$("#showOptions2X2Calendar").off('click').bind('click',function(e){
			$("#removeHideCalendar2X2OptionsID").toggleClass('hide');
		});

		$("#myCalendar2X2view").off('click').bind('click',function(e){
		//	alert("myCalendar2X2view clicked ");
			/*  			    var calendarOptions = {
					element : FullCalendarWidget.settings.element,
					isPersonalCategories : true,
					isCourseCategories : false,
					fcAssociationId:FullCalendarWidget.settings.fcAssociationId,
					userName:FullCalendarWidget.settings.userName,
					isEditable:FullCalendarWidget.settings.isEditable,
					type:options.type, //Personal/Group/Course
					fcAssociationType:FullCalendarWidget.settings.fcAssociationType,
					fcAssociationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier,
					fcAssociationPhotoId:FullCalendarWidget.settings.fcAssociationPhotoId,
					isAutoscrollenable:true
				 };*/

			FullCalendarWidget.init(options);
			$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");

			if(FullCalendarWidget.settings.isEditable && (FullCalendarWidget.settings.fcAssociationType == 'GROUP'  || FullCalendarWidget.settings.fcAssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}
		});
		$("#upComingEvents2X2view").off('click').bind('click',function(e){
		//	alert(" up coming events clicked ");
			var upcomingOptions = {
					ele :	FullCalendarWidget.settings.element,
					eventType:"MONTH",
					isUpcomingEvents:true,
					type:options.type, //Personal/Group/Course
					AssociationType:FullCalendarWidget.settings.fcAssociationType,
					AssociationId:FullCalendarWidget.settings.fcAssociationId,
					AssociationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier,
					AssociationPhotoId:FullCalendarWidget.settings.fcAssociationPhotoId,
					isEditable:FullCalendarWidget.settings.isEditable,
					currentDate:new Date()
			};
			myCalendarEventsTwoByTwo.init(upcomingOptions); 
			$("#calenderbodycontentid").addClass("calendar-padding");
			/*				if($("#calendarTwoBytwoContainer").is(':visible'))
					$("#calendarTwoBytwoContainer").mCustomScrollbar('destroy');*/
			$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");

			if(FullCalendarWidget.settings.isEditable && (FullCalendarWidget.settings.fcAssociationType == 'GROUP'  || FullCalendarWidget.settings.fcAssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}
		});
		$("#draftEvents2X2view").off('click').bind('click',function(e){
			var draftOptions = {
					ele :	FullCalendarWidget.settings.element,
					eventType:"DRAFTEVENTS",
					isDraftEvents:true,
					type:options.type, //Personal/Group/Course
					AssociationType:FullCalendarWidget.settings.fcAssociationType,
					AssociationId:FullCalendarWidget.settings.fcAssociationId,
					AssociationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier,
					AssociationPhotoId:FullCalendarWidget.settings.fcAssociationPhotoId,
					isEditable:FullCalendarWidget.settings.isEditable,
					currentDate:new Date()
			};
			myCalendarEventsTwoByTwo.init(draftOptions);
			$("#calenderbodycontentid").addClass("calendar-padding");
			/*				if($("#calendarTwoBytwoContainer").is(':visible'))
					$("#calendarTwoBytwoContainer").mCustomScrollbar('destroy');*/
			$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");
			if(FullCalendarWidget.settings.isEditable && (FullCalendarWidget.settings.fcAssociationType == 'GROUP'  || FullCalendarWidget.settings.fcAssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}
		});
		$("#myEvent2X2view").off('click').bind('click',function(e){

			if($("#calendar_event_count:visible").length > 0){
				// added code to update calendar events notification count
				$('#calendar_event_count').addClass('hide');
				updateNotificationCount(2);
			}

			var pendingOptions = {
					ele :	FullCalendarWidget.settings.element,
					eventType:"MYEVENTS",
					isMyEvents:true,
					type:options.type, //Personal/Group/Course
					AssociationType:FullCalendarWidget.settings.fcAssociationType,
					AssociationId:FullCalendarWidget.settings.fcAssociationId,
					AssociationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier,
					AssociationPhotoId:FullCalendarWidget.settings.fcAssociationPhotoId,
					isEditable:FullCalendarWidget.settings.isEditable,
					currentDate:new Date()
			};
			myCalendarEventsTwoByTwo.init(pendingOptions); 
			$("#calenderbodycontentid").addClass("calendar-padding");
			/*				if($("#calendarTwoBytwoContainer").is(':visible'))
					$("#calendarTwoBytwoContainer").mCustomScrollbar('destroy');*/
			$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");

			if(FullCalendarWidget.settings.isEditable && (FullCalendarWidget.settings.fcAssociationType == 'GROUP'  || FullCalendarWidget.settings.fcAssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}
		});	      

		$("[id^=minimize_maximize_]").click(function(e){
			var liid = $(this).attr('liid');
			var idd = $(this).attr('idd');
			var ele = gridster.$el.children();
			var aw = $(ele[idd - 1]);
			var awgd = aw.coords().grid;
			if(liid == "Calendar1x2"){
				shiftingWidgetTwobyTwo(awgd,aw,liid,ele,idd,true);
				$('.clickedType').attr('liid',liid);
				dashboardShifting.toMyCalendar1x2View();

			}else if(liid == "Calendar2x2"){

				//This line will return if the current widget is already in (2X2) view
				if( $('#'+idd).attr('data-sizex')==2 && $('#'+idd).attr('data-sizey')==2){
					$("#removeHideCalendarOptionsID").addClass('hide');
					return;
				} 	 
				shiftingWidgetTwobyTwo(awgd,aw,liid,ele,idd,false);
				$('.clickedType').attr('liid',liid);
				dashboardShifting.toMyCalendar2x2View();

			}else if(liid == "Calendar1x1"){
				$('.clickedType').attr('liid',liid);
				//This line will return if the current widget is already in (1x1) view
				if( $('#'+idd).attr('data-sizex')==1 && $('#'+idd).attr('data-sizey')==1){
					$("#removeHideCalendarOptionsID").addClass('hide');
					return;
				} 	 				
				shiftingWidgetOnebyOne(awgd,aw,liid,idd);
				$('.clickedType').attr('liid',liid);
				dashboardShifting.toMyCalendar1x1View();
			}
		});


		$("#fullcalendar-new-event-button").off("click").bind("click",function(e){

			var statDateValue = new Date();
			var endDateValue = new Date();

			var startDate = new Date(statDateValue.getFullYear(),statDateValue.getMonth(), statDateValue.getDate(), 00,00, 00, 00);
			var endDate = new Date(endDateValue.getFullYear(),endDateValue.getMonth(), endDateValue.getDate(), 23,30, 00, 00);
			var options={
					ele:"#new-event-container",
					mode:'New',
					photoId:FullCalendarWidget.settings.fcAssociationPhotoId,
					associationType:FullCalendarWidget.settings.fcAssociationType,
					associationId:FullCalendarWidget.settings.fcAssociationId,
					isCourseManageCategories:FullCalendarWidget.settings.isCourseManageCategories,
					associationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier,
					userName:FullCalendarWidget.settings.userName,
					fromDate:startDate,
					toDate:endDate

			};
			Event.init(options);
		});  

		//this.bindEvents(options);
	},
		removeFullCalendarEvents:function(){//removes all events
		$('#calendar').fullCalendar('removeEvents');	
	},
		removeFullCalendarEvent:function(eventUniqueIdentifier){//remove specific event
		$('#calendar').fullCalendar('removeEvents',eventUniqueIdentifier);	
	},
	renderFullCalendarEvents:function(events){
			$('#calendar').fullCalendar('removeEvents');
			for(var i=0;i<events.length;i++){
				events[i].allDay = convertStringToBoolean(events[i].allDay);
				events[i].start =  convertUTCDateTimeTo.LocalBrowserDateTime(events[i].start);
				events[i].end = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].end);
				
				if(i == (events.length - 1))
					$('#calendar').fullCalendar('renderEvent', events[i], false, true); //do render
				else
					$('#calendar').fullCalendar('renderEvent', events[i], false, false); //do not render

				if( $.inArray($.trim(events[i].eventUniqueIdentifier), FullCalendarWidget.eventIdentifiers)< 0){
					if(events[i].eventUniqueIdentifier){
					FullCalendarWidget.eventIdentifiers.push(events[i].eventUniqueIdentifier);
					}
				}
			}
	},
	renderFullCalendarEvent:function(event){
		//logic to render events on calendar
		$('#calendar').fullCalendar('renderEvent', event, false);
	},
	
	bindEvents : function(options){

		isEditable = FullCalendarWidget.settings.isEditable;

		var filterCriteria = $("#filterCriteria").val();
		//alert('filterCriteria--'+filterCriteria);
		var givenDate = '';//$("#givenDate").val();
		if(givenDate == ''){
			givenDate = new Date();
		}

		FullCalendarWidget.loadEvents(filterCriteria,givenDate);

		if( options.isPersonalCategories ){
			FullCalendarWidget.loadAllCategories();
			var categories;
			categories = [];
			if (categories.length < 1) {
				FullCalendarWidget.getAllCategories('ALL');
			}

		$(".category-filter").change(function(event){
				$("#category").empty();
				categoryFilter = $(this).val();
				//alert('categoryFilter---'+categoryFilter);

				if( categoryFilter == 'PERSONAL' ){

					$("#category").append('<div class="checkbox-sm-icons categoryDiv" id="category-PERSONAL">'
							+'<label><input class="categoryClass" id="PERSONAL" type="checkbox" checked="checked">PERSONAL MEETING</label>'
							+'</div>');
					$("#category").append('<div class="checkbox-sm-icons categoryDiv" id="category-REMINDER">'
							+'<label><input class="categoryClass" id="REMINDER" type="checkbox" checked="checked">REMINDER</label>'
							+'</div>');
					FullCalendarWidget.selectCategory();
				}else{
					// Ajax call to load categories by category filter
					FullCalendarWidget.getAllCategories(categoryFilter);
				}
			});
			//for course categories
		}else if( options.isCourseCategories ){

			FullCalendarWidget.loadCourseEventCategories();
			//$("#eventTypes").addClass('hide');	

			$("#circleCategory").change(function(){
				var circleCategory = $(this).val();
				circleType = circleCategory;

				if($("#circleCategory option:selected").val().trim() == "All"){
					$(".eventTypeDiv").show();
				}else{
					$(".eventTypeDiv").show();
					$("#eventTypes").removeClass('hide');
					$.each(eventPrivacies,function(key,value){
						if( circleCategory == value['privacy'] ){
							eventTypes = [];
							var entry = '';
							if( value['eventTypes']['entry'].length == undefined || value['eventTypes']['entry'].length == 'undefined '){
								entry = [value['eventTypes']['entry']];	
							}else {
								entry = value['eventTypes']['entry'];
							}
							$.each(entry,function(key2,value2){
								eventTypes.push(value2['value']);
								$("#div-"+$.trim(value2['value'])).show();
							});
							$("#div-all").show();
						}
					});
				}
				$(".eventTypeClass").removeAttr('checked');
				$(".eventTypeClass").attr('disabled','disabled');
				$("#eventType_all").attr("checked","checked");
				$("#eventType_all").prop("checked","checked");
				FullCalendarWidget.loadEvents(categorySelectView,globalDate);	
			});


			$(".eventTypeClass").change(function() {
				if($(this).prop('checked') === true){
					if($(this).attr('value') == 'All'){
						$('.eventTypeClass').each(function(event){
							if( $(this).attr("disabled") != "disabled" ){
								$(this).prop('checked', true);
							}
						});
					}else {
						var totalCount = 0;
						var selectedCount = 0;
						$('.eventTypeClass').each(function() {
							if( $(this).attr("disabled") != "disabled" ){
								totalCount = totalCount + 1;
								if( $(this).is(":checked")) {
									selectedCount = selectedCount + 1;
								}
							}
						}); 
						if( (totalCount != 0 && totalCount == selectedCount) || ( selectedCount < totalCount && (totalCount-selectedCount == 1)) ){
							$("#eventType_all").prop('checked', true);
						}
					}
					if($('input[value="4"]').is(":checked") && ($('input[value="5"]').is(":checked")) && ($('input[value="6"]').is(":checked")) && ($('input[value="7"]').is(":checked"))){
						$('.eventTypeClass').prop('checked', true);
						$("#eventType_all").prop('checked', true);
					}
				}else{
					if($(this).attr('value') == 'All'){
						$('.eventTypeClass').prop('checked', false);
					}
					if($(this).attr('value') == '4' || ($(this).attr('value') == '5') || ($(this).attr('value') == '6') || ($(this).attr('value') == '7')){
						$(this).prop('checked', false);
						$("#eventType_all").prop('checked', false);

					}
				}
				eventTypes = [];
				var isAtleastOneSelected = false;
				$('.eventTypeClass:checked').each(function() {
					isAtleastOneSelected = true;
					if( this.value != 'All' ){
						eventTypes.push(this.value);	
					}
				}); 
				if( !isAtleastOneSelected ){
					$('#calendar').fullCalendar('removeEvents'); 
				}else{
					FullCalendarWidget.loadEvents(categorySelectView,globalDate);	
				}
				//alert("eventTypesList--"+eventTypesList);
			});


			$("#eventType_all").attr('checked','checked');
			$("#eventType_all").prop('checked','checked');
		}
		$('.selectpicker').selectpicker({});

	},
	fullCalendarView : function(selectView,date,eventsList){

		//alert('isEditable---'+isEditable);
		$('#calendar').fullCalendar('removeEvents'); 
		$('#calendar').fullCalendar('addEventSource',eventsList);
		$('#calendar').removeClass('overlay-bg');
		$("#calendarProcessing").hide();

		$(".fc-month-button").removeClass('fc-state-disabled');
		$(".fc-agendaWeek-button").removeClass('fc-state-disabled');
		$(".fc-agendaDay-button").removeClass('fc-state-disabled');
		$(".fc-prev-button").removeClass('fc-state-disabled');
		$(".fc-next-button").removeClass('fc-state-disabled');
		$(".fc-today-button").removeClass('fc-state-disabled');

	},
	loadEventsRequest : function(selectView,date){

		//	alert('loadEventsRequest: date---'+date);
		categorySelectView = selectView;
		globalSelectView = selectView;
		categoryDate = date;
		globalDate = date;
		//	alert(selectView+'---'+date+'---'+categoryIds+'--'+categorySelectView+'---'+categoryDate);

		//var formattedDate =  new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()));
		var formattedDate = date;//FullCalendarWidget.convertUTCDateToLocalDate(date);
		var offset = getOffset();

		var eventFilterCriteriaEnum = 'MONTH';
		if( selectView == 'month' ){
			eventFilterCriteriaEnum = 'MONTH';
		}else if( selectView == 'agendaWeek' ){
			eventFilterCriteriaEnum = 'WEEK';
		}else if( selectView == 'agendaDay' ){
			eventFilterCriteriaEnum = 'MONTH';
		}
		/*//processing symbol
	    	$('#calendar').addClass('overlay-bg');
	    	$("#calendarProcessing").show();*/

		formattedDate = FullCalendarWidget.formatDate_yyyymmdd(date);
		//load categories for request object
		var eventSearchCriteria = FullCalendarWidget.loadCategories();

		var monthViewStartDate = FullCalendarWidget.formatDate_yyyymmdd(new Date($('#calendar').fullCalendar('getView').start));
		var monthViewEndDate = FullCalendarWidget.formatDate_yyyymmdd(new Date($('#calendar').fullCalendar('getView').end));

		//	 alert(" monthViewEndDate " + monthViewEndDate);
		var currentview = $('#calendar').fullCalendar('getView');

		eventSearchCriteria.push({
			"eventSearchCriteria": "OFFSET",
			"eventSearchCriteriaValue": offset
		});

		if(currentview.name == 'agendaDay'){
			eventSearchCriteria.push({
				"eventSearchCriteria": "CURRENTDATE",
				"eventSearchCriteriaValue": formattedDate
			});
		}else{
			eventSearchCriteria.push({
				"eventSearchCriteria": "FROMDATE",
				"eventSearchCriteriaValue": monthViewStartDate
			});
			eventSearchCriteria.push({
				"eventSearchCriteria": "TODATE",
				"eventSearchCriteriaValue": monthViewEndDate
			});
		}

		var associationType = FullCalendarWidget.settings.fcAssociationType;//$("#fcAssociationType").val();
		var viewTypeEnum = 'GROUPEVENTS_CALENDERVIEW';
		if( associationType == 'GROUP' ){
			eventSearchCriteria.push({
				"eventSearchCriteria": "GROUPID",
				"eventSearchCriteriaValue": FullCalendarWidget.settings.fcAssociationId
			});
			//viewTypeEnum = 'GROUPEVENTS_CALENDERVIEW' ;
			viewTypeEnum = 	"GROUPEVENTS_LISTVIEW";
			
		}else if( associationType == 'COURSE' ){
			eventSearchCriteria.push({
				"eventSearchCriteria": "COURSEID",
				"eventSearchCriteriaValue": FullCalendarWidget.settings.fcAssociationId
			});
			//viewTypeEnum = 'COURSEEVENTS_CALENDERVIEW';
			viewTypeEnum = "COURSEEVENTS_LISTVIEW";
			
		} else if( associationType == 'CONNECTION' ){
		//	alert(" association type CONNECTION" );
			//viewTypeEnum = 'UPCOMINGEVENTS_VIEW';
			viewTypeEnum = 'MYEVENTS_LISTVIEW';
		}

		var getEventRequest = {
				"userId": $("#userId").val(),
				"eventSearchCriteria": eventSearchCriteria,
				"eventFilterCriteriaEnum": eventFilterCriteriaEnum,
				"pageCriteriaModel": {
			"isAll": true
		},
				"viewTypeEnum": viewTypeEnum,
				"accessToken": $("#accessToken").val(),
				"langId": $("#languageId").val()
		};

		getEventRequest = JSON.stringify(getEventRequest);
		//	 alert('getEventRequest---'+getEventRequest+'--'+associationType);
		var getEventsURI = $("#getEventsURI").val();
		getEventsURL = getModelObject('serviceUrl')+getEventsURI;

		//:: AJAX call to get Events
		var options = {
				url:getEventsURL,
				instanceName:'getEvents',
				data:getEventRequest,
				requestInfo:{associationType:associationType},
				successCallBack:FullCalendarWidget.loadEventsSuccessCallBack,
				failureCallBack:FullCalendarWidget.loadEventsFailureCallBack,
				async:true
		};
		//doAjax.PostServiceInvocation(options);
		return options;
	},
	loadEvents : function(selectView,date){


		// 	alert('loadEvents: date---'+date);
		categorySelectView = selectView;
		globalSelectView = selectView;
		categoryDate = date;
		globalDate = date;
		//alert(selectView+'---'+date+'---'+categoryIds+'--'+categorySelectView+'---'+categoryDate);

		//var formattedDate =  new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()));
		var formattedDate = FullCalendarWidget.convertUTCDateToLocalDate(date);
		var offset = getOffset();

		var eventFilterCriteriaEnum = 'MONTH';
		if( selectView == 'month' ){
			eventFilterCriteriaEnum = 'MONTH';
		}else if( selectView == 'agendaWeek' ){
			eventFilterCriteriaEnum = 'WEEK';
		}else if( selectView == 'agendaDay' ){
			eventFilterCriteriaEnum = 'MONTH';
		}
		//processing symbol
		$('#calendar').addClass('overlay-bg');
		$("#calendarProcessing").show();

		formattedDate = FullCalendarWidget.formatDate_yyyymmdd(formattedDate);
		//load categories for request object
		var eventSearchCriteria = FullCalendarWidget.loadCategories();

		eventSearchCriteria.push({
			"eventSearchCriteria": "OFFSET",
			"eventSearchCriteriaValue": offset
		});

		eventSearchCriteria.push({
			"eventSearchCriteria": "CURRENTDATE",
			"eventSearchCriteriaValue": formattedDate
		});

		var associationType = FullCalendarWidget.settings.fcAssociationType;//$("#fcAssociationType").val();
		var viewTypeEnum = 'GROUPEVENTS_CALENDERVIEW';
		if( associationType == 'GROUP' ){
			eventSearchCriteria.push({
				"eventSearchCriteria": "GROUPID",
				"eventSearchCriteriaValue": $("#fcAssociationId").val()
			});
			viewTypeEnum = 'GROUPEVENTS_CALENDERVIEW' ;
		}else if( associationType == 'COURSE' ){
			eventSearchCriteria.push({
				"eventSearchCriteria": "COURSEID",
				"eventSearchCriteriaValue": $("#fcAssociationId").val()
			});
			viewTypeEnum = 'COURSEEVENTS_CALENDERVIEW';
		} else if( associationType == 'CONNECTION' ){
			viewTypeEnum = 'MYEVENTS_CALENDERVIEW';
		}

		var getEventRequest = {
				"userId": $("#userId").val(),
				"eventSearchCriteria": eventSearchCriteria,
				"eventFilterCriteriaEnum": eventFilterCriteriaEnum,
				"pageCriteriaModel": {
			"isAll": true
		},
				"viewTypeEnum": viewTypeEnum,
				"accessToken": $("#accessToken").val(),
				"langId": $("#languageId").val()
		};

		getEventRequest = JSON.stringify(getEventRequest);
		//	 alert('getEventRequest---'+getEventRequest+'--'+associationType);
		var getEventsURI = $("#getEventsURI").val();
		getEventsURL = getModelObject('serviceUrl')+getEventsURI;

		//:: AJAX call to get Events
		var options = {
				url:getEventsURL,
				data:getEventRequest,
				successCallBack:FullCalendarWidget.loadEventsSuccessCallBack,
				failureCallBack:FullCalendarWidget.loadEventsFailureCallBack,
				async:true
		};
		doAjax.PostServiceInvocation(options);

	},
		/**
		 * getUTCDateFromDateString
		 *
		 */
	getUTCDateFromDateString : function(dateString){

		var start_yyyy = dateString.substring(0,4);
		var start_mm = dateString.substring(5,7);
		var start_date = dateString.substring(8,10);
		var start_HH = dateString.substring(11,13);
		var start_MM = dateString.substring(14,16);
		var date = new Date(Date.UTC(start_yyyy,start_mm-1,start_date,start_HH,start_MM));
		return date;
	},
		/**
		 * formatDate_yyyymmdd :: example ::  2014-07-03 20:13:24
		 *
		 */
		formatDate_yyyymmdd : function (date){         

		date = new Date(date);
		var yyyy = date.getFullYear().toString();                                    
		var MM = (date.getMonth()+1).toString(); // getMonth() is zero-based         
		var dd  = date.getDate().toString();  
		var hh  = date.getHours().toString();  
		var mm  = date.getMinutes().toString();  
		var ss  = date.getSeconds().toString();  

		return yyyy + '-' + ( (MM[1] != undefined) ?MM:"0"+MM[0]) + '-' + ( (dd[1] != undefined) ?dd:"0"+dd[0]) + ' ' + ( (hh[1] != undefined) ?hh:"0"+hh[0]) + ':' + ( (mm[1] != undefined) ?mm:"0"+mm[0]) + ':' + ( (ss[1] != undefined) ?ss:"0"+ss[0]);
	},
		/**
		 * loadAllCategories
		 */
	loadAllCategories : function(){

		var options = {
				url:getModelObject('serviceUrl')+'/event/1.0/getEventCategory',
				headers:{
			"accessToken" : accessToken,
			"langId" : langId
		},
				data:{
			associationType:FullCalendarWidget.settings.fcAssociationType,
			associationUniqueIdentifier:FullCalendarWidget.settings.fcAssociationUniqueIdentifier
		},
		successCallBack:function(data){
			FullCalendarWidget.categories = data.eventCategoryModelList;
		},
				async:false
		};
		doAjax.GetServiceInvocation(options);
	},
	getAllCategories : function(categoryType){

		//group categories
		if( categoryType == '3'){
			allCategories = [];
			for( var i =0;i<groupCategories.length;i++){
				if( $.inArray($.trim(groupCategories[i].associationID), allCategories) < 0){
					allCategories.push(groupCategories[i].associationID);
					$("#category").append('<div class="checkbox-sm-icons categoryDiv" id="category-'+groupCategories[i].associationID+'">'
							+'<label><input class="categoryClass" type="checkbox" id="'+groupCategories[i].associationID+'" checked="checked"> '+groupCategories[i].categoryName+'</label>'
							+'</div>');
					//grey out the categorires
					//if(allActiveCategoryIds != undefined && allActiveCategoryIds.length > 0 && (jQuery.inArray( categories[i].associationID, allActiveCategoryIds ) == -1) ){
					$("#category-"+groupCategories[i].associationID).addClass('overlay-bg');
					$("#"+groupCategories[i].associationID).attr("disabled","disabled");
					// }
				}
			}
			//course categories
		}else if( categoryType == '4'){
			allCategories = [];
			for( var i =0;i<courseCategories.length;i++){
				if( $.inArray($.trim(courseCategories[i].associationID), allCategories) < 0){
					allCategories.push(courseCategories[i].associationID);
					$("#category").append('<div class="checkbox-sm-icons categoryDiv" id="category-'+courseCategories[i].associationID+'">'
							+'<label><input class="categoryClass" type="checkbox" id="'+courseCategories[i].associationID+'" checked="checked"> '+courseCategories[i].categoryName+'</label>'
							+'</div>');
					//grey out the categorires
					//if(allActiveCategoryIds != undefined && allActiveCategoryIds.length > 0 && (jQuery.inArray( categories[i].associationID, allActiveCategoryIds ) == -1) ){
					$("#category-"+courseCategories[i].associationID).addClass('overlay-bg');
					$("#"+courseCategories[i].associationID).attr("disabled","disabled");
				}
				// }
			}
		}else if( categoryType == 'PERSONAL'){

		}


		if( categoryType == 'ALL'){
			$(".categoryDiv").hide();
		}else{
			$(".categoryDiv").show();
		}

		isAllCategoriesChecked = true;
		FullCalendarWidget.selectCategory();

	},
	selectCategory : function(){
		$(".categoryClass").click(function(event){
			isCategoryChecked = true;
			if( $(this).attr("checked") == 'checked' ){
				$(this).removeAttr("checked");
			}else{
				$(this).attr("checked","checked") ;
			}
			FullCalendarWidget.getCategoryIds();
		});
		FullCalendarWidget.getCategoryIds();
	},
	getCategoryIds : function(){
		categoryIds = [];
		var categoryCount = 0;
		var globalCategoryCount = 0;
		$(".categoryClass").each(function(){
			globalCategoryCount++;
			if( $(this).attr("checked") == "checked" ){
				var categoryId = $(this).attr("id"); 
				if( categoryId != undefined ){
					categoryIds.push(categoryId);	
				}
			}else{
				categoryCount++;
			}
		});
		if( categoryCount == globalCategoryCount && globalCategoryCount > 0 ){
			$('#calendar').fullCalendar('removeEvents'); 
		}else{
			FullCalendarWidget.loadEvents(categorySelectView,categoryDate);
		}
	},
	loadCategories : function(){
		var eventSearchCriteria;
		eventSearchCriteria = []; 
		var fcAssociationType =  FullCalendarWidget.settings.fcAssociationType;
		//if( $("#fcAssociationType").val() != undefined && $("#fcAssociationType").val() == 'COURSE' ){
		if( fcAssociationType != undefined && fcAssociationType == 'COURSE' ){
			if( circleType != 'All' || circleType == 'All'  ){
				if( eventTypes != undefined && eventTypes.length > 0 ){
					for( var i=0;i<eventTypes.length;i++){
						eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",eventTypes[i]));
					}
				}
				if( circleType != 'All' ){
					eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTPRIVACY",circleType)); 
				}
			}
		}else{
			switch (categoryFilter) {
			case 'PERSONAL':
				//EVENT TYPE :PERSONAL
				if( categoryIds != undefined && categoryIds.length > 0 ){
					for( var i=0;i<categoryIds.length;i++){
						if( categoryIds[i] == 'PERSONAL'){
							eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",1));
						}else if( categoryIds[i] == 'REMINDER' ){
							eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",2));
						}
					}
				}else{
					eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",1));
					eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",2));
				}
				break;
			case '3':
				//EVENT TYPE :GROUP
				if( categoryIds != undefined && categoryIds.length > 0 ){
					for( var i=0;i<categoryIds.length;i++){
						eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("GROUPID",categoryIds[i]));
					}
				}else{
					eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",3));
				}
				break;
			case '4':
				//EVENT TYPE :COURSE
				if( categoryIds != undefined && categoryIds.length > 0 ){
					for( var i=0;i<categoryIds.length;i++){
						eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("COURSEID",categoryIds[i]));
					}
				}else {
					eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",4));
					eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",5));
					eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",6));
					eventSearchCriteria.push(FullCalendarWidget.setSearchCriteria("EVENTTYPE",7));
				}
				break;
			case 'ALL':
				//EVENT TYPE :GROUP
				/*	 if( categoryIds != undefined && categoryIds.length > 0 ){
			    			for( var i=0;i<categoryIds.length;i++){
			    				eventSearchCriteria.push(setSearchCriteria("GROUPID",categoryIds[i]));
			    			}
			       	 }*/
				break;
			}
		}
		return eventSearchCriteria;
	},
	setSearchCriteria : function(eventType,eventValue){
		return {
			"eventSearchCriteria": eventType,
			"eventSearchCriteriaValue": eventValue
		};
	},
	convertUTCDateToLocalDate : function(date){
		var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60
				* 1000);
		var offset = date.getTimezoneOffset() / 60;
		var hours = date.getHours();
		newDate.setHours(hours - offset);

		return newDate;

	},
	loadEventsSuccessCallBack : function(requestInfo,data){

		if ( !($('#miniCalendar').length)) return ; // QUERY IS BEING CALLED BEFORE UI IS READY ON IE
		
		var eventsList;
		eventsList = [];
	//	try{
			//GetEventsResponse.events (list of events)
			//data = $.parseJSON(data);
			var results = data['result'];
			var status = results['status'];			
			
			associationIds = [];

		//	console.log(" loadEventsSuccessCallBack " + requestInfo);

			if(status == 'true'){
				var events = data['events'];
				if( events != undefined ){
					if( events.length == undefined ){
						events = [events];
					}

					//var specialDates;
					var uniqueColorCodes;
					uniqueColorCodes = [];
					var colorCodeScores;
					colorCodeScores = [];
					var eventPrivacies;
					eventPrivacies = [];
					//logic to find the color importance
					if(events){
						for(var i=0;i<events.length;i++){
							//creating new array object with list of eventPrivacies. this will applicable for course only.
							if(typeof events[i].eventPrivacies != 'undefined')
								eventPrivacies.push(events[i].eventPrivacies);

							if($.inArray($.trim(events[i].eventCategoryModel.categoryColorCode),colorCodeScores) < 0){
								uniqueColorCodes.push({colorCode:events[i].eventCategoryModel.categoryColorCode,score:0,startTime:events[i].startTime});
								colorCodeScores.push(events[i].eventCategoryModel.categoryColorCode);
							}
						}
					}
					//		alert(" events length from load success: " + events.length);
					
					var startTime ;
					var endTime ;
					var dateX ;
					var dateY ;
					var loopDay ;
					 
					for(var i=0;i<events.length;i++){

				//		 console.log(" going through event " + events.length);
						 startTime =  convertUTCDateTimeTo.LocalBrowserDateTime(events[i].startTime);//FullCalendarWidget.getUTCDateFromDateString(events[i].startTime);
						 endTime = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].endTime);//FullCalendarWidget.getUTCDateFromDateString(events[i].endTime);
						 
						 endTime = isAllDayDateFormatting(events[i].allDay,startTime,endTime);

						if( $.inArray($.trim(events[i].eventUniqueIdentifier), FullCalendarWidget.eventIdentifiers) < 0){
							if(events[i].eventUniqueIdentifier){
								FullCalendarWidget.eventIdentifiers.push(events[i].eventUniqueIdentifier);
							}
						}
						
							//var day=startTime.getDate();
							 dateX = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
							 dateY = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());
							 
							 dateX = new Date(dateX.getFullYear(), dateX.getMonth(), dateX.getDate());
	 						 dateY = new Date(dateY.getFullYear(), dateY.getMonth(), dateY.getDate());
	 								
							// If event is less than 24 hrs but spans 2 days it needs to be captured
							var dayCount = Math.ceil((dateY.getTime() - dateX.getTime()) / 86400000 );
										
	 						var dayZ = 0 ;
	 							
							for(var loopTime=dateX.getTime(); dayZ <= dayCount; loopTime+=86400000 ){
								loopDay = new Date(loopTime);
								dateX = new Date(loopDay.getFullYear(), loopDay.getMonth(), loopDay.getDate());
								if((i == (events.length -1)) && (dayZ == dayCount))
									$("#miniCalendar").jqxCalendar('addSpecialDate', dateX, null, null, true);
								else
									$("#miniCalendar").jqxCalendar('addSpecialDate', dateX, null, null, false);
								
								dayZ++;
							//	console.log(" miniCalendar adding special date " + dateX);
							}
						
						//	$("#miniCalendar").jqxCalendar('addSpecialDate', dateX, '','', i);

						//	alert(" adding special date on " + dateX);
						var event = {
								id : events[i].eventUniqueIdentifier,
								title : events[i].eventName,
								start : events[i].startTime,
								end : events[i].endTime,
								editable : false,
								allDay : convertStringToBoolean(events[i].allDay)
						};
						
						if(events[i].eventCategoryModel){

							event.color = events[i].eventCategoryModel.categoryColorCode;
							if(requestInfo.associationType == 'CONNECTION'){
								if(events[i].rsvpEnum == 'AWAITING' || events[i].statusEnum == 'DRAFT'){
									event.color = events[i].eventCategoryModel.categoryBlurCode;
								}else{
									event.color = events[i].eventCategoryModel.categoryColorCode;
								} 
							}else{
								if(events[i].statusEnum == 'DRAFT' || events[i].rsvpEnum == 'AWAITING' || events[i].rsvpEnum == undefined){
									event.color = events[i].eventCategoryModel.categoryBlurCode;
								}else{
									event.color = events[i].eventCategoryModel.categoryColorCode;
								}
							}
						}
						eventsList.push(event);  
					}
					
				
				//	console.log(" starting dots");
					events = FullCalendarWidget.sortByKey(events,'startTime');
					var dayEvents = {};
					var dayColorMap = {};
					var dayStart ;
					var dayEnd ;
					var day ;
					var dayEventsList;
					
					for(var i=0;i<events.length;i++){
					
						 dayStart = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].startTime);
						 dayEnd = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].endTime);
	
						dayStart = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate());
	 					dayEnd = new Date(dayEnd.getFullYear(), dayEnd.getMonth(), dayEnd.getDate());
	 								
						// If event is less than 24 hrs but spans 2 days it needs to be captured
						var dayCount = Math.ceil((dayEnd.getTime() - dayStart.getTime()) / 86400000 );
								
						var dayZ = 0 ;
							
						for(var loopTime=dayStart.getTime(); dayZ <= dayCount; loopTime+=86400000)
						{
							day = new Date(loopTime).getDate();
							
							if(dayEvents[day] == null)
							{
								dayEventsList = [];
								dayEventsList.push(events[i]);
								dayEvents[day] = dayEventsList;
							}
							else
							{
								dayEvents[day].push(events[i]);
							}
							
							dayZ++;
						}
					}

					var eventsListInDay ;
					var colorScore ;
					var colorMap ;
					
					for(var key in dayEvents)
					{
						 eventsListInDay = dayEvents[key];
						 colorScore = 0;
						 colorMap = {};

						for(var i1= 0 ;i1<eventsListInDay.length;i1++){
							colorScore = 0;
							for(var j=0;j<uniqueColorCodes.length;j++){
								if(eventsListInDay[i1].eventCategoryModel.categoryColorCode == uniqueColorCodes[j].colorCode){
									if(colorMap[eventsListInDay[i1].eventCategoryModel.categoryColorCode]){
										colorScore = parseInt(colorMap[eventsListInDay[i1].eventCategoryModel.categoryColorCode]);
										colorScore = colorScore+1;
										colorMap[eventsListInDay[i1].eventCategoryModel.categoryColorCode] = colorScore;
									}else{
										colorScore = colorScore+1;
										colorMap[eventsListInDay[i1].eventCategoryModel.categoryColorCode] = colorScore;
									}
								}
							}
						}
					//	alert(" key in day events " + key);
						dayColorMap[key+'_colorMap'] = colorMap;
					}

					var specialDates = $('#miniCalendar .jqx-calendar-cell-specialDate').not('.jqx-calendar-cell-hidden');

					var colors ;
					var colorsList; 
					var html ;
					
				//	console.log("special dateas length : " + specialDates.length );
					for(var i=0;i < specialDates.length;i++){
						 day = $(specialDates[i]).html();
						 colors = dayColorMap[day+'_colorMap'];	
				   		 colorsList = [];
				   		 
				   	//	 alert(" adding dots for " + day);
				   		 
						html='<div class="dotswrapper"><span id="dotsContainer" class="dotsContainerMini">';
						
						if(colors){
							for (var key in colors) {
								colorsList.push({'score':colors[key],'color':key});
							}
							
							colorsList = FullCalendarWidget.sortByKey(colorsList,'score');
							
						//	alert(" colorsList length " + colorsList.length);
							if(colorsList.length > 3){
								//	alert(" more than 3 colorsList" );
								for(var i1 = colorsList.length-1;i1>=colorsList.length-3;i1--){
									html+='<i class="sm-circle-blue width-height-4 table-cell" style="background-color:'+colorsList[i1]['color']+'"></i>';
								}
							}
							else{
								//	alert(" less than 3 colorsList" );
								for(var i1 = colorsList.length-1;i1>=0;i1--){
									html+='<i class="sm-circle-blue width-height-4 table-cell" style="background-color:'+colorsList[i1]['color']+'"></i>';
								}
							}
							
							html+='</span></div>';
							$(specialDates[i]).addClass('position-relative');
							$(specialDates[i]).html(day+html);
							}
							else{
						//		alert(" no colors ");
							}				
					}			
						
					if($.isFunction(requestInfo.callBack)){
						requestInfo.callBack(eventsList);
					}
					// $('#calendar').fullCalendar('renderEvent', eventsList, false); // stick? = true

					//checking if eventPrivacies array object is empty or full. as this is applicable with course evnet only.
					/*if(!$.isEmptyObject(eventPrivacies)){
								 //removing all duplicate object from the array object
								 eventPrivacies = $.unique(eventPrivacies);

								 //checking is array object or not. this is not required but safe side written.
					    		var isarray = $.isArray(eventPrivacies);
					    		if(!isarray)
					    			eventPrivacies = [eventPrivacies];

					    		//if event Privacies
					    		if(eventPrivacies){
					    			//making all checked event Privacies are un checked.
					    			$('.coursecalendersenderstype').attr('checked',false);
					    			//checking if "ALL" value is present in the array object. As this array is all combination of all events in the calendar.
					    			if($.inArray("ALL",eventPrivacies)  != -1){
										$('#allcalonly').prop('checked',true);
					    			}else{//if there is not ALL event privacies checked peforming for other checkboxes.
					    			for(var i = 0; i<eventPrivacies.length; i++){
						    		    	if(eventPrivacies[i] == 'ALUMNI'){
									    		$('#alumniscalonly').prop('checked',true);
									  		}
									    	if(eventPrivacies[i] == 'LEARNER'){
									    		$('#learnerscalonly').prop('checked',true);
									  		}
									    	if(eventPrivacies[i] == 'INSTRUCTOR'){
									    		$('#instructorscalonly').prop('checked',true);
									  		}
					    				}
					    			}
					    		}
							 }*/
				}else{
					FullCalendarWidget.removeFullCalendarEvents();
				}
				//	displayCalendar(eventsList);

			}else{
				//genrateErrorMessages(data,"","changeOwnerErrors");
				$('#calendar').removeClass('overlay-bg');
				$("#calendarProcessing").hide();
			}
			//FullCalendarWidget.fullCalendarView(globalSelectView,globalDate,eventsList);


		/* TRY CATCH SLOWS DOWN PERFORMANCE
		}catch(e){
			$(".fc-month-button").removeClass('fc-state-disabled');
			$(".fc-agendaWeek-button").removeClass('fc-state-disabled');
			$(".fc-agendaDay-button").removeClass('fc-state-disabled');
			$(".fc-prev-button").removeClass('fc-state-disabled');
			$(".fc-next-button").removeClass('fc-state-disabled');
			$(".fc-today-button").removeClass('fc-state-disabled');

			$('#calendar').removeClass('overlay-bg');
			$("#calendarProcessing").hide();
		}
		*/
	},
	loadEventsFailureCallBack : function(jqXHR, textStatus,errorThrown) {

		//	alert(jqXHR+'---'+textStatus+'---'+errorThrown);
		$(".fc-month-button").removeClass('fc-state-disabled');
		$(".fc-agendaWeek-button").removeClass('fc-state-disabled');
		$(".fc-agendaDay-button").removeClass('fc-state-disabled');
		$(".fc-prev-button").removeClass('fc-state-disabled');
		$(".fc-next-button").removeClass('fc-state-disabled');
		$(".fc-today-button").removeClass('fc-state-disabled');

	},
	loadCategoriesSuccessCallBack : function(data){
		try {
			var results = data['result'];
			var status = results['status'];
			if (status == 'true') {
				categories = data['categoryModels'];
				if( categories != undefined && categories.length == undefined ){
					categories = [categories];
				}
				for( var i=0;i<categories.length;i++){
					if( categories[i].categoryType == 'GROUP' ){
						groupCategories.push({
							associationID:categories[i].associationID,
							categoryName : categories[i].categoryName
						});
					}else if( categories[i].categoryType == 'COURSE' ){
						courseCategories.push({
							associationID:categories[i].associationID,
							categoryName : categories[i].categoryName
						});
					}else if ( categories[i].categoryType == 'PERSONAL' ){
						personalCategories.push({
							associationID:categories[i].associationID,
							categoryName : categories[i].categoryName
						});
					}
				}
				//	alert(groupCategories+'--1--'+courseCategories+'--2-'+personalCategories);
			} else {
				//genrateErrorMessages(data,"","changeOwnerErrors");
			}

		} catch (e) {
			//alert('e--'+e);
		}
	},
	loadCategoriesFailureCallBack : function(jqXHR, textStatus, errorThrown) {
	},
	loadCourseEventCategories : function (){

		var associationType =   FullCalendarWidget.settings.fcAssociationType;//$("#fcAssociationType").val();
		var getEventCategoriesURI = $("#getEventCategoriesURI").val();
		var courseUniqueIdentifier = $("#fcAssociationUniqueIdentifier").val();
		var pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(0,0,true));
		var getEventCategoriesURL = getModelObject('serviceUrl')+getEventCategoriesURI  + "?pageCriteria="+pageCriteria +"&associationType="+encodeURIComponent(associationType)+"&associationUniqueIdentifer="+courseUniqueIdentifier;

		//			alert('getEventCategoriesURL---'+getEventCategoriesURL);

		//:: AJAX call to get Events
		var options = {
				url:getEventCategoriesURL,
				headers:{ 	
			"accessToken" : $("#accessToken").val(),
			"langId" : $("#languageId").val()
		},
				successCallBack:FullCalendarWidget.loadCourseEventCategoriesSuccessCallBack,
				failureCallBack:FullCalendarWidget.loadCourseEventCategoriesFailureCallBack,
				async:true
		};
		doAjax.GetServiceHeaderInvocation(options);

	},
	loadCourseEventCategoriesSuccessCallBack : function ( data ){
		try {
			var results = data['result'];
			var status = results['status'];
			if (status == 'true') {
				categoryInfoModelMap = data['categoryInfoModelMap'];
				eventPrivacies = categoryInfoModelMap['entry']['value']['eventPrivacies'];
				//var eventTypes = [];
				if( eventPrivacies != undefined ){
					if( eventPrivacies.length == undefined ){
						eventPrivacies = [eventPrivacies];
					}
					$.each(eventPrivacies,function(key,value){
						if( value['privacy'] != undefined ){
							var privacy = '';
							if(  value['privacy'] == 'ALU'){
								privacy= 'Alumni Circle';
							}else if(  value['privacy'] == 'EDU'){
								privacy= 'Educator Circle';
							}else if(  value['privacy'] == 'LER'){
								privacy= 'Learner Circle';
							}else if(  value['privacy'] == 'SEL'){
								privacy= 'Others';
							}
							$("#circleCategory").append('<option id="'+privacy+'" rel value="'+value['privacy']+'">'+privacy+'</option>');	

							$("#circleCategory").selectpicker('refresh');
							allCircles.push(value['privacy']);
						} else {
							//genrateErrorMessages(data,"","changeOwnerErrors");
						}
					});
				}

			}
		} catch (e) {
			//alert('e--'+e);
		}
	},loadCourseEventCategoriesFailureCallBack : function (jqXHR, textStatus, errorThrown ){

	}
	};
}.call(this);

var Event = function(){
	//var container;
	var accessToken =  $("#accessToken_meta").val();
	var langId = $("#langId_meta").val();
	var userId = $("#loggedInUserId-meta").val();
	var currentPosition = '';
	var previousPosition = '';
	var nextPosition = '';
	var hasNext =false,hasPrev = false;
	var eventData = '';
	var fromDate = '';
	var toDate = '';
	var selecteduseridlist=[];
	var eventPrivaciesCheckedcount = 0;
	return {
		defaults:{
		mode:'New',
		calendarType:'Personal',
		isPendingEvents:false,
		allDayEvent : false,
		isListView:false,
	},
		settings:{

	},
		connections:[],
		newconnectionuserids : [],
		users:[],
		hosts:[],

		destory:function(){
		Event.settings = {};
		Event.users = [];
		Event.hosts = [];
		Event.connections=[];
		fromDate ='';
		toDate ='';

	},
		init :function(options) {
		Event.destory();
		this.settings = {};
		this.defaults = {};
		this.defaults = {
			mode:'New',
			calendarType:'Personal',
			isPendingEvents:false,
			allDayEvent : false,
			isListView:false,
		};
		this.settings = $.extend(this.defaults,options);
		fromDate = Event.settings.fromDate;
		toDate = Event.settings.toDate;
		this.tempDate = new Date();
		var ele = this.settings.ele;
		container = ele.substring(1);
		currentPosition = -1;
		previousPosition = -1;
		nextPosition = -1;
		if(Event.settings.mode == 'View'){

			for(var i = 0;i<Event.settings.eventIdentifiers.length;i++){
				if(Event.settings.eventIdentifiers[i] == Event.settings.uniqueIdentfier){
					currentPosition = i;
					if(i > 0 ){
						previousPosition = i-1;
						hasPrev = true;
					}else{
						hasPrev = false;
					}
					if(i < Event.settings.eventIdentifiers.length-1 ){
						nextPosition = i+1;
						hasNext = true;
					}else{
						nextPosition = -1;
						hasNext = false;
					}
				}
			} 
			Event.prepareServiceRequest();
		}else{
			this.createUI(ele);
		}

	},

		prepareServiceRequest:function(){
		var headers = {
				accessToken:accessToken,
				langId:langId
		};
		var options = {
				url:getModelObject('serviceUrl')+'/event/1.0/getEventDetails/',
				data:{eventUniqueIdentifier:Event.settings.uniqueIdentfier},
				headers:headers,
				successCallBack:function(data){
					if(data.eventModel.rsvpEnum == 'AWAITING'){
						if(data.eventModel.hasPermission == 'true'){
							Event.settings.isPendingEvents = false;
						}else{
							Event.settings.isPendingEvents = true;
						}
					}else{
						Event.settings.isPendingEvents = false;
					}
					if(typeof Event.settings.isEventListView != 'undefined'){
						data['isEventListView'] = Event.settings.isEventListView;
					}
					Event.loadViewOrEditEvent(Event.settings.ele,data);
				},
				async:true
		};
		doAjax.GetServiceInvocation(options);
	},
	prepareCategoriesUI:function(){

	},
	createUI :function(element){
		var html='<form id="eventForm"><div style="" class="lightgreyborder">'
				+'<div class="inner-alerts hide" id="responseElementContentHolder">'
				+'<div id="messageElementStyleDiv" class="alert alert-success">'
				+'<a id="errorClose" href="javascript:void(0)" class="close" >&times;</a>'
				+'<div id="responseElementContent"></div>'
				+'</div>'
				+'</div>'
				+'	<div class="pad-12 pad-bot-0">'                                      	
				+'		<div id="window-event-titleid" class="font-15px helvetica-neue-roman">';
		if(Event.settings.mode == 'New'){
			html+='         <span>New Event</span>';	
		}else if(Event.settings.mode == 'Edit'){
			html+='          <span title="Previous" class="previous-up-sm-icons enabled-sm mar-left-23"></span>&nbsp;<span title="Next" class="next-down-sm-icons enabled-sm mar-lr-10"></span>';
		}else if(Event.settings.mode == 'View'){
			html+='          <span title="Previous" class="previous-up-sm-icons enabled-sm mar-left-23"></span>&nbsp;<span title="Next" class="next-down-sm-icons enabled-sm mar-lr-10"></span>';	
		}
		html+='			<i class="pull-right position-relative">'
				+'				<a href="javascript:void(0);" id="cancel-new-event"><span title="Close" class="close-sm-icons selected-sm"></span></a>'
				+'			</i>'
				+'		</div>'
				+'	 </div>'
				+'	  <div id="eventScrollDiv" class="pad-top-6">'	  
				+'		<div class="pad-lr-12 new-Event-section">'                                                
				+'			<div class="clear-float min-height-56 border-tb pad-top-5 pad-bot-56">'
				+'				<div class="col-xs-12 mar-bot-5">';
		if(Event.settings.associationType == 'CONNECTION'){
			if(Event.settings.photoId){
				html+='					<img src="/contextPath/User/'+Event.settings.photoId+'/profile.jpg" class="event-thumbnail"/>';		
			}else{
				html+='					<img src="'+contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg" class="event-thumbnail">';		
			}

		}else if(Event.settings.associationType == 'GROUP'){
			if(Event.settings.photoId){
				html+='					<img src="/contextPath/Group/'+Event.settings.photoId+'/stamp.jpg" class="event-thumbnail"/>';		
			}else{
				html+='					<img src="'+contextPath+'/static/pictures/no-group-image.jpg" class="event-thumbnail">';		
			}

		}else if(Event.settings.associationType == 'COURSE'){
			if(Event.settings.photoId){
				html+='					<img src="/contextPath/Course/'+Event.settings.photoId+'/stamp.jpg" class="event-thumbnail"/>';		
			}else{
				html+='					<img src="'+contextPath+'/static/pictures/defaultimages/french.png" class="event-thumbnail">';		
			}

		}
		if(Event.settings.associationType == 'CONNECTION'){
			html+='					<span id="viewEventColorCode" class="sm-circle-blue-connection-10px position-relative top-20" ></span>';
		}else if(Event.settings.associationType == 'GROUP'){
			html+='					<span id="viewEventColorCode" class="sm-circle-blue-group-10px position-relative top-20" ></span>';
		}
		else if(Event.settings.associationType == 'COURSE'){
			html+='					<span id="viewEventColorCode" class="sm-circle-blue-course-10px position-relative top-20" ></span>';
		}
		html+='					<span class="pull-right position-relative top-34">'                                       	
				+'						 <span class="float-left dropdown black-dropdown-panel categoryclasss" id="eventCategoryMenu">'

				+'						</span>'
				+'                      <div id="manageCategoriesContainer" class="hide"></div>'
				+'						<span title="Edit event" class="edit-sm-icons selected-sm mar-lr--5-10 isEditorNew" data-isEditorNew="false"  id="editpenciliconid"></span>' 
				+'						&nbsp;<span title="Delete event" class="trash-icons-sm enabled-sm hide"></span>'
				+'					</span>';
		if(Event.settings.associationType == 'CONNECTION'){
			html+='                  <input type="hidden" value="1" id="eventCategoryID" isCustomCategory="false" categoryName="Connections" categoryColorCode="blue" categoryBlurCode="#8ba4bc"/>';
		}else if(Event.settings.associationType == 'GROUP'){
			html+='                  <input type="hidden" value="2" id="eventCategoryID" isCustomCategory="false" categoryName="Groups" categoryColorCode="#39892f" categoryBlurCode="#6a8767"/>';		
		}else if(Event.settings.associationType == 'COURSE'){
			html+='                  <input type="hidden" value="3" id="eventCategoryID" isCustomCategory="false" categoryName="Course" categoryColorCode="red" categoryBlurCode="#c3dfe8"/>';		
		}

		html+='				</div> '
				+'			 </div>'
				+'			 <div class="event-Edit-mode pad-top-16">';



		if(Event.settings.associationType == 'COURSE' && typeof Event.settings.isCourseManageCategories != 'undefined' && Event.settings.isCourseManageCategories){
			html+='<div class="clearfix horizontal-fields">	            '+
					'		<input id="allonly" data-isinviteeadded="" class="css-checkbox courseneweventsendtype" checked="checked" type="checkbox" value="ALL">	           '+
					'		<label class="css-label pad-left-30" for="allonly">All</label>    '+
					'		<input id="instructorsonly" data-isinviteeadded="" class="css-checkbox courseneweventsendtype" type="checkbox" value="INSTRUCTOR">	           '+
					'		<label class="css-label pad-left-30" for="instructorsonly">Instructor</label> ';
			if(courseStatus == 'PUBLISHED'){
				html+='<input id="learnersonly" data-isinviteeadded="" class="css-checkbox courseneweventsendtype" type="checkbox" value="LEARNER">	            '+
						'		<label class="css-label pad-left-30" for="learnersonly">Learners</label> ';
			}
			html+='	<input id="alumnisonly" data-isinviteeadded="" class="css-checkbox courseneweventsendtype" type="checkbox" value="ALUMNI">	            '+
					'		<label class="css-label pad-left-30" for="alumnisonly">Alumni</label>   '+
					'		</div>';

		}



		html+='				 <div class="horizontal-fields clearfix min-height-30">'
				+'					<label for="projectTitle">Title</label>'
				+'					<div class="float-left text-left width-265 pad-left-12-imp"><input type="text" name="eventName" maxlength="100" id="eventName" value="" placeholder="Enter Event Name" class="newevent-input-textbox input-width-220"/></div>'
				+'               </div>'
				/*+'				<div class="horizontal-fields min-height-30">'
				    	+'					<label for="projectTitle">Host</label>'
				    	+'					<div class="float-left border-bottom text-left width-225" id="hostId" userId="'+userId+'">'+Event.settings.userName+'</div>'                                       
				    	+'				</div>'*/

				+'				<div class=" float-left horizontal-fields"><label for="projectTitle">Host</label>'
				+'              <div class=" float-left pad-left-12-imp" id="">'
				+'                  <div id="hostsContainer">';
				
				if(Event.settings.associationType == 'GROUP'){
					var groupNamee = $('#groupNamee').val();
				html+='                   <div class="float-left text-left width-220 darkgreybottomborder pad-bot-4" id="invitedUserID-'+userId+'">'+groupNamee+' ('+Event.settings.userName+')</div>';
					//html+='                   <div class="display-inline" id="invitedUserID-'+userId+'"><input type="text" readonly value="'+groupNamee+' ('+Event.settings.userName+')" class="newevent-input-textbox input-width-220"/></div>';
				}else if(Event.settings.associationType == 'COURSE'){
					var courseNamee = $('#courseNamee').val();
					html+='                   <div class="float-left text-left width-220 darkgreybottomborder pad-bot-4" id="invitedUserID-'+userId+'">'+courseNamee+' ('+Event.settings.userName+')</div>';
					//html+='                   <div class="display-inline" id="invitedUserID-'+userId+'"><input type="text" readonly value="'+groupNamee+' ('+Event.settings.userName+')" class="newevent-input-textbox input-width-220"/></div>';					
				}else{
					//html+='                     <div class="display-inline" id="invitedUserID-'+userId+'"><input type="text" readonly value="'+Event.settings.userName+'" class="newevent-input-textbox input-width-220"/></div>';
					html+='                   <div class="float-left text-left width-220 darkgreybottomborder pad-bot-4" id="invitedUserID-'+userId+'">'+Event.settings.userName+'</div>';
				}
		
				
				html+='                  </div>';

		html+='              </div></div>'

				+'				<div class="clear-float horizontal-fields clearfix min-height-30">'
				+'					<div class="span19 float-left"><label for="projectTitle">From</label></div>'
				+'					<div class="span80 float-left text-left"><input class="font-14 mar-right-5 newevent-input-textbox input-width-220" type="text" value="" readonly id="fromDatetime" name="startDate"/>&nbsp;<span id="fromDatetimeIcon"  title="Select date" class="calendar-sm-icons enabled-sm pad-left-5 cursor-hand"></span></div>'                                       
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30">'
				+'					<div class="span19 float-left"><label for="projectTitle">To</label></div>'
				+'					<div class="span80 float-left text-left"><input class="font-14 mar-right-5 newevent-input-textbox input-width-220" name="endDate" type="text" readonly value="" id="toDatetime"/>&nbsp;<span id="toDatetimeIcon" title="Select date" class="calendar-sm-icons enabled-sm pad-left-5 cursor-hand"></span></div>'                                       
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30">'
				+'					<label for="projectTitle" class="mar-right-14-imp">All day</label>'
				+'					<div>'  
				+'						  <input id="allDayCheckbox" name="allDayCheckbox" type="checkbox" class="allDayCheckboxClass css-checkbox">'	 
				+'						  <label class="css-label pad-left-30" for="allDayCheckbox"></label>'                                                                                               
				+'					</div>'                                       
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30 hide">'
				+'					<label for="projectTitle" class="mar-right-14-imp">Repeat</label>'
				+'					<div class="radiobuttons">'
				+'						<label class="check14">'
				+'							<input name="repeat" value="once" checked="" type="radio"><span class="check"></span>Once'
				+'						</label>'
				+'						<label class="check14">'
				+'							<input name="repeat" value="daily" type="radio"><span class="check"></span>Daily'
				+'						</label>'
				+'						 <label class="check14">'
				+'							<input name="repeat" value="weekly" type="radio"><span class="check"></span>Weekly'
				+'						</label>'
				+'						<label class="check14">'
				+'							<input name="repeat" value="monthly" type="radio"><span class="check"></span>Monthly'
				+'						</label>'
				+'					</div>'                                      
				+'				</div>'
				+'          <div class="horizontal-fields right-check float-left subgroup-checkbox" id="attendeesCheckBoxDiv">'
				+'	            <input id="attendeesCheckBox" class="css-checkbox" type="checkbox" name ="attendesChck">'
				+'	            <label class="css-label pad-left-30" for="attendeesCheckBox">Attendees<span id="attendiesCountID" class="attendies-count"></span><span class="lightblue font-12px"></span></label>'
				+'          </div>'
				+'				<div class="clear-float horizontal-fields clearfix min-height-30 hide" id="eventAttendeesContainer">'
				//+'					<div class="clear-float"><strong>Attendees<span id="attendiesCountID"></span></strong> <span class="lightblue font-12px"></span></div>'
				+'					<div class="lightgreyborder min-height-100 border-radius-4" id="">'
				+'                     <div id="attendeesHolderDiv" class="attendeesHolderClass">'

				+'                     </div>'
				+'                    <input type="text" class="pad-5-imp add-invitee-textbox" placeholder="Add Invitees" id="attendeesDiv" />'
				+'					</div>'
				+'				<div id="eventAttendeesContainererror" class="eventAttendeesContainererror"></div></div>'
				+'			<div class="float-left mar-tbs-10 subgroup-checkbox">'
				+'				<input type="checkbox" id="" class="css-checkbox" />'
				+'          </div>'
				+'         <div class="right-check float-left horizontal-fields subgroup-checkbox hide" id="eventRSVPDiv">'
				+'	            <input id="eventRSVP" class="css-checkbox" type="checkbox">'
				+'	            <label class="css-label pad-left-30" for="eventRSVP">RSVP</label>'
				+'          </div>'
				+'				<div class="horizontal-fields form-group"><textarea id="eventDetailsId" maxlength="1500" name="eventDescription" class="form-control" rows="4" placeholder="Event Details" ></textarea></div>'
				+'				<div class="horizontal-fields clearfix min-height-30 big-label">'
				+'					<label for="projectTitle" class="width-75">Location</label>'
				+'					<div class="float-left text-left input-width-220"><input name="location" id="locationId" maxlength="100" type="text" value="" class="newevent-input-textbox input-width-210"/></div>'                                       
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30 big-label hide">'
				+'					<label for="projectTitle" class="width-75">Alert</label>'
				+'					<div class="float-left border-bottom text-left input-width-210">30 minutes before</div><span class="display-inline mar-left-5 filter-sm-icons"></span>'                                       
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30 big-label">'
				+'					<label  class="width-75" for="projectTitle">Event Type</label>'
				+'					<div class="float-left border-bottom text-left input-width-210">';
		if(Event.settings.associationType == 'CONNECTION'){
			html+='                     <span id="eventTypeValue" eventTypeName="REMINDER" eventTypeDisplayName="Reminder" eventTypeId="2">Reminder</span>';
		}else if(Event.settings.associationType == 'GROUP'){
			html+='                     <span id="eventTypeValue" eventTypeName="GROUPEVENT" eventTypeDisplayName="Group Event" eventTypeId="3">Group Event</span>';
		}else if(Event.settings.associationType == 'COURSE'){
			html+='                     <span id="eventTypeValue" eventTypeName="COURSE_MEETING" eventTypeDisplayName="Meeting" eventTypeId="4">Course Event</span>';
		}

		html+='                  </div>'
				+'					<span class="display-inline pad-left-5">'										
				+'						<div class="dropdown black-dropdown-panel dropup">'
				+'							<a href="#" data-toggle="dropdown" class="dropdown-toggle">'
				+'								<span class="filter-sm-icons" title="Select event type"></span>'
				+'							</a>'
				+'							<ul class="common-dropdown-menus dropdown-menu pull-right black-dropdown">';
		if(Event.settings.associationType == 'CONNECTION'){
		
			html+='			 <li><a id="eventTypeSelect_2" eventType="2" eventTypeDisplayName="Reminder" eventTypeName="REMINDER" href="javascript:void(0);">Reminder</a></li>'
				+'			 <li><a id="eventTypeSelect_1" eventType="1" eventTypeDisplayName="Meeting" eventTypeName="PERSONAL_MEETING" href="javascript:void(0);">Meeting</a></li>' ;           		
		}else if(Event.settings.associationType == 'GROUP'){
			html+='			           		   <li><a id="eventTypeSelect_3" eventType="3" eventTypeDisplayName="Group Event" eventTypeName="GROUPEVENT" href="javascript:void(0);">Group Event</a></li>';
		}else if(Event.settings.associationType == 'COURSE'){
			html+='			           		   <li><a id="eventTypeSelect_4" eventType="4" eventTypeDisplayName="Course Event" eventTypeName="COURSE_MEETING" href="javascript:void(0);">Course Event</a></li>'
					+'			           		   <li><a id="eventTypeSelect_7" eventType="7" eventTypeDisplayName="Social Event" eventTypeName="COURSE_SOCIAL_EVENT" href="javascript:void(0);">Social Event</a></li>'
					+'			           		   <li><a id="eventTypeSelect_6" eventType="6" eventTypeDisplayName="Key Date" eventTypeName="COURSE_KEY_DATE" href="javascript:void(0);">Key Date</a></li>'
					+'			           		   <li><a id="eventTypeSelect_5" eventType="5" eventTypeDisplayName="Dead Line" eventTypeName="COURSE_DEADLINE" href="javascript:void(0);">Dead Line</a></li>'; 	
		}
		html+='							</ul>'
				+'						</div>'
				+'					</span>'                                       
				+'				</div>'
				+'			</div>';
		if(Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE'){		    
			/*newly added anouncement code*/
			html+='<div id="groupEventAnnouncementSection" class="top-border">'+
					'<div class=" form-group">'+
					'			<div class="right-check float-left mar-tb-10 subgroup-checkbox">'+
					'			      <input class="css-checkbox" type="checkbox" name="postAsAnnouncemetcheck" id="postAsAnnouncemetcheck">	            '+
					'			      <label for="postAsAnnouncemetcheck" class="css-label pad-left-30 announcement-popover-label helvetica-neue-roman font-12px">Post as Announcement</label>          '+
					'			</div>'+
					'		</div>	'+
					'<div class="clear-float horizontal-fields clearfix min-height-30">					<div class="span19 float-left"><label for="projectTitle">From</label></div>					<div class="float-left text-left span80"><input class="font-14 mar-right-5 newevent-input-textbox width-220-imp" value="" readonly id="announcementfromDatetime" name="newsStartDate" type="text"><span id="announcementfromDatetimeIcon" title="Select date" class="calendar-sm-icons enabled-sm pad-left-5 cursor-hand"></span></div>				</div>'+
					''+
					'<div class="clear-float horizontal-fields clearfix min-height-30">					<div class="span19 float-left"><label for="projectTitle">To</label></div>					<div class="float-left text-left span80"><input class="font-14 mar-right-5 newevent-input-textbox width-220-imp" value="" readonly id="announcementtoDatetime" name="newsEndDate" type="text"> <span id="announcementtoDatetimeIcon" title="Select date" class="calendar-sm-icons enabled-sm pad-left-5 cursor-hand mar-left-minus-4"></span></div>				</div>	'+
					'		'+
					'		<div class=" form-group">'+
					'			<div class="right-check float-left mar-tb-10 subgroup-checkbox">'+
					'			      <input class="css-checkbox" disabled="disabled" id="postOnSlidingcheckbox" name="postOnSlidingcheckbox" type="checkbox">	            '+
					'			      <label for="postOnSlidingcheckbox" class="css-label pad-left-30 announcement-popover-label helvetica-neue-roman font-12px">Post on the Sliding Announcement Bar</label>          '+
					'			</div>'+
					'		</div>'+
					'</div>';
		}  		


		html+='			<div class="clearfix events-buttons text-center">'
				+'			<input title="Save as Draft" value="Save as Draft" id="save-event-button" status="DRAFT" class="hide def-button font-17 small-button" type="button">&nbsp;';

		if(Event.settings.associationType == 'CONNECTION'){
			html+='<input title="Create" value="Create" id="send-event-button"  class="def-button font-17 small-button" type="button">&nbsp;';
		}else{
			html+='<input title="Create" value="Create" id="send-event-button"  class="def-button font-17 small-button" type="button">&nbsp;';
		}

		html+='<input title="Cancel" id="cancel-event-button" value="Cancel" class="grey-button font-17 mar-right-0 small-button" type="button">'
				+'			</div>'
				+'		 </div>'													  
				+'	</div>'
				+'</div></form>';

		//$(element).html('<div id="eventContainerModal" class="modal fade"><div class="modal-dialog width-340"><div class="modal-content"><div id="eventContainer" class="modal-body pad-nill"></div></div></div></div>');
		$('#modal-box-wrapper').html('<div id="eventContainerModal" class="modal fade"><div class="modal-dialog width-400"><div class="modal-content"><div id="eventContainer" class="modal-body pad-nill"></div></div></div></div>');
		$("#eventContainer").html(html);
		$(element).removeClass('hide');
		Event.hosts.push(userId);
		eventPrivaciesCheckedcount = $('.courseneweventsendtype:visible:checked:not(#allonly)').length;

		// Requirement to display event name on event title
		$("#eventName").change(function() {
			$( "#window-event-titleid span:first").text( $( "#eventName" ).val() ) ; 
		});

		// removed the setting of datetimepicker
		Event.setDateTimePicker(true);

		if(Event.settings.associationType == 'COURSE' && typeof Event.settings.isCourseManageCategories != 'undefined' && Event.settings.isCourseManageCategories){
			Event.loadCourseMembers();
		}else{
			Event.loadConnections();
		}
		Event.bindEvents();
		Event.applayAutoComplete("attendeesDiv", "attendeesHolderDiv",  Event.connections,false);
		Event.applayAutoComplete("hostsDiv", "hostsContainer",  Event.connections,true);
		var eventCategoryOptions = {
				ele:'#eventCategoryMenu',
				mode:'Event',
				onSelect:Event.selectCategory,
				associationType:Event.settings.associationType,
				associationUniqueIdentifier:Event.settings.associationUniqueIdentifier
		};
		EventCategories.init(eventCategoryOptions);
		Event.buildCurrentModalPopup(element);


		/*var optionsForModel ={
	            		backdrop:true,
	            		show:true,
	            		keyboard:true
	            	  };

        	   $('#eventContainer').modal(optionsForModel);
        	   $('#eventContainer').on('shown.bs.modal',function(e){
        	   });
        	   $('#eventContainer').on('hidden.bs.modal',function(e){
        		   $(element).html('');
        		   $(element).addClass('hide');
        	   });*/
	},
/*	
 * Naveen: Commented below code. As i am seeing some script error and moreover it is never used in this javascript file.
 * updateDateTimeformat(fromDate, toDate){

		//	alert(" from : " + fromDate + " toDate : " + toDate);
		var fromDateValue=new Date(fromDate);
		var toDateValue=new Date(toDate);

		if ( allDayEvent ){
			$('#fromDatetime').val(dateUtility.formatDate(fromDateValue,'WW, MMM dd,yyyy'));
			$('#toDatetime').val(dateUtility.formatDate(toDateValue,'WW, MMM dd,yyyy'));   
		}
		else{
			$('#fromDatetime').val(dateUtility.formatDate(fromDateValue,'WW, MMM dd,yyyy hh:mm A'));
			$('#toDatetime').val(dateUtility.formatDate(toDateValue,'WW, MMM dd,yyyy hh:mm A')); 
		}
	},*/
	
	changeDateTimePicker:function(showTime){
		//alert(" show time " + showTime);

		var fromDateValue=new Date($('#fromDatetime').val());
		var toDateValue=new Date($('#toDatetime').val());
		var customFormat = "l, M d, Y h:i A" ;

		if ( Event.settings.allDayEvent ){
			$('#fromDatetime').val(dateUtility.formatDate(fromDateValue,'WW, MMM dd,yyyy'));
			$('#toDatetime').val(dateUtility.formatDate(toDateValue,'WW, MMM dd,yyyy'));   
			customFormat = "l, M d, Y" ;
		}
		else{
			$('#fromDatetime').val(dateUtility.formatDate(fromDateValue,'WW, MMM dd,yyyy hh:mm A'));
			$('#toDatetime').val(dateUtility.formatDate(toDateValue,'WW, MMM dd,yyyy hh:mm A')); 
			customFormat = "l, M d, Y h:i A" ;
		}

		//fromDatetime
		$('#fromDatetime').datetimepicker({
			timepicker: showTime ,
			formatTime:'h:i A',
			formatDate:'D d M, Y',
			format:customFormat,
			defaultDate:fromDateValue, 
			defaultTime:Event.setDateTime(fromDateValue),
			minDate:new Date(), 
			timepickerScrollbar:false,
			step:30,
			onChangeDateTime:function(dp,$input){
			// $('#fromDatetime').val($input.val());
			// Event.updateDateTimeformat( $input.val(), $('#toDatetime').val());
			//	  $('#announcementfromDatetime').val($input.val());
			//  alert(" FROM date on change 2 ");
			//	  Event.updateDateTimeformat();
		}
		});

		//toDatetime
		$('#toDatetime').datetimepicker({
			timepicker: showTime ,
			formatTime:'h:i A',
			formatDate:'D d M, Y',
			format:customFormat,
			defaultDate:toDateValue, 
			defaultTime:Event.setDateTime(toDateValue),
			minDate:new Date(), 
			timepickerScrollbar:false,
			step:30,
			onShow:function(ct){
			this.setOptions({
				minDate:$('#fromDatetime').val()?$('#fromDatetime').val():false,
			});
		},
			onChangeDateTime:function(dp,$input){
			//	  alert(" TO date on change 2") ;
			// $('#toDatetime').val($input.val());
			//	  Event.updateDateTimeformat( $('#fromDatetime').val(), $input.val());

			//  $('#announcementtoDatetime').val($input.val());

			//	  Event.updateDateTimeformat();
		}
		});

		if(typeof Event.settings.fromDate != 'undefined' && typeof Event.settings.toDate != 'undefined'){
		if ( showTime ){
			$('#announcementfromDatetime').val(dateUtility.formatDate(Event.settings.fromDate,'WW, MMM dd,yyyy hh:mm A'));
			$('#announcementtoDatetime').val(dateUtility.formatDate(Event.settings.toDate,'WW, MMM dd,yyyy hh:mm A'));
		}
		else{
			$('#announcementfromDatetime').val(dateUtility.formatDate(Event.settings.fromDate,'WW, MMM dd,yyyy'));
			$('#announcementtoDatetime').val(dateUtility.formatDate(Event.settings.toDate,'WW, MMM dd,yyyy'));
		}
	}

		//announcement from 
		$('#announcementfromDatetime').datetimepicker({
			timepicker: showTime ,
			formatTime:'h:i A',
			formatDate:'D d M, Y',
			format:customFormat,
			defaultDate:fromDateValue, 
			defaultTime:Event.setDateTime(fromDateValue),
			minDate:new Date(), // yesterday is minimum date
			//maxDate:'+1970/01/02' // and tommorow is maximum date calendar
			timepickerScrollbar:false,
			step:30,
			onChangeDateTime:function(dp,$input){
			//	alert(" announcementfromDatetime ");
			$('#announcementfromDatetime').val($input.val());
		}
		});

		//announcement toDatetime
		$('#announcementtoDatetime').datetimepicker({
			timepicker: showTime ,
			formatTime:'h:i A',
			formatDate:'D d M, Y',
			format:customFormat,
			defaultDate:fromDateValue, 
			defaultTime:Event.setDateTime(fromDateValue),
			minDate:new Date(), // yesterday is minimum date
			//maxDate:'+1970/01/02' // and tommorow is maximum date calendar
			timepickerScrollbar:false,
			step:30,
			onChangeDateTime:function(dp,$input){
			//	alert(" announcementtoDatetime ");
			$('#announcementtoDatetime').val($input.val());
		}
		});
	},

	setDateTimePicker:function(showTime){

		$('#fromDatetime').val(dateUtility.formatDate(new Date(),'WW, MMM dd,yyyy hh:mm A'));

		var now = new Date();

		$('#toDatetime').val(dateUtility.formatDate(new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes()+30,0,0),'WW, MMM dd,yyyy hh:mm A'));
		if(fromDate && fromDate !=''){
			$('#fromDatetime').val(dateUtility.formatDate(Event.settings.fromDate,'WW, MMM dd,yyyy hh:mm A'));
		}else{
			$('#fromDatetime').val(dateUtility.formatDate(new Date(),'WW, MMM dd,yyyy hh:mm A'));	
		}
		if(toDate && toDate !=''){
			$('#toDatetime').val(dateUtility.formatDate(Event.settings.toDate,'WW, MMM dd,yyyy hh:mm A'));
		}else{
			$('#toDatetime').val(dateUtility.formatDate(new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes()+30,0,0),'WW, MMM dd,yyyy hh:mm A'));
		}

		var fromDateValue=new Date($('#fromDatetime').val());

		//fromDatetime
		$('#fromDatetime').datetimepicker({
			timepicker: showTime ,
			formatTime:'h:i A',
			formatDate:'D d M, Y',
			format:'l, M d, Y h:i A',
			defaultDate:fromDateValue, 
			defaultTime:Event.setDateTime(fromDateValue),
			minDate:new Date(), 
			timepickerScrollbar:false,
			step:30,
			onChangeDateTime:function(dp,$input){
			//	  alert (" from Date time 3 " );
			$('#fromDatetime').val($input.val());
			$('#announcementfromDatetime').val($input.val());
		}
		});

		var toDateValue=new Date($('#toDatetime').val());

		//toDatetime Fri, Dec 26, 2014 01:30 AM W,MMM dd, yyyy hh:mm A
		$('#toDatetime').datetimepicker({
			timepicker: showTime ,
			formatTime:'h:i A',
			formatDate:'D d M, Y',
			format:'l, M d, Y h:i A',
			defaultDate:toDateValue, 
			defaultTime:Event.setDateTime(toDateValue),
			minDate:new Date(), 
			timepickerScrollbar:false,
			step:30,
			onShow:function(ct){
			this.setOptions({
				minDate:$('#fromDatetime').val()?$('#fromDatetime').val():false,
			});
		},
			onChangeDateTime:function(dp,$input){
			//  alert(" to date on change 3") ;
			$('#toDatetime').val($input.val());
			$('#announcementtoDatetime').val($input.val());
		}
		});

		if(fromDate && fromDate !=''){
			$('#announcementfromDatetime').val(dateUtility.formatDate(Event.settings.fromDate,'WW, MMM dd,yyyy hh:mm A'));
		}else{
			$('#announcementfromDatetime').val(dateUtility.formatDate(new Date(),'WW, MMM dd,yyyy hh:mm A'));   	
		}

		//announcement from 
		$('#announcementfromDatetime').datetimepicker({
			timepicker: showTime ,
			formatTime:'h:i A',
			formatDate:'D d M, Y',
			format:'l, M d, Y h:i A',
			defaultDate:fromDateValue, 
			defaultTime:Event.setDateTime(fromDateValue),
			minDate:new Date(), // yesterday is minimum date
			//maxDate:'+1970/01/02' // and tommorow is maximum date calendar
			timepickerScrollbar:false,
			step:30,
			onChangeDateTime:function(dp,$input){
			$('#announcementfromDatetime').val($input.val());
		}
		});

		if(toDate && toDate !=''){
			$('#announcementtoDatetime').val(dateUtility.formatDate(Event.settings.toDate,'WW, MMM dd,yyyy hh:mm A'));
		}else{
			$('#announcementtoDatetime').val(dateUtility.formatDate(new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes()+30,0,0),'WW, MMM dd,yyyy hh:mm A'));
		}

		//announcement toDatetime
		$('#announcementtoDatetime').datetimepicker({
			timepicker: showTime ,
			formatTime:'h:i A',
			formatDate:'D d M, Y',
			format:'l, M d, Y h:i A',
			defaultDate:fromDateValue, 
			defaultTime:Event.setDateTime(fromDateValue),
			minDate:new Date(), // yesterday is minimum date
			//maxDate:'+1970/01/02' // and tommorow is maximum date calendar
			timepickerScrollbar:false,
			step:30,
			onChangeDateTime:function(dp,$input){
			$('#announcementtoDatetime').val($input.val());
		}
		});

		$("#announcementfromDatetime").attr('disabled','disabled');
		$("#announcementfromDatetimeIcon").addClass('ancher_lock disabled-sm').removeClass('enabled-sm');
		$("#announcementtoDatetime").attr('disabled','disabled');
		$("#announcementtoDatetimeIcon").addClass('ancher_lock disabled-sm').removeClass('enabled-sm');

	},

	setDateTime:function(dateValue){
		var hour = dateValue.getHours()<10?dateValue.getHours()+"0":dateValue.getHours();
		var minutes = dateValue.getMinutes()<10?dateValue.getMinutes()+"0":dateValue.getMinutes();
		var ampm = (hour >= 12) ? "PM" : "AM";
		return hour+":"+minutes+" "+ampm;
	},
	selectCategory:function(data){
		
		$("#eventCategoryID").val(data.categoryId);
		$("#eventCategoryID").attr("categoryColorCode",data.categoryColorCode);
		$("#eventCategoryID").attr("categoryName",data.categoryName);
		$("#eventCategoryID").attr("isCustomCategory",data.isCustomCategory);
		$("#viewEventColorCode").css("background-color",data.categoryColorCode);
		$("#eventCategoryID").attr("categoryBlurCode",data.categoryBlurCode);
		eventData.eventModel.eventCategoryModel.categoryColorCode = data.categoryColorCode;
	},
	
	buildCurrentModalPopup:function(element){
		var optionsForModel ={
				backdrop:'static',
				show:true,
				keyboard:true
		};

		$('#eventContainerModal').modal(optionsForModel);
		$('#eventContainerModal').on('show.bs.modal',function(e){
		});

		$('#eventContainerModal').on('hide.bs.modal',function(e){
			$(element).html('');
			$(element).addClass('hide');
		});


		if(Event.settings.associationType == 'CONNECTION'){
		//	$('#attendeesCheckBox').attr('disabled','disabled');
		}

	},
		
	/****To Load Event in View or Edit Mode***/
	loadViewOrEditEvent:function(element,data){
		eventData = data;
		Event.settings.associationType = data.eventModel.associationType;
		Event.settings.associationId = data.eventModel.associationId;
		Event.settings.associationUniqueIdentifier=  data.eventModel.associationUniqueIdentifier;
		Event.settings.photoId = data.eventModel.photoId;

		if(data.eventModel.associationType == "COURSE"){
			Event.settings.isCourseManageCategories = true;

		}
		
		var isEventListView = false;
		if(typeof data.isEventListView != 'undefined'){
			isEventListView = data.isEventListView;
		}
		
		var startD = convertUTCDateTimeTo.LocalBrowserDateTime(data.eventModel.startTime);
		var endD = convertUTCDateTimeTo.LocalBrowserDateTime(data.eventModel.endTime);
		
		endD = isAllDayDateFormatting(data.eventModel.allDay,startD,endD);
		
		var thisEventDetails = {
				"id": data.eventModel.eventUniqueIdentifier,
				"title": data.eventModel.eventName,
				"start": startD,
				"end": endD,
				"editable": data.eventModel.hasPermission,
				"blurcolor": data.eventModel.eventCategoryModel.categoryBlurCode,
				"color": data.eventModel.eventCategoryModel.categoryColorCode,
				"isEventListView" : isEventListView,
				"allDay":convertStringToBoolean(data.eventModel.allDay)
		};
		thisEventDetails = JSON.stringify(thisEventDetails);

		var html='{{#eventModel}}'
				+'<div class="hide" data-isEventListView="{{isEventListView}}" id="eventdetails_{{eventUniqueIdentifier}}">'+thisEventDetails+'</div><div class="min-height-600">'
				+'<div class="inner-alerts hide" id="responseElementContentHolder">'
				+'<div id="messageElementStyleDiv" class="alert alert-success">'
				+'<a id="errorClose" href="javascript:void(0)" class="close" >&times;</a>'
				+'<div id="responseElementContent"></div>'
				+'</div>'
				+'</div>'
				+'<div class="viewEventHeaderClass" id="viewEventHeader">' 
				+'		<div class="modal-header-block"><span class="modal-heading">{{HeaderTime}}</span><a href="javascript:void(0);" class="{{^hasPrev}}ancher_lock{{/hasPrev}}" id="previousEventView" currentPosition="{{previousPosition}}" ><span title="Previous" class="previous-up-sm-icons {{#hasPrev}}enabled-sm {{/hasPrev}}{{^hasPrev}}disabled-sm {{/hasPrev}}mar-left-12"  ></span></a>&nbsp;'
				+'			<a href="javascript:void(0);" id="nextEventView" currentPosition="{{nextPosition}}"  class="{{^hasNext}}ancher_lock{{/hasNext}}"><span title="Next" class="next-down-sm-icons {{#hasNext}}enabled-sm {{/hasNext}}{{^hasNext}}disabled-sm {{/hasNext}}"  ></span></a>'
				+'			<i class="pull-right position-relative">'
				+'				<span title="Close" class="close-sm-icons selected-sm cursor-hand" id="closeViewEvent"></span>'
				+'			</i>'
				+'		</div>'
				+'	 </div>'
				+'	 <!-- Header section End-->'
				+'	  <div class="">'	  
				+'		<div class="pad-lr-12 new-Event-section">'                                                
				+'			<div class="clear-float min-height-56 bottom-solid-border-mar0" id="viewEventLogoHeader">'
				+'			<!-- logo and icon section-->'
				+'				<div class="col-xs-12 mar-bot-5">'
				+'					<img class="event-thumbnail" src="{{photoSource}}">'
				+'					<span id="viewEventColorCode" class="sm-circle-blue-10px position-relative top-20 width-10"></span>'
				+'                  <input type="hidden" value="{{eventCategoryModel.categoryId}}" id="eventCategoryID" isCustomCategory="{{eventCategoryModel.isCustomCategory}}" categoryName="{{eventCategoryModel.categoryName}}" categoryColorCode="{{eventCategoryModel.categoryColorCode}}" categoryBlurCode="{{eventCategoryModel.categoryBlurCode}}"/>'
				+'					<div class="pull-right position-relative top32"> '
				+'{{^isPendingEvents}}'
				+'{{#isParticipant}} '
				+'{{#isRSVPRequired}}'
				+'                       <span id="rsvpEnum_IconDisplay" class="rsvp-icons {{rsvpEnum_IconDisplay}} mar-lr-close"></span>'
				+'{{/isRSVPRequired}}'
				+'{{/isParticipant}} '
				+'{{/isPendingEvents}}'
				+'						 <span class="dropdown black-dropdown-panel categoryclasss" id="eventCategoryMenuidd">'

				+'						</span>'
				+'{{^isPendingEvents}}'

				+'						<a href="javascript:void(0);" class="{{^hasPermission}}ancher_lock{{/hasPermission}} isEditorNew" data-isEditorNew="true" id="editViewEvent"><span title="Edit event" class="edit-sm-icons {{#hasPermission}} enabled-sm {{/hasPermission}} {{^hasPermission}} disabled-sm ancher_lock {{/hasPermission}} mar-lr-10" id="editPencilIcon"></span></a> '
				+'						<span id="deleteViewEvent" class="trash-icons-sm  cursor-hand" title="Delete Event"></span>'
				+'{{/isPendingEvents}}'
				+'					</div>'
				+'				</div> '
				+'				<!--Logo and Icons section-->'

				+'			 </div>'
				+'			 <div></div>'
				+'			 <!--View Mode Starts-->'
				+'			 <div class="event-view-mode mar-bot-10 pad-top-6" id="viewEventSection">';


		if(data.eventModel.associationType == "COURSE" && typeof Event.settings.isCourseManageCategories != 'undefined' && Event.settings.isCourseManageCategories){
			html+='<div class="clearfix horizontal-fields">	            '+
					'				    	  <input id="allonlyview" class="css-checkbox courseneweventsendtype"  type="checkbox" value="ALL">	           '+
					'				    	  <label class="css-label pad-left-30 disable" for="allonlyview">All</label>    '+
					'				    	  <input id="instructorsonlyview" class="css-checkbox courseneweventsendtype" type="checkbox" value="INSTRUCTOR">	           '+
					'				    	  <label class="css-label pad-left-30 disable" for="instructorsonlyview">Instructor</label> ';
			if(courseStatus == 'PUBLISHED'){
				html+='				    	      <input id="learnersonlyview" class="css-checkbox courseneweventsendtype" type="checkbox" value="LEARNER">	            '+
						'				    	  <label class="css-label pad-left-30 disable" for="learnersonlyview">Learners</label> ';
			}
			html+='				    	    <input id="alumnisonlyview" class="css-checkbox courseneweventsendtype" type="checkbox" value="ALUMNI">	            '+
					'				    	  <label class="css-label pad-left-30 disable" for="alumnisonlyview">Alumni</label>   '+
					'				    	  </div>';

		}

		html+='				 <div class="horizontal-fields clearfix min-height-30">'
				/*+'					<label for="projectTitle">Title</label>'*/
				+'					<div class="float-left text-left width-375-imp event-title word-break-xiim">{{eventName}}</div></div>'
				+'				<div class="horizontal-fields clearfix min-height-30">'
				+'					<label for="projectTitle" class="width-75">Host</label>';
				if(data.eventModel.associationType == "GROUP"){
		html+='					<div class="float-left text-left width-240">{{associationName}} {{#hosteventInviteeModelList}}({{userName}}){{/hosteventInviteeModelList}}</div>  '   ;
				}else if(data.eventModel.associationType == "COURSE"){
					
		html+='					<div class="float-left text-left width-240">{{associationName}} {{#hosteventInviteeModelList}}({{userName}}){{/hosteventInviteeModelList}}</div>  '   ;
				}else{
		html+='					<div class="float-left text-left width-240">{{#hosteventInviteeModelList}}{{userName}}{{/hosteventInviteeModelList}}</div>  '   ;
				}
				
		html+='				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30">'
				+'					<label for="projectTitle" class="width-75">From</label>'
				+'					<div class="float-left text-left width-265">{{startTime_Modified}}</div>'                                      
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30">'
				+'					<label for="projectTitle" class="width-75">To</label>'
				+'					<div class="float-left text-left width-265">{{endTime_Modified}}</div> '                                      
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30">'
				+'					<label for="projectTitle" class="width-75 mar-right-14-imp">All day</label>'
				+'						<div>'  
				+'						  <input id="allDayCheckbox" name="allDayCheckbox" type="checkbox" class="allDayCheckboxClass css-checkbox">'	 
				+'						  <label class="disable css-label pad-left-30" for="allDayCheckbox"></label>'                                                                                               
				+'					</div>'				
				+'				</div>'		
				+'				<div class="horizontal-fields clearfix min-height-30 hide">'
				+'					<label for="projectTitle" class="width-75">Repeat</label>'
				+'					<div class="float-left text-left width-265">Once</div> '                                      
				+'				</div>'
				+'{{^isOpenEvent}}'
				+'				<div class="horizontal-fields clearfix min-height-30" id="eventAttendeesDiv">'
				+'					<div class="clear-float font-12px helvetica-neue-roman">Attendees'
				+'                    <span class="lightblue font-12px">(<span id="">{{attendeesCount}}</span>)</span>&nbsp;'
				+'                    <span id="clickOnArrow" class="right-buttom-toggle position-relative top-4 cursor-hand"></span></div>'
				+'					<div id="attendeesHolderDiv" class="attendeesHolderDivViewMode min-height-100 border-radius-4 pad-5">'
				+'					<div class="border-radius-4 pad-5">'
				+'						{{#participentEventInviteeModelList}}'
				+'						<div class="display-inline"  id="displayStatusIcon_{{participentId}}">{{userName}}{{#isRSVPRequired}}<span class="rsvp-icons {{rsvpEnum_IconDisplay}} mar-right-4 position-relative top-3 mar-left-5"></span>{{/isRSVPRequired}}{{^isRSVPRequired}}<span class="position-relative top-3 mar-left-5"></span>{{/isRSVPRequired}}{{^last}},{{/last}}</div>'
				+'						{{/participentEventInviteeModelList}}'				
				+'					</div>'
				+'                   </div>'
				+'				</div>'
				//	+'				{{#isOwner}}'
				+'				<div class="text-right font-12px" id="rsvpDisplayDiv">'
				+'				{{#rsvpCountMap.entry}}'
				+'					<span class="mar-right-5">{{key}} <span class="lightblue font-12px">({{value}})</span></span>{{#isBreak}}{{/isBreak}}'
				+'				{{/rsvpCountMap.entry}}'
				+'				</div>'
				//	+'				{{/isOwner}}'
				+'{{/isOpenEvent}}'
				+'				<div class="form-group mar-top-10 ">'
				+'					<div class="clear-float font-13px helvetica-neue-roman">Event Details</div>'
				+'					<div class="font-13px pad-top-5 min-height-80">{{description}}</div>'
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30 big-label mar-top-10">'
				+'					<label for="projectTitle" class="width-75">Location</label>'
				+'					<div class="float-left text-left width-200 font-13px">{{location}}</div> '                                      
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30 big-label hide">'
				+'					<label for="projectTitle" class="width-75">Alert</label>'
				+'					<div class="float-left text-left width-200 font-13px">30 minutes before</div>'                                     
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30 big-label">'
				+'					<label for="projectTitle" class="width-75">Event Type</label>'
				+'					<div class="float-left text-left width-200 font-13px">{{eventTypeEnum_Modified}}</div>'
				+'				</div>'
				+'{{#isOpenEvent}}'
				+'{{#postAsAnnouncement}}'
				+'<div class="horizontal-fields clearfix min-height-30">'
				+'			<div class="right-check float-left  subgroup-checkbox">'
				+'			      <input class="css-checkbox disabled-selected" type="checkbox" disabled="disabled" name="postAsAnnouncemetcheckview"  id="postAsAnnouncemetcheckview">'
				+'			      <label for="postAsAnnouncemetcheckview" class="css-label pad-left-30 announcement-popover-label helvetica-neue-roman font-12px">Post as Announcement</label>'
				+'			</div>'
				+'		</div>'
				+'		<div class=" horizontal-fields clearfix min-height-30">'
				+'				<div class="horizontal-fields clearfix min-height-30">'
				+'					<label for="projectTitle">From</label>'
				+'					<div class="float-left text-left width-265 font-13px">{{announcementStartDate}}</div>'                                      
				+'				</div>'
				+'				<div class="horizontal-fields clearfix min-height-30">'
				+'					<label for="projectTitle">To</label>'
				+'					<div class="float-left text-left width-265 font-13px">{{announcementEndDate}}</div> '                                      
				+'				</div>'
				+'		</div>'
				+'		<div class=" horizontal-fields clearfix min-height-30">'
				+'			<div class="right-check float-left  subgroup-checkbox">'
				+'			      <input class="css-checkbox {{#displayInSlideBar}}disabled-selected{{/displayInSlideBar}}" disabled="disabled" id="postOnSlidingcheckboxview" name="postOnSlidingcheckboxview" type="checkbox">	            '
				+'			      <label for="postOnSlidingcheckboxview" class=" helvetica-neue-roman font-12px css-label pad-left-30 announcement-popover-label">Post on the Sliding Announcement Bar</label>          '
				+'			</div>'
				+'		</div>'
				+'{{/postAsAnnouncement}}'
				+'{{/isOpenEvent}}'
				+'{{#isParticipant}} '
				+'{{#isRSVPRequired}}'
				+'{{^isOwner}}'
				+'     <div class="text-left mar-top-5" id="pi-buttons">'
				+'{{#isAccepted}}'
				+'        <span id="acceptedBtnSource">Accepted&nbsp;</span>'
				+'{{/isAccepted}}'
				+'{{^isAccepted}}'
				+'        <span id="acceptedBtnSource"><button title="Accept" class="def-button" id="acceptEvent_{{participentId}}" data-eventUniqueIdentifier="{{eventUniqueIdentifier}}" parentDiv="acceptedBtnSource" participentId="{{participentId}}" ">Accept</button>&nbsp;</span>'
				+'{{/isAccepted}}'
				+'{{#isDeclined}}'
				+'        <span id="declinedBtnSource">Declined&nbsp;</span>'
				+'{{/isDeclined}}'
				+'{{^isDeclined}}'
				+'        <span id="declinedBtnSource"><button title="Decline" class="grey-button" id="declineEvent_{{participentId}}"  data-eventUniqueIdentifier="{{eventUniqueIdentifier}}"  parentDiv="declinedBtnSource" participentId="{{participentId}}"">Decline</button>&nbsp;</span>'
				+'{{/isDeclined}}'
				+'{{#isTentative}}'
				+'        <span id="tentativeBtnSource">Tentative&nbsp;</span>'
				+'{{/isTentative}}'
				+'{{^isTentative}}'
				+'        <span id="tentativeBtnSource"><button title="Tentative" class="grey-button" id="tentativeEvent_{{participentId}}"  data-eventUniqueIdentifier="{{eventUniqueIdentifier}}"  parentDiv="tentativeBtnSource" participentId="{{participentId}}">Tentative</button></span>'
				+'{{/isTentative}}'
				+      '</div>'
				+'{{/isOwner}}'
				+'{{/isRSVPRequired}}'
				+'{{^isRSVPRequired}}'
				+'{{^isOwner}}'
				+'     <div class="mar-t4-l28" id="pi-buttons">'
				+'{{#isAccepted}}'
				+'        <span id="acceptedBtnSource">Accepted&nbsp;</span>'
				+'{{/isAccepted}}'
				+'{{^isAccepted}}'
				+'        <span id="acceptedBtnSource"><button title="Accept" class="def-button" id="acceptEvent_{{participentId}}"  data-eventUniqueIdentifier="{{eventUniqueIdentifier}}"  parentDiv="acceptedBtnSource" participentId="{{participentId}}" ">Accept</button>&nbsp;</span>'
				+'{{/isAccepted}}'
				+'{{#isDeclined}}'
				+'        <span id="declinedBtnSource">Declined&nbsp;</span>'
				+'{{/isDeclined}}'
				+'{{^isDeclined}}'
				+'        <span id="declinedBtnSource"><button title="Decline" class="grey-button" id="declineEvent_{{participentId}}"  data-eventUniqueIdentifier="{{eventUniqueIdentifier}}"  parentDiv="declinedBtnSource" participentId="{{participentId}}"">Decline</button>&nbsp;</span>'
				+'{{/isDeclined}}'
				+      '</div>'
				+'{{/isOwner}}'
				+'{{/isRSVPRequired}}'
				+'{{/isParticipant}}'
				+'			</div><!--View Mode End -->	'	
				+'			 <div class="event-view-mode mar-bot-10" id="editEventSection">'
				+'   		 </div>'			
				+'		 </div>	'												  
				+'	</div>'
				+'</div><!-- View Event End-->'
				+'{{/eventModel}}';


		var eventModel = data.eventModel;

		if(data.eventModel.postAsAnnouncement != undefined && data.eventModel.postAsAnnouncement == 'true' || data.eventModel.postAsAnnouncement == true){
			data.eventModel.postAsAnnouncement = true;
		}else{
			data.eventModel.postAsAnnouncement = false;
		}

		if(data.eventModel.displayInSlideBar != undefined && data.eventModel.displayInSlideBar == 'true' || data.eventModel.displayInSlideBar == true){
			data.eventModel.displayInSlideBar = true;
		}else{
			data.eventModel.displayInSlideBar = false;
		}

		if(data.eventModel != undefined && data.eventModel.newsStartDate != undefined){
			data.eventModel.announcementStartDate = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.eventModel.newsStartDate),'WW MMM dd,yyyy hh:mm A');
		}

		if(data.eventModel != undefined && data.eventModel.newsEndDate != undefined){
			data.eventModel.announcementEndDate = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.eventModel.newsEndDate),'WW MMM dd,yyyy hh:mm A');
		}


		if(data.eventModel.isOwner == 'true' || data.eventModel.isOwner == true){
			data.eventModel.isOwner = true;
		}
		else if(data.eventModel.isOwner == 'false' || data.eventModel.isOwner == false){
			data.eventModel.isOwner = false;
		}

		if(data.eventModel.eventPrivacyLevel == 'OPEN' && (data.eventModel.hasPermission == 'true' || data.eventModel.hasPermission == true)){
			data.eventModel.hasPermission = true;
		}else if(data.eventModel.hasPermission == 'false' || data.eventModel.hasPermission == false){
			data.eventModel.hasPermission = false;
		}else if((data.eventModel.hasPermission == 'true' || data.eventModel.hasPermission == true)){
			data.eventModel.hasPermission = true;
		}

		if(data.eventModel.isRSVPRequired == 'true' || data.eventModel.isRSVPRequired == true){
			data.eventModel.isRSVPRequired = true;
		}
		else if(data.eventModel.isRSVPRequired == 'false' || data.eventModel.isRSVPRequired == false){
			data.eventModel.isRSVPRequired = false;
		}
		data.eventModel.isPendingEvents = Event.settings.isPendingEvents;
		data.eventModel.eventTypeEnum_Modified = Event.getEventTypeDisplayName(eventModel.eventTypeEnum);

		if(data.eventModel.eventPrivacyLevel =='OPEN'){
			data.eventModel.isOpenEvent = true;
		}


		//Date Related Block 
		if(data.eventModel.allDay == 'true'){
			
			
			var startTime = convertUTCDateTimeTo.LocalBrowserDateTime(data.eventModel.startTime);
			var endTime = convertUTCDateTimeTo.LocalBrowserDateTime(data.eventModel.endTime);
			
			endTime = isAllDayDateFormatting(data.eventModel.allDay ,startTime,endTime);
			
/*		 	startTime.setDate(startTime.getDate() + 1);
			 startTime = new Date(startTime.setHours(0));
			 endTime = new Date(endTime.setHours(0));
			 //endTime.setDate(endTime.getDate() + 1);
			 endTime = new Date(endTime);*/
			
			data.eventModel.startTime_Modified = dateUtility.formatDate(startTime,'WW, MMM dd,yyyy');
			data.eventModel.endTime_Modified = dateUtility.formatDate(endTime,'WW, MMM dd,yyyy');
		}else{
			data.eventModel.startTime_Modified = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.eventModel.startTime),'WW MMM dd,yyyy hh:mm A');
			data.eventModel.endTime_Modified = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.eventModel.endTime),'WW MMM dd,yyyy hh:mm A');
		}
		data.eventModel.HeaderTime = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.eventModel.startTime),'MMM dd,yyyy');

		data.eventModel.hasNext = hasNext;
		data.eventModel.hasPrev = hasPrev;
		data.eventModel.currentPosition = currentPosition;
		data.eventModel.previousPosition = previousPosition;
		data.eventModel.nextPosition = nextPosition;
		data.eventModel.rsvpEnum_IconDisplay = Event.getRSVPName(data.eventModel['rsvpEnum']);

		if(data.eventModel.rsvpEnum_IconDisplay == 'accepted'){
			data.eventModel.isAccepted = true;
		}else if(data.eventModel.rsvpEnum_IconDisplay == 'tentative'){
			data.eventModel.isTentative = true;
		}else if(data.eventModel.rsvpEnum_IconDisplay == 'declined'){
			data.eventModel.isDeclined = true;
		}else if(data.eventModel.rsvpEnum_IconDisplay == 'notResponded'){
			data.eventModel.isNotResponded = true;
		}
		if(Event.settings.associationType == 'CONNECTION'){
			if(data.eventModel.photoId){
				data.eventModel.photoSource ='/contextPath/User/'+data.eventModel.photoId+'/stamp.jpg';		
			}else{
				data.eventModel.photoSource =contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg';		
			}

		}else if(Event.settings.associationType == 'GROUP'){
			if(data.eventModel.photoId){
				data.eventModel.photoSource ='/contextPath/Group/'+data.eventModel.photoId+'/stamp.jpg';		
			}else{
				data.eventModel.photoSource =contextPath+'/static/pictures/no-group-image.jpg';		
			}
		}else if(Event.settings.associationType == 'COURSE'){
			if(data.eventModel.photoId){
				data.eventModel.photoSource ='/contextPath/Course/'+data.eventModel.photoId+'/stamp.jpg';		
			}else{
				data.eventModel.photoSource =contextPath+'/static/pictures/defaultimages/french.png';		
			}
		}

		if(data.eventModel.participentEventInviteeModelList){
			if(data.eventModel.participentEventInviteeModelList.length == undefined){
				data.eventModel.participentEventInviteeModelList =[data.eventModel.participentEventInviteeModelList];
			}
			data.eventModel.attendeesCount = data.eventModel.participentEventInviteeModelList.length;
			data.eventModel.isParticipant = false;
			for(var k=0;k<data.eventModel.participentEventInviteeModelList.length;k++){

				if( data.eventModel.participentEventInviteeModelList.length - 1 == k)
				{
					//	alert(" last " + data.eventModel.participentEventInviteeModelList[k].userName);
					data.eventModel.participentEventInviteeModelList[k].last = true ;
				}

				data.eventModel.participentEventInviteeModelList[k].rsvpEnum_IconDisplay = Event.getRSVPName(data.eventModel.participentEventInviteeModelList[k]['rsvpEnum']);
				if(data.eventModel.participentEventInviteeModelList[k].userId == userId){
					data.eventModel.isParticipant = true;
				}
			}
		}

		for(var i=1;i<=data.eventModel.rsvpCountMap.entry.length;i++){
			if(parseInt(i)%2 === 0){
				data.eventModel.rsvpCountMap.entry[i-1].isBreak = true;
			}else{
				data.eventModel.rsvpCountMap.entry[i-1].isBreak = false;
			}
		}

		//alert( " data.eventModel " + data.eventModel.allDay);
		var eventViewMode = Mustache.to_html(html,data);
		//$(element).html(eventViewMode);
		$('#modal-box-wrapper').html('<div id="eventContainerModal" class="modal fade"><div class="modal-dialog width-400"><div class="modal-content"><div id="eventContainer" class="modal-body pad-nill"></div></div></div></div>');
		$("#eventContainer").html(eventViewMode);


		if(data.eventModel.eventCategoryModel.eventTypeId == 2){
			$("#eventAttendeesDiv").addClass('hide');
			$("#rsvpDisplayDiv").addClass('hide');
		}

		if(data.eventModel.isRSVPRequired == 'false' || data.eventModel.isRSVPRequired == false){
			$("#rsvpDisplayDiv").addClass('hide');
		}

		$(element).removeClass('hide');

		if(data.eventModel.rsvpEnum == 'AWAITING'){
			$("#viewEventColorCode").css("background-color",eventModel.eventCategoryModel.categoryBlurCode);
		}else{
			$("#viewEventColorCode").css("background-color",eventModel.eventCategoryModel.categoryColorCode);
		}		    	

		Event.buildCurrentModalPopup(element);
		Event.bindEvents();
		//checking condition if course event or not.
		if(data.eventModel.associationType == "COURSE"){
			//get all eventPrivfacies for the event
			var eventPrivaciesArray = data.eventModel.eventPrivacies;
			//checking if Event Privacies is a simple object or array object
			var isarray = $.isArray(eventPrivaciesArray);
			//if not array creating new array object. because, if there is single object from service it is getting EventPrivates: "ALL"
			if(!isarray)
				eventPrivaciesArray = [eventPrivaciesArray];

			//checking if array object
			if(eventPrivaciesArray){
				//looping with all array objects and making check box as checked.
				for(var i = 0; i<eventPrivaciesArray.length; i++){
					if(eventPrivaciesArray[i] == 'ALUMNI'){
						$('#alumnisonlyview').prop('checked',true);
					}
					if(eventPrivaciesArray[i] == 'LEARNER'){
						$('#learnersonlyview').prop('checked',true);
					}
					if(eventPrivaciesArray[i] == 'INSTRUCTOR'){
						$('#instructorsonlyview').prop('checked',true);
					}
					if(eventPrivaciesArray[i] == 'ALL'){
						$('#allonlyview').prop('checked',true);
					}
				}
			}
		}
		
		if(data.eventModel.allDay == 'true'){
			$('#allDayCheckbox,#allDayCheckbox1').prop('checked',true);
		}

		if((((data.eventModel.hasPermission == 'false' || data.eventModel.hasPermission == false) && (Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE' )) || ((data.eventModel.hasPermission == 'false' || data.eventModel.hasPermission == false)) && data.eventModel.eventPrivacyLevel =='OPEN') && Event.settings.source != 'CONNECTION'){
			$("#deleteViewEvent").addClass('disabled-sm');
			$("#deleteViewEvent").addClass('ancher_lock');
		}

		if (Date.parse(new Date()) > Date.parse(data.eventModel.endTime) && (Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE') && Event.settings.source != 'CONNECTION') { 
			$("#deleteViewEvent").removeClass('disabled-sm');
			$("#deleteViewEvent").removeClass('ancher_lock');
		}

		/*		    	if (Date.parse(new Date()) > Date.parse(data.eventModel.endTime_Modified)) { 
			    	  console.log('endTime 3--->>');
			    	}*/

		if(data.eventModel.statusEnum == 'DRAFT'){
			$('#editViewEvent').attr('isDraft','DRAFT');
			$("#editPencilIcon").removeClass('disabled-sm');
			$('#editViewEvent').trigger('click');

			if(Event.settings.associationType == 'CONNECTION'){
				var attendeesadded = $("#attendeesHolder").html();
				if(attendeesadded === ""){
					
					$("#sendUpdateEvent").attr('value', 'Create'); 
					$("#sendUpdateEvent").attr('title', 'Create'); 
					
					$("#send-event-button").attr('value', 'Create'); 
					$("#send-event-button").attr('title', 'Create'); 
				}
			}
		}

		var isCategoryIconenable = false;
		if(Event.settings.mode == 'View' && data.eventModel.statusEnum == 'PUBLISH'){
			isCategoryIconenable = true;
		}

		var eventCategoryOptions = {
				ele:'#eventCategoryMenuidd',
				mode:'Event',
				isCategoryIconenable:isCategoryIconenable,
				onSelect:Event.selectCategory,
				associationType:Event.settings.associationType,
				associationUniqueIdentifier:Event.settings.associationUniqueIdentifier
		};
		EventCategories.init(eventCategoryOptions);
		Event.buildCurrentModalPopup(element);


	},
	loadConnections:function(){
		
		var url = getModelObject('serviceUrl')+'/group/2.0/getGroupMembers';
		var request = {
				"groupUniqueIdentifier":Event.settings.associationUniqueIdentifier,
				/*"groupmemberSearchModelList":[{
								"groupMemberSearchAttributeEnum":"IS_CONNECTION",
								"searchValue":false
							}],*/
				"pageCriteriaModel" : {
			"pageSize" : 12,
			"pageNo" : 1,
			"isAll" : true
		},

				"langId" : langId,
				"accessToken" : accessToken
		};
		if(Event.settings.associationType == 'CONNECTION'){
			request["groupmemberSearchModelList"] = [{
				"groupMemberSearchAttributeEnum":"IS_CONNECTION",
				"searchValue":false
			}];
		}else{

		}
		request = JSON.stringify(request);
		var connectionOptions = {
				url:url,
				data:request,
				async:false,
				successCallBack:function(data){

			if(data.manageGroupMemberModelList){
				if(data.manageGroupMemberModelList.length == undefined){
					data.manageGroupMemberModelList = [data.manageGroupMemberModelList];
				}

				Event.connections = [];
				//Event.connections = data.manageGroupMemberModelList;
				for(var i = 0;i< data.manageGroupMemberModelList.length;i++){
					if(data.manageGroupMemberModelList[i]['userId'] != userId){
						Event.connections.push(data.manageGroupMemberModelList[i]);
					}
				}
			}

		}
		};
		doAjax.PostServiceInvocation(connectionOptions);
	},
		/**
		 * Loading course members based on the Invitee type selected.
		 */
	loadCourseMembers : function(hostuseridforcurrentevent){
		
		var searchCriteria;
		searchCriteria = [];
		var request = '';
		if(typeof hostuseridforcurrentevent == 'undefined'){
			hostuseridforcurrentevent = '';
		}
		var url = getModelObject('serviceUrl')+'/course/1.0/getCourseMemberByCircleType';
		//getting all Event Privacies which are visible only.
		var object = $('.courseneweventsendtype');
		//preparing list of checked event privacies as get members to that perticular circle
		for(var i = 0; i<object.length;i++){
			if(object[i].checked){
				if(object[i].value == 'ALUMNI'){
					searchCriteria.push({
						courseMemberSearchCriteria:'ROLE',
						searchValue:object[i].value
					});
				}else if(object[i].value == 'LEARNER'){
					searchCriteria.push({
						courseMemberSearchCriteria:'ROLE',
						searchValue:object[i].value
					});
				}else if(object[i].value == 'INSTRUCTOR'){
					searchCriteria.push({
						courseMemberSearchCriteria:'CIRCLE',
						searchValue:object[i].value
					});
				}
			}
		}

		request = {
				accessToken : accessToken,
				langId : langId,
				courseUniqueIdentifier : Event.settings.associationUniqueIdentifier,
		};

		request.courseMemberSearchModels = searchCriteria;

		request = JSON.stringify(request);
		var connectionOptions = {
				url:url,
				data:request,
				async:false,
				successCallBack:function(data){
			if(typeof data != 'undefined' && typeof data['result'] != 'undefined' && typeof data['result']['status'] != 'undefined' && data['result']['status']){
				Event.connections = [];
				Event.newconnectionuserids = [];
				//checking is edit or new event
				var isEditorNew = $(".isEditorNew").attr('data-isEditorNew');
				var memberList = data['courseMemberModels'];

				if(memberList){
					if(memberList.length == undefined){
						memberList = [memberList];
					}
					for(var i = 0;i< memberList.length;i++){
						//checking if logged in user . 
						if(memberList[i]['userId'] != userId && memberList[i]['userId'] != hostuseridforcurrentevent){
							Event.connections.push(memberList[i]);
							Event.newconnectionuserids.push(memberList[i].userId);
						}
					}
					Event.bindEvents();
					//if edit event building auto complete as it is different for both new and edit events.
					if(isEditorNew == 'true'){//Edit Event
						Event.applayAutoComplete("attendeesDiv", "attendeesHolder",  Event.connections,false);
					}else{
						Event.applayAutoComplete("attendeesDiv", "attendeesHolderDiv",  Event.connections,false);
					}			    					
				}else{//if there are no member in that checked circles clearing the members array object.
					Event.bindEvents();
					if(isEditorNew == 'true'){//Edit Event
						Event.applayAutoComplete("attendeesDiv", "attendeesHolder",  Event.connections,false);
					}else{
						Event.applayAutoComplete("attendeesDiv", "attendeesHolderDiv",  Event.connections,false);
					}
				}	
			}else{
				doAjax.displayErrorMessages(data);
			}
		}
		};
		doAjax.PostServiceInvocation(connectionOptions);
	},
	
	applayAutoComplete:function(ele,childcontainer,results,isHosts){
		
		$("#"+ele).autocomplete({//attendeesDiv  attendeesHolderDiv  Event.connections
			minLength: 0,
			create: function(){
			$(this).data('ui-autocomplete')._renderItem =function (ul, item) {
				return $('<li class="pad-0">')
						.append('<a class="autocomplete-window-href">' + stringLimitDots(item.label, 45) + ' ' + 
								/*'Some brief Information' +*/
								'</a>')
						.appendTo(ul);
			};
			$(this).data('ui-autocomplete')._renderMenu= function( ul, items ) {
				var that = this,
						currentCategory = "";
				$(ul).addClass('autocomplete-window');
				$.each( items, function( index, item ) {
					var li;
					if ( item.category != currentCategory ) {
						ul.append( "<li class='ui-autocomplete-category autocomplete-window-heading'>Matches In Your Connections </li>" );
						currentCategory = item.category;
					}
					li = that._renderItemData( ul, item ); 
				});
			};

		},
			source: function(request, response) {
			var match = request.term.toLowerCase();
			var res=$.map(results, function( item ) {
				if(item.memberName.toLowerCase().indexOf(match) > -1 && $.inArray((item.userId+''), Event.users) < 0 ){
					var retobj = {
							label: item.memberName,
							value: item.userId
					};
					if(Event.settings.associationType == 'COURSE'){
						var isArray = $.isArray(item.circleList);
						if(!isArray){
							retobj.circleList = 'circle_'+item.circleList;
						}else{
							var setofcircles = '';
							$.each(item.circleList,function(index,item){
								setofcircles +='circle_'+item +' ';
							});
							retobj.circleList = setofcircles;
						}
					}								 
					return retobj;
				}
			});
			response(res.slice(0,6));
		},
		focus: function( event, ui ) {
			return false;
		},
		select: function( event, ui ) {
			if($("#"+ui.item.value).length == 0) {
				if ($.inArray(ui.item.value, Event.users) < 0 /*&& $.inArray(ui.item.value, Event.hosts) < 0*/) {
					if(isHosts){
						Event.hosts.push(ui.item.value);
					}else{
						Event.users.push(ui.item.value);
						$('#attendiesCountID').text(Event.users==undefined?'':'('+Event.users.length+')');
					}
					var html = '<div class="display-inline font-10px helvetica-neue-roman pad-5 selectedinviteesclass '+ui.item.circleList+'" id="invitedUserID-'+ui.item.value+'">'+ui.item.label+'<a href="javascript:void(0);" contentId="'+ui.item.value+'" isHost="'+isHosts+'" id="remove-invitedUserID-'+ui.item.value+'"><div title="Close" class="close-sm-icon top-3 mar-left-3"></div></a></div>';
					$("#"+childcontainer).append(html);
					if(Event.settings.associationType == 'CONNECTION'){
						selecteduseridlist.push(ui.item.value);
						$("#send-event-button").attr('value', 'Send'); 
						$("#send-event-button").attr('title', 'Send'); 

						$("#sendUpdateEvent").attr('value', 'Send'); 
						$("#sendUpdateEvent").attr('title', 'Send'); 


					}
				}
			}else{
				//  $("#userSelectError").show();  
			}

			$("#"+ele).val('');
			Event.dynamicEvents(ele);
			return false;
		}
		});
	},
	
	dynamicEvents:function(){
		
		$("[id^=remove-invitedUserID-]").off("click").bind("click",function(e){
			var id=$(this).attr('contentId');
			var isHost = $(this).attr('isHost');
			$("#invitedUserID-"+id).remove();
			if(isHost == 'true'){
				Event.hosts.splice($.inArray(id, Event.hosts), 1);
			}else{
				Event.users.splice($.inArray(id, Event.users), 1);	 
				if(Event.settings.associationType == 'CONNECTION'){
					selecteduseridlist.splice($.inArray(id, selecteduseridlist), 1);
				}
			}
			$('#attendiesCountID').text((Event.users==undefined||Event.users.length==undefined||Event.users==0)?'':'('+Event.users.length+')');
			//$("#"+ele).val('');
			if(Event.settings.associationType == 'CONNECTION'){
				if(selecteduseridlist.length === 0){
					$("#send-event-button").attr('value', 'Create'); 
					$("#send-event-button").attr('title', 'Create'); 
				}
			}
			if(Event.settings.associationType == 'COURSE'){
				var isDraftEvent = $('#editViewEvent').attr('isdraft');
				if(isDraftEvent == 'DRAFT'){//if Draft event
					if($('#attendeesHolder').find('.invalidinvitee').length == 0)
						$('#editAttendeesDiverror').html('');

				}else{
					if($('#attendeesHolderDiv').find('.invalidinvitee').length == 0)
						$('#eventAttendeesContainererror').html('');

				}
			}

		});
	},
	
	bindEvents:function(){
		
		$('#eventContainerModal').on('shown.bs.modal', function () {
			$('#eventName').focus();
			});
			
		$('.courseneweventsendtype').off('click').bind('click',function(e){
			var $this = $(this);
			var id = $this.attr('id');
			//var orglen = $('.courseneweventsendtype:checked').length;
			if(id == 'allonly'){
				if($this.is(':checked')){
					$('.courseneweventsendtype:not(#allonly)').attr('checked',false);
					//$this.attr('data-isinviteeselected',true);
				} else{
					$('.courseneweventsendtype').attr('checked',false);
					$('#allonly').prop('checked',true);
				}
			}else{
				$('#allonly').attr('checked',false);
				if(!$('.courseneweventsendtype:visible').is(':checked')){
					$('#allonly').prop('checked',true);
				}
			}
			var isDraftEvent = $('#editViewEvent').attr('isdraft');

			Event.loadCourseMembers();

			$('.attendeesHolderClass').find('a').parent().removeClass('invalidinvitee');
			$.each(Event.users,function(index,item){
				if($.inArray(item,Event.newconnectionuserids) == -1){
					$.each($('.attendeesHolderClass').find('a'),function(index,value){
						if($(value).attr('contentid') == item){
							$(value).parent().addClass('invalidinvitee');
						}
					});
				}
			});

			if($('.attendeesHolderClass').find('.invalidinvitee').length > 0){
				$('.eventAttendeesContainererror').html('<div class="pad-5 invalidinvitee font-13px">Added Invitee were not belongs to selected circle.</div>');
			}else{
				$('.eventAttendeesContainererror').html('');
			}

			if($('#allonly').is(':checked')){
				if(isDraftEvent == 'DRAFT'){
					$('#attendeesHolder').find('.selectedinviteesclass').removeClass('invalidinvitee');
					$('.eventAttendeesContainererror').html('');
				}else{
					$('#attendeesHolderDiv').find('.selectedinviteesclass').removeClass('invalidinvitee');
					$('.eventAttendeesContainererror').html('');
				}
			}
		});

		$("#editPencilIcon").off('click').bind('click',function(e){
			
			if(eventData.eventModel.statusEnum != 'PUBLISH'){
				$("#eventcategoriesdropdownidd").removeClass("disabled-sm");
				$("#eventcategoriesdropdownidd").parent().removeClass("ancher_lock");
			}
		});
		//added dual event click for toggling the category tag bug fix on XIP-3251
		$("#eventCategoryMenu, #eventCategoryMenuidd").off('click').bind('click',function(e){
			if(!$(".categoryclasss").hasClass('open'))
			$("#eventcategoriesdropdownidd").toggleClass("selected-sm");

		});

		$("html").off('mouseup').bind('mouseup',function(e){
			

			if(!$(e.target).is("#eventcategoriesdropdownidd")){
					$("#eventcategoriesdropdownidd").removeClass("selected-sm");
			} 		

/*			if($("#eventcategoriesdropdownidd").hasClass('selected-sm')){
				$("#eventCategoryMenu").removeClass("open");
			}
			else{
				$("#eventCategoryMenu").addClass("open");
			}

			if ( $("#eventCategoryMenu").hasClass("open")){

				$("#eventcategoriesdropdownidd").removeClass("selected-sm");		    		
			}
			else{
				$("#eventcategoriesdropdownidd").addClass("selected-sm");
			}*/

		});		    	

	//	$('#clickOnArrow').addClass('selected-sm');
		$('.attendeesHolderDivViewMode').addClass('hide');

		$("#postAsAnnouncemetcheck").off("click").bind("click",function(event) {
			if ($(this).attr("checked") == undefined) {
				$(this).attr("checked", "checked");

				$("#announcementfromDatetime").removeAttr('disabled');
				$("#announcementfromDatetimeIcon").removeClass('ancher_lock disabled-sm').addClass('enabled-sm');

				$("#announcementtoDatetime").removeAttr('disabled');
				$("#announcementtoDatetimeIcon").removeClass('ancher_lock disabled-sm').addClass('enabled-sm');

				$("#postOnSlidingcheckbox").removeAttr('disabled');
			} else {
				$(this).removeAttr("checked");

				$("#postOnSlidingcheckbox").removeAttr("checked");

				$("#announcementfromDatetime").attr('disabled','disabled');
				$("#announcementfromDatetimeIcon").addClass('ancher_lock disabled-sm').removeClass('enabled-sm');

				$("#announcementtoDatetime").attr('disabled','disabled');
				$("#announcementtoDatetimeIcon").addClass('ancher_lock disabled-sm').removeClass('enabled-sm');

				$("#postOnSlidingcheckbox").attr('disabled','disabled');
			}
		});

		$("#postOnSlidingcheckbox").off("click").bind("click",function(event) {
			if ($(this).attr("checked") == undefined) {
				$(this).attr("checked", "checked");
			} else {
				$(this).removeAttr("checked");
			}
		});

		//check if all day is set
		$('#allDayCheckbox,#allDayCheckbox1').off("click").bind("click",function(e){

			//	alert(" all day checked : " + $('#allDayCheckbox').is(":checked") );
			Event.settings.allDayEvent = Boolean($('.allDayCheckboxClass:visible').is(":checked")) ;
			//	alert(" all day is " + allDayEvent);
			if (Event.settings.allDayEvent)
				Event.changeDateTimePicker(false);
			else
				Event.changeDateTimePicker(true);
		});

		$('#attendeesCheckBox').off("click").bind("click",function(e){

		//	alert(" attendeesCheckBox ");
			
			$("#attendiesCountID").text('');
			$('#attendeesHolderDiv').empty();
			Event.users=[];
			$("#eventRSVP").prop('checked',false);

			if($(this).is(':checked')){
				
				$('#save-event-button').removeClass('hide');
				$("#sendUpdateEvent").attr('value', 'Send'); 
				$("#sendUpdateEvent").attr('title', 'Send'); 
				
				$("#send-event-button").attr('value', 'Send'); 
				$("#send-event-button").attr('title', 'Send'); 
					
				$('#eventAttendeesContainer').removeClass('hide');
				$('#eventRSVPDiv').removeClass('hide');
				if(Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE'){
					$("#groupEventAnnouncementSection").addClass('hide');
				}
				/*if(Event.settings.associationType == 'GROUP'){
			    			$("#save-event-button").removeAttr('disabled');
			    		}*/
			    		
			   if ( Event.settings.associationType == "CONNECTION" ){
					$("#eventTypeValue").html('Meeting');
					$("#eventTypeValue").attr('eventTypeId',1);
					$("#eventTypeValue").attr('eventTypeName',"PERSONAL_MEETING");
			   } 		
				
			}
			else{
				$('#save-event-button').addClass('hide');
				$("#sendUpdateEvent").attr('value', 'Create'); 
				$("#sendUpdateEvent").attr('title', 'Create'); 
				
				$("#send-event-button").attr('value', 'Create'); 
				$("#send-event-button").attr('title', 'Create'); 
				
				$('#eventAttendeesContainer').addClass('hide');
				$('#eventRSVPDiv').addClass('hide');
				if(Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE'){
					$("#groupEventAnnouncementSection").removeClass('hide');
				}
				/*if(Event.settings.associationType == 'GROUP'){
			    			$("#save-event-button").attr('disabled','disabled');
			    		}*/
			    if ( Event.settings.associationType == "CONNECTION" ){		
			    	$("#eventTypeValue").html('Reminder');
					$("#eventTypeValue").attr('eventTypeId',2);
					$("#eventTypeValue").attr('eventTypeName','REMINDER');
				}
			}
		});
		/*$('#postAsAnnouncemetcheck').off("click").bind("click",function(e){
					if ($(this).is(":checked")) {
						console.info("Check");
					} else {
						console.warn("Uncheck");
					}
		    	});
		 */

		$('#clickOnArrow').off("click").bind("click",function(e){
			$('#clickOnArrow').toggleClass('expand-icon');
			$('#attendeesHolderDiv').toggleClass('hide');
			$(window).trigger('resize');
		});

		/*		    	
		 * 				Naveen::commented below click event as i couldn't able to select check box. we don't require this click event.
		 * 				$("#eventRSVP").click(function(event) {
					if ($(this).attr("checked") == undefined) {
						$(this).attr("checked", "checked");
					} else {
						$(this).removeAttr("checked");
					}
				});*/
		$('#errorClose').off("click").bind("click",function(e){
			$('#responseElementContentHolder').addClass('hide');
		});
		$("#fromDatetimeIcon").off("click").bind("click",function(e){
			$('#fromDatetime').datetimepicker('show');
		});
		$("#toDatetimeIcon").off("click").bind("click",function(e){
			$('#toDatetime').datetimepicker('show');
		});
		$("#announcementfromDatetimeIcon").off("click").bind("click",function(e){
			$('#announcementfromDatetime').datetimepicker('show');
		});
		$("#announcementtoDatetimeIcon").off("click").bind("click",function(e){
			$('#announcementtoDatetime').datetimepicker('show');
		});
		/*		    	$("#newCategory").off("click").bind("click",function(e){
		    		var options = {
		    			ele:'#manageCategoriesContainer'	
		    		};
		    	});*/
		/*$('[id^=categoryId_]').off("click").bind("click",function(e){
		    		$("#eventCategoryID").val($(this).attr("categoryId"));
		    		$("#eventCategoryID").attr("categoryColorCode",$(this).attr('categoryColorCode'));
		    		$("#eventCategoryID").attr("categoryName",$(this).attr('categoryName'));
		    		$("#eventCategoryID").attr("isCustomCategory",$(this).attr('isCustomCategory'));
		    		$("#eventColorCode").css("background-color",$(this).attr('categoryColorCode'));

		    	});*/
		$("#save-event-button").off("click").bind("click",function(e){
			
			$("#save-event-button").attr('disabled','disabled');

			var isInvalidAttendee = true;
			
		//	console.log ("SAVE event for " + Event.settings.associationType);
			if(Event.settings.associationType == 'COURSE'){
				if($('.attendeesHolderClass').find('.invalidinvitee').length > 0)
					isInvalidAttendee = false;
			}
			//TODO
			if(Event.validate("#eventForm") && isInvalidAttendee){

				if($(this).attr('status') == 'PUBLISH'){
					Event.saveOrUpdateEvent('SAVEEVENT','PUBLISH');
				}else{
					Event.saveOrUpdateEvent('SAVEEVENT','DRAFT');
				}
			}else{
				$("#save-event-button").removeAttr('disabled');
			}
			//Event.saveOrUpdateEvent('SAVEEVENT','DRAFT');
		});

		$("#send-event-button").off("click").bind("click",function(e){
		
		//	console.log ("SEND event for " + Event.settings.associationType);
			$("#send-event-button").attr('disabled','disabled');
			var isInvalidAttendee = true;
				
			if(Event.settings.associationType == 'COURSE'){
				if($('.attendeesHolderClass').find('.invalidinvitee').length > 0)
					isInvalidAttendee = false;
			}

			if(Event.validate("#eventForm") && isInvalidAttendee){
				Event.saveOrUpdateEvent('SAVEEVENT','PUBLISH');
			}else{
				$("#send-event-button").removeAttr('disabled');
			}
			//Event.saveOrUpdateEvent('SAVEEVENT','PUBLISH');
		});

		$('#previousEventView').off("click").bind("click",function(e){
			var identifier = $(this).attr('currentPosition'); 
			var options={
					ele:"#new-event-container",
					mode:'View',
					photoId:Event.settings.photoId,
					uniqueIdentfier:Event.settings.eventIdentifiers[identifier],
					associationType:Event.settings.associationType,
					associationId:Event.settings.associationId,
					userName:Event.settings.userName,
					eventIdentifiers:Event.settings.eventIdentifiers
			};
			Event.init(options);
		});

		$('#nextEventView').off("click").bind("click",function(e){
			var identifier = $(this).attr('currentPosition');
			var options={
					ele:"#new-event-container",
					mode:'View',
					photoId:Event.settings.photoId,
					uniqueIdentfier:Event.settings.eventIdentifiers[identifier],
					associationType:Event.settings.associationType,
					associationId:Event.settings.associationId,
					userName:Event.settings.userName,
					eventIdentifiers:Event.settings.eventIdentifiers
			};
			Event.init(options);
		});

		/****Edit Event ***/
		$("#editViewEvent").off("click").bind("click",function(e){
			
		//	alert("edit view event");
			$(this).addClass('ancher_lock');
			/*		    		$('#previousEventView').addClass('ancher_lock');
					$('#nextEventView').addClass('ancher_lock');*/
			$('#editPencilIcon').addClass('selected-sm');
			var isDraftEvent = $("#editViewEvent").attr('isdraft');

			/*
			if(isDraftEvent == 'DRAFT'){
				$('#deleteViewEvent').removeClass('ancher_lock');
			}else{
				$('#deleteViewEvent').addClass('ancher_lock');
			}
			*/	
				
			var html ='<form id="edit-event-form" class="editeventform"> {{#eventModel}}<!--Edit Mode Starts-->'
					+' <div class="event-Edit-mode pad-top-6">';

			if(Event.settings.associationType == 'COURSE' && typeof Event.settings.isCourseManageCategories != 'undefined' && Event.settings.isCourseManageCategories){
				html+='<div class="clearfix horizontal-fields">	            '+
						'				    	  <input id="allonly" class="css-checkbox courseneweventsendtype"  type="checkbox" value="ALL">	           '+
						'				    	  <label class="css-label pad-left-30" for="allonly">All</label>    '+
						'				    	  <input id="instructorsonly" class="css-checkbox courseneweventsendtype" type="checkbox" value="INSTRUCTOR">	           '+
						'				    	  <label class="css-label pad-left-30" for="instructorsonly">Instructor</label> ';
				if(courseStatus == 'PUBLISHED'){
					html+='				    	      <input id="learnersonly" class="css-checkbox courseneweventsendtype" type="checkbox" value="LEARNER">	            '+
							'				    	  <label class="css-label pad-left-30" for="learnersonly">Learners</label> ';
				}
				html+='				    	    <input id="alumnisonly" class="css-checkbox courseneweventsendtype" type="checkbox" value="ALUMNI">	            '+
						'				    	  <label class="css-label pad-left-30" for="alumnisonly">Alumni</label>   '+
						'				    	  </div>';
			}

			html+='	 <div class="horizontal-fields clearfix min-height-30">'
					+'		<label for="projectTitle">Title</label>'
					+'		<div class="float-left border-bottom text-left input-width-220">{{eventName}}</div></div>'
					+'      <input type="hidden" id="eventName" value="{{eventName}}"/>'
					+'	<div class="horizontal-fields clearfix min-height-30">'
					+'		<label for="projectTitle">Host</label>'
					+'		<div class="float-left border-bottom text-left input-width-220">'
					+'         <div id="hostsContainer"></div>'
					+'      </div>'                                       
					+'	</div>'
					+'	<div class="horizontal-fields clearfix min-height-30">'
					+'		<label for="projectTitle">From</label>'
					+'		<div class="float-left text-left"><input class="font-12px mar-right-5 newevent-input-textbox input-width-220" type="text" id="fromDatetime" readonly value="{{startTime_Modified}}" id="fromDatetime" name="startDate"/><span id="fromDatetimeIcon" title="Select date"  class="calendar-sm-icons enabled-sm pad-left-5 cursor-hand"></span></div>'                                       
					+'	</div>'
					+'	<div class="horizontal-fields clearfix min-height-30">'
					+'		<label for="projectTitle">To</label>'
					+'		<div class="float-left text-left"><input class="font-12px mar-right-5 newevent-input-textbox input-width-220" type="text" id="toDatetime" readonly value="{{endTime_Modified}}" id="toDatetime" name="endDate"/><span id="toDatetimeIcon" title="Select date" class="calendar-sm-icons enabled-sm pad-left-5 cursor-hand"></span></div>'                                       
					+'	</div>'
					+'	<div class="horizontal-fields clearfix min-height-30">'
					+'		<label for="projectTitle" class="mar-right-14-imp">All day</label>'
					+'					<div>'  
					+'						  <input id="allDayCheckbox1" name="allDayCheckbox1" type="checkbox" class="allDayCheckboxClass css-checkbox">'	 
					+'						  <label class="css-label pad-left-30" for="allDayCheckbox1"></label>'                                                                                               
					+'					</div>'                                     
					+'	</div>'
					+'	<div class="horizontal-fields clearfix min-height-30 hide">'
					+'		<label for="projectTitle" class="mar-right-14-imp">Repeat</label>'
					+'		<div class="radiobuttons">'
					+'			<label class="check14">'
					+'				<input name="repeat" value="once" checked="" type="radio"><span class="check"></span>Once'
					+'			</label>'
					+'			<label class="check14">'
					+'				<input name="repeat" value="daily" type="radio"><span class="check"></span>Daily'
					+'			</label>'
					+'			 <label class="check14">'
					+'				<input name="repeat" value="weekly" checked="" type="radio"><span class="check"></span>Weekly'
					+'			</label>'
					+'			<label class="check14">'
					+'				<input name="repeat" value="monthly" type="radio"><span class="check"></span>Monthly'
					+'			</label>'                                                        
					+'		</div>'                                      
					+'	</div>'
					//	+'{{^isOpenEvent}}'
					+'	<div class="horizontal-fields clearfix min-height-30" id="editEventAttendeesDiv">'
					+'			<div class="clear-float pad-bot-12 font-12px helvetica-neue-roman">';
			if( eventData.eventModel.statusEnum == 'DRAFT' && (Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE')){
				var check='';
				if(eventData.eventModel.eventPrivacyLevel =='CONTROLLED'){
					check='checked="checked"';
				}
				html+='<input id="editAttendeesCheckBox" class="css-checkbox" type="checkbox" name ="attendesChck" '+check+'><label class="css-label pad-left-30" for="editAttendeesCheckBox">Attendees</label>';	
			}else{
				html+='Attendees';
			}
			html+='<span id="attendiesCountID" class="attendies-count">{{#hasAttendeesCount}}({{attendeesCount}}){{/hasAttendeesCount}}</span> <span class="lightblue font-12px"></span></div><div id="editAttendeesDiv">'
					//+'		<div class="clear-float"><strong>Attendees</strong> <span class="lightblue font-12px">(<span id="attendiesCountID">{{attendeesCount}}</span>)</span></div>'
					+'		<div class="clear-float lightgreyborder min-height-100 border-radius-4 pad-5" >'
					+'			<div id="attendeesHolder" class="attendeesHolderClass"></div>'	
					+'		</div>'
					+'	<div id="editAttendeesDiverror" class="eventAttendeesContainererror"></div></div>'
					+'  <div class="mar-tb-10 text-right font-13 bold text-align-left nowrap" id="editrsvpDisplayDiv">'
					+'				{{#rsvpCountMap.entry}}'
					+'					<span class="">{{key}} <span class="lightblue font-12px mar-right-3">({{value}})</span></span>{{#isBreak}}{{/isBreak}}'
					+'				{{/rsvpCountMap.entry}}'
					+'</div></div>';
			if( eventData.eventModel.statusEnum == 'DRAFT'){
				var checkedAttr = '';
				if(eventData.eventModel.isRSVPRequired){
					checkedAttr = 'checked="checked"';
				}
				html+='         <div class="right-check float-left mar-tb-10 subgroup-checkbox" id="eventRSVPDiv">'
						+'	            <input id="eventRSVP" class="css-checkbox" type="checkbox" '+checkedAttr+'>'
						+'	            <label class="css-label pad-left-30" for="eventRSVP">RSVP</label>'
						+'          </div>';
			}
			//html+='{{/isOpenEvent}}'
			html+='	<div class="form-group mar-top-10"><textarea class="form-control" rows="4" id="eventDetailsId" maxlength="1500" name="eventDescription" placeholder="Event Details">{{description}}</textarea></div>'
					+'	<div class="horizontal-fields clearfix min-height-30 big-label mar-top-10 mar-bot-5">'
					+'		<label for="projectTitle" class="width-75">Location</label>'
					+'		<div class="float-left text-left"><input type="text" name="location" id="locationId" maxlength="100" value="{{location}}" class="newevent-input-textbox input-width-210"/></div>'                                       
					+'	</div>'
					+'	<div class="horizontal-fields clearfix min-height-30 big-label mar-top-5 hide">'
					+'		<label class="width-75 font-12px" for="projectTitle">Alert</label>'
					+'		<div class="float-left border-bottom text-left input-width-200">30 minutes before</div>'
					+'   <span class="display-inline mar-left-5 filter-sm-icons"></span> '                                      
					+'	</div>'
					+'				<div class="horizontal-fields clearfix min-height-30 big-label mar-top-5">'
					+'					<label class="width-75 font-12px" for="projectTitle">Event Type</label>'
					+'					<div class=" border-bottom float-left text-left input-width-200">'
					+'                     <span id="eventTypeValue" eventTypeName="{{eventTypeEnum}}" eventTypeDisplayName="{{eventTypeEnum_Modified}}" eventTypeId="{{eventCategoryModel.eventTypeId}}">{{eventTypeEnum_Modified}}</span>'
					+'                  </div>'
					+'					<span class="display-inline mar-left-5">'										
					+'						<div class="dropdown black-dropdown-panel dropup open">'
					+'							<a href="#" id="eventTypeDropDown" data-toggle="dropdown" class="dropdown-toggle">'
					+'								<span class="filter-sm-icons" title="Select event type"></span>'
					+'							</a>'
					+'							<ul class="common-dropdown-menus dropdown-menu pull-right black-dropdown">';
			if(Event.settings.associationType == 'CONNECTION'){
				
					html+='			     <li><a id="eventTypeSelect_2" eventType="2" eventTypeDisplayName="Reminder" eventTypeName="REMINDER" href="javascript:void(0);">Reminder</a></li>'
					+'					 <li><a id="eventTypeSelect_1" eventType="1" eventTypeDisplayName="Meeting" eventTypeName="PERSONAL_MEETING" href="javascript:void(0);">Meeting</a></li>';
					           		  
			}else if(Event.settings.associationType == 'GROUP'){
				html+='			           		   <li><a id="eventTypeSelect_3" eventType="3" eventTypeDisplayName="Group Event" eventTypeName="GROUPEVENT" href="javascript:void(0);">Group Event</a></li>';
			}else if(Event.settings.associationType == 'COURSE'){
				html+='			           		   <li><a id="eventTypeSelect_4" eventType="4" eventTypeDisplayName="Course Event" eventTypeName="COURSE_MEETING" href="javascript:void(0);">Course Event</a></li>'
						+'			           		   <li><a id="eventTypeSelect_7" eventType="7" eventTypeDisplayName="Social Event" eventTypeName="COURSE_SOCIAL_EVENT" href="javascript:void(0);">Social Event</a></li>'
						+'			           		   <li><a id="eventTypeSelect_6" eventType="6" eventTypeDisplayName="Key Date" eventTypeName="COURSE_KEY_DATE" href="javascript:void(0);">Key Date</a></li>'
						+'			           		   <li><a id="eventTypeSelect_5" eventType="5" eventTypeDisplayName="Dead Line" eventTypeName="COURSE_DEADLINE" href="javascript:void(0);">Dead Line</a></li>'; 	
			}
			html+='							</ul>'
					+'						</div>'
					+'					</span>'                                       
					+'				</div>'
					+'			</div>'
					+'</div>';
			if( (Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE') && eventData.eventModel.eventPrivacyLevel =='OPEN'){
				html+='<div id="groupEventAnnouncementSection" class="top-border">'+
						'      <div class="form-group">'+
						'        <div class="right-check float-left mar-tb-10 subgroup-checkbox">'+
						'        <input class="css-checkbox" {{#postAsAnnouncement}}checked="checked"{{/postAsAnnouncement}} type="checkbox" name="postAsAnnouncemetcheck" id="postAsAnnouncemetcheck" /> '+
						'        <label for="postAsAnnouncemetcheck" class="css-label pad-left-30 announcement-popover-label helvetica-neue-roman font-12px">Post as Announcement</label></div>'+
						'      </div>'+
						'      <div class="clear-float horizontal-fields clearfix min-height-30">'+
						'        <div class="span20 float-left">'+
						'          <label for="projectTitle">From</label>'+
						'        </div>'+
						'        <div class="span80 float-left text-left">'+
						'        <input class="width-220-imp font-13px mar-right-5 newevent-input-textbox" readonly {{^postAsAnnouncement}}disabled="disabled"{{/postAsAnnouncement}} value="{{announcementStartDate}}" id="announcementfromDatetime" name="newsStartDate" type="text" />'+
						'        <span id="announcementfromDatetimeIcon" title="Select date"  class="calendar-sm-icons enabled-sm pad-left-5 cursor-hand {{^postAsAnnouncement}}ancher_lock disabled-sm{{/postAsAnnouncement}}"></span></div>'+
						'      </div>'+
						'      <div class="clear-float horizontal-fields clearfix min-height-30">'+
						'        <div class="span20 float-left">'+
						'          <label for="projectTitle">To</label>'+
						'        </div>'+
						'        <div class="span80 float-left text-left">'+
						'        <input class="width-220-imp font-13px mar-right-5 newevent-input-textbox" {{^postAsAnnouncement}}disabled="disabled"{{/postAsAnnouncement}} value="{{announcementEndDate}}" id="announcementtoDatetime" readonly name="newsEndDate" type="text" />'+
						'        <span id="announcementtoDatetimeIcon" title="Select date"  class="calendar-sm-icons enabled-sm pad-left-5 cursor-hand {{^postAsAnnouncement}}ancher_lock disabled-sm{{/postAsAnnouncement}}"></span></div>'+
						'      </div>'+
						'      <div class=" form-group">'+
						'        <div class="right-check float-left mar-tb-10 subgroup-checkbox">'+
						'        <input class="css-checkbox" {{^postAsAnnouncement}}disabled="disabled"{{/postAsAnnouncement}} {{#displayInSlideBar}}checked="checked"{{/displayInSlideBar}} id="postOnSlidingcheckbox" name="postOnSlidingcheckbox" type="checkbox" /> '+
						'        <label for="postOnSlidingcheckbox" class="css-label pad-left-30 announcement-popover-label helvetica-neue-roman font-12px">Post on the Sliding Announcement Bar</label></div>'+
						'      </div>'+
						'    </div>';
			}

			html+=	'		<div class="events-buttons text-center">'
					+'			<input title="Save as Draft" value="Save as Draft" id="saveUpdatedEvent" status="DRAFT" class="def-button font-17 small-button" {{^isSaveButtonEnable}} disabled {{/isSaveButtonEnable}} type="button">&nbsp;'
					+'			<input title="Send" value="Send" id="sendUpdateEvent" class="def-button font-17 small-button" type="button">&nbsp;'
					+'			<input title="Cancel" value="Cancel" id="cancelUpdateEvent" class="grey-button font-17 mar-right-0 small-button" type="button">'
					+'		</div>'
					+'            </div>'                                          
					+'          </div>'
					+'</div>'
					+'{{/eventModel}}</form>';


			if(eventData.eventModel.postAsAnnouncement != undefined && eventData.eventModel.postAsAnnouncement == 'true' || eventData.eventModel.postAsAnnouncement == true){
				eventData.eventModel.postAsAnnouncement = true;
			}else{
				eventData.eventModel.postAsAnnouncement = false;
			}

			if(eventData.eventModel.displayInSlideBar != undefined && eventData.eventModel.displayInSlideBar == 'true' || eventData.eventModel.displayInSlideBar == true){
				eventData.eventModel.displayInSlideBar = true;
			}else{
				eventData.eventModel.displayInSlideBar = false;
			}

			if(eventData.eventModel != undefined && eventData.eventModel.newsStartDate != undefined){
				eventData.eventModel.announcementStartDate = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(eventData.eventModel.newsStartDate),'WW MMM dd,yyyy hh:mm A');
			}else{
				eventData.eventModel.announcementStartDate = dateUtility.formatDate(new Date(),'WW, MMM dd,yyyy hh:mm A');
			}

			if(eventData.eventModel != undefined && eventData.eventModel.newsEndDate != undefined){
				eventData.eventModel.announcementEndDate = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(eventData.eventModel.newsEndDate),'WW MMM dd,yyyy hh:mm A');
			}else{
				var now = new Date();
				eventData.eventModel.announcementEndDate = dateUtility.formatDate(new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes()+30,0,0),'WW, MMM dd,yyyy hh:mm A');
			}

			eventData.eventModel.eventTypeDisplayName = Event.getEventTypeDisplayName(eventData.eventModel.eventTypeEnum);

			if(eventData.eventModel.eventPrivacyLevel =='OPEN'){
				eventData.eventModel.isOpenEvent = true;
			}

			if( eventData.eventModel.statusEnum == 'DRAFT'){
				eventData.eventModel.isSaveButtonEnable = true;
				$("#rsvpEnum_IconDisplay").addClass('hide');
			}else{
				eventData.eventModel.isSaveButtonEnable = false;
				$("#rsvpEnum_IconDisplay").removeClass('hide');
			}


			var hostList = eventData.eventModel.hosteventInviteeModelList;
			if(hostList.length == undefined){
				hostList =[hostList];
				eventData.eventModel.hosteventInviteeModelList = [eventData.eventModel.hosteventInviteeModelList];
			};
			eventData.eventModel.attendeesCount = 0;
			var attendeesList = eventData.eventModel.participentEventInviteeModelList;
			var attendeesHTML ='';
			if(attendeesList){
				if(attendeesList && attendeesList.length == undefined){
					attendeesList = [attendeesList];
					eventData.eventModel.participentEventInviteeModelList = [eventData.eventModel.participentEventInviteeModelList];
				}

				eventData.eventModel.hasAttendeesCount = false;
				if(eventData.eventModel.participentEventInviteeModelList.length > 0){
					eventData.eventModel.attendeesCount = eventData.eventModel.participentEventInviteeModelList.length;
					eventData.eventModel.hasAttendeesCount = true;
				}
				//TODO::Naveen:: need to modify the code once this response changes happened from backend
				for(var i=0;i<attendeesList.length;i++){



					if( eventData.eventModel.statusEnum == 'DRAFT'){
						attendeesHTML+='<div class="display-inline font-10px helvetica-neue-roman pad-5" participentId="'+attendeesList[i].participentId+'" id="invitedUserID-'+attendeesList[i].userId+'">'+attendeesList[i].userName+'<a href="javascript:void(0);" contentId="'+attendeesList[i].userId+'"  id="remove-invitedUserID-edit-'+attendeesList[i].userId+'"><div title="Close" class="close-sm-icon top-3 mar-left-3"></div></a></div>';
					}else{
						if(eventData.eventModel.isRSVPRequired){
							attendeesHTML+='<div class="display-inline font-10px helvetica-neue-roman pad-5" participentId="'+attendeesList[i].participentId+'" id="invitedUserID-'+attendeesList[i].userId+'">'+attendeesList[i].userName+'<span class="position-relative top-3 mar-left-5 rsvp-icons '+Event.getRSVPName(attendeesList[i].rsvpEnum)+' mar-lr-close"></span><a href="javascript:void(0);" contentId="'+attendeesList[i].userId+'" isHost="true" class="ancher_lock hide" id="remove-invitedUserID-'+attendeesList[i].userId+'"><div title="Close" class="close-sm-icon top-3 mar-left-3"></div></a></div>';
						}else{
							attendeesHTML+='<div class="display-inline font-10px helvetica-neue-roman pad-5" participentId="'+attendeesList[i].participentId+'" id="invitedUserID-'+attendeesList[i].userId+'">'+attendeesList[i].userName+'<span class="position-relative top-3 mar-left-12"></span><a href="javascript:void(0);" contentId="'+attendeesList[i].userId+'" isHost="true" class="ancher_lock hide" id="remove-invitedUserID-'+attendeesList[i].userId+'"><div title="Close" class="close-sm-icon top-3 mar-left-3"></div></a></div>';
						}
					}

					if($.inArray(attendeesList[i].userId,Event.users) < 0){
						Event.users.push(attendeesList[i].userId);
					}
					if($.inArray(attendeesList[i].userId,selecteduseridlist) < 0){
						selecteduseridlist.push(attendeesList[i].userId);
					}			    			
				}
			}

			var hostsHtml='';

			for(var i=0;i<hostList.length;i++){
				//hostsHtml+='<div class="display-inline font-10px helvetica-neue-roman pad-5" id="invitedUserID-'+hostList[i].userId+'">'+hostList[i].userName+'<a href="javascript:void(0);" contentId="'+hostList[i].userId+'" isHost="true" class="ancher_lock hide" id="remove-invitedUserID-'+hostList[i].userId+'"><div title="Close" class="close-sm-icon top-3 mar-left-3"></div></a></div>';
				if(Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE'){
				hostsHtml+=' <div class="float-left text-left width-220 pad-5 pad-bot-4" id="invitedUserID-'+hostList[i].userId+'">'+eventData.eventModel.associationName+' ('+hostList[i].userName+')</div>';
				}else{
					hostsHtml+=' <div class="float-left text-left width-220 pad-5 pad-bot-4" id="invitedUserID-'+hostList[i].userId+'">'+hostList[i].userName+'</div>';					
				}
				if($.inArray(hostList[i].userId,Event.hosts) < 0){
					Event.hosts.push(hostList[i].userId);
				}
			}

			var eventEditMode = Mustache.to_html(html,eventData);

			$('#editEventSection').html(eventEditMode);

			//checking if course event or not.
			if(eventData.eventModel.associationType == "COURSE"){
				//assinging to one variable for array object
				var eventPrivaciesArray = eventData.eventModel.eventPrivacies;
				//checking if array object or single object 
				var isarray = $.isArray(eventPrivaciesArray);
				if(!isarray)
					eventPrivaciesArray = [eventPrivaciesArray];

				if(eventPrivaciesArray){
					//looping with all array objects and checking event privacies check boxes
					if($.inArray("ALL",eventPrivaciesArray)  != -1){
						$('#allonly').prop('checked',true).next('label').addClass('disable');
						$('.courseneweventsendtype').next('label').addClass('disable');
					}else{
						for(var i = 0; i<eventPrivaciesArray.length; i++){
							if(eventPrivaciesArray[i] == 'ALUMNI'){
								$('#alumnisonly').prop('checked',true).next('label').addClass('disable');
								$('#allonly').next('label').addClass('disable');
							}
							if(eventPrivaciesArray[i] == 'LEARNER'){
								$('#learnersonly').prop('checked',true).next('label').addClass('disable');
								$('#allonly').next('label').addClass('disable');
							}
							if(eventPrivaciesArray[i] == 'INSTRUCTOR'){
								$('#instructorsonly').prop('checked',true).next('label').addClass('disable');
								$('#allonly').next('label').addClass('disable');
							}
							/*if(eventPrivaciesArray[i] == 'ALL'){
								    		$('#allonly').prop('checked',true).next('label').addClass('disable');
								    	}*/
						}
					}
				}
				if(eventData.eventModel.statusEnum == "DRAFT"){
					$('.courseneweventsendtype').next('label').removeClass('disable');
				}
			}

			//$('#viewEventSection').addClass('hide');
			$('#viewEventSection').remove();
			
			
			$("#eventTypeDropDown").trigger('click');
			$("#eventTypeSelect_"+eventData.eventModel.eventCategoryModel.eventTypeId).trigger('click');

			if(eventData.eventModel.eventCategoryModel.eventTypeId == 2){
				$("#sendUpdateEvent").addClass('hide');
				$("#saveUpdatedEvent").attr('status','PUBLISH');
				$("#saveUpdatedEvent").removeAttr('disabled');
				
				$("#saveUpdatedEvent").attr('value', 'Update'); 
				
		//		alert(" event type is 2 ,disable sendUpdateEvent");

				$("#editEventAttendeesDiv").addClass('hide');
				$("#editrsvpDisplayDiv").addClass('hide');
			}

			if(eventData.eventModel.statusEnum == 'PUBLISH'){
				$("#saveUpdatedEvent").removeAttr('disabled');
				$("#saveUpdatedEvent").attr('status','PUBLISH_SAVE');

				if(eventData.eventModel.eventPrivacyLevel =='OPEN'){
					$('#editEventAttendeesDiv').addClass('hide');
				}
			}

			if( eventData.eventModel.statusEnum == 'DRAFT'){
				$("#editrsvpDisplayDiv").addClass('hide');

				if(eventData.eventModel.eventPrivacyLevel =='OPEN'){
					$('#editAttendeesDiv').addClass('hide');
					$('#eventRSVPDiv').addClass('hide');
				}
			}

			if(!eventData.eventModel.isRSVPRequired){
				$("#editrsvpDisplayDiv").addClass('hide');
			}

		//	alert ( " eventData.eventModel.statusEnum " + eventData.eventModel.statusEnum + " eventData.eventModel.eventPrivacyLevel " + eventData.eventModel.eventPrivacyLevel);
			
		/*	
			$('#save-event-button').addClass('hide');
			$("#sendUpdateEvent").attr('value', 'Update'); 
			$("#sendUpdateEvent").attr('title', 'Update'); 
			$("#sendUpdateEvent").removeClass('hide');
			
			$('#saveUpdatedEvent').addClass('hide');	
			$("#send-event-button").attr('value', 'Update'); 
			$("#send-event-button").attr('title', 'Update'); 
			$("#send-event-button").removeClass('hide');
			*/
				
			$('#hostsContainer').html(hostsHtml);
			$('#attendeesHolder').html(attendeesHTML);
			$('#attendeesHolder').after('<input type="text" id="attendeesDiv" class="font-10px helvetica-neue-roman pad-5-imp to-input" placeholder="Add attendees"/>');
			/*if(eventData.eventModel.associationType != 'CONNECTION' ){
		    			$('#hostsContainer').after('<input type="text" id="hostsDiv" />');
		    		}*/
			
			if(eventData.eventModel.allDay == 'true'){
				$('#allDayCheckbox,#allDayCheckbox1').prop('checked',true);
			}

			$(window).trigger('resize');

			if(eventData.eventModel.associationType == "COURSE" && typeof Event.settings.isCourseManageCategories != 'undefined' && Event.settings.isCourseManageCategories){
				Event.loadCourseMembers(eventData.eventModel.hosteventInviteeModelList[0].userId);
			}else{
				Event.loadConnections();
			}
			Event.applayAutoComplete("hostsDiv", "hostsContainer",  Event.connections,true);
			Event.applayAutoComplete("attendeesDiv", "attendeesHolder",  Event.connections,false);
			Event.bindEvents();


			//fromDatetime
			$('#fromDatetime').datetimepicker({
				timepicker: true ,
				formatTime:'h:i A',
				formatDate:'D d M, Y',
				format:'l, M d, Y h:i A',
				defaultDate:convertUTCDateTimeTo.LocalBrowserDateTime(eventData.eventModel.startTime), // it's my birthday
				defaultTime:Event.setDateTime(convertUTCDateTimeTo.LocalBrowserDateTime(eventData.eventModel.startTime)),
				minDate:new Date(), // yesterday is minimum date
				//maxDate:'+1970/01/02' // and tommorow is maximum date calendar
				timepickerScrollbar:false,
				step:30,
				onChangeDateTime:function(dp,$input){
				$('#toDatetime').val($input.val());
			}
			});

			/*$("#dtp").datetimepicker({
			    		defaultDate: "5/31/2013", // this is from jQueryUI datepicker
			    		hour: 19,
			    		minute: 30
			    		});*/

			//toDatetime
			$('#toDatetime').datetimepicker({
				timepicker: true ,
				formatTime:'h:i A',
				formatDate:'D d M, Y',
				format:'l, M d, Y h:i A',
				defaultDate:convertUTCDateTimeTo.LocalBrowserDateTime(eventData.eventModel.endTime), // it's my birthday
				defaultTime:Event.setDateTime(convertUTCDateTimeTo.LocalBrowserDateTime(eventData.eventModel.endTime)),
				minDate:new Date(), // yesterday is minimum date
				//maxDate:'+1970/01/02' // and tommorow is maximum date calendar
				timepickerScrollbar:false,
				step:30
				/*onChangeDateTime:function(dp,$input){
			    			    alert($input.val())
			    		  }*/
			});

			var editAnnouncementfromDateValue=new Date($('#announcementfromDatetime').val());
			//announcement from 
			$('#announcementfromDatetime').datetimepicker({
				timepicker: true ,
				formatTime:'h:i A',
				formatDate:'D d M, Y',
				format:'l, M d, Y h:i A',
				defaultDate:editAnnouncementfromDateValue, 
				defaultTime:Event.setDateTime(editAnnouncementfromDateValue),
				minDate:new Date(), // yesterday is minimum date
				//maxDate:'+1970/01/02' // and tommorow is maximum date calendar
				timepickerScrollbar:false,
				step:30,
				onChangeDateTime:function(dp,$input){
				$('#announcementtoDatetime').val($input.val());
			}
			});

			var editAnnouncementtoDatetimeValue=new Date($('#announcementtoDatetime').val());
			//announcement toDatetime
			$('#announcementtoDatetime').datetimepicker({
				timepicker: true ,
				formatTime:'h:i A',
				formatDate:'D d M, Y',
				format:'l, M d, Y h:i A',
				defaultDate:editAnnouncementtoDatetimeValue, 
				defaultTime:Event.setDateTime(editAnnouncementtoDatetimeValue),
				minDate:new Date(), // yesterday is minimum date
				//maxDate:'+1970/01/02' // and tommorow is maximum date calendar
				timepickerScrollbar:false,
				step:30
				/*onChangeDateTime:function(dp,$input){
			    			    alert($input.val())
			    		  }*/
			});

			$("#eventTypeDropDown").addClass('ancher_lock');
			
			//checking if all day event is checked or not. based on this removing time picker from the dateandtime picker calendar.
			Event.settings.allDayEvent = Boolean($('.allDayCheckboxClass:visible').is(":checked")) ;
			if (Event.settings.allDayEvent)
				Event.changeDateTimePicker(false);
			else
				Event.changeDateTimePicker(true);

			$("[id^=remove-invitedUserID-edit-]").off("click").bind("click",function(e){
				var id=$(this).attr('contentId');
				$("#invitedUserID-"+id).remove();
				Event.users.splice($.inArray(id, Event.users), 1);	 
				if(Event.settings.associationType == 'CONNECTION'){
					selecteduseridlist.splice($.inArray(id, selecteduseridlist), 1);
				}
				$('#attendiesCountID').text((Event.users==undefined||Event.users.length==undefined||Event.users==0)?'':'('+Event.users.length+')');

				if(Event.settings.associationType == 'CONNECTION'){
					if(selecteduseridlist.length === 0){
						$("#sendUpdateEvent").attr('value', 'Create'); 
						$("#sendUpdateEvent").attr('title', 'Create'); 
					}
				}

			});

			$('#editAttendeesCheckBox').off("click").bind("click",function(e){

			//	alert(" attendees check ");
				$("#attendiesCountID").text('');
				$('#attendeesHolder').empty();
				Event.users=[];
				$("#eventRSVP").prop('checked',false);

				if($(this).is(':checked')){
					$('#save-event-button').removeClass('hide');
					
					$("#sendUpdateEvent").attr('value', 'Send'); 
					$("#sendUpdateEvent").attr('title', 'Send'); 
					
					$("#send-event-button").attr('value', 'Send'); 
					$("#send-event-button").attr('title', 'Send'); 
					
					$('#editAttendeesDiv').removeClass('hide');
					$('#eventRSVPDiv').removeClass('hide');
					if(Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE'){
						$("#groupEventAnnouncementSection").addClass('hide');
					}
				}
				else{
					$('#save-event-button').addClass('hide');
					$("#sendUpdateEvent").attr('value', 'Create'); 
					$("#sendUpdateEvent").attr('title', 'Create'); 
					
					$("#send-event-button").attr('value', 'Create'); 
					$("#send-event-button").attr('title', 'Create'); 
					
					if(Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE'){
						$("#groupEventAnnouncementSection").removeClass('hide');
					}
					$('#editAttendeesDiv').addClass('hide');
					$('#eventRSVPDiv').addClass('hide');
				}
			});

		});

		/****Delete Event ***/
		$('#deleteViewEvent').off("click").bind("click",function(e){

			Confirmation.init({
				yesLabel:"Delete",
				noLabel:"Cancel",
				title:"Delete Event",
				ele:Event.settings.ele,
				onYes:function(e){
				$('#deleteViewEvent').addClass('selected-sm');
				var deleteEventRequest =
					{        
							accessToken:accessToken,
							langId:langId,
							userId:userId,
							eventUniqueIdentifier:[Event.settings.uniqueIdentfier]

					};
				deleteEventRequest= JSON.stringify(deleteEventRequest);

				var options = {
						url:getModelObject('serviceUrl')+'/event/1.0/deleteEventInvitation',
						data:deleteEventRequest,
						successCallBack:function(data){
					$('#deleteViewEvent').removeClass('selected-sm');

					doAjax.displaySuccessMessage("Event deleted");
					if($.isFunction(Event.settings.removeEvent)){
						Event.settings.removeEvent(Event.settings.uniqueIdentfier);
					}

					
/*					var jsonObj = '';
					jsonObj = JSON.parse(JSON.stringify(myCalendarEventsTwoByTwo.settings.calendarEvents));
					var json = jsonObj['events'];
					if(json.length > 0){
						for(var i=0; i<json.length;i++){
							if(json[i]['eventUniqueIdentifier'] == Event.settings.uniqueIdentfier){
								json.splice(i,1);
								myCalendarEventsTwoByTwo.dynamicUI("#eventsContainerDiv",jsonObj);
								break;
								}
						}
					}*/
					//remove event from Event List view screen
					$('#eventListViewDivid_'+Event.settings.uniqueIdentfier).remove();
					// move from the top to bottom to complete functionality before closing event
					Event.closeEvent();
				},
						async:true
				};
				doAjax.PutServiceInvocation(options);
			},
				message:'Are you sure want to delete the event?'
			});

		});


		$('#sendUpdateEvent').off("click").bind("click",function(e){
			
			$("#sendUpdateEvent").attr('disabled','disabled');
			var isInvalidAttendee = true;
			if(Event.settings.associationType == 'COURSE'){
				if($('.attendeesHolderClass').find('.invalidinvitee').length > 0)
					isInvalidAttendee = false;
			}

			if(Event.validate("#edit-event-form") && isInvalidAttendee){
				Event.saveOrUpdateEvent('EDITEVENT','PUBLISH');
			}else{
				$("#sendUpdateEvent").removeAttr('disabled');
			}

		});

		$('#saveUpdatedEvent').off("click").bind("click",function(e){

			$("#saveUpdatedEvent").attr('disabled','disabled');

			var isInvalidAttendee = true;
			if(Event.settings.associationType == 'COURSE'){
				if($('.attendeesHolderClass').find('.invalidinvitee').length > 0)
					isInvalidAttendee = false;
			}

			if(Event.validate("#edit-event-form") && isInvalidAttendee){
				if($(this).attr('status') == 'PUBLISH'){
					Event.saveOrUpdateEvent('EDITEVENT','PUBLISH');
				}else if($(this).attr('status') == 'PUBLISH_SAVE'){
					Event.saveOrUpdateEvent('EDITEVENT','PUBLISH_SAVE');
				}else{
					Event.saveOrUpdateEvent('EDITEVENT','DRAFT');
				}
			}else{
				$("#saveUpdatedEvent").removeAttr('disabled');
			}

		});
		$("#cancelUpdateEvent").off("click").bind("click",function(e){
			Event.closeEvent();
		});
		$("#cancel-event-button").off("click").bind("click",function(e){
			Event.closeEvent();
		});

		$("#cancel-new-event").off("click").bind("click",function(e){
			$("#editViewEvent").removeClass('ancher_lock');
			Event.closeEvent();
		});
		$('#closeViewEvent').off("click").bind("click",function(e){
			$("#editViewEvent").removeClass('ancher_lock');
			$('#editViewEvent').removeClass('selected-sm');
			$('#deleteViewEvent').removeClass('selected-sm');
			Event.closeEvent2X2View();
			//Event.closeEvent();
		});
		
		$("[id^=eventTypeSelect_]").off("click").bind("click",function(e){
		//	alert($(this).attr('eventTypeName')+'----'+$(this).attr('eventType'));
			
			if ( $("#eventTypeValue").attr('eventTypeId') ==  $(this).attr('eventType')){
				// same selection as before
				return ;
			}
			
			$("#eventTypeValue").html($(this).attr('eventTypeDisplayName'));
			$("#eventTypeValue").attr('eventTypeId',$(this).attr('eventType'));
			$("#eventTypeValue").attr('eventTypeName',$(this).attr('eventTypeName'));
			var eventTypeId = $(this).attr('eventType');
			
			
			// MEETING
			if (eventTypeId == 1 ){
				$('#attendeesCheckBox').trigger("click");
			}
			
			// REMINDER
			if(eventTypeId == 2){
			
				$('#attendeesCheckBox').trigger("click");
					
				$("#eventAttendeesContainer").addClass('hide');
				$("#eventRSVPDiv").addClass('hide');
			//	$("#send-event-button").addClass('hide');
			//	$("#save-event-button").attr('status','PUBLISH');
			//	$("#save-event-button").val('Save');

				$("#attendiesCountID").text('');
				$('#attendeesHolderDiv').empty();
				Event.users=[];
				$("#eventRSVP").prop('checked',false);
			}
			else if(eventTypeId == 3){
				$("#send-event-button").removeClass('hide');
				$("#save-event-button").attr('status','DRAFT');
				
			}
			
			// ALL OTHER TYPES
			else{
				$("#eventAttendeesContainer").removeClass('hide');
				$("#eventRSVPDiv").removeClass('hide');
				$("#send-event-button").removeClass('hide');
				$("#save-event-button").attr('status','DRAFT');
			}
			$(window).trigger('resize');
		});


		// Accepted/Declined/Tentative

		$('[id^=acceptEvent_]').off('click').bind('click',function(){
			var $this = $(this);
			var participantId = $this.attr('participentId');
			var parentDiv = $this.attr('parentDiv');
			Event.manageEventInvitation(participantId,'ACCEPT',parentDiv,$this.attr('data-eventUniqueIdentifier'));
		});

		$('[id^=declineEvent_]').off('click').bind('click',function(){
			var $this = $(this);
			var participantId = $this.attr('participentId');
			var parentDiv = $this.attr('parentDiv');
			Event.manageEventInvitation(participantId,'DECLINE',parentDiv,$this.attr('data-eventUniqueIdentifier'));
			$('#acceptEvent_'+participantId).addClass('hide');
			$('#tentativeEvent_'+participantId).addClass('hide');
		});


		$('[id^=tentativeEvent_]').off('click').bind('click',function(){
			var $this = $(this);
			var participantId = $this.attr('participentId');
			var parentDiv = $this.attr('parentDiv');
			Event.manageEventInvitation(participantId,'TENTATIVE',parentDiv,$this.attr('data-eventUniqueIdentifier'));

		});

		$('.rsvp-icons').mouseover(function(){
			
			if($('.rsvp-icons').hasClass('notResponded')){
				$('.rsvp-icons').attr('title','Not Responded');
				//$('.rsvp-icons').prop('title', 'test');
			}
			if($('.rsvp-icons').hasClass('tentative')){
				$('.rsvp-icons').attr('title','Tentative');
			}
			if($('.rsvp-icons').hasClass('declined')){
				$('.rsvp-icons').attr('title','Declined');
			}
			if($('.rsvp-icons').hasClass('accepted')){
				$('.rsvp-icons').attr('title','Accepted');
			}
		});
	},
	
	closeEvent:function(){
		
		//alert('clicked on cancel event');
		$("#eventContainerModal").modal('hide');
		if(Event.settings.onExit){
			if($.isFunction(Event.settings.onExit)){
				Event.settings.onExit();
			}
		}
		Event.destory();

		$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");
		/*
	    		$("#"+container).html('');
	    		$("#"+container).addClass('hide');*/
	},
	closeEvent2X2View:function(){
		
		$("#eventContainerModal").modal('hide');
		/*		    	if(Event.settings.onExit){
	    			if($.isFunction(Event.settings.onExit)){
	    				Event.settings.onExit();
	    			}
	    		}
		    	Event.destory();*/

		$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");
		/*
	    		$("#"+container).html('');
	    		$("#"+container).addClass('hide');*/
	},
	getRSVPName:function(rsvp){
		
		if(rsvp =='YES'){
			return 'accepted';
		}else if(rsvp =='AWAITING'){
			return 'notResponded';
		}else if(rsvp =='NO'){
			return 'declined';
		}else if(rsvp =='TENTATIVE'){
			return 'tentative';
		}
	},
	
	getEventTypeDisplayName:function(eventTypeEnum){

		if(eventTypeEnum == 'PERSONAL_MEETING'){
			return 'Meeting';
		}else if(eventTypeEnum == 'REMINDER'){
			return 'Reminder';
		}else if(eventTypeEnum == 'GROUPEVENT'){
			return  'Group Event';
		}else if(eventTypeEnum == 'COURSE_MEETING'){
			return 'Course Event';
		}else if(eventTypeEnum == 'COURSE_DEADLINE'){
			return 'Deadline';
		}else if(eventTypeEnum == 'COURSE_KEY_DATE'){
			return 'KeyDate';
		}else if(eventTypeEnum == 'COURSE_SOCIAL_EVENT'){
			return 'Social Event';
		}

	},

	manageEventInvitation:function(participantId,actionType,parentDiv,eventUniqueIdentifier){
		var manageEventInvitationRequest ={
				userId:userId,
				accessToken:accessToken,
				langId:langId,
				eventInvitationRequestId:[participantId],
				invitationRequestActionEnum:actionType
		};

		manageEventInvitationRequest =JSON.stringify(manageEventInvitationRequest);

		var options = {
				url:getModelObject('serviceUrl')+'/event/1.0/manageEventInvitation',
				data:manageEventInvitationRequest,
				requestInfo:{performedElement:parentDiv,actionType:actionType,participantId:participantId,eventUniqueIdentifier:eventUniqueIdentifier},
				successCallBack:Event.manageEventInvitationSuccessCallBack,
				async:true
				/* parentId:baseElementEvents*/
		};

		doAjax.PostServiceInvocation(options);

	}, 
	
	manageEventInvitationSuccessCallBack:function(requestInfo,data){

		var isSuccess =data.isSuccess;
		var updatedStatus;
		if(isSuccess){
			var eventDetails = $.parseJSON($('#eventdetails_'+requestInfo.eventUniqueIdentifier).html());
			if(requestInfo.actionType == 'ACCEPT'){
				updatedStatus = 'Accepted';
				$('#declinedBtnSource').html('<button class="grey-button" id="declineEvent_'+requestInfo.participantId+'" parentDiv="declinedBtnSource" participentId="'+requestInfo.participantId+'">Decline</button>&nbsp;');
				$('#tentativeBtnSource').html('<button class="grey-button" id="tentativeEvent_'+requestInfo.participantId+'" parentDiv="tentativeBtnSource" participentId="'+requestInfo.participantId+'">Tentative</button>');
				$('#'+requestInfo.performedElement).html('<span class="font-16px">'+updatedStatus+'</span>');
				if($('#calendar').length > 0){
					delete eventDetails['blurcolor'];
					FullCalendarWidget.removeFullCalendarEvent(eventDetails['id']);
					FullCalendarWidget.renderFullCalendarEvent(eventDetails);
				}
				if(eventDetails['isEventListView']){
					$('.smcircleblueEventListView_'+eventDetails['id']).css('background-color',eventDetails['color']);
				}
			}else if(requestInfo.actionType == 'DECLINE'){
				updatedStatus = 'Declined';
				$('#'+requestInfo.performedElement).html('<span class="red">'+updatedStatus+'</span>');
				if($('#calendar').length > 0)
					FullCalendarWidget.removeFullCalendarEvent(eventDetails['id']);
				if(eventDetails['isEventListView']){
					$('#eventListViewDivid_'+eventDetails['id']).remove();
				}				
				Event.closeEvent();
			}else if(requestInfo.actionType == 'TENTATIVE'){
				updatedStatus = 'Tentative';
				$('#acceptedBtnSource').html('<button title="Accept" class="def-button" id="acceptEvent_'+requestInfo.participantId+'" parentDiv="acceptedBtnSource" participentId="'+requestInfo.participantId+'">Accept</button>&nbsp;');
				$('#declinedBtnSource').html('<button class="grey-button" id="declineEvent_'+requestInfo.participantId+'" parentDiv="declinedBtnSource" participentId="'+requestInfo.participantId+'">Decline</button>&nbsp;');
				$('#'+requestInfo.performedElement).html('<span class="mediumgray">'+updatedStatus+'</span>');
				if($('#calendar').length > 0){
					delete eventDetails['blurcolor'];
					FullCalendarWidget.removeFullCalendarEvent(eventDetails['id']);
					FullCalendarWidget.renderFullCalendarEvent(eventDetails);
				}
				if(eventDetails['isEventListView']){
					$('.smcircleblueEventListView_'+eventDetails['id']).css('background-color',eventDetails['color']);
				}				

			}

			Event.bindEvents(); 
		}

		//  	 console.log(" getting notification count update");
		//getEventNotificationCount();
		getAllNotificationsCount();//from header-new.jsp

	},
	validate : function(ele){
		
		var rules = {};
		
		if($('.allDayCheckboxClass:visible').is(':checked')){

			rules = {
					eventName:{
					required : true,
					maxlength: 100
				},
					location:{
					required : false
				},
					eventDescription:{
					maxlength: 1500
				},
					newsStartDate:{
					lessThan: "#announcementfromDatetime" 
				},
					newsEndDate:{
					greaterThan: "#announcementfromDatetime" 
				}
				};
			
		}else{
			
			jQuery.validator.addMethod("greaterThan", 
					function(value, element, params) {

				if (!/Invalid|NaN/.test(new Date(value))) {
					return new Date(value) > new Date($(params).val());
				}

				return isNaN(value) && isNaN($(params).val()) 
						|| (Number(value) > Number($(params).val())); 
			},'Must be greater than From Date.');

			jQuery.validator.addMethod("lessThan", 
					function(value, element) {

				if (!/Invalid|NaN/.test(new Date(value))) {
					return new Date(value) > new Date();
				}

				return isNaN(value)  
						|| (Number(value) > Number(new Date())); 
			},'Must be greater than Current Date.');
			
				rules = {
					eventName:{
					required : true,
					maxlength: 100
				},
					location:{
					required : false
				},
					endDate: { 
					greaterThan: "#fromDatetime" 
				},
					startDate:{
					lessThan:"#fromDatetime"
				},
					eventDescription:{
					maxlength: 1500
				},
					newsStartDate:{
					lessThan: "#announcementfromDatetime" 
				},
					newsEndDate:{
					greaterThan: "#announcementfromDatetime" 
				}
				};
			
		}

		$(ele).validate({
			rules:rules,
			errorPlacement: function(error, element) {
			if (element.attr("name") == "endDate") {
				error.insertAfter( $("#toDatetimeIcon") );
			}else if (element.attr("name") == "startDate") {
				error.insertAfter( $("#fromDatetimeIcon") );
			}else if(element.attr("name") == "newsStartDate"){
				error.insertAfter( $("#announcementfromDatetimeIcon") );
			}else if(element.attr("name") == "newsEndDate"){
				error.insertAfter( $("#announcementtoDatetimeIcon") );
			}else {
				error.insertAfter(element);
			}
		},
			messages: {
			eventName:{
			required : "Event Name is required.",
			maxlength : "Please enter less than 100 characters"
		},
			eventDescription : "Please enter less than 1500 characters",
			location: "Location is required.",
		},
			highlight: function(element, errorClass, validClass) {
			$(element).removeClass('red').addClass(validClass);
		},
			errorElement: "div",
			errorClass: "red"
		});
		if($(ele).valid()){
			return true;
		}else{
			return false;
		}
	},

	saveOrUpdateEvent:function(action,eventStatus){

		var isPublishSave = false;
		if(eventStatus == 'PUBLISH_SAVE'){
			eventStatus = 'PUBLISH';
			isPublishSave = true;
		}

		var postAsAnnouncement = false;
		if ($("#postAsAnnouncemetcheck").attr("checked") == 'checked') {
			postAsAnnouncement = true;
		}
		var displayInSlideBar = false;
		if ($("#postOnSlidingcheckbox").attr("checked") == 'checked') {
			displayInSlideBar = true;
		}
		
		var attendeesRequired = Boolean($('#attendeesCheckBox').is(":checked")) ;
		//  var newsStartDate = new Date($("#announcementfromDatetime").val());
		//	var newsEndDate = new Date($("#announcementtoDatetime").val());

		var newsStartDate =  new moment($("#announcementfromDatetime").val()).format();
		var newsEndDate = new moment($("#announcementtoDatetime").val()).format();

		var toDate = $("#toDatetime").val();//datetimepicker('getDate');
		var fromDate = $("#fromDatetime").val();//datetimepicker('getDate');

		var tempToDate = new Date(toDate);
		var tempFromDate = new Date(fromDate);

		//		console.log(tempToDate.toJSON().toString());
		//		console.log(tempFromDate.toJSON().toString());

		var toDateTimeValue =  new moment(tempToDate).format();
		var fromDateTimeValue = new moment(tempFromDate).format();

		//		console.log(toDateTimeValue.toString());
		//		console.log(fromDateTimeValue.toString());

		//		console.log(newsStartDate.toString());
		//		console.log(newsEndDate.toString());
		var isisListView = Event.settings.isListView;
		var location = $("#locationId").val();
		var eventTypeId = $("#eventTypeValue").attr('eventTypeId');
		var eventTypeName = $("#eventTypeValue").attr('eventTypeName');
		var eventName = $("#eventName").val();
		var eventPhoto = Event.settings.photoId;
		var eventDescription = $("#eventDetailsId").val();
		var eventUniqueIdentfier = '';
		//var hostId,eventColor;
		var eventCategoryID,eventCategoryColorCode,eventCategoryName,eventCategoryType,eventCategoryBlurCode;
		var offset = getOffset();
		var eventPrivacy;
		var rsvp = false;
		if ($("#eventRSVP").prop("checked")) {
			rsvp = true;
		}
		if(action == 'SAVEEVENT'){
			eventPrivacy= 'CONTROLLED';
			if(Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'COURSE' || Event.settings.associationType == 'CONNECTION'){
				if(attendeesRequired){
					eventPrivacy= 'CONTROLLED';
				}else{
					eventPrivacy = 'OPEN';
				}
			}
		}else{
			eventPrivacy = eventData.eventModel.eventPrivacyLevel;
			if((Event.settings.associationType == 'GROUP' || Event.settings.associationType == 'CONNECTION' || Event.settings.associationType == 'COURSE') && $('#editAttendeesCheckBox').length > 0){
				if(attendeesRequired){
					eventPrivacy= 'CONTROLLED';
				}else{
					eventPrivacy = 'OPEN';
				}
			}
		}

		var eventPrivacies;
		eventPrivacies = [];
		//checking if course event or not.
		if(Event.settings.associationType == 'COURSE'){
			//getting all visible event privacies check boxes.
			var object = $('.courseneweventsendtype:visible');
			//looping with all check boxes and preparing array object to passing in to request object.
			for(var i = 0; i<object.length;i++){
				if(object[i].checked){
					if(object[i].value == 'ALUMNI'){
						eventPrivacies.push(object[i].value);
					}
					if(object[i].value == 'LEARNER'){
						eventPrivacies.push(object[i].value);
					}
					if(object[i].value == 'INSTRUCTOR'){
						eventPrivacies.push(object[i].value);
					}
					if(object[i].value == 'ALL'){
						eventPrivacies.push(object[i].value);
					}
				}
			}

		}

		if(action == 'SAVEEVENT'){
			//hostId = $("#hostId").attr('userId');
			//eventColor = $("#event-color").val();
			eventCategoryID = $("#eventCategoryID").val();

			eventCategoryColorCode = $("#eventCategoryID").attr("categoryColorCode");
			eventCategoryName = $("#eventCategoryID").attr("categoryName");
			eventCategoryType = $("#eventCategoryID").attr("isCustomCategory");

			eventCategoryBlurCode = $("#eventCategoryID").attr("categoryBlurCode");
		}else{

			//eventColor = $("#event-color").val();
			eventCategoryID = $("#eventCategoryID").val();

			eventCategoryColorCode = $("#eventCategoryID").attr("categoryColorCode");
			eventCategoryName = $("#eventCategoryID").attr("categoryName");
			eventCategoryType = $("#eventCategoryID").attr("isCustomCategory");
			eventCategoryBlurCode = $("#eventCategoryID").attr("categoryBlurCode");

			eventUniqueIdentfier = eventData.eventModel.eventUniqueIdentifier;
		}

		var attendees;
		attendees = [];

		if(eventTypeId != 2){
			attendees = Event.users;
		}

		var inviteesList;
		inviteesList =[];

		if(attendees){
			if(attendees.length == undefined){
				attendees = [attendees];

			}
			if(action == 'SAVEEVENT'){
				for(var i=0;i<attendees.length;i++){
					inviteesList.push({userId:attendees[i]});
				}
			}else{
				for(var i=0;i<attendees.length;i++){


					if(eventData.eventModel.participentEventInviteeModelList != undefined && eventData.eventModel.participentEventInviteeModelList[i] != undefined && eventData.eventModel.participentEventInviteeModelList[i].userId == attendees[i] ){
						inviteesList.push({userId:attendees[i],participentId:eventData.eventModel.participentEventInviteeModelList[i].participentId});
					}else{
						inviteesList.push({userId:attendees[i]});
					}
				}
			}

			//eventPrivacy = 'CONTROLLED';
		}else{
			//eventPrivacy = 'OPEN';
		}

		var hostsList;
		hostsList = [];
		var hosts = Event.hosts;
		if(hosts){
			if(hosts.length == undefined){
				hosts = [hosts];
			}
			if(action == 'SAVEEVENT'){
				for(var i=0;i<hosts.length;i++){
					hostsList.push({userId:hosts[i]});
				}
			}else{
				for(var i=0;i<hosts.length;i++){
					if(eventData.eventModel.hosteventInviteeModelList[i] != undefined && eventData.eventModel.hosteventInviteeModelList[i].userId == hosts[i] ){
						hostsList.push({userId:hosts[i]});
					}else{
						hostsList.push({userId:hosts[i]});
					}
				}
			}
		}

		var eventCategoryModel = {
				categoryId:eventCategoryID,
				isCustomCategory:eventCategoryType,
				categoryColorCode:eventCategoryColorCode,
				eventTypeId:eventTypeId,
				categoryName:eventCategoryName
		};

		var createEventRequest = {
			eventModel:{
			eventName:eventName,
			location:location,
			startTime:fromDateTimeValue,
			endTime:toDateTimeValue,
			description:eventDescription,
			photoId:eventPhoto,
			associationId:Event.settings.associationId,
			associationType:Event.settings.associationType,
			statusEnum:eventStatus,
			eventTypeEnum:eventTypeName,
			isRSVPRequired:rsvp,
			hosteventInviteeModelList:hostsList,
			participentEventInviteeModelList:inviteesList,
			eventPrivacies : eventPrivacies,
			eventPrivacyLevel:eventPrivacy,
			offset:offset,
			associationUniqueIdentifier:Event.settings.associationUniqueIdentifier,
			isPublishSave:isPublishSave,
			postAsAnnouncement:postAsAnnouncement,
			displayInSlideBar:displayInSlideBar,
			newsStartDate:newsStartDate,
			newsEndDate:newsEndDate,
			allDay: convertStringToBoolean(Event.settings.allDayEvent)
		},

				userId:userId,
				accessToken:accessToken,
				langId:langId
		};

		createEventRequest.eventModel.eventCategoryModel = eventCategoryModel;

		var event;
		if(action == 'SAVEEVENT'){
			var eventCategoryModel = {
					categoryId:eventCategoryID,
					isCustomCategory:eventCategoryType,
					categoryColorCode:eventCategoryColorCode,
					eventTypeId:eventTypeId,
					categoryName:eventCategoryName
			};
			createEventRequest.eventModel.eventCategoryModel = eventCategoryModel;

			event = {
					id : '',
					title : eventName,
					start : fromDateTimeValue,
					end : toDateTimeValue,
					editable : false,
					color:eventCategoryColorCode,
					eventPrivacies:eventPrivacies,
					associationType:Event.settings.associationType,
					allDay:convertStringToBoolean(Event.settings.allDayEvent),
					isListView : isisListView,
			};

		}else{
			createEventRequest.eventUniqueIdentifier = eventUniqueIdentfier;
			createEventRequest.eventStatusEnum = eventStatus;
			event = {
					id : eventUniqueIdentfier,
					title : eventName,
					start : fromDateTimeValue,
					end : toDateTimeValue,
					editable : false,
					color:eventCategoryColorCode,
					eventPrivacies:eventPrivacies,
					associationType:Event.settings.associationType,
					allDay:convertStringToBoolean(Event.settings.allDayEvent),
					isListView : isisListView,
			};
		}

		var url;

		if(action == 'SAVEEVENT'){
			url = getModelObject('serviceUrl')+'/event/1.0/saveEvent';
		}else{
			url = getModelObject('serviceUrl')+'/event/1.0/manageEvent';
		}

		createEventRequest = JSON.stringify(createEventRequest);

		var createEventOptions={
				url:url,
				data:createEventRequest,
				async:true,
				requestInfo:{event:event},
				successCallBack:function(requestInfo,data){

					var isSuccess = data.isSuccess;
					if(isSuccess){
						$('#editViewEvent').removeClass('selected-sm');
						$('#previousEventView').removeClass('ancher_lock');
						$('#nextEventView').removeClass('ancher_lock');
						$('#deleteViewEvent').removeClass('ancher_lock');
						
						var eventss = requestInfo.event;
						
						if(eventss.allDay){
							var startdate = moment(eventss.start);
							var enddate= moment(eventss.end);
							eventss.start = new Date(startdate );
							eventss.end = new Date(moment(enddate).add(1,'days'));
						}
						
						
						//logic to render events on calendar
						if($('#calendar').length > 0){
							
							if(action == 'SAVEEVENT'){
								var event = requestInfo.event;
								event.id = data.eventUniqueIdentifier;

								if(eventStatus == 'DRAFT'){
									event.color = eventCategoryBlurCode;
								}

								FullCalendarWidget.renderFullCalendarEvent(event);
							}else if(action == 'EDITEVENT'){

								FullCalendarWidget.removeFullCalendarEvent(eventData.eventModel.eventUniqueIdentifier);
								if(eventStatus == 'DRAFT' || eventData.eventModel.rsvpEnum == 'AWAITING'){
									requestInfo.event.color = eventData.eventModel.eventCategoryModel.categoryBlurCode;
								}else{
									requestInfo.event.color = eventData.eventModel.eventCategoryModel.categoryColorCode;
								}
								//Naveen:: will update the only event on the full calendar with color or date.
								FullCalendarWidget.renderFullCalendarEvent(requestInfo.event);
							}
							
							var events = $('#calendar').fullCalendar('clientEvents');
							
							events = FullCalendarWidget.sortByKey(events,'start');
							
							FullCalendarWidget.eventIdentifiers = [];
							for(var i=0;i<events.length;i++){
								FullCalendarWidget.eventIdentifiers.push(events[i].id);
							}
						}
						
						//logic to render events on Events List view
						if(requestInfo.event.isListView){
							if($('#isDraftOrEventsView').data('typeofevent') == 'Draft Events'){
								$('#draftEvents2X2view').trigger('click');
							}
							if($('#isDraftOrEventsView').data('typeofevent') == 'Events'){
								$('#upComingEvents2X2view').trigger('click');
							}
						}
						
						//To Address bug XIP-4382
						if(requestInfo.event.associationType == 'COURSE'){
						if(!$.isEmptyObject(requestInfo.event.eventPrivacies)){
							 //checking is array object or not. this is not required but safe side written.
				    		var isarray = $.isArray(eventPrivacies);
				    		if(!isarray)
				    			eventPrivacies = [eventPrivacies];

				    		//if event Privacies
				    		if(eventPrivacies){
				    			//making all checked event Privacies are un checked.
				    			$('.coursecalendersenderstype').attr('checked',false);
				    			//checking if "ALL" value is present in the array object. As this array is all combination of all events in the calendar.
				    			//TODO based on reply comment recieved on this bug XIP-4382 we can uncomment individual checks. 
				    			//if($.inArray("ALL",eventPrivacies)  != -1){
									$('#allcalonly').prop('checked',true);
									$('#allcalonly').trigger('click');
/*				    			}else{//if there is not ALL event privacies checked peforming for other checkboxes.
				    			for(var i = 0; i<eventPrivacies.length; i++){
					    		    	if(eventPrivacies[i] == 'ALUMNI'){
								    		$('#alumniscalonly').prop('checked',true);
								    		$('#alumniscalonly').trigger('click');
								  		}
								    	if(eventPrivacies[i] == 'LEARNER'){
								    		$('#learnerscalonly').prop('checked',true);
								    		$('#learnerscalonly').trigger('click');
								  		}
								    	if(eventPrivacies[i] == 'INSTRUCTOR'){
								    		$('#instructorscalonly').prop('checked',true);
								    		$('#instructorscalonly').trigger('click');
								  		}
				    				}
				    			}*/
				    		}
						 }
						}
						

						if(action == 'SAVEEVENT' && eventStatus == 'PUBLISH'){
							if(eventTypeId == 2){
								doAjax.displaySuccessMessage('Reminder saved');
							}else{
								doAjax.displaySuccessMessage('Event created');
							}
						}else if(action == 'SAVEEVENT' && eventStatus == 'DRAFT'){
							doAjax.displaySuccessMessage('Event saved as draft');
						}else if(action == 'EDITEVENT' && eventStatus == 'DRAFT'){
							doAjax.displaySuccessMessage('Draft Event updated');
						}else{
							if(eventTypeId == 2){
								doAjax.displaySuccessMessage('Reminder updated');
							}else{
								if(isPublishSave){
									doAjax.displaySuccessMessage('Event saved');
								}else{
									doAjax.displaySuccessMessage('Event published');
								}
							}
						}
						$("#send-event-button").removeAttr('disabled');

					}

					$("#editViewEvent").removeClass('ancher_lock');	
					Event.closeEvent();
				},
				failureCallBack:function(requestInfo,data){
					doAjax.displayErrorMessagesInPopup(data,"#responseElementContent");
					$("#send-event-button").removeAttr('disabled');
					$("#save-event-button").removeAttr('disabled');

					$("#sendUpdateEvent").removeAttr('disabled');
					$("#saveUpdatedEvent").removeAttr('disabled');
				}
		};
		doAjax.PostServiceInvocation(createEventOptions);
	}
	};
}.call(this);

var EventCategories = function(){
	//var container;
	var accessToken =  $("#accessToken_meta").val();
	var langId = $("#langId_meta").val();
	//var userId = $("#loggedInUserId-meta").val();
	var ele = '';
	//var isEditable = false;
	var isenablecaticon = false;
	return {
		categories:[],
		//categoryColorCodes:['#8A2BE2','#A52A2A','#7FFF00','#FF1493','#FF7F50','#00FFFF','#FF4500','#008B8B','#B8860B','#8B008B','#556B2F','#FF8C00','#FF00FF','#9932CC','#8B0000','#2F4F4F'],
		categoryColorCodes:['#d53044','#ff7700','#fed206','#fed631','#39892f','#22baac','#0063be','#a4c4ef','#5a3f99','#8b2d8d','#f59db3','#7f551b','#747679','#003f00','#9f1c12','#eedebb'],
		categoryBlurColorCodes:['#E18F99','#F6B277','#F6E07A','#F6E28F','#93BB8E','#88D4CD','#77A8D6','#C9D9EE','#A496C3','#BC8DBD','#F1C5D0','#B6A184','#B1B2B3','#779677','#C68580','#EEE6D4'],
		categoryIds:[],
		defaults:{
		mode:'Event'

	},
		settings:{

	},
	destory:function(){
		
		categoryIds = [];
		EventCategories.settings = {};

	},
	init:function(options){
		
		isenablecaticon = options.isCategoryIconenable;
		EventCategories.destory();
		this.settings = {};
		this.settings = $.extend(this.defaults,options);
		ele = this.settings.ele;
		container = ele.substring(1);
		if(EventCategories.settings.mode == 'Manage'){
			/*if(EventCategories.settings.categories){
	       		    	EventCategories.categories = EventCategories.settings.categories;
	       		    }*/
			var categoriesData = {eventCategoryModelList:EventCategories.categories};

			if(categoriesData.eventCategoryModelList && categoriesData.eventCategoryModelList.length == undefined){
				categoriesData.eventCategoryModelList = [categoriesData.eventCategoryModelList ];
			}
			if(categoriesData.eventCategoryModelList){
				for(var i=0;i<categoriesData.eventCategoryModelList.length;i++){
					if(categoriesData.eventCategoryModelList[i].isCustomCategory == 'true'){
						categoriesData.eventCategoryModelList[i].isCustomCategory = true;
					}else if(categoriesData.eventCategoryModelList[i].isCustomCategory == 'false'){
						categoriesData.eventCategoryModelList[i].isCustomCategory = false;
					}
					categoriesData.eventCategoryModelList[i].tooltipcategoryName = categoriesData.eventCategoryModelList[i].tooltipcategoryName;
					categoriesData.eventCategoryModelList[i].categoryName = (categoriesData.eventCategoryModelList[i].categoryName.length > 20)?categoriesData.eventCategoryModelList[i].categoryName.substr(0,20)+"...":categoriesData.eventCategoryModelList[i].categoryName; 
				}
			}
			EventCategories.manageCategoryUI(categoriesData);
		}else{
			EventCategories.loadAllCategories();
		}
	},

	loadAllCategories : function(){

		var options = {
				url:getModelObject('serviceUrl')+'/event/1.0/getEventCategory',
				headers:{
			"accessToken" : accessToken,
			"langId" : langId
		},
			data:{
			associationType:EventCategories.settings.associationType,
			associationUniqueIdentifier:EventCategories.settings.associationUniqueIdentifier
		},
		successCallBack:function(data){
			
			EventCategories.categories = data.eventCategoryModelList;
			if(EventCategories.settings.mode == 'Event'){

				/*		    					if(data.eventCategoryModelList != undefined){
		    			    		for(var i=0;i<data.eventCategoryModelList.length;i++){
			    						if(!data.eventCategoryModelList[i].isCustomCategory && !data.eventCategoryModelList[i].categoryType == 'CONNECTION'){



			    						}		    			    			

		    			    			data.eventCategoryModelList[i].tooltipcategoryName = data.eventCategoryModelList[i].categoryName;
		    			    			data.eventCategoryModelList[i].categoryName = (data.eventCategoryModelList[i].categoryName.length > 10)?data.eventCategoryModelList[i].categoryName.substr(0,10)+"..":data.eventCategoryModelList[i].categoryName;
		    			    		}

		    					}*/

				EventCategories.createEventCategoryUI(data);
			}else if(EventCategories.settings.mode == 'Filter'){
				if(EventCategories.settings.isEditable == 'true'){
					data.isNewEnabled = true;
				}else{
					data.isNewEnabled = false;
				}
				EventCategories.createEventFilterCategoriesUI(data);
			}

		},
			async:true
		};
		doAjax.GetServiceInvocation(options);
	},
	
	createEventFilterCategoriesUI:function(data){
		
		var dynamicHtml = '<div id="filterCategoriesDiv" class="icon-padding-left radiobuttons float-left">'
				+'	<div id="filterCategoryAllDiv"><input type="checkbox" id="checkboxBlog" class="css-checkbox" checked categoryId=""/>'
				+'	<label for="checkboxBlog" class="css-label"><span class="pad-left-25 font-10px">All</span></label></div>'
				+'  {{#eventCategoryModelList}}'
				+'	<div id="filterCategoryDiv_{{categoryId}}"><input type="checkbox" categoryType="{{categoryType}}" isCustomCategory="{{isCustomCategory}}" id="checkboxBlog_{{categoryId}}" categoryId="{{categoryId}}" class="css-checkbox"/>'
				+'	<label for="checkboxBlog_{{categoryId}}" class="css-label"><span class="blue pad-left-25 font-10px" style="color:{{categoryColorCode}}" title="{{tooltipcategoryName}}"><pre>{{categoryName}}</pre></span></label></div>'
				+'  {{/eventCategoryModelList}}'
				+'	{{#isNewEnabled}}<div id="newCustomCategoryDiv"><a href="javascript:void(0);" class="" id="newCustomCategory"><span class="font-12px lightblue">New</span></a></div>{{/isNewEnabled}}'
				+'	</div>';

		if(data.eventCategoryModelList != undefined && data.eventCategoryModelList !=null){

			for(var i=0;i<data.eventCategoryModelList.length;i++){
				data.eventCategoryModelList[i].tooltipcategoryName = data.eventCategoryModelList[i].categoryName;
				data.eventCategoryModelList[i].categoryName = (data.eventCategoryModelList[i].categoryName.length > 20)?data.eventCategoryModelList[i].categoryName.substr(0,20)+"...":data.eventCategoryModelList[i].categoryName;
			}

		}
		var html = Mustache.to_html(dynamicHtml,data);
		if($(ele).hasClass('mCustomScrollbar')){
			$(ele).removeClass('mCustomScrollbar _mCS_9');
			$(ele).mCustomScrollbar('destroy');
		}
		$(ele).html(html);
		var xiimcustomScrollbarOptions = {elementid:ele,isUpdateOnContentResize:true,setHeight:"240px",vertical:'y'};
		xiimcustomScrollbar(xiimcustomScrollbarOptions);


		EventCategories.bindEvents();
	},
	
	createEventCategoryUI:function(data){
		
		var dynamicHtml = '';
		if(isenablecaticon){
			dynamicHtml+='<a href="#" data-toggle="dropdown" class="ancher_lock  dropdown-toggle">'
					+'	<span title="Select Category" class="tag-sm-icons disabled-sm" id="eventcategoriesdropdownidd"></span>&nbsp;'
					+'</a>';
		}else{
			dynamicHtml+='<a href="#" data-toggle="dropdown" class="dropdown-toggle">'
					+'	<span title="Select Category" class="tag-sm-icons enabled-sm" id="eventcategoriesdropdownidd"></span>&nbsp;'
					+'</a>';
		}

		dynamicHtml+='<ul id="categoriesUL" class="dropdown-menu arrow-right black-dropdown categoriesULClass eventcategoriesdropdownclass">';
		var isDashboard = $('.dashboardviewportcontainer').is(':visible');
		if(data.eventCategoryModelList != undefined && data.eventCategoryModelList !=null){
			if(data.eventCategoryModelList.length == undefined){
				data.eventCategoryModelList = [data.eventCategoryModelList];
			}

			for(var i=0;i<data.eventCategoryModelList.length;i++){
				if( (data.eventCategoryModelList[i].categoryType == 'GROUP' || data.eventCategoryModelList[i].categoryName == 'Course') 
						&& isDashboard && data.eventCategoryModelList[i].isCustomCategory == 'false'){
					continue;
				}		
				var modifiedname = stringLimitDots(data.eventCategoryModelList[i].categoryName,20);
				dynamicHtml+='	<li><a class="offwhitelink eventcategorieshreflinkclass iscategoryselected" href="javascript:void(0);" categoryType="'+data.eventCategoryModelList[i].categoryType+'" id="categoryId_'+data.eventCategoryModelList[i].categoryId+'"'
						+'	categoryId="'+data.eventCategoryModelList[i].categoryId+'" isCustomCategory="'+data.eventCategoryModelList[i].isCustomCategory+'" categoryColorCode="'+data.eventCategoryModelList[i].categoryColorCode+'" categoryName="'+data.eventCategoryModelList[i].categoryName+'"'
						+'	categoryBlurCode="'+data.eventCategoryModelList[i].categoryBlurCode+'" title="'+data.eventCategoryModelList[i].categoryName+'"><span class="sm-circle-blue mar-right-12"'
						+'	style="background-color:'+data.eventCategoryModelList[i].categoryColorCode+'"></span><pre>'+modifiedname+'</pre></a></li>';

			}
		}
		dynamicHtml+= '  </ul>'
				+'  <span id="manageCategoriesDiv" class=""></span>';

		$(ele).html(dynamicHtml);

		// Remove the scrollbar on the category popover 	
		    	if(data != undefined && data.eventCategoryModelList != undefined && data.eventCategoryModelList.length >= 10){
		    		//xiimcustomScrollbar("#eventCategoryMenu .dropdown-menu",true,"300px");
		    		var xiimcustomScrollbarOptions = {elementid:"#categoriesUL",isUpdateOnContentResize:true,setHeight:"300px",vertical:'y'};
		    		xiimcustomScrollbar(xiimcustomScrollbarOptions);
		    	}
		 

		EventCategories.bindEvents();
	},
	
	closeCategories:function(){
		
		$("#manageCategoryContainerModal").modal('hide');
	},
	
	manageCategoryUI:function(data){
		
		var dynamicHtml = '' //'<div class="lightgreyborder fullview-md-size">' 
				+'	<div class="pad-bot-0">'                                      	
				+'		<div class="modal-header-bottom-border helvetica-neue-roman pad-bot-10 font-15px ">Calendar Category'
				+'			<i class="pull-right position-relative">'
				+'				<span title="Close" class="close-sm-icons selected-sm" id="manageCategoryCancel"></span>'
				+'			</i>'
				+'		</div>'
				+'	 </div>'
				+'	 <div class="">'
				+'		<div class="pad-lr-12 calendarcategory">' 
				+'			<ul class="" id="manageCategoriesUl">'
				+'             {{#eventCategoryModelList}}'
				+'                {{#isCustomCategory}}'
				+'				     <li id="deleteCategoryLi{{categoryId}}"><span class="sm-circle-offwhite mar-right-12" style="background-color:{{categoryColorCode}}"></span><span isCustomCategory="{{isCustomCategoyr}}" categoryId="{{categoryId}}" title="{{tooltipcategoryName}}"><pre> {{categoryName}}</pre></span><span id="deleteCategory_{{categoryId}}" isCustomCategory="{{isCustomCategory}}" categoryId="{{categoryId}}" title="Remove Category"  class="pull-right minus-sm-icons enabled-sm cursor-hand mar-lr-10"></span></li>'
				+'                {{/isCustomCategory}}'
				+'                {{^isCustomCategory}}'
				+'				     <li><span class="sm-circle-blue mar-right-12" style="background-color:{{categoryColorCode}}"></span> <span isCustomCategory="{{isCustomCategoyr}}" categoryId="{{categoryId}}" title="{{tooltipcategoryName}}"><pre>{{categoryName}}</pre></span></li>'
				+'                {{/isCustomCategory}}'
				/*+'				<li><span class="sm-circle-green mar-right-12"></span><span> Groups</span></li>'
		    		+'				<li><span class="sm-circle-grey mar-right-12"></span><span> Connections</span></li>'*/
				+'             {{/eventCategoryModelList}}'
				+'			</ul>'
				+'			<div>&nbsp;</div>'
				/*+'          <div id="newCategoryDiv">'

		    		+'		    </div>'*/
				+'			<div class="divider"><a id="addCategory" title="Add custom category" class="plus-sm-icons selected-sm cursor-hand mar-lr-5"></a></div>'

				+'      </div>'
				+'	</div>';//'</div>'

		var html = Mustache.to_html(dynamicHtml,data);
		$("#modal-box-wrapper").html('<div id="manageCategoryContainerModal" class="modal fade"><div class="modal-dialog"><div class="modal-content width-340 mar-left-120"><div id="manageCategoryContainer" class="modal-body pad-12"></div></div></div></div>');
		$("#manageCategoryContainer").html(html);

		EventCategories.buildCurrentModalPopup("#manageCategoryContainerModal");
		EventCategories.bindEvents();
	},
	buildCurrentModalPopup:function(element){
		
		var optionsForModel ={
				backdrop:'static',
				show:true,
				keyboard:true
		};

		$(element).modal(optionsForModel);
		$(element).on('show.bs.modal',function(e){
		});
		$(element).on('hide.bs.modal',function(e){
			$(element).html('');
			$(element).addClass('hide');
			$(element).remove();
		});
	},
	dynamicEvents:function(){

		$("#cancelCategory").off("click").bind("click",function(e){
			$("#newCategoryDiv").remove();
			$("#emptyCategoryError").addClass('hide');
			$("#saveCategory").removeAttr('disabled');
			EventCategories.closeCategories();
		});

		$( "#categoryName" ).on('keyup',function() {
			$( "#categoryAlreadyExists" ).addClass('hide');
			$("#emptyCategoryError").addClass('hide');
		});

		$("#saveCategory").off("click").bind("click",function(e){
			$("#saveCategory").attr('disabled','disabled');
			//var categoryId = '';
			var categoryName = $.trim($('#categoryName').val());
			//var isCustomCategory = true;
			var categoryColorCode = $('#customColorCode').val();
			var categoryBlurColorCode = $("#customBlurColorCode").val();
			//var categoryType = EventCategories.settings.associationType;

			if(categoryName == ''){
				//need to provide the validation
				$("#emptyCategoryError").removeClass('hide');
				$("#saveCategory").removeAttr('disabled');
				return;
			}else{
				$("#emptyCategoryError").addClass('hide');
			}
			//need to perform the service call.
			var createEventCategoryRequest = {
					accessToken:accessToken,
					langId:langId,
					eventCategoryModel:{
				isCustomCategory:true,
				categoryName:categoryName,
				categoryColorCode:categoryColorCode,
				categoryBlurCode:categoryBlurColorCode,
				categoryType:EventCategories.settings.associationType,
				associationUniqueIdentifier:EventCategories.settings.associationUniqueIdentifier
			}
			};
			createEventCategoryRequest = JSON.stringify(createEventCategoryRequest);
			var options = {
					url:getModelObject('serviceUrl')+'/event/1.0/saveOrUpdateEventCategory',
					data:createEventCategoryRequest,
					successCallBack:function(data){
				if(data.isExsists == 'true'){
					$("#saveCategory").removeAttr('disabled');
					$("#categoryAlreadyExists").removeClass('hide');
				}else{
					var category = data.eventCategoryModel;
					var categoryNamee = stringLimitDots(category.categoryName,20);
					var html ='<li id="deleteCategoryLi'+category.categoryId+'"><span class="sm-circle-offwhite mar-right-12" style="background-color:'+category.categoryColorCode+'"></span><span class="custom-event-newevent-pre" title="'+category.categoryName+'"> '+categoryNamee+'</span><span id="deleteCategory_'+category.categoryId+'" categoryId ="'+category.categoryId+'" categoryColorCode="'+category.categoryColorCode+'" title="Remove Category" class="pull-right minus-sm-icons enabled-sm cursor-hand mar-lr-10"></span></li>';
					$("#manageCategoriesUl").append(html);


					$('<li><a href="javascript:void(0);" class="offwhitelink iscategoryselected" id="categoryId_'+category.categoryId+'" categoryId="'+category.categoryId+'" isCustomCategory="'+category.isCustomCategory+'" categoryColorCode="'+category.categoryColorCode+'" categoryName="'+category.categoryName+'" categoryBlurCode="'+category.categoryBlurCode+'"><span class="sm-circle-blue mar-right-12" style="background-color:'+category.categoryColorCode+'"></span>'+category.categoryName+'</a></li>')
					.insertBefore('#categoriesUL .divider');

					//Remove scrolling on the category popover 
						    	  	if($("#categoriesUL").height() >= 300){
						    	  		var xiimcustomScrollbarOptions = {elementid:"#eventCategoryMenu .dropdown-menu",isUpdateOnContentResize:true,setHeight:"300px",vertical:'y'};
						    	  		xiimcustomScrollbar(xiimcustomScrollbarOptions);
						    	  	}
					 
					category.tooltipcategoryName = category.categoryName;
					category.categoryName = (category.categoryName.length > 20)?category.categoryName.substr(0,20)+"...":category.categoryName;

					$("#newCalendarCustomCategoryDiv").before('<div id="filterCalendarCategoryDiv_'+category.categoryId+'" categoryId="'+category.categoryId+'" isCustomCategory="'+category.isCustomCategory+'" categoryColorCode="'+category.categoryColorCode+'" categoryName="'+category.categoryName+'" class="text-left calendarCategories"><input class="css-checkbox" id="eventCategoryCheckBox_'+category.categoryId+'" value="'+category.categoryId+'" type="checkbox"><label for="eventCategoryCheckBox_'+category.categoryId+'" iscustomcategory="'+category.isCustomCategory+'" categorycolorcode="'+category.categoryColorCode+'" class="css-label mediumblue" style="color:'+category.categoryColorCode+'" title="'+category.tooltipcategoryName+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<pre class="custom-event-newevent-pre">'+category.categoryName+'</pre></label></div>');
					if($("#newCustomCategoryDiv").length){
						var newCustomCategoryHtml='	<div id="filterCategoryDiv_'+category.categoryId+'"><input type="checkbox" id="checkboxBlog_'+category.categoryId+'" categoryId="'+category.categoryId+'" class="css-checkbox"/>'
								+'	<label for="checkboxBlog_'+category.categoryId+'" class="css-label"><span class="blue pad-left-25 font-10px" style="color:'+category.categoryColorCode+'">'+category.categoryName+'</span></label></div>';
						$("#newCustomCategoryDiv").before(newCustomCategoryHtml);

						if(EventCategories.categories == undefined){
							EventCategories.categories=[];
						}

						if(EventCategories.categories != undefined && EventCategories.categories.length == undefined){
							EventCategories.categories = [EventCategories.categories];
						}
						EventCategories.categories.push(data.eventCategoryModel);
					}
					if(EventCategories.settings.onSelect){
						if($.isFunction(EventCategories.settings.onSelect)){
							//commented below line to work on bug numbers XIP-3250 this is blocking the code to execute.
							//EventCategories.settings.onSelect(data.eventCategoryModel);
						}
					}

					//EventCategories.closeCategories();
					$("#newCategoryDiv").remove();
					EventCategories.bindEvents();
					$("#saveCategory").removeAttr('disabled');
					$('#addCategory').removeClass("ancher_lock");	

				}
			},
					async:true
			};
			doAjax.PostServiceInvocation(options);

			EventCategories.bindEvents();
		});
	},
	bindEvents:function(){
		
		$("#manageCategoryCancel").off("click").bind("click",function(e){

			
			//Naveen commented this as this is not nessocery to trigger whole event page.
/*			if($("#headerSpanContainer").attr('widgetType') == 'isMyEvents'){
				$("#myEvent2X2view").trigger('click');
			}


			if($("#headerSpanContainer").attr('widgetType') == 'isUpcomingEvents'){
				$("#upComingEvents2X2view").trigger('click');
			}

			if($("#headerSpanContainer").attr('widgetType') == 'isDraftEvents'){
				$("#draftEvents2X2view").trigger('click');
			}
*/

			EventCategories.closeCategories();
		});
		$("#newCustomCategory").off("click").bind("click",function(e){
			var manageCategoryOptions = {
					ele:'#manageCategoriesDiv',
					mode:'Manage',
					onSelect:EventCategories.settings.onSelect,
					associationType:EventCategories.settings.associationType
			};
			EventCategories.init(manageCategoryOptions);
		});
		$("[id^=checkboxBlog]").off('click').bind('click',function(e){
			var categoryId =$(this).attr('categoryId');
			var isCustomCategory = $(this).attr('isCustomCategory');
			if(categoryId){
				if($(this).is(':checked')){
					if($.inArray(categoryId,categoryIds) == -1){
						if(isCustomCategory == 'true'){
							categoryIds.push(categoryId);
						}else{
							categoryIds.push($(this).attr('categoryType'));
						}
					}

					$("#checkboxBlog").prop('checked', false);
				}else{
					if(isCustomCategory == 'true'){
						var index = categoryIds.indexOf(categoryId);
						if (index > -1) {
							categoryIds.splice(index, 1);
						}
					}else{
						var index = categoryIds.indexOf($(this).attr('categoryType'));
						if (index > -1) {
							categoryIds.splice(index, 1);
						}
					}

				}
				if(categoryIds.length == EventCategories.categories.length){
					$("#checkboxBlog").prop('checked', true);
					$("[id^=checkboxBlog_]").prop('checked', false);
					categoryIds = [];
				}else if(categoryIds.length == 0){
					$("#checkboxBlog").prop('checked', true);
					$("[id^=checkboxBlog_]").prop('checked', false);
				}
			}else{
				$("[id^=checkboxBlog_]").prop('checked', false);
				$("#checkboxBlog").prop('checked', true);
				categoryIds = [];
			}

			if(EventCategories.settings.onClick){
				if($.isFunction(EventCategories.settings.onClick)){
					EventCategories.settings.onClick(categoryIds);
				}
			}

		});
		$("#newEventCategory").off('click').bind('click',function(e){
			var manageCategoryOptions = {
					ele:'#manageCategoriesDiv',
					mode:'Manage',
					onSelect:EventCategories.settings.onSelect,
					associationType:EventCategories.settings.associationType
			};
			EventCategories.init(manageCategoryOptions);
		});

		$('[id^=categoryId_]').off("click").bind("click",function(e){
			/*	XIP-2917 bug fix removed as it is not nesscesory. because other than current associationtype (PERSONAL/COURSE/GROUP) we are not rendering while creating or editing the event.
			 * 		var categoryType = $(this).attr('categoryType');
			var isCustomCategory = $(this).attr('isCustomCategory');
			if(!(EventCategories.settings.associationType == categoryType) && isCustomCategory == 'false'){
				return false;
			}*/
			var $this = $(this);
			var data={
					categoryId:$this.attr("categoryId"),
					categoryColorCode:$this.attr('categoryColorCode'),
					categoryName:$this.attr('categoryName'),
					isCustomCategory:$this.attr('isCustomCategory'),
					categoryBlurCode:$this.attr('categoryBlurCode')
			};
			if(EventCategories.settings.onSelect){
				if($.isFunction(EventCategories.settings.onSelect)){
					EventCategories.settings.onSelect(data);
				}
			}
			$("#eventcategoriesdropdownidd").removeClass("selected-sm");
		});
		$("#addCategory").off("click").bind("click",function(e){
			
			$("#addCategory").addClass('ancher_lock');
			var colorCode;
			var blurColorCode;

			colorCode = EventCategories.categoryColorCodes[Math.floor(Math.random() * EventCategories.categoryColorCodes.length)];

			var indexColorCode = EventCategories.categoryColorCodes.indexOf($.trim(colorCode)); 

			blurColorCode = EventCategories.categoryBlurColorCodes[indexColorCode];

			var html ='<div id="newCategoryDiv">' 
					+'<div id="emptyCategoryError" class="red validationError pad-left-30 hide">Category required</div>'
					+'<div class="new-category-section">'
					+'  <span class="newcategory-circle sm-circle-category mar-right-12 mar-top-12-imp vertical-align-middle " style="background-color:'+colorCode+'"></span>'
					+'  <input type="hidden" id="customColorCode" value="'+colorCode+'"/>'
					+'  <input type="hidden" id="customBlurColorCode" value="'+blurColorCode+'"/>'
					+'  <span class="display-inline"><input type="text" id="categoryName" class="input-textbox-category-height-width form-control" maxlength="50" placeholder="Enter Category Title"/></span>'
					+'  <div class="display-inline red pad-left-28 font-12px hide" id="categoryAlreadyExists">Category name with same color code already exists.</div>'
					+'</div>'
					+'<div class="text-center mar-top-5">'
					+'	<input title="Save" value="Save" id="saveCategory" class="def-button small-button mar-right-8" type="button"> '
					+'	<input title="Cancel" value="Cancel" id="cancelCategory" class="grey-button small-button " type="button">'
					+'</div>'
					+'</div>';
			if($('#newCategoryDiv').length) $('#newCategoryDiv').remove();
			$("#addCategory").after(html);
			EventCategories.dynamicEvents();

			$('#categoryName').focus();
			$(window).trigger('resize');
		});

		$("[id^=deleteCategory_]").off("click").bind("click",function(e){

			var categoryId = $(this).attr('categoryId');
			var deleteCategoryRequest = {
					categoryId:categoryId,
					accessToken:accessToken,
					langId:langId,
					associationType:EventCategories.settings.associationType
			};
			deleteCategoryRequest = JSON.stringify(deleteCategoryRequest);
			//do the service call
			var options = {
					url:getModelObject('serviceUrl')+'/event/1.0/deleteEventCategory',
					data:deleteCategoryRequest,
					successCallBack:function(data){
				$("#deleteCategoryLi"+categoryId).remove();
				$("#categoryId_"+categoryId).remove();
				$("#filterCategoryDiv_"+categoryId).remove();
				if($("#filterCalendarCategoryDiv_"+categoryId)){
					$("#filterCalendarCategoryDiv_"+categoryId).remove();
				}
				var existedCategories;
				existedCategories=[];
				$.each(EventCategories.categories, function( index, value ) {
					if(value.categoryId != categoryId){
						existedCategories.push(value);
					}
				});
				EventCategories.categories = existedCategories;
				if(EventCategories.settings.onDelete){
					if($.isFunction(EventCategories.settings.onDelete)){
						EventCategories.settings.onDelete(categoryId);
					}
				}

				//$("#myCalendar2X2view").trigger('click');
			},
					async:true
			};
			doAjax.PutServiceInvocation(options);

		});
	}
	};

}.call(this);

//getEventNotificationCount is used to get the count of event notification
function getEventNotificationCount(){

	$.ajax({
		type:'GET',
		url:contextPath+"/feeds/getAlertCounts",
		contentType: "application/json",
		accept: "application/json",
		cache: false,
		dataType: "json",
		async: true,
		error : function(jqXHR, textStatus,errorThrown) {

	},
		success : function(data) {
		data = $.parseJSON(data);
		try{	
			// My Notification Count
			if(typeof data['eventAlertsCount'] != 'undefined' && data['eventAlertsCount'] > 0){
				$('#calendar_event_count').removeClass('hide').html(data['eventAlertsCount']);
			}else{
				$('#calendar_event_count').addClass('hide');
			}

			// Course Notification Count
			if(typeof data['courseAlertsCount'] != 'undefined' && data['courseAlertsCount'] > 0){
				$('#courseRequestCount').html(data['courseAlertsCount']).removeClass('hide');
			}else{
				$('#courseRequestCount').addClass('hide');
			}
		}catch(e){
			//console.log(e);
		}
	}
	}); 
};