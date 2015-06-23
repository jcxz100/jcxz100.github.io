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
            r.setAttribute('type', 'image/x-icon');
            set_load_event_handlers(r, oOnLoad);
            r.setAttribute('href', sFile);
         };
         break;

         case '.png':
         {
            r = document.createElement('link');
            r.setAttribute('rel', 'shortcut icon');
            r.setAttribute('type', 'image/png');
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
      load_dyn(g_sLocRoot + 'js+css/jquery-1-11-1/jquery.min.js', true);
      load_dyn(g_sLocRoot + 'js+css/20_loading.js', true);
      load_dyn(g_sLocRoot + 'js+css/20_lassesb.css', false);

      // Maybe load jquery music player:
      if (bPlayer)
      {
         load_dyn(g_sLocRoot + 'js+css/jplayer-2-9-2/css/jplayer.blue.monday.min.css', true);
         load_dyn(g_sLocRoot + 'js+css/jplayer-2-9-2/jquery.jplayer.min.js', true);
      }

      // Load a bit more common stuff:
      load_dyn(g_sLocRoot + 'js+css/20_lassesb.js', true, oOnLoad);
      load_dyn(g_sLocRoot + 'Favicon.png', true);
      load_dyn(g_sLocRoot + 'Favicon.ico', true);
      //alert('nedern')
   }
} // go(oOnLoad, bPlayer)
