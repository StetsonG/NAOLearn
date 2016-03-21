
/**
 * @author Next Sphere Technologies
 * My Calendar (2x2) view  widget
 * 
 * My Calendar (2x2) view widget is used get all Events, Draft and Pending invitations as an list view both for 
 * Group and Personal Calendar based on association type.
 * 
 * 1. Upcoming Events
 * 2. Draft Events
 * 3. Pending Invitations
 * 
 */



var myCalendarEventsTwoByTwo = function(){
	var accessToken =  $("#accessToken_meta").val();
	var langId = $("#langId_meta").val();
	var userId = $("#loggedInUserId-meta").val();
	var element;
	var userName = $("#loggedInUserName-meta").val();
	//var currentDate;
	//var widgetType = '';
	var eventType = '';
	var loadType = "";
	return {
		settings:{

	},
		defaults:{
		isUpcomingEvents:false,
		isDraftEvents:false,
		isMyEvents:false,
		eventFilterSetting : "MONTH",
		currentMode: '',
		currentDate:'',
		widgetType:'',
		calendarEvents:{},
	},
	destroy:function(){
			myCalendarEventsTwoByTwo.settings='';
			widgetType = '';
			eventType = '';
			eventUniqueIdentifiers =[];
	},
		eventUniqueIdentifiers:[],
		
	init:function(options){
			this.settings = {};
			this.defaults = {};
			myCalendarEventsTwoByTwo.destroy();
			this.defaults = {
					isUpcomingEvents:false,
					isDraftEvents:false,
					isMyEvents:false,
					eventFilterSetting : "MONTH",
					currentMode:'',
					currentDate:'',
					widgetType:'',
					calendarEvents:{},
				};
			this.settings = $.extend(this.defaults,options);
			element = this.settings.ele;
			loadType = options;
			if(options.isUpcomingEvents){
				myCalendarEventsTwoByTwo.settings.widgetType = 'isUpcomingEvents';
			}else if(options.isDraftEvents){
				myCalendarEventsTwoByTwo.settings.widgetType ='isDraftEvents';
			}else if(options.isPendingInvitation){
				myCalendarEventsTwoByTwo.settings.widgetType ='isPendingInvitation';
			}else if(options.isMyEvents){
				myCalendarEventsTwoByTwo.settings.widgetType ='isMyEvents';
			}
			myCalendarEventsTwoByTwo.settings.currentDate = options.currentDate;
			this.staticUI(element);

			var req = this.prepareServiceRequest(options);
			this.serviceInvocation(req);

	},
	updateCalendar:function(options){
		//	myCalendarEventsTwoByTwo.destroy();

			this.settings = $.extend(this.defaults,options);
			element = this.settings.ele;
			loadType = options;
			if(options.isUpcomingEvents){
				myCalendarEventsTwoByTwo.settings.widgetType = 'isUpcomingEvents';
			}else if(options.isDraftEvents){
				myCalendarEventsTwoByTwo.settings.widgetType ='isDraftEvents';
			}else if(options.isPendingInvitation){
				myCalendarEventsTwoByTwo.settings.widgetType ='isPendingInvitation';
			}else if(options.isMyEvents){
				myCalendarEventsTwoByTwo.settings.widgetType ='isMyEvents';
			}
			myCalendarEventsTwoByTwo.settings.currentDate = options.currentDate;
			//	this.staticUI(element);

			myCalendarEventsTwoByTwo.loadCategoriesFilter();
			myCalendarEventsTwoByTwo.loadMiniCalendar();
			myCalendarEventsTwoByTwo.bindEvents();

			var req = this.prepareServiceRequest(options);
			this.serviceInvocation(req);	

	},
	serviceInvocation:function(options){
	
			doAjax.PostServiceInvocation(options);
	},
	prepareServiceRequest:function(flag){
	
			var now = flag.currentDate;//new Date(); 
			var today = now;//new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),now.getUTCHours(),now.getUTCMinutes(),now.getUTCSeconds()).getTime();
			today = convertUTCDateTimeTo.formatDate_yyyymmdd(today);
			var eventFilterCriteriaEnum ='';
			var eventSearchCriteriaValue = '';
			var URI = '';
			var accessToken = $("#accessToken").val();
			var userId = $("#userId").val();
			var startResult = parseInt($("#startResult").val());
			if(startResult > 0){
				startResult = startResult+0;
			}else{
				startResult = 0;
			}
			var maxResult = parseInt($("#maxResult").val());

			var  request = '';
			var headerContent = '';
			if(flag.eventType == 'UPCOMING'){
				eventFilterCriteriaEnum = 'UPCOMING';
				eventSearchCriteriaValue = 'PUBLISH';
			}else if(flag.eventType == 'PENDINGINVITATION'){
				eventFilterCriteriaEnum ='YEAR'; 
				eventSearchCriteriaValue = '';
			}

			if(flag.isUpcomingEvents){
				//headerContent = 'Upcoming Events';
				
				URI = $("#getEventsURI").val();
				request = {                			
						userId:userId,
						accessToken:accessToken,
						pageCriteriaModel: {
							pageSize:maxResult,
							pageNo:startResult,
							isAll: true
					},

						viewTypeEnum:"UPCOMINGEVENTS_VIEW",
						eventFilterCriteriaEnum:flag.eventType,
						eventSearchCriteria:[
											 {
												 eventSearchCriteria:"OFFSET",
												 eventSearchCriteriaValue:getOffset()
											 },
											 {
												 eventSearchCriteria:eventFilterCriteriaEnum,
												 eventSearchCriteriaValue:""
											 },
											 {
												 eventSearchCriteria:"CURRENTDATE",
												 eventSearchCriteriaValue:today
											 }
											 ]
				};   

			}else if(flag.isDraftEvents){  
				//headerContent = 'Draft Events';
				eventFilterCriteriaEnum ='YEAR';
				URI = $("#getEventsURI").val();
				request = { 
						userId:userId,
						accessToken:accessToken,
						pageCriteriaModel: {
					pageSize:maxResult,
					pageNo:startResult,
					isAll: true
				},
						viewTypeEnum:"MYEVENTS_LISTVIEW",
						eventFilterCriteriaEnum:eventFilterCriteriaEnum,
						eventSearchCriteria:[
											 {
												 eventSearchCriteria:"OFFSET",
												 eventSearchCriteriaValue:getOffset()
											 },
											 {
												 eventSearchCriteria:"MYEVENTS",
												 eventSearchCriteriaValue:"MYEVENTS"
											 },
											 {
												 eventSearchCriteria:"STATUS",
												 eventSearchCriteriaValue:"DRAFT"
											 },
											 {
												 eventSearchCriteria:"CURRENTDATE",
												 eventSearchCriteriaValue:today
											 }
											 /*,
									   {
												eventSearchCriteria:"EVENTTYPE",
												eventSearchCriteriaValue:"PERSONAL_MEETING"
										   }*/]
				};
			}else if(flag.isMyEvents){ 
				
				headerContent = 'Pending Invitations';
				URI = "/event/1.0/getMyEventInvitations";
				var offset = getOffset();
				
				request = { 
						userId:userId,
						accessToken:accessToken,
						pageCriteriaModel: {
							pageSize:maxResult,
							pageNo:startResult,
							isAll: true
				},
						eventInvitationFilterCriteriaEnum:"NEW",
						eventFilterCriteriaEnum:myCalendarEventsTwoByTwo.settings.eventFilterSetting,
						eventTypeEnum:"ALL",
						associationType:flag.AssociationType,
						eventSearchCriteria:[
											 {
												 eventSearchCriteria:"OFFSET",
												 eventSearchCriteriaValue:offset
											 },
											 {
												 eventSearchCriteria:"CURRENTDATE",
												 eventSearchCriteriaValue:today
											 }

											 ]
				};

			}
			var associationType = flag.AssociationType;
			if( associationType == 'GROUP' ){
				request.eventSearchCriteria.push({
					"eventSearchCriteria": "GROUPID",
					"eventSearchCriteriaValue": flag.AssociationId
				});
				request['viewTypeEnum'] = 'GROUPEVENTS_LISTVIEW' ;
			}else if( associationType == 'COURSE' ){
				request.eventSearchCriteria.push({
					"eventSearchCriteria": "COURSEID",
					"eventSearchCriteriaValue": flag.AssociationId
				});
				request['viewTypeEnum'] = 'COURSEEVENTS_LISTVIEW';
			}
			
			request= JSON.stringify(request);
			var options = {
					async:true,
					url:getModelObject('serviceUrl')+URI,
					data:request,
					requestInfo:{header:headerContent},
					successCallBack:myCalendarEventsTwoByTwo.successCallBack,
					failureCallBack:myCalendarEventsTwoByTwo.failureCallBack
			};
			return options;
	},
	
	successCallBack:function(requestInfo,data){
		
			
		/*	var eventsList;
			eventsList = [];*/

			data.header = requestInfo.header;
			data.header = dateUtility.formatDate(myCalendarEventsTwoByTwo.settings.currentDate,'MMMM yyyy');
			data.selectedYearMonth = dateUtility.formatDate(myCalendarEventsTwoByTwo.settings.currentDate,'MMM dd,yyyy');
			
			//data.selectedDate = dateUtility.formatDate(currentDate,'MMM dd,yyyy');
			//Pending Invitations
			if(myCalendarEventsTwoByTwo.settings.isMyEvents){
				if(data.eventInvitationModels != undefined && data.eventInvitationModels.length == undefined){
					data.eventInvitationModels = [data.eventInvitationModels];
				}
				if(data.eventInvitationModels != undefined && data.eventInvitationModels.length != undefined ){
					data.count= data.eventsCount==0?0:data.eventsCount;
					for(var i=0;i<data.eventInvitationModels.length;i++){
						data.eventInvitationModels[i].startTime =   data.eventInvitationModels[i].eventScheduleFrom;
						data.eventInvitationModels[i].endTime =   data.eventInvitationModels[i].eventScheduleTo;

					}
					data.events =   data.eventInvitationModels;
				}
			}

			if(requestInfo.selectedYearMonth){
				data.selectedYearMonth = requestInfo.selectedYearMonth;
			}
			if(data.events != undefined && data.events.length == undefined){
				data.events = [data.events];
			}
			if(data.events != undefined && data.events.length != undefined ){
				var events = data['events'];

				var uniqueColorCodes;
				uniqueColorCodes = [];
				var colorCodeScores;
				colorCodeScores = [];
				//logic to find the color importance
				if(events){
					for(var i=0;i<events.length;i++){
						if($.inArray($.trim(events[i].eventCategoryModel.categoryColorCode),colorCodeScores) < 0){
							uniqueColorCodes.push({colorCode:events[i].eventCategoryModel.categoryColorCode,score:0,startTime:events[i].startTime});
							colorCodeScores.push(events[i].eventCategoryModel.categoryColorCode);
						}
					}
				}

				var isFirstEventOnCurrentDate = true;
				var isDashboard = $('.gridster').is(':visible');
				for(var i=0;i<data.events.length;i++){

					/*					
					 * Naveen commentted this. as it is not used anywhere in the code.
					 * 
					 * 	
					var event = {
							id : data.events[i].eventUniqueIdentifier,
							title : data.events[i].eventName,
							start : convertUTCDateTimeTo.ConvertUTCDateToLocalDate(data.events[i].startTime),
							end : convertUTCDateTimeTo.ConvertUTCDateToLocalDate(data.events[i].endTime),
							url : 'events/'+data.events[i].eventUniqueIdentifier,
							editable : false,
							allDay : data.events[i].allDay,
					};

					eventsList.push(event);*/

					var monthname = '';
					var dayOfEvent = '';
					var yearOfEvent = '';
					var startTime = '';
					var endTime = '';
					var startDate = convertUTCDateTimeTo.getUTCDateFromDateString(data.events[i].startTime);
					var endDate = convertUTCDateTimeTo.getUTCDateFromDateString(data.events[i].endTime);
					
					endDate = isAllDayDateFormatting(data.events[i].allDay,startDate,endDate);

					data.count= data.eventsCount==0?0:data.eventsCount;
					data.events[i].modifiedEventName = stringLimitDots(data.events[i].eventName,18);
					if(data.events[i].startTime != '' && data.events[i].startTime != null){
						monthname = $.datepicker.formatDate('M', startDate);  
						dayOfEvent = $.datepicker.formatDate('d', startDate);
						yearOfEvent = $.datepicker.formatDate('yy', startDate);
						startTime = getTimeFormatNew(startDate,'caps');
					}
					if(data.events[i].endTime != '' && data.events[i].endTime != null){
						endMonthName = $.datepicker.formatDate('M', endDate);  
						endDayOfEvent =  $.datepicker.formatDate('d', endDate);
						endYearOfEvent = $.datepicker.formatDate('yy', endDate);
						endTime = getTimeFormatNew(endDate,'caps');
					}
					//TODO::need to highlight right panel event.
					var currentDateInaMonth = $('#twoByTwoCalanderThumbNail').jqxCalendar('getDate'); 
					if(isFirstEventOnCurrentDate  && ((currentDateInaMonth.getDate() == startDate.getDate()) && (currentDateInaMonth.getMonth() == startDate.getMonth()) && (currentDateInaMonth.getFullYear() == startDate.getFullYear()))){
						data.events[i].isHighlighted = true;
						isFirstEventOnCurrentDate = false;
					}else{
						data.events[i].isHighlighted = false;
					}
					data.events[i].count = i;
					if(data.events[i].eventCategoryModel.isCustomCategory == 'true' || data.events[i].eventCategoryModel.isCustomCategory == true ){
						data.events[i].isCustomCategory = true;
						//data.events[i].eventCategoryModel.categoryId = data.eventInvitationModels[i].eventCategoryModel.categoryId;
					}else{
						data.events[i].isCustomCategory = false;
						//data.events[i].eventCategoryModel.categoryType = data.events[i].eventCategoryModel.categoryType;
						//data.events[i].eventCategoryModel.categoryId = data.events[i].eventCategoryModel.categoryId;
					}

					if(data.events[i].isCustomCategory == 'true' || data.events[i].isCustomCategory == true 
							&& data.events[i].eventCategoryModel.categoryType == 'GROUP' && isDashboard ){
						data.events[i].isCustomCategory = false;
					}

					/*					if(data.events[i].isCustomCategory == 'true' || data.events[i].isCustomCategory == true ){
							data.events[i].isCustomCategory = true;
						}else{
							data.events[i].isCustomCategory = false;
						}*/

					//Normal Format
					//data.events[i].displayEventDate = monthname+' '+dayOfEvent+' '+yearOfEvent +' from '+ startTime +' - '+endMonthName+' '+endDayOfEvent+' '+endYearOfEvent+' to '+endTime;
					data.events[i].displayEventDate = monthname+' '+dayOfEvent+' ,'+yearOfEvent+' - '+endMonthName+' '+endDayOfEvent+' ,'+endYearOfEvent+' | '+ startTime+' - '+endTime;
					if(data.events[i].rsvpEnum == 'AWAITING'){
						data.events[i].isResponded = false;
					}else{
						data.events[i].isResponded = true;
					}
					if($.inArray($.trim(data.events[i].eventUniqueIdentifier),myCalendarEventsTwoByTwo.eventUniqueIdentifiers) < 0){
						myCalendarEventsTwoByTwo.eventUniqueIdentifiers.push(data.events[i].eventUniqueIdentifier);
					}
					var dateX = convertUTCDateTimeTo.LocalBrowserDateTime(data.events[i].startTime);
					var dateY = convertUTCDateTimeTo.LocalBrowserDateTime(data.events[i].endTime);
					
					dateY = isAllDayDateFormatting(data.events[i].allDay,dateX,dateY);
					
					dateX = new Date(dateX.getFullYear(), dateX.getMonth(), dateX.getDate());
					dateY = new Date(dateY.getFullYear(), dateY.getMonth(), dateY.getDate());
					
					var dayCount = Math.ceil((dateY.getTime() - dateX.getTime()) / 86400000 );
										
	 				var dayZ = 0 ;
										
					for(var loopTime=dateX.getTime(); dayZ<= dayCount; loopTime+=86400000 ){
						var loopDay = new Date(loopTime);
						dateX = new Date(loopDay.getFullYear(), loopDay.getMonth(), loopDay.getDate());
						
						if((i == (events.length -1)) && (dayZ == dayCount))
							$("#twoByTwoCalanderThumbNail").jqxCalendar('addSpecialDate', dateX,'','', true);
						else
							$("#twoByTwoCalanderThumbNail").jqxCalendar('addSpecialDate', dateX, '','', false);

						dayZ++;
					}
				}

				events = myCalendarThumbnail.sortByKey(events,'startTime');

				var dayEvents = {};
				var dayColorMap = {};

				for(var i=0;i<events.length;i++){
					var dayStart = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].startTime);
					var dayEnd = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].endTime);
					
					dayEnd = isAllDayDateFormatting(events[i].allDay,dayStart,dayEnd);

					dayStart = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate());
	 				dayEnd = new Date(dayEnd.getFullYear(), dayEnd.getMonth(), dayEnd.getDate());
	 								
					var dayCount = Math.ceil((dayEnd.getTime() - dayStart.getTime()) / 86400000 );
										
	 				var dayZ = 0 ;
												
					for(var loopTime=dayStart.getTime(); dayZ<= dayCount; loopTime+=86400000 )
					{
						var day = new Date(loopTime).getDate();
						if(dayEvents[day] == null)
						{
							var dayEventsList;
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


				for(var key in dayEvents)
				{

					var eventsListInDay = dayEvents[key];
					var colorScore = 0;
					var colorMap = {};

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
					dayColorMap[key+'_colorMap'] = colorMap;
				}

				var specialDates = $('#twoByTwoCalanderThumbNail'+' .jqx-calendar-cell-specialDate');
				for(var i=0;i<specialDates.length;i++){
					var day = $(specialDates[i]).html();
					var colors = dayColorMap[day+'_colorMap'];
					var colorsList;
					colorsList = [];
					var html='<div class="dotswrapper"><span id="dotsContainer" class="dotsContainerMini">';
					if(colors){
						for (var key in colors) {
							colorsList.push({'score':colors[key],'color':key});
						}
						colorsList = myCalendarThumbnail.sortByKey(colorsList,'score');
						if(colorsList.length > 3){
							for(var i1 = colorsList.length-1;i1>=colorsList.length-3;i1--){
								html+='<i class="sm-circle-blue width-height-4 table-cell" style="background-color:'+colorsList[i1]['color']+'"></i>';
							}
						}else{
							for(var i1 = colorsList.length-1;i1>=0;i1--){
								html+='<i class="sm-circle-blue width-height-4 table-cell" style="background-color:'+colorsList[i1]['color']+'"></i>';
							}
						}

						//$("#dotsContainer").html(colorHtml);
					}
					//html+='<i class="sm-circle-blue width-height-4 table-cell" style="background-color:blue"></i>';
					html+='</span></div>';
					$(specialDates[i]).addClass('');
					$(specialDates[i]).html(day+html);
				}
			}else{
				$("#twoByTwoCalanderThumbNail").jqxCalendar('specialDates', []);
				$("#noEvents").removeClass('hide');
				data.noEventsMessage = 'No events on this date.';
			}
			
			myCalendarEventsTwoByTwo.settings.calendarEvents = jQuery.extend( {}, data);
			myCalendarEventsTwoByTwo.dynamicUI("#eventsContainerDiv",data);
			/*myCalendarEventsTwoByTwo.loadCategoriesFilter();
				myCalendarEventsTwoByTwo.loadMiniCalendar();
				myCalendarEventsTwoByTwo.bindEvents();*/
	},

	failureCallBack:function(data){
	
			$("#noEvents").removeClass('hide');
	},
	
	dynamicUI:function(ele,data){

			var events = data.events ;
			var filteredEvents;
			filteredEvents = [] ; 
			
			var dayDuration = 86400000 ;
			
		//	console.log(" rending in mode : " +  myCalendarEventsTwoByTwo.settings.currentMode);
			
			if ( myCalendarEventsTwoByTwo.settings.currentMode == "WEEK" ){
				var selectedDate = convertUTCDateTimeTo.LocalBrowserDateTime(myCalendarEventsTwoByTwo.settings.currentDate);
				var selectedDay = selectedDate.getDay();
				
				var dayDiff = (selectedDay) * dayDuration ; // time into the week			
			
				var sunday = selectedDate.getTime() - dayDiff ;
				var saturday = (sunday + (7 * dayDuration)) - 1 ; // go to end of saturday and not midnight sun
				
				var sundayDate = new Date(sunday);
				var saturdayDate = new Date(saturday);
				
				/*
				sundayDate = new Date(sundayDate.getFullYear(), sundayDate.getMonth(), sundayDate.getDate());
				saturdayDate = new Date(saturdayDate.getFullYear(), saturdayDate.getMonth(), saturdayDate.getDate());
		
				$("#twoByTwoCalanderThumbNail").jqxCalendar('setRange', sundayDate, saturdayDate);
				*/
					
				if ( data.events != null && data.events.length > 0 ){
				
					for(var i=0;i<events.length;i++){
						var dayStart = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].startTime);
						var dayEnd = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].endTime);
					
						dayEnd = isAllDayDateFormatting(events[i].allDay,dayStart,dayEnd);

						dayStart = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate());
						dayEnd = new Date(dayEnd.getFullYear(), dayEnd.getMonth(), dayEnd.getDate());
														
						if ( dayStart.getTime() >= sunday && dayStart.getTime() <= saturday || // start day is in the week
							dayEnd.getTime() >= sunday && dayEnd.getTime() <= saturday  ||  // end day is in the week
						
							 dayStart.getTime() < sunday && dayEnd.getTime() > saturday)  // event spans longer than the week	
							{		
								filteredEvents.push( events[i]) ;			
							}
					}
				}
				data.events = filteredEvents ;
			}	
			
			else if ( myCalendarEventsTwoByTwo.settings.currentMode == "DAY" ){
				var selectedDate = convertUTCDateTimeTo.LocalBrowserDateTime(myCalendarEventsTwoByTwo.settings.currentDate);
			
				if ( data.events != null && data.events.length > 0 ){
				for(var i=0;i<events.length;i++){
				
					var dayStart = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].startTime);
					var dayEnd = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].endTime);
					
					dayEnd = isAllDayDateFormatting(events[i].allDay,dayStart,dayEnd);

					dayStart = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate());
	 				dayEnd = new Date(dayEnd.getFullYear(), dayEnd.getMonth(), dayEnd.getDate());
	 									
					if ( dayStart.getDate() <= selectedDate.getDate() && dayEnd.getDate() >= selectedDate.getDate())		
					{	
						filteredEvents.push( events[i]) ;			
					}
				}
				}
				
				data.events = filteredEvents ;
			}				
					
			//addee div hide show.
			if(data.count != undefined){ 
				$("#noEventsContainerDiv").addClass('hide');
				$("#eventsContainerDiv").removeClass('hide');
			}else{
				$("#eventsContainerDiv").addClass('hide');
				$("#noEventsContainerDiv").removeClass('hide');
			}

			if ( myCalendarEventsTwoByTwo.settings.currentMode == "WEEK" || myCalendarEventsTwoByTwo.settings.currentMode == "DAY"){
				var isFirstEventOnCurrentDate = true;
				for(var i=0;i<data.events.length;i++){
					var currentDateInaMonth = $('#twoByTwoCalanderThumbNail').jqxCalendar('getDate'); 
					var startDatee = convertUTCDateTimeTo.getUTCDateFromDateString(data.events[i].startTime);
					if(isFirstEventOnCurrentDate  && ((currentDateInaMonth.getDate() == startDatee.getDate()) && (currentDateInaMonth.getMonth() == startDatee.getMonth()) && (currentDateInaMonth.getFullYear() == startDatee.getFullYear()))){
						data.events[i].isHighlighted = true;
						isFirstEventOnCurrentDate = false;
					}else{
						data.events[i].isHighlighted = false;
					}
				}
			}
			
			var htmlTemplate = '';
			var recentEventsHtml = '';
			if(data.events != undefined && data.events.length != undefined ){
				htmlTemplate +='{{#events}}'
						+'<div id="eventListViewDivid_{{eventUniqueIdentifier}}" title="{{eventName}}" class="event-block eventNameClass {{#isHighlighted}}highlight-lightblue-bg{{/isHighlighted}} " eventName="{{eventName}}" category="{{#isCustomCategory}}{{eventCategoryModel.categoryId}}{{/isCustomCategory}}{{^isCustomCategory}}{{eventCategoryModel.categoryType}}{{/isCustomCategory}}">'
						+'	<div class="sm-circle-blue smcircleblueEventListView_{{eventUniqueIdentifier}}" style="background-color:{{#isResponded}}{{eventCategoryModel.categoryColorCode}}{{/isResponded}}{{^isResponded}}{{eventCategoryModel.categoryBlurCode}}{{/isResponded}}"></div>'
						+'  <span class="event-name"><a class="event-name" id="eventDetails_{{eventUniqueIdentifier}}" widgetType="'+myCalendarEventsTwoByTwo.settings.widgetType+'" eventType="'+myCalendarEventsTwoByTwo.settings.eventType+'" isPendingInvitation="'+myCalendarEventsTwoByTwo.settings.isMyEvents+'" eventUniqueIdentifier="{{eventUniqueIdentifier}}" href="javascript:void(0)">{{modifiedEventName}}</a></span>'
						+'	<div class="event-date event-date-padding">{{displayEventDate}}</div>'
						+'</div>'
						+'{{/events}}';
				/*if(data.count > 0){
						 htmlTemplate +="<div class='font-12 position-relative bot-8 left-7 height-20'>Total <a href='javascript:void(0);' id='myEventsTotalCountID'>(" +data.count+")</a></div>";
					}*/

				recentEventsHtml = Mustache.to_html(htmlTemplate,data);
			}else{
				recentEventsHtml+='<div class="default-message-style">No events on this date.</div>';
			}
			$(ele).html(recentEventsHtml);
			
			data.header = dateUtility.formatDate(myCalendarEventsTwoByTwo.settings.currentDate,'MMMM yyyy');
			data.selectedYearMonth = dateUtility.formatDate(myCalendarEventsTwoByTwo.settings.currentDate,'MMM dd,yyyy');
		
			if(data.selectedYearMonth){
				if ( myCalendarEventsTwoByTwo.settings.currentMode == "DAY" )
					$("#eventsContainerHeaderDiv").html('Events on '+data.selectedYearMonth);
				else if ( myCalendarEventsTwoByTwo.settings.currentMode == "WEEK" ){
						sundayDate = dateUtility.formatDate(sundayDate,'MMM dd,yyyy');
						saturdayDate = dateUtility.formatDate(saturdayDate,'MMM dd,yyyy');
						data.selectedYearMonth = sundayDate + ' - ' + saturdayDate ;
						$("#eventsContainerHeaderDiv").html('Events from '+ sundayDate + ' to ' + saturdayDate);
				}					
				else if ( myCalendarEventsTwoByTwo.settings.currentMode == "MONTH"){
					data.selectedYearMonth = dateUtility.formatDate(myCalendarEventsTwoByTwo.settings.currentDate,'MMMM yyyy');
					$("#eventsContainerHeaderDiv").html('Events for '+data.selectedYearMonth);	
				}
				else { // year
					data.selectedYearMonth = dateUtility.formatDate(myCalendarEventsTwoByTwo.settings.currentDate,'yyyy');
					$("#eventsContainerHeaderDiv").html('Events for '+ data.selectedYearMonth);	
				}
			}
			if(data.header){
				$("#headerSpanContainer").html(data.selectedYearMonth);
			}
			
			if(data.events == 0){ 
				$("#eventsContainerDiv").addClass('hide');
				$("#noEventsContainerDiv").removeClass('hide');
			}else{
				$("#noEventsContainerDiv").addClass('hide');
				$("#eventsContainerDiv").removeClass('hide');
		}
	
		myCalendarEventsTwoByTwo.bindEvents();

		$('#eventListScrollDiv').mCustomScrollbar('scrollTo',$('#eventListScrollDiv').find('.mCSB_container').find('.highlight-lightblue-bg'));
	},
	loadCategoriesFilter:function(){
		
			var categoryFilterOptions={
					ele:"#categoryFilterContainer",
					associationType:loadType.AssociationType,
					mode:'Filter',
					isEditable:loadType.isEditable,
					onClick:function(data){
				myCalendarEventsTwoByTwo.filterCategories(data,'eventNameClass','category');
			}
			};

			EventCategories.init(categoryFilterOptions);

	},
	loadMiniCalendar:function(){
		
			$("#twoByTwoCalanderThumbNail").jqxCalendar({ 
				value: $.jqx._jqxDateTimeInput.getDateTime(myCalendarEventsTwoByTwo.settings.currentDate),
				enableViews:false, 
				navigationDelay:0,
				showOtherMonthDays: false,
				width: 180,
				height: 160, 
				firstDayOfWeek:0 
				});
			
				
			$('#twoByTwoCalanderThumbNail').off('click').bind('nextButtonClick', function (event) {
				myCalendarEventsTwoByTwo.calanderRelatedEvents(event, 'MONTH', 'next');
				
				//myCalendarEventsTwoByTwo.calanderRelatedEvents(event,eventFilterSetting);
				
			//	$('[id^=events_]').removeClass('active');
			//	$('#events_Month').addClass('active');
			//	myCalendarEventsTwoByTwo.settings.currentMode = 'MONTH';
			});

			$('#twoByTwoCalanderThumbNail').off('click').bind('backButtonClick', function (event) {
			//	myCalendarEventsTwoByTwo.settings.currentMode = 'MONTH';
				myCalendarEventsTwoByTwo.calanderRelatedEvents(event,'MONTH', 'back');
			//	$('[id^=events_]').removeClass('active');
			//	$('#events_Month').addClass('active');
			});
			$('#twoByTwoCalanderThumbNail').off('click').bind('change', function (event) {	
				if(myCalendarEventsTwoByTwo.settings.currentMode == 'YEAR'){
					myCalendarEventsTwoByTwo.calanderRelatedEvents(event,'UPCOMING', 'none');
				}else{
					myCalendarEventsTwoByTwo.calanderRelatedEvents(event,'MONTH' , 'none');
				}
			});
	},
	prepareServiceReqForYearOrMonth : function(data){
		if ( myCalendarEventsTwoByTwo.settings.currentMode == "MONTH" || myCalendarEventsTwoByTwo.settings.currentMode == "YEAR" ){
				var eventFilterCriteriaEnum = '';
				var date = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear(),myCalendarEventsTwoByTwo.settings.currentDate.getMonth(),myCalendarEventsTwoByTwo.settings.currentDate.getDate());
				var eventSearchCriteria = data.eventSearchCriteria;
				var newFromDate = '';
				
				if(myCalendarEventsTwoByTwo.settings.currentMode == "YEAR"){
					eventFilterCriteriaEnum = 'YEAR';
					newFromDate = new Date(date.getFullYear(), 0, 1);
					newFromDate = convertUTCDateTimeTo.formatDate_yyyymmdd(newFromDate);
				}
				else if ( myCalendarEventsTwoByTwo.settings.currentMode == "MONTH" ){
					eventFilterCriteriaEnum = 'MONTH';
					newFromDate = new Date(date.getFullYear(), date.getMonth(), 1);
					newFromDate = convertUTCDateTimeTo.formatDate_yyyymmdd(newFromDate);	
				}
				data.eventFilterCriteriaEnum = eventFilterCriteriaEnum;
					for(var i=0;i<eventSearchCriteria.length;i++){
						for (key in eventSearchCriteria[i]){
							if(eventSearchCriteria[i][key] == 'CURRENTDATE'){
								eventSearchCriteria[i]['eventSearchCriteriaValue'] = newFromDate;
								break;
							}
						}
				     }	
				
		}
		return data;
	},

	calanderRelatedEvents:function(event,mode, direction){
	
		var date = event.args.date;
		var view = event.args.view;
		
		
		// if (event.type == 'change') {
		myCalendarEventsTwoByTwo.settings.currentDate = date;
		var today = date;//new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),now.getUTCHours(),now.getUTCMinutes(),now.getUTCSeconds()).getTime();
		today = convertUTCDateTimeTo.formatDate_yyyymmdd(today);
		var req = myCalendarEventsTwoByTwo.prepareServiceRequest(loadType);
		var data = $.parseJSON(req.data);
		var eventSearchCriteria = data.eventSearchCriteria;
		for(var i=0;i<eventSearchCriteria.length;i++){
			for (key in eventSearchCriteria[i]){
				if(eventSearchCriteria[i][key] == 'CURRENTDATE'){
					eventSearchCriteria[i]['eventSearchCriteriaValue'] = today;
					break;
				}
			}
		}

		data.eventSearchCriteria = eventSearchCriteria;
		
		data.eventFilterCriteriaEnum = mode;
		
		if ( myCalendarEventsTwoByTwo.settings.currentMode == "MONTH" || myCalendarEventsTwoByTwo.settings.currentMode == "YEAR" || direction != 'none' ){
				var requestInfo = req.requestInfo;
				requestInfo['selectedYearMonth'] = dateUtility.formatDate(date,'MMM dd,yyyy');
				req.requestInfo = requestInfo;
				data = myCalendarEventsTwoByTwo.prepareServiceReqForYearOrMonth(data);
				data = JSON.stringify(data);
				req.data = data;
				myCalendarEventsTwoByTwo.serviceInvocation(req);
				$("#checkboxBlog").trigger("click");
		}
		else{ // only filter data if month or year is not changed
			
			var data = jQuery.extend( {}, myCalendarEventsTwoByTwo.settings.calendarEvents);
			myCalendarEventsTwoByTwo.dynamicUI("#eventsContainerDiv",data);
		}
	},
	
	filterCategories:function(categories,className,attributeName){
	
		var eles = $('.'+className);
		var count = 0;
		for(var i=0;i<eles.length;i++){
			if(categories && categories.length != 0){
				var eventCategory = $(eles[i]).attr(attributeName);
				if(categories.indexOf(eventCategory) > -1){
					$(eles[i]).removeClass('hide');
					count = count+1;
				}else{
					$(eles[i]).addClass('hide');
				}
			}else{
				count = count+1;
				$(eles[i]).removeClass('hide');
			}
		}

		/* if(count == 0){ 
		    	 $("#noEventsContainerDiv").removeClass('hide');
		     }else{
		    	 $("#noEventsContainerDiv").addClass('hide');
		     }*/
		if(count == 0){ 
			$("#eventsContainerDiv").addClass('hide');
			$("#noEventsContainerDiv").removeClass('hide');
		}else{
			$("#noEventsContainerDiv").addClass('hide');
			$("#eventsContainerDiv").removeClass('hide');
		}
	},
	
	searchFunction:function(className,attributeName,ele){
	
		var eles = $('.'+className);
		var value = $(ele).val().toLowerCase();
		var count = 0;
		for(var i=0;i<eles.length;i++){
			var eventName = $(eles[i]).attr(attributeName);
			if(eventName.toLowerCase().indexOf(value) > -1){
				$(eles[i]).removeClass('hide');
				count = count+1;
			}else{
				$(eles[i]).addClass('hide');
			}
		}
		if(count == 0){ 
			$("#eventsContainerDiv").addClass('hide');
			$("#noEventsContainerDiv").removeClass('hide');
		}else{
			$("#noEventsContainerDiv").addClass('hide');
			$("#eventsContainerDiv").removeClass('hide');
		}

		$('#eventsContainerHeaderDiv').removeClass('hide');
	},

	/**
	 *  bind operations performed on UI
	 */
	bindEvents:function(){

		/*var eventRows= $('#eventsContainerDiv .eventNameClass');
		eventRows.hover(function() {
				eventRows.css('background','white');
				$( this ).css('background','#55c5e9');
			});*/


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
				$('.clickedType').attr('liid',liid);
				//This line will return if the current widget is already in (2X2) view
				if( $('#'+idd).attr('data-sizex')==2 && $('#'+idd).attr('data-sizey')==2){
					$("#removeHideCalendarOptionsID").addClass('hide');
					return;
				} 
				shiftingWidgetTwobyTwo(awgd,aw,liid,ele,idd,false);
				$('.clickedType').attr('liid',liid);
				dashboardShifting.toMyCalendar2x2View();


			}else if(liid == "Calendar1x1"){

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
		
		$("body").on('input','#eventSearchBox',function(e){
		
			myCalendarEventsTwoByTwo.searchFunction('eventNameClass','eventName',this);
		});

		$("#showOptions2X2Calendar").off('click').bind('click',function(e){
	
			$("#removeHideCalendar2X2OptionsID").toggleClass('hide');
		});

		$("#myCalendar2X2view").off('click').bind('click',function(e){
		
			var calendarOptions = {
					element : myCalendarEventsTwoByTwo.settings.ele,
					isPersonalCategories : true,
					isCourseCategories : false,
					fcAssociationId:loadType.AssociationId,
					userName:userName,
					isEditable:loadType.isEditable,
					type:loadType.type, //Personal/Group/Course
					fcAssociationType:loadType.AssociationType,
					fcAssociationUniqueIdentifier: loadType.AssociationUniqueIdentifier,
					fcAssociationPhotoId:loadType.AssociationPhotoId,
					isAutoscrollenable:true//Naveen::
			};
			FullCalendarWidget.init(calendarOptions);  
			$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");

			if(myCalendarEventsTwoByTwo.settings.isEditable && (myCalendarEventsTwoByTwo.settings.AssociationType == 'GROUP' || myCalendarEventsTwoByTwo.settings.AssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}
		});
		
		$("#upComingEvents2X2view").off('click').bind('click',function(e){
			var date = new Date();
			var currentMonthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
			var options = {
					ele : myCalendarEventsTwoByTwo.settings.ele,
					eventType:"MONTH",
					isUpcomingEvents:true,
					type:loadType.type, //Personal/Group/Course
					AssociationType:loadType.AssociationType,
					AssociationId:loadType.AssociationId,
					AssociationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
					AssociationPhotoId:loadType.AssociationPhotoId,
					isEditable:loadType.isEditable,
					currentDate:currentMonthFirstDay
			};
			myCalendarEventsTwoByTwo.init(options); 
			$("#calenderbodycontentid").addClass("calendar-padding");
			/*					if($("#calendarTwoBytwoContainer").is(':visible'))
						$("#calendarTwoBytwoContainer").mCustomScrollbar('destroy');*/
			$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");

			if(myCalendarEventsTwoByTwo.settings.isEditable && (myCalendarEventsTwoByTwo.settings.AssociationType == 'GROUP' || myCalendarEventsTwoByTwo.settings.AssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}
		});
		
		$("#draftEvents2X2view").off('click').bind('click',function(e){
		
			$("#calendar2x2LeftPannel").addClass('hide');
			
			var options = {
					ele :	myCalendarEventsTwoByTwo.settings.ele,
					eventType:"DRAFTEVENTS",
					isDraftEvents:true,
					type:loadType.type, //Personal/Group/Course
					AssociationType:loadType.AssociationType,
					AssociationId:loadType.AssociationId,
					AssociationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
					AssociationPhotoId:loadType.AssociationPhotoId,
					isEditable:loadType.isEditable,
					currentDate:myCalendarEventsTwoByTwo.settings.currentDate
			};
			myCalendarEventsTwoByTwo.init(options);
			$("#calenderbodycontentid").addClass("calendar-padding");
			/*						if($("#calendarTwoBytwoContainer").is(':visible'))
							$("#calendarTwoBytwoContainer").mCustomScrollbar('destroy');*/
			$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");

			if(myCalendarEventsTwoByTwo.settings.isEditable && (myCalendarEventsTwoByTwo.settings.AssociationType == 'GROUP' || myCalendarEventsTwoByTwo.settings.AssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}
		});
		
		$("#myEvent2X2view").off('click').bind('click',function(e){
			
			if($("#calendar_event_count:visible").length > 0){
				// added code to update calendar events notification count
				$('#calendar_event_count').addClass('hide');
				updateNotificationCount(2);
			}
			
			
			var options = {
					ele :	myCalendarEventsTwoByTwo.settings.ele,
					eventType:"MYEVENTS",
					isMyEvents:true,
					type:loadType.type, //Personal/Group/Course
					AssociationType:loadType.AssociationType,
					AssociationId:loadType.AssociationId,
					AssociationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
					isEditable:loadType.isEditable,
					AssociationPhotoId:loadType.AssociationPhotoId,
					currentDate:myCalendarEventsTwoByTwo.settings.currentDate
			};
			myCalendarEventsTwoByTwo.init(options); 

			$("#calenderbodycontentid").addClass("calendar-padding");
			/*						if($("#calendarTwoBytwoContainer").is(':visible'))
							$("#calendarTwoBytwoContainer").mCustomScrollbar('destroy');*/

			if(myCalendarEventsTwoByTwo.settings.isEditable && (myCalendarEventsTwoByTwo.settings.AssociationType == 'GROUP' || myCalendarEventsTwoByTwo.settings.AssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}
		});

		$("[id^=events_]").off("click").bind("click",function(e){
			$("#eventSearchBox").val('');
			$("[id^=events_]").removeClass('active');
		//	$('#eventsContainerHeaderDiv').addClass('hide');
			$(this).addClass('active');
			var period = $(this).attr('period');
			myCalendarEventsTwoByTwo.settings.currentMode = period;
			var eventFilterCriteriaEnum;
		
			if(period == 'MONTH'){
				eventFilterCriteriaEnum = 'MONTH';
			}else if(period == 'WEEK'){
				eventFilterCriteriaEnum = 'MONTH';
			}else if(period == 'DAY'){
				eventFilterCriteriaEnum = 'MONTH';
			}else{
				eventFilterCriteriaEnum = 'YEAR';
		//		$('#eventsContainerHeaderDiv').removeClass('hide');
			}
			
			myCalendarEventsTwoByTwo.settings.eventFilterSetting = eventFilterCriteriaEnum ;
	
	//	console.log( " period is : " + period + " , " + eventFilterCriteriaEnum );
		if ( myCalendarEventsTwoByTwo.settings.currentMode == "MONTH" || myCalendarEventsTwoByTwo.settings.currentMode == "YEAR" ){
			var req = myCalendarEventsTwoByTwo.prepareServiceRequest(loadType);
				var data = $.parseJSON(req.data);
				data.eventFilterCriteriaEnum = eventFilterCriteriaEnum;
				var date = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear(),myCalendarEventsTwoByTwo.settings.currentDate.getMonth(),myCalendarEventsTwoByTwo.settings.currentDate.getDate());
				var eventSearchCriteria = data.eventSearchCriteria;
				var newFromDate ;
				
				if(myCalendarEventsTwoByTwo.settings.currentMode == "YEAR"){
					newFromDate = new Date(date.getFullYear(), 0, 1);
					newFromDate = convertUTCDateTimeTo.formatDate_yyyymmdd(newFromDate);
				}
				else if ( myCalendarEventsTwoByTwo.settings.currentMode == "MONTH" ){
					newFromDate = new Date(date.getFullYear(), date.getMonth(), 1);
					newFromDate = convertUTCDateTimeTo.formatDate_yyyymmdd(newFromDate);	
				}
				
					for(var i=0;i<eventSearchCriteria.length;i++){
						for (key in eventSearchCriteria[i]){
							if(eventSearchCriteria[i][key] == 'CURRENTDATE'){
					//			alert(" setting new date to " + newFromDate + " myCalendarEventsTwoByTwo.settings.currentDate  " + myCalendarEventsTwoByTwo.settings.currentDate );
		
								eventSearchCriteria[i]['eventSearchCriteriaValue'] = newFromDate;
								break;
							}
						}
				     }	
						
				
				data = JSON.stringify(data);
				req.data = data;
				myCalendarEventsTwoByTwo.serviceInvocation(req);
			} 
		else{ // don't reload data for week and day views only filter
			var data = jQuery.extend( {}, myCalendarEventsTwoByTwo.settings.calendarEvents);
			myCalendarEventsTwoByTwo.dynamicUI("#eventsContainerDiv",data);
		}
		
		});

		$('#nextMonthTwoByTwo').off('click').bind('click',function(){
			
			var widgetType = myCalendarEventsTwoByTwo.settings.widgetType;
			var eventType = myCalendarEventsTwoByTwo.settings.eventFilterSetting;//$(this).attr("eventType");

			var current = '';
			
			if ( myCalendarEventsTwoByTwo.settings.currentMode == "MONTH"){
					if (myCalendarEventsTwoByTwo.settings.currentDate.getMonth() == 11) {
						current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear() + 1, 0, 1);
					} 
					else {
						current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear(), myCalendarEventsTwoByTwo.settings.currentDate.getMonth() + 1, 1);
					}	
			}
			else if ( myCalendarEventsTwoByTwo.settings.currentMode == "WEEK"){
				current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear(), myCalendarEventsTwoByTwo.settings.currentDate.getMonth(), myCalendarEventsTwoByTwo.settings.currentDate.getDate() + 7);
			}
			else if ( myCalendarEventsTwoByTwo.settings.currentMode == "DAY"){
				current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear(), myCalendarEventsTwoByTwo.settings.currentDate.getMonth(), myCalendarEventsTwoByTwo.settings.currentDate.getDate() + 1);
			}
			else { // YEAR 		
				current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear() + 1, 0, 1);
			}
		
			//$("#twoByTwoCalanderThumbNail").jqxCalendar('setDate', current);
		
		
			myCalendarEventsTwoByTwo.settings.currentDate = current;
			var options = {
					ele :	myCalendarEventsTwoByTwo.settings.ele,
					eventType:eventType,
					AssociationType:loadType.AssociationType,
					AssociationId:loadType.AssociationId,
					AssociationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
					AssociationPhotoId:loadType.AssociationPhotoId,
					isEditable:loadType.isEditable,
					currentDate:current
			};
			options[widgetType] = true;
			//	myCalendarEventsTwoByTwo.init(options);

			myCalendarEventsTwoByTwo.updateCalendar(options);	
			$("#calenderbodycontentid").addClass("calendar-padding");
			$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");

			if(myCalendarEventsTwoByTwo.settings.isEditable && (myCalendarEventsTwoByTwo.settings.AssociationType == 'GROUP' || myCalendarEventsTwoByTwo.settings.AssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}

});

		$('#previousMonthTwoByTwo').off('click').bind('click',function(){
			
			var widgetType = myCalendarEventsTwoByTwo.settings.widgetType
			var eventType = myCalendarEventsTwoByTwo.settings.eventFilterSetting;//$(this).attr("eventType");
			var current;
			
			if ( myCalendarEventsTwoByTwo.settings.currentMode == "MONTH"){
				if(myCalendarEventsTwoByTwo.settings.currentDate.getMonth() == 0){
					current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear()-1, 11, 1 );
				}
				else{
					current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear(), myCalendarEventsTwoByTwo.settings.currentDate.getMonth()-1, 1);
				}
			}
			else if ( myCalendarEventsTwoByTwo.settings.currentMode == "WEEK"){
				current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear(), myCalendarEventsTwoByTwo.settings.currentDate.getMonth(), myCalendarEventsTwoByTwo.settings.currentDate.getDate() - 7);
			}
			else if ( myCalendarEventsTwoByTwo.settings.currentMode == "DAY"){
				current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear(), myCalendarEventsTwoByTwo.settings.currentDate.getMonth(), myCalendarEventsTwoByTwo.settings.currentDate.getDate() - 1);
			}
			else { // YEAR 		
				current = new Date(myCalendarEventsTwoByTwo.settings.currentDate.getFullYear() - 1, 0, 1);
			}
			
			//$("#twoByTwoCalanderThumbNail").jqxCalendar('setDate', current);
			
			/*
			if(currentDate.getMonth() == 0){
				if(currentDate.getMonth() == (new Date().getMonth()+1)){
					current = new Date(currentDate.getFullYear()-1, 11, new Date().getDate());
				}else{
					current = new Date(currentDate.getFullYear()-1, 11, 1);
				}
			}else{
				if(currentDate.getMonth() == (new Date().getMonth()+1)){
					current = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, new Date().getDate());
				}else{
					current = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
				}
			}
			*/
			eventType = myCalendarEventsTwoByTwo.settings.eventFilterSetting ;
			
			var options = {
					ele :	myCalendarEventsTwoByTwo.settings.ele,
					eventType:eventType,
					AssociationType:loadType.AssociationType,
					AssociationId:loadType.AssociationId,
					AssociationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
					AssociationPhotoId:loadType.AssociationPhotoId,
					isEditable:loadType.isEditable,
					currentDate:current
			};
			options[widgetType] = true;
			//  myCalendarEventsTwoByTwo.init(options);
			myCalendarEventsTwoByTwo.updateCalendar(options);	

			$("#calenderbodycontentid").addClass("calendar-padding");
			$("#calenderbodycontentid").addClass("pad-trbl-12-30-25-18");
			// added for disabling the backward navigation for upcoming events
			if(myCalendarEventsTwoByTwo.settings.isEditable && (myCalendarEventsTwoByTwo.settings.AssociationType == 'GROUP' || myCalendarEventsTwoByTwo.settings.AssociationType == 'COURSE')){
				$("#showOptions2X2Calendar").addClass('hide');
			}
		});
		
		$("#new-event-2x2view").off('click').bind('click',function(e){

			var statDateValue = new Date();
			var endDateValue = new Date();

			var startDate = new Date(statDateValue.getFullYear(),statDateValue.getMonth(), statDateValue.getDate(), 00,00, 00, 00);
			var endDate = new Date(endDateValue.getFullYear(),endDateValue.getMonth(), endDateValue.getDate(), 23,30, 00, 00);

			var options={
					ele:"#new-event-container-2X2",
					mode:'New',
					isListView:true,
					photoId:loadType.AssociationPhotoId,
					associationType:loadType.AssociationType,
					associationId:loadType.AssociationId,
					associationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
					userName:userName,
					fromDate:startDate,
					toDate:endDate

			};
			Event.init(options);
		});
		
		$('[id^=eventDetails_]').off('click').bind('click',function(){
	
			var currentUniqueIdentifier = $(this).attr('eventUniqueIdentifier');
			var isPendingInvitation = $(this).attr('isPendingInvitation');
			//var widgetType = $(this).attr('widgetType');
			//var eventType = $(this).attr('eventType');
			var options={
					ele:'#events-view-container-2x2',
					mode:'View',
					isListView:true,
					photoId:loadType.AssociationPhotoId,
					associationType:loadType.AssociationType,
					associationId:loadType.AssociationId,
					associationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
					uniqueIdentfier:currentUniqueIdentifier,
					userName:userName,
					eventIdentifiers:myCalendarEventsTwoByTwo.eventUniqueIdentifiers,
					source:loadType.AssociationType,
					isEventListView:true,
					/* Naveen:: Commented this function of onExist due to which there is an issue with events list view. Click on any event from event list view and close the evnet view mode.
					 * later click on new event by going to my calendar 2X2 window and close the event it is redirecting to event list view.
					 * I don't know why this function was written.
					 * TODO:: Intention to call this function because, after accepting the event from event view mode. to change color of the event calling this fuction.
					 *  	        				onExit:function(){

  	        					var myCalenderoptions = {
  	        							ele :	myCalendarEventsTwoByTwo.settings.ele,
  	        							eventType:eventType,
  	        							currentDate:currentDate,
  	        							AssociationType:loadType.AssociationType,
  	        							AssociationId:loadType.AssociationId,
  	        							AssociationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
  	        							AssociationPhotoId:loadType.AssociationPhotoId,
  	        							isEditable:loadType.isEditable
  	        		  				};
  	        					   myCalenderoptions[widgetType] = true;
		  	        				 if(isPendingInvitation && isPendingInvitation!='undefined'){
		  	        						myCalenderoptions.isPendingEvents =true;
		  		            		   }else{
		  		            			 myCalenderoptions.isPendingEvents =false;
		  		            		   }
  	        						 myCalendarEventsTwoByTwo.init(myCalenderoptions); 

  	        				}*/
			};
			if((isPendingInvitation =='true' || isPendingInvitation == true) && isPendingInvitation!='undefined'){
				options.isPendingEvents =true;
			}else{
				options.isPendingEvents =false;
			}
			Event.init(options);
		});
		// Accepted/Declined/Tentative

		$('[id^=acceptEvent_]').off('click').bind('click',function(){
			var participantId = $(this).attr('participentId');
			var parentDiv = $(this).attr('parentDiv');
			myCalendarEventsTwoByTwo.manageEventInvitation(participantId,'ACCEPT',parentDiv);
		});

		$('[id^=declineEvent_]').off('click').bind('click',function(){
			var participantId = $(this).attr('participentId');

			myCalendarEventsTwoByTwo.manageEventInvitation(participantId,'DECLINE');
		});


		$('[id^=tentativeEvent_]').off('click').bind('click',function(){
			var participantId = $(this).attr('participentId');
			myCalendarEventsTwoByTwo.manageEventInvitation(participantId,'TENTATIVE');
		});

		$('#calendar2x2CalendarIcon').off('click').bind('click',function(){
	
			if($("#calendar2x2CalendarIconSpan").hasClass('selected-sm')){
				$("#calendar2x2LeftPannel").addClass('hide');
				$("#calendar2x2CalendarIconSpan").removeClass('selected-sm');
				$("#calendar2x2SecondColumn").toggleClass('col-xs-8');
				$("#calendar2x2SecondColumn").toggleClass('col-xs-12');
			}else{
				$("#calendar2x2SecondColumn").toggleClass('col-xs-12');
				$("#calendar2x2SecondColumn").toggleClass('col-xs-8');
				$("#calendar2x2LeftPannel").removeClass('hide');
				$("#calendar2x2CalendarIconSpan").addClass('selected-sm');

			}
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

	staticUI:function(element){
	
		var html =  '';
	
		var htmlTemplate='<div id="calenderbodycontentid" class="calenderbodycontentclass">'
				+'	<div class="">'
				+'		<div class="">'
				+'		<div id="">'
				+'       	<div class="col-xs-2">'
				+'				<a href="#" data-toggle="dropdown" class="dropdown-toggle"><div class="col-xs-2 text-left"><span class="filter-sm-icons mar-top-min-4"></span></div> </a>'
				+'				<ul class="common-dropdown-menus dropdown-menu arrow-right widget-dp">'
				+'					<li><a href="javascript:void(0);" id="myCalendar2X2view">My Calendar</a></li>'
				+'	 				<li><a href="javascript:void(0);" id="myEvent2X2view">Pending Invitations</a></li>'
				+'					<li><a href="javascript:void(0);" id="upComingEvents2X2view">Events</a></li>'
				+'					<!-- <li><a href="javascript:void(0);" id="pendingInvitations2X2view">Pending Invitations</a></li> -->'                                        
				+'					<li><a href="javascript:void(0);" id="draftEvents2X2view">Draft Events</a></li>'
				+'				</ul>'
				+'       	</div>'
				+'       	<div class="col-xs-8 text-center" id="headerDiv"><a href="javascript:void(0)" eventType="{{eventType}}" widgetType="{{widgetType}}" id="previousMonthTwoByTwo"><span class="next-prev-icons disabled-sm mar-right-12"></a></span><span id="headerSpanContainer" class="min-width-145 display-inline font-24px" widgetType="{{widgetType}}"></span><a href="javascript:void(0)" eventType="{{eventType}}" widgetType="{{widgetType}}" id="nextMonthTwoByTwo"><span class="next-prev-icons enabled-sm mar-left-12"></span></a></div>'
				+'       	<div class="col-xs-2 text-right pad-right-12">'
				+'			<span class="view-icons twobytwo display-inline cursor-hand" id="showOptions2X2Calendar"></span>'                                        
				+'			<div class="view-dropdown hide" id="removeHideCalendar2X2OptionsID">'
				+'			<a class="pad-right-5" href="javascript:void(0);" id="minimize_maximize_Calendar_11" idd="1" liid = "Calendar1x1" minmax="max">'
				+'				<span class="view-icons onebyone display-inline mar-trbl-0-2-0-2"></span>'
				+'			</a>'
				+'			<a class="pad-right-5" href="javascript:void(0);" id="minimize_maximize_Calendar21" idd="1" liid = "Calendar1x2" minmax="max">'
				+'				<span class="view-icons onebytwo display-inline mar-trbl-0-1-0-1"></span>'
				+'			</a>'
				+'			<a href="javascript:void(0);" id="minimize_maximize_Calendar_22" idd="1" liid = "Calendar2x2" minmax="max">'
				+'				<span class="view-icons twobytwo display-inline mar-trbl-0-2-0-2"></span>'
				+'			</a>'
				+'			</div>'
				+'       </div>'
				+'    </div>'
				+'		<div class="clear-float pull-right pad-tb-5 {{^isNewEventEnable}}mar-top-20{{/isNewEventEnable}}"><button id="new-event-2x2view" {{^isNewEventEnable}}disabled{{/isNewEventEnable}} class="def-button small-button {{^isNewEventEnable}}hide{{/isNewEventEnable}}">New Event</button></div>'

				+'  <div class="clear-float  pad-bot-10">'                       
				+'	<div class="mygroups-section">'

				+'			<div class="row">'
				+'				<div class="col-xs-4"><!--1st column-->'
				+'			    	<div id="isDraftOrEventsView" data-typeofevent="{{typeOfEvents}}" class="font-16px pad-bot-12 icon-padding-left"><a {{#showOptions}}class="hide"{{/showOptions}} id="calendar2x2CalendarIcon" href="javascript:void(0);"><span id="calendar2x2CalendarIconSpan" class="calendar-sm-icons selected-sm mar-right-8"></span></a>{{typeOfEvents}}</div>'	
				+'				</div>'
				+'				<div class="col-xs-8 {{#showOptions}}hide{{/showOptions}}"> <!--2nd column-->'
				+'					<div class="text-right font-12px pad-top-5">&nbsp;<a href="javascript:void(0);" class="datelinks"><span  id="events_All" period="YEAR" class="">Year </span></a>&nbsp; <a href="javascript:void(0);" class="datelinks"><span  period="MONTH" id="events_Month">Month </span></a>&nbsp;<a href="javascript:void(0);" class="datelinks"><span period="WEEK" id="events_Week">Week </span></a> &nbsp;<a href="javascript:void(0);"  class="datelinks"><span period="DAY" id="events_Day">Day </span></a></div>'
				+'				</div>'
				+'			</div>'	

				+'			<div class="{{#showOptions}}hide{{/showOptions}} clear-float col-xs-4 min-height-599 position-relative" id="calendar2x2LeftPannel"><!--1st column-->'
				+'              <div>'
				+'				<div id="twoByTwoCalanderThumbNail" class="width-180 height-135">'
				+'              </div>'
				+'				<div class="category-label icon-padding-left">Category</div>'
				+'				<div id="categoryFilterContainer" class="min-height-240">'
				+'			    </div>'
				+'              </div>'
				+'          </div>'
				+'			<div class="col-xs-8" id="calendar2x2SecondColumn"><!--2nd column -->'
				+'				<div class="row pad-left-16 icon-padding-left">'
				+'				<div class="col-xs-11 col-xs-11 width-310">'
				+'					<input type="text" class="input-textbox-height-width form-control" placeholder="Search {{typeOfEvents}}" id="eventSearchBox"/>'
				+'				</div><div class="col-xs-1 col-xs-1 top-4 pad-left-five"><span class="search-sm-icons"></span></div></div>'
				+'				<div class="events-date-heading" id="eventsContainerHeaderDiv"></div>' 
				+'              <div id="eventListScrollDiv" class="pad-left-16">'
				+'                <div class="clearfix hide default-message-style mar-top-10" id="noEventsContainerDiv">No events on this date.</div>'
				+'				  <div class="clearfix pad-top-15 width-270" id="eventsContainerDiv">';
		htmlTemplate +='               </div>'
				+'              </div>'
				+'<div class="position-relative height-100-percent width-96-percent">'
				+'  <div class="position-absolute onecolumn whitebg hide" id="events-view-container-2x2"></div>'
				+'</div>'
				+'<div class="whitebg hide" id="new-event-container-2X2"></div>'
				+'			</div>'
				+'			</div>'   
				+'			</div>'	 
				+'	 </div>'										  
				+'</div>';
		var data = {};
		var typeOfEvents = '';
		
		if( myCalendarEventsTwoByTwo.settings.widgetType == 'isUpcomingEvents'){
			typeOfEvents = 'Events';
		}else if( myCalendarEventsTwoByTwo.settings.widgetType == 'isDraftEvents'){
			typeOfEvents = 'Draft Events';
		}else if( myCalendarEventsTwoByTwo.settings.widgetType == 'isMyEvents'){
			typeOfEvents = 'Pending Invitations';
		}
		data['showOptions'] = (myCalendarEventsTwoByTwo.settings.widgetType != 'isUpcomingEvents');
		data['typeOfEvents'] = typeOfEvents;  
		data['widgetType'] = myCalendarEventsTwoByTwo.settings.widgetType;
		eventType = myCalendarEventsTwoByTwo.settings.eventType;
		//myCalendarEventsTwoByTwo.settings.widgetType = myCalendarEventsTwoByTwo.settings.widgetType;
		data['eventType'] = eventType;
		if(loadType.isEditable == 'true'){
			data.isNewEventEnable = true;
		}else{
			data.isNewEventEnable = false;
		}
		html = Mustache.to_html(htmlTemplate,data);   

		$(element).html(html);
		//
		var xiimcustomScrollbarOptions = {elementid:"#eventListScrollDiv",isUpdateOnContentResize:true,setHeight:"390px",vertical:'y'};
		xiimcustomScrollbar(xiimcustomScrollbarOptions);
		if( myCalendarEventsTwoByTwo.settings.widgetType == 'isUpcomingEvents'){
			myCalendarEventsTwoByTwo.settings.currentMode = 'UPCOMING'; 
		//	$("#events_Month").addClass('active');
		}
			if ( myCalendarEventsTwoByTwo.settings.eventFilterSetting == "YEAR" ){
				myCalendarEventsTwoByTwo.settings.currentMode = 'YEAR';
				$("#events_All").addClass('active');	
			}
			else if (myCalendarEventsTwoByTwo.settings.eventFilterSetting == "MONTH"){
				myCalendarEventsTwoByTwo.settings.currentMode = 'MONTH';
				$("#events_Month").addClass('active');			
			}
			else if (myCalendarEventsTwoByTwo.settings.eventFilterSetting == "WEEK"){
				myCalendarEventsTwoByTwo.settings.currentMode = 'WEEK';
				$("#events_Week").addClass('active');
			}
			else if (myCalendarEventsTwoByTwo.settings.eventFilterSetting == "DAY"){
				myCalendarEventsTwoByTwo.settings.currentMode = 'DAY';
				$("#events_Day").addClass('active');
			}
		

		if(loadType.AssociationType == 'GROUP' || loadType.AssociationType == 'COURSE'){
			$("#myEvent2X2view").addClass("hide");
			$("#upComingEvents2X2view").text("Events");
			$("#myCalendar2X2view").text("Calendar");
			if(loadType.isEditable == 'false'){
				$("#draftEvents2X2view").addClass("hide");
			}else if(loadType.isEditable == 'true'){
				$("#draftEvents2X2view").removeClass("hide");
			}
		}
		myCalendarEventsTwoByTwo.loadCategoriesFilter();
		myCalendarEventsTwoByTwo.loadMiniCalendar();
		myCalendarEventsTwoByTwo.bindEvents();
		/*
			if( widgetType == 'isUpcomingEvents' || widgetType == 'isMyEvents'){
				 // added for disabling the backward navigation for upcoming events
	  			if(currentDate.getMonth() == new Date().getMonth()){
	  				$("#previousMonthTwoByTwo").addClass('ancher_lock');
    		    }
	        }else{
	        	$("#previousMonthTwoByTwo").removeClass('ancher_lock');
	        }
		 */
		$('#eventSearchBox').focus();
	},

	manageEventInvitation:function(participantId,actionType,parentDiv){

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
				requestInfo:{performedElement:parentDiv,actionType:actionType},
				successCallBack:'',
				async:true,
				parentId:baseElementEvents
		};

		doAjax.PostServiceInvocation(options);

	}, 
	
	manageEventInvitationSuccessCallBack:function(requestInfo,data){

		var isSuccess =data.isSuccess;
		var updatedStatus = '';
		if(isSuccess){

			if(requestInfo.actionType == 'ACCEPT'){
				updatedStatus = 'Accepted';
			}else if(requestInfo.actionType == 'DECLINE'){
				updatedStatus = 'Declined';
			}else if(requestInfo.actionType == 'TENTATIVE'){
				updatedStatus = 'Tentative';
			}

			$('#'+requestInfo.performedElement).html('<div style="color:green">'+updatedStatus+'</div>');
		}

	}

	};
}.call(this);