**
 * @author Next Sphere Technologies
 * MyCources widget
 */
(function ($, undefined) {
    'use strict';
    var _super = $.Widget.prototype;
    $.widget('xiim.myCourses', {
        version: '1.0.0',
        options: {
            accessToken : $("#accessToken_meta").val(),
            langId : $("#langId_meta").val(),
            userId : $("#loggedInUserId-meta").val()
        },
        URI:{
            mycourses:getModelObject('serviceUrl')+'/course/1.0/getMyCourses',
            getCoursePopupInformation:getModelObject('serviceUrl')+'/course/1.0/getCoursePopupInformation',
            
            getReceivedInvitation:getModelObject('serviceUrl')+'/course/1.0/getReceivedInvitations',
            searchCourse:getModelObject('serviceUrl')+'/course/1.0/searchCourse',
            getSentInvitation:getModelObject('serviceUrl')+'/course/1.0/getSentInvitations',
            getAllPendingRequest:getModelObject('serviceUrl')+'/course/1.0/getAllCoursePendingRequest',
            sendRequestToJoinCourse:getModelObject('serviceUrl')+'/course/1.0/sendRequestToJoinCourse',
            manageSendRequest:getModelObject('serviceUrl')+'/course/1.0/manageSendRequest',
            manageReceivedInvitation:getModelObject('serviceUrl')+'/course/1.0/manageReceivedInvitation',
            managePendingRequest:getModelObject('serviceUrl')+'/course/1.0/managePendingRequest',
            assertFollowness:getModelObject('serviceUrl')+'/feed/1.0/assertFollowness',
        },
        selectors:{
            mycourseIcon:'.mycourseIcon',
            showOptionsmyCourseID:'#showOptionsmyCourseID',
            searchcourseText:'#searchcourseText',
            courseTotalCountID:'#courseTotalCountID',
            newCourseHyperLinkID:'#newCourseHyperLinkID',
            myCoursesHyperLinkID:'#myCoursesHyperLinkID',
            authoredCoursesHyperLinkID:'#authoredCoursesHyperLinkID',
            noCoursesId:'#noCoursesId',
            ongoingcourses:'#ongoingcourses',
            coursesearchtoggle:'#coursesearchtoggle',
            gotoCourseShell:'#gotoCourseShell',

            receivedInvitationCoursesHyperLinkID:'#receivedInvitationCoursesHyperLinkID',
            sentRequestCoursesHyperLinkID:'#sentRequestCoursesHyperLinkID',
            managedCoursesHyperLinkID:'#managedCoursesHyperLinkID',
            pastcourses:'#pastcourses',
            authoringongoingcourses:'#authoringongoingcourses',
            authoringpastcourses:'#authoringpastcourses',
            enrollSentRequest:'.enrollSentRequest',
            ignoreSentRequest:'.ignoreSentRequest',
            acceptReceivedRequest:'.acceptReceivedRequest',
            ignoreReceivedRequest:'.ignoreReceivedRequest',
            manageAcceptRequest:'.manageAcceptRequest',
            manageIgnoreRequest:'.manageIgnoreRequest',
        },
        templates:{},
        load_templates:function(){
          this.templates.oneByone =$('#myCoursesOneByone').html();
          this.templates.coursepopover =$('#coursepopover').html();
          this.templates.courseSearchEnroll =$('#courseSearchEnroll').html();
          this.templates.twoBytwo =$('#twoBytwo').html();

          this.templates.courseSentRerequest =$('#courseSentRerequest').html();
          this.templates.pendingInvitations =$('#pendingInvitations').html();
        },
        _onetimeEvents:function(){
            this.element.on('click', this.selectors.mycourseIcon,this._evtHandlers().mycourseIcon);
            this.element.on('click', this.selectors.showOptionsmyCourseID,this._evtHandlers().showOptionsmyCourseID);
            this.element.on('click', this.selectors.courseTotalCountID,this._evtHandlers().courseTotalCountID);
            this.element.on('keyup', this.selectors.searchcourseText,this._evtHandlers().searchcourseTextKeyUp);
            this.element.on('click', this.selectors.newCourseHyperLinkID,this._evtHandlers().newCourseHyperLinkID);
            this.element.on('click', this.selectors.myCoursesHyperLinkID,this._evtHandlers().myCoursesHyperLinkID);
           	this.element.on('click', this.selectors.authoredCoursesHyperLinkID,this._evtHandlers().authoredCoursesHyperLinkID);
            this.element.on('click', this.selectors.noCoursesId,this._evtHandlers().noCoursesId);
            
            this.element.on('click', this.selectors.receivedInvitationCoursesHyperLinkID,this._evtHandlers().receivedInvitations);
            this.element.on('click', this.selectors.sentRequestCoursesHyperLinkID,this._evtHandlers().sentRequests);
            this.element.on('click', this.selectors.managedCoursesHyperLinkID,this._evtHandlers().pendingInvitations);
            this.element.on('click', this.selectors.pastcourses,this._evtHandlers().pastcourses);
            this.element.on('click', this.selectors.ongoingcourses,this._evtHandlers().ongoingcourses);
            this.element.on('click', this.selectors.enrollSentRequest,this._evtHandlers().enrollSentRequest);
            this.element.on('click', this.selectors.coursesearchtoggle,this._evtHandlers().coursesearchtoggle);
            this.element.on('click', this.selectors.ignoreSentRequest,this._evtHandlers().ignoreSentRequest);
            this.element.on('click', this.selectors.gotoCourseShell,this._evtHandlers().gotoCourseShell);
            this.element.on('click', this.selectors.authoringongoingcourses,this._evtHandlers().authoringongoingcourses);
            this.element.on('click', this.selectors.authoringpastcourses,this._evtHandlers().authoringpastcourses);
            this.element.on('click', this.selectors.acceptReceivedRequest,this._evtHandlers().acceptReceivedRequest);
            this.element.on('click', this.selectors.ignoreReceivedRequest,this._evtHandlers().ignoreReceivedRequest);
            this.element.on('click', this.selectors.manageAcceptRequest,this._evtHandlers().manageAcceptRequest);
            this.element.on('click', this.selectors.manageIgnoreRequest,this._evtHandlers().manageIgnoreRequest);
        },
        _create: function () {
            this.load_templates();
            this._onetimeEvents();
            this._service().getMyCourses(true,this._service().generatePageCriteria(0,9,false),this._domUtil().renderWidget);
            this.isEducator=$('#currentUserAccountType').val()!=2&&$('#currentUserAccountType').val()!=5;
        },
        shifttoTwobyTwo:function(type){
            var widget=this;
            if(widget.isEducator){
                $('.newCourseBusinessRule').removeClass('hide');
            }
            if(type == undefined){
            	type = widget.isEducator==true?'authorCourse':'enrollCourse';
            }
            if(type == 'newCourse'){
            	$('#newCourseHyperLinkID').trigger('click');
            }else if(type == 'authorCourse'){
            	this._service().getMyCourses(true,this._service().generatePageCriteria(0,0,true),function(data){widget._domUtil().authoringTwobyTwoOngoing(data);},'AUTHORING_ONGOING');
            }else if(type == 'searchCourse'){
            	this._service().getMyCourses(true,this._service().generatePageCriteria(0,0,true),function(data){widget._domUtil().enrolledTwobyTwoOngoing(data,true);},'ENROLLED_ONGOING');
            }else if(type == 'received'){
            	widget._service().getReceivedInvitations(widget._service().generatePageCriteria(0,9,false),widget._domUtil().renderCourseReceivedRequest);
            }else{
            	this._service().getMyCourses(true,this._service().generatePageCriteria(0,0,true),function(data){widget._domUtil().enrolledTwobyTwoOngoing(data,false);},'ENROLLED_ONGOING');
            }
            var xiimcustomScrollbarOptions = {elementid:"#mycoursestwobytwoContainer",isUpdateOnContentResize:true,setHeight:"442",vertical:'y'};
            xiimcustomScrollbar(xiimcustomScrollbarOptions);
        },
        shifttoOneByOne:function(opts){
            this._service().getMyCourses(true,this._service().generatePageCriteria(0,9,false),this._domUtil().renderWidget);
        },
        _service:function(){
            var widget=this;
          return {
              getMyCourses:function(isForOnebyOne,pageCriteria,successCallback,filterFlag){
                  var options={
                      url:widget.URI.mycourses+'?pageCriteria='+encodeURIComponent(JSON.stringify(pageCriteria))+"&courseAssociationFilter="+(filterFlag?filterFlag:'ALL'),
                      headers : widget._service().getHeaders(),
                      async:true,
                      successCallBack :successCallback
                  };
                  doAjax.GetServiceHeaderInvocation(options);
              },
              searchCourse:function(pageCriteria,courseSearchAttribute,successCallback){
                  var options={
                      url:widget.URI.searchCourse+'?pageCriteria='+encodeURIComponent(JSON.stringify(pageCriteria))+"&courseSearchAttribute="+encodeURIComponent(courseSearchAttribute),
                      headers : widget._service().getHeaders(),
                      async:true,
                      successCallBack :successCallback
                  };
                  doAjax.GetServiceHeaderInvocation(options);
              },
              getCoursePopupInformation:function(successCallback,courseUniqueIdentifier){
                  var options={
                      url:widget.URI.getCoursePopupInformation+"?courseUniqueIdentifier="+courseUniqueIdentifier,
                      headers : widget._service().getHeaders(),
                      async:true,
                      successCallBack :successCallback
                  };
                  doAjax.GetServiceHeaderInvocation(options);
              },
              generatePageCriteria:function(pageNum,pageSize,isAll){
                  return {"pageSize":pageSize,"pageNo":pageNum,"isAll":isAll?true:false};
              },
              getHeaders:function(){
                  return {accessToken:widget.options.accessToken,langId:widget.options.langId};
              },
              getSentInvitations:function(pageCriteria,successCallback){
            	  var options={
                          url:widget.URI.getSentInvitation+'?pageCriteria='+encodeURIComponent(JSON.stringify(pageCriteria)),
                          headers : widget._service().getHeaders(),
                          async:true,
                          successCallBack :successCallback
                      };
                  	doAjax.GetServiceHeaderInvocation(options);
              },
              getReceivedInvitations:function(pageCriteria,successCallback){
            	  var options={
                          url:widget.URI.getReceivedInvitation+'?pageCriteria='+encodeURIComponent(JSON.stringify(pageCriteria)),
                          headers : widget._service().getHeaders(),
                          async:true,
                          successCallBack :successCallback
                      };
                  	doAjax.GetServiceHeaderInvocation(options);
              },
              getAllPendingRequests:function(pageCriteria,successCallback){
            	  var options={
                          url:widget.URI.getAllPendingRequest+'?pageCriteria='+encodeURIComponent(JSON.stringify(pageCriteria)),
                          headers : widget._service().getHeaders(),
                          async:true,
                          successCallBack :successCallback
                      };
                  	doAjax.GetServiceHeaderInvocation(options);
              },
              sendRequestToJoinCourse:function(callbackMethod,data){
            	  data=typeof  data=="string"?data:JSON.stringify(data);
                  var options = {
                      url: widget.URI.sendRequestToJoinCourse,
                      successCallBack: function (data) {
                          if (typeof callbackMethod == 'function') {
                              data = typeof data=="string"? $.parseJSON(data):data;
                              var success = data['result'] && data['result']['status'] ? callbackMethod(data) : widget.widgetMessages({data: data});
                          }
                      },
                      async: true,
                      headers:this.getHeaders(),
                      parentId:widget.options.processingSymbolDiv,
                      data: data
                  };
                  doAjax.PostServiceInvocation(options);
              },
              manageSendRequestToJoinCourse:function(callbackMethod,data){
            	  data=typeof  data=="string"?data:JSON.stringify(data);
                  var options = {
                      url: widget.URI.manageSendRequest,
                      successCallBack: function (data) {
                          if (typeof callbackMethod == 'function') {
                              data = typeof data=="string"? $.parseJSON(data):data;
                              var success = data['result'] && data['result']['status'] ? callbackMethod(data) : widget.widgetMessages({data: data});
                          }
                      },
                      async: true,
                      headers:this.getHeaders(),
                      parentId:widget.options.processingSymbolDiv,
                      data: data
                  };
                  doAjax.PostServiceInvocation(options);
              },
              manageReceivedInvitation:function(callbackMethod,data){
            	  data=typeof  data=="string"?data:JSON.stringify(data);
                  var options = {
                      url: widget.URI.manageReceivedInvitation,
                      successCallBack: function (data) {
                          if (typeof callbackMethod == 'function') {
                              data = typeof data=="string"? $.parseJSON(data):data;
                              var success = data['result'] && data['result']['status'] ? callbackMethod(data) : widget.widgetMessages({data: data});
                          }
                      },
                      async: true,
                      headers:this.getHeaders(),
                      parentId:widget.options.processingSymbolDiv,
                      data: data
                  };
                  doAjax.PostServiceInvocation(options);
              },
              managePendingRequest:function(callbackMethod,data){
            	  data=typeof  data=="string"?data:JSON.stringify(data);
                  var options = {
                      url: widget.URI.managePendingRequest,
                      successCallBack: function (data) {
                          if (typeof callbackMethod == 'function') {
                              data = typeof data=="string"? $.parseJSON(data):data;
                              var success = data['result'] && data['result']['status'] ? callbackMethod(data) : widget.widgetMessages({data: data});
                          }
                      },
                      async: true,
                      headers:this.getHeaders(),
                      parentId:widget.options.processingSymbolDiv,
                      data: data
                  };
                  doAjax.PostServiceInvocation(options);
              },
              updateNotificationCount:function(){
            	  var options={
            				url: contextPath+'/feeds/updateAlertCounts?notificationType=3',
            				data:{},
            				failureCallBack:function(data){
            				},
            				successCallBack:function(data){
            					var data=JSON.parse(data);
            				},
            				async:true
            		};
            		doAjax.ControllerInvocation(options);
              },
              assertFollowness:function(callbackMethod,data){
            	  data=typeof  data=="string"?data:JSON.stringify(data);
                  var options = {
                      url: widget.URI.assertFollowness,
                      data: data,
                      async: true,
                      successCallBack: function (data) {
                          if (typeof callbackMethod == 'function') {
                              data = typeof data=="string"? $.parseJSON(data):data;
                              var success = data['result'] && data['result']['status'] ? callbackMethod(data) : widget.widgetMessages({data: data});
                          }
                      },
                      parentId:widget.options.processingSymbolDiv
                  };
                  doAjax.PutServiceInvocation(options);
              }
          };
        },
        _domUtil:function(){
            var widget=this;
            return{
                renderWidget:function(data){
                    $('#shortProfileDivIDCourse').closest('.popover').remove();
                    data=mustacheDataUtil(data);
                    data.isEducator=widget.isEducator;
                    $('#baseElementMyCourses').html(Mustache.to_html(widget.templates.oneByone,data));
                },
                searchNewCourse:function(data){
                	if(data['courseSearchModelList'] != undefined){
                		data.courseSearchModelList=(data['courseSearchModelList'].length==undefined)?[data['courseSearchModelList']]:data['courseSearchModelList'];
                		for(var i=0;i<data.courseSearchModelList.length;i++){
                			data.courseSearchModelList[i]['hasAuthors']=(data.courseSearchModelList[i].authorList!=undefined)&&(data.courseSearchModelList[i].authorList.length>0);
                            if(undefined != data.courseSearchModelList[i]['startDate']){
                                data.courseSearchModelList[i]['startDate'] = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.courseSearchModelList[i]['startDate']),'MMM dd,yyyy');
                            }
                        }
                	}
                    data=mustacheDataUtil(data);
                    $('#mycoursestwobytwoContainer').html(Mustache.to_html(widget.templates.courseSearchEnroll,data));
                    var xiimcustomScrollbarOptions = {elementid:"#searchCourseScroll" ,setHeight:"435",vertical:'y'};
                    xiimcustomScrollbar(xiimcustomScrollbarOptions);
                },
                enrolledTwobyTwoOngoing:function(data,isGotoSearch){
                    data=mustacheDataUtil(data);
                    $('#shortProfileDivIDCourse').closest('.popover').remove();
                    data.isLearner=true;
                    data.placeHolder='Search Enrolled Ongoing Courses';
                    $('#baseElementMyCourses').html(Mustache.to_html(widget.templates.twoBytwo,data));
                    $('#ongoingcourses').addClass('active');
                    if(isGotoSearch){
                        $('#coursesearchtoggle').trigger('click');
                        $('#searchcourseText').focus();
                    }
                    var xiimcustomScrollbarOptions = {elementid:"#mycoursestwobytwoContainer",isUpdateOnContentResize:true,setHeight:"442",vertical:'y'};
                    xiimcustomScrollbar(xiimcustomScrollbarOptions);
                },
                enrolledTwobyTwoPast:function(data){
                    data=mustacheDataUtil(data);
                    $('#shortProfileDivIDCourse').closest('.popover').remove();
                    data.isLearner=true;
                    data.placeHolder='Search Enrolled Past Courses';
                    $('#baseElementMyCourses').html(Mustache.to_html(widget.templates.twoBytwo,data));
                    $('#pastcourses').addClass('active');
                    var xiimcustomScrollbarOptions = {elementid:"#mycoursestwobytwoContainer",isUpdateOnContentResize:true,setHeight:"442",vertical:'y'};
                    xiimcustomScrollbar(xiimcustomScrollbarOptions);
                },
                authoringTwobyTwoOngoing:function(data){
                    data=mustacheDataUtil(data);
                    $('#shortProfileDivIDCourse').closest('.popover').remove();
                    data.placeHolder='Search Authoring Ongoing Courses';
                    $('#baseElementMyCourses').html(Mustache.to_html(widget.templates.twoBytwo,data));
                    $('#authoringongoingcourses').addClass('active');
                    var xiimcustomScrollbarOptions = {elementid:"#mycoursestwobytwoContainer",isUpdateOnContentResize:true,setHeight:"442",vertical:'y'};
                    xiimcustomScrollbar(xiimcustomScrollbarOptions);
                },
                authoringTwobyTwoPast:function(data){
                    data=mustacheDataUtil(data);
                    $('#shortProfileDivIDCourse').closest('.popover').remove();
                    data.placeHolder='Search Authoring Past Courses';
                    $('#baseElementMyCourses').html(Mustache.to_html(widget.templates.twoBytwo,data));
                    $('#authoringpastcourses').addClass('active');
                    var xiimcustomScrollbarOptions = {elementid:"#mycoursestwobytwoContainer",isUpdateOnContentResize:true,setHeight:"442",vertical:'y'};
                    xiimcustomScrollbar(xiimcustomScrollbarOptions);
                },
                renderCourseSentRequest:function(data){
   			 		data=mustacheDataUtil(data);
   			 		if(data['courseInfoList'] != undefined){
   			 			data.courseInfoList=(data['courseInfoList'].length==undefined)?[data['courseInfoList']]:data['courseInfoList'];
   			 			for(var i=0;i<data.courseInfoList.length;i++){
   			 				if(undefined != data.courseInfoList[i]['requestedDate']){
   			 					data.courseInfoList[i]['requestedDate'] = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.courseInfoList[i]['requestedDate']),'hh:mm a MMM.dd');                			
   			 				}
   			 				if(undefined != data.courseInfoList[i]['startDate']){
   			 					data.courseInfoList[i]['startDate'] = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.courseInfoList[i]['startDate']),'MMM dd,yyyy');                			
   			 				}
   			 			}
   			 		}
   			 		data.isSent=true;
                	$('#baseElementMyCourses').html(Mustache.to_html(widget.templates.courseSentRerequest,data));
   			 		var xiimcustomScrollbarOptions = {elementid:'#sentRequestScoll',isUpdateOnContentResize:true,setHeight:'475px',vertical:'y'};
   			 		xiimcustomScrollbar(xiimcustomScrollbarOptions);
                },
                renderCourseReceivedRequest:function(data){
   			 		data=mustacheDataUtil(data);
   			 		if(data['courseInfoList'] != undefined){
   			 			data.courseInfoList=(data['courseInfoList'].length==undefined)?[data['courseInfoList']]:data['courseInfoList'];
   			 			for(var i=0;i<data.courseInfoList.length;i++){
   			 				if(undefined != data.courseInfoList[i]['requestedDate']){
   			 					data.courseInfoList[i]['requestedDate'] = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.courseInfoList[i]['requestedDate']),'hh:mm a MMM.dd');                			
   			 				}
   			 				if(undefined != data.courseInfoList[i]['startDate']){
   			 					data.courseInfoList[i]['startDate'] = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.courseInfoList[i]['startDate']),'MMM dd,yyyy');                			
   			 				}
   			 			}
   			 		}
   			 		data.isReceived=true;
                	$('#baseElementMyCourses').html(Mustache.to_html(widget.templates.courseSentRerequest,data));
   			 		var xiimcustomScrollbarOptions = {elementid:'#sentRequestScoll',isUpdateOnContentResize:true,setHeight:'475px',vertical:'y'};
   			 		xiimcustomScrollbar(xiimcustomScrollbarOptions);
   			 		
   			 		//update notification count
   			 		if($("#courseRequestCount:visible").length > 0){
   			 			widget._service().updateNotificationCount();
   			 			$("#courseRequestCount").addClass('hide');
   			 		}
                },
                pendingInvitations:function(data){
   			 		data=mustacheDataUtil(data);
   			 		if(data['courseInfoModelList'] != undefined){
   			 			data.courseInfoList=(data['courseInfoModelList'].length==undefined)?[data['courseInfoModelList']]:data['courseInfoModelList'];
   			 			for(var i=0;i<data.courseInfoList.length;i++){
   			 				data.courseInfoList[i].authorList=(data['courseInfoList'][i]['authorList'].length==undefined)?[data['courseInfoList'][i]['authorList']]:data['courseInfoList'][i]['authorList'];
   			 				for(var j=0;j<data.courseInfoList[i]['authorList'].length;j++){
   			 					if(undefined != data.courseInfoList[i].authorList[j]['joinedOn']){
   			 						data.courseInfoList[i].authorList[j]['joinedOn'] = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.courseInfoList[i].authorList[j]['joinedOn']),'hh:mm a MMM.dd');                			
   			 					}
   			 				}
   			 			}
   			 		}
                	$('#baseElementMyCourses').html(Mustache.to_html(widget.templates.pendingInvitations,data));
   			 		var xiimcustomScrollbarOptions = {elementid:'#pendingRequestScroll',isUpdateOnContentResize:true,setHeight:'505px',vertical:'y'};
   			 		xiimcustomScrollbar(xiimcustomScrollbarOptions);
                },
            };
        },
        _evtHandlers:function(){
            
            var widget=this;
            return{
                mycourseIcon:function(e){
                	closePopups();
                    if($(e.target).is('[aria-describedby]')){
                        $(e.target).popover('destroy');
                        return;
                    }
                    var $course=$(e.target).closest('.courselistitem');
                    widget._service().getCoursePopupInformation(function(data){
                    	data=mustacheDataUtil(data);
                    	data.actionType=data.courseInfoModel.isFollow=="true"?"UNFOLLOW":"FOLLOW";
                    	data.courseInfoModel.isFollow=(data.courseInfoModel.isFollow=="true")?true:false;
                    	
                        data.courseInfoModel.courseLogo=data.courseInfoModel.logoId?'/contextPath/Course/'+data.courseInfoModel.logoId+'/stamp.jpg':(contextPath+'/static/pictures/defaultimages/french.png');
                        data.courseInfoModel.isAdmin=data.courseInfoModel.isAdmin+''=='true';
                        $('.mycourseIcon').popover('destroy');
                        $('#shortProfileDivID').remove();
                        $(e.target).popover({
                            'html' : true,
                            placement: 'right',
                            container: 'body',
                            viewport:{selector:'.gridster',padding:10},
                            trigger:'none',
                            content:Mustache.to_html(widget.templates.coursepopover,data),
                        }).on("show.bs.popover", function(){
                            $(this).data("bs.popover").tip().css({"min-width": "270px","min-height":"300px","padding":"12px"});
                        }).on("shown.bs.popover", function(){
                            $('.remove-coursepopover').click(function(){
                                $('.mycourseIcon[aria-describedby]').popover('destroy');
                            });
                            $('.coursefollowUnfollow').click(function(e){
                            	 var $node=$(e.target).closest('.assertFollowness');
                            	 var actionType = $node.data('actiontype');
                            	 
                            	 var json={
                            			 resourceType:'COURSE',
                            			 resourceId:$node.data('uniqueidentifier'),
                                         accessToken:widget.options.accessToken,
                                         actionType:actionType,
                                         langId :langId ,
                    			 	};
                            	 widget._service().assertFollowness(function(data){
                            		 if(actionType == "FOLLOW"){
                            			 $('.changeFollowNess').html("UnFollow");
                            			 $('.changeiconFollowNess').addClass('unfollowers-sm-icons').removeClass('followers-sm-icons');
                            			 $('.assertFollowness').data('actiontype',"UNFOLLOW");
                            		 }else{
                            			 $('.changeFollowNess').html("Follow");
                            			 $('.changeiconFollowNess').removeClass('unfollowers-sm-icons').addClass('followers-sm-icons');
                            			 $('.assertFollowness').data('actiontype',"FOLLOW");
                            		 }
                            	 },JSON.stringify(json));
                            });
                        }).popover('show');
                    },$course.attr('courseuniqueidentifier'));
                },
                showOptionsmyCourseID:function(e){
                    $("#removeHidemyCourseOptionsID").toggleClass('hide');
                },
                gotoCourseShell:function(e){

                },
                searchcourseTextKeyUp:function(e){
                    var text = $.trim($(e.target).val().toLowerCase() );
                    if(!$('#coursesearchtoggle').length!=0||$('#coursesearchid').hasClass('selected-sm')){
                        if(text.length>0){
                                var $li = $('.courselistitem');
                                $li.filter(':containsIN(' + text + ')').removeClass('hide');
                                $li.not(':containsIN(' + text + ')').addClass('hide');
                                
                                if($li.filter(':containsIN(' + text + ')').size() < 1){
                                	$('#courseListValues').removeClass('hide');
                                }else{
                                	$('#courseListValues').addClass('hide');
                                }
                        }else{
                            $('.courselistitem').removeClass('hide');
                            $('#courseListValues').addClass('hide');
                        }
                    }else{
                        if(text.length>0&&(e.which==13||e.keyCode==13)){
                           widget._service().searchCourse(widget._service().generatePageCriteria(0,20,false), text,widget._domUtil().searchNewCourse);
                        }else{
                            if(text.length==0){
                                $('#mycoursestwobytwoContainer').empty();
                            }
                        }
                    }

                },
                coursesearchtoggle:function(e){
                        $(e.target).addClass('selected-sm');
                        $('#coursesearchid').removeClass('selected-sm');
                        $('#mycoursestwobytwoContainer').empty();
                        $('#searchcourseText').attr('placeholder','Search new courses').focus();
                        
                        $('.mycourseTabOption').removeClass('active');
                        $('#coursesearchtoggle').addClass('active');
                },
                coursesearchid:function(e){
                    if(!$(e.target).is('.selected-sm')) {
                        $('#ongoingcourses').trigger('click');
                    }else{
                        $(e.target).removeClass('selected-sm');
                        $('#coursesearchtoggle').addClass('selected-sm');
                        $('#searchcourseText').attr('placeholder','Search courses').focus();
                        $('#mycoursestwobytwoContainer').empty();
                    }

                },
                courseTotalCountID:function(e){
                	if(widget.isEducator){
                        $("#minimize_maximize_myCourse_22").trigger('click',{action:'authorCourse'});
                    }else{
                        $("#minimize_maximize_myCourse_22").trigger('click',{action:'enrollCourse'});
                    }
                },
                noCoursesId:function(e){
                    if(widget.isEducator){
                        $("#minimize_maximize_myCourse_22").trigger('click',{action:'newCourse'});
                    }else{
                        $("#minimize_maximize_myCourse_22").trigger('click',{action:'searchCourse'});
                    }
                },
                myCoursesHyperLinkID:function(e){
                   widget.shifttoTwobyTwo('enrollCourse');
                },
                authoredCoursesHyperLinkID:function(e){
                    widget.shifttoTwobyTwo('authorCourse');
                 },
                pastcourses:function(e){
                    widget._service().getMyCourses(true,widget._service().generatePageCriteria(0,0,true),function(data){widget._domUtil().enrolledTwobyTwoPast(data);},'ENROLLED_PAST');
                },
                ongoingcourses:function(e){
                    widget._service().getMyCourses(true,widget._service().generatePageCriteria(0,0,true),function(data){widget._domUtil().enrolledTwobyTwoOngoing(data);},'ENROLLED_ONGOING');
                },
                authoringongoingcourses:function(e){
                    widget._service().getMyCourses(true,widget._service().generatePageCriteria(0,0,true),function(data){widget._domUtil().authoringTwobyTwoOngoing(data);},'AUTHORING_ONGOING');
                },
                authoringpastcourses:function(e){
                    widget._service().getMyCourses(true,widget._service().generatePageCriteria(0,0,true),function(data){widget._domUtil().authoringTwobyTwoPast(data);},'AUTHORING_PAST');
                },
                newCourseHyperLinkID:function(e){
                    var aftercoursecreate=function(data){
                        if(widget.isEducator){
                            $("#minimize_maximize_myCourse_22").trigger('click',{action:'authorCourse'});
                        }else{
                            $("#minimize_maximize_myCourse_22").trigger('click',{action:'enrollCourse'});
                        }
                    };
                    //passing an function as option to call after course create
                   $('#baseElementMyCourses').unbind().removeData().createcourse({
                        onCourseCreationSucces:aftercoursecreate,
                        onCancel:aftercoursecreate
                    });
                    $('#courseName').focus();
                },
                receivedInvitations:function(e){
                	widget._service().getReceivedInvitations(widget._service().generatePageCriteria(0,9,false),widget._domUtil().renderCourseReceivedRequest);
               },
               pendingInvitations:function(e){
              	 widget._service().getAllPendingRequests(widget._service().generatePageCriteria(0,2,false),widget._domUtil().pendingInvitations);
              },
              sentRequests:function(e){
             	 widget._service().getSentInvitations(widget._service().generatePageCriteria(0,9,false),widget._domUtil().renderCourseSentRequest);
             },
             enrollSentRequest:function(e){
            	 var $node=$(e.target).closest('.sentRequestMember');
            	 var json={
            			 courseUniqueIdentifier:$node.data('uniqueidentifier'),
                         accessToken:widget.options.accessToken,
    			 	};
            	 widget._service().sendRequestToJoinCourse(function(data){
            		 widget.widgetMessages({isSuccess:true,message:'Request Sent Successfully...'});
            	 },JSON.stringify(json));
             },
             ignoreSentRequest:function(e){
            	 var $node=$(e.target).closest('.sentRequestMember');
            	 var json={
            			 courseUniqueIdentifier:$node.data('uniqueidentifier'),
                         accessToken:widget.options.accessToken,
                         requestActionEnum:'IGNORE',
    			 	};
            	 widget._service().manageSendRequestToJoinCourse(function(data){
            		 widget.widgetMessages({isSuccess:true,message:'Request Ignored Successfully...'});
            		 widget._service().getSentInvitations(widget._service().generatePageCriteria(0,9,false),widget._domUtil().renderCourseSentRequest);
            	 },JSON.stringify(json));
             },
             acceptReceivedRequest:function(e){
            	 var $node=$(e.target).closest('.sentRequestMember');
            	 var json={
            			 invitationIdList:$node.data('invitation'),
                         accessToken:widget.options.accessToken,
                         requestActionEnum:'ACCEPT',
    			 	};
            	 widget._service().manageReceivedInvitation(function(data){
            		 widget.widgetMessages({isSuccess:true,message:'Invitation Accepted Successfully...'});
            		 widget._service().getReceivedInvitations(widget._service().generatePageCriteria(0,9,false),widget._domUtil().renderCourseReceivedRequest);
            	 },JSON.stringify(json));
             },
             ignoreReceivedRequest:function(e){
            	 var $node=$(e.target).closest('.sentRequestMember');
            	 var json={
            			 invitationIdList:$node.data('invitation'),
                         accessToken:widget.options.accessToken,
                         requestActionEnum:'DECLINE',
    			 	};
            	 widget._service().manageReceivedInvitation(function(data){
            		 widget.widgetMessages({isSuccess:true,message:'Invitation Ignored Successfully...'});
            		 widget._service().getReceivedInvitations(widget._service().generatePageCriteria(0,9,false),widget._domUtil().renderCourseReceivedRequest);
            	 },JSON.stringify(json));
             },
             manageAcceptRequest:function(e){
            	 var $node=$(e.target).closest('.pendingRequestMember');
            	 var json={
            			 courseUniqueIdentifier:$node.data('uniqueidentifier'),
            			 memberId:$node.data('memberid'),
                         accessToken:widget.options.accessToken,
                         requestActionEnum:'ACCEPT',
    			 	};
            	 widget._service().managePendingRequest(function(data){
            		 widget.widgetMessages({isSuccess:true,message:'Request Accepted Successfully...'});
            		 widget._service().getAllPendingRequests(widget._service().generatePageCriteria(0,2,false),widget._domUtil().pendingInvitations);
            	 },JSON.stringify(json));
             },
             manageIgnoreRequest:function(e){
            	 var $node=$(e.target).closest('.pendingRequestMember');
            	 var json={
            			 courseUniqueIdentifier:$node.data('uniqueidentifier'),
            			 memberId:$node.data('memberid'),
                         accessToken:widget.options.accessToken,
                         requestActionEnum:'DECLINE',
    			 	};
            	 widget._service().managePendingRequest(function(data){
            		 widget.widgetMessages({isSuccess:true,message:'Request Declined Successfully...'});
            		 widget._service().getAllPendingRequests(widget._service().generatePageCriteria(0,9,false),widget._domUtil().pendingInvitations);
            	 },JSON.stringify(json));
             },
            };
        },
        
        closePopups:function(){
	 		 $('.mycourseIcon').popover('destroy');
	 		 $('.groupShortInfoClassImage').popover('destroy');
	    	  $('.connectionShortProfileClassImage').popover('destroy');
		},

        widgetMessages: function (options) {
            if(options.clear){
                $("#responseContentHolder").addClass('hide');
                $("#statusMessagesId").addClass('hide');
                return;
            }
            if (options.isFromController) {
                doAjax.displayControllerErrorMessages(options.data, options.model);
            } else {
                var hasError = !options.isSuccess || false;
                var message = options.message || "Error while Processing your request";
                if (hasError) {
                    $("#responseContent").html(message);
                    $("#responseContentHolder").removeClass('hide');
                    doAjax.displayErrorMessageinDiv(message,'#statusMessagesId');
                    $("#messageStyleDiv").removeClass('alert-success').addClass('alert-danger');
                }else{
                    $('#outlineResponseContentHolder').addClass('hide');
                    doAjax.displaySuccessMessage(message);
                    doAjax.displaySuccessMessageinDiv(message,'#statusMessagesId');
                }
            }
        },
    });
})(jQuery);
