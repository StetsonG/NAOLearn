/**
 * @author Next Sphere Technologies
 * 
 * Contains few of the Html templates on Dashboard. 
 * 
 */

var HTML = function(){
	return{
		mygroups:function(){
			var htmlTemplate = '<ul>{{#groupInfoModelList}}';
			return htmlTemplate += '<li >'
					+ '<a href="javascript:void(0)" class="popoverGroupShortInfoClass"><div id="groupLiId{{modifiedgroupId}}" class="groupShortInfoClass popoverParents" groupName="{{modifiedFullgroupName}}" groupLogo="{{modifiedgroupLogo}}" groupId="{{modifiedgroupId}}" groupReceivedInvitationCount="{{groupReceivedInvitationCount}}" groupPendingRequestCount="{{groupPendingRequestCount}}" eventInvitationCount="{{eventInvitationCount}}">'
					+ '{{#modifiedgroupLogo}}'
					+ '<img src="/contextPath/Group/{{modifiedgroupLogo}}/stamp.jpg" class="img-circle">'
					+ '{{/modifiedgroupLogo}}'
					+ '{{^modifiedgroupLogo}}'
					+ '<img src="'+contextPath+'/static/pictures/defaultimages/no-group-image.png" class="img-circle">'
					+ '{{/modifiedgroupLogo}}'
					+ '</div></a>'
					+ '<a href="javascript:void(0);" onclick="navigateGroupHome(\'{{modifieduniqueIdentifier}}\')"><div class="pad-5 line-height-14 font-12">{{modifiedGroupName}}</div></li> </a>{{/groupInfoModelList}}</ul>';

		},
		groupsReceivedInvitations:function(){
			/*var htmlTemplate = '<ul  style="overflow: auto;">{{#recievedInvitationModelList}}';
			return htmlTemplate += '<a href="javascript:void(0);" onclick="navigateGroupHome('
					+ "'{{groupUniqueIdentifier}}'"
					+ ')">'
					+ '<li>'
					+ '{{#groupLogoId}}'
					+ '<img src="/contextPath/Group/{{groupLogoId}}/stamp.jpg">'
					+ '{{/groupLogoId}}'
					+ '{{^groupLogoId}}'
					+ '<img src="'+contextPath+'/static/pictures/defaultimages/1.png">'
					+ '{{/groupLogoId}}'

					
					 * var groupName=''; if(obj['groupName'].length > 15){
					 * groupName = obj['groupName'].substring(0, 8)+'...';
					 * }else{ groupName = obj['groupName']; }
					 

					+ '<div class="pad-tb-10 line-height-14 min-height-50">{{groupName}}</div></li> </a>{{/recievedInvitationModelList}}</ul>';*/
			
		  	  var htmlTemplate='{{#recievedInvitationModelList}}';
				return htmlTemplate+='<div class=""><a class="" href="/contextPath/group/{{groupUniqueIdentifier}}" target="_blank">'
						+ '{{#groupLogoId}}'
						+ '<img src="/contextPath/Group/{{groupLogoId}}/stamp.jpg" height="50" width="50" >'
						+ '{{/groupLogoId}}'
						+ '{{^groupLogoId}}'
						+ '<img src="'+contextPath+'/static/pictures/defaultimages/no-group-image.png" height="50" width="50">'
						+ '{{/groupLogoId}}'	
		  	  			+'	</a><span class="bold mar-minus-10 position-relative top-pos-min-3"><a href="javascript:void(0)">{{groupName}}</a></span>'
		  	  			+'	<div class="mar-t4-l28" id="pi-buttons"><button class="btn btn-primary pad-tb-0" id"{{groupUniqueIdentifier}}">Approve</button>&nbsp;<button class="btn btn-default pad-tb-0"  id"{{groupUniqueIdentifier}}">Delete</button></div>'
		  	  			+'	</div>'
		  	  			+'{{/recievedInvitationModelList}}';
		
		},
		myCourse:function(){
			var htmlTemplate = '<ul  style="overflow: auto;">{{#courseInfoModels}}';
			return htmlTemplate += '<a href="'+contextPath+'/course/{{courseUniqueIdentifier}}"><li>{{^courseLogo}}<img src="'+contextPath+'/static/pictures/defaultimages/french.png"/>{{/courseLogo}}'
			+'{{#courseLogo}}<img src="/contextPath/Course/{{courseLogo}}/stamp.jpg"/>{{/courseLogo}}'
					+ '<div class="">{{#truncateFifteen}}{{courseName}}{{/truncateFifteen}}</div></li></a>{{/courseInfoModels}}</ul>';

		},
		myCoursePendingRequest:function(){
			var htmlTemplate = '<ul  style="overflow: auto;">{{#courseInfoModelList}}';
			return htmlTemplate += '<a href="'+contextPath+'/courses/{{courseUniqueIdentifier}}"><li><img src="'+contextPath+'/static/pictures/defaultimages/french.png">'
					+ '<div class="">{{courseName}}</div></li></a>{{/courseInfoModelList}}</ul>';

		},
		myCourseReceivedInvitations:function(){
			var htmlTemplate = '<ul  style="overflow: auto;">{{#recievedInvitationsModelList}}';
			return htmlTemplate += '<a href="'+contextPath+'/groups/{{groupName}}?invitationToken={{invitationToken}}">'
					+'<li><img src="'+contextPath+'/static/pictures/defaultimages/french.png">'
					+ '<div class="">{{associationName}}</div></li></a>{{/recievedInvitationsModelList}}</ul>';			

				},
		myConnections : function() {
			var htmlTemplate = '<ul>{{#manageGroupMemberModelList}}';
			return htmlTemplate += '<a href="javascript:void(0)">'
					+ '<li>'
					+ '{{#photoId}}'
					+ '<img src="/contextPath/User/{{photoId}}/stamp.jpg"  class="img-circle">'
					+ '{{/photoId}}'
					+ '{{^photoId}}'
					+ '<img src="/static/pictures/defaultimages/1.png" class="img-circle">'
					+ '{{/photoId}}'
					+ '<div class="pad-5 line-height-14 min-height-45">{{memberName_modified}}</div>'
					+ '</li></a>{{/manageGroupMemberModelList}}</ul>';
		},
		newConnection : function() {
			var htmlTemplate = '';
			return htmlTemplate += ''
				+ '<div class="modal fade" id="add-connections" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
				+ '<div class="modal-dialog">'
				+ '<div class="modal-content">'
				+ '<div class="modal-header">'
				+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="resetValues();">&times;</button>'
				+ '<h4 class="modal-title" id="myModalLabel"><i class="icon_link grey heading-icon"></i>&nbsp;&nbsp;<span class="paneal-heading-blue">Add Connections</span></h4>'
				+ '</div>'
				+ '<div class="modal-body" id="connections-data">'
				+ '         <span class="form-group">'
				+ '             <span class="col-lg-11">'
				+ '                 <input type="text" class="form-control" placeholder="Search by Name" id="searchValue" maxlength="100">'
				+ '                 <span class="red" id="searchNoResults" style="display: none;">Search found no results</span>'
				+ '                 <span class="red" id="noResultFound" style="display: none;">Search value cannot be empty</span>'
				+ '             </span>                                               '
				+ '             <span class="col-lg-1 margin-left-minus-10">'
				+ '                 <button type="button" id="searchForConnections" class="btn btn-primary"><i class="glyphicon search"></i></button>'
				+ '             </span>'            
				+ '         </span>'
				+ '         <div class="clearfix">&nbsp;</div>'
				+ '         <div class="clearfix">&nbsp;</div>'
				+ '         <div id="popUpMoreMessage" style="display: none;" class="text-center red">'
				+ '			The search resulted in  more than 25 matches. For better results please enter full search keyword and try again.'
				+ '			Click here to <a href="javascript:void(0);" onclick="getAllConnectionsForViewAll();">View All</a> search results.'
				+ '		</div>'
				+ '		<div class="clearfix">&nbsp;</div>'
				+ '         <div class="list-group" id="connectionsListValues">'
				+ '         </div> '
			+ '			</div>'
			+ ' 	</div><!--Modal Body End -->'
			+ '</div>'
			+ '</div>';
		},
		connectionSearchResults : function() {
			var htmlTemplate = '{{#searchResultModelList}}';
			return htmlTemplate += ''
			   + '<div class="processingConnect_{{groupId}}"><a href="javascript:void(0);" class="list-group-item">{{name}}<span class="fltrit">'
			   + '<button class="btn btn-info btn-mini" id="connectBtn_{{groupId}}" onclick=connect({{id}},{{groupId}});>Connect</button>'
			   + '<span class="green connectionSent_{{groupId}} hide">Connection Request Sent</span>'
			   + '</span></a>'
			   + '<div class="popup-processing" id="process_display_getConnections_connect_{{groupId}}" style="display: none;"><img src="'+contextPath+'/static/images/animated-processing.gif"/></div>'
			   + '</div>{{/searchResultModelList}}';

		},
		myConnectionSendRequest : function() {
			var htmlTemplate = '{{#connectionModelList}}';
			return htmlTemplate += '<a class="" href="'+contextPath+'/user/profile/{{uniqueIdentifier}}" target="_blank">'
				+ '<div class="group-members-div pad-tb-5 clearfix"><span class="col-xs-4">'
				+ '{{#photoId}}'
				+ '<img src="/contextPath/Group/{{photoId}}/stamp.jpg" height="50" width="50" >'
				+ '{{/photoId}}'
				+ '{{^photoId}}'
				+ '<img src="'+contextPath+'/static/pictures/defaultimages/1.png" height="50" width="50">'
				+ '{{/photoId}}'				
				+ '</span><span class="col-xs-8">{{name}}</span><br/>'
				+ '{{#statusEnum}}'
				+ '<span class="col-xs-8">Pending for Approval</span></div>'
				+ '{{/statusEnum}}'
			   + '</a>{{/connectionModelList}}';

		},
		myConnectionPendingRequest : function() {
		  	  var htmlTemplate='{{#manageGroupMemberModelList}}';
				htmlTemplate+='<div class="events-left-border"><a class="pull-left" href="'+contextPath+'/user/profile/{{profileUniqueIdentifier}}" target="_blank">'
						+ '{{#photoId}}'
						+ '<img src="/contextPath/Group/{{photoId}}/stamp.jpg" height="50" width="50" >'
						+ '{{/photoId}}'
						+ '{{^photoId}}'
						+ '<img src="'+contextPath+'/static/pictures/defaultimages/1.png" height="50" width="50">'
						+ '{{/photoId}}'	
		  	  			+'	</a><span class="bold mar-minus-10 position-relative top-pos-min-3"><a href="javascript:void(0)">{{memberName_modified}}</a></span>'
		  	  			+'	<div class="mar-t4-l28">{{joinRequestedDate}}</div>'
		  	  			+'	<div class="mar-t4-l28" id="pi-buttons"><button class="btn btn-primary pad-tb-0" id"{{memberId}}">Accept</button>&nbsp;<button class="btn btn-default pad-tb-0"  id"{{memberId}}">Decline</button></div>'
		  	  			+'	</div>'
		  	  			+'{{/manageGroupMemberModelList}}';

		},
		newCourse : function() {
			var htmlTemplate = '';
			return htmlTemplate += ''
				+ '<div class="modal fade" id="add-course" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
				+ '<div class="modal-dialog">'
				+ '<div class="modal-content">'
				+ '<div class="modal-header">'
				+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
				+ '<h4 class="modal-title" id="myModalLabel"><i class="icon_link grey heading-icon"></i>&nbsp;&nbsp;<span class="paneal-heading-blue">Add Course</span></h4>'
				+ '</div>'
				+ '       	<div class="form-group">'
				+ '         <label for="Name">Course Name:</label>'
				+ '         <input type="text" class="form-control" id="courseNameInputID"/>'    
				+ '     </div>'
				+ '     <div class="">'
				+ '         <label for="button"></label>'
				+ '         <input value="create" class="def-button font-14 pad-lr-10" type="button" id="addCourseButtonID">' 
				+ '     </div>'                                            
				+ '		<div class="clearfix">&nbsp;</div>'
				+ '         <div class="list-group" id="connectionsListValues">'
				+ '         </div> '
			+ '		 <span id="process_display_getConnections" style="display: none;" class="popup-processing"><img src="<c:url value = "/static/images/ajax-loader.gif"/>" class="pad-right-10"></span>'
			+ '			</div>'
			+ ' 	</div><!--Modal Body End -->'
			+ '</div>'
			+ '</div>';
		},
		manageGroups : function() {}

	};
	
}.call(this);


