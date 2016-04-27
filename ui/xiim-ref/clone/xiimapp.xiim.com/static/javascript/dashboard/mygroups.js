
/**
 * @author Next Sphere Technologies
 * My Groups (1x1) and (2x2) view  widget
 * 
 * My Groups (1x1) and (2x2)  view widget is used get all below updates,
 * 
 * 1. Received Invitations
 * 2. Sent Request
 * 3. Manage Groups
 * 
 */


var mygroups = function(){
	var loadFlagType = "";
	var element="";
	var isPlusToActivateMyGroups=false;
	
	
	return {
		init:function(flag){
			loadFlagType = flag;
			element = flag.baseElementMyGroups;
			this.staticUI(flag);
			var options = this.prepareServiceRequest(flag);
			this.serviceInvocation(options);
			this.bindEvents();
			
		
		},
		registerValidations:function(element){
			$(element).validate({});  
		},
		serviceInvocation:function(options){
			if(loadFlagType.isManageRecievedRequest||loadFlagType.isManageSendRequest || loadFlagType.isManagePendingRequest){
				doAjax.PostServiceInvocation(options);
			}else if(loadFlagType.isManageChangeOwnerRequest){
				doAjax.PutServiceInvocation(options);
			}else{
				doAjax.GetServiceInvocation(options);
			}
				
		},
		prepareServiceRequest:function(flag){

			var URI='';
			var requestObject = '';
			var isAll = false;
			var accessToken = $("#accessToken").val();
			var langId = $("#langId").val();
			var userId = $("#userId").val();
			var startResult = 0;//parseInt($("#startResultForMyGroups").val());
			if(startResult > 0){
				startResult = startResult+0;
			}else{
				startResult = 0;
			}
			var maxResult = parseInt($("#maxResultForGroups").val());
			var headers = {
					accessToken:accessToken,
					langId:langId
			};
			if(flag.isTotalCount){
				isAll = true;
			}
			var pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult, startResult, isAll));
			var URL = getModelObject('serviceUrl');
			if(flag.isMyGroups||flag.isMyGroupsTwobyTwo){
				if(flag.isMyGroupsTwobyTwo){
				pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult, startResult, true));
				}
				var queryParams = '?userId='+userId+'&searchAttribute='+1+'&pageCriteria='+pageCriteria;
				URI = URL+'/group/2.0/getGroups'+queryParams;
			}else if(flag.isGroupSearchTwobyTwo){
				
				pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult, startResult, false));
				var queryParams = '?userId='+userId+'&searchAttribute='+0+'&pageCriteria='+pageCriteria+'&groupName='+encodeURIComponent(flag.searchParameter)+'&startResult='+startResult;
				URI = URL+'/group/2.0/getGroups'+queryParams;
				
			}else if(flag.isPendingReqeust){
				pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult, startResult, true));
				var queryParams = '?userId='+userId+'&pageCriteria='+pageCriteria;
				URI = URL+'/group/2.0/getGroupPendingRequests'+queryParams;
			}
			
			else if(flag.isReceivedInvitations||flag.isReceivedInvitationsTwobyTwo){
				pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult, startResult, true));
				var queryParams = '?userId='+userId+'&pageCriteria='+pageCriteria;
				URI = URL+'/group/2.0/getReceviedInvitations'+queryParams;
			} 
			
			/***Manage Groups Block***/
			else if(flag.isManagedGroups){
				maxResult = 2;
				startResult =0;
				pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult, startResult, false));
				var queryParams = '?userId='+userId+'&pageCriteria='+pageCriteria;
				URI = URL+'/group/1.0/getAllGroupPendingRequests'+queryParams;
			}else if(flag.isManageRecievedRequest){
    			if(flag.response=='true'){
    			URI = getModelObject('serviceUrl')+'/group/1.0/sendResponseToGroupMemberRequest';
    			requestObject = {
						"invitationUniqueIdentifier": flag.invitationUID,
						"userId": userId,
		   				"isInvitationAccepted": flag.response,				
						"langId" : langId,
						"accessToken" : accessToken
          			};
    			}else{
    				URI = getModelObject('serviceUrl')+'/group/1.0/manageReceivedInvitations';
    				requestObject = {
    						"invitationUnqiueIdentifierList": [flag.invitationUID],
    						"userId": userId,
    		   				"groupRequestActionEnum": 'DELETE',				
    						"langId" : langId,
    						"accessToken" : accessToken
              			};
    			}
    			/*******Send Requests Block*******/
    		}else if(flag.isManageSendRequest){
    			//For Join Resent Request
    				if(flag.joinOrIgnore == 'JOIN'){
    					URI = getModelObject('serviceUrl')+'/group/1.0/sendRequestToJoinGroup';
            			requestObject = {
        						"groupUniqueIdentifier": flag.groupUniqueIdentifier,
        						"requestTypeEnum":'GROUPS',
        						"userId": userId,
        						"langId" : langId,
        						"accessToken" : accessToken
                  			};
    				}
    				//For Ignore Case
    				else{
    				
    					URI = getModelObject('serviceUrl')+'/group/1.0/manageSendRequests';
    					requestObject = {
        						"groupUniqueIdentifier": flag.groupUniqueIdentifier,
        						"requestTypeEnum":'GROUPS',
        						"userId": userId,
        						"langId" : langId,
        						"accessToken" : accessToken
                  			};
    				}
        			
    		}else if(flag.isManagePendingRequest){
    			URI = getModelObject('serviceUrl')+'/group/1.0/managePendingMemberShip';
				
    			requestObject = {
						"groupMemberId": flag.memberId,
						"isApprovedOrDeclined":flag.isAcceptedOrDeclined,
						"groupId":flag.groupId,
						"langId" : langId,
						"accessToken" : accessToken
          			};
    		}
    		/*******Change Owner Block*******/
    		else if(flag.isManageChangeOwnerRequest){
    			var queryParams = '?userId='+flag.respondedUserId+'&groupId='+flag.groupId+'&actionType='+flag.actionType+'&actionStatus='+flag.isAcceptedOrDeclined+'&memberId='+flag.memberId+'&groupUniqueIdentifier='+flag.groupUniqueIdentfier;
    			URI = getModelObject('serviceUrl')+'/group/2.0/changeGroupOwner'+queryParams;
    			
    		}

			requestObject = JSON.stringify(requestObject);
			var options='';
			if(flag.isManageRecievedRequest|| flag.isManageSendRequest || flag.isManagePendingRequest){
				options={
					async:true,
    				url:encodeURI(URI),
    				data:requestObject,
    				parentId:mygroups.element,
    				successCallBack:mygroups.successCallBack,
    				failureCallBack:mygroups.failureCallBack,
					
			     };
			}else{
				 options={
						async:true,
						url:URI,
						headers:headers,
						//data:requestObject,
						url:encodeURI(URI),
						parentId:mygroups.element,
						successCallBack:mygroups.successCallBack,
						failureCallBack:mygroups.failureCallBack,
						beforeSendCallBack:mygroups.beforeSendCallBack,
						completeCallBack:mygroups.completeCallBack
				 };
			}
					
					
			return options;
		},
		successCallBack:function(data){
			var div = '';
			var result = data['result'];
			var status = result['status'];
			if(status == 'true'){
				if(loadFlagType.isReceivedInvitations){
					var htmlTemplate = HTML.groupsReceivedInvitations();
					div = Mustache.to_html(htmlTemplate,data);
					$(element).empty();
					$(element).html(div);
				}else if(loadFlagType.isManageRecievedRequest){
					if(data['isSuccess']=='true'){
					$("#invitation_"+loadFlagType.invitationId).remove();
						if(loadFlagType.response=='true')
							doAjax.displaySuccessMessage('Invitation Accepted Successfully.');
						else
							doAjax.displaySuccessMessage('Invitation Removed Successfully.');							
					}
					
				}
				/*******Send Requests Block*******/
				else if(loadFlagType.isManageSendRequest){
					
					if(loadFlagType.joinOrIgnore == 'JOIN'){
						//Join 
						doAjax.displaySuccessMessage('Request to join Group sent');
						return;
					}else{
						//Ignore
						$('#sentrequest_'+loadFlagType.groupId).remove();
						var updatedCount = $('#MyGroupsSent .pendingmember').length;
						//updatedCount = updatedCount - 1;
						if(updatedCount >0){
							$('#sentCountg').html('('+updatedCount+')');
						}else{
							$('#sentCountg').html('');
							$('#emptyRequests').append('<div class="col-xs-9"><div><span class="default-message-style">There are no Pending Requests</span></div>');
						}
						
						doAjax.displaySuccessMessage('Request ignored');
						return;
					}
				}
				
				/***Manage Groups Block***/
				else if(loadFlagType.isManagePendingRequest){
					if(loadFlagType.isAcceptedOrDeclined){
						doAjax.displaySuccessMessage('Request accepted');
					}else{
						doAjax.displaySuccessMessage('Request declined');
					}
					
					mygroups.init({isManagedGroups:true,baseElementMyGroups:"#baseElementMyGroups"});
				}else if(loadFlagType.isManageChangeOwnerRequest){
					
						if(loadFlagType.isAcceptedOrDeclined == 'ACCEPT'){
							doAjax.displaySuccessMessage('Request accepted');
						}else{
							doAjax.displaySuccessMessage('Request declined');
						}
						
						mygroups.init({isManagedGroups:true,baseElementMyGroups:"#baseElementMyGroups"});
					
				}
				else if(loadFlagType.isReceivedInvitationsTwobyTwo){
					var grouprequest='';
                    var count='';
                    if(data['recievedInvitationModelList']!=undefined){
                    recievedInvitationModelList=(data['recievedInvitationModelList'].length==undefined)?[data['recievedInvitationModelList']]:data['recievedInvitationModelList'];
                    count='Total '+recievedInvitationModelList.length;
                    for(var i=0;i<recievedInvitationModelList.length;i++){                       	
                    	photo=(recievedInvitationModelList[i]['groupLogoId']==undefined)?contextPath+"/static/pictures/defaultimages/no-group-image.png":'/contextPath/Group/'+recievedInvitationModelList[i]['groupLogoId']+'/stamp.jpg';
						summary=(recievedInvitationModelList[i]['groupSummary']==undefined)?'':recievedInvitationModelList[i]['groupSummary'];
						name=recievedInvitationModelList[i]['groupName'];
						invitationUID=recievedInvitationModelList[i]['invitationToken'];
						invitationId=recievedInvitationModelList[i]['invitationId'];
						uniqueIdentifier=recievedInvitationModelList[i]['groupUniqueIdentifier'];
						requestdate=dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(recievedInvitationModelList[i]['invitedDate']),'hh:mm a MMM.dd');
						id=recievedInvitationModelList[i]['memberId'];
                    grouprequest+='<div class="recievedMember" id="invitation_'+invitationId+'">'
                    +'      	<div class="col-xs-2 mar-right-9-minus"><img src="'+photo+'"  class="my-groups-image" /></div>'
                    +'          <div class="col-xs-9 min-height-130-important pad-top-25">'
                    +'          	<div><span class="element-font-15">'+stringLimitDots(name,15)+'</span><span class="pull-right toolbar-element-content">'+requestdate+'</span></div>'
                    +'              <div class="min-height-35 toolbar-element-content pad-tb-10">'+stringLimitDots(summary,200)+'</div>'
                    +'              <div class="form-group text-right">'
                    +'                 <a class="pad-right-7" href="'+contextPath+'/group/'+uniqueIdentifier+'?Page=shell'+'?invitationUID='+invitationUID+'" > <input value="Learn More" class="def-button font-17 mar-right-30 small-button " type="button"></a>'
                    +'                  <input value="Accept" class="grey-button font-17 small-button mar-right-7" onclick="mygroups.respondRecievedRequest(\''+invitationUID+'\','+'\'true\','+invitationId+')" type="button">'
                    +'                  <input value=" Ignore" class="grey-button font-17 small-button  mar-right-30" onclick="mygroups.respondRecievedRequest(\''+invitationUID+'\','+'\'false\','+invitationId+')" type="button">'
                    +'          	</div>'
                    +'          </div>'
                    +'      </div>';
                    }
					
                    
                    }
                    else{
                    	grouprequest='<div class="col-xs-9"><div><span class="default-message-style">There are no Pending Requests</span></div>';
                    }
                    
                    div='<div id="MyGroupsRecieved" class="scroll-content mCustomScrollbar pad-bot-10 pad-top-16">                          			'
                        +'<div class="mygroups-section">  '
                        +'<div class="element-font-16 mar-bottom-25">Recieved Invitations <span class="green" id="recievedCountg">'+count+'</span></div><div id="groupsempty">'
                        +grouprequest
                        +'      </div></div>'
                        +'      </div>';
                	$(element).html('');
					$(element).html(div);
				}else if(loadFlagType.isGroupSearchTwobyTwo){
					if(data['groupInfoModelList']!=undefined){
						var groupInfoModelList=data['groupInfoModelList'].length==undefined?[data['groupInfoModelList']]:data['groupInfoModelList'];
						var groupsearchresult='';
						for(var i=0;i<groupInfoModelList.length;i++){
							var groupName=stringLimitDots(groupInfoModelList[i]['groupName'],10);
							var groupNameFull=groupInfoModelList[i]['groupName'];
							var groupProfile=stringLimitDots(groupInfoModelList[i]['groupProfile'],250);
							var groupLogo=groupInfoModelList[i]['groupLogo']==undefined?contextPath+'/static/pictures/defaultimages/no-group-image.png':'/contextPath/Group/'+groupInfoModelList[i]['groupLogo']+'/stamp.jpg';
							groupsearchresult+='<div class="pad-right-30 min-height-100">'
								+'	<div class="col-xs-3"><img class="width-80" src="'+groupLogo+'"  width="80"></div>'
								+'	<div class="col-xs-9 mar-top-25">'
								+'		<div><span class="element-font-15" title="'+groupInfoModelList[i]['groupName']+'">'+groupName+'</span></div>'
								+'		<div class="toolbar-element-content mar-bottom-20">'+groupProfile+'</div>'
								+'		<div class="form-group text-right mar-bot-25-imp"><a href="'+contextPath+'/group/'+groupInfoModelList[i]['uniqueIdentifier']+'?page=shell">'
								+'			<input value="Learn More" class="def-button font-17 small-button" type="button">'
								+'		</a></div>'
								+'	</div>'
								+'</div>';
						}
						$('#groupListValues').empty().append(groupsearchresult);
						
						var xiimcustomScrollbarOptions = {elementid:"#myGroupsTwobyTwoDivID",isUpdateOnContentResize:true,setHeight:"475px",vertical:'y'};
						xiimcustomScrollbar(xiimcustomScrollbarOptions);
						
/*						 $('#myGroupsTwobyTwoDivID').mCustomScrollbar('destroy').mCustomScrollbar({
				     		    setHeight:'475px',
				     		    advanced:{
				     		        updateOnContentResize: true
				     		    },
				     		   mouseWheelPixels: 50,
					               mouseWheel:true,
					               autoHideScrollbar:false,
					               theme: "rounded-dark"
				     		});*/
						 
						return;// here to persist the search bar The Base element should not appended with div 
						//div=$(element).html();
						
					}
					else{
						$('#groupListValues').empty().append('<div><span class="default-message-style">No Results Found !</span></div>');
						return; 

					}
					
					
				}else if(loadFlagType.isMyGroupsTwobyTwo){
					var groupsdiv='';
					var groupInfoModelList=data["groupInfoModelList"];
					if(groupInfoModelList!=undefined){
						
						var groupReceivedInvitationCount = data['groupReceivedInvitationCount'];
						//var groupPendingRequestCount = data['groupPendingRequestCount'];
						var eventInvitationCount = data['eventInvitationCount'];
						var groupCount = data['groupCount'];
						
						var groupInfoModelList=(groupInfoModelList.length==undefined)?[groupInfoModelList]:groupInfoModelList;
						for(var i=0;i<groupInfoModelList.length;i++){
							var groupPendingRequestCount=groupInfoModelList[i]['pendingRequestCount'];
							var groupId=groupInfoModelList[i]['groupId'];
							var uniqueIdentifier=groupInfoModelList[i]['uniqueIdentifier'];
							var groupName=stringLimitDots(groupInfoModelList[i]['groupName'],16);
							var groupNameFull=groupInfoModelList[i]['groupName'];
							var photo=(groupInfoModelList[i]['groupLogo']==undefined)?contextPath+'/static/pictures/defaultimages/no-group-image.png':'/contextPath/Group/'+groupInfoModelList[i]['groupLogo']+'/stamp.jpg';
							groupsdiv+=''
									+'<li  id="groupLiId'+groupId+'"  groupId="'+groupId+'" class="width-80-imp groupsULClass text-center"><div class="cursor-hand width-70 popoverGroupShortInfoClass"><div id="groupLiId'+groupInfoModelList[i]['groupId']+'" class="groupShortInfoClass"'
									+ 'groupName="'+groupInfoModelList[i]['groupName']+'" groupLogo="'+photo+'" uniqueIdentifier="'+groupInfoModelList[i]['uniqueIdentifier']+'"'
									+ 'groupId="'+groupInfoModelList[i]['groupId']+'" groupReceivedInvitationCount="'+groupReceivedInvitationCount+'" '
									+ 'groupPendingRequestCount="'+groupPendingRequestCount+'" eventInvitationCount="'+eventInvitationCount+'" isFollow="'+groupInfoModelList[i]['isFollow']+'" userRole="'+groupInfoModelList[i]['userRole']+'">'
									+    	'<img src="'+photo+'" class="groupShortInfoClassImage width-50">'
									+     	'<div class="groupShortInfoClassTitle toolbar-element-content" data-tooltip-toggle="tooltip" title="'+groupInfoModelList[i]['groupName']+'" ><div class="font-10px helvetica-neue-roman pad-tb-3 width-70">'+groupName+'</div><span class="hide">'+groupNameFull+'</span></div>'
									+      '</div></div></li>';
						}
					}else{
						groupsdiv += '<div class="noconnection-msg"><li class="noconnection-msg"><div class="mar-top-40 mar-left-220 width-100-percent default-message-style default-message-style"></div></li></div>';

					}
					 div='<div class="clearfix pad-bot-10">'
						 		+'<div class="pad-right-12 mygroups-section">'
						 		+'<div class="clearfix mar-tb-20">'
                              	+	'<div class="col-xs-3 width-80"><span id="groupsSearchHint" class="element-font-15">Groups</span><span class="mar-left-12 pad-right-2"><span class="mar-top-7 search-sm-icons selected-sm"></span></span></div>'
                                +     '<div class="col-xs-7 width-446"><input type="text" placeholder="Search My Groups" class="form-control" id="groupSearchBoxId" /></div>'
                                +      '<div class="col-xs-1 pad-left-6"><span class="plus-sm-icons vertical-align-middle mar-top-5" id="groupSearchBoxButton"></span></div>'
                                +'</div><div id="myGroupsTwobyTwoDivID" class="pad-left-10 members-profilepic scroll-content mCustomScrollbar"><div id="groupListValues"></div>'
                              	+'<ul class=" groupsList group-members-blocks">                                    '
                                +groupsdiv
                                +'</ul>'
								+'</div>'
								+'</div>'                                    
								+'</div>';
						$(element).empty();
						$(element).html(div);
						
					 /***Manage Groups Block***/
						$('#groupSearchBoxId').focus();
						
		
				}else if(loadFlagType.isPendingReqeust){
						var grouprequest='';
	                    var count='';
	                    if(data['groupInfoModelList']!=undefined){
	                    groupInfoModelList=(data['groupInfoModelList'].length==undefined)?[data['groupInfoModelList']]:data['groupInfoModelList'];
	                    count=groupInfoModelList.length==0?'':'('+groupInfoModelList.length+')';
	                    for(var i=0;i<groupInfoModelList.length;i++){                       	
	                    	photo=(groupInfoModelList[i]['groupLogo']==undefined)?contextPath+"/static/pictures/defaultimages/no-group-image.png":'/contextPath/Group/'+groupInfoModelList[i]['groupLogo']+'/stamp.jpg';
							summary=(groupInfoModelList[i]['summary']==undefined)?'':groupInfoModelList[i]['summary'];
							name=groupInfoModelList[i]['groupName'];
							groupId=groupInfoModelList[i]['groupId'];
							uniqueIdentifier=groupInfoModelList[i]['uniqueIdentifier'];
							requestdate=dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(groupInfoModelList[i]['joinRequestedDate']),'hh:mm a MMM.dd');
							id=groupInfoModelList[i]['memberId'];
	                    grouprequest+='<div class="pendingmember" id="sentrequest_'+groupId+'">'
	                    +'      	<div class="col-xs-2 mar-right-9-minus"><a href="'+contextPath+'/group/'+uniqueIdentifier+'?page=shell"><img src="'+photo+'"  class="my-groups-image" /></a></div>'
	                    +'          <div class="col-xs-9 min-height-130-important pad-top-25">'
	                    +'          	<div><span class="element-font-15">'+stringLimitDots(name,15)+'</span><span class="pull-right toolbar-element-content">'+requestdate+'</span></div>'
	                    +'              <div class="min-height-35 toolbar-element-content pad-bot-10">'+stringLimitDots(summary,200)+'</div>'
	                    +'              <div class="form-group text-right">'
	                  //  +'                 <a href="'+contextPath+'/group/'+uniqueIdentifier+'?Page=shell" > <input value="Learn More" class="def-button font-17 mar-right-30 small-button" type="button"></a>'
	                    +'                 <span class="pad-right-7"> <input value="Join" class="def-button font-17 small-button "   onclick="mygroups.manageSendRequest(\''+uniqueIdentifier+'\',\'JOIN\','+groupId+')" type="button"></span>'
	                    +'                  <input value=" Ignore" class="grey-button font-17 small-button mar-right-30"  onclick="mygroups.manageSendRequest(\''+uniqueIdentifier+'\',\'IGNORE\','+groupId+')"    type="button">'
	                    +'          	</div>'
	                    +'          </div>'
	                    +'      </div>';
	                    }
						
	                    
	                    }
	                    else{
	                    	grouprequest='<div class="col-xs-9"><div><span class="default-message-style">There are no Pending Requests</span></div>';
	                    }
	                    
	                    div='<div id="MyGroupsSent" class="scroll-content mCustomScrollbar pad-bot-10">                          			'
	                        +'<div class="mygroups-section pad-top-18">'
	                        +'<div class="element-font-16 mar-bottom-25">Sent Requests <span class="green" id="sentCountg">'+count+'</span></div><div id="emptyRequests"></div>'
	                        +grouprequest
	                        +'      </div>'
	                        +'      </div>';
	                	$(element).empty();
						$(element).html(div);
				}else if(loadFlagType.isMyGroups){
						var htmlTemplate = '';
						if(data.groupInfoModelList){
							if(data.groupInfoModelList.length == undefined){
								data.groupInfoModelList = [data.groupInfoModelList];
							}
							
							var groupReceivedInvitationCount = data['groupReceivedInvitationCount'];
							//var groupPendingRequestCount = data['groupPendingRequestCount'];
							var eventInvitationCount = data['eventInvitationCount'];
							var groupCount = data['groupCount'];
							
							htmlTemplate += '<div class="mygroups1-1"><ul>';
							for(var i=0;i<data.groupInfoModelList.length;i++){
								var groupPendingRequestCount=data.groupInfoModelList[i]['pendingRequestCount'];
								var modifiedGroupName = stringLimitDots(data.groupInfoModelList[i]['groupName'],16);
								var imageURL = contextPath+"/static/pictures/defaultimages/no-group-image.png";
		                	      if(data.groupInfoModelList[i]['groupLogo'] != undefined && data.groupInfoModelList[i]['groupLogo'] != ""){
	              						imageURL = '/contextPath/Group/'+data.groupInfoModelList[i]['groupLogo']+'/stamp.jpg';
	              					}		                		  

									 htmlTemplate += '<div><li><div class="cursor-hand width-70 mar-right-10 text-center inline-block popoverGroupShortInfoClass"><div  id="groupLiId'+data.groupInfoModelList[i]['groupId']+'" class="groupShortInfoClass popoverParents"'
										+ 'groupName="'+data.groupInfoModelList[i]['groupName']+'" groupLogo="'+imageURL+'" uniqueIdentifier="'+data.groupInfoModelList[i]['uniqueIdentifier']+'"'
										+ 'groupId="'+data.groupInfoModelList[i]['groupId']+'" groupReceivedInvitationCount="'+groupReceivedInvitationCount+'" '
										+ 'groupPendingRequestCount="'+groupPendingRequestCount+'" eventInvitationCount="'+eventInvitationCount+'" isFollow="'+data.groupInfoModelList[i]['isFollow']+'"  userRole="'+data.groupInfoModelList[i]['userRole']+'">'
										+ '<img src="'+imageURL+'" class="groupShortInfoClassImage dashboard-1x1icons">'
										+ '<div class="groupShortInfoClassTitle font-10px helvetica-neue-roman pad-tb-3 width-70" data-tooltip-toggle="tooltip" title="'+data.groupInfoModelList[i]['groupName']+'" >'+modifiedGroupName+'</div></div></div></li></div>';								
								
									 
		                		  if(i==8 && loadFlagType.isOnebyOneView){//only for one by one view
		                			  break;
		                		  }
							}
							
							htmlTemplate += '</ul></div>';							
	                	  if(loadFlagType.isOnebyOneView){
			                	  if(groupCount > 0){
				                	  htmlTemplate+="<div class='font-10px position-relative bot-4 left-28  height-20'><span class='helvetica-neue-roman'>Total </span><a href='javascript:void(0);' class='lightblue pad-left-5' id='myGroupsTotalCountID'>(" +groupCount+")</a></div>";
				                	  }
//			                	  else if(groupCount > 9){
//				                	  htmlTemplate+="<div class='font-12 position-relative bot-8 left-20 height-20'>Total <a href='javascript:void(0);' id='myGroupsTotalCountID'>" +groupCount+"</a></div>";
//				                	  }
			                }							
						}else{
							htmlTemplate += '<div class="text-align-center default-message-style"></br></br></br></br> <img src="'+contextPath+'/static/pictures/Help.png"></br></br><a href="javascript:void(0);" id="addNewGroupsID">Add Group</a></div>';
						}
						//div = Mustache.to_html(htmlTemplate,data);
						
						div = htmlTemplate;
						$(element).empty();
						$(element).html(div);
						
						/***Change Owner Of Groups Block***/
						
					
					}else if(loadFlagType.isManagedGroups){
						var baseHTML='<div id="headerContainer"></div>'
						 +'<div id="totalContainer" class="scroll-content mCustomScrollbar pad-bot-10 pad-top-16 height-503">'	
						 +'<div class="pad-top-5"><div id="pendingContainer"></div>'
						 +'<div id="changeOwnerRequestContainer"></div></div>'
						 +'</div>';		  
						
						var headerContent = '<div class="clearfix pad-top-18">'
							+'<div class="mygroups-section clearfix mar-bottom-2">'
							+'       <div class="pendingRequestMenu">'
							+'			<div>'
							+'				<span class="width-16 gear-sm-icons disabled-sm"></span>'
							+'				<span class="pad-top-8-important pad-left-8-important element-font-16"><span>Pending Requests</span></span>'
							+'			</div>'
							+'     </div>';
						
						if(!loadFlagType.isManageRecievedRequest){
							$(element).empty();
							$(element).append(baseHTML);
							$("#headerContainer").html(headerContent);
						}
						
						if(data.groupInfoModelList){
							
							if(data.groupInfoModelList.length == undefined){
								data.groupInfoModelList = [data.groupInfoModelList];
							}
							
							//Group Block
							for(var i=0;i<data.groupInfoModelList.length;i++){
								var isChangeOwnerRequest = false;
								
								var groupId = data.groupInfoModelList[i]['groupId'];
								var groupName = stringLimitDots(data.groupInfoModelList[i]['groupName'],9);
								var groupPhotoSource = (data.groupInfoModelList[i]['groupLogo']==undefined)?contextPath+'/static/pictures/defaultimages/no-group-image.png':'/contextPath/Group/'+data.groupInfoModelList[i]['groupLogo']+'/stamp.jpg';
								var groupUniqueIdentfier = data.groupInfoModelList[i]['uniqueIdentifier'];
								
								if(data.groupInfoModelList[i].members != undefined){
									
									var groupContent = '<div class="col-xs-12 clear-float mar-bottom-15">'
										+'				<div class="col-xs-2 mar-right-9-minus">'
										+'					<img src="'+groupPhotoSource+'" class="my-groups-image"/>'
										+'					<div class="element-font-15 ">'+groupName+'</div>'
										+'				</div>'
										+'				<div id="pendingGroupRequestsContainer'+i+'" class="pad-right-10 col-xs-9"></div>'
										+'              <div id="changeOwnerRequestContainer'+i+'"></div>';
									$("#pendingContainer").append(groupContent);

									if( data.groupInfoModelList[i].members.length == undefined){
										data.groupInfoModelList[i].members = [data.groupInfoModelList[i].members];
									}
									var pendingRequestcontent='';
									var changeOwnerContent = '';

									//Pending Requests Block
									for(var j=0;j<data.groupInfoModelList[i].members.length;j++){
										var memberPhotoSource ='';
										var profileSummary ='';
										var requestdate ='';
										var memberId = data.groupInfoModelList[i].members[j]['memberId'];
										if(data.groupInfoModelList[i].members[j]['changeOwnerRequest'] != 'true' || data.groupInfoModelList[i].members[j]['changeOwnerRequest'] ==false){
											
											isChangeOwnerRequest = false;
											if(data.groupInfoModelList[i].members[j]['photoId'] !='' && data.groupInfoModelList[i].members[j]['photoId'] != undefined){
												memberPhotoSource = '/contextPath/User/'+data.groupInfoModelList[i].members[j]['photoId']+'/stamp.jpg';
											}else{
												memberPhotoSource = contextPath+'/static/pictures/defaultimages/header-profile_pic-50.png';
											}
											if(data.groupInfoModelList[i].members[j]['profileSummary'] != '' && data.groupInfoModelList[i].members[j]['profileSummary'] != undefined){
												profileSummary ='<div class="warmgray"> </div>'+data.groupInfoModelList[i].members[j]['profileSummary'];
											}else{
												profileSummary ='';
											}
											requestdate=dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.groupInfoModelList[i].members[j]['joinRequestedDate']),'hh:mm a MMM.dd');
											pendingRequestcontent+='<div class="min-height-120-important pad-top-25"><div class="col-xs-2"><a href="'+contextPath+'/userprofile/profile/'+data.groupInfoModelList[i].members[j]['profileUniqueIdentifier']+'" target="_blank"><img src="'+memberPhotoSource+'"  width="50"  class="img-xs-circle"/></a></div>'
											+'<div class="col-xs-10 mar-bot-10 mar-left-minus-27">'
											+'<div id="acceptDeclineRequest_"'+memberId+'><div class=" pad-left-10"><span class="element-font-15">'+data.groupInfoModelList[i].members[j]['memberName']+'</span><span class="pull-right toolbar-element-content">'+requestdate+'</span></div>' 
											+'<div class="min-height-45 pad-bot-10 toolbar-element-content  pad-left-10">'
											+''+stringLimitDots(profileSummary,200)+'</div>'
											+'<div class="form-group text-right">'
											+'<input value="Accept" class="def-button small-button font-17 mar-right-12" onclick="mygroups.managePendingRequests(\''+memberId+'\',\'ACCEPT\','+groupId+')" type="button">'
											+'<input value="Decline" class="grey-button small-button font-17 mar-right-30" onclick="mygroups.managePendingRequests(\''+memberId+'\',\'DECLINE\','+groupId+')" type="button">'
											+ '</div>'
											+ '</div></div></div>';
										}else{
											isChangeOwnerRequest = true;
											var respondedUserId = data.groupInfoModelList[i].members[j]['userId'];
											requestdate=dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.groupInfoModelList[i].members[j]['joinRequestedDate']),'hh:mm a MMM.dd');
											changeOwnerContent+='<div class="min-height-120-important pad-top-25"><div class="col-xs-2"></div>';
											changeOwnerContent+='<div class="col-xs-9 mar-bot-10">'
												+'				<div class="col-xs-2"> <a href="'+contextPath+'/group/'+data.groupInfoModelList[i]['uniqueIdentifier']+'" target="_blank"><img src="'+groupPhotoSource+'"  width="50"  class="radious-border"/></a></div><!--Profile photo and content section div-->'
												+'<div class="col-xs-10 mar-bot-10 mar-left-minus-27">'
												+'					<div class=" pad-left-10">'
												+'						<a href="'+contextPath+'/group/'+data.groupInfoModelList[i]['uniqueIdentifier']+'" target="_blank"><span class="element-font-15">'+groupName+'(Group)</span><span class="pull-right toolbar-element-content">'+requestdate+'</span></a>'
												+'					</div>'
												+'					<div class="height-35 toolbar-element-content">'
												+'					<div class=" display-inline pad-left-10"><i class="warning-sm-icons"></i></div>'
												+'					Invite you to be the group owner '
												+'					</div>'
												+'					<div class="form-group text-right">'
												+'						<input value="Accept" class="def-button small-button font-17 mar-right-12" onclick="mygroups.manageChangeOwnerShip(\''+memberId+'\',\'ACCEPT\',\''+groupUniqueIdentfier+'\','+groupId+','+respondedUserId+')" type="button">'
												+'						<input value="Decline" class="grey-button small-button font-17 mar-right-30" onclick="mygroups.manageChangeOwnerShip(\''+memberId+'\',\'DECLINE\',\''+groupUniqueIdentfier+'\','+groupId+','+respondedUserId+')" type="button">'
												+'					</div></div>'
												+'				</div>'
												+'			</div>'
												+'		</div>'
												+'</div></div>';
										}
									}
									

								}else{
									changeOwnerContent = '<div class="default-message-style mar-top-16-minus"></br></br><i class="warning-sm-icons"></i>You have no Pending requests</br></div>';
								}
								if(isChangeOwnerRequest){
									$("#changeOwnerRequestContainer"+i).html(changeOwnerContent);
								}
								if(isChangeOwnerRequest != true || isChangeOwnerRequest != 'true'){
									$("#pendingGroupRequestsContainer"+i).html(pendingRequestcontent);
									pendingRequestcontent = '';
								}
							}
							
							
						}else{
							content = '<div class="default-message-style mar-top-16-minus"></br></br><i class="warning-sm-icons"></i>You have no Pending requests</br></div>';
							$("#totalContainer").html(content);
						}
						//div = htmlTemplate;
					}
				var height="475px";
				if(!loadFlagType.isGroupSearchTwobyTwo){
					height="470px";
				}
				var customscrollbarelement = $(element).find('.mCustomScrollbar');
				var xiimcustomScrollbarOptions = {elementid:customscrollbarelement,isUpdateOnContentResize:true,setHeight:height,vertical:'y'};
				xiimcustomScrollbar(xiimcustomScrollbarOptions);
/*				 $(element).find('.mCustomScrollbar').mCustomScrollbar({
		     		    setHeight:height,
		     		    advanced:{
		     		        updateOnContentResize: true
		     		    },
		     		   mouseWheelPixels: 50,
			               mouseWheel:true,
			               autoHideScrollbar:false,
			               theme: "rounded-dark"
		     		});*/
				
				
				 
				 
				 mygroups.completeCallBack();//update the Counts etc 
			}else{
				doAjax.displayErrorMessages(data);
			}
			mygroups.bindEvents();

		},
		beforeSendCallBack:function(jqXHR,settings){
			$("#processingSymbol").show();
		},
		completeCallBack:function(jqXHR,textStatus){
			$("#processingSymbol").hide();
			 var recieved=($('#MyGroupsRecieved .recievedMember').length>0)?'('+$('#MyGroupsRecieved .recievedMember').length+')':'';
       	  	$('#recievedCountg').html(recieved);
	       	 if($('#MyGroupsRecieved .recievedMember').length==0){
	      		  $('#groupsempty').html('<div class="col-xs-9"><div><span class="default-message-style">There are no Recieved Invitations</span></div>');
	      	  }
       	  
		},
		errorCallBack:function(request,status,error){

		},
		failureCallBack:function(data){
			$("#displayGroupMembers").html('');
			$("#emptySearchResult").show();
			$("#processingSymbolMore").hide();
		},
		respondRecievedRequest:function(invitationUID,response,invitationId){
			var flag={
					invitationId:invitationId,
					invitationUID:invitationUID,
					response:response,
					isManageRecievedRequest:true,
					baseElementMyGroups:"#baseElementMyGroups"
			};
			
			mygroups.init(flag);
		},
		/***Manage Groups Block***/
		manageSendRequest:function(groupUniqueIdentifier,joinOrIgnore,groupId){
			
			var flag={
					groupUniqueIdentifier:groupUniqueIdentifier,
					joinOrIgnore:joinOrIgnore,
					isManageSendRequest:true,
					groupId:groupId,
					baseElementMyGroups:"#baseElementMyGroups"
			};
			
			mygroups.init(flag);
		},
		/***Manage Groups Block***/
		managePendingRequests:function(memberId,isAcceptedOrDeclined,groupId){
			var isAccepted =false;
			if(isAcceptedOrDeclined =='ACCEPT'){
				isAccepted = true;
			}
			var flag={
					groupId:groupId,
					isAcceptedOrDeclined:isAccepted,
					isManagePendingRequest:true,
					memberId:memberId,
					baseElementMyGroups:"#baseElementMyGroups"
			};
			
			mygroups.init(flag);
		},
		/*******Change Owner Block*******/
		manageChangeOwnerShip:function(memberId,isAcceptedOrDeclined,groupUniqueIdentfier,groupId,respondedUserId){
			var flag={
					groupUniqueIdentfier:groupUniqueIdentfier,
					isAcceptedOrDeclined:isAcceptedOrDeclined,
					isManageChangeOwnerRequest:true,
					memberId:memberId,
					groupId:groupId,
					respondedUserId:respondedUserId,
					actionType:"CHANGE_OWNER_RESPONSE",
					baseElementMyGroups:"#baseElementMyGroups"
			};
			
			mygroups.init(flag);
		},
			
			
		closePopups:function(){

	 		 $('.mycourseIcon').popover('destroy');
	 		 $('.groupShortInfoClassImage').popover('destroy');
	    	  $('.connectionShortProfileClassImage').popover('destroy');
		},

		/**
		 *  bind operations performed on UI
		 */
		bindEvents:function(){
		
			
/*			$('[data-tooltip-toggle="tooltip"]').tooltip({
				tooltipClass: "custom-tooltip-styling"
			}); */
			
/*  			$('.popoverGroupShortInfoClass').off("click").bind("click",function(e){
  				$('.popoverGroupShortInfoClass').not(this).popover('destroy');
  				groupid=$(this).find('.groupShortInfoClass').attr('groupId');
  				$('.classforRemoving').not('#shortProfileDivID'+groupid).parent().parent().remove();
  			});*/
			
		
			 $(".groupShortInfoClassTitle").off("click").bind("click",function(e){
           			 
        				//  $('.courseShortInfoClass').not($(this)).popover('destroy');          		
             			  var uniqueIdentifier = $(this).parent().attr('uniqueIdentifier');         		  
                	 	  window.location.href = contextPath+'/group/'+uniqueIdentifier ;
                		  	 		 
                		});
                		
		//	$(".groupShortInfoClassImage").popover('destroy');//added for the popover remains when widget size changed with this line it closes when widget resized
			 $(".groupShortInfoClassImage").off("click").bind("click",function(e){
			 	
			 	
			 	closePopups();
			 		
				 if($(this).is('[aria-describedby]')){
				//	 $('.groupShortInfoClassImage').popover('destroy');
					 return;
				 }
				 
				 //$('.groupShortInfoClassImage').popover('destroy');
				
				
        		 var groupReceivedInvitationCount = $(this).parent().attr('groupReceivedInvitationCount');
        		 var groupPendingRequestCount = $(this).parent().attr('groupPendingRequestCount');
        		  var eventInvitationCount = $(this).parent().attr('eventInvitationCount');
        		  var groupLogo = $(this).parent().attr('groupLogo');
        		  var groupId = $(this).parent().attr('groupId');
        		  var groupName = $(this).parent().attr('groupName');
        		  
        		  var uniqueIdentifier = $(this).parent().attr('uniqueIdentifier');
        		  var userRole= $(this).parent().attr('userRole');
        		  
        		  var isFollow = $(this).parent().attr('isFollow');
        		  var followString = '';
        		  var followActionType = '';
        		  
        		  if(isFollow == 'true'){
        			  isFollow = true;
        			  followString = "UnFollow";
        			  followActionType = "UNFOLLOW";
        		  }else{
        			  isFollow = false;
        			  followString = "Follow";
        			  followActionType = "FOLLOW";
        		  }
        		  
        		  var htmlTemplate ='<div class="classforRemoving" id="shortProfileDivID'+groupId+'" isFollow="'+followActionType+'"><span class="pull-right">';
        		  htmlTemplate+='<a class="closePopover" onclick="javascript:mygroups.closePopover(this);"><i class="mar-right-5-minus close-sm-icons selected-sm memebr-fv-remove cursor-hand top-right-4-8" containerId="'+groupId+'" id="remove-short-profile-'+groupId+'"></i></a> </span>';  
        		  htmlTemplate+='<div class="connection-popover-holder margin-7-minus">';
        		  htmlTemplate+='<div class="">' 
      						+'      <div class="float-left">'
      						+ '<img src="'+groupLogo+'" class="my-groups-image mar-left-8-minus">'
      						+'      </div>'
      						+'      <div class="pad-top-10">'
      						+'          <a href="'+contextPath+'/group/'+uniqueIdentifier+'/" onclick="navigateGroupHome()"><div class="element-font-15 mar-left-80 memberLinkTitle" title="'+groupName+'">'+groupName+'</div>&nbsp;&nbsp;';
        		  

        		  
        		  htmlTemplate+='</a></div>'
      						+'	</div>';
      						if(userRole == 'Administrator' || userRole == 'Owner'){
      			/*htmlTemplate+='<div class="height-200 mar-left-75 pad-left-6 element-font-16">Pending Requests ('+groupPendingRequestCount+')</div>';*/
      			htmlTemplate+='<div class="height-300 mar-left-75 pad-left-6 element-font-16"></div>';
      						}else{
      			htmlTemplate+='<div class="height-300 mar-left-75 pad-left-6 element-font-16"></div>';
      						}
      			htmlTemplate+='<div class="mygroup-popup-icon width-100-percent">';
      			
      			 if(isFollow){
      				htmlTemplate+='	<div class="display-inline text-center pad-right-10 font-11"><a class="cursor-hand toolbar-element-content" id="user-connect-button-'+uniqueIdentifier+'" onclick="javascript:mygroups.followOrUnFollowClick(\''+uniqueIdentifier+'\',\'GROUP\',\''+followActionType+'\','+groupId+');"><i class="changeiconFollowNess unfollowers-sm-icons width16"></i><br/><span id="group-follow-unfollowiconid-'+groupId+'">'+followString+'</span></a></div>';
      			 }else{
      				htmlTemplate+='	<div class="display-inline text-center pad-right-10 font-11"><a class="cursor-hand toolbar-element-content" id="user-connect-button-'+uniqueIdentifier+'" onclick="javascript:mygroups.followOrUnFollowClick(\''+uniqueIdentifier+'\',\'GROUP\',\''+followActionType+'\','+groupId+');"><i class="changeiconFollowNess followers-sm-icons width16"></i><br/><span id="group-follow-unfollowiconid-'+groupId+'">'+followString+'</span></a></div>';
      			 }
      			if(userRole == 'Administrator' || userRole == 'Owner'){
      				htmlTemplate+='	<div class=" display-inline pull-right text-center font-11 mar-right-15-minus"><i class="gear-sm-icons disabled-sm vertical-align-middle"></i></div>';
      						}
      			htmlTemplate+='</div>'
                      +'</div></div>';
					$(this).data('bs.popover','');
                 	$(this).popover({
                        'html' : true,
                        placement: 'right',
                        container: 'body',
                        viewport: {selector: '.gridster', padding: 2},
                        viewport:{selector:'.gridster',padding:10},
                        /*title: '',*/
                        trigger:'none',
                        content:htmlTemplate,
                    }).on("show.bs.popover", function(){
                    	$(this).data("bs.popover").tip().css({"min-width": "270px","min-height":"300px","padding":"12px"}); 
                	});
                 	$(this).popover('show');

				}); 
			 
			 
			
      	  $("#addNewGroupsID").off("click").bind("click",function(e) {
				//Below requires when view not in (2x2) view.
				$("#minimize_maximize_myGroups_22").trigger('click');
				isPlusToActivateMyGroups = true;
      		  
				/*$('#myGroupsMenuToggle').attr('data-toggle','dropdown');
				$("#hideMenuForMyGroups").removeClass('hide');
				$("#removeHidemyGroupsOptionsID").addClass('hide');

				var options = {
						ele:loadFlagType.baseElementMyGroups
				};
				saveSubGroupSection.init(options);*/
			});
      	  
			
    		 $("#myGroupsTotalCountID").off("click").bind("click",function(e) {
    			 
	 			$('#minimize_maximize_myGroups_22').trigger('click');
    			 });
    		 $('#groupSearchBoxId').off("keyup").bind("keyup",function(e){
       		  $('.groupsList li').hide();
       		  SearchBoxVal=$.trim($('#groupSearchBoxId').val());
       		  if($("#groupSearchBoxButton").attr('active')!='active'){
       			  $("#groupListValues").empty();
       		  if(SearchBoxVal.length>0){
       			//  $('#groupSearchBoxButton').attr('src',contextPath+'/static/pictures/AddSign_S30.png');           			  
       			  $('.groupsList li').filter(':containsIN("'+SearchBoxVal+'")').not('.noconnection-msg').show();   
       			  if($('.groupsList li').filter(':containsIN("'+SearchBoxVal+'")').not('.noconnection-').length == 0){
       				$('#groupListValues').empty().append('<div><span class="default-message-style">No Results Found !</span></div>');
       			  }
       			
       			}
       		  else{
       			  $('.groupsList li').show();            			  
       		  }
       		  }
       		  else{
       			  //if(e.keyCode==13){
       				 // $("#groupSearchBoxButton").trigger("click");
       				  if(SearchBoxVal){
       					  $("#groupListValues").empty();  
       					  $('.groupsList li').hide();
	        			  if(SearchBoxVal.length>0){
	        					var flag={
	        							isGroupSearchTwobyTwo:true,
	        							searchParameter:SearchBoxVal,
	        							baseElementMyGroups:"#baseElementMyGroups"
	        					};	
	        					
	        					mygroups.init(flag);
	        			  }else{
	        				  $("#groupListValues").empty();  
	        			  }
       				  }
           		  //} 
       		  }
       	  });
       		$("#groupSearchBoxButton").off("click").bind("click",function(e) {
       			isPlusToActivateMyGroups=false;
       			$('.groupsList li').hide();
       			$("#groupListValues").empty();
       			 SearchBoxVal=$.trim($('#groupSearchBoxId').val());
       			if($(this).attr('active')=='active'){
       			 /*$("#groupListValues").empty();
      				  $('.groupsList li').hide();
          			  if(SearchBoxVal.length>0){
          					var flag={
     							isGroupSearchTwobyTwo:true,
     							searchParameter:SearchBoxVal,
     							baseElementMyGroups:"#baseElementMyGroups"
				  				
     			  		};									 
          					mygroups.init(flag);
          				}*/
       				
	       				var myGroupsFlag={
				  				isMyGroupsTwobyTwo:true,
				  				baseElementMyGroups:"#baseElementMyGroups"
				  		};
	       				
					    mygroups.init(myGroupsFlag); 	
       			}else{
       				$('#groupSearchBoxId').parent().addClass('width-418').removeClass('width-446');;
       				$('#groupsSearchHint').parent().addClass('width-112');
       				$('.groupsList').addClass('hide');
       				$(this).attr('active', 'active');
	              	//$(this).attr('src',contextPath+'/static/pictures/AddSign_S30.png').attr('active','active');
	              	$('#groupSearchBoxId').attr('placeholder','Search New Groups').closest('.mygroups-section').find('.search-sm-icons').removeClass('selected-sm').addClass('def-icon');
	              	$('#groupSearchBoxId').val('');
	              	$("#groupsSearchHint").text("Join Groups");
	              	$(this).addClass("selected-sm");
       			}
           	});
       		$(element).find('.search-sm-icons').off('click').bind('click',function(e){
       			$('#groupSearchBoxButton').attr('active', '');
       			$('#groupSearchBoxButton').removeClass("selected-sm");
       			//$('#groupSearchBoxButton').attr('src',contextPath+'/static/pictures/AddSign_E30.png').attr('active','');
       			$("#groupListValues").empty();
       			$('.groupsList li').show();
	              	$('#groupSearchBoxId').attr('placeholder','Search My Groups').closest('.mygroups-section').find('.search-sm-icons').addClass('selected-sm').removeClass('def-icon');
	              	$('#groupSearchBoxId').val('');
	              	$("#groupsSearchHint").text("Groups");
	              	$('#groupSearchBoxId').parent().removeClass('width-418').addClass('width-446');
       				$('#groupsSearchHint').parent().removeClass('width-112');
       				$('.groupsList').removeClass('hide');
       		});

			//$("#hideMenuForMyGroups").removeClass('hide');
/*			$('#groupSearchBoxId').off("keyup").bind("keyup",function(e){
      		  $('.groupsList li').hide();
      		  var SearchBoxVal=$.trim($('#groupSearchBoxId').val());
      		  $("#groupListValues").empty();
      		  $("#groupsSearchHint").text("Groups");
      		  if(SearchBoxVal.length>0){
      			  $('#groupSearchBoxButton').attr('src',contextPath+'/static/pictures/AddSign_S30.png');
      			  
      			  $('.groupsList li').filter(':containsIN("'+SearchBoxVal+'")').show();  
      			  if(e.keyCode==13){
          			  if($(SearchBoxVal.length>0)){
          					var flag={
          							isGroupSearchTwobyTwo:true,
          							searchParameter:SearchBoxVal,
          							baseElementMyGroups:"#baseElementMyGroups"
  				  				
          			  		};
          					 $('.groupsList li').hide();
          			  		$("#groupsSearchHint").text("Join Groups");
          					mygroups.init(flag);
          			  }
          		  } 
      			}
      		  else{
      			  $('#groupSearchBoxButton').attr('src',contextPath+'/static/pictures/AddSign_E30.png');
      			  $('.groupsList li').show();
      		  }
      	  });
			
			$("#groupSearchBoxButton").off("click").bind("click",function(e) {
				 SearchBoxVal=$.trim($('#groupSearchBoxId').val());
              	if(SearchBoxVal.val().length>0){
              	  $("#groupsSearchHint").text("Join Groups");
              		 $('.groupsList li').hide();
						var flag={
				  				isGroupSearchTwobyTwo:true,
				  				baseElementMyGroups:"#baseElementMyGroups",
				  				searchParameter:SearchBoxVal
				  		};
						
						myconnections.init(flag); 
				}
        	});
*/
			
  	    	/*To show view option for calendar */
	      	  $("#showOptionsmyGroupsID").off('click').bind('click',function(){
	      		$("#removeHidemyGroupsOptionsID").toggleClass('hide');
	    	  });			
			
			$("#myGroupsHyperLinkID").off("click").bind("click",function(e){
				
	 				$('#myGroupsMenuToggle').attr('data-toggle','dropdown');
 	 				var myGroupsFlag={
			  				isMyGroupsTwobyTwo:true,
			  				baseElementMyGroups:"#baseElementMyGroups"
			  		};
 	 				
					  mygroups.init(myGroupsFlag); 	
 	 	 			
 	 				$("#hideMenuForMyGroups").removeClass('hide');
 	 				$("#removeHidemyGroupsOptionsID").addClass('hide');

			});

			$("#pendingReqeustHyperLinkID").off("click").bind("click",function(e){
				
				var flag={
						isPendingReqeust:true,
						baseElementMyGroups:"#baseElementMyGroups"
				};
				
				mygroups.init(flag);

			});



			$("#groupsReceivedInvitationHyperLinkID").off("click").bind("click",function(e){
				
				if($("#otherNotificationsCount:visible").length > 0){
					// Used to update the Group Notification Count
					updateNotificationCount(1);
					$("#otherNotificationsCount").addClass('hide');
				}
				
				var flag={
						isReceivedInvitationsTwobyTwo:true,
						baseElementMyGroups:"#baseElementMyGroups"
				};
				
				mygroups.init(flag);              		  
			});

			
			$("#createNewGroupId").off("click").bind("click",function(e){
				
				$('#myGroupsMenuToggle').attr('data-toggle','dropdown');
				$("#hideMenuForMyGroups").removeClass('hide');
				$("#removeHidemyGroupsOptionsID").addClass('hide');

				var options = {
						ele:"#baseElementMyGroups",
						isdashboard:true
				};
				saveSubGroupSection.init(options);
				
				var elementcustomscrollbar = $('#newGroupCreateDivCustomScrollID');
				var xiimcustomScrollbarOptions = {elementid:elementcustomscrollbar,isUpdateOnContentResize:true,setHeight:'500px',vertical:'y'};
				xiimcustomScrollbar(xiimcustomScrollbarOptions);
				$(".modifymarginclass").removeClass("mar-right-65");
				$("#modifymargin-dashboard").removeClass("creategroup-form-margin");
				$("#modifymargin-dashboard").addClass("creategroup-dashboard-form-margin");
				$(".modifyrightpadding").removeClass("pad-right-12").addClass("pad-right-28");
				$("#newGroupCreateDivID").removeClass("mar-top-65").addClass("mar-top-21");
				
				$('#groupName').focus();
				
			});
			
			$("#managedGroupsId").off("click").bind("click",function(e){
				
				$('#myGroupsMenuToggle').attr('data-toggle','dropdown');
				$("#hideMenuForMyGroups").removeClass('hide');
				$("#removeHidemyGroupsOptionsID").addClass('hide');

				
				var flag={
						isManagedGroups:true,
						baseElementMyGroups:"#baseElementMyGroups"
				};
				
				mygroups.init(flag);              		  
			});
		  	  if(isPlusToActivateMyGroups){
				  $("#groupSearchBoxButton").trigger('click');
		  	  }
		},
        closePopover:function(e){
        	/*var open_popup_id = $(e).closest(".popover.in").attr('id');
	 		var popup_open_ele = $('div[aria-describedby="'+open_popup_id+'"]');
			popup_open_ele.popover('toggle');*/
			$('.groupShortInfoClassImage[aria-describedby]').popover('destroy');
        },
		staticUI:function(flag){

		},
		displayGroups:function(obj){//TODO need to delete this function once UI is stable

			var myGroupsLi = '<li>';
			var imgDiv = '';

			if(obj['groupLogo'] != '' && obj['groupLogo'] != null && obj['groupLogo'] != undefined){
				imgDiv = '<img src="/contextPath/Group/'+obj['groupLogo']+'"/stamp.jpg />';
			}else{
				imgDiv = '<img src="'+contextPath+'/static/pictures/defaultimages/no-group-image.png">';
			}


			var groupName='';
			if(obj['groupName'].length > 15){
				groupName = obj['groupName'].substring(0, 8)+'...';
			}else{
				groupName =  obj['groupName'];
			}

			var courseNameDiv = '<div class="pad-tb-10">'+groupName+'</div>';

			myGroupsLi = myGroupsLi + imgDiv +courseNameDiv;

			myGroupsLi += '</li>';

			return '<a href="'+contextPath+'/group/'+obj['uniqueIdentifier']+'/" onclick="navigateGroupHome()" >'+myGroupsLi+'</a>';

		},
		followOrUnFollowClick:function(resourceId,resourcetype,actiontype,groupId){
 			var accessToken = $("#accessToken").val();
    		var langId = $("#langId").val();
    		
    		var isactiontype = $('#shortProfileDivID'+groupId).attr('isFollow');
    		if(isactiontype != actiontype){
    			if(actiontype == 'UNFOLLOW'){
    				actiontype = 'FOLLOW';
    			}else{
    				actiontype = 'UNFOLLOW';
    			}
    		}
    		
 			var unfollowRequest = {
 					langId :langId ,
 					accessToken :accessToken,
 					resourceType:resourcetype,
 					resourceId:resourceId,
 					actionType:actiontype
     			};
 			unfollowRequest = JSON.stringify(unfollowRequest);
 		 var unfollowOptions = {
 				 url:getModelObject('serviceUrl')+'/feed/1.0/assertFollowness',
 				 data:unfollowRequest,
 				 async:true,
 				 successCallBack:function(data){
 					 if(data['isSuccess']){
 						 //$(".groupShortInfoClass").popover('destroy');
						 if(actiontype == 'UNFOLLOW'){
	   							$('#group-follow-unfollowiconid-'+groupId).html('Follow');
	   							$('.changeiconFollowNess').removeClass('unfollowers-sm-icons').addClass('followers-sm-icons');
	   							$('#shortProfileDivID'+groupId).attr('isFollow','FOLLOW');
	   						 }else{
	   							$('#group-follow-unfollowiconid-'+groupId).html('UnFollow');
	   							$('.changeiconFollowNess').addClass('unfollowers-sm-icons').removeClass('followers-sm-icons');
	   							$('#shortProfileDivID'+groupId).attr('isFollow','UNFOLLOW');
	   						 } 						 
 						 
 						 if(actiontype == 'UNFOLLOW'){
 							 $('[id='+'"groupLiId'+groupId+'"]').attr('isFollow','false');
 						 }else{
 							$('[id='+'"groupLiId'+groupId+'"]').attr('isFollow','true');
 						 }
 					 }
 				 }
 		 };
 		 doAjax.PutServiceInvocation(unfollowOptions);
 		}
	};
}.call(this);