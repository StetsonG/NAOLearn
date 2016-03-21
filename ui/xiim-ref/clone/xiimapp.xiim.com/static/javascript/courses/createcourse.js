/**
 * @author Next Sphere Technologies
 * MyCources widget Create Course
 * 
 * prove the Options like template, which method has to call on success of create course, clicking the cancel.
 */

(function ($, undefined) {

    'use strict';

    var _super = $.Widget.prototype;
    
	$.widget('xiim.createcourse', {
		
		version: '1.0.0',
		
		options: {
			/** ajax params */
			accessToken : $("#accessToken_meta").val(),
			langId : $("#langId_meta").val(),
			userId : $("#loggedInUserId-meta").val(),
			/** selectors */
			submit: '#savecourse',
			cancel:'[id="cancel_course"]',
			
			/*parse a method to call after course creation is successfull, and onCancel is for cancel click binding*/
			onCourseCreationSucces:null,
			onCancel:null,
			
			/** other params */			
			scrollbarheight:"520px",
		},
		/** initiate the widget 
		 * @constructor
		 */
		_create: function () {
			this._injectDom();
			this.addActions();
			this.getCourseTypes();
			this.getCourseLaunguages();
			this.getCourseInistitutions();
			this._registerValidations();
			/** add any extra events or code after plugin intialized 
			 */
			this._trigger('started');
		},
		
		/** add the form 
		 * @private
		 * get template from page or pass html to template option
		 */
		_injectDom: function(){
			this.options.template = $('#createCourseTemplate').html();
			this.element.html(Mustache.to_html(this.options.template,{contextPath:contextPath}));
			var sheight=this.options.scrollbarheight;
			this.element.find('img[src^="/XiiMApp/static/"]').each(function( i ) {
				$(this).attr('src',$(this).attr('src').replace('/XiiMApp',contextPath));
				
			});
			var elementcustomscrollbar = $(this.element).find('.mCustomScrollbar');
			var xiimcustomScrollbarOptions = {elementid:elementcustomscrollbar,isUpdateOnContentResize:true,setHeight:sheight,vertical:'y'};
			xiimcustomScrollbar(xiimcustomScrollbarOptions);
/*			$(this.element).find('.mCustomScrollbar').mCustomScrollbar({
				setHeight:sheight,
				mouseWheelPixels: 50,
	               mouseWheel:true,
	               autoHideScrollbar:false,
	               theme: "rounded-dark"	
			});*/
		},
			 
		/** set option
		 * @override widget 
		 * it will take one option at a time to options
		 */
		_setOption: function (option, value) { 
			 this._super(option, value);
		},
		/** set option
		 * To Reset The Form Fields 
		 */
		resetFormValues: function () { 
			this.element.find('form').trigger('reset');
			this.element.find('[selection]').removeAttr('selection');
			this.element.find('[id="courseFields"]').html('');
			this.element.find('.validationError').addClass('hide');
			this.element.find('[name="coursePriceValue"]').prop('disabled', true);
			this.element.find('#imageContainer').empty().html('<img height="200" src="'+contextPath+'/static/pictures/defaultimages/french.png'+'"/>');
			
		},
		_registerValidations:function(){
			var widget=this.element;
			this.element.find('[name="courseName"]').change(function(){
				var text=$.trim($(this).val());
				if(text.length==0){
					widget.find('.validationError.title.required').removeClass('hide');
				}else if(text.length<3){
					widget.find('.validationError.title.required').addClass('hide');
					widget.find('.validationError.title.length').removeClass('hide');
				}
				$(this).val(text);
			}).focus(function(){
				widget.find('.validationError.title').addClass('hide');
			});
			
			this.element.find('[name="coursePriceValue"]').bind('keyup change paste focus',function(e){
				$(this).val($(this).val().replace(/[^\d]/g, '').replace());
				widget.find('.validationError.price.required').addClass('hide');
			}).focusout(function(){
				if($(this).val().length==0&&widget.find('[name="coursePrice"]:checked').val()=='price'){
					widget.find('.validationError.price.required').removeClass('hide');
				}
			});
			
			this.element.find('[id="courseSummary"]').focusout(function(){
				var text=$.trim($(this).val());
				if(text.length==0){
					widget.find('.validationError.summary.required').removeClass('hide');
				}
				$(this).val(text);
			}).focus(function(){
				widget.find('.validationError.summary.required').addClass('hide');
			});
			
			this.element.find('[name="courseIsAgreed"]').change(function(){
				if(this.checked){
					widget.find('.validationError.agreement').addClass('hide');
				}
			});
			
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
			this._on(this.options.submit,{click:"_submit"});
			this._on(this.element.find(this.options.cancel),{click:"_cancel"});
			this._on(this.element.find(this.options.submit),{click:"_savecourse"});
			this._on(this.element.find('[name="coursePrice"]'),{change:"_price"});
			this._on(this.element.find('#course-imageupload'),{click:"_selectimage"});
			$.awesomeCropper("#imageContainer", {
				width : 250,
				height : 250,
				debug : true,
				image:contextPath+'/static/pictures/defaultimages/french.png',
				imageDefaultWidth:'110',
				imageDefaultHeight:'110'
				
			});
			
			/* validation kind of events*/
			this._on(this.element.find('[name="courseName"]'),{blur:'_namekeydown'});
			
		},
		_namekeydown:function(e){
			
		},
		_selectimage:function(){
			$('#imageContainer-file').trigger('click');
		},
		_validateform:function(){
			
		},
		_savecourse:function(e){
			e.preventDefault();
			var validation=true;
			var widget=this;
			var courseModel={
					courseName:name=this.element.find('[name="courseName"]').val(),
					courseLogo:this.element.find('[id="sample_input"]').attr('src'),
					summary:this.element.find('[id="courseSummary"]').val(),
					coursePrivacyLevelEnum:this.element.find('[name="coursePrivacy"]:checked').val(),
					isInstitute:this.element.find('[name="coursesInstitutionName"][selection]').length>0,
					instituteId:this.element.find('[name="coursesInstitutionName"]').attr('selection'),
					categoryId:this.element.find('[name="courseCategoryName"]').attr('selection'),
					fieldId:this.element.find('[name="courseField"]').attr('selection'),
					type:this.element.find('[name="courseType"]:checked').val(),
					isFree:this.element.find('[name="coursePrice"]:checked').val()=='free',
					price:this.element.find('[name="coursePriceValue"]').val(),
					languageId:this.element.find('[name="courseLaunguage"]').attr('selection'),
					courseIsAgreed:this.element.find('[name="courseIsAgreed"]:checked').length>0
					};
			if(courseModel.courseName.length==0){
				widget.element.find('.validationError.title.required').removeClass('hide');
				validation=false;
			}else if(courseModel.courseName.length<3){
				widget.element.find('.validationError.title.required').addClass('hide');
				widget.element.find('.validationError.title.length').removeClass('hide');
				validation=false;
			}
			if(!courseModel.isFree && courseModel.price <=0){
				widget.element.find('.validationError.price.required').removeClass('hide');
				validation=false;
			}
			
			if(courseModel.categoryId==undefined){
				widget.element.find('.validationError.category.required').removeClass('hide');
				validation=false;
			}
			if(courseModel.languageId==undefined){
				widget.element.find('.validationError.launguage.required').removeClass('hide');
				validation=false;
			}
			if((!courseModel.isFree)&&courseModel.price.length==0){
				widget.element.find('.validationError.price.required').removeClass('hide');
				validation=false;
			}
			if(courseModel.instituteId == undefined){
				widget.element.find('.validationError.institution.required').removeClass('hide');
				validation=false;
			}
			if($.trim(courseModel.summary.length)<1){
				widget.element.find('.validationError.summary.required').removeClass('hide');
				validation=false;
			}
			if(!courseModel.courseIsAgreed){
				widget.element.find('.validationError.agreement').removeClass('hide');
				validation=false;
			}
			var url=getModelObject('serviceUrl')+'/course/1.0/createCourse';
			var accessToken = $("#accessToken").val();
      		var langId = $("#langId").val();
      		var data={
      				courseModel:courseModel,
      				accessToken:accessToken,
      				langId:langId
      				
      		};
      		var options={
      				url:encodeURI(url),
      				data:JSON.stringify(data),
      				parentId:widget.element,
      				successCallBack:function(data){
      					if($.isFunction(widget.options.onCourseCreationSucces)){
      						widget.options.onCourseCreationSucces(data);
      					}
      					doAjax.displaySuccessMessage("Course Created Successfully.")
      				},
      				failureCallBack:function(data){
      					doAjax.displayErrorMessages(data);
      				},
      				async: true
      		}
      		
      		if(validation)
      		doAjax.PostServiceInvocation(options);
		},
		_price:function(){
			this.element.find('.validationError.price.required').addClass('hide');
			if(this.element.find('[name="coursePrice"]:checked').val()=='price'){
				this.element.find('[name="coursePriceValue"]').removeAttr('disabled');
				this.element.find('[name="coursePriceValue"]').val("").focus();
			}				
			else{
				this.element.find('[name="coursePriceValue"]').attr('disabled','disabled');
				this.element.find('[name="coursePriceValue"]').val("");
			}
				
		},
		
		/** some Select menu events */
		_dynamicEvents: function(){
			this._on(this.element.find('[courseTypeId_]'),{click:'_courseType_Id'});
		},
		/** some Select sub menu events */
		_dynamicEvents_2: function(){
			this._on(this.element.find('[course_field]'),{click:'_course_field'});
		},
		/** some Select sub menu events */
		_dynamicEvents_Launguage: function(){
			this._on(this.element.find('[Course_Launguage]'),{click:'_course_launguage'});
		},
		/** some Select menu events */
		_dynamicEvents_Institution: function(){
			this._on(this.element.find('[courseinistitution]'),{click:'_courseinistitution_Id'});
		},

		/** submit the form*/
		_submit: function () {
			
		},
		_courseinistitution_Id:function(e){
			this.element.find('[name="coursesInstitutionName"]:first').val($(e.target).text()).attr("selection",$(e.target).closest('li').attr('courseinistitution'));
			this.element.find('.validationError.institution.required').addClass('hide');
		},
		_courseType_Id:function(e){
			this.element.find('[name="courseCategoryName"]:first').val($(e.target).text()).attr("selection",$(e.target).closest('li').attr('coursetypeid_'));
			this.element.find('[name="courseField"]:first').val("").removeAttr('selection');
			this.element.find('[id="courseFields"]:first').html("");
			this.element.find('.validationError.category.required').addClass('hide');
			this.getCourseFields($(e.target).closest('li').attr('coursetypeid_'));
		},
		_course_field:function(e){
			this.element.find('[name="courseField"]:first').val($(e.target).text()).attr("selection",$(e.target).closest('li').attr('course_field'));
		},
		_course_launguage:function(e){
		this.element.find('[name="courseLaunguage"]:first').val($(e.target).text()).attr("selection",$(e.target).closest('li').attr('Course_Launguage'));
		this.element.find('.validationError.launguage.required').addClass('hide');
		
	},
		
		/** cancel event fired */
		_cancel: function(e){
			if($.isFunction(this.options.onCancel)){
				this.options.onCancel();
			}
			this._destroy();
		},
		
		_init: function () {
			
		},
		/** destroy widget and its instances*/
		_destroy: function () {
			this.element.empty();
			return this._super();
		},
		getCourseTypes : function() {
			var widget=this;
			var xhroptions = {
					url : contextPath + '/course/getCourseCategories',
					successCallBack : function(data){
						var courseCategoryList = data['courseCategoryList'];
						var courseTypeselect = '';
						if (courseCategoryList != undefined) {
							for (var i = 0; i < courseCategoryList.length; i++) {
								var id = courseCategoryList[i].split("#$#")[0];
								var textValue = courseCategoryList[i].split("#$#")[1];
								courseTypeselect = courseTypeselect+ '<li class="pad-left-15-imp white-imp-hover" id="courseTypeselectId_' + i+ '" courseTypeId_="' + id+ '"><a href="javascript:void(0);" class="white-imp">' + textValue+ '</a></li>';
							}
						}
						widget.element.find('[id="courseCategorys"]').html(courseTypeselect);
						var xiimcustomScrollbarOptions = {elementid:widget.element.find('[id="courseCategorys"]'),isUpdateOnContentResize:true,setHeight:"260px",vertical:'y'};
						xiimcustomScrollbar(xiimcustomScrollbarOptions);
						widget._dynamicEvents();
					},
					failureCallBack :function(data) {
						
					},
					errorCallBack :function(data) {
					},
					async:true,
					data : {}
				};
				doAjax.ControllerInvocation(xhroptions);
			},
			getCourseFields : function(typeId) {
				this.element.find('[id="courseFields"]').addClass('hide')
				var widget=this;
				var xhroptions = {
						url : contextPath + '/course/getCourseSubCategory?courseCategoryID='+typeId,
						parentId:'#courseField',
						successCallBack : function(data){
							var courseSubCategoryList = data['courseSubCategoryList'];
							var courseFieldselect = '';
							if (courseSubCategoryList != undefined) {
								for (var i = 0; i < courseSubCategoryList.length; i++) {
									var id = courseSubCategoryList[i].split("#$#")[0];
									var textValue = courseSubCategoryList[i].split("#$#")[1];
									courseFieldselect += '<li id="courseFieldselectId_' + i+ '" Course_Field="' + id+ '"><a href="javascript:void(0);">' + textValue+ '</a></li>';
								}
								widget.element.find('[id="courseFields"]').html(courseFieldselect).removeClass('hide');
							}
							
							widget._dynamicEvents_2();
						},
						failureCallBack :function(data) {
						},
						errorCallBack :function(data) {
						},
						async:true,
						data : {}
					};
					doAjax.ControllerInvocation(xhroptions);
				},getCourseLaunguages : function() {
					this.element.find('[name="courseLaunguage"]:first').val("English").attr("selection","1");
					this.element.find('[id="courseLaunguages"]').addClass("hide");
					/* //for now no Course Launguages Is Supported
					var widget=this;
					var xhroptions = {
							url : contextPath + '/course/getAllLanguages',
							successCallBack : function(data){
								var languageList = data['languageList'];
								var courseLaunguageselect = '';
								languageList=(languageList.length==undefined)?[languageList]:languageList;
								if (languageList != undefined) {
									for (var i = 0; i < languageList.length; i++) {
										var id = languageList[i].split("#$#")[0];
										var textValue = languageList[i].split("#$#")[1];
										courseLaunguageselect += '<li id="courseLaunguageSelectId_' + i+ '" Course_Launguage="' + id+ '"><a href="javascript:void(0);">' + textValue+ '</a></li>';
									}
								}
								widget.element.find('[id="courseLaunguages"]').html(courseLaunguageselect);
								widget._dynamicEvents_Launguage();
							},
							failureCallBack :function(data) {
							},
							errorCallBack :function(data) {
							},
							async:true,
							data : {}
						};
						doAjax.ControllerInvocation(xhroptions);*/
					},
					getCourseInistitutions : function() {
						var widget=this;
						widget.element.find('[id="courseInstitutionlist"]').addClass('hide');
						var xhroptions = {
								url : contextPath + '/course/getInstituions',
								successCallBack : function(data){
									var institutionList = data['institutionList'];
									var courseTypeselect = '';
									if (institutionList != undefined) {
										institutionList==institutionList.length==undefined?[institutionList]:institutionList;
										for (var i = 0; i < institutionList.length; i++) {
											var id = institutionList[i].split("#$#")[0];
											var textValue = institutionList[i].split("#$#")[1];
											courseTypeselect = courseTypeselect+ '<li id="courseInistitutionId_' + i+ '" courseInistitution="' + id+ '"><a href="javascript:void(0);">' + textValue+ '</a></li>';
										}
										widget.element.find('[id="courseInstitutionlist"]').html(courseTypeselect).removeClass('hide');
										widget._dynamicEvents_Institution();
									}
									
									
								},
								failureCallBack :function(data) {
									doAjax.displayErrorMessages(data);
								},
								errorCallBack :function(data) {
								},
								async:true,
								data : {}
							};
							doAjax.ControllerInvocation(xhroptions);
						}
	});
})(jQuery);
