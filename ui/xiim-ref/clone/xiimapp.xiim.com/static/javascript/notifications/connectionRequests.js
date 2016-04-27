/**
 * @author Next Sphere Technologies
 * Connection Notification Widget
 * 
 * Connection Notification widget will get notification related to user request.
 * 
 * 
 */


var scriptElement = document.getElementsByTagName("script");
var baseElement = scriptElement[scriptElement.length - 1].parentNode;
var ConnectionRequests = function(){
	var accessToken = $("#accessToken_meta").val();
	var userId = $("#loggedInUserId-meta").val();
	var currentUserGroupId = $("#currentUserGroupId").val();
	var connectionCount = '';
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
        	var connectionRequestCount = $("#connectionRequestCount").html();
        	var startResult = 0;
        	var endResult = 10;
        	if(connectionRequestCount !=''){
            	 endResult = 12;
        	}
			var connectionRequests = {
				groupId : currentUserGroupId,
				receiverType : 'NOTIFICATION',
				startResult : startResult,
				endResult : endResult
			};
			var options={
      				url: contextPath+'/feeds/getFeeds',
      				data:connectionRequests,
      				completeCallBack:ConnectionRequests.completeCallBack,
      				successCallBack:ConnectionRequests.successCallBack,
      				async:true
      		};
      		doAjax.ControllerInvocation(options); 
        },
        
        successCallBack:function(data){
        	$("#connectionRequestCount").addClass('hide');
        	$("#connectionRequestCount").html('');
        	data = $.parseJSON(data);
        	var feeds = data['feeds'];
			if(feeds != undefined && feeds.length == undefined){
				feeds = [feeds];
			}
			connectionCount = feeds.length;
			if(feeds != undefined && feeds.length > 0){
				for(var i=0;i<feeds.length;i++){
					if(feeds[i].activitySummary != undefined){
						var len = (feeds[i].activitySummary).length;
					    if(len>18){
					    	feeds[i].activitySummary = (feeds[i].activitySummary).substr(0,18)+'...';
					    }
					}
					
				}
			}
        	ConnectionRequests.dynamicUI(data);
        },
        manageConnectionsSuccessCallBack:function(requestInfo,data){
        	var status = data['isSuccess'];
          	 if(status == 'true'){
           		var isClickedUser =$("#responseOptions_"+requestInfo.memberId).attr('isClicked');
          		 $(".closeIcon_"+requestInfo.memberId).removeClass('hide');
          		 $("#conectionRequestDiv_"+requestInfo.memberId).removeClass('notification-overlay-bg');
          		 $("#connections_popup_processing_"+requestInfo.memberId).addClass('hide');
          		 if(requestInfo.connectionRequestType == 'ACCEPT'){
          			$("#conectionRequestDiv_"+requestInfo.memberId).html(requestInfo.profileName+" is now a connection.");
          			 //to show received requests in 2x2 view
          			if($("#baseElementMyConnections").length > 0){
          				//checking the condition in which state is view is in dashboard based on view triggering the event
          				if(parseInt($('#5').attr('data-sizex'))==2 && parseInt($('#5').attr('data-sizey'))==2){
          					dashboardShifting.toMyConnections2x2View();
          				}else if(parseInt($('#5').attr('data-sizex'))==1 && parseInt($('#5').attr('data-sizey'))==2){
          					dashboardShifting.toMyConnections1x2View();
          				}else{
          					dashboardShifting.toMyConnections1x1View();
          				}
          			}					 
          		 }else if(requestInfo.connectionRequestType == 'IGNORE'){
          			 //to show received requests in 2x2 view
          			 if($(".recievedConnections .recievedMember").length >0){
          				$("#myConnectionsPendingRequestHyperLinkID").trigger('click');
          			 }
          			 $("#conectionRequestDiv_"+requestInfo.memberId).html('<span class="toolbar-element-name">Friend request ignored.</span>');
          		 }
          		 //bug fix for XIP-3631
          		 if($('.isAcceptConnectionReqdoneClass').length > 0){
          			 $('.isAcceptConnectionReqdoneClass').addClass('disable-btn');
          		 }
          		 
          		if(isClickedUser == 'true'){
           			ConnectionRequests.buildViewUserProfile(requestInfo.profileUniqueIdentifier, requestInfo.memberId);
           		}
          		connectionCount = connectionCount - 1;
          		if(connectionCount == 0){
          			$(ConnectionRequests.settings.ele).html('<span class="toolbar-element-name">No new requests.</span>');
          		}
          	 }
        },
      
        beforeSendCallBack:function(jqXHR,settings){
        },
        
        completeCallBack:function(jqXHR,textStatus){
        	$("#connectionRequests").removeClass('ancher_lock');
        },
        
        errorCallBack:function(request,status,error){
               
        },
        
        failureCallBack:function(data){
        },
        
        dynamicUI:function(data){
        	var template = '{{#feeds}}';
        	template+= '<div id="connectionReqRemove_{{memberId}}" class="overflow-hidden">'
        			+'<li class="clear-float min-height-80">'
	        		+'	<div class="col-xs-2">'
	        		+'  {{#photoId}}'
	        		+'		<img src="/contextPath/User/{{photoId}}/profile.jpg" class="img-circle tool-bar-image"/>'
	        		+'   {{/photoId}}'
	        		+'   {{^photoId}}'
	        		+'  	<img src="'+contextPath+'/static/pictures/defaultimages/no-profile-pic.jpg" class="img-circle tool-bar-image"/>'
	        		+'   {{/photoId}}'
	        		+' </div>'
	        		+' <button type="button" class="close hide connectionReqClose closeIcon_{{memberId}} pull-right" connectionMemberId="{{memberId}}">&times;</button>'
	        		+'	<div class="col-xs-10 pad-left-13-important toolbar-element-name-important" id="conectionRequestDiv_{{memberId}}">'
	        		+'	<div class="popup-processing hide" id="connections_popup_processing_{{memberId}}">'
	        		+' 		<img src="'+contextPath+'/static/pictures/ajax-loader.gif"/>'
	        		+'	</div>'
	        		+'		<div class="mar-bot-5" id="profileName_{{memberId}}"><a href="javascript:void(0);" class="toolbar-element-name-important" memberIdVal="{{memberId}}" id="viewUserShortProfile_{{memberId}}">{{profileName}}</a>'
	        		+'   <a href="javascript:void(0)"; class="hide toolbar-element-name-important" memberIdVal="{{memberId}}" id="viewUserShortProfile1_{{memberId}}">{{profileName}}</a></div>'
	        		+'   	<input type="hidden" value="{{profileUniqueIdentifier}}" id="profileUniqueIdentifier_{{memberId}}">'
	        		+'		<div class="toolbar-element-content mar-bot-5">&nbsp;{{activitySummary}}</div>'
	        		+'    <div id="responseOptions_{{memberId}}" isClicked="false">'
	        		+'			<div class="display-inline toolbar-element-content pad-right-5-important" id="acceptId_{{memberId}}">'
	        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" acceptMemberId={{memberId}}  class="connectionsRadioClass pad-right-5"/>Accept'
	        		+'			</div>'
	        		+'			<div class="display-inline toolbar-element-content pad-right-5-important" id="declineId_{{memberId}}">'
	        		+'				<img src="'+contextPath+'/static/pictures/def-radio.png" declineMemberId={{memberId}}  class="connectionsRadioClass pad-right-5"/>Ignore'
	        		+'			</div>'  
	        		+'   </div>'
	        		+'	</div>'
	        		+'</li>'
	        		+'</div>';
        		template += '{{/feeds}}';
			var connectionRequestsView = Mustache.to_html(template,data);
			if(data.feeds.length > 0){
				$(ConnectionRequests.settings.ele).append(connectionRequestsView);
			}else{
				$(ConnectionRequests.settings.ele).html('<span class="toolbar-element-name">No new requests.</span>');
			}
			
			ConnectionRequests.dynamicEvents();
        },
        bindEvents:function(){
        	
        },
        dynamicEvents:function(){ 
        	$(".connectionsRadioClass").off("click").bind("click",function(){
        		$(this).addClass('ancher_lock');
        		$(".connectionsRadioClass").attr({'src':contextPath+'/static/pictures/def-radio.png'});
        		$(this).attr({'src':contextPath+'/static/pictures/checked-radio.png'});
        		var memberId = $(this).attr('acceptMemberId');
        		var connectionRequestType = "ACCEPT";
        		if(memberId == undefined){
        			memberId = $(this).attr('declineMemberId');
        			connectionRequestType = "IGNORE";
        		}
        		var profileUniqueIdentifier = $('#profileUniqueIdentifier_'+memberId).val();
        		$("#conectionRequestDiv_"+memberId).addClass('notification-overlay-bg');
				$("#connections_popup_processing_"+memberId).removeClass('hide');
        		var profileName =$('#profileName_'+memberId).html();
        		var connectionRequestData = {
        				accessToken:accessToken,
        				respondedUserId:userId,
        				memberIds:memberId,
        				requestStatusEnum:connectionRequestType
        		};
        		connectionRequestData= JSON.stringify(connectionRequestData);
        		var options = {
        				url:getModelObject('serviceUrl')+'/group/1.0/manageConnections',
          				data:connectionRequestData,
          				requestInfo:{connectionRequestType:connectionRequestType,memberId:memberId,profileName:profileName,profileUniqueIdentifier:profileUniqueIdentifier},
          				successCallBack:ConnectionRequests.manageConnectionsSuccessCallBack,
          				async:true
          		};
          		doAjax.PostServiceInvocation(options);
        	});
        	$(".connectionReqClose").off("click").bind("click",function(){
        		var memberId =$(this).attr('connectionMemberId');
		    	$("#connectionReqRemove_"+memberId).remove();
		    }); 
        	
        	$('[id^=viewUserShortProfile_]').off("click").bind("click",function(){
        		$('html,body').animate({scrollTop: 0},'slow');
        		if($('#connectionrequesticonid').hasClass('selected-sm')){
        			$('#connectionrequesticonid').removeClass('selected-sm');
        		}
        		var memberId = $(this).attr('memberIdVal');
        		var profileUniqueIdentifier = $('#profileUniqueIdentifier_'+memberId).val();
        		ConnectionRequests.buildViewUserProfile(profileUniqueIdentifier, memberId);
        		$("#responseOptions_"+memberId).attr('isClicked','true');
        		
/*        		if($('#viewProfileMainDiv').is(':visible')){
        			if($('#viewProfileMainDiv').hasClass(".mar-top-63")){*/
        				
/*        			}
        		}*/
        	});
        	
        },
        
        buildViewUserProfile:function(profileUniqueIdentifier, memberId){
        	var urlPath=window.location.pathname;
        	var urlPathArray = urlPath.split('/');
        	if(urlPathArray.indexOf("dashboard") < 0){
        		var container = ConnectionRequests.settings.ele.substring(1);
        		var hhtml ='<form id="'+container+'hiddenForm" method="POST"><input type="hidden" value="'+profileUniqueIdentifier+'" name="profileUniqueIdentifier"><input type="hidden" value="true" name="isViewUserProfile"><input type="hidden" value="'+memberId+'" name="memberId"></form>';
        		$("#"+container).append('<div id="'+container+'hiddenDiv"></div>');
        		$("#"+container+'hiddenDiv').html(hhtml);
        		$("#"+container+'hiddenForm').attr('action',contextPath+"/dashboard/home");
        		$("#"+container+'hiddenForm').submit();
        	}else{
        		$("#connectionsDisplay").addClass('hide');
        		$("#viewConnetionProfile").removeClass('hide');
        		var options ={
        				ele:"#viewConnetionProfile",
        				flag:true,
        				profileUniqueIdentifier:profileUniqueIdentifier,
        				memberId:memberId,
        				isDashboardViewProfile:true
        		};
        		ViewUserProfile.init(options);
        	}
        },
        staticUI:function(element){
        	 
        },
	
	};

}.call(this);