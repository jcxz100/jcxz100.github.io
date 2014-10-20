@ECHO OFF
SETLOCAL
set lsb1=%1
IF "%1"=="" GOTO lblFirst
IF "%2"=="" GOTO lblErrSyntax
IF "%3"=="" GOTO lblNext
REM WinXP workaround: Saml %1 ud fra stumperne:
:lblLoopShift
SET lsb1=%lsb1% %2
SHIFT /2
IF NOT "%3"=="" GOTO lblLoopShift
REM Nu er %3 tom.
REM Undersøg om %2 er numerisk:
SET "lsbParse="&FOR /F "delims=0123456789." %%x IN ("%2") DO SET lsbParse=%%x
IF "%lsbParse%"=="" GOTO lblNext
GOTO lblErrSyntax


:lblErrSyntax
ECHO Syntax error.
ECHO %%0 == %0
ECHO %%1 == %lsb1%
ECHO %%2 == %2
ECHO %%3 == %3
ECHO 
PAUSE
GOTO lblEnd

:lblErrRevision
ECHO Error: Unable to find svn revision of current folder (%cd%).
PAUSE
REM Oprydning:
DEL SVN-INFO.$$$
GOTO lblEnd


:lblFirst
REM Indledende manøvrer:
SET lsbRevision=
svn info -r HEAD "." > SVN-INFO.$$$
FOR /F "tokens=1,2" %%a IN (SVN-INFO.$$$) DO (
	IF "%%a"=="Revision:" (
		ECHO %%a %%b
		SET lsbRevision=%%b
	)
)
IF "%lsbRevision%"=="" GOTO lblErrRevision
SET /A lsbRevision=%lsbRevision% + 1
REM Oprydning:
DEL SVN-INFO.$$$
REM Gå i gang med listings:
CALL :funcDoListing
REM Dyk ned i mappestruktur:
FOR /D %%a IN (*) DO CALL %0 %%~sa\ %lsbRevision%
GOTO lblEnd


:lblNext
REM Undersøg, om vi er havnet i en uheldig undermappe:
SET lsbIsHistory=0
SETLOCAL EnableDelayedExpansion
FOR /D %%f IN ("%lsb1%\.") DO IF /I "%%~nf" == "_History" SET lsbIsHistory=1
IF "!lsbIsHistory!" == "1" GOTO lblEnd
ENDLOCAL
REM Nej, mappen er ok
REM Lav listings:
CALL :funcDoListing %lsb1%
REM Dyk videre ned i mappestruktur:
FOR /D %%a IN ("%lsb1%*") DO CALL %0 %%~sa\ %lsbRevision%
GOTO lblEnd


:funcDoListing
SETLOCAL EnableDelayedExpansion
REM Generer filnavn:
SET lsbDirFile=%lsb1%.\_History\DIR-FOER-REVISION-!lsbRevision!-[%date%].TXT
SET lsbSvnAddFile=1
IF EXIST "!lsbDirFile!" SET lsbSvnAddFile=0
REM Klargør til at huske indhold af fil:
SET lsbText_Len=0
REM Skriv header på fil:
ECHO.
ECHO Laver fil for mappen "%lsb1%"
IF NOT EXIST "%lsb1%.\_History" ( MKDIR "%lsb1%.\_History" & svn add "%lsb1%.\_History" )
ECHO -----------------------------------------------> !lsbDirFile!
ECHO Autogenereret før svn revision commit !lsbRevision!>> !lsbDirFile!
ECHO ----------------------------------------------->> !lsbDirFile!
ECHO.>> !lsbDirFile!
ECHO Tidsstempel: %date% %time%>> !lsbDirFile!
ECHO.>> !lsbDirFile!
SET lsbFirstFile=1
SET lsbFirstFolder=1
FOR /F "delims=¬ eol=¬" %%f IN ('DIR /OGN "%lsb1%"') DO (
	FOR /F "tokens=1,2,3,4,5,6,7 eol=¬" %%g IN ("%%f") DO (
		IF /I "%%g"=="Volume" (
			REM do nothing.
		) ELSE IF "%%g"=="" (
			REM do nothing.
		) ELSE IF /I "%%h"=="File(s)" (
			REM do nothing.
		) ELSE IF /I "%%h"=="Dir(s)" (
			REM do nothing.
		) ELSE IF /I "%%j"=="." (
			REM do nothing.
		) ELSE IF /I "%%j"==".." (
			REM do nothing.
		) ELSE IF /I "%%g"=="Directory" (
			REM Overskrift:
			ECHO %%f>> !lsbDirFile!
			ECHO.>> !lsbDirFile!
		) ELSE IF /I "%%h"=="Directory" (
			REM Overskrift:
			ECHO %%f>> !lsbDirFile!
			ECHO.>> !lsbDirFile!
		) ELSE (
			SET "lsbParse="&FOR /F "delims=0123456789." %%x IN ("%%i") DO SET lsbParse=%%x
			REM ECHO "!lsbParse!"
			IF "!lsbParse!" == "" (
				REM Fil:
				SET lsbFile=%%j
				SET lsbSkipDirFile=0
				IF /I "!lsbFile:~-4!" == ".TXT" (
					IF /I "!lsbFile:~0,17!" == "DIR-FOER-REVISION" (
						SET lsbSkipDirFile=1
						REM PS: Dette er ikke aktiv kode - filerne ligger i _History mapperne nu.
					)
				)
				if "!lsbSkipDirFile!"=="1" (
					REM do nothing.
				) ELSE (
					IF "!lsbFirstFile!" == "1" (
						IF "!lsbFirstFolder!" == "1" (
							REM Der var ingen mapper - lav skillelinie nu:
							ECHO ----------------------------------------------->> !lsbDirFile!
							ECHO.>> !lsbDirFile!
						)
						SET lsbFirstFile=0
						ECHO.>> !lsbDirFile!
					)
					REM Skriv linie:
					ECHO %%f>> !lsbDirFile!
					SET lsbText_Name=lsbText_!lsbText_Len!
					SET !lsbText_Name!=%%f
					SET /A lsbText_Len=!lsbText_Len! + 1
				)
			) ELSE (
				REM Mappe:
				IF "!lsbFirstFolder!" == "1" (
					SET lsbFirstFolder=0
					REM Lav skillelinie før første mappe:
					ECHO ----------------------------------------------->> !lsbDirFile!
					ECHO.>> !lsbDirFile!
				)
				REM Skriv kun mappenavn:
				ECHO %%j>> !lsbDirFile!
				SET lsbText_Name=lsbText_!lsbText_Len!
				SET !lsbText_Name!=%%j
				SET /A lsbText_Len=!lsbText_Len! + 1
			)
		)
	)
)
REM Nu fik vi lavet en fil. Men er indholdet i det hele taget nyt?
ECHO Verificer, at filens indhold er nyt.
SET lsbLatest_File=
SET lsbLatest_Rev=
FOR %%f IN ("%lsb1%.\_History\DIR-FOER-REVISION*.TXT") DO (
	ECHO * %%f
	SET lsbTest_Rev=
	FOR /F "delims=- tokens=3,4" %%g IN ("%%~nf") DO (
		IF /I "%%g" == "REVISION" (
			SET lsbTest_Rev=%%h
		)
	)
	IF "!lsbTest_Rev!" == "!lsbRevision!" (
		ECHO *   Spring over, vi kan ikke sammenligne med sig selv.
	) ELSE IF "!lsbLatest_File!" == "" (
		REM Første fundne:
		SET lsbLatest_File=%%f
		SET lsbLatest_Rev=!lsbTest_Rev!
		ECHO *   Fandt nyeste indtil nu.
	) ELSE IF !lsbTest_Rev! GTR !lsbLatest_Rev! (
		SET lsbLatest_File=%%f
		SET lsbLatest_Rev=!lsbTest_Rev!
		ECHO *   Fandt nyeste indtil nu.
	)
)
IF "!lsbLatest_File!" == "" ECHO * Der findes ingen gammel fil at sammeligne med.
IF NOT "!lsbLatest_File!" == "" (
	ECHO * Sammenligner med:
	ECHO * !lsbLatest_File!
	SET lsbDiffers=0
	SET lsbText_Ix=0
	SET lsbFile_Ix=0
	SET lsbSkipSomeLines=1
	SET lsbCountDashLines=0
	FOR /F "usebackq delims=¬ eol=¬" %%f IN ("!lsbLatest_File!") DO (
		IF "!lsbDiffers!" == "1" (
			REM Desværre har jeg ikke fundet en god måde at exitte loopet på.
		) ELSE (
			SET lsbLine=%%f
			IF "!lsbSkipSomeLines!"=="1" (
				REM Vi skal skippe de øverste linier i filen (tidsstempel, revision og absolut sti)
				IF /I "!lsbLine:~0,10!" == " Directory" (
					SET lsbSkipSomeLines=0
				) ELSE IF "!lsbLine:~0,3!" == "---" (
					SET /A lsbCountDashLines=!lsbCountDashLines! + 1
					IF !lsbCountDashLines! == 3 SET lsbSkipSomeLines=0
				)
			) ELSE (
				SET lsbLine=%%f
				REM Fjern space karakter, hvis det er sidst på linien (workaround):
				IF "!lsbLine:~-1!"==" " SET lsbLine=!lsbLine:~0,-1!
				IF "!lsbLine!"=="" (
					REM Tom linie - ignorer.
				) ELSE IF "!lsbLine:~0,1!"==" " (
					REM Første karakter er et space - ignorer linien.
				) ELSE IF "!lsbLine:~0,3!" == "---" (
					REM Skillelinie - ignorer.
				) ELSE (
					REM Dette er en linie, vi skal teste!
					REM Find gemt linie fra nylavet fil:
					FOR /F %%a IN ("lsbText_!lsbText_Ix!") DO SET lsbText=!%%a!
					IF "!lsbText!" == "!lsbLine!" (
						REM Fedt! Denne linie passer. Gå videre:
						REM ECHO * Text "!lsbText!"
						REM ECHO * Line "!lsbLine!"
						REM ECHO Match.
						SET /A lsbLine_Ix=!lsbLine_Ix! + 1
					) ELSE (
						REM Nope, det er forskelligt indhold:
						REM ECHO * Text "!lsbText!"
						REM ECHO * Line "!lsbLine!"
						REM ECHO DIFFERS
						SET lsbDiffers=1
					)
					SET /A lsbText_Ix=!lsbText_Ix! + 1
				)
			)
			SET /A lsbFile_Ix=!lsbFile_Ix! + 1
		)
	)
	IF "!lsbDiffers!"=="0" (
		IF NOT "!lsbText_Ix!" == "!lsbText_Len!" (
			ECHO * Ny fil er laengere [!lsbText_Len! data linier] end den gamle [!lsbText_Ix! data linier]
			SET lsbDiffers=1
		)
	)
	IF "!lsbDiffers!"=="1" (
		ECHO * Jep, nyt indhold, beholder den nylavede fil.
	) ELSE (
		ECHO * Nix, indholdet er ikke aendret. Slet den nylavede fil igen.
		DEL "!lsbDirFile!"
		SET lsbSvnAddFile=0
	)
) ELSE (
	ECHO * Ingen tidligere filer, beholder den nylavede fil.
)
IF "!lsbSvnAddFile!" == "1" svn add "!lsbDirFile!"

ENDLOCAL
GOTO :eof


:lblEnd