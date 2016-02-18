// bolgen_01.js


var bMobile = (screen.height + screen.width) < 1200

function IsMobile() {
	return bMobile
} // IsMobile


function writeBottom() {
	document.writeln('<span id="idBundSpan">')
	document.writeln('Webmaster:')
	document.writeln('<a target="_blank" itemprop="author" href="http://lassesb.net16.net/Hvem-mig$/">Lasse Steen Bohnstedt</a>')
	document.writeln('</span>')
} // writeBottom


function findObjTop(obj) {
	var currTop = 0
	if (obj.offsetParent) {
		do {
			//currLeft += obj.offsetLeft
			currTop += obj.offsetTop
		} while (obj = obj.offsetParent)
	}
	return currTop
} // findObjTop


var bRegisterHeightListener = true

function sanitizeHeights() {
	var oBund = document.getElementById('idBund')
	var oMain = document.getElementById('idMain')
	var oNav  = document.getElementById('idNav')
	var oNav2 = document.getElementById('idNav2')
	var oSDiv = document.getElementById('idScrollDiv')
	if (oBund && oMain && oNav) {
		if (IsMobile()) {
			//oNav.style.visibility = 'inherit'
			oMain.style.visibility = 'inherit'
			oBund.style.visibility = 'inherit'
			//if (oNav2) oNav2.style.visibility = 'inherit'
			if (oSDiv) {
				var dollarSDiv = $(oSDiv)
				dollarSDiv.show()
				if (oSDiv.tagName.toLowerCase() == "iframe") {
					dollarSDiv.height(1500).css('display','block')
				}
				else {
					dollarSDiv.height('auto')
				}
			}
			//var iHeight = dollarMain.height()
			//$(oNav).height(iHeight)
			//
			if (bRegisterHeightListener) {
				var dollarMain = $(oMain)
				dollarMain.height('auto')
				bRegisterHeightListener = false
				window.onresize = sanitizeHeights
			}
		}
		else {
			var ua = $.browser
			var bNoScroll = false
			if (ua.msie) {
				switch (ua.version.slice(0,2)) {
					case "6.":
					case "7.":
					case "8.":
						//alert(ua.version)
						bNoScroll = true
						break
				}
			}
			if (bNoScroll) {
				$('#idScrollDiv').css('overflow','auto')
				oNav.style.visibility = 'inherit'
				oNav.style.height = 'auto'
				oMain.style.visibility = 'inherit'
				oBund.style.visibility = 'inherit'
				if (oNav2) oNav2.style.visibility = 'inherit'
				if (oNav2) oNav2.style.height = 'auto'
				if (oSDiv) oSDiv.style.height = 'auto'
			}
			else {
				var iMainTop = findObjTop(oMain)
				var iMainHeight = oMain.clientHeight
				var iBodyHeight = $(window).height()
				var iHeight = iBodyHeight - oBund.clientHeight - iMainTop
				//if (IsMobile()) iHeight = 5000 // quick'n'dirty workaround
				if (oMain.height != iHeight) oMain.height = iHeight
				var iNavHeight = iHeight
				//if (oNav.tagName.toLowerCase() == "iframe") iNavHeight -= 10
				if (oNav.style.height != iNavHeight) oNav.style.height = iNavHeight + "px"
				if (oNav2) {
					//oNav2.style.backgroundColor = 'yellow'
					oNav2.style.display = 'block'
					oNav2.style.height = iNavHeight + "px"
				}
				//
				if (oSDiv) {
					var iSDivTop = findObjTop(oSDiv)
					var iDivHeight = (iHeight - (iSDivTop - iMainTop))
					if (oSDiv.tagName.toLowerCase() == "iframe") {
						//iDivHeight -= 6
						oSDiv.style.display = 'block'
						//if (IsFileProtocol()) alert($(oSDiv.contentDocument).height())
					}
					if (oSDiv.style.height != iDivHeight) oSDiv.style.height = iDivHeight + "px"
					oSDiv.style.overflow = 'auto'
				}
				//
				if (bRegisterHeightListener) {
					bRegisterHeightListener = false
					window.onresize = sanitizeHeights
					oNav.style.visibility = 'inherit'
					oMain.style.visibility = 'inherit'
					oBund.style.visibility = 'inherit'
					if (oNav2) oNav2.style.visibility = 'inherit'
				}
			}
		}
	}
} // sanitizeHeights


var bLocalHost = null
function IsLocalHost() {
	if (bLocalHost == null) {
		var sHost = document.location.hostname.toString()
		bLocalHost = ((sHost == '127.0.0.1') || (sHost == 'localhost'))
	}
	return bLocalHost
} // IsLocalHost


var bFileProtocol = null
function IsFileProtocol() {
	if (bFileProtocol == null) {
		var sLocRoot = document.location.toString()
		bFileProtocol = (sLocRoot.search('^file:') == 0)
	}
	return bFileProtocol
} // IsFileProtocol


var sLocRoot = null

function GetLocRoot() {
	if (sLocRoot == null) {
		if ((!IsFileProtocol()) && (!IsLocalHost())) {
			sLocRoot = '/'
		}
		else {
			sLocRoot = document.location.toString()
			var iBolgenIx = sLocRoot.search('/bolgen/')
			if (iBolgenIx < 0) sLocRoot = '/'
			else {
				sLocRoot = sLocRoot.substr(0, iBolgenIx + 8)
				sLocRoot = sLocRoot.replace(/ /g, '%20')
			}
		}
	}
	return sLocRoot
} // GetLocRoot

function fixFileProtocolLinks() {
	if (IsFileProtocol()) {
		var i
		// <a href="xx"></a>
		for (i = 0; i < document.links.length; i++) {
			var sHref = document.links[i].href.toString()
			if (sHref.search('^file:') == 0) {
				var bChanged = false
				if (sHref.search('^' + GetLocRoot()) < 0) {
					//alert(sHref)
					// Find out how much to lose of sHref
					var iHrefIx
					var iMaxIx = Math.min(sHref.length, sLocRoot.length)
					//alert(iMaxIx)
					for (iHrefIx = 0; (iHrefIx < iMaxIx) && (iHrefIx > -1); iHrefIx++) {
						if (sHref[iHrefIx] != sLocRoot[iHrefIx]) {
							//alert(iHrefIx)
							sHref = sLocRoot + sHref.substr(iHrefIx)
							iHrefIx = -1
							bChanged = true
						}
					}
					if (!bChanged) {
						sHref = sLocRoot
						bChanged = true
					}
				}
				if (sHref.search('/$') > -1) {
					bChanged = true
					// No longer used
					/*
					if (document.links[i].rel == "php")
						sHref += "index.php"
					else
					*/
						sHref += "index.html"
				}
				if (bChanged) document.links[i].href = sHref
			}
		}
		// <img src="xx" />
		for (i = 0; i < document.images.length; i++) {
			var sSrc = document.images[i].src.toString()
			if (sSrc.search('^file:') == 0) {
				var bChanged = false
				if (sSrc.search('^' + GetLocRoot()) < 0) {
					//alert(sSrc)
					// Find out how much to lose of sSrc
					var iHrefIx
					var iMaxIx = Math.min(sSrc.length, sLocRoot.length)
					//alert(iMaxIx)
					for (iHrefIx = 0; (iHrefIx < iMaxIx) && (iHrefIx > -1); iHrefIx++) {
						if (sSrc[iHrefIx] != sLocRoot[iHrefIx]) {
							//alert(iHrefIx)
							sSrc = sLocRoot + sSrc.substr(iHrefIx)
							iHrefIx = -1
							bChanged = true
						}
					}
					if (!bChanged) {
						sSrc = sLocRoot
						bChanged = true
					}
				}
				if (sSrc.search('/$') > -1) {
					bChanged = true
					// No longer used
					/*
					if (document.images[i].rel == "php")
						sSrc += "index.php"
					else
					*/
						sSrc += "index.html"
				}
				if (bChanged) document.images[i].src = sSrc
			}
		}
	
		// Workaround: Maybe print
		if (location.search.toString() == '?print') MyPrint_1()
	}
} // fixFileProtocolLinks


function markNews_perDollar(dollar) {
	var sImg = (IsFileProtocol() ? GetLocRoot() : '/') + 'nyhed.png'
	sImg = ' <img src="' + sImg + '" class="nyhed" />'
	dollar.each(function(i){
		var dollarThis=$(this)
		var sHtml = dollarThis.html()
		var iIx = sHtml.indexOf('<br')
		sHtml = (iIx < 0) ? sHtml + sImg : sHtml.replace('<br', sImg + '<br')
		dollarThis.html(sHtml)
	})
} // markNews_perDollar

function markNews() {
	var dollarNyhed = $('td.nyhed')
	var dollarHemmelighed = $('td.hemmelighed')
	markNews_perDollar(dollarNyhed)
	markNews_perDollar(dollarHemmelighed)
	var sHemmelighed = 'Det\' en hemm\'li\'hed!'
	dollarHemmelighed.each(function(i){
		$(this).find('a').attr('href','javascript:alert("' + sHemmelighed + '")').attr('title',sHemmelighed).css('color','gray').css('font-style','italic')
	})
} // markNews

var dollarWhereToLoadOld = null

function loadOld_callback(responseText, textStatus, XMLHttpRequest) {
	dollarWhereToLoadOld.attr('bolgen_loaded', 'true')
	showOld(true)
} // loadOld_callback

function loadOld(sFileToLoad, sWhereToLoad) {
	dollarWhereToLoadOld.load(sFileToLoad,loadOld_callback)
} // loadOld


function showOld(bVisible, sFileToLoad, sWhereToLoad) {
	//var oH3s = $('h3.old')
	//var oTables = $('table.old')
	var oOlds = $('.old')
	var sToHide1 = ''
	var sToHide2 = ''
	var sToShow1 = ''
	var sToShow2 = ''
	if (bVisible) {
		oOlds.show()
		sToHide1 = '#idShowOld'
		sToHide2 = '.showOld'
		sToShow1 = '#idHideOld'
		sToShow2 = '.hideOld'
	}
	else {
		oOlds.hide()
		sToHide1 = '#idHideOld'
		sToHide2 = '.hideOld'
		sToShow1 = '#idShowOld'
		sToShow2 = '.showOld'
	}
	$(sToHide1).hide()
	$(sToHide2).hide()
	$(sToShow1).show()

	if ((bVisible) && (sFileToLoad != null) && (sWhereToLoad != null)) {
		dollarWhereToLoadOld = $(sWhereToLoad)
		if (dollarWhereToLoadOld.attr('bolgen_loaded') != 'true') {
			dollarWhereToLoadOld.show()
			window.setTimeout('loadOld("' + sFileToLoad + '")', 50)
			return
		}
	}
	$(sToShow2).show()
} // showOld


function loadNav(sIgnoredInputPath) {
	// ignore input sOfsPath
	var sOfsPath = GetLocRoot()

	$('h1').after('<div id="idNavMobile"></div>')
	var obj = IsMobile() ? $('#idNavMobile') : $('#idNav')
	var sPath = sOfsPath + (IsMobile() ? 'NavMobile.html' : 'Navigation.html')
	if (IsFileProtocol()) {
		obj.html(
			'<iframe id="idNav2" class="nav" src="'
			+ sPath + '?parent=' + document.location
			+ '" frameborder="0" style="height:60px;"></iframe>'
		)
	}
	else {
		obj.load(sPath + ' #idNavTable', function(responseText, textStatus){
			if (textStatus != 'success') obj.html('error loading "' + sPath + '"')
		})
	}
	if (IsMobile()) {
		//$('body table').width(2000)
		$('h1').css('font-size', '32pt')//.width(1000)
		$('h2').css('font-size', '32pt')
		$('h3').css('font-size', '28pt')
		$('h4').css('font-size', '20pt')
		$('.dato').css('font-size', '20pt').css('width', '130px')
		$('.dato-bred').css('font-size', '20pt').css('width', '180px')
		$('.kalenderImg img').height(120)
		$('.kalenderImg').width(200)
		$('#idScrollDiv').css('font-size', '28pt')
	}
	else {
		obj.show()
	}
} // loadNav


function goNavMobile(o) {
	var sLoc = IsFileProtocol() ? GetLocRoot() + o.value + 'index.html' : '/' + o.value
	if (IsFileProtocol()) {
		top.location = sLoc
	}
	else {
		location = sLoc
	}
	//alert(sLoc)
} // goNavMobile


function MyPrint_1() {
	if (IsFileProtocol()) {
		if (parent != this) {
			//alert('ged')
			var sParent = location.search.toString()
			if (sParent.search(/^\?parent=/) == 0) {
				sParent = sParent.substr(8)
				//alert(sParent)
				parent.location.replace(sParent + "?print")
				return
			}
		}
	}
	$('#idNav').hide()
	$('#idScrollDiv').height('auto')
	//window.print()
	window.setTimeout('MyPrint_2()', 100)
} // MyPrint_1

function MyPrint_2() {
	var iMaxTimeout = 6000
	var dt0 = new Date()
	window.print()
	var dt1 = new Date()
	var iDiffMs = dt1.getTime() - dt0.getTime()
	if (iDiffMs >= 3000) MyPrint_3()
	else window.setTimeout('MyPrint_3()',iMaxTimeout-iDiffMs)
} // MyPrint_2

function MyPrint_3() {
	if (location.search.toString() == "?print")
		location.replace(location.pathname)
	else {
		$('#idNav').show()
		sanitizeHeights()
	}
} // MyPrint_3


function RunBlink() {
	var dt = new Date()
	var bOn = (dt.getMilliseconds() >= 500)
	var sOn = bOn ? 'inherit' : 'red'
	$('.blink').css('color', sOn)
} // RunBlink

function StartBlink() {
	window.setInterval(function(){RunBlink()}, 100)
} // StartBlink


function MyOnReady(bTitlesFromPath) {
	$(document).ready(function(){
		loadNav('../../')
		sanitizeHeights()
		fixFileProtocolLinks()
		markNews()
		StartBlink()
		
		if (bTitlesFromPath) pathToTitles()
	})
} // MyOnReady