// /js+css/go.js

function show_hang(s)
{
   if ((g_bHangShown == undefined) || (!g_bHangShown))
   {
      g_bHangShown = true;
      try
      {
         throw Error(s);
      }
      catch (err)
      {
         alert('Hang the programmer!    \n' + err.message);
      }
   }
}; // show_hang(s)


var g_iLoadAttempts = 0;
var g_iLoadSuccesses = 0;
var g_iLoadFailures = 0;

function load_dyn_onLoad()
{
    //alert('load_dyn_onLoad - entry')
   g_iLoadSuccesses++;
//   if (oOnLoad != null)
//   {
//        //alert('load_dyn_onLoad - oOnLoad')
//      // Run special "onload" handler:
//      //alert('giraffe')
//      window.setTimeout(load_dyn_onLoad(), 100);
//   }
    //alert('load_dyn_onLoad - exit')
} // load_dyn_onLoad()

function load_dyn_onFailure()
{
    // Do nothing (yet)
    g_iLoadFailures++;
    //document.writeln('load_dyn_onFailure()<br/>')
    alert('load_dyn_onFailure()<br/>')
}

function set_load_event_handlers(r)
{
   try
   {
      //g_iLoadAttempts++;
      r.onload = function() {
         load_dyn_onLoad();
      };
      r.onerror = function() {
         load_dyn_onFailure();
      };
      if (typeof(r.onabort) != 'undefined') {
         // Better look out for this on ie:
         r.onabort = function() {
            load_dyn_onFailure();
         };
      }
   }
   catch (err)
   {
      show_hang(err.message);
      load_dyn_onFailure();
   }
} // set_load_event_handlers()


var g_bLastWaitAfter = false

function load_dyn(sFile, bWaitAfter)
{
    //alert('load_dyn: ' + sFile)
   // First we may need to test if we're done with previous loads:
   //alert('' + g_iLoadAttempts + ':' + g_iLoadSuccesses + ':' + g_iLoadFailures + '<br/>');
   if (g_bLastWaitAfter) {
      if (g_iLoadAttempts > (g_iLoadSuccesses + g_iLoadFailures)) {
         // We must wait a little longer:
         //var oNavs = document.getElementsByClassName('nav')
         //alert(oNavs.length)
         //var oNav = null
         //if (oNavs.length > 0) {
         //    oNav = oNavs[0]
         //    oNav.innerHTML = oNav.innerHTML + g_iLoadAttempts + ':' + g_iLoadSuccesses + ':' + g_iLoadFailures + '<br/>'
         //}
         //alert('' + g_iLoadAttempts + ':' + g_iLoadSuccesses + ':' + g_iLoadFailures + '<br/>');
//         document.writeln('' + g_iLoadAttempts + ':' + g_iLoadSuccesses + ':' + g_iLoadFailures + '<br/>');
//         document.writeln('waiting<br/>');
         //alert('' + g_iLoadAttempts + ':' + g_iLoadSuccesses + ':' + g_iLoadFailures + '<br/>');
         window.setTimeout(
            function() {
               load_dyn(sFile, bWaitAfter);
            },
            50
         );
         // Do no more for now:
         return;
      }
   }
   g_bLastWaitAfter = bWaitAfter
   g_iLoadAttempts++
    //document.writeln('hvaba?<br/>')

   var r = null;

   if (typeof(sFile) == 'undefined')
   {
      show_hang('(typeof(sFile) == \'undefined\')');
   }
   else if (sFile == '') {
      show_hang('sFile == \'\')');
   }
   else
   {
      var i = sFile.lastIndexOf('.');
      if (i < 0) return;
      switch (sFile.substr(i))
      {
         case '.js':
         {
            r = document.createElement('script');
            r.setAttribute('type', 'text/javascript');
            r.setAttribute('charset', 'utf-8');
            set_load_event_handlers(r)
            r.setAttribute('src', sFile);
         }
         break;

         case '.css':
         {
            r = document.createElement('link');
            r.setAttribute('rel', 'stylesheet');
            r.setAttribute('type', 'text/css');
            r.setAttribute('charset', 'utf-8');
            set_load_event_handlers(r)
            r.setAttribute('href', sFile);
         };
         break;

         case '.ico':
         {
            r = document.createElement('link');
            r.setAttribute('rel', 'shortcut icon');
            r.setAttribute('type', 'image/x-icon');
            set_load_event_handlers(r);
            r.setAttribute('href', sFile);
         };
         break;

         case '.png':
         {
            r = document.createElement('link');
            r.setAttribute('rel', 'shortcut icon');
            r.setAttribute('type', 'image/png');
            set_load_event_handlers(r);
            r.setAttribute('href', sFile);
         };
         break;

         default:
         {
            show_hang('switch (sFile.substr(i)) -> default');
            return;
         }
         break;
      }
      if (typeof(r) == 'undefined')
      {
         show_hang('(typeof(r) == "undefined")');
      }
      else
      {
         document.getElementsByTagName('head')[0].appendChild(r);
      }
   }
} // load_dyn(sFile, bWaitBefore, oOnLoad)

// Only call 'go' once:
var iGoCount = 0

// Entry point:
function go(bPlayer)
{
    //alert('go - entry')
    iGoCount++
    if (iGoCount > 1) {
        //alert('iGoCount == ' + iGoCount)
        return
    }

    var oOnLoad = null
   if ((oOnLoad == undefined) || (oOnLoad == '') || (oOnload == 0)) oOnLoad = null
   if ((bPlayer == undefined) || (bPlayer == null)) bPlayer = false;

   if (typeof(g_sLocRoot) == 'undefined')
   {
      show_hang('(typeof(g_sLocRoot) == "undefined")');
   }
   else
   {
      //document.writeln('hallo?<br/>')
      // Load common stuf:
      load_dyn(g_sLocRoot + 'js+css/20_loading.js', true);
      load_dyn(g_sLocRoot + 'js+css/20_lassesb.css', false);
      load_dyn(g_sLocRoot + 'js+css/jquery-1-11-1/jquery.min.js', true);
      //document.writeln('næ...<br/>')

      // Maybe load jquery music player:
      if (bPlayer)
      {
         load_dyn(g_sLocRoot + 'js+css/jplayer-2-9-2/css/jplayer.blue.monday.min.css', false);
         load_dyn(g_sLocRoot + 'js+css/jplayer-2-9-2/jquery.jplayer.min.js', false);
      }

      // Load a bit more common stuff:
      //document.writeln('nå!<br/>')
      load_dyn(g_sLocRoot + 'js+css/20_dummy.js', true);
        //document.title = 'dummy-hvad?';
      var sScript = g_sLocRoot + 'js+css/20_lassesb-test.js'
      load_dyn(sScript, false);
       //document.title = 'pølse?'
      //document.writeln(sScript + '<br/>')
      //document.writeln('æbæ...<br/>')

      //load_dyn(g_sLocRoot + 'Favicon.ico', true);
      load_dyn(g_sLocRoot + 'Favicon.png', false);
      //alert('nedern')
        //document.writeln('hest?<br/>')
   }
} // go(oOnLoad, bPlayer)

go()
