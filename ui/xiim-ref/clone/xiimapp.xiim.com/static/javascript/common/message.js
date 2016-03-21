/**
 * @author Next Sphere Technologies
 * message javascript file will send message to connected users
 * 
 * This is generic function used across all the modules where ever user want to send message to connected user.
 * Note: This is not used in My Messages module.
 * 
 */


var Message = function(){
	var accessToken =  $("#accessToken_meta").val();
    var languageId = $("#langId_meta").val(); 
    var userId = $("#loggedInUserId-meta").val();
	return {
    	   defaults:{
    		   isFromContactUs:false	
			},
			settings:{
				
			},
			destory:function(){
				$(Message.settings.ele).html('');
				Message.settings = {};
			},
			init:function(options){
				this.destory();
				this.settings = $.extend(this.defaults,options);
	            var element = this.settings.ele;
	            this.staticUI(element);
	            /*var serviceRequestOptions = this.prepareServiceRequest();
	            this.serviceInvocation(serviceRequestOptions);*/
	            this.bindEvents();
			},
              serviceInvocation:function(options){
            	  doAjax.PostServiceInvocation(options);
              },
              prepareServiceRequest:function(){
          		
              },
              successCallBack:function(data){
	            	if(typeof data != undefined){
						 var isSuccess = data['isSuccess'];
						 if(isSuccess == "true"){
							 $("#compose-modal").modal('hide');//closing compose message popup box
							doAjax.displaySuccessMessage('Message sent successfully.');
						 }else{
							 //genrateErrorMessages(data,"","responsemsgcontainer");
						 }
					}

              },
              dynamicUI:function(data){
            	 
            	 
              },
              
             /**
              *  bind operations performed on UI
              */
              bindEvents:function(){
            	  var url = null;
            		var jsonData = null;
            		
            		$('#message').keyup(function(){
            			if(!$('#messageError').hasClass("hide")){
            				$('#messageError').addClass("hide");
            			}
            		});
            		
            	 	$("#sendMessage").click(function(){
            			 var content = $("#message").val();
            			 
            			 if(content == ''){
            				$("#messageError").removeClass('hide');
            			 }else{
            				 $("#messageError").addClass('hide');
            				 var sendMessageURI = '/group/1.0/sendMessage';//$("#sendMessageURI").val();
            				 
            				 url = getModelObject('serviceUrl')+sendMessageURI;
            				 
            				var subject = $("#subjectId").val();
            				//var accessToken = accessToken;
            				//var languageId = languageId;
            				var receipentUsers = Message.settings.recipients;
            				var recipientUserIds=[];
            				if(receipentUsers != undefined && receipentUsers.length == undefined){
            					receipentUsers = [receipentUsers];
            				}
            				for(var i=0;i<receipentUsers.length;i++){
            					recipientUserIds.push(receipentUsers[i].userId);
            				}
            				
            				var jsonArray = {"userId":userId,"langId":languageId,"accessToken":accessToken,"receipentUsers":recipientUserIds ,"messageModel" : [{"subject" :subject,"content" :content}] };
            				jsonData = JSON.stringify(jsonArray);	
            				
							var options ={
							   url:url,
							   data:jsonData,
							   successCallBack:Message.successCallBack,
							   async: true
							};
            				Message.serviceInvocation(options);
            			 }
            		}); 
            	 	
            	 	$("#sendmessagecloseId").click(function(e){
            	 		//
            	 		//$('#send-message-modal').remove();
            	 		 $("#send-message-modal").modal('hide');
            	 	});
            	 	
            	 	$("#sendmessagecancelId").click(function(e){
            	 		//
            	 		$("#receipeintId").val('');
            	 		$("#receipeintName").val('');
            	 		$("#subjectId").val('');
            	 		$("#message").val('')
            	 		 $("#send-message-modal").modal('hide');
            	 	});
            	 	
            	 	$("#confirmation-modal-id").click(function(e){
            	 		var confirmationModelHtml ='<div id="confirmation-modal" class="modal fade">'
  			    		  +'	<div class="modal-dialog">'
  			    		  +'		<div class="modal-content">'
  			    		  +'			<div class="modal-header">'
  			    		  +'				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
  			    		  +'				<h4 class="modal-title">Confirmation</h4>'
  			    		  +'			</div>'
  			    		  +'			<div class="modal-body">'
  			    		  +'				<p class="font-16">If you don\'t save, your changes will be lost.</p>'
  			    		  +'			</div>'
  			    		  +'			<div class="modal-footer">'
  			    		  +'				<button type="button" class="grey-button mar-right-25" id="confirmation-yes-button">Yes</button>'
  			    		  +'				<button type="button" class="def-button" data-dismiss="modal" id="confirmation-no-button">No</button>'
  			    		  +'			</div>'
  			    		  +'		</div>'
  			    		  +'	</div>'
  			    		  +'</div>';
            	 		var html = '<div id="confirmation-container"></div>';
            	 		$(Message.settings.ele).append(html);
  		            $("#confirmation-container").html(confirmationModelHtml); 		 
              	  $('#confirmation-modal').modal({
              		backdrop:'static',
              		show:true,
              		keyboard:true
              	  });
              	$("#confirmation-yes-button").click(function(e){
        	 		alert("clicked on confirm-yes-button");
        	 		//$(Message.settings.ele).html('');
        	 		Message.destory();
        	 	});
              	$('#confirmation-modal').on('hidden.bs.modal',function(e){
              		$("#confirmation-container").html('');
          	    });
              	  
            	 	});
              },
              staticUI:function(element){
            	  var template =  '<div id="compose-modal" class="modal fade">'
	            		  +'	<div class="modal-dialog width-400">'
	            		  +'		<div class="modal-content">'
	            		  +'			<div class=" pad-trbl-12">'
	            		  +'				<div class="font-18px">{{#isFromContactUs}}Contact Us{{/isFromContactUs}}{{^isFromContactUs}}Compose Message{{/isFromContactUs}}<span id="close-popup" class="pad-top-2 pull-right close-sm-icons selected-sm" data-dismiss="modal"></span></div>'
	            		  +'			</div><div class="bottom-border mar-lr-12"></div>'
	            		  +'			<div class="modal-body pad-12">'
	            		  +'				{{#isFromContactUs}}'
	            		  +'				<div class="font-24 min-height-40 width-102per"><span class="pull-right"><a id="sendMessage" href="javascript:void(0);"><i class="send-sm-icons selected-sm"></i></a>&nbsp; <a href="#" id="confirmation-modal-id" role="button" class="btn hide" data-toggle="modal"><i class="hide close-sm-icons selected-sm"></i></a></span></div>'
	            		  +'                {{/isFromContactUs}}'
	            		  +'				{{^isFromContactUs}}'
	            		  +'				<div class="font-24 min-height-40 width-102per"><span class="pull-left font-15px">To:</span><span class="pull-right"><a id="sendMessage" href="javascript:void(0);"><i class="send-sm-icons selected-sm"></i></a>&nbsp; <a href="#" id="confirmation-modal-id" role="button" class="btn hide" data-toggle="modal"><i class="close-sm-icons selected-sm"></i></a></span></div>'
	            		  +'				{{/isFromContactUs}}'
	            		  +'                {{#recipients}}'
	            		  +'				{{#isFromContactUs}}<div class="float-left new_exskill hide" id="new_exskill_skill_0"><img src="{{photoId}}" class="img-sm-80-circle"/>&nbsp;{{name}}<!-- <a href="javascript:void(0)" id=""><b class="exskill_remove" id="exskill_remove_0">X</b></a> --></div>{{/isFromContactUs}}'
	            		  +'				{{^isFromContactUs}}{{#photoId}}<div class="mar-right-7 float-left"><img src="{{photoId}}" class="img-sm-80-circle"/></div>{{/photoId}}'
	            		  +'				<div class="clearfix span75 float-left pad-top-25">'                                     
	            		  +'					<div class="font-15  pull-left ">{{name}}</div>'
	            		  +'				</div>'
	            		  +'                {{/isFromContactUs}}'
	            		  +'                {{/recipients}}'
	            		  +'				<div class="pad-top-10 clear-float font-20 text-left"><input class="form-control" placeholder="Enter Subject" type="text" name="subjectId" maxlength="100" id="subjectId"/></div>'
	            		  +'					<div class="pad-top-10">'
	            		  +'                        <div id="messageError" class="validation-message-sytle hide">Message Body empty</div>'
	            		  +'						<textarea id="message" class="form-control" rows="7" placeholder="Enter your message"></textarea>'                         
	            		  +'					</div>'
	            		  +'			</div>'
	            		 /* +'			<div class="modal-footer">'
	            		  +'				<!--<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
	            		  +'				<button type="button" class="btn btn-primary">Save changes</button>-->'
	            		  +'			</div>'*/
	            		  +'		</div>'
	            		  +'	</div>'
	            		  +'</div>';
            	  var html = Mustache.to_html(template,Message.settings);
            	  //$(element).append(html);
            	  $('#compose-modal').remove();
            	  $('#modal-box-wrapper').append(html);
            	  var optionsForModel ={
            			  backdrop:'static',
            		show:true,
            		keyboard:true
            	  };
            	  
            	  $('#compose-modal').modal(optionsForModel);
            	  $('#compose-modal').on('shown.bs.modal',function(e){
            	  });
            	  $('#compose-modal').on('hidden.bs.modal',function(e){
            		  $(Message.settings.ele).html('');
            	  });
            	  
            	  //sendMessage.send(options.receipientId,options.receipientName,options.receipientPhotoId);  
              }
       };
}.call(this);