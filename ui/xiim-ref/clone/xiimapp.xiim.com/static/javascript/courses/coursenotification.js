**
 * @author Next Sphere Technologies
 * 
 * Course Notification widget
 * 
 * 
 */
(function ($, undefined) {
	
	 'use strict';
	 
	    var _super = $.Widget.prototype;
	    
$.widget('xiim.coursenotification', {
  version: '1.0.0',
  options: {
	    accessToken : $("#accessToken_meta").val(),
		langId : $("#langId_meta").val(),
		userId : $("#loggedInUserId-meta").val(),
		notificationrenderDiv:'ul',
		template:undefined,
		coursenotificationsCount:'#courseRequestCount',
		templateId:'#courseNotificationDiv',
		startResult : 0,
		endResult : 10,
		scrollBarHeight:'435px',
		viewCourseReceived2x2:'#viewCourseReceived2x2',
		onAcceptingInvitation:undefined
  },

  _create : function () {
	  this._injectDom();
  },
  _destroy : function () {
	  
  },
  _init : function () {
	  this._staticElementEvents();
	  this.element.find(this.options.coursenotificationsCount).addClass('hide');
	  $('#messageNotificationId').closest('li').removeClass('open').find('.message-sm-icons').removeClass('selected-sm');
	  this._serviceCall();
  },
  
  _injectDom : function(){
	  if(this.options.template==undefined)
		  	var data={};
	  	data.contextPath=contextPath;
	  	this.options.template= $(this.options.templateId).html();
	  	$('#courseinvitesList').html(Mustache.to_html(this.options.template, data));
  },
  _staticElementEvents : function(){
	  this.element.parent().find('.courseinvitesList').empty();
  },
  _serviceCall:function(){
	  var widget=this;
	  var options={
				url: contextPath+'/feeds/getFeeds',
				data:{},
				parentId:'#courseinvitesList',
				failureCallBack:function(data){
				},
				successCallBack:function(data){
					var data=JSON.parse(data);
					data.contextPath=contextPath;
					data.limitLengthTwelve=function() {
				        return function(text, render) {
				        	var texF=render(text);
				        	if(texF.length>13)
				            return texF.substr(0,12) + '...';
				        	else
				        		return texF;
				          };
				        };
				        data.limitLengthTwenty=function() {
					        return function(text, render) {
					        	var texF=render(text);
					        	if(texF.length>20)
					            return texF.substr(0,19) + '...';
					        	else
					        		return texF;
					          };
					        };
					        data.jqueryEscape=function() {
						        return function(text, render) {
						        	var texF=render(text);
						            return texF.replace("$","");
						          };
						        };
						        
						
						if(data.courseAlerts){
							var months=["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
							for (var i=0; i < data.courseAlerts.length; i++) { 
								if(data.courseAlerts[i].postedTime){
									var date = new Date(data.courseAlerts[i].postedTime);
									var startDate = months[date.getMonth()]+' '+date.getDate();
									data.courseAlerts[i].startDate = date;
									data.courseAlerts[i].formattedDate = startDate;
								}
							    
							}
							
						}
						data=mustacheDataUtil(data);
					$('#courseinvitesList').html(Mustache.to_html(widget.options.template, data));
					widget._dyanamicElementEvents();
					if(data.courseAlerts!=undefined){
						widget._fetchSusscfullUpdateCount();
					}
				},
				async:true
		};
		doAjax.ControllerInvocation(options);
  },
  _respondInvitation:function(courseUniqueIdentifier,invitationUniqueIdentifier,isInvitationAccepted,id){
	  
	  var requestAction = 'DECLINE';
	  
	  if(isInvitationAccepted){
		  requestAction = 'ACCEPT';
	  }
	  
	  var widget=this;
	  var request={
		  accessToken:widget.options.accessToken,
		  invitationIdList:invitationUniqueIdentifier,
		  requestActionEnum:requestAction,
		  };
	  var options={
			  url : getModelObject('serviceUrl') + '/course/1.0/manageReceivedInvitation',
			  data:JSON.stringify(request),
			  parentId:'#'+id,
			  async:true,
			  successCallBack:function(data){
				
				  if(data.isSuccess=="true"||data.isSuccess==true||data.result.status+''=="true"){
					  $("#"+id).find('.item-rightcontent').remove();
					  $("#"+id).find('.item-rightcontent-success').removeClass('hide');
						    if(widget.element.parent().find('.item-rightcontent').length==0)
						    	widget.element.parent().find('.courseinvitesList').html(' <span class="toolbar-element-name">No new requests.</span>');
						
					  if(isInvitationAccepted){
						  doAjax.displaySuccessMessage("Invitation Accepted Successfully");
						  //to show received requests in 2x2 view
		          			if($("#baseElementMyCourses").length > 0){
		          				//checking the condition in which state is view is in dashboard based on view triggering the event
		          				if(parseInt($('#3').attr('data-sizex'))==2 && parseInt($('#3').attr('data-sizey'))==2){
		          					dashboardShifting.toMyCourses2x2View();
		          				}else if(parseInt($('#3').attr('data-sizex'))==1 && parseInt($('#3').attr('data-sizey'))==2){
		          					dashboardShifting.toMyCourses1x2View();
		          				}else{
		          					dashboardShifting.toMyCourses1x1View();
		          				}
		          			}
					  }
					  else
						  doAjax.displaySuccessMessage("Invitation Ignored Successfully");
					  if($.isFunction(widget.options.onAcceptingInvitation))
						  widget.options.onAcceptingInvitation();
				  }
				  else{
					  doAjax.displayErrorMessages(data);
				  }
			  },
			  beforeSendCallBack:function(e){
				  $("#"+id).find('.radiobuttons').addClass('ancher_lock');
			  },
			  failureCallBack:function(data){
			  }
			  
	  };
	  doAjax.ControllerPostInvocation(options);

  },
  _dyanamicElementEvents : function(){
	 var widget=this;
	  var sheight=this.options.scrollBarHeight;
	  var NotificationsHolder=$(this.element).parent().find('.mCustomScrollbar');
	  var xiimcustomScrollbarOptions = {elementid:NotificationsHolder,isUpdateOnContentResize:true,setHeight:sheight,vertical:'y'};
	  xiimcustomScrollbar(xiimcustomScrollbarOptions);
	  //NotificationsHolder.mCustomScrollbar({setHeight:sheight,mouseWheelPixels: 50,mouseWheel:true,autoHideScrollbar:false,theme: "rounded-dark"});
	  NotificationsHolder.find('.response').off('click').click(function(){
		  var isInvitationAccepted=false;
		  var invitationUniqueIdentifier='';
		  var courseUniqueIdentifier='';
		  $(this).find('input').prop('checked','checked');
				        if($(this).data('action') == 'accept') {
				        	isInvitationAccepted=true;
				        }
				        if($(this).data('action') == 'ignore'){
				        	isInvitationAccepted=false;
				        }
				        var courseInvitationDiv=$(this).closest('.courseInvitation');
				        courseUniqueIdentifier=courseInvitationDiv.attr('activityUniqueIdentifer');
				        invitationUniqueIdentifier=courseInvitationDiv.attr('invitationToken');
				        var id=courseInvitationDiv.attr('id');
				        widget._respondInvitation(courseUniqueIdentifier, invitationUniqueIdentifier, isInvitationAccepted,id);
			     
			        
			    });
	  NotificationsHolder.find('.clearSuccess').off('click').click(function(e){
		  $(e.target).closest('.courseInvitation').remove();
		  e.stopPropagation();
	  });
  },
  _fetchSusscfullUpdateCount:function(){
	  var widget=this;
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
  _setOption : function (key, value) {
	  _super._setOption(key,value);
  }
});
})(jQuery);
