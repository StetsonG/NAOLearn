/**
 * @author Next Sphere Technologies
 * 
 * Contains all Html templates for Groups related views
 * 
 */

var HTML = function(){
	return{
		    groupProfile:function(){
		    	var htmlTemplate='';
		    	return htmlTemplate+='<div class="height-47 groups-dropdown width-100per">'
		    						/*group-header-scrolled added class to fix the bug number XIP-3208 which raised by carlos*/
		    		               +'   <div class="group-header group-header-scrolled pad-bot-20" id="groupNameContainer"></div>'
			                       +'</div>'
			                       +'<div class="darkgreytopborder width-100per"></div>'
			                       +'<div class="groupface-block height-294 pad-bot-12" id="groupFaceContainer">'
			                       +'</div>';
		    },
		    groupface:function(){
				var htmlTemplate='';
				return htmlTemplate+='<div id="faceScrollDiv" class="mCustomScrollbar height-325">'									
					+'	 <div class="group-face-view-panel" id="group-face-view-mode">'
					+'		<div id="groupLogoDiv" class="onecolumn min-height-210 float-left text-right pad-right-15 hide pad-top-60"><img src="{{groupLogo}}" isDefault="{{isDefaultLogo}}" width="200px" height="200px"></div>'
					+'      {{#isFromInfo}}'
					+'       	<div id="" class="face-info-block-header">'
					+'          	{{#isRelatedGroups}}'
					+'          	<span title="{{groupName}}">{{changedGroupName}}</span>'
					+'				{{/isRelatedGroups}}'
					+'				{{^isRelatedGroups}}'
					+'          	<span class="font-18-thin">About Group</span>' 
					+'				{{/isRelatedGroups}}'
					+'          	<span class="pull-right">'
					+'				{{#isRelatedGroups}} {{#isGroupHomeorShellPage}}'		
					+'          	{{#isOwner}}<input type="button" id="idDeleteGroupbuttonid" isSubGroup={{isSubGroup}} uniqueIdentifier={{uniqueIdentifier}} groupidd="{{groupidd}}" class="def-button font-17 mar-right-5-minus" value="Delete Group">{{/isOwner}}'
					+'          	{{^isOwner}}<input type="button" id="learnmoreebuttonid" learnmorelink="{{weblinkAddress}}?page=shell" class="def-button font-17 mar-right-5-minus" value="Learn More">{{/isOwner}}'
					+'				{{/isGroupHomeorShellPage}}'
					+'				{{^isGroupHomeorShellPage}}'		
					+'          	{{#isOwner}}<input type="button" id="learnmoreebuttonid" learnmorelink="{{weblinkAddress}}?page=shell" class="def-button font-17 mar-right-5-minus" value="Learn More">{{/isOwner}}'
					+'          	{{^isOwner}}<input type="button" id="learnmoreebuttonid" learnmorelink="{{weblinkAddress}}?page=shell" class="def-button font-17 mar-right-5-minus" value="Learn More">{{/isOwner}}'
					+'				{{/isGroupHomeorShellPage}}{{/isRelatedGroups}}'
					
					+'          	<span id="removeIconContainer-{{containerElement}}" class="hide font-16 pad-left-8"><a href="javascript:void(0);"><i id="removeGroupInfoOverlay-{{containerElement}}" container="{{containerElement}}" class="close-sm-icons selected-sm memebr-fv-remove cursor-hand"></i></a> </span>'
					+'          	</span>'
					+'        	</div>'
					+'      {{/isFromInfo}}'
					+'          <div id="contactus-message-container"></div>'
					
					/*+'		Display only when information icon click or related groups clicked'*/
			        +'		{{#isFromInfo}}<div class="onecolumn min-height-210 float-left groupviewModeSection no-border mar-right-25 margin-bottom-0 pad-left-12 pad-top-25 nofloat">'
					+'	 		<div id="groupEditEdit" class="hide">&nbsp;</div>'
					+'   		<div id="groupViewMode" class="">'
					+'			<div class="form-group">'
					+'				<label for="projectTitle" class="font-13-roman">Name</label>'
					+'				<span id="view_groupName" class="font-13-thin">{{groupName}}</span>'                                        
					+'			</div>'
					+'			<div class="form-group">'
					+'				<label class="text-left font-13-roman" for="projectTitle" >Type</label>'
					+'				<span id="groupTypeExistingName" class="font-13-thin">{{groupType}}</span>'  
					+'              <span id="view_groupType" class="hide">{{groupTypeId}}</span>'
					+'			</div>'
					+'			<div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Category</label>'
					+'			<span id="groupCategoryExistingName" class="font-13-thin">{{groupCategory}}</span>'  
					+'			<span id="view_groupCategory" class="hide">{{groupCategoryId}}</span>' 
					+'			</div>'
					+'			<div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Privacy</label>'
					+'			<span id="view_groupPrivacy" class="font-13-thin">{{groupPrivacy}}</span>'                                        
					+'			</div>'
					/*+'			<div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Weblink</label>'
					+'			<span id="view_website" class="font-13-thin" title="{{weblinkAddress}}">{{weblinkFullAddress_modified}}</span>'                                        
					+'			</div>'
					+'			<div class="form-group hide">'
					+'			<label for="projectTitle">Website</label>'
					+'			<span id="view_website">{{weblink}}</span>'                                        
					+'			</div>'*/
					+'			<div class=""><div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Created</label>'
					+'			<span class="font-13-thin">{{createdDate}}</span>'
					+'			</div>'
					+'			<div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Members</label>'
					+'			<span class="font-13-thin">{{membersCount}}</span>'                                        
					+'			</div>'
					+'          {{#subgroupsCount}}'
					+'			<div class="form-group">'
					+'			<label for="subGroupsCount">Subgroups</label>'
					+'			<span>{{subgroupsCount}}</span>'                                        
					+'			</div>'
					+'          {{/subgroupsCount}}'
					+'      {{#isFromInfo}}'
					+'			<div class="form-group white-space-preline">'
					+'			<span class="font-12-thin">{{groupProfile}}</span>'
					+'			</div>'
					+'      {{/isFromInfo}}'
					+'		</div></div>'
					+'	</div>{{/isFromInfo}}'
					/*+'		Display only in Group Face'*/
					+'		{{^isFromInfo}}<div  class=" onecolumn min-height-210 float-left groupviewModeSection no-border mar-right-25 margin-bottom-0 pad-left-12 pad-top-60 nofloat">'
					+'	 		<div id="groupEditEdit" class="hide">&nbsp;</div>'
					+'   		<div id="groupViewMode" class="">'
					+'			<div class="form-group">'
					+'				<label for="projectTitle" class="font-13-roman">Name</label>'
					+'				<span id="view_groupName" class="font-13-thin">{{groupName}}</span>'                                        
					+'			</div>'
					+'			<div class="form-group">'
					+'				<label class="text-left font-13-roman" for="projectTitle">Type</label>'
					+'				<span id="groupTypeExistingName" class="font-13-thin">{{groupType}}</span>'  
					+'              <span id="view_groupType" class="hide">{{groupTypeId}}</span>'
					+'			</div>'
					+'			<div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Category</label>'
					+'			<span id="groupCategoryExistingName" class="font-13-thin">{{groupCategory}}</span>'  
					+'			<span id="view_groupCategory" class="hide">{{groupCategoryId}}</span>' 
					+'			</div>'
					+'			<div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Privacy</label>'
					+'			<span id="view_groupPrivacy" class="font-13-thin">{{groupPrivacy}}</span>'                                        
					+'			</div>'
					/*+'			<div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Weblink</label>'
					+'			<span id="view_website" class="font-13-thin" title="{{weblinkAddress}}">{{weblinkFullAddress_modified}}</a></span>'                                        
					+'			</div>'
					+'			<div class="form-group hide">'
					+'			<label for="projectTitle">Website</label>'
					+'			<span id="view_website">{{weblink}}</span>'                                        
					+'			</div>'*/
					+'			<div class=""><div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Created</label>'
					+'			<span class="font-13-thin">{{createdDate}}</span>'
					+'			</div>'
					+'			<div class="form-group">'
					+'			<label for="projectTitle" class="font-13-roman">Members</label>'
					+'			<span class="font-13-thin">{{membersCount}}</span>'                                        
					+'			</div>'
					+'          {{#subgroupsCount}}'
					+'			<div class="form-group hide">'
					+'			<label for="subGroupsCount">Subgroups</label>'
					+'			<span>{{subgroupsCount}}</span>'                                        
					+'			</div>'
					+'          {{/subgroupsCount}}'
					+'      {{#isFromInfo}}'
					+'			<div class="form-group">'
					+'			<span class="font-12-thin">{{groupProfile}}</span>'
					+'			</div>'
					+'      {{/isFromInfo}}'
					+'		</div></div>'
					+'	</div>{{/isFromInfo}}'
					
					+'	<div class="onecolumn min-height-210 float-right mar-top-25 pad-right-12 width-230" >'
					+'		<div class="text-right hide" id="groupInfoButtonsDiv"><span class="pull-right mar-left-15-minus">{{#isFromManage}}{{#hasDeletePermission}}<input value="Delete Group" id="delete-group-button" class="isManageSectionDivClass def-button mar-right-12" type="button">{{/hasDeletePermission}}<a href="javascript:void(0);" class="pad-right-12 isManageSectionDivClass" id="edit-group-face"><i class="edit-sm-icons enabled-sm"></i> </a>{{/isFromManage}}{{^isFromManage}}{{#isMember}}{{^isOwner}}<input type="button" class="def-button mar-right-12" value="Leave" id="leave-group-button">{{/isOwner}}{{/isMember}}{{#isInPending}} <div class="mar-bottom-10 element-font-15">{{statusMsg}}</div> {{/isInPending}}{{#isNotMember}}<input type="button" class="def-button mar-right-12" join-group-id="{{uniqueIdentifier}}" value="Join" id="join-group-button">{{/isNotMember}}<input type="button" class="def-button" value="Contact Us" id="group-contactus-button">{{/isFromManage}}</span></div>'
					+'		<div class="clear-float owner-details pad-right-12">'
					+'			<div class="font-13px helvetica-neue-roman pad-bot-2 text-right">Owner</div>'
					+'			<div class="profile-photos text-right">'
					+'         		<ul class="inline-ul">'
					+'          		<li class="inline-block"><a title="{{owner.memberName}}" href="'+contextPath+'/userprofile/profile/{{owner.profileUniqueIdentifier}}" target="_blank"><img class="mar-right-0 ownerimg" src="{{owner.userPhotoId}}"/>'
					/*+'					<div class="text-center">{{owner.memberName}}</div>'*/
					 +'					</a></li>'
					+'         		</ul>'
					+'      	</div>'
					/*+'			<div>&nbsp;</div>'*/
					+'      	{{#isAdminsAvailable}}'
					+'			<div class="font-13px helvetica-neue-roman pad-bot-2 text-right">Administrator(s)</div>'
					+'			<div class="clearfix">'
					+'			<a class="next slide-next"><i class="next-sm-icons"></i></a>'
					+'			<div class="profile-photos slide-photos text-right">'
					+'         		<ul class="list-unstyled list-inline">'
					+'      		{{#administrators}}'
					+'           		<li ><a href="'+contextPath+'/userprofile/profile/{{admin.profileUniqueIdentifier}}" title="{{admin.memberName}}" target="_blank">'
					+ '{{#admin.userPhotoId}}'
					+ '<img src="{{admin.userPhotoId}}" class="mar-right-0">'
					+ '{{/admin.userPhotoId}}'
					+ '{{^admin.userPhotoId}}'
					+ '<img src="'+contextPath+'/static/pictures/defaultimages/1.png" class="mar-right-0" width="50">'
					+ '{{/admin.userPhotoId}}'
					+'			</a></li>'
					+'      		{{/administrators}}'
					+'         		</ul>'
					+'      	</div>'
					+'      	<a class="prev slide-prev"><i class="previous-sm-arrows"></i></a>'
					+'      	</div>'
					+'       	{{/isAdminsAvailable}}'
					+'			</div>'
					+'	</div>'
                                        +'                      </div>'
					+'<div class="groupFace-Edit-View" id="groupFace-Edit-View"></div>'
					+'</div>';
			    
			},
			childgroups:function(){
				var htmlTemplate='';
				return htmlTemplate+='<div class="childgroup-section min-height-280">'
									+'	<div class="font-30 clearfix mediumgray">Child Groups <a href="#" class="font-20 pad-left-10" id="childGroupsCount"></a></div>'
									+'	<div class="pad-tr-20">'
									+'		<div class="groups-profilepic position-relative" id="childGroupContent">                                                '
									+'		</div>'
									+'	</div>'
									+'</div>'
									+'<div id="moreGroups" class="align-right more-link clear-float padding-right-35">'
									+'<span id="processingSymbolMyGroups" style="display: none;"><img src="'+contextPath+'/static/images/ajax-loader.gif" class="pad-right-10"></span>'
									+'<a href="javascript:void(0)" class="font-12px-darkblue" id="moreGroups" title="See More">See More...</a>'
									+'</div>';
			},
			relatedgroups:function(){
			var htmlTemplate='';
			return htmlTemplate+='<div class="relatedgroup-section" id="relatedgroup-section-id">'
								+'<input type="hidden" id="{{associationType}}relatedgroupsstartResult" value="{{startResult}}" />'
								+'<input type="hidden" id="{{associationType}}relatedgroupsmaxResult" value="{{maxResult}}" />'
								+'<div class="font-20 helvetica-neue-roman pad-trbl-3040 clearfix">{{associationHeader}}<a href="javascript:void(0)" class="font-18px pad-left-10 lightblue"  associationType="{{associationType}}" id="{{associationType}}relatedgroupscount"></a>'
								+'{{#isHomeGroups}}&nbsp;&nbsp;<a href="javascript:void(0)" class="plus-sm-icons" id="createSubGroup"></a><span style="display: none;" id="processingSymboCreateGroupIcon"><img class="pad-right-10" src="'+contextPath+'/static/images/ajax-loader.gif"></span>'
								+'<span class="font-20 pull-right text-right width-50per"><input class="width-85per helvetica-neue-roman font-12px input-0-border searchpost-textbox hide mar-right-2" placeholder="Search groups" id="group-name-search-box" type="text"><a href="javascript:void(0);" level="all" id="group-search-icon"><i class="search-sm-icons" id="groupNameSearch"></i></a><span style="display: none;" id="processingSymboSearchGroup"><img class="pad-right-10" src="'+contextPath+'/static/images/ajax-loader.gif"></span></span>{{/isHomeGroups}}'
								+'</div>'
								+'	<div class="pad-top-10">'
								+'		<div class="groups-profilepic position-relative min-height-360" id="{{associationType}}relatedGroupContent" > '
								+'		</div>'
								+'	</div>'
								+'</div>'
								+'<div id="moreGroups" class="align-right more-link clear-float padding-right-35">'
								+'<span id="processingSymbolMyGroups" style="display: none;"><img src="'+contextPath+'/static/images/ajax-loader.gif" class="pad-right-10"></span>'
								+'<a href="javascript:void(0)" id="{{associationType}}moreGroups" associationType="{{associationType}}" class="hide font-12px-darkblue" title="See More">See More...</a>'
								+'<a href="javascript:void(0)" id="{{associationType}}hideGroups" associationType="{{associationType}}" class="hide font-12px-darkblue" title="Hide">Hide</a>'
								+'</div>';
			},
			groupconnections:function(){
				var htmlTemplate='';
				return htmlTemplate+='<div><div class="pad-bot-5 font-15px helvetica-neue-roman">{{groupLevelConnectionHeading}}</div>'
									+'<div id="displayGroupMembers_{{level}}" class="min-height-215"></div>'
									+' <div style="display:none;" level="{{level}}" id="moreConnectionMembers_{{level}}">'
									+'    <span style="display: none;" id="processingSymbolMore"><img class="pad-right-10" src="'+contextPath+'/static/images/ajax-loader.gif"></span>'
									+'    <a href="javascript:void(0)" class="font-10px helvetica-neue-roman">See All </a>'
									+'</div><div class="pad-top-10 dark-bottom-border"></div></div>';
			},
			knownconnections:function(){
				var htmlTemplate='';
				return htmlTemplate+='<div><div class="pad-bot-5 font-15px helvetica-neue-roman">People you may know in the Group</div>'
									+'<div id="displayknownMembers"></div>'
									+' <div style="display: none;" id="moreKnownGroupMembers" class="panel-footer align-right">'
									+'    <span style="display: none;" id="processingSymbolMoreMem"><img class="pad-right-10" src="'+contextPath+'/static/images/ajax-loader.gif"></span>'
									+'    <a href="javascript:void(0)" class="font-10px helvetica-neue-roman">View All </a>'
									+'</div><div class="pad-top-10 dark-bottom-border"></div></div>';
			},
			groupMembersHeader : function(){
				var htmlTemplate='';
				return htmlTemplate+=''
									+'	<span class="navBot menuiconpaddingclass">'						 
									+'		 <li class="dropdown {{^isFromManage}}pad-top-10{{/isFromManage}}">'
									+'			<a href="#" data-toggle="dropdown" class="  class  dropdown-toggle group-dropdown-manage"><i class="filter-sm-icons"></i></a>'
									+'			<ul class="common-dropdown-menus dropdown-menu arrow-left pad-bot-10-user">'
									+'             {{#isFromManage}}'
									+'				<li><a id="manage-group-members-active" href="javascript:void(0);" level="all" levelName="Active">Active</a></li>'
									+'              {{#isControlledGroup}}'
									+'				<li><a id="manage-group-members-pending" href="javascript:void(0);" level="pending" levelName="Pending">Pending</a></li>'
									+'				<li><a id="manage-group-members-preapproved" href="javascript:void(0);" level="preapproved" levelName="PreApproved">PreApproved</a></li>'
									+'              {{/isControlledGroup}}'
									+'             {{/isFromManage}}'
									+'             {{^isFromManage}}'
									+'				<li><a id="connection-group-all" href="javascript:void(0);" level="all" levelName="Group Members">All</a></li>'
									+'				<li><a id="connection-group-myconnections" href="javascript:void(0);" level="myconnections" levelName="My Connections">My Connections</a></li>'
									+'				<li><a id="connection-group-others" href="javascript:void(0);" level="others" levelName="Others">Others</a></li>'
									+'             {{/isFromManage}}'
									+'			</ul>'
									+'		</li>'                           
									+'	</span>'
									+'	<div class="width-600 pad-left-10 font-20 helvetica-neue-roman inline-block"><span id="group-members-subtitle">{{#levelName}} {{levelName}} {{/levelName}}{{^levelName}} Group Members {{/levelName}}</span><span class="font-20 pull-right text-right width-50per"><input class="width-85per helvetica-neue-roman font-12px input-0-border searchpost-textbox hide mar-right-2" placeholder="Search members" id="group-member-name-search-box" type="text"> <a href="javascript:void(0);" level="all" id="group-members-search-icon"><i class="search-sm-icons"></i></a></span></div>'
									+'';
			},
			recentEvents:function(){
				var htmlTemplate='';
				return htmlTemplate+='<div><div class="pad-bot-10 font-15px helvetica-neue-roman" id="eventType"></div>'
									+'	<div id="recentEventsList" class="min-height-215">'
									+'	</div>'
									+'<div class="hide" id="moreEvents"><a href="javascript:void(0)" class="font-10px helvetica-neue-roman">See All</a></div><div class="pad-top-10 dark-bottom-border"></div></div>';
				},
			groupManageHeader : function(){
				var htmlTemplate='';
				return htmlTemplate+=/*'<div class="twocolumn-25 float-left">'
									+'	<div class="height-47 groups-dropdown">'*/
									'		<div class="garoup-menus pad-left-20 ismanagesectionview">'
									+'		  <ul>'
									+'				<li><a href="javascript:void(0)" id="manageMembersLink-{{container}}" class="warmgreylink font-20"><span class="active">Members</span></a></li>'
									+'				<li><a href="javascript:void(0)" id="inviteMembersLink-{{container}}" class="warmgreylink font-20"><span class="active">Invitation</span></a></li>'
									+'				<li><a href="javascript:void(0)" id="groupCalanderLink-{{container}}" class="warmgreylink font-20"><span class="active">Calendar</span></a></li>'
									+'              {{^isSubGroup}}'
									+'				<li><a href="javascript:void(0)" id="getSubGroups" class="warmgreylink font-20"><span class="active">Subgroups</span></a></li>'
									+'              {{/isSubGroup}}'
									+'				<li><a href="javascript:void(0)" class="warmgreylink font-20" id="aboutGroup"><span class="active">About</span></a></li>'
									+'			</ul>'
									+'		</div><div class="bottom-border mar-right-12"></div>';
									/*+'	</div>'
									+'	</div>';*/

			},
			groupSettings : function(){
				var htmlTemplate='';
           	 	return htmlTemplate+='<div class="pad-trbl-30">'
						           	+'<div class="font-20 helvetica-neue-roman clearfix pad-bot-15" id="groupSettings-maindiv">Group Settings'
						           	+'	<span class="pull-right">'
						           	/*+'		<a href="javascript:void(0)" class="greylink ancher_lock" id="saveGroupSettings"><i class="glyphicon glyphicon-ok-circle warmgray"></i></a>&nbsp;'
						           	+'		<a href="javascript:void(0)" class="greylink" id="cancelGroupSettings"><i class="warmgray close-sm-icons selected-sm-circle"></i></a>'
						           	+'		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'*/
						           	+'		<a href="javascript:void(0)" id="EditGroupSettings" class="disable"><i class="edit-sm-icons disabled-sm"></i></a>'
						           	+'	</span>'
						           	+'</div>'
						           	+'<div class="pad-lrb-20">'
						           	+'	<div class="font-14 pad-bot-10">Permission on Blogs</div>'
						           	+'	<div id="permissionOnBlogsDiv">'
						           	+'	</div>'
						           	+'	<div class="clear-float">'
						           	+'	<div class="font-14 pad-bot-10">Permission on Discussion Board</div>'
						           	+'		<div id="permissionOnDiscussionsDiv">'
						           	+'	</div>'
						           	+'	</div>'
						           	+'</div>'
						           	+'	<div class="form-group hide" id="groupSettingsButtons">'
									+'	<input type="button" value="Save" id="saveGroupSettings" class="def-button font-17 mar-right-8" />'
									+'	<input type="button" value="Cancel" id="cancelGroupSettings" class="grey-button font-17" />'
									+'	</div>'
						           	+'</div>';
			},
			preapprovalinvite : function(){
				var htmlTemplate='';
				return htmlTemplate+='';

			},
			subgroup : function(){
				var htmlTemplate='';
				return htmlTemplate+='<div><div class="pad-bot-5 font-15px helvetica-neue-roman" id="subgroup">Subgroups</div>'
									+'	<div id="subgroup-display" class="min-height-200">'
									+'	</div>'
									+'<div class="hide" id="more-subgroups"><a href="javascript:void(0)" id="sub-group-see-all" class="font-10px helvetica-neue-roman">See All</a></div><div class="pad-top-10 dark-bottom-border"></div></div>';
			}
		};
}.call(this);