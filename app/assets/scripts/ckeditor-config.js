
CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	config.uiColor = '#AADC6E';
    config.autoParagraph = false;
    config.skin = 'kama';
    config.height = '790px;';
    config. width = "100%";

    config.toolbar =  [
                [ 'Save', 'Undo' ],
                [ 'Bold', 'Italic', 'Strike','-','Outdent','Indent','-','Blockquote' ],
                [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight' ],
                [ 'Link', 'Unlink', '-', 'Image', 'Table', 'HorizontalRule' ],
                [ 'NumberedList', 'BulletedList' ],
                [ 'Source' ]
    ];

    
};
