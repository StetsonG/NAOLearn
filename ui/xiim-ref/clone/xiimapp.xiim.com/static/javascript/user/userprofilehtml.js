/**
 * @author Next Sphere Technologies
 * User Profile HTML Templates
 * 
 * User Profile HTML Templates contains below templates,
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
var UserProfileHtml = function(){
	return{
		userProfileProjects:function(){
			var htmlTemplate='';
            return htmlTemplate+='<div class=" greyboarder mar-bottom-25 pad-lr-12 min-height-200">'
            	+'	<div class="height-47 mar-bot-10"><h1 class="font-20">Projects<span class="pull-right"><a href="javascript:void(0)" id="projects_Add" class="ancher_lock"><i class="add-sm-icons margin_i_f"></i><span class="font-16">&nbsp;Add another project</span></a></span></h1></div>'
            	+'		<div class="horizontal-form userprofilelabelnowrap projectsform" id="projectContainer">'
            	+' 		  <div id="project_container_0">'
            	+'			<div class="projectsEditMode" id="userProjectsEditMode_0"></div>'
            	+'			<div class="projectsViewMode" id="userProjectsViewMode"></div>'
            	+'		</div>' 
            	+' 		</div>'
            	+'</div>';
		    
		},
		
		userProfileEducation:function(){
			var htmlTemplate='';
			return htmlTemplate+='<div class=" greyboarder mar-bottom-25 pad-lr-12 min-height-200">'
				+'	<div class="height-47 mar-bot-10"><h1 class="font-20">Education<span class="pull-right"><a href="javascript:void(0)" id="educations_Add" class="ancher_lock"><i class="add-sm-icons  margin_i_f"></i><span class="font-16">&nbsp;Add another institution</span></a></span></h1></div>'
				+'	<div class="horizontal-form userprofilelabelnowrap educationform" id="educationContainer">'
				+' 	<div id="education_container_0">'
				+'    	<div class="educationsEditMode" id="userEducationsEditMode_0"></div>'
				+'    	<div class="educationsViewMode" id="userEducationsViewMode"></div>'
				+'    </div>'	
				+'  </div>'
				+'</div>';
		},
		
		userProfileInformation:function(){
			var html='';
			return html+=''				
			+' <div class=" greyboarder mar-bottom-25 pad-lr-12 min-height-200">'                    
			
			+'	 <div class="horizontal-form userprofilelabelprofiileinfo profileinfoform" id="profileContainer">'
			+'   <div id="profileInformation_container">'
			+'			<div class="profileInformationEditMode" id="profileInformationEditMode"></div>'
        	+'			<div class="profileInformationViewMode" id="profileInformationViewMode"></div>'
        	+'	</div>'
			+'	</div>'
			+' </div>';
		},
		
		userProfileContactInformation:function(){
			var html='';
			return html+='<div class=" greyboarder mar-bottom-25 pad-12 min-height-200" id="contactInformation_main_0">'                    
			+'   <div class="height-65"><span class="font-20 display-inline">Contact Information</span><span class="pull-right"><a href="javascript:void(0)" count = "0" id="contactInformation_edit_0"><i class="edit-sm-icons selected-sm"></i></a></span></div>'
			+'	<div class="horizontal-form userprofilelabelprofiileinfo contactinfoform" id="contactInformation_container">'
			+'   <div id="contactInformation_container_0">'
			+'			<div class="contactInformationEditMode" id="contactInformationEditMode_0"></div>'
        	+'			<div class="contactInformationViewMode" id="contactInformationViewMode"></div>'
        	+'	</div>'
			+'	</div>'
			+' </div>';
		},
		
		userProfileExperience:function(){
			var experienceHtml='';
			return experienceHtml+='<div class=" greyboarder mar-bottom-25 pad-lr-12 min-height-200">'
				+'	<div class="height-47 mar-bot-10">'
				+'		<h1 class="font-20">Experience'
				+'			<span class="pull-right"><a href="javascript:void(0)" id="experience_Add" class="ancher_lock"><i class="add-sm-icons margin_i_f"></i><span class="font-16">&nbsp;Add another experience</span></a></span>'
				+'		</h1>'
				+'	</div>'
				+'	<div class="horizontal-form userprofilelabelnowrap experienceform" id="experienceContainer">'
				+' 		  <div id="experience_container_0">'
            	+'			<div class="experienceEditMode" id="userExperienceEditMode_0"></div>'
            	+'			<div class="experienceViewMode" id="userExperienceViewMode"></div>'
            	+'		</div>'
				+'	</div>'                       
				+'</div>';
		},
		
		userProfileSkills:function(){
			var skillsHtml='';
			return skillsHtml+=	'<div class=" greyboarder mar-bottom-25 pad-lr-12 min-height-200" style="padding-bottom:30px">'
				+'	<div class="height-47 mar-bot-10"><h1 class="font-20">Skills<span class="pull-right"></span></h1></div>'
				+'		<div class="horizontal-form userprofilelabelprofiileinfo skillsform" id="skillsContainer">'
				+'			<div class="userSkillsEditMode" id="userSkillsEditMode">&nbsp;</div>'
				+'			<div class="skillsViewMode" id="userSkillsViewMode">&nbsp;</div>'
				+'		</div>'    
				+'			<div>&nbsp;</div>'
				+'</div>';
			},
			
			viewProfile:function(){
				var viewProfileHtml='';
				return viewProfileHtml+= '<div class="greyboarder mar-bottom-20 min-height-500 mar-top-63" id="viewProfileMainDiv">'
					+'<div class="pad-12"><div class="col-xs-3" id="userProfilePicView"></div>'
					+'	<div class="col-xs-9 pad-left-import-22" id="userprofile001">'
					+'     	<span class="pull-right position-relative hide" id="displayCrossBtn"><i class="close-sm-icons selected-sm viewProfileCloseBtn cursor-hand"></i></span>'
					+'		<div id="profileInformationView" class="profileInformationView"></div>'
					+'	</div>'
					+'	<div class="col-xs-9  col-xs-offset-3 pad-left-import-22" id="userprofile002">'
					+' 		<div id="contactInformationView" class="contactInformationView"></div>'
					+' 		<div id="userEducationView" class="userEducationView pad-top-20"></div>'
					+' 		<div id="userExperienceView" class="userExperienceView"></div>'
					+' 		<div id="userSkillsView" class="userSkillsView mar-bottom-20"></div>'
					+' 		<div id="userProjectsView" class="userProjectsView"></div>'
					+'	</div>'					
					+'	</div></div>';
				}
		};
	
}.call(this);


