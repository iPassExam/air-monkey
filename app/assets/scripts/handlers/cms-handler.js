$(function(){
    air.trace('CMS loaded');

    var website = {
        page: util.html.decode(page.request.querystring("page")),
        view: util.html.decode(page.request.querystring("view")),
        folder: util.html.decode(page.request.querystring("webfolder")),
        site: util.html.decode(page.request.querystring("website"))
    };

    var baseHref = "file:///"+ website.folder.replace(/\\/g, "/") + "/";

    air.trace("Page: "+ website.page);
    air.trace("View: "+ website.view);
    air.trace("Website: "+ website.site);
    air.trace("Webfolder: "+ website.folder);
    
    var viewURI = websiteService.folders.website(website.site).resolvePath(website.view).nativePath;
    var wysiwygMode = false;
    if(website.view.endsWith(".htm") || website.view.endsWith(".html")){
        wysiwygMode = true;
    }
    if(util.file.exists(viewURI)){
        var viewHtml = util.file.read(viewURI);
        if(wysiwygMode)
            viewHtml = viewHtml.replace(/\~\//g, baseHref);
        $("#editor").val(viewHtml);
    }
    else {
        alert("No such view: "+ viewURI);
    }

    function Exit(website){
        document.location = "app:/app/web-loader.html?website="+ website.site +"&webfolder="+ website.folder +"&page="+ website.page;
    }

    function Save(html){
        $('#saving').modal({
            keyboard: false,
            backdrop: "static"
        })

        var regex = new RegExp(baseHref, "g");
        html = html.replace(regex, "~/");

        // Fixes annoying CKEditor bug
        if(html.endsWith("<p></p>\n"))
            html = html.substring(0, html.length - 8)

        util.file.write(viewURI, html);

        $.subscribe(app.e.onBuildComplete, function(e, website){
            Exit(website);
        });

        app.website.build(website.site, website.folder, website, "edit");
    }

    function setupCodeMirror(){
        var textArea = document.getElementById("editor");
        var textEditor = CodeMirror.fromTextArea(textArea, {
            lineNumbers: true,
            lineWrapping: true,
            autofocus: true,
            mode: "htmlmixed",
            extraKeys: {
                "Ctrl-S": function(instance) { Save(instance.getValue()); },
                "Esc": function() { Exit(website); },
                "Ctrl-/": "undo"
            }
        });

        $("#submit")
        .show()
        .click(function(e){
            e.preventDefault();
            var html = textEditor.getValue();
            $(this).attr("disabled", "disabled").html("saving...");
            Save(html);
        });
        $("#exit")
        .show()
        .click(function(e){
            e.preventDefault();
            Exit(website);
        });
    }

    if(wysiwygMode){ //use wysiwyg editor
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

        CKEDITOR.replace('editor', {
            customConfig: 'app:/app/assets/scripts/ckeditor-config.js',
            baseHref: baseHref,
            on: {'instanceReady': function(e){
                e.editor.execCommand('maximize');
                var blockTags = ['div','pre','blockquote','ul','ol','table','thead','tbody','tfoot','td','th'];

                  for (var i = 0; i < blockTags.length; i++)
                  {
                     e.editor.dataProcessor.writer.setRules( blockTags[i], {
                        indent : true,
                        breakBeforeOpen : true,
                        breakAfterOpen : true,
                        breakBeforeClose : true,
                        breakAfterClose : true
                     });
                  }

                  var spanTags = ['h1','h2','h3','h4','h5','h6','p','li'];

                  for (var i = 0; i < spanTags.length; i++)
                  {
                     e.editor.dataProcessor.writer.setRules( spanTags[i], {
                        indent : true,
                        breakBeforeOpen : true,
                        breakAfterOpen : false,
                        breakBeforeClose : false,
                        breakAfterClose : true
                     });
                  }
                // // Ends self closing tags the HTML4 way, like <br>.
                // e.editor.dataProcessor.writer.selfClosingEnd = '>';
            }}
        });

        for (var i in CKEDITOR.instances) {

            CKEDITOR.instances[i].on('key', function(e) {
                if(e.data.keyCode==27){
                    Exit(website);
                    // console.log("Switching to source view");
                    // e.cancel();
                    // e.editor.destroy();
                    // setupCodeMirror();
                }
            });

            // CKEDITOR.instances[i].on('mode', function(e) {
            //    alert(e.editor.mode);
            //    if (e.editor.mode == 'source') {
            //       e.cancel();
            //       e.editor.destroy();
            //       setupCodeMirror();
            //    }
            // });

        }

        // $("#exit")
        //     .show()
        //     .click(function(e){
        //         e.preventDefault();
        //         Exit(website);
        //     });

    } else {
          //use code editor
          setupCodeMirror();
    }
});