/**
 * 
 */


var HTMLUIElements = function(){
	return{
		smartwallwrapper:function(){
			var jsonUIElementData={
					ByName:'By Name',
					ByPostTime: 'By Post Time',
					ByUpdateTime: 'By Update Time',
					ByLikes:'By Likes',
					ByComments:'By Comments',
					ByCategories:'By Categories',
					ByShares:'By Shares',
					ShowCase:'Showcase',
					All:'All',
					Updated:'Updated',
					MostLiked:'Most Liked',
					MostCommented:'Most Commented',
					MostShared:'Most Shared',
					Me:'Me',
					AllTime:'All Time',
					PastWeek:'Past Week',
					PastMonth:'Past Month',
					PastYear:'Past Year',
					New:'New'
				};
			return jsonUIElementData;
			
		},
		newPost:function(){
			var newPostElements ={
					NewPost: 'New Post'
			};
			return newPostElements;
		},
		newComment:function(){
			var newPostElements ={
					newcomment: 'New Comment'
			};
			return newPostElements;
		},
		sharePost:function(){
			var sharePostElements ={
					sharePost: 'Share with Connections'
			};
			return sharePostElements;
		},
		readMorePost:function(){
			return{
				connectionPost:'Connection Post',
				seeMore:'See More...',
				peopleliked:'People who like this',
				iwanttosay:'I want to say... ',
				commentrequired:'Comment is required.',
				contextPath:contextPath,/* Context Path For some static images in the Template*/
				truncateTwenty:function() {/* String Truncate Method as template data can be used as a tag in template */
									        return function(text, render) {
									        	var texF=render(text);
									        	if(texF.length>20)
									            return texF.substr(0,19) + '...';
									        	else
									        		return texF;
									          };
									        },
				removeDollar:function() {/* some tokens having  Dollar symbol it may crash the Jquery Selector to overcome we can replace for Only UI Purpose */
									        return function(text, render) {
									        	var texF=render(text);
									        	return texF.replace("$","");
									          };
									        },
									        
			};
		},
		smartwall2x1:function(){
			var smartwall2x1Static={
					newAndAnnouncements:"News and Announcements",
					mostActiveTopics:"Most Active Posts",
					seeAll:"See All"
			};
			return smartwall2x1Static;
		},
		groupsmartwall:function(){
			var groupsmartwall={
					smartWall:"Smart Wall",
					searchPosts:"Search posts",
					mostActivePosts:"Most Active Posts",
					relatedPosts:"Related Posts",
					newsAndAnnouncements:"News and Announcements"
			};
			return groupsmartwall;
		},
		changepassword:function(){
			
			var jsonUIElementData={
					firstName:$("#firstName").val(),
					lastName:$("#lastName").val(),
					photoId:$("#photoId").val(),
					accountType:$("#accountType").val(),
					primaryemailid:$("#primaryemailid").val(),
					secondaryemailid:$("#secondaryemailid").val(),
					contextPath:contextPath,/* Context Path For some static images in the Template*/
				};
			return jsonUIElementData;
		},
		contexPathStatic:function(){
			
			var jsonUIElementData={
					contextPath:contextPath,/* Context Path For some static images in the Template*/
				};
			return jsonUIElementData;
		},
		changeemailuielements:function(){
			
			var jsonUIElementData={
					primaryEmail:$("#primaryemailid").val(),
					secondaryEmail:$("#secondaryemailid").val(),
					contextPath:contextPath,/* Context Path For some static images in the Template*/
				};
			return jsonUIElementData;
		},
	};
	
}.call(this);