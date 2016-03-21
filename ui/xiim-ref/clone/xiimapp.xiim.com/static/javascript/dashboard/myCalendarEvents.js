
/**
 * @author Next Sphere Technologies
 * My Calendar (1x1) view  widget
 * 
 * My Calendar (1x1) view widget is used get all upcoming, draft and Pending invitations as an list view.
 * 
 * 1. Upcoming Events
 * 2. Draft Events
 * 3. Pending Invitations
 * 
 */

var baseElementEvents = "";

var myCalendarEvents = function(){
	loadType = "";
	var accessToken =  $("#accessToken_meta").val();
    var langId = $("#langId_meta").val();
    var userId = $("#loggedInUserId-meta").val();
    var loggedInConnectionId = $("#loggedInUserConnectionId-meta").val();
    var loggedInuserPhotoId = $("#loggedInUserPhotoId-meta").val();
    var userName = $('#loggedInUserName-meta').val();
    var currentDate; 
       return {
    	      eventUniqueIdentifiers:[],
              init:function(options){
            	  	 loadType = options;
            	  	 if(options.isMyEvents == true || options.isMyEvents == 'true'){
            	  		loadType.isMyEvents = options.isMyEvents;
            	  	 }else{
            	  		loadType.isMyEvents = false; 
            	  	 }
            	  	currentDate = loadType.currentDate;
            	  	 baseElementEvents = options.baseElement;
            var html ='<div class="position-relative height-100-percent width-96-percent">'
   	                  +'  <div class="position-absolute onecolumn whitebg hide" id="events-view-container"></div>'
   		              +'</div>';
           	         $(baseElementEvents).after(html);
                     this.staticUI(baseElementEvents);
                     
                     var req = this.prepareServiceRequest(options);
                     this.serviceInvocation(req);
                     this.bindEvents();
              },
              registerValidations:function(element){
            	  
              },
              serviceInvocation:function(options){
            	  
            		  doAjax.PostServiceInvocation(options);
            	  
              },
              prepareServiceRequest:function(flag){
            	  	var now = currentDate; 
            		var today = now;
            		today = convertUTCDateTimeTo.formatDate_yyyymmdd(today);
            		var eventFilterCriteriaEnum ='';
            		var eventSearchCriteriaValue = '';
            		var URI = '';
            		var accessToken = $("#accessToken").val();
              		var langId = $("#langId").val();
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
            			eventFilterCriteriaEnum ='ALL';
            			eventSearchCriteriaValue = '';
            		}
            		
            		if(flag.isUpcomingEvents){
            			headerContent = 'Upcoming Events';
            			URI = $("#getEventsURI").val();
            			startResult =0;
            			maxResult =4;
		            	   request = {                			
		            			  userId:userId,
		                		  accessToken:accessToken,
		      					  pageCriteriaModel: {
		      						pageSize:maxResult,
		      						pageNo:startResult,
		      						isAll: false
		      					  },
		      					
		      					viewTypeEnum:"UPCOMINGEVENTS_VIEW",
		      					eventFilterCriteriaEnum:flag.eventType,
		      					eventSearchCriteria:[
		      					                   {
				        					            eventSearchCriteria:"OFFSET",
				        					            eventSearchCriteriaValue:getOffset()
				        					       },
				      					          {
				      					            eventSearchCriteria:flag.eventType,
				      					            eventSearchCriteriaValue:""
				      					           },
			      					                {
			            					            eventSearchCriteria:"CURRENTDATE",
			            					            eventSearchCriteriaValue:today
			            					       }
		      					           
		      					           ]
		              		};   
		            	   
            		}else if(flag.isDraftEvents){  
          			headerContent = 'Draft Events';
          			eventFilterCriteriaEnum ='MONTH';
          			URI = $("#getEventsURI").val();
          			startResult =0;
        			maxResult =4;
        			request = { 
	          			  	userId:userId,
	            			accessToken:accessToken,
		  					pageCriteriaModel: {
	      						pageSize:maxResult,
	      						pageNo:startResult,
		  						isAll: false
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
		  					         
	  					          ]
        			};
          		}else if(flag.isMyEvents){ 
          			headerContent = 'Pending Invitations';
          			URI = "/event/1.0/getMyEventInvitations";
          			
          			startResult =0;
        			maxResult =4;
        			var offset = getOffset();
        			
        			request = { 
	          			  	userId:userId,
	            			accessToken:accessToken,
		  					pageCriteriaModel: {
	      						pageSize:maxResult,
	      						pageNo:startResult,
		  						isAll: false
		  					},
		  				eventInvitationFilterCriteriaEnum:"NEW",
		  				eventFilterCriteriaEnum:"MONTH",
		  				eventTypeEnum:"ALL",
		  				associationType:"CONNECTION",
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
            	
            		request= JSON.stringify(request);
            		
              	  var options = {
              			async:true,
               			 url:getModelObject('serviceUrl')+URI,
               			 data:request,
               			 requestInfo:{header:headerContent},
               			 successCallBack:myCalendarEvents.successCallBack,
               			 failureCallBack:myCalendarEvents.failureCallBack
               	 };
              	  return options;
              },
              successCallBack:function(requestInfo,data){
            	  
            	data.header = requestInfo.header;
  				data.selectedYearMonth = dateUtility.formatDate(currentDate,'MMMM yyyy');
  				
  				//Pending Invitations
  				if(loadType.isMyEvents){
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
  	            	//data.eventsCount = data.eventCount;
  	            	  
  				 }
  					
            	  if(data.events != undefined && data.events.length == undefined){
            		  data.events = [data.events];
            	  }
            	  if(data.events != undefined && data.events.length != undefined ){
            		  for(var i=0;i<data.events.length;i++){
  	            		var monthname = '';
  	  					var dayOfEvent = '';
  	  					var yearOfEvent = '';
  	  					var startTime = '';
  	  					var endTime = '';
  	  					
	  	  				data.events[i].startTime = convertUTCDateTimeTo.LocalBrowserDateTime(data.events[i].startTime);
	  	  			    data.events[i].endTime =  convertUTCDateTimeTo.LocalBrowserDateTime(data.events[i].endTime);
  	  					var startDate = data.events[i].startTime;
  	  					
  	  					var endDate = data.events[i].endTime;
  	  				    
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
  	  					data.events[i].count = i;
  	  				
  	  					data.events[i].displayEventDate = monthname+' '+dayOfEvent+' ,'+yearOfEvent+' - '+endMonthName+' '+endDayOfEvent+' ,'+endYearOfEvent+' | '+ startTime+' - '+endTime;
  	  					
	  	  				if(data.events[i].rsvpEnum == 'AWAITING'){
							data.events[i].isResponded = false;
						}else{
							data.events[i].isResponded = true;
						}
  	  					
  	  				    if($.inArray($.trim(data.events[i].eventUniqueIdentifier),myCalendarEvents.eventUniqueIdentifiers) < 0){
  	  				    	myCalendarEvents.eventUniqueIdentifiers.push(data.events[i].eventUniqueIdentifier);
  	  				    }
  	  				    
                	  }
            	  }else{
            		  $("#noEvents").removeClass('hide');
            	  }
  				
                 myCalendarEvents.dynamicUI(data);
              },
              beforeSendCallBack:function(jqXHR,settings){
              },
              completeCallBack:function(jqXHR,textStatus){
              },
              errorCallBack:function(request,status,error){
                     
              },
              failureCallBack:function(data){
            	  $("#noEvents").removeClass('hide');
              },
              dynamicUI:function(data){
            	  
            	 
            	  var htmlTemplate='<div class="pad-lr-20"><div class="text-center font-12px helvetica-neue-roman date-header-back"><a href="javascript:void(0)" eventType="{{eventType}}" widgetType="{{widgetType}}" id="previousMonthOneByOne"><div class="jqx-calendar-title-navigation jqx-icon-arrow-left" role="button" style="float: left;"></div>'
            		              +'</a>{{selectedYearMonth}}<a href="javascript:void(0)" eventType="{{eventType}}" widgetType="{{widgetType}}" id="nextMonthOneByOne"><div class="jqx-calendar-title-navigation jqx-icon-arrow-right" role="button" style="float: right;"></div></a>'
            		              +'</div>'
            		              +'<div id="widgetHeader" class="bold pad-tb-5 heading-12px" widgetType="{{widgetType}}">{{header}}</div><div class="height-178 eventlistviewdiv">';
            	  
            	  if(data.events){
            		
            	     htmlTemplate +='{{#events}}'
            	  		          +'<div class="mar-bottom-7 eventNameClass" title="{{eventName}}">'
		            	  			+'		<div class="sm-circle-blue" style="background-color:{{#isResponded}}{{eventCategoryModel.categoryColorCode}}{{/isResponded}}{{^isResponded}}{{eventCategoryModel.categoryBlurCode}}{{/isResponded}}"></div>'
		            	  			+'		<span class="mar-bottom-10 position-relative top-minus-6"><a class="event-name" id="eventDetails_{{eventUniqueIdentifier}}" widgetType="{{widgetType}}" eventType="{{eventType}}" isPendingInvitation="'+loadType.isMyEvents+'" eventUniqueIdentifier="{{eventUniqueIdentifier}}" href="javascript:void(0)" >{{modifiedEventName}}</a></span>'
		            	  			+'		<div class="mar-t0-l31 event-date">{{displayEventDate}}</div>'
		            	  			+'</div>'
		            	  			+'{{/events}}';
            	     
            	     if(data.count > 0){
            	      htmlTemplate +='</div><div class="font-10px helvetica-neue-roman position-relative left-7 top-4">Total <a href="javascript:void(0);" class="lightblue pad-left-5" widgetName="{{widgetName}}" id="myEventsTotalCountID">(' +data.count+')</a></div></div>';
                     	  }
            	  }
    	  			else{
    	  				htmlTemplate +='<div class="default-message-style" id="noEvents">Sorry, there are no Events.</div>';
    	  			}
            	 
	            	 if(loadType.isUpcomingEvents){
	          	    	 data.widgetType = 'isUpcomingEvents';
	          	    	 data.widgetName = 'upComingEvents';
	          	     }/*else if(loadType.isPendingInvitation){
	          	    	 data.widgetType = 'isPendingInvitation';
	          	    	 data.widgetName = 'myEvents';
	          	     }*/else if(loadType.isDraftEvents){
	          	    	 data.widgetType = 'isDraftEvents';
	          	    	 data.widgetName = 'draftEvents';
	          	     }else if(loadType.isMyEvents){
	          	    	 data.widgetType = 'isMyEvents';
	          	    	 data.widgetName = 'myEvents';
	          	     }
	            	 
          	      data.eventType =loadType.eventType;
            	  var recentEventsHtml = Mustache.to_html(htmlTemplate,data);
            	  $(baseElementEvents).empty();
  	  			  $(baseElementEvents).replaceWith( "<div id='jqxWidget' class='mCustomScrollbar height-250'></div>" );
  	  			  $(baseElementEvents).html(recentEventsHtml);
  	  			  // added for disabling the backward navigation for upcoming events
	  	  			if(currentDate.getMonth() == new Date().getMonth()){
	  	  				$("#previousMonthOneByOne").addClass('ancher_lock');
	        		}
    	  			myCalendarEvents.bindEvents();
    	  			
              	},
            
		             /**
		              *  bind operations performed on UI
		              */
	              bindEvents:function(){
	            	  
	            	  
	            	  $('#myEventsTotalCountID').off('click').bind('click',function(){
	            		  
	            		  $('#minimize_maximize_Calendar_22').trigger('click');
	            		
	            		  var widgetName =  $(this).attr("widgetName");
	            		  
	            		  if(widgetName == 'myEvents'){
	            			  widgetName = 'myEvent';
	            		  }
	            		  
	            		  var clickEvent = '#'+widgetName+'2X2view';
	            		  
	            		  $(clickEvent).trigger('click');
	            		  
	            	  });
	            	  
	            	  
	            	  $('#nextMonthOneByOne').off('click').bind('click',function(){
	            	  //	alert(" next month");
	            		var widgetType = $(this).attr("widgetType");
	            		var eventType = $(this).attr("eventType");
	            		
	            		var current;
	            		if (currentDate.getMonth() == 11) {
	            		    current = new Date(currentDate.getFullYear() + 1, 0, 1);
	            		} 
	            		else {
	            		    current = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
	            		}
	            		currentDate= current;
	            		var options = {
	        					baseElement:baseElementEvents,
	        					eventType:eventType,
	        					currentDate:current
	        				};
	            		    options[widgetType] = true;
	        				myCalendarEvents.init(options);
	            		
	            	  });
	            	  
	            	  
	            	  $('#previousMonthOneByOne').off('click').bind('click',function(){
	            		  var widgetType = $(this).attr("widgetType");
	            		  var eventType = $(this).attr("eventType");
	            		  var currentDate =loadType.currentDate;
	            		  var current;
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
	            		  var options = {
	            				  baseElement:baseElementEvents,
	            				  eventType:eventType,
	            				  currentDate:current
	            		  };
	            		  options[widgetType] = true;
	            		  myCalendarEvents.init(options);
	            		  // added for disabling the backward navigation for upcoming events
	            		  if(currentDate.getMonth() == (new Date().getMonth()+1)){
	            			  $("#previousMonthOneByOne").addClass('ancher_lock');
	            		  }
	            	  });
	            	  
	            	  
	            	  $('[id^=eventDetails_]').off('click').bind('click',function(){
	            		  var currentUniqueIdentifier = $(this).attr('eventUniqueIdentifier');
	            		  var isPendingInvitation = $(this).attr('isPendingInvitation');
	            		  var widgetType = $(this).attr('widgetType');
	            		  var eventType = $(this).attr('eventType');
	            		  var options={
			        				ele:'#events-view-container',
			        				mode:'View',
			        				photoId:loggedInuserPhotoId,
			        				uniqueIdentfier:currentUniqueIdentifier,
			        				associationType:'CONNECTION',
			        				associationId:loggedInConnectionId,
			        				userName:userName,
			        				eventIdentifiers:myCalendarEvents.eventUniqueIdentifiers,
			        				source:'CONNECTION',
			        				onExit:function(){
			        					var myCalenderoptions = {
			    	        					baseElement:baseElementEvents,
			    	        					eventType:eventType,
			    	        					currentDate:currentDate
			    	        				};
			        					myCalenderoptions[widgetType] = true;
			    	        				myCalendarEvents.init(myCalenderoptions);
			        				}
			        		};
	            		   if(isPendingInvitation && isPendingInvitation!='undefined'){
	            			   options.isPendingEvents =true;
	            		   }else{
	            			   options.isPendingEvents =false;
	            		   }
			        		Event.init(options);
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
            	  html ='<div class="hide" id="noEvents">Sorry, there are no Events.</div>';
            	  $(element).append(html);
              }
              
       };
}.call(this);