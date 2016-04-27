/**
 * @author Next Sphere Technologies
 * Smart Wall Widget
 * 
 * Smart Wall Widget performs all kinds of feeds which are related to Users like,
 * 
 * 1. New Post
 * 2. Like Post
 * 3. Commenting Post 
 * 4. Search Post based on criteria
 * 5. Filter Post
 *
 * Technical Description
 * 
 * 1.use as much private methods as possible
 * 2.limit direct element looking instead pass selectors as options
 * 3.try to load element at most once and use it reference in other places to avoid too much dom interaction
 * 4.use event triggers whenever needed so any widget actions can be extended outside widget scope
 * 5.make functions specific to its scope and minimal
 */

(function ($, undefined) {

    'use strict';
    var _super = $.Widget.prototype;
			
	$.widget('xiim.smartwall2', {
		
		version: '1.0.0',
		
	
			

		options: {
			/** ajax params */
			accessToken : $("#accessToken_meta").val(),
			langId : $("#langId_meta").val(),
			userId : $("#loggedInUserId-meta").val(),
			userProfileName: $("#userProfileName").val(),
			emailId: $("#emailId").val(),
			groupId: $("#groupId").val(),
			receiverType: $("#receiverType").val(),
			userPhotoId:$("#userProfilePhotoId").val(),
			connectionGroupUniqueIdentifier:$("#connectionGroupUniqueIdentifier").val(),
			selectedDashBordOption:undefined
		},
		selectors:{
			/** selectors */
			newPost:'#newPostID',
			dashBoardOption:".dashboard-smartWall-option",
			smartWallFilter:".smartwall-filter",
			tabOptions:".tabOptions",
			dashBoardOptionDisplayId:"#dashBoardSelectedOption",
			editPost:'[id^="edit-post_"]',
			editedPostDiv:"#edited-post-message-div_",
			postMessageDiv:"#post-message-div_",
			postIconsDiv:"#post-icons-div_",
			editIcon:"#edit-post_",
			postButtons:"#post-buttons_",
			postDate:"#post-date_",
			saveEditedPostClick:'[id^="save-edited-post_"]',
			saveEditedPost:"#save-edited-post_",
			cancelEditedPostClick:'[id^="cancel-edited-post_"]',
			cancelEditedPost:"#cancel-edited-post_",
			likePostClick:'[id^="like-post_"]',
			likePost:"#like-post_",
			postCommentClick:'[id^="post-comment_"]',
			postComment:"#post-comment_",
			sharePostClick:'[id^="share-post_"]',
			sharePost:"#share-post_",
			postCommentDiv:"#post-comment-div_",
			readPost:"#post-read_",
			readPostClick:'[id^="post-read_"]',
			savePostComment:"#save-post-comment_",
			cancelPostComment:"#cancel-post-comment_",
			cancelPostCommentClick:'[id^="cancel-post-comment_"]',
			savePostCommentClick:'[id^="save-post-comment_"]',
			smartWallSearcBox:"#smart-wall-search-box",
			smartwallRadioButtons:"#smartwall-radio-buttons",
			saveNewPostButton:"#saveNewPost",
			cancelNewPostButton:"#cancelNewPost",
			newPostText:"#newPostText",
			postComentTextArea:"#post-comment-text-area_",
			postCommentError:"#post-comment-error_",
			postEditTextArea:"#post-edit-text-area_",
			postComentTextAreaForAction:'[id^="post-comment-text-area_"]',
			postEditError:"#post-edit-error_",
			postEditTextAreaForAction:'[id^="post-edit-text-area_"]',
			likeCount:"#like_count_",
			commentCount:"#comment_count_",
			showPostsMore:"#showPostsMore",
			deletePostClick:'[id^="delete-post_"]',
			deletePost:"#delete-post_",
			refreshPosts:"#refreshPosts",
			searchPosts:".smart-wall-search-boxclass",
			showAnnouncementsMore:"#showAnnouncementsMore",
			removeSharingUserClick:'[id^="remove-userID_"]',
			cancelSharePostClick : '[id^="user_cancelSharePost_"]',
			unfollowClick : '[id^="unfollow_"]',
			shareButtonClick : '[id^="user_sharePostButton_"]',
			
			sharePostDiv:"#user_share_post_div_",
			sharePostButton:"#user_sharePostButton_",
			cancelSharePost:"#user_cancelSharePost_",
			
		},
		originalPost:'',
		templates:{},
		posts : {},
		announcements:{},
		postsCount:0,
		announcementsCount:0,
		sort:'',
		noPosts:false,
		timeZone:getOffset(),
		startResult:0,
		maxResult:5,
		/** this is common request variable for any posts requests
		 * just add/edit the properties based on filter sort etc
		 */
		postRequestOptions:{filterOption:"BY_POST_TIME",dashBoardOption:"AL",tabOption:"SHOW_CASE",sortOrder:"DS",searchString:"",searchValue:""},
		postRequest:{},
		savePostRequest:{},
		announcementsRequest:{},
		isNoAnnouncements:false,
		isNoPosts:false,
		userConnections:{},
		selectedUsers:[],
		/** initiate the widget 
		 * @constructor
		 */
		_create: function () {
			if(this.options.selectedDashBordOption != undefined){
				this.postRequestOptions.dashBoardOption = this.options.selectedDashBordOption;
			}
			this._getTemplates();
			this._injectDom();
			this.addActions();
			this._defaultPosts();
			//this._trigger('started');
			this._loadConnections();
			
			if(this.options.selectedDashBordOption != undefined){
				this._displayStaticContent(this.selectors.dashBoardOptionDisplayId,"options",this.options.selectedDashBordOption);
			}
		},
		
		/**
		 * one time load all template strings
		 */
		_getTemplates:function(){
			//this.templates.feed = jQuery('#smartwall-feed').html();
			this.templates.newPost = jQuery('#smartwall-newPost').html();
			this.templates.post = jQuery('#smartwall-post').html();
			this.templates.announcement = jQuery('#smart-wall-announcements').html();
			this.templates.sharePost = jQuery('#smartwall-share-post').html();
		},
		
		/** add the form 
		 * @private
		 * get template from page or pass html to template option
		 */
		_injectDom: function(){
			/*fatching the json object for html*/
			var uielementJSON = HTMLUIElements.smartwallwrapper();
			uielementJSON.contextPath=contextPath;
			/*injecting html into dom by ui element json object and html*/ 
			this.element.html(Mustache.to_html(jQuery('#smartwall-wrapper').html(),uielementJSON));
		},
		
		/** add widget specific events
		 * @public
		 * 
		 */
		addActions: function(){
			/** element on/bind from widget (target element,{eventname,callback function on event}) 
			 * better to use private methods _
			 * if event info needed outside widget scope use event dispatch or triggers inside callback
			 */
			this._on(this.selectors.newPost,{click:"_showAddPost"});
			
			this._on(this.selectors.dashBoardOption,{click:"_dashBoardOptions"});
			
			this._on(this.selectors.smartWallFilter,{click:"_smartWallFilter"});
			
			this._on(this.selectors.tabOptions,{click:"_smartWallTabOption"});
			
			this._on(this.selectors.refreshPosts,{click:"_refreshPosts"});
			
			this._on(this.selectors.searchPosts,{keyup:"_searchPosts"});
			
			
		
			
			
		},
		/**
		 * _searchPosts is used to search the 
		 */
		_searchPosts:function(e){
			if(e.keyCode == 13||$(this.selectors.searchPosts).val().length==0){
				$(this.selectors.tabOptions).removeClass('smartwall-active');
				$("#tabAll").addClass('smartwall-active');
				
				$(this.selectors.searchPosts).addClass('selected-sm');
			
				this.postRequestOptions.searchValue = $('input[name="searchOption"]:checked').val();
				this.postRequestOptions.searchString = $.trim($(this.selectors.smartWallSearcBox).val());
				this.postRequestOptions.tabOption = "ALL";
				this._changeFilterOption('ALL');
				
				$(".smartwall-area").addClass('smartwall-overlay-bg');
				$("#proocessing_smartWall").removeClass('hide');
				
				this._generatePostsRequest("search",this.startResult,this.maxResult);
				
				this._loadPosts("normal");
			}
		},
		/**
		 * _refreshPosts is used to refresh the posts when clicked on refresh button
		 */
		_refreshPosts:function(e){
			$(this.selectors.searchPosts).removeClass('selected-sm');
			$(this.selectors.smartWallSearcBox).val('');
			$('input[name="searchOption"]').removeAttr('checked');
			$('input[name=searchOption][value="A"]').trigger('click');
			
			$(".smartwall-area").addClass('smartwall-overlay-bg');
			$("#proocessing_smartWall").removeClass('hide');
			
			this._generatePostsRequest('',this.startResult,this.maxResult);
			
			if(this.postRequestOptions.tabOption == 'SHOW_CASE'){
				this._generateAnnouncementRequest(this.startResult,this.maxResult);
			}
			this._loadPosts("normal");
		},
		/**
		 * default posts load
		 */
		_defaultPosts:function(){
			this._generatePostsRequest('',this.startResult,this.maxResult);
			this._generateAnnouncementRequest(this.startResult,this.maxResult);
			this._loadPosts("normal");
		},
		/**
		 * smart wall tab option
		 * @param e
		 */
		_smartWallTabOption:function(e){
			
			$(".smartwall-area").addClass('smartwall-overlay-bg');
			$("#proocessing_smartWall").removeClass('hide');
			
			$(this.selectors.searchPosts).removeClass('selected-sm');
			$(this.selectors.smartWallSearcBox).val('');
			$('input[name="searchOption"]').removeAttr('checked');
			$('input[name=searchOption][value="A"]').trigger('click');
			$('#smartwall-posts').addClass("mar-top-5");
			var target = $(e.target);
			
			$(this.selectors.tabOptions).removeClass('smartwall-active');
			target.addClass('smartwall-active');
			
			var attr = target.data("option");
			
			this.postRequestOptions.tabOption=attr;
			
			this._changeFilterOption(attr);
			
			this._generatePostsRequest('',this.startResult,this.maxResult);
			
			if(attr == 'SHOW_CASE'){
				this._generateAnnouncementRequest(this.startResult,this.maxResult);
			}
			
			
			this._loadPosts("normal");
		},
		/**
		 * smart wall filter
		 * @param e
		 */
		_smartWallFilter:function(e){
			
			$(".smartwall-area").addClass('smartwall-overlay-bg');
			$("#proocessing_smartWall").removeClass('hide');
			
			var target = $(e.target);
			var attr = target.data("option");
			
			$(this.selectors.smartWallFilter).removeClass('highlight-menu');
			target.addClass('highlight-menu');
			
			this.postRequestOptions.filterOption=attr;
			this._changeSortOrder(attr);
			
			if($(this.selectors.searchPosts).hasClass('selected-sm') && $.trim($(this.selectors.smartWallSearcBox).val()) != '' &&
					$.trim($(this.selectors.smartWallSearcBox).val()) != undefined){
				this._generatePostsRequest('search',this.startResult,this.maxResult);
			}else{
				this._generatePostsRequest('',this.startResult,this.maxResult);
			}
			this._loadPosts("normal");
		},
		/**
		 * used for the dash board options related functionality
		 */
		_dashBoardOptions:function(e){
			
			$(".smartwall-area").addClass('smartwall-overlay-bg');
			$("#proocessing_smartWall").removeClass('hide');
			
			$(this.selectors.searchPosts).removeClass('selected-sm');
			$(this.selectors.smartWallSearcBox).val('');
			$('input[name="searchOption"]').removeAttr('checked');
			$('input[name=searchOption][value="A"]').trigger('click');
			
			var target = $(e.target);
			var attr = target.data("option");
			
			$(this.selectors.dashBoardOption).removeClass('highlight-menu');
			target.addClass('highlight-menu');
			
			this.postRequestOptions.dashBoardOption=attr;
			
			this._displayStaticContent(this.selectors.dashBoardOptionDisplayId,"options",attr);
			
			this._generatePostsRequest('',this.startResult,this.maxResult);
			
			if(this.postRequestOptions.tabOption == 'SHOW_CASE'){
				this._generateAnnouncementRequest(this.startResult,this.maxResult);
			}
			
			this._loadPosts("normal");
		},
		/**
		 * _changeSortOrder is used for the sorting the displayed posts
		 */
		_changeSortOrder:function(option){
			this.announcementsRequest.startResult = 0;
			switch (option) {
		    case 'BY_NAME':
		    	this.postRequestOptions.sortOrder = "AS";
		        break;
		    case 'BY_POST_TIME':
		    	this.postRequestOptions.sortOrder = "DS";
		        break;     
		    case 'BY_UPDATE_TIME':
		    	this.postRequestOptions.sortOrder = "DS";
		        break;
		    case 'BY_LIKES':
		    	this.postRequestOptions.sortOrder = "DS";
		        break;   
		    case 'BY_COMMENTS':
		    	this.postRequestOptions.sortOrder = "DS";
		        break; 
		    case 'BY_SHARES':
		    	this.postRequestOptions.sortOrder = "DS";
		        break; 
		    case 'BY_CATEGORIES':
		    	this.postRequestOptions.sortOrder = "DS";
		        break; 
			}
		},
		/**
		 * using to change the filter options on tab selections
		 * @param option
		 */
		_changeFilterOption:function(option){
			$(this.selectors.smartWallFilter).removeClass('highlight-menu');
			switch (option) {
		    case 'SHOW_CASE':
		    	this.postRequestOptions.filterOption = "BY_POST_TIME";
		    	$(this.selectors.smartWallFilter).filter('[data-option="BY_POST_TIME"]').addClass('highlight-menu');
		        break;
		    case 'ALL':
		    	this.postRequestOptions.filterOption = "BY_POST_TIME";
		    	$(this.selectors.smartWallFilter).filter('[data-option="BY_POST_TIME"]').addClass('highlight-menu');
		        break;
		    case 'NEW':
		    	this.postRequestOptions.filterOption = "BY_POST_TIME";
		    	$(this.selectors.smartWallFilter).filter('[data-option="BY_POST_TIME"]').addClass('highlight-menu');
		        break;     
		    case 'UPDATED':
		    	this.postRequestOptions.filterOption = "BY_UPDATE_TIME";
		    	$(this.selectors.smartWallFilter).filter('[data-option="BY_UPDATE_TIME"]').addClass('highlight-menu');
		        break;
		    case 'MOST_LIKED':
		    	this.postRequestOptions.filterOption = "BY_LIKES";
		    	$(this.selectors.smartWallFilter).filter('[data-option="BY_LIKES"]').addClass('highlight-menu');
		        break;   
		    case 'MOST_COMMENTED':
		    	this.postRequestOptions.filterOption = "BY_COMMENTS";
		    	$(this.selectors.smartWallFilter).filter('[data-option="BY_COMMENTS"]').addClass('highlight-menu');
		        break; 
		    case 'MOST_SHARED':
		    	this.postRequestOptions.filterOption = "BY_SHARES";
		    	$(this.selectors.smartWallFilter).filter('[data-option="BY_SHARES"]').addClass('highlight-menu');
		        break; 
			}
		},
		/**
		 * method is used to display static content
		 * 
		 * @param element
		 * @param type
		 * @param option
		 */
		_displayStaticContent:function(element,type,option){
			if(type="options"){
				switch (option) {
				    case 'AL':
				    	$(element).html('All');
				    	$(this.selectors.newPost).removeClass('disabled-sm');
				    	$(this.selectors.newPost).removeClass('ancher_lock');
				        break;
				    case 'ME':
				    	$(element).html('Me');
				    	$(this.selectors.newPost).removeClass('disabled-sm');
				    	$(this.selectors.newPost).removeClass('ancher_lock');
				        break;
				    case 'CN':
				    	$(element).html('Connections');
				    	$(this.selectors.newPost).addClass('disabled-sm');
				    	$(this.selectors.newPost).addClass('ancher_lock');
				        break;     
				    case 'CR':
				    	$(element).html('Courses');
				    	$(this.selectors.newPost).addClass('disabled-sm');
				    	$(this.selectors.newPost).addClass('ancher_lock');
				        break;
				    case 'GR':
				    	$(element).html('Groups');
				    	$(this.selectors.newPost).addClass('disabled-sm');
				    	$(this.selectors.newPost).addClass('ancher_lock');
				        break;   
				}
			}
		},
		/**
		 * used to save the post
		 */
		_savePost:function(){
			var current = this;
			if(this._validate("#smartWallPostForm")){
				var postData = $(this.selectors.newPostText).val();
				
				this.savePostRequest={
					  accessToken:this.options.accessToken,
	       			  langId:this.options.langId,
	       			  userId:this.options.userId,
	       			  agentEmail:this.options.emailId,
	       			  verb:"Posted",
		       		  message:postData,
		       		  receiverType:this.options.receiverType,
		       		  groupId:this.options.groupId,
		       		  objectName:"CONNECTION"
				};
				
				var request = JSON.stringify(this.savePostRequest);
				var savePost={
	         			url:getModelObject('serviceUrl')+'/feed/1.0/saveFeed',
	         			data:request,
	         			async:true,
	         			successCallBack:function(data){
	         				
	         				if(data['isSuccess']){
	         					var postId = data['postId'];
	         					
	         					var originalFeedMessage = postData;
	         					if(postData.length > 250){
	         						postData = postData.substr(0, 250)+"..."; 
	         					}
	         					var profileName=(current.options.userProfileName.length > 25)?current.options.userProfileName.substr(0, 25)+"...":current.options.userProfileName;
	         					var feedsList = [
		         					                 {
		         					                	postId:postId,
		         					                	likeCount:0,
		         					                	commentCount:0,
		         					                	shareCount:0,
		         					                	feedMessage:postData,
		         					                	profileName:profileName,
		         					                	photoId:current.options.userPhotoId,
		         					                	canDeleteFeed:true,
		         					                	activityObjectType:"CONNECTION",
		         					                	postedTime:"a moment ago",
		         					                	likedByUser:false,
		         					                	adminGroup:current.options.groupId,
		         					                	isConnection:true,
		         					                	contextPath:contextPath,
		         					                	isNoReadMore:false,
		         					                	originalFeedMessage:originalFeedMessage,
		         					                	originalProfileName:current.options.userProfileName
		         					                 }
	         					                 ];
	         					var data = {
	         							feedsList: feedsList
	         					};
	         					$("#noPostMessage").remove();
	         					if($("#smartwall-posts div:first").length == 0){
	         						$("#smartwall-posts").html(Mustache.to_html(current.templates.post,data));
	         					}else{
	         						$("#smartwall-posts div:first").before(Mustache.to_html(current.templates.post,data));
	         					}
	         					
	         					current._clickEvents();
	         				}
	         			}
				};
				doAjax.PostServiceInvocation(savePost);
				$(this.selectors.newPost).popover('destroy');
				$("#newPostID").removeClass('selected-sm');
			}
		},
		/**
		 * used to close the cancel post
		 */
		_cancelPost:function(){
			$(this.selectors.smartWallSearcBox).val('');
			$(this.selectors.newPost).popover('destroy');
			$("#newPostID").removeClass('selected-sm');
		},
		/**
		 * load all feeds at once
		 */
		_loadPosts:function(mode){
			//this.isNoPosts=false;
			//this.isNoAnnouncements=false;
			var currentRef = this;
       	 	var getAllFeedsData = JSON.stringify(this.postRequest);
       	 	var options={
         			url:getModelObject('serviceUrl')+'/feed/1.0/getAllFeeds',
         			//headers:headers,
         			data:getAllFeedsData,
         			async:true,
         			successCallBack:function(data){
         				$(".smartwall-area").removeClass('smartwall-overlay-bg');
         				$("#proocessing_smartWall").addClass('hide');
         				var feedList = data['feedsList'];
         				if(feedList){
         					currentRef.postsCount = data['feedCount'];
         					
         					if(mode == 'normal' || mode == 'more'){
         						currentRef.postRequest.startResult = currentRef.postRequest.startResult+5;
         					}
         					if(mode == 'delete'){
         						currentRef.postRequest.startResult = currentRef.postRequest.maxRestult;
         					}
         				
	         				if( feedList.length == undefined ){
	         					feedList = [feedList];
							}
	         				for(var i=0;i<feedList.length;i++){
	         					var formatedDate = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(feedList[i].postedTime),'hh:mm a MMM.dd');
	         					feedList[i].postedTime = formatedDate;
	         					
	         					if(feedList[i].likeCount == undefined){
	         						feedList[i].likeCount = 0;
	         					}
	         					
	         					if(feedList[i].commentCount == undefined){
	         						feedList[i].commentCount = 0;
	         					}
	         					
	         					if(feedList[i].shareCount == undefined){
	         						feedList[i].shareCount = 0;
	         					}
	         					
	         					if(feedList[i].canDeleteFeed == 'true'){
	         						feedList[i].canDeleteFeed = true;
	         					}else{
	         						feedList[i].canDeleteFeed = false;
	         					}
	         					
	         					if(feedList[i].likedByUser == 'true'){
	         						feedList[i].likedByUser = true;
	         					}else{
	         						feedList[i].likedByUser = false;
	         					}
	         					
	         					
	         					if(feedList[i].activityObjectType == 'CONNECTION'){
	         						feedList[i].isConnection = true;
	         					}else if(feedList[i].activityObjectType == 'GROUP'){
	         						feedList[i].isGroup = true;
	         					}else if(feedList[i].activityObjectType == 'COURSE' || feedList[i].activityObjectType == 'CIRCLE'){
	         						feedList[i].isCourse = true;
	         					}
	         					
	         					feedList[i].contextPath=contextPath;
	         					
	         					if(feedList[i].isEdited == 'true'){
	         						feedList[i].isEdited = true;
	         					}else{
	         						feedList[i].isEdited = false;
	         					}
	         					
	         					if(feedList[i].editedTime){
	         						var formatedEditedDate = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(feedList[i].editedTime),'hh:mm a MMM.dd');
	         						feedList[i].editedTime = formatedEditedDate;
	         					}
	         					
	         					if(feedList[i].activityType && feedList[i].activityType=='Shared'){
	         						feedList[i].isSharedVia = true;
	         					}
	         					
	         					feedList[i].originalFeedMessage = feedList[i].feedMessage;
	         					if(feedList[i].feedMessage.length > 250){
	         						feedList[i].feedMessage = feedList[i].feedMessage.substr(0, 250)+"..."; 
	         					}
	         					
	         					if(feedList[i].profileName != undefined){	
	         						feedList[i].originalProfileName = feedList[i].profileName;
	         						feedList[i].profileName=(feedList[i].profileName.length > 25)?feedList[i].profileName.substr(0, 25)+"...":feedList[i].profileName;
	         					}
	         					
	         					if(feedList[i].groupTitle != undefined){
	         						feedList[i].originalGroupTitle = feedList[i].groupTitle;
	         						feedList[i].groupTitle=(feedList[i].groupTitle.length > 25)?feedList[i].groupTitle.substr(0, 25)+"...":feedList[i].groupTitle;
	         					}	
	         				}
	         				
	         				currentRef.posts = data;
	         				//currentRef._showFeeds();
	         				currentRef.isNoPosts = false;
         				}else{
         					currentRef.posts = {};
         					currentRef.isNoPosts = true;
         					currentRef.postsCount=0;
         				}
         				
         				if(currentRef.postRequestOptions.tabOption == 'SHOW_CASE'){
         					// make another service call here to get announcements
         					if(mode == 'normal'){
         						currentRef._loadAnnouncements(mode,currentRef);
         					}else{
         						if(currentRef.isNoPosts && currentRef.isNoAnnouncements){
         							currentRef.noPosts=true;
             	    	  		}else{
             	    	  			currentRef.noPosts=false;
             	    	  		}
         						currentRef._showFeeds(mode);
         					}
         	    	  	}else{
         	    	  		if(currentRef.isNoPosts){
         	    	  			currentRef.noPosts=true;
         	    	  		}else{
         	    	  			currentRef.noPosts=false;
         	    	  		}
         	    	  		currentRef.announcementsRequest={};
         	    	  		currentRef._showFeeds(mode);
         	    	  		$("#announcements").addClass('hide');
         	    	  	}
         			},beforeSendCallBack:function(){
         				$(".smartwall-area").addClass('smartwall-overlay-bg');
         				$("#proocessing_smartWall").removeClass('hide');
         			}
         	};
       	  	doAjax.PostServiceInvocation(options);
       	  	
		},
		/**
		 * _loadAnnouncements is uesd to load the related announcements
		 * @param mode
		 * 
		 */
		_loadAnnouncements:function(mode,currentObject){
			var getAllAnnouncementsData = JSON.stringify(currentObject.announcementsRequest);
			//currentObject.isNoAnnouncements = false;
			var announcementsOptions={
         			url:getModelObject('serviceUrl')+'/feed/1.0/getAnnouncements',
         			data:getAllAnnouncementsData,
         			async:false,
         			successCallBack:function(data){
	         				var announcementList = data['feedsList'];
	         				if(announcementList){
	         					currentObject.announcementsCount=data['feedCount'];
	         					
	         					currentObject.announcementsRequest.startResult = currentObject.announcementsRequest.startResult+5;
	         					
		         				if( announcementList.length == undefined ){
		         					announcementList = [announcementList];
								}
		         				if(announcementList && announcementList.length > 0){
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
		         					}
		         					currentObject.announcements=data;
		         					currentObject.announcements.contextPath=contextPath;
		         					currentObject.announcements.photoId=currentObject.options.userPhotoId;
		         					currentObject.announcements.profileName=currentObject.options.userProfileName;
		         					currentObject.isNoAnnouncements = false;
		         				}else{
		         					currentObject.isNoAnnouncements = true;
		         				}
	         				}else{
	         					currentObject.announcements = {};
	         					currentObject.isNoAnnouncements = true;
	         				}
	         				
	         				if(currentObject.isNoPosts && currentObject.isNoAnnouncements){
	         					currentObject.noPosts=true;
         	    	  		}else{
         	    	  			currentObject.noPosts=false;
         	    	  		}
	         			if(mode=='normal'){	
	         				currentObject._showFeeds(mode);
	         			}
         				currentObject._showAnnouncements(mode,currentObject);
         				
         			}
			};
			doAjax.PostServiceInvocation(announcementsOptions);
		},
		/**
		 * _showAnnouncements is used to display the annnouncements
		 */
		_showAnnouncements:function(mode,currentObject){
			var announcement = $('#announcements'); 
			if(currentObject.postRequestOptions.tabOption == 'SHOW_CASE'){
				
				if(!currentObject.isNoAnnouncements){
					announcement.removeClass('hide');
					if(mode=="more"){
						$('#annoucements-divs').append(Mustache.to_html(jQuery('#more-announcements').html(),currentObject.announcements));
					}else{
						announcement.html(Mustache.to_html(currentObject.templates.announcement,currentObject.announcements));
					}
					
					
					
				}else{
					announcement.addClass('hide');
				}
				
				if(currentObject.announcementsCount > currentObject.announcementsRequest.startResult){
					$(currentObject.selectors.showAnnouncementsMore).remove();
					announcement.append('<div id="showAnnouncementsMore" class="mar-left-60 mar-bot-20 font-12px-darkblue pull-left cursor-hand">See More...</div>');
				}else{
					$(currentObject.selectors.showAnnouncementsMore).remove();
				}
				
				
				
				
			}else{
				announcement.addClass('hide');
			}
			
			
			currentObject._on(currentObject.selectors.showAnnouncementsMore,{click:"_showAnnouncementsMore"});
		},
		/**
		 * _showAnnouncementsMore is used to display the announcements when clicked on more
		 */
		_showAnnouncementsMore:function(e){
			this._loadAnnouncements("more",this);
		},
		/**
		 * show feeds is used to display the feeds
		 */
		_showFeeds:function(mode){
			if(this.noPosts){
				$("#announcements").addClass('hide');
				$('#smartwall-posts').html('<div class="font-10px darkgrey helvetica-neue-roman mar-top-38" id="noPostMessage">No active posts</div>');
			}else{
				if(this.postRequestOptions.tabOption == 'SHOW_CASE'){
					//$("#announcements").removeClass('hide');
					if(mode == 'more'){
						//$(this.selectors.showPostsMore).before(Mustache.to_html(this.templates.post,this.posts));
						$('#smartwall-posts').append(Mustache.to_html(this.templates.post,this.posts));
					}else{
						if(this.posts){
							$('#smartwall-posts').html(Mustache.to_html(this.templates.post,this.posts));
						}else{
							$('#smartwall-posts').empty();
						}
						
					}
				}else{
					//$("#announcements").addClass('hide');
					if(mode == 'more'){
						//$(this.selectors.showPostsMore).before(Mustache.to_html(this.templates.post,this.posts));
						$('#smartwall-posts').append(Mustache.to_html(this.templates.post,this.posts));
					}else{
						if(this.posts){
							$('#smartwall-posts').html(Mustache.to_html(this.templates.post,this.posts));
						}else{
							$('#smartwall-posts').empty();
						}
						
					}
				}
			}
			
			var xiimcustomScrollbarOptions = {elementid:"#smartwallScrolldiv",isUpdateOnContentResize:true,setHeight:"1024px"};
			xiimcustomScrollbar(xiimcustomScrollbarOptions);
			
			
			if(mode == 'normal' || mode == 'more'){
				if(this.postsCount > this.postRequest.startResult){
					$(this.selectors.showPostsMore).remove();
					$('#showPostsMoreIdd').removeClass('hide');
					$('#showPostsMoreIdd').append('<div id="showPostsMore" class="font-12px-darkblue pull-left cursor-hand">See More...</div>');
				}else{
					$(this.selectors.showPostsMore).remove();
				}
			}
			
			if(mode == 'delete'){
				if(this.postsCount > this.postRequest.maxRestult){
					$(this.selectors.showPostsMore).remove();
					$('#showPostsMoreIdd').removeClass('hide');
					$('#showPostsMoreIdd').append('<div id="showPostsMore" class="font-12px-darkblue pull-left cursor-hand">See More...</div>');
				}else{
					$(this.selectors.showPostsMore).remove();
				}
			}
			this._clickEvents();
		},
		/**
		 * _clickEvents holds the all events in smart wall
		 */
		_clickEvents:function(){
			this.element.find(this.selectors.editPost).off('click');
			this._on(this.selectors.editPost,{click:"_editPost"});
			
			this.element.find(this.selectors.saveEditedPostClick).off('click');
			this._on(this.selectors.saveEditedPostClick,{click:"_saveEditedPost"});
			
			this.element.find(this.selectors.cancelEditedPostClick).off('click');
			this._on(this.selectors.cancelEditedPostClick,{click:"_cancelEditedPost"});
			
			this.element.find(this.selectors.deletePostClick).off('click');
			this._on(this.selectors.deletePostClick,{click:"_deletePost"});
			
			this.element.find(this.selectors.likePostClick).off('click');
			this._on(this.selectors.likePostClick,{click:"_likePost"});
			
			this.element.find(this.selectors.sharePostClick).off('click');
			this._on(this.selectors.sharePostClick,{click:"_sharePost"});
			
			this.element.find(this.selectors.postCommentClick).off('click');
			this._on(this.selectors.postCommentClick,{click:"_commentOnPost"});
			
			this.element.find(this.selectors.cancelPostCommentClick).off('click');
			this._on(this.selectors.cancelPostCommentClick,{click:"_cancelCommentOnPost"});
			
			this.element.find(this.selectors.savePostCommentClick).off('click');
			this._on(this.selectors.savePostCommentClick,{click:"_savePostComment"});
			
			this.element.find(this.selectors.postComentTextAreaForAction).off('click');
			this._on(this.selectors.postComentTextAreaForAction,{input:"_postComentTextAreaForAction"});
			
			this.element.find(this.selectors.showPostsMore).off('click');
			this._on(this.selectors.showPostsMore,{click:"_showMorePosts"});
			
			this.element.find(this.selectors.readPostClick).off('click');
			this._on(this.selectors.readPostClick,{click:"_readMoreClick"});
			
			this.element.find(this.selectors.unfollowClick).off('click');
			this._on(this.selectors.unfollowClick,{click:"_unfollowClick"});
			
		},
		/**
		 * _readMoreClick is used to display posts on read more 
		 */
		_readMoreClick:function(e){
			var target = $(e.target);
			var id = target.data("id");
			
			 if($('#readMorePopup').data('xiim-readMorePost')!=undefined){
   			  		$('#readMorePopup').readMorePost('destroy');
   		  	 }
			 $('#readMorePopup').readMorePost({postUid:id,externalShareCount:"#share_count_"+id,externalCommentCount:this.selectors.commentCount+""+id,externalLikeCount:this.selectors.likeCount+""+id});
			
		},
		/**
		 * _generateAnnouncementRequest  is used to generate the announcements request
		 */
		_generateAnnouncementRequest:function(startResult,endResult){
			var announcementsCriteriaModels=[];
			
			announcementsCriteriaModels.push({
				"criteriaOption": "FILTER_OPTION",
				"searchValue": this.postRequestOptions.dashBoardOption
			});
			
			announcementsCriteriaModels.push({
				"criteriaOption": "SORT_BY",
				/*"searchValue": this.postRequestOptions.filterOption*/
				"searchValue": "BY_POST_TIME"
			});
			
			announcementsCriteriaModels.push({
				"criteriaOption": "TAB_NAME",
				"searchValue": this.postRequestOptions.tabOption
			});
			
			announcementsCriteriaModels.push({
				"criteriaOption": "SORT_ORDER",
				/*"searchValue": this.postRequestOptions.sortOrder*/
				"searchValue": "DS"
			});
			
			this.announcementsRequest = {
	       			  accessToken:this.options.accessToken,
	       			  langId:this.options.langId,
	       			  userId:this.options.userId,
	       			  receiverType:this.options.receiverType,
	       			  associationId:this.options.groupId,
	       			  startResult:startResult,
	       			  maxRestult:endResult,
	       			  feedsCriteriaModelList:announcementsCriteriaModels,
	       			  timeZone:this.timeZone
	       	};
			
		},
		/**
		 * to create postsrequest object
		 * @access private
		 * @returns  {jsonobjec} postRequest
		 */
		_generatePostsRequest:function(functionality,startResult,endResult){
			
			var postCriteriaModels=[];
			
			postCriteriaModels.push({
				"criteriaOption": "FILTER_OPTION",
				"searchValue": this.postRequestOptions.dashBoardOption
			});
			
			postCriteriaModels.push({
				"criteriaOption": "SORT_BY",
				"searchValue": this.postRequestOptions.filterOption
			});
			
			postCriteriaModels.push({
				"criteriaOption": "TAB_NAME",
				"searchValue": this.postRequestOptions.tabOption
			});
			
			postCriteriaModels.push({
				"criteriaOption": "SORT_ORDER",
				"searchValue": this.postRequestOptions.sortOrder
			});
			
			if(functionality == "search"){
				postCriteriaModels.push({
					"criteriaOption": "SEARCH_KEY",
					"searchValue": this.postRequestOptions.searchString
				});
				
				postCriteriaModels.push({
					"criteriaOption": "SEARCH_PERIOD",
					"searchValue": this.postRequestOptions.searchValue
				});
			}
			
			this.postRequest = {
	       			  accessToken:this.options.accessToken,
	       			  langId:this.options.langId,
	       			  userId:this.options.userId,
	       			  receiverType:this.options.receiverType,
	       			  associationId:this.options.groupId,
	       			  startResult:startResult,
	       			  maxRestult:endResult,
	       			  feedsCriteriaModelList:postCriteriaModels,
	       			  timeZone:this.timeZone
	       	};
			
		},
		/**
		 * edit a post
		 * @access private
		 * @param {string} message
		 * @param {object} user
		 */
		_editPost:function(e){
			var target = $(e.target);
			var id = target.data("id");
			
		
			$(this.selectors.editedPostDiv+""+id).removeClass('hide');
			$(this.selectors.postMessageDiv+""+id).addClass('hide');
			$(this.selectors.postIconsDiv+""+id).addClass('hide');
			$(this.selectors.editIcon+""+id).addClass('selected-sm');
			$(this.selectors.postButtons+""+id).removeClass('hide');
			$(this.selectors.postDate+""+id).addClass('hide');
			
			this._cancelCommentOnPost(e);
			this._cancelSharePostClick(e);
			this.originalPost = $(this.selectors.postEditTextArea+""+id).val();
			
			this._on(this.selectors.postEditTextAreaForAction,{input:"_postEditTextAreaForAction"});
			
			var editField = "#post-edit-text-area_"+id ;
			var saveButton = "#save-edited-post_"+id;
			
			$(saveButton).addClass('grey-button');
			$(saveButton).removeClass('def-button');
			$(saveButton).attr("disabled", "disabled");
				
			$(editField).focus();	  
			// disable new post button if no text is entered
      	  	$(editField).on("change keyup paste", function (e){
    		
				if($.trim($(editField).val()) == ''){
					 $(saveButton).addClass('grey-button');
					  $(saveButton).removeClass('def-button');
					  $(saveButton).attr("disabled", "disabled");
				}
			  
				else{
					  $(saveButton).removeClass('grey-button');
					  $(saveButton).addClass('def-button');
					  $(saveButton).removeAttr("disabled");
				}   
			});
			
			
		},
		/**
		 * save the edited post
		 * @param e
		 */
		_saveEditedPost:function(e){
			var currentEdit = this;
			var target = $(e.target);
			var id = target.data("id");
			
			
			if($.trim($(this.selectors.postEditTextArea+""+id).val())){
				var updatedPostData = $.trim($(this.selectors.postEditTextArea+""+id).val());
				
				var updatePostRequest={
					  accessToken:this.options.accessToken,
	       			  langId:this.options.langId,
	       			  userId:this.options.userId,
	       			  updatedMessage:updatedPostData,
		       		  receiverType:this.options.receiverType,
		       		  postId:id
				};
				
				updatePostRequest = JSON.stringify(updatePostRequest);
				var updatePost={
	         			url:getModelObject('serviceUrl')+'/feed/1.0/updateFeed',
	         			data:updatePostRequest,
	         			async:true,
	         			successCallBack:function(data){
	         				if(data['isSuccess']){
	         					var formatedUpdateDate = dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data['date']),'hh:mm a MMM.dd');
	         					//$(currentEdit.selectors.postDate+""+id).html(formatedUpdateDate);
	         					
	         					currentEdit.originalPost = updatedPostData;
	         					
	         					$(currentEdit.selectors.postMessageDiv+""+id).html((updatedPostData.length > 250)?updatedPostData.substr(0,250)+"...":updatedPostData);
	         					
	         					$("#edited-date_"+id).parent().removeClass('hide');
	         					$("#edited-date_"+id).html("Last edited "+formatedUpdateDate);
	         					currentEdit._cancelEditedPost(e);
	         				}
	         			}
				};
				doAjax.PutServiceInvocation(updatePost);
			}else{
				$(this.selectors.postEditError+""+id).removeClass('hide');
				$(this.selectors.saveEditedPost+""+id).addClass('ancher_lock');
			}
		},
		/**
		 * _postEditTextAreaForAction is used to to validate text area
		 */
		_postEditTextAreaForAction:function(e){
			var target = $(e.target);
			var id = target.data("id");
			
			$(this.selectors.postEditError+""+id).addClass('hide');
			$(this.selectors.saveEditedPost+""+id).removeClass('ancher_lock');
		},
		/**
		 * cancel the edit view of post
		 * @param e
		 */
		_cancelEditedPost:function(e){
			var target = $(e.target);
			var id = target.data("id");
			
			$(this.selectors.editedPostDiv+""+id).addClass('hide');
			$(this.selectors.postMessageDiv+""+id).removeClass('hide');
			$(this.selectors.postIconsDiv+""+id).removeClass('hide');
			$(this.selectors.editIcon+""+id).removeClass('selected-sm');
			$(this.selectors.postButtons+""+id).addClass('hide');
			$(this.selectors.postDate+""+id).removeClass('hide');
			
			$(this.selectors.postEditTextArea+""+id).val(this.originalPost);
			
			$(this.selectors.postEditError+""+id).addClass('hide');
			$(this.selectors.saveEditedPost+""+id).removeClass('ancher_lock');
		},
		/**
		 * _deletePost is used to delete posts
		 */
		_deletePost:function(e){
			var currentDelete = this;
			var target = $(e.target);
        	   Confirmation.init({
        		   yesLabel:"Delete",
        		   noLabel:"Cancel",
        		   title:"Delete Post",
					ele:'#confirmation-popupid',
					onYes:function(){
						//var currentDelete = this;
						//var target = $(e.target);
						var id = target.data("id");
						$("#post-div_"+id).addClass('smartwall-overlay-bg');
						$("#proocessing_post_"+id).removeClass('hide');
						
						var deletePostRequest = {
								accessToken:currentDelete.options.accessToken,
				       			langId:currentDelete.options.langId,
				       			userId:currentDelete.options.userId,
				       			receiverType:currentDelete.options.receiverType,
				       			postId:id,
						};
						deletePostRequest = JSON.stringify(deletePostRequest);
							var saveLike={
				         			url:getModelObject('serviceUrl')+'/feed/1.0/deleteFeed',
				         			data:deletePostRequest,
				         			async:true,
				         			successCallBack:function(data){
				         				if(data['isSuccess']){
				         					var endResult = 0;
				         					if(currentDelete.postRequest.startResult == 0){
				         						endResult = currentDelete.postRequest.maxRestult;
				         					}else{
				         						endResult = currentDelete.postRequest.startResult;
				         					}
				         					currentDelete._generatePostsRequest("",currentDelete.startResult,endResult);
				         					currentDelete._loadPosts("delete");
				         				}
				         			}
							};
						doAjax.DeleteServiceInvocation(saveLike);
						
					},
					message:'Are you sure want to delete this post?'
				});
        	   
        	   
         	  
         	  
           
		},
		/**
		 * _showMorePosts is used to show more posts
		 */
		_showMorePosts:function(e){
			if($(this.selectors.searchPosts).hasClass('selected-sm') && $.trim($(this.selectors.smartWallSearcBox).val()) != '' &&
					$.trim($(this.selectors.smartWallSearcBox).val()) != undefined){
				this._generatePostsRequest("search",this.postRequest.startResult,this.maxResult);
			}else{
				this._generatePostsRequest("",this.postRequest.startResult,this.maxResult);
			}
			
			this._loadPosts("more");
		},
		/**
		 * add new post
		 * @access public
		 * @param {string} message
		 * @param {object} user
		 * @event smartwall2#newpost
		 */
		_showAddPost:function(e){
		
			//alert(" show add post " + e.target.id);
			var postIconId = e.target.id;
			//var postIconId = "newPostID";
			
			if($("#"+postIconId).hasClass('selected-sm')){
				$("#"+postIconId).removeClass('selected-sm');
			}else{
				$("#"+postIconId).addClass('selected-sm');
			}
			
			/*fetching the json object for html*/
			var uielementJSON = HTMLUIElements.newPost();
		
			/* popover display*/
      	  	$("#"+postIconId).popover({
				'html' : true,
				placement: 'bottom',
				container: '#baseElementSmartwall',
				viewport: {selector: '#baseElementSmartwall', padding: 12},
				content:Mustache.to_html(this.templates.newPost,uielementJSON),
				template:'<div class="popover popover-background-color" style="min-width:384px;min-height:160px;left:165px;top:79px;" role="tooltip"><h3 class="popover-title"></h3><div class="popover-content pad-trbl-10-12"></div></div>'
			});
      	  	$("#"+postIconId).popover('toggle');
      	  	
      	  	 $('#saveNewPost').attr("disabled", "disabled");
      	  	 
      	  	 // disable new post button if no text is entered
      	  	$(this.selectors.newPostText).on("change keyup paste", function (e){
    		
				if($.trim($("#newPostText").val()) == ''){
					 $('#saveNewPost').addClass('grey-button');
					  $('#saveNewPost').removeClass('def-button');
					  $('#saveNewPost').attr("disabled", "disabled");
				}
			  
				else{
					  $('#saveNewPost').removeClass('grey-button');
					  $('#saveNewPost').addClass('def-button');
					  $('#saveNewPost').removeAttr("disabled");
				}   
			});
			
      	  	$(this.selectors.newPostText).focus();
      	  	
      	    this._on(this.selectors.saveNewPostButton,{click:"_savePost"});
			
			this._on(this.selectors.cancelNewPostButton,{click:"_cancelPost"});
			
		
		},
		/**
		 * used to like the post
		 * @param e
		 */
		_likePost:function(e){
				if($(e.target).hasClass('postLikeIcon')){
					if(!$(e.target).hasClass('selected-sm')){
					var current = this;
					var target = $(e.target);
					var id = target.data("id");
					var adminGroup= target.data("parent");
					var count = $(current.selectors.likeCount+""+id).attr('count');;
					$(current.selectors.likePost+""+id).addClass('selected-sm');
					
					var likePostRequest = {
						  accessToken:this.options.accessToken,
		       			  langId:this.options.langId,
		       			  userId:this.options.userId,
		       			  agentEmail:this.options.emailId,
		       			  verb:"Liked",
		       			 // parentPostGroupId:adminGroup,
			       		  receiverType:this.options.receiverType,
			       		  groupId:adminGroup,
			       		  postId:id
					};
					
					likePostRequest = JSON.stringify(likePostRequest);
					var saveLike={
		         			url:getModelObject('serviceUrl')+'/feed/1.0/saveFeed',
		         			data:likePostRequest,
		         			async:true,
		         			successCallBack:function(data){
		         				if(data['isSuccess']){
		         					count++;
		         					$(current.selectors.likeCount+""+id).html(count);
		         				}
		         			}
					};
					doAjax.PostServiceInvocation(saveLike);
					}
			}else{
				var target = $(e.target);
				var id = target.data("id");
				
				 if($('#readMorePopup').data('xiim-readMorePost')!=undefined){
	   			  		$('#readMorePopup').readMorePost('destroy');
	   		  	 }
				 $('#readMorePopup').readMorePost({postUid:id,onLoad:'likes',externalShareCount:"#share_count_"+id,externalCommentCount:this.selectors.commentCount+""+id,externalLikeCount:this.selectors.likeCount+""+id});
				 
				 /*$( document ).on( "completedLoadReadMore",function( event) {
					 $( document ).trigger( "likeCountClick");
				  });*/
				 
			}
		},
		/**
		 * 
		 * used to share the post
		 * @param e
		 */
		_sharePost:function(e){
			var currentObject = this;
			if($(e.target).hasClass('sharePostIcon')){
				var target = $(e.target);
				var id = target.data("id");
				var parentId = target.data("parent");
				
				currentObject._cancelCommentOnPost(e);
				
				$(e.target).addClass('selected-sm');
				$(this.selectors.sharePostDiv+""+id).removeClass('hide');
				$(this.selectors.readPost+""+id).addClass('hide');
				$(this.selectors.sharePostButton+""+id).removeClass('hide');
				$(this.selectors.cancelSharePost+""+id).removeClass('hide');

				currentObject.selectedUsers=[];
				$('[id^="invitedUserID_"]').remove();
				
		      	$("#user_shareUserConnectionName_"+id).focus();
		      	this._applayAutoComplete(id);
		      	
		      	this.element.find(this.selectors.cancelSharePostClick).off('click');
		      	this._on(this.selectors.cancelSharePostClick,{click:"_cancelSharePostClick"});
		      	
		      	this.element.find(this.selectors.shareButtonClick).off('click');
		      	this._on(this.selectors.shareButtonClick,{click:"_shareButtonClick"});
		      	
			}else if($(e.target).hasClass('sharePostCount')){
				var target = $(e.target);
				var id = target.data("id");
				
				currentObject._cancelSharePostClick(e);
				
				 if($('#readMorePopup').data('xiim-readMorePost')!=undefined){
	   			  		$('#readMorePopup').readMorePost('destroy');
	   		  	 }
				 $('#readMorePopup').readMorePost({postUid:id,onLoad:"shares",externalShareCount:"#share_count_"+id,externalCommentCount:this.selectors.commentCount+""+id,externalLikeCount:this.selectors.likeCount+""+id});
			}
		},
		/**
		 * _removeSharingUserClick is used to remove the selected users from sharing popover
		 */
		_removeSharingUserClick:function(e){
			var removeTarget = $(e.target);
			var removeId = removeTarget.data("userid");
			
			this.selectedUsers.splice(this.selectedUsers.indexOf(removeId+""), 1);
			
      		$(e.target).remove();
      		$("#invitedUserID_"+removeId).remove();
      		
      		// e.stopPropagation();
		},
		/**
		 * used to comment on post
		 * @param e
		 */
		_commentOnPost:function(e){
			if($(e.target).hasClass('commentIcon')){
				var target = $(e.target);
				var id = target.data("id");
				
				this._cancelSharePostClick(e);
				
				$(this.selectors.postComment+""+id).addClass('selected-sm');
				
				$(this.selectors.postCommentDiv+""+id).removeClass('hide');
				$(this.selectors.readPost+""+id).addClass('hide');
				
				$(this.selectors.savePostComment+""+id).removeClass('hide');
				$(this.selectors.cancelPostComment+""+id).removeClass('hide');
				
				$(this.selectors.postComentTextArea+""+id).val('').focus();
				
				$(this.selectors.savePostComment+""+id).attr("disabled", "disabled");
      	  	 	 $(this.selectors.savePostComment+""+id).addClass('grey-button');
				$(this.selectors.savePostComment+""+id).removeClass('def-button');
      	  		 // disable new post button if no text is entered
      	  	
      	  		var commentArea = "#post-comment-text-area_"+id ;
      	  		var saveCommentButton = "#save-post-comment_"+id ;
      	  		
      	  		$(commentArea).on("change keyup paste", function (e){
    			
    			
					if( $.trim( $(commentArea).val() ) == ''){
		
						 $(saveCommentButton).addClass('grey-button');
						 $(saveCommentButton).removeClass('def-button');
						 $(saveCommentButton).attr("disabled", "disabled");
					}
			  
					else{
			
						 $(saveCommentButton).removeClass('grey-button');
						 $(saveCommentButton).addClass('def-button');
						 $(saveCommentButton).removeAttr("disabled");
					}  
				});
				
			}else{
				var target = $(e.target);
				var id = target.data("id");
				
				 if($('#readMorePopup').data('xiim-readMorePost')!=undefined){
	   			  		$('#readMorePopup').readMorePost('destroy');
	   		  	 }
				 $('#readMorePopup').readMorePost({postUid:id,externalShareCount:"#share_count_"+id,externalCommentCount:this.selectors.commentCount+""+id,externalLikeCount:this.selectors.likeCount+""+id});
			}
		},
		/**
		 * used to save the post comment
		 * @param e
		 */
		_savePostComment:function(e){
			var current = this;
			var target = $(e.target);
			var id = target.data("id");
			
			$(this.selectors.savePostComment+""+id).addClass('ancher_lock');
			
			var adminGroup= target.data("parent");
			var count = $(current.selectors.commentCount+""+id).attr('count');
			if($.trim($(this.selectors.postComentTextArea+""+id).val())){
				var commentOnPostRequest = {
						  accessToken:this.options.accessToken,
		       			  langId:this.options.langId,
		       			  userId:this.options.userId,
		       			  agentEmail:this.options.emailId,
		       			  verb:"Commented",
		       			 // parentPostGroupId:adminGroup,
			       		  receiverType:this.options.receiverType,
			       		  groupId:adminGroup,
			       		  postId:id,
			       		  comment:$.trim($(this.selectors.postComentTextArea+""+id).val())
					};
					
				commentOnPostRequest = JSON.stringify(commentOnPostRequest);
					var saveComment={
		         			url:getModelObject('serviceUrl')+'/feed/1.0/saveFeed',
		         			data:commentOnPostRequest,
		         			async:true,
		         			successCallBack:function(data){
		         				if(data['isSuccess']){
		         					$(current.selectors.savePostComment+""+id).removeClass('ancher_lock');
		         					count = parseInt(count)+1;
		         					$(current.selectors.commentCount+""+id).attr('count',count);
		         					$(current.selectors.commentCount+""+id).html(count);
		         					current._cancelCommentOnPost(e);
		         				}
		         			}
					};
					doAjax.PostServiceInvocation(saveComment);
			}else{
				$(this.selectors.postCommentError+""+id).removeClass('hide');
				$(this.selectors.savePostComment+""+id).addClass('ancher_lock');
			}
		},
		/**
		 * used to cancel the comment on post
		 * @param e
		 */
		_cancelCommentOnPost:function(e){
			var target = $(e.target);
			var id = target.data("id");
			
			$('[id^="invitedUserID_"]').remove();
			
			$(this.selectors.postComment+""+id).removeClass('selected-sm');
			
			$(this.selectors.postCommentDiv+""+id).addClass('hide');
			$(this.selectors.readPost+""+id).removeClass('hide');
			
			$(this.selectors.savePostComment+""+id).addClass('hide');
			$(this.selectors.cancelPostComment+""+id).addClass('hide');
			
			$(this.selectors.postCommentError+""+id).addClass('hide');
			$(this.selectors.savePostComment+""+id).removeClass('ancher_lock');
		},
		/**
		 * _postComentTextAreaForAction is used to validate comment textarea
		 */
		_postComentTextAreaForAction:function(e){
			var target = $(e.target);
			var id = target.data("id");
			
			$(this.selectors.postCommentError+""+id).addClass('hide');
			$(this.selectors.savePostComment+""+id).removeClass('ancher_lock');
		},
		/**
		 * search Post based on user input
		 */
		searchPost:function(){
			
		},
		/**
		 * _loadConnections is sued to load the current user connections
		 */
		_loadConnections:function(){
			var current = this;
			
	    	var connectionRequest = {
						"groupUniqueIdentifier":this.options.connectionGroupUniqueIdentifier,
						"groupmemberSearchModelList":[{
							"groupMemberSearchAttributeEnum":"IS_CONNECTION",
							"searchValue":false
						}],
						"pageCriteriaModel" : {
							"pageSize" : 20,
							"pageNo" : 1,
							"isAll" : true
						},
						
						"langId" :this.options.langId ,
						"accessToken" :this.options.accessToken
        			};
			 connectionRequest = JSON.stringify(connectionRequest);
			 var loadConnectionOptions = {
					 url:getModelObject('serviceUrl')+'/group/2.0/getGroupMembers',
					 data:connectionRequest,
					 async:true,
					 successCallBack:function(data){
						 if(data.manageGroupMemberModelList){
							 if(data.manageGroupMemberModelList.length == undefined){
								 data.manageGroupMemberModelList = [data.manageGroupMemberModelList]; 
							 }
							 current.userConnections = data.manageGroupMemberModelList; 
						 }
					 }
			 };
			 doAjax.PostServiceInvocation(loadConnectionOptions);
		},
		/**
		 * _applayAutoComplete is used to autopopulate connection names
		 */
		_applayAutoComplete:function(id){
			var currentObject = this;
			$("#user_shareUserConnectionName_"+id).autocomplete({
				minLength: 0,
				create: function(){
					$(this).data('ui-autocomplete')._renderItem =function (ul, item) {
	                    return $('<li class="pad-0">')
	                        .append('<a class="autocomplete-window-href">' + stringLimitDots(item.label, 45) + '' + 
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
					 var res=$.map(currentObject.userConnections,function( item ) {
						if(item.memberName.toLowerCase().indexOf(match) > -1 && $.inArray((item.userId+''), currentObject.selectedUsers) < 0 && item.userId != currentObject.options.userId){
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
					 if ($.inArray(ui.item.value, currentObject.selectedUsers) < 0) {
						 currentObject.selectedUsers.push(ui.item.value);
						 var data = {
								 userName:ui.item.label,
								 userId:ui.item.value
						 };
						 
						 $("#user_shareUserConnectionName_"+id).before(Mustache.to_html(jQuery('#share-User-Div').html(),data));
						 
						 $(currentObject.selectors.removeSharingUserClick).off('click');
						 currentObject._on(currentObject.selectors.removeSharingUserClick,{click:"_removeSharingUserClick"});
					 }
					
					 $("#user_shareUserConnectionName_"+id).val('');
					 $("#user_share-connections-error_"+id).addClass('hide');
					 $("#user_sharePostButton_"+""+id).removeClass('ancher_lock');
					 
					 return false;
				 }
			});
			 
		},
		/**
		 * _cancelSharePostClick is used to cancel the share post
		 */
		_cancelSharePostClick:function(e){
			this.selectedUsers=[];
			
			var target = $(e.target);
			var id = target.data("id");
			
			$(this.selectors.sharePost+""+id).removeClass('selected-sm');
			
			$(this.selectors.sharePostDiv+""+id).addClass('hide');
			$(this.selectors.readPost+""+id).removeClass('hide');
			
			$(this.selectors.sharePostButton+""+id).addClass('hide');
			$(this.selectors.cancelSharePost+""+id).addClass('hide');
			
			$("#user_share-connections-error_"+id).addClass('hide');
			$(this.selectors.sharePostButton+""+id).removeClass('ancher_lock');
			$("#user_shareUserConnectionName_"+id).val('');
		},
		/**
		 * _shareButtonClick is used to share post when clicked on share button
		 */
		_shareButtonClick:function(e){
			var currentObject = this;
			var target = $(e.target);
			target.addClass('ancher_lock');
			var id = target.data("id");
			if(this.selectedUsers.length != 0){
				var parent = target.data("parent");
				var sharePostRequest = {
						langId :this.options.langId ,
						accessToken :this.options.accessToken,
						postId:id,
						groupId:parent,
						receiverType:this.options.receiverType,
						userList:this.selectedUsers
				};
				
				sharePostRequest = JSON.stringify(sharePostRequest);
				 var sharePostRequestOptions = {
						 url:getModelObject('serviceUrl')+'/feed/1.0/sharePost',
						 data:sharePostRequest,
						 async:true,
						 successCallBack:function(data){
							 if(data['isSuccess']){
								 var count = $("#share_count_"+id).attr("count");
								 count = parseInt(count) + currentObject.selectedUsers.length;
								 $("#share_count_"+id).html(count);
								 $("#share_count_"+id).attr("count",count);
								 
								/* $(".sharePostIcon").removeClass('selected-sm');
						 			$('.share-popover-holder').closest('.popover').remove();*/
								 currentObject._cancelSharePostClick(e);
							 }
						 }
				 };
				 doAjax.PostServiceInvocation(sharePostRequestOptions);
			}else{
				$("#user_share-connections-error_"+id).removeClass('hide');
				$("#user_sharePostButton_"+""+id).addClass('ancher_lock');
			}
		},
		/**
		 * _unfollowClick is used to click on unfollow
		 */
		_unfollowClick:function(e){
			var current = this;
			var target = $(e.target);
			var resourceType = target.data("resourcetype");
			var resourceid = target.data("resourceid");
			var actiontype = target.data("actiontype");
			
			var unfollowRequest = {
					langId :this.options.langId ,
					accessToken :this.options.accessToken,
					resourceType:resourceType,
					resourceId:resourceid,
					actionType:actiontype
    			};
			unfollowRequest = JSON.stringify(unfollowRequest);
		 var unfollowOptions = {
				 url:getModelObject('serviceUrl')+'/feed/1.0/assertFollowness',
				 data:unfollowRequest,
				 async:true,
				 successCallBack:function(data){
					 if(data['isSuccess']){
						// current._deletePost(e);
						 var endResult = 0;
      					if(current.postRequest.startResult == 0){
      						endResult = current.postRequest.maxRestult;
      					}else{
      						endResult = current.postRequest.startResult;
      					}
      					current._generatePostsRequest("",current.startResult,endResult);
      					current._loadPosts("delete");
					 }
				 }
		 };
		 doAjax.PutServiceInvocation(unfollowOptions);
		},
		/**
		 * Jquery validations added
		 * @param ele
		 * @returns {Boolean}
		 */
		_validate : function(ele){
	    	 $(ele).validate({
	    	        rules: {
	    	        	newPostTextBox:{
	    	        		required : true,
	    	        		maxlength: 1500
	    	        	}
	    	        },
	    	        errorPlacement: function(error, element){
	    	        	error.insertAfter(element);
	    	          },
	    	        messages: {
	    	        	newPostTextBox:{
	    	        		required :  "Post data is required.",
	    	        		maxlength : "Post is limited to 1500 characters."
	    	        	}
	    	        },
	    	        highlight: function(element, errorClass, validClass) {
	    	        	$(element).removeClass('red').addClass(validClass);
	    	         },
	    	        errorElement: "div",
	    	        errorClass: "red"
	    	    });
	    	 if($(ele).valid()){
	    		 return true;
	    	 }else{
	    		 return false;
	    	 }
	    },
		/** cancel event fired */
		_cancel: function(e){
			this._trigger("cancel",e);
			this._destroy();
		},
		
		
		/** destroy widget and its instances*/
		_destroy: function () {
			this.element.empty();
			return this._super();
		},
	});
})(jQuery);