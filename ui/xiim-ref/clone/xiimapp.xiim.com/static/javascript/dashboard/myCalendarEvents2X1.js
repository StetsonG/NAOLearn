
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

var baseElementEvents = "";

var myCalendarEventsTwoByOne = function(){
	
	loadType = "";
	var accessToken =  $("#accessToken_meta").val();
    var langId = $("#langId_meta").val();
    var userId = $("#loggedInUserId-meta").val();
    var loggedInConnectionId = $("#loggedInUserConnectionId-meta").val();
    var loggedInuserPhotoId = $("#loggedInUserPhotoId-meta").val();
    var userName = $('#loggedInUserName-meta').val();
    var currentDate; 
    var nextDate;
       return {
    	      eventUniqueIdentifiers:[],
              init:function(options){
            	  	 loadType = options;
            	  	currentDate = loadType.currentDate;
            	  	if(currentDate.getMonth() == 11){
            	  		nextDate = new Date(currentDate.getFullYear() + 1, 0, 1);
            	  	}else{
            	  		nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            	  	}
            	  	 baseElementEvents = options.baseElement;
            	  	 if(loadType.isTwoByOneCalendar){
            	  		 var twoByOneClanaderContainer ='<div>'
            	  			 						   +'<div id="firstMonthContainer"></div>'
            	  			 						   +'<div id="secondMonthContainer" style="margin-top:25px;"></div>'
            	  		 							   +'</div>';
            	  		$(baseElementEvents).replaceWith('<div id="'+baseElementEvents.substring(1)+'"></div>');
            	  		$(baseElementEvents).html(twoByOneClanaderContainer);
            	  		var flag={
				  				baseElement:"#firstMonthContainer",
				  				AssociationPhotoId:loadType.AssociationPhotoId,
	              				AssociationType:loadType.AssociationType,
	              				AssociationId:loadType.AssociationId,
	              				AssociationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
	              				currentDate:currentDate
				  		};
            	  		myCalendarThumbnail.init(flag);
            	  		
            	  		var flagNext={
				  				baseElement:"#secondMonthContainer",
				  				AssociationPhotoId:loadType.AssociationPhotoId,
	              				AssociationType:loadType.AssociationType,
	              				AssociationId:loadType.AssociationId,
	              				AssociationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
	              				currentDate:nextDate
				  		};
            	  		// added new js(nextMonthMyCalendarThumbnail.js)for loading second month calendar with events
            	  		// we have to override this by calling in single js file(as of now code is duplicated)
            	  		nextMonthMyCalendarThumbnail.init(flagNext);
            	  	 }else{
            	  		var html ='<div class="position-relative height-100-percent width-96-percent">'
         	                  +'  <div class="position-absolute onecolumn whitebg hide" id="events-view-container"></div>'
         		              +'</div>';
                  		 $(baseElementEvents).replaceWith('<div id='+baseElementEvents.substring(1)+'></div>');
                 	         $(baseElementEvents).after(html);
                           this.staticUI(baseElementEvents);
                           
                           var req = this.prepareServiceRequest(options);
                           this.serviceInvocation(req);
                           this.bindEvents();
            	  	 }
            
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
            			maxResult =7;
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
        			maxResult =7;
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
        			maxResult =7;
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
               			 successCallBack:myCalendarEventsTwoByOne.successCallBack,
               			 failureCallBack:myCalendarEventsTwoByOne.failureCallBack
               	 };
              	  return options;
              },
              successCallBack:function(requestInfo,data){
            	  
            	data.header = requestInfo.header;
  				data.selectedYearMonth = dateUtility.formatDate(currentDate,'MMM dd,yyyy');
  				
  				//Pending Invitations
  				if(loadType.isMyEvents){
  					 if(data.eventInvitationModels != undefined && data.eventInvitationModels.length == undefined){
  	            		  data.eventInvitationModels = [data.eventInvitationModels];
  	            	  }
  	            	  if(data.eventInvitationModels != undefined && data.eventInvitationModels.length != undefined ){
  	            		 data.ecount= data.eventsCount==0?0:data.eventsCount;
  	            		  for(var i=0;i<data.eventInvitationModels.length;i++){
  	  	  				    data.eventInvitationModels[i].startTime =   data.eventInvitationModels[i].eventScheduleFrom;
  	  	  			        data.eventInvitationModels[i].endTime =   data.eventInvitationModels[i].eventScheduleTo;
  	  	  				    
  	            		  }
  	            		  data.events =   data.eventInvitationModels;
  				   }
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
	  	  				data.events[i].startTime = new Date(data.events[i].startTime);
	  	  			    data.events[i].endTime = new Date(data.events[i].endTime);
  	  					var startDate = data.events[i].startTime;
  	  					
  	  					var endDate = data.events[i].endTime;
  	  				    
  	  				    data.ecount= data.eventsCount==0?0:data.eventsCount;
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
  	  					data.events[i].ecount = i;

  	  					data.events[i].displayEventDate = monthname+' '+dayOfEvent+' ,'+yearOfEvent+' | '+ startTime+' - '+endTime;
  	  				    if($.inArray($.trim(data.events[i].eventUniqueIdentifier),myCalendarEventsTwoByOne.eventUniqueIdentifiers) < 0){
  	  				    	myCalendarEventsTwoByOne.eventUniqueIdentifiers.push(data.events[i].eventUniqueIdentifier);
  	  				    }
  	  				    
                	  }
            	  }else{
            		  $("#noEvents").removeClass('hide');
            	  }
  				
                 myCalendarEventsTwoByOne.dynamicUI(data);
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
            	  
            	  var typeOfEvents = '';
            	  var htmlTemplate='<div class="pad-right-12 search-event2x1-section pad-top-25">'
				            	  +' <div class="col-xs-11">'
				            	  +'	<input class="input-textbox-eventsearch-height-width form-control" type="text" placeholder="Search {{typeOfEvents}}" id="eventSearch2x1"/>'
				            	  +' </div>'
				            	  +' <div class="col-xs-1 searchiconpad top-4">'
				            	  +'	<span class="search-sm-icons"></span>'
				            	  +' </div>'
				            	  +' </div> '
				            	  +' <div class="clear-float bold heading-15pt pad-trbl-10-20">From {{selectedYearMonth}}</div>' 
            	                  +'  <div class="clearfix hide default-message-style pad-left-10" id="noEventsContainerDiv">Sorry, there are no Events.</div><div class="search-event2x1-section pad-trbl-20-15 min-height-415">';
            		              //+'<div id="widgetHeader" class="bold pad-bot-5 heading-15pt">{{header}}</div>';
            	  
            	  if(data.events){
            		
            	     htmlTemplate +='{{#events}}'
            	  		          +'<div class="mar-bottom-10 eventNameClass pad-trbl-5 mar-left-10" eventName="{{eventName}}" title="{{eventName}}">'
		            	  			+'		<div class="sm-circle-blue" style="background-color:{{eventCategoryModel.categoryColorCode}}"></div>'
		            	  			+'		<span class="mar-bottom-10 position-relative top-minus-6"><a   class="event-name eventsloadedaftersearch" id="eventDetails_{{eventUniqueIdentifier}}" widgetType="{{widgetType}}" eventType="{{eventType}}" isPendingInvitation="'+loadType.isMyEvents+'" eventUniqueIdentifier="{{eventUniqueIdentifier}}" href="javascript:void(0)">{{modifiedEventName}}</a></span>'
		            	  			+'		<div class="mar-t0-l31 event-date">{{displayEventDate}}</div>'
		            	  			+'</div>'
		            	  			+'{{/events}}';
            	     
            	     if(data.ecount > 0){
            	     		 htmlTemplate +='</div><div style="display: inline-block; width: 100%; margin: auto;"><div id="totalDiv" class="font-10px helvetica-neue-roman left-28" style="display: inline; position: relative;  bottom: 0px;">Total <a href="javascript:void(0);" class="lightblue pad-left-5" widgetName="{{widgetName}}" id="myEventsTotalCountID" data-eventscount="' +data.ecount+'">(' +data.ecount+')</a></div>';
                     	 	
                     		  htmlTemplate +='<div style="display: inline; position: relative; left: 38px">'
            	    	 		  +'	<input id="createNewEvent2x1" value="New Event" class="def-button" type="button">'
            	    	          +' </div></div>'; 	
                     	}
                     else{
                     	  htmlTemplate +='<div class="text-center">'
            	    	 		  +'	<input id="createNewEvent2x1" value="New Event" class="def-button" type="button">'
            	    	          +' </div>';
                     }	
            	   
            	  }
    	  			else{
    	  				htmlTemplate +='<div class="default-message-style" id="noEvents">Sorry, there are no Events.</div>';
    	  			}
            	       htmlTemplate  +='<div id="newEventContainer2x1"> </div>';
	            	 if(loadType.isUpcomingEvents){
	          	    	 data.widgetType = 'isUpcomingEvents';
	          	    	 data.widgetName = 'upComingEvents';
	          	    	  typeOfEvents = 'Upcoming Events';
	          	     }/*else if(loadType.isPendingInvitation){
	          	    	 data.widgetType = 'isPendingInvitation';
	          	    	 data.widgetName = 'myEvents';
	          	     }*/else if(loadType.isDraftEvents){
	          	    	 data.widgetType = 'isDraftEvents';
	          	    	 data.widgetName = 'draftEvents';
	          	    	 typeOfEvents = 'Draft Events';
	          	     }else if(loadType.isMyEvents){
	          	    	 data.widgetType = 'isMyEvents';
	          	    	 data.widgetName = 'myEvents';
	          	    	  typeOfEvents = 'Pending Invitations';
	          	     }
	                  data['typeOfEvents'] = typeOfEvents;  
	            	 
          	      data.eventType =loadType.eventType;
            	  var recentEventsHtml = Mustache.to_html(htmlTemplate,data);
            	  $(baseElementEvents).empty();
  	  			  $(baseElementEvents).replaceWith( "<div id='jqxWidget' class='mCustomScrollbar height-250' widgetType='"+data.widgetType+"'></div>" );
  	  			  $(baseElementEvents).html(recentEventsHtml);
    	  			
    	  			
    	  			myCalendarEventsTwoByOne.bindEvents();
    	  			
              	},
              	
              	searchFunction:function(className,attributeName,ele){
        			var eles = $('.'+className);
        		     var value = $(ele).val().toLowerCase();
        		     var eventsCount = 0;
        		     for(var i=0;i<eles.length;i++){
        		    	 var eventName = $(eles[i]).attr(attributeName);
        		    	 if(eventName.toLowerCase().indexOf(value) > -1){
        		    		 $(eles[i]).removeClass('hide');
        		    		 eventsCount = eventsCount+1;
        		    	 }else{
        		    		 $(eles[i]).addClass('hide');
        		    	 }
        		     }
        		     if(eventsCount == 0){ 
        		    	 $("#noEventsContainerDiv").removeClass('hide');
        		    	 $('#totalDiv').addClass('hide');
        		    	 
        		    	 $("#noEvents").addClass('hide');
        		     }else{
        		    	 $("#noEventsContainerDiv").addClass('hide');
        		    	 $('#totalDiv').removeClass('hide');
        		    	 
        		    	 var tottalcount = $(".eventsloadedaftersearch:visible").length;
        		    	 
        		    	 if(eventsCount == tottalcount){
        		    		 $('#myEventsTotalCountID').html('('+eventsCount+')');
        		    	 }else{
        		    		 $('#myEventsTotalCountID').html('('+tottalcount+')');
        		    	 }
        		    	 
        		    	 if(value == ''){
        		    		 $('#myEventsTotalCountID').html('('+$('#myEventsTotalCountID').data('eventscount')+')');
        		    	 }
        		    	 
        		    	 //$('#myEventsTotalCountID').html('('+eventsCount+')');
        		    	 
        		    	 $("#noEvents").removeClass('hide');
        		     }
        		   
        		},
            
		             /**
		              *  bind operations performed on UI
		              */
	              bindEvents:function(){
	            	  
	            	  
	            	 // $("#eventSearch2x1").off('keypress').bind('keypress',function(e){
	            	  $("body").on('input','#eventSearch2x1',function(e){
	            		  myCalendarEventsTwoByOne.searchFunction('eventNameClass','eventName',this);
	            	  });
	      			 // });
	            	  
	            	  
	            	  $('#createNewEvent2x1').off('click').bind('click',function(e){
	            	    var statDateValue = new Date();
	      				var endDateValue = new Date();
	      				
	      				var startDate = new Date(statDateValue.getFullYear(),statDateValue.getMonth(), statDateValue.getDate(), 00,00, 00, 00);
	      				var endDate = new Date(endDateValue.getFullYear(),endDateValue.getMonth(), endDateValue.getDate(), 23,30, 00, 00);
	      				
	              		var options={
	              				ele:"#newEventContainer2x1",
	              				mode:'New',
	              				photoId:loadType.AssociationPhotoId,
	              				associationType:loadType.AssociationType,
	              				associationId:loadType.AssociationId,
	              				associationUniqueIdentifier:loadType.AssociationUniqueIdentifier,
	              				userName:userName,
	              				fromDate:startDate,
	              				toDate:endDate,
	              				onExit:function(){
	              					myCalendarEventsTwoByOne.init(loadType);
		        					
		        				}
	              		
	              		};
	              		Event.init(options);
	      			  });
	            	  
	            	  $('#myEventsTotalCountID').off('click').bind('click',function(){
	            		  
	            		  $('#minimize_maximize_Calendar_22').trigger('click');
	            		
	            		  var widgetName =  $(this).attr("widgetName");
	            		  
	            		  if(widgetName == 'myEvents'){
	            			  widgetName = 'myEvent';
	            		  }
	            		  
	            		  var clickEvent = '#'+widgetName+'2X2view';
	            		  
	            		  $(clickEvent).trigger('click');
	            		  
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
			        				eventIdentifiers:myCalendarEventsTwoByOne.eventUniqueIdentifiers,
			        				source:'CONNECTION',
			        				onExit:function(){
			        					
			    	        				myCalendarEventsTwoByOne.init(loadType);
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
            	  html ='<div class="hide default-message-style" id="noEvents">Sorry, there are no Events.</div>';
            	  $(element).append(html);
              }
              
       };
}.call(this);