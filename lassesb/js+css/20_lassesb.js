var bEnglish = false//(document.getElementsByTagName('body')[0].lang.toString() == "en")
//alert(window.lang)

//alert('hvad?')

var bIsTinyScreen = (screen.height + screen.width) < 1200
function IsTinyScreen() {
    return bIsTinyScreen
} // IsTinyScreen


var bIsFileProtocol = null
function IsFileProtocol() {
    if (bIsFileProtocol==null) {
        bIsFileProtocol = (location.protocol.search("file") == 0)
    }
    return bIsFileProtocol
} // IsFileProtocol


function GetLocRoot() {
    if (g_sLocRoot==null) {
        return '/' // Fallback. This is *not* going to be be a good day.
    }
    return g_sLocRoot
} // GetLocRoot


var sLocOffset = null
function GetLocOffset(bKeepDocName = true, bMaybeKeepHash = false) {
    if (sLocOffset==null) {
        var sRoot = GetLocRoot()
        var iRootLen = sRoot.length
        sLocOffset = document.location.toString()
        var sRest = sLocOffset.substr(iRootLen, sLocOffset.length-1)

        // Find some characters:
        var iLastSlashIx = sRest.lastIndexOf('/')
        var iLastHashIx = sRest.lastIndexOf('#')
        if (iLastHashIx < iLastSlashIx) iLastHashIx = -1; // '#' isn't rel.

        // Maybe remove '#' part:
        if (iLastHashIx >= 0) {
            if (!bMaybeKeepHash || !bKeepDocName) {
                if (iLastHashIx >= 0) sRest = sRest.substr(0, iLastHashIx)
                // Note: If docname is removed,
                // and there's a '#' part, that dies implicitly too.
            }
        }

        // Maybe remove document name part:
        if (!bKeepDocName) {
            // Remove name of document (if there):

            // Check end of string (neg. index only works in ie9 and newer):
            var bHtml = (sRest.substr(-5).toLowerCase() == '.html')
            var bPhp  = (sRest.substr(-4).toLowerCase() == '.php')

            if (bHtml || bPhp) {
                // Remove document name for recognised document types only:
                if (iLastSlashIx < 0) {
                    sRest = '' // No path.. (Why?? should at least be '/'?)
                }
                else {
                    sRest = sRest.substr(0, iLastSlashIx+1)
                }
            }
        }

        sLocOffset = sRest
    }
    return sLocOffset
} // GetLocOffset


var sLocPathOnly = null
function GetLocPathOnly() {
    if (sLocPathOnly==null) {
        sLocPathOnly = document.location.toString()
        var iSlashIx = sLocPathOnly.lastIndexOf('/')
        if (iSlashIx >= 0) sLocPathOnly = sLocPathOnly.substr(0, iSlashIx + 1)
    }
    return sLocPathOnly
}


function Danify(str) {
    //alert(str)
    var iIx = str.search(/\d{4}\-\d\d\-\d\d/)
    if (iIx >= 0) {
        str = str.substr(0, iIx + 4) + '_' + str.substr(iIx + 5, 2) + '_' + str.substr(iIx + 8)
    }
    //return str.replace(/---/g,' _ ').replace(/;/g,':').replace(/-/g,' ').replace(/ae/g,'æ').replace(/Ae/g,'Æ').replace(/oe/g,'ø').replace(/Oe/g,'Ø').replace(/aa/g,'å').replace(/Aa/g,'Å').replace(/_/g,'-').replace(/\$/g,'?')
    str = str.replace(/---/g,' _ ').replace(/;/g,':').replace(/-/g,' ').replace(/ae/g,'æ').replace(/Ae/g,'Æ').replace(/oe/g,'ø').replace(/Oe/g,'Ø').replace(/aa/g,'å').replace(/Aa/g,'Å').replace(/_/g,'-')
    iIx = 0
    while (iIx > -1) {
        iIx = str.indexOf('$', iIx)
        if (iIx > -1) {
            var str1 = str.substr(0, iIx)
            var str2 = str.substr(iIx+1)
            var cReplace = '?'
            if (str2 > '') {
                switch (str2[0]) {
                case '0': cReplace = '?'; str2 = str2.substr(1); break
                case '1': cReplace = '!'; str2 = str2.substr(1); break
                case '2': cReplace = ':'; str2 = str2.substr(1); break
                case '3': cReplace = ';'; str2 = str2.substr(1); break
                case '$': cReplace = '$'; str2 = str2.substr(1); break
                }
            }
            str = str1 + cReplace + str2
            //alert(str)
        }
    }
    return str
} // Danify


function SetTitleForLinksWithTargetBlank() {
    var i = document.links.length - 1
    for ( ; i>=0; i--) {
        var o = document.links[i]
        if (o.target == "_blank") {
            if ((o.title == null) || (o.title == "")) {
                o.title = "Åbner i ny fane eller vindue"
            }
        }
    }
} // SetTitleForLinksWithTargetBlank


function CreateHeaderOverview_FindOrMakeName(dollarHeader, bFirst) {
    var sName = dollarHeader.find('a').attr('name')
    if ((sName == null) || (sName == "")) {
        sName = dollarHeader.text()
        sName = sName.replace(/[\.\-\? ]/g,'_').replace(/Æ/g,'AE').replace(/æ/g,'ae').replace(/Ø/g,'OE').replace(/ø/g,'oe').replace(/Å/g,'AA').replace(/å/g,'aa').replace(/é/g,'e')
        sName = sName.replace(/"/g,'\'\'')
        dollarHeader.html('<a name="' + sName + '"></a>' + dollarHeader.html())
    }
    return sName;
} // CreateHeaderOverview_FindOrMakeName

function CreateHeaderOverview_Display() {
    var dollarBody = $(document)
    var sBodyWidth = dollarBody.width()
    //alert(sBodyWidth)
//  dollarBody.css('width', 'inherit')
    $('td.header-overview').show()
    bHeaderOverviewVisible = true
    //MyOnResize()
} // CreateHeaderOverview_Display

var bHeaderOverviewVisible = false

function CreateHeaderOverview() {
    // Find out if there is already an overview column
    var dollarHeaderOverview = $('div.header-overview')
    if (dollarHeaderOverview.length == 0) {
        var dollarTD_HO = $('td.header-overview')
        if (dollarTD_HO.length == 0) {
            var dollarBody = $('body')
            var sBodyWidth = dollarBody.css('width')
        //  dollarBody.css('width', 'inherit')
            var sBodyOrg = dollarBody.html()
            //alert(sBodyOrg)
            dollarBody.html(
                '<table cellpadding="0" cellspacing="0" style="width:100%;"><tr>'
                + ' <td style="width:' + sBodyWidth + ';">' + sBodyOrg + '</td>'
                + ' <td class="header-overview"><div class="header-overview">'
                + '     <center>(loading...)</center>'
                + ' </div></td>'
                + '</tr></table>'
            )
        }
        else {
            dollarTD_HO.html('<div class="header-overview"></div>')
        }
    }
    dollarHeaderOverview = $('div.header-overview')

    var sOverview = '<h4>Overskrifter p&aring;&nbsp;siden</h4><hr class="colored" />'
    $(document).find('*').each(function(){
        var dollarThis = $(this)
        if (dollarThis.is('h3')) {
            sScrollTo = CreateHeaderOverview_FindOrMakeName(dollarThis)
            sOverview += ''
                + '<table cellpadding="0" cellspacing="0"><tr><td class="ho-h3">'
                + '<a href="#' + sScrollTo + '">'
                + dollarThis.text() + '</a>'
                + '</td></tr></table>';
        }
        else if (dollarThis.is('h4')) {
            sName = CreateHeaderOverview_FindOrMakeName(dollarThis)
            sOverview += '<table cellpadding="0" cellspacing="0" width="100%"><tr><td class="ve-h4">-</td>'
                + '<td class="ho-h4"><a href="#' + sName + '">'
                + dollarThis.text() + '</a></td></tr></table>';
        }
        else if (dollarThis.is('h5')) {
            sName = CreateHeaderOverview_FindOrMakeName(dollarThis)
            sOverview += '<table cellpadding="0" cellspacing="0" width="100%"><tr><td class="ve-h5">--</td>'
                + '<td class="ho-h5"><a href="#' + sName + '">'
                + dollarThis.text() + '</a></td></tr></table>';
        }
    })
    dollarHeaderOverview.html(sOverview)

    // LSB - Added 2012-08-06
    //CreateHeaderOverview_Display()
} // CreateHeaderOverview


function getURLPathOnly(sSubPathToAdd)
{
    if (sSubPathToAdd == null) sSubPathToAdd = ""
    if (location.protocol.search("file") == 0) sSubPathToAdd += "index.html"

    var sPathName = location.pathname
    var iFirstSlash = sPathName.indexOf('/')
    var iLastlassesb = sPathName.lastIndexOf('/lassesb/')
    if (iFirstSlash < 0) return "/" + sSubPathToAdd
    if (iLastlassesb >= 0) return sPathName.substr(0, iLastlassesb + 9) + sSubPathToAdd
    return sPathName.substr(0, iFirstSlash + 1) + sSubPathToAdd
} // getURLPathOnly


var sDisplayTable   = 'table'
var sDisplayTd      = 'table-cell'

var f_ieVersion = -1.0; // Assume not internet explorer.
if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    //alert(ua)
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null) f_ieVersion = parseFloat( RegExp.$1 );
}
if ((f_ieVersion > 0.0) && (f_ieVersion < 8.0)) {
    // Early Internet Explorer versions are quirky:
    //alert(ieVersion)
    sDisplayTable = 'block'
    sDisplayTd = 'block'
}


function upCaseFirstLetter(s)
{
    var s1 = ''
    if ((s) && (typeof(s).toLowerCase() == 'string')) {
        if (s.length > 0) s1 = s.substr(0,1).toLocaleUpperCase()
        if (s.length > 1) s1 += s.substr(1)

    }
    else {
        // something has broken! show debug info:
        alert(typeof(s))
    }
    return s1
} // upCaseFirstLetter


function setObjTitle(o, sTitle) {
    if (o == null) {
        // Set title of entire page:
        document.title = sTitle
    }
    else {
        // Set title of an element:
        o.title = sTitle
        //if (o.tagName.toLowerCase() == "img") o.alt = sTitle
        if (o.alt) a.alt = sTitle
    }
} // setObjTitle


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


var bMyOnResize_Installed = false
function MyOnResize() {
    if (IsTinyScreen()) return

    var dMain = $('div.main')
    if (dMain.size() == 0) return
    //alert(dollarScrollDiv)

    var dHosting = $('div.hosting')
    //alert(dMain.offset().top)
    var dWindow = $(window)
    var dHO = $('div.header-overview')
    if (bHeaderOverviewVisible) {
        dHO.css('overflow','hidden')
        dHO.height('30px')//.width(-920+$(document).width())
        dHO.hide()
        //dHO.css('display','none')
    }
    var iHeight = dWindow.height() - dMain.offset().top - dHosting.height() - 21
    dHO.height((dWindow.height()-20) + 'px')
    if (bHeaderOverviewVisible) {
        //dHO.css('display','block')//.css('overflow','auto')
        //dHO.css('display','block').css('position','relative').css('overflow','auto')
        //dHO.css('display','inline-table').css('position','relative').css('overflow','auto')
    }
    // LSB - Added 2012-07-30
    iHeight -= 2 // Border-top på div.hosting
    // LSB - Added 2014-10-27:
    iHeight -= 5 // Better to small than too big
    //dMain.height(iHeight).css('overflow-y', 'scroll').css('overflow-x', 'auto').css('display', 'block')
    dMain.height(iHeight).css('overflow-y', 'scroll').css('overflow-x', 'auto')
    dMain.show()
    //alert($(document).height())
    if (bHeaderOverviewVisible) {
        dHO.css('overflow','auto').css('font-size','inherit')
        dHO.show()
        dHO.width('inherit')
        var idHO_width = -920+$(window).width()
        dHO.width(idHO_width)
        $('td.header-overview').width(idHO_width)
        //alert(idHO_width)
        //dHO.width('inherit')
    }
    // .. LSB
    //$('td.body').css('height','100px').css('overflow','hidden')
    //$('td.body').css('border','1px solid red')
    //$('body').css('overflow','hidden')
    //$('td.body').height(iHeight)//.css('display','block')//.css('overflow','hidden')
    //$('td.body').css('display','block')//.css('overflow','hidden')
    //var sGemLigeLidt = dHO.html()
    //dHO.text('')
    //dHO.html(sGemLigeLidt)
    //$('body table').css('display','block')
    //$('body').css('display','inline')//.css('overflow','hidden')
    //$('td.body').css('display','')

    if (!bMyOnResize_Installed) {
        // First run - make sure it's automatic next time:
        bMyOnResize_Installed = true
        window.onresize = MyOnResize
        document.onresize = MyOnResize

        // Also set focus to part of page that can scroll:
        dMain.attr('tabindex',1).focus().click() // << doesn't work...
    }
} // MyOnResize


var sLicensedWork = ''
var dollarDivCC = null

function onCCLoaded(responseText, textStatus) {
    if (textStatus == "success") {
        //alert(dollarDivCC)
        if (sLicensedWork != '') dollarDivCC.find('#idLicensedWork').text(sLicensedWork)
        dollarDivCC.find('#idLicensedHref').attr('href',document.location)
        dollarDivCC.show()
        MyOnResize()
        //alert(textStatus)
    }
    else {
        dollarDivCC.html('error loading CC.html<br>try reloading page')
    }
} // onCCLoaded

function LoadCC() {
    var bBoth = false
    var b40 = false
    dollarDivCC = $('div.creative_commons')
    sLicensedWork = dollarDivCC.text()
    if (sLicensedWork == '') {
        dollarDivCC = $('div.creative_commons_both')
        sLicensedWork = dollarDivCC.text()
        if (sLicensedWork != '') {
            bBoth = true
        }
        else {
            dollarDivCC = $('div.creative_commons_40')
            sLicensedWork = dollarDivCC.text()
            if (sLicensedWork != '') {
                b40 = true
            }
        }
    }

    if (sLicensedWork != '') {
        if (!bBoth) {
            // One license only:
            var sFile = 'CC_3.0.html'
            if (!b40) {
                var sModified = $('[itemprop="dateModified"]').html()
                if ((sModified != null) && (sModified != '')) {
                  //alert(sModified)
                  if (sModified > "2015-06-01") {
                    //alert(sModified)
                    // New audio; uses CC 4.0 rather than 3.0:
                    b40 = true
                  }
                }
            }
            if (b40) sFile = 'CC_4.0.html'

            var sPath = GetLocRoot() + 'js+css/'+sFile+' #idCC-licens'
            //alert(sPath)
            dollarDivCC.load(sPath, function(responseText, textStatus){onCCLoaded(responseText, textStatus)})
        }
        else {
            // Both licenses:
            var sFile = 'CC_3.0_4.0.html'
            var sPath = GetLocRoot() + 'js+css/'+sFile+' #idCC-licens'
            dollarDivCC.load(sPath, function(responseText, textStatus){onCCLoaded(responseText, textStatus)})
        }
    }
} // LoadCC


function ModifyH1AndTitle() {
    var dollarH1 = $('h1')
    var dollarH2 = $('h2')
    var strH1 = dollarH1.text()
    var strH2 = dollarH2.text()
    var strTitle = strH1
    var strLocOfs = GetLocOffset()
    var aryPaths = strLocOfs.split('/')
    var iAryLen = aryPaths.length
    if (iAryLen > 0) {
        var strLast = aryPaths[iAryLen-1]
        //alert(strLocOfs)
        //alert(iAryLen)
        //alert(strLast)
        if ((strLast == '') || (strLast == 'index.html')) {
            iAryLen--
        }
        else {
            var iExtIx = strLast.lastIndexOf('.')
            if (iExtIx >= 0) {
                aryPaths[iAryLen-1] = strLast = strLast.substr(0, iExtIx)
            }
        }
        if (iAryLen > 0) {
            var i
            var strHref = GetLocRoot()
            strH2 = ''
            strTitle = ''
            var iLast = iAryLen - 1
            for (i = 0; i < iAryLen; i++) {
                var strPath = aryPaths[i]
                strHref += strPath + '/'
                var strPathDanified = Danify(strPath)

                if (i > 0) {
                    //strTitle += ' / '
                    strTitle = ' / ' + strTitle
                    strH2 += ' / '
                }
                if (i == 0) {
                    var bVelkommen = (i == iLast) && ((strPath != 'Musik') && (strPath != 'Mad'))
                    if (bVelkommen) {
                        strH1 = 'Velkommen!'
                        //strTitle = strH1 + ' / '
                        strTitle = ' / ' + strH1
                    }
                    else {
                        strH1 = strPathDanified
                    }
                }
                if (i == iLast) strH2 += strPathDanified
                else strH2 += '<a itemprop="breadcrumb" href="' + strHref + '">' + strPathDanified + '</a>'

                strTitle = strPathDanified + strTitle
                //dollarH2.text('abe: '+strLast)//aryPaths[iAryLen-1])
            }
            dollarH1.html(strH1)
            dollarH2.html(strH2)
        }
    }
    if (iAryLen == 0) {
        if (strH1 != strH2) strTitle = strH2 + ' / ' + strTitle
    }
    //alert(strLocOfs)
    //var bSame = (strH2 == strH1)
    //if (!bSame) strTitle += ' / ' + strH2
    strTitle += ' - Lasse Steen Bohnstedt'
    dollarH1.html('<table width="100%" cellpadding="0" cellspacing="0"><tr><td class="h1_extra"><span>&nbsp;LasseSB&nbsp;</span><p>jcxz100</p></td><td id="idH1Orig">' + strH1 + '</td></tr></table>')
    document.title = strTitle

} // ModifyH1AndTitle


function SetHosting() {
    $('div.hosting').html(
        'Free <a href="http://host-ed.net/" target="_blank">Web Hosting</a>'
        + ' by <a href="http://host-ed.net/" target="_blank">'
        + '<img src="/pix/common/host-ed-logo-smaller-bg-graded.png" alt="host-ed.net" '
        + 'onload="if (bIsReady) MyOnResize();" '
        + 'style="height: 25px; display:inline; vertical-align:bottom; '
        + '<span style="font-family:Sans-Serif; font-size-adjust:150%; font-weight: bolder;">'
        + ' - QUALITY WEB HOSTING</span></a>'
    ).css('background', g_sLocRoot+'pix/common/hosting-bg.gif').css('background-color', 'transparent')
    //alert(g_sLocRoot+'pix/common/hosting-bg.png')
} // SetHosting

//function SetHosting_fixImgBaseline


function SetOpdateret() {
    var dollar = $('div.opdateret')
    var s = dollar.html()
    if ((s != null) && (s != '')) {
        s = 'Denne side opdateret ' + s + ' af '
        +'<a href="/Hvem-mig$/" rel="me">Lasse Steen Bohnstedt</a>.'
        dollar.html(s)
    }
} // SetOpdateret


var iJPlayers = 0

function LoadJPlayer_new(
  oContainer, bKeepVisible, sWhat,
  sM4aFile, sOgaFile, sMp3File, sYoutubeId, sLength,
  sAboutFile, sStructureFile, sSheetFile, sLyricsFile, sMixDetails,
  sFront, sFrDate, sThoughts, sThDate
) {
  var iIx = ++iJPlayers

  // Put in the index of this player (for debug):
  $(oContainer).html(
    '<div class="index" style="display:none;">' + iIx + '</div>'
    + $(oContainer).html()
  )

  // Append div for player to be loaded into:
  $(oContainer).html(
    $(oContainer).html()
    +'<div class="lasse-here-be-dragons">lasse: here be dragons</div>'
  )
  //alert($(oContainer).html())

  // Info needed to create player:
  var sToLoad =
    GetLocRoot()+'/js+css/20_my-jPlayer.php'
    +'?scripts-dir='+GetLocRoot()+'/js%2bcss/jplayer.2.9.2'
    +'&index='+iIx
    +'&delay-connect=' + (bKeepVisible ? '0' : '1')
    +'&what='+sWhat
    +'&m4a='+sM4aFile
    +'&oga='+sOgaFile
    +'&mp3='+sMp3File
    +'&length='+sLength
    +'&about='+sAboutFile
    +'&structure='+sStructureFile
    +'&lyrics='+sLyricsFile
    +'&sheet='+sSheetFile
    +'&youtube-id='+sYoutubeId
    +'&mix-details='+sMixDetails
    +'&front='+sFront
    +'&front-date='+sFrDate
    +'&thoughts='+sThoughts
    +'&thoughts-date='+sThDate
  $(oContainer).children('.lasse-here-be-dragons').load(sToLoad,function(response, status, xhr){
    //alert(status)
    if ( status == "error" ) {
      var msg = "Sorry but there was an error:<br/>";
      $(oContainer).html( msg + xhr.status + " " + xhr.statusText );
    }
    else {
        MaybeFixUrls(oContainer)
    }

    //alert('hm?')
  })
} // LoadJPlayer_new

function getStringFromChild(oThis, sChild, sDefault = '', bHideAfter = false, bFixSpaces = true) {
  var sReturn = sDefault

  var dollarChild = $(oThis).find(sChild)
  if (dollarChild != null) {
    var s = dollarChild.html()
    if (bHideAfter) dollarChild.hide()
    if ((bFixSpaces) && (s != null)) s = s.trim().replace(/ /g,'+')
    if (s != '') sReturn = s
  }

  return sReturn
} // getStringFromChild

function LoadAllJPlayers(sMp3File, sOggFile, bKeepVisible, oParent) {
  //$(document).find('#myJPlayer').each(alert(this.html()))
  //alert($(document).find('myJPlayer'))

  $('.myJPlayer').each(
    function(i) {
      // General settings/info:
      var sKeep     = getStringFromChild(this, '.keep', 'false', true)
      var bKeep     = (sKeep == "true")
      var sWhat     = getStringFromChild(this, '.what', 'musikken', true)
      //
      // Media:
      var sM4a      = getStringFromChild(this, '.m4a',  '', true)
      var sOgg      = getStringFromChild(this, '.ogg',  '', true)
      var sMp3      = getStringFromChild(this, '.mp3',  '', true)
      var sYId      = getStringFromChild(this, '.youtube', '', true)
      var sLength   = getStringFromChild(this, '.length', '', true)
      //
      // Various texts:
      var sAbout    = getStringFromChild(this, '.about', '', true)
      var sStruct   = getStringFromChild(this, '.structure',  '', true)
      var sSheet    = getStringFromChild(this, '.sheet',  '', true)
      var sLyrics   = getStringFromChild(this, '.lyrics', '', true)
      var sMix      = getStringFromChild(this, '.mix', '', true)
      //
      // Thoughts and old front page for this version:
      var sFront    = getStringFromChild(this, '.front', '', true)
      var sFrDate   = getStringFromChild(this, '.front-date', '', true)
      var sThoughts = getStringFromChild(this, '.thoughts', '', true)
      var sThDate   = getStringFromChild(this, '.thoughts-date', '', true)

      LoadJPlayer_new(
        this, bKeep, sWhat,
        sM4a, sOgg, sMp3, sYId, sLength,
        sAbout, sStruct, sSheet, sLyrics, sMix,
        sFront, sFrDate, sThoughts, sThDate
      )
    }
  )

} // LoadAllJPlayers


function testhest() {
document.writeln('testhest')
}

function ScrollToLicense_After() {
    var dollarTbl = $('table.CC-license')
    dollarTbl.css('backgroundColor','#BBF')
    window.setTimeout(function(){dollarTbl.css('backgroundColor','inherit')}, 250)
} // ScrollToLicense_After

function ScrollToLicense() {
    var iTimeMs = 1000
    var dollarToAnimate = null
    var iTopNew = 0
    if (IsTinyScreen()) {
        dollarToAnimate = $('html, body')
        iTopNew = $(document).height()-$(window).height()
    }
    else {
        dollarToAnimate = $('div.main')
        iTopNew = (dollarToAnimate.prop("scrollHeight") - dollarToAnimate.height())
    }
    if (iTopNew <= 0) ScrollToLicense_After()
    else {
        if (iTopNew < 500) iTimeMs = iTopNew * 2
        dollarToAnimate.animate(
            { scrollTop: iTopNew },
            iTimeMs,
            function() { ScrollToLicense_After(); }
        );
    }
} // ScrollToLicense


function ScrollToBottom() {
    var iTimeMs = 1000
    var dollarToAnimate = null
    var iTopNew = 0
    if (IsTinyScreen()) {
        //dollarToAnimate = $('html, body')
        dollarToAnimate = $('body')
        iTopNew = $(document).height()-$(window).height()
    }
    else {
        dollarToAnimate = $('div.main')
        iTopNew = (dollarToAnimate.prop("scrollHeight") - dollarToAnimate.height())
    }
    if (iTopNew > 0) {
        if (iTopNew < 500) iTimeMs = iTopNew * 2
        dollarToAnimate.animate(
            { scrollTop: iTopNew },
            iTimeMs
        );
    }
} // ScrollToBottom


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


function FixUrl(sUrl) {
    if (sUrl == undefined) return ''
    if (sUrl.substr(0,1) == '/') {
        // This has a semi-absolute path within my web site
        if (sUrl.substr(0, g_sLocRoot.length) == g_sLocRoot) {
            // Already has correct root - do nothing
        }
        else {
            return g_sLocRoot + sUrl.substr(1)
        }
    }
    else {
        var s = sUrl.substr(0,g_sLocRoot_without_lassesb.length)
        if (s == g_sLocRoot_without_lassesb) {
            // This has a fully-absolute path within my web site
            // First make sure it hasn't already been converted:
            s = sUrl.substr(0,g_sLocRoot.length)
            if (s == g_sLocRoot) {
                // This has already been converted (how, why?!)
                //show_hang('Path has already been converted once:\n' + s)
            }
            else {
                return g_sLocRoot + sUrl.substr(g_sLocRoot_without_lassesb.length)
            }
        }
    }

    // Do nothing, indicated by empty string:
    return ''
} // FixUrl(sUrl)

function FixUrl_file(sUrl) {
    var s = FixUrl(sUrl)
    if (s != '') sUrl = s
    if (sUrl.substr(sUrl.length - 1) == '/') {
        sUrl += 'index.html'
    }
    return sUrl
} // FixUrl_file(sUrl)


var g_sLocRoot_without_lassesb = g_sLocRoot

function MaybeFixUrls(oDomain) {
    if (g_sLocRoot == '/') {
        // We do not need to fix addresses of anything:
        return
    }

    if (oDomain == null) oDomain = document
    //else alert(oDomain)

    // Find loc-root without lassesb:
    var sLSB = '/lassesb/';
    var i = g_sLocRoot.lastIndexOf(sLSB);
    if (i < 0) g_sLocRoot_without_lassesb = g_sLocRoot;
    else g_sLocRoot_without_lassesb = g_sLocRoot.substr(0, i + 1);

    var bFile = false
    if (g_sLocRoot.substr(0,5).toLowerCase() == 'file:') {
        // The "FILE:" protocol is a little different
        bFile = true
    }

    $(oDomain).find('*').each(function(){
        var dollarThis = $(this)
        if (dollarThis.is('img')) {
            var s=dollarThis.attr('src')
            s = FixUrl(s)
            if (s != '') dollarThis.attr('src',s)
        }
        else if (dollarThis.is('a')) {
            var s=dollarThis.attr('href')
            if (bFile) s = FixUrl_file(s)
            else s = FixUrl(s)
            if (s != '') dollarThis.attr('href',s)
        }
        else {
            var s = dollarThis.css('background-image')
            if ((s != undefined) && (s != null) && (s != 'none')) {
                sUrlRemoved=''
                if ((s.substr(0,4) == 'url(') && (s.substr(s.length-1) == ')')) {
                    s = s.substr(4,s.length-5)
                    sUrlRemoved='url('
                }
                var s0 = s.substr(0,1)
                var s1 = s.substr(s.length-1)
                var sQuoteRemoved = ''
                if ((s0 == '\'') || (s0 == '"')) {
                    if (s0 = s1) {
                        sQuoteRemoved = s0
                        s = s.substr(1,s.length-2)
                    }
                }
                s = FixUrl(s)
                if (s != '') {
                    s = sQuoteRemoved + s + sQuoteRemoved
                    if (sUrlRemoved != '') s = sUrlRemoved + s + ')'
                    dollarThis.css('background-image',s)
                }
            }
        }
    })
} // MaybeFixUrls()


var iReady = 0
var bIsReady = false

function MyReady_Part2() {
    // LSB - added 2012-08-06
    if (!IsTinyScreen()) {
/*        bOKToLoadJPlayer = false // Don't load JPlayers again! Would crash browser.*/
        CreateHeaderOverview()
        // Now that body contents have been relocated, it's ok to actually connect the JPlayer
/*        if (iPlayerToConnectAfterRelocateIx >= 0) {
            // Connect JPlayer after a tiny delay (so we don't disturb document.ready execution):
            //window.setTimeout('ConnectJPlayer(' + iPlayerToConnectAfterRelocateIx + ')', 100)
            ConnectJPlayer(iPlayerToConnectAfterRelocateIx)
        }
        iPlayerToConnectAfterRelocateIx = -1 */
    }
    // .. LSB

    MaybeFixUrls()
    LoadCC()
    ModifyH1AndTitle()
    SetHosting()
    SetOpdateret()
    LoadAllJPlayers() // <- New functionality: Load when everything ready
    if (!IsTinyScreen()) {
        var s = GetLocRoot() + 'Navigation.html #idNav'
        $('td.nav').load(s, function(responseText, textStatus){
            if (textStatus != "success") {
                $('td.nav').html('error loading Navigation.html<br>try reloading page')
            }
            MaybeFixUrls()
            SetTitleForLinksWithTargetBlank()

            DoneLoading()
            MyOnResize()
        })
    }
    else {
        $('td').css('fontSize', '22pt')
        $('h1').css('fontSize', '40pt').after('<div id="idNavMobile"></div>')
        $('h2').css('fontSize', '32pt')
        $('h3').css('fontSize', '28pt')
        $('h4').css('fontSize', '22pt')
        $('#idH1Orig').width('500px').css('fontSize', '40pt')
        $('div.creative_commons').css('fontSize', '22pt')
        $('div.creative_commons_bith').css('fontSize', '22pt')
        $('div.creative_commons_40').css('fontSize', '22pt')
        $('.broedtekst').css('fontSize', '22pt').css('paddingLeft','10px')
        $('.copyright').css('fontSize', '22pt')
        $('#idNavMobile').load(GetLocRoot() + 'NavMobile.html #idNavToLoad', function(responseText, textStatus) {
            if (textStatus != "success") {
                $('#idNavMobile').html('error loading NavMobile.html<br>try reloading page')
            }
            $('td.nav').hide()
            $('td.main').width('920px')
            MaybeFixUrls()
            DoneLoading()
        })
    }
    //$('td.main').focus()

} // MyReady_Part2

$( document ).ready(function(){

    if (++iReady == 1) {
      // This method doesn't work anymore.
      // Gotta assume ie works too...
//        if ($.browser.msie) {
//            // To make internet explorer show "loading" we must be idle some time
//            window.setTimeout('MyReady_Part2()', 100)
//        }
//        else
        {
            // Other browsers (and google crawler) will handle it without pause
            MyReady_Part2()
            //alert('basti6')

        }
    }
    if (!IsTinyScreen()) MyOnResize()
    bIsReady = true
})


function MyPrint_1() {
    $('td.nav').hide()
    var iMainWidth = $('td.main').width()
    $('h1').width(iMainWidth)
    $('.h1_extra').hide()
    $('.hosting').width(iMainWidth)
    $('div.main').height('auto').css('overflow', 'auto')
    $('div.header-overview').hide()
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
    $('td.nav').show()
    $('div.header-overview').show()
    $('h1').width('auto')
    $('.h1_extra').show()
    $('.hosting').width('auto')
    MyOnResize()
} // MyPrint_3
