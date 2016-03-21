
/**
 * @author Next Sphere Technologies
 * My Calendar (2x1) view  widget
 * 
 * My Calendar (2x1) view widget is used get all upcoming, draft and Pending invitations as an list view.
 * 
 * 1. Upcoming Events
 * 2. Draft Events
 * 3. Pending Invitations
 * 
 */

var datesList1 = [];
var getEventsURL1 = "";

var nextMonthMyCalendarThumbnail =  function(){
    var userName1 = $("#loggedInUserName-meta").val();
    var loadType1 = "";
    var container1;
    var currentDate1;
    var baseElementMyCalendar1 = "";
	return {
        init:function(flag){
        	loadType1 = flag;
        	baseElementMyCalendar1 = flag.baseElement;
        	currentDate1 = loadType1.currentDate;
        	container1 = baseElementMyCalendar1.substring(1);
        	var html ='<div class="position-relative height-100-percent width-96-percent">'
	                 +'  <div class="position-absolute onecolumn whitebg hide" id="events-view-container1"></div>'
		             +'</div>';
        	$(baseElementMyCalendar1).after(html);
        	this.tempDate = flag.currentDate;
        	this.getJQXWidgetData(loadType1.currentDate);
        	this.bindEvents();
        	
        	
        },
        errorCallBack:function(request,status,error){
               
        },
        /**
         * @param number
         * @param length
         * @returns {String}
         */
         pad:function(number, length){
            var str = "" + number;
            while (str.length < length) {
                str = '0'+str;
            }
            return str;
        },
        /**
         * @returns {String}
         */
         getOffset:function() {
        	var offset = new Date().getTimezoneOffset();
            
            offset =  ((offset<0? '+':'-')+ // Note the reversed sign!
                    pad(parseInt(Math.abs(offset/60)), 2)+
                    pad(Math.abs(offset%60), 2));
            
            return offset;
        },
	    bindEvents:function(){
	    	
	    	//My Calendar (2x1) view first month calendar previous month icon click event.
	    	$('#firstMonthContainer').off('click').bind('backButtonClick', function (event) { 
	    		//before navigating next month trigger the event for First Month calendar to forward month with events binding
	  			$('#secondMonthContainer').jqxCalendar('navigateBackward', 1);
	            var date = event.args.date; 
	            date = convertUTCDateTimeTo.LocalBrowserDateTime(event.args.date);
	            date.setMonth(date.getMonth() + 1); 
	            loadType1.currentDate = date;
	            nextMonthMyCalendarThumbnail.getJQXWidgetData(date);
	            
	  		});
	    	
		 	//My Calendar (2x1) view onclick of next months icons loading events 
/*		 	  $('#secondMonthContainer').off('click').bind('nextButtonClick',function (event) { 
		            var date = event.args.date;
		            date = convertUTCDateTimeTo.LocalBrowserDateTime(event.args.date);
		            loadType1.currentDate = date;
		            nextMonthMyCalendarThumbnail.getJQXWidgetData(date);
			});*/
	    	

	    	/*To show view option for calendar */
	      	  $("#showOptionsCalendarID").off('click').bind('click',function(){
	      		$("#removeHideCalendarOptionsID").toggleClass('hide');
	    		  
	    	  });
     	    	 
	    },
	    setGiveDateErrorCallBack:function(jqXHR, textStatus, errorThrown){
        	 
         },
         formatDate_yyyymmdd:function(date){
           	date = new Date(date); 
           	var currentDate = new Date();
           	currentDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
               var yyyy = currentDate.getFullYear().toString();                                    
               var MM = (currentDate.getMonth()+1).toString(); // getMonth() is zero-based         
               var dd  = currentDate.getDate().toString();  
               var hh  = currentDate.getHours().toString();  
               var mm  = currentDate.getMinutes().toString();  
               var ss  = currentDate.getSeconds().toString();  
                                   
               return yyyy + '-' + ( (MM[1] != undefined) ?MM:"0"+MM[0]) + '-' + ( (dd[1] != undefined) ?dd:"0"+dd[0]) + ' ' + ( (hh[1] != undefined) ?hh:"0"+hh[0]) + ':' + ( (mm[1] != undefined) ?mm:"0"+mm[0]) + ':' + ( (ss[1] != undefined) ?ss:"0"+ss[0]);
         },
         dayFormatUtility:function(startTime){
          	 
        	 startTime =  new Date(startTime);
          	//find the date
          	 var date1 = startTime.getDate();
          	var month1 = startTime.getMonth();
          	var year1 = startTime.getFullYear();
          	var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
          	
          	var startDate = months[month1]+' '+ date1 +','+ ' '+year1;
          	return startDate;
         },
         calendarEventDateFormatUtility:function(event){

           	
           	var startTime =  new Date(event.startTime);
           	var endTime = new Date(event.endTime);
           	
           	//find the date
           	 var date1 = startTime.getDate();
           	 var date2 = endTime.getDate();

           	var month1 = startTime.getMonth();
           	var month2 = endTime.getMonth();

           	var year1 = startTime.getFullYear();
           	var year2 = endTime.getFullYear();
           	
           	var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
           	
           	var startDate = months[month1]+' '+ date1 +','+ ' '+year1;
           	event.startDate = startDate;
           	
           	var endDate = '';
           	
           	if( year2 - year1 > 0 || month2 - month1 > 0 ||  date2 - date1 > 0){
           		endDate = months[month2]+' '+ date2 +','+ ' '+year2;
           	}
           	event.endDate = endDate;
           	
           	startTime = nextMonthMyCalendarThumbnail.getTimeFormat(startTime);
           	endTime = nextMonthMyCalendarThumbnail.getTimeFormat(endTime);
           	
           	event.startTime = startTime;
           	event.endTime = endTime;
           	
         },
         getCalendarEventTimeFormat:function(date){
           	var d = new Date(date);
           	    var n = d.getHours();
           	    var m = d.getMinutes();
           	    
           	if( m == 0 ){
           		m = '00';
           		}
           		  //it is pm if hours from 12 onwards
           		    var suffex = (n>= 12)? 'pm' : 'am';

           		    //only -12 from hours if it is greater than 12 (if not back at mid night)
           		    n = (n> 12)? n-12 : n;

           		   //if 00 then it is 12 am
           		    n = (n == 0)? 12 : n;
           		   
           		   return n +':'+ m + suffex;
         },
         
         getEventRequest:function(tempDate,eventFilterCriteriaEnum){
        	  var formattedDate = Date.parse(tempDate);
           	  formattedDate = nextMonthMyCalendarThumbnail.formatDate_yyyymmdd(formattedDate);
         		var offset = nextMonthMyCalendarThumbnail.getOffset();
         		 var eventSearchCriteria = [];
         		 eventSearchCriteria.push({
        			"eventSearchCriteria": "OFFSET",
        			"eventSearchCriteriaValue": offset
        	});
         		 
         		 eventSearchCriteria.push({
       				"eventSearchCriteria": "CURRENTDATE",
       				"eventSearchCriteriaValue": formattedDate
       			});
       			var associationType = $("#associationType").val();
         		 if( associationType != undefined && associationType == 'COURSE' ){
         			 eventSearchCriteria.push({
            				"eventSearchCriteria": "COURSEID",
            				"eventSearchCriteriaValue": $("#associationId").val()
            			});
         		 }else if (  associationType != undefined && associationType == 'GROUP' ){
         			 eventSearchCriteria.push({
            				"eventSearchCriteria": "GROUPID",
            				"eventSearchCriteriaValue": $("#associationId").val()
            			}); 
         		 }
         		 var viewTypeEnum = "MYEVENTS_CALENDERVIEW";
         		 if( associationType == 'COURSE' || associationType == 'GROUP' ){
         			viewTypeEnum = "GROUPEVENTS_CALENDERVIEW";
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
         	 return getEventRequest;
         },
         getJQXWidgetDataSuccessCallBack:function(data){
 		var eventsList = [];
 			try{
 				 //GetEventsResponse.events (list of events)
 				//data = $.parseJSON(data);
 				var results = data['result'];
 				var status = results['status'];
 				if(status == 'true'){
 						 var events = data['events'];
 						 if( events != undefined && events.length == undefined ){
 							 events = [events];
 						 }
 						var specialDates;
 						var uniqueColorCodes = [];
 						var colorCodeScores = [];
 						//logic to find the color importance
 						if(events){
 							for(var i=0;i<events.length;i++){
 	 						    if($.inArray($.trim(events[i].eventCategoryModel.categoryColorCode),colorCodeScores) < 0){
 	 						    	uniqueColorCodes.push({colorCode:events[i].eventCategoryModel.categoryColorCode,score:0,startTime:events[i].startTime});
 	 						    	colorCodeScores.push(events[i].eventCategoryModel.categoryColorCode);
 	 						    }
 	 						}
 						}
 						$(loadType1.baseElement).jqxCalendar( { firstDayOfWeek:0,value: $.jqx._jqxDateTimeInput.getDateTime(loadType1.currentDate)} );
 						if(events){
 							for(var i=0;i<events.length;i++){
	 							var event = {
	 									id : events[i].eventUniqueIdentifier,
	 									title : events[i].eventName,
	 									start : convertUTCDateTimeTo.ConvertUTCDateToLocalDate(events[i].startTime),
	 									end : convertUTCDateTimeTo.ConvertUTCDateToLocalDate(events[i].endTime),
	 									url : 'events/'+events[i].eventUniqueIdentifier,
	 									editable : false,
	 									allDay:events[i].allDay
	 							};
	 							
	 							eventsList.push(event);

	 							//setting year month and date
	 							var dateX = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].startTime);
	 							var dateY = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].endTime);
	 							
	 							dateY = isAllDayDateFormatting(events[i].allDay,dateX,dateY);
	 							
	 							dateX = new Date(dateX.getFullYear(), dateX.getMonth(), dateX.getDate());
								dateY = new Date(dateY.getFullYear(), dateY.getMonth(), dateY.getDate());

	 							var dayCount = Math.ceil((dateY.getTime() - dateX.getTime()) / 86400000 );
										
	 							var dayZ = 0 ;
	 				
	 							for(var loopTime=dateX.getTime(); dayZ <= dayCount; loopTime+=86400000 ){
	 								var loopDay = new Date(loopTime);
	 								dateX = new Date(loopDay.getFullYear(), loopDay.getMonth(), loopDay.getDate());
								
									//Performance Hog:
	 								//$(loadType1.baseElement).jqxCalendar('addSpecialDate', dateX, '','');
									if((i == (events.length -1)) && (dayZ == dayCount))
                                                                                $(loadType1.baseElement).jqxCalendar('addSpecialDate', dateX, '','',true);
                                                                        else
                                                                                $(loadType1.baseElement).jqxCalendar('addSpecialDate', dateX, '','',false);
	 								
	 								dayZ++;
								}
	 						}
 						}
	 						
	 						events = nextMonthMyCalendarThumbnail.sortByKey(events,'startTime');
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
	 							
 								for(var loopTime=dayStart.getTime(); dayZ <= dayCount; loopTime+=86400000 )
 								{
 									var day = new Date(loopTime).getDate();
 									if(dayEvents[day] == null)
 									{
 										var dayEventsList = [];
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


 							var specialDates = $(loadType1.baseElement+' .jqx-calendar-cell-specialDate');
 							for(var i=0;i<specialDates.length;i++){
 								var day = $(specialDates[i]).html();
 								//var colors = dayEvents[day+'_colorMap'];
 								var colors = dayColorMap[day+'_colorMap'];
 								var colorsList = [];
 								var html='<div class="dotswrapper"><span id="dotsContainer" class="dotsContainer">';
 								if(colors){
 									for (var key in colors) {
 										colorsList.push({'score':colors[key],'color':key});
 									}
 									colorsList = nextMonthMyCalendarThumbnail.sortByKey(colorsList,'score');
 									if(colorsList.length > 3){
 										for(var i1 = colorsList.length-1;i1>=colorsList.length-3;i1--){
 											html+='<i class="sm-circle-blue width-height-4 table-cell" style="background-color:'+colorsList[i1]['color']+'"></i>';
 	 									}
 									}else{
 										for(var i1 = colorsList.length-1;i1>=0;i1--){
 											html+='<i class="sm-circle-blue width-height-4 table-cell" style="background-color:'+colorsList[i1]['color']+'"></i>';
 	 									}
 									}
 									html+='</span></div>';
 									$(specialDates[i]).addClass('position-relative');
 	 								$(specialDates[i]).html(day+html);
 	 								//$("#dotsContainer").html(colorHtml);
 								}
 								
 							}
 							
 							$(loadType1.baseElement+' .jqx-calendar-cell-specialDate').off("click").bind("click",function(e){
 								//written below condition to fix the bug XIP-3199
 								if(!$(e.target).children().hasClass('dotswrapper')){
 									return false;
 								}
 								var self = $(this);
 								$('.jqx-calendar-cell-specialDate').popover('destroy');
 								$('#calendarEventsScrollDiv').closest('.popover').remove();
 								self.parent().addClass('popoverParents');
 								var day ;
 								day = self.text();
 								var events = dayEvents[day];
 								
 								// Added for displaying selected date for special dates
 								var selectedDate = $(loadType1.baseElement).jqxCalendar('getDate');
 								var selectedDisplayDate = dateUtility.formatDate(selectedDate,'MMMM dd,yyyy');
 								
 								var eventsContent = '<div class="widget-modelbox-heading-eventlistview bottom-border mar-bot-12">'
 									+'<button type="button" id="close-events-list-view" class="close" data-dismiss="modal" aria-hidden="true"><i class="close-sm-icons selected-sm"></i></button>'
 									+'<div class="font-15px helvetica-neue-roman">'+selectedDisplayDate+'</div></div><div id="customscrollbarId" class="width-275"><div class="max-width-255">'
 									+'	<div class="clearfix ">'
 									+'      {{#events}}'
 									+'		<div class="mar-bottom-20"  title="{{eventName}} ">'
 									+'			<div class="sm-circle-blue" style="background-color:{{eventCategoryModel.categoryColorCode}}"></div>'
 									+'			<span class="mar-bottom-10 position-relative top-minus-6"><a class="event-name" href="javascript:void(0);" elementId="'+self.attr('id')+'"  eventUniqueIdentifier="{{eventUniqueIdentifier}}" id="eventDetails_{{eventUniqueIdentifier}}">{{eventName}}</a></span>'
 									+'			<div class="mar-t0-l31 event-date">{{displayDate}} | {{displayTime}}</div><div id="eventsViewContainer{{eventUniqueIdentifier}}"></div>'
 									+'		</div>'
 									+'      {{/events}}'
 									+'	</div></div>'	
 									+'</div>';
 								if(events){
 									if(events.length == undefined){
 										events = [events];
 									}
 							
	 								for(var i=0;i<events.length;i++){
	 								  var startDate = events[i].startTime;
	 								  var endDate = events[i].endTime;
	 								  startDate = convertUTCDateTimeTo.LocalBrowserDateTime(events[i].startTime);//new Date(events[i].startTime);
	 								  endDate =   convertUTCDateTimeTo.LocalBrowserDateTime(events[i].endTime);//new Date(events[i].endTime);
	 								 
	 								  endDate = isAllDayDateFormatting(events[i].allDay,startDate,endDate);
	 								 
	 								  events[i].displayDate = dateUtility.formatDate(startDate,'MMMM dd,yyyy');
	 								  events[i].displayTime = dateUtility.formatDate(startDate,'hh:mm A')+' - '+dateUtility.formatDate(endDate,'hh:mm A');
	 								}
	 								
 								}
 								
 								var isDashboard = $('.dashboardviewportcontainer').is(':visible');
 								var placementDisplay = 'auto';
 								if(isDashboard){
 									placementDisplay = 'right'; 
 								}
 								
 								
 								var data = {events:events};
 								var eventHtml = Mustache.to_html(eventsContent,data);
 								
 								self.popover({
					                'html' : true,
					                placement: function(context, src) {					                	
					                    $(context).addClass('calendar-popover');
					                    return placementDisplay;
					                 },
					                container: 'body',
					                //title: events[0].displayDate+'<a href="javascript:void(0);"  parent="'+self.attr('id')+'" id="close-events-list-view" class="pull-right">X</a>',
					                template: '<div class="popover"><div class="arrow"></div><div id="calendarEventsScrollDiv" class="popover-inner height-250"><div class="popover-content pad-trbl-8-12-12"></div></div></div>',
					                trigger:'click',
					                content:eventHtml
					                
					           });
 								self.popover('toggle');
 								var xiimcustomScrollbarOptions = {elementid:"#customscrollbarId",isUpdateOnContentResize:true,setHeight:"195px",vertical:'y'};
 								xiimcustomScrollbar(xiimcustomScrollbarOptions);
 								$("[id^=eventDetails_]").off("click").bind("click",function(e){
 									nextMonthMyCalendarThumbnail.closePopover($('.jqx-calendar-cell-specialDate'));
 									var ele = $(this).attr('elementId');
 									var day = $("#"+ele).text();
 									day = day.substring(0,2);
 									var events = dayEvents[day];
 									var eventIds = [];
 									if(events.length == undefined){
 										events = [events];
 									}
 									for(var i=0;i<events.length;i++){
 										if($.inArray($.trim(events[i].eventUniqueIdentifier),eventIds) < 0){
 											eventIds.push(events[i].eventUniqueIdentifier);
 										}
 									}
 									//need to build the view events 2X1 view
 									var currentUniqueIdentifier = $(this).attr('eventUniqueIdentifier');
 									var options={
 					        				ele:'#events-view-container1',
 					        				mode:'View',
 					        				photoId:'',
 					        				uniqueIdentfier:currentUniqueIdentifier,
 					        				associationType:'CONNECTION',
 					        				associationId:'',
 					        				userName:userName1,
 					        				eventIdentifiers:eventIds,
 					        				source:'CONNECTION',
 					        				onExit:function(){
 					        					var flag={
 										  				baseElement:baseElementMyCalendar,
 										  				currentDate:loadType1.currentDate
 										  		};	
 												nextMonthMyCalendarThumbnail.init(flag);
 					        				}
 					        		};
 					        		Event.init(options);
 					        		setIconTitleDynamically();	
 								});
 								
 								$("[id^=close-events-list-view]").off('click').bind('click',function(e){
									nextMonthMyCalendarThumbnail.closePopover($('.jqx-calendar-cell-specialDate'));
 								});
 								
 							});
 		
 				}else{
 						
 					}
 			}catch(e){
 			
 			}
 		},
 		closePopover:function(element){
 			element.popover('destroy');
			$('.popover').remove();
 		},
 		sortByKey:function(array,key) {
 		    return array.sort(function(a, b) {
 				var x = a[key]; var y = b[key];
 				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 			});
 		},
 		getJQXWidgetDataErrorCallBack:function(jqXHR, textStatus,errorThrown){
        	 
         },
         getJQXWidgetData:function(tempDate){
        		var getEventsURI = $("#getEventsURI").val();
             	getEventsURL1 = getModelObject('serviceUrl')+getEventsURI;
             	/*converting date to service request understandable format*/
             	var formatteddate = tempDate.getMonth()+ 1 + "/" + tempDate.getDate() + "/" + tempDate.getFullYear();
        		var options = {
        				async:true,
        				url:getEventsURL1,
        				instanceName:'getEvents2',
        				data:nextMonthMyCalendarThumbnail.getEventRequest(formatteddate,'MONTH'),
        				successCallBack:nextMonthMyCalendarThumbnail.getJQXWidgetDataSuccessCallBack,
            			failureCallBack:nextMonthMyCalendarThumbnail.getJQXWidgetDataErrorCallBack
        		};
        		//:: AJAX call to get Events
       		 doAjax.PostServiceInvocation(options);
       		loadType1.currentDate=new Date(tempDate);
		 $(".calendarWidget").removeClass('hide');
	 		$(loadType1.baseElement).jqxCalendar(
	 				{ 
	 					enableTooltips: true, 
	 					width: 230, 
	 					height: 240,
	 					firstDayOfWeek:0,
	 					value: new $.jqx._jqxDateTimeInput.getDateTime(new Date(tempDate)),
	 					enableAutoNavigation: false,//disabling fast auto navigation 
	 					showOtherMonthDays: false,
	 					dayNameFormat:'default',
	 					enableViews: false,
	 					enableFastNavigation: false //disabling fast click navigation for mini calendar
	 				});
    
         },
        	
         /**
          * getTimeFormat
          *
          */
          getTimeFormat:function(date){
         	var d = new Date(date);
         	    var n = d.getHours();
         	    var m = d.getMinutes();
         	    
         	if( m == 0 ){
         		m = '00';
         		}
         		  //it is pm if hours from 12 onwards
         		    var suffex = (n>= 12)? 'pm' : 'am';

         		    //only -12 from hours if it is greater than 12 (if not back at mid night)
         		    n = (n> 12)? n-12 : n;

         		   //if 00 then it is 12 am
         		    n = (n == 0)? 12 : n;
         		   
         		   return n +':'+ m + suffex;
         }
	    
    };
}.call(this);
