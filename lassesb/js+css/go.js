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

function load_dyn(sFile, bWaitBefore, oOnLoad)
{
   // First we may need to test if we're done with previous loads:
   if (bWaitBefore) {
      if (g_iLoadAttempts > (g_iLoadSuccesses + g_iLoadFailures)) {
         // We must wait a little longer:
         //alert('waiting');
         window.setTimeout(
            function() {
               load_dyn(sFile, bWaitBefore, oOnLoad);
            },
            50
         );
         // Do no more for now:
         return;
      }
   }

   var r = null;

   if (typeof(sFile) == 'undefined')
   {
      show_hang('(typeof(sFile) == \'undefined\')');
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
            set_load_event_handlers(r, oOnLoad);
            r.setAttribute('src', sFile);
         }
         break;

         case '.css':
         {
            r = document.createElement('link');
            r.setAttribute('rel', 'stylesheet');
            r.setAttribute('type', 'text/css');
            r.setAttribute('charset', 'utf-8');
            set_load_event_handlers(r, oOnLoad);
            r.setAttribute('href', sFile);
         };
         break;

         case '.ico':
         {
            r = document.createElement('link');
            r.setAttribute('rel', 'shortcut icon');
            r.setAttribute('type', 'text/x-icon');
            set_load_event_handlers(r, oOnLoad);
            r.setAttribute('href', sFile);
         };
         break;

         case '.png':
         {
            r = document.createElement('link');
            r.setAttribute('rel', 'shortcut icon');
            r.setAttribute('type', 'text/png');
            set_load_event_handlers(r, oOnLoad);
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

function set_load_event_handlers(r, oOnLoad)
{
   try
   {
      g_iLoadAttempts++;
      r.onload = function() {
         load_dyn_onLoad(oOnLoad);
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
   }
} // set_load_event_handlers()

function load_dyn_onLoad(oOnLoad)
{
   g_iLoadSuccesses++;
   if (oOnLoad != null)
   {
      // Run special "onload" handler:
      //alert('giraffe')
      window.setTimeout(oOnLoad, 100);
   }
} // load_dyn_onLoad()


// Entry point:
function go(oOnLoad, bPlayer)
{
   if ((oOnLoad == undefined) || (oOnLoad == '') || (oOnload == 0)) oOnLoad = null
   if ((bPlayer == undefined) || (bPlayer == null)) bPlayer = false;

   if (typeof(g_sLocRoot) == 'undefined')
   {
      show_hang('(typeof(g_sLocRoot) == "undefined")');
   }
   else
   {
      // Load common stuf:
      load_dyn(g_sLocRoot + 'js+css/lassesb_19.css', false);
      load_dyn(g_sLocRoot + 'jquery-1.7.min.js', false);
      load_dyn(g_sLocRoot + 'js+css/loading_19.js', true);
      //<link rel="Stylesheet" type="text/css" href="/js+css/lassesb_18.css" />
      //<script type="text/javascript" src="/jquery-1.7.min.js"></script>

      // Maybe load jquery music player:
      if (bPlayer)
      {
         load_dyn(g_sLocRoot + 'jQuery.jPlayer.2.1.0/blue.monday/jplayer.blue.monday.css', true);
         load_dyn(g_sLocRoot + 'jQuery.jPlayer.2.1.0/jquery.jplayer.min.js', false);
         //<link rel="Stylesheet" type="text/css"
         //      href="/jQuery.jPlayer.2.1.0/blue.monday/jplayer.blue.monday.css" />
         //<script type="text/javascript"
         //        src="/jQuery.jPlayer.2.1.0/jquery.jplayer.min.js"></script>
      }
      // Load a bit more common stuff:
      load_dyn(g_sLocRoot + 'js+css/lassesb_19.js', true, oOnLoad);
      load_dyn(g_sLocRoot + 'Favicon.ico', true);
      load_dyn(g_sLocRoot + 'Favicon.png', true);
      //<script type="text/javascript" src="/js+css/lassesb_18.js"></script>
      //<link rel="shortcut icon" type="image/x-icon" href="/Favicon.ico" />
      //<link rel="shortcut icon" type="image/png" href="/Favicon.png" />
   }
} // go(oOnLoad, bPlayer)
