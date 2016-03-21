
/**
 * @author Next Sphere Technologies
 * This usershortprofile javascript is an common function which we are using all over the application.
 * 
 * where ever we need to show short profile of the user we need to make use of this function
 * 
 * 
 */

var UserShortProfile = function(){
	    var accessToken =  $("#accessToken_meta").val();
	    var languageId = $("#langId_meta").val();
	    var hasNext = false;
		var hasPrev = false;
		var pendingFlag = '';
    	var apporvedOrDeclinedFlag = "";
    	var container;
    	var loggedInUserId = $("#loggedInUserId-meta").val();
		return{
			defaults:{
				serviceUrl:'/userProfile/1.0/getUserProfileByProfileName',
				connectionServiceUrl:'/group/1.0/sendRequestToJoinGroup',
				managePendingMemberShipUrl:'/group/1.0/managePendingMemberShip',
				manageMemberServiceUrl:'/group/1.0/manageGroupMembers',
				mode:'default'
			},
			settings:{
				
			},
			destory:function(){
				UserShortProfile.settings = {};
				hasNext = false;
				hasPrev = false;
			},
			init:function(options){
				this.destory();
				this.settings = $.extend(this.defaults,options);
				this.accessToken = accessToken;//$("#accessToken_meta").val();
	            var element = this.settings.ele;
	            container = UserShortProfile.settings.ele.substring(1);
	            this.staticUI(element);
	            var serviceRequestOptions = this.prepareServiceRequest();
	            this.serviceInvocation(serviceRequestOptions);
			},
			prepareServiceRequest:function(){
				var headers = {
						accessToken:accessToken,
						langId:languageId
				};
				
				var  userRequest = {
              			userId:loggedInUserId,//UserShortProfile.settings.userId,
              			profileName:UserShortProfile.settings.profileUniqueIdentifier
              	};
            	 // userRequest= JSON.stringify(userRequest);
            	  var options = {
             			 url:getModelObject('serviceUrl')+UserShortProfile.settings.serviceUrl,
             			 data:userRequest,
             			 headers:headers,
             			 successCallBack:UserShortProfile.successCallBack,
             			 async:false
             	 };
            	  return options;
			},
			serviceInvocation:function(options){
				doAjax.GetServiceInvocation(options);
			},
			successCallBack:function(data){
				var profile = data['userProfileModel'];
				var template='<div id="messageContainer"></div>';
				template+='<span class="pull-right pad-top-5"><a><i class="close-sm-icons selected-sm memebr-fv-remove cursor-hand" containerId="{{ele}}" id="remove-short-profile-{{id}}"></i></a> </span>'
						+'	<div class="">' 
						+'      <div class="float-left pad-right-7">'
						+'		  <img src="{{photoSrc}}" class="img-sm-80-circle"/>'
						+'      </div>'
						+'      <div class="float-left span55 font-15px helvetica-neue-roman text-left position-relative top-30 darkgrey">'
						+'          <div class="userShortProfileMemberLink darkgrey memberLinkTitle" uniqueIdentifier="{{profileUniqueIdentifier}}"><span>{{name_modified}}</span></div>'
						+'      </div>'
						+'	</div>'
						+'<div class="pad-lr-12 font-12 clear-float">{{summary_modified}}</div>'
						+'<div class="position-absolute bot-12 font-13 text-center text-left width-268">'
						+'  {{#isLoggedInUser}}'
						+'  {{/isLoggedInUser}}'
						+'  {{^isLoggedInUser}}'
						+'  {{#defaultMode}}'
						+'	<div class="display-inline font-13 pad-right-12 pull-left {{^enableOrdisableConnect}}hide{{/enableOrdisableConnect}}"><a id="user-connect-button-{{container}}" connectionGroupId="{{connectionGroupId}}" href="javascript:void(0);" class="{{#enableOrdisableConnect}}{{/enableOrdisableConnect}}{{^enableOrdisableConnect}}ancher_lock{{/enableOrdisableConnect}}"><i class="connection-sm-icons margin_i_f"></i><br/><span class="pad-top-2 font-9px darkgrey">Connect</span></a></div>'
						+'	<div class="display-inline pad-right-12 font-13 pull-left"><a id="user-message-button-{{container}}" class="{{^enableMessageOption}}ancher_lock{{/enableMessageOption}}" recipientPhoto="{{photoSrc}}" recipientName="{{firstName}} {{lastName}}" recipientUserId="{{userId}}" href="javascript:void(0);"><i class="message-sm-icons {{^enableMessageOption}}disabled-sm{{/enableMessageOption}} margin_i_f"></i><br/><span class="pad-top-2 font-9px darkgrey">Message</span></a></div>'
						+'  <div class="hide display-inline font-13 pad-right-12  pull-left"><a id="user-conversation-button-{{container}}" class="ancher_lock" href="javascript:void(0);"><i class="conversation-sm-icons margin_i_f"></i><br/><span class="pad-top-2 font-9px darkgrey">Conversation</span></a></div>'
						+'  {{/defaultMode}}'
						//+'  <div><input type="button" currentProfileUniqueIdentifier="{{profileUniqueIdentifier}}" {{#hasPrev}}{{/hasPrev}}{{^hasPrev}}disabled{{/hasPrev}} id="user-profile-prev-button" value="prev"/>&nbsp;&nbsp;&nbsp;<input type="button" currentProfileUniqueIdentifier="{{profileUniqueIdentifier}}" {{#hasNext}}{{/hasNext}} {{^hasNext}}disabled{{/hasNext}} id="user-profile-next-button" value="next"/></div>'
						+'  {{#manageMemberMode}}'
						+'	<div class="display-inline pull-left font-13 pad-right-12 abc"><a class="{{^enableMessageOption}}ancher_lock{{/enableMessageOption}}" id="user-message-button-{{container}}" recipientPhoto="{{photoSrc}}" recipientName="{{firstName}} {{lastName}}" recipientUserId="{{userId}}" href="javascript:void(0);"><i class="message-sm-icons {{^enableMessageOption}}disabled-sm{{/enableMessageOption}} margin_i_f"></i><br/><span class="pad-top-2 font-9px darkgrey">Message</span></a></div>'
						+'  <div class="hide display-inline pull-left font-13 pad-right-12"><a id="user-conversation-button-{{container}}" class="ancher_lock" href="javascript:void(0);"><i class="conversation-sm-icons margin_i_f"></i><br/><span class="pad-top-2 font-9px darkgrey">Conversation</span></a></div>'
						+'   {{#changeRolePermission}}'
						+'  <div class="display-inline pull-left font-13 pad-right-12"><a id="change-role-button-{{container}}" count="'+UserShortProfile.settings.count+'" href="javascript:void(0);"><i class="changeowner-sm-icons margin_i_f"></i><br/><span class="pad-top-2 font-9px darkgrey">Role</span></a></div>'
						+'   {{/changeRolePermission}}'
						+'  {{^isDeleteDisabled}}'
						+'  <div class="pull-right display-inline font-13"><a id="delete-member-button-{{container}}" class="{{#isOwner}}ancher_lock{{/isOwner}}" href="javascript:void(0);"><i class="trash-icons-sm selected-sm margin_i_f cursor-hand"></i><br/><span class="pad-top-2 font-9px darkgrey">Delete</span></a></div>'
						+'  {{/isDeleteDisabled}}'
						+'  {{/manageMemberMode}}'
						+'  {{#pendingMemberMode}}'
						+'  <div class="display-inline pull-left font-13 pad-right-12"><a id="approve-member-button-{{container}}" href="javascript:void(0);"><i class="rsvp-icons accepted"></i><br/><span class="pad-top-2 font-9px darkgrey">Approve</span></a></div>'
						+'  <div class="display-inline pull-left font-13 pad-right-12"><a id="reject-member-button-{{container}}" href="javascript:void(0);"><img src="'+contextPath+'/static/pictures/reject.png" class="width16" alt="Reject"><br/><span class="pad-top-2 font-9px darkgrey">Reject</span></a></div>'
						+'  <div class="display-inline pull-left font-13 pad-right-12 hide"><span class="trash-icons-sm enabled-sm"></span><div class="pad-top-2 font-9px darkgrey">Ignore</div></div>'
						+'  <div class="pull-right display-inline text-right font-13 hide"><a id="block-member-button-{{container}}" href="javascript:void(0);"><img src="'+contextPath+'/static/pictures/ban.png" class="width16" alt="Block"><br/><span class="pad-top-2 font-9px darkgrey">Block</span></a></div>'
						+'  {{/pendingMemberMode}}'
						+'  {{#preapprovedMemberMode}}'
						+'	<div class="display-inline font-13 pad-right-12 pull-left {{^enableOrdisableConnect}}hide{{/enableOrdisableConnect}}"><a id="user-connect-button-{{container}}" connectionGroupId="{{connectionGroupId}}" href="javascript:void(0);" class="{{#enableOrdisableConnect}}{{/enableOrdisableConnect}}{{^enableOrdisableConnect}}ancher_lock{{/enableOrdisableConnect}}"><i class="connection-sm-icons margin_i_f"></i><br/><span class="pad-top-2 font-9px darkgrey">Connect</span></a></div>'
						+'	<div class="display-inline font-13 pad-right-12 pull-left"><a id="user-message-button-{{container}}" recipientPhoto="{{photoSrc}}" recipientName="{{firstName}} {{lastName}}" recipientUserId="{{userId}}" href="javascript:void(0);"><i class="message-sm-icons margin_i_f"></i><br/><span class="pad-top-2 font-9px darkgrey">Message</span></a></div>'
						+'  <div class="hide display-inline font-13 pad-right-12 pull-left"><a id="user-conversation-button-{{container}}" class="ancher_lock" href="javascript:void(0);"><i class="conversation-sm-icons margin_i_f"></i><br/><span class="pad-top-2 font-9px darkgrey">Conversation</span></a></div>'
						+'  {{/preapprovedMemberMode}}'
						+'  {{/isLoggedInUser}}'
						+'</div>';
				var isActive = false;
				var isTrue = false;
				  if(data['associationStatus'] == 'NOT_MEMBER' || data['associationStatus'] == 'PENDING_FOR_APPROVAL' ){
					  isTrue = true;
					  profile.enableOrdisableConnect = true;
					  profile.enableMessageOption = true;
				  }else if(data['associationStatus'] == 'ACTIVE'){
					  isActive = true;
					  profile.enableMessageOption = true;
				  }
				  if(UserShortProfile.settings.mode == 'default'){
					  if(UserShortProfile.settings.isGroupMember && UserShortProfile.settings.connectionLevel == "FIRST_LEVEL" || isActive){
						  isActive = false;
						  profile.enableMessageOption = true;
					  }else if(UserShortProfile.settings.isGroupMember && UserShortProfile.settings.connectionLevel == "SECOND_LEVEL"){
						  isTrue = false;
						  profile.enableMessageOption = false;
					  }
					  else{
						  if(isTrue){
							  isTrue = false;
							  profile.enableMessageOption = true;
						  }else{
							  profile.enableMessageOption = false;
						  }
					  }
					  
				  }
				  
				  if(UserShortProfile.settings.mode == 'manageMember'){
						  var isManageSection = $('.ismanagesectionview').is(':visible');
						  if(isManageSection && data['associationStatus'] == 'NOT_MEMBER' || data['associationStatus'] == 'PENDING_FOR_APPROVAL'){
							  profile.enableMessageOption = true;
						  }
				  }
				  
				  
				  if(UserShortProfile.settings.members != undefined && UserShortProfile.settings.members.length != undefined){		  
					for(var i=0;i<UserShortProfile.settings.members.length;i++){
						if(UserShortProfile.settings.profileUniqueIdentifier == UserShortProfile.settings.members[i]){
							var j = i+1;
							var k = i-1;
							if(UserShortProfile.settings.members[j]){
								hasNext = true;
							}
							if(UserShortProfile.settings.members[k]){
								hasPrev = true;
							}
						}
					}
				  }
				if(profile.photoId){
					profile.photoSrc = '/contextPath/User/'+profile.photoId+'/profile.jpg';
				}else{
					profile.photoSrc = contextPath+'/static/pictures/profiles/no-profile-pic.jpg';
				}
				profile.hasNext = hasNext;
				profile.hasPrev = hasPrev;
				profile.connectionGroupId = data['groupUniqueIdentifier'];
				profile.ele = UserShortProfile.settings.ele;
				if(UserShortProfile.settings.mode == 'default'){
					profile.defaultMode = true;
				}else if(UserShortProfile.settings.mode == 'manageMember'){
					if(UserShortProfile.settings.member.groupRoleName == 'Owner'){
						profile.isOwner = true;
					}else{
						profile.isOwner = false;
					}
					profile.manageMemberMode = true;
					// Checking Change Role Permissions.
					var changeRolePermission = false;
					if(UserShortProfile.settings.groupPermissions && UserShortProfile.settings.groupPermissions.indexOf('CHANGE_ROLE_TO_ADMIN') > -1 || UserShortProfile.settings.groupPermissions.indexOf('CHANGE_ROLE_TO_MEMBER') > -1) {
						changeRolePermission = true;
					}
					profile.changeRolePermission = changeRolePermission;
				}else if(UserShortProfile.settings.mode == 'pendingMember'){
					profile.pendingMemberMode = true;
				}else if(UserShortProfile.settings.mode == 'preapprovedMember'){
					profile.preapprovedMemberMode = true;
				}
				if(profile.summary && profile.summary.length > 140){
					profile.summary_modified = profile.summary.substring(0,140)+'...';
				}else{
					profile.summary_modified = profile.summary;
				}
				profile.container = UserShortProfile.settings.ele.substring(1);
				
				if(!profile.name){
					profile.name = profile.firstName+' '+profile.lastName;
				}
				
				if(profile.name && profile.name.length > 25){
					profile.name_modified = profile.name.substring(0,20)+'...';
				}else{
					profile.name_modified = profile.name;
				}
				if(loggedInUserId == UserShortProfile.settings.userId){
					profile.isLoggedInUser = true;
				}else{
					profile.isLoggedInUser = false;
				}
				if(UserShortProfile.settings.members != undefined && UserShortProfile.settings.members.length != undefined){
					for(var i=0;i<UserShortProfile.settings.members.length;i++){
						if(loggedInUserId == UserShortProfile.settings.members[i].userId && UserShortProfile.settings.members[i].groupRoleName == 'Administrator' 
							&&(UserShortProfile.settings.member.groupRoleName == 'Administrator' || UserShortProfile.settings.member.groupRoleName == 'Owner')){
							profile.isDeleteDisabled = true;
						}
					}
				}
				var html = Mustache.to_html(template,profile); 
				var parentDiv = '<div id="profileContainer"></div><div id="changeRoleContainer" class="whitebg hide"></div>';
				$(UserShortProfile.settings.ele).html(html);
				$("#profileContainer").html(html);
				$(UserShortProfile.settings.ele).removeClass('hide');
				UserShortProfile.bindEvents();
			},
			staticUI:function(element){
				
			},
			buildNextOrPrevProfile:function(currentProfileUniqueIdentifier,isFromNextOrPrev){
				var profileUniqueIdentifier;
				if(UserShortProfile.settings.members != undefined && UserShortProfile.settings.members.length != undefined){
					for(var i=0;i<UserShortProfile.settings.members.length;i++){
						if(currentProfileUniqueIdentifier == UserShortProfile.settings.members[i].profileUniqueIdentifier){
							var j = i+1;
							var k = i-1;
							if(isFromNextOrPrev == true){
								profileUniqueIdentifier = UserShortProfile.settings.members[j];
							}else if(isFromNextOrPrev == false){
								profileUniqueIdentifier = UserShortProfile.settings.members[k];
							}else{
								profileUniqueIdentifier = UserShortProfile.settings.members[i];
							}
							
						}
					}
				}
				var options = {
						ele:UserShortProfile.settings.ele,
						userId:UserShortProfile.settings.userId,
						profileUniqueIdentifier:profileUniqueIdentifier,
						members:UserShortProfile.settings.members
				};
				UserShortProfile.init(options);
			},
			connectSuccessCallBack:function(data){
				var results = data['result'];
				var status = results['status'];
				if(status == "true"){
					//TODO::need to place msg
					doAjax.displaySuccessMessage('Connection Request Sent');
				}
			},
			managePendingMembersSuccessCallBack:function(requestInfo,data){
				if(requestInfo.memberStatus == 'approved' || requestInfo.memberStatus == 'declined'){
					doAjax.displaySuccessMessage('Request to join group '+requestInfo.memberStatus +'.');
				}else if(requestInfo.memberStatus == 'blocked'){
					doAjax.displaySuccessMessage('Member status changed');
				}
				var groupData = requestInfo.groupData;
				var membersCount = parseInt(groupData.groupInfoModel.membersCount);
				if(requestInfo.memberStatus == 'approved'){
					membersCount = parseInt(groupData.groupInfoModel.membersCount)+1;
				}
				var groupNameOptions={
	        			ele:"#groupNameContainer",
	        			data:{
	        				groupName:groupData.groupInfoModel.groupName,
	        				groupMemberCount:membersCount,
	        				isMenuEnabled:true,
	        				groupData: groupData,
	        				groupInfo:groupData.groupInfoModel,
	        				groupPermissions:UserShortProfile.settings.groupPermissions
	        			}
	        	};
	        	GroupName.init(groupNameOptions);
	        	
				$("#manage-group-members-pending").trigger("click");
			},
			bindEvents:function(){
			
				  $(".userShortProfileMemberLink").off("click").bind("click",function(e){
           			          		
             			 var uniqueProfileID = $(this).attr('uniqueIdentifier');      		  
                	
                	 	 window.open(contextPath+'/userprofile/profile/'+uniqueProfileID,'_blank');
                		  	 		 
                	});
                	
				$("[id^=remove-short-profile-]").off("click").bind("click",function(e){
					var containerId = $(this).attr('containerId');
					$(containerId).html('');
					$(containerId).addClass('hide');
				});
				$("#user-profile-next-button").off("click").bind("click",function(e){
					var currentProfileUniqueIdentifier = $(this).attr('currentProfileUniqueIdentifier');
					UserShortProfile.buildNextOrPrevProfile(currentProfileUniqueIdentifier,true);
				});
				$("#user-profile-prev-button").off("click").bind("click",function(e){
					var currentProfileUniqueIdentifier = $(this).attr('currentProfileUniqueIdentifier');
					UserShortProfile.buildNextOrPrevProfile(currentProfileUniqueIdentifier,false);
				});
				$("#user-connect-button-"+container).off("click").bind("click",function(e){
					$("#user-connect-button").addClass('ancher_lock');
					var connectionGroupId = $(this).attr('connectionGroupId');
					var connectionRequest = {
							                 "userId":UserShortProfile.settings.userId,
							                 "groupUniqueIdentifier":connectionGroupId,
							                 "langId":languageId,
							                 "accessToken":accessToken,
							                 "requestTypeEnum":"CONNECTION"
							               };
					 connectionRequest = JSON.stringify(connectionRequest);
					var options = {
						url:getModelObject('serviceUrl')+UserShortProfile.settings.connectionServiceUrl,
						data:connectionRequest,
						successCallBack:UserShortProfile.connectSuccessCallBack,
						async:true
					};
					doAjax.PostServiceInvocation(options);
					
				});
                $("#user-message-button-"+container).off("click").bind("click",function(e){
                	
                	var recipientPhoto = $(this).attr('recipientPhoto');
                	var recipientUserId = $(this).attr('recipientUserId');
                	var recipientName = $(this).attr('recipientName');
					var messageOptions={
					        ele : '#modal-box-wrapper',
					        isFromContactUs:false,
							recipients:[{
								photoId : recipientPhoto,
								userId : recipientUserId,
								name : recipientName
							}]
					        
					};
					Message.init(messageOptions);
					$("html,body").animate({scrollTop:0},0);
				});
                $("#change-role-button-"+container).off("click").bind("click",function(e){
                	$("#profileContainer").addClass('hide');
                	var count = $(this).attr('count');
                	changeRoleOptoins={
                		   ele:"#group-member-changerole-"+count,
                		   member:UserShortProfile.settings.member,
                		   groupData:UserShortProfile.settings.groupData,
                		   groupPermissions:UserShortProfile.settings.groupPermissions
                	};
                	
                	ChangeRole.init(changeRoleOptoins);
                });
                //called when user clicks on approve button
                $("#approve-member-button-"+container).off("click").bind("click",function(e){
	                	pendingFlag = true;
	                	apporvedOrDeclinedFlag = "approved";
	                	UserShortProfile.managePendingGroupMembers(pendingFlag,apporvedOrDeclinedFlag);
	            });
                //called when user clicks onn reject button
                $("#reject-member-button-"+container).off("click").bind("click",function(e){
                	 pendingFlag = false;
                	 apporvedOrDeclinedFlag = "declined";
                	 UserShortProfile.managePendingGroupMembers(pendingFlag,apporvedOrDeclinedFlag);
                });
                
                //called when user clicks on block button
                /*$("#block-member-button").off("click").bind("click",function(e){
                	var blockMemberRequest = {
                			accessToken:accessToken,
                			groupId:UserShortProfile.settings.groupData.groupInfoModel.groupId,
                			groupUniqueIdentifier:UserShortProfile.settings.groupData.groupInfoModel.uniqueIdentifier,
                			manageGroupActionEnum:'BLOCK_MEMBER',
                			membersList:UserShortProfile.settings.member.memberId
                	};
                		blockMemberRequest= JSON.stringify(blockMemberRequest);
                		var options = {
                     			 url:getModelObject('serviceUrl')+UserShortProfile.settings.manageMemberServiceUrl,
                     			 data:blockMemberRequest,
                     			 requestInfo:{memberStatus:'blocked'},
                     			 successCallBack:UserShortProfile.managePendingMembersSuccessCallBack,
                     	 };
                   	doAjax.PutServiceInvocation(options);
               });*/
                
               $("#delete-member-button-"+container).off("click").bind("click",function(e){
            	   
            	   Confirmation.init({
            		 yesLabel:"Delete",
            		 noLabel:"Cancel",
            		 title:"Delete Group Member",
   					ele:GroupName.settings.ele,
   					onYes:function(e){
   						 var manageGroupActionEnum = 'LEAVE';
	   	      		     var  deleteMemberRequest = {
	   	              			userId:loggedInUserId,
	   	              			accessToken:accessToken,
	   	              			groupId:UserShortProfile.settings.groupData.groupInfoModel.groupId,
	   	              			membersList:[UserShortProfile.settings.member.memberId],
	   	              			groupUniqueIdentifier:UserShortProfile.settings.groupData.groupInfoModel.uniqueIdentifier,
	   	              			manageGroupActionEnum:manageGroupActionEnum,
	   	              			memberUserId:[UserShortProfile.settings.member.userId]
	   	              	};
	   	      		    deleteMemberRequest= JSON.stringify(deleteMemberRequest);
	   	               	var options = {
	   	                 			 url:getModelObject('serviceUrl')+UserShortProfile.settings.manageMemberServiceUrl,
	   	                 			 data:deleteMemberRequest,
	   	                 			 requestInfo:{mode:'manageMember'},
	   	                 			 successCallBack:UserShortProfile.manageMembersSuccessCallBack,
	   	                 			 async:true
	   	                 	 };
	   	               	doAjax.PutServiceInvocation(options);
   					},
   					message:'Are you sure want to delete the group member?'
   				});
            	   
	                
               });
                
			},
			manageMembersSuccessCallBack : function(requestInfo,data){
				doAjax.displaySuccessMessage('Group Member deleted');
				var groupNameOptions={
	        			ele:"#groupNameContainer",
	        			data:{
	        				groupName:UserShortProfile.settings.groupData.groupInfoModel.groupName,
	        				groupMemberCount:parseInt(UserShortProfile.settings.groupData.groupInfoModel.membersCount)-1,
	        				isMenuEnabled:true,
	        				groupData: UserShortProfile.settings.groupData,
	        				groupInfo:UserShortProfile.settings.groupData.groupInfoModel,
	        				groupPermissions:UserShortProfile.settings.groupPermissions
	        			}	
	        	};
	        	GroupName.init(groupNameOptions);

	        	var options={
	        		  ele:"#groupFaceContainer",
	        		  uniqueIdentifier:UserShortProfile.settings.groupData.groupInfoModel.uniqueIdentifier,
	        		  isFromInfo:false,
	        		  isFromManage:false,
	        		  groupData:UserShortProfile.settings.groupData,
	        		  groupPermissions:UserShortProfile.settings.groupPermissions
	        	};
	        	GroupFace.init(options);
				$("#manage-group-members-active").trigger('click');
                
			},
			
			//common function to manage pending group member requests
			managePendingGroupMembers : function(pendingFlag,memberStatus){
				var pendingApprovalRequest = {
            			accessToken:accessToken,
            			responedMemberId:UserShortProfile.settings.userId,
            			groupMemberId:UserShortProfile.settings.member.memberId,
            			isApprovedOrDeclined:pendingFlag,
            			groupId:UserShortProfile.settings.groupData.groupInfoModel.groupId
            	};
            	pendingApprovalRequest= JSON.stringify(pendingApprovalRequest);
            	var options = {
              			 url:getModelObject('serviceUrl')+UserShortProfile.settings.managePendingMemberShipUrl,
              			 data:pendingApprovalRequest,
              			 requestInfo:{memberStatus:memberStatus,groupData:UserShortProfile.settings.groupData},
              			 successCallBack:UserShortProfile.managePendingMembersSuccessCallBack,
              			 async:true
              	 };
            	doAjax.PostServiceInvocation(options);
			},
		};
}.call(this);


var ChangeRole = function(){
	var elementContainer;
	var languageId = $("#langId_meta").val();
	var accessToken =  $("#accessToken_meta").val();
	return {
    	    defaults:{
    		   	
			},
			settings:{
				
			},
			destory:function(){
				$(ChangeRole.settings.ele).html('');
				$(ChangeRole.settings.ele).addClass('hide');
				ChangeRole.settings = {};
			},
			init:function(options){
				this.destory();
				this.settings = $.extend(this.defaults,options);
	            var element = this.settings.ele;
	            elementContainer = element.substring(1);
	            this.staticUI(element);
	            this.controllerInvocation();
			},
			controllerInvocation: function(){
				var options={
          				url: contextPath+'/group/getgrouproles',
          				data:{groupUniqueIdentifier:ChangeRole.settings.groupData.groupInfoModel.uniqueIdentifier,langId:languageId},
          				//parentId:ChangeRole.settings.ele,
          				successCallBack:ChangeRole.getGroupRolesSuccessCallBack,
          				async:false
          		};
          		doAjax.ControllerInvocation(options); 
			},
			getGroupRolesSuccessCallBack:function(data){
				
				var template = '{{#roles}}'
					           +'<label class="display-table mar-bottom-10">'
			    	    	   +'	<input type="radio" name="changeRole" class="changeRole" roleName="{{roleName}}" value="{{roleId}}" {{#isDisableOwner}}disabled{{/isDisableOwner}} {{#isChecked}}checked{{/isChecked}}/><span class="check"></span><span class="font-10px pad-right-25">{{roleName}}</span>'
			    	    	   +'</label>'
			    	    	   +'{{/roles}}';
				var rolesData = [];
				if(data){
					data = $.parseJSON(data);
					for(var i=0;i<data.length;i++){
						if(data[i].roleName == ChangeRole.settings.member.groupRoleName && data[i].roleName == 'Administrator'){
							data[i].isAdminStrator = true;
							data[i].isDisableOwner = false;
						}else if(data[i].roleName == 'Owner' && ChangeRole.settings.member.groupRoleName == 'Member'){
							data[i].isAdminStrator = false;
							data[i].isDisableOwner = true;
						}
						if(data[i].roleName == 'Member'){
							data[i].roleName = 'Regular '+data[i].roleName;
						}else{
							data[i].roleName = 'Group '+data[i].roleName;
						}
						if(data[i].roleId == ChangeRole.settings.member.groupRoleId){
							data[i].isChecked = true;
						}
						
						rolesData.push(data[i]);
					}
				}
				var roles ={
						roles:rolesData
				};
					
				var html = Mustache.to_html(template,roles); 
				$("#groupsRolesContainer").html(html);
			},
			
             /**
              *  bind operations performed on UI
              */
              bindEvents:function(){
            	  $("#cancel-change-role-button").off("click").bind("click",function(e){
            		  ChangeRole.destory();
            	  });
            	  $("#close-change-role").off("click").bind("click",function(e){
            		  ChangeRole.destory();
            	  });
            	  $("#confirm-change-role-button").off("click").bind("click",function(e){
            		  // service invocation.
            		  var roleName = $("input[type='radio'][name='changeRole']:checked").attr('roleName');
            		  if(roleName == 'Group Owner'){
            			  Confirmation.init({
            				 yesLabel:"Change Owner",
                     		 noLabel:"Cancel",
                     		 title:"Change Group Owner",
            				  //ele:ChangeRole.settings.ele,
            				  ele:'#confirmation-popupid',
            				  onYes:function(e){
            					  var changedRoleId = $("input[type='radio'][name='changeRole']:checked").val();
            					  var headers = {
            							  accessToken:accessToken,
            							  langId:$("#langId_meta").val()
            					  };
            					  var requestParams = '?groupUniqueIdentifier='+ChangeRole.settings.member.groupUniqueIdentifier+'&memberId='+ChangeRole.settings.member.memberId+'&actionType=CHANGE_OWNER_REQUEST'+'&userId='+ChangeRole.settings.member.userId;
            					  var options={
            							  url:getModelObject('serviceUrl')+'/group/2.0/changeGroupOwner'+requestParams,
            							  headers:headers,
            							  requestInfo:{action:'ChangeOwner'},
            							  //commented below line to fix bug-3591
            							  //parentId:ChangeRole.settings.ele,
            							  successCallBack:ChangeRole.successCallBack,
            							  async:true
            					  };
            					  doAjax.PutServiceInvocation(options);
            				  },
            				  message:'Are you sure want to change the Group Owner?'
            			  });
            		  }else{
            			  Confirmation.init({
            				  yesLabel:"Change Role",
                     		  noLabel:"Cancel",
                     		  title:"Change Role",
            				  //ele:ChangeRole.settings.ele,
            				  ele:'#confirmation-popupid',
            					onYes:function(e){
            						  var changedRoleId = $("input[type='radio'][name='changeRole']:checked").val();
      	                  		  var changeRoleRequest = {
      	                  				  accessToken : accessToken,
      	                  				  groupUniqueIdentifier:ChangeRole.settings.member.groupUniqueIdentifier,
      	                  				  membersList:[ChangeRole.settings.member.memberId],
      	                  				  manageGroupActionEnum:'CHANGE_ROLE',
      	                  				  roleId:changedRoleId
      	                  		  };
      	                  		  changeRoleRequest = JSON.stringify(changeRoleRequest);
      	                  		  var options={
      	                  				  url:getModelObject('serviceUrl')+'/group/1.0/manageGroupMembers',
      	                  				  data:changeRoleRequest,
      	                  				  requestInfo:{action:'ChangeRole'},
      	                  				  //parentId:ChangeRole.settings.ele,
      	                  				  successCallBack:ChangeRole.successCallBack,
      	                  				  async:true
      	                  		  };
      	                  		  doAjax.PutServiceInvocation(options);
            					},
            					message:'Are you sure want to change the role?'
            				});  
            		  }
            	  });
              },
              successCallBack:function(requestInfo,data){
            	   if(requestInfo.action == 'ChangeRole' || requestInfo.action == 'ChangeOwner'){
            		  if(data.isSuccess == 'true'){
            			  if(requestInfo.action == 'ChangeOwner'){
            				  doAjax.displaySuccessMessage('Owner change request initiated');
            			  }else{
            				  doAjax.displaySuccessMessage('Role changed');
            			  }
                		  
                		  //window.location.assign(ChangeRole.settings.member.groupUniqueIdentifier);
                		  $("#group-manage-link").trigger('click');
                		  /*$("html, body").animate({
                		        scrollTop: 0
                		    }, 0);*/
                		  if($("#groupFaceContainer").length){
    	            		  var options={
    	                    		  ele:"#groupFaceContainer",
    	                    		  uniqueIdentifier:ChangeRole.settings.member.groupUniqueIdentifier,
    	                    		  isFromInfo:false,
    	                    		  isFromManage:false,
    	                    		  groupPermissions:ChangeRole.settings.groupPermissions
    	                    	};
    	                    	GroupFace.init(options);
                		  }
                		  if($("#manage-group-members-active").length){
                			  $("#manage-group-members-active").trigger('click');  
                		  }
                		  $("#mainContentContainer").html('');
                		  var groupMemberHeaderoptions = {
    							  ele:"#mainContentContainer",
    							  isFromManage:true,
    							  groupPermissions:ChangeRole.settings.groupPermissions
    						};
    						GroupMemberHeader.init(groupMemberHeaderoptions);
    						
                		  var groupMemberOptions = {
      							ele:"#mainContentContainer",
      							level:'all',
      							mode:'manageMember',
      							groupData:ChangeRole.settings.groupData,
      							pageNo:1,
      							pageSize:16,
      							groupPermissions:ChangeRole.settings.groupPermissions
      					     };
      						GroupMembers.init(groupMemberOptions);
                	  }  
            	  }
            	  $(document).trigger('gapslideIntit');
            	  
              },
              staticUI:function(element){
            	    var template='<div class="">'
            	    	+'	<div class="grey-bottom-border">'
            	    	+'		<a class="member-fv-remove cursor-hand pull-right" id="close-change-role"><i class="close-sm-icons selected-sm"></i></a>'
            	    	+'		<div class="font-18px text-align-left pad-bot-12 darkgrey">Change Role</div>'
            	    	+'	</div>'
            	    	+'	<div class="span30 float-left pad-top-12"><img src="{{photoSrc}}" class="img-sm-80-circle"/></div>'
            	    	+'	<div class="mar-top-35 float-left pad-left-7 width-185">'                                     
            	    	+'		<div class="font-15px helvetica-neue-roman text-align-left  darkgrey">{{memberName_modified}}</div>'
            	    	+'		<div class="font-12px text-align-left darkgrey">{{groupRoleName_modified}}</div>'
            	    	+'	</div>'
            	    	+'	<div class="clear-float pad-top-4"></div>'
            	    	+'	 <div class="radiobuttons float-left pad-tb-10">'
            	    	+'		<div class="mar-left-86 text-left " id="groupsRolesContainer">'
            	    	
            	    	+'		</div>'                                            
            	    	+'	</div>'
            	    	+'	<div class="text-center mar-top-10">'
            	    	+'		<input value="Confirm" id="confirm-change-role-button" class="def-button font-17 mar-right-8" type="button">'
            	    	+'		<input value="Cancel" id="cancel-change-role-button" class="grey-button font-17" type="button">'
            	    	+'	</div> '
            	    	+'</div>';
            	    if(ChangeRole.settings.member.photoId){
            	    	ChangeRole.settings.member.photoSrc = '/contextPath/User/'+ChangeRole.settings.member.photoId+'/profile.jpg';
            	    }else{
            	    	ChangeRole.settings.member.photoSrc = contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg';
            	    }
            	    if(ChangeRole.settings.member.groupRoleName == 'Member'){
            	    	ChangeRole.settings.member.groupRoleName_modified = 'Regular '+ChangeRole.settings.member.groupRoleName;
					}else{
						ChangeRole.settings.member.groupRoleName_modified = 'Group '+ChangeRole.settings.member.groupRoleName;
					}
            	    if(ChangeRole.settings.member.memberName && ChangeRole.settings.member.memberName.length > 27 ){
            	    	ChangeRole.settings.member.memberName_modified = ChangeRole.settings.member.memberName.substring(0,26)+'...';
            	    }else{
            	    	ChangeRole.settings.member.memberName_modified = ChangeRole.settings.member.memberName;
            	    }
            	    var html = Mustache.to_html(template,ChangeRole.settings.member);
            	    
            	    $(element).html(html);
            	    $(element).removeClass('hide');
            	    ChangeRole.bindEvents();
              }
       };
}.call(this);