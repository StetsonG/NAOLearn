/**
 * @author Next Sphere Technologies
 * Read More Widget
 * 
 * Read More Widget can able to see more details on each feeds,
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
var currentUserConnections=[];//store The Current User Connections Globally to re use
(function($, undefined) {
	'use strict';
	var _super = $.Widget.prototype;

	$.widget('xiim.readMorePost', {
	   version : '1.0.0',
	   options : {
	      postUid : undefined,
	      serviceUrl : getModelObject('serviceUrl'),
	      getFeedDetails : '/feed/1.0/getFeedDetails',
	      likeDetailsMethod : '/feed/1.0/getPostLikeDetails',
	      accessToken : $("#accessToken_meta").val(),
	      langId : $("#langId_meta").val(),
	      userId : $("#loggedInUserId-meta").val(),
	      template : undefined,
	      templateId : '#readMoreTemplate',
	      userProfileName : $("#userProfileName").val(),
	      emailId : $("#emailId").val()||$("#loginUserId-meta").val(),
	      groupId : $("#groupId").val(),
	      startResult : 0,
	      maxResult : 5,
	      scrollBarHeight : '550px',
	      postLikeDetailsTemplate : undefined,
	      receiverType : $("#receiverType").val(),
	      sortOrder : 'AS',
	      totalcomments : 0,
	      currentuserphotoId : $('#userProfilePhotoId').val(),
	      userProfileUniqueIdentifier : $('#userProfileUniqueIdentifier').val(),
	      onLoad:'comments',
	      connectionGroupUniqueIdentifier:$("#connectionGroupUniqueIdentifier").val(),
	      shareCountDetails:"/feed/1.0/getPostShareDetails",
	      externalShareCount:'',
	      externalCommentCount:'',
	      externalLikeCount:'',
	      commentLength:200,
	      relatedReadMore:false,
	   },
	   selectors : {
	      likePost : '#likeId_',
	      closeButton : '.close-sm-icons.selected-sm',
	      likePostClick : '.like_Post',
	      seeMoreComments : '#seeMoreComments',
	      commentsHolder : '#commentsHolder',
	      likesHolder : '#likesHolder',
	      postLikeDetailsTemplateId : '#postLikeDetailsTemplate',
	      addComment : '#addComment',
	      postcommentdiv : '#post-comment-div_',
	      postcommentButtons :'#post-buttons_',
	      commenttextarea : '#comment_text_area',
	      commenterror : '#comment_error',
	      saveComment : '#saveComment',
	      cancelComment : '#cancelComment',
	      mCustomScrollbar : '.mCustomScrollbar',
	      nocommentsDiv : '#nocommentsDiv',
	      postCommentTemplate : '#postCommentTemplate',
	      toggleCommentsSort : '#toggleCommentsSort',
	      commentItemparent : '.commentItemparent',
	      editcomment : '.editthecomment',
	      deletecomment : '.deletethecomment',
	      editCommentTextArea : '#editCommentText',
	      saveEditComment : '[id^="saveEditComment_"]',
	      saveAddComment : '#saveAddComment',
	      cancelEditComment : '[id^="cancelEditComment_"]',
	      cancelAddComment : '#cancelAddComment',
	      sharePostTemplate : '',
	      sharePost : '.sharePost',
	      cancelSharePostClick : '[id^="cancelSharePost_"]',
			shareButtonClick : '[id^="sharePostButton_"]',
			removeSharingUserClick:'[id^="remove-userID_"]',
			sharesHolder: '#sharesHolder'
	   },
	   userConnections:[],
	   Modalclosable:true,

	   /*called Once when the widget is created*/
	   _create : function() {
	   	this._loadConnectionsForautoComplete();
		   if (this.options.template == undefined) {
			   this.options.template = $(this.options.templateId).html();
		   }
		   if (this.options.postLikeDetailsTemplate == undefined) {
			   this.options.postLikeDetailsTemplate = $(this.selectors.postLikeDetailsTemplateId).html();
		   }
		   this.selectors.sharePostTemplate = $('#smartwall-share-post').html()	;
	   },
	   /**
	    * function used to Destroy the widget
	    * */
	   _destroy : function() {
	   	_super._destroy();
	   },
	   /**
	    * Init Method will call each and everytime when we call the widget on a div
	    */
	   _init : function() {
		   var widget=this;
		   this.element.parent().removeClass('hide');
		   this._injectDom();
		   this.element.parent().modal({
			   backdrop:'static',
	    		show:true,
	    		keyboard:true
	    	  }).off('hide.bs.modal hidden.bs.modal shown.bs.modal').on('hide.bs.modal',function(e){
	    		if(!widget.Modalclosable){ 
	    			 e.preventDefault();
	    		     e.stopImmediatePropagation();
	    		     widget.Modalclosable=true;
	    		     return false; 
	    		     }
	    		widget.Modalclosable=true;
	    	  }).on('hidden.bs.modal',function(e){
			   widget.element.empty();
			   widget.element.parent().modal('hide');
		   }).on('shown.bs.modal',function(){
			   $('#bottomcontentreadmore').removeClass('hide');
			   if(widget.options.onLoad=='s'){

				   if ($(widget.selectors.sharesHolder).find('li').length > 4) {
					   $(widget.selectors.sharesHolder).parent().find('.slide-next,.slide-prev').off('click').show();
					   $(widget.selectors.sharesHolder + ' .slide-photos').jCarouselLite({
						   btnNext : ".slide-next",
						   btnPrev : ".slide-prev",
						   start : 0,
						   visible : 4
					   });
					   $(widget.selectors.sharesHolder).find('li').css('height','auto');
				   } else {
					   $(widget.selectors.sharesHolder).parent().find('.slide-next,.slide-prev').hide();
				   }
			   }
			   else if(widget.options.onLoad='l'){
				   if ($(widget.selectors.likesHolder).find('li').length > 4) {
					   $(widget.selectors.likesHolder).parent().find('.slide-next,.slide-prev').off('click').show();
					   $(widget.selectors.likesHolder + ' .slide-photos').jCarouselLite({
						   btnNext : ".slide-next",
						   btnPrev : ".slide-prev",
						   start : 0,
						   visible : 4
					   });
					   $(widget.selectors.likesHolder).find('li').css('height','auto');
				   } else {
					   $(widget.selectors.likesHolder).parent().find('.slide-next,.slide-prev').hide();
				   }
			   }


		   });
		   this._loadComments();
	   },
	   /**
	    * The Html Template is injected to Dom In this method
	    */
	   _injectDom : function() {

		   var data = HTMLUIElements.readMorePost();
		   this.element.html(Mustache.to_html(this.options.template, data));
		   $(window).trigger('resize');
	   },
	   _staticElementEvents : function() {

	   },
	   /**
	    * load Comments is used to load the Comments on a post 
	    * @param {object} loadType   parameter is optional, it will define wether see more  or first time loading etc.
	    */
	   _loadComments : function(loadType) {
		   var widget = this;
		   var request;
		   var scrollto = undefined;
		   if (loadType == undefined || loadType == false) {
			   request = {
			      accessToken : widget.options.accessToken,
			      postId : widget.options.postUid,
			      startResult : widget.options.startResult,
			      maxResult : widget.options.maxResult,
			      sortOrder : widget.options.sortOrder
			   };

		   } else if (loadType.seeAll) {
			   scrollto = loadType.postId;
			   request = {
			      accessToken : widget.options.accessToken,
			      postId : widget.options.postUid,
			      startResult : 0,
			      maxResult : widget.options.totalcomments + 5,
			      sortOrder : widget.options.sortOrder
			   };
		   } else if (loadType.isMore) {
			   scrollto = $(".commentItem:last").attr("id");
			   request = {
			      accessToken : widget.options.accessToken,
			      postId : widget.options.postUid,
			      startResult : widget.options.startResult,
			      maxResult : (loadType.upto==undefined)?widget.element.find('.commentItem').length + widget.options.maxResult:loadType.upto,
			      sortOrder : widget.options.sortOrder
			   };
		   }
		   var options = {
		      url : widget.options.serviceUrl + widget.options.getFeedDetails,
		      data : JSON.stringify(request),
		      parentId : widget.selectors.commentsHolder,
		      async : true,
		      successCallBack : function(data) {
				  $('#bottomcontentreadmore').removeClass('hide');
			      var elementdata = HTMLUIElements.readMorePost();
			      data = mustacheDataUtil(data);
			      jQuery.extend(data, elementdata);
			      if (data.feedInfo != undefined && data.feedInfo.likedByUser != undefined){
				      	data.feedInfo.likedByUser = (data.feedInfo.likedByUser != "false" && data.feedInfo.likedByUser != false);
				      	data.feedInfo.isEdited = (data.feedInfo.isEdited != "false" && data.feedInfo.isEdited != false);
				      	if(data.feedInfo.activityType=='Shared'){
					      	data.feedInfo.isSharedVia = true;
      					}
				  }
			      if(data.feedInfo!=undefined){
				      if(data && data.feedInfo && data.feedInfo.activityObjectType == 'GROUP'){
				    	  data.feedInfo.isGroup = true;
				    	  widget.options.receiverType="GROUP";
				      }else if(data && data.feedInfo && (data.feedInfo.activityObjectType == 'COURSE' || data.feedInfo.activityObjectType=='CIRCLE')){
				    	  data.feedInfo.isCourse = true;
				    	  widget.options.receiverType="COURSE";
				      }else if(data && data.feedInfo && data.feedInfo.activityObjectType == 'CONNECTION'){
				    	  data.feedInfo.isConnection = true;
				      }
				      
			      	var count=data.feedInfo.commentCount;
			      	$(widget.options.externalCommentCount).html(count).attr('count',count);
			      }
			      if (data.feedInfo != undefined && data.feedInfo.commentActivities != undefined) {
				      data.feedInfo.commentActivities = data.feedInfo.commentActivities.length == undefined ? [ data.feedInfo.commentActivities ] : data.feedInfo.commentActivities;
				      $.each(data.feedInfo.commentActivities, function(i, value) {
				      	data.feedInfo.commentActivities [i].isEdited = (data.feedInfo.commentActivities [i].isEdited != "false" && data.feedInfo.commentActivities [i].isEdited != false);
					      if (data.feedInfo.commentActivities [i].canCommentDeleted + '' == 'false'||widget.options.relatedReadMore) {
						      data.feedInfo.commentActivities [i].canCommentDeleted = false;
					      }
				      });
			      }
			      widget.element.html(Mustache.to_html(widget.options.template, data));
			      if(data && data.feedInfo && data.feedInfo.activityObjectType == 'GROUP'){
			    	  $("#readMorePopoUpHeading").html('Group Post');
			      }else if(data && data.feedInfo && data.feedInfo.activityObjectType == 'COURSE'){
			    	  $("#readMorePopoUpHeading").html('Course Post');
			      }
			      
			      widget._dyanamicElementEvents();
			      if (data.feedInfo != undefined && data.feedInfo.commentActivities != undefined){
				      	if(data.feedInfo.commentActivities.length < parseInt(data.feedInfo.commentCount)) {
				      	   $(widget.selectors.seeMoreComments).removeClass('hide');
				      	}else {
				      		$(widget.selectors.seeMoreComments).addClass('hide');
						}	
				      	widget.options.totalcomments = parseInt(data.feedInfo.commentCount);
			      } else {
				      $(widget.selectors.seeMoreComments).addClass('hide');
			      }

			      if (loadType && loadType.seeAll) {
				      if ($('#' + scrollto).length == 0) {
					      widget._appendComment({
					         postId : loadType.postId,
					         comment : loadType.comment
					      });
				      }
			      }
			      if(widget.options.onLoad=='likes'){
			      	widget.options.onLoad="l";
			      	widget._loadLikeDetails();
			      }
			      
			      if(widget.options.onLoad=='shares'){
			      	widget.options.onLoad="s";
			      	widget._shareCountDetails();
			      }
			      $('#toggleCommentsSort').removeClass('hide');
			      $(window).trigger('resize');
		      },
		   };
		   doAjax.PostServiceInvocation(options);
	   },
	   /**
	    * The _likepost function is Event Handler for Like Icon Click
	    * @param {event} e
	    * */
	   _likePost : function(e) {

		   var widget = this;
		   if ($(e.target).has('.count').length > 0&&(!widget.options.relatedReadMore)) {
			   if (!($(e.target).hasClass('selected-sm') || $(e.target).hasClass('clicked'))) {

				   var current = this;
				   var target = $(e.target).addClass('clicked');
				   var id = target.data("postid");
				   var adminGroup = target.data("parent");
				   var count = $(current.selectors.likePost + "" + id).find('.count').html();
				   
				   var likePostRequest = {
				      accessToken : widget.options.accessToken,
				      langId : widget.options.langId,
				      userId : widget.options.userId,
				      agentEmail : widget.options.emailId,
				      verb : "Liked",
				      receiverType : widget.options.receiverType,
				      groupId : adminGroup,
				      postId : id
				   };

				   likePostRequest = JSON.stringify(likePostRequest);
				   var saveLike = {
				      url : getModelObject('serviceUrl') + '/feed/1.0/saveFeed',
				      data : likePostRequest,
				      async : true,
				      successCallBack : function(data) {

					      if (data ['isSuccess']) {
						      $(current.selectors.likePost + "" + id).addClass('selected-sm');
						      count++;
						      $(current.selectors.likePost + "" + id).find('.count').html(count);
						      $(current.options.externalLikeCount).html(count).attr('count',count).parent().addClass('selected-sm');
						      if (!$(current.selectors.likesHolder).hasClass('hide'))
							      current._loadLikeDetails();
					      }
				      }
				   };
				   doAjax.PostServiceInvocation(saveLike);
			   }
		   } else {
			   this._loadLikeDetails();
		   }

	   },
	   /**
	    * _loadLikeDetails method is used to show the Liked profiles in the View
	   */
	   _loadLikeDetails : function() {

		   var widget = this;
		   $(widget.selectors.commentsHolder).addClass('hide');
		   $(widget.selectors.sharesHolder).addClass('hide');
		   $(widget.selectors.likesHolder).removeClass('hide');
		   var request = {
		      accessToken : widget.options.accessToken,
		      postId : widget.options.postUid,
		      startResult : widget.options.startResult,
		      maxResult : widget.options.maxResult
		   };
		   var options = {
		      url : widget.options.serviceUrl + widget.options.likeDetailsMethod,
		      data : JSON.stringify(request),
		      parentId : widget.selectors.likesHolder,
		      async : true,
		      successCallBack : function(data) {
		      	$('#toggleCommentsSort').addClass('hide');
				  $('#bottomcontentreadmore').removeClass('hide');
			      var elementdata = HTMLUIElements.readMorePost();
			      jQuery.extend(data, elementdata);
			      data = mustacheDataUtil(data);
			      if(data.manageFeedModelList!=undefined){
			    	  data.haveLikes=true;
			      }
			      widget.element.find(widget.selectors.likesHolder).html(Mustache.to_html(widget.options.postLikeDetailsTemplate, data));
			      
			      if ($(widget.selectors.likesHolder).find('li').length > 4) {
				      $(widget.selectors.likesHolder).parent().find('.slide-next,.slide-prev').show();
				      $(widget.selectors.likesHolder + ' .slide-photos').jCarouselLite({
				         btnNext : ".slide-next",
				         btnPrev : ".slide-prev",
				         start : 0,
				         visible : 4
				      });
				      $(widget.selectors.likesHolder).find('li').css('height','auto');
			      } else {
				      $(widget.selectors.likesHolder).parent().find('.slide-next,.slide-prev').hide();
			      }
			      $(window).trigger('resize');
		      },
		      failureCallBack : function(data) {

		      }
		   };
		   doAjax.PostServiceInvocation(options);

	   },
	   /**
	    * _addComment method is the Event Handler for the Add comment icon click
	    * @param {event} e
	    * */
	   _addComment : function(e) {

		   var widget = this;
		   if ($(e.target).has('.count').length > 0&&(!widget.options.relatedReadMore)) { /* when clicked On The Comment Icon */
			   
			   if(!$(e.target).hasClass('selected-sm')){
				   var target = $(e.target);
					$(e.target).addClass("selected-sm");
					
					$('#post-comment-div_').removeClass('hide');
					$('#post-buttons_').removeClass('hide');
					$('#post-comment-text-area_').keyup(function(){
						   $('#post-comment-error_').addClass('hide');
						   if( $.trim( $('#post-comment-text-area_').val() ) == ''){
								 $(widget.selectors.saveAddComment).addClass('grey-button');
								 $(widget.selectors.saveAddComment).removeClass('def-button');
								 $(widget.selectors.saveAddComment).attr("disabled", "disabled");
							}
							else{
								 $(widget.selectors.saveAddComment).removeClass('grey-button');
								 $(widget.selectors.saveAddComment).addClass('def-button');
								 $(widget.selectors.saveAddComment).removeAttr("disabled");
							} 
					   }).focus();
					   this._on(this.selectors.saveAddComment, {
						   click : "_saveComment"
					   });
					   
					   this._on(this.selectors.cancelAddComment, {
						   click : "_cancelComment"
					   });
			   }else{

			   }
		   } else {/* when clicked On Comment Count */
			   if ($(this.selectors.commentsHolder).hasClass('hide'))/* Do nothing On click of comments Count when comments are already Showing*/
				   widget._loadComments();
		   }
	   },
	   postlikeDetails : function() {

	   },
	   _dyanamicElementEvents : function() {

		   this._on(this.selectors.closeButton, {
			   click : "_closeClick"
		   });
		   this._on(this.selectors.likePostClick, {
			   click : "_likePost"
		   });
		   this._on(this.selectors.addComment, {
			   click : "_addComment"
		   });
		   this._on(this.selectors.saveComment, {
			   click : "_saveComment"
		   });
		   this._on(this.selectors.cancelComment, {
			   click : "_cancelComment"
		   });
		   this._on(this.selectors.seeMoreComments, {
			   click : "_seeMoreComments"
		   });
		   this._on(this.selectors.toggleCommentsSort, {
			   click : "_toggleCommentsSort"
		   });
		   this._on(this.selectors.deletecomment, {
			   click : "_deleteComment"
		   });
		   this._on(this.selectors.editcomment, {
			   click : "_editComment"
		   });
		   this._on(this.selectors.sharePost, {
		   	click : "_sharePostClick"
		   });
		   this._on(this.selectors.saveEditComment, {
			   	click : "_saveEditComment"
		   });
		   this._on(this.selectors.cancelEditComment, {
			   	click : "_cancelEditComment"
		   });
	   },
	   /**
	    * _sharePostClick method is the Event Handler for the Share icon click which is used to show share popover
	    * @param {event} e
	    * */
	   _sharePostClick:function(e){
	   	var currentObject = this;
			if($(e.target).hasClass('sharePost')){
				
				var target = $(e.target);
				var id = target.data("postid");
				var parentId = target.data("parent");
				
				if($(e.target).hasClass('selected-sm')){
					$(e.target).removeClass('selected-sm');
					$('.sharepopover').remove();
				}else{
					$(e.target).addClass('selected-sm');
					currentObject.selectedUsers=[];
					$('.sharepopover').remove();
					var uielementJSON = HTMLUIElements.sharePost();
					uielementJSON.postId=id;
					uielementJSON.parentId=parentId;
					currentObject.Modalclosable=false;
					//var popup = '<div class="popover sharepopover zindextop" style="min-width:500px;min-height:200px;margin-top:30px;z-index:1066" role="tooltip"><div class="" style="margin-top:-30px"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
		      	  	$(e.target).popover({
						'html' : true,
						placement: 'auto',
					//	template:popup,
						container: '#readMorePopup',
						trigger:'manual',
						viewport: {selector: '#connectionpostModelID', padding: 12},
						content:Mustache.to_html(this.selectors.sharePostTemplate,uielementJSON),
						template:'<div class="popover sharepopover popover-background-color smartwall-popover-comment" role="tooltip" style="min-width:420px"><div class=""></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
					}).on("hide.bs.popover", function(e) {
						   $(currentObject.selectors.sharePost).removeClass('selected-sm');
						   $('.sharepopover').remove();
						   currentObject.Modalclosable=true;
					   });
		      	  	$(e.target).popover('show');
		      	  	$('input[id^="shareUserConnectionName_"]').focus().on("escape keydown keyup keypress",function(e){
						   if(e.keyCode==27){
							   e.preventDefault();
							   $(currentObject.selectors.sharePost).removeClass('selected-sm');
							   $('.sharepopover').remove();
							   return false;
							   
						   }
						   
					   });
			      	 
		      	this._shareAutoComplete(id);
		      	  	
		      	  	this._on(this.selectors.cancelSharePostClick,{click:"_cancelSharePostClick"});
		      	  	this._on(this.selectors.shareButtonClick,{click:"_shareButtonClick"});
		      	  	e.stopPropagation();
				}
			}else{
				this._shareCountDetails();	
			}
	   },
	   /**
	    * _shareAutoComplete method is used to register the Auto complete Event for The Share Popover
	    * @param {string} id 
	    * */
	   _shareAutoComplete : function(id){

			var currentObject = this;
			$("#shareUserConnectionName_"+id).autocomplete({
				minLength: 0,
				create: function(){
					$(this).data('ui-autocomplete')._renderItem =function (ul, item) {
	                    return $('<li class="pad-0">')
	                        .append('<a class="autocomplete-window-href">' + stringLimitDots(item.label, 45) + ' ' + 
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
						if(item.memberName.toLowerCase().indexOf(match) > -1 && $.inArray((item.userId+''), currentObject.selectedUsers) < 0&&item.userId != currentObject.options.userId ){
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
						 
						 $("#shareUserConnectionName_"+id).before(Mustache.to_html(jQuery('#share-User-Div').html(),data));
						 $(currentObject.selectors.removeSharingUserClick).off('click');
						 currentObject._on(currentObject.selectors.removeSharingUserClick,{click:"_removeSharingUserClick"});
					 }
					
					 $("#shareUserConnectionName_"+id).val('');
					 $("#share-connections-error_"+id).addClass('hide');
					 $("#sharePostButton_"+""+id).removeClass('ancher_lock');
					 return false;
				 }
			});
			
			
		
	   },
	   /**
	    * cancelSharePostClick is used to handle the cancel event on share popover. it will close the share popover
	    * @param {event} e
	    */
		_cancelSharePostClick:function(e){
			$('.sharePost').popover('destroy');
			this.selectedUsers=[];
			$(".sharePost").removeClass('selected-sm');
 			$('.share-popover-holder').closest('.popover').remove();
 			$('.sharepopover').remove();
		},
		/**
	    * _shareButtonClick is used to handle the share event on share popover. it will makes the service call and shares the post
	    * @param {event} e
	    */
		_shareButtonClick:function(e){
			var widget=this;
			$(e.target).addClass('ancher_lock');
			var target = $(e.target);
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
						 parentId:'#shareUserConnectionName_'+id,
						 successCallBack:function(data){
							 if(data['isSuccess']){
								 var count = $(".sharePost .count").text();
								 count = parseInt(count) + widget.selectedUsers.length;
								 $(".sharePost .count").html(count);
								 $(widget.options.externalShareCount).html(count).attr('count',count);
								 $(".sharePost").removeClass('selected-sm');
								 $('.sharepopover').remove();
								 if(!$(widget.selectors.sharesHolder).hasClass('hide')){
									 widget._shareCountDetails();
								 }
								 widget.Modalclosable=true;
							 }
						 }
				 };
				 doAjax.PostServiceInvocation(sharePostRequestOptions);
			}else{
				$("#share-connections-error_"+id).removeClass('hide');
				$("#sharePostButton_"+""+id).addClass('ancher_lock');
			}
		},
		
		/**
	    * _toggleCommentsSort is used to handle the Sort Icon click event It will sorts the Comments based on time.
	    * @param {event} e
	    */
	   _toggleCommentsSort : function(e) {

		   if (this.options.sortOrder == "AS") {
			   this.options.sortOrder = 'DS';
			   $(this.selectors.toggleCommentsSort).addClass('descending');
			   this._loadComments();
		   } else {
			   this.options.sortOrder = 'AS';
			   $(this.selectors.toggleCommentsSort).addClass('ascending');
			   this._loadComments();
		   }
	   },
	   /**
	    * _appendComment is used to add the newly added comment.
	    * @param {object} data
	    */
	   _appendComment : function(data) {

		   var widget = this;
		   var scrollto = data.postId;
		   if ($('#' + scrollto).length == 0) {
			   data = {
				   commentActivities : [ {
				      postId : data.postId,
				      photoId : widget.options.currentuserphotoId,
				      profileUniqueIdentifier : widget.options.userProfileUniqueIdentifier,
				      resultMessage : data.comment,
				      canCommentDeleted : true,
				      activityFeedId : data.postId,
				      profileName : widget.options.userProfileName,
				      time : "a moment ago"
				   } ]
			   };
			   data = mustacheDataUtil(data);
			   var html = Mustache.to_html($(widget.selectors.postCommentTemplate).html(), data);
			   var   count=$(widget.selectors.addComment+" "+'.count').text();
		      count++;
		      $(widget.selectors.addComment+" "+'.count').html(count);
		      $(widget.options.externalCommentCount).html(count).attr('count',count);
			   if (widget.options.sortOrder == 'AS') {
				   $(widget.selectors.seeMoreComments).before(html);
			   } else {
				   $(widget.selectors.commentsHolder).prepend(html);
			   }
			  
			   $(this.selectors.deletecomment).off('click');
			   $(this.selectors.editcomment).off('click');
			   $(this.selectors.saveEditComment).off('click');
			   $(this.selectors.cancelEditComment).off('click');
			   widget._on(this.selectors.deletecomment, {
				   click : "_deleteComment"
			   });
			   widget._on(this.selectors.editcomment, {
				   click : "_editComment"
			   });
			   widget._on(this.selectors.saveEditComment, {
				   click : "_saveEditComment"
			   });
			   widget._on(this.selectors.cancelEditComment, {
				   click : "_cancelEditComment"
			   });

		   }
		   $("#nocommentsDiv").addClass('hide');
		   $(window).trigger('resize');//added to reset the backdrop when the model content is changed
	   },
	   /**
	    * _editComment is used handle the edit icon click event. it will show the popover.
	    * @param {event} e
	    */
	   _editComment : function(e) {
		   var editicon=$(e.target);
		   if(!editicon.hasClass('selected-sm')){
				var id = editicon.data("id");

				$('#edited-comment-message-div_'+""+id).removeClass('hide');
				$('#comment-message-div_'+""+id).addClass('hide');
				$('#comment-added-date_'+""+id).addClass('hide');
				$('#comment-edited-date_'+""+id).addClass('hide');
				$('#comment-buttons_'+""+id).removeClass('hide');
				
				editicon.addClass('selected-sm');
				var editField = "#comment-edit-text-area_"+id ;
				var saveButton = "#saveEditComment_"+id;

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
		   }else{
			   editicon.removeClass('selected-sm');
		   }
	   },
	   /**
	    * _saveEditComment  is used handle the save icon click event. it will save the edited comment.
	    * @param {event} e
	    */
	   _saveEditComment : function(e){
			var target = $(e.target);
			var postId = target.data("id");
			var text=$("#comment-edit-text-area_"+postId).val();
			if($.trim(text).length>0){
			   	var request={
			   		accessToken:this.options.accessToken,
			   		langId:this.options.langId,
			   		postId:postId,
			   		updatedMessage:text,
			   		receiverType:this.options.receiverType,
			   		userId:this.options.userId
			   	}
			   	var updatePost={
	      			url:getModelObject('serviceUrl')+'/feed/1.0/updateFeed',
	      			data:JSON.stringify(request),
	      			async:true,
	      			successCallBack:function(data){
	      				if(data['isSuccess']){

	      					$('#edited-comment-message-div_'+""+postId).addClass('hide');
	      					$('#comment-buttons_'+""+postId).addClass('hide');
	      					$('#comment-message-div_'+""+postId).removeClass('hide');
	      					$('#comment-added-date_'+""+postId).removeClass('hide');
	      					$('#comment-edited-date_'+""+postId).removeClass('hide');
	      					
	      					var length=180;
	      					var originaltext=text;
	      					if(text.length>length){
									var visibletext="<span>"+text.substring(0,length)+"</span>";
									var dots='<span class="dots lightblue cursor-hand" onclick="$(this).parent().addClass(\'full\'); $(window).trigger(\'resize\') "> ... </span>';
									var remainingText='<span class="remainingtext">'+text.substring(length)+' </span>';
									var readless='<span class="readLess lightblue cursor-hand" onclick="$(this).parent().removeClass(\'full\'); $(window).trigger(\'resize\')"> read less </span>';
									text= '<span class="collapsedText"> '+visibletext+dots+remainingText+readless+' </span>';
								}
	      					$('#'+postId).find('.messageText').html(text).data('message',originaltext);
	      					$('#comment-edited-date_'+postId).html("Last edited "+dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(data.date),'hh:mm a MMM.dd')).parent().removeClass('hide');
	      					$('.editthecomment.selected-sm').removeClass('selected-sm');
	      				}
	      			}
			   	};
			  doAjax.PutServiceInvocation(updatePost);
	   	}
	   	else{
	   		$('#editcommentRequired').removeClass('hide');
	   	}
	   },
	   /**
	    * _cancelEditComment  is used handle the cancel icon click event in the edit comment popover.
	    * @param {event} e
	    */
	   _cancelEditComment : function(e){
		   var target = $(e.target);
		   var postId = target.data("id");
			
		   $('#edited-comment-message-div_'+""+postId).addClass('hide');
		   $('#comment-buttons_'+""+postId).addClass('hide');
		   $('#comment-message-div_'+""+postId).removeClass('hide');
		   $('#comment-added-date_'+""+postId).removeClass('hide');
		   $('#comment-edited-date_'+""+postId).removeClass('hide');
				
		   $('.editthecomment.selected-sm').removeClass('selected-sm');
	   },
	   /**
	    * _saveComment  is used handle the save icon click event in the edit comment popover.
	    * @param {event} e
	    */
	   _saveComment : function(e) {
		   var current = this;
		   var target = $(e.target);
		   var id =$(current.selectors.commentsHolder).data('parentpostid');
		   var adminGroup = $(current.selectors.commentsHolder).data('parent');;
		   var comment = $.trim($('#post-comment-text-area_').val());
		   var count = $(current.selectors.addComment).find('.count').html();
		   if (comment) {
			   var commentOnPostRequest = {
			      accessToken : current.options.accessToken,
			      langId : current.options.langId,
			      userId : current.options.userId,
			      agentEmail : current.options.emailId,
			      verb : "Commented",
			      receiverType : current.options.receiverType,
			      groupId : adminGroup,
			      postId : id,
			      comment : comment
			   };

			   commentOnPostRequest = JSON.stringify(commentOnPostRequest);
			   var saveComment = {
			      url : getModelObject('serviceUrl') + '/feed/1.0/saveFeed',
			      data : commentOnPostRequest,
			      async : true,
			      parentId:'#comment_error',
			      successCallBack : function(data) {

				      target.removeClass('clicked');
				      $(current.selectors.commenterror).addClass('hide');
				      if (data ['isSuccess']) {
					      $('#nocommentsDiv').addClass('hide');
					      if (current.options.sortOrder == 'AS') {
						      current._loadComments({
						         seeAll : true,
						         postId : data.postId,
						         comment : comment
						      })
					      } else {
						      current._appendComment({
						         postId : data.postId,
						         comment : comment
						      });
					      }
				      }
				      $('#post-comment-div_').addClass('hide');
				      $('#post-buttons_').addClass('hide');
			      }
			   };
			   if (!target.hasClass('clicked')) {
				   target.addClass('clicked');
				   doAjax.PostServiceInvocation(saveComment);
			   }
		   } else {
			   $('#post-comment-error_').removeClass('hide');
		   }
	   },
	   _cancelComment : function(e) {
		   $(this.selectors.addComment).removeClass('selected-sm');
			$('#post-comment-div_').addClass('hide');
			$('#post-buttons_').addClass('hide');
	   },
	   _deleteComment : function(e) {
		   var widget = this;
		   var target = $(e.target);
       	   Confirmation.init({
       		   		yesLabel:"Delete",
       		   		noLabel:"Cancel",
       		   		ele:'#confirmation-popupid',
					onYes:function(){
						   target.addClass('ancher_lock').addClass('selected-sm');
						   var id = target.closest(widget.selectors.commentItemparent).data("id");
						   var deletePostRequest = {
						      accessToken : widget.options.accessToken,
						      langId : widget.options.langId,
						      userId : widget.options.userId,
						      receiverType : widget.options.receiverType,
						      postId : id,
						   };
						   deletePostRequest = JSON.stringify(deletePostRequest);
						   var deletecomment = {
						      url : getModelObject('serviceUrl') + '/feed/1.0/deleteFeed',
						      data : deletePostRequest,
						      async : true,
						      parentId:'#c_'+id,
						      successCallBack : function(data) {
						      	var commentsCount=$(widget.selectors.commentItemparent).length;
							      if (data ['isSuccess']) {
								      $('#c_' + id).fadeOut(300, function() {
									      $('#c_' + id).remove();
								      });
								     var count=$(widget.selectors.addComment+" "+'.count').text();
								      count--;
								      $(widget.selectors.addComment+" "+'.count').html(count);
								      $(widget.options.externalCommentCount).html(count).attr('count',count)
							      }
							      if($(".commentItem").length<5)
							      widget._loadComments({
									   isMore : true,
									   upto:commentsCount
								   });
						      }
						   };
						   doAjax.DeleteServiceInvocation(deletecomment);

					   },
					message:'Are you sure want to delete this post?'
				});
	   },
	   _closeClick : function(e) {
		   $('#connectionpostModelID').trigger({
			   type: 'keydown',
			   which: 27
		   });
	   },
	   _setOption : function(key, value) {
		   _super._setOption(key, value);
	   },
	   /**
	    * _seeMoreComments  is used to load the next page of comments.
	    */
	   _seeMoreComments : function(e) {
		   this._loadComments({
			   isMore : true
		   });
	   },
	   _loadConnectionsForautoComplete:function(){
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
							 currentUserConnections=current.userConnections;
						 }
					 }
			 };
			 if(currentUserConnections.length==0){
				 doAjax.PostServiceInvocation(loadConnectionOptions);
			 }else{
				 current.userConnections= currentUserConnections;
			 }
	   },
	   _removeSharingUserClick:function(e){
			var removeTarget = $(e.target);
			var removeId = removeTarget.data("userid");
			
			this.selectedUsers.splice($.inArray(removeId+"", this.selectedUsers), 1);
      		$(e.target).remove();
      		$('[id="invitedUserID_'+removeId+'"]').remove();
      		 e.stopPropagation();
		},
		/**
	    * _shareCountDetails  show the shared people details.
	    */
		_shareCountDetails:function(){
		   var widget = this;
		   $(widget.selectors.commentsHolder).addClass('hide');
		   $(widget.selectors.likesHolder).addClass('hide');
		   $(widget.selectors.sharesHolder).removeClass('hide');
		   var request = {
		      accessToken : widget.options.accessToken,
		      postId : widget.options.postUid,
		   };
		   var options = {
		      url : widget.options.serviceUrl + widget.options.shareCountDetails,
		      data : JSON.stringify(request),
		      parentId : widget.selectors.sharesHolder,
		      async : true,
		      successCallBack : function(data) {
		    	  
		      	$('#toggleCommentsSort').addClass('hide');
			      var elementdata = HTMLUIElements.readMorePost();
			      jQuery.extend(data, elementdata);
			      data = mustacheDataUtil(data);
			      widget.element.find(widget.selectors.sharesHolder).html(Mustache.to_html(jQuery('#postSharedDetailsTemplate').html(), data));
				  $('#bottomcontentreadmore').removeClass('hide');
			      if(data['manageFeedModelList']){
			    	  $("#shareCountHeadng").removeClass('hide');
			      }else{
			    	  $("#shareCountHeadng").addClass('hide');
			      }
			      if ($(widget.selectors.sharesHolder).find('li').length > 4) {
				      $(widget.selectors.sharesHolder).parent().find('.slide-next,.slide-prev').show();
				      $(widget.selectors.sharesHolder + ' .slide-photos').jCarouselLite({
				         btnNext : ".slide-next",
				         btnPrev : ".slide-prev",
				         start : 0,
				         visible : 4
				      });
				      $(widget.selectors.sharesHolder).find('li').css('height','auto');
			      } else {
				      $(widget.selectors.sharesHolder).parent().find('.slide-next,.slide-prev').hide();
			      }
			      $(window).trigger('resize');

		      },
		      failureCallBack : function(data) {

		      }
		   };
		   doAjax.PostServiceInvocation(options);
	   },
	});
})(jQuery);
