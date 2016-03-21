/**
 * @author Next Sphere Technologies
 * Related Groups widget
 * 
 * This will shows all the related groups with in Group Home and Group Shell page
 * 
 */

var isHide = false;
var getAllResults = false;
$(document).ready(function(){
	});

var RelatedGroups = function(){
	var isMore=false;
	var self;
       return {
	    	  defaults:{
	  	    	 pageNo:1,
	  	    	 pageSize:9,
	  	    	 serviceUrl:'/group/1.0/getAssociationGroups',
	  	    	 isMore: false,
	  	    	 isHomeGroups:false
	  	      },
	  	      settings:{
	  	    	  
	  	      },
	  	      destroy:function(){
	  	    	RelatedGroups.settings = {};
	  	      },
              init:function(options){
            	  this.destroy();
            	  self = this;
            	  
            	  var defaultStartResult = 1;
            	  options.pageNo = defaultStartResult;
            	  options.pageSize = RelatedGroups.defaults.pageSize;
            	  options.isMore = false;
        		  
            	  	this.settings = $.extend(this.defaults,options);
          	  		var element = this.settings.ele;
                     this.staticUI(element);
                     var options = this.prepareServiceRequest(RelatedGroups.settings.associationType,getAllResults,"");
                     this.serviceInvocation(options);
              },
              registerValidations:function(element){
            	  $(element).validate({});  
              },
              serviceInvocation:function(options){
            	  $("#processingSymboSearchGroup").hide();
            	  doAjax.GetServiceInvocation(options);
              },
              prepareServiceRequest:function(association,getAllResults,groupName){
            	  	var getAllGroupsURI = RelatedGroups.settings.serviceURL;
    				var getAllGroups = getModelObject('serviceUrl')+getAllGroupsURI;
    				
              		var accessToken = $("#accessToken_meta").val();
              		var langId = $("#langId_meta").val();
              		var userId = $("#loggedInUserId-meta").val();
              		var startResult = parseInt(RelatedGroups.settings.pageNo);//parseInt($("#"+association+"relatedgroupsstartResult").val());
              		if(startResult > 0){
              			startResult = startResult+0;
              		}else{
              			startResult = 0;
              		}
              		var maxResult =parseInt(RelatedGroups.settings.pageSize); //parseInt($("#"+association+"relatedgroupsmaxResult").val());
              		var groupUniqueIdentifier = $("#groupUniqueIdentifier").val();
              		var pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult,startResult,getAllResults));
              		var headers = {
              				accessToken:accessToken,
              				langId:langId
              				
              		};
              		//headers = JSON.stringify(headers);
      				var associationType = association;
      				
            		//getAllGroups = getAllGroups+"?pageCriteria="+pageCriteria+"&associationType="+associationType+"&searchByGroupName="+groupName+"&groupUniqueIdentifier="+groupUniqueIdentifier;
            		var data = {
            				pageCriteria: pageCriteria,
            				associationType:associationType,
            				searchByGroupName:groupName,
            				groupUniqueIdentifier:groupUniqueIdentifier
            		} ;
              		var options={
              				url:getAllGroups,
              				data:data,
              				headers:headers,
              				parentId:RelatedGroups.settings.ele,
              				requestInfo:{associationType:association},
              				successCallBack:RelatedGroups.successCallBack,
              				failureCallBack:RelatedGroups.failureCallBack,
              				beforeSendCallBack:RelatedGroups.beforeSendCallBack,
              				completeCallBack:RelatedGroups.completeCallBack,
              				async:false
              		};
              		return options;
              },
              successCallBack:function(requestInfo,data){

            
  					var results = data['groupInfoModels']; 
  					var relatedgroupscount = data['recordCount'];
  					if(relatedgroupscount == 0){
  						if(requestInfo.associationType == 'CHILD'){
  							relatedGroupHtml = "<div class='default-message-style'>You have no Child Groups yet.</div>";
  						}else if(requestInfo.associationType == 'RELATED'){
  							relatedGroupHtml = "<div class='default-message-style'>You have no Related Groups yet.</div>";
  						}else{
  							relatedGroupHtml = "<div class='default-message-style'>You have no Groups yet.</div>";
  						}
  						$("#"+requestInfo.associationType+"relatedGroupContent").html( relatedGroupHtml );
  						$("#"+requestInfo.associationType+"relatedgroupscount").html(relatedgroupscount);
  					}
  					if(results != undefined){
  						
  						if(results.length == undefined){
  	  						results = [results];
  	                     }
  	  					
  	  					for(var i=0;i<results.length;i++){ 
  	  						results[i].count = i; 
  	  					}
  	  					
  						results.groupInfoModels = results;
  						for(i=0;i<results.groupInfoModels.length;i++){
  			            if(results.groupInfoModels[i].groupName.length > 19){
  			            	results.groupInfoModels[i].modified_groupname = stringLimitDots(results.groupInfoModels[i].groupName,19);
  			          	}else{
  			          	results.groupInfoModels[i].modified_groupname = results.groupInfoModels[i].groupName;
  			          	}
  						}
  						 var relatedGroupsHtmltemplate = '<ul class="group-members-blocks">'
  						 +'{{#groupInfoModels}}'
  						 +'<div id="relatedgroupsectiondivid_{{uniqueIdentifier}}">'
  						 +'<div class="position-relative"> <div class="darkborder memberinfo-fullview hide whitebg position-absolute" id="relatedgroupfaceoverlay_{{uniqueIdentifier}}"></div> </div>'
  						 +'<div id="groupcontent_{{uniqueIdentifier}}" uniqueIdentifier="{{uniqueIdentifier}}">'
  						 +'<li  class="width-130-important">'
  	  					 +'		{{#groupLogo}}'
  	             		 +'	    <img src="/contextPath/Group/{{groupLogo}}/profile.jpg" uniqueIdentifier="{{uniqueIdentifier}}" class="groupShortInfoClassImage group-profilepic-imagesize">'
  	             		 +'		{{/groupLogo}}'
  	             		 +'		{{^groupLogo}}'
  	             		 +'	    <img  src="'+contextPath+'/static/pictures/defaultimages/no-group-image.jpg" uniqueIdentifier="{{uniqueIdentifier}}" class="groupShortInfoClassImage group-profilepic-imagesize">'
  	             		 +'		{{/groupLogo}}'
  	  					 +'<div class="relatedGroupSubgroupTitle memberLinkTitle font-10px helvetica-neue-roman pad-top-4 text-center" title="{{groupName}}">{{modified_groupname}}</div>'
  	  					 +'</li>'
  	  					 +'</div>'
  	  					 +'</div>'
  	  					 +'{{/groupInfoModels}}'
  	  					 +'</ul>';
  						
  						var relatedGroupHtml = Mustache.to_html(relatedGroupsHtmltemplate,results);
  						
  						var startResult = parseInt(RelatedGroups.settings.pageNo);
  	              		var maxResult = parseInt(RelatedGroups.settings.pageSize);
  	              		var totalFetchResult = parseInt(startResult) + parseInt(maxResult) ;	
  	              		RelatedGroups.settings.pageNo = startResult;
  						if(RelatedGroups.settings.isMore){
  							$("#"+requestInfo.associationType+"relatedGroupContent").append( relatedGroupHtml );
  						}else{
  							
  							$("#"+requestInfo.associationType+"relatedGroupContent").html( relatedGroupHtml );
  							$("#"+requestInfo.associationType+"relatedgroupscount").html(relatedgroupscount);
  						}
  						
  						if(parseInt(relatedgroupscount) > parseInt(maxResult)){
								$("#"+requestInfo.associationType+"moreGroups").removeClass("hide");
								$("#"+requestInfo.associationType+"hideGroups").addClass("hide");
						}
  						if(parseInt(relatedgroupscount) < parseInt(totalFetchResult)){
								$("#"+requestInfo.associationType+"moreGroups").addClass("hide");
								if(RelatedGroups.settings.isMore){
									$("#"+requestInfo.associationType+"hideGroups").removeClass("hide");
								}
						}
  	  					
  					}else{
  						//TODO no results found
  						if(requestInfo.associationType == 'CHILD'){
  							relatedGroupHtml = "<div class='default-message-style'>You have no Child Groups yet.</div>";
  						}else if(requestInfo.associationType == 'RELATED'){
  							relatedGroupHtml = "<div class='default-message-style'>You have no Related Groups yet.</div>";
  						}else{
  							relatedGroupHtml = "<div class='default-message-style'>You have no Groups yet.</div>";
  						}
  						$("#"+requestInfo.associationType+"relatedGroupContent").html( relatedGroupHtml );
  						$("#"+requestInfo.associationType+"relatedgroupscount").html(relatedgroupscount);
  					}
  					RelatedGroups.bindEvents();
  					RelatedGroups.dynamicEvents();
              },
              beforeSendCallBack:function(jqXHR,settings){
              },
              completeCallBack:function(jqXHR,textStatus){
              },
              errorCallBack:function(request,status,error){
                     
              },
              failureCallBack:function(data){
              },
              dynamicUI:function(data){
              },
              dynamicEvents:function(){
              
              		$(".relatedGroupSubgroupTitle").off("click").bind("click",function(e){
           			 
        			      		
             			  var uniqueIdentifier = $(this).parent().parent().attr('uniqueIdentifier');         		  
                	 	 
                		    window.open(contextPath+'/group/'+uniqueIdentifier,'_blank');	 		 
                	});
                		
              	  $(".groupShortInfoClassImage").off("click").bind("click",function(e){
            		  //$('#createSubGroup').focus();
            		  if($(this).closest("ul").parent('div').attr('id') == 'CHILDrelatedGroupContent'){
            			  $("html, body").animate({ scrollTop: $('#CHILDrelatedGroupContent').position().top }, "slow");
            		  }
            		  if($(this).closest("ul").parent('div').attr('id') == 'RELATEDrelatedGroupContent'){
            			  $("html, body").animate({ scrollTop: $('#RELATEDrelatedGroupContent').position().top }, "slow");
            		  }
            		  var uniqueIdentifier = $(this).attr("uniqueIdentifier");
            		  RelatedGroups.getgroupcontent(uniqueIdentifier);
            	  }); 
            	  
            	  /*
            	  $("[id^=groupcontent_]").off("click").bind("click",function(e){
            		  //$('#createSubGroup').focus();
            		  if($(this).closest("ul").parent('div').attr('id') == 'CHILDrelatedGroupContent'){
            			  $("html, body").animate({ scrollTop: $('#CHILDrelatedGroupContent').position().top }, "slow");
            		  }
            		  if($(this).closest("ul").parent('div').attr('id') == 'RELATEDrelatedGroupContent'){
            			  $("html, body").animate({ scrollTop: $('#RELATEDrelatedGroupContent').position().top }, "slow");
            		  }
            		  var uniqueIdentifier = $(this).attr("uniqueIdentifier");
            		  RelatedGroups.getgroupcontent(uniqueIdentifier);
            	  }); 
            	  */
            	  
            	  $("[id^=groupcontent_]").focusin(function(){$('#createSubGroup').focus();});
              },
             /**
              *  bind operations performed on UI
              */
              bindEvents:function(){
            	  $("[id^=createSubGroup]").off("click").bind("click",function(e){
            		  $("#processingSymboCreateGroupIcon").show();
                		 var options = {
         						ele:"#mainContentContainer"
         				};
                		 saveSubGroupSection.init(options);
                		 
                		 $('#groupName').focus();
                  });

              
              
            	  $("#group-name-search-box").off('keyup').keyup(function(e) {
          		    if (e.which == 13) {
          		    	var groupName = $("#group-name-search-box").val();
            			  var association = 'CHILD';
                		  var getAllResults = false;
                		  var options = RelatedGroups.prepareServiceRequest(association,getAllResults,groupName);
                		  RelatedGroups.serviceInvocation(options);
                		  return false;
          		    	}
          		    
          		});
            	  $("#group-search-icon").off("click").bind("click",function(e){
            		  $("#group-name-search-box").val('');
      				$("#groupNameSearch").toggleClass("selected-sm");
      				$("#group-name-search-box").toggleClass('hide');
      			}); 
            	  $("#"+RelatedGroups.settings.associationType+"moreGroups").off('click').click(function(event){
            		  var association = $(this).attr('associationType');
            		  RelatedGroups.settings.associationType = association;
            		  var startResult = $("#"+association+"relatedgroupsstartResult").val();
	              	  var maxResult = parseInt(RelatedGroups.settings.pageSize);
	              	  var totalResult = parseInt(startResult) + parseInt(maxResult);
	              	 
	              	 $("#"+association+"relatedgroupsstartResult").val(totalResult);
	              	RelatedGroups.settings.pageNo = totalResult;
	              	
	              	  RelatedGroups.settings.isMore = true;
            		  var options = RelatedGroups.prepareServiceRequest(association,getAllResults,"");
            		  RelatedGroups.serviceInvocation(options);
					});
            	  
            	  $("#"+RelatedGroups.settings.associationType+"hideGroups").off('click').click(function(event){
            		  var association = $(this).attr('associationType');
            		  var getAllResults = false;
            		  RelatedGroups.hideRelatedGroups(association,getAllResults);
            		  $("#"+association+"hideGroups").addClass("hide");
					});
            	  $("#"+RelatedGroups.settings.associationType+"relatedgroupscount").off('click').click(function(event){
            		  var association = $(this).attr('associationType');
            		  var getAllResults = true;
            		  RelatedGroups.hideRelatedGroups(association,getAllResults); 	
            		  var count = parseInt($("#"+RelatedGroups.settings.associationType+"relatedgroupscount").html());
            		  $("#"+association+"moreGroups").addClass("hide");
            		  if(count > parseInt(RelatedGroups.settings.pageSize)){
            			  $("#"+association+"hideGroups").removeClass("hide");
            		  }
            	  });
              },
              hideRelatedGroups: function(association,getAllResults){
            	  
            	  var defaultStartResult = 1;
        		  RelatedGroups.settings.pageNo = defaultStartResult;
        		  RelatedGroups.settings.pageSize = RelatedGroups.defaults.pageSize;
        		  var options = RelatedGroups.prepareServiceRequest(association,getAllResults,"");
        		  RelatedGroups.settings.isMore = false;
        		  RelatedGroups.serviceInvocation(options);
        		  RelatedGroups.settings.pageNo = 1;
        		  $("#"+association+"relatedgroupsstartResult").val(1);
              },
              staticUI:function(element){
            	  var html =  '';
            	  var htmlData;
            	  htmlData= UIElements.relatedgroups();
            	  html+= HTML.relatedgroups();
            	  htmlData.isHomeGroups = RelatedGroups.settings.isHomeGroups;
				  htmlData.associationHeader = RelatedGroups.settings.associationHeader;
				  htmlData.associationType = RelatedGroups.settings.associationType;
				  htmlData.startResult = RelatedGroups.settings.pageNo;
				  htmlData.maxResult = RelatedGroups.settings.pageSize;
				  
				 // RelatedGroups.settings.associationType
            	  var relatedgroupsHtml = Mustache.to_html(html,htmlData);
            	  $(element).html(relatedgroupsHtml);
            	    
              },
              displayGroups:function(obj,localizedMembersMsg,count){
            		var divFunction = "";
            		 var imgDiv = '';
            		 if(obj['groupLogo'] != '' && obj['groupLogo'] != null && obj['groupLogo'] != undefined){
            			 imgDiv = '<img src="/contextPath/Group/'+obj['groupLogo']+'/profile.jpg">';
            	     }else{
            	     	imgDiv = '<img src="'+contextPath+'/static/images/no-group-logo.jpg">';
            	     }
            		 divFunction = '<li id="group_'+obj['groupId']+'">'+imgDiv+'<div>'+obj['groupName']+'</div></li>';
            		 divFunction += '<div class="position-relative">'
								+'		 <div class="darkborder memberinfo-fullview hide whitebg position-absolute right0" id="relatedgroupfaceoverlay_'+count+'">'
								+'		</div>'
								+'	</div>';
            		 return divFunction;
              },
              getgroupcontent:function(groupId){
            	  var options={
                		  ele:"#relatedgroupfaceoverlay_"+groupId,
                		  uniqueIdentifier:groupId,
                		  isFromInfo:true,
                		  isRelatedGroups : true,
                		  isFromManage:false
                	};
                	GroupFace.init(options);
                	 $("#relatedgroupfaceoverlay_"+groupId).removeClass('hide');
               		 $("#removeIconContainer").removeClass('hide');
               		//$("[id^=isGroupfaceicon]").removeClass("pad-top-60").addClass("pad-top-25");
	         }
       };
}.call(this);