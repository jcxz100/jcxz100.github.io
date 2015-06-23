// loading_20.js


function UIntToHex(uiVal, iCifre) {
    return s = ((--iCifre <= 0) ? '' : UIntToHex(uiVal / 16, iCifre)) + (uiVal & 0xF).toString(16)
} // UIntToHex


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
    var dollarLoading = $('td.loading')
    dollarLoading.css('backgroundColor', sColor)

    if (bFlashLoading) {
        window.setTimeout(function(){FlashLoading();}, 10)
    }
} // FlashLoading

function InsertLoading() {
    $('h1').before('<table class="loading">'
        + '<tr><td class="loading">Loading...</td></tr>'
        + '<tr><td>&nbsp;</td></tr>'
        + '<tr><td class="below-loading">'
        + 'Hvis scriptet går i baglås, kan du tvinge siden frem ved at '
        + '<a href="javascript:DoneLoading()">klikke her</a>.<br/>'
        + '(Men vær forberedt på, at det nok ser underligt ud.)'
        + '</td></tr>'
        + '</table>'
    )
    //window.setTimeout(function(){FlashLoading();}, 25)
    FlashLoading()
} // InsertLoading

function DoneLoading() {
    bFlashLoading = false
    $('table.loading').hide()
    $('td.loading').html('')
    $('h1').show()
    $('table.main').show()
    $('td.nav').show()
    $('div.hosting').show()
    if (CreateHeaderOverview_Display != undefined) {
        CreateHeaderOverview_Display()
    }
} // DoneLoading

InsertLoading()


