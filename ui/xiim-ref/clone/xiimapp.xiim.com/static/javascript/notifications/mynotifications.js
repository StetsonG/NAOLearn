/**
 * @author Next Sphere Technologies
 * MyNotification Widget
 * 
 * MyNotification widget will get all kinds of response which performed by connections with in group or connections
 * 
 * 
 */


var myNotifications = function(){
var userId = $("#loggedInUserId-meta").val();
var  is2X2 = false;
var dashboardConnections = false;
var dashboardGroups = false;
var dashboardAll = false;
//var manageElement = null;
return{
		defaults:{
			
		},
		init:function(options){
			is2X2 = options.is2X2;
			if(options.is2X2){
				//manageElement = options.element;
				myNotifications.dashBoardStaticUI(options.element);
				if(options.isConnections){
					dashboardConnections = options.isConnections;
					dashboardGroups = false;
					dashboardAll =  false;
					
					myNotifications.activeRespectiveOption("#2x2_my_notifications_connections");
					
					var request = myNotifications.prepareServiceRequest(is2X2);
					myNotifications.controllerInvocation(request);
					if(options.fromHeader){
						$('html, body').animate({
			                scrollTop: $("#my_notifications_2X2_view").offset().top-120
			            }, 300);
					}
					
				}else if(options.isGroups){
					dashboardGroups = options.isGroups;
					dashboardConnections = false;
					dashboardAll =  false;
					
					myNotifications.activeRespectiveOption("#2x2_my_notifications_groups");
					
					var request = myNotifications.prepareServiceRequest(is2X2);
					myNotifications.controllerInvocation(request);
					if(options.fromHeader){
						$('html, body').animate({
			                scrollTop: $("#my_notifications_2X2_view").offset().top-120
			            }, 300);
					}
					
				}else{
					dashboardAll =  true;
					dashboardGroups = false;
					dashboardConnections = false;
					
					myNotifications.activeRespectiveOption("#2x2_my_notifications_all");
					
					var request = myNotifications.prepareServiceRequest(is2X2);
					myNotifications.controllerInvocation(request);
					
				}
			}else{
				$("#my_notifications_2X2_view").addClass('hide');
				var request = myNotifications.prepareServiceRequest(is2X2);
				myNotifications.controllerInvocation(request);
			}
		},
		prepareServiceRequest:function(isTwoByTwo){
			if(isTwoByTwo){
				var data = { 
	        			receiverType : "MYNOTIFICATIONS2X2"
	        	};
				var requestOptions={
	      				url: contextPath+'/feeds/getFeeds',
	      				data:data,
	      				completeCallBack:myNotifications.completeCallBack,
	      				successCallBack:myNotifications.dashBoardSuccessCallBack,
	      				async:true
	      		};
				return requestOptions;
			}else{
				var data = { 
	        			receiverType : "MYNOTIFICATIONSTOOLBAR"
	        	};
				var requestOptions={
	      				url: contextPath+'/feeds/getFeeds',
	      				data:data,
	      				completeCallBack:myNotifications.completeCallBack,
	      				successCallBack:myNotifications.toolBarSuccessCallBack,
	      				async:true
	      		};
				return requestOptions;
			}
        },
		controllerInvocation:function(request){
			doAjax.ControllerInvocation(request);
        },
        dashBoardSuccessCallBack:function(data){
        	if(dashboardConnections){
        		myNotifications.renderNotifications(data,"connection2x2");
        	}else if(dashboardGroups){
        		myNotifications.renderNotifications(data,"group2x2");
        	}else if(dashboardAll){
        		myNotifications.render2X2AllNotifications(data);
        	}
        },
        toolBarSuccessCallBack:function(data){
        	myNotifications.renderNotifications(data,"toolbar");
        },
        formatDate : function(date) {
        	var h=date.getHours();
            var m=date.getMinutes();
            var s=date.getSeconds();
          
            var ampm=h >= 12 ? 'pm' : 'am';
            h = h % 12;
            h= h ? h : 12;
            m = m < 10 ? '0'+m : m;
            s = s <10 ? '0'+s: s;

            return h+':'+m+' '+ampm;
        },
        completeCallBack:function(data){
        	
        },
		dashBoardStaticUI:function(element){
		var staticTemplate = 	'<div class="width-613 min-height-613">'  
								+	 '<div class="pad-12">'
								+	   '<div class="pad-bot-12">'
								+		 '<div class="col-xs-2">' 
								+		 '</div>'
								+		 '<div class="col-xs-8 text-center darkgrey  font-18">My Notifications</div>'
								+		 '<div class="col-xs-2 pull-right">'
								+		   '<div class="text-right">'
								+				 '<span class="close-sm-icons selected-sm mynotificationswindowclass" onclick="myNotifications.close2x2MyNotifications(this);"></span>'
								+		   '</div>'
								+		 '</div>'
								+	   '</div>'
								+	 '</div>'                        
								+	  '<div class="clear-float min-height-500 pad-bot-10">'                          
								+		 '<div class="pad-lr-12 mygroups-section">'  
								+			 '<div class="mar-tb-10">'                                    
								+				 '<div class="garoup-menus darkgreybottomborder darkgreytopborder">'
								+					 '<ul id="2x2_my_notifications_options">'
								+						 '<li><a href="javascript:void(0);" class="font-16px warmgreylink"><span id="2x2_my_notifications_all">All</span></a></li>'
								+						 '<li><a href="javascript:void(0);" class="font-16px warmgreylink"><span id="2x2_my_notifications_groups">Groups</span></a></li>'
								+						 '<li><a href="javascript:void(0);" class="font-16px warmgreylink"><span id="2x2_my_notifications_connections">Connections</span></a></li>'
								+					 '</ul>'                                           
								+				 '</div>'
								+			 '</div>'
								+			'<div class="popup-processing hide" id="my_notifications_2x2_processing"><img src="'+contextPath+'/static/pictures/animated-processing.gif"/></div>'
								+			 '<div id="notificationdisplaydiv">'
								+			 '</div>'
								+			 '<div class="text-right mar-top-12"><input value="Clear All" class="def-button small-button font-17 mar-right-30 hide" type="button" id="clearAllButton"></div>'   
								+		 '</div>'                                                
								+	'</div>'
								+'</div>';
				$(element).html(staticTemplate);
		},
		myNotification2X2DynamicUI:function(data){
			if(dashboardConnections){
				if(data.connectionMyNotifications.length >0){
				var connections2x2template = '{{#connectionMyNotifications}}';
				connections2x2template += 	'<div class="mar-tb-20 min-height-100 2x2Connections" divid="{{postId}}">'
										+   '<div class="col-xs-2">'
										+'  {{#photoId}}'
						        		+'		<img src="/contextPath/User/{{photoId}}/profile.jpg" class="img-circle" width="85%"/>'
						        		+'   {{/photoId}}'
						        		+'   {{^photoId}}'
						        		+'  	<img src="'+contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg" class="img-circle" width="85%"/>'
						        		+'   {{/photoId}}'
										+	'</div>'           
										+   '<div class="col-xs-9">'
										+        '<div class="popup-processing hide" id="proocessing_2x2_post_{{postId}}">' 		
										+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
										+         '</div>'
										+     '{{#connectionMyNotificationIsAcceptRequestActivity}}'
										+      '<div>'
										+       	'<div class=" pad-left-10">'
										+           	'<span class="font-20 bold"><a href="javascript:void(0)" id="{{profileUniqueIdentifier}}" class="element-font-15 profileDisplay" title="{{toolTipProfileName}}">{{profileName}}</a></span><span class="pull-right toolbar-element-content">{{displayPostedDate}}</span>'
										+			'</div>'
										+       	'<div class="pad-12  toolbar-element-content" title="{{toolTipFeedMessage}} {{toolTipProfileName}}">'
										+				'{{feedMessage}} {{profileName}}'
										+			'</div>'                                                
										+       '</div>'
										+      '{{/connectionMyNotificationIsAcceptRequestActivity}}'
										+    '</div>'
										+    '<div class="col-xs-1 text-center"><span class="trash-icons-sm enabled-sm delete2x2MyNotificationConnection" id="{{postId}}" myNotificationType="23"></span></div>'										 
										+'</div>';
					connections2x2template += '{{/connectionMyNotifications}}';
					var connectionS2X2MyNotificationsView = Mustache.to_html(connections2x2template,data);
					$("#notificationdisplaydiv").html(connectionS2X2MyNotificationsView);
					var xiimcustomScrollbarOptions = {elementid:"#notificationdisplaydiv",isUpdateOnContentResize:true,setHeight:"450px",vertical:'y'};
					xiimcustomScrollbar(xiimcustomScrollbarOptions);
					
					$("#clearAllButton").removeClass('hide');
				}else{
					$("#clearAllButton").addClass('hide');
					$("#notificationdisplaydiv").html('<div class="default-message-style">No new notifications.</div>');
				}
			}else if(dashboardGroups){
				if(data.groupMyNotifications.length >0){
					var groups2x2Template = '{{#groupMyNotifications}}';
					    groups2x2Template  += 	'<div class="mar-tb-20 min-height-100 2x2Groups" divid="{{postId}}">'
										+   '<div class="col-xs-2">'
										+'  {{#activityLogo}}'
						        		+'		<img src="/contextPath/Group/{{activityLogo}}/profile.jpg" class="my-groups-image"/>'
						        		+'   {{/activityLogo}}'
						        		+'   {{^activityLogo}}'
						        		+'  	<img src="'+contextPath+'/static/pictures/no-group-image.jpg" class="my-groups-image"/>'
						        		+'   {{/activityLogo}}'
										+	'</div>'
										+     '{{#groupMyNotificationIsChangeOwnerActivity}}'
										+   '<div class="col-xs-9">'
										+        '<div class="popup-processing hide" id="proocessing_2x2_post_{{postId}}">' 		
										+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
										+         '</div>'
										+      '<div>'
										+       	'<div class=" pad-left-10">'
										+           	'<span class="font-20 bold"><a href="'+contextPath+'/group/{{activityUniqueIdentifer}}" class="element-font-15" title="{{toolTipActivityName}}">{{activityName}}</a></span><span class="pull-right toolbar-element-content">{{displayPostedDate}}</span>'
										+			'</div>'
										+       	'<div class="pad-12  toolbar-element-content" title="{{toolTipProfileName}} {{toolTipFeedMessage}}">'
										+				'{{profileName}} {{feedMessage}}'
										+			'</div>'  
										+       '</div>'
										+    '</div>'
										+    '<div class="col-xs-1 text-center"><span class="trash-icons-sm enabled-sm delete2x2MyNotificationChangeOwner" id="{{postId}}" myNotificationType="24"></span></div>'
										+    '{{/groupMyNotificationIsChangeOwnerActivity}}'
										+     '{{#groupMyNotificationMmberDeleted}}'
										+   '<div class="col-xs-9">'
										+        '<div class="popup-processing hide" id="proocessing_2x2_post_{{postId}}">' 		
										+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
										+         '</div>'
										+      '<div>'
										+       	'<div class=" pad-left-10">'
										+           	'<span class="font-20 bold"><a href="'+contextPath+'/group/{{activityUniqueIdentifer}}" class="element-font-15" title="{{toolTipActivityName}}">{{activityName}}</a></span><span class="pull-right toolbar-element-content">{{displayPostedDate}}</span>'
										+			'</div>'
										+       	'<div class="pad-12  toolbar-element-content" title="{{toolTipFeedMessage}} {{toolTipActivityName}}">'
										+				'{{feedMessage}} {{activityName}}'
										+			'</div>'  
										+       '</div>'
										+    '</div>'
										+    '<div class="col-xs-1 text-center"><span class="trash-icons-sm enabled-sm delete2x2MyNotificationGroupMemberDelete" id="{{postId}}" myNotificationType="20"></span></div>'
										+    '{{/groupMyNotificationMmberDeleted}}'
										+     '{{#groupMyNotificationIsGroupInvitationResponse}}'
										+   '<div class="col-xs-9">'
										+        '<div class="popup-processing hide" id="proocessing_2x2_post_{{postId}}">' 		
										+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
										+         '</div>'
										+      '<div>'
										+       	'<div class=" pad-left-10">'
										+           	'<span class="font-20 bold"><a href="'+contextPath+'/group/{{activityUniqueIdentifer}}" class="element-font-15" title="{{toolTipActivityName}}">{{activityName}}</a></span><span class="pull-right toolbar-element-content">{{displayPostedDate}}</span>'
										+			'</div>'
										+       	'<div class="pad-12  toolbar-element-content" title="{{toolTipFeedMessage}} {{toolTipProfileName}}">'
										+				'{{feedMessage}} {{profileName}}'
										+			'</div>'  
										+       '</div>'
										+    '</div>'
										+    '<div class="col-xs-1 text-center"><span class="trash-icons-sm enabled-sm delete2x2MyNotificationGroupInvitation" id="{{postId}}" myNotificationType="25"></span></div>'
										+    '{{/groupMyNotificationIsGroupInvitationResponse}}'
										+'</div>';
					    groups2x2Template += '{{/groupMyNotifications}}';
					    var groups2X2MyNotificationsView = Mustache.to_html(groups2x2Template,data);
						$("#notificationdisplaydiv").html(groups2X2MyNotificationsView);
						var xiimcustomScrollbarOptions = {elementid:"#notificationdisplaydiv",isUpdateOnContentResize:true,setHeight:"450px",vertical:'y'};
						xiimcustomScrollbar(xiimcustomScrollbarOptions);
						$("#clearAllButton").removeClass('hide');
				}else{
					$("#clearAllButton").addClass('hide');
					$("#notificationdisplaydiv").html('<div class="toolbar-element-name">No new notifications.</div>');
				}
			}else if(dashboardAll){
				if(data.allMyNotifications.length >0){
					var allMyNotificationsTemplate2x2template = '{{#allMyNotifications}}';
					allMyNotificationsTemplate2x2template += 	'<div class="mar-tb-20 min-height-100 2x2All" divid="{{postId}}">'
															+   '<div class="col-xs-2">'
															+     '{{#connectionMyNotificationIsAcceptRequestActivity}}'
															+         '{{#photoId}}'
															+		      '<img src="/contextPath/User/{{photoId}}/profile.jpg" class="img-circle" width="85%"/>'
															+         '{{/photoId}}'
															+         '{{^photoId}}'
															+   	     '<img src="'+contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg" class="img-circle" width="85%"/>'
															+         '{{/photoId}}'
															+      '{{/connectionMyNotificationIsAcceptRequestActivity}}'
															+     '{{^connectionMyNotificationIsAcceptRequestActivity}}'
															+         '{{#activityLogo}}'
															+             '<img src="/contextPath/Group/{{activityLogo}}/profile.jpg" class="my-groups-image"/>'
															+         '{{/activityLogo}}'
															+         '{{^activityLogo}}'
															+             '<img src="'+contextPath+'/static/pictures/no-group-image.jpg" class="my-groups-image"/>'
															+         '{{/activityLogo}}'
															+     '{{/connectionMyNotificationIsAcceptRequestActivity}}'
															+	'</div>' 
															+     '{{#connectionMyNotificationIsAcceptRequestActivity}}'										
															+   	'<div class="col-xs-9">'
															+        '<div class="popup-processing hide" id="proocessing_2x2_post_{{postId}}">' 		
															+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
															+         '</div>'												
															+      		'<div>'
															+       		'<div class=" pad-left-10">'
															+           		'<span class="font-20 bold"><a href="javascript:void(0)" id="{{profileUniqueIdentifier}}" title="{{toolTipProfileName}}"  class="profileDisplay">{{profileName}}</a></span><span class="pull-right toolbar-element-content">{{displayPostedDate}}</span>'
															+				'</div>'
															+       		'<div class="pad-12  toolbar-element-content" title="{{toolTipFeedMessage}} {{toolTipProfileName}}">'
															+					'{{feedMessage}} {{profileName}}'
															+				'</div>'                                                
															+       	'</div>'
															+    	'</div>'
															+    	'<div class="col-xs-1 text-center"><span class="trash-icons-sm enabled-sm delete2x2MyNotificationConnection" id="{{postId}}" myNotificationType="23"></span></div>'										 
															+     '{{/connectionMyNotificationIsAcceptRequestActivity}}'
															+     '{{#groupMyNotificationIsChangeOwnerActivity}}'
															+   '<div class="col-xs-9">'
															+        '<div class="popup-processing hide" id="proocessing_2x2_post_{{postId}}">' 		
															+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
															+         '</div>'
															+      '<div>'
															+       	'<div class=" pad-left-10">'
															+           	'<span class="font-20 bold"><a href="'+contextPath+'/group/{{activityUniqueIdentifer}}" class="element-font-15" title="{{toolTipActivityName}}">{{activityName}}</a></span><span class="pull-right toolbar-element-content">{{displayPostedDate}}</span>'
															+			'</div>'
															+       	'<div class="pad-12  toolbar-element-content" title="{{toolTipProfileName}} {{toolTipFeedMessage}}">'
															+				'{{profileName}} {{feedMessage}}'
															+			'</div>'  
															+       '</div>'
															+    '</div>'
															+    '<div class="col-xs-1 text-center"><span class="trash-icons-sm enabled-sm delete2x2MyNotificationChangeOwner" id="{{postId}}" myNotificationType="24"></span></div>'
															+    '{{/groupMyNotificationIsChangeOwnerActivity}}'
															+     '{{#groupMyNotificationMmberDeleted}}'
															+   '<div class="col-xs-9">'
															+        '<div class="popup-processing hide" id="proocessing_2x2_post_{{postId}}">' 		
															+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
															+         '</div>'
															+      '<div>'
															+       	'<div class=" pad-left-10">'
															+           	'<span class="font-20 bold"><a href="'+contextPath+'/group/{{activityUniqueIdentifer}}" class="element-font-15" title="{{toolTipActivityName}}">{{activityName}}</a></span><span class="pull-right toolbar-element-content">{{displayPostedDate}}</span>'
															+			'</div>'
															+       	'<div class="pad-12  toolbar-element-content" title="{{toolTipFeedMessage}} {{toolTipActivityName}}">'
															+				'{{feedMessage}} {{activityName}}'
															+			'</div>'  
															+       '</div>'
															+    '</div>'
															+    '<div class="col-xs-1 text-center"><span class="trash-icons-sm enabled-sm delete2x2MyNotificationGroupMemberDelete" id="{{postId}}" myNotificationType="20"></span></div>'
															+    '{{/groupMyNotificationMmberDeleted}}'
															+     '{{#groupMyNotificationIsGroupInvitationResponse}}'
															+   '<div class="col-xs-9">'
															+        '<div class="popup-processing hide" id="proocessing_2x2_post_{{postId}}">' 		
															+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
															+         '</div>'
															+      '<div>'
															+       	'<div class=" pad-left-10">'
															+           	'<span class="font-20 bold"><a href="'+contextPath+'/group/{{activityUniqueIdentifer}}" class="element-font-15" title="{{toolTipActivityName}}">{{activityName}}</a></span><span class="pull-right toolbar-element-content">{{displayPostedDate}}</span>'
															+			'</div>'
															+       	'<div class="pad-12  toolbar-element-content" title="{{toolTipFeedMessage}} {{toolTipProfileName}}">'
															+				'{{feedMessage}} {{profileName}}'
															+			'</div>'  
															+       '</div>'
															+    '</div>'
															+    '<div class="col-xs-1 text-center"><span class="trash-icons-sm enabled-sm delete2x2MyNotificationGroupInvitation" id="{{postId}}" myNotificationType="25"></span></div>'
															+    '{{/groupMyNotificationIsGroupInvitationResponse}}'
															+'</div>';
					allMyNotificationsTemplate2x2template += '{{/allMyNotifications}}';
				    var allMyNotificationsView = Mustache.to_html(allMyNotificationsTemplate2x2template,data);
					$("#notificationdisplaydiv").html(allMyNotificationsView);
					var xiimcustomScrollbarOptions = {elementid:"#notificationdisplaydiv",isUpdateOnContentResize:true,setHeight:"450px",vertical:'y'};
					xiimcustomScrollbar(xiimcustomScrollbarOptions);
					$("#clearAllButton").removeClass('hide');
				}else{
					$("#clearAllButton").addClass('hide');
					$("#notificationdisplaydiv").html('<div class="toolbar-element-name">No new notifications.</div>');
				}
			}
			// Used to bind the events
			myNotifications.bindEvents();
		},
		myNotificationToolBarDynamicUI:function(data){
			if(data.groupMyNotifications.length >0){
				var template = '{{#groupMyNotifications}}';
				
				template += '<li class="clear-float min-height-80">'
					+   '<div class="col-xs-2">'  		
					+'  {{#activityLogo}}'
	        		+'		<img src="/contextPath/Group/{{activityLogo}}/profile.jpg" class="radious-border" width="50"/>'
	        		+'   {{/activityLogo}}'
	        		+'   {{^activityLogo}}'
	        		+'  	<img src="'+contextPath+'/static/pictures/no-group-image.jpg" class="radious-border" width="50"/>'
	        		+'   {{/activityLogo}}'
					+    '</div>' 
					+    '<div class="col-xs-10 pad-left-13-important">'
					+        '<div class="popup-processing hide" id="proocessing_post_{{postId}}">' 		
					+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
					+         '</div>'	
					+     '{{#groupMyNotificationIsChangeOwnerActivity}}'
					+         '<div class="font-16 bold mar-bot-5">'
					+			'<a href="'+contextPath+'/group/{{activityUniqueIdentifer}}" class="toolbar-element-name-important" title="{{toolTipActivityName}}">{{activityName}}</a>' 
					+			'<span class="trash-icons-sm enabled-sm margin-top-0 text-right pull-right deleteToolBarMyNotificationGroup" id="{{postId}}"></span>'
					+          '</div>'   	
					+			'<div class="toolbar-element-content mar-bot-5 ">{{displayPostedDate}}</div>'
					+           '<div class="toolbar-element-content mar-bot-5" title="{{toolTipProfileName}} {{toolTipFeedMessage}}">{{profileName}} {{feedMessage}}</div>' 
					+      '{{/groupMyNotificationIsChangeOwnerActivity}}'
					+     '{{#groupMyNotificationMmberDeleted}}'
					+         '<div class="font-16 bold mar-bot-5">'
					+			'<a href="'+contextPath+'/group/{{activityUniqueIdentifer}}" class="toolbar-element-name-important" title="{{toolTipActivityName}}">{{activityName}}</a>' 
					+			'<span class="trash-icons-sm enabled-sm margin-top-0 text-right pull-right deleteToolBarMyNotificationGroupMmber" id="{{postId}}"></span>'
					+          '</div>'   	
					+			'<div class="toolbar-element-content mar-bot-5">{{displayPostedDate}}</div>'
					+           '<div class="toolbar-element-content mar-bot-5" title="{{toolTipFeedMessage}} {{toolTipActivityName}}">{{feedMessage}} {{activityName}}</div>' 
					+      '{{/groupMyNotificationMmberDeleted}}'
					+     '{{#groupMyNotificationIsGroupInvitationResponse}}'
					+         '<div class="font-16 bold mar-bot-5">'
					+			'<a href="'+contextPath+'/group/{{activityUniqueIdentifer}}" class="toolbar-element-name-important" title="{{toolTipActivityName}}">{{activityName}}</a>' 
					+			'<span class="trash-icons-sm enabled-sm margin-top-0 text-right pull-right deleteToolBarMyNotificationGroupInvitation" id="{{postId}}"></span>'
					+          '</div>'   	
					+			'<div class="toolbar-element-content mar-bot-5">{{displayPostedDate}}</div>'
					+           '<div class="toolbar-element-content mar-bot-5" title="{{toolTipFeedMessage}} {{toolTipProfileName}}">{{feedMessage}} {{profileName}}</div>' 
					+      '{{/groupMyNotificationIsGroupInvitationResponse}}'
					+     '</div>'
					+'</li>';
				
				template += '{{/groupMyNotifications}}';
				var groupMyNotificationsView = Mustache.to_html(template,data);
				$("#groups_my_notifications_container").html(groupMyNotificationsView);
				
			}else{
				$("#groups_my_notifications_container").html('<div class="toolbar-element-name">No new notifications.</div>');
			}
			
			if(data.connectionMyNotifications.length >0){
				var template = '{{#connectionMyNotifications}}';
				
				template += '<li class="clear-float min-height-80">'
					+   '<div class="col-xs-2">'  		
					+'  {{#photoId}}'
	        		+'		<img src="/contextPath/User/{{photoId}}/profile.jpg" class="img-circle tool-bar-image"/>'
	        		+'   {{/photoId}}'
	        		+'   {{^photoId}}'
	        		+'  	<img src="'+contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg" class="img-circle tool-bar-image"/>'
	        		+'   {{/photoId}}'
					+    '</div>' 
					+    '<div class="col-xs-10 pad-left-13-important">'
					+        '<div class="popup-processing hide" id="proocessing_post_{{postId}}">' 		
					+         	'<img src="'+contextPath+'/static/pictures/ajax-loader.gif">'	
					+         '</div>'	
					+     '{{#connectionMyNotificationIsAcceptRequestActivity}}'
					+         '<div class="font-16 bold mar-bot-5">'
					+			'<a href="javascript:void(0)" id="{{profileUniqueIdentifier}}" class="profileDisplay toolbar-element-name-important" title="{{toolTipProfileName}}">{{profileName}}</a>' 
					+			'<span class="trash-icons-sm enabled-sm margin-top-0 text-right pull-right deleteToolBarMyNotificationConnection" id="{{postId}}"></span>'
					+          '</div>'   	
					+			'<div class="toolbar-element-content mar-bot-5">{{displayPostedDate}}</div>'
					+			'<div class="toolbar-element-content mar-bot-5" title="{{toolTipFeedMessage}} {{toolTipProfileName}}">{{feedMessage}} {{profileName}}</div>'  
					+      '{{/connectionMyNotificationIsAcceptRequestActivity}}'
					+     '</div>'
					+'</li>';
				
				template += '{{/connectionMyNotifications}}';
				var connectionMyNotificationsView = Mustache.to_html(template,data);
				$("#connections_my_notifications_container").html(connectionMyNotificationsView);
				
			}else{
				$("#connections_my_notifications_container").html('<div class="toolbar-element-name">No new notifications.</div>');
			}
			
			myNotifications.bindEvents();
		},
		manageToolBarMyNotifications:function(statementId,groupStatusEnum,notificationType,actionType){
			$("#proocessing_post_"+statementId).removeClass('hide');
			
        	var manageGroupRequest = {
					statementId:encodeURIComponent(statementId),
					groupStatusEnum:groupStatusEnum,
					notificationType:notificationType,
					userId:userId
			};
    		var options = {
					url: contextPath+'/feeds/manageOtherAlerts',
      				data:manageGroupRequest,
      				requestInfo:{groupStatusEnum:groupStatusEnum,statementId:statementId,actionType:actionType},
      				successCallBack:myNotifications.manageGroupMyNotificationSuccessCallBack,
      				async:true
      		};
      		doAjax.ControllerInvocation(options);
    	},
    	manageGroupMyNotificationSuccessCallBack:function(data){
    			var request = myNotifications.prepareServiceRequest(is2X2);
    			myNotifications.controllerInvocation(request);
    	},
    	manage2X2Notifications :  function(statementId,groupStatusEnum,notificationType,actionType){
    		$("#proocessing_2x2_post_"+statementId).removeClass('hide');
    		var manageGroupRequest = {
					statementId:encodeURIComponent(statementId),
					groupStatusEnum:groupStatusEnum,
					notificationType:notificationType,
					userId:userId
			};
    	     var options = {
					url: contextPath+'/feeds/manageOtherAlerts',
      				data:manageGroupRequest,
      				requestInfo:{groupStatusEnum:groupStatusEnum,statementId:statementId,actionType:actionType},
      				successCallBack:myNotifications.manage2X2NotificationSuccessCallBack,
      				async:true
    	     };
          	doAjax.ControllerInvocation(options);
    	},
    	manage2X2NotificationSuccessCallBack : function(requestInfo,data){
    		if(dashboardConnections){
    			$("div[divid='" + requestInfo.statementId +"']").remove();

    			var connectiondivs = $(".2x2Connections");
    			if(connectiondivs.length == 0){
    				$("#clearAllButton").addClass('hide');
					$("#notificationdisplaydiv").html('<div class="toolbar-element-name">No new notifications.</div>');
    			}

			}else if(dashboardGroups){
				$("div[divid='" + requestInfo.statementId +"']").remove();
				
				var groupdivs = $(".2x2Groups");
    			if(groupdivs.length == 0){
    				$("#clearAllButton").addClass('hide');
					$("#notificationdisplaydiv").html('<div class="toolbar-element-name">No new notifications.</div>');
    			}
				
			}else{
				$("div[divid='" + requestInfo.statementId +"']").remove();
				
				var alldivs = $(".2x2All");
    			if(alldivs.length == 0){
    				$("#clearAllButton").addClass('hide');
					$("#notificationdisplaydiv").html('<div class="toolbar-element-name">No new notifications.</div>');
    			}
    			
			}
    	},
    	manage2X2ClearAll : function(type){
    		var manageGroupRequest = {
					clearRequestType:type,
					userId:userId
			};
    	     var options = {
					url: contextPath+'/feeds/manageMyNotificationAlerts',
      				data:manageGroupRequest,
      				successCallBack:myNotifications.manage2X2ClearAllSuccessCallBack,
      				async:true
    	     };
          	doAjax.ControllerInvocation(options);
    	},
    	manage2X2ClearAllSuccessCallBack : function(data){
    		$("#my_notifications_2x2_processing").addClass('hide');
    		if(data){
    			$("#clearAllButton").addClass('hide');
    			$("#notificationdisplaydiv").html('<div class="toolbar-element-name">No new notifications.</div>');
    		}
    	},
		activeRespectiveOption:function(element){
			$(element).addClass('active');
		},
		close2x2MyNotifications:function(event){
			$("#my_notifications_2X2_view").addClass('hide');
		},
		bindEvents : function(){
			$(".deleteToolBarMyNotificationConnection").off("click").bind("click",function(){
        		var statementId = $(this).attr('id');
        		actionType = "DELETE";
        		myNotifications.manageToolBarMyNotifications(statementId,'OK',23,actionType);
        	});
			
			$(".deleteToolBarMyNotificationGroup").off("click").bind("click",function(){
        		var statementId = $(this).attr('id');
        		actionType = "DELETE";
        		myNotifications.manageToolBarMyNotifications(statementId,'OK',24,actionType);
        	});
			
			
			$(".profileDisplay").off("click").bind("click",function(){
				
				//Added to hide my notification 2x2 when short profile opened
				$("#my_notifications_2X2_view").addClass('hide');
				
        		var profileIdentifier = $(this).attr('id');
        		myNotifications.buildViewUserProfile(profileIdentifier);
        	});
			
			$(".deleteToolBarMyNotificationGroupMmber").off("click").bind("click",function(){
        		var statementId = $(this).attr('id');
        		actionType = "DELETE";
        		myNotifications.manageToolBarMyNotifications(statementId,'OK',20,actionType);
        	});
			
			$(".deleteToolBarMyNotificationGroupInvitation").off("click").bind("click",function(){
        		var statementId = $(this).attr('id');
        		actionType = "DELETE";
        		myNotifications.manageToolBarMyNotifications(statementId,'OK',25,actionType);
        	});
			
			
			$(".delete2x2MyNotificationConnection").off("click").bind("click",function(){
        		var statementId = $(this).attr('id');
        		actionType = "DELETE";
        		myNotifications.manage2X2Notifications(statementId,'OK',23,actionType);
        	});
			
			
			$(".delete2x2MyNotificationChangeOwner").off("click").bind("click",function(){
        		var statementId = $(this).attr('id');
        		actionType = "DELETE";
        		myNotifications.manage2X2Notifications(statementId,'OK',24,actionType);
        	});
			
			$(".delete2x2MyNotificationGroupMemberDelete").off("click").bind("click",function(){
        		var statementId = $(this).attr('id');
        		actionType = "DELETE";
        		myNotifications.manage2X2Notifications(statementId,'OK',20,actionType);
        	});
			
			$(".delete2x2MyNotificationGroupInvitation").off("click").bind("click",function(){
        		var statementId = $(this).attr('id');
        		actionType = "DELETE";
        		myNotifications.manage2X2Notifications(statementId,'OK',25,actionType);
        	});
			
			$("#clearAllButton").off("click").bind("click",function(){
				$("#my_notifications_2x2_processing").removeClass('hide');
				if(dashboardConnections){
					myNotifications.manage2X2ClearAll("CONNECTION");
    			}else if(dashboardGroups){
    				myNotifications.manage2X2ClearAll("GROUP");
    			}else{
    				myNotifications.manage2X2ClearAll("ALL");
    			}
        	});
			
			$("#2x2_my_notifications_connections").off("click").bind("click",function(){
				
				var myNotificationsAllConnections = {
			 			isConnections:true,
			 			is2X2:true,
			 			element:"#my_notifications_2X2_view",
			 		};
			 		
			 	myNotifications.init(myNotificationsAllConnections);
        	});
			
			$("#2x2_my_notifications_groups").off("click").bind("click",function(){
				
				var myNotificationsAllGroups = {
		  	 			isGroups:true,
		  	 			is2X2:true,
		  	 			element:"#my_notifications_2X2_view",
		  	 	};
		  	 	myNotifications.init(myNotificationsAllGroups);
        	});
			
			$("#2x2_my_notifications_all").off("click").bind("click",function(){
				
				var allMyNotificationsRequest = {
		  	 			is2X2:true,
		  	 			element:"#my_notifications_2X2_view",
		  	 	};
		  	 	myNotifications.init(allMyNotificationsRequest);
        	});
			
			
		},
		buildViewUserProfile:function(profileUniqueIdentifier){
			
        	var urlPath=window.location.pathname;
        	var urlPathArray = urlPath.split('/');
        	if(urlPathArray[1] != 'dashboard'){
        		var container = "my_notifications_display";
        		var hhtml ='<form id="'+container+'hiddenForm" method="POST"><input type="hidden" value="'+profileUniqueIdentifier+'" name="profileUniqueIdentifier"><input type="hidden" value="true" name="isViewUserProfile"></form>';
        		$("#"+container).append('<div id="'+container+'hiddenDiv"></div>');
        		$("#"+container+'hiddenDiv').html(hhtml);
        		$("#"+container+'hiddenForm').attr('action',contextPath+"/dashboard/home");
        		$("#"+container+'hiddenForm').submit();
        	}else{
        		$("#my_notifications_display").addClass('hide');
        		$("#viewConnetionProfile").removeClass('hide');
        		var options ={
        				ele:"#viewConnetionProfile",
        				flag:true,
        				profileUniqueIdentifier:profileUniqueIdentifier,
        				isDashboardViewProfile:true
        		};
        		
        		ViewUserProfile.init(options);
        	}
        },
        renderNotifications : function(data,type){
        	data = $.parseJSON(data);
        	
        	var groupMyNotifications = data['groupMyNotifications'];
        	
			if(groupMyNotifications != undefined && groupMyNotifications.length == undefined){
				groupMyNotifications = [groupMyNotifications];
			}
			if(groupMyNotifications != undefined && groupMyNotifications.length > 0){
				for(var i=0;i<groupMyNotifications.length;i++){
					var months=["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
					if(groupMyNotifications[i].postedTime){
						var date = new Date(groupMyNotifications[i].postedTime+" UTC");
						var startDate = myNotifications.formatDate(date)+' '+months[date.getMonth()]+' '+date.getDate()+' '+(date.getYear()+1900);
						groupMyNotifications[i].startDate = date;
						groupMyNotifications[i].displayPostedDate = startDate;
					}
					
					if(groupMyNotifications[i].activityType == 'MyNotificationChangeOwnerResponse'){
						groupMyNotifications[i].groupMyNotificationChangeOwnerActivity = groupMyNotifications[i].activityType;
						groupMyNotifications[i].groupMyNotificationIsChangeOwnerActivity = true;
					}
					
					if(groupMyNotifications[i].activityType == 'MemberDeleted'){
						groupMyNotifications[i].groupMyNotificationChangeOwnerActivity = groupMyNotifications[i].activityType;
						groupMyNotifications[i].groupMyNotificationMmberDeleted = true;
					}
					
					if(groupMyNotifications[i].activityType == 'MyNotificationGroupInvitationResponse'){
						groupMyNotifications[i].groupMyNotificationChangeOwnerActivity = groupMyNotifications[i].activityType;
						groupMyNotifications[i].groupMyNotificationIsGroupInvitationResponse = true;
					}
				}
			}
			
        	
			var connectionMyNotifications = data['connectionMyNotifications'];

			if(connectionMyNotifications != undefined && connectionMyNotifications.length == undefined){
				connectionMyNotifications = [connectionMyNotifications];
			}
			if(connectionMyNotifications != undefined && connectionMyNotifications.length > 0){
				for(var i=0;i<connectionMyNotifications.length;i++){
					var months=["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
					if(connectionMyNotifications[i].postedTime){
						var date = new Date(connectionMyNotifications[i].postedTime+" UTC");
						var startDate = myNotifications.formatDate(date)+' '+months[date.getMonth()]+' '+date.getDate()+' '+(date.getYear()+1900);
						connectionMyNotifications[i].startDate = date;
						connectionMyNotifications[i].displayPostedDate = startDate;
					}
					
					if(connectionMyNotifications[i].activityType == 'MyNotificationFriendResponse'){
						connectionMyNotifications[i].connectionMyNotificationAcceptRequestActivity = connectionMyNotifications[i].activityType;
						connectionMyNotifications[i].connectionMyNotificationIsAcceptRequestActivity = true;
					}
				}
			}
			
			if(type == "toolbar"){
				if(groupMyNotifications != undefined && groupMyNotifications.length > 0){
					for(var i=0;i<groupMyNotifications.length;i++){
						if(groupMyNotifications[i].activityName != undefined){
							
							groupMyNotifications[i].toolTipActivityName = groupMyNotifications[i].activityName;
							
							var len = (groupMyNotifications[i].activityName).length;
						    if(len>25){
						    	groupMyNotifications[i].activityName = (groupMyNotifications[i].activityName).substr(0,25)+'...';
						    }
						}
						
						if(groupMyNotifications[i].profileName != undefined){
							
							groupMyNotifications[i].toolTipProfileName = groupMyNotifications[i].profileName;
							
							var len = (groupMyNotifications[i].profileName).length;
						    if(len>25){
						    	groupMyNotifications[i].profileName = (groupMyNotifications[i].profileName).substr(0,25)+'...';
						    }
						}
						
						if(groupMyNotifications[i].feedMessage != undefined){
							
							groupMyNotifications[i].toolTipFeedMessage = groupMyNotifications[i].feedMessage;
							
							var len = (groupMyNotifications[i].feedMessage).length;
						    if(len>25){
						    	groupMyNotifications[i].feedMessage = (groupMyNotifications[i].feedMessage).substr(0,25)+'...';
						    }
						}
					}
				}	
				if(connectionMyNotifications != undefined && connectionMyNotifications.length > 0){
					for(var i=0;i<connectionMyNotifications.length;i++){
						if(connectionMyNotifications[i].activityName != undefined){
							
							connectionMyNotifications[i].toolTipActivityName = connectionMyNotifications[i].activityName;
							
							var len = (connectionMyNotifications[i].activityName).length;
						    if(len>52){
						    	connectionMyNotifications[i].activityName = (connectionMyNotifications[i].activityName).substr(0,25)+'...';
						    }
						}
						
						if(connectionMyNotifications[i].profileName != undefined){
							
							connectionMyNotifications[i].toolTipProfileName = connectionMyNotifications[i].profileName;
							
							var len = (connectionMyNotifications[i].profileName).length;
						    if(len>25){
						    	connectionMyNotifications[i].profileName = (connectionMyNotifications[i].profileName).substr(0,25)+'...';
						    }
						}
						
						if(connectionMyNotifications[i].feedMessage != undefined){
							
							connectionMyNotifications[i].toolTipFeedMessage = connectionMyNotifications[i].feedMessage;
							
							var len = (connectionMyNotifications[i].feedMessage).length;
						    if(len>25){
						    	connectionMyNotifications[i].feedMessage = (connectionMyNotifications[i].feedMessage).substr(0,25)+'...';
						    }
						}
					}
				}
				myNotifications.myNotificationToolBarDynamicUI(data);
			}else if(type == "group2x2"){
				if(groupMyNotifications != undefined && groupMyNotifications.length > 0){
					for(var i=0;i<groupMyNotifications.length;i++){
						if(groupMyNotifications[i].activityName != undefined){
							
							groupMyNotifications[i].toolTipActivityName = groupMyNotifications[i].activityName;
							
							var len = (groupMyNotifications[i].activityName).length;
						    if(len>15){
						    	groupMyNotifications[i].activityName = (groupMyNotifications[i].activityName).substr(0,15)+'...';
						    }
						}
						
						if(groupMyNotifications[i].profileName != undefined){
							
							groupMyNotifications[i].toolTipProfileName = groupMyNotifications[i].profileName;
							
							var len = (groupMyNotifications[i].profileName).length;
						    if(len>15){
						    	groupMyNotifications[i].profileName = (groupMyNotifications[i].profileName).substr(0,15)+'...';
						    }
						}
						
						if(groupMyNotifications[i].feedMessage != undefined){
							groupMyNotifications[i].toolTipFeedMessage = groupMyNotifications[i].feedMessage;
						}
					}
				}
				myNotifications.myNotification2X2DynamicUI(data);
			}else if(type == "connection2x2"){
				if(connectionMyNotifications != undefined && connectionMyNotifications.length > 0){
					for(var i=0;i<connectionMyNotifications.length;i++){
						if(connectionMyNotifications[i].activityName != undefined){
    						
    						connectionMyNotifications[i].toolTipActivityName = connectionMyNotifications[i].activityName;
    						
    						var len = (connectionMyNotifications[i].activityName).length;
    					    if(len>15){
    					    	connectionMyNotifications[i].activityName = (connectionMyNotifications[i].activityName).substr(0,15)+'...';
    					    }
    					}
    					
    					if(connectionMyNotifications[i].profileName != undefined){
    						
    						connectionMyNotifications[i].toolTipProfileName = connectionMyNotifications[i].profileName;
    						
    						var len = (connectionMyNotifications[i].profileName).length;
    					    if(len>15){
    					    	connectionMyNotifications[i].profileName = (connectionMyNotifications[i].profileName).substr(0,15)+'...';
    					    }
    					}
    					
    					if(connectionMyNotifications[i].feedMessage != undefined){
     						
    						connectionMyNotifications[i].toolTipFeedMessage = connectionMyNotifications[i].feedMessage;
     						
     					}
					}
				}
				myNotifications.myNotification2X2DynamicUI(data);
			}
        },
        render2X2AllNotifications : function(data){
        	data = $.parseJSON(data);
        	
        	var allMyNotifications = data['allMyNotifications'];
        	
			if(allMyNotifications != undefined && allMyNotifications.length == undefined){
				allMyNotifications = [allMyNotifications];
			}
			if(allMyNotifications != undefined && allMyNotifications.length > 0){
				for(var i=0;i<allMyNotifications.length;i++){
					var months=["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
					if(allMyNotifications[i].postedTime){
						var date = new Date(allMyNotifications[i].postedTime+" UTC");
						var startDate = myNotifications.formatDate(date)+' '+months[date.getMonth()]+' '+date.getDate()+' '+(date.getYear()+1900);
						allMyNotifications[i].startDate = date;
						allMyNotifications[i].displayPostedDate = startDate;
					}
					
					if(allMyNotifications[i].activityType == 'MyNotificationChangeOwnerResponse'){
						allMyNotifications[i].groupMyNotificationChangeOwnerActivity = allMyNotifications[i].activityType;
						allMyNotifications[i].groupMyNotificationIsChangeOwnerActivity = true;
					}
					
					if(allMyNotifications[i].activityType == 'MemberDeleted'){
						allMyNotifications[i].groupMyNotificationChangeOwnerActivity = allMyNotifications[i].activityType;
						allMyNotifications[i].groupMyNotificationMmberDeleted = true;
					}
					
					if(allMyNotifications[i].activityType == 'MyNotificationGroupInvitationResponse'){
						allMyNotifications[i].groupMyNotificationChangeOwnerActivity = allMyNotifications[i].activityType;
						allMyNotifications[i].groupMyNotificationIsGroupInvitationResponse = true;
					}
					
					if(allMyNotifications[i].activityType == 'MyNotificationFriendResponse'){
						allMyNotifications[i].connectionMyNotificationAcceptRequestActivity = allMyNotifications[i].activityType;
						allMyNotifications[i].connectionMyNotificationIsAcceptRequestActivity = true;
					}
					
					if(allMyNotifications[i].activityName != undefined){
						allMyNotifications[i].toolTipActivityName = allMyNotifications[i].activityName;
						var len = (allMyNotifications[i].activityName).length;
					    if(len>15){
					    	allMyNotifications[i].activityName = (allMyNotifications[i].activityName).substr(0,15)+'...';
					    }
					}
					
					if(allMyNotifications[i].profileName != undefined){
						allMyNotifications[i].toolTipProfileName = allMyNotifications[i].profileName;
						var len = (allMyNotifications[i].profileName).length;
					    if(len>15){
					    	allMyNotifications[i].profileName = (allMyNotifications[i].profileName).substr(0,15)+'...';
					    }
					}
					
					if(allMyNotifications[i].feedMessage != undefined){
						allMyNotifications[i].toolTipFeedMessage = allMyNotifications[i].feedMessage;
					}
				}
			}
			myNotifications.myNotification2X2DynamicUI(data);
        }
	};
}.call(this);