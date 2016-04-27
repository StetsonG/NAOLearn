/**
 * @author Next Sphere Technologies
 * OtherNotification Widget
 * 
 * Group Notification will get all kinds of notifications which respect to groups.
 * 
 */

var scriptElement = document.getElementsByTagName("script");
var baseElement = scriptElement[scriptElement.length - 1].parentNode;
var OtherNotifications = function(){
	var accessToken = $("#accessToken_meta").val();
	var userId = $("#loggedInUserId-meta").val();
	var actionType = '';
	var notificationCount = '';
return{
		defaults:{
			
		},
		settings:{
			
		},
		init:function(options){
			this.settings = $.extend(this.defaults,options);
            var element = this.settings.ele;
            this.staticUI(element);
            var serviceOptions = this.prepareServiceRequest();
            this.serviceInvocation(serviceOptions);
            this.bindEvents();
		},
		
        serviceInvocation:function(options){
        	
        },
        
        prepareServiceRequest:function(){
        	var data = { };
			var options={
      				url: contextPath+'/feeds/getFeeds',
      				data:data,
      				completeCallBack:OtherNotifications.completeCallBack,
      				successCallBack:OtherNotifications.successCallBack,
      				async:true
      		};
      		doAjax.ControllerInvocation(options);
        },
        
        successCallBack:function(data){
        	data = $.parseJSON(data);
        	$("#otherNotificationsCount").removeClass('red-circle');
        	$("#otherNotificationsCount").html('');
        	var groupAlerts = data['groupAlerts'];
			if(groupAlerts != undefined && groupAlerts.length == undefined){
				groupAlerts = [groupAlerts];
			}
			notificationCount = groupAlerts.length;
			if(groupAlerts != undefined && groupAlerts.length > 0){
				for(var i=0;i<groupAlerts.length;i++){
					var months=["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
					if(groupAlerts[i].postedTime){
						var date = new Date(groupAlerts[i].postedTime);
						var startDate = months[date.getMonth()]+' '+date.getDate();
						groupAlerts[i].startDate = date;
						groupAlerts[i].displayPostedDate = startDate;
					}
					if(groupAlerts[i].activityType == 'GroupInvited' || groupAlerts[i].activityType == 'ChangeOwnerRequest'){
						groupAlerts[i].groupActivityDisplayDetails = true;
					}
					if(groupAlerts[i].activityType == 'GroupInvited'){
						groupAlerts[i].groupInvitedActivity = groupAlerts[i].activityType;
					}else if(groupAlerts[i].activityType == 'ChangeOwnerRequest'){
						groupAlerts[i].groupChangeOwnerActivity =  groupAlerts[i].activityType;
					}/*else if(groupAlerts[i].activityType == 'Deleted'){
						groupAlerts[i].groupDeletedActivity = groupAlerts[i].activityType;
					}else if(groupAlerts[i].activityType == 'GroupJoinApproved'){
						groupAlerts[i].groupJoinActivity =  groupAlerts[i].activityType;
					}else if(groupAlerts[i].activityType == 'ChangeOwnerResponse'){
						groupAlerts[i].changeOwnerResponseActivity =  groupAlerts[i].activityType;
					}else if(groupAlerts[i].activityType == 'MemberDeleted'){
						groupAlerts[i].groupMemberDeleted =  groupAlerts[i].activityType;
					}*/
					if(groupAlerts[i].activityType == 'GroupInvited' || groupAlerts[i].activityType == 'ChangeOwnerRequest'){
						groupAlerts[i].groupActivityCommon = true;
					}
					/*if(groupAlerts[i].activityType == 'GroupJoinApproved' || groupAlerts[i].activityType == 'ChangeOwnerResponse'){
						groupAlerts[i].groupActivityCommonDetails = true;
					}*/
					/*if(groupAlerts[i].activityType == 'Deleted'|| groupAlerts[i].activityType == 'MemberDeleted'){
						groupAlerts[i].groupActivityCommonDeleted = true;
					}*/
					if(groupAlerts[i].activitySummary != undefined){
						var len = (groupAlerts[i].activitySummary).length;
					    if(len>18){
					    	groupAlerts[i].activitySummary = (groupAlerts[i].activitySummary).substr(0,18)+'...';
					    }
					}
					if(groupAlerts[i].activityName != undefined){
						var len = (groupAlerts[i].activityName).length;
					    if(len>18){
					    	groupAlerts[i].activityName = (groupAlerts[i].activityName).substr(0,18)+'...';
					    }
					}
				}
			}
        	OtherNotifications.dynamicUI(data);
        },
        manageGroupSuccessCallBack:function(requestInfo,data){
        	$(".closeGroupIcon_"+requestInfo.statementId).removeClass('hide');
        	$("#groupAccept_"+requestInfo.statementId).removeClass('overlay-bg');
			$("#notifications_popup_processing_"+requestInfo.statementId).addClass('hide');
        	if(requestInfo.requestType == 'ACCEPT'){
        		if(data.groupStatusCode == "PENDING_FOR_APPROVAL"){
   	   		  	 $("#join-group-button").addClass("ancher_lock");
   	       		 $("#join-group-button").attr("disabled", "disabled");
   	       		 $("#join-group-button-brief").addClass("ancher_lock");
   	       		 $("#join-group-button-brief").attr("disabled", "disabled");
   	       		 $("#groupAccept_"+requestInfo.statementId).html('Pending for approval.');
   				}
   				if(data.groupStatusCode == "ACTIVE"){
   				 $("#join-group-button").addClass("ancher_lock");
   	       		 $("#join-group-button").attr("disabled", "disabled");
   	       		 $("#join-group-button-brief").addClass("ancher_lock");
   	       		 $("#join-group-button-brief").attr("disabled", "disabled");
   	       		 
   	       	var isDashboard = $('.dashboardviewportcontainer').is(':visible');
   	       		 //to display group in 2x2 view
	   	       	if(isDashboard && $('#4').data('sizex') == 1 && $('#4').data('sizey') == 1 && $("#baseElementMyGroups").length > 0){
	   	       		var flag = '';
	  				flag={
	  						isMyGroups:true,
	  						isOnebyOneView:true,
	  						baseElementMyGroups:"#baseElementMyGroups"
			  			};
	  				mygroups.init(flag);
	   	       		}else if(isDashboard && $('#4').data('sizex') == 2 && $('#4').data('sizey') == 2 && $("#baseElementMyGroups").length > 0){
	   	       		if($('.groupsList').length>0){
			   	       		var flag = '';
			   	       		flag={
			  	  					  isMyGroupsTwobyTwo:true,
			  	      				  baseElementMyGroups:"#baseElementMyGroups"
			  	      				  };
			   	       			
			   	       		mygroups.init(flag);
	   	       			}
	   	       		}
	   	       	
	   	       		 $("#groupAccept_"+requestInfo.statementId).html('<span class="toolbar-element-content">Joined Group.</span>');
   	       		 
	   	         // XIP-2367 issue related code  starts
	   	       	 var group_unique_Id = $("#join-group-button").attr("join-group-id");
   	       		 if(group_unique_Id != undefined && requestInfo != undefined && 
   	       				 requestInfo.groupUniqueIdentifier != undefined && 
   	       				 group_unique_Id == requestInfo.groupUniqueIdentifier){
   	       			 window.location.href=contextPath+"/group/"+requestInfo.groupUniqueIdentifier;
   	       		 }
   	       		 // XIP-2367 issue related code  ends
   				}
   				if(data.groupStatusCode == "NOT_MEMBER"){
   					$("#groupAccept_"+requestInfo.statementId).html('<span class="toolbar-element-content">Not a member.</span>');
   				}
   				if(data.groupStatusCode == "DECLINE"){
   					$("#groupAccept_"+requestInfo.statementId).html('<span class="toolbar-element-content">Request Declined.</span>');
   				}
   				if(data.groupStatusCode == "BLOCKED"){
   					$("#groupAccept_"+requestInfo.statementId).html('<span class="toolbar-element-content">Member Blocked.</span>');
   				}
   				if(requestInfo.actionType == 'ChangeOwner'){
   				 $("#groupAccept_"+requestInfo.statementId).html('<span class="toolbar-element-content">Owner Changed.</span>');
   				 doAjax.displaySuccessMessagesOnChangeOwner("true",requestInfo.groupUniqueIdentifier,"true");
   				}
        	}else if(requestInfo.requestType == 'DECLINE'){
        		 $("#groupAccept_"+requestInfo.statementId).html('<span class="toolbar-element-content">Request Declined.</span>');
        	}else if(requestInfo.requestType == 'IGNORE'){
        		$("#groupAccept_"+requestInfo.statementId).html('<span class="toolbar-element-content">Notification ignored.</span>');
        	}
        	notificationCount = notificationCount - 1;
	      		if(notificationCount == 0){
	      			$(OtherNotifications.settings.ele).html('<div class="toolbar-element-name">No new notifications.</div>');
	      		}
        },
      
        manageGroupNotificationSuccessCallBack:function(requestInfo,data){
        	if(requestInfo.groupStatusEnum == 'IGNORE'){
        		$("#groupAccept_"+requestInfo.statementId).removeClass('overlay-bg');
    			$("#notifications_popup_processing_"+requestInfo.statementId).addClass('hide');
        		$(".closeGroupIcon_"+requestInfo.statementId).removeClass('hide');
        		$("#groupAccept_"+requestInfo.statementId).html('<span class="toolbar-element-content">Notification ignored.</span>');
        	}else if(requestInfo.actionType == 'OK'){
        		$("#groupOk_"+requestInfo.statementId).html('<span class="toolbar-element-content">Notification Read.</span>');
        	}else if(requestInfo.actionType == 'DELETE'){
        		$("#groupDeleted_"+requestInfo.statementId).html('<span class="toolbar-element-content">Notification Read.</span>');
        	}else if(requestInfo.actionType == 'ChangeOwnerOk'){
        		$("#groupOwnerOk_"+requestInfo.statementId).html('<span class="toolbar-element-content">Notification Read.</span>');
        	}else if(requestInfo.actionType == 'ChangeOwnerIgnore'){
        		$("#groupAccept_"+requestInfo.statementId).html('<span class="toolbar-element-content">Notification Ignored.</span>');
        	}else if(requestInfo.actionType  == 'MemberDeleted'){
        		$("#groupMemberDeleted_"+requestInfo.statementId).html('<span class="toolbar-element-content">Notification Read.</span>');
        	}
        	notificationCount = notificationCount - 1;
      		if(notificationCount == 0){
      			$(OtherNotifications.settings.ele).html('<div class="toolbar-element-name">No new notifications.</div>');
      		}
        },
        beforeSendCallBack:function(jqXHR,settings){
        	
        },
        
        completeCallBack:function(jqXHR,textStatus){
        	$("#otherNotifications").removeClass('ancher_lock');
        },
        
        errorCallBack:function(request,status,error){
               
        },
        
        failureCallBack:function(data){
        },
        
        dynamicUI:function(data){
        	var template = '{{#groupAlerts}}';
        	template+=' {{#groupActivityDisplayDetails}}'
        			+'<div id="groupReqRemove_{{postId}}" class="overflow-hidden">'
        			+'<li class="clear-float min-height-80">'
        			// common code to display group and change owner notifications
        			+'  {{#groupActivityCommon}}'
	        		+'	<div class="col-xs-2">'
	        		+'  {{#activityLogo}}'
	        		+'		<img src="/contextPath/Group/{{activityLogo}}/profile.jpg" class="radious-border" width="50"/>'
	        		+'   {{/activityLogo}}'
	        		+'   {{^activityLogo}}'
	        		+'  	<img src="'+contextPath+'/static/pictures/no-group-image.jpg" class="radious-border" width="50"/>'
	        		+'   {{/activityLogo}}'
	        		+'</div>'
	        		+'  <button type="button" class="close hide groupNotificationClose closeGroupIcon_{{postId}} pull-right" closePostId="{{postId}}">&times;</button>'
	        		+'	<div class="col-xs-10 pad-left-13-important" id="groupAccept_{{postId}}">'
	        		+'	<div class="popup-processing hide" id="notifications_popup_processing_{{postId}}">'
	        		+' 		<img src="'+contextPath+'/static/pictures/ajax-loader.gif"/>'
	        		+'	</div>'
	        		+'    {{#groupInvitedActivity}}'
	        		+'      <div class="font-16 mar-bot-5"><a class="toolbar-element-name-important" href="'+contextPath+'/group/{{activityUniqueIdentifer}}?page=shell">{{activityName}}</a><span class="margin-top-0 text-right pull-right toolbar-element-content">{{displayPostedDate}}</span></div>'
	        		+'      <div class="toolbar-element-content mar-bot-5 ">{{activitySummary}}</div>'
	        		+'   {{/groupInvitedActivity}}'
	        		+'  {{#groupChangeOwnerActivity}}'
	        		+'      <div class="font-16 mar-bot-5"><a class="toolbar-element-name-important" href="'+contextPath+'/group/{{activityUniqueIdentifer}}">{{activityName}}</a><span class="margin-top-0 text-right pull-right toolbar-element-content">{{displayPostedDate}}</span></div>'
	        		+'  {{/groupChangeOwnerActivity}}'
	        		+'		<div class="toolbar-element-content mar-bot-5">{{feedMessage}}</div>'
	        		+' {{#groupInvitedActivity}}'
	        		+'			<div class="display-inline toolbar-element-content pad-right-5-important" id="acceptGroupRequest_{{postId}}">'
	        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" acceptGroupMemberId="{{postId}}"  activityUniqueIdentifer="{{activityUniqueIdentifer}}" invitationToken="{{invitationToken}}" class="groupRadioClass pad-right-5"/>Accept'
	        		+'			</div>'
	        		+'			<div class="display-inline toolbar-element-content pad-right-5-important" id="ignoreGroupRequest_{{postId}}">'
	        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" declineGroupMemberId="{{postId}}" invitationToken="{{invitationToken}}" class="groupRadioClass pad-right-5"/>Decline'
	        		+'			</div>' 
	        		+'  {{/groupInvitedActivity}}'
	        		+'  {{#groupChangeOwnerActivity}}'
	        		+'          <div class="display-inline toolbar-element-content pad-right-5-important">'
	        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" acceptChangeOwnerId="{{postId}}" class="groupChangeOwnerClass pad-right-5"/>Accept'
	        		+'			</div>'
	        		+'    <input type="hidden" value="{{activityUniqueIdentifer}}" id="groupUniqueIdentifier_{{postId}}">'
	        		+'    <input type="hidden" value="{{memberId}}" id="memberId_{{postId}}">'
	        		+'    <input type="hidden" value="{{activityPerformer}}" id="activityPerformerId_{{postId}}">'
	        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
	        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" declineChangeOwnerId="{{postId}}" class="groupChangeOwnerClass pad-right-5"/>Decline'
	        		+'			</div>'
	        		+'			<div class="display-inline toolbar-element-content pad-right-5-important">'
	        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" ignoreChangeOwnerId="{{postId}}" class="groupChangeOwnerIgnoreClass pad-right-5"/>Ignore'
	        		+'			</div>'
	        		+'{{/groupChangeOwnerActivity}}'
	        		+'	</div>'
	        		+'  {{/groupActivityCommon}}'
	        		//common code for group deleted and group member delated notifications
	        	/*	+' {{#groupActivityCommonDeleted}}'
	        		+' <div class="media-body">'
	        		+'  	<div>{{activityName}} <span class="margin-top-0 text-right pull-right">{{displayPostedDate}}</span></div>'
	        		+'		<div class="dark-grey">{{feedMessage}}</div>'
	        		+' </div>'
	        		+' {{#groupDeletedActivity}}'
	        		+'  <div class="text-right mar-bot-10" id="groupDeleted_{{postId}}">'
	        		+'    <button type="button" class="def-button small-button okGroupDeleteRequest" deleteGroupPostId="{{postId}}">Ok</button>'
	        		+' </div>'
	        		+' {{/groupDeletedActivity}}'
	        		+' {{#groupMemberDeleted}}'
	        		+'  <div class="text-right mar-bot-10" id="groupMemberDeleted_{{postId}}">'
	        		+'    <button type="button" class="def-button small-button okGroupMemberDeleteRequest" deleteGroupMemberPostId="{{postId}}">Ok</button>'
	        		+' </div>'
	        		+' {{/groupMemberDeleted}}'
	        		+'{{/groupActivityCommonDeleted}}'*/
	        		//common code for group join approved and change owner approved notifications
	        		/*+'{{#groupActivityCommonDetails}}'
	        		+' <div class="media-body">'
	        		+'  	<div><a href="'+contextPath+'/group/{{activityUniqueIdentifer}}">{{activityName}}</a><span class="margin-top-0 text-right pull-right">{{displayPostedDate}}</span></div>'
	        		+' {{#changeOwnerResponseActivity}}'
	        		+'      <div>{{profileName}} </div>'
	        		+' {{/changeOwnerResponseActivity}}'
	        		+'		<div class="dark-grey">{{feedMessage}}</div>'
	        		+' </div>'
	        		+' {{#groupJoinActivity}}'
	        		+'  <div class="text-right mar-bot-10" id="groupOk_{{postId}}">'
	        		+'    	<button type="button" class="def-button small-button okGroupJoinRequest" okGroupPostId="{{postId}}">Ok</button>'
	        		+' 	</div>'
	        		+'  {{/groupJoinActivity}}'
	        		+' {{#changeOwnerResponseActivity}}'
	        		+'  <div class="text-right mar-bot-10" id="groupOwnerOk_{{postId}}">'
	        		+'    <button type="button" class="def-button small-button okGroupOwnerRequest" okGroupOwnerPostId="{{postId}}">Ok</button>'
	        		+' </div>'
	        		+'  {{/changeOwnerResponseActivity}}'
	        		+'{{/groupActivityCommonDetails}}'*/
	        		+' </li>'
	        		+' </div>'
        			+' {{/groupActivityDisplayDetails}}';
        		template += '{{/groupAlerts}}';
        		
			var otherNotificationsView = Mustache.to_html(template,data);
			if(data.groupAlerts.length >0){
				$(OtherNotifications.settings.ele).append(otherNotificationsView);
			}else{
				$(OtherNotifications.settings.ele).html('<div class="toolbar-element-name">No new notifications.</div>');
			}
			
			OtherNotifications.dynamicEvents();
        },
        bindEvents:function(){
        	
        },
        dynamicEvents:function(){
        	$(".groupRadioClass").off("click").bind("click",function(){
        		$(".groupRadioClass").attr({'src':contextPath+'/static/pictures/def-radio.png'});
        		$(this).attr({'src':contextPath+'/static/pictures/checked-radio.png'});
        		var statementId = $(this).attr('acceptGroupMemberId');
        		var activityUniqueIdentifer = $(this).attr('activityUniqueIdentifer');
        		var groupInvitationToken = $(this).attr('invitationToken');
        		var requestTypeEnum = '';
        		if(groupInvitationToken != null && groupInvitationToken != ''){
           			requestTypeEnum = "INVITATION";
         			}else{
         				requestTypeEnum = "GROUPS";
         			}
        		var requestType = "ACCEPT";
        		if(statementId == undefined){
        			statementId = $(this).attr('declineGroupMemberId');
        			requestType = "IGNORE";
        		}
        	//	$("#groupAccept_"+statementId).addClass('notification-overlay-bg');
				$("#notifications_popup_processing_"+statementId).removeClass('hide');
        		if(requestType == 'ACCEPT'){
        			var joinGroupRequest = {
    	        			groupUniqueIdentifier:activityUniqueIdentifer,
    	        			requestTypeEnum:requestTypeEnum,
    	        			invitationUniqueIdentifier:groupInvitationToken,
    	        			userId:userId,
    	        			accessToken:accessToken
    	        		};
    	        		joinGroupRequest= JSON.stringify(joinGroupRequest);
    	        		var options = {
    	             			 url:getModelObject('serviceUrl')+'/group/1.0/sendRequestToJoinGroup',
    	             			 data:joinGroupRequest,
    	             			 requestInfo:{requestType:requestType,statementId:statementId,groupUniqueIdentifier:activityUniqueIdentifer},
    	             			 successCallBack:OtherNotifications.manageGroupSuccessCallBack,
    	             			 async:true
    	             	 };
    	             	doAjax.PostServiceInvocation(options);
        		}else if(requestType == 'IGNORE'){
        			//OtherNotifications.manageGroupNotifications(statementId,'IGNORE',1,"");
        			var manageRecievedInvitationRequest = {
    						invitationUnqiueIdentifierList:groupInvitationToken,
    		   				groupRequestActionEnum:'DELETE',				
    						accessToken:accessToken
              			};
        			manageRecievedInvitationRequest= JSON.stringify(manageRecievedInvitationRequest);
    	        		var options = {
    	             			 url:getModelObject('serviceUrl')+'/group/1.0/manageReceivedInvitations',
    	             			 data:manageRecievedInvitationRequest,
    	             			 requestInfo:{requestType:requestType,statementId:statementId,groupUniqueIdentifier:activityUniqueIdentifer},
    	             			 successCallBack:OtherNotifications.manageGroupSuccessCallBack,
    	             			 async:true
    	             	 };
    	             	doAjax.PostServiceInvocation(options);
        		}
        	});
        	$(".okGroupDeleteRequest").off("click").bind("click",function(){
        		var statementId = $(this).attr('deleteGroupPostId');
        		actionType = "DELETE";
        		OtherNotifications.manageGroupNotifications(statementId,'OK',18,actionType);
        	});
        	
        	$(".okGroupMemberDeleteRequest").off("click").bind("click",function(){
        		var statementId = $(this).attr('deleteGroupMemberPostId');
        		actionType = "MemberDeleted";
        		OtherNotifications.manageGroupNotifications(statementId,'OK',20,actionType);
        	});
        	
        	$(".okGroupJoinRequest").off("click").bind("click",function(){
        		var statementId = $(this).attr('okGroupPostId');
        		actionType = "OK";
        		OtherNotifications.manageGroupNotifications(statementId,'OK',2,actionType);
        	});
        	$(".okGroupOwnerRequest").off("click").bind("click",function(){
        		var statementId = $(this).attr('okGroupOwnerPostId');
        		actionType = "ChangeOwnerOk";
        		OtherNotifications.manageGroupNotifications(statementId,'OK',22,actionType);
        	});
        	$(".groupNotificationClose").off("click").bind("click",function(){
        		var postId =$(this).attr('closePostId');
		    	$("#groupReqRemove_"+postId).remove();
		    });
        	
        	$(".groupChangeOwnerClass").off("click").bind("click",function(){
        		$(".groupChangeOwnerClass,.groupChangeOwnerIgnoreClass").attr({'src':contextPath+'/static/pictures/def-radio.png'});
        		$(this).attr({'src':contextPath+'/static/pictures/checked-radio.png'});
        		var statementId = $(this).attr('acceptChangeOwnerId');
        		
        		var requestType = "ACCEPT";
        		if(statementId == undefined){
        			statementId = $(this).attr('declineChangeOwnerId');
        			requestType = "DECLINE";
        		}
        		var groupUniqueIdentifier = $('#groupUniqueIdentifier_'+statementId).val();
        		var memberId = $('#memberId_'+statementId).val();
        		var activityPerformerId = $('#activityPerformerId_'+statementId).val();
        		//$("#groupAccept_"+statementId).addClass('notification-overlay-bg');
				$("#notifications_popup_processing_"+statementId).removeClass('hide');
				  var headers = {
						  accessToken:accessToken,
						  langId:$("#langId_meta").val()
				  };
				  var requestParams = '?groupUniqueIdentifier='+groupUniqueIdentifier+'&memberId='+memberId+'&actionType=CHANGE_OWNER_RESPONSE'+'&userId='+activityPerformerId+'&actionStatus='+requestType;
				  var options={
						  url:getModelObject('serviceUrl')+'/group/2.0/changeGroupOwner'+requestParams,
						  headers:headers,
						  requestInfo:{requestType:requestType,statementId:statementId,actionType:'ChangeOwner',groupUniqueIdentifier:groupUniqueIdentifier},
						  successCallBack:OtherNotifications.manageGroupSuccessCallBack,
						  async:true
				  };
				doAjax.PutServiceInvocation(options);
        	});
        	$(".groupChangeOwnerIgnoreClass").off("click").bind("click",function(){
        		$(".groupChangeOwnerClass").attr({'src':contextPath+'/static/pictures/def-radio.png'});
        		$(this).attr({'src':contextPath+'/static/pictures/checked-radio.png'});
        		var statementId = $(this).attr('ignoreChangeOwnerId');
        		actionType = "ChangeOwnerIgnore";
        		OtherNotifications.manageGroupNotifications(statementId,'OK',21,actionType);
        	});
        	
        },
        
        manageGroupNotifications:function(statementId,groupStatusEnum,notificationType,actionType){
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
      				successCallBack:OtherNotifications.manageGroupNotificationSuccessCallBack,
      				async:true
      		};
      		doAjax.ControllerInvocation(options);
    	},
        staticUI:function(element){
        	 
        },
	
	};

}.call(this);