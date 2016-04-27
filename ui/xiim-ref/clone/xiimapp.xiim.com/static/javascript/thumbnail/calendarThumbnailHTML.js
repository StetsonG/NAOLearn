/**
 * @author Next Sphere Technologies
 * Calendar thumb nail HTML 
 * 
 * 
 */

var courseThumbnail = function(){
	return{
		eventsDiv:function(){
			var htmlTemplate='';
			return htmlTemplate+='{{#events}}<li><a href="javascript:void();" id="showEvent-{{eventId}}">{{eventName}}<br/>{{eventTypeEnum}}<br/>{{location}}<br/>{{startTime}}-{{endTime}}</a></li>{{/events}}';
		},
		popoverContent:function(){
			var htmlTemplate='';
			return htmlTemplate+='<div class="events-holder">'
				+'{{#events}}'
				+'<div class="bottom-border mar-tb-10" >'
				+'{{#isCourseEvent}}'
				+'<div class="sm-circle-blue"></div>'
				+'{{/isCourseEvent}}'
				+'{{#isGroupEvent}}'
				+'<div class="sm-circle-blue"></div>'
				+'{{/isGroupEvent}}'
				+'{{#isPersonalEvent}}'
				+'<div class="sm-circle-grey"></div>'
				+'{{/isPersonalEvent}}'
				+'<a href="javascript:void();" id="showEvent-{{eventId}}">{{eventName}}</a>'
				+'<div class="mar-t4-l28">{{eventTypeEnum}} -- {{startTime}}-{{endTime}}</div>'
				+'</div>'
				+'{{/events}}'
				+'</div>';
		}
	};
}.call(this);;
			