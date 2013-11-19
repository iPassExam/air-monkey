$(function(){
    air.trace('CMS loaded');

    var website = {
        page: util.html.decode(page.request.querystring("page")),
        view: util.html.decode(page.request.querystring("view")),
        folder: util.html.decode(page.request.querystring("webfolder")),
        site: util.html.decode(page.request.querystring("website"))
    };
    
    air.trace("Page: "+ website.page);
    air.trace("View: "+ website.view);
    air.trace("Website: "+ website.site);
    air.trace("Webfolder: "+ website.folder);
    
    var viewURI = websiteService.folders.website(website.site).resolvePath(website.view).nativePath;
    
    if(util.file.exists(viewURI)){
        $("#editor").val(util.file.read(viewURI));
    }
    else {
        alert("No such view: "+ viewURI);
    }

    function exit(website){
        document.location = "app:/app/web-loader.html?website="+ website.site +"&webfolder="+ website.folder +"&page="+ website.page;
    }

    function Save(html){
        $('#saving').modal({
            keyboard: false,
            backdrop: "static"
        })

        util.file.write(viewURI, html);

        $.subscribe(app.e.onBuildComplete, function(e, website){
            exit(website);
        });

        app.website.build(website.site, website.folder, website, "edit");
    }

    if(website.view.endsWith(".htm") || website.view.endsWith(".html")){ //use wysiwyg editor
        // This hack uses a hidden submit button to intercept the CKeditor save event
        $('#submit').off('click').click(function(e){
            e.preventDefault();
            $('#submit').off('click').click(function(e){
                e.preventDefault();
                alert("Saving in progress!");
                return false;
            });
            var html = $('textarea#editor').val();
            Save(html);
            $(this).hide();
            return false;
        });

        var editor = $('textarea#editor').ckeditor(function() {
                            air.trace('CK Callback');
                        }, {
                            customConfig: 'app:/app/assets/scripts/ckeditor-config.js',
                            baseHref: "file:///"+ website.folder.replace(/\\/g, "/") + "/",
                            on: {
                                'instanceReady': function (evt) {
                                    evt.editor.execCommand('maximize');
                                    var blockTags = ['div','h1','h2','h3','h4','h5','h6','p','pre','li','blockquote','ul','ol','table','thead','tbody','tfoot','td','th',];

                                      for (var i = 0; i < blockTags.length; i++)
                                      {
                                         this.dataProcessor.writer.setRules( blockTags[i], {
                                            indent : false,
                                            breakBeforeOpen : true,
                                            breakAfterOpen : false,
                                            breakBeforeClose : false,
                                            breakAfterClose : true
                                         });
                                      }
                                }
                            }
                        }
        );

        $("#exit")
            .show()
            .click(function(e){
                e.preventDefault();
                exit(website);
            });

    } else {
          //use code editor
          var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
            lineNumbers: true,
            lineWrapping: true,
            autofocus: true,
            mode: "htmlmixed"
          });

          $("#submit")
            .show()
            .click(function(e){
                e.preventDefault();
                var html = editor.getValue();
                $(this).attr("disabled", "disabled").html("saving...");
                Save(html);
            });
          $("#exit")
            .show()
            .click(function(e){
                e.preventDefault();
                exit(website);
            });
    }
});