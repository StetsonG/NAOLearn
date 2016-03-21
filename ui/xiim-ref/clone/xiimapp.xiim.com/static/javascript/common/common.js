**
 * @author Next Sphere Technologies
 * Common javascript is used as util class for all over the javascript files.
 * 
 * This file have very generic functions like 
 * date conversations
 * Ajax functions etc..
 * 
 * 
 */

var ajaxInstance = [];
var doAjax = function(){
       return {
              PostServiceInvocation:function(options){
                  options.type = 'POST';
                  this.ajaxInvocation(options);
              },
              GetServiceInvocation:function(options){
                options.type = 'GET';
                  this.ajaxInvocation(options);
              },
              GetServiceHeaderInvocation:function(options){
                  options.type = 'GET';
                    this.ajaxInvocationWithHeader(options);
                },
              PutServiceInvocation:function(options){
                  options.type = 'PUT';
                  this.ajaxInvocation(options);
              },
              DeleteServiceInvocation:function(options){
                  options.type = 'DELETE';
                  this.ajaxInvocation(options);
              },
              ControllerInvocation:function(options){
                options.type = 'GET';
                options.isFromController = true;
                this.ajaxInvocation(options);
              },
              ControllerPostInvocation:function(options){
                  options.type = 'POST';
                  options.isFromController = true;
                  this.ajaxInvocation(options);
                },
                randomString: function (){
                	var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for( var i=0; i < 5; i++ )
                        text += possible.charAt(Math.floor(Math.random() * possible.length));

                    return text;
                },
              ajaxInvocation:function(options){
                     var url;
                     var data;
                     var async;
                     var headers;
                     var parentId;
                     if(options.url){
                           url = options.url;
                     }else{
                         return;
                     }
                     if(options.data){
                           data = options.data;
                     }else{
                    	 if(options.headers){
                        	 headers = options.headers;
                         }else{
                        	 return;
                         }
                     }
                     if(options.async != undefined){
                           async = options.async;
                     }else{
                    	 return;
                     }
                     if(options.headers){
                    	 headers = options.headers;
                     }
                     if(options.parentId){
                    	 parentId = options.parentId;
                     }
                     
                     if(!options.instanceName){
                    	 options.instanceName = this.randomString();                    	 
                    	 
                     }                     
                     if(ajaxInstance[options.instanceName] && ajaxInstance[options.instanceName].readyState != 4){
                    	 ajaxInstance[options.instanceName].abort();
                     }
                     ajaxInstance[options.instanceName] = $.ajax({
                           url : url,
                           data : data,
                           headers:headers,
                           type : options.type,
                           dataType : 'json',
                           contentType: "application/json",
                           accept: "application/json",
                           crossDomain:true,
                           async:async,
                           error : function(jqXHR, textStatus, errorThrown) {
                        	   if(parentId != "" && parentId != undefined){
                        		   var parent = $(parentId).attr('id');
	                        	   $("#"+parent).removeClass('overlay-bg');
	       						   $("#"+parent+"processing_symbol").addClass('hide');
	       						   $("#"+parent+"processing_symbol").remove();
                        	   }
                                  // TODO: Redirect to error page.
                                  if($.isFunction(options.errorCallBack)){
                                         options.errorCallBack(jqXHR,textStatus,errorThrown);
                                  }else{
                                         //need to provide default implementation
                                  }
                           },
                           beforeSend : function(jqXHR,settings){
                        	   if(parentId != "" && parentId != undefined){
                        		   var parent = $(parentId).attr('id');
                        		   $("#"+parent).addClass('overlay-bg');
                        		   var subsequentDiv = $('<div class="popup-processing hide" id="'+parent+'processing_symbol"><img src="'+contextPath+'/static/pictures/animated-processing.gif"/></div>');
                        		   subsequentDiv.insertAfter("#"+parent);
           						   $("#"+parent+"processing_symbol").removeClass('hide');
                        	   }
                                   if($.isFunction(options.beforeSendCallBack)){
                                          options.beforeSendCallBack(jqXHR,settings);
                                   }else{
                                          //need to provide default implementation
                                   }
                           },
                           complete : function(jqXHR,textStatus){
                        	   if(parentId != "" && parentId != undefined){
                        		   var parent = $(parentId).attr('id');
	                        	   $("#"+parent).removeClass('overlay-bg');
	       						   $("#"+parent+"processing_symbol").addClass('hide');
	       						   $("#"+parent+"processing_symbol").remove();
                        	   }
                        	   if($.isFunction(options.completeCallBack)){
                                   options.completeCallBack(jqXHR,textStatus);
	                            }else{
	                                   //need to provide default implementation
	                            }
                           },
                           success : function(data) {
                        	   doAjax.successFunction(data,options);
                           },
                           failure: function(data){
                        	   if(parentId != "" && parentId != undefined){
                        		   var parent = $(parentId).attr('id');
	                        	   $("#"+parent).removeClass('overlay-bg');
	       						   $("#"+parent+"processing_symbol").addClass('hide');
	       						   $("#"+parent+"processing_symbol").remove();
                        	   }
                                  if($.isFunction(options.failureCallBack)){
                                         options.failureCallBack(data);
                                  }else{
                                         //need to provide default implementation
                                  }
                           }
                     });
              },
              ajaxInvocationWithHeader:function(options){
                  var url;
                  var async;
                  var headers1;
                  var parentId;
                  if(options.url){
                        url = options.url;
                  }else{
                      return;
                  }
             	 if(options.headers){
             		headers1 = options.headers;
                  }else{
                 	 return;
                  }
	                 if(options.async != undefined){
	                     async = options.async;
	               }else{
	              	 return;
	               }
                  if(options.contentType){
                	  contentType = options.contentType;
                  }else{
                	  contentType = "application/json";
                  }
                  if(options.parentId){
                 	 parentId = options.parentId;
                  }
                  $.ajax({
                        url : url,
                        type : options.type,
                        headers:headers1,
                        dataType : 'json',
                        contentType: contentType,
                        accept: "application/json",
                        crossDomain:true,
                        async:async,
                        error : function(jqXHR, textStatus, errorThrown) {
                        	if(parentId != "" && parentId != undefined){
                        		 var parent = $(parentId).attr('id');
	                        	   $("#"+parent).removeClass('overlay-bg');
	       						   $("#"+parent+"processing_symbol").addClass('hide');
	       						   $("#"+parent+"processing_symbol").remove();
                     	   }
                               // TODO: Redirect to error page.
                               if($.isFunction(options.errorCallBack)){
                                      options.errorCallBack(jqXHR,textStatus,errorThrown);
                               }else{
                                      //need to provide default implementation
                               }
                        },
                        beforeSend : function(jqXHR,settings){
                        	 if(parentId != "" && parentId != undefined){
                        		 var parent = $(parentId).attr('id');
                      		   $("#"+parent).addClass('overlay-bg');
                      		   var subsequentDiv = $('<div class="popup-processing hide" id="'+parent+'processing_symbol"><img src="'+contextPath+'/static/pictures/animated-processing.gif"/></div>');
                      		   subsequentDiv.insertAfter("#"+parent);
                      		   $("#"+parent+"processing_symbol").removeClass('hide');
                      	  		}
                                if($.isFunction(options.beforeSendCallBack)){
                                       options.beforeSendCallBack(jqXHR,settings);
                                }else{
                                       //need to provide default implementation
                                }
                        },
                       complete : function(jqXHR,textStatus){
                        	if(parentId != "" && parentId != undefined){
                        		 var parent = $(parentId).attr('id');
	                        	   $("#"+parent).removeClass('overlay-bg');
	       						   $("#"+parent+"processing_symbol").addClass('hide');
	       						   $("#"+parent+"processing_symbol").remove();
                     	   }
                     	   if($.isFunction(options.completeCallBack)){
                                options.completeCallBack(jqXHR,textStatus);
	                            }else{
	                                   //need to provide default implementation
	                            }
                        },
                        success : function(data) {
                        	doAjax.successFunction(data,options);
                        },
                        failure: function(data){
                        	if(parentId != "" && parentId != undefined){
                       		 var parent = $(parentId).attr('id');
	                        	   $("#"+parent).removeClass('overlay-bg');
	       						   $("#"+parent+"processing_symbol").addClass('hide');
	       						   $("#"+parent+"processing_symbol").remove();
                    	    }
                        	
                               if($.isFunction(options.failureCallBack)){
                                      options.failureCallBack(data);
                               }else{
                                      //need to provide default implementation
                               }
                        }
                  });
           
                  
              },
              successFunction : function(data,options){
                  if(data){
                      if(options.isFromController){
                             if($.isFunction(options.successCallBack)){
                            	 if(options.requestInfo){
                          		   options.successCallBack(options.requestInfo,data); 
                          	   }else{
                          		   options.successCallBack(data); 
                          	   }
                             }else{
                                    //need to provide default implementation
                             }
                      }else{
                             if(data['result']['status'] == 'true'){
                                    if($.isFunction(options.successCallBack)){
                                    	   if(options.requestInfo){
                                    		   options.successCallBack(options.requestInfo,data); 
                                    	   }else{
                                    		   options.successCallBack(data); 
                                    	   }
                                          
                                    }else{
                                           //need to provide default implementation
                                    }
                             }else if(data['result']['status'] == 'false'){
                                    if($.isFunction(options.failureCallBack)){
                                    	   if(options.requestInfo){
                                    		   options.failureCallBack(options.requestInfo,data); 
                                    	   }else{
                                    		   options.failureCallBack(data);
                                    	   }
                                    	   
                                    	   
                                    	   /// This code is commented because error message are displaying two times.
                                    	   //if(options.ischangepasswordflag==undefined)
                                    	  // doAjax.displayErrorMessages(data);
                                    	   
                                    	   
                                    }else{
                                           //need to provide default implementation
                                    	doAjax.displayErrorMessages(data);
                                    }
                             }else{
                                    if($.isFunction(options.failureCallBack)){
                                    	   if(options.requestInfo){
                                    		   options.failureCallBack(options.requestInfo,data); 
                                    	   }else{
                                    		   options.failureCallBack(data);
                                    	   }
                                    }else{
                                           //need to provide default implementation
                                    }
                             }
                      }
               }else{
                      //need to handle this case also
               }
               
        },
              displayErrorMessages:function(data){
            	  	var validations = data['validationResponse'];
	              	var messages = data['result']['messageList'];
	              	
	              	if(typeof messages == 'undefined')
	              		messages = data['result']['messages'];
	              	 
	              	var html='';
	              	if(validations){
	              		var validation= validations['validation'];
	              		if(validations['validation'].length == undefined){
	              			validation = [validation];
	              		}
	              		var validationMessage = '';
	              		for(var i=0;i<validation.length;i++){
	              			validationMessage+=validation[i].message+'<br/>';
	              		}
	              		$("#responseContentHolder").removeClass('hide');
	              		$("#messageStyleDiv").removeClass('alert-success').addClass('alert-danger');
	              		$("#responseContent").html(validationMessage);
	              		setTimeout(function(){$('#responseContentHolder').addClass('hide');},5000);
	              	} else if(messages){
	              		if(messages.length == undefined){
	              			messages = [messages];
	              		}
	              		$("#responseContentHolder").removeClass('hide');
	              		var errorMessages = '';
	              		for(var i=0;i<messages.length;i++){
	              			//errorMessages+=messages[i].message.description;
	              			var errormgs = '';
	              			errormgs = messages[i].description;
	              			
	              			if(typeof errormgs == 'undefined')
	              				errormgs = messages[i].message.description;
	              			
	              			errorMessages+=errormgs;
	              		}
	              		$("#messageStyleDiv").removeClass('alert-success').addClass('alert-danger');
	              		$("#responseContent").html(errorMessages);
	              		setTimeout(function(){$('#responseContentHolder').addClass('hide');},5000);
	              	}else{
	              		$("#responseContentHolder").removeClass('hide');
	              		var errorMessages = 'An Error occured while processing';
	              		$("#messageStyleDiv").removeClass('alert-success').addClass('alert-danger');
	              		$("#responseContent").html(errorMessages);
	              		setTimeout(function(){$('#responseContentHolder').addClass('hide');},5000);
	              	}
	              	$("#outlineResponseContentHolder").addClass('hide');
              },
              displaySuccessMessage:function(msg){
            	
				if($("#responseContentHolder").length > 0){
					if($("#messageStyleDiv").length > 0){
						if($("#responseContent").length > 0){
							//nothing appending every thing is there need to place msg
						}else{
							var html=''
								+'	<a href="#" class="close" data-dismiss="alert">&times;</a>'
								+'	<div id="responseContent"></div>';
							$("#messageStyleDiv").html(html);
							
						}
					}else{
						var html='<div id="messageStyleDiv" class="alert alert-success">'
							+'	<a href="#" class="close" data-dismiss="alert">&times;</a>'
							+'	<div id="responseContent"></div>'
							+'</div>';
						$("#reponseContentHolder").html(html);
					}
					
					$("#responseContent").html(msg);
					$("#messageStyleDiv").removeClass('alert-danger').addClass('alert-success');
					$("#responseContentHolder").removeClass('hide');
					setTimeout(function(){$("#responseContentHolder").addClass("hide");}, 5000);
				}
              },
              displaySuccessMessageinDiv:function(msg,selector){
              	
  				if($(selector).length > 0){
  					
  						var html='<div id="messageStyleDiv" class="alert alert-success">'
  							+'	<a href="#" class="close" data-dismiss="alert">&times;</a>'
  							+'	<div class="responseContent"></div>'
  							+'</div>';
  						$(selector).html(html);
  					$((selector +" .responseContent")).html(msg);
  					$("#messageStyleDiv").removeClass('alert-danger').addClass('alert-success');
  					$(selector).removeClass('hide');
  					setTimeout(function(){$(selector).addClass("hide");}, 5000);
  					$(window).trigger('resize');//will adjust the Bootstrap backdrop
  				}
                },
                displayErrorMessageinDiv:function(msg,selector){
                  	
      				if($(selector).length > 0){
      					
      						var html='<div id="messageStyleDiv" class="alert alert-danger">'
      							+'	<a href="#" class="close" data-dismiss="alert">&times;</a>'
      							+'	<div class="responseContent"></div>'
      							+'</div>';
      						$(selector).html(html);
      					$((selector +" .responseContent")).html(msg);
      					$("#messageStyleDiv").removeClass('alert-danger').addClass('alert-success');
      					$(selector).removeClass('hide');
      					
      					$(window).trigger('resize');//will adjust the Bootstrap backdrop
      				}
                    },
              displayErrorMessagesInPopup:function(data,element){
          	  		var validations = data['validationResponse'];
	              	var messages = data['result']['messages'];
	              	var html='';
	              	if(validations){
	              		var validation= validations['validation'];
	              		if(validations['validation'].length == undefined){
	              			validation = [validation];
	              		}
	              		var validationMessage = '';
	              		for(var i=0;i<validation.length;i++){
	              			validationMessage+=validation[i].message+'<br/>';
	              		}
	              		$("#responseElementContentHolder").removeClass('hide');
	              		$("#messageElementStyleDiv").removeClass('alert-success').addClass('alert-danger');
	              		$(element).html(validationMessage);
	              	} else if(messages){
	              		if(messages.length == undefined){
	              			messages = [messages];
	              		}
	              		$("#responseElementContentHolder").removeClass('hide');
	              		var errorMessages = '';
	              		for(var i=0;i<messages.length;i++){
	              			errorMessages+=messages[i].message.description;
	              		}
	              		$("#messageElementStyleDiv").removeClass('alert-success').addClass('alert-danger');
	              		$(element).html(errorMessages);
	              	}else{
	              		$("#responseElementContentHolder").removeClass('hide');
	              		var errorMessages = 'An Error occured while processing';
	              		$("#messageElementStyleDiv").removeClass('alert-success').addClass('alert-danger');
	              		$(element).html(errorMessages);
	              	}
            },
              
         // for displaying success message when account type changed
            displaySuccessMessagesOnChangeAccountType:function(accountTypeFlag, displayFlag){
            	var data = {accountTypeFlag:accountTypeFlag};
      			var changeAccountTypeSucessOptions = {
      					url:contextPath+"/home/setFlagInSession",
      					data:data,
      					//requestInfo:{displayFlag:displayFlag},
      					//successCallBack:doAjax.displaySuccessMessagesOnChangeAccountTypeSuccessCallBack,
      					async:true
      			};
      			doAjax.ControllerInvocation(changeAccountTypeSucessOptions);

            },
            
              // for displaying success message when group owner changed
              displaySuccessMessagesOnChangeOwner:function(changeOwnerFlag, groupUniqueIdentifier, displayFlag){
              	var data = {changeOwnerFlag:changeOwnerFlag};
        			var changeOwnerSucessOptions = {
        					url:contextPath+"/home/setFlagInSession",
        					data:data,
        					requestInfo:{groupUniqueIdentifier:groupUniqueIdentifier,displayFlag:displayFlag},
        					successCallBack:doAjax.displaySuccessMessagesOnChangeOwnerSuccessCallBack,
        					async:true
        			};
        			doAjax.ControllerInvocation(changeOwnerSucessOptions);

              },
              displaySuccessMessagesOnChangeOwnerSuccessCallBack:function(requestInfo,data){
      			if(data == true && requestInfo.displayFlag == 'true'){
      				location.href=contextPath+"/group/"+requestInfo.groupUniqueIdentifier;
      			}
      		}, 
      		displayControllerErrorMessages:function(data,type,divId){
      			var responseModel = data[type];
        	  	var validations = responseModel['validationResponse'];
              	var messages = responseModel['result']['messageList'];
              	var html='';
              	if(validations){
              		var validation= validations['validationMsgs'];
              		if(validations['validationMsgs'].length == undefined){
              			validation = [validation];
              		}
              		var validationMessage = '';
              		for(var i=0;i<validation.length;i++){
              			validationMessage+=validation[i].invalidMessage+'<br/>';
              		}
              		//$("#responseContentHolder").removeClass('hide');
              		
              		$("#responseContentHolder").addClass('hide');
              		$("#outlineResponseContentHolder").removeClass('hide');
              		
              		$("#outlineMessageStyleDiv").removeClass('alert-success').addClass('alert-danger');
              		$("#outlineResponseContent").html(validationMessage);
              	} else if(messages){
              		if(messages.length == undefined){
              			messages = [messages];
              		}
              		
              		var errorMessages = '';
              		for(var i=0;i<messages.length;i++){
              			errorMessages+=messages[i].description;
              		}
              		
              		//$("#responseContentHolder").removeClass('hide');
              		if(typeof divId!="undefined"&&divId){
              			$("#responseElementContentHolder").removeClass('hide');
              			$("#messageElementStyleDiv").removeClass('alert-success').addClass('alert-danger');
              			
                  		$("#responseElementContent").html(errorMessages);
              			
              			//$("#"+divId).html(errorMessages).addClass('alert-danger').removeClass('hide');
              		}else{
              			$("#responseContentHolder").addClass('hide');
                  		$("#outlineResponseContentHolder").removeClass('hide');
                  		
                  		$("#outlineMessageStyleDiv").removeClass('alert-success').addClass('alert-danger');
                  		$("#outlineResponseContent").html(errorMessages);
              		}
              		
              	}else{
              		//$("#responseContentHolder").removeClass('hide');
              		
              		$("#responseContentHolder").addClass('hide');
              		$("#outlineResponseContentHolder").removeClass('hide');
              		
              		var errorMessages = 'An Error occured while processing';
              		$("#outlineMessageStyleDiv").removeClass('alert-success').addClass('alert-danger');
              		$("#outlineResponseContent").html(errorMessages);
              	}
          }
              
       };
}.call(this);


/**
 * @returns {String}
 */
function getOffset() {
	var offset = new Date().getTimezoneOffset();
    
    offset =  ((offset<0? '+':'-')+ // Note the reversed sign!
            pad(parseInt(Math.abs(offset/60)), 2)+
            pad(Math.abs(offset%60), 2));
    
    return offset;
}

/**
 * @param number
 * @param length
 * @returns {String}
 */
function pad(number, length){
    var str = "" + number;
    while (str.length < length) {
        str = '0'+str;
    }
    return str;
}

function convertUTCDateToLocalDate(date) {
	var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60
			* 1000);
	var offset = date.getTimezoneOffset() / 60;
	var hours = date.getHours();
	newDate.setHours(hours - offset);

	return newDate;

}

function preparePageCriteriaJSONString(maxResult, startResult, isAll){
		var pageCriteriaJson = {"pageSize":maxResult,"pageNo":startResult,"isAll":isAll};
		return pageCriteriaJson;
}

function getTimeFormatNew(date,option){
	var d = new Date(date);
	    var n = d.getHours();
	    var m = d.getMinutes();
		if( m == 0 ){
			m = '00';
			}
		  //it is pm if hours from 12 onwards
		  var suffex 
		  if(option){
			  suffex = (n>= 12)? 'PM' : 'AM'; 
		  }else{
			  suffex = (n>= 12)? 'pm' : 'am';
		  }
		    var 
		    //only -12 from hours if it is greater than 12 (if not back at mid night)
		    n = (n> 12)? n-12 : n;
		   //if 00 then it is 12 am
		    n = (n == 0)? 12 : n;
		   return n +':'+ m +' '+ suffex;
		}

//common function for converting the date to local browser date time
var convertUTCDateTimeTo = function(){
var returnDateValue = null;
return {
    //UTCDate = mm/dd/yyyy hh:mm:ss (before calling this function we need to convert the UTC date to this specified format
	// from (String DateUtil.convertDateToString(UTCDate);))
	UTCtoDate : function(UTCDate){
		returnDateValue = new Date(UTCDate+":"+0+" UTC");
		return returnDateValue;
	},
	LocalBrowserDateTime  : function(UTCDate){

		//var localDate = new Date(UTCDate);
		//returnDateValue = Date.UTC(localDate.getFullYear(),localDate.getMonth(),localDate.getDate(),localDate.getHours(),localDate.getMinutes());
		//return returnDateValue =  new Date(returnDateValue);
		if(typeof UTCDate == 'string'){//UTCDate = "2015-11-26T00:00:00-05:00"
			var eventDate = UTCDate.split('T')[0];//eventDate = "2015-11-26"
			var eventTimeZone = UTCDate.split('T')[1];//eventTimeZone = "00:00:00-05:00"
			if(eventTimeZone==undefined){
				var localDate = new Date(UTCDate);
				returnDateValue = Date.UTC(localDate.getFullYear(),localDate.getMonth(),localDate.getDate(),localDate.getHours(),localDate.getMinutes());
				return returnDateValue =  new Date(returnDateValue);
			}
			var eventTime = eventTimeZone.split('+')[0];//eventTime = "00:00:00-05:00", eventTimeZone = "00:00:00-05:00"
			//2015,10,26,00 (hour),00 (minute)
			var localDate = Date.UTC(eventDate.split('-')[0],eventDate.split('-')[1]-1,eventDate.split('-')[2],eventTime.split(':')[0],eventTime.split(':')[1]);//1448496000000
			
			return new Date(localDate);//Wed Nov 25 2015 19:00:00 GMT-0500 (Eastern Standard Time)
		}else{
			return UTCDate;
		}
		
		},

	/** Please don't change below method it is being used in entire application.
	Below ConvertUTCDateToLocalDate method is used to convert utc format date to Browser local date WhenUtc date in 12 hr format.**/
    ConvertUTCDateToLocalDate : function(UTCDate){
       var startDate = UTCDate;
		   var utcStartDate = startDate+" UTC";//startDate.replace(startDate.split(' ')[4], "UTC");
		   var localStartDate = new Date(utcStartDate);
		   return localStartDate;
    },
    /** Please don't change below method it is being used in entire application.
	Below ConvertUTCDateToLocalDate method is used to convert utc format date to Browser local date WhenUtc date in 24 hr format.**/
    ConvertUTCDateToLocalDateInTwentyFourHoursFormat : function(UTCDate){
       var startDate = UTCDate;
		   var utcStartDate = startDate.replace(startDate.split(' ')[4], "UTC");
		   var localStartDate = new Date(utcStartDate);
		   return localStartDate;
    },
    
    getUTCDateFromDateString: function(dateString){
    	
   	 var start_yyyy = dateString.substring(0,4);
   	 var start_mm = dateString.substring(5,7);
   	 var start_date = dateString.substring(8,10);
   	 var start_HH = dateString.substring(11,13);
   	 var start_MM = dateString.substring(14,16);
   	 var date = new Date(Date.UTC(start_yyyy,start_mm-1,start_date,start_HH,start_MM));
   	 return date;
   },
   formatDate_yyyymmdd: function(date){         
	   	date = new Date(date);
	       var yyyy = date.getFullYear()//.toString();                                    
	       var MM = (date.getMonth()+1)//.toString(); // getMonth() is zero-based         
	       var dd  = date.getDate()//.toString();  
	       var hh  = date.getHours()//.toString();  
	       var mm  = date.getMinutes()//.toString();  
	       var ss  = date.getSeconds()//.toString();  
	                           
	       return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;
	   },
    formatDate_yyyymmdd_old: function(date){         
   	date = new Date(date);
       var yyyy = date.getFullYear().toString();                                    
       var MM = (date.getMonth()+1).toString(); // getMonth() is zero-based         
       var dd  = date.getDate().toString();  
       var hh  = date.getHours().toString();  
       var mm  = date.getMinutes().toString();  
       var ss  = date.getSeconds().toString();  
                           
       return yyyy + '-' + ( (MM[1] != undefined) ?MM:"0"+MM[0]) + '-' + ( (dd[1] != undefined) ?dd:"0"+dd[0]) + ' ' + ( (hh[1] != undefined) ?hh:"0"+hh[0]) + ':' + ( (mm[1] != undefined) ?mm:"0"+mm[0]) + ':' + ( (ss[1] != undefined) ?ss:"0"+ss[0]);
   }

};
}.call(this);

var dateUtility = function(){
	return {
	dateFormats:{
			'MMM': 'MMM',
			'yyyy': 'yyyy',
			'MMMddyyyy': 'MMM dd,yyyy',
			'MMMMddyyyy' : 'MMMM dd,yyyy',
		    'dd-MMM-yyyy': 'dd-MMM-yyyy',
			'WddMMMyyyy'  : 'W dd MMM,yyyy',
			'WMMMddyyyyhhmmA'  : 'W MMM dd,yyyy hh:mm A',
			'WWMMMddyyyyhhmmA'  : 'W, MMM dd,yyyy hh:mm A',
			'MMMdd'       : 'MMM dd',
			'MMMMyyyy'       : 'MMMM yyyy',
			'MMM.yy'       : 'MMM. yy',
			'hhmmaMMM.dd' :'hh:mm a MMM.dd',
			'hhmmA' :'hh:mm A',
			'WWWMMMddyyyyhhmmA'  : 'WW, MMM dd,yyyy hh:mm A',
			'WWWWMMMddyyyyhhmmA'  : 'WW MMM dd,yyyy hh:mm A',
			'WWWMMMddyyyy'  : 'WW, MMM dd,yyyy',
			'yyyyMMdd' : 'yyyy-MM-dd',
	},
	
	//format the given js date to string format date
	formatDate : function(givenDate,format){
		//Default format is dd-MM-YYYY
    	//find the date
    	var date = givenDate.getDate();
    	var month = givenDate.getMonth();
    	var year = givenDate.getFullYear();
    	var hours = givenDate.getHours();
	    var minutes = givenDate.getMinutes();
	    var startSeconds = givenDate.getSeconds();
	    var week = givenDate.getDay();
	    
    	var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    	               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    	
    	var fullmonths = [ "January", "Febuary", "March", "April", "May", "June", 
    	               "July", "August", "September", "October", "November", "December" ];
    	var weeks = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    	var fullweeks = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    	var returnedDate;
    	if(format == dateUtility.dateFormats['MMMddyyyy']){
    		date = (date<10)?"0"+date:date;
    		returnedDate =  months[month]+' '+ date +','+ ' '+year;
    	}else if(format == dateUtility.dateFormats['MMMMddyyyy']){
    		returnedDate =  fullmonths[month]+' '+ date +','+ ' '+year;
    	}else if(format == dateUtility.dateFormats['MMM']){
    		returnedDate =  fullmonths[month] ;
    	}else if(format == dateUtility.dateFormats['yyyy']){
    		returnedDate =  year;
    	}else if(format == dateUtility.dateFormats['dd-MMM-yyyy']){
    		returnedDate =  date+'-'+months[month]+'-'+year;
    	}else if(format == dateUtility.dateFormats['WddMMMyyyy']){
    		returnedDate = weeks[week]+' '+date+' '+months[month]+','+' '+year;
    	}else if(format == dateUtility.dateFormats['MMMdd']){
    		returnedDate = months[month]+' '+date;
    	}else if(format == dateUtility.dateFormats['hhmmaMMM.dd']){
    		returnedDate = dateUtility.getTimeFormatNew(givenDate,false)+' '+months[month]+'.'+date;
    	}else if(format == dateUtility.dateFormats['hhmmA']){
    		returnedDate = dateUtility.getTimeFormatNew(givenDate,false);
    	}else if(format == dateUtility.dateFormats['WMMMddyyyyhhmmA']){
    		returnedDate = weeks[week]+' '+months[month]+' '+date+', '+year+' '+dateUtility.getTimeFormatNew(givenDate,true);
    	}else if(format == dateUtility.dateFormats['WWMMMddyyyyhhmmA']){
    		returnedDate = weeks[week]+', '+months[month]+' '+date+', '+year+' '+dateUtility.getTimeFormatNew(givenDate,true);
    	}
    	else if(format == dateUtility.dateFormats['MMMMyyyy']){
    		returnedDate = fullmonths[month]+' '+year;
    	}
    	else if(format == dateUtility.dateFormats['MMM.yy']){
    		var str = ''+year+'';
    		returnedDate = months[month]+'. '+str.substring(2);
    	}
    	else if(format == dateUtility.dateFormats['WWWMMMddyyyyhhmmA']){
    		returnedDate = fullweeks[week]+', '+months[month]+' '+date+', '+year+' '+dateUtility.getTimeFormatNew(givenDate,true);
    	}
    	else if(format == dateUtility.dateFormats['WWWWMMMddyyyyhhmmA']){
    		returnedDate = fullweeks[week]+'  '+months[month]+' '+date+', '+year+' '+dateUtility.getTimeFormatNew(givenDate,true);
    	}
    	else if(format == dateUtility.dateFormats['WWWMMMddyyyy']){
    		returnedDate = fullweeks[week]+', '+months[month]+' '+date+', '+year;
    	}
    	else if(format == dateUtility.dateFormats['yyyyMMdd']){
    		returnedDate = year+'-'+(month+1)+'-'+date; //fullweeks[week]+', '+months[month]+' '+date+', '+year;
    	}
    	else{
    		returnedDate = date+'-'+(month+1)+'-'+year;
    	}
    	return returnedDate;
    },
    getTimeFormatNew :function (date,option){
    	 var d = date;
    	    var n = d.getHours();
    	    var m = d.getMinutes();
    		if( m == 0 ){
    			m = '00';
    		}
    		m = parseInt(m);
    		switch(m){
    		case 0:m = '00';
    				break;
    		case 1:
    		case 2:
    		case 3:
    		case 4:
    		case 5:
    		case 6:
    		case 7:
    		case 8:
    		case 9:m='0'+m
    				break;
    			
    		}
    		
    		n = parseInt(n);
    		switch(n){
    		case 0:n = '00';
					break;
    		case 1:
    		case 2:
    		case 3:
    		case 4:
    		case 5:
    		case 6:
    		case 7:
    		case 8:
    		case 9:n='0'+n
    		break;

    		}
    		  //it is pm if hours from 12 onwards
    		  var suffex 
    		  if(option){
    			  suffex = (n>= 12)? 'PM' : 'AM'; 
    		  }else{
    			  suffex = (n>= 12)? 'pm' : 'am';
    		  }
    		  //only -12 from hours if it is greater than 12 (if not back at mid night)
    		    var n = (n> 12)? n-12 : n;
    		   //if 00 then it is 12 am
    		    n = (n == 0)? 12 : n;
    		   return n +':'+ m +' '+ suffex;
    }
  };
}.call(this);
/**
 * stringLimitDots method is used to restrict the string if its morethan length parameter its shorten to given length and ... will be appended.
 * @param input
 * @param length
 */
function stringLimitDots(input,length){
	if(input!=undefined){
		if(input.length>length)
			return input.substring(0,length)+'...';
		return input;
	}
	else return '';
}

function messagesDate(date) {
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
   day_diff = Math.floor(diff / 86400);

if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return;
if(day_diff < 31&&Math.ceil(day_diff / 7)>1)
	return;
return day_diff == 0 && (
diff < 86400 && dateUtility.formatDate(date,'hh:mm A')) || day_diff == 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || (day_diff < 31) && Math.ceil(day_diff / 7) + " week ago";
}


//Added For The Case Insesensitive Search Functionality on dashbaord
$.extend($.expr[":"], {
	"containsIN": function(elem, i, match, array) {
	return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}
	});


//added Utils for Mustache  
function mustacheDataUtil(object){
	var defaults={
			contextPath:contextPath, /*get the contextPath By Using {{contextPath}} anywhere*/
			truncateTwenty:function() {/* String Truncate Method as template data can be used as a tag in template */
		        return function(text, render) {
		        	var texF=render(text);
		        	if(texF.length>20)
		            return texF.substr(0,20) + '...';
		        	else
		        		return texF;
		          };
		        },
		        truncateSixteen:function() {/* String Truncate Method as template data can be used as a tag in template */
			        return function(text, render) {
			        	var texF=render(text);
			        	if(texF.length>16)
			            return texF.substr(0,16) + '...';
			        	else
			        		return texF;
			          };
			        },
		        truncateTwentyFive:function() {/* String Truncate Method as template data can be used as a tag in template */
			        return function(text, render) {
			        	var texF=render(text);
			        	if(texF.length>25)
			            return texF.substr(0,23) + '...';
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
		        formatDate:function() {/* some tokens having  Dollar symbol it may crash the Jquery Selector to overcome we can replace for Only UI Purpose */
		            return function(text, render) {
		        	var date=render(text);
		        	return dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(date),'hh:mm a MMM.dd');
		            };
		        },
		formatDatesearch:function() {/* some tokens having  Dollar symbol it may crash the Jquery Selector to overcome we can replace for Only UI Purpose */
		            return function(text, render) {
		        	var date=render(text);
		        	return dateUtility.formatDate(convertUTCDateTimeTo.LocalBrowserDateTime(date),'MMM dd,yyyy');
		            };
		        },
		        truncateFifteen:function() {/* String Truncate Method as template data can be used as a tag in template */
			        return function(text, render) {
			        	var texF=render(text);
			        	if(texF.length>12)
			            return texF.substr(0,10) + '...';
			        	else
			        		return texF;
			          };
			        },
			        truncateFifty:function() {/* String Truncate Method as template data can be used as a tag in template */
				        return function(text, render) {
				        	var texF=render(text);
				        	if(texF.length>50)
				            return texF.substr(0,48) + '...';
				        	else
				        		return texF;
				          };
				        },
				        truncate250:function() {/* String Truncate Method as template data can be used as a tag in template */
					        return function(text, render) {
					        	var texF=render(text);
					        	if(texF.length>250)
					            return texF.substr(0,248) + '...';
					        	else
					        		return texF;
					          };
					        },
				        truncateFourty:function() {/* String Truncate Method as template data can be used as a tag in template */
					        return function(text, render) {
					        	var texF=render(text);
					        	if(texF.length>40)
					            return texF.substr(0,38) + '...';
					        	else
					        		return texF;
					          };
					        },
					        truncateThirty:function() {/* String Truncate Method as template data can be used as a tag in template */
						        return function(text, render) {
						        	var texF=render(text);
						        	if(texF.length>30)
						            return texF.substr(0,28) + '...';
						        	else
						        		return texF;
						          };
						        },
			        readMore:function() {/* String Truncate and display dots Expandable */
			      	  return function(text, render) {
			      		  text=render(text);
			      		  length=150;
								if(length==undefined||text.length<=length){
									return text;
								}else{
									var visibletext="<span>"+text.substring(0,length)+"</span>";
									var dots='<span class="dots lightblue cursor-hand" onclick="$(this).parent().addClass(\'full\'); $(window).trigger(\'resize\')"> ... </span>';
									var remainingText='<span class="remainingtext">'+text.substring(length)+'</span>';
									var readless='<span class="readLess lightblue cursor-hand" onclick="$(this).parent().removeClass(\'full\'); $(window).trigger(\'resize\')">  read less</span>';
									return '<span class="collapsedText">'+visibletext+dots+remainingText+readless+'</span>';
								}
							};
			        },
			        readMore60:function() {/* String Truncate and display dots Expandable */
				      	  return function(text, render) {
				      		  text=render(text);
				      		  length=60;
									if(length==undefined||text.length<=length){
										return text;
									}else{
										var visibletext="<span>"+text.substring(0,length)+"</span>";
										var dots='<span class="dots lightblue cursor-hand" onclick="$(this).parent().addClass(\'full\'); $(window).trigger(\'resize\')"> ... </span>';
										var remainingText='<span class="remainingtext">'+text.substring(length)+'</span>';
										var readless='<span class="readLess lightblue cursor-hand" onclick="$(this).parent().removeClass(\'full\'); $(window).trigger(\'resize\')">  read less</span>';
										return '<span class="collapsedText">'+visibletext+dots+remainingText+readless+'</span>';
									}
								};
				        },
				        readMore50:function() {/* String Truncate and display dots Expandable */
					      	  return function(text, render) {
					      		  text=render(text);
					      		  length=50;
										if(length==undefined||text.length<=length){
											return text;
										}else{
											var visibletext="<span>"+text.substring(0,length)+"</span>";
											var dots='<span class="dots lightblue cursor-hand" onclick="$(this).parent().addClass(\'full\'); $(window).trigger(\'resize\')"> ... </span>';
											var remainingText='<span class="remainingtext">'+text.substring(length)+'</span>';
											var readless='<span class="readLess lightblue cursor-hand" onclick="$(this).parent().removeClass(\'full\'); $(window).trigger(\'resize\')">  read less</span>';
											return '<span class="collapsedText">'+visibletext+dots+remainingText+readless+'</span>';
										}
									};
					        }
	};
	return $.extend(object,defaults);
}

function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY);

}

// Function that validates email address through a regular expression.
function validateEmail(sEmail) {
	var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
	if (filter.test(sEmail)) {
		return true;
	} else {
		return false;
	}
}

function textareacontent(text){
	return text.replace(/\r?\n/g, '<br />');
}

// used to generate UUID which is equivalent to UUID generated in java
function generateUUID(){
	 function _pattern(t, s) {
	        var p = ((t ? (Date.now()) : (Math.random())).toString(16) + "0000000").substr(2, 8);
	        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
	    }
	    return _pattern(true) + _pattern(false, true) + _pattern(false, true) + _pattern();
}

//needs to be binded only once It will fix all  cases
$('body').on('click','#outlineResponseContentHolder .close,#messageStyleDiv .close,#responseContentHolder .close',function(e){
	$(e.target).closest('.inner-alerts').addClass('hide');
	
});

String.prototype.toCapitalised = function(){
	return this.toLowerCase().replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase();
	} );
};
$.fn.reverseElements=[].reverse;
(function ( $ ) {
	$.fn.isInView = function(headerHeight) {
		var $elem = this;
		var $window = $(window);
		var docViewTop = $window.scrollTop()+headerHeight;
		var docViewBottom = docViewTop + $window.height()-headerHeight;
		var elemTop = $elem.offset().top;
		var elemBottom = elemTop + $elem.height();
		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));

	};
}( jQuery ));

function getAlphabetsBySequenceNumber(index){
	   		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
		   return alphabet.charAt(index-1);
}

function checkcharcount(content_id, max, e)
{   
    if(e.which != 8 && $('#'+content_id).text().length > max)
    {
       // $('#'+content_id).text($('#'+content_id).text().substring(0, max));
       e.preventDefault();
    }
}

function convertStringToBoolean(value){
	if(typeof value == 'string'){
		if(value == 'true')
			value = true;
		else
			value = false;
	}
	return value;
}

function isAllDayDateFormatting(isAllDay,startDate,endDate){
	
	if(typeof isAllDay == 'string'){
		if(isAllDay == 'true')
			isAllDay = true;
		else
			isAllDay = false;
	}
	
	//var days = Math.round( (endDate-startDate)/(1000*60*60*24) );
	
	if(isAllDay){
/*		if(days == 1){
			//startDate.setDate(startDate.getDate() + 1);
			endDate.setDate(endDate.getDate() - 1);			
		}else{
			startDate.setDate(startDate.getDate() + 1);
			endDate.setDate(endDate.getDate() + 1);
		}*/
		endDate.setDate(endDate.getDate() - 1);	
		
		startDate = new Date(startDate.setHours(0));
		endDate = new Date(endDate.setHours(0));
		
		endDate = new Date(endDate);
	 	}
	return endDate;
}