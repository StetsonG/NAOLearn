/**
 * @author Next Sphere Technologies
 * View User Profile HTML Templates
 * 
 * View User Profile HTML Templates contains below templates,
 * 
 * 1. About User with Image upload
 * 2. Contact Information
 * 3. Experience information
 * 4. Education Information
 * 5. Skills Information
 * 6. Project Information
 * 
 * 
 */


var ViewUserProfile = function(){
	
	var accessToken = $("#accessToken_meta").val();
	var userId = $("#loggedInUserId-meta").val();
	var langId = $("#langId-meta").val();
	var userProfileIdentifier = '';
	var isNotification = false;
	var isDashboardViewProfile = false;
	
	return {
		destroy:function(){
			ViewUserProfile.settings={};
		},
		init:function(options){
			this.settings = $.extend(this.defaults,options);
            var element = this.settings.ele;
            
            isDashboardViewProfile = options.isDashboardViewProfile;
            userProfileIdentifier = this.settings.profileUniqueIdentifier;
			if(userProfileIdentifier == undefined || userProfileIdentifier == ''){
				userProfileIdentifier = $("#userProfileIdentifier").val();
			}
			isNotification = this.settings.flag;
			this.staticUI(element);
			var options = this.prepareServiceRequest();
			this.serviceInvocation(options);
			this.bindEvents();
		},
		registerValidations:function(element){},
		serviceInvocation:function(options){},
		prepareServiceRequest:function(){
			var headers = {
					accessToken:accessToken,
					langId:langId
			};
			var viewUserRequest = {
					profileName:userProfileIdentifier,
					userId:userId
			};
			var options = {
					url:getModelObject('serviceUrl')+'/userProfile/1.0/getUserProfileByProfileName',
					data:viewUserRequest,
					headers:headers,
					successCallBack:ViewUserProfile.successCallBack,
					failureCallBack:ViewUserProfile.failureCallBack,
					async:true
			};
			doAjax.GetServiceInvocation(options);
		},
		successCallBack:function(data){
			var userProfileModel = data['userProfileModel'];
		 if(userProfileModel['photoId'] != null && userProfileModel['photoId'] != ""){
                $("#userProfilePicView").html('<img src="/contextPath/User/'+userProfileModel["photoId"]+'/profile.jpg" class="view-profile-image"/> <div class="pad-top-20 hide viewProfileAcceptConnection pad-bot-10"><input type="button" class="def-button font-17 connectionAcceptBtn isAcceptConnectionReqdoneClass" value="Accept Connection"></div>');
          }else{
                $("#userProfilePicView").html('<img src="'+contextPath+'/static/pictures/profiles/no-profile-pic.jpg" class="view-profile-image"/><div class="pad-top-20 hide viewProfileAcceptConnection pad-bot-10"><input type="button" class="def-button font-17 isAcceptConnectionReqdoneClass" value="Accept Connection"></div>');
          }
		 if(ViewUserProfile.settings.flag){
			 $("#userProfilePicView").css("padding-left","25px");
		 }else{
			 $("#userProfilePicView").css("padding-left","0px");
		 }	
		 if(isNotification){
				if(data.associationStatus == 'NOT_MEMBER'){
					$(".viewProfileAcceptConnection").removeClass('hide');
				}
				var xiimcustomScrollbarOptions = {elementid:"#viewProfileMainDiv",isUpdateOnContentResize:true,setHeight:"613px",vertical:'y'};
				xiimcustomScrollbar(xiimcustomScrollbarOptions);
				$("#viewProfileMainDiv").addClass('scroll-content mCustomScrollbar height-613');
				$("#displayCrossBtn").removeClass('hide');
			}
			if(userProfileModel.gender == 'M'){
				userProfileModel.displayGender = 'Male';
			}else if(userProfileModel.gender == 'F'){
				userProfileModel.displayGender = 'Female';
			}
			//TODO:: need to change this type of coding
			if(userProfileModel.userType == 'E'){
				userProfileModel.userType = 'Educator';
			}else if(userProfileModel.userType == 'S'){
				userProfileModel.userType = 'Student';
			}
			ViewUserProfile.buildProfileInformation(userProfileModel);
			ViewUserProfile.buildContactInformationSection(userProfileModel);
			ViewUserProfile.buildEducationSection(userProfileModel);
			ViewUserProfile.buildExperienceSection(userProfileModel);
			ViewUserProfile.buildSkillsSection(userProfileModel);
			ViewUserProfile.buildProjectSection(userProfileModel);
			
			if(isNotification){
				$("#userProfilePicView").removeClass("col-xs-3").addClass("col-xs-5");
				$("#userprofile001").removeClass("col-xs-9").addClass("col-xs-7");
				$("#userprofile001").addClass("pad-left-import-30");
				$("#userprofile002").removeClass("col-xs-9").addClass("col-xs-12");
				$("#userprofile002").addClass("pad-left-import-25");
				
			       if(isDashboardViewProfile){
			    	   $('#viewProfileMainDiv').removeClass("mar-top-63");
			       }
				
			}
			
			ViewUserProfile.dynamicEvents();
		},
		
		connectionsSuccessCallBack:function(data){
			if(data.isSuccess){
				$(".viewProfileAcceptConnection").html('');
			}
		},
		buildContactInformationSection:function(userProfileModel){
			var userProfileAddresses = userProfileModel['userProfileAddresses'];
			if(userProfileAddresses != undefined && userProfileAddresses.length == undefined){
				userProfileAddresses = [userProfileAddresses];
			}
			if(userProfileAddresses != undefined && userProfileAddresses.length > 0){
				for(var i=0;i<userProfileAddresses.length;i++){
					if(userProfileAddresses[i].addressLine1 != "" || userProfileAddresses[i].addressLine2 != "" || userProfileAddresses[i].city != "" 
						|| userProfileAddresses[i].country != "" || userProfileAddresses[i].state != "" || userProfileAddresses[i].zip != ""){
						userProfileAddresses[i].isAddressAvailable = true;
					}
				}
				ViewUserProfile.buildContactInformation(userProfileModel);
			}
		},

		buildEducationSection:function(userProfileModel){
			var userEducations = userProfileModel['userEducations'];
			if(userEducations != undefined && userEducations.length == undefined){
				userEducations = [userEducations];
			}
			if(userEducations != undefined && userEducations.length > 0){
				for(var i=0;i<userEducations.length;i++){
					var months=["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
					if(userEducations[i].startDate){
						var date = new Date(userEducations[i].startDate);
						var startDate = months[date.getMonth()]+' '+date.getFullYear();
						userEducations[i].startDate = date;
						userEducations[i].displayStartDate = startDate;
						userEducations[i].isDateAvailable = true;
					}else{
						userEducations[i].startDate = '';
						userEducations[i].displayStartDate = ''; 
					}
					if(userEducations[i].endDate){
						var date1 = new Date(userEducations[i].endDate);
						var endDate = months[date1.getMonth()]+' '+date1.getFullYear();
						userEducations[i].endDate = date1;
						userEducations[i].displayEndDate = endDate;
					}else{
						userEducations[i].endDate = '';
						userEducations[i].displayEndDate = '';
					}
				}
				ViewUserProfile.buildEducation(userProfileModel);
			}
		},

		buildExperienceSection:function(userProfileModel){
			var userExperiences = userProfileModel['userExperiences'];
			if(userExperiences != undefined && userExperiences.length == undefined){
				userExperiences = [userExperiences];
			}
			if(userExperiences != undefined && userExperiences.length > 0){
				for(var i=0;i<userExperiences.length;i++){
					var date = new Date(userExperiences[i].startDate);
					var date1 = new Date(userExperiences[i].endDate);
					var months=["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
					if(userExperiences[i].startDate){
						var date = new Date(userExperiences[i].startDate);
						var startDate = months[date.getMonth()]+' '+date.getFullYear();
						userExperiences[i].startDate = date;
						userExperiences[i].displayStartDate = startDate;
						userExperiences[i].isDateAvailable = true;

					}else{
						userExperiences[i].startDate = '';
						userExperiences[i].displayStartDate = ''; 
					}
					if(userExperiences[i].endDate){
						var date1 = new Date(userExperiences[i].endDate);
						var endDate = months[date1.getMonth()]+' '+date1.getFullYear();
						userExperiences[i].endDate = date1;
						userExperiences[i].displayEndDate = endDate;
					}else{
						userExperiences[i].endDate = '';
						userExperiences[i].displayEndDate = '';
					}
					userExperiences[i].count = i;

					var userExperienceSkills = userExperiences[i]['userExperienceSkills'];
					if(userExperienceSkills != undefined && userExperienceSkills.length == undefined){
						userExperienceSkills = [userExperienceSkills];
					}
					if(userExperienceSkills != undefined && userExperienceSkills != ''){
						for(var j=0;j<userExperienceSkills.length;j++){
							userExperienceSkills[j].experienceSkillCount = i+"_"+j;
						}
						userExperienceSkills[userExperienceSkills.length - 1].experienceLast = true;
					}
				}
				ViewUserProfile.buildExperience(userProfileModel);
			}
		},

		buildSkillsSection:function(userProfileModel){
			var userSkills = userProfileModel['userSkills'];
			if(userSkills != undefined && userSkills.length == undefined){
				userSkills = [userSkills];
			}
			if(userSkills != undefined && userSkills.length > 0){
				userSkills[userSkills.length - 1].last = true;
				ViewUserProfile.buildSkills(userProfileModel);
			}
		},

		buildProjectSection:function(userProfileModel){
			var userProjects = userProfileModel['userProjects'];
			if(userProjects != undefined && userProjects.length == undefined){
				userProjects = [userProjects];
			}
			if(userProjects != undefined && userProjects.length > 0){
				ViewUserProfile.buildProject(userProfileModel);
			}
		},

		failureCallBack:function(data){
			doAjax.displayErrorMessages(data);
		},


		dynamicUI:function(element,data){

		},

		buildProfileInformation:function(data){
			var template = '<div class="font-20 helvetica-neue-roman">{{firstName}} {{lastName}}</div>'
				+'	<div class="groupviewModeSection viewmodeprofilesection no-border pad-top-10">'
				+'  {{#dob}}'
				+'	<div class="form-group">'
				+'		<label for="birthday" class="helvetica-neue-roman font-12px nowrap">Birthday</label>'
				+'		<span class="font-12px">{{dob}}</span>'                                        
				+'	</div>'
				+'  {{/dob}}'
				+'  {{#displayGender}}'
				+'	<div class="form-group">'
				+'		<label for="sex" class="text-left helvetica-neue-roman font-12px nowrap">Gender</label>'
				+'		<span  class="font-12px">{{displayGender}}</span>'                                       
				+'	</div>'
				+'  {{/displayGender}}'
				+'   {{#userType}}'
				+'	<div class="form-group">'
				+'		<label for="userType" class="helvetica-neue-roman font-12px nowrap">Account Type</label>'
				+'		<span class="font-12px">{{userType}}</span>'                                  
				+'	</div>'
				+'  {{/userType}}'
				+'   {{#location}}'
				+'	<div class="form-group">'
				+'		<label for="location"  class="helvetica-neue-roman font-12px nowrap">Location</label>'
				+'		<span class="font-12px">{{location}}</span>'                                  
				+'	</div>'
				+'  {{/location}}'
				+'	</div>'
				+'	<div class="white-space-preline pad-bot-30 font-12 pad-top-10 line-height-16">{{summary}}</div>';
			var months=["January", "Febuary", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
			var date = new Date(data.dob);
			if(data.dob){
				data.dob = months[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
			}
			var profileInformationView = Mustache.to_html(template,data);
			$("#profileInformationView").append(profileInformationView);
		},

		buildContactInformation:function(data){
			var template = '{{#userProfileAddresses}}';
			template+='	<div class="font-16px helvetica-neue-roman">Contact Information</div>'
				+'<div class="groupviewModeSection viewmodeprofilesection no-border  pad-top-10">'
				+'  {{#isAddressAvailable}}'
				+'	<div class="form-group">'
				+'		<label for="address" class="helvetica-neue-roman font-12px nowrap">Address</label>'
				+'		<div class="pad-left-100 font-12px mar-left-30">{{addressLine1}}  {{addressLine2}}<br><br> {{city}} {{state}} {{zip}}<br><br> {{country}}</div>'                                       
				+'	</div><br>'
				+'  {{/isAddressAvailable}}'
				+'   {{#emailId}}'
				+'	<div class="form-group">'
				+'		<label for="email" class="text-left helvetica-neue-roman font-12px nowrap">Email</label>'
				+'		<span class=" font-12px><a href="mailto:{{emailId}}">{{emailId}}</a></span>'                                        
				+'	</div>'
				+'   {{/emailId}}'
				+' {{#mobileNumber}}'
				+'	<div class="form-group">'
				+'		<label for="phone" class="helvetica-neue-roman font-12px nowrap">Phone</label>'
				+'		<span class=" font-12px">{{mobileNumber}}</span>'
				+'	</div>'
				+' {{/mobileNumber}}'
				+'</div><div class="greybottomboarder pad-bot-20"></div>';
			template +='{{/userProfileAddresses}}';

			var contactInformationView = Mustache.to_html(template,data);
			$("#contactInformationView").append(contactInformationView);
		},

		buildEducation:function(data){
			var template = '<div class="font-16px helvetica-neue-roman">Education</div>';
			template+='{{#userEducations}}'
				+'<div class="groupviewModeSection viewmodeprofilesection pad-tb-10 greybottomboarder mar-bottom-20 pad-bot-30">'
				+'	<div class="form-group">'
				+'		<label for="institution" class="text-left helvetica-neue-roman font-13px nowrap">{{schoolName}}</label>'
				+'		<span class="font-12px"></span>'                                
				+'	</div>'
				+'	{{#isDateAvailable}}'
				+'		<div class="form-group">'
				+'			<label for="DatesAttended" class="helvetica-neue-roman font-12px nowrap">Dates Attended </label>'
				+'          <span class="font-12px"> {{displayStartDate}} </span>&nbsp;to&nbsp;'
				+'          <span class="font-12px"> {{displayEndDate}} </span>'
				+'		</div>'
				+' {{/isDateAvailable}}'
				+'  {{#degree}}'
				+'		<div class="form-group">'
				+'			<label for="degree" class="helvetica-neue-roman font-12px nowrap">Degree</label>'
				+'			<span class="font-12px">{{degree}}</span>'                                      
				+'		</div>'
				+'  {{/degree}}'
				+'  {{#description}}'
				+'		<div class="form-group">'
				+'			<label for="description" class="helvetica-neue-roman font-12px nowrap">Description</label>'
				+'			<div class="font-12px  mar-left-30 pad-left-100">{{description}}</div>'                                      
				+'		</div>'
				+'  {{/description}}'
				+' {{#fieldOfStudy}}'
				+'		  <div class="form-group">'
				+'			  <label for="FieldofStudy" class="helvetica-neue-roman font-12px nowrap">Field of Study</label>'
				+'            <div class="font-12px mar-left-30 pad-left-100"> {{fieldOfStudy}} </div>'
				+'		  </div>'
				+' {{/fieldOfStudy}}'
				+'  {{#gpa}}' 
				+'		  <div class="form-group">'
				+'			  <label for="GPA" class="helvetica-neue-roman font-12px nowrap">GPA </label>'
				+'            <span class="font-12px">{{gpa}}</span>'
				+'		  </div>'  
				+'  {{/gpa}}'
				+'  {{#activities}}'
				+'		  <div class="form-group" style="">'
				+'			  <label for="activitiesSocieties" class="helvetica-neue-roman font-12px nowrap">Activities & Societies</label>'
				+'            <div class="mar-left-30 pad-left-100 pad-right-15 font-12px">{{activities}} </div>'
				+'		  </div>'
				+'  {{/activities}}'
				+'</div>';

			template +='{{/userEducations}}';
			var userEducationView = Mustache.to_html(template,data);
			$("#userEducationView").append(userEducationView);
		},

		buildExperience:function(data){
			var template = '<div class="font-16px helvetica-neue-roman">Experience</div>';
			template+='{{#userExperiences}}'
				+'<div class="groupviewModeSection viewmodeprofilesection pad-tb-10 greybottomboarder mar-bottom-20 pad-bot-30">'
				+'	<div class="form-group">'
				+'		<label for="companyName" class="text-left helvetica-neue-roman font-13px nowrap">{{companyName}}</label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px"></div>'                                     
				+'	</div>'
				+'	<div class="form-group">'
				+'		<label for="title" class="helvetica-neue-roman font-12px nowrap">Title </label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px mar-left-30">{{title}}</div>'                         
				+'	</div>'
				+' {{#description}}'
				+'	<div class="form-group">'
				+'		<label for="projectDesc" class="helvetica-neue-roman font-12px nowrap">Description </label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px mar-left-30">{{description}}</div>'
				+'	</div>'
				+' {{/description}}'
				+'  {{#isDateAvailable}}'
				+'	<div class="form-group">'
				+'		 <label for="DatesAttended" class="helvetica-neue-roman font-12px nowrap">Dates Attended </label>'
				+'       <span class=" font-12px"> {{displayStartDate}} </span>&nbsp;to&nbsp;'
				+'       <span class=" font-12px"> {{displayEndDate}} </span>'
				+'	</div>'
				+'  {{/isDateAvailable}}'
				+' {{#companySite}}'
				+'	<div class="form-group">'
				+'		<label for="projectTitle" class="helvetica-neue-roman font-12px nowrap">Company Website</label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px">{{companySite}}</div>'
				+'	</div>'
				+' {{/companySite}}'
				+' {{#industry}}'
				+'	<div class="form-group">'
				+'		<label for="industry" class="helvetica-neue-roman font-12px nowrap">Industry</label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px">{{industry}}</div>'
				+'	</div>'
				+' {{/industry}}'
				+' {{#relaventProject}}'
				+'	<div class="form-group">'
				+'		<label for="relevantProjects" class="helvetica-neue-roman font-12px nowrap">Relevant Projects</label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px">{{relaventProject}}</div>'
				+'	</div>'
				+' {{/relaventProject}}'
				+' {{#relaventLevelExperience}}'
				+'	<div class="form-group" style="">'
				+'		<label for="relevantExperience" class="helvetica-neue-roman font-12px nowrap">Relevant Experience</label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px">{{relaventLevelExperience}}</div>'
				+'	</div>'		
				+' {{/relaventLevelExperience}}'
				+'	<div class="form-group">'
				+'		<label for="Skills" class="helvetica-neue-roman font-12px nowrap">Skill Name </label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px">'
				+' 			{{#userExperienceSkills}}'
				+'				<span class="pad-tb-10">'
				+'				{{userSkill.skill.name}}</span>'
				+'	 		{{^experienceLast}},{{/experienceLast}}'
				+'			{{/userExperienceSkills}}'
				+'		</div>'
				+'	</div>'
				+'</div>';
			template +='{{/userExperiences}}';
			var userExperienceView = Mustache.to_html(template,data);
			$("#userExperienceView").append(userExperienceView);
		},

		buildSkills:function(data){
			var template = '<div class="font-16px helvetica-neue-roman">Skills</div>';
			template+='<div class="mar-bottom-20 font-12px pad-top-10 greybottomboarder pad-bot-20">{{#userSkills}}'
				+' 	{{skill.name}}'
				+' {{^last}},{{/last}}';
			template +='{{/userSkills}}</div>';
			var userSkillsView = Mustache.to_html(template,data);
			$("#userSkillsView").append(userSkillsView);

		},

		buildProject:function(data){
			var template = '<div class="font-16px helvetica-neue-roman">Projects</div>';
			template+='{{#userProjects}}'
				+'<div class="groupviewModeSection viewmodeprofilesection pad-tb-10 greybottomboarder mar-bottom-20 pad-bot-30">'
				+'	<div class="form-group">'
				+'		<label for="projectTitle" class="text-left font-13px helvetica-neue-roman nowrap">{{title}}</label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px"></div>'                                   
				+'	</div>'
				+'	<div class="form-group">'
				+'		<label for="projectTitle" class="font-12px helvetica-neue-roman nowrap">Description</label>'
				+'		<div class="pad-left-100 pad-right-15 font-12px mar-left-30">{{description}}</div>'                               
				+'	</div>'
				+'</div>';
			template +='{{/userProjects}}';
			var userProjectsView = Mustache.to_html(template,data);
			$("#userProjectsView").append(userProjectsView);
		},

		// TODO build sections

		/**
		 *  bind operations performed on UI
		 */
		bindEvents:function(){
		
					$(window).scroll(function() {
	
			//// console.log(" scrolling in user profile" + $(this).scrollTop());
	
			 if ($(this).scrollTop() < $('#contactInformationView').offset().top) {
	 
				// console.log(" Scrolling in user profile. " + $(this).scrollTop() );
		
				$("a.menuitems").removeClass('activemenu');
				$("a.menuitems[href*=profileInformationView]").addClass('activemenu');
			}
	
			 if ($(this).scrollTop() > $('#contactInformationView').offset().top - 300 ) {
	 
				// console.log(" Scrolling in contact. " + $(this).scrollTop() );
		
				$("a.menuitems").removeClass('activemenu');
				$("a.menuitems[href*=#contactInformationView]").addClass('activemenu');
			}
	
			 if ($(this).scrollTop() > $('#userEducationView').offset().top -300) {
	 
				// console.log(" Scrolling in userEducationView " + $(this).scrollTop() );
		
				$("a.menuitems").removeClass('activemenu');
				$("a.menuitems[href*=userEducationView]").addClass('activemenu');
			}
	
			if ($(this).scrollTop() > $('#userExperienceView').offset().top -500) {
	 
				// console.log(" Scrolling in userExperienceView " + $(this).scrollTop() );
		
				$("a.menuitems").removeClass('activemenu');
				$("a.menuitems[href*=userExperienceView]").addClass('activemenu');
			}
   
			if ($(this).scrollTop() > $('#userSkillsView').offset().top -500) {
	 
				// console.log(" Scrolling in userSkillsView " + $(this).scrollTop() );
		
				$("a.menuitems").removeClass('activemenu');
				$("a.menuitems[href*=userSkillsView]").addClass('activemenu');
			}
	
			if ($(this).scrollTop() > $('#userProjectsView').offset().top -500) {
	 
				// console.log(" Scrolling in userProjectsView " + $(this).scrollTop() );
		
				$("a.menuitems").removeClass('activemenu');
				$("a.menuitems[href*=userProjectsView]").addClass('activemenu');
			}

		});
			
		},
		
		dynamicEvents:function(){
			$(".connectionAcceptBtn").off("click").bind("click",function(){
				var connectionRequestAcceptData = {
        				accessToken:accessToken,
        				respondedUserId:userId,
        				memberIds:ViewUserProfile.settings.memberId,
        				requestStatusEnum:'ACCEPT'
        		};
				connectionRequestAcceptData= JSON.stringify(connectionRequestAcceptData);
        		var options = {
        				url:getModelObject('serviceUrl')+'/group/1.0/manageConnections',
          				data:connectionRequestAcceptData,
          				successCallBack:ViewUserProfile.connectionsSuccessCallBack,
          				async:true
          		};
          		doAjax.PostServiceInvocation(options);
			});
			
			if($("#displayCrossBtn:not(.hide) .viewProfileCloseBtn").length){
			$(".viewProfileCloseBtn").off("click").bind("click",function(){
				$(ViewUserProfile.settings.ele).addClass('hide');
			});
			}
		},
		staticUI:function(element){
			var html =  '';
			var htmlData;
			//htmlData = UIElements.userProfile();
			html+= UserProfileHtml.viewProfile();
			var viewProfileHtml = Mustache.to_html(html,htmlData);
			
			$(element).html(
                    '<div id="left-affix-panel" class="height-500 min-height-350 left-affix-panel">'
                    +'     <div class="pad-top-5 text-right cursor-hand">'
                    +'            <div id="affix-shift" class="width-20 height-20"><span class="expandwindow-icon"></span></div>'
                    +'  </div>'
                    +'<div class="position-absolute black-strip" style=""></div>'
                    +'  <div class="pad-left-20" id="left-affix-content">'
                    +'            <nav style="position:static; width:auto">'            
                    +'                   <a href="#profileInformationView" data-shift="200" class="menuitems profileinfo-vlink activemenu" title="Profile Information">Profile Information</a>'
                    +'                   <a href="#contactInformationView" data-shift="250" class="menuitems contactinfo-vlink" title="Contact Information">Contact Information</a>'
                    +'                   <a href="#userEducationView" data-shift="230" class="menuitems education-vlink" title="Education">Education</a>'
                    +'                   <a href="#userExperienceView" data-shift="230" class="menuitems experience-vlink" title="Experience">Experience</a>' 
                    +'                   <a href="#userSkillsView" data-shift="180" class="menuitems skills-vlink" title="Skills">Skills</a>'
                    +'                   <a href="#userProjectsView" data-shift="250" class="menuitems projects-vlink" title="Projects">Projects</a>'
                    +'            </nav>'         
                    +'     </div>'
                    +'</div>'
                    +'<div id="pcontainerDiv" class="container min-height-500">'
                    +'<div id="profileInformationHeading" class="height-47 profileinfoheading-fixed hide"><h1 class="font-30">Profile Information</h1></div>'
                    +'     <div id="viewUserProfileInnerDiv">'

                    +'     </div>'
                    +'</div>');
       $("#viewUserProfileInnerDiv").html(viewProfileHtml);
       

       
       if(!ViewUserProfile.settings.flag){
             $("#profileInformationHeading").removeClass('hide');
       }else{
             $("#pcontainerDiv").removeClass('container');
             $("#left-affix-panel").css({"margin-top":"0px"});
       }

		},


	};

}.call(this);