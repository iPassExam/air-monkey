<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	version="1.0" 
	xmlns:a="http://ns.adobe.com/air/application/3.0">
	
	<xsl:output method="text" encoding="utf-8" indent="no"/>
	<xsl:template match="/a:application"><xsl:value-of select="a:versionNumber"/></xsl:template>
  
</xsl:stylesheet> 