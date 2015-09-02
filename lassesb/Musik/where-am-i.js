// ./where-am-i.js

// This is for only ever showing "hang" dialog once:
var g_bHangShown = false;

var g_sLocRoot = null;
function wai_hook()
{
    if (g_sLocRoot == null)
    {
        var s = document.location.toString();

        var sLSB = '/lassesb/';
        var i = s.lastIndexOf(sLSB);
        if (i < 0) g_sLocRoot = '/';
        else g_sLocRoot = s.substr(0, i + sLSB.length);

        var r = document.createElement('script');
        try
        {
            r.setAttribute('type', 'text/javascript');
            //var sSrc = g_sLocRoot + 'js+css/20_go.js';
            var sSrc = g_sLocRoot + 'js+css/go.js';
            r.setAttribute('src', sSrc);
            document.getElementsByTagName('head')[0].appendChild(r);
        }
        catch (err)
        {
            // That didn't work:
           if (!g_bHangShown) {
              g_bHangShown = true;
              var sHangMsg = 'Hang that programmer!\n' + err.message
              document.title = err.message
              alert(sHangMsg);
           }
        }
    }
} // wai_hook()

wai_hook()
