
function makeShadeArray(iRGB_a, iRGB_b, iAryLen, bLoopBack)
{
	var aryShades = new Array("#FFFFFF", "#000000")

	var iR_a = (iRGB_a >> 16) & 0xFF
	var iG_a = (iRGB_a >> 8) & 0xFF
	var iB_a = (iRGB_a >> 0) & 0xFF
	var iR_b = (iRGB_b >> 16) & 0xFF
	var iG_b = (iRGB_b >> 8) & 0xFF
	var iB_b = (iRGB_b >> 0) & 0xFF

	var iAryLenHalf = (bLoopBack ? iAryLen / 2 : iAryLen)
	var iAryIx
	for (iAryIx = 0; iAryIx < iAryLen; iAryIx++) {
		if (iAryIx <= iAryLenHalf) {
			var iMul_b = iAryLenHalf-iAryIx
			var iMul_a = iAryLenHalf-iMul_b
			var i_R = (iMul_b * iR_b + iMul_a * iR_a) / iAryLenHalf
			var i_G = (iMul_b * iG_b + iMul_a * iG_a) / iAryLenHalf
			var i_B = (iMul_b * iB_b + iMul_a * iB_a) / iAryLenHalf
			var i_RGB = ((i_R << 16) & 0xFF0000) | ((i_G << 8) & 0xFF00) | (i_B & 0xFF)
			aryShades[iAryIx] = "#" + i_RGB.toString(16).toUpperCase()
		}
		else {
			var iMul_a = iAryLen-iAryIx
			var iMul_b = iAryLenHalf-iMul_a
			var i_R = (iMul_b * iR_b + iMul_a * iR_a) / (iAryLen-iAryLenHalf)
			var i_G = (iMul_b * iG_b + iMul_a * iG_a) / (iAryLen-iAryLenHalf)
			var i_B = (iMul_b * iB_b + iMul_a * iB_a) / (iAryLen-iAryLenHalf)
			var i_RGB = ((i_R << 16) & 0xFF0000) | ((i_G << 8) & 0xFF00) | (i_B & 0xFF)
			aryShades[iAryIx] = "#" + i_RGB.toString(16).toUpperCase()
		}
	}

	return aryShades
} // makeShadeArray


var g_ary_bSplit = new Array(4)
g_ary_bSplit[0] = false
g_ary_bSplit[1] = false
g_ary_bSplit[2] = false
g_ary_bSplit[3] = false
var g_ary_j = new Array(4)
g_ary_j[0] = 0
g_ary_j[1] = 1
g_ary_j[2] = 2
g_ary_j[3] = 3
var g_bSplitHref = false
var g_bSplitHint = true

function setSplits(bSplit0, bSplit1, bSplit2, bSplit3, bSplitHref, bSplitHint)
{
	g_ary_bSplit[0] = ((bSplit0==null) ? false : bSplit0)
	g_ary_bSplit[1] = ((bSplit1==null) ? false : bSplit1)
	g_ary_bSplit[2] = ((bSplit2==null) ? false : bSplit2)
	g_ary_bSplit[3] = ((bSplit3==null) ? false : bSplit3)

	g_ary_j[0] = 0
	g_ary_j[1] = g_ary_j[0] + (bSplit0 ? 2 : 1)
	g_ary_j[2] = g_ary_j[1] + (bSplit1 ? 2 : 1)
	g_ary_j[3] = g_ary_j[2] + (bSplit2 ? 2 : 1)
	
	g_bSplitHref = ((bSplitHref==null) ? false : bSplitHref)
	g_bSplitHint = ((bSplitHint==null) ? false : bSplitHint)
} // setSplits


function mySort_RemoveStart_Part(str, strToRemove)
{
	var iIx = str.search(strToRemove)
	if (iIx == 0) return str.substr(strToRemove.length) + "," + strToRemove
	return str
} // mySort_RemoveStart_Part

function mySort_RemoveStart(str)
{
	str = str.toUpperCase()
	var str2 = str
	str2 = mySort_RemoveStart_Part(str, 'THE ')
	if (str2 != str) return str2
	str2 = mySort_RemoveStart_Part(str, 'DE ')
	if (str2 != str) return str2
	str2 = mySort_RemoveStart_Part(str, 'DEN ')
	if (str2 != str) return str2
	str2 = mySort_RemoveStart_Part(str, 'A ')
	if (str2 != str) return str2
	str2 = mySort_RemoveStart_Part(str, 'EN ')
	if (str2 != str) return str2
	str2 = mySort_RemoveStart_Part(str, 'ET ')
	return str2
} // mySort_RemoveStart

function mySort_Part(strA, strB, bNumeric)
{
	var bAEmpty = ((strA == null) || (strA == ""))
	var bBEmpty = ((strB == null) || (strB == ""))
	if (bAEmpty) return (bBEmpty ? 0 : -1)
	if (bBEmpty) return 1
	if (bNumeric)
	{
		var fA = eval(strA)
		var fB = eval(strB)
		if (fA < fB) return -1
		if (fA > fB) return 1
		return 0
	}
	else
	{
		return strA.localeCompare(strB)
	}
} // mySort_Part

function mySort(strA, strB)
{
	var aryA = strA.split('|')
	var strA_achieved	= aryA.shift()
	var strA_artist_da	= mySort_RemoveStart(aryA.shift())
	var strA_artist_en	= (g_ary_bSplit[0] ? mySort_RemoveStart(aryA.shift()) : strA_artist_da)
	var strA_artist		= ((bIsDanish&&(strA_artist_da!="")) ? strA_artist_da : strA_artist_en)
	var strA_item_da	= mySort_RemoveStart(aryA.shift())
	var strA_item_en	= (g_ary_bSplit[1] ? mySort_RemoveStart(aryA.shift()) : strA_item_da)
	var strA_item		= ((bIsDanish&&(strA_item_da!="")) ? strA_item_da : strA_item_en)
	var strA_number_da	= aryA.shift()
	var strA_number_en	= (g_ary_bSplit[2] ? aryA.shift() : strA_number_da)
	var strA_number		= ((bIsDanish&&(strA_number_da!="")) ? strA_number_da : strA_number_en)
	
	var aryB = strB.split('|')
	var strB_achieved	= aryB.shift()
	var strB_artist_da	= mySort_RemoveStart(aryB.shift())
	var strB_artist_en	= (g_ary_bSplit[0] ? mySort_RemoveStart(aryB.shift()) : strB_artist_da)
	var strB_artist		= ((bIsDanish&&(strB_artist_da!="")) ? strB_artist_da : strB_artist_en)
	var strB_item_da	= mySort_RemoveStart(aryB.shift())
	var strB_item_en	= (g_ary_bSplit[1] ? mySort_RemoveStart(aryB.shift()) : strB_item_da)
	var strB_item		= ((bIsDanish&&(strB_item_da!="")) ? strB_item_da : strB_item_en)
	var strB_number_da	= aryB.shift()
	var strB_number_en	= (g_ary_bSplit[2] ? aryB.shift() : strB_number_da)
	var strB_number		= ((bIsDanish&&(strB_number_da!="")) ? strB_number_da : strB_number_en)
	
	var iRC = 0
	iRC = mySort_Part(strA_artist, strB_artist)
	if (iRC!=0) return iRC
	iRC = mySort_Part(strA_number, strB_number)
	if (iRC!=0) return iRC
	iRC = mySort_Part(strA_item, strB_item)
	if (iRC!=0) return iRC
	iRC = mySort_Part(strA_achieved, strB_achieved)
	return iRC
} // mySort


var strCookieShowAchieved = "showAchievedCDs"
var bCookieShowAchieved = false

function getShowAchieved()
{
	var iIxCookieShowAchieved = document.cookie.search(new RegExp(strCookieShowAchieved))
	if (iIxCookieShowAchieved!=-1)
	{
		var strBool = document.cookie.substr(iIxCookieShowAchieved+strCookieShowAchieved.length+1,4)
		bCookieShowAchieved = (strBool=='true')
	}
}

function setShowAchieved(bShow)
{
	if (bShow!=null)
	{
		var dtExpires = new Date(2100,1,1)
		var strCookie =  strCookieShowAchieved +'=' + bShow + ';expires=' + dtExpires.toGMTString() + ';path=' + getURLPathOnly() + ';'
		//alert(strCookie)
		document.cookie = strCookie
		//alert(document.cookie)
	}
}

getShowAchieved()
setShowAchieved(bCookieShowAchieved)


function setShowHideWord(bHide, bMouseOver)
{
    var pShowHideWord = document.getElementById("idShowHideWord")
    var strInner = 
	(
		bIsDanish
		? (
			bMouseOver
			? ("Klik her for " + (bHide ? "at skjule" : "også at vise"))
			: (bHide ? "(Skjuler" : "(Viser også")
		)
		: (
			bMouseOver
			? ("Click here to " + (bHide ? "hide" : "include"))
			: (bHide ? "(Hiding" : "(Including")
		)
	)
	strInner += (bIsDanish ? " dem, jeg har fået" : " the ones I've already gotten")
	strInner += (bMouseOver ? "" : ")")
    pShowHideWord.innerHTML = strInner
} // setShowHideWord


function docWriteItemTable(aryItems)
{
	for (i=0; i<aryItems.length; i++)
	{
		var arySplit = aryItems[i].split('|')
		var strPriority = arySplit.shift()//pop()
		var bAchieved = (strPriority<="0")
		if ((!bAchieved)||(bCookieShowAchieved))
		{
			var strHintEn = arySplit.pop()
			var strHintDa = (g_bSplitHint ? arySplit.pop() : strHintEn)
			//
			var strHrefEn = arySplit.pop()
			var strHrefDa = (g_bSplitHref ? arySplit.pop() : strHrefEn)
			var strHref = ((bIsDanish&&(strHrefDa!="")) ? strHrefDa : strHrefEn)
			
			document.writeln("<tr id='idTrLink" + (i+1) + "'")
		    var strTitle = ""
		    if (strHref != "") {
		        strTitle = strHref
		    }
			if ((strHintDa!="")||(strHintEn!="")) {
			    if (strTitle != "") strTitle += "\r\n--\r\n"
			    if (bIsDanish) {
			        if (strHintDa != "") strTitle += strHintDa
			        else strTitle += strHintEn
			    }
			    else {
			        if (strHintEn != "") strTitle += strHintEn
			        else strTitle += strHintDa
			    }
			}
			if (strTitle != "") {
			    document.writeln(" title=\"" + strTitle + "\"")
            }
			if (strHref=="")
				document.writeln(" style='color: #000000;'")
			else
			{
				//document.writeln(" onclick='javascript:location=\"" + strHref +"\"'")
				document.writeln(" onclick='javascript:window.open(\"" + strHref +"\");removeFromBlue(" + (i+1) + ")'")
				document.writeln(" style='color: #000000; cursor: pointer;'")
			}
			document.write(" onmouseover='javascript:addToBlue(" + (i+1) + ");")
			if (strHref!="")
				document.write("window.status=\"" + strHref + "\";")
			document.writeln("'")
			document.write(" onmouseout='javascript:removeFromBlue(" + (i+1) + ");")
			if (strHref!="")
				document.write("window.status=\"\";")
			document.writeln("'")
			document.writeln(">")
			for (var j = 0; j < 4; j++)
			{
				document.writeln("<td class='tdLink'")
				switch (strPriority)
				{
					case "0":
					case "-1":
						document.write(" style='text-decoration:line-through;'>")
						break
					case "-2":
						document.write(" style='text-decoration:line-through;font-variant:small-caps;'>")
						break
					case "2":
						document.write(" style='font-variant:small-caps;'>")
						break
					default:
						document.write(">")
						break
				}
				
				var jj = g_ary_j[j]
				var bSplit = g_ary_bSplit[j]
				var str_j_da = arySplit[jj]
				var str_j_en = (bSplit ? arySplit[jj + 1] : str_j_da)
				var str_j = str_j_da
				if ((!bIsDanish && str_j_en!="") || (str_j_da==""))
					str_j = str_j_en
				
				if (str_j!="")
					document.write(str_j)
				else
				{
					document.write("<font color='#B0B0B0'>")
					switch (j)
					{
					case 0: document.write(bIsDanish ? "diverse kunstnere" : "various artists"); break
					case 1: document.write(bIsDanish ? "ingen titel" : "untitled"); break
					case 2: document.write(bIsDanish ? "herrens år" : "anno domini"); break
					case 3: document.write(bIsDanish ? "uvist" : "unknown"); break
					}
					document.write("</font>")
				}
				document.writeln("</td>")
			}
			document.writeln("</tr>")
		}
	}
} // docWriteItemTable


var aryBlueShades = new Array("#000000","#101020","#202040","#303060","#404080","#5050B0")
var aryBodyShades = null
var aryBlue = null
var aryFade = null
//
var oTbl = null
var oBody = null
var iBodyShadeIx = null
var iTblShadeIx = null
var dtStart = null
//
var bOnce = true

function addToBlue(iTrIndex)
{
	iTrIndex = eval(iTrIndex)
	if (iTrIndex < 0) iTrIndex = aryBlue.length - 1
	aryBlue[iTrIndex] = true
} // addToBlue

function removeFromBlue(iTrIndex)
{
	iTrIndex = eval(iTrIndex)
	if (iTrIndex < 0) iTrIndex = aryBlue.length - 1
	aryBlue[iTrIndex] = false
	addToFade(iTrIndex)
} // removeFromBlue

function addToFade(iTrIndex)
{
	iTrIndex = eval(iTrIndex)
	if (iTrIndex < 0) iTrIndex = aryBlue.length - 1
	aryFade[iTrIndex] = true
} // addToFade

function removeFromFade(iTrIndex)
{
	iTrIndex = eval(iTrIndex)
	if (iTrIndex < 0) iTrIndex = aryBlue.length - 1
	aryFade[iTrIndex] = false
} // removeFromFade

function timerEvent_MouseOverBlues(i)
{
	var objTr = null
	if (i == 0)
	{
	    objTr = document.getElementById('idShowHideWord')
	}
	else
	{
	    var strTrName = "idTrLink" + i
	    objTr = document.getElementById(strTrName)
	}
    if (objTr != null) {
        var iColorIx = 0
        if (objTr.iColorIx != null)
			iColorIx = eval(objTr.iColorIx)
			
		if (aryBlue[i])
		{
			// Make bluer
			if (iColorIx < aryBlueShades.length-1) {
				iColorIx++
				objTr.iColorIx = iColorIx
				objTr.style.color = aryBlueShades[iColorIx]
			}
		}
		else
		{
			// Stop being blue
			if (--iColorIx <= 0) {
				// We're all faded now
				removeFromFade(i)
			}
			else {
				objTr.iColorIx = iColorIx
				objTr.style.color = aryBlueShades[iColorIx]
			}
		}
	}
} // timerEvent_MouseOverBlues

function timerEvent()
{
    var fSecStart = dtStart.getSeconds() + (dtStart.getMilliseconds() / 1000.0)
    var dtNow = new Date()
    var fSecNow = dtNow.getSeconds() + (dtNow.getMilliseconds() / 1000.0)
    var fSecSpan = fSecNow - fSecStart
    if (fSecSpan < 0) fSecSpan += 60
    var bIsItNow = (fSecSpan > 0.1)

    if (bIsItNow)
    {
		// Debug
		document.getElementById("idDebug").innerHTML = fSecSpan
		
		// Mouse over CDs and the "show/hide" link
	    var i
		for (i = (aryBlue.length - 1); i >= 0; i--)
	    {
			if ((aryBlue[i]) || (aryFade[i])) timerEvent_MouseOverBlues(i)
	    }
		
		// Table background
		if (++iTblShadeIx >= aryBodyShades.length)
			iTblShadeIx = 0
		oTbl.style.backgroundColor = aryBodyShades[iTblShadeIx]

		// Body background
		dtStart = dtNow
		if (++iBodyShadeIx >= aryBodyShades.length)
		    iBodyShadeIx = 0
		oBody.style.backgroundColor = aryBodyShades[iBodyShadeIx]
	}
	
	setTimeout('timerEvent()', 50)
} // timerEvent

function initTimer(iNumItems)
{
	aryBlue = new Array(iNumItems+1)
	aryFade = new Array(iNumItems+1)
	//
	oTbl = document.getElementById("idTbl")
	oBody = document.getElementById("idBody")
	iBodyShadeIx = aryBodyShades.length / 2
	iTblShadeIx = 0
	dtStart = new Date()
	
	setTimeout('timerEvent()', 100)
} // initTimer
