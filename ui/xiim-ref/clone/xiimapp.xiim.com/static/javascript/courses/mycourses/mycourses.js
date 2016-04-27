/**
 * @author Next Sphere Technologies
 * 
 * This file is old Course.
 * 
 * Note: This file as to delete once we implement new Course feature. 
 * 
 * this can be used for reference purpose only.
 * 
 */
/*var scriptElementMyCourses = document.getElementsByTagName("script");
var baseElementMyCourses = scriptElementMyCourses[scriptElementMyCourses.length - 1].parentNode;*/

var mycourses = function(){
	var element="";
	var loadFlagType = "";
	var needrefreshcourses=false;
       return {
              init:function(flag){
            	  needrefreshcourses=false;
            	  	 loadFlagType = flag;
            	  	 
                     element = flag.baseElementMyCourses;
                     this.staticUI(flag);
                     var options = this.prepareServiceRequest(flag);
                     this.serviceInvocation(options);
                     this.bindEvents();
              },
              registerValidations:function(element){

              },
              serviceInvocation:function(options){
            	  if(loadFlagType.newCourseServiceInvocation)
            		  doAjax.PostServiceInvocation(options);
            	  else
            		  doAjax.GetServiceHeaderInvocation(options);
              },
              prepareServiceRequest:function(flag){
            	  
          	  	var URI='';
          	  	var URL='';
          	  	var filterFlag = "ONEBYONE";
        		var accessToken = $("#accessToken").val();
          		var langId = $("#langId").val();
          		var startResult = parseInt($("#startResult").val());
          		if(startResult > 0){
          			startResult = startResult+0;
          		}else{
          			startResult = 0;
          		}
          		var maxResult = parseInt($("#maxResult").val()); 
          		
          		if(flag.isTwobyTwoView){
          			maxResult = 40;
          			filterFlag = "TWOBYTWO";
          			if(createCourseBusinessValidation($(currentUserAccountType).val()))
          				$('.newCourseBusinessRule').removeClass('hide');
          		}
            	  
          		
          		var pageCriteria =  JSON.stringify(preparePageCriteriaJSONString(maxResult,startResult,false));
            	  

          		if(flag.isMyCourses){
          			
          		URI = $("#getMyCoursesURL").val();
          		URL = getModelObject('serviceUrl')+URI;
	      		URL = URL+"?courseAssociationFilter="+filterFlag+"&pageCriteria="+pageCriteria;
	      		
          		}else if(flag.newCourseServiceInvocation){
      			URI = $("#saveCourseTitleURI").val();
      			URL = getModelObject('serviceUrl')+URI;
      			
      			
        		var CreateCourseRequest = '';
        		CreateCourseRequest = {
									"courseModel":{
										"courseName":flag.courseName
									},
									"langId" : langId,
									"accessToken" : accessToken
			          			};
        		CreateCourseRequest = JSON.stringify(CreateCourseRequest);
        		
          		var options={
          				url:encodeURI(URL),
          				data:CreateCourseRequest,
          				parentId:mycourses.element,
          				successCallBack:mycourses.successCallBack,
          				failureCallBack:mycourses.failureCallBack,
          				beforeSendCallBack:mycourses.beforeSendCallBack,
          				completeCallBack:mycourses.completeCallBack,
          				async: true
          		};
          		return options;
          			
          		}else if(flag.isMyCoursePendingRequest){
          			
          		 URI = $("#getCoursePendingRequestsURI").val();
          		 URL = getModelObject('serviceUrl')+URI;
	      		 URL = URL+'?pageCriteria='+pageCriteria;
	      		
          		}else if(flag.isMyCourseReceivedInvitaions){
          			URI = $("#getReceivedCourseInvitationsURI").val();
             		URL = getModelObject('serviceUrl')+URI;
   	      		 	URL = URL+'?pageCriteria='+pageCriteria+"&associationType=COURSE";
          			
          		}
          		
          		//building options for invocating service method using ajax.
          		var options={
          				url:encodeURI(URL),
          				parentId:mycourses.element,
          				successCallBack:mycourses.successCallBack,
          				failureCallBack:mycourses.failureCallBack,
          				beforeSendCallBack:mycourses.beforeSendCallBack,
          				completeCallBack:mycourses.completeCallBack,
          				headers:{"accessToken":accessToken,"langId":langId},
          				async: true
          		};
          		return options;
              },
              successCallBack:function(data){
            	  	var div = '';
					var result = data['result'];
					var status = result['status'];
					if(status == 'true'){
		            	  if(loadFlagType.isMyCourses){
		                	  //var htmlTemplate = HTML.myCourse();
		                	  //data=mustacheDataUtil(data);
		                	  //div = Mustache.to_html(htmlTemplate,data);
		            		  needrefreshcourses=false;

								var htmlTemplate = '';
								if(data.courseInfoModels){
									if(data.courseInfoModels.length == undefined){
										data.courseInfoModels = [data.courseInfoModels];
									}
									
									var groupCount = data['recordCount'];
									
									htmlTemplate += '<div class="mycourses1-1"><ul>';
									for(var i=0;i<data.courseInfoModels.length;i++){
										var modifiedGroupName = stringLimitDots(data.courseInfoModels[i]['name'],19);
										var imageURL = contextPath+"/static/pictures/defaultimages/french.png";
				                	      if(data.courseInfoModels[i]['logoId'] != undefined && data.courseInfoModels[i]['logoId'] != ""){
			              						imageURL = '/contextPath/Course/'+data.courseInfoModels[i]['logoId']+'/stamp.jpg';
			              					}		
				                	      var liwidth;
				                	      var imagesize = 'width-50';
				                	      var statusflag;
				                	      if(!loadFlagType.isOnebyOneView){
				                	    	  liwidth = 'width-80-imp';
				                	    	  statusflag = 'courseShortInfoClass-imagesize50';
				                	      }else{
				                	    	  imagesize = 'dashboard-1x1icons';
				                	      }

				                			 htmlTemplate += '<div><li class="'+liwidth+'"><div class="cursor-hand width-70 text-center inline-block popoverGroupShortInfoClass"><div  id="groupLiId'+data.courseInfoModels[i]['courseId']+'" class="'+statusflag+' courseShortInfoClass"'
														+'status="'+data.courseInfoModels[i]['courseStatus']+'"'+ 'courseName="'+data.courseInfoModels[i]['name']+'" groupLogo="'+imageURL+'" uniqueIdentifier="'+data.courseInfoModels[i]['courseUniqueIdentifier']+'"'
														+ 'groupId="'+data.courseInfoModels[i]['courseId']+'">'
														+ '<img src="'+imageURL+'" class="'+imagesize+' courseShortInfoClassImage" uniqueIdentifier="'+data.courseInfoModels[i]['courseUniqueIdentifier']+'" >'
														+ '<div class="courseShortInfoClassTitle font-10px helvetica-neue-roman pad-tb-3 width-72" data-tooltip-toggle="tooltip" title="'+data.courseInfoModels[i]['name']+'" href="/opencourse" >'+modifiedGroupName+'</div></div></div></li></div>';								
											
											 
				                		  if(i==8 && loadFlagType.isOnebyOneView){//only for one by one view
				                			  break;
				                		  }
									}
									
									htmlTemplate += '</ul></div>';	
			                	  if(loadFlagType.isOnebyOneView){
					                	  if(groupCount > 0){
						                	  htmlTemplate+="<div class='font-10px position-relative bot-4 left-28  height-20'><span class='helvetica-neue-roman'>Total </span><a href='javascript:void(0);' class='lightblue pad-left-5' id='myCoursesTotalCountID'>(" +groupCount+")</a></div>";
						                	  }
//					                	  else if(groupCount > 9){
//						                	  htmlTemplate+="<div class='font-12 position-relative bot-8 left-20 height-20'>Total <a href='javascript:void(0);' id='myGroupsTotalCountID'>" +groupCount+"</a></div>";
//						                	  }
					                }							
								}else{
									if(createCourseBusinessValidation($(currentUserAccountType).val())){
										htmlTemplate += '<div class="text-align-center default-message-style"></br></br></br></br> <img src="'+contextPath+'/static/pictures/Help.png"></br></br><a href="javascript:void(0);" id="addNewCourseID">Add</a></div>';
									}else{
										htmlTemplate += '<div class="text-align-center default-message-style"></br></br></br></br> <img src="'+contextPath+'/static/pictures/Help.png"></br></br><a href="javascript:void(0);" id="searchCourseID">Add</a></div>';
									}
									
								}
								//div = Mustache.to_html(htmlTemplate,data);
								
								div = htmlTemplate;
		                	  
		            	  }else if(loadFlagType.newCourseServiceInvocation){
		            		  needrefreshcourses=true;
		            		  doAjax.displaySuccessMessage("Course Added Successfully");
		            		  $('#add-course').modal('hide');
		            		  return;//nothing to append 
		            	  }else if(loadFlagType.isMyCourseReceivedInvitaions){
		                	  var htmlTemplate = HTML.myCourseReceivedInvitations();
		                	  div = Mustache.to_html(htmlTemplate,data);		            		  
		            	  }
							$(element).empty();
							$(element).append( div );	
							
							mycourses.bindEvents();
					}else{
						doAjax.displayErrorMessages(data);
					}

              },
              beforeSendCallBack:function(jqXHR,settings){
            	  $("#processingSymbol").show();
              },
              completeCallBack:function(jqXHR,textStatus){
            	  $("#processingSymbol").hide(); 
            	  if(needrefreshcourses){
            		  $('.modal-backdrop.fade.in').remove();
            		  var myCourseFlag={
				  				isMyCourses:true,
				  				baseElementMyCourses:"#baseElementMyCourses"
				  		};
				   		//mycourses.init(myCourseFlag);
            	  }
              },
              errorCallBack:function(request,status,error){
                     
              },
              failureCallBack:function(data){
            	  $("#displayGroupMembers").html('');
            	  $("#emptySearchResult").show();
            	  $("#processingSymbolMore").hide();
              },
            
             /**
              *  bind operations performed on UI
              */
              bindEvents:function(){
            	  
              	  $("#addNewCourseID").off("click").bind("click",function(e) {
      				//Below requires when view not in (2x2) view.
      				$("#minimize_maximize_myCourse_22").trigger('click',{action:'newCourse'});
      				//isPlusToActivateMyGroups = true;
					  $("#hideMenuForMyCourse").removeClass('hide');
      			});
              	  
              	 $("#searchCourseID").off("click").bind("click",function(e) {
       				//Below requires when view not in (2x2) view.
       				$("#minimize_maximize_myCourse_22").trigger('click');
       				//isPlusToActivateMyGroups = true;
 					  $("#hideMenuForMyCourse").removeClass('hide');
       			});
            	  
         		 $("#myCoursesTotalCountID").off("click").bind("click",function(e) {
     	 			$('#minimize_maximize_myCourse_22').trigger('click');
         		 });
            	  
            	  
         		   $(".courseShortInfoClassTitle").off("click").bind("click",function(e){
           			 
        				//  $('.courseShortInfoClass').not($(this)).popover('destroy');          		
             			  var uniqueIdentifier = $(this).parent().attr('uniqueIdentifier');         		  
                	 	  window.location.href = contextPath+'/course/'+uniqueIdentifier ;
                		  	 		 
                		});
                		
                		 
               	  $(".courseShortInfoClassImage").popover('destroy');//added for the popover remains when widget size changed with this line it closes when widget resized
        			 $(".courseShortInfoClassImage").off("click").bind("click",function(e){
        			 
        			 
        			 //	alert(" course short info click" );
        				 $('.courseShortInfoClass').not($(this)).popover('destroy');
                		  var groupLogo = $(this).parent().attr('groupLogo');
                		  var groupId = $(this).parent().attr('groupId');
                		  var groupName = $(this).parent().attr('courseName');
                		  var uniqueIdentifier = $(this).parent().attr('uniqueIdentifier');
                		  var userRole= 'Owner';//TODO need to get these details from service
                		  
                	//	  	window.location.href = contextPath+'/course/'+uniqueIdentifier ;
                		  	
                		  var htmlTemplate ='<div class="classforRemoving" id="shortProfileDivID'+groupId+'"><span class="pull-right">';
                		  
                		  htmlTemplate+='<a class="closePopover" onclick="javascript:mycourses.closePopover(this);"><i class="mar-right-5-minus close-sm-icons selected-sm memebr-fv-remove cursor-hand top-right-4-8" containerId="'+groupId+'" id="remove-short-profile-'+groupId+'"></i></a> </span>';  
                		  htmlTemplate+='<div class="connection-popover-holder margin-7-minus">';
                		  htmlTemplate+='<div class="">' 
              						+'      <div class="float-left">'
              						+ '<img src="'+groupLogo+'" class="my-groups-image mar-left-8-minus">'
              						+'      </div>'
              						+'      <div class="pad-top-10">'
              						+'          <a href="'+contextPath+'/course/'+uniqueIdentifier+'/""><div class="element-font-15 mar-left-80 memberLinkTitle" title="'+groupName+'">'+groupName+'</div>&nbsp;&nbsp;';
                		  

                		  
                		  htmlTemplate+='</a></div>'
              						+'	</div>'
                              +'</div></div><div class="height-300 mar-left-75"></div>';
                		 if(userRole == 'Administrator' || userRole == 'Owner'){
                			htmlTemplate+='<div class="mar-left-15-minus pad-top-12">'
     						+'	<div class=" display-inline pull-right text-center font-11 mar-right-15-minus"><i class="gear-sm-icons disabled-sm vertical-align-middle"></i></div>'
     						+'</div>';
                		 }

     					
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
                      	$(this).popover('toggle');
                      	$('.closePopover').off('click').click(function(){
                      		 $('.courseShortInfoClass').popover('destroy');
                      	});
     				}); 
     			 
     			 
     			 
            	  
        	    	/*To show view option for calendar */
    	      	  $("#showOptionsmyCourseID").off('click').click(function(){
    	    		  
    	      		$("#removeHidemyCourseOptionsID").removeClass('hide');
    	    		  
    	    	  });	            	  
            	  
            	  $("#myCoursesHyperLinkID").off('click').click(function(){
            		  $("#MyCoursesTitleID").html("My Courses");
               		var flag={
              				isMyCourses:true,
              				isTwobyTwoView:true,
              				baseElementMyCourses:"#baseElementMyCourses"
              		};
               		mycourses.init(flag);
            		  
            	  });
            	  
            	  $("#myCoursesPendingRequestsHyperLinkID").off('click').click(function(){
            		  $("#MyCoursesTitleID").html("Pending Requests");
                 		var flag={
                 				isMyCoursePendingRequest:true,
                 				baseElementMyCourses:"#baseElementMyCourses"
                		};
                 		mycourses.init(flag);
              		  
              	  });
            	  
            	  $("#newCourseHyperLinkID").off("click").bind("click",function(e){

            		  if($('#baseElementMyCourses').data('xiim-createcourse')!=undefined){
            			  $('#baseElementMyCourses').createcourse('destroy');
            		  }
					  $('#myCourseMenuToggle').attr('data-toggle','dropdown');
					  $("#hideMenuForMyCourse").removeClass('hide');
					  $('#myCourseFilterIconID').removeClass('disabled-sm');
            		  var aftercoursecreate=function(data){
            			  $('#myCoursesHyperLinkID').trigger('click');
            		  }//passing an function as option to call after course create
            		  
            			  $('#baseElementMyCourses').createcourse({
            				  		  onCourseCreationSucces:aftercoursecreate,
            						  onCancel:aftercoursecreate
            						  });
            		  
            		/*
            		  $("#courseNameInputID").val("");
               		var flag={
             				newCourses:true,
             				baseElementMyCourses:"#baseElementMyCourses"
            		};
             		mycourses.init(flag);
             		
            	  */
            		$('#courseName').focus();	  
            	  });
            	  
            	  $("#myCoursesReceivedInvitationsHyperLinkID").off('click').click(function(){
            		  $("#MyCoursesTitleID").html("Received Invitations");
                 		var flag={
                 				isMyCourseReceivedInvitaions:true,
                 				baseElementMyCourses:"#baseElementMyCourses"
                		};
                 		mycourses.init(flag);
              	  }); 
            	  
            	  $("#addCourseButtonID").off("click").bind("click",function(){
            		  var courseName = $("#courseNameInputID").val();
            		  //("--coursName:::"+courseName);
                 		var flag={
                 				newCourseServiceInvocation:true,
                 				courseName:courseName,
                 				baseElementMyCourses:"#baseElementMyCourses"
                		};
                 		mycourses.init(flag);
              	  });  
            	  
            	 
            	  
              },

          	closePopover:function(e){
					$(".courseShortInfoClassImage").popover('destroy');
          	},
          	
              staticUI:function(flag){
            	  if(flag.newCourses){
            		  var div='';
            		  var htmlTemplate = HTML.newCourse();
                	  div = Mustache.to_html(htmlTemplate);
                	  $(element).append( div ); 
                	  var optionsForModel ={
                			  backdrop:'static',
                      		show:true,
                      		keyboard:true
                      	  };
                      	  
                      	  $('#add-course').modal(optionsForModel);
                      	  $('#add-course').on('shown.bs.modal',function(e){
                      		  //alert('modal is shown');
                      	  });
                      	  $('#add-course').on('hidden.bs.modal',function(e){
                      		  //alert('modal is hidden');
                      	  });
            		  
            	  }
            	  
              },
              displayCourse:function(obj,typeClass){//TODO need to delete this function once UI is stable
            	  //TODO remove below line once done with all html implementation
            	  /*<li><img src="images/history.png"/><span class="count-circle bottom-33">10</span><div class="pad-tb-10">History</div></li>*/
            	  
            	 var myCourseLi = '<li>';
         		 var imgDiv = '<img src="'+contextPath+'/static/pictures/defaultimages/french.png">';
         	     var courseName='';
         	     if(obj['courseName'].length > 15){
         	    	 courseName = obj['courseName'].substring(0, 10)+'...';
         	     }else{
         	    	 courseName =  obj['courseName'];
         	     }
         	     
         	     var coursePublisher = '';
         	     if(obj['coursePublisher'].length > 10){
         	    	 coursePublisher = obj['coursePublisher'].substring(0, 8)+'...';
         	    	 //TODO for now published course name and un published courses are showing at same place.
         	    	//courseName = coursePublisher;
         	     }else{
         	    	 coursePublisher =  obj['coursePublisher'];
         	    	 //TODO for now published course name and un published courses are showing at same place.
         	    	//courseName = coursePublisher;
         	     }
         	     
         	     
         	     
         	    var courseNameDiv = '<div class="">'+courseName+'</div>';
         	     
         	   myCourseLi = myCourseLi + imgDiv +courseNameDiv;
         	     
         	  myCourseLi += '</li>';
         		
         	 return '<a href="'+contextPath+'/courses/'+obj['courseUniqueIdentifier']+'">'+myCourseLi+'</a>';
         		 
         	
              }

       };
}.call(this);


//to check whether user have basic account type permission or not
function createCourseBusinessValidation(accountType){
	if(accountType == '2' || accountType == '5' ){
		return false;
	}else{
		return true;
	}
}