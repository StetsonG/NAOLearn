/**
 * @author Next Sphere Technologies
 * My Messages widget
 * 
 * My Messages widget is used to send messages to connection using Notification toolbar.
 * 
 * 1. Send Messages
 * 2. Reply Messages
 * 3. Forward Messages
 * 
 */



var myMessages=function(){
	var flag = "";
	var element="#messagesHidden";//default base element can be changed by giving another element to the init also
	var startResult=1;
	var pageSize=12;
	return {
		element:element,
		connections:[],
		users:[],
		/*init method will invoke for each and every method invocation like compose, reply, forward....*/
		init:function(iflag){
			
			 startResult=1;
			myMessages.users=[];
			flag = iflag;
			element = (iflag.element==undefined)?element:iflag.element;
			startResult = (iflag.startResult==undefined)?startResult:iflag.startResult;
			pageSize = (iflag.pageSize==undefined)?pageSize:iflag.pageSize;
			if(iflag.isLoadMore==undefined&&iflag.skipStaticUI==undefined){
				this.staticUI(flag);
			}
			var options = this.prepareServiceRequest(flag);
			this.serviceInvocation(options);
			this.bindEvents();
			$('#messageNotificationId').closest('li.open').removeClass('open');
			if(iflag.fromHeader){
				$('html, body').animate({
	                scrollTop: $("#messagesHidden").offset().top-120
	            }, 300);
				iflag.fromHeader=false;
			}
		},
		/*Service invocation after preparing request object*/
		serviceInvocation:function(options){
			 if(options.Invocation=='post')
	    		  doAjax.PostServiceInvocation(options);
	      	  else if(options.Invocation=='controller')
	      		  doAjax.ControllerInvocation(options);
	    	  else if(options.Invocation=='put')
	    		  doAjax.PutServiceInvocation(options);
	    	  else if(options.Invocation=='header')
		    		  doAjax.GetServiceHeaderInvocation(options);
	    	  else
	    		  
	    		  doAjax.GetServiceInvocation(options);
			
      },
      /*Preparing service request*/
      prepareServiceRequest:function(flag){
      	var URI = '';
      	var Invocation='get';
    	var isAll = false;
    	var options={};
    	var parentId='';
    	var skipErrorMessage;
    	var data;
    	var Controller=false;
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
				"pageCriteriaModel":pageCriteria,
				"userId": userId,
				"langId" : langId,
				"accessToken" : accessToken
  			};
		
		if(flag.isLoadmyMessages||flag.isSearchMessages){
			Invocation='get';
			skipErrorMessage=true;
			var queryParams = '?userId='+userId+'&pageCriteria='+encodeURIComponent(pageCriteria)+'&messageFolder='+flag.messageFolder;
			if(flag.isSearchMessages){
				queryParams+='&searchValue='+encodeURIComponent(flag.searchString);
			}
			URI = getModelObject('serviceUrl')+'/group/2.0/getMessges'+queryParams;
			parentId='#messageInfos';
			$('#loadMoreMessages').addClass('hide');
			
		}else if(flag.isMessageDetails||flag.isReplyfromHeader||flag.isForwardfromHeader){
			Invocation='header';
			var queryParams = '?userId='+userId+'&messageFolder='+flag.messageFolder+'&messageId='+flag.messageId;
			URI = getModelObject('serviceUrl')+'/group/2.0/getMessageDetails'+queryParams;
			URI=encodeURI(URI);
			parentId='#messageRightPanel';
			
		}else if(flag.isManageMessage){
			Invocation='post';
			URI = getModelObject('serviceUrl')+'/group/1.0/manageMessages';
			request.messageIds=[flag.messageIds+'-'+flag.originalFolder];
			request.actionType=flag.actionType;
			request.fromFolder=flag.fromFolder;
			request.originalFolder=flag.originalFolder;
			request=JSON.stringify(request);
			
		}else if(flag.isSendMessage){
			parentId='#ComposeHolder';
			Invocation='post';
			URI = getModelObject('serviceUrl')+'/group/1.0/sendMessage';
			request.messageModel={
					content:flag.content,
					subject:flag.subject
					};
					request.receipentUsers=flag.receipentUsers;
			
			request=JSON.stringify(request);
		}else if(flag.autocompleteInit){
			URI=contextPath+"/inbox/loadConnections";
		}
		 
		
		options= {
			async:true,
			url:URI,
			data:request,
			Invocation:Invocation,
			headers:headers,
			parentId:parentId,
			ischangepasswordflag:skipErrorMessage,//not initialised bcause Sometimes We need to send Undefined
			successCallBack:myMessages.successCallBack,
			beforeSendCallBack:myMessages.beforeSendCallBack,
			completeCallBack:myMessages.completeCallBack,
			failureCallBack:myMessages.failureCallBacks
			
	};
		return options;
		
	},successCallBack:function(data){
			if(flag.isLoadmyMessages||flag.isSearchMessages){
				
				if(flag.isSearchMessages){
					$('#messageInfos').empty();	
					$('#messageRightPanel').empty();
					if(!data['messages']){
						$('#loadMoreMessages').addClass('hide');
					}
				}
				$('#MessagesHolder').removeClass('hide');
				if(data['messages']!=undefined){
					var messages=data['messages'];
					messages=messages.length==undefined?[messages]:messages;
					
					for(var i=0;i<messages.length;i++){
						var isReadClass= (messages[i]['isRead']==undefined||messages[i]['isRead']+''=='false')?' ':' ';
						var fromfolder=messages[i]['originalFolder']==undefined?flag.messageFolder:messages[i]['originalFolder'].toUpperCase();
						if(fromfolder=='INBOX'){
						var photo =(messages[i]['authorPhotoId']==undefined)?contextPath+'/static/pictures/defaultimages/1.png':'/contextPath/User/'+messages[i]['authorPhotoId']+'/stamp.jpg';
						var message=document.createElement('div');
							message=$(message).append(messages[i]['content']).remove().text();
							var puid=messages[i]['authorProfileIdentifier'];
							var time=messagesDate(convertUTCDateTimeTo.LocalBrowserDateTime(messages[i]['createDate']));
							time=(time==undefined)?dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(messages[i]['createDate']),'hh:mm a MMM.dd'):time;
						MessageModelDiv='<div class="messageinfodiv" originalFolder="'+fromfolder+'" msgid="'+messages[i]["messageId"]+'" >'+
										'									<div class="">'+
										'										<div class="col-xs-2">'+
										'											<img src="'+photo+'" openprofile="'+puid+'"  class="img-sm-circle cursor-hand" width="50" />'+
										'										</div>           '+
										'										<div class="col-xs-10 mar-top-10 mar-bottom-25">'+
										'											<div class="cursor-hand"><!--Profile photo and content section div-->'+
										'												<div class="">'+
										'													<span title="'+messages[i]['authorName']+'" class="cursor-hand pad-left-5 font-12 helvetica-neue-roman  '+isReadClass+' sendername ">'+stringLimitDots(messages[i]['authorName'],12)+'</span><span class="pull-right font-10px msgtime helvetica-neue-roman">'+time+'</span>'+
										'												</div>'+
										'												<div class="pad-5 pad-top-2 font-10px helvetica-neue-roman darkgrey'+isReadClass+' ">'+stringLimitDots(messages[i]['subject'],15)+'</div>'+
										'												<div class="pad-5 font-10px darkgrey">'+stringLimitDots(message,20)+'</div>'+
										'											</div>'+'</div>';
	   						
						$('#messageInfos').append(MessageModelDiv);
						}else if(fromfolder=='SENT'){
							var reciepient=messages[i]['recipients'].length==undefined?[messages[i]['recipients']]:messages[i]['recipients'];
							var photo =reciepient.length==1?((reciepient[0]['userPhotoId']==undefined)?contextPath+'/static/pictures/defaultimages/1.png':'/contextPath/User/'+reciepient[0]['userPhotoId']+'/stamp.jpg'):contextPath+'/static/pictures/defaultimages/no-group-image.png';
							var message=document.createElement('div');
								message=$(message).append(messages[i]['content']).remove().text();
								var time=messagesDate(convertUTCDateTimeTo.LocalBrowserDateTime(messages[i]['createDate']));
								time=(time==undefined)?dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(messages[i]['createDate']),'hh:mm a MMM.dd'):time;
								var puid=reciepient[0]['userProfileIdentifier'];
								var reciepentsName=reciepient[0]['userName'];
								var reciepentshort=stringLimitDots(reciepient[0]['userName'],15);
							var noprofile='';
							if(reciepient.length>1){
								reciepentsName+=' (+'+(reciepient.length-1)+' other'+(reciepient.length>2?'s':'')+' )';
								reciepentshort+=' (+'+(reciepient.length-1)+' other'+(reciepient.length>2?'s':'')+' )';
								puid="";
								noprofile='ancher_lock';
							}
							MessageModelDiv= '<div class="messageinfodiv"  originalFolder="'+fromfolder+'"  msgid="'+messages[i]["messageId"]+'">'+
											'									<div class="">'+
											'										<div class="col-xs-2">'+
											'											<img src="'+photo+'"  openprofile="'+puid+'"  class="img-sm-circle cursor-hand '+noprofile+'" width="50" />'+
											'										</div>           '+
											'										<div class="col-xs-10 mar-top-10 mar-bottom-25">'+
											'											<div class="cursor-hand"><!--Profile photo and content section div-->'+
											'												<div class="">'+
											'													<span title="'+reciepentsName+'"  class=" pad-left-5 '+isReadClass+'sendername font-12 helvetica-neue-roman">'+reciepentshort+'</span><span class="pull-right font-10px msgtime helvetica-neue-roman ">'+time+'</span>'+
											'												</div>'+
											'												<div class="pad-5  pad-top-2 font-10px helvetica-neue-roman '+isReadClass+' ">'+stringLimitDots(messages[i]['subject'],15)+'</div>'+
											'												<div class="pad-5 font-10px ">'+stringLimitDots(message,20)+'</div>'+
											'											</div>'+'</div>';
		   						
							$('#messageInfos').append(MessageModelDiv);
							
						}
					}
					
					if(data['messageCount']>$('.messageinfodiv').length){
						$('#loadMoreMessages').removeClass('hide');
					}else{
						$('#loadMoreMessages').addClass('hide');
					}
					
					
				}
		}else if(flag.isMessageDetails){
			if(data['messageModel']!=undefined){
				var previewdiv='';
				var messageModel=data['messageModel'];
				var fromfolder=$('.messageinfodiv.activated').attr('originalfolder')==undefined?flag.messageFolder:$('.messageinfodiv.activated').attr('originalfolder').toUpperCase();
				if(fromfolder=='SENT'){
					var reciepient=messageModel['recipients'].length==undefined?[messageModel['recipients']]:messageModel['recipients'];
					var reciepentsName='<span title="'+reciepient[0]['userName']+'">'+stringLimitDots(reciepient[0]['userName'],15)+'</span>';
					for(var j=1;j<reciepient.length;j++){
						reciepentsName+=', &nbsp <span title="'+reciepient[j]['userName']+'">'+stringLimitDots(reciepient[j]['userName'],15)+'</span>';
					}
					previewdiv =		'<div class="pad-lr-12 mar-top-7">'+
					'								<div><span class="font-12 helvetica-neue-roman ">TO : '+reciepentsName+'</span><span class="pull-right font-10px helvetica-neue-roman">'+dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(messageModel['createDate']),'hh:mm a MMM.dd')
					+'								</span>						</div>'+
					'								<div class="pad-top-2 font-10px helvetica-neue-roman">'+messageModel['subject']+'</div>'+
					'								<div class="font-10px mar-top-25 line-height-16-imp message-pre">'+
													messageModel['content']+
					'								</div>'+
					'							</div>';
					
					
				}else{
					previewdiv =		'<div class="pad-lr-12 mar-top-7">'+
					'								 <div><span class="font-12 helvetica-neue-roman ">FROM : </span>  <span title="'+messageModel['authorName']+'" class="font-12 helvetica-neue-roman ">'+stringLimitDots(messageModel['authorName'],20)+'</span><span class="font-10px helvetica-neue-roman pull-right">'+dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(messageModel['createDate']),'hh:mm a MMM.dd')
					+'</span>						</div>'+
					'								<div class="pad-top-2 font-10px helvetica-neue-roman">'+messageModel['subject']+'</div>'+
					'								<div class="font-10px mar-top-25 line-height-16-imp message-pre">'+
														messageModel['content']+
					'								</div>'+
					'							</div>';
					}
				if(flag.isLoadMore){
					$('#messageRightPanel').append(previewdiv);	
				}else{
					$('#messageRightPanel').empty().append(previewdiv);
				}
				$('#messageActions').removeClass('ancher_lock');
				$('#messageRightPanel').data('mCS','');
				/*var xiimcustomScrollbarOptions = {elementid:"#messageRightPanel",isUpdateOnContentResize:true,setHeight:"520px",vertical:'y'};
				xiimcustomScrollbar(xiimcustomScrollbarOptions);*/
			}
		}
		else if(flag.isReplyfromHeader){
			$('#ComposeButton1').trigger('click');
			var messageModel=data['messageModel'];
			var authorId=messageModel['authorId'];
			var authorName=messageModel['authorName'];
			var content=messageModel['content'];
			var subject='RE : '+messageModel['subject'];
			 var contentAppend='On '+dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(messageModel['createDate']),'hh:mm a MMM.dd')+'  '+ authorName+' wrote: ';
			 var dots='-';
			 while(dots.length<contentAppend.length+22){
				 dots=dots+'-';
			 }
			 dots+=''
			 content=''+contentAppend+dots+content;
/*			 if(CKEDITOR.instances['composeEditor']){
				 CKEDITOR.instances['composeEditor'].setData(content);
				 
			 }*/
			 $('#composeEditor').val(content);
			 $('#messageSubject').val(subject);
			var authorPhotoId=messageModel['authorPhotoId']==undefined?contextPath+'/static/pictures/defaultimages/1.png':'/contextPath/User/'+messageModel['authorPhotoId']+'/stamp.jpg';
			
			var reciepent='<div class="display-inline  font-15 helvetica-neue-roman" id="invitedUserID-'+authorId+'">'+authorName+'<a href="javascript:void(0);" contentid="'+authorId+'" id="remove-invitedUserID-'+authorId+'"><span class="minus-sm-icons cursor-hand mar-lr-10"></span></a></div>';
			$('#reciepentHolder').append(reciepent);
			 myMessages.users.push(''+authorId);
			 if(myMessages.users.length==1){
				 var logo= $.grep(myMessages.connections, function(e){ return (e.userId+'') == myMessages.users[0]; });
				 var photo=(logo.length>0&&logo[0]['photoId']!=undefined)?('/contextPath/User/'+logo[0]['photoId']+'/stamp.jpg'):(contextPath+'/static/pictures/defaultimages/1.png');
				 $('.composeicon').parent().removeClass('hide');
				 $('.composeicon').find('img').attr('src',photo).next('#bigMinus').off('click').bind('click',function(e){
					 $('#remove-invitedUserID-'+logo[0]['userId']).trigger('click');
					 $('.composeicon').parent.addClass('hide');
				 });
			 }
			 $('[id^=remove-invitedUserID]').off('click').bind('click',function(){
					var memid= $(this).attr('contentId');
					myMessages.users.splice( $.inArray(memid, myMessages.users), 1 );
					$(this).parent().remove();
					 $('.composeicon').parent().addClass('hide');
				 });
			$('#messagesHidden').removeClass('hide');
		}
		else if(flag.isForwardfromHeader){
			$('#ComposeButton1').trigger('click');
			var messageModel=data['messageModel'];
			var authorId=messageModel['authorId'];
			var authorName=messageModel['authorName'];
			var content=messageModel['content'];
			var subject='FW : '+messageModel['subject'];
			var contentAppend='On '+dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(messageModel['createDate']),'hh:mm a MMM.dd')+'   '+ authorName+' wrote: ';
			var dots='-';
			while(dots.length<contentAppend.length+22){
				dots=dots+'-';
			}
			dots+=''
				content=''+contentAppend+dots+content;
/*			if(CKEDITOR.instances['composeEditor']){
				CKEDITOR.instances['composeEditor'].setData(content);
				  
			}*/
			$('#composeEditor').val(content);
			$('#messageSubject').val(subject);
			
			 
			$('#messagesHidden').removeClass('hide');
		}
		
		
		else if(flag.iscomposeMessage){
			
		}else if(flag.isManageMessage){
			if(flag.actionType=='TRASH'){
				doAjax.displaySuccessMessage("Message moved to trash!");
				$('#messageRightPanel').empty();
				$('.messageinfodiv[msgid="'+flag.messageIds+'"]').remove();
				
				$('.messageinfodiv:first').trigger('click');
			}
			if(flag.actionType=='DELETE'){
				doAjax.displaySuccessMessage("Message deleted successfully !");
				$('#messageRightPanel').empty();
				$('.messageinfodiv[msgid="'+flag.messageIds+'"]').remove();
				$('.messageinfodiv:first').trigger('click');
			}
			
			if($('.messageinfodiv').length==0){
				$('#messageInfos').append('<div class="default-message-style">No Messages</div>');
				$('#messageActions').addClass('ancher_lock');
			}
		}else if(flag.isSendMessage){
			doAjax.displaySuccessMessage("Message sent successfully!");
			$('#reciepentHolder').empty();
			$('#ComposeHolder').removeClass('hide');
			$('#sendMessage').removeClass('ancher_lock');
/*			if(CKEDITOR.instances['composeEditor']){
				CKEDITOR.instances['composeEditor'].setData('');
				  
			}*/
			$('#composeEditor').val('');
			$('#messageSubject').val('');
			$('#canelCompose').trigger('click');
			if($('#currentFolder').attr('folder')=='SENT'){
				$('#sentId').trigger('click');
			}
		}
	
			myMessages.bindEvents();
			myMessages.doextraTriggers();

	},failureCallBacks:function(data){
		if(flag.isLoadmyMessages||flag.isSearchMessages){
			$('#messageInfos,#messageRightPanel').empty();
			$('#messageInfos').empty().append('<div class="default-message-style">No Messages</div>');
			$('#loadMoreMessages').addClass('hide');
			$('#messageActions').addClass('ancher_lock');
		}

		
	},beforeSendCallBack:function(flag){
		
	},completeCallBack:function(flag){
		
		
	},staticUI :function(flag){
/*		if(CKEDITOR.instances['composeEditor']){
			CKEDITOR.instances['composeEditor'].destroy(false);
		}*/
		if(flag.isLoadmyMessages||flag.isComposefromHeader){
			var ComPoseDiv ='<div class="col-xs-12">'+
							'						<div class="pad-12 pad-bot-0">'+
							'							<div class="pad-bot-12 border-bottom"><span title="Back" id="canelCompose" class="previous-sm-arrows  mar-right-12 cursor-hand"></span><span class="font-12"> Compose</span>'+
							'								<span class="pull-right">'+
							'                                	<span id="sendMessage" title="send" class="send-sm-icons selected-sm cursor-hand mar-right-8"></span>'+
							'                                    <span class=" hide forward-icons selected-sm cursor-hand mar-right-8"></span>                                    '+
							'                                	<span id="deleteMessage" class="hide trash-icons-sm selected-sm cursor-hand"></span>'+
							'                                </span>'+
							'							</div>'+
							'						</div>'+
							'						<div class="mCustomScrollbarREMOVED mCustomScrollbarmessage  height-502 pad-bot-10">'+
							'							<div class="pad-12">'+
							'                                <div class="col-xs-1 mar-right-4">'+
							'                                	<div class="composeicon position-relative ">'+
							'                                    	<img src="images/profiles/4.png"  class="img-sm-circle" width="100">'+
							'                                        <div id="bigMinus" class="position-absolute bottom-minus-3 left-34">'+
							'                                        	<span class="minus-sm-icons enabled cursor-hand"></span>'+
							'                                        </div>  '+
							'                                    </div>'+
							'                                </div>'+
							'                                <div class="">'+
							'                         <div class="mCustomScrollbar miniscroll max-height-90"><div class="display-inline " id="reciepentHolder"></div><input class="to-input display-inline font-10px helvetica-neue-roman" placeholder="To" type="text" id="reciepent" /> </div>'+
							'                                    '+
							'                                </div>								'+
							'             <div class="clear-float">  <div class=""><input id="messageSubject" placeholder="Message Subject" maxlength="100" type="text" class="width-100-percent  font-10px helvetica-neue-roman height-25"></div>   '+
							'									<div class="mar-top-25" id=""><textarea id="composeEditor" class="line-height-16-imp font-10px helvetica-neue-roman pad-10 fullwidth" rows="20" style="overflow:auto"/></div>		</div>'+
							'                                    '+

							'							</div>'+
							
							'						</div>	'+
							'					</div>';
		var mvvar = '<div class="pad-12 pad-bot-0 border-bottom">'+
					'                          <div class="block-header">'+
					'							 <div class="col-xs-2"></div>'+
					'                            <div class="col-xs-8 text-center darkgrey  font-18">My Messages</div>'+
					'                            <div class="col-xs-2 pull-right">'+
					'                              <div class="text-right ">'+
					'							  <span class="view-icons twobytwo cursor-hand mar-right-8 hide"></span>'+
					'                              		<span id="closeMessages" class="close-sm-icons selected-sm"></span>'+
					'                              </div>'+
					'                            </div>'+
					'                          </div>'+
					'                        </div> '+
					'								<div id="ComposeHolder" class="hide">'+ComPoseDiv+
					'								</div>'+	
					'								<div id="MessagesHolder">	'+	
					'						<!-- body with 2 colun starts -->'+
					'						<div class="col-xs-6 border-right" id="messagesContainerDivID">'+
					'							<div class="pad-12">'+
					'								<div class="border-bottom pad-bot-12">'+	
					'                            <span class="dropdown"> <a href="#" data-toggle="dropdown" class="dropdown-toggle">'+
					'                              <span class="filter-sm-icons mar-top-min-4"></span>'+
					'                              </a>'+
					'                              <ul class="common-dropdown-menus dropdown-menu arrow-right widget-dp">'+
					'                                <li id="recievedId"><a href="javascript:void(0)">Recieved</a></li>'+
					'                                <li id="sentId"><a href="javascript:void(0)">Sent</a></li>'+
					'                                <li id="trashId"><a href="javascript:void(0)">Trash</a></li>'+
					'                              </ul>'+
					'                            </span>'+ 
					'								<span id="currentFolder" class="darkgrey font-12 position-relative top-minus-3" folder="INBOX">Received </span>'+
					'									<span class="pull-right">'+
					'                                        <span id="messageSearch" title="Search" class="search-sm-icons selected-sm cursor-hand mar-right-8"></span>'+
					'                                    	<span id="ComposeButton1" title="compose" class="compose-icons selected-sm cursor-hand "></span>'+
					'                                    </span>'+
					'								</div>'+
					'							</div>'+
					'							<div class="mCustomScrollbarmessage  height-502 mar-top-10 pad-bot-5 pad-top-0">'+
					'									<div id="messageInfos" class="pad-12 min-height-100"></div>	'+
					'									<span id="loadMoreMessages" class="pull-right hide"><button  class="def-button font-17 mar-right-30 small-button">LoadMore</button></div>	'+
					'							</div>'+
					'					<div class="col-xs-6 ">'+
					'						<div class="pad-12 mar-bot-12">'+
					'							<div class="border-bottom-none ">'+// <b>Message </b>'+
					'								<span id="messageActions"   class="pull-right ancher_lock">'+
					'                                	<span  class="flag-icons selected-sm cursor-hand mar-right-5 "></span>'+
					'                                    <span id="replyMessage1" title="reply" class="quit-reverse-sm-icons selected-sm cursor-hand mar-right-5"></span>'+
					'                                    <span  id="forwardMessage1" title="Forward" class="messageforward-icons  selected-sm cursor-hand mar-right-5"></span>                                    '+
					'                                	<span id="deleteMessage1" title="delete" class="trash-icons-sm selected-sm cursor-hand"></span>'+
					'                                </span>'+
					'							</div>'+
					'						</div><div class="clear-float"></div>'+
					'						<div class="mCustomScrollbarmessage height-502  pad-bot-10">'+
					'						<div id="messageRightPanel" class="min-height-200"></div>'+
					
					'						</div></div>'+
					'					</div>';
					$(element).html(mvvar);
		}else if(flag.iscomposeMessage){
			
		}
		
	},bindEvents:function(flag){
		var xiimcustomScrollbarOptions = {elementid:".miniscroll",isUpdateOnContentResize:true,setHeight:"",vertical:'y'};
		xiimcustomScrollbar(xiimcustomScrollbarOptions);

		/*var xiimcustomScrollbarOptions = {elementid:"#messagesContainerDivID",isUpdateOnContentResize:true,setHeight:"555px",vertical:'y'};
		xiimcustomScrollbar(xiimcustomScrollbarOptions);*/

		var xiimcustomScrollbarOptions = {elementid:".mCustomScrollbarmessage",isUpdateOnContentResize:true,setHeight:"502px",vertical:'y'};
		xiimcustomScrollbar(xiimcustomScrollbarOptions);

		$('.messageinfodiv').off('click').bind('click',function(e){
			if( e.target == $(this).find('img')[0]){ 
			       return;
			}

			$('.messageinfodiv').removeClass('activated');
			$(this).addClass('activated');
			$('.sendername,.msgtime').removeClass('lightblue');
			$(this).find('.sendername,.msgtime').addClass('lightblue');
			messageId=$(this).attr('msgid');
			flag={
					isMessageDetails:true,
					messageId:messageId,
					messageFolder:$('#currentFolder').attr('folder')
			};
			myMessages.init(flag);
			$(this).find('.bold').removeClass('bold');
			e.stopPropagation();
		});
		$('#recievedId').off('click').bind('click',function(){
			$('#messageInfos').empty();
			$('#currentFolder').attr('folder','INBOX').html('Recieved');
			$('#messageInfos,#messageRightPanel').empty();
			myMessages.init({
				skipStaticUI:true,
				isLoadmyMessages:true,
				messageFolder:'INBOX',
				});
		});
		$('#sentId').off('click').bind('click',function(){
			$('#currentFolder').html('Sent').attr('folder','SENT');
			$('#messageInfos,#messageRightPanel').empty();
			myMessages.init({
				skipStaticUI:true,
				isLoadmyMessages:true,
				messageFolder:'SENT',
				});
		});
		$('#trashId').off('click').bind('click',function(){
			$('#messageInfos,#messageRightPanel').empty();
			$('#currentFolder').attr('folder','TRASH').html('Trash');
			myMessages.init({
				skipStaticUI:true,
				isLoadmyMessages:true,
				messageFolder:'TRASH',
				});
		});
		$('#ComposeButton1').off('click').bind('click',function(){
			myMessages.registerautoComplete.loadConnections();
			$('#ComposeHolder').removeClass('hide');
			$('#MessagesHolder').addClass('hide');
			$('.composeicon').parent().addClass('hide');
			myMessages.init({
				iscomposeMessage:true,
				});
			
			myMessages.registerautoComplete.applayAutoComplete('reciepent','reciepentHolder',myMessages.connections);
/*			if(CKEDITOR.instances['composeEditor']){
				CKEDITOR.instances['composeEditor'].destroy(false);
			}
				CKEDITOR.replace( 'composeEditor',
						{
					
							toolbar:[['undo','Format', 'Bold','Italic','Underline','Strike', 'Blockquote','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','NumberedList','BulletedList','BidiLtr','BidiRtl']],
							
							extraPlugins: 'autogrow',
							autoGrow_maxHeight: 290,
							removePlugins:'floating-tools,autosave,elementspath,resize',
							autoGrow_minHeight:290,
							height:190,
							//autoGrow_onStartup :false
						}
				).on( 'focus', function( e ) {
					$('#ComposeHolder [class="cke_inner cke_reset"]').css('height','auto').css('min-height','auto');
					$('#ComposeHolder [class="cke_bottom cke_reset_all"]').css('display','none');
				} );
				$('#ComposeHolder [class="cke_inner cke_reset"]').css('height','auto').css('min-height','auto');
				$('#ComposeHolder [class="cke_bottom cke_reset_all"]').css('display','none');*/
		});
		

			$('#messageSearch').off('click').bind('click',function(e){
				if(!$(e.target).is('[aria-describedby]')){
				$(e.target).popover({
				'html' : true,
				height:100,
				trigger : 'manual',
				placement: 'left',
				container:'#MessagesHolder',
				viewport:{selector:'.col-xs-6.border-right',padding:4},
				content:'<input type="text" class="form-control height-25 pad-2 fullwidth" id="searchMessagesbox"  placeholder="Search" maxlength="50" onkeyup="myMessages.search(event)"/>',
				template: '<div class="popover messageSearch"><div class="arrow"></div><div class="popover-inner"><div class="popover-content pad-0"><p>ThisPopover</p></div></div></div>'
					/*content:'<div class="z-index-1050">'
					+'		<input type="text" class="form-control" id="searchMessagesbox" onkeypress=""/>'		
					+'</div>',*/
			});
				$(e.target).popover('show');
				e.stopPropagation();
				$('#searchMessagesbox').focus();
			
			}else{
				$(e.target).popover('destroy');
			}
			});
		$('#sendMessage').off('click').bind('click',function(){
			var subject=$('#messageSubject').val();
			var messaege=$('#composeEditor').val();//CKEDITOR.instances['composeEditor'].getData();
			var reciepents=myMessages.users;
			$('.composeerror').remove();
			var validationResult=true;
			if(reciepents.length==0){
				validationResult=false;
				$('<span id="noreciepents" class="red composeerror">Please enter at least one recipient in the To:</span>').insertAfter($('#reciepent'));
			}
			if(messaege==undefined||$.trim(messaege)==''){
				validationResult=false;
				$('<span id="messagecontentError" class="red composeerror">Please enter message.</span>').insertAfter($('#messageSubject'));
/*				CKEDITOR.instances['composeEditor'].on('change', function() { 
					$('#messagecontentError').remove();
					
				});
				*/
				
			}
			
			if(validationResult){
				$(this).addClass('ancher_lock');
				flag={
						isSendMessage:true,
						content:messaege,
						subject:subject,
						receipentUsers:reciepents,
						skipStaticUI:true
				};
				myMessages.init(flag);
			}
			
		});
		
		
		$('[openprofile]').off('click').bind('click',function(){
			if($(this).attr('openprofile')!=""){
			var url=contextPath+'/userprofile/profile/'+$(this).attr('openprofile');
			var win = window.open(url, '_blank');
			  win.focus();
			}
		});
		$('#canelCompose').off('click').bind('click',function(){
			$('.composeerror').remove();
			$('.composeicon').parent().addClass('hide');
			$('sendMessage').removeClass('ancher_lock');
/*			if(CKEDITOR.instances['composeEditor']){
				CKEDITOR.instances['composeEditor'].setData('');
			}*/
			$('#composeEditor').val('');
			$('#messageSubject').val('');
			$('#MessagesHolder').removeClass('hide');
			$('#ComposeHolder').addClass('hide');
			$('#reciepentHolder').empty();
			if($('.messageinfodiv').length<1){
				myMessages.init({
					skipStaticUI:true,
					isLoadmyMessages:true,
					messageFolder:'INBOX',
					});
			}
		});
		
		$('#closeMessages').off('click').bind('click',function(){
			$("#messagesHidden").addClass('hide');
		});
		$('#loadMoreMessages').off('click').bind('click',function(){
			myMessages.init({
				isLoadmyMessages:true,
				isLoadMore:true,
				startResult:$('.messageinfodiv').length+1,
				messageFolder:$('#currentFolder').attr('folder')
				});
		});
		
		$('#replyMessage1').off('click').bind('click',function(){
			var msgid=$('.messageinfodiv.activated').attr('msgid');
			 myMessages.init({
					isComposefromHeader:true,
					isReplyfromHeader:true,
					messageId:msgid,
					messageFolder:$('#currentFolder').attr('folder')				
					});
		});
		
		$('#forwardMessage1').off('click').bind('click',function(){
			var msgid=$('.messageinfodiv.activated').attr('msgid');
			myMessages.init({
				isComposefromHeader:true,
				isForwardfromHeader:true,
				messageId:msgid,
				messageFolder:$('#currentFolder').attr('folder')				
			});
		});
		
		$('#deleteMessage, #deleteMessage1').off('click').bind('click',function(){
			var msgid=$('.messageinfodiv.activated').attr('msgid');
			var actiontype='TRASH';
			var fromFolder=$('#currentFolder').attr('folder')=='INBOX'?'Inbox':'Sent';
			 fromFolder=$('#currentFolder').attr('folder')=='TRASH'?'Trash':fromFolder;
			 actiontype=fromFolder=='Trash'?'DELETE':'TRASH';
			 var originalFolder=$('.messageinfodiv.activated').attr('originalFolder');
			 originalFolder=originalFolder.charAt(0).toUpperCase() + originalFolder.slice(1).toLowerCase();
			var flag={
					isManageMessage:true,
					messageIds:msgid,//added for the delete from trash support in repository 
					actionType:actiontype,
					fromFolder:fromFolder,
					skipStaticUI:true,
					originalFolder:originalFolder,
					
			};
			myMessages.init(flag);
			
		});
	
		
		
	},search:function(e){
		var searchstring=$.trim($('#searchMessagesbox').val());
		if(searchstring.length>0){
			 if(e.keyCode == 13){
			      myMessages.init({
			    	  //skipStaticUI:true,
			    	  isSearchMessages:true,
			    	  messageFolder:$('#currentFolder').attr('folder'),
			    	  searchString:searchstring
			      });
			    }	
		}else{
			if(e.keyCode == 13||$('#searchMessagesbox').val().length==0){
				$('#messageInfos').empty();	
				myMessages.init({
					skipStaticUI:true,
					isLoadmyMessages:true,
					messageFolder:$('#currentFolder').attr('folder'),
					});
		    }	
			
		}
	},doextraTriggers:function(){
		if(flag.isLoadmyMessages){
			if(flag.OpenMessageId==undefined&&flag.isLoadmyMessages||flag.isSearchMessages){
				$('.messageinfodiv:first').trigger('click');
			}else if(flag.OpenMessageId){
				var LoadMessageDiv='.messageinfodiv[msgid="'+flag.OpenMessageId+'"]';
				if($(LoadMessageDiv).length>0){
					$(LoadMessageDiv).trigger('click');
					$('#messageInfos').closest('.mCustomScrollbarmessage').mCustomScrollbar('scrollTo',$(LoadMessageDiv));
				}else{
					myMessages.init({
						isLoadmyMessages:true,
						isLoadMore:true,
						startResult:$('.messageinfodiv').length+1,
						messageFolder:$('#currentFolder').attr('folder'),
						OpenMessageId:mid
						});
				}
			}
		}if(flag.isSearchMessages){
				$('.messageinfodiv:first').trigger('click');
			}
	},registerautoComplete:{
		loadConnections:function(){
	    	var url = getModelObject('serviceUrl')+'/group/2.0/getGroupMembers';
	    	var request = {
						"groupUniqueIdentifier":$("#personalGroupUniqueIdentifier").val(),
						"groupmemberSearchModelList":[{
							"groupMemberSearchAttributeEnum":"IS_CONNECTION",
							"searchValue":false
						}],
						"pageCriteriaModel" : {
							"pageSize" : 20,
							"pageNo" : 1,
							"isAll" : true
						},
						
						"langId" :$("#langId").val() ,
						"accessToken" :  $("#accessToken").val()
        			};
	    	
	    	request = JSON.stringify(request);
	    	var connectionOptions = {
	    			url:url,
	    			data:request,
	    			async:false,
	    			successCallBack:function(data){
	    				var userId = $("#loggedInUserId-meta").val();
	    				if(data.manageGroupMemberModelList){
	    					if(data.manageGroupMemberModelList.length == undefined){
	    						data.manageGroupMemberModelList = [data.manageGroupMemberModelList];
	    					}
	    					
	    					myMessages.connections = [];
	    					
	    					for(var i = 0;i< data.manageGroupMemberModelList.length;i++){
	    						if(data.manageGroupMemberModelList[i]['userId'] != userId){
	    						myMessages.connections.push(data.manageGroupMemberModelList[i]);
	    						}
	    					}
	    				}
	    				 
	    			}
	    	};
	    	doAjax.PostServiceInvocation(connectionOptions);
	    },
	    applayAutoComplete:function(ele,childcontainer,results){
			$("#"+ele).autocomplete({
				minLength: 0,
				create: function(){
					$(this).data('ui-autocomplete')._renderItem =function (ul, item) {
	                    return $('<li class="pad-0">')
	                        .append('<a class="autocomplete-window-href">' + stringLimitDots(item.label, 45) + ' ' + 
	                        		/*'Some brief Information' +*/
	                        		'</a>')
	                        .appendTo(ul);
	                };
					$(this).data('ui-autocomplete')._renderMenu= function( ul, items ) {
						var that = this,
						currentCategory = "";
						$(ul).addClass('autocomplete-window');
						$.each( items, function( index, item ) {
							var li;
							if ( item.category != currentCategory ) {
								ul.append( "<li class='ui-autocomplete-category autocomplete-window-heading'>Matches In Your Connections </li>" );
								currentCategory = item.category;
							}
							li = that._renderItemData( ul, item );
						});
					}
					
				},
				source: function(request, response) {
					 var match = request.term.toLowerCase();
					 var res=$.map(results, function( item ) {
						 if(item.memberName.toLowerCase().indexOf(match) > -1&& $.inArray((item.userId+''), myMessages.users) < 0 ){
							    return {
									label: item.memberName,
									value: item.userId
								};
							 }
						});
					 response(res.slice(0,6));
				 },
				 focus: function( event, ui ) {
					return false;
				 },
				 select: function( event, ui ) {
					 if($("#"+ui.item.value).length == 0) {
							 if ($.inArray(ui.item.value, myMessages.users) < 0 ) {
								 myMessages.users.push(ui.item.value);
								 if(myMessages.users.length==1){
									 var logo= $.grep(myMessages.connections, function(e){ return (e.userId+'') == myMessages.users[0]; });
									 var photo=logo[0]['photoId']!=undefined?('/contextPath/User/'+logo[0]['photoId']+'/stamp.jpg'):(contextPath+'/static/pictures/defaultimages/1.png');
									 $('.composeicon').parent().removeClass('hide');
									 $('.composeicon').find('img').attr('src',photo).next('#bigMinus').off('click').bind('click',function(e){
										 $('#remove-invitedUserID-'+logo[0]['userId']).trigger('click');
										 $('.composeicon').parent().addClass('hide');
									 });
								 }else{
									 $('.composeicon').parent().addClass('hide');
								 }
								 var html = '<div class="display-inline font-15 helvetica-neue-roman invitedUser" id="invitedUserID-'+ui.item.value+'">'+ui.item.label+'<a href="javascript:void(0);" title="Remove : '+ui.item.label+'" contentId="'+ui.item.value+'" class="mar-lr-5" id="remove-invitedUserID-'+ui.item.value+'"><span class="minus-sm-icons enabled cursor-hand "></span></a></div>';
								 $('#noreciepents').remove();
								 $("#"+childcontainer).append(html);
								 if(myMessages.users.length!=1){
									 $('#reciepentHolder .singlereciepent ,#reciepent').removeClass('singlereciepent');
								 }else{
									 $('#reciepentHolder .invitedUser:first ,#reciepent').addClass('singlereciepent');
								 }
							 }
							 
							 $('[id^=remove-invitedUserID]').off('click').bind('click',function(){
								var memid= $(this).attr('contentId');
								myMessages.users.splice( $.inArray(memid, myMessages.users), 1 );
								$(this).parent().remove();
								if(myMessages.users.length==1){
									 var logo= $.grep(myMessages.connections, function(e){ return (e.userId+'') == myMessages.users[0]; });
									 var photo=logo[0]['photoId']!=undefined?('/contextPath/User/'+logo[0]['photoId']+'/stamp.jpg'):(contextPath+'/static/pictures/defaultimages/1.png');
									 $('.composeicon').parent().removeClass('hide');
									 $('.composeicon').find('img').attr('src',photo).next('#bigMinus').off('click').bind('click',function(e){
										 $('#remove-invitedUserID-'+logo[0]['userId']).trigger('click');
										 $('.composeicon').parent().addClass('hide');
									 });
									 $('#reciepentHolder .invitedUser:first , #reciepent').addClass('singlereciepent');
								 }else{
									 $('.composeicon').parent().addClass('hide');
									 $('#reciepentHolder .singlereciepent , #reciepent').removeClass('singlereciepent');
								 }
							 });
					 }else{
						//  $("#userSelectError").show();  
					  }
					 
					 $("#"+ele).val('');
					 //Event.dynamicEvents(ele);
					return false;
				 }
			});
		}
		
		
	}
	}
	}.call(this);
	
	
	
	
	/*tinymce.init({
		selector : '#compose',
		menubar: false,
		statusbar: false,
		toolbar: false,
		plugins : "paste",
		format : 'raw',
		setup: function(editor) {
			editor.on('PastePreProcess', function(e) {
				   //strip_tags is a method remove all styles when pated the content. Located in Meta.jsp
				
				  //example: keep bold,italic,underline and paragraphs
				  //e.content = strip_tags( e.content,'<b><u><i><p><h1><h2><h3><h4><h5><h6>' );

				  // remove all tags => plain text
				  e.content = strip_tags( e.content,'' );
				  
				//alert(e.content);
			}); 
	    },

	});

	'elementspath'
	autocomplete=function(){
		
	}
	*/