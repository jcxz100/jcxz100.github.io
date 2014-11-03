
function
writeCCLicense(sSongName,
bLyricsOnly)
{
var
bThese
=
(sSongName
==
null)
var
sItem_da
=
(bThese
?
(bLyricsOnly
?
"disse
oversættelser"
:
"disse
sange")
:
(bLyricsOnly
?
"denne
tekst"
:
"denne
sang"))
var
sItem_en
=
(bThese
?
(bLyricsOnly
?
"these
translations"
:
"these
songs")
:
(bLyricsOnly
?
"this
text"
:
"this
song"))
//document.writeln('test')
document.writeln('<table
itemprop="mainContentOfPage"
itemtype="http://schema.org/WPFooter"
itemscope')
document.writeln('cellpadding="0"
cellspacing="0"
width="100%"><tr>')
document.writeln('
<td>')
document.writeln('
<span')
document.writeln('
xmlns:dc="http://purl.org/dc/elements/1.1/"')
document.writeln('
href="http://purl.org/dc/dcmitype/Sound"')
document.writeln('
property="dc:title"')
document.writeln('
rel="dc:type"')
document.writeln('
>')
document.writeln('
<span
class="hidden"
itemprop="about">test
hest</span>')
if
(!bThese)
document.writeln('"'
+
sSongName
+
'"')
else
{
document.write('<span
lang="en-us"'
+
sClassHidden_en
+
'>')
document.writeln(upCaseFirstLetter(sItem_en)
+
'</span>')
document.write('<span
lang="da"'
+
sClassHidden_da
+
'>')
document.writeln(upCaseFirstLetter(sItem_da)
+
'</span>')
}
document.writeln('
</span>')
document.writeln('
<span
lang="en-us"'
+
sClassHidden_en
+
'>by</span>')
document.writeln('
<span
lang="da"'
+
sClassHidden_da
+
'>af</span>')
document.writeln('
<span')
document.writeln('
xmlns:cc="http://creativecommons.org/ns#"')
document.writeln('
property="cc:attributionName"')
document.writeln('
>')
document.writeln('
lassesb')
document.writeln('
</span>')
document.writeln('
<span
lang="en-us"'
+
sClassHidden_en
+
'>'
+
(bThese
?
'are'
:
'is')
+
'
licensed
under
a:</span>')
document.writeln('
<span
lang="da"'
+
sClassHidden_da
+
'>frigives
under
følgende
licens:</span>')
document.writeln('
<br
/>')
document.writeln('
<a
target="_blank"')
document.writeln('
rel="license"')
document.writeln('
href="http://creativecommons.org/licenses/by-nc-sa/3.0/"')
document.writeln('
>')
document.writeln('
Creative
Commons
Attribution-Noncommercial-Share
Alike
3.0
Unported
License</a')
document.writeln('
>.')
document.writeln('
</td>')
document.writeln('
<td>&nbsp;&nbsp;</td>')
document.writeln('
<td
align="right">')
document.writeln('
<a
target="_blank"')
document.writeln('
rel="license"')
document.writeln('
href="http://creativecommons.org/licenses/by-nc-sa/3.0/"')
document.writeln('
>')
document.writeln('
<img')
document.writeln('
alt="Creative
Commons
License"')
document.writeln('
style="border-width:0"')
document.writeln('
src="http://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png"')
document.writeln('
/></a')
document.writeln('
>')
document.writeln('
</td>')
document.writeln('</tr></table>')
document.writeln('<p
lang="da"'
+
sClassHidden_da
+
'>')
document.writeln("
Lidt
forsimplet
betyder
det,
at
alle
må
gøre,
<i>hvad
de
vil</i>,
med
"
+
sItem_da
+
";")
document.writeln("
<i>undtagen
tjene
penge</i>.")
document.writeln("
For
en
detaljeret
forklaring
besøg")
document.writeln("
<a
href='http://creativecommons.org/licenses/by-nc-sa/3.0/'>Creative
Commons'</a>")
document.writeln("
hjemmeside.<br
/>")
document.writeln("
Hvis
du
ønsker
at
gøre
noget
med
"
+
sItem_da
+
",
som
ville
bryde")
document.writeln("
CC
licensen,
skal
du
have
min
tilladelse
først.<br/>")
if
(bLyricsOnly)
{
var
sLyrics1
=
(bThese
?
'oversættelserne'
:
'oversættelsen')
var
sLyrics2
=
(bThese
?
'disse
oversættelser'
:
'denne
oversættelse')
document.writeln('<br/>')
document.writeln('<i><b>Bemærk!</b>
CC
licensen
gælder
udelukkende
for
'
+
sLyrics1
+
'!')
document.writeln('Dvs
hvis
du
fx
vil
optræde
med
'
+
sLyrics2
+
'
med
originalmelodi
på,')
document.writeln('så
<b>skal</b>
der
betales
Koda/Gramex.')
document.writeln('Dette
gælder,
uanset
om
det
er
et
kommercielt
arrangement
eller
ej.</i><br/>')
}
document.writeln('</p>')
document.writeln('<p
lang="en-us"'
+
sClassHidden_en
+
'>')
document.writeln("
In
short
this
means
that
everybody
are
allowed
to
do
<i>whatever
they
want</i>
to
with
"
+
sItem_en
+
";")
document.writeln("
<i>except
make
money</i>.")
document.writeln("
For
a
detailed
explanation
please
visit
the
homepage
of
")
document.writeln("
<a
href='http://creativecommons.org/licenses/by-nc-sa/3.0/'>Creative
Commons</a>.<br
/>")
document.writeln("
If
you
want
to
do
anything
with
"
+
sItem_en
+
"
that
would
violate")
document.writeln("
the
CC
license,
you'll
need
to
get
my
permission
first.<br/>")
if
(bLyricsOnly)
{
var
sLyrics1
=
(bThese
?
'the
translations'
:
'the
translation')
var
sLyrics2
=
(bThese
?
'these
translations'
:
'this
translation')
document.writeln('<br/>')
document.writeln('<i><b>Note!</b>
The
CC
license
only
applies
to
'
+
sLyrics1
+
'!')
document.writeln('I.e.
if
you
for
instance
want
to
perform
'
+
sLyrics2
+
'
with
the
original
melody,')
document.writeln('then
the
relevant
national
fee
(of
the
country
the
performance
is
done
in)
<b>must</b>
be
payed.')
document.writeln('This
applies
regardless
of
whether
it\'s
a
commercial
arrangement
or
not.</i><br/>')
}
document.writeln('</p>')
}
//
writeCCLicense
