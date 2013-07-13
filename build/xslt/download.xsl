<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:a="http://ns.adobe.com/air/application/3.0">
<xsl:output method="html" indent="yes"/>
	<xsl:template match="/a:application">
	
<xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html></xsl:text>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Download Airmonkey</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet" />
    <style type="text/css">
      body {
        padding-top: 40px;
        padding-bottom: 40px;
        background-color: #f5f5f5;
      }

      .form-download {
        max-width: 300px;
        padding: 19px 29px 29px;
        margin: 0 auto 20px;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        -webkit-border-radius: 5px;
           -moz-border-radius: 5px;
                border-radius: 5px;
        -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.05);
           -moz-box-shadow: 0 1px 2px rgba(0,0,0,.05);
                box-shadow: 0 1px 2px rgba(0,0,0,.05);
      }
      .form-download .form-download-heading {
        margin-bottom: 10px;
      }
    </style>
    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="https://raw.github.com/aFarkas/html5shiv/master/src/html5shiv.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container">
      <form class="form-download text-center">
        <h2 class="form-download-heading">Air Monkey</h2>
        <a href="http://static-cms.ipassexam.com/"><img src="http://ipassexam.github.io/Air-Monkey/images/airmonkey-logo.png" /></a>
        <a href="https://dl.dropboxusercontent.com/u/4407314/AirMonkey/Air-Monkey_{a:versionNumber}.exe" class="btn btn-large btn-primary" type="submit">Download</a>
      </form>
    </div>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
    <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script>
  </body>
</html>
		
	</xsl:template>
</xsl:stylesheet>



