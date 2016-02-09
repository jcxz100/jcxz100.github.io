//document.title = 'hingste?'


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
function GetLocOffset(bKeepDocName, bMaybeKeepHash) {
    if (bKeepDocName == null) bKeepDocName = true
    if (bMaybeKeepHash == null) bMaybeKeepHash = true

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
            if ((o.title == null) || (o.title == undefined) || (o.title == "")) {
                o.title = "Åbner i ny fane eller vindue"
            }
        }
    }
} // SetTitleForLinksWithTargetBlank


function CreateHeaderOverview_FindOrMakeName(dollarHeader, bFirst) {
    var dollarA    = dollarHeader.find('a')
    if (dollarA.length == 0) {
        dollarHeader.html(
            '<a href="" name="">'
            + dollarHeader.html()
            + '</a>'
        )
        dollarA = dollarHeader.find('a')
    }
    var sName      = dollarA.attr('name')
    var sHref      = dollarA.attr('href')

    if ((sName == null) || (sName == '')) {
        var sNameNew = dollarHeader.text()
        sNameNew = sNameNew.trim()
        sNameNew = sNameNew.replace(/["':;,!=\(\)\.\-\? ]/g,'_')
        sNameNew = sNameNew.replace(/Æ/g,'AE').replace(/æ/g,'ae').replace(/Ø/g,'OE').replace(/ø/g,'oe').replace(/Å/g,'AA').replace(/å/g,'aa').replace(/é/g,'e')
        sNameNew = sNameNew.replace(/Ø/g,'OE').replace(/ø/g,'oe').replace(/Å/g,'AA').replace(/å/g,'aa').replace(/é/g,'e')
        sNameNew = sNameNew.replace(/Å/g,'AA').replace(/å/g,'aa').replace(/é/g,'e')
        sNameNew = sNameNew.replace(/é/g,'e').replace(/É/g,'E')
        //dollarHeader.html(
        //    '<a name="' + sNameNew + '"></a>'
        //    + dollarHeader.html()
        //)
        dollarA.attr('name', sNameNew)
        sName = sNameNew
    }
    if ((sHref == null) || (sHref == '')) {
        //dollarA.attr('href', '#' + sName)
        dollarA.attr('href', 'javascript:ScrollToName("' + sName + '");')
    }

    var sId   = 'id' + sName
    dollarA.attr('id', sId)

    return sName;
} // CreateHeaderOverview_FindOrMakeName

var bHeaderOverviewVisible = false

function CreateHeaderOverview_Display() {
    var dollarBody = $(document)
    var sBodyWidth = dollarBody.width()
    //alert(sBodyWidth)
//  dollarBody.css('width', 'inherit')
    $('td.header-overview').show()
    bHeaderOverviewVisible = true
    //MyOnResize()
} // CreateHeaderOverview_Display

function CreateHeaderOverview() {
    //alert('hvad sker der??')
    // Find out if there is already an overview column
    //
    //var dollarDivOverview = $('div.header-overview')
    ////alert(dollarDivOverview.length)
    //if (dollarDivOverview.length == 0) {
    //    var dollarTD_HO = $('td.header-overview')
    //    if (dollarTD_HO.length == 0) {
    //        var dollarBody = $('body')
    //        var sBodyWidth = dollarBody.css('width')
    //    //  dollarBody.css('width', 'inherit')
    //        var sBodyOrg = dollarBody.html()
    //        //alert(sBodyOrg)
    //        dollarBody.html(
    //            '<table cellpadding="0" cellspacing="0" style="width:100%;"><tr>'
    //            //+ ' <td style="width:' + sBodyWidth + ';">' + sBodyOrg + '</td>'
    //            + ' <td class="body">' + sBodyOrg + '</td>'
    //            + ' <td class="header-overview"><div class="header-overview">'
    //            + '     <center>(loading...)</center>'
    //            + ' </div></td>'
    //            + '</tr></table>'
    //        )
    //    }
    //    else {
    //        dollarTD_HO.html('<div class="header-overview"></div>')
    //        //alert('header overview already created.')
    //    }
    //}
    // Find out if there is already an overview column
    var dollarTD_HO = $('td.header-overview')
    var dollarDivOverview = $('div.header-overview')
    if (dollarTD_HO.length == 0) {
        var dollarBody = $('body')
        var sBodyWidth = dollarBody.css('width')
    //  dollarBody.css('width', 'inherit')
        var sBodyOrg = dollarBody.html()
        //alert(sBodyOrg)
        dollarBody.html(
            '<table cellpadding="0" cellspacing="0" style="width:100%;"><tr>'
            //+ ' <td style="width:' + sBodyWidth + ';">' + sBodyOrg + '</td>'
            + ' <td class="body">' + sBodyOrg + '</td>'
            + ' <td class="header-overview"><div class="header-overview">'
            + ' </div></td>'
            + '</tr></table>'
        )
    }
    else {
        dollarTD_HO.html('<div class="header-overview"></div>')
        //alert('header overview already created.')
    }
    dollarTD_HO = $('td.header-overview')
    dollarDivOverview = $('div.header-overview')
    //dollarTD_HO.style.display = 'none'
    dollarTD_HO.hide()

    var sOverview = '<div class="header-overview-head">'
                    + 'Overskrifter p&aring;&nbsp;siden'
                    + '</div>'//<hr class="colored" />'
                    + '<div class="header-over-view-body">'
    $(document).find('*').each(function(){
        var dollarThis = $(this)
        if (dollarThis.is('h3')) {
            var sName = CreateHeaderOverview_FindOrMakeName(dollarThis)
            var sHref = 'javascript:ScrollToName(\'' + sName + '\')'
            sOverview += ''
                + '<table xcellpadding="0" xcellspacing="0"><tr>'
                + '<td class="ho-h3">'
                + '<a href="' + sHref + '">'
                + dollarThis.text() + '</a></td></tr></table>';
            //window.setTimeout('function(){document.title = "<a href="javascript:ScrollToWhatever(#' + sScrollTo + )'">'),
            //window.setTimeout(function(){document.title = '\'' + sScrollTo2 + '\'';},3000)
        }
        else if (dollarThis.is('h4')) {
            var sName = CreateHeaderOverview_FindOrMakeName(dollarThis)
            var sHref = 'javascript:ScrollToName(\'' + sName + '\')'
            sOverview += '<table xcellpadding="0" xcellspacing="0" xwidth="100%"><tr><td class="ve-h4">-</td>'
                + '<td class="ho-h4">'
                + '<a href="' + sHref + '">'
                + dollarThis.text() + '</a></td></tr></table>';
        }
        else if (dollarThis.is('h5')) {
            var sName = CreateHeaderOverview_FindOrMakeName(dollarThis)
            var sHref = 'javascript:ScrollToName(\'' + sName + '\')'
            sOverview += '<table cellpadding="0" cellspacing="0" xwidth="100%"><tr><td class="ve-h5">--</td>'
                + '<td class="ho-h5">'
                + '<a href="' + sHref + '">'
                + dollarThis.text() + '</a></td></tr></table>';
        }
    })
    sOverview += '</div>'
    dollarDivOverview.html(sOverview)

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

    var dANav = $('a.nav')
    var iANavHeight = 0
    var dH2 = $('h2.new')

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
    //dHO.height((dWindow.height()-20) + 'px')
    //dHO.height((dWindow.height()-10) + 'px')
    dHO.height((dWindow.height()-8) + 'px')
    if (bHeaderOverviewVisible) {
        //dHO.css('display','block')//.css('overflow','auto')
        //dHO.css('display','block').css('position','relative').css('overflow','auto')
        //dHO.css('display','inline-table').css('position','relative').css('overflow','auto')
    }
    // LSB - Added 2012-07-30
    iHeight -= 2 // Border-top på div.hosting
    // LSB - Added 2014-10-27:
    //iHeight -= 5 // Better to small than too big
    iHeight -= 1 // Better to small than too big
    //dMain.height(iHeight).css('overflow-y', 'scroll').css('overflow-x', 'auto').css('display', 'block')
    if (iHeight < 200) iHeight = 200 // always show a little
    dMain.height(iHeight).css('overflow-y', 'scroll').css('overflow-x', 'auto')
    dMain.show()
    //alert($(document).height())
    if (bHeaderOverviewVisible) {
        //$('div.header-overview-head').height(''+$('h1').scrollHeight+'px')
        $('.header-overview-head').height(100)//''+$('h1').scrollHeight+'px')
        dHO.css('overflow','auto').css('font-size','inherit')
        dHO.show()
        dHO.width('inherit')
        //var idHO_width = -920+$(window).width()
        var idHO_width = -808+$(window).width()
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
        //alert('bæster')

        var dAryAs = dMain.find('a#id'+g_sH1Hash)
        if (dAryAs.length == 0) dAryAs = dMain.find('a')
        //alert(aryAs)
        //alert(aryAs.length)
        //alert(aryAs[0])
        //var aryA0 = aryAs[0]
        //alert('demdem')
        //aryS[0].focus()
        //dAryAs.focus // <-- fallback (focus last A in div.main)
        var bFocusDone = false
        dAryAs.each(function(){
            if (!bFocusDone) {
                //alert('hm?')
                //bFocusDone = true
                var dThis = $(this)
                //alert('what?')
                //alert(dThis)
                var sHref = dThis.attr('href')
                //alert(sHref)
                if ((sHref) && (sHref != '')) {
                    if (true) {//(sHref.search('javascript') < 0) {
                        //dThis.delay(100).focus()
                        window.setTimeout(
                            function(){
                                dThis.focus();
                                //dThis.blur()
                                // Virker ikke på chrome:
                                //dMain.focus();
                            },
                            1000
                        )
                        //alert('set')
                        bFocusDone = true
                    }
                }
            }
        })
        //dNav.html(aryAs[0].attr('href'))
        if (!bFocusDone) {
            // Doesn't work on chrome...
            dMain.focus()
            //dMain.blur()
        }
        //else {
        //    alert('dotdorthe')
        //}
    }
} // MyOnResize


var sCCFile = ''
var sLicensedWork = ''
var dollarDivCC = null

function onCCLoaded(responseText, textStatus) {
    if (textStatus == "success") {
        //alert(dollarDivCC)
        if (sLicensedWork != '') dollarDivCC.find('#idLicensedWork').html(sLicensedWork)
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
    //document.title = 'nananananana'
    //xczcxv()

    var jq00
    var jq30
    var jq40
    var jqX2
    var s00
    var s30
    var s40
    var sX2

    jq00 = $('div.creative_commons')
    jq30 = $('div.creative_commons_30')
    jq40 = $('div.creative_commons_40')
    jqX2 = $('div.creative_commons_both')
    s00 = jq00.html()
    s30 = jq30.html()
    s40 = jq40.html()
    sX2 = jqX2.html()

    //window.setTimeout(function() { document.title = s30; }, 2000)
    if (sX2) {
        sCCFile = 'CC_3.0_4.0.html'
        sLicensedWork = sX2
        dollarDivCC = jqX2
    }
    else if (s40) {
        sCCFile = 'CC_4.0.html'
        sLicensedWork = s40
        dollarDivCC = jq40
    }
    else if (s30) {
        sCCFile = 'CC_3.0.html'
        sLicensedWork = s30
        dollarDivCC = jq30
        //document.title = sLicensedWork
    }
    else if (s00) {
        // Unknown version. Detect from "modified" date:
        var b40 = false
        var sModified = $('[itemprop="dateModified"]').text()
        if ((sModified != null) && (sModified != '')) {
            if (sModified > "2015-06-01") {
                b40 = true
            }
        }
        if (!b40) sCCFile = 'CC_3.0.html'
        else sCCFile = 'CC_4.0.html'
        sLicensedWork = s00
        dollarDivCC = jq00
    }

    if (sLicensedWork != '') {
        var sPath = GetLocRoot() + 'js+css/'+sCCFile+' #idCC-licens'
        //alert(sPath)
        dollarDivCC.load(sPath, function(responseText, textStatus){onCCLoaded(responseText, textStatus)})
    }
} // LoadCC

var g_sH1Hash = ''

function ModifyH1AndH2AndTitle() {
    g_sH1Hash = ''
    var dollarH1 = $('h1')
    var dollarH2 = $('h2')
    var strH1 = dollarH1.text()
    var strH2 = dollarH2.text()
    dollarH2.remove()
    dollarH2 = null
    var strTitle = strH1
    var strLocOfs = GetLocOffset()
    var aryPaths = strLocOfs.split('/')
    var iAryLen = aryPaths.length
    if (iAryLen > 0) {
        var strLast = aryPaths[iAryLen-1]
        var iHashIx = strLast.indexOf('#')
        if (iHashIx >= 0) {
            g_sH1Hash = strLast.substr(iHashIx+1)
            aryPaths[iAryLen-1] = strLast = strLast.substr(0, iHashIx)
        }
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
        if (iAryLen == 0) {
            strH2 = ''
        }
        else {
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
                    //strH2 += strPath + '/ '
                }
                if (i == 0) {
                    //var bVelkommen = (i == iLast) && ((strPath != 'Musik') && (strPath != 'Mad'))
                    var bVelkommen = ((i == iLast) && (strPath == ''))
                    if (bVelkommen) {
                        strH1 = 'Velkommen!'
                        //strTitle = strH1 + ' / '
                        strTitle = ' / ' + strH1
                    }
                    else {
                        strH1 = strPathDanified
                    }
                }
                //if (i == iLast) strH2 += '<a itemprop="breadcrumb" title="Scroll til toppen af siden." href="#" onclick="javascript:$(\'div.main\').prop(\'scrollTop\',0);">' + strPathDanified + '</a>'
                if (i == iLast) strH2 += '<a itemprop="breadcrumb" title="Scroll til toppen af siden." href="javascript:ScrollToName(\'\');">' + strPathDanified + '</a>'
                else strH2 += '<a itemprop="breadcrumb" href="' + strHref + '" title="Tilbage til ' + strPathDanified + '.">' + strPathDanified + '/ </a>'

                strTitle = strPathDanified + strTitle
                //dollarH2.text('abe: '+strLast)//aryPaths[iAryLen-1])
            }
            //dollarH1.html(strH1)
            //dollarH2.html(strH2)
        }
    }
    strH2 = '<a itemprop="breadcrumb" href="' + GetLocRoot() + '" title="Tilbage til velkomstsiden.">/ </a>' + strH2
    if (iAryLen == 0) {
        if (strH1 != strH2) strTitle = 'Velkommen!'//strH2 + '/ ' + strTitle
    }
    //alert(strLocOfs)
    //var bSame = (strH2 == strH1)
    //if (!bSame) strTitle += ' / ' + strH2
    strTitle += ' / Lasse Steen Bohnstedt'
    dollarH1.html(
        '<table width="808px" cellpadding="0" cellspacing="0">'
        +'<tr><td class="h1_extra">'
        +'<span>&nbsp;LasseSB&nbsp;</span>'
        +'<p>jcxz100</p></td>'
        +'<td class="h1_orig" id="idH1Orig">'
        +strH1
        +'</td></tr></table>')
    document.title = strTitle

    $('<h2 class="new">' + strH2 + '</h2>').insertBefore('div.main')
} // ModifyH1AndH2AndTitle


function SetHosting() {
    $('div.hosting').html(
        'Free <a href="http://host-ed.net/" target="_blank">Web Hosting</a>'
        + ' by <a href="http://host-ed.net/" target="_blank">'
        + '<img src="/pix/common/host-ed-logo-smaller-bg-graded.png" alt="host-ed.net" '
        + 'onload="if (bIsReady) MyOnResize();" '
        + 'style="height: 25px; display:inline; vertical-align:bottom; '
        + '<span style="font-family:Sans-Serif; font-size-adjust:150%; font-weight: bolder;">'
        + ' - QUALITY WEB HOSTING</span></a>'
    )//.css('background', g_sLocRoot+'pix/common/20_hosting-bg.png').css('background-color', 'transparent')
    //$('div.hosting').html('')
    //alert(g_sLocRoot+'pix/common/hosting-bg.png')
} // SetHosting

//function SetHosting_fixImgBaseline

function SetOpdateret() {
    var dollar = $('div.opdateret')
    var s = dollar.html()
    if ((s != null) && (s != '')) {
        s = 'Denne side opdateret ' + s + ' af '
        +'<a href="/Hvem-mig$/" rel="me">Lasse Steen Bohnstedt</a>.'
        //alert(s)
        dollar.html(s)
    }
} // SetOpdateret


var iJPlayers = 0
var iJPlayersLoaded = 0
var iJPlayersFailed = 0
var iJPlayersTotalDone = 0
var bBlockJPlayers = true

function LoadJPlayer_worker(oContainer, sToLoad) {
    if (
        (bBlockJPlayers)
//        ||
//        (g_iLoadAttempts-1 > (g_iLoadSuccesses + g_iLoadFailures))
    ) {
         //document.title = 'loading:' + g_iLoadAttempts
         //              + ':' + g_iLoadSuccesses + ':' + g_iLoadFailures
         // We must wait a little longer:
         //alert('bøffel')
         window.setTimeout(
            function() {
               LoadJPlayer_worker(oContainer, sToLoad);
            },
            250
         );
         // Do no more for now:
         return;
     }

    // The wait is over:
    //alert(sToLoad)
    var dollarDragons = $(oContainer).find('.lasse-here-be-dragons')
    if (dollarDragons.length == 0) {
        document.title = 'dollarDragons.length == 0'
    }
    else {
        //document.title = 'dollarDragons.length == ' + dollarDragons.length
        dollarDragons.load(
            sToLoad,
            function(response, status, xhr){
                //document.title = 'badedyr'
                //alert(status)
                if ( status == "error" ) {
                    var msg = "Sorry but there was an error:<br/>";
                    msg = msg + " - loading: '" + sToLoad + "'<br/> - "
                    $(oContainer).after( msg + xhr.status + " " + xhr.statusText );
                    g_iLoadFailures++
                    iJPlayersFailed++
                    iJPlayersTotalDone++
                }
                else {
                    g_iLoadSuccesses++
                    iJPlayersLoaded++
                    iJPlayersTotalDone++
                    //alert('bededyr')
                    MaybeFixUrls(oContainer)
                }
            }
        )
    }
} // LoadJPlayer_worker(...)

function LoadJPlayer_new(
  oContainer, bKeepVisible, sWhat, sDate,
  sFlacFile, sM4aFile, sOgaFile, sMp3File, sYoutubeId, sLength,
  sAboutFile, sStructureFile, sSheetFile, sChordsFile, sLyricsFile, sMixDetails,
  sFront, sFrDate, sFrNew, sThoughts, sThDate
) {
    g_iLoadAttempts++
  var iIx = ++iJPlayers
//    document.title = 'øføføf'

  // Make sure we get the functionality as well:
  if (iJPlayers == 1) { // Only once
     load_dyn(g_sLocRoot + 'js+css/jplayer-2-9-2/css/jplayer.blue.monday.min.css', false);
     load_dyn(g_sLocRoot + 'js+css/jplayer-2-9-2/jquery.jplayer.min.js', true);
  }

  // Put in the index of this player (for debug):
  $(oContainer).html(
    '<div class="index" style="display:none;">' + iIx + '</div>'
    + $(oContainer).html()
  )

  // Append div for player to be loaded into:
  $(oContainer).html(
    $(oContainer).html()
    +'<div class="lasse-here-be-dragons"><!--lasse: here be dragons-->'
    +'<table>'
    +'<tr><td class="loadingJPlayer">Loading media...</td></tr></table>'
    +'</div>'
  )
  //alert($(oContainer).html())
  //alert(sFrNew)

  // Info needed to create player:
  var sToLoad =
    GetLocRoot()+'/js+css/20_my-jPlayer.php'
    +'?scripts-dir='+GetLocRoot()+'/js%2bcss/jplayer.2.9.2'
    +'&html-root='+g_sLocRoot
    +'&index='+iIx
    +'&delay-connect=' + (bKeepVisible ? '0' : '1')
    +'&what='+sWhat
    +'&date='+sDate
    +'&flac='+sFlacFile
    +'&m4a='+sM4aFile
    +'&oga='+sOgaFile
    +'&mp3='+sMp3File
    +'&length='+sLength
    +'&about='+sAboutFile
    +'&structure='+sStructureFile
    +'&lyrics='+sLyricsFile
    +'&sheet='+sSheetFile
    +'&chords='+sChordsFile
    +'&youtube-id='+sYoutubeId
    +'&mix-details='+sMixDetails
    +'&front='+sFront
    +'&front-date='+sFrDate
    +'&front-new='+sFrNew
    +'&thoughts='+sThoughts
    +'&thoughts-date='+sThDate
/*  $(oContainer).children('.lasse-here-be-dragons').load(sToLoad,function(response, status, xhr){
   //alert(status)
    if ( status == "error" ) {
      var msg = "Sorry but there was an error:<br/>";
      $(oContainer).html( msg + xhr.status + " " + xhr.statusText );
    }
    else {
        MaybeFixUrls(oContainer)
    }

   //alert('hm?')
  })*/
    LoadJPlayer_worker(oContainer, sToLoad)
} // LoadJPlayer_new

function getStringFromChild(oThis, sChild, sDefault, bHideAfter, bFixSpaces) {
    if (sDefault == null) sDefault = ''
    if (bHideAfter == null) bHideAfter = false
    if (bFixSpaces == null) bFixSpaces = true

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

function LoadAllJPlayers() {
  //$(document).find('#myJPlayer').each(alert(this.html()))
  //alert($(document).find('myJPlayer'))

    // Debug:
    //bBlockJPlayers = false

  $('.myJPlayer').each(
    function(i) {
      // General settings/info:
      var sKeep     = getStringFromChild(this, '.keep', 'false', true)
      var bKeep     = (sKeep == "true")
      var sWhat     = getStringFromChild(this, '.what', 'musikken', true)
      var sDate     = getStringFromChild(this, '.date', '', true)
      //
      // Media:
      var sFlac     = getStringFromChild(this, '.flac',  '', true)
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
      var sChords   = getStringFromChild(this, '.chords',  '', true)
      var sLyrics   = getStringFromChild(this, '.lyrics', '', true)
      var sMix      = getStringFromChild(this, '.mix', '', true)
      //
      // Thoughts and old front page for this version:
      var sFront    = getStringFromChild(this, '.front', '', true)
      var sFrDate   = getStringFromChild(this, '.front-date', '', true)
      var sFrNew    = getStringFromChild(this, '.front-new', 'true', true)
      var sThoughts = getStringFromChild(this, '.thoughts', '', true)
      var sThDate   = getStringFromChild(this, '.thoughts-date', '', true)

      LoadJPlayer_new(
        this, bKeep, sWhat, sDate,
        sFlac, sM4a, sOgg, sMp3, sYId, sLength,
        sAbout, sStruct, sSheet, sChords, sLyrics, sMix,
        sFront, sFrDate, sFrNew, sThoughts, sThDate
      )
    }
  )

    // Enable all jplayers to load:
    bBlockJPlayers = false
} // LoadAllJPlayers()


var g_bSetHashAfterScroll = false
var g_sHashAfterScroll = ''

function ScrollToPos(iTopNew) {
    if (!iTopNew) iTopNew = 0

    //document.title = 'birwer'
    var iTimeMs = 500
    var dollarToAnimate = $('div.main')
    //document.title = $('[name="Mester_Mikkel"]').text()
    if (dollarToAnimate.length > 0) {
        var iTopNow = dollarToAnimate.prop('scrollTop')
        //if (iTopNow != 0) {
        //    dollarToAnimate.prop('top', 0)
        //}
        //iTopNew += iTopNow
        //document.title = 'new:' + iTopNew + ' now:' + iTopNow
        //if ((iTopNow == 0) && (iTopNew != iTopNow)) {
        if (iTopNew == iTopNow) {
            if (g_bSetHashAfterScroll) {
                g_bSetHashAfterScroll = false
                document.location.hash = g_sHashAfterScroll
            }
        }
        else {
            var iTopDiff = iTopNew - iTopNow
            if (iTopDiff < 0) iTopDiff = -iTopDiff
            if (iTopDiff < 250) iTimeMs = iTopDiff * 2
            dollarToAnimate.animate(
                { scrollTop: iTopNew },
                iTimeMs,
                function() {
                    if (g_bSetHashAfterScroll) {
                        g_bSetHashAfterScroll = false
                        document.location.hash = g_sHashAfterScroll
                    }
                }
            );
        }
    }
} // ScrollToPos(iTopNew)

function ScrollToWhatever(sWhatEver) {
    if (!sWhatEver) sWhatEver = ''

    var iTopNew = 0
    if (sWhatEver != '') {
        var dollarWhatEver = $(sWhatEver)
        if (dollarWhatEver.length > 0) {
            //document.title = dollarWhatEver.text()
            iTopNew = dollarWhatEver.position()['top']
            var dollarMain = $('div.main')
            var iOfs = dollarMain.position()['top']
            iTopNew -= iOfs
            var iTopNow = dollarMain.prop('scrollTop')
            iTopNew += iTopNow
            //document.title = iTopNew
        }
    }
    ScrollToPos(iTopNew)

    //document.title = $('[name="Mester_Mikkel"]').text()
    //document.location.hash = sHash
} // ScrollToWhatever(sWhatEver)

function ScrollToName(sName) {
    g_bSetHashAfterScroll = true
    g_sHashAfterScroll = sName
    if (sName == '') {
        ScrollToPos(0)
    }
    else {
        var sWhatEver = '[name="' + sName + '"]'
        ScrollToWhatever(sWhatEver)
    }
} // ScrollToName(sName)

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


function ScrollToTop() {
    ScrollToPos(0)
/*    var iTimeMs = 500
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
    }*/
} // ScrollToTop()


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


function ScrollToHash_Maybe() {
    var sHashPart = document.location.toString()
    sHashPart = sHashPart.split('#')
    if (sHashPart.length > 1) {
        if (iJPlayersTotalDone < iJPlayers) {
            // Wait for all JPlayers to load:
            window.setTimeout(function() { ScrollToHash_Maybe(); }, 200)
            return
        }
        else {
            // Perform scroll now:

            //document.title = sHashPart.length
            sHashPart = sHashPart[sHashPart.length-1]
            if (sHashPart.length > 0) {
                //document.title = 'ællebælle: ' + sHashPart
                window.setTimeout(function() {
                    ScrollToWhatever('#id' + sHashPart, '#' +sHashPart)
                }, 100)
            }
        }
    }
} // ScrollToHash_Maybe()


var iReady = 0
var bIsReady = false
var bXlatsTextAlreadyLoading = false

function MyReady_Part2() {
    // LSB - added 2012-08-06

    if (!IsTinyScreen()) {
//        bOKToLoadJPlayer = false // Don't load JPlayers again! Would crash browser.
        CreateHeaderOverview()
        // Now that body contents have been relocated, it's ok to actually connect the JPlayer
//        if (iPlayerToConnectAfterRelocateIx >= 0) {
            // Connect JPlayer after a tiny delay (so we don't disturb document.ready execution):
            //window.setTimeout('ConnectJPlayer(' + iPlayerToConnectAfterRelocateIx + ')', 100)
//            ConnectJPlayer(iPlayerToConnectAfterRelocateIx)
        //}
//        iPlayerToConnectAfterRelocateIx = -1
    }
    // .. LSB

    MaybeFixUrls()
    LoadCC()
    ModifyH1AndH2AndTitle()

    SetHosting()
    SetOpdateret()
    LoadAllJPlayers() // <- New functionality: Load when everything ready
    if (!IsTinyScreen()) {
        var s = GetLocRoot() + 'js+css/20_navigation.html #idNav'
        $('td.nav').load(s, function(responseText, textStatus){
            if (textStatus != "success") {
                $('td.nav').html('Error loading 20_navigation.html<br>try reloading page')
            }
            MaybeFixUrls()
            SetTitleForLinksWithTargetBlank()

            DoneLoading()
            MyOnResize()
        })
        if (!bXlatsTextAlreadyLoading) {
            bXlatsTextAlreadyLoading = true
            s = GetLocRoot() + 'js+css/20_xlats.html div.xlats'
            $('div.xlats').load(
                s,
                function(responseText, textStatus){
                    if (textStatus != "success") {
                        $('div.xlats').html('Error loading xlats.html<br>try reloading page')
                    }
                    MyOnResize()
                }
            )
            //$('div.xlats').html('hallo?')
        }
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

    if (!IsTinyScreen()) MyOnResize()

    ScrollToHash_Maybe()

    bIsReady = true
} // MyReady_Part2

//$( document ).ready(function(){
function MyReady_Part1() {

    //alert('hrst')
    //document.title = 'brødre'

    if (++iReady == 1) {
      // This method doesn't work anymore.
      // Gotta assume ie works too...
//        if ($.browser.msie) {
//            // To make internet explorer show "loading" we must be idle some time
//            window.setTimeout('MyReady_Part2()', 100)
//        }
//        else
//        {
//            // Other browsers (and google crawler) will handle it without pause
            //alert('ja?')
            window.setTimeout(function() { MyReady_Part2(); }, 50 )
            //MyReady_Part2()
//            //alert('basti6')
//
//        }
    }
    //alert('hm...')
    //MyReady_Part2()
//    if (!IsTinyScreen()) MyOnResize()
    //document.title = 'bønder'
    //bIsReady = true
//})
}


function MyPrint_1() {
    $('td.nav').hide()
    var iMainWidth = $('td.main').width()
    //$('h1').width(iMainWidth)
    //$('.h1_extra').hide()
    $('h1').hide()
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
    //$('h1').width('auto')
    //$('.h1_extra').show()
    $('h1').show()
    $('.hosting').width('auto')
    MyOnResize()
} // MyPrint_3

MyReady_Part1()


//document.title = 'bras!'
