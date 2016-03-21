/**
 * @author Next Sphere Technologies
 * Change Password and Change Email Widget under Privacy (2x2) window.
 * 
 * Change Password and Change Primary Email(2x2) widget will perform change request for password and email. 
 * 
 */


var scriptElement = document.getElementsByTagName("script");
var baseElement = scriptElement[scriptElement.length - 1].parentNode;
var unlockedPassword = false;
var keys;
var isEditPrimaryEmail = false;
var isAddNewSecondaryEmail = false;
var isDeleteSecondaryEmail = false;
var isSwitchPrimarySecondaryEmails = true;
var shiftingemailclick = false;

var iseditclicked = '';

var changepassword = function(){
	var isPwdTab = true;
	var isEmailTab = false;
	return {
		settings:{

		},
		templates:{
			
		},
		defaults:{
			ele:baseElement
		},
		init:function(options){
			this.settings.secondaryEmailChange=false;
			this.settings = $.extend(this.defaults,options);
			var element = this.settings.ele;
			 isPwdTab = this.settings.isPwdTab;
			 isEmailTab = this.settings.isEmailTab;
			this.staticUI(element);
			this.bindEvents();
		},
		serviceInvocation:function(options){
		},
		prepareServiceRequest:function(){
			
		},
		privacyFailureCallBack:function(requestInfo,data){
			$("#confirmNewEmailBtn").prop('disabled', false);
			var validations = data['validationResponse'];
          	var messages = data['result']['messages'];
          	var html='';
          	var errorMessages = '';
          	if(validations){
          		var validation= validations['validation'];
          		if(validations['validation'].length == undefined){
          			validation = [validation];
          		}
          		for(var i=0;i<validation.length;i++){
          			errorMessages+=validation[i].message+". ";
          		}
          	} else if(messages){
          		if(messages.length == undefined){
          			messages = [messages];
          		}
          		for(var i=0;i<messages.length;i++){
          			errorMessages+=messages[i].message.description;
          		}
          	}
          	
			if(changepassword.settings.secondaryEmailChange){
				$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
				$("#email-changeemailinfo").text(errorMessages);	
				$("#email-changeemailinfo").addClass("red");
				
			}else if(changepassword.settings.primaryEmailEdit){
				$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
				$("#email-changeemailinfo").text(errorMessages);	
				$("#email-changeemailinfo").addClass("red");
			}else if(changepassword.settings.unlockuserpassword){
				if(isPwdTab){	
					$('#informationmessageplaceholderid').addClass('pad-top-118');
					$("#editpasswordinfoiconid").addClass('hide');
					$("#imageandinfoimgid").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
					$("#errormessage-placeholder").text(errorMessages);					
				}else if(isEmailTab){
					$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
					$("#email-changeemailinfo").text(errorMessages);	
					$("#email-changeemailinfo").addClass("red");
					
				}
			}else if($("#privacy-policy-modal").length){
				if(isPwdTab){
					$('#informationmessageplaceholderid').addClass('pad-top-118');
					$("#editpasswordinfoiconid").addClass('hide');
					$("#imageandinfoimgid").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
					$("#errormessage-placeholder").text(errorMessages);
				}else if(isEmailTab){
					$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
					$("#email-changeemailinfo").text(errorMessages);	
					$("#email-changeemailinfo").addClass("red");					
					
				}
			}
		},
		//pwd:::
		successCallBack:function(requestInfo,data){
			$(".pleaseWaitProcessingDialogCommon").modal('hide');
			var results = data['result'];
			var status = results['status'];
			if(status == 'true'){
				$("#change_pwd_editmode_div").html("");
				$('#failure_displayErrors_privacySettings').hide();
				$('#sucessPwd').show();
				$("#sucessPwd").delay(5000).fadeOut('slow');
				$("#input_def_pwd").val("");
                        $("#pwd").val("");
                        $("#input_confirm_pwd").val("");
                        
				$(".change-password-edit-mode").addClass('hide');
				$('.privacy-information').removeClass('hide');
				$(".Success-Ok-Button").removeClass('hide');// password success message ok button visible
				$("#ok_confirmation").removeClass('hide');
				
				
				$("#editpasswordinfoiconid").removeClass('hide');
				$("#imageandinfoimgid").removeClass('warning-sm-icons').addClass('information-sm-icons');// attr("src", contextPath+"/static/pictures/Information_E30.png");
				$("#editpasswordinfoiconid").text('Password changed! A notification email has been sent to your primary email.');

				
			}
			$("#informationmessageplaceholderid").removeClass('pad-top-118');
			$("#informationmessageplaceholderid").addClass('pad-bot-67');
			//$("#userprivacymodelcontentid").addClass('height-305');//min-height-322
			$("#okconfirmationbtnid").removeClass("mar-top-175");
		},
		//pwd:::
		ispasswordvalidsuccessCallBack:function(data){

			var isPasswordValid = data['isValidPassword'];
			var passwordSplCharCheck = data['checkSplChar'];

			if (isPasswordValid == false && passwordSplCharCheck == true) {
				
				$("#editpasswordinfoiconid").addClass('hide');
				$("#imageandinfoimgid").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
				$("#errormessage-placeholder").text($("#splCharPassword").html());
				
				
				$("#save_chang_pwd").attr("disabled","disabled");
			} else if (isPasswordValid == true && passwordSplCharCheck == false) {
				
				$("#editpasswordinfoiconid").addClass('hide');
				$("#imageandinfoimgid").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
				$("#errormessage-placeholder").text($("#isValidPassword").html());
				
				$("#save_chang_pwd").attr("disabled","disabled");
			} else if (isPasswordValid == false && passwordSplCharCheck == false) {
				
				$("#editpasswordinfoiconid").removeClass('hide');
				$("#imageandinfoimgid").removeClass('warning-sm-icons').addClass('information-sm-icons');// attr("src", contextPath+"/static/pictures/Information_E30.png");
				$("#errormessage-placeholder").text('');				
				
				$("#save_chang_pwd").removeAttr('disabled');
			}

		},
		deleteEmailSuccessCallBack:function(requestInfo,data){
			$("#confirmNewEmailBtn").prop('disabled', false);
			var results = data['result'];
			var status = results['status'];
			if(status == 'true'){
				changepassword.updateEmailIdInSession(true,"secondary");
			}
		},
		switchEmailSuccessCallBack:function(requestInfo,data){
			$("#confirmNewEmailBtn").prop('disabled', false);
			var results = data['result'];
			var status = results['status'];
			if(status == 'true'){
				var userObj =  data['userModel']; 
				changepassword.updateUserObjectInSession(userObj,"switchEmail");
			}
		},
		updateEmailIdInSessionSuccessCallBack:function(requestInfo,data){
			if(data == true){
				if(requestInfo.newPrimaryEmailId == true){
					if($('input:radio[name=email]:checked').attr('id') == "primaryEmailRadio"){
						$("#secondaryemailsectiondiv").html("");
						$("#secondaryemailid").val("");
						changepassword.display_email_success_message("Email address removed");
					}else if($('input:radio[name=email]:checked').attr('id') == "secondaryEmailRadio"){
						$("#primaryemailsectiondiv").html("");
						$("#secondaryemailid").val("");
						changepassword.display_email_success_message("Email address removed");
					}
					$(".addNew_email").removeClass('hide');
				}else{
					if(requestInfo.emailType == "secondary"){
						$("#secondaryemailid").val(requestInfo.newPrimaryEmailId);
						if($('input:radio[name=email]:checked').attr('id') == "primaryEmailRadio"){
							$("#secondaryemailsectiondiv").html("");
							$("#secondaryemailsectiondiv").append('<div class="col-xs-8"><label class="display-table mar-bottom-20">'
									+' <input type="radio" id="secondaryEmailRadio" name="email" value="secondaryEmail"  />'
									+' <span class="check"></span>'
									+' <a href="mailto:"'+requestInfo.newPrimaryEmailId+' class="secondaryemailval">'+requestInfo.newPrimaryEmailId+'</a>'
									+' </label></div>'
									+' <div class="col-xs-4" id="secondaryEmailDiv"><span class="minus-sm-icons mar-right-12" onclick="changepassword.minusiconclick()"></span></div>');
						}else if($('input:radio[name=email]:checked').attr('id') == "secondaryEmailRadio"){
							$("#primaryemailsectiondiv").html("");
							$("#primaryemailsectiondiv").append('<div class="col-xs-8"><label class="display-table mar-bottom-20">'
									+' <input type="radio" id="secondaryEmailRadio" name="email" value="secondaryEmail"  />'
									+' <span class="check"></span>'
									+' <a href="mailto:"'+requestInfo.newPrimaryEmailId+' class="secondaryemailval">'+requestInfo.newPrimaryEmailId+'</a>'
									+' </label></div>'
									+' <div class="col-xs-4" id="secondaryEmailDiv"><span class="minus-sm-icons mar-right-12" onclick="changepassword.minusiconclick()"></span></div>');
						}
						$(".addNew_email-block").addClass('hide');
						$(".addNew_email").addClass('hide');
						$(".plus-icons").removeClass('selected-sm');
						$(".edit-sm-icons").removeClass('selected-sm');
						
						$("#email-changeemailicon").removeClass('warning-sm-icons').addClass('information-sm-icons');// attr("src", contextPath+"/static/pictures/Information_E30.png");
						$("#email-changeemailinfo").text("The Secondary Email Will be Used to Support Password Change and Reset");
						$("#email-changeemailinfo").removeClass("red");
						
						$("#new_secondary_email_id").val("");
						$("#confirm_new_secondary_email_id").val("");
						changepassword.display_email_success_message("Secondary email added to your account. A notification email has been sent to your primary email.");
					}
					changepassword.bindEvents();
				}
			}
		},
		updateEmailSuccessCallBack:function(requestInfo,data){
			var results = data['result'];
			var status = results['status'];
			if(status == 'true'){
				var userObj =  data['userModel']; 
				changepassword.updateUserObjectInSession(userObj,"updateEmail");
			}
		},
		unlocksuccessCallBack:function(requestInfo,data){
			unlockedPassword = true;
			if(isPwdTab){	
				changepassword.unlockedpwdcontentinit();
			}else if(isEmailTab){
				$(".Success-Ok-Button-email").addClass('hide');
				$("#ok_confirmation_email").addClass('hide');
				$(".privacy-information").addClass('hide');
				if(unlockedPassword){
					changepassword.unlockedemailcontentinit();
				}else{
					$(".change-password-edit-mode").addClass('hide');
					$("[class$='-mode']").addClass('hide');
					$(".addNew_email-block").addClass('hide');
					$(".change-email-view-mode").fadeIn(700);			
					$(".change-email-view-mode").removeClass('hide');	
					changepassword.changeemailviewmodediv();
					$(".privacy-email-information").removeClass('hide');
					$(".privacy-information-email").addClass('hide');
					$(".privacy-email-information span").text('Unlock to Manage Emails');	
					$(".privacy-information").removeClass('hide');
					$(".privacy-information").removeClass('red');
					$(".privacy-information span").text('Unlock to Manage Emails');
					
				}
				$(this).prevAll().find("span").removeClass("active");
				$(this).find("span").addClass("active");
			}
			$('.lock-popover').addClass('unlock-icon');
			$('.lock-popover').removeClass('lock-enabled');
			$('.lock-popover').not(this).popover('hide');	
			$(".lock-text").html("Lock to Prevent <br/>Changes");
			$(".change-password-edit-mode").removeClass('hide');
			$(".change-email-view-mode").addClass('hide');
			$(".privacy-information").addClass('hide');// unlock to change password hint hide
			$(".change-email-view-edit-mode").removeClass("hide");
			$('.popover').addClass('hide');
			$("#pwd").val("");
			$("#input_confirm_pwd").val("");
		},
		createNewSecondaryEmailSuccessCallBack:function(requestInfo,data){
			$("#confirmNewEmailBtn").prop('disabled', false);
			var results = data['result'];
			var status = results['status'];
			if(status == 'true'){
				isAddNewSecondaryEmail = false;
				isSwitchPrimarySecondaryEmails = true;
				$("#secondaryemailid").val($("#new_secondary_email_id").val());
				$("#secondaryemailsectiondiv").removeClass('hide');
				changepassword.updateEmailIdInSession($("#new_secondary_email_id").val(),"secondary");
			}
		},
		unlockfailureCallBack:function(data){

		},
		errorCallBack:function(request,status,error){

		},
		dynamicUI:function(element,data){

		},

		bindEvents:function(){
			
			
/*			$('#primaryEmailRadio').off('click').bind("click",function() {
				$(".privacy-information").addClass('hide');
			});
			*/
			
			$("#secondaryEmailRadioSpanid, #primaryEmailRadioSpanid").off('click').click(function(){
				
				isEditPrimaryEmail = false;
				isAddNewSecondaryEmail = false;
				isDeleteSecondaryEmail = false;
				isSwitchPrimarySecondaryEmails = true;
				iseditclicked = '';
				
				if($("#editprimaryemailspanid").hasClass("selected-sm")){
					$("#editprimaryemailspanid").removeClass("selected-sm");
				}
				
				$("#edit_primary_email_div").html('');
				
				$("#secondaryemailsectiondiv").addClass("pad-top-30");
				$("#secondaryemailsectiondiv").removeClass("pad-top-5");
				
				if($("#secondaryemailsectiondiv").hasClass("clear-float")){
					$("#secondaryemailsectiondiv").addClass("clear-float");
				}
				
				$("#deletesecemailid").removeClass("pad-top-10");
				$("#deletesecemailid").removeClass("clear-float");
				
				
				if($(this).attr("id") == "secondaryEmailRadioSpanid"){
					shiftingemailclick = true;
					var pri = $("#primaryEmailDiv").html();
					var sec = $("#secondaryEmailDiv").html();
					
					if($('input:radio[name=email]:unchecked').attr('id') == "secondaryEmailRadio"){
						$("#secondaryEmailDiv").html(pri);
						$("#primaryEmailDiv").html(sec);
					}
					$("#email-changeemailinfo").removeClass("red");
					$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
					$("#email-changeemailinfo").text("Login ID Will be the New Primary Email after the Switch");					
				}
					if($(this).attr("id") == "primaryEmailRadioSpanid"){
					shiftingemailclick = false;
					var pri = $("#primaryEmailDiv").html();
					var sec = $("#secondaryEmailDiv").html();
					
					if($('input:radio[name=email]:unchecked').attr('id') == "primaryEmailRadio"){
						$("#primaryEmailDiv").html(sec);
						$("#secondaryEmailDiv").html(pri);
					}
					$("#email-changeemailinfo").removeClass("red");
					$("#email-changeemailicon").removeClass('warning-sm-icons').addClass('information-sm-icons');// attr("src", contextPath+"/static/pictures/Information_E30.png");
					$("#email-changeemailinfo").text("Edit to change or Use Radio Button to Switch the Primary Email");					
				}
			});
			
			
			

			
			if ( $("#divedit_primary_email_section_divID").is(":visible")) {
					$("#confirmcancelbtnsemailid").addClass("pad-top-40");
					$("#secondaryemailsectiondiv").removeClass("pad-top-30");
					$("#secondaryemailsectiondiv").addClass("pad-top-5");
					
					
					if($("#addnewemailplusiconid").is(":visible")){
						$("#changeemaileditmode-sectiondivid").addClass("pad-bot-35");
						$("#changeemaileditmode-sectiondivid").removeClass("pad-bot-15");
						
						$("#confirmcancelbtnsemailid").addClass("pad-top-45");
						$("#confirmcancelbtnsemailid").removeClass("pad-bot-75");
						
						
					}else{
						$("#changeemaileditmode-sectiondivid").removeClass("pad-bot-35");
						$("#changeemaileditmode-sectiondivid").addClass("pad-bot-15");
						
						$("#confirmcancelbtnsemailid").removeClass("pad-top-45");
					}
					

			}
			
			
			$("#ok_confirmation, .password-tab, .email-tab").click(function(){
					shiftingemailclick = false;
				//if($("#userprivacymodelcontentid").hasClass("height-305")){
					//$("#userprivacymodelcontentid").removeClass('height-305');
					$("#informationmessageplaceholderid").addClass('pad-top-118');
					$("#informationmessageplaceholderid").removeClass('pad-bot-67');					
				//}
			});
			
			
			$(".popover_display a").popover({
				trigger:"hover focus",
				placement : 'right'
			});

			$('input:radio[name=email]').off('click').bind("click",function() {
				isEditPrimaryEmail = false;
				isAddNewSecondaryEmail = false;
				isDeleteSecondaryEmail = false;
				isSwitchPrimarySecondaryEmails = true;
				$(".edit-sm-icons").removeClass('selected-sm');
				$(".minus-sm-icons").removeClass('selected-sm');
			});

			//Lock(email and pwd)::
			$('.lock-popover').popover({
				'html' : true,
				placement: 'left',
				//container: 'body',

				content:'<div class="changepwd-popover"><span class="font-13 position-relative top-minus-4">Enter Password to Unlock</span>'
						+'<div href="javascript:void(0);" class="close password-popover-close" onclick="changepassword.colosePopover(event)">&times;</div>'
						+'<div class="z-index-1050">'
						+'		<input class="form-control" type="password" autofocus id="password-field" onkeypress="changepassword.testFunction(event)"/>'
						+'		<span class="validationError red pull-right  pad-top-5 emptyPwdField hide">Field cannot be empty.</span>'
						+'</div></div>',
				template: '<div class="popover" style="top: 41px;left: 110.933px;"><div class="arrow hide"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
			});	
			//Lock(email and pwd)::
			$('.lock-popover').on('click', function (e) {
				if(!$('.lock-popover').hasClass('unlock-icon')){
					
					$('.lock-popover').popover('show');
					
					changepassword.testFunction
					//$('.lock-popover').not(this).popover('hide');
				
					$(".popover").removeClass('hide');
					$(".popover").removeClass('fade');
					$(".popover").removeClass('in');
					
					$(this).removeClass('lock-enabled');
					$(this).addClass('lock-active');	
					$("#password-field").focus();
				}else{
					$('.lock-popover').popover('hide');
				}
			});
			//pwd:::
			$(".change-pwd-close-button").off('click').click(function(){
				$("#input_def_pwd").val("");
				$("#pwd").val("");
				$("#input_confirm_pwd").val("");
				$("#isValidPassword").hide();
				$("#splCharPassword").hide();
			});
			//common
			$(".popover_display a").popover({
				trigger:"hover focus",
				placement : 'bottom'
			});
			//pwd:::
			/**
			 * password validation to check if the password entered is in valid format or not.
			 */
			$("#pwd").off('change').change(function() {
				var password = $("#pwd").val();
				var emailId = $('#primaryemailid').val();
				var fname = $("#firstName").val();
				var lname = $("#lastName").val();
				password = password.trim();
				if(password == ''){
					$("#isValidPassword").hide();
					$("#splCharPassword").hide();
				}
				var changepwdRequestoptions = {
						url: contextPath+'/home/ispasswordvalid',
						data:{
							isPrivacySettings:true,
							password:password,
							emailId:emailId,
							firstName:fname,
							lastName:lname
						},
						parentId:"change-email-edit-mode",
						successCallBack:changepassword.ispasswordvalidsuccessCallBack,
						//failureCallBack:changepassword.privacyFailureCallBack,
						async:false
				};
				doAjax.ControllerInvocation(changepwdRequestoptions);

			});

			$("#ok_confirmation").off('click').click(function(){
				//changepassword.closePopupForPrivacy();
				/*if($("#passwordtabspanid").hasClass("active")){
					$(".password-tab").trigger("click");
				}else*/
				if($("#emailtabspanid").hasClass("active")){
					$(".email-tab").trigger("click");
				}else{
					$(".password-tab").trigger("click");
				}
			});
			$("#ok_confirmation_email").off('click').click(function(){
				//changepassword.closePopupForEmailPrivacy();
				/*if($("#passwordtabspanid").hasClass("active")){
					$(".password-tab").trigger("click");
				}else*/
				if($("#emailtabspanid").hasClass("active")){
					$(".email-tab").trigger("click");
				}else{
					$(".password-tab").trigger("click");
				}
				
				e.stopPropagation();
			});
			$("#pwd_cancel_click").click(function(){
				changepassword.closePopupForPrivacy();
			});
			$("#email-cancel-btn").click(function(){
				changepassword.closePopupForPrivacy();
			});
			$("#close-popup").click(function(){
				changepassword.closePopupForPrivacy();
			});
			/* Privacy Policy Password and Email Tab*/
			$(".password-tab").off('click').click(function(){
				isEmailTab = false;
				isPwdTab = true;
				$(".privacy-information").removeClass('red');
				if(unlockedPassword == true){
					$(".change-password-edit-mode").removeClass('hide');
					$(".change-email-view-mode").addClass('hide');
					$(".change-email-edit-mode").addClass('hide');
					$("#ok_confirmation").addClass('hide');
					$("#ok_confirmation_email").addClass('hide');
					changepassword.unlockedpwdcontentinit();
					$(".privacy-information").addClass('hide');
				}else{
					
					var infomessageplholderhtml = jQuery("#userprivacy-infomessage-div").html();
					
					var htmlData = HTMLUIElements.contexPathStatic();
					
					$("#infomessage-placeholderid").html(Mustache.to_html(infomessageplholderhtml,htmlData));					
					
					$(".change-password-form").fadeIn(700);
					$(".change-password-form").removeClass('hide');	
					$("[class$='-mode']").addClass('hide');
					$(".change-email-view-mode").addClass('hide');
					$(".change-email-edit-mode").addClass('hide');
					$(".privacy-information").removeClass('hide');
					$(".privacy-information").removeClass('red');
					
					$('.privacy-information').addClass('pad-top-118');
					$('.privacy-information').removeClass('pad-top-47');
					
					$(".privacy-information span").text('Unlock to Change Password');
					$("#ok_confirmation").addClass('hide');
				}
				$(this).prevAll().find("span").removeClass("active");
				$(this).nextAll().find("span").removeClass("active");
				$(this).find("span").addClass("active");
			});
			$(".email-tab").off('click').click(function(){
				isEmailTab = true;
				isPwdTab = false;
				$(".privacy-information").removeClass('red');
				$(".Success-Ok-Button-email").addClass('hide');
				$("#ok_confirmation_email").addClass('hide');
				$(".privacy-information").addClass('hide');
				if(unlockedPassword == true){
					changepassword.unlockedemailcontentinit();
				}else{
					$(".change-password-edit-mode").addClass('hide');
					$("[class$='-mode']").addClass('hide');
					$(".addNew_email-block").addClass('hide');
					$(".plus-icons").removeClass('selected-sm');
					$(".edit-sm-icons").removeClass('selected-sm');
					$(".change-email-view-mode").fadeIn(700);			
					$(".change-email-view-mode").removeClass('hide');	
					changepassword.changeemailviewmodediv();
					
					$('.privacy-information').removeClass('pad-top-118');
					$('.privacy-information').addClass('pad-top-47');
					
					$("#changeemailviewmodeid").addClass("hide");
					$(".privacy-email-information").removeClass('hide');
					$(".privacy-information-email").addClass('hide');
					$(".privacy-email-information span").text('Unlock to Manage Emails');	
					$(".privacy-information").removeClass('hide');
					$(".privacy-information").removeClass('red');
					$(".privacy-information span").text('Unlock to Manage Emails');
					
				}
				$(this).prevAll().find("span").removeClass("active");
				$(this).find("span").addClass("active");

			});
			$(".addNew_email_plus_icon").click(function(){
				
				isEditPrimaryEmail = false;
				isAddNewSecondaryEmail = true;
				isDeleteSecondaryEmail = false;
				isSwitchPrimarySecondaryEmails = false;
				$(".plus-icons").addClass('selected-sm');
				$(".edit-sm-icons").removeClass('selected-sm');
				$(".addNew_email-block").fadeIn(700);
				$(".edit_primary_email-block").addClass('hide');
				$("#edit_primary_email_section").addClass('hide');
				$(".addNew_email-block").removeClass('hide');
				
				if(!$("#addnewemailplusiconid").hasClass("mar-top-10")){
					$("#addnewemailplusiconid").addClass("mar-top-10");
				}
				
				
				$(".addNew_email-block").html(jQuery("#userprivacy-addnewemailblock").html());
				
				if($("#addnewemailblockid").hasClass("pad-bot-75")){
					$("#addnewemailblockid").removeClass("pad-bot-75");
				}
				$("#confirmcancelbtnsemailid").addClass("pad-top-40");
				$("#email-changeemailicon").removeClass('warning-sm-icons').addClass('information-sm-icons');// attr("src", contextPath+"/static/pictures/Information_E30.png");
				$("#email-changeemailinfo").text("The Secondary Email Will be Used to Support Password Change and Reset");
				$("#email-changeemailinfo").removeClass("red");
				
				$("#new_secondary_email_id").focus();
				
			}); 
			$(".remove-block").click(function(){
				$(this).toggleClass("lightbluebg");
			});
			$(".remove-block").click(function(){
				$(this).addClass("lightbluebg");
			});
			$(".minus-icon").click(function(){
				$(this).parent().remove();
			});

			$('#input_confirm_pwd').change(function(e) {
					var password = encodeURIComponent($("#pwd").val());
					password = password.trim();
					var confirmPassword = encodeURIComponent($("#input_confirm_pwd").val());
					if(password.localeCompare(confirmPassword)){
						$("#editpasswordinfoiconid").addClass('hide');
						$("#imageandinfoimgid").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
						$("#errormessage-placeholder").text("Password fields do not match, try again.");
					}
				});
			
			$("#save_chang_pwd").off('click').bind('click',function(){
				var password = encodeURIComponent($("#pwd").val());
				var confirmPassword = encodeURIComponent($("#input_confirm_pwd").val());
				
				if(password == ''){
					$("#editpasswordinfoiconid").addClass('hide');
					$("#imageandinfoimgid").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
					$("#errormessage-placeholder").text("Password required");					
				}else if(confirmPassword == ''){
					$("#editpasswordinfoiconid").addClass('hide');
					$("#imageandinfoimgid").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
					$("#errormessage-placeholder").text("Confirm password required");					
				}
				
				password = password.trim();
				
				if(!password.localeCompare(confirmPassword)){
					changepassword.saveUserPasswordPrivacySettings();
				}
			});
			
			
			$("#edited_primary_email, #conf_edited_primary_email").keyup(function(e){
				
				if(e.which == 13) {
					var oldEmail = $("#edited_primary_email").val();
					var newEmail = $("#conf_edited_primary_email").val();
					var accessToken = $("#accessToken_meta").val();
					var userId = $("#loginUserId-meta").val();
					
					var isvalid = changepassword._validateChangeEmail(oldEmail,newEmail);
					if(isvalid){
						changepassword.changeprimaryEmailServiceInvoke(oldEmail,newEmail,accessToken,userId);
					}else{
						return isvalid;
					}

				}
			});
			
			$("#new_secondary_email_id, #confirm_new_secondary_email_id").keyup(function(e){
				
				if(e.which == 13) {
					var oldEmail = $("#new_secondary_email_id").val();
					var newEmail = $("#confirm_new_secondary_email_id").val();
					var accessToken = $("#accessToken_meta").val();
					var userId = $("#loginUserId-meta").val();
					
					var isvalid = changepassword._validateChangeEmail(oldEmail,newEmail);
					if(isvalid){
						changepassword.changeprimaryEmailServiceInvoke(oldEmail,newEmail,accessToken,userId);
					}else{
						return isvalid;
					}

				}
			});
			
			
			
			$("#confirmNewEmailBtn").off('click').bind("click",function(e) {
				e.preventDefault();
				$(this).prop('disabled', true);
				//Primary email section edit 
				if(isEditPrimaryEmail){
					var oldEmail = $("#loginUserId-meta").val();
					var newEmail = $("#edited_primary_email").val();
					var newEmail_conf = $("#conf_edited_primary_email").val();
					var accessToken = $("#accessToken_meta").val();
					var userId = $("#loggedInUserId-meta").val();
					
					var isvalid = changepassword._validateChangeEmail(newEmail,newEmail_conf);
					if(isvalid){
						changepassword.changeprimaryEmailServiceInvoke(oldEmail,newEmail,accessToken,userId);
					}else{
						$(this).prop('disabled', false);
						return isvalid;
					}

				}else if(isDeleteSecondaryEmail){
					var accessToken = $("#accessToken_meta").val();
					var userId = $("#loggedInUserId-meta").val();
					var email = $("#secondaryemailid").val();//$(".secondaryemailval").html();
					email = email.trim();
					var headers = {
							accessToken:accessToken,
							langId:"1"
					};
					var serviceUrl = getModelObject('serviceUrl')+"/user/1.0/deleteEmail"+'?userId='+userId+'&email='+email;
					if(email != '' ){

						var deleteEmailOptions = {
								ischangepasswordflag:true,
								url:serviceUrl,
								headers:headers,
								parentId:"change-email-edit-mode",
								requestInfo:{deleteEmailOptions:true},
								successCallBack:changepassword.deleteEmailSuccessCallBack,
								failureCallBack:changepassword.privacyFailureCallBack,
								async:true
						};
						doAjax.PutServiceInvocation(deleteEmailOptions);
					}else{
					}
				}else if(isAddNewSecondaryEmail){
					
					var accessToken = $("#accessToken_meta").val();
					var userId = $("#loginUserId-meta").val();
					
					var oldEmail = $("#new_secondary_email_id").val();
					var newEmail = $("#confirm_new_secondary_email_id").val();

					var isvalid = changepassword._validateChangeEmail(oldEmail,newEmail);
					if(isvalid){
						changepassword.addNewSecondaryEmailServiceInvoke(oldEmail,newEmail,accessToken,userId);
					}else{
						$(this).prop('disabled', false);
						return isvalid;
					}
					
					
					
					
				}else if(isSwitchPrimarySecondaryEmails){
					var val = $('input:radio[name=email]:checked').val();
					var primary1email= $("#primaryemailid").val();//$(this).attr('primaryemail');
					var secondaryemail= $("#secondaryemailid").val();//$(this).attr('secondaryemail');
					var object = $(this);
					var emailType= $(this).attr('emailType');
					var primaryEmail = "";
					var notificationEmail = "";
					primaryEmail = primary1email;
					notificationEmail = secondaryemail;
					var accessToken = $("#accessToken_meta").val();
					var userId = $("#loggedInUserId-meta").val();
					
					if($('input:radio[name=email]:checked').attr('id') == "primaryEmailRadio"){
						$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
						$("#email-changeemailinfo").text("Selected email id is already primary email id.");	
						$("#email-changeemailinfo").addClass("red");
						
					}else if($('input:radio[name=email]:checked').attr('id') == "secondaryEmailRadio"){
						var headers = {
								accessToken:accessToken,
								langId:"1"
						};
						var serviceUrl = getModelObject('serviceUrl')+"/user/1.0/switchEmail"+'?userId='+userId+'&primaryEmail='+primaryEmail+'&notificationEmail='+notificationEmail;
						if(primaryEmail != '' && notificationEmail != ''){
	
							var switchEmailOptions = {
									ischangepasswordflag:true,
									url:serviceUrl,
									headers:headers,
									parentId:"change-email-edit-mode",
									requestInfo:{object:object},
									successCallBack:changepassword.switchEmailSuccessCallBack,
									failureCallBack:changepassword.privacyFailureCallBack,
									async:false	
							};
							doAjax.PutServiceInvocation(switchEmailOptions);
						}
					}
				}
			});

		},
		/**
		 * Get Security keys from server so that we can encrypt request in future
		 */
		getKeys : function() {
			$.jCryption.getKeys(contextPath+"/home/getKeys?generateKeypair=true", function(receivedKeys) {
				keys = receivedKeys;
			});
		},
		staticUI:function(element){
			var html =  '';
			var htmlData;
			htmlData= HTMLUIElements.changepassword();
			this.templates = jQuery('#userPrivacy-default-template-changepassword').html();
			//html+= changepasswordHTML.changepassword();
			var changepasswordHtml = Mustache.to_html(this.templates,htmlData);
			$(element).html(changepasswordHtml);
			if(htmlData.secondaryemailid != "" && htmlData.secondaryemailid != undefined){
				$("#secondaryemailsectiondiv").removeClass('hide');
			}
			if($("#secondaryemailid").val() == ""){
				$(".addNew_email").removeClass('hide');
			}
			$('#informationmessageplaceholderid').addClass('pad-top-118');
		},
		/**
		 * saveUserPasswordPrivacySettings method is used to save the user password privacy settings.
		 */
		saveUserPasswordPrivacySettings :function(){

			var accessToken = $("#accessToken_meta").val();
			var languageId = $("#langId_meta").val();
			var userId = $("#loginUserId-meta").val();

			var password = encodeURIComponent($("#pwd").val());
			password = password.trim();
			var confirmPassword = encodeURIComponent($("#input_confirm_pwd").val());
			var headers = {
					accessToken:accessToken,
					langId:"1"
			};
			var serviceUrl = getModelObject('serviceUrl')+"/user/1.0/changeUserPassword"+'?userId='+userId+'&password='+password+'&newPassword='+confirmPassword;
			if(password != '' && confirmPassword != '' && password == confirmPassword){
				$(".passwordError").html("");
				$(".pleaseWaitProcessingDialogCommon").modal('show');
				var resetPwdSaveoptions = {
						ischangepasswordflag:true,
						url:serviceUrl,
						headers:headers,
						parentId:"change-email-edit-mode",
						requestInfo:{resetPwdSaveoptions:true},
						successCallBack:changepassword.successCallBack,
						failureCallBack:changepassword.privacyFailureCallBack,
						async:true
				};
				doAjax.PutServiceInvocation(resetPwdSaveoptions);
			}else{
				$("#changepwd_section_form").validate({
					errorPlacement: function(error, element) {
						$('.passwordError').addClass('show');
						error.appendTo(element.parent("div").find($('.form-group .validationError')));
					}
				}).form();
			}
		},
		testFunction:function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '13'){
				var old_pwd = $("#password-field").val();
				var accessToken = $("#accessToken_meta").val();
				var languageId = $("#langId_meta").val();
				var userId = $("#loginUserId-meta").val();//emialId
				if(old_pwd != ""){
					$(".emptyPwdField").addClass('hide');
				var unlockUserPasswordRequest = {emailId:userId,
						currentPassword:old_pwd,
						langId:languageId,
						accessToken:accessToken};
				unlockUserPasswordRequest = JSON.stringify(unlockUserPasswordRequest);
				changepassword.settings.unlockuserpassword=true;
				var unlockPwdSaveoptions = {
						ischangepasswordflag:true,
						url:getModelObject('serviceUrl')+"/user/1.0/unlockUserPassword",
						data:unlockUserPasswordRequest,
						requestInfo:{unlockPwdSaveoptions:true},
						successCallBack:changepassword.unlocksuccessCallBack,
						failureCallBack:changepassword.privacyFailureCallBack,
						async:true
				};
				doAjax.PostServiceInvocation(unlockPwdSaveoptions);
				}else{
					$(".emptyPwdField").removeClass('hide');
				}

			}
			event.stopPropagation();
		},
		colosePopover:function(){
			$('.lock-popover').popover('hide');
			$('.lock-popover').popover('hide');
			$('.lock-popover').addClass('lock-enabled');
			$('.lock-popover').removeClass('lock-active');
			/*event.stopPropagation();*/
		},
		closePopupForPrivacy:function(){
			unlockedPassword = false;
			$('.lock-popover').addClass('lock lock-enabled');
			$('.lock-popover').removeClass('lock-active unlock-icon');
			$(".change-password-edit-mode").addClass('hide');
			$(".change-email-view-mode").addClass('hide');
			$(".privacy-information").removeClass('hide');
			$(".privacy-information").removeClass('red');
			$(".privacy-information span").text('Unlock to Change Password');// unlock to change password hint hide
			$(".change-email-view-mode").addClass('hide');
			$("#ok_confirmation").addClass('hide');
			$(".change-email-view-mode").addClass('hide');
			$(".change-email-edit-mode").addClass("hide");
			$('.popover').removeClass('hide');
			$("#unlock-text").html('Unlock to<br>Change');
			//$(".form-group .validationError").html("");
		},
		closePopupForEmailPrivacy:function(){
			unlockedPassword = false;
			$('.lock-popover').addClass('lock lock-enabled');
			$('.lock-popover').removeClass('lock-active unlock-icon');
			$(".change-password-edit-mode").addClass('hide');
			$(".change-email-view-mode").addClass('hide');
			$(".privacy-information").removeClass('hide');
			$(".privacy-information").removeClass('red');
			$(".privacy-information span").text('Unlock to Manage Emails');// unlock to change password hint hide
			$(".change-email-view-mode").removeClass('hide');
			changepassword.changeemailviewmodediv();
			$("#ok_confirmation_email").addClass('hide');
			$(".change-email-edit-mode").addClass("hide");
			$('.popover').removeClass('hide');
			$("#unlock-text").html('Unlock to<br>Change');
		},
		minusiconclick:function(){
			isDeleteSecondaryEmail = true;
			isEditPrimaryEmail = false;
			isAddNewSecondaryEmail = false;
			isSwitchPrimarySecondaryEmails = false;
			//iseditclicked = '';
			
			if(shiftingemailclick){
				shiftingemailclick = false;
				var pri = $("#primaryEmailDiv").html();
				var sec = $("#secondaryEmailDiv").html();
				$("#primaryEmailDiv").html(sec);
				$("#secondaryEmailDiv").html(pri);
			}

			if($("#editprimaryemailspanid").hasClass("selected-sm")){
				$("#editprimaryemailspanid").removeClass("selected-sm");
			}
			
			$("#edit_primary_email_div").html('');
			$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
			$("#email-changeemailinfo").text("The Secondary Email Will be Removed");	
			$("#email-changeemailinfo").addClass("red");
			
			
			//$(".privacy-email-information span").text('The Secondary Email Will be Removed');
			$(".minus-sm-icons").addClass('selected-sm');
			$(".edit-sm-icons").removeClass('selected-sm');
			
			
			$("#confirmcancelbtnsemailid").removeClass("pad-top-40");
			
			if(iseditclicked == true){
				iseditclicked = '';
			$("#deletesecemailid").addClass("pad-top-10");
			$("#deletesecemailid").addClass("clear-float");
			}
			

			
			
		},
		editPrimaryEmailId:function(){
			isEditPrimaryEmail = true;
			isAddNewSecondaryEmail = false;
			isDeleteSecondaryEmail = false;
			isSwitchPrimarySecondaryEmails = false;
			if(shiftingemailclick){
				shiftingemailclick = false;
				var pri = $("#primaryEmailDiv").html();
				var sec = $("#secondaryEmailDiv").html();
				$("#primaryEmailDiv").html(sec);
				$("#secondaryEmailDiv").html(pri);
			}
			
			iseditclicked = true;
			$("#addnewemailplusiconid").removeClass("mar-top-10");
			

			//alert("----sdfsad--"+$("#secondaryEmailRadio").attr("checked"));
			//if($("#secondaryEmailRadio").attr("checked")){
/*				$('#secondaryEmailRadio').removeAttr('checked');
				$("#primaryEmailRadio").attr("checked","");*/
			//}
			
			//$("#primaryEmailRadio").trigger("click");
			
			$(".minus-sm-icons").removeClass('selected-sm');
			$("#edit_primary_email_div").html("");
			var primaryemailval = $("#primaryemailid").val();//$(".primaryemailval").html();
			$(".addNew_email-block").addClass('hide');
			$(".plus-icons").removeClass('selected-sm');
			$(".edit-sm-icons").addClass('selected-sm');
			
			
			var editprimaryemailsection = jQuery("#userprivacy-editprimaryemailsection").html();
			
			$("#edit_primary_email_div").html(editprimaryemailsection);
			
			$("#primaryEmailDiv").removeClass('pull-right width-84');
			$("#email-changeemailicon").removeClass('warning-sm-icons').addClass('information-sm-icons');// attr("src", contextPath+"/static/pictures/Information_E30.png");
			$("#email-changeemailinfo").text("Login ID Will be the New Primary Email after the Change");
			$("#email-changeemailinfo").removeClass("red");
			
			if($("#deletesecemailid").hasClass("pad-top-10")){
			$("#deletesecemailid").removeClass("pad-top-10");
			}
			
			$("#edited_primary_email").val(primaryemailval);
			
			changepassword.bindEvents();
		},
		// function to update changed primary emailId in session
		updateEmailIdInSession:function(newPrimaryEmailId,emailType){
			var updateEmailIdInSessionOptions = {
					url:contextPath+"/dashboard/updateemailid",
					data : 'newPrimaryEmailId=' + newPrimaryEmailId+'&emailType='+emailType,
					parentId:"change-email-edit-mode",
					requestInfo:{newPrimaryEmailId:newPrimaryEmailId,emailType:emailType},
					successCallBack:changepassword.updateEmailIdInSessionSuccessCallBack,
					failureCallBack:changepassword.privacyFailureCallBack,
					async:true
			};
			doAjax.ControllerInvocation(updateEmailIdInSessionOptions);
		},
		
		// function to update modified user object in session
		updateUserObjectInSession:function(userObj,emailType){
			var accessToken = userObj['accessToken'];
			var emailId = userObj['emailId'];
			var notificationEmailId = userObj['notificationEmailId'];
			var updateUserObjectInSessionOptions = {
					url:contextPath+"/dashboard/updateuserobject",
					data : 'accessToken=' + accessToken+'&emailId='+emailId+'&notificationEmailId='+notificationEmailId,
					parentId:"change-email-edit-mode",
					requestInfo:{userObj:userObj,emailType:emailType},
					successCallBack:changepassword.updateUserObjectInSessionSuccessCallBack,
					failureCallBack:changepassword.privacyFailureCallBack,
					async:true
			};
			doAjax.ControllerInvocation(updateUserObjectInSessionOptions);
		},
		closeModelPopup:function(){
			changepassword.colosePopover();
			changepassword.closePopupForPrivacy();
			$("#privacy-policy-modal").modal('hide');
		},
		updateUserObjectInSessionSuccessCallBack:function(requestInfo,data){
			var userObj = requestInfo.userObj;
			var userObjaccessToken = userObj['accessToken'];
			var userObjPrimaryEmail = userObj['emailId'];
			var userObjnotificationEmailId = userObj['notificationEmailId'];
			
			$("#accessToken_meta").val(userObjaccessToken);
			$("#loginUserId-meta").val(userObjPrimaryEmail);
			$("#primaryemailid").val(userObjPrimaryEmail);
			$("#secondaryemailid").val(userObjnotificationEmailId);
			
			$(".edit_primary_email-block").addClass('hide');
			$("#edit_primary_email_section").addClass('hide');
			
			if(requestInfo.emailType == "switchEmail"){
				changepassword.display_email_success_message("Primary and Secondary Emails switched");
				var obj = requestInfo.object;
				var primaryemail = $(obj).attr('primaryemail');
				var secondaryemail = $(obj).attr('secondaryemail');
				var emailType = $(obj).attr('emailType');
				var other = $(obj).attr('other');
				var otherEmailType = $("#"+other).attr('emailType');
				$(obj).attr('primaryemail',secondaryemail);
				$(obj).attr('secondaryemail',primaryemail);
				$(obj).attr('emailType',otherEmailType);
				$("#"+other).attr('emailType',emailType);
				$("#"+other).attr('primaryemail',secondaryemail);
				$("#"+other).attr('secondaryemail',primaryemail);
				var val = $('input:radio[name=email]:checked').val();
      		  if(val == 'primaryEmail'){
      			  $("#primaryEmailDiv").html('<span class="edit-sm-icons enabled-sm mar-right-12" onclick="changepassword.editPrimaryEmailId()"></span><span class="font-10px helvetica-neue-roman">Primary</span><div id="edit_primary_email_div"></div>');
      			  $("#secondaryEmailDiv").html('<span class="minus-sm-icons mar-right-12" onclick="changepassword.minusiconclick()"></span>');
      		  }else if(val == 'secondaryEmail'){
      			  $("#secondaryEmailDiv").html('<span class="edit-sm-icons enabled-sm mar-right-12" onclick="changepassword.editPrimaryEmailId()"></span><span class="font-10px helvetica-neue-roman">Primary</span><div id="edit_primary_email_div"></div>');
      			  $("#primaryEmailDiv").html('<span class="minus-sm-icons mar-right-12" onclick="changepassword.minusiconclick()"></span>');
      		  }
      		  $(".privacy-email-information").removeClass('hide');
      		$(".privacy-information-email").addClass('hide');
      		  $(".privacy-email-information span").text('Login ID Will be the New Primary Email after the Switch');
      		changepassword.bindEvents();
			}else if(requestInfo.emailType == "updateEmail"){
				changepassword.display_email_success_message("Primary Email updated");
				if($('input:radio[name=email]:checked').attr('id') == "primaryEmailRadio"){
					$(".primaryemailval").html(userObjPrimaryEmail);
				}else if($('input:radio[name=email]:checked').attr('id') == "secondaryEmailRadio"){
					$(".secondaryemailval").html(userObjPrimaryEmail);
				}
		}
	},
	unlockedpwdcontentinit:function(){
		$(".change-email-edit-mode").html("");
		
		
		var changepasswordeditmodetemplate = jQuery("#userPrivacy-changepassword-editmode").html();
		
		var htmlData = HTMLUIElements.contexPathStatic();
		
		$("#change_pwd_editmode_div").html(Mustache.to_html(changepasswordeditmodetemplate,htmlData));
		
		changepassword.bindEvents();
	},
	display_email_success_message:function(text){
		$(".change-email-edit-mode").html("");
		
		$(".Success-Ok-Button").removeClass('hide');// password success message ok button visible
		$("#ok_confirmation").removeClass('hide');
		
		
		var infomessageplholderhtml = jQuery("#userprivacy-infomessage-div").html();
		
		var htmlData = HTMLUIElements.contexPathStatic();
		
		$("#infomessage-placeholderid").html(Mustache.to_html(infomessageplholderhtml,htmlData));	
		
		$("#editpasswordinfoiconid").removeClass('hide');
		$("#imageandinfoimgid").removeClass('warning-sm-icons').addClass('information-sm-icons');// attr("src", contextPath+"/static/pictures/Information_E30.png");
		//$("#editpasswordinfoiconid").text('');
		$("#editpasswordinfoiconid").text(text+" A notification is sent to your primary email");

		
	$(".change-email-edit-mode").removeClass("min-height-150");
	$("#informationmessageplaceholderid").removeClass('pad-top-118');
	$("#informationmessageplaceholderid").addClass('pad-bot-67');
	//$("#userprivacymodelcontentid").addClass('height-305');
	$("#okconfirmationbtnid").removeClass("mar-top-175");
	
	
	},
	changeemailviewmodediv:function(){
		var primaryEmail = $("#primaryemailid").val();
		var secondaryEmail = $("#secondaryemailid").val();
			$(".change-email-view-mode").html('<div id="changeemailviewmodeid" class=" warmgray mar-bottom-25 font-13 helvetica-neue-roman" >Manage Email</div>'						
			    +'                        <div class="">'                               
			    +'                            <div class=""><span class="span35 float-left font-13 helvetica-neue-roman darkgrey pad-right-10">Primary Email</span><span class="span55 float-left font-12">'+primaryEmail+'</span></div>'
			    +'                            <div><span class="clear-float pad-top-15 darkgrey span35 float-left font-13 helvetica-neue-roman pad-right-10">Secondary Email</span><span class="pad-top-15 span55 float-left font-12">'+secondaryEmail+'</span></div>'                              
			    +'                        </div>' 
			    +'                        <div class="clear-float"></div>');
			
			
			
			var infomessageplholderhtml = jQuery("#userprivacy-infomessage-div").html();
			
			var htmlData = HTMLUIElements.contexPathStatic();
			
			$("#infomessage-placeholderid").html(Mustache.to_html(infomessageplholderhtml,htmlData));			
			
			
	},
	unlockedemailcontentinit:function(){
		var primaryEmail = $("#primaryemailid").val();
		var secondaryEmail = $("#secondaryemailid").val();
		
		$("#change_pwd_editmode_div").html("");
		
		
		var changeemaileditmodetemplate = jQuery("#userprivacy-changeemaileditmode").html();
		
		var htmlData = HTMLUIElements.changeemailuielements();
		
		if(htmlData['primaryEmail'] != undefined && htmlData['primaryEmail'].length >30){
			htmlData['modified_primaryEmail'] = stringLimitDots(htmlData['primaryEmail'],27);
		}else{
			htmlData['modified_primaryEmail'] = htmlData['primaryEmail'];
		}
		
		if(htmlData['secondaryEmail'] != undefined && htmlData['secondaryEmail'].length >30){
			htmlData['modified_secondaryEmail'] = stringLimitDots(htmlData['secondaryEmail'],27);
		}else{
			htmlData['modified_secondaryEmail'] = htmlData['secondaryEmail'];
		}
		
		
		
		
		$(".change-email-edit-mode").html(Mustache.to_html(changeemaileditmodetemplate,htmlData));		
		
		$(".change-password-edit-mode").addClass('hide');
		$(".change-email-view-mode").addClass('hide');
		$(".addNew_email-block").addClass('hide');
		$(".plus-icons").removeClass('selected-sm');
		$(".edit-sm-icons").removeClass('selected-sm');

		$(this).prevAll().find("span").removeClass("active");
		$(this).find("span").addClass("active");
		$(".change-email-edit-mode").removeClass('hide');
		$("#ok_confirmation").addClass('hide');
		
		
		if($("#secondaryemailid").val() != "" && $("#secondaryemailid").val() != undefined){
			$("#secondaryemailsectiondiv").removeClass('hide');
		}
		if($("#secondaryemailid").val() == ""){
			$(".addNew_email").removeClass('hide');
		}
		if(primaryEmail != "" && primaryEmail != undefined && secondaryEmail != "" && secondaryEmail != undefined){
			$(".privacy-email-information").removeClass('hide');
			$(".privacy-information-email").addClass('hide');
			$("#email-changeemailinfo").removeClass("red");
			$(".privacy-email-information span").text('Edit to change or Use Radio Button to Switch the Primary Email');
		}else if(primaryEmail != "" && primaryEmail != undefined && secondaryEmail == ""){
			$(".privacy-email-information").removeClass('hide');
			$(".privacy-information-email").addClass('hide');
			$(".privacy-email-information span").text('A Secondary Email is Supported');
		}
		changepassword.bindEvents();
	},
	/**
	 * Jquery validations added
	 * @param ele
	 * @returns {Boolean}
	 */
	_validateChangeEmail : function(oldEmail,newEmail){
		
		var isValid = false;
		
		if(oldEmail == ''){
		$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
		$("#email-changeemailinfo").text("New Email required");
		$("#email-changeemailinfo").addClass("red");	
		}else if(newEmail == ''){
		$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
		$("#email-changeemailinfo").text("Confirm Email required");	
		$("#email-changeemailinfo").addClass("red");
		}else{
			if(!validateEmail(oldEmail)){
				$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
				$("#email-changeemailinfo").text("Invalid email address");	
				$("#email-changeemailinfo").addClass("red");
			}else if(!validateEmail(newEmail)){
				$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
				$("#email-changeemailinfo").text("Invalid email address");	
				$("#email-changeemailinfo").addClass("red");
			}else if(oldEmail.localeCompare(newEmail)){
				$("#email-changeemailicon").removeClass('information-sm-icons').addClass('warning-sm-icons');// attr("src", contextPath+"/static/pictures/Alert_E30.png");
				$("#email-changeemailinfo").text("Email addresses do not match");	
				$("#email-changeemailinfo").addClass("red");
			}else{
				isValid = true;
			}
		}
		
		return isValid;
	},
	changeprimaryEmailServiceInvoke : function(oldEmail,newEmail,accessToken,userId){
		oldEmail = oldEmail.trim();
		newEmail = newEmail.trim();
		var headers = {
				accessToken:accessToken,
				langId:"1"
		};
		var serviceUrl = getModelObject('serviceUrl')+"/user/1.0/updateEmail"+'?userId='+userId+'&newEmail='+newEmail+'&oldEmail='+oldEmail;
		if(newEmail != '' && oldEmail != ''){
			changepassword.settings.primaryEmailEdit=true;
			var updateEmailOptions = {
					ischangepasswordflag:true,
					url:serviceUrl,
					headers:headers,
					data:{},
					parentId:"change-email-edit-mode",
					requestInfo:{updateEmailOptions:true},
					successCallBack:changepassword.updateEmailSuccessCallBack,
					failureCallBack:changepassword.privacyFailureCallBack,
					async:true
			};
			doAjax.PutServiceInvocation(updateEmailOptions);
		}							
	},
	addNewSecondaryEmailServiceInvoke : function(oldEmail,newEmail,accessToken,userId){
		oldEmail = oldEmail.trim();
		var headers = {
				accessToken:accessToken,
				langId:"1"
		};
		var serviceUrl = getModelObject('serviceUrl')+"/user/1.0/changeUserNotification"+'?userId='+userId+'&emailId='+oldEmail;
			changepassword.settings.secondaryEmailChange=true;
			var createNewSecondaryEmailOptions = {
					ischangepasswordflag:true,
					url:serviceUrl,
					headers:headers,
					parentId:"change-email-edit-mode",
					requestInfo:{createNewSecondaryEmailOptions:true},
					successCallBack:changepassword.createNewSecondaryEmailSuccessCallBack,
					failureCallBack:changepassword.privacyFailureCallBack,
					async:true
			};
			doAjax.PutServiceInvocation(createNewSecondaryEmailOptions);
	}
	};
}.call(this);