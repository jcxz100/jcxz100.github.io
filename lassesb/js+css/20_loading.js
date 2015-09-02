// loading_20.js


function UIntToHex(uiVal, iCifre) {
    return s = ((--iCifre <= 0) ? '' : UIntToHex(uiVal / 16, iCifre)) + (uiVal & 0xF).toString(16)
} // UIntToHex


var oH1s        = document.getElementsByTagName('h1')
var oH1Parent   = null
var oNewSpan    = document.createElement('span')
var oInserted   = null

var oNavs       = document.getElementsByClassName('nav')
var oMains      = document.getElementsByClassName('main')
var oCCs        = document.getElementsByClassName('creative_commons')
var oCC30s      = document.getElementsByClassName('creative_commons_30')
var oCC40s      = document.getElementsByClassName('creative_commons_40')
var oCC30and40s = document.getElementsByClassName('creative_commons_30_and_40')
var oHostings   = document.getElementsByClassName('hosting')
var oHeaders    = document.getElementsByClassName('header-overview')
//alert (oHeaders.length)
var ary_oClasses    = [ oH1s, oNavs, //oMains,
                        oCCs, oCC30s, oCC40s, oCC30and40s,
                        oHostings, oHeaders, oMains
                    ]

    function getDefaultDisplayByTag(sTag) {
        // This is not fully implemented, as that would be very long...
        // See http://www.w3.org/TR/CSS21/sample.html for full list.
        return 'block'
        switch (sTag) {
            case 'div':
            case 'ul':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':      return 'block';
            //
            case 'li':      return 'list-item';
            //
            case 'table':   return 'table';
            //
            case 'td':
            case 'th':      return 'table-cell';
        }
        // Fallback:
        return 'block';
    } // getDefaultDisplayByTag(...)
    //
    function computeDisplay(o) {
        var oFunction = window.getComputedStyle;
        if (oFunction) {
            var oStyle = window.getComputedStyle(o)
            if ((oStyle) && (oStyle.getPropertyValue)) {
                return oStyle.getPropertyValue('display');
            }
        }
        if (window.currentStyle) {
            return window.currentStyle.display;
        }
        return null; // <-- This is going to be a bad day...
    } // computeStyle(...)
    //
    // This will most probably work:
    function ShowHideObject_WillProbablyWork(o, bDisplay, bMaybeRecursive) {
        if ((o == null) || (o == undefined) || (o == document) || (o.tagName == undefined)) return;
        //
        if (bDisplay == null) bDisplay = true
        if (!bDisplay) {
            o.style.display = 'none';
        }
        else {
            // First remove any directly set display:none;
            if ((o.style.display == 'none') || (o.style.display == '')) {
                o.style.display = null;
            }
            //
            var sDisplay = null;
            var sDisplayCurrent = computeDisplay(o);
            var oParent = o.parentNode;
            // Was this element hidden via css?
            if ((sDisplayCurrent == null) || (sDisplayCurrent == 'none')) {
                // We must determing a sensible display value:
                var sTag = o.tagName;
                sDisplay = getDefaultDisplayByTag(sTag);
            } // else: if ((sDisplayCurrent != null) && (sDisplayCurrent != 'none'))
            //
            // Make sure visibility is also on:
            //alert(sDisplay)
            if (sDisplay != null) o.style.display = sDisplay;
            o.style.visibility = true;
            //
            if (bMaybeRecursive) {
                // We should travel up the tree and make sure parent are also displayed:
                //document.title = oParent.tagName
                ShowHideObject_WillProbablyWork(oParent, true, true);
            }
        } // else: if (!bDisplay) ...
        //
    } // ShowHideObject_WillProbablyWork(...)
    /* //
    // ... and:
    function ShowHideId_WillProbablyWork(id, bDisplay, bMaybeRecursive)
        document.title = 'nej, nu!...'
        var o = document.getElementById(id);
        if (o == null) document.title = 'what??'
        document.title = o.tagName
        ShowHideObject_WillProbablyWork(o, bDisplay, bMaybeRecursive)
    } // ShowHideId_WillProbablyWork(...)
*/
function ShowHidePage(bShow) {
    var sShow = (bShow ? null : 'none')
    var iAry
    //document.title = 'start'
    //document.title = 'hvaD????'
    for (iAry=0; iAry<ary_oClasses.length; iAry++) {
        //document.title = 'iAry: ' + iAry + ' < ' + ary_oClasses.length
        oList = ary_oClasses[iAry]
        if (oList) {
            //document.title = 'hm??'
            var i
            for (i=0; i<oList.length; i++) {
                //document.title = '; 'i: ' + i + ' < ' + oList.length'
                var o = oList[i]
                //if (o) o.style.display = sShow
                ShowHideObject_WillProbablyWork(o, bShow, true)
            }
        }
    }
    //ShowHideId_WillProbablyWork('idBETA1', false)
} // ShowHidePage()


var bFlashLoading = true
var iMsFirst
function FlashLoading() {
    if (!bFlashLoading) return

    var iMs = (new Date()).getTime()
    if (iMsFirst == undefined) iMsFirst = iMs-1250
    else iMs -= iMsFirst
    var iMod = iMs % 2500
    if (iMod > 1250) iMod = 2500 - iMod
    var iRed = 0x99 | ((( 0xFF-0x99 ) * iMod) / 1250)
    var iGreen = 0x88 | ((( 0xFF-0x88 ) * iMod) / 1250)
    var iBlue = 0xFF
    //show_hang('hunde')
    var sColor = '#' + UIntToHex(iRed, 2) + UIntToHex(iGreen, 2) + UIntToHex(iBlue, 2)
    //var dollarLoading = $('td.loading')
    //dollarLoading.css('backgroundColor', sColor)
    var oLoading = document.getElementById('idTdLoading')
    if (oLoading) oLoading.style.backgroundColor = sColor
    //alert(oInserted.style.backgroundColor)

    if (bFlashLoading) {
        window.setTimeout(function(){FlashLoading();}, 10)
    }
} // FlashLoading

function InsertLoading() {
    if (oInserted != null) return

    //alert('nedstrygere')
    ShowHidePage(false)
    if ((oH1s.length) && (oNewSpan)) {
        //alert(oH1s)
        //alert('firaffer')
        //alert(oH1s.length)
        oH1Parent = oH1s[0].parentNode
        //alert(oH1Parent)
        if (oH1Parent) {
            //alert('bimser')
            oInserted = oH1Parent.insertBefore(oNewSpan, oH1s[0])
            //alert(oInserted.tagName)
            //alert(oInserted.parentNode.tagName)
            //alert('holland')
            if (oInserted) {
                //oInserted.innerHTML = 'tralala<br/>'
                oInserted.innerHTML = '<table id="idTableLoading" class="loading">'
                + '<tr><td id="idTdLoading" class="loading">Loading...</td></tr>'
                + '<tr><td>&nbsp;</td></tr>'
                + '<tr><td class="below-loading">'
                + 'Hvis siden går i baglås, '
                + 'kan du tvinge den frem ved at '
                + '<a href="javascript:DoneLoading()"'
                + '    >klikke her</a>.'
                + '</td></tr>'
                + '<tr><td class="below-below-loading">'
                + 'Bemærk: Meget <u>vil generelt se underligt ud.</u>'
                + '</td></tr>'
                + '<tr><td class="below-below-loading">'
                + 'En af de ting, der garanteret vil mangle '
                + 'er copyright info;<br/>'
                + 'men <b>min copyright gælder selvfølgelig alligevel.</b>'
                + '</td></tr>'
                + '</table>'
                //alert(oInserted.innerHTML)
            }
            else {
                //alert('øh... 1')
            }
        }
        else {
            //alert('øh... 2')
        }
    }
    else {
        //alert('øh... 3')
    }
    //window.setTimeout(function(){FlashLoading();}, 25)
    FlashLoading()
} // InsertLoading

function DoneLoading() {
    bFlashLoading = false
    o = document.getElementById('idTableLoading')
    o.style.display = 'none'
    //alert(o.innerHTML)
    //o.innertHTML = ''
    //$(o).hide()
    //oInserted.style.display = 'none'
    //oH1Parent.removeChild(oInserted)
    //oInserted.display = 'none'
    //oInserted.innerHTML = ''
    //alert(oInserted.innerHTML)
    //$(oInserted).hide()
    //document.title = 'balalalal'
    ShowHidePage(true)
    /*
    $('h1').show()
    $('table.main').show()
    $('td.nav').show()
    $('div.hosting').show()
    if (CreateHeaderOverview_Display != undefined) {
        CreateHeaderOverview_Display()
    }
    */
} // DoneLoading

InsertLoading()


