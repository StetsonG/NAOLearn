/**
 * @author Next Sphere Technologies
 * Calendar Notification Widget
 * 
 * Calendar Notification widget will get all kinds of event notification with respect to personal  and groups
 * 
 * 
 */

var calendarEvents = function(){
var userId = $("#loggedInUserId-meta").val();
var accessToken = $("#accessToken_meta").val();
var langId = $("#langId_meta").val();
return{
		init:function(options){
			if(options.calendarEvents){
				
				var calendarPendingEventsRequest = calendarEvents.prepareServiceRequest("pendingInvitations");
				calendarEvents.pendingInvitationServiceInvocation(calendarPendingEventsRequest);
				
				var calendarEventsRequest = calendarEvents.prepareServiceRequest("upcoming");
				calendarEvents.serviceInvocation(calendarEventsRequest);
			}
		},
		prepareServiceRequest:function(type){
			if(type == "pendingInvitations"){
				var start = 0;
				var end = 10;
				var calendar_event_count = $("#calendar_event_count").text();
				if(calendar_event_count != '' && parseInt(calendar_event_count) >= 12){
					end = 12;
				}
				var pedndingInvitationsRequestOptions={
	      				url: contextPath+'/feeds/getFeeds',
	      				data:{startResult : start,endResult : end},
	      				requestInfo:{type:type},
	      				successCallBack:calendarEvents.calendarEventsNotificationsSuccessCallBack,
	      				async:true
	      		};
				return pedndingInvitationsRequestOptions;
			}else if(type == "upcoming"){
					var now = new Date(); 
					var today = new Date(now.getUTCFullYear(), now.getUTCMonth(),     now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()).getTime();
					var eventFilterCriteriaEnum = 'UPCOMING';
					today = calendarEvents.formatDate_yyyymmdd(today);
					
					var getUpcomingEventsFilter = {
								"userId": userId,
								"eventSearchCriteria": [
									{
										"eventSearchCriteria": "OFFSET",
										"eventSearchCriteriaValue": getOffset()
									},                   
									{
										"eventSearchCriteria": "CURRENTDATE",
										"eventSearchCriteriaValue": today
									}
								],
								"eventFilterCriteriaEnum": eventFilterCriteriaEnum,
								"pageCriteriaModel": {
									"pageSize": 12,
									"pageNo": 1,
									"isAll": false
								},
								"viewTypeEnum": "UPCOMINGEVENTS_VIEW",
								"accessToken": accessToken,
								"langId": langId
					 };
					getUpcomingEventsFilter = JSON.stringify(getUpcomingEventsFilter);
					 var calendarUpComingEventsNotificationsURL = getModelObject('serviceUrl')+$("#calendarUpComingEventsNotificationsURI").val();
					 var upcomingEventsRequestOptions={
			      				url: calendarUpComingEventsNotificationsURL,
			      				data:getUpcomingEventsFilter,
			      				requestInfo:{type:type},
			      				successCallBack:calendarEvents.calendarEventsNotificationsSuccessCallBack,
			      				async:true
			      	 };
					 return upcomingEventsRequestOptions;
			}
        },
        serviceInvocation : function(request){
        	doAjax.PostServiceInvocation(request);
        },
        pendingInvitationServiceInvocation : function(request){
        	doAjax.ControllerInvocation(request);
        },
        calendarEventsNotificationsSuccessCallBack : function(requestInfo,data){
        	if(requestInfo.type == "pendingInvitations"){
        		data = $.parseJSON(data);
				var eventAlerts = data['eventAlerts'];
				
				if( eventAlerts != undefined && eventAlerts.length == undefined ){
					eventAlerts = [eventAlerts];
				}
				
				var isOwner = false;
				if(eventAlerts != undefined && eventAlerts.length > 0){
					
					for(var i=0;i<eventAlerts.length;i++){
						
						var activityName = eventAlerts[i].activityName;
						eventAlerts[i].tooltipActivityName = eventAlerts[i].activityName;
						if(activityName.length>15){
							activityName = activityName.substr(0,15)+'...';
					    }
						eventAlerts[i].activityName = activityName;
						
						var profileName = eventAlerts[i].profileName;
						eventAlerts[i].tooltipProfileName = eventAlerts[i].profileName;
						if(profileName.length>15){
							profileName = profileName.substr(0,15)+'...';
					    }
						eventAlerts[i].profileName = profileName;
						
						var activityDescription = eventAlerts[i].activityDescription;
						eventAlerts[i].tooltipActivityDescription = eventAlerts[i].activityDescription;
						if(activityDescription != undefined && activityDescription.length>40){
							activityDescription = activityDescription.substr(0,40)+'...';
					    }
						eventAlerts[i].activityDescription = activityDescription;
						
						if(eventAlerts[i].feedMessage != undefined){
							eventAlerts[i].toolTipFeedMessage = eventAlerts[i].feedMessage;
							var len = (eventAlerts[i].feedMessage).length;
						    if(len>23){
						    	eventAlerts[i].feedMessage = (eventAlerts[i].feedMessage).substr(0,23)+'...';
						    }
						}
						
						eventAlerts[i].startTime = new Date(eventAlerts[i].activityStartTime+" UTC");
						eventAlerts[i].endTime = new Date(eventAlerts[i].activityEndTime+" UTC");
						
						calendarEvents.dateFormatUtility(eventAlerts[i]);
						
						if (eventAlerts[i].activityReferenceCategory == 'GROUP') {
							eventAlerts[i].isGroupEvent = true;
					    } else if (eventAlerts[i].activityReferenceCategory == 'PERSONAL') {
					    	eventAlerts[i].isPersonalEvent = true;
						} else if (eventAlerts[i].activityReferenceCategory == 'COURSE') {
					    	eventAlerts[i].isCourseEvent = true;
						}
						
						
						if(eventAlerts[i].activityType == 'EventInvited'){
							eventAlerts[i].isEventInvitation = true;
							if(eventAlerts[i].isRsvprequired == 1){
								eventAlerts[i].isRSVPRequired = true;
							}
						}
						if(eventAlerts[i].activityType =='EventRescheduled'){
							eventAlerts[i].isEventReschedule = true;
							
							if(eventAlerts[i].isRsvprequired == 1){
								eventAlerts[i].isRSVPRequired = true;
								
								if(eventAlerts[i].activityReferenceResponse == 'T'){
									eventAlerts[i].showAccept = true;
								}else{
									eventAlerts[i].showMaybe = true;
								}
							}/*else{
								eventAlerts[i].displayDelete = true;
							}*/
							eventAlerts[i].displayDelete = true;
						}
						if(eventAlerts[i].activityType == 'EventCancelled'){
							eventAlerts[i].isEventCalcel = true;
							eventAlerts[i].displayDelete =  true;
						}
						if(eventAlerts[i].activityType == 'EventUpdated'){
							eventAlerts[i].isEventUpdate = true;
							
							/*if(eventAlerts[i].isRsvprequired == 1){
								eventAlerts[i].isRSVPRequired = true;
							}else{*/
								//eventAlerts[i].displayDelete = true;
							//}
							
							if(eventAlerts[i].isRsvprequired == 1){
								eventAlerts[i].isRSVPRequired = true;
								
								if(eventAlerts[i].activityReferenceResponse == 'T'){
									eventAlerts[i].showAccept = true;
								}else{
									eventAlerts[i].showMaybe = true;
								}
							}/*else{
								eventAlerts[i].displayDelete = true;
							}*/
							eventAlerts[i].displayDelete = true;
						}
						
						if(eventAlerts[i].activityType == 'EventInvitationResponse'){
							eventAlerts[i].isEventInvitationResponse = true;
							eventAlerts[i].displayDelete =  true;
						}
						
						if(eventAlerts[i].activityPerformer == userId && eventAlerts[i].activityReferenceCategory == 'GROUP'){
							eventAlerts[i].isOwner = true;
							eventAlerts[i].showOptions=false;
						}else{
							eventAlerts[i].showOptions=true;
						}
						
					}
					
					calendarEvents.calendarNotificationsDynamicUI(data,"PENDING_INVITATIONS");
				}else{
					$("#calendar_events_pending_invitations_container").html('<span class="toolbar-element-name">No New Events.</span>');
				}
				
        	}else if(requestInfo.type == "upcoming"){
	        	var results = data['result'];
				var status = results['status'];
					if(status == 'true'){
						var eventsCount = data['eventsCount'];
						if(eventsCount > 0){
							var events = data['events'];
							
							if( events.length == undefined ){
								events = [events];
							}
							
							for(var i=0;i<events.length;i++){
								var upcomingEventName = events[i].eventName;
								events[i].tooltipUpcomingEventName = events[i].eventName;
								
								if(upcomingEventName.length>15){
									upcomingEventName = upcomingEventName.substr(0,15)+'...';
							    }
								events[i].eventName = upcomingEventName;
								
								var eventDesc = events[i].description;
								events[i].tooltipEventDesc = events[i].description;
								if(eventDesc != undefined && eventDesc.length>35){
									eventDesc = eventDesc.substr(0,35)+'...';
							    }
								events[i].description = eventDesc;
								
								events[i].startTime = calendarEvents.getUTCDateFromDateString(events[i].startTime);
								events[i].endTime = calendarEvents.getUTCDateFromDateString(events[i].endTime);
								calendarEvents.dateFormatUtility(events[i]);
								
								if (events[i].eventTypeEnum == 'GROUPEVENT') {
									events[i].isGroupEvent = true;
							    } else if (events[i].eventTypeEnum == 'PERSONAL_MEETING') {
							    	events[i].isPersonalEvent = true;
								}else if(events[i].eventTypeEnum == 'REMINDER'){
									events[i].isReminder = true;
								}else if(events[i].eventTypeEnum == 'COURSE_MEETING' || events[i].eventTypeEnum == 'COURSE_REMINDER'  || events[i].eventTypeEnum == 'COURSE_DEADLINE' || events[i].eventTypeEnum == 'COURSE_KEY_DATE' || events[i].eventTypeEnum == 'COURSE_SOCIAL_EVENT'){
									events[i].isCourseEvent = true;
								}
								
								if(events[i].rsvpEnum == 'AWAITING'){
									events[i].isOrginalDisplay = false;
								}else{
									events[i].isOrginalDisplay = true;
								}
								
								
								calendarEvents.calendarNotificationsDynamicUI(data,"UPCOMING");
							}
							
						}else{
							$("#upcoming_calendar_events_container").html('<span class="toolbar-element-name">No New Events.</span>');
						}
					}
				}
	        },
	        calendarNotificationsDynamicUI : function(data,type){
	        	if(type == 'UPCOMING'){
	        		var template = '{{#events}}';
					
					template += '<li class="clear-float min-height-80">'
						+   '<div class="col-xs-2">' 
						+     '{{#isCourseEvent}}'
						+'       {{#photoId}}'
		        		+'		    <img src="/contextPath/Course/{{photoId}}/stamp.jpg" class="radious-border" width="50"/>'
		        		+'       {{/photoId}}'
		        		+'       {{^photoId}}'
		        		+'  	    <img src="'+contextPath+'/static/pictures/defaultimages/french.png" class="radious-border" width="50"/>'
		        		+'       {{/photoId}}'
		        		+      '{{/isCourseEvent}}'						
						+     '{{#isGroupEvent}}'
						+'       {{#photoId}}'
		        		+'		    <img src="/contextPath/Group/{{photoId}}/profile.jpg" class="radious-border" width="50"/>'
		        		+'       {{/photoId}}'
		        		+'       {{^photoId}}'
		        		+'  	    <img src="'+contextPath+'/static/pictures/defaultimages/1.png" class="radious-border" width="50"/>'
		        		+'       {{/photoId}}'
		        		+      '{{/isGroupEvent}}'
		        		+     '{{#isPersonalEvent}}'
		        		+'       {{#photoId}}'
		        		+'		    <img src="/contextPath/User/{{photoId}}/profile.jpg" class="img-circle tool-bar-image"/>'
		        		+'       {{/photoId}}'
		        		+'       {{^photoId}}'
		        		+'  		<img src="'+contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg" class="img-circle tool-bar-image"/>'
		        		+'       {{/photoId}}'
		        		+      '{{/isPersonalEvent}}'
		        		+     '{{#isReminder}}'
		        		+'       {{#photoId}}'
		        		+'		    <img src="/contextPath/User/{{photoId}}/profile.jpg" class="img-circle tool-bar-image"/>'
		        		+'       {{/photoId}}'
		        		+'       {{^photoId}}'
		        		+'  		<img src="'+contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg" class="img-circle tool-bar-image"/>'
		        		+'       {{/photoId}}'
		        		+      '{{/isReminder}}'
						+    '</div>' 
						+    '<div class="col-xs-10 pad-left-10-important">'
						+	 '{{#isOrginalDisplay}}'	
						+         '<div class="toolbar-element-name mar-bot-5" title="{{tooltipUpcomingEventName}}">'
						+    '{{/isOrginalDisplay}}'
						+	 '{{^isOrginalDisplay}}'	
						+         '<div class="toolbar-element-name mar-bot-5" title="{{tooltipUpcomingEventName}}">'
						+    '{{/isOrginalDisplay}}'
						+			'{{eventName}}' 
						+          '</div>'   	
						+			'<div class="toolbar-element-content mar-bot-5">{{date}} | {{startTime}} - {{endTime}}</div>'
						+			'<div class="toolbar-element-content mar-bot-5" title="{{tooltipEventDesc}}">&nbsp;{{description}}</div>'  
						+     '</div>'
						+'</li>';
					
					template += '{{/events}}';
					var calenderUpcomingEventsNotificationsView = Mustache.to_html(template,data);
					$("#upcoming_calendar_events_container").html(calenderUpcomingEventsNotificationsView);
	        	}else if(type == 'PENDING_INVITATIONS'){
	        		var template = '{{#eventAlerts}}';
					template += '<li class="clear-float min-height-120">'
						+   '<div class="col-xs-2">'
						
						+     '{{#isCourseEvent}}'
						+'       {{#activityLogo}}'
		        		+'		    <img src="/contextPath/Course/{{activityLogo}}/profile.jpg" class="radious-border" width="50"/>'
		        		+'       {{/activityLogo}}'
		        		+'       {{^activityLogo}}'
		        		+'  	    <img src="'+contextPath+'/static/pictures/defaultimages/french.png" class="radious-border" width="50"/>'
		        		+'       {{/activityLogo}}'
		        		+      '{{/isCourseEvent}}'
		        		
						+     '{{#isGroupEvent}}'
						+'       {{#activityLogo}}'
		        		+'		    <img src="/contextPath/Group/{{activityLogo}}/profile.jpg" class="radious-border" width="50"/>'
		        		+'       {{/activityLogo}}'
		        		+'       {{^activityLogo}}'
		        		+'  	    <img src="'+contextPath+'/static/pictures/defaultimages/no-group-image.jpg" class="radious-border" width="50"/>'
		        		+'       {{/activityLogo}}'
		        		+      '{{/isGroupEvent}}'
		        		+     '{{#isPersonalEvent}}'
		        		+'       {{#photoId}}'
		        		+'		    <img src="/contextPath/User/{{photoId}}/profile.jpg" class="img-circle tool-bar-image"/>'
		        		+'       {{/photoId}}'
		        		+'       {{^photoId}}'
		        		+'  		<img src="'+contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg" class="img-circle tool-bar-image"/>'
		        		+'       {{/photoId}}'
		        		+      '{{/isPersonalEvent}}'
						+    '</div>' 
						+    '<div class="col-xs-10 min-height-80 pad-left-10-important">'
						+        '<div class="popup-processing hide" id="proocessing_event_notification_post_{{activityId}}">' 		
						+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
						+         '</div>'
						+         '<div class="toolbar-element-name  mar-bot-5" title="{{tooltipActivityName}}">'
						+			'{{activityName}}' 
						+			'{{#displayDelete}}'
						+'				<span class="trash-icons-sm enabled-sm margin-top-0 text-right pull-right deleteCalendarCancelEvent" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}" activityId="{{activityId}}" activityType="{{activityType}}"></span>'
						+			'{{/displayDelete}}'
						+          '</div>'   
						+'       {{#isEventInvitation}}'
						+           '<div class="toolbar-element-content mar-bot-5" title="Invited by {{tooltipProfileName}}">Invited by {{profileName}}</div>'
		        		+'       {{/isEventInvitation}}'
		        		+'       {{#isEventReschedule}}'
						+           '<div class="toolbar-element-content mar-bot-5" title="Event Reschedule by {{tooltipProfileName}}">Event Reschedule by {{profileName}}</div>'
		        		+'       {{/isEventReschedule}}'
		        		+'       {{#isEventCalcel}}'
						+           '<div class="toolbar-element-content mar-bot-5" title="Event Canceled by {{tooltipProfileName}}">Event Canceled by {{profileName}}</div>'
		        		+'       {{/isEventCalcel}}'
		        		+'       {{#isEventUpdate}}'
						+           '<div class="toolbar-element-content mar-bot-5" title="Event Updated by {{tooltipProfileName}}">Event Updated by {{profileName}}</div>'
		        		+'       {{/isEventUpdate}}'
		        		+'       {{#isEventInvitationResponse}}'
						+           '<div class="toolbar-element-content mar-bot-5" title="{{toolTipFeedMessage}} {{tooltipProfileName}}">{{toolTipFeedMessage}} {{profileName}}</div>'
		        		+'       {{/isEventInvitationResponse}}'
						+			'<div class="toolbar-element-content mar-bot-5">{{date}} | {{startTime}} - {{endTime}}</div>'
						+'        {{#activityDescription}}'
						+			'<div class="toolbar-element-content mar-bot-5" title="{{tooltipActivityDescription}}">&nbsp;{{activityDescription}}</div>'
						+'         {{/activityDescription}}'
						+'        {{^activityDescription}}'
						+'         <div class="font-16">&nbsp;</div>'
						+'         {{/activityDescription}}'
						/*+     '</div>'
						+     '<div>'*/
						+'       {{#isEventInvitation}}'
						+'       {{#showOptions}}'
						+'       {{#isRSVPRequired}}'
		        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'				RSVP'
		        		+'			</div>'
		        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" actionType="maybe" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}"  activityType="{{activityType}}" activityId="{{activityId}}" class="eventInvitation pad-right-5"/>MayBe'
		        		+'			</div>'
		        		+'       {{/isRSVPRequired}}'
						+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" actionType="accept" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}" activityId="{{activityId}}" class="eventInvitation pad-right-5"/>Accept'
		        		+'			</div>'
		        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" actionType="decline" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}" activityId="{{activityId}}" class="eventInvitation pad-right-5"/>Decline'
		        		+'			</div>'
		        		+'       {{/showOptions}}'
		        		+'       {{/isEventInvitation}}'
		        		+       '</div>'
		        		+'       {{#isEventUpdate}}'
		        		+'       {{#showOptions}}'
						+'       {{#isRSVPRequired}}'
		        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'				RSVP'
		        		+'			</div>'
		        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'              {{#showAccept}}'
		        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" actionType="accept" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}"  activityType="{{activityType}}" activityId="{{activityId}}" class="eventUpdate pad-right-5"/>Accept'
		        		+'              {{/showAccept}}'
		        		+'              {{#showMaybe}}'
		        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" actionType="maybe" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}"  activityType="{{activityType}}" activityId="{{activityId}}" class="eventUpdate pad-right-5"/>MayBe'
		        		+'              {{/showMaybe}}'
		        		+'			</div>'
		        		+'       {{/isRSVPRequired}}'
		        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" actionType="decline" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}" activityId="{{activityId}}" class="eventUpdate pad-right-5"/>Decline'
		        		+'			</div>'
		        		+'       {{/showOptions}}'
		        		+'       {{/isEventUpdate}}'
		        		+'       {{#isEventReschedule}}'
		        		+'       {{#showOptions}}'
						+'       {{#isRSVPRequired}}'
		        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'				RSVP'
		        		+'			</div>'
		        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'              {{#showAccept}}'
		        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" actionType="accept" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}"  activityType="{{activityType}}" activityId="{{activityId}}" class="eventReschedule pad-right-5"/>Accept'
		        		+'              {{/showAccept}}'
		        		+'              {{#showMaybe}}'
		        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" actionType="maybe" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}"  activityType="{{activityType}}" activityId="{{activityId}}" class="eventReschedule pad-right-5"/>MayBe'
		        		+'              {{/showMaybe}}'
		        		+'			</div>'
		        		+'       {{/isRSVPRequired}}'
		        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
		        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" actionType="decline" postId="{{postId}}" activityReferenceCategory="{{activityReferenceCategory}}" activityId="{{activityId}}" class="eventReschedule pad-right-5"/>Decline'
		        		+'			</div>'
		        		+'       {{/showOptions}}'
		        		+'       {{/isEventReschedule}}'
		        		+       '</div>'
						+'</li>';
					
					template += '{{/eventAlerts}}';
					var calenderPendingEventsNotificationsView = Mustache.to_html(template,data);
					$("#calendar_events_pending_invitations_container").html(calenderPendingEventsNotificationsView);
	        	}
	        	calendarEvents.bindEvents();
        },
        bindEvents : function(){
        	$(".eventInvitation").off("click").off("click").bind("click",function(){
        		$(".eventInvitation").attr({'src':contextPath+'/static/pictures/def-radio.png'});
        		$(this).attr({'src':contextPath+'/static/pictures/checked-radio.png'});
        		
        		var eventId = $(this).attr('activityId');
		    	var statementId = $(this).attr('postId');
		    	var eventType = "EventInvited";
		    	var activityReferenceCategory = $(this).attr('activityReferenceCategory');
        		var actionType = $(this).attr('actionType');
        		var eventStatusEnum = null;
        		var notificationType = null;
        		
        		if(actionType == 'accept'){
        			eventStatusEnum = "ACCEPT";
        		}else if(actionType == 'decline'){
        			eventStatusEnum = "DECLINE";
        		}else if(actionType == 'maybe'){
        			eventStatusEnum = "TENTATIVE";
        		}
        		
        		if(activityReferenceCategory == "GROUP"){
	    			notificationType = 3;
	    		}else if(activityReferenceCategory == "PERSONAL"){
	    			notificationType = 8;
	    		}
        		$("#proocessing_event_notification_post_"+eventId).removeClass('hide');
        		calendarEvents.manageCalendarEvent(eventId,eventStatusEnum,statementId,notificationType,eventType);
        	});
        	
        	
        	$(".eventUpdate").off("click").off("click").bind("click",function(){
        		$(".eventUpdate").attr({'src':contextPath+'/static/pictures/def-radio.png'});
        		$(this).attr({'src':contextPath+'/static/pictures/checked-radio.png'});
        		
        		var eventId = $(this).attr('activityId');
		    	var statementId = $(this).attr('postId');
		    	var eventType = "EventUpdated";
		    	var activityReferenceCategory = $(this).attr('activityReferenceCategory');
        		var actionType = $(this).attr('actionType');
        		var eventStatusEnum = null;
        		var notificationType = null;
        		
        		if(actionType == 'accept'){
        			eventStatusEnum = "ACCEPT";
        		}else if(actionType == 'decline'){
        			eventStatusEnum = "DECLINE";
        		}else if(actionType == 'maybe'){
        			eventStatusEnum = "TENTATIVE";
        		}
        		
        		if(activityReferenceCategory == "GROUP"){
        			notificationType = 5;
	    		}else if(activityReferenceCategory == "PERSONAL"){
	    			notificationType = 10;
	    		}
        		$("#proocessing_event_notification_post_"+eventId).removeClass('hide');
        		calendarEvents.manageCalendarEvent(eventId,eventStatusEnum,statementId,notificationType,eventType);
        	});
        	
        	$(".eventReschedule").off("click").off("click").bind("click",function(){
        		$(".eventReschedule").attr({'src':contextPath+'/static/pictures/def-radio.png'});
        		$(this).attr({'src':contextPath+'/static/pictures/checked-radio.png'});
        		
        		var eventId = $(this).attr('activityId');
		    	var statementId = $(this).attr('postId');
		    	var eventType = "EventRescheduled";
		    	var activityReferenceCategory = $(this).attr('activityReferenceCategory');
        		var actionType = $(this).attr('actionType');
        		var eventStatusEnum = null;
        		var notificationType = null;
        		
        		if(actionType == 'accept'){
        			eventStatusEnum = "ACCEPT";
        		}else if(actionType == 'decline'){
        			eventStatusEnum = "DECLINE";
        		}else if(actionType == 'maybe'){
        			eventStatusEnum = "TENTATIVE";
        		}
        		
        		if(activityReferenceCategory == "GROUP"){
        			notificationType = 4;
	    		}else if(activityReferenceCategory == "PERSONAL"){
	    			notificationType = 9;
	    		}
        		$("#proocessing_event_notification_post_"+eventId).removeClass('hide');
        		calendarEvents.manageCalendarEvent(eventId,eventStatusEnum,statementId,notificationType,eventType);
        	});
        	
        	$(".deleteCalendarCancelEvent").off("click").off("click").bind("click",function(){
		    	var statementId = $(this).attr('postId');
		    	var eventId = $(this).attr('activityId');
        		$("#proocessing_event_notification_post_"+eventId).removeClass('hide');
		    	var activityReferenceCategory = $(this).attr('activityReferenceCategory');
        		var eventStatusEnum = "OK";
        		var notificationType = null;
        		var activityType = $(this).attr('activityType');
        		
        		if(activityType == 'EventInvitationResponse'){
        			notificationType = 26;
        		}else if(activityType == 'EventRescheduled'){
        			if(activityReferenceCategory == "GROUP"){
        				 notificationType = 4;
		    		}else if(activityReferenceCategory == "PERSONAL"){
		    			notificationType = 9;
		    		}
        		}else if(activityType == 'EventUpdated'){
        			if(activityReferenceCategory == "GROUP"){
        				notificationType = 5;
		    		}else if(activityReferenceCategory == "PERSONAL"){
		    			notificationType = 10;
		    		}
        		}else {
	        		if(activityReferenceCategory == "GROUP"){
		    			notificationType = 6;
		    		}else if(activityReferenceCategory == "PERSONAL"){
		    			notificationType = 11;
		    		}
        		}
        		var manageEventRequest = {
						statementId:encodeURIComponent(statementId),
						groupStatusEnum:eventStatusEnum,
						notificationType:notificationType,
						userId:userId
				};
	    		var options = {
						url: contextPath+'/feeds/manageOtherAlerts',
	      				data:manageEventRequest,
	      				successCallBack:calendarEvents.manageClaendarNotificationSuccessCallBack,
	      				async:true
	      		};
	      		doAjax.ControllerInvocation(options);
        	});
        	
        },
        manageCalendarEvent : function(eventId,eventStatusEnum,statementId,notificationType,eventType){
        	var data = {langId:langId,
        				accessToken:accessToken,
        				userId:userId,
        				eventInvitationRequestId:eventId,
        				invitationRequestActionEnum:eventStatusEnum
        			};
        	data = JSON.stringify(data);
        	var requestInfo = {
    				eventInvitationRequestId:eventId,
    				invitationRequestActionEnum:eventStatusEnum,
    				statementId:statementId,
    				notificationType:notificationType,
    				eventType:eventType
        	};
        	var manageEventURL = getModelObject('serviceUrl')+$("#eventNotificationsURI").val();
        	var manageEventRequest = {
        			url: manageEventURL,
      				data:data,
      				requestInfo:requestInfo,
      				successCallBack:calendarEvents.manageEventSuccessCallBack,
      				async:true
        	};
        	
        	doAjax.PostServiceInvocation(manageEventRequest);
        },
        manageEventSuccessCallBack : function(requestInfo,data){
        	//data = $.parseJSON(data);
        	var results = data['result'];
			var status = results['status'];
			var isStatusUpdated = data['isSuccess'];
			if(status == 'true' && isStatusUpdated == 'true'){
				/*var manageEventRequest = {
						statementId:encodeURIComponent(requestInfo.statementId),
						groupStatusEnum:requestInfo.invitationRequestActionEnum,
						notificationType:requestInfo.notificationType,
						userId:userId
				};
	    		var options = {
						url: contextPath+'/feeds/manageOtherAlerts',
	      				data:manageEventRequest,
	      				successCallBack:calendarEvents.manageClaendarNotificationSuccessCallBack,
	      				async:true
	      		};
	      		doAjax.ControllerInvocation(options);*/
				var options = {
     		 			calendarEvents:true,
        		};
        		calendarEvents.init(options);
        		
        		
        		// To Update the DashBoard Invitations
        		if(parseInt($('#1').attr('data-sizex'))==2 && parseInt($('#1').attr('data-sizey'))==2){
        			if($("#headerSpanContainer").attr('widgetType') == 'isMyEvents'){
  						$("#myEvent2X2view").trigger('click');
  					}
  					
  					if(requestInfo.invitationRequestActionEnum == 'DECLINE'){
  						if($("#headerSpanContainer").attr('widgetType') == 'isUpcomingEvents'){
  	  						$("#upComingEvents2X2view").trigger('click');
  	  					}
  					}
        			
  				}else if(parseInt($('#1').attr('data-sizex'))==1 && parseInt($('#1').attr('data-sizey'))==2){
  					if($("#jqxWidget").attr('widgetType') == 'isMyEvents'){
  						$("#pendingEventsInvitationsHyperLinkID").trigger('click');
  					}
  					
  					if(requestInfo.invitationRequestActionEnum == 'DECLINE'){
  						if($("#jqxWidget").attr('widgetType') == 'isUpcomingEvents'){
  	  						$("#upComingEventsHyperLinkID").trigger('click');
  	  					}
  					}
  				}else{
  					if($("#widgetHeader").attr('widgetType') == 'isMyEvents'){
  						$("#pendingEventsInvitationsHyperLinkID").trigger('click');
  					}
  					
  					if(requestInfo.invitationRequestActionEnum == 'DECLINE'){
  						if($("#widgetHeader").attr('widgetType') == 'isUpcomingEvents'){
  	  						$("#upComingEventsHyperLinkID").trigger('click');
  	  					}
  						
  						if($("#widgetHeader").length == 0){
  							$("#myCalendarHyperLinkID").trigger('click');
  						}
  					}
  				}
        		
			}
        },
        manageClaendarNotificationSuccessCallBack : function(data){
        	if(data){
        		var options = {
     		 			calendarEvents:true,
        		};
        		calendarEvents.init(options);
        	}
        },
        dateFormatUtility : function(event){
        	var startTime =  new Date(event.startTime);
        	var endTime = new Date(event.endTime);
        	
        	var date1 = startTime.getDate();
        	var date2 = endTime.getDate();

        	var month1 = startTime.getMonth();
        	var month2 = endTime.getMonth();

        	var year1 = startTime.getFullYear();
        	var year2 = endTime.getFullYear();
        	
        	var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        	               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        	
        	//var startDate = months[month1]+' '+ date1 +','+ ' '+year1;
        	//event.startDate = startDate;
        	
        	var startDate = months[month1]+' '+ date1;
        	
        	var endDate = '';
        	
        	if( year2 - year1 > 0 || month2 - month1 > 0 ||  date2 - date1 > 0){
        		//endDate = months[month2]+' '+ date2 +','+ ' '+year2;
        		endDate = months[month2]+' '+ date2;
        	}
        	//event.endDate = endDate;
        	
        	startTime = calendarEvents.getTimeFormat(startTime);
        	endTime = calendarEvents.getTimeFormat(endTime);
        	
        	event.startTime = startTime;
        	event.endTime = endTime;
        	
        	event.date = startDate;
        	if(endDate != ''){
        		event.date = startDate +' - '+endDate;
        	}
        },
        getTimeFormat : function(date){
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
        getUTCDateFromDateString: function(dateString){
	   	   	 var start_yyyy = dateString.substring(0,4);
	   	   	 var start_mm = dateString.substring(5,7);
	   	   	 var start_date = dateString.substring(8,10);
	   	   	 var start_HH = dateString.substring(11,13);
	   	   	 var start_MM = dateString.substring(14,16);
	   	   	 var date = new Date(Date.UTC(start_yyyy,start_mm-1,start_date,start_HH,start_MM));
	   	   	 return date;
   	   	},
        formatDate_yyyymmdd :  function(date) {         

        	date = new Date(date);
            var yyyy = date.getFullYear().toString();                                    
            var MM = (date.getMonth()+1).toString(); // getMonth() is zero-based         
            var dd  = date.getDate().toString();  
            var hh  = date.getHours().toString();  
            var mm  = date.getMinutes().toString();  
            var ss  = date.getSeconds().toString();  
            
            return yyyy + '-' + (MM[1]?MM:"0"+MM[0]) + '-' + (dd[1]?dd:"0"+dd[0]) + ' ' + (hh[1]?hh:"0"+hh[0]) + ':' + (mm[1]?mm:"0"+mm[0]) + ':' + (ss[1]?ss:"0"+ss[0]);
        }
	};
}.call(this);