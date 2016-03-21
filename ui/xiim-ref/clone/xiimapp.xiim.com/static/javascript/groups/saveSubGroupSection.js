/**
 * @author Next Sphere Technologies
 * Save Group Widget
 * 
 * This javascript file will save the Group and Sub Group based on association.
 * 
 */

var scriptElement = document.getElementsByTagName("script");
var baseElement = scriptElement[scriptElement.length - 1].parentNode;

$(document).ready(function() {
	$.extend($.validator.messages, {
		xiimrequired : $.format("{0} is required"),
	});
});
var saveSubGroupSection = function() {
	var optionsvalue = '';
	return {
		settings : {

		},
		defaults : {
			ele : baseElement,
			isSubGroup : false
		},
		init : function(options) {
			optionsvalue = options.isdashboard;
			this.getGroupTypes();
			this.settings = $.extend(this.defaults, options);
			var element = this.settings.ele;
			this.staticUI(element);
			

		},
		serviceInvocation : function(options) {
		},
		prepareServiceRequest : function() {
		},
		staticUI : function(element) {
			var html = '';
			var htmlData;
			htmlData = {};//UIElements.relatedgroups();
			htmlData.isSubGroup = RelatedGroups.settings.isSubGroup;
			htmlData.parentGroupId = RelatedGroups.settings.parentGroupId;
			html += newGroupHTML.subGroupSection();
			var saveGroupSectionHtml = Mustache.to_html(html, htmlData);
			$(element).html(saveGroupSectionHtml);
			if(optionsvalue == true){
/*			 $("#newGroupCreateDivID").mCustomScrollbar({
     		    setHeight:"480px",
     		    advanced:{
     		        updateOnContentResize: true
     		    }
     		});*/
			}
			$.awesomeCropper("#imageContainer", {
				width : 250,
				height : 250,
				debug : true,
				image:contextPath+'/static/pictures/defaultimages/group-def-logo.png',
				imageDefaultWidth:'110',
				imageDefaultHeight:'110'
				
			});
			saveSubGroupSection.getGroupTypes();
			$("#processingSymboCreateGroupIcon").hide();
			saveSubGroupSection.bindEvents();
		},
		successCallBack : function(data) {
			$("#processingSymbolnewGroup").hide();
			var results = data['result'];
			var status = results['status'];
			if (status == 'true') {
				if (RelatedGroups.settings.isSubGroup != "" && RelatedGroups.settings.isSubGroup != null && RelatedGroups.settings.isSubGroup != undefined) {
					doAjax.displaySuccessMessage('Group saved successfully !!');
					$('html, body').animate({
						scrollTop : $("#mainContentContainer").offset().top - 200}, 1000);
					var options = {
						ele : "#mainContentContainer",
						associationType : "CHILD",
						associationHeader : "Child Groups",
						isHomeGroups : true
					};
					RelatedGroups.init(options);
					
					
					var subgroupoptions={
					    	associationType:'CHILD',
					    	serviceURL:"/group/1.0/getAssociationGroups",
					    	pageSize:"3",
						    pageNo:"1",
					    	isHomeGroups:false
					};
					subgroups.init(subgroupoptions);
					
					
				} else {
					
 	 				$('#myGroupsMenuToggle').attr('data-toggle','dropdown');
 	 				var myGroupsFlag={
			  				isMyGroupsTwobyTwo:true,
			  				baseElementMyGroups:"#baseElementMyGroups"
			  		};
 	 				
					  mygroups.init(myGroupsFlag); 	
 	 	 			
 	 				$("#hideMenuForMyGroups").removeClass('hide');
 	 				$("#removeHidemyGroupsOptionsID").addClass('hide');
 					//Below requires when view not in (2x2) view.
 					$("#minimize_maximize_myGroups_22").trigger('click');
 	 			  
					$("#new-group-data").html('');
				}
			}
		},
		validateSuccessCallBack : function(data) {
			var results = data['result'];
			var status = results['status'];
			var isGroupExists = data['isGroupExists'];
			if (status == 'true') {
				if (isGroupExists == 'true') {
					$(".groupNameClass").after('<span class="error-keyup-1 validationError red font-12 pad-left-80">Name already exists</span>');
					$("#saveGroup").attr('disabled', 'disabled');
				} else {
					$(".error-keyup-1").remove();
					$("#saveGroup").removeAttr('disabled');
				}
				//to display error messages
			} else {
				//genrateErrorMessages(data,null,"saveGroupDisplayErrors");
			}

		},
		getgroupcategorySuccessCallBack : function(data) {
			var groupCategoryList = data['groupCategoryList'];
			var groupCategorySelect = '';
			if (groupCategoryList != undefined) {
				for (var i = 0; i < groupCategoryList.length; i++) {
					var id = groupCategoryList[i].split("#$#")[0];
					var textValue = groupCategoryList[i].split("#$#")[1];
					groupCategorySelect = groupCategorySelect+ '<li id="categoryTypeSelectId_' + i+ '" categoryTypeId="' + id+ '"><a href="javascript:void(0);">' + textValue+ '</a></li>';
				}
			}
			$("#groupCategorys").html(groupCategorySelect);
			$("#process_display_getCategories").addClass('hide');
			saveSubGroupSection.dynamicEvents();
		},
		getGroupTypeEvents:function(){
			$("[id^=groupTypeSelectedId_]").click(function(event) {
				$("#groupTypeName").val($(this).text());
				$("#groupTypeId").val($(this).attr('grouptypeid'));
				$("#groupCategoryName").val('')
				$("#groupTypeError").removeClass("show").addClass("hide");
				saveSubGroupSection.getGroupCategory($(this).attr('grouptypeid'));
				//saveSubGroupSection.dynamicEvents();
		    });
		},
		getgrouptypeSuccessCallBack : function(data) {
			var groupTypesList = data['groupTypesList'];
			var groupTypeSelect = '';
			if (groupTypesList != undefined) {

				for (var i = 0; i < groupTypesList.length; i++) {
					var id = groupTypesList[i].split("#$#")[0];
					var textValue = groupTypesList[i].split("#$#")[1];
					groupTypeSelect = groupTypeSelect+ '<li id="groupTypeSelectedId_' + i+ '" groupTypeId="' + id+ '"><a href="javascript:void(0);">' + textValue+ '</a></li>';
				}
			}
			$("#groupTypes").html(groupTypeSelect);
			
			saveSubGroupSection.getGroupTypeEvents();
			/*$("[id^=groupTypeSelectedId_]").click(function(event) {
				$("#groupTypeName").val($(this).text());
				$("#groupTypeId").val($(this).attr('grouptypeid'));
				$("#groupCategoryName").val('')
				saveSubGroupSection.getGroupCategory($(this).attr('grouptypeid'));
				//saveSubGroupSection.dynamicEvents();
		    });*/
		},
		errorCallBack : function(request, status, error) {

		},
		failureCallBack : function(data) {
			$("#processingSymbolnewGroup").hide();
			doAjax.displayErrorMessages(data);
		},
		dynamicUI : function(element, data) {

		},

		bindEvents : function() {//bind operations performed on UI
			
			$("#isGrouptypeselectedid").click(function(e){
				if($("#groupTypeName").val() == ""){
					return false;
				}
			});
			

			$("#group-imageupload").click(function(e) {
				$("#imageContainer-file").trigger('click');
			});
			/**
			 * groupTypeId Change event
			 * 
			 * on select of Group Type:: group Category has to be loaded as a drop down list
			 * 
			 */
			/*$("[id^=groupTypeSelectedId_]").click(function(event) {
					$("#groupTypeName").val($(this).text());
					$("#groupTypeId").val($(this).attr('grouptypeid'));
					$("#groupCategoryName").val('')
					saveSubGroupSection.getGroupCategory($(this).attr('grouptypeid'));
					//saveSubGroupSection.dynamicEvents();
			});*/

			/*$("#groupTypeId").change(function(event){
				var groupTypeId = $(this).val();
				if(groupTypeId != '' && groupTypeId!= undefined ){
					$("#process_display_getCategories").removeClass('hide');
					$("#groupTypeError").removeClass("show");
					saveSubGroupSection.getGroupCategory(groupTypeId);
				}
			});*/

			$("#groupTypeId").focusout(function(event) {
				var groupTypeId = $(this).val();
				if (groupTypeId != '' && groupTypeId != undefined) {
					$("#groupTypeError").removeClass("show").addClass("hide");
				}
			});

			$("[id^=cancel_group]").off("click").bind("click",function(e) {
					if (RelatedGroups.settings.isSubGroup != "" && RelatedGroups.settings.isSubGroup != null && RelatedGroups.settings.isSubGroup != undefined) {
							var options = {
								ele : "#mainContentContainer",
								associationType : "CHILD",
								associationHeader : "Child Groups",
								isHomeGroups : true
							};
							RelatedGroups.init(options);
					}else if(RelatedGroups.settings.isSubGroup== undefined&&$('#minimize_maximize_myGroups_22').length>0){
						$('#myGroupsHyperLinkID').trigger('click');
						
					}else{
							var myGroupsFlag = {
								isMyGroups : true
							};
							
							mygroups.init(myGroupsFlag);
							$("#new-group-data").html('');
						}
			});

			/**
			 * check GroupName Validation  is used to check if the given group name is valid or not.
			 * @param groupName
			 */
			$(".groupNameClass").keydown(function(event) {
				var groupName = $(this).val();
				var previousChar = groupName.substring(groupName.length - 1);
				var previousCharlength = previousChar.trim().length;
				if (previousCharlength == 0 && event.keyCode == 32) {
					$(".groupNameClass").val(groupName);
					event.preventDefault();
					return false;
				} else {
					return true;
				}
			});
			
			//written below function to fix bug XIP-3565
			$('#groupName').keyup(function(){
				var groupName = $(this).val();
				if (groupName.trim().toLowerCase().indexOf('xiim') == -1) {
					$(".error-keyup-1").remove();
				}
				
			});

			$(".groupNameClass").focusout(function(event) {
					if (isEditGroup != 'true') {
						var groupName = $(this).val();
						groupName = groupName.trim();
						var languageId = $("#languageId").val();
						var accessToken = $("#accessToken").val();
						$(".error-keyup-1").remove();
						var isValidate = true;
						if(isValidate && groupName.length < 3 && groupName.length <= 100 && groupName.length != 0) {
							isValidate = false;
							$(".groupNameClass").after('<span class="error-keyup-1 validationError red font-12 pad-left-80">Invalid Group Name</span>');
						}
						var RegExp = "[#%*{}\\\\:<>?/+.]+";
						if (isValidate && groupName.match(RegExp)) {
								$(this).after('<span class="error-keyup-1 validationError red font-12 pad-left-80">Invalid Group Name</span>');
								isValidate = false;
						}
						if (isValidate && groupName.trim().toLowerCase().indexOf('xiim') != -1) {
								$(this).after('<span class="error-keyup-1 validationError red font-12 pad-left-0-fx pad-left-80">Invalid Group Name</span>');
								isValidate = false;
						}
						var alphabetReg = "[a-zA-Z]";
						if (isValidate && groupName.length > 0 && !groupName.charAt(0).match(alphabetReg)) {
								$(this).after('<span class="error-keyup-1 validationError red font-12 pad-left-80">Invalid Group Name</span>')
								isValidate = false;
						}
						if (!isValidate) {
							$("#saveGroup").attr('disabled','disabled');
							//return false;
						}else{
							$("#saveGroup").removeAttr('disabled');
							//return true;
						}
						if(groupName == ''){
							isValidate = false;
						}
						if (isValidate) {
							var headers = {
            						accessToken:accessToken,
            						langId:languageId
            				};
							var options = {
								url:getModelObject('serviceUrl')+'/group/2.0/isGroupExists?groupName='+groupName,
								headers:headers,
								parentId:saveSubGroupSection.settings.ele,
								successCallBack : saveSubGroupSection.validateSuccessCallBack,
								failureCallBack : saveSubGroupSection.validateFailureCallBack,
								async:true
							};
							doAjax.GetServiceInvocation(options);
						}

					}
				});
			var groupType = '';
			$("#saveGroup").click(function(event) {
					var isAgreed = $("#isAgreed").attr("checked");
					groupType = $("#groupTypeId").val();
					var isSuccess = true;
					$("#groupForm").validate({errorPlacement : function(error, element) {
								error.appendTo(element.parent("div").find($('.validationError')));
							}
					});
					var isValid = $("#groupForm").valid();
					var groupSummary = $("#groupSummary").val().trim();
					var groupDescription = $("#groupDescription").val().trim();
					if (!isValid && groupType == '') {
						$("#groupTypeError").removeClass("hide").addClass("show");
						isSuccess = false;
					} else if (groupType == '') {
						$("#groupTypeError").removeClass("hide").addClass("show");
						isSuccess = false;
					} else {
						$("#groupTypeError").removeClass("show").addClass("hide");
					}
					if (!isValid && isAgreed == undefined) {
						$("#groupUserAckError").removeClass("hide").addClass("show");
						isSuccess = false;
					} else if (isAgreed == undefined) {
						$("#groupUserAckError").removeClass("hide").addClass("show");
						isSuccess = false;
					} else {
						$("#groupUserAckError").removeClass("show").addClass("hide");
					}
					if (!isValid || groupSummary.length == 0) {
						isSuccess = false;
					}
					if (!isValid || groupDescription.length == 0) {
						isSuccess = false;
					}
					if(isSuccess) {
						$("#processingSymbolnewGroup").show();
						var saveGroupURI = "/group/1.0/saveGroup";
						var saveGroup = getModelObject('serviceUrl')+ saveGroupURI;
						var accessToken = $("#accessToken_meta").val();
						var langId = $("#langId_meta").val();
						var groupId = null;
						if ($("#id").val() != '0' && $("#id").val() != "") {
								groupId = $("#id").val();
						}
						var groupUniqueIdentifier = null;
						if ($("#groupUniqueIdentifier").val() != "" && $("#groupUniqueIdentifier").val() != "") {
								groupUniqueIdentifier = $("#groupUniqueIdentifier").val();
						}
						var parentGroupId = null;
						if (RelatedGroups.settings.parentGroupId != '0' && RelatedGroups.settings.parentGroupId != "") {
							parentGroupId = RelatedGroups.settings.parentGroupId;
						}
						var isSubGroup = RelatedGroups.settings.isSubGroup;
						if (RelatedGroups.settings.isSubGroup != "" && RelatedGroups.settings.isSubGroup != null) {
							isSubGroup = RelatedGroups.settings.isSubGroup;
						}
						if (isSubGroup == undefined || isSubGroup == null || isSubGroup == "") {
								isSubGroup = false;
						}
						var groupName = $("#groupName").val();
						var groupTypeId = $("#groupTypeId").val();
						var groupCategoryId = $("#groupCategoryId").val()/*$("#groupCategoryId").val()*/;
						var groupChoice = $(".groupChoice:checked").val();
						var groupSummary = $("#groupSummary").val();
						var groupWebsite = $("#groupWebsite").val();
						var agreement = $("#agreement").val();
						var userId = $("#userId").val();
						var sample_input = $("#sample_input").attr('src');
						var saveGroupRequest = {
										"accessToken" : accessToken,
										"langId" : langId,
										"groupName" : groupName,
										"groupId" : groupId,
										"groupLogo" : sample_input,
										"groupTypeId" : groupTypeId,
										"groupCategoryId" : groupCategoryId,
										"groupChoice" : groupChoice,
										"summary" : groupSummary,
										"description" : groupDescription,
										"website" : groupWebsite,
										"agreement" : agreement,
										"isSubGroup" : isSubGroup,
										"parentGroupId" : parentGroupId,
										"userId" : userId,
										"groupuniqueIdentifier" : groupUniqueIdentifier
									};
									saveGroupRequest = JSON.stringify(saveGroupRequest);
									var options = {
										url : saveGroup,
										data : saveGroupRequest,
										parentId:saveSubGroupSection.settings.ele,
										successCallBack : saveSubGroupSection.successCallBack,
										failureCallBack : saveSubGroupSection.failureCallBack,
										async:true
									};
									doAjax.PostServiceInvocation(options);
								} else {
									$("#processingSymbolnewGroup").hide();
								}
								return isSuccess;
					});
			/**
			 * on click of terms and conditions :: isAgreed  
			 * 
			 */
			$("#isAgreed").click(function(event) {
				$("#groupUserAckError").removeClass("show");
				if ($(this).attr("checked") == undefined) {
					$(this).attr("checked", "checked");
					$("#agreement").val('y');
				} else {
					$(this).removeAttr("checked");
					$("#agreement").val('n');
				}
			});
			$("#isAgreed").focusout(function(event) {
				if ($(this).attr("checked") == 'checked') {
					$("#groupUserAckError").addClass("hide");
				}
			});
			var options1 = {
				'maxCharacterSize' : 1500,
				'originalStyle' : 'originalTextareaInfo',
				'warningStyle' : 'warningTextareaInfo',
				'warningNumber' : 40
			};

			var options2 = {
				'maxCharacterSize' : 500,
				'originalStyle' : 'originalTextareaInfo',
				'warningStyle' : 'warningTextareaInfo',
				'warningNumber' : 40
			};

			var isEditGroup = $("#isGroupInformation").val();
			if (isEditGroup == 'true') {
				$(".groupTypeselect").attr("readonly", "true");
				$(".groupCatClass").attr("readonly", "true");
			}

			/**
			 * document on load of edit group page :prepopulate group category based on group type id
			 * 
			 */
			var groupTypeId = $("#groupTypeId").val();
			if (groupTypeId != '' && groupTypeId != undefined) {
				saveSubGroupSection.getGroupCategory(groupTypeId);
				if (isEditGroup == 'true') {
					var editGroupCategoryId = $("#groupCategoryId").val();
					$("#groupCategoryId").val(editGroupCategoryId);
					$(".groupCatClass").attr("readonly", "true");
				}
			}

			var hiddenGroupChoice = $("#hiddenGroupChoice").val();
			if (hiddenGroupChoice == '') {
				$("#groupChoice1").attr("checked", true);
			}

			/**
			 * document on load:: if user agreed 
			 * 
			 */
			var agreement = $("#agreement").val();
			if (agreement != '' && agreement != undefined) {
				if (agreement == 'y') {
					$("#isAgreed").attr("checked", "checked");
				} else {
					$("#isAgreed").removeAttr("checked");
				}
			}

		},
		dynamicEvents : function() {
			$("[id^=categoryTypeSelectId_]").off("click").bind(
					"click",
					function(e) {
						$("#groupCategoryName").val($(this).text());
						$("#groupCategoryId").val(
								$(this).attr('categoryTypeId'));
					});
		},
		getGroupCategory : function(groupTypeId) {
			var options = {
				url : contextPath + '/group/getgroupcategorybytypeid',
				data : 'groupTypeId=' + groupTypeId,
				successCallBack : saveSubGroupSection.getgroupcategorySuccessCallBack,
				failureCallBack : saveSubGroupSection.getgroupcategoryFailureCallBack,
				async:false
			};

			doAjax.ControllerInvocation(options);
		},
		getGroupTypes : function() {
			var options = {
				url : contextPath + '/group/getgrouptypes',
				data : {},
				successCallBack : saveSubGroupSection.getgrouptypeSuccessCallBack,
				failureCallBack : saveSubGroupSection.getgrouptypeFailureCallBack,
				async:false
			};
			doAjax.ControllerInvocation(options);
		}
	};

}.call(this);