/**
 * @author Next Sphere Technologies
 * MyMessage Notification Widget
 * 
 * MyMessage Notification widget will get Messages send by connections. 
 * 
 * 
 */


var messageNotifications=function(){
	var flag = "";
	var element="#messageNotificationsBase";//default base element can be changed by giving another element to the init also
	var startResult=0;
	var pageSize=12;
	return {
		element:element,
		init:function(iflag){
			flag = iflag;
			element = (iflag.element==undefined)?element:iflag.element;
			startResult = (iflag.startResult==undefined)?startResult:iflag.startResult;
			pageSize = (iflag.pageSize==undefined)?pageSize:iflag.pageSize;
			this.staticUI(flag);
			var options = this.prepareServiceRequest(flag);
			this.serviceInvocation(options);
			this.bindEvents();
			
		},
		serviceInvocation:function(options){
      	  if(options.Invocation=='post')
    		  doAjax.PostServiceInvocation(options);
      	  else if(options.Invocation=='controller')
      		  doAjax.ControllerInvocation(options);
    	  else if(options.Invocation=='put')
    		  doAjax.PutServiceInvocation(options);
    	  else if(options.Invocation=='cpost')
    		  doAjax.ControllerPostInvocation(options)
    	  else
    		  doAjax.GetServiceHeaderInvocation(options);
      },prepareServiceRequest:function(flag){
      	var URI = '';
    	var isAll = false;
    	var skipErrors;
    	var options={};
    	var headers={};
    	var InvocationType='get';
		var accessToken = $("#accessToken").val();
		var langId = $("#langId").val();
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
		var maxResult = pageSize;
		if(flag.isTotalCount){
			isAll = true;
		}
		
		var pageCriteria =  JSON.stringify({"pageSize":maxResult,"pageNo":startResult,"isAll":isAll});
		var request = {
				"userId": userId,
				"langId" : langId,
				"accessToken" : accessToken
  			};
		
		if(flag.isLoadMessageNotifications){
			$(element).empty();
			InvocationType='controller';
			var queryParams = '?userId='+userId+'startResult='+startResult+'&endResult='+(startResult+pageSize)+'&receiverType=USERS';
			URI = contextPath+'/feeds/getFeeds'+queryParams;
			
		}else if(flag.isDeleteMessage){
			InvocationType='post';
			URI = getModelObject('serviceUrl')+'/group/1.0/manageMessages';
			request.messageIds=[flag.messageIds];
			request.actionType='TRASH';
			request.fromFolder='Inbox';
			request=JSON.stringify(request);
			
		}else if(flag.isFetchSuccess){
			InvocationType='put';
			skipErrors=true;
			URI=getModelObject('serviceUrl')+'/group/1.0/manageMessageNotification';
			//request.messageIds=flag.messageIds;
			request.messageIds=flag.messageIds;
	  		
			request=JSON.stringify(request);
		}else if(flag.saveSessionObject){
			InvocationType='cpost';
			skipErrors=true;
			URI=contextPath+'/dashboard/saveObjectinSession';
			request='jsonObject='+flag.flag;
			headers={'Content-Type':'application/x-www-form-urlencoded'}
			//request=JSON.stringify(request);
		}
		 
		options= {
			async:true,
			url:URI,
			data:request,
			parentId:element,
			ischangepasswordflag:skipErrors,
			Invocation:InvocationType,
			headers:headers,
			successCallBack:messageNotifications.successCallBack,
			failureCallBack:messageNotifications.failureCallBack,
			beforeSendCallBack:messageNotifications.beforeSendCallBack,
			completeCallBack:messageNotifications.completeCallBack
	};
		return options;
		
	},successCallBack:function(data){
		
			var div='';
			if(flag.isLoadMessageNotifications){
				data=JSON.parse(data);
				if(data['feeds']!=undefined){
					
					//if(feedCount>0)
						//$('#messageNotificationCount').html(feedCount).removeClass('hide');
					var feeds=data['feeds'];
					if(feeds==undefined)
						feeds=[];
					feeds=(feeds.length==undefined)?[feeds]:feeds;
					for(var i=0;i<feeds.length;i++){
						var photo =(feeds[i]['photoId']==undefined)?contextPath+'/static/pictures/defaultimages/1.png':'/contextPath/User/'+feeds[i]['photoId']+'/stamp.jpg';
						var messagebody=(feeds[i]['messageBody']==undefined)?'':feeds[i]['messageBody'];
						var message=document.createElement('div');
						message=$(message).append(messagebody).remove().text();
						var puid=feeds[i]['profileUniqueIdentifier'];
						//dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(connectionModelList[i]['joinRequestedDate']),'hh:mm a MMM.dd');
						var time=messagesDate(convertUTCDateTimeTo.LocalBrowserDateTime(feeds[i]['postedTime']));
						time=(time==undefined)?dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(feeds[i]['postedTime']),'hh:mm a MMM.dd'):time;
						div+='	<div class="pad-lr-12 MessageNotificationItem" mid="'+feeds[i]['activityUniqueIdentifer']+'"> '                                               
	                        +'        <li class="clear-float min-height-80">'
	                        +'            <div class="col-xs-2"><img class="img-circle tool-bar-image cursor-hand" openprofile="'+puid+'" src="'+photo+'"></div><div class="col-xs-10 pad-left-13-important">'
	                        +'               <div class="toolbar-element-name mar-bot-5">'+stringLimitDots(feeds[i]['profileName'],9)+' <span class="pull-right toolbar-element-content">'+time+'</span></div>'
	                        +'               <div class="toolbar-element-content mar-bot-5">&nbsp;'+stringLimitDots(feeds[i]['feedMessage'],12)+' <span class="pull-right "><span class="read-icons enabled-sm messageread cursor-hand" title="Read"></span>&nbsp;<span class="reply-icons enabled-sm messagereply cursor-hand" title="Reply"></span>&nbsp;<span title="Forward" class="forward-icons enabled-sm messageforward cursor-hand"></span><span title="Move to Trash" class="trash-icons-sm enabled-sm messagetrash cursor-hand"></span></span></div>'
	                        +'				<div class="toolbar-element-content mar-bot-5">&nbsp;'+stringLimitDots(message,15)+'</div>            </div>'
	                        +'        </li>'
	                        +'     </div>';
					}
					
					$(element).empty().append(div);

					flag={
							isFetchSuccess:true,
							messageIds:data['feeds'].map(function(a) {return a.activityUniqueIdentifer+'';})
							};
					if(feeds.length>0){
						messageNotifications.init(flag);
					}else{
						$(element).empty().append('<p class="toolbar-element-name">No New Messages</p>');
					}
				}					
				}else if(flag.isDeleteMessage){
					
					if(data['isSuccess']=='true'){
						doAjax.displaySuccessMessage("Message moved to trash!");
						$('#messageNotificationsBaseprocessing_symbol').remove();
						$('.MessageNotificationItem[mid="'+flag.messageIds+'"]').remove();
						if($('.MessageNotificationItem').length==0){
							$(element).append('<p class="toolbar-element-name">No New Messages</p>');
						}
					}
				}else if(flag.saveSessionObject){
					window.location=contextPath+'/dashboard/home';
					
				}
	
		
	},failureCallBack:function(data){
		
	},beforeSendCallBack:function(flag){
		
	},completeCallBack:function(flag){
		$('#messageNotificationsBaseprocessing_symbol').remove();
		messageNotifications.bindEvents();
		
	},staticUI :function(flag){
	//	$('.mCustomScrollbarMessageNotifications').css('height','450px');//set to override the mcustom scrollbar
	},bindEvents:function(flag){
		
		
		$('.messageread').off('click').bind('click',function(){
			mid=$(this).closest('.MessageNotificationItem').attr('mid');
			$('#messagesHidden').removeClass('hide');
			var flag={
				isLoadmyMessages:true,
				messageFolder:'INBOX',
				OpenMessageId:mid
				};
			if(window.location.href.indexOf('/dashboard')!=-1){
				myMessages.init(flag);
			}else{
				messageNotifications.init({
					saveSessionObject:true,
					flag:JSON.stringify(flag)
				});
			}
			$('#messageNotificationCount').addClass('hide');
			$('.mynotificationswindowclass').trigger('click');
		});
		$('.messagereply').off('click').bind('click',function(){
			mid=$(this).closest('.MessageNotificationItem').attr('mid');
			//$('#messagesHidden').removeClass('hide');
			var flag={
				isComposefromHeader:true,
				isReplyfromHeader:true,
				messageId:mid,
				messageFolder:'INBOX'				
				};
			 if(window.location.href.indexOf('/dashboard')!=-1){
					myMessages.init(flag);
				}else{
					messageNotifications.init({
						saveSessionObject:true,
						flag:JSON.stringify(flag)
					});
				}
			 $('.mynotificationswindowclass').trigger('click');
		});
		
		$('.messageforward').off('click').bind('click',function(){
			mid=$(this).closest('.MessageNotificationItem').attr('mid');
			//$('#messagesHidden').removeClass('hide');
			var flag={
				isComposefromHeader:true,
				isForwardfromHeader:true,
				messageId:mid,
				messageFolder:'INBOX'				
			};
			if(window.location.href.indexOf('/dashboard')!=-1){
				myMessages.init(flag);
			}else{
				messageNotifications.init({
					saveSessionObject:true,
					flag:JSON.stringify(flag)
				});
			}
			$('.mynotificationswindowclass').trigger('click');
		});
		
		$('.messagetrash').off('click').bind('click',function(){
			var mid=$(this).closest('.MessageNotificationItem').attr('mid');
			var flag={
					messageIds:mid,
					isDeleteMessage:true
			};
			messageNotifications.init(flag);
			
		});
		
		$('[openprofile]').off('click').bind('click',function(){
			var url=contextPath+'/userprofile/profile/'+$(this).attr('openprofile');
			var win = window.open(url, '_blank');
			  win.focus();
		});
		
	}
	};
	}.call(this);
	