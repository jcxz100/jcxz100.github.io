var bEnglish = false//(document.getElementsByTagName('body')[0].lang.toString() == "en")
//alert(window.lang)

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


var sLocRoot = null
function GetLocRoot() {
    if (sLocRoot == null)
    {
        var s = document.location.toString();

        var sLSB = '/lassesb/';
        var i = s.lastIndexOf(sLSB);
        if (i < 0) sLocRoot = '/';
        else sLocRoot = s.substr(0, i + sLSB.length);
   }
    var iHashIx = sLocRoot.search('#')
    if (iHashIx >= 0) sLocRoot = sLocRoot.substr(iHashIx)
    return sLocRoot
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

//var sLocOffset = null
//function GetLocOffset() {
//    if (sLocOffset==null) {
//        if (!IsFileProtocol()) {
//            sLocOffset = document.location.toString()
//            var iColonSlashSlashIx = sLocOffset.search('://')
//            if (iColonSlashSlashIx >= 0) {
//                sLocOffset = sLocOffset.substr(iColonSlashSlashIx + 3)
//                var iIx = sLocOffset.search('/')
//                if (iIx >= 0) sLocOffset = sLocOffset.substr(iIx)
//            }
//            while ((sLocOffset > '') && (sLocOffset[0] == '/')) sLocOffset = sLocOffset.substr(1)
//            //alert(sLocOffset)
//        }
//        else {
//            sLocOffset = document.location.toString()
//            var iBolgenIx = sLocOffset.search('/lassesb/')
//            sLocOffset = sLocOffset.substr(iBolgenIx + 9)
//            sLocOffset = sLocOffset.replace(/ /g, '%20')
//        }
//    }
//    var iHashIx = sLocOffset.search('#')
//    if (iHashIx >= 0) sLocOffset = sLocOffset.substr(0, iHashIx)
//    return sLocOffset
//} // GetLocOffset


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
        sName = sName.replace(/\ -\ /g,'---').replace(/\?/g,'$').replace(/Æ/g,'AE').replace(/æ/g,'ae').replace(/Ø/g,'OE').replace(/ø/g,'oe').replace(/Å/g,'AA').replace(/å/g,'aa').replace(/ /g,'-').replace(/é/g,'e')
        dollarHeader.html('<a name="' + sName + '"></a>' + dollarHeader.html())
    }
    return sName;
} // CreateHeaderOverview_FindOrMakeName

function CreateHeaderOverview_Display() {
    var dollarBody = $('body')
    var sBodyWidth = dollarBody.css('width')
    dollarBody.css('width', 'inherit')
    $('td.header-overview').show()
    bHeaderOverviewVisible = true
    //MyOnResize()
} // CreateHeaderOverview_Display

var bHeaderOverviewVisible = false

function CreateHeaderOverview() {
    // Find out if there is already an overview column
    var dollarHeaderOverview = $('td.header-overview')
    if (dollarHeaderOverview.length == 0) {
        var dollarBody = $('body')
        var sBodyWidth = dollarBody.css('width')
    //  dollarBody.css('width', 'inherit')
        var sBodyOrg = dollarBody.html()
        //alert(sBodyOrg)
        dollarBody.html(
            '<table cellpadding="0" cellspacing="0" style="width:100%;">'
            + '<tr>'
            + '<td style="width:' + sBodyWidth + ';">' + sBodyOrg + '</td>'
            + '<td class="header-overview"><center>(header overview)</center></td></tr></table>'
        )
    }
    var sOverview = '<h4>Overskrifter på siden</h4><hr class="colored" />'
    $(document).find('*').each(function(){
        var dollarThis = $(this)
        if (dollarThis.is('h3')) {
            sScrollTo = CreateHeaderOverview_FindOrMakeName(dollarThis)
            sOverview += ''
                + '<a href="#' + sScrollTo + '">'
                + dollarThis.text() + '</a><br />';
        }
        else if (dollarThis.is('h4')) {
            sName = CreateHeaderOverview_FindOrMakeName(dollarThis)
            sOverview += '<table cellpadding="0" cellspacing="0" width="100%"><tr><td style="width:5px;">-&nbsp;</td>'
                + '<td><a href="#' + sName + '">'
                + dollarThis.text() + '</a></td></tr></table>';
        }
        else if (dollarThis.is('h5')) {
            sName = CreateHeaderOverview_FindOrMakeName(dollarThis)
            sOverview += '<table cellpadding="0" cellspacing="0" width="100%"><tr><td style="width:5px;">&nbsp;&nbsp;&nbsp;-&nbsp;</td>'
                + '<td><a href="#' + sName + '">'
                + dollarThis.text() + '</a></td></tr></table>';
        }
    })
    $('td.header-overview').html(
        '<table cellpadding="0" cellspacing="0"><tr><td>'
        + sOverview
        + '</td></tr></table>'
    ).css('font-size','inherit')

    // LSB - Added 2012-08-06
    CreateHeaderOverview_Display()
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
    var dHO = $('td.header-overview')
    if (bHeaderOverviewVisible) {
        dHO.css('display','none')
    }
    var iHeight = dWindow.height() - dMain.offset().top - dHosting.height() - 21
    dHO.height((dWindow.height()-20) + 'px')
    if (bHeaderOverviewVisible) {
        dHO.css('display','block').css('position','relative').css('overflow','auto')
        //dHO.css('display','inline-table').css('position','relative').css('overflow','auto')
    }
    // LSB - Added 2012-07-30
    iHeight -= 2 // Border-top på div.hosting
    // .. LSB
    dMain.height(iHeight).css('overflow-y', 'scroll').css('overflow-x', 'auto').css('display', 'block')
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
        bMyOnResize_Installed = true
        window.onresize = MyOnResize
        document.onresize = MyOnResize
    }
} // MyOnResize


var sLicensedWork = ''

function onCCLoaded(responseText, textStatus) {
    var dollarDivCC = $('div.creative_commons')
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
    var dollarDivCC = $('div.creative_commons')
    sLicensedWork = dollarDivCC.text()
    if (sLicensedWork != '') {
        var sPath = GetLocRoot() + 'CC.html #idCC-licens'
        //alert(sPath)
        dollarDivCC.load(sPath, function(responseText, textStatus){onCCLoaded(responseText, textStatus)})
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
        if ((strLast == '') || (strLast == 'index.html')) {
            iAryLen--
        }
        else {
            var iExtIx = strLast.lastIndexOf('.')
            if (iExtIx >= 0) {
                aryPaths[iAryLen-1] = strLast = strLast.substr(0, iExtIx)
            }
        }
        //alert(iAryLen)
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
    dollarH1.html('<table width="100%"><tr><td class="h1_extra">Lasse <span style="color:#FFB;">jcxz100</span></td><td id="idH1Orig" style="text-align:center;width:800px;">' + strH1 + '</td></tr></table>')
    document.title = strTitle

} // ModifyH1AndTitle


function SetHosting() {
    $('div.hosting').html(
        'Free <a href="http://host-ed.net/" target="_blank">Web Hosting</a>'
        + ' by <a href="http://host-ed.net/" target="_blank">'
        + '<img src="/pix/common/host-ed-logo-smaller.gif" alt="host-ed.net" onload="if (bIsReady) MyOnResize();" style="height: 25px; position: relative; top: 3px;;" />'
        + '<span style="font-family:Sans-Serif; font-size-adjust:150%; font-weight: bolder;">'
        + ' - QUALITY WEB HOSTING</span></a>'
    )
} // SetHosting


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
var aryJPlayers_idDiv0 = new Array()
var aryJPlayers_idDiv1 = new Array()
var aryJPlayers_idDiv2 = new Array()
var aryJPlayers_mp3File = new Array()
var aryJPlayers_oggFile = new Array()
var aryJPlayers_bKeep = new Array()
var iJPlayerActive = -1
var iJPlayerReady = -1

function DestroyJPlayer(iJPlayer) {
    //alert(iJPlayer)
    if (iJPlayer == null) iJPlayer = iJPlayerActive
    if ((iJPlayer == null) || (iJPlayer == -1)) return

    if (iJPlayer == iJPlayerReady) iJPlayerReady = -1
    if (!aryJPlayers_bKeep[iJPlayer]) {
        $(aryJPlayers_idDiv2[iJPlayer]).hide()
        $(aryJPlayers_idDiv0[iJPlayer]).show()
        $(aryJPlayers_idDiv1[iJPlayer]).jPlayer("destroy")
    }
    if (iJPlayer == iJPlayerActive) iJPlayerActive = -1
} // DestroyJPlayer

function ConnectJPlayer(iJPlayer) {

    if ((iJPlayer == null) || (iJPlayer == -1)) return
    if (iJPlayerActive != -1) {
        alert('Error, ConnectJPlayer: iJPlayerActive=='+iJPlayerActive)
        return
    }

    iJPlayerActive = iJPlayer

    if (iJPlayer > 0) {
        // Not the first JPlayer on page
        // Copy content of first JPlayer to this
        $(aryJPlayers_idDiv2[iJPlayer]).html($(aryJPlayers_idDiv2[0]).html())
    }

    $(aryJPlayers_idDiv0[iJPlayer]).hide()
    $(aryJPlayers_idDiv2[iJPlayer]).show()
    if (aryJPlayers_oggFile[iJPlayer] == null) {
        // Kun mp3
        $(aryJPlayers_idDiv1[iJPlayer]).jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: (GetLocPathOnly() + aryJPlayers_mp3File[iJPlayer])
                });
                $(this).bind($.jPlayer.event.play, function() { // Bind an event handler to the instance's play event.
                    $(this).jPlayer("pauseOthers"); // pause all players except this one.
                });
                iJPlayerReady = iJPlayer
                if (!aryJPlayers_bKeep[iJPlayer]) $(this).jPlayer("play")
            },
            swfPath: GetLocRoot() + 'jQuery.jPlayer.2.1.0',
            supplied: "mp3",
            cssSelectorAncestor: aryJPlayers_idDiv2[iJPlayer]
        });
    }
    else {
        // Både ogg og mp3
        $(aryJPlayers_idDiv1[iJPlayer]).jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    oga: (GetLocPathOnly() + aryJPlayers_oggFile[iJPlayer]),
                    mp3: (GetLocPathOnly() + aryJPlayers_mp3File[iJPlayer])
                });
                $(this).bind($.jPlayer.event.play, function() { // Bind an event handler to the instance's play event.
                    $(this).jPlayer("pauseOthers"); // pause all players except this one.
                });
                iJPlayerReady = iJPlayer
                if (!aryJPlayers_bKeep[iJPlayer]) $(this).jPlayer("play")
            },
            swfPath: GetLocRoot() + 'jQuery.jPlayer.2.1.0',
            supplied: "oga, mp3",
            cssSelectorAncestor: aryJPlayers_idDiv2[iJPlayer]
        });
    }
} // ConnectJPlayer

function ClickMyPlay(iJPlayer) {
    if ((iJPlayer == null) || (iJPlayer == -1)) return

    //alert(iJPlayerActive)
    if (iJPlayerActive != iJPlayer) {
        // Hide and destroy previously active player
        DestroyJPlayer(iJPlayerActive)
        // Ready new player
        ConnectJPlayer(iJPlayer)
    }
} // ClickMyPlay


// It's only OK to load JPlayer upon first parse of document - not when relocating contents
var bOKToLoadJPlayer = true
var iPlayerToConnectAfterRelocateIx = -1

function LoadJPlayer(sMp3File, sOggFile, bKeepVisible) {
    if (!bOKToLoadJPlayer) return

    var iIx = iJPlayers++
    aryJPlayers_mp3File[iIx] = sMp3File
    aryJPlayers_oggFile[iIx] = sOggFile
    var sIdDiv0 = '#idDiv0_jp_' + iIx
    var sIdDiv1 = '#idDiv1_jp_' + iIx
    var sIdDiv2 = '#idDiv2_jp_' + iIx
    aryJPlayers_idDiv0[iIx] = sIdDiv0
    aryJPlayers_idDiv1[iIx] = sIdDiv1
    aryJPlayers_idDiv2[iIx] = sIdDiv2
    if (bKeepVisible == null) bKeepVisible = false
    if (iIx > 0) bKeepVisible = false
    aryJPlayers_bKeep[iIx] = bKeepVisible

    var str = '<div id="' + sIdDiv0.substr(1) + '"'
    if (bKeepVisible) str += ' style="display:none;"'
    str += '>'
    str += '<img src="/pix/player/play16.png" /> '
    if (bEnglish) str += 'Listen to the file <a href="javascript:ClickMyPlay(' + iIx + ')">here on the page</a>.'
    else str += 'Hør filen <a href="javascript:ClickMyPlay(' + iIx + ')">her på hjemmesiden</a>.'
    str += '</div>'
    document.writeln(str)

    str = '<div id="' + sIdDiv1.substr(1) + '"></div>'
    $(sIdDiv0).after(str)

    str = '<div id="' + sIdDiv2.substr(1) + '" class="jp-audio"'
    if (!bKeepVisible) str += ' style="display:none;"'
    str += '></div>'
    if (sOggFile != null) {
        // Ogg fil først
        var iLastSlashIx = sOggFile.lastIndexOf('/')
        var sOggFileNoPath = (iLastSlashIx > -1) ? sOggFile.substr(iLastSlashIx+1) : sOggFile
        str += '<div>'
        str += '<img alt="audio" src="/pix/media-types/audio.gif" /> '
        str += '<a href="' + sOggFile + '" target="_blank">'
        str += sOggFileNoPath + '</a> '
        str += (bEnglish ? 'high quality (right click and chose "Save destination as")' : 'høj kvalitet (højreklik og vælg "Gem destination som")' )
        str += '</div>'
    }
    str += '<div>'
    str += '<img alt="audio" src="/pix/media-types/audio.gif" /> '
    str += '<a href="' + sMp3File + '" target="_blank">'
    var iLastSlashIx = sMp3File.lastIndexOf('/')
    var sMp3FileNoPath = (iLastSlashIx > -1) ? sMp3File.substr(iLastSlashIx+1) : sMp3File
    str += sMp3FileNoPath + '</a> '
    if (sOggFile != null) {
        str += (bEnglish ? 'low quality (right click and chose "Save destination as")' : 'lav kvalitet (højreklik og vælg "Gem destination som")' )
    }
    else {
        str += (bEnglish ? '(right click and chose "Save destination as")' : '(højreklik og vælg "Gem destination som")' )
    }
    str += '</div>'

    $(sIdDiv1).after(str)

    if (iIx == 0) {
        // First JPlayer on page
        $(sIdDiv2).html(
            '<div class="jp-type-single">'
            +'  <div class="jp-gui jp-interface">'
            +'      <ul class="jp-controls">'
            +'          <li><a href="javascript:;" class="jp-play" tabindex="1">play</a></li>'
            +'          <li><a href="javascript:;" class="jp-pause" tabindex="1">pause</a></li>'
            +'          <li><a href="javascript:;" onclick="DestroyJPlayer()" class="jp-stop" tabindex="1">stop</a></li>'
            +'          <li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a></li>'
            +'          <li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a></li>'
            +'          <li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume">max volume</a></li>'
            +'      </ul>'
            +'      <div class="jp-progress">'
            +'          <div class="jp-seek-bar">'
            +'              <div class="jp-play-bar"></div>'
            +'          </div>'
            +'      </div>'
            +'      <div class="jp-volume-bar">'
            +'          <div class="jp-volume-bar-value"></div>'
            +'      </div>'
            +'      <div class="jp-time-holder">'
            +'          <div class="jp-current-time"></div>'
            +'          <div class="jp-duration"></div>'
            +'          <ul class="jp-toggles">'
            +'              <li><a href="javascript:;" class="jp-repeat" tabindex="1" title="repeat">repeat</a></li>'
            +'              <li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="repeat off">repeat off</a></li>'
            +'          </ul>'
            +'      </div>'
            +'  </div>'
            +'  <div class="jp-title" style="display:none;">'
            +'      <ul>'
            +'          <li>mp3</li>'
            +'      </ul>'
            +'  </div>'
            +'  <div class="jp-no-solution">'
            +'      <span>Update Required</span>'
            +'      To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.'
            +'  </div>'
            +'</div>'
        )
        if (bKeepVisible) {
            if (IsTinyScreen()) {
                // On mobile connect JPlayer immediately
                ConnectJPlayer(iIx)
            }
            else {
                // Must wait until body contents have been relocated
                iPlayerToConnectAfterRelocateIx = iIx
            }
        }
    }
    else {
        // Not the first JPlayer on page
    }
} // LoadJPlayer


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


function UIntToHex(uiVal, iCifre) {
    return s = ((--iCifre <= 0) ? '' : UIntToHex(uiVal / 16, iCifre)) + (uiVal & 0xF).toString(16)
} // UIntToHex


function FlashLoading() {
    var iMs = (new Date()).getTime()
    var iMod = iMs % 2500
    if (iMod > 1250) iMod = 2500 - iMod
    var iRed = 0x99 | ((( 0xFF-0x99 ) * iMod) / 1250)
    var iGreen = 0x88 | ((( 0xFF-0x88 ) * iMod) / 1250)
    var iBlue = 0xFF
    var sColor = '#' + UIntToHex(iRed, 2) + UIntToHex(iGreen, 2) + UIntToHex(iBlue, 2)
    var dollarLoading = $('td.loading')
    if (dollarLoading.html() != '') {
        dollarLoading.css('backgroundColor', sColor)
        window.setTimeout('FlashLoading()', 25)
    }
} // FlashLoading

function InsertLoading() {
    $('h1').after('<table class="loading"><tr><td class="loading">Loading...</td></tr></table>')
    FlashLoading()
} // InsertLoading

function DoneLoading() {
    $('table.loading').hide()
    $('td.loading').html('')
    $('table.main').show()

    /* Don't. Will cause page to reposition. User may have started scrolling, would annoy
    // Delay display of header overview
    if (!IsTinyScreen())
        window.setTimeout('CreateHeaderOverview_Display()', 2000)
    */
} // DoneLoading


var iReady = 0
var bIsReady = false

function MyReady_Part2() {
    // LSB - added 2012-08-06
    if (!IsTinyScreen()) {
        bOKToLoadJPlayer = false // Don't load JPlayers again! Would crash browser.
        CreateHeaderOverview()
        // Now that body contents have been relocated, it's ok to actually connect the JPlayer
        if (iPlayerToConnectAfterRelocateIx >= 0) {
            // Connect JPlayer after a tiny delay (so we don't disturb document.ready execution):
            //window.setTimeout('ConnectJPlayer(' + iPlayerToConnectAfterRelocateIx + ')', 100)
            ConnectJPlayer(iPlayerToConnectAfterRelocateIx)
        }
        iPlayerToConnectAfterRelocateIx = -1
    }
    // .. LSB

    LoadCC()
    ModifyH1AndTitle()
    SetHosting()
    SetOpdateret()
    if (!IsTinyScreen()) {
        var s = GetLocRoot() + 'Navigation.html #idNav'
        alert(s)
        $('td.nav').load(s, function(responseText, textStatus){
            if (textStatus != "success") {
                $('td.nav').html('error loading Navigation.html<br>try reloading page')
            }
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
        $('.broedtekst').css('fontSize', '22pt').css('paddingLeft','10px')
        $('.copyright').css('fontSize', '22pt')
        $('#idNavMobile').load(GetLocRoot() + 'NavMobile.html #idNavToLoad', function(responseText, textStatus) {
            if (textStatus != "success") {
                $('#idNavMobile').html('error loading NavMobile.html<br>try reloading page')
            }
            $('td.nav').hide()
            $('td.main').width('1000px')
            DoneLoading()
        })
    }
    //$('td.main').focus()
} // MyReady_Part2

$(document).ready(function(){
    if (++iReady == 1) {
        InsertLoading()
        if ($.browser.msie) {
            // To make internet explorer show "loading" we must be idle some time
            window.setTimeout('MyReady_Part2()', 100)
        }
        else {
            // Other browsers (and google crawler) will handle it without pause
            MyReady_Part2()
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
    $('td.header-overview').hide()
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
    $('td.header-overview').show()
    $('h1').width('auto')
    $('.h1_extra').show()
    $('.hosting').width('auto')
    MyOnResize()
} // MyPrint_3
