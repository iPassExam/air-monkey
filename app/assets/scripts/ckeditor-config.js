
CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	config.uiColor = '#AADC6E';
    config.autoParagraph = false;
    config.fillEmptyBlocks = false;
    config.IgnoreEmptyParagraphValue = true;
    config.skin = 'kama';
    config.height = '790px;';
    config.width = "99%";
    config.forcePasteAsPlainText = true;
    config.entities_additional = '';

    config.toolbar =  [
                [ 'Save', 'Undo' ],
                [ 'Bold', 'Italic', 'Strike','-','Outdent','Indent','-','Blockquote' ],
                [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight' ],
                [ 'Link', 'Unlink', '-', 'Image', 'Table', 'HorizontalRule' ],
                [ 'NumberedList', 'BulletedList' ],
                [ 'Source' ]
    ];

    config.keystrokes = [
        [ CKEDITOR.CTRL + 83 /*S*/, 'save' ],

        [ CKEDITOR.CTRL + 90 /*Z*/, 'undo' ],
        [ CKEDITOR.CTRL + 89 /*Y*/, 'redo' ],
        [ CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/, 'redo' ],

        [ CKEDITOR.CTRL + 76 /*L*/, 'link' ],

        [ CKEDITOR.CTRL + 66 /*B*/, 'bold' ],
        [ CKEDITOR.CTRL + 73 /*I*/, 'italic' ],
        [ CKEDITOR.CTRL + 85 /*U*/, 'underline' ]
    ];
};
