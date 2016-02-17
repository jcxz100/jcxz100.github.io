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
} // show_hang(s)


var g_iLoadAttempts = 0;
var g_iLoadSuccesses = 0;
var g_iLoadFailures = 0;

function load_dyn_onLoad() {
   g_iLoadSuccesses++;
} // load_dyn_onLoad()

function load_dyn_onFailure() {
    g_iLoadFailures++;
} // load_dyn_onFailure()

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
            set_load_event_handlers(r)
            r.setAttribute('type', 'text/javascript');
            r.setAttribute('charset', 'utf-8');
            r.setAttribute('src', sFile);
         }
         break;

         case '.css':
         {
            r = document.createElement('link');
            set_load_event_handlers(r)
            r.setAttribute('rel', 'stylesheet');
            r.setAttribute('type', 'text/css');
            r.setAttribute('charset', 'utf-8');
            r.setAttribute('href', sFile);
         };
         break;

         case '.ico':
         {
            r = document.createElement('link');
            set_load_event_handlers(r);
            r.setAttribute('rel', 'shortcut icon');
            r.setAttribute('type', 'image/x-icon');
            r.setAttribute('href', sFile);
         };
         break;

         case '.png':
         {
            // No onload for favicons. (why??)
            g_iLoadAttempts--

            r = document.createElement('link');
            set_load_event_handlers(r);
            r.setAttribute('rel', 'shortcut icon');
            r.setAttribute('type', 'image/png');
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
function go(bDummy_ignored)
{
document.title = 'g_sLocRoot == ' + g_sLocRoot
    //alert('go - entry')
    iGoCount++
    if (iGoCount > 1) {
        //alert('iGoCount == ' + iGoCount)
        return
    }

   if (typeof(g_sLocRoot) == 'undefined')
   {
      show_hang('(typeof(g_sLocRoot) == "undefined")');
   }
   else
   { 
   /*
      load_dyn(g_sLocRoot + 'js+css/20_loading.js', true);
      load_dyn(g_sLocRoot + 'js+css/20_lassesb.css', false);
      //load_dyn(g_sLocRoot + 'js+css/lassesb_18.css', false);
      load_dyn(g_sLocRoot + 'js+css/jquery-1-11-1/jquery.min.js', true);
      //load_dyn(g_sLocRoot + '/jquery-1.7.min.js', true);

      // Load a bit more common stuff:
      //document.writeln('nå!<br/>')
      //load_dyn(g_sLocRoot + 'js+css/20_dummy.js', true);
        //document.title = 'dummy-hvad?';
      var sScript = g_sLocRoot + 'js+css/20_lassesb.js'
      //var sScript = g_sLocRoot + 'js+css/lassesb_18.js'
      load_dyn(sScript, false);
       //document.title = 'pølse?'
      //document.writeln(sScript + '<br/>')
      //document.writeln('æbæ...<br/>')

      //load_dyn(g_sLocRoot + 'Favicon.ico', true);
      load_dyn(g_sLocRoot + 'Favicon.png', false);/* */
      //alert('nedern')
        //document.writeln('hest?<br/>')
   */}
} // go()

go()
