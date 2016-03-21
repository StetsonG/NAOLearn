(function($){
    $.widget( "xiim.globalSearch", {
            options: {
                isUserLoggedIn:false,
                accessToken : $("#accessToken_meta").val(),
                langId : $("#langId_meta").val(),
                userId : $("#loggedInUserId-meta").val(),
                userProfileName: $("#userProfileName").val(),
                userProfilePhotoId: $("#userProfilePhotoId").val(),
                emailId: $("#emailId").val(),
                groupId: $("#groupId").val(),
                $body:$('body'),
                mode:$('#searchIn').val()||$('.globalSearchParent').attr('mode')||'Courses'
            },
            URI: {
            	searchAutoComplete:getModelObject('serviceUrl')+'/search/1.0/searchAutoComplete',
            },
            
        _fillTemplates:function(){
            this._templates.autocompleteList=$('#globalsearchAutoComplete').html();
        },
        _templates:{

        },
        _create: function () {
            var widget=this;
            this._fillTemplates();
            this.bindEvents();
        },
        bindEvents:function(){
            var widget=this;
            widget.element.on('keyup',this._getEHandlers().searchEnter);
            widget.options.$body.on('click','.searchautoCompleteItem',widget._getEHandlers().searchautoCompleteItem)
            widget.options.$body.on('click','.searchOptionSelect',widget._getEHandlers().searchOptionSelect)
            widget.options.$body.on('click','button.search-input-button',widget._getEHandlers().searchbutton)
        },
        _getEHandlers:function(){
            var widget=this;
            return{
            	searchbutton:function(){
            		var e= jQuery.Event( 'keyup', { which: 13,keyCode:13 } );
            		widget.element.trigger(e);
            	},
                searchEnter:function(e){
                    var query= $.trim($(e.target).val());
                    if(query.length>0) {
                        clearTimeout(widget.typingTimer);
                        if(widget.query!=query&&e.keyCode &&[37,38,39,40].indexOf(e.keyCode)==-1) {
                            widget.typingTimer = setTimeout(function () {
                                widget._service().searchAutoComplete(widget.options.mode, query, function (data) {
                                        widget.query = query;
                                        console.log(data);
                                        data=mustacheDataUtil(data);
                                        $('#globalSearchAutocompleteholder').html(Mustache.to_html(widget._templates.autocompleteList, data));
                                    }
                                );
                            }, 500);//Dont hit While Typing Assume hit when Typing is done
                        }
                        var isSelectedItem=$('.searchautoCompleteItem.activeitem').length>0;
                        if(e.keyCode == 38){
                            if(!isSelectedItem)
                                $('.searchautoCompleteItem:first').addClass('activeitem');
                            else
                            $('.searchautoCompleteItem.activeitem').removeClass('activeitem').prev('.searchautoCompleteItem').addClass('activeitem');
                        }else if(e.keyCode == 40){
                            if(!isSelectedItem)
                                $('.searchautoCompleteItem:first').addClass('activeitem');
                            else
                            $('.searchautoCompleteItem.activeitem').removeClass('activeitem').next('.searchautoCompleteItem').addClass('activeitem');
                        }
                        if(e.keyCode == 40||e.keyCode == 38){
                            if($('.searchautoCompleteItem.activeitem').length>0)
                                $(e.target).val($('.searchautoCompleteItem.activeitem').data('term'));
                        }
                        else if (e.keyCode == 13)
                            window.location = contextPath + '/search?q=' + encodeURIComponent(widget.element.val()) + '&searchIn=' + widget.options.mode;
                    }else{
                        widget.query='';
                        $('#globalSearchAutocompleteholder').html('');
                    }
                },
                searchautoCompleteItem:function(e){
                    window.location = contextPath + '/search?q=' + encodeURIComponent($(e.target).data('term')) + '&searchIn=' + widget.options.mode;
                },
                searchOptionSelect:function(e){
                    $('.globalSearchParent').attr('mode',$(e.target).attr('mode'));
                    widget.options.mode=$(e.target).attr('mode');
                    widget.element.val('').focus();
                    $('#globalSearchAutocompleteholder').html('');
                    
                },
                globalFilterModify:function(e){

                }

            }
        },
        destroy: function () {

        },
        _setOption: function ( key, value ) {//Set Option Is Required in search to make the Dyanamic Changes in the view
            switch (key) {
                case "someValue":
                    break;
                default:
                    break;
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        },
        _service:function(){
            var widget=this;
          return {
        	  searchAutoComplete:function(searchIn,searchKey,successCallback){
                  var options={
                      url:widget.URI.searchAutoComplete+'?searchIn='+searchIn+'&searchKey='+encodeURIComponent(searchKey,''),
                      headers : widget._service().getHeaders(),
                      async:true,
                      successCallBack :successCallback
                  };
                  doAjax.GetServiceHeaderInvocation(options);
              },
              generatePageCriteria:function(pageNum,pageSize,isAll){
                  return {"pageSize":pageSize,"pageNo":pageNum,"isAll":isAll?true:false};
              },
              getHeaders:function(){
                  return {accessToken:widget.options.accessToken,langId:widget.options.langId};
              },
             
          };
        },
    });

})($);