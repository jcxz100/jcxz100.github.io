<?php

  function input_no_end_quotes($tag, $default = '') {
    $return = $_GET[$tag];
    if (
      (empty($return))
      ||
      ($return == 'undefined')
      ||
      (strstr($return, '\'') != '')
      ||
      (strstr($return, '"') != '')
    ) {
      $return = $default;
    }
    return $return;
  } // input_no_end_quotes

  function get_name_only($path, $bRemoveExt = false) {
    $ixSlash = strrpos($path, '/');
    if ($ixSlash === false) { // note: three equal signs
      // not found...
    }
    else {
      $path = substr($path, $ixSlash+1);
    }

    if ($bRemoveExt) {
        $ixDot = strrpos($path, '.');
        if ($ixDot === false) { // note: three equal signs
            // not found...
        }
        else {
            $path = substr($path, 0, $ixDot);
        }
    }

    return $path;
  } // get_name_only

  function get_ext_only($path) {
    $ixDot = strrpos($path, '.');
    if ($ixDot === false) { // note: three equal signs
        // not found...
        return '';
    }
    else {
        $ext = substr($path, $ixDot);
        //echo "$ext";
        return $ext;
    }
  } // get_ext_only


  // js + css + flash dir:
  $dir = input_no_end_quotes('scripts-dir','');

  // index of jplayer:
  $ix = input_no_end_quotes('index', '1');

  // delay connect?
  $delay = input_no_end_quotes('delay-connect', '0');
//  if ($ix != '1') $delay = '1';

  // What is it?
  $what =  input_no_end_quotes('what', 'musikken');

  // audio files:
  $audioName = '';
  //
  $fallback = input_no_end_quotes('mp4','');
  $m4a = input_no_end_quotes('m4a',$fallback);
  $m4aName = get_name_only($m4a);
  if (!empty($m4aName)) $audioName = $m4aName;
  //
  $fallback = input_no_end_quotes('ogg','');
  $oga = input_no_end_quotes('oga',$fallback);
  $ogaName = get_name_only($oga);
  if (!empty($m4aName) && empty($audioaudioName)) $audioName = $ogaName;
  //
  $mp3 = input_no_end_quotes('mp3','');
  $mp3Name = get_name_only($mp3);
  if (!empty($mp3Name) && empty($audioaudioName)) $audioName = $mp3Name;
  //
  $audioName_DotIx = strrpos($audioName, '.');
  if ($audioName_DotIx === false) { // note: three equal signs
    // not found...
  }
  else {
    $audioName = substr($audioName, 0, $audioName_DotIx);
  }

  // which audio filetypes are there?
  $supplied = '';
  if (!empty($m4a)) $supplied = 'm4a';
  if (!empty($oga)) {
    if (empty($supplied)) $supplied = 'oga';
    else $supplied = $supplied . ', oga';
  }
  if (!empty($mp3)) {
    if (empty($supplied)) $supplied = 'mp3';
    else $supplied = $supplied . ', mp3';
  }

/*
  // fallback to audio from jplayer demo:
  if (empty($supplied)) {
    $m4a = 'http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a';
    $oga = 'http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg';
    $supplied = 'm4a, oga';
  }
*/


  // Maybe youtube link:
  $youtube = input_no_end_quotes('youtube-id');

  // Maybe length:
  $length = input_no_end_quotes('length');


  // Maybe about text:
  $about = input_no_end_quotes('about');

  // Maybe structure text:
  $structure = input_no_end_quotes('structure');

  // Maybe lyrics:
  $lyrics = input_no_end_quotes('lyrics');
  $lyricsName = get_name_only($lyrics, true);

  // Maybe note sheet text:
  $sheet = input_no_end_quotes('sheet');
  $sheetName = get_name_only($sheet, true);

  // Maybe mix details:
  $mixDetails = input_no_end_quotes('mix-details');
  $mixName = get_name_only($mixDetails, true);


  // Maybe old front page:
  $front = input_no_end_quotes('front');

  // Maybe date of old front page:
  $fr_date = input_no_end_quotes('front-date');
  //echo "<script type='text/javascript'>alert('$fr_date')</script>";

  // Maybe thoughts:
  $thoughts = input_no_end_quotes('thoughts');
  $thoughtsExt = get_ext_only($thoughts);

  // Maybe date of thoughts:
  $th_date = input_no_end_quotes('thoughts-date');

// ----------------

    // Declare array of player-functions - maybe:
    if ($ix == 1) {
        echo "<script type=\"text/javascript\"><!--\n";
        echo "    var ary_my_jplayers = []\n";
        echo "//--></script>\n";
    }

?>

<div id="id_show_jplayer_<?php echo $ix; ?>"
<?php if ((!$delay) || (empty($supplied))) echo ' style="display:none;" ' ?>
>
    <img src="/pix/media-types/audio.gif" alt="audio icon" />
    <a href='javascript:my_jplayers_show_hide(<?php echo $ix; ?>,true)'>
        Spil <?php echo "$what"; ?></a
    >
    her (i jplayer)<?php if (!empty($length)) echo "; længde: $length"; ?>.
</div>

<table cellpadding=0 cellspacing=0 border=0>
<tr id="id_my_jplayer_wrapper_<?php echo $ix; ?>"
<?php if (($delay) || (empty($supplied))) echo ' style="display:none;" ' ?>
>
    <td><img src="/pix/media-types/audio.gif" alt="audio icon" />&nbsp;</td>
    <td>

<div id='jquery_jplayer_<?php echo "$ix"; ?>' class="jp-jplayer"></div>
<div id='jp_container_<?php echo "$ix"; ?>' class="jp-audio" role="application" aria-label="media player">
        <div class="jp-type-single">
                <div class="jp-gui jp-interface">
                        <div class="jp-controls">
                                <button class="jp-play" role="button" tabindex="0"
                                    title="Play/pause"
                                >play</button>
                                <button class="jp-stop" role="button" tabindex="0"
                                    onclick="javascript:my_jplayers_show_hide(<?php echo $ix; ?>,false)"
                                    title="<?php
                                        if ($bKeep) echo 'Stop';
                                        else echo 'Stop og luk';
                                    ?>"
                                >
                                    stop
                                </button>
                        </div>
                        <div class="jp-progress">
                                <div class="jp-seek-bar">
                                        <div class="jp-play-bar"></div>
                                </div>
                        </div>
                        <div class="jp-volume-controls">
                                <button class="jp-mute" role="button" tabindex="0"
                                    title="Skru helt ned"
                                >mute</button>
                                <button class="jp-volume-max" role="button" tabindex="0"
                                    title="Skru helt op"
                                >max volume</button>
                                <div class="jp-volume-bar">
                                        <div class="jp-volume-bar-value"></div>
                                </div>
                        </div>
                        <div class="jp-time-holder">
                                <div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>
                                <div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>
                                <div class="jp-toggles">
                                        <button class="jp-repeat" role="button" tabindex="0"
                                            title="Gentag"
                                        >repeat</button>
                                </div>
                        </div>
                </div>
                <div class="jp-details">
                        <div class="jp-title" aria-label="title">&nbsp;</div>
                </div>
                <div class="jp-no-solution">
                        <span>Update Required</span>
                        To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
                </div>
        </div>
</div>

</td></tr></table>

<?php if (empty($m4a)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/download-gray.png" alt="download icon" />
    Download
    <a href='<?php echo "$m4a"; ?>' download target="_blank">
        <?php echo "$m4aName"; ?></a
    >.
</div>
<?php if (empty($m4a)) echo "-->\n"; ?>

<?php if (empty($oga)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/download-gray.png" alt="download icon" />
    Download
    <a href='<?php echo "$oga"; ?>' download target="_blank">
        <?php echo "$ogaName"; ?></a
    >.
</div>
<?php if (empty($oga)) echo "-->\n"; ?>

<?php if (empty($mp3)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/download-gray.png" alt="download icon" />
    Download
    <a href='<?php echo "$mp3"; ?>' download target="_blank">
        <?php echo "$mp3Name"; ?></a
    >.
</div>
<?php if (empty($mp3)) echo "-->\n"; ?>


<?php if (empty($youtube)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/youtube.gif" alt="youtube icon" />
    <a href='https://youtube.com/watch?v=<?php echo "$youtube"; ?>' target="_blank">
        Afspil <?php echo "$what"; ?> </a
    >
    på youtube.
</div>
<?php if (empty($youtube)) echo "-->\n"; ?>


<?php if (empty($about)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/txt.gif" alt="text icon" />
    Læs nærmere
    <a href='<?php echo "$about"; ?>' target="_blank">
        om <?php echo "$what"; ?></a
    >.
</div>
<?php if (empty($about)) echo "-->\n"; ?>

<?php if (empty($structure)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/txt.gif" alt="text icon" />
    Læs
    <a href='<?php echo "$structure"; ?>' target="_blank">
        om strukturen</a
    > af <?php echo "$what"; ?>.
</div>
<?php if (empty($structure)) echo "-->\n"; ?>

<?php if (empty($sheet)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/notes.gif" alt="nodeark icon" />
<?php
    $bPDF = (!empty($sheet) && (get_ext_only("$sheet") == ".pdf"));
    if ($bPDF) echo "Download <a href='$sheet' download>";
    else echo "Se <a href='$sheet' target='_blank'>";
    echo "noder/akkorder her</a>.";
?>
</div>
<?php if (empty($sheet)) echo "-->\n"; ?>

<?php if (empty($lyrics)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/txt.gif" alt="text icon" />
    Læs
    <a href='<?php echo "$lyrics"; ?>' target="_blank">
        teksten</a
    >
    for
    <?php echo "$what" ?>.
</div>
<?php if (empty($lyrics)) echo "-->\n"; ?>

<?php if (empty($mixDetails)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/txt.gif" alt="text icon" />
    Læs
    <a href='<?php echo "$mixDetails"; ?>' target="_blank">
        oversigt over mix</a
    >
    af
    <?php
        echo "$what";
        if (!empty($mixName)) echo " ($mixName)"
    ?>.
</div>
<?php if (empty($mixDetails)) echo "-->\n"; ?>


<?php if (empty($front)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/html.png" alt="link icon" />
    Se den
    <a href='<?php echo "$front"; ?>' target="_blank">
        gamle forside</a
    ><?php if (!empty($fr_date)) echo " ($fr_date)" ?>,
    som passede til <?php echo "$what"; ?>.
</div>
<?php if (empty($front)) echo "-->\n"; ?>

<?php if (empty($thoughts)) echo "<!--\n"; ?>
<div>
    <img
        <?php
            switch (get_ext_only($thoughts)) {
                case '.pdf':
                    echo 'src="/pix/media-types/pdf.gif" alt="pdf icon"';
                    break;
                case '.html':
                    echo 'src="/pix/media-types/html.png" alt="link icon"';
                    break;
                default:
                    echo 'src="/pix/media-types/txt.gif" alt="tekst icon"';
                    break;
            }
        ?>
    />
    Læs de
    <a href='<?php echo "$thoughts"; ?>' target="_blank">
        tanker</a
    ><?php if (!empty($th_date)) echo " ($th_date)" ?>,
    jeg gjorde mig om <?php echo "$what"; ?>.
</div>
<?php if (empty($thoughts)) echo "-->\n"; ?>


<script type="text/javascript"><!--

function my_jplayer_<?php echo $ix; ?>_show_hide(bShow) {
    if (bShow) { // Show: Load audio and (maybe) play it

<?php if ($supplied == '') echo "// No audio supplied.\n/*"; ?>

        // Make the jplayer divs visible:
        o = $('#id_my_jplayer_wrapper_<?php echo $ix; ?>')
        o.show()
        // Hide the Play link:
        o = $('#id_show_jplayer_<?php echo $ix; ?>')
        o.hide()

        $('#jquery_jplayer_<?php echo "$ix" ?>').jPlayer({
            ready: function (event) {
                $(this).jPlayer('setMedia', {
                    title: '<?php echo "$audioName" ?>',
<?php
  if (!empty($m4a)) {
    echo "                    m4a: '$m4a'";
    if (!empty($oga) || !empty($mp3)) echo ',';
    echo "\n";
  }
?>
<?php
  if (!empty($oga)) {
    echo "                    oga: '$oga'";
    if (!empty($mp3)) echo ',';
    echo "\n";
  }
?>
<?php
  if (!empty($mp3)) {
    echo "                    mp3: '$mp3'\n";
  }
?>
                });
<?php if (!$delay) echo "//"; ?>
                $(this).jPlayer('play',0);
            }, // ready

            abort: function(event) {
                //alert('nederdel')
                //$(this).jPlayer('destroy')
                my_jplayer_<?php echo $ix; ?>_show_hide(false)
            },

            swfPath: '<?php echo "$dir"; ?>',
            supplied: '<?php echo "$supplied"; ?>',
<?php if ($ix == 1) echo "//"; ?>
            cssSelectorAncestor: '#jp_container_<?php echo $ix; ?>',
            wmode: 'window',
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true
        });

<?php if ($supplied == '') echo "*/ // No audio supplied.\n"; ?>

    } // << end of show

    // ----

    else { // Hide:
<?php
    if ($delay) {
        echo "// Destroy and hide player:\n\n";
    }
    else {
        echo "// This player must not be hidden.\n\n"
           . "/*\n";
    }
?>
        // Kill content:
        var o = $('#jquery_jplayer_<?php echo "$ix" ?>')
        o.jPlayer("destroy")
        // Make the Play link visible:
        o = $('#id_show_jplayer_<?php echo $ix; ?>')
        o.show()
        // Hide the jplayer divs:
        o = $('#id_my_jplayer_wrapper_<?php echo $ix; ?>')
        o.hide()
<?php
    if (!$delay) {
        echo "*/\n";
    }
?>
    } // << end of hide
} // my_jplayer_<?php echo $ix; ?>_show_hide()

// Auto-play:
<?php if ($delay == '1') echo '/*\n// No, preload and don\'t auto-play...'; ?>
$(document).ready(my_jplayer_<?php echo $ix; ?>_show_hide(true))
<?php if ($delay == '1') echo '*/'; ?>

<?php
if ($ix == 1) {
    echo "function my_jplayers_show_hide(iIx, bShow) {\n"
       . "    if (iIx == null) return\n"
       . "    if ((iIx >= 1) && (iIx <= ary_my_jplayers.length)) {\n"
       . "        ary_my_jplayers[iIx-1](bShow)\n"
       . "    }\n"
       . "} // my_jplayers_show_hide()\n"
       . "\n";
}
echo "ary_my_jplayers[ary_my_jplayers.length] = my_jplayer_" . $ix . "_show_hide\n";
?>

//--></script>
