<?php
    $new_tab = "target=\"_blank\" title=\"Åbner i ny tab eller vindue.\"";
    $save_as = "download title=\"Åbner ''gem som'' dialog.\"";

  function input_sanitized($tag, $default = '', $bAcceptQuotes = false, $bHtmlEncodeQuotes = false) {
    $return = $_GET[$tag];
    $bDefault = false;
    if (
        (empty($return))
        ||
        ($return == 'undefined')
    ) {
        $bDefault = true;
    }
    else {
        if (
            (strstr($return, '\'') != '')
            ||
            (strstr($return, '"') != '')
        ) {
            if (!$bAcceptQuotes) $bDefault = true;
            else {
                if ($bHtmlEncodeQuotes)  {
                    $return = str_replace(array('\'', '"'), array('&#39;', '$quot;'), $return);
                }
                else {
                    // Do nothing - accept quotes as they are.
                }
            }
        }
    }
    if ($bDefault) return $default;
    else return $return;
  } // input_sanitized

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
  $dir = input_sanitized('scripts-dir','');

  // index of jplayer:
  $ix = input_sanitized('index', '1');

  // delay connect?
  $delay = input_sanitized('delay-connect', '0');
//  if ($ix != '1') $delay = '1';

  // What is it?
  $what_default = 'musikken';
  $what =  input_sanitized('what', $what_default, true);
  $b_what_default = ($what == $what_default);

  // Maybe release date:
  $date = input_sanitized('date');


  // audio files:
  $audioName = '';
  //
  $fallback = input_sanitized('mp4','');
  $m4a = input_sanitized('m4a',$fallback);
  $m4aName = get_name_only($m4a);
  if (!empty($m4aName)) $audioName = $m4aName;
  //
  $fallback = input_sanitized('ogg','');
  $oga = input_sanitized('oga',$fallback);
  $ogaName = get_name_only($oga);
  if (!empty($m4aName) && empty($audioaudioName)) $audioName = $ogaName;
  //
  $mp3 = input_sanitized('mp3','');
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


  // Maybe youtube link:
  $youtube = input_sanitized('youtube-id');

  // Maybe length:
  $length = input_sanitized('length');


  // Maybe about text:
  $about = input_sanitized('about');

  // Maybe structure text:
  $structure = input_sanitized('structure');

  // Maybe lyrics:
  $lyrics = input_sanitized('lyrics');
  $lyricsName = get_name_only($lyrics, true);

  // Maybe note sheet text:
  $sheet = input_sanitized('sheet');
  $sheetName = get_name_only($sheet, true);

  // Maybe mix details:
  $mixDetails = input_sanitized('mix-details');
  $mixName = get_name_only($mixDetails, true);


  // Maybe old front page:
  $front = input_sanitized('front');

  // Maybe date of old front page:
  $fr_date = input_sanitized('front-date');

  // Maybe whether to load old front into new tab/window:
  $fr_new = input_sanitized('front-new', 'true');
  switch ($fr_new) {
      case '': $fr_new = true; break;
      case '1': $fr_new = true; break;
      case 'true': $fr_new = true; break;
      case '0': $fr_new = false; break;
      case 'false': $fr_new = false; break;
  }
  if (($fr_new != false) && ($fr_new != true)) $fr_new = true;


  // Maybe thoughts:
  $thoughts = input_sanitized('thoughts');
  $thoughtsExt = get_ext_only($thoughts);

  // Maybe date of thoughts:
  $th_date = input_sanitized('thoughts-date');

// ----------------

    // Declare array of player-functions - maybe:
    if ($ix == 1) {
        echo "<script type=\"text/javascript\"><!--\n";
        echo "    var ary_my_jplayers = []\n";
        echo "//--></script>\n";
    }

?>

<div id="id_jplayer_mess_<?php echo $ix; ?>" style="color: #F88;">
    Obs! Hvis denne besked ikke forsvinder,
    så prøv at genindlæse siden.
</div>

<div id="id_show_jplayer_<?php echo $ix; ?>"
<?php if ((!$delay) || (empty($supplied))) echo ' style="display:none;" ' ?>
>
    <img src="/pix/media-types/audio.gif" alt="audio icon" />
    Spil
    <a href='javascript:my_jplayers_show_hide(<?php echo $ix; ?>,true)'
        title="Afspiller filen direkte, vha. javascript."
    >
        <?php echo "$what"; ?></a
    >
    i jPlayer<?php if (!empty($length)) echo "; længde: $length"; ?>.
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
                                    onclick="javascript:$('#jquery_jplayer_<?php echo "$ix"; ?>').jPlayer('pauseOthers');"
                                >play</button>
                                <button class="jp-stop" role="button" tabindex="0"
                                    onclick="javascript:my_jplayers_show_hide(<?php echo $ix; ?>,false)"
                                    title="<?php
                                        if ($delay) echo 'Stop og luk';
                                        else echo 'Stop';
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
    <?php
        echo "<a href=\"$m4a\" $save_as";
        echo ">$m4aName</a>";
    ?>.
</div>
<?php if (empty($m4a)) echo "-->\n"; ?>

<?php if (empty($oga)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/download-gray.png" alt="download icon" />
    Download
    <?php
        echo "<a href=\"$oga\" $save_as";
        echo ">$ogaName</a>";
    ?>.
</div>
<?php if (empty($oga)) echo "-->\n"; ?>

<?php if (empty($mp3)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/download-gray.png" alt="download icon" />
    Download
    <?php
        echo "<a href=\"$mp3\" $save_as";
        echo ">$mp3Name</a>";
    ?>.
</div>
<?php if (empty($mp3)) echo "-->\n"; ?>


<?php if (empty($youtube)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/youtube.gif" alt="youtube icon" />
    Afspil
    <?php
        echo "<a ";
        echo " href=\"https://youtube.com/watch?v=$youtube\"";
        echo " $new_tab";
        echo ">$what</a>";
    ?>
    på youtube.
</div>
<?php if (empty($youtube)) echo "-->\n"; ?>


<?php if (empty($about)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/txt.gif" alt="text icon" />
    Læs nærmere
    <?php
        echo "<a ";
        echo " href=\"$about\"";
        echo " $new_tab";
        echo ">om $what</a>";
    ?>
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
    if ($bPDF)
        echo "Download <a href='$sheet' download title=\"Åbner ''gem som'' dialog.\">";
    else
        echo "Se <a href='$sheet' $new_tab>";
    echo "noder/akkorder her</a>.";
?>
</div>
<?php if (empty($sheet)) echo "-->\n"; ?>

<?php if (empty($lyrics)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/txt.gif" alt="text icon" />
    Læs
    <?php
        echo "<a ";
        echo " href=\"$lyrics\"";
        echo " $new_tab";
        echo ">teksten</a>";
    ?>
    for
    <?php echo "$what" ?>.
</div>
<?php if (empty($lyrics)) echo "-->\n"; ?>

<?php if (empty($mixDetails)) echo "<!--\n"; ?>
<div>
    <img src="/pix/media-types/txt.gif" alt="text icon" />
    Læs
    <?php
        echo "<a ";
        echo " href=\"$mixDetails\"";
        echo " $new_tab";
        echo ">oversigt over mix</a>";
    ?>
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
    <a href=<?php
        echo "\"$front\"";
        if ($fr_new) echo " $new_tab";
        ?>
        >gamle forside</a
    ><?php if (!empty($fr_date)) echo " ($fr_date)" ?>,
    som passede til <?php echo "$what"; ?>.
</div>
<?php
    //if (!empty($front)) {
    //    echo "<!--<script type=\"text/javascript\">";
    //    echo "alert('$fr_new');</script>-->";
    //}
?>
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
    Læs
    <?php
        echo "<a ";
        echo " href=\"$thoughts\"";
        echo " $new_tab";
        echo ">de tanker</a>";
        if (!empty($th_date)) echo " ($th_date)";
    ?>,
    jeg gjorde mig om <?php echo "$what"; ?>.
</div>
<?php if (empty($thoughts)) echo "-->\n"; ?>


<?php
    if (!empty($date)) {
        echo "<div xstyle=\"margin-left: 16px;\">";
        echo "$what er fra $date.</div>";
    }
?>


<script type="text/javascript">
document.title = 'aaaaah'
<?php
function my_jplayer_<?php echo $ix; ?>_show_hide(bShow) {
    if (bShow) { // Show: Load audio and (maybe) play it

<?php if (empty($supplied)) echo "// No audio supplied.\n/*"; ?>

        // Make the jplayer divs visible:
        o = $('#id_my_jplayer_wrapper_<?php echo $ix; ?>')
        o.show()
        // Hide the Play link:
        o = $('#id_show_jplayer_<?php echo $ix; ?>')
        o.hide()

        $('#jquery_jplayer_<?php echo "$ix" ?>').jPlayer({
            ready: function (event) {
                $(this).jPlayer('setMedia', {
                    title: '<?php
                        if ($b_what_default) echo "$audioName";
                        else echo "$what";
                    ?>',
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
                $(this).jPlayer('play',0).jPlayer('pauseOthers');
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
<?php /*
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
        echo "* /\n";
    }
?>
    } // << end of hide
<?php */ ?>
} // my_jplayer_<?php echo $ix; ?>_show_hide()

//alert('der står en ko')
<?php /*
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

<?php
    // Maybe auto-load:
    if (($ix != 1)||($delay == '1')) {
        echo "/* -- No auto-load:\n";
    }
    else {
        echo "// Auto-load:\n";
    }
    echo "my_jplayer_" . $ix . "_show_hide(true))\n";
    if (($ix == 1)&&($delay == '1')) {
        echo "* /\n";
    }
?>

// If all went well, hide warning text:
$('#id_jplayer_mess_<?php echo $ix; ?>').hide()
*/
?>

document.title = 'baaaaah'
</script>
