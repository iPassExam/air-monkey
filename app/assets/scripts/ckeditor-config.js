
CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	config.uiColor = '#AADC6E';
    config.autoParagraph = false;
    config.skin = 'kama';
    config.height = '790px;';
    config. width = "100%";

    config.toolbar =  [
                [ 'Save' ],
                [ 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', '-', 'Format' ],
                [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'Image','Table' ],
                [ 'Source' ]
    ];

    
};
