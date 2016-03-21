/**
 * @author Next Sphere Technologies
 * My Connection widget
 * 
 * My Connection (1x1), (2x1) and (2x2) widgets is used to show all connected users as well as,
 * 
 * 1. Connected Users
 * 2. Search Connections
 * 3. Search with in Connected Users
 * 4. Received Request
 * 5. Sent Request
 * 
 */
						
/*var scriptElementMyConnections = document.getElementsByTagName("script");
var baseElementMyConnections = scriptElementMyConnections[scriptElementMyConnections.length - 1].parentNode;*/

var myconnections = function(){
	var lastConnectedMember = "";
	var element="";
	var loadType = "";
	var isPlusToActivate=false;
       return {
    	   latestrequest:'first',
              init:function(flag){
            	  loadType = flag;
                     element = flag.baseElementMyConnections;
                     this.staticUI(flag);
                     var options = this.prepareServiceRequest(flag);
                     this.serviceInvocation(options);
                     this.bindEvents();
              },
              serviceInvocation:function(options){
            	  if(loadType.isGetConnections||loadType.isGetConnectionsTwobyTwo||loadType.isMyConnectionsSendRequest||loadType.isMyConnectionsSendRequestTwobyTwo)
            		  doAjax.GetServiceHeaderInvocation(options);
            	  else
            		  doAjax.PostServiceInvocation(options);
              },
              prepareServiceRequest:function(flag){
	            	var URI = '';
	            	var request = '';
	            	var isAll = false;
            		var accessToken = $("#accessToken").val();
            		var langId = $("#langId").val();
            		var startResult = parseInt($("#startResult").val());
            		var connectGroupId = $("#connectGroupId").val();
            		var personalGroupUniqueIdentifier = $("#personalGroupUniqueIdentifier").val();
            		var userId = $("#userId").val();
    				var headers = {
    						accessToken:accessToken,
    						langId:langId
    				};
            		
            		if(startResult > 0){
            			startResult = startResult+0;
            		}else{
            			startResult = 0;
            		}
            		var maxResult = parseInt($("#maxResult").val());
        			if(flag.isTotalCount){
        				isAll = true;
        			}
            		
            		var pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult, startResult, isAll));
            		
            		if(flag.isRemoveSentRequest){
            			URI = getModelObject('serviceUrl')+'/group/1.0/manageSendConnection';
            			request = {
            					"requestedGroupId":flag.requestedGroupId,
								"userId": userId,
								"langId" : langId,
								"accessToken" : accessToken
		          			};
            		}
            		else if(flag.isManageConnections){
            			
            			URI = getModelObject('serviceUrl')+$("#friendRequestInvitationURI").val();
            			var connectionGroupID = $("#connectGroupId").val();
            			accepted=flag.Action=='ACCEPT';
            			request = {
								"isAccepted": accepted,
								"respondedUserId": userId,
				   				"memberIds": [''+flag.manageMemberId],						         
								"groupId":connectionGroupID,
								"requestStatusEnum":flag.Action,								
								"langId" : langId,
								"accessToken" : accessToken
		          			};
            		}else if(flag.isGetConnections||flag.isGetConnectionsTwobyTwo){
            			var pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult, startResult, true));  
            			var connectionGroupID = $("#connectGroupId").val();
            			var queryParams = '?userId='+userId+'&groupId='+connectionGroupID+'&searchParameter='+encodeURIComponent(flag.searchParameter+'')+'&pageCriteria='+pageCriteria;
           				URI = getModelObject('serviceUrl')+'/group/2.0/searchConnections'+queryParams;            			
            		}else if(flag.isConnectMembers){
              			URI = getModelObject('serviceUrl')+$("#saveConnectionURI").val();
                		request = {
                				"userId":flag.userId,
                				"groupUniqueIdentifier":flag.connectionGroupId,
                				"langId":langId,
                				"accessToken":accessToken,
                				"requestTypeEnum":"CONNECTION"
                			};
              			
              		}else if(flag.isMyConnectionsSendRequest||flag.isMyConnectionsSendRequestTwobyTwo){
              			var pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult, startResult, true));  
            			var queryParams = '?userId='+userId+'&pageCriteria='+pageCriteria;
            			URI = getModelObject('serviceUrl')+"/group/2.0/getSentInivations"+queryParams;
              		}else if(flag.isMyConnectionsPendingRequest||flag.isMyConnectionsPendingRequestTwobyTwo){
            			URI = getModelObject('serviceUrl')+$("#getGroupMembersURI").val();
            			request = {
									//"userId" : userId,
									"groupUniqueIdentifier":personalGroupUniqueIdentifier,
									"groupmemberSearchModelList":[{
																	"groupMemberSearchAttributeEnum":"MEMBER_STATUS",
																	"searchValue":"Pending for Approval"
																   },
																   {"groupMemberSearchAttributeEnum":"IS_CONNECTION",
																	"searchValue":false									
																   },
																   {"groupMemberSearchAttributeEnum":"SORTORDER",
																	 "searchValue":'joinRequestedDate'									
																	},
																	{"groupMemberSearchAttributeEnum":"ORDERBY",
																	  "searchValue":'DEC'									
																	}],
									"pageCriteriaModel":{
											"pageSize" : maxResultForConnections,
											"pageNo" : startResult,
											"isAll" : true
									},
									"langId" : langId,
									"accessToken" : accessToken
			          			};                    			
              			
              		}
              		else if(flag.isMyConnectionsTwobyTwo){
              			
              			URI = getModelObject('serviceUrl')+'/group/1.0/getGroupMembersBySortCriteria';
    					request = {
									/*"userId" : userId,
									"groupSearchCriteriaModel":{
										"groupId":connectGroupId,
										"memberStatus":2100,
										"isConnectionSearch":true,
										"pageCriteriaModel" : {
											"pageSize" : maxResult,
											"pageNo" : startResult,
											"isAll" : true
										}
									},
									"langId" : langId,
									"accessToken" : accessToken*/
									
									

    								//"userId" : userId,
    								"groupUniqueIdentifier":personalGroupUniqueIdentifier,
    								"groupmemberSearchModelList":[
    															   {"groupMemberSearchAttributeEnum":"IS_CONNECTION",
    																"searchValue":false									
    															   }],
    								"pageCriteriaModel":{
    									"pageSize" : maxResult,
    									"pageNo" : startResult,
    									"isAll" : true
    								},
    								"langId" : langId,
    								"accessToken" : accessToken

    			          			
			          			};
              			
              		}else if(flag.isUnConnectMember){
              			URI = getModelObject('serviceUrl')+'/group/1.0/removeConnection';
    					request = {
									"userId" : flag.userIDD,
									"memberIdsList":[flag.memberId],
									"langId" : langId,
									"accessToken" : accessToken
			          			};              			
              			
              		}else{
              			
              			var maxResultForConnections = parseInt($("#maxResultForConnections").val());
            			URI = getModelObject('serviceUrl')+'/group/1.0/getGroupMembersBySortCriteria';
            					request = {
/*  										"userId" : userId,
  										"groupSearchCriteriaModel":{
  											"groupId":connectGroupId,
  											"memberStatus":2100,
  											"isConnectionSearch":true,
  											"pageCriteriaModel" : {
  	  											"pageSize" : maxResultForConnections,
  	  											"pageNo" : startResult,
  	  											"isAll" : isAll
  	  										}
  										},
  										"langId" : langId,
  										"accessToken" : accessToken*/
  										

        								//"userId" : userId,
        								"groupUniqueIdentifier":personalGroupUniqueIdentifier,
        								"groupmemberSearchModelList":[
        															   {"groupMemberSearchAttributeEnum":"IS_CONNECTION",
        																"searchValue":false									
        															   }],
        								"pageCriteriaModel":{
        									"pageSize" : maxResultForConnections,
        									"pageNo" : startResult,
        									"isAll" : true
        								},
        								"langId" : langId,
        								"accessToken" : accessToken

        			          			
  										
  				          			};
            		}
            		
            		
            		request = JSON.stringify(request);
            		var successcallbacks;
            		if(loadType.isMyConnectionsTwobyTwo||loadType.isGetConnections||loadType.isMyConnectionsTwobyTwo||loadType.isMyConnections){
            			successcallbacks=myconnections.successMyconnections;
            			myconnections.latestrequest='first';
            		}else{
            			successcallbacks=myconnections.successCallBack;
            			myconnections.latestrequest='second';
            		}
            		
            		if(flag.isGetConnections||flag.isGetConnectionsTwobyTwo||flag.isMyConnectionsSendRequest||flag.isMyConnectionsSendRequestTwobyTwo)
            		return {
	            			async:true,
	    					url:encodeURI(URI),
	    					headers:headers,
	    					parentId:myconnections.element,
            				successCallBack:successcallbacks,
            				failureCallBack:myconnections.failureCallBack,
            				beforeSendCallBack:myconnections.beforeSendCallBack,
            				completeCallBack:myconnections.completeCallBack
            		};
            		else return {
        				async:true,
        				url:encodeURI(URI),
        				data:request,
        				parentId:myconnections.element,
        				successCallBack:successcallbacks,
        				failureCallBack:myconnections.failureCallBack,
        				beforeSendCallBack:myconnections.beforeSendCallBack,
        				completeCallBack:myconnections.completeCallBack
        		};
            		
            		 
                },successMyconnections:function(data){
            	   if(myconnections.latestrequest=='first'){
    				var results = data['result'];
      				var status = results['status'];
      				if(loadType.isMyConnectionsTwobyTwo){
      					//TODO
      				if (status == 'true'){
      					var Member='';
      					var MyConTbt='';
      					var userIddd = $("#loggedInUserId-meta").val();
      					if(data['manageGroupMemberModelList']!=undefined){
      					manageGroupMemberModelList=(data['manageGroupMemberModelList'].length==undefined)?[data['manageGroupMemberModelList']]:data['manageGroupMemberModelList'];
      					
      					if(data.manageGroupMemberModelList){
	                	      if(manageGroupMemberModelList.length == undefined){
	                	    	  manageGroupMemberModelList = [manageGroupMemberModelList];
	                	      }
      						for(var i=0;i<manageGroupMemberModelList.length;i++){
      							if(manageGroupMemberModelList[i]['userId'] != userIddd){
		                		  var uniqueProfileID = manageGroupMemberModelList[i]['profileUniqueIdentifier'];
		                		  var photo = contextPath+"/static/pictures/defaultimages/1.png";
		                		  var memberNamee = manageGroupMemberModelList[i]['memberName'];
		                		  var profileSummaryy =$('<p></p>').text(manageGroupMemberModelList[i]['profileSummary']).html();
		                		  var memberFirstNameAndLastName = manageGroupMemberModelList[i]['memberName'];
		                		  memberFirstNameAndLastName=stringLimitDots(memberFirstNameAndLastName,15);
		                		  var userIdd = manageGroupMemberModelList[i]['userId'];
		                		  var memberId = manageGroupMemberModelList[i]['memberId'];
      							  var position=i+1;
      							  var activtyCount = manageGroupMemberModelList[i]['activityCount'];
      							  
      							/*photo=(manageGroupMemberModelList[i]['photoId']==undefined)?contextPath+"/static/pictures/defaultimages/"+parseInt((i%3)+1)+".png":"/contextPath/User/"'+manageGroupMemberModelList[i]["photoId"]+'/stamp.jpg';
*/      									
      		                	      if(manageGroupMemberModelList[i]['photoId'] != undefined && manageGroupMemberModelList[i]['photoId'] != ""){
      		                	    	photo = '/contextPath/User/'+manageGroupMemberModelList[i]['photoId']+'/stamp.jpg';
  	              					}      									
      						
      							Member+= '<div id="messageContainter'+userIdd+'"></div><div id="connectionholderID'+uniqueProfileID+'" class="myConnectionsDivULClass"><a href="javascript:void(0)" class="popoverUserShortProfileClass" >'
      									+'<li id="memberLiId'+uniqueProfileID+'" class="connectionShortProfileClass popoverParents" isTwobyTwo="true" memberId="'+memberId+'" userIdd="'+userIdd+'" memberFirstNameAndLastName="'+memberFirstNameAndLastName+'" pos='+position+' profileSummaryy="'+profileSummaryy+'"  memberNamee="'+memberNamee+'" imageURL="'+photo+'" uniqueProfileIDD="'+uniqueProfileID+'" isFollow="'+manageGroupMemberModelList[i]['isFollow']+'">'
      									+    	'<img src="'+photo+'" class="connectionShortProfileClassImage myconnection-image">';
      							if(activtyCount >0 ){
      									Member+=	'<span class="count-holder bottom-18">'+activtyCount+'</span>';
      							}
      							Member+= '</img>'
      									+ '<div class="connectionShortProfileClassTitle  twoByTwo-element-content" title="'+manageGroupMemberModelList[i]['memberName']+'"><div class="font-10px helvetica-neue-roman pad-tb-3 width-78" href="/contextPath/user/profile/'+manageGroupMemberModelList[i]['profileUniqueIdentifier']+'" >'+stringLimitDots(manageGroupMemberModelList[i]['memberName'],21)+'</div><span class="hide">'+manageGroupMemberModelList[i]['memberName']+'</span></div>'
      									+ '</li></a></div>';
      						}
      						}
      					}else{
      						Member+= noConnectionsMessage = '<div class="noconnection-msg col-xs-10"><div class="pad-left-175 default-message-style"></br></br></div></div>';
      					}
      					}
      					else{
      						Member+= noConnectionsMessage = '<div class="noconnection-msg col-xs-10"><div class="pad-left-175 default-message-style"></br></br></div></div>';
      					}
      					 MyConTbt='<div class=" clearfix pad-bot-10">'
                             +'<div class="mygroups-section">'
 							+'<div class="clearfix mar-tb-20">'
                                  	+	'<div id="display-search-section" class="search-group-inline width-115"><span id="searchHint" class="element-font-16">Connections</span><span class="pad-left-5-important search-icon-padding">'
                                  	+    '<span id="connectionsearchid" class="mar-top-7 search-sm-icons selected-sm"></span></span>'
                                    +     '<input type="text" class="mar-left-4 myconnection-text-box myconnection-search" placeholder="Search Connections" id="memberSearchBoxId" />'
                                    +      '<span id="memberSearchBoxButton-display"><span class="mar-left-4 plus-sm-icons vertical-align-middle mar-top-3" id="memberSearchBoxButton"></span>'
                                    +   '</div><div id="MyConnectionsScrollable" class="mar-top-31 members-myconnetionpic scroll-content mCustomScrollbar"><div id="connectionsListValues"></div>'
                                  	+   '<div class="isEmptyMembersClass mar-left-14-minus"><ul class="twobytwo-dashboard-connection myconTwobyTwo group-members-blocks">                                    '
                                                            +Member
                                     +'</ul></div>'
 								+'</div></div>'
 								+'</div>'                                    
                         +'</div>';
       					 $(element).empty().append(MyConTbt);
       					var xiimcustomScrollbarOptions = {elementid:"#MyConnectionsScrollable",isUpdateOnContentResize:true,setHeight:"475px",vertical:'y'};
       					xiimcustomScrollbar(xiimcustomScrollbarOptions);

       					$('#memberSearchBoxId').focus();
      				}
      				else{
      					//TODO Need to check from service we are not getting message on search of connections
      					doAjax.displayErrorMessages(data);
      				}
      					
      				}else{

    					if(status == 'true'){
    						if(loadType.isGetConnections){
    		                	  var htmlTemplate = HTML.connectionSearchResults();
    		                	  var div = Mustache.to_html(htmlTemplate,data);
    		                	  $("#connectionsListValues").empty();
    		                	  $("#connectionsListValues").append( div );								
    						}else{
    	                	  //var htmlTemplate = HTML.myConnections();
    							var htmlTemplate="";
    		      				var memberCount = "";
    		      				var noConnectionsMessage = "";		
    		      				var userIidd = $("#loggedInUserId-meta").val();
    	                	  if(data.manageGroupMemberModelList){
    	                	      if(data.manageGroupMemberModelList.length == undefined){
    	                	    	  data.manageGroupMemberModelList = [data.manageGroupMemberModelList];
    	                	      }

    	                	      memberCount = data.manageGroupMemberModelList[0]['memberCount'];
    	                	      htmlTemplate += '<div id="OnebyOneMyConn" class="myconnections1-1"><ul>';
    		                	  for(var i=0;i<data.manageGroupMemberModelList.length;i++){
    		                		  if(data.manageGroupMemberModelList[i]['userId'] != userIidd){
    		                		  var uniqueProfileID = data.manageGroupMemberModelList[i]['profileUniqueIdentifier'];
    		                		  var imageURL = contextPath+"/static/pictures/defaultimages/1.png";
    		                		  var memberNamee = data.manageGroupMemberModelList[i]['memberName'];
    		                		  var profileSummaryy = $('<p></p>').text(data.manageGroupMemberModelList[i]['profileSummary']).html();
    		                		  var memberFirstNameAndLastName = data.manageGroupMemberModelList[i]['memberName'];
    		                		  var userIdd = data.manageGroupMemberModelList[i]['userId'];
    		                		  var memberId = data.manageGroupMemberModelList[i]['memberId'];
    		                		  var position=i+1;
    		                		  var activtyCount = data.manageGroupMemberModelList[i]['activityCount'];
    		                		  
    		                	      if(data.manageGroupMemberModelList[i]['photoId'] != undefined && data.manageGroupMemberModelList[i]['photoId'] != ""){
    	              						imageURL = '/contextPath/User/'+data.manageGroupMemberModelList[i]['photoId']+'/stamp.jpg';
    	              					}		                		  
    		                	      
    		                	      htmlTemplate+= '<div><li><div class="display-inline hide" id="messageContainter'+userIdd+'"></div><div id="connectionholderID'+uniqueProfileID+'" class="cursor-hand  min-width-70 mar-right-10 text-center inline-block myConnectionsDivULClass"><span class="popoverUserShortProfileClass" >'
    		                	      +'<div id="memberLiId'+uniqueProfileID+'" class="connectionShortProfileClass popoverParents isEmptyMembers" pos='+position+' isTwobyTwo="false" memberId="'+memberId+'" userIdd="'+userIdd+'" memberFirstNameAndLastName="'+memberFirstNameAndLastName+'" profileSummaryy="'+profileSummaryy+'" memberNamee="'+memberNamee+'" imageURL="'+imageURL+'" uniqueProfileIDD="'+uniqueProfileID+'" isFollow="'+data.manageGroupMemberModelList[i]['isFollow']+'">';

    	              					htmlTemplate+= '<img data-toggle="dropdown" class="connectionShortProfileClassImage dropdown-toggle img-sm-circle dashboard-1x1icons"  src="'+imageURL+'">';
    	              				if(activtyCount > 0){
    	              					htmlTemplate+='<div class="clircle-connections display-inline">'+activtyCount+'</div>';
    	              				}	
    	              					htmlTemplate+='</img>';
    		                		  if(data.manageGroupMemberModelList[i]['memberName'].length > 21){
    		                			  htmlTemplate+= '<div class="connectionShortProfileClassTitle font-10px helvetica-neue-roman pad-tb-3 width-78" title="'+data.manageGroupMemberModelList[i]['memberName']+'">'+data.manageGroupMemberModelList[i]['memberName'].substring(0, 21)+'...'+'</div></div></span>';
    		  	               	     }else{
    		  	               	    	 htmlTemplate+= '<div class="connectionShortProfileClassTitle font-10px helvetica-neue-roman pad-tb-3 width-78" title="'+data.manageGroupMemberModelList[i]['memberName']+'">'+data.manageGroupMemberModelList[i]['memberName']+'</div></div></span>';
    		  	               	     }

    		                		  htmlTemplate+='</div></li></div>';
    		                		  
    		                		  if(i==8 && loadType.isOnebyOneView){//only for one by one view
    		                			  break;
    		                		  }
    		                	  }
    		                	  }
    		                	  htmlTemplate += '</ul></div>';
    		                	  
    		                	  if(memberCount > 0 && loadType.isOnebyOneView){
    			                	  htmlTemplate+="<div class='font-10px  position-relative bot-4 left-28  height-20'><span class='helvetica-neue-roman'>Total</span><a href='javascript:void(0);' class='lightblue pad-left-5' id='connectionTotalCountID'>(" +memberCount+")</a></div>";
    			                  }
    	                	  }else{
    	                		 noConnectionsMessage = '<div class="default-message-style text-align-center"></br></br></br></br> <img src="'+contextPath+'/static/pictures/Help.png"></br></br><a href="javascript:void(0);" id="addNewConnectionsID">Add Connection</a></div>';
    	                	  }
    	                	  

    	                	  $(element).empty();
    	                	  if(data.manageGroupMemberModelList){
    	                		  $(element).append(htmlTemplate);
    	                		  if(loadType.isTotalCount){
    	                			  var xiimcustomScrollbarOptions = {elementid:element,isUpdateOnContentResize:true,setHeight:"550px",vertical:'y'};
    	                			  xiimcustomScrollbar(xiimcustomScrollbarOptions);
    		                		  }
    	                		  
    	                		  
    	                	  }else{
    	                		  $(element).html(noConnectionsMessage);
    	                	  }
    						}
    					}else{
    						doAjax.displayErrorMessages(data);
    					}
          			
      				}
      				 myconnections.bindEvents();
                }
                },
              successCallBack:function(data){
            	  if(myconnections.latestrequest=='second'){
    				var results = data['result'];
      				var status = results['status'];
      				if(loadType.isRemoveSentRequest){
      					if(status == 'true'){
      						$('#Pendingmember_'+loadType.manageMemberId).fadeOut(1000).remove();
      						doAjax.displaySuccessMessage('Connection request to '+lastConnectedMember+' deleted');
      					}
      					else{
        					
    						doAjax.displayErrorMessages(data);
    					}
      				}else if(loadType.isGetConnectionsTwobyTwo){
      					$('#connectionsListValues').empty();
    					if(status == 'true'){
    						if(data['searchResultModelList']!=undefined){
    					 
    						searchResultModelList=(data['searchResultModelList'].length==undefined)?[data['searchResultModelList']]:data['searchResultModelList'];
          					var SearchModelResult='';
          				
      						for(var i=0;i<searchResultModelList.length;i++){

                            	var photo = contextPath+"/static/pictures/defaultimages/1.png";
                            	
  	                		  if(searchResultModelList[i]['photoId'] != undefined && searchResultModelList[i]['photoId'] != ""){
    		                	    	photo = '/contextPath/User/'+searchResultModelList[i]['photoId']+'/stamp.jpg';
  	              					}     
                          	
      							summary=(searchResultModelList[i]['summary']==undefined)?'':searchResultModelList[i]['summary'];
          						SearchModelResult+='<div id="connectionDivID'+searchResultModelList[i]['id']+'">'
          					      +'<div class="col-xs-2 mar-right-9-minus">'
          					       +'<a href="'+contextPath+'/userprofile/profile/'+searchResultModelList[i]['profileUniqueIdentifier']+'"> <img class="myconnection-search-image" src="'+photo+'" /></a>'
          					      +'</div>'
          					      +'<div class="col-xs-9 min-height-130 pad-top-25">'
          					        +'<div>'
          					          +'<span class="element-font-15" title="'+searchResultModelList[i]['name']+ '">'+stringLimitDots(searchResultModelList[i]['name'],25)+'</span>'
          					        +'</div>'
          					        +'<div class="min-height-25 pad-bot-10 toolbar-element-content">'+stringLimitDots(summary,200)+'</div>'
          					        +'<div class="form-group text-right pad-right-18" id="connect_'+searchResultModelList[i]['id']+'">'
          					          +'<input value="Connect" class="def-button font-17 small-button" id="connectBtn_'+searchResultModelList[i]['groupId']+'" onclick="javascript:myconnections.connectMember('+searchResultModelList[i]['id']+',\''+searchResultModelList[i]['uniqueIdentifier']+'\' ,'+false+','+i+');" type="button" />'
          					        +'</div>'
          					      +'</div>'
          					    +'</div>';

          						}         					
          					 $('#connectionsListValues').empty().append(SearchModelResult);
    						}
    					else{
    						
    						$('#connectionsListValues').empty().append('<div><span class="default-message-style">No Results Found !</span></div>');

    					}
      				}else{
        					
    						doAjax.displayErrorMessages(data);
    					}
    					
    					
    					}
      				 else if(loadType.isManageConnections){
      					if (status == 'true'){
      						$('#Pendingmember_'+loadType.manageMemberId).fadeOut(1000).remove();
      						var operation=(loadType.Action=="DELETE")?'Ignored':'Accepted';
      						doAjax.displaySuccessMessage("Request "+operation);
      					}
      					else{
        					
    						doAjax.displayErrorMessages(data);
    					}
      				 }
      				 else if(loadType.isConnectMembers){
      				//$("#process_display_getConnections_connect_"+loadType.connectionGroupId).hide();
      				//$(".processingConnect_"+loadType.connectionGroupId).removeClass('overlay-bg');

      				if( status == 'true'){
      					
      					var user = "#connectionDivID"+loadType.userId ;
      					
      					if(!loadType.isSentConnectFromMyConnection){
      					$("#connectionDivID"+loadType.userId).remove();
      					}
      					doAjax.displaySuccessMessage('Connection request to ' +lastConnectedMember +' sent');
      				}else{
      					doAjax.displayErrorMessages(data);
      				}
      			}else if(loadType.isMyConnectionsSendRequestTwobyTwo){
      				
  					if(status == 'true'){
                        var sentRequest='';
                        var div='';
                        var count='';
                        if(data['connectionModelList']!=undefined){
                        	
                        connectionModelList=(data['connectionModelList'].length==undefined)?[data['connectionModelList']]:data['connectionModelList'];
                        count='Total '+connectionModelList.length;
                        for(var i=0;i<connectionModelList.length;i++){   
                        	var photo = contextPath+"/static/pictures/defaultimages/1.png";
                        	
	                		  if(connectionModelList[i]['photoId'] != undefined && connectionModelList[i]['photoId'] != ""){
  		                	    	photo = '/contextPath/User/'+connectionModelList[i]['photoId']+'/stamp.jpg';
	              					}
                        	
                        	/*photo=(connectionModelList[i]['photoId']==undefined)?contextPath+"/static/pictures/defaultimages/"+parseInt((i%3)+1)+".png":'/contextPath/User/'+connectionModelList[i]['photoId']+'/stamp.jpg';*/
                        	
                        	
                        	
							summary=(connectionModelList[i]['summary']==undefined)?'':connectionModelList[i]['summary'];
							name=connectionModelList[i]['name'];
							id=connectionModelList[i]['userId'];
							requestdate=connectionModelList[i]['joinRequestedDate']==undefined?'':dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(connectionModelList[i]['joinRequestedDate']),'hh:mm a MMM.dd');
                        sentRequest+='<div class="pendingmember" id="Pendingmember_'+id+'">'
                        +'      	<div class="col-xs-2 mar-right-9-minus"><a href="'+contextPath+'/userprofile/profile/'+connectionModelList[i]['profileUniqueIdentifier']+'"><img src="'+photo+'"  class="myconnection-search-image" /></a></div>'
                        +'          <div class="col-xs-9 min-height-130-important pad-top-25">'
                        +'          	<div><span class="element-font-15" title="'+name+'">'+stringLimitDots(name,25)+'</span><span class="pull-right toolbar-element-content">'+requestdate+'</span></div>'
                        +'              <div class="min-height-25 pad-bot-10 toolbar-element-content">'+stringLimitDots(summary,200)+'</div>'
                        +'              <div class="form-group text-right">'
                        +'                 <span id="connect_'+id+'" class="pad-right-7"> <input value="Connect"  onclick="javascript:myconnections.connectMember('+id+',\''+connectionModelList[i]['uniqueIdentifier']+'\' ,'+true+', '+i+');" class="def-button font-17 mar-right-30 small-button"  type="button"></span>'
                        +'                  <input value=" Ignore" onclick=javascript:myconnections.removeSentRequest('+connectionModelList[i]['connectionGroupId']+','+id+',' +i+'); class="grey-button font-17 small-button" type="button">'
                        +'          	</div>'
                        +'          </div>'
                        +'      </div>';
                        }
						
                        
                        }
                        else{
                        	//sentRequest='<div class="col-xs-9"><div><span class="font-20 bold">There are no sent Requests</span></div>';
                        }
                        
                        div='<div id="MyConnectionsSend" class="scroll-content mCustomScrollbar pad-bot-10 pad-top-18">                          			'
                            +'<div class="mygroups-section">  '
                            +'<div class="element-font-16 mar-bottom-25 ">Sent Requests <span class="green pull-right toolbar-element-content mar-right-55" id="sentCount">'+count+'</span></div>'
                            +'<div class="sentConnections">'
                            +sentRequest
                            +'      </div>'
                            +'      </div>'
                            +'      </div>';
                        
						 $(element).empty().append( div );	
						 var xiimcustomScrollbarOptions = {elementid:"#MyConnectionsSend",isUpdateOnContentResize:true,setHeight:"555px",vertical:'y'};
						 xiimcustomScrollbar(xiimcustomScrollbarOptions);
					
					}else{
						doAjax.displayErrorMessages(data);
					}      				
      				
				}else if(loadType.isMyConnectionsSendRequest){
      				
					if(status == 'true'){
	                	  var htmlTemplate = HTML.myConnectionSendRequest();
	                	  var div = Mustache.to_html(htmlTemplate,data);
	                	  $(element).empty();
	                	  $(element).append( div );	
					}else{
						doAjax.displayErrorMessages(data);
					}      				
      				
      			}
      			else if(loadType.isMyConnectionsPendingRequestTwobyTwo){
      				
					if(status == 'true'){
                        var RequestMember='';
                        var div='';
                        var count='';
                        if(data['manageGroupMemberModelList']!=undefined){
                        	
                        manageGroupMemberModelList=(data['manageGroupMemberModelList'].length==undefined)?[data['manageGroupMemberModelList']]:data['manageGroupMemberModelList'];
                        count='Total '+manageGroupMemberModelList.length;
                        for(var i=0;i<manageGroupMemberModelList.length;i++){                       	
                        	photo=(manageGroupMemberModelList[i]['photoId']==undefined)?contextPath+"/static/pictures/defaultimages/1.png":'/contextPath/User/'+manageGroupMemberModelList[i]['photoId']+'/stamp.jpg';
							summary=(manageGroupMemberModelList[i]['profileSummary']==undefined)?'':manageGroupMemberModelList[i]['profileSummary'];
							name=manageGroupMemberModelList[i]['memberName'];
							requestdate=dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(manageGroupMemberModelList[i]['joinRequestedDate']),'hh:mm a MMM.dd');
							id=manageGroupMemberModelList[i]['memberId'];
                        RequestMember+='<div class="recievedMember" id="Pendingmember_'+id+'">'
                        +'      	<div class="col-xs-2 mar-right-9-minus"><a href="'+contextPath+'/userprofile/profile/'+manageGroupMemberModelList[i]['profileUniqueIdentifier']+'"><img src="'+photo+'"  class="myconnection-search-image" /></a></div>'
                        +'          <div class="col-xs-9 min-height-130-important pad-top-25">'
                        +'          	<div><span class="element-font-15" title="'+ name + '">'+stringLimitDots(name,25)+'</span><span class="pull-right toolbar-element-content">'+requestdate+'</span></div>'
                        +'              <div class="min-height-25 pad-bot-10 toolbar-element-content">'+stringLimitDots(summary,200)+'</div>'
                        +'              <div class="form-group text-right">'
                        +'                  <input value="Accept" class="def-button font-17 mar-right-7 small-button " onclick=manageConnections('+id+',"ACCEPT",'+i+'); type="button">'
                        +'                  <input value=" Ignore" onclick=manageConnections('+id+',"DELETE",'+i+'); class="grey-button font-17 small-button" type="button">'
                        +'          	</div>'
                        +'          </div>'
                        +'      </div>';
                        }
						
                        
                        }
                        else{
                        	//RequestMember='<div class="col-xs-9"><div><span class="font-20 bold">There are no Pending Requests</span></div>';
                        }
                        
                        div='<div id="MyConnectionsPending" class="scroll-content mCustomScrollbar pad-bot-10 pad-top-18">                          			'
                            +'<div class="mygroups-section">  '
                            +'<div class="element-font-16 mar-bottom-25">Recieved Requests <span class="green pull-right toolbar-element-content mar-right-55" id="recievedCount">'+count+'</span></div>'
                            +'<div class="recievedConnections" >'
                            +RequestMember
                            +'</div>'
                            +'      </div>'
                            +'      </div>';
                        
						 $(element).empty().append( div );	
						 var xiimcustomScrollbarOptions = {elementid:"#MyConnectionsPending",isUpdateOnContentResize:true,setHeight:"555px",vertical:'y'};
						 xiimcustomScrollbar(xiimcustomScrollbarOptions);

					}
					else{
						doAjax.displayErrorMessages(data);
					} 
      			}
      			else if(loadType.isMyConnectionsPendingRequest){
					if(status == 'true'){
	                	  //var htmlTemplate = HTML.myConnectionPendingRequest();
					  	  var htmlTemplate='{{#manageGroupMemberModelList}}';
							htmlTemplate+='<div class="events-left-border"><a class="pull-left" href="/contextPath/user/profile/{{profileUniqueIdentifier}}" target="_blank">'
									+ '{{#photoId}}'
									+ '<img src="/contextPath/Group/{{photoId}}/stamp.jpg" height="50" width="50" >'
									+ '{{/photoId}}'
									+ '{{^photoId}}'
									+ '<img src="'+contextPath+'/static/pictures/defaultimages/1.png" height="50" width="50">'
									+ '{{/photoId}}'	
					  	  			+'	</a><span class="bold mar-minus-10 position-relative top-pos-min-3"><a href="javascript:void(0)">{{memberName_modified}}</a></span>'
					  	  			+'	<div class="mar-t4-l28">{{joinRequestedDate}}</div>'
					  	  			+'	<div class="mar-t4-l28" id="pi-buttons"><button class="btn btn-primary pad-tb-0" id"{{memberId}}">Approve</button>&nbsp;<button class="btn btn-default pad-tb-0"  id"{{memberId}}">Delete</button></div>'
					  	  			+'	</div>'
					  	  			+'{{/manageGroupMemberModelList}}';
							
							if(data.manageGroupMemberModelList){
		                		  
		                	      if(data.manageGroupMemberModelList.length == undefined){
		                	    	  data.manageGroupMemberModelList = [data.manageGroupMemberModelList];
		                	      }
			                	  for(var i=0;i<data.manageGroupMemberModelList.length;i++){
			                		  
			                		  if(data.manageGroupMemberModelList[i]['memberName'].length > 15){
			                			  data.manageGroupMemberModelList[i]['memberName_modified'] = data.manageGroupMemberModelList[i]['memberName'].substring(0, 10)+'...';
			  	               	     }else{
			  	               	    	  data.manageGroupMemberModelList[i]['memberName_modified'] =  data.manageGroupMemberModelList[i]['memberName'];
			  	               	     }
			                	  }
			               	      
		                	  }
							
	                	  var div = Mustache.to_html(htmlTemplate,data);
	                	  $(element).empty();
	                	  $(element).append( div );	
					}else{
						doAjax.displayErrorMessages(data);
					}      				
    				      				
      			}else if(loadType.isUnConnectMember){
      				
      				if(status == 'true'){
      					var isSuccess = data['isConnectionRemoved'];
      					if(isSuccess){
      	            	  if($('.isEmptyMembers').length==1){
      	            		  $(element).html('<div class="text-align-center default-message-style"></br></br></br></br> <img src="'+contextPath+'/static/pictures/Help.png"></br></br><a href="javascript:void(0);" id="addNewConnectionsID">Add Connection</a></div>');
      	            	  }
     	            	  else if($('[id^=memberLiId]').length==1 && $('.myconTwobyTwo').length==1){
      	            		$('.myconTwobyTwo').html('<div class="noconnection-msg col-xs-10"><div class="pad-left-175 default-message-style"></br></br></div></div>');  
      	            	  }
      	            	  
      						$("#memberLiId"+loadType.uniqueProfileID).remove();
      						doAjax.displaySuccessMessage('Disconnect successful');
      						debugger;
      						if($('#5').attr('data-sizex') == 2 && $('#5').attr('data-sizey') == 2 ){
      		 	 				$('#myconnectionsMenutoggle').attr('data-toggle','dropdown');
      		 	 				$("#hideMenuForMyConnections").removeClass('hide');
      		 	 				$("#removeHidemyConnectionsOptionsID").addClass('hide');
      							$('#myconnectionsfiltericonid').removeClass("disabled-sm");
      		 	 				flag={
      		          				  isMyConnectionsTwobyTwo:true,
      		          				  baseElementMyConnections:"#baseElementMyConnections"
      		          				  }
      		 	 				if($(this).attr('fromHeader')!='true')	
      								myconnections.init(flag);	
      						}else if($('#5').attr('data-sizex') == 1 && $('#5').attr('data-sizey') == 2 ){
      							$('#myconnectionsfiltericonid').addClass("disabled-sm");
      							$('#myconnectionsMenutoggle').attr('data-toggle','');
      							$("#hideMenuForMyConnections").addClass('hide');
      						var flag={
      				  				isMyConnections:true,
      				  				isOnebyTwoView:true,
      				  				isTotalCount:true,
      				  				baseElementMyConnections:"#baseElementMyConnections"
      				  		};
      				  		if($(this).attr('fromHeader')!='true')										 
      						myconnections.init(flag);
      						$("#removeHidemyConnectionsOptionsID").addClass('hide');
      						}else{
      							$('#myconnectionsfiltericonid').addClass("disabled-sm");
      							$('#myconnectionsMenutoggle').attr('data-toggle','');
      			 				$("#hideMenuForMyConnections").addClass('hide');
      			 				$("#removeHidemyConnectionsOptionsID").addClass('hide');
      			 								
      						var flag={
      				  				isMyConnections:true,
      				  				isOnebyOneView:true,
      				  				baseElementMyConnections:"#baseElementMyConnections"
      				  		};										 
      						myconnections.init(flag);
      						}
      					}
      					
      				}else{
						doAjax.displayErrorMessages(data);
					}
      			}
      			
            	  myconnections.bindEvents();
            	  }
               },
              beforeSendCallBack:function(jqXHR,settings){
            	  $("#processingSymbol").show();
              },
              completeCallBack:function(jqXHR,textStatus){
            	  $("#processingSymbol").hide();
            	  var sentcount=($('#MyConnectionsSend .pendingmember').length>0)?'Total '+$('#MyConnectionsSend .pendingmember').length:'';
            	  if($('#MyConnectionsSend .pendingmember').length==0){
            		  $('#MyConnectionsSend .sentConnections').html('<div class="col-xs-9"><div><span class="default-message-style">There are no sent requests!</span></div>');
            	  }
            	  $("#sentCount").html(sentcount);
            	  var recieved=($('#MyConnectionsPending .recievedMember').length>0)?'Total '+$('#MyConnectionsPending .recievedMember').length:'';
            	  $("#recievedCount").html(recieved);
            	  if($('#MyConnectionsPending .recievedMember').length==0){
            		  $('#MyConnectionsPending .recievedConnections').html('<div class="col-xs-9"><div><span class="default-message-style">There are no recieved requests!</span></div>');
            	  }
              },
              errorCallBack:function(request,status,error){
                     
              },
              failureCallBack:function(data){
            	  $("#displayGroupMembers").html('');
            	  $("#emptySearchResult").show();
            	  $("#processingSymbolMore").hide();
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
            	  
            	  $("#connectionsearchid").off('click').bind('click',function(){
            		 if($(this).hasClass("selected-sm")){
            			 return false;
            		 }else{
            			 $("#memberSearchBoxButton").trigger('click');
            		 }
            	  });
            	  
            	  $(document).keyup(function(event){
            		  if(event.which === 27){
                    	  $('.closePopover').trigger('click');
            		  }
            	  });
            	  
            	  //$("#hideMenuForMyConnections").removeClass('hide');//addedFor Menu is Not Working In 1x1
            	  $("#addNewConnectionsID").on('click',function(e){
            		  
/*   	 				$("#hideMenuForMyConnections").removeClass('hide');
 	 				$("#removeHidemyConnectionsOptionsID").addClass('hide');*/
 	 	   		 	$("#minimize_maximize_myConnections_22").trigger('click');
 	 	   		 	//dashboardShifting.toMyConnections2x2View();
 	 	   		 	isPlusToActivate=true; 	   		 	
 	 	   		 	
            	  });
            	
            	  $(".connectionShortProfileClassTitle").off("click").bind("click",function(e){
           			 
        				//  $('.courseShortInfoClass').not($(this)).popover('destroy');          		
             			 var uniqueProfileID = $(this).parent().attr('uniqueProfileIDD');      		  
                	 	//  window.location.href =  ;
                	 	  window.open(contextPath+'/userprofile/profile/'+uniqueProfileID,'_blank');
                		  	 		 
                	});
                		  
            	  	
            	/* 
      		 	$('.popoverUserShortProfileClass').off("click").bind("click",function(e){
      				$('.popoverUserShortProfileClass').not(this).popover('destroy');
      			}); */
            	  $(".connectionShortProfileClassImage").popover('destroy');//added for the popover remains when widget size changed with this line it closes when widget resized
            	  $(".connectionShortProfileClassImage").off("click").bind("click",function(e){
            	  
            	  	//e.stopPropagation();
            	  	closePopups();
            	  	
            	  	 if($(this).is('[aria-describedby]')){
				//		 $('.connectionShortProfileClassImage').popover('destroy');
						 return;
					 }
				// $('.connectionShortProfileClassImage').popover('destroy');
				 
				 
            		//  $('.connectionShortProfileClassImage').not($(this)).popover('destroy');
            		 var uniqueProfileID = $(this).parent().attr('uniqueProfileIDD');
            		 // $('.popover').not($('#shortProfileDivID'+uniqueProfileID).closest('.popover')).remove();
            		 var imageURL = $(this).parent().attr('imageURL');
            		  var memberNamee = $(this).parent().attr('memberNamee');
            		  var profileSummaryy = $(this).parent().attr('profileSummaryy');
            		  var memberFirstNameAndLastName = $(this).parent().attr('memberFirstNameAndLastName');
            		  var userIdd = $(this).parent().attr('userIdd');
            		  var memberId = $(this).parent().attr('memberId');
            		  var isTwobyTwo = $(this).parent().attr('isTwobyTwo');
            		  var position = 'top';

			  /** Since "My connection" is on the (1,2) column now. The popup can just be on the right **
            		  if(isTwobyTwo == 'true'){
            			  position = ((parseInt($(this).attr('pos'))-1)%7==0)?'left':'right';
            		  }else{
            			  position = ((parseInt($(this).attr('pos'))-1)%3==0)?'left':'left';
            		  }
			  *****/
			  position = 'right';

            		  var isFollow = $(this).parent().attr('isFollow');
            		  
            		  if(isFollow == 'true'){
            			  isFollow = true;
            		  }else{
            			  isFollow = false;
            		  }
            		  
            		  var jsonObject = UIElements.myConnectionsUserShortProfile(uniqueProfileID,imageURL,memberNamee,profileSummaryy,memberFirstNameAndLastName,userIdd,memberId);
            		  
            		  var htmlTemplate ='<div class="classforRemoving" id="shortProfileDivID{{uniqueProfileIDKey}}" isFollow="{{#isFollow}}UNFOLLOW{{/isFollow}}{{^isFollow}}FOLLOW{{/isFollow}}"><span class="pull-right popover-close"><a class="closePopover" onclick="javascript:myconnections.closePopover(this);"><i class="close-sm-icons selected-sm memebr-fv-remove cursor-hand top-right-4-8" containerId="{{uniqueProfileIDKey}}" id="remove-short-profile-{{uniqueProfileIDKey}}"></i></a></span>';  
            		  htmlTemplate+='<div class="connection-popover-holder">';
            		  htmlTemplate+='<div class=""><a target="_blank" href="'+contextPath+'/userprofile/profile/'+uniqueProfileID+'">' 
          						+'      <div class="float-left">'
          						+'		  <img src="{{imageURLKey}}" class="myconnection-popover-image"/>'
          						+'      </div>'
          						+'      <div class="element-font-15">'
          						+'          <div class="mar-left-80 memberLinkTitle">{{memberNameeKey}}</div>'  
          						+'      </div>'
          						+'	</a></div>'
          						+'<div class="height-300 mar-left-75"></div>'
          						/*+'<div class="pad-lr-12 clear-float">{{profileSummaryyKey}}</div>'*/
          						+'<div class="mar-left-15-minus pad-top-12">'
          						+'	<div class=" display-inline text-center pad-right-10 font-11 cursor-hand"><a class="toolbar-element-content" id="user-connect-button-{{uniqueProfileIDKey}}" onclick="javascript:myconnections.followOrUnFollowClick(\'{{uniqueProfileIDKey}}\',\'CONNECTION\',\'{{#isFollow}}UNFOLLOW{{/isFollow}}{{^isFollow}}FOLLOW{{/isFollow}}\')" ><i  class="changeiconFollowNess {{#isFollow}}unfollowers-sm-icons{{/isFollow}} {{^isFollow}}followers-sm-icons{{/isFollow}}"></i><br/><span id="user-follow-unfollowiconid-{{uniqueProfileIDKey}}">{{#isFollow}}UnFollow{{/isFollow}}{{^isFollow}}Follow{{/isFollow}}</span></a></div>'
          						+'	<div class=" display-inline text-center  pad-right-10 font-11"><a class="toolbar-element-content" id="user-Connection-message-button-{{uniqueProfileIDKey}}" onclick="javascript:myconnections.sendMessageToConnection(\'{{imageURLKey}}\',\'{{memberFirstNameAndLastNameKey}}\',\'{{userIddKey}}\');" recipientPhoto="{{imageURLKey}}" recipientName="{{memberFirstNameAndLastNameKey}}" recipientUserId="{{userIddKey}}" href="javascript:void(0);"><i class="message-sm-icons"></i><br/>Message</a></div>'
          						//+'  <div class="display-inline text-center  pad-right-10 font-11"><a id="user-conversation-button-{{uniqueProfileIDKey}}" class="ancher_lock" href="javascript:void(0);"><i class="conversation-sm-icons"></i><br/>Conversation</a></div>'
          						+'	<div class=" display-inline pull-right text-center font-11 mar-right-15-minus"><a class="toolbar-element-content" id="user-connect-button-{{uniqueProfileIDKey}}" href="javascript:void(0);" class="" onclick="javascript:myconnections.unConnectMember(\'{{userIddKey}}\',\'{{memberIdKey}}\',\'{{uniqueProfileIDKey}}\',\'{{memberFirstNameAndLastNameKey}}\');"><i class="disconnection-sm-icons"></i><br/>Disconnect</a></div>'
          						+'</div>'
                          +'</div></div>';

            		  // Added to display respective follow or unfollow option
            		  jsonObject.isFollow = isFollow;
            		  
            		  var divv = Mustache.to_html(htmlTemplate,jsonObject);
            		 
                     	$(this).popover({
                            'html' : true,
                            placement: position,
                            /*viewport: {selector: '.gridster', padding: 2},*/
                            container: 'body',
                            viewport:{'selector':'.gridster','padding':10},
                            title: '',
                            trigger:'none',
                            content:divv,
                        }).on("show.bs.popover", function(){
                        	$(this).data("bs.popover").tip().css({"min-width": "270px","min-height":"300px","padding":"12px"}); 
                        	});
                     	$(this).popover('show');
                     	
                     	

  				});            	  
            	  
      	    	/*To show view option for calendar */
    	      	  $("#showOptionsmyConnectionsID").off('click').bind('click',function(){
    	      		$("#removeHidemyConnectionsOptionsID").toggleClass('hide');
    	    		  
    	    	  });
    	      	  
            	  
            	  $('#memberSearchBoxId').off("keyup").bind("keyup",function(e){
            		  $('.myconTwobyTwo div').hide();
            		  SearchBoxVal=$.trim($('#memberSearchBoxId').val());
            		  if($("#memberSearchBoxButton").attr('active')!='active'){
            			  $("#connectionsListValues").empty();
            		  if(SearchBoxVal.length>0){
            			//  $('#memberSearchBoxButton').attr('src',contextPath+'/static/pictures/AddSign_S30.png');  
            			  $('.myconTwobyTwo div').filter(':containsIN("'+SearchBoxVal+'")').show();  
            			  if($('.myconTwobyTwo div').filter(':containsIN("'+SearchBoxVal+'")').length == 0){
            				  $('#connectionsListValues').empty().append('<div><span class="default-message-style">No Results Found !</span></div>');
            			  }
            			}
            		  else{
            			  $('.myconTwobyTwo div').show();            			  
            		  }
            		  }
            		  else{
            			  //if(e.keyCode==13){
            				  //$("#memberSearchBoxButton").trigger("click");
            				  if(SearchBoxVal){
                  				$("#connectionsListValues").empty();
                   				  $('.myconTwobyTwo div').hide();
                       			  if(SearchBoxVal.length>0){
                       					var flag={
                       						isGetConnectionsTwobyTwo:true,
               				  				searchParameter:SearchBoxVal,
               				  				baseElementMyConnections:"#baseElementMyConnections"
                       			  		};										 
                       					myconnections.init(flag);
                       				}else{
                       					$("#connectionsListValues").empty();
                       				}
                  			  } 
                		  //} 
            		  }
            	  });
            		$("#memberSearchBoxButton").off("click").bind("click",function(e) {
            			$('.myconTwobyTwo div').hide();
            			isPlusToActivate=false;
            			$("#connectionsListValues").empty();
            			 SearchBoxVal=$.trim($('#memberSearchBoxId').val());
            			if($(this).attr('active')=='active'){
            				$("#searchHint").text("Connections");
            				$('#memberSearchBoxId').addClass('myconnection-text-box');
                			$('#memberSearchBoxId').removeClass('search-connection-text-box');	
                			
                		//	$('#memberSearchBoxButton-display').addClass('pad-left-38');
                		//	$('#memberSearchBoxButton-display').removeClass('pad-left-5-important');	
                			
                			//$('#display-search-section').addClass('width-115');
                			
	            				var flag={
	      	          				  isMyConnectionsTwobyTwo:true,
	    	          				  baseElementMyConnections:"#baseElementMyConnections"
	    	          				 }; 									 
								myconnections.init(flag);
	            			//}	
								$('#memberSearchBoxId').focus();
            			}else{
            				
            			$('#memberSearchBoxId').removeClass('myconnection-text-box');
            			$('#memberSearchBoxId').addClass('search-connection-text-box');	
            			
            		//	$('#memberSearchBoxButton-display').removeClass('pad-left-38');
            		//	$('#memberSearchBoxButton-display').addClass('pad-left-5-important');	
            			
            		//	$('#display-search-section').removeClass('width-115');
            			$(this).attr('active', 'active');
    	              	//$(this).attr('src',contextPath+'/static/pictures/AddSign_S30.png').attr('active','active');
    	              	$('#memberSearchBoxId').attr('placeholder','Search New Connections').closest('.mygroups-section').find('.search-sm-icons').removeClass('selected-sm').addClass('def-icon');
    	              	$('#memberSearchBoxId').val('');
    	              	$("#searchHint").text("New Connections");
						$(this).addClass("selected-sm");

            			}
                	});
/*            		$(element).find('.search-bg-icons').off('click').bind('click',function(e){
            			$('#memberSearchBoxButton').attr('src',contextPath+'/static/pictures/AddSign_E30.png').attr('active','');
            			$("#connectionsListValues").empty();
            			$('.myconTwobyTwo div').show();
    	              	$('#memberSearchBoxId').attr('placeholder','Search Connections').closest('.mygroups-section').find('.search-sm-icons').addClass('selected-sm').removeClass('def-icon');
    	              	$('#memberSearchBoxId').val('');
    	              	$("#searchHint").text("Connections");
            		});*/
         		 $("#connectionTotalCountID").click(function(e){
     				//Below requires when view not in (2x2) view.
     				$("#minimize_maximize_myConnections_21").trigger('click');
					var flag={
			  				isMyConnections:true,
			  				isTotalCount:true,
			  				baseElementMyConnections:"#baseElementMyConnections"
			  		};										 
					myconnections.init(flag);
					
      			 });
            	  
            	  $("#myConnectionsHyperLinkID").off("click").bind("click",function(e){

            		  dashboardShifting.toMyConnections2x2View();
            	  });   
            	  
                  $("#newConnectionSearchHyperLinkID").off("click").bind("click",function(e){
                	  //clearing the div of Connection members results section.
                	  $("#connectionsListValues").empty();
                	  $("#searchValue").val("");
						var flag={
				  				isNewConnection:true,
				  				baseElementMyConnections:"#baseElementMyConnections"
				  		};										 
						myconnections.init(flag);
  				});
                  
              
          	  $("#searchForConnections").click(function(){
				var flag={
		  				isGetConnections:true,
		  				searchParameter:$("#searchValue").val(),
		  				baseElementMyConnections:"#baseElementMyConnections"
		  		};										 
				myconnections.init(flag); 
        	  });
          	
        	  $("#myConnectionsSendRequestHyperLinkID").off("click").bind("click",function(e){
        		  var flag;
        		  if($('#5').attr('data-sizex')=='1')
						flag={
  		  				isMyConnectionsSendRequest:true,
  		  			baseElementMyConnections:"#baseElementMyConnections"
  		  		};	
        		  else flag={
    		  				isMyConnectionsSendRequestTwobyTwo:true,
    		  				baseElementMyConnections:"#baseElementMyConnections"
    		  		};	
  				myconnections.init(flag); 
          	  });    
        	  
        	  $("#myConnectionsPendingRequestHyperLinkID").off("click").bind("click",function(e){
        		  
        		  if($("#connectionRequestCount:visible").length > 0){
	        		  // Used update the connections notification count 
	        		  updateNotificationCount(4);
	        		  $("#connectionRequestCount").addClass('hide');
        		  }
        		  var flag;
        		  if($('#5').attr('data-sizex')=='1')
						flag={
    		  				isMyConnectionsPendingRequest:true,
    		  				baseElementMyConnections:"#baseElementMyConnections"
    		  		};	
        		  else{
        			  flag={
      		  				isMyConnectionsPendingRequestTwobyTwo:true,
      		  			baseElementMyConnections:"#baseElementMyConnections"
      		  		};	
        		  }
        		  /*//call to update the connection request count.
        			updateNotificationCount(4);
        			$("#connectionRequestCount").addClass('hide');
                	$("#connectionRequestCount").html('');*/
    				myconnections.init(flag); 
            	  });
        	  if(isPlusToActivate)
        		  $("#memberSearchBoxButton").trigger('click');
              },
              sendMessageToConnection:function(imageURLKey,memberFirstNameAndLastNameKey,userIddKey){
            	  myconnections.closePopover();
 					var messageOptions={
 					        ele : '#messageContainter'+userIddKey,
 					        isFromContactUs:false,
 							recipients:[{
 								photoId : imageURLKey,
 								userId : userIddKey,
 								name : memberFirstNameAndLastNameKey
 							}]
 					        
 					};
 					Message.init(messageOptions);
              },
              unConnectMember:function(userIddKey,memberID,uniqueProfileID, name){
            	  
           	   Confirmation.init({
           		    yesLabel:"Disconnect",
           			noLabel:"Cancel",
           			title:"Disconnect",
  					ele:element,
  					onYes:function(e){            	  
  						myconnections.closePopover();
  	          		var flag={
  	        				isUnConnectMember:true,
  	        				memberId:memberID,
  	        				userIDD:userIddKey,
  	        				uniqueProfileID:uniqueProfileID,
  	        				baseElementMyConnections:"#baseElementMyConnections"
  	        		};										 
  	        		myconnections.init(flag); 
  	        		},
  					message:'Are you sure want to disconnect with ' +name+ '?'
  				});
           	   
           	   
            	  
            	  
              },
              closePopover:function(e){
            	  	var open_popup_id = $(e).closest(".popover.in").attr('id');
        	 		var popup_open_ele = $('[aria-describedby="'+open_popup_id+'"]');
        			popup_open_ele.popover('destroy');
              },
              connectMember:function(userId,connectionGroupId,isSentConnectFromMyConnection, counter){
              
           //   alert("isSentConnectFromMyConnection " + isSentConnectFromMyConnection);
             //  alert ( searchResultModelList[counter]['name'] );
             
             if ( isSentConnectFromMyConnection ){
             	 lastConnectedMember = connectionModelList[counter]['name'];
             }
             else
            	lastConnectedMember = searchResultModelList[counter]['name'];
                
            		var options = {
            				requestfor:userId,
            				isConnectMembers:true,
            				userId:userId,
            				connectionGroupId:connectionGroupId,
            				baseElement:"connectionSent_"+connectionGroupId,
            				isSentConnectFromMyConnection:isSentConnectFromMyConnection
            			};
            		myconnections.init(options);            	  
              }, 
              
              	removeSentRequest:function(requestedGroupId,memId, counter){
              	
              	
              	lastConnectedMember = connectionModelList[counter]['name'] ;
              	
          		var options = {
          				manageMemberId:memId,
          				requestedGroupId:requestedGroupId,
          				isRemoveSentRequest:true
        			};
        		myconnections.init(options);            	  
          },
              staticUI:function(flag){
            	  if(flag.isNewConnection){
            		  var div='';
            		  var htmlTemplate = HTML.newConnection();
                	  div = Mustache.to_html(htmlTemplate);
                	  $(flag.baseElementMyConnections).append( div ); 
                	  var optionsForModel ={
                			  backdrop:'static',
                      		show:true,
                      		keyboard:true
                      	  };
                      	  
                      	  $('#add-connections').modal(optionsForModel);
                      	  $('#add-connections').on('shown.bs.modal',function(e){
                      	  });
                      	  $('#add-connections').on('hidden.bs.modal',function(e){
                      	  });
            		  
            	  }
            	  
            	  
              },
              displayConnections:function(obj){
            	  
            	  
/*          		var divFunction = '';
       		 var imgDiv = '';
       		 if(obj['photoId'] != '' && obj['photoId'] != null && obj['photoId'] != undefined){
       	     	imgDiv = '<li><img src="/contextPath/'+obj['photoId']+'" /><span class="count-circle">'+ obj['memberCount']+'</span></li>';
       	     }else{
       	     	imgDiv = '<li><img src="'+contextPath+'/static/pictures/defaultimages/1.png"><span class="count-circle">'+ obj['memberCount']+'</span></li>';
       	     }
       		 divFunction = '<a href="#">'+imgDiv+'</a>'; 	
       		 return divFunction;*/
       		 
            	  var MyConnectionLi = '<li>';
          		 var imgDiv = '';
          		 
         		 if(obj['photoId'] != '' && obj['photoId'] != null && obj['photoId'] != undefined){
          	     	imgDiv = '<img src="/contextPath/Group/'+obj['groupLogo']+'"/stamp.jpg />';
          	     }else{
          	     	imgDiv = '<img src="'+contextPath+'/static/pictures/defaultimages/1.png">';
          	     }
         		 
         		 
          	     var memberName='';
          	     if(obj['memberName'].length > 15){
          	    	memberName = obj['memberName'].substring(0, 10)+'...';
          	     }else{
          	    	memberName =  obj['memberName'];
          	     }
          	     
          	    var connectionNameDiv = '<div class="pad-tb-10">'+memberName+'</div>';
          	     
          	   MyConnectionLi = MyConnectionLi + imgDiv +connectionNameDiv;
          	     
          	  MyConnectionLi += '</li>';
          		
          	 return '<a href="#">'+MyConnectionLi+'</a>';
          		 
          	
               
       		 
         },
         followOrUnFollowClick:function(profileUniqueidentiFier,resourcetype,actiontype){
 			var accessToken = $("#accessToken").val();
    		var langId = $("#langId").val();
    		var isactiontype = $('#shortProfileDivID'+profileUniqueidentiFier).attr('isFollow');
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
 					resourceId:profileUniqueidentiFier,
 					actionType:actiontype
     			};
 			unfollowRequest = JSON.stringify(unfollowRequest);
 		 var unfollowOptions = {
 				 url:getModelObject('serviceUrl')+'/feed/1.0/assertFollowness',
 				 data:unfollowRequest,
 				 async:true,
 				 successCallBack:function(data){
 					 if(data['isSuccess']){
 						 //$(".connectionShortProfileClass").popover('destroy');
 						 if(actiontype == 'UNFOLLOW'){
   							$('#user-follow-unfollowiconid-'+profileUniqueidentiFier).html('Follow');
   							$('#shortProfileDivID'+profileUniqueidentiFier).attr('isFollow','FOLLOW');
   							$('.changeiconFollowNess').removeClass('unfollowers-sm-icons').addClass('followers-sm-icons');
   						 }else{
   							$('.changeiconFollowNess').addClass('unfollowers-sm-icons').removeClass('followers-sm-icons');
   							$('#user-follow-unfollowiconid-'+profileUniqueidentiFier).html('UnFollow');
   							$('#shortProfileDivID'+profileUniqueidentiFier).attr('isFollow','UNFOLLOW');
   						 }
 						 
 						 if(actiontype == 'UNFOLLOW'){
 							 $("#memberLiId"+profileUniqueidentiFier).attr('isFollow',false);
 						 }else{
 							$("#memberLiId"+profileUniqueidentiFier).attr('isFollow',true);
 						 }
 					 }
 				 }
 		 };
 		 doAjax.PutServiceInvocation(unfollowOptions);
 		},

       };
}.call(this);



/**
 * manageConnections method is Do ACCEPT/IGNORE/Delete save the connection.
 * @param manageMemberId
 * @param Action (Enum)
 */
function manageConnections(manageMemberId,action, counter){
	
	lastConnectedMember = manageGroupMemberModelList[counter]['name'];
	
	var options = {
			isManageConnections:true,
			manageMemberId:manageMemberId,
			Action:action,
			baseElement:"manage_"+manageMemberId
		};
	myconnections.init(options);
}


var myConnectionHtml = function(){
	return{
		userShortProfileHtml : function(){
			return htmlTemplate += '<ul class="dropdown-menu">'
            +'<div class="">'  
            +'<div class="pad-12 pad-bot-0">        '                              	
            +'      <div class="pad-bot-10 bottom-solid-border font-20">Connection Invitations'
            +'          <i class="pull-right all-messages"></i>'
            +'      </div>'
            +'   </div>'
            +'    <div class="scroll-content mCustomScrollbar">'
            +'    <!-- to be run in a loop -->'
            +'    	<div class="pad-lr-12">    '                                            
            +'          <li class="clear-float min-height-135 bottom-solid-border">'
            +'              <div class="col-xs-4"><img src="images/profiles/4.png" class="img-circle sm-img-circle"></div>                                               			<div class="col-xs-8">'
            +'                  <div class="font-20 bold">Julia Morales</div>'
            +'                  <div class="font-20">Short Profile of...</div>'
            +'                  <div class="radiobuttons">'
            +'                      <label>'
            +'                          <input name="ai" value="Accept" checked="" type="radio"><span class="check"></span>Accept'
            +'                      </label>'
            +'                      <label>'
            +'                          <input name="ai" value="Ignore" type="radio"><span class="check"></span>Ignore'
            +'                      </label>                                                        '
            +'                  </div>'
            +'              </div>'
            +'           </li>'
            +'       </div>'
            +'       <!-- to be run in a loop end-->'                                               
            +'  </div>'
            +'</div>'
            +'</ul>';
		}
	}
}