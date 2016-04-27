/**
 * @author Next Sphere Technologies
 * Confirmation javascript file will used all over the application.
 * 
 * This file have very generic function like
 * showing confirmation popup 
 * 
 * 
 */


var Confirmation = function(){
	var accessToken =  $("#accessToken_meta").val();
    var languageId = $("#langId_meta").val(); 
    var userId = $("#loggedInUserId-meta").val();
    var elementContainer;
	return {
    	   defaults:{
    		   ele:'body',
    		   fromAnotherModal:false
			},
			settings:{
				
			},
			destory:function(){
				
			},
			init:function(options){
				this.destory();
				this.settings={};
				this.settings = $.extend(this.defaults,options);
	            var element = this.settings.ele;       
	            elementContainer = element.substring(1);
	            this.staticUI(element);
	            this.bindEvents();
	          
			},
             /**
              *  bind operations performed on UI
              */
              bindEvents:function(){
            	  $("#"+elementContainer+"confirmation-yes-button").click(function(e){
          	 		if($.isFunction(Confirmation.settings.onYes)){
          	 			Confirmation.settings.onYes(e);
          	 			$("#"+elementContainer+"confirmation-modal").modal('hide');
          	 			$('body').removeClass('modal-open');
          	 		}
          	 	  });
            	  
            	  if(Confirmation.settings.saveSubsection){
            		  $("#confirmation-no-button").off('click').click(function(e){
                	 		if($.isFunction(Confirmation.settings.onNo)){
                	 			Confirmation.settings.onNo(e);
                	 		}
                	 });
            	  }
	             /* $('#confirmation-modal').on('hidden.bs.modal',function(e){
	            	$("#confirmation-container").html('');
	        	  });*/
              },
              staticUI:function(element){
             
              	if (typeof Confirmation.settings.yesLabel == 'undefined' )
              		Confirmation.settings.yesLabel = "Yes" ;
              		
              	if (typeof Confirmation.settings.noLabel == 'undefined' )
              		Confirmation.settings.noLabel = "No" ;
              		
              	if (typeof Confirmation.settings.title == 'undefined' )
              		Confirmation.settings.title = "Confirmation" ;
              		
            	  var confirmationObject=this;
            	  var confirmationModelHtml ='<div id="'+elementContainer+'confirmation-modal" class="modal fade">'
			    		  +'	<div class="modal-dialog ">'
			    		  +'		<div class="modal-content ">'
			    		  +'			<div class="modal-header pad-10">'
			    		  +'				<div class="modal-title font-30" >'+Confirmation.settings.title +'<span class="mar-top-10 pull-right close-sm-icons selected-sm" data-dismiss="modal"></span> </div>'
			    		  +'			</div>'
			    		  +'			<div class="modal-body">'
			    		  +'				<p class="font-15px">'+Confirmation.settings.message+'</p>'
			    		  +'			</div>'
			    		  +'			<div class="modal-footer pad-10">'
			    		  +'				<button type="button" class="def-button mar-right-25" id="'+elementContainer+'confirmation-yes-button">'+ Confirmation.settings.yesLabel+'</button>'
			    		  +'				<button type="button" class="grey-button" data-dismiss="modal" id="confirmation-no-button">'+Confirmation.settings.noLabel+'</button>'
			    		  +'			</div>'
			    		  +'		</div>'
			    		  +'	</div>'
			    		  +'</div>';
        	 	/**	var html = '<div id="'+elementContainer+'confirmation-container"></div>';
        	 	  $(element).append(html); */
        	 	  var ele_id = $(element).attr('id');
        	 	  var html = '<div id="'+ele_id+'"><div id="'+elementContainer+'confirmation-container"></div></div>';
        	 	  if($('#modal-box-wrapper #'+ele_id+'').length) $('#modal-box-wrapper #'+ele_id+'').remove();
        	 	  $('#modal-box-wrapper').append(html);
       	 	 
        	 	  $("#"+elementContainer+"confirmation-container").html(confirmationModelHtml); 		 
             	  $('#'+elementContainer+'confirmation-modal').modal({
             		backdrop:'static',
             		show:true,
             		keyboard:true
             	  });
            	  
             	  $('#'+elementContainer+'confirmation-modal').on('shown.bs.modal',function(e){
            	  });
             	  $('#'+elementContainer+'confirmation-modal').on('hidden.bs.modal',function(e){
            		  $("#"+elementContainer+"confirmation-container").html('');
            		  if(confirmationObject.settings.fromAnotherModal&&$('.modal.fade.in').length>0){//Added to handle Background Scroll When The Confirmation Is Used From The Anorther Modal
            			  $('body').addClass('modal-open');
            		  }else{
            			  $('body').removeClass('modal-open');
            		  }
            	  });
            	  
            	  //sendMessage.send(options.receipientId,options.receipientName,options.receipientPhotoId);  
              }
       };
}.call(this);