/**
 * @author Next Sphere Technologies
 * smartwall2x1 Widget
 * 
 *smartwall2x1 Widget is deafult widget for the smart wall,
 * 
 *
 * Technical Description
 * 
 * 1.use as much private methods as possible
 * 2.limit direct element looking instead pass selectors as options
 * 3.try to load element at most once and use it reference in other places to avoid too much dom interaction
 * 4.use event triggers whenever needed so any widget actions can be extended outside widget scope
 * 5.make functions specific to its scope and minimal
 */
(function($, undefined) {
	'use strict';
	var _super = $.Widget.prototype;
	$.widget('xiim.smartwall2x1', {
	   version : '1.0.0',
	   options : {
		   	accessToken : $("#accessToken_meta").val(),
			langId : $("#langId_meta").val(),
			userId : $("#loggedInUserId-meta").val(),
			userProfileName: $("#userProfileName").val(),
			userProfilePhotoId: $("#userProfilePhotoId").val(),
			emailId: $("#emailId").val(),
			groupId: $("#groupId").val(),
			receiverType: $("#receiverType").val(),
			userPhotoId:$("#userProfilePhotoId").val(),
			connectionGroupUniqueIdentifier:$("#connectionGroupUniqueIdentifier").val(),
	   },
	   selectors : {
		   dashBoardOption:".dashboard-smartWall-option",
		   twoByOneConnections:"#smartwall2x1Connections",
		   twoByOneCourses:"#smartwall2x1Coureses",
		   twoByOneGroups:"#smartwall2x1Groups",
		   seeAll:"#smartwall2x1SeeAll",
		   showMostActivePosts:"#showPostsMore",
		   showAnnouncements2X1More:"#showAnnouncements2X1More",
		   twoByOneResourse:".twoByOneResourse"
	   },
	   templates:{},
	   smartwallPostsRequestOptions:{},
	   smartwallPostsRequest:{},
	   resourcesRequest:{},
	   startResult:0,
	   maxResult:30,
	   displayedAnnouncements:0,
	   displayedPosts:0,
	   newsAndAnnouncements:[],
	   mostActivePosts:[],
	   timeZone:getOffset(),
	   
	   /**
	    * _create is the first method called after widget is initialized
	    */
	   _create : function() {
		   this.smartwallPostsRequestOptions = {filterOption:"AL"};
		   this._getTemplates();
		   this._injectDom();
		   this._addActions();
		   
		   this._loadDefaultPosts();
		   
		   
	   },
	   
	   /**
	    * _getTemplates is used to get all templates
	    */
		_getTemplates:function(){
			this.templates.allPosts = jQuery('#smartwall2X1').html();
			this.templates.twoByOnePost = jQuery('#twoByOnePost').html();
			this.templates.twoByOneAnnouncement = jQuery('#twoByOneAnnouncement').html();
			this.templates.resourcesTemplate = jQuery('#resourcesTemplate').html(); 
		},
		/**
		 * _injectDom is used to inject the elements into the dom
		 */
		_injectDom: function(){
			var uielementJSON = HTMLUIElements.smartwall2x1();
			
			uielementJSON.contextPath = contextPath;
			
			$("#baseElementSmartwall").html(Mustache.to_html(this.templates.allPosts,uielementJSON));
			
			var xiimcustomScrollbarOptions = {elementid:"#smartwall-div",isUpdateOnContentResize:true,setHeight:"1175px",vertical:'y'};
			xiimcustomScrollbar(xiimcustomScrollbarOptions);
			
		},
		/**
		 * _addActions is used to specify all the actions
		 */
		_addActions: function(){
			this._on(this.selectors.dashBoardOption,{click:"_dashBoardOptions"});
			//this._on(this.selectors.seeAll,{click:"_seeAll"});
		},
		/**
		 * _dashBoardOptions is used when selects the dash board option 
		 */
		_dashBoardOptions:function(e){
			var target = $(e.target);
			var option = target.data("option");
			this.smartwallPostsRequestOptions.filterOption=option;
			
			$(this.selectors.dashBoardOption).removeClass('highlight-menu');
			target.addClass('highlight-menu');
			
			switch (option) {
			    case 'AL':
			    	$(this.selectors.twoByOneConnections).removeClass('hide');
			    	$(this.selectors.twoByOneCourses).removeClass('hide');
			    	$(this.selectors.twoByOneGroups).removeClass('hide');
			        break;
			    case 'ME':
			    	$(this.selectors.twoByOneConnections).removeClass('hide');
			    	$(this.selectors.twoByOneCourses).addClass('hide');
			    	$(this.selectors.twoByOneGroups).addClass('hide');
			        break;
			    case 'CN':
			    	$(this.selectors.twoByOneConnections).removeClass('hide');
			    	$(this.selectors.twoByOneCourses).addClass('hide');
			    	$(this.selectors.twoByOneGroups).addClass('hide');
			        break;     
			    case 'CR':
			    	$(this.selectors.twoByOneConnections).addClass('hide');
			    	$(this.selectors.twoByOneCourses).removeClass('hide');
			    	$(this.selectors.twoByOneGroups).addClass('hide');
			        break;
			    case 'GR':
			    	$(this.selectors.twoByOneConnections).addClass('hide');
			    	$(this.selectors.twoByOneCourses).addClass('hide');
			    	$(this.selectors.twoByOneGroups).removeClass('hide');
			        break;   
			}
			
			this._loadDefaultPosts();
			
		},
		
		/**
		 * _loadDefaultPosts is used to load posts on dashboard loads
		 */
		_loadDefaultPosts:function(){
			
			this._generateResourceRequest(this.startResult,this.maxResult);
			this._loadResoursesAndPosts();
		},
		
		/**
		 * _generateResourceRequest is used to generate the requests
		 */
		_generateResourceRequest:function(startResult,maxResult){
			this.smartwallPostsRequest={
					  accessToken:this.options.accessToken,
	       			  langId:this.options.langId,
	       			  userId:this.options.userId,
	       			  resourceType:"",
	       			  resourceId:"",
	       			  uniqueIdentifier:"",
	       			  timeZone:this.timeZone,
	       			  filterOption:this.smartwallPostsRequestOptions.filterOption 
			};
			
			this.resourcesRequest={
					accessToken:this.options.accessToken,
	       			langId:this.options.langId,
					filterOption:this.smartwallPostsRequestOptions.filterOption ,
		       		userId:this.options.userId
			};
			
		},
		
		/**
		 * _loadResoursesAndPosts is used to load the posts,news,announcements
		 */
		_loadResoursesAndPosts:function(){
			var currentRef = this;
			
			
			
       	 	var resourceRequestData = JSON.stringify(this.resourcesRequest);
       	 	var resourceRequestOptions={
         			url:getModelObject('serviceUrl')+'/feed/1.0/getActiveResources',
         			data:resourceRequestData,
         			async:false,
         			successCallBack:function(data){
         				var resourcesList = data['resourceModel'];
         				if(resourcesList){
         					
         					currentRef._injectDom();
         					
	         				if( resourcesList.length == undefined ){
	         					resourcesList = [resourcesList];
							}
	         				
	         				for(var i=0;i<resourcesList.length;i++){
	         					if(resourcesList[i].resourceType == 'GROUP'){
	         						resourcesList[i].isGroup=true;
	         					}else if(resourcesList[i].resourceType == 'CONNECTION'){
	         						resourcesList[i].isConnection=true;
	         					}else if(resourcesList[i].resourceType == 'COURSE'){
	         						resourcesList[i].isCourse=true;
	         					}
	         					
	         					resourcesList[i].resourceOriginalName=resourcesList[i].resourceName;
	         					resourcesList[i].resourceName = (resourcesList[i].resourceName.length>21)?resourcesList[i].resourceName.substr(0,21)+"..":resourcesList[i].resourceName;
	         				
	         					resourcesList[i].contextPath = contextPath;
	         					
	         					if(resourcesList[i].activeScore == "0"){
	         						resourcesList[i].isDisplayActiveScore = false;
	         					}else{
	         						resourcesList[i].isDisplayActiveScore = true;
	         					}
	         				}
	         				
	         				var resoucsesData = {resourcesList:resourcesList};
	         				
	         				$("#resoursesSection").html(Mustache.to_html(currentRef.templates.resourcesTemplate,resoucsesData));
	         				currentRef._on(currentRef.selectors.twoByOneResourse,{click:"_twoByOneResourse"});
	         				
	         				var smartwallPostsRequestData = JSON.stringify(currentRef.smartwallPostsRequest);
	         	       	 	
	         				currentRef._loadAnnouncementsAndPosts(smartwallPostsRequestData,currentRef);
         				}else{
         					$("#baseElementSmartwall").html('<div style="text-align:center;"><br><br><i class="warning-sm-icons"></i> You have no posts yet.</div>');
         				}
         			}
       	 	};
       	 	
       	 	doAjax.PostServiceInvocation(resourceRequestOptions);
       	 	
       	 	
		},
		/**
		 * _showAnnouncements2X1More is used to load announcements on click more
		 */
		_showAnnouncements2X1More:function(e){
			var requiredAnnouncementsList = [];
			var recentDisplayedAnnouncements = this.displayedAnnouncements + 4;
			for(var i = this.displayedAnnouncements;i < recentDisplayedAnnouncements;i++){
				if(this.newsAndAnnouncements[i]){
					requiredAnnouncementsList.push(this.newsAndAnnouncements[i]);
				}
			}
			this.displayedAnnouncements = recentDisplayedAnnouncements;
			
			var data = {announcementList:requiredAnnouncementsList};
			
			$("#showAnnouncements2X1More").remove();
			$("#2x1NewsAndAnnouncementDiv").append(Mustache.to_html(this.templates.twoByOneAnnouncement,data));
			
			if(this.newsAndAnnouncements.length >  this.displayedAnnouncements){
					$("#2x1NewsAndAnnouncementDiv").append('<div id="showAnnouncements2X1More" class="font-12px-darkblue clear-float pull-left cursor-hand">See More...</div>');
					this._on(this.selectors.showAnnouncements2X1More,{click:"_showAnnouncements2X1More"});
			}
		},
		/**
		 * _showMostActivePosts used to load most active posts
		 */
		_showMostActivePosts:function(e){
			var requiredPostsList = [];
			var recentDisplayedPosts = this.displayedPosts + 4;
			for(var i = this.displayedPosts;i < recentDisplayedPosts;i++){
				if(this.mostActivePosts[i]){
					requiredPostsList.push(this.mostActivePosts[i]);
				}
			}
			this.displayedPosts = recentDisplayedPosts;
			
			var data = {feedInfoList:requiredPostsList};
			
			$("#showPostsMore").remove();
			$("#2x1PostsDiv").append(Mustache.to_html(this.templates.twoByOnePost,data));
			
			if(this.mostActivePosts.length >  this.displayedPosts){
				$('#showPostsMoreIdd').removeClass('hide');
					//$("#2x1PostsDiv").append('<div id="showMostActivePosts" class="pad-top-55 font-12px-darkblue clear-float pull-left cursor-hand">See More...</div>');
					this._on(this.selectors.showMostActivePosts,{click:"_showMostActivePosts"});
			}
		},
		/**
		 * _loadAnnouncementsAndPosts is used to loads the posts
		 */
		_loadAnnouncementsAndPosts:function(smartwallPostsRequestData,currentRef){
			
			currentRef.mostActivePosts = [];
			currentRef.newsAndAnnouncements = [];
			
			var smartwallPostsRequestOptions={
 	      			url:getModelObject('serviceUrl')+'/feed/1.0/getResourceAnnouncementsOrMostActivePosts',
 	      			data:smartwallPostsRequestData,
 	      			async:false,
 	      			parentId:"#newsandannouncements-posts-section",
 	      			successCallBack:function(data){
 	      				var feedInfoList = data['feedInfoList'];
 	     				if(feedInfoList){
 	     					var displayList = [];
 	         				if( feedInfoList.length == undefined ){
 	         					feedInfoList = [feedInfoList];
 							}
 	         				
 	         				for(var i=0;i<feedInfoList.length;i++){
 	         					var formatedDate = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(feedInfoList[i].postedTime),'hh:mm a MMM.dd');
 	         					feedInfoList[i].postedTime = formatedDate;
 	         					
 	         					if(feedInfoList[i].likeCount == undefined){
 	         						feedInfoList[i].likeCount = 0;
 	         					}
 	         					
 	         					if(feedInfoList[i].commentCount == undefined){
 	         						feedInfoList[i].commentCount = 0;
 	         					}
 	         					
 	         					if(feedInfoList[i].shareCount == undefined){
 	         						feedInfoList[i].shareCount = 0;
 	         					}
 	         					
 	         					
 	         					if(feedInfoList[i].activityObjectType == 'CONNECTION'){
 	         						feedInfoList[i].isConnection = true;
 	         					}else if(feedInfoList[i].activityObjectType == 'GROUP'){
 	         						feedInfoList[i].isGroup = true;
 	         					}else if(feedInfoList[i].activityObjectType == 'COURSE' || feedInfoList[i].activityObjectType == 'CIRCLE'){
 	         						feedInfoList[i].isCourse = true;
 	         					}
 	         					
 	         					feedInfoList[i].contextPath=contextPath;
 	         					
 	         					
 	         					if(feedInfoList[i].feedMessage.length > 150){
 	         						feedInfoList[i].feedMessage = feedInfoList[i].feedMessage.substr(0, 150)+"..."; 
 	         					}
 	         					
 	         					if(feedInfoList[i].profileName != undefined){
 	         						feedInfoList[i].originalProfileName = feedInfoList[i].profileName;
 	         						feedInfoList[i].profileName=(feedInfoList[i].profileName.length > 7)?feedInfoList[i].profileName.substr(0, 7)+"...":feedInfoList[i].profileName;
 	         					}
 	         					if(feedInfoList[i].groupTitle != undefined){
 	         						feedInfoList[i].originalGroupTitle = feedInfoList[i].groupTitle;
 	         						feedInfoList[i].groupTitle=(feedInfoList[i].groupTitle.length > 7)?feedInfoList[i].groupTitle.substr(0, 7)+"...":feedInfoList[i].groupTitle;
 	         					}
 	         					
 	         					currentRef.mostActivePosts.push(feedInfoList[i]);
 	         					
 	         					if(i < 4){
 	         						displayList.push(feedInfoList[i]);
 	         					}
 	         				}
 	         				data.feedInfoList=displayList;
 	         				$("#2x1PostsDiv").html(Mustache.to_html(currentRef.templates.twoByOnePost,data));
 	         				
 	         				currentRef.displayedPosts=4;
 	         				if(currentRef.mostActivePosts.length >  currentRef.displayedPosts){
 	         					$('#showPostsMoreIdd').removeClass('hide');
 	         					//$("#2x1PostsDiv").append('<div id="showMostActivePosts" class="pad-top-55 font-12px-darkblue clear-float pull-left cursor-hand">See More...</div>');
 	         					currentRef._on(currentRef.selectors.showMostActivePosts,{click:"_showMostActivePosts"});
 	         				}
 	     				}else{
 	     					currentRef.mostActivePosts = [];
 	     					currentRef.displayedPosts = 0;
 	     					$("#2x1PostsDiv").html('<div class="font-10px helvetica-neue-roman">No posts yet.</div>');
 	     				}
 	     				
 	     				var announcementList = data['announcementList'];
 	     				if(announcementList){
 	     					var displayAnnouncementsList=[];
 	         				if( announcementList.length == undefined ){
 	         					announcementList = [announcementList];
 							}
 	         				for(var i=0;i<announcementList.length;i++){
 	         					var formatedDate = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(announcementList[i].postedTime),'hh:mm a MMM.dd');
 	         					announcementList[i].postedTime = formatedDate;
 	         					
 	         					if(announcementList[i].announcementCategory != undefined){
 	         						announcementList[i].displayCategory = true;
 	         						announcementList[i].originalAnnouncementCategory = announcementList[i].announcementCategory;
 	         						announcementList[i].announcementCategory = (announcementList[i].announcementCategory.length > 10)?announcementList[i].announcementCategory.substr(0,8)+"..":announcementList[i].announcementCategory;
         						}else{
         							announcementList[i].displayCategory = false;
         						}
 	         					
 	         					currentRef.newsAndAnnouncements.push(announcementList[i]);
 	         					if(i < 4){
 	         						displayAnnouncementsList.push(announcementList[i]);
 	         					}
 	         				}
 	         				
 	     					data.announcementList=displayAnnouncementsList;
 	         				$("#2x1NewsAndAnnouncementDiv").html(Mustache.to_html(currentRef.templates.twoByOneAnnouncement,data));
 	         				currentRef.displayedAnnouncements=4;
 	         				
 	         				if(currentRef.newsAndAnnouncements.length >  currentRef.displayedAnnouncements){
 	         					$("#2x1NewsAndAnnouncementDiv").append('<div id="showAnnouncements2X1More" class="font-12px-darkblue clear-float pull-left cursor-hand">See More...</div>');
 	         					currentRef._on(currentRef.selectors.showAnnouncements2X1More,{click:"_showAnnouncements2X1More"});
 	         				}
 	     				}else{
 	     					currentRef.newsAndAnnouncements = [];
 	     					currentRef.displayedAnnouncements = 0;
 	     					$("#2x1NewsAndAnnouncementDiv").html('<div class="font-10px helvetica-neue-roman"></div>');
 	     				}
 	      			}
 	    	 	}; 
 	       	  doAjax.PostServiceInvocation(smartwallPostsRequestOptions);
 	       	  currentRef._on(currentRef.selectors.seeAll,{click:"_seeAll"});
		},
		/**
		 * _twoByOneResourse is used to load the posts when clicked on the respective resource
		 */
		_twoByOneResourse:function(e){
			var target = $(e.target);
			var resourseUniqueId = target.data("resourceuniqueid");
			var resourcetype = target.data("resourcetype");
			var resourceid = target.data("resourceid");
			
			
			if($('img[data-resourceuniqueid="'+resourseUniqueId+'"]').hasClass('smartwall-resource-selected')){
				$("#most-active-label").html('Most Active Posts');
				this._loadDefaultPosts();
			}else{
				$(".smartwallImage").removeClass('smartwall-resource-selected');
				$('img[data-resourceuniqueid="'+resourseUniqueId+'"]').addClass('smartwall-resource-selected');
				
				$("#most-active-label").html('New Posts');
				var resourceRequest={
						  accessToken:this.options.accessToken,
		       			  langId:this.options.langId,
		       			  userId:this.options.userId,
		       			  resourceType:resourcetype,
		       			  resourceId:resourceid,
		       			  uniqueIdentifier:resourseUniqueId,
		       			  timeZone:this.timeZone,
		       			  filterOption:this.smartwallPostsRequestOptions.filterOption 
				};
				this._loadAnnouncementsAndPosts(JSON.stringify(resourceRequest),this);
			}
		},
		/**
		 * _seeAll is used to go from 2X1 to 2X2 when clicked on see all
		 */
		_seeAll:function(e){
			$("#showOptionsSmartwallID").trigger('click');
			$("#minimize_maximize_Smartwall_22").trigger('click');
		},
	   
	});
})(jQuery);