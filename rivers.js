 
document.write ('<link href="http://fargo.io/code/ubuntuFont.css" rel="stylesheet" type="text/css">');
document.write ('<script src="http://fargo.io/code/node/shared/utils.js"></script>');
document.write ('<script src="http://api.nodestorage.io/api.js"></script>');
document.write ('<script src="http://fargo.io/code/shared/emojify.js"></script>');
document.write ('<script src="http://fargo.io/cms/dateFormat.js"></script>');
document.write ('<link rel="stylesheet" href="http://fargo.io/code/fontAwesome/css/font-awesome.min.css"/>');
document.write ('<script src="http://fargo.io/code/markdownConverter.js"></script>');


var theRiver; 
var serialnumForRiverRender = 0; 
var riverCache = new Array ();
var riverConfig = {
	enclosureIconHtml: "<i class=\"fa fa-headphones\"></i>",
	flEnclosureIcon: true,
	flShareIcon: true,
	flOutlinesExpandedByDefault: false, //4/16/15 by DW
	getExtraFooterCallback: function (item, theFooter) {
		return (theFooter);
		},
	includeFeedInRiverCallback: function (feed) {
		return (true);
		},
	includeItemInRiverCallback: function (item) {
		return (true);
		}
	};

function getItemEnclosureUrl (item) { //4/14/15 by DW
	if (item.enclosure != undefined) {
		var theEnclosure = item.enclosure [0];
		if ((theEnclosure != undefined) && (theEnclosure.url != undefined)) {
			return (theEnclosure.url);
			}
		}
	return (undefined);
	}
function findRiverItem (theRiver, iditem, callback) { //4/14/15 by DW
	var feeds = theRiver.updatedFeeds.updatedFeed;
	console.log ("findRiverItem: iditem == " + iditem);
	for (var i = 0; i < feeds.length; i++) {
		var feed = feeds [i];
		for (var j = 0; j < feed.item.length; j++) {
			var item = feed.item [j];
			if (item.id === iditem) {
				if (callback !== undefined) {
					callback (item);
					}
				return;
				}
			
			}
		}
	}
function shareClick (iditem) {
	var feeds = theRiver.updatedFeeds.updatedFeed, urlLinkBlogTool = "http://radio3.io/";
	try {
		if (appPrefs.urlLinkBlogTool != undefined) { //10/3/14 by DW
			urlLinkBlogTool = appPrefs.urlLinkBlogTool;
			}
		}
	catch (err) {
		}
	
	function encode (s) {
		return (encodeURIComponent (s));
		}
	for (var i = 0; i < feeds.length; i++) {
		var feed = feeds [i];
		for (var j = 0; j < feed.item.length; j++) {
			var item = feed.item [j];
			if (item.id == iditem) {
				var urlShare = urlLinkBlogTool + "?"; 
				function addParam (name, val) {
					if (val != undefined) {
						if (val.length > 0) {
							urlShare += name + "=" + encode (val) + "&";
							}
						}
					
					
					}
				
				if ((item.outline != undefined) && (item.outline.type != "tweet")) { //plain jane outline, don't send the body, it's too big for a linkblog entry
					addParam ("title", item.title);
					addParam ("link", item.link);
					}
				else {
					addParam ("title", item.title);
					addParam ("link", item.link);
					addParam ("description", item.body);
					}
				
				if (endsWith (urlShare, "&")) {
					urlShare = urlShare.substr (0, urlShare.length - 1); //pop last char
					}
				console.log ("shareClick: item == " + jsonStringify (item));
				console.log ("shareClick: urlShare == " + urlShare);
				window.open (urlShare);
				
				
				
				
				return;
				}
			}
		}
	
	}
function ecOutline (idnum) { 
	var c = document.getElementById ("idOutlineWedge" + idnum), idUL = "#idOutlineLevel" + idnum;
	if (c.className == "fa fa-caret-down") {
		c.className = "fa fa-caret-right";
		c.style.color = "black";
		$(idUL).slideUp (75);
		}
	else {
		c.className = "fa fa-caret-down";
		c.style.color = "silver";
		$(idUL).slideDown (75);
		}
	}
function ecTweet (idnum, idtweet) { 
	var c = document.getElementById ("idOutlineWedge" + idnum), idUL = "idOutlineLevel" + idnum;
	if (c.style.color == "silver") {
		c.style.color = "#4099FF";
		$("#" + idUL).slideUp (75);
		}
	else {
		c.style.color = "silver";
		twViewTweet (idtweet, idUL, function () {
			$("#" + idUL).slideDown (75);
			});
		}
	}
function ecImage (idnum) { 
	var c = document.getElementById ("idOutlineWedge" + idnum), idUL = "#idOutlineLevel" + idnum;
	if (c.style.color == "silver") {
		c.style.color = "black";
		$(idUL).slideUp (75);
		}
	else {
		c.style.color = "silver";
		$(idUL).slideDown (75);
		}
	}
function getIcon (idnum, flcollapsed) {
	var wedgedir, color;
	if (flcollapsed) {
		wedgedir = "right";
		color = "black";
		}
	else {
		wedgedir = "down";
		color = "silver";
		}
	
	var clickscript = "onclick=\"ecOutline (" + idnum + ")\" ";
	var icon = "<span class=\"spOutlineIcon\"><a class=\"aOutlineWedgeLink\" " + clickscript + "><i class=\"fa fa-caret-" + wedgedir + "\" style=\"color: " + color + ";\" id=\"idOutlineWedge" + idnum + "\"></i></a></span>";
	return (icon);
	}
function getIconForTweet (idnum, idtweet, flcollapsed) { //9/22/14 by DW
	var color;
	if (flcollapsed) {
		color = "#4099FF";
		}
	else {
		color = "silver";
		}
	
	var clickscript = "onclick=\"ecTweet (" + idnum + ", '" + idtweet + "')\" ";
	var iconchar = "<i class=\"fa fa-twitter\" style=\"color: " + color + ";\" id=\"idOutlineWedge" + idnum + "\"></i>"; 
	var icon = "<span class=\"spOutlineIcon\"><a class=\"aTwitterLink\" " + clickscript + ">" + iconchar + "</a></span>";
	return (icon);
	}
function getIconForImage (idnum, flcollapsed) { //9/23/14 by DW
	var color;
	if (flcollapsed) {
		color = "black";
		}
	else {
		color = "silver";
		}
	
	var clickscript = "onclick=\"ecImage (" + idnum + ")\" ";
	var iconchar = "<i class=\"fa fa-camera\" style=\"color: " + color + ";\" id=\"idOutlineWedge" + idnum + "\"></i>"; 
	var icon = "<span class=\"spOutlineIcon\"><a class=\"aImageIconLink\" " + clickscript + ">" + iconchar + "</a></span>";
	return (icon);
	}
function getShareLink (item) { //9/22/14 by DW
	if (riverConfig.flShareIcon) {
		var sharescript = "shareClick ('" + item.id + "');";
		var sharelink = "<span class=\"spShareLink\"><a onclick=\"" + sharescript + "\" title=\"Share\"><i class=\"fa fa-share\"></i></a></span>";
		return (sharelink);
		}
	else {
		return ("");
		}
	}
function getEnclosureLink (item) { //9/22/14 by DW
	if (riverConfig.flEnclosureIcon) {
		var enclosurelink = "";
		if (item.enclosure != undefined) {
			var theEnclosure = item.enclosure [0];
			if ((theEnclosure != undefined) && (theEnclosure.url != undefined)) {
				}
				enclosurelink = "<span class=\"spEnclosureLink\"><a href=\"" + theEnclosure.url + "\" target=\"_blank\" title=\"Download enclosure\">" + riverConfig.enclosureIconHtml + "</a></span>";
			}
		return (enclosurelink);
		}
	else {
		return ("");
		}
	}
function getItemFooter (item) { //9/22/14 by DW
	var sharelink = getShareLink (item);
	var enclosurelink = getEnclosureLink (item);
	var itemfooter = "<span class=\"spTimeDifference\">" + timeDifference (item.pubDate) + "</span>" + enclosurelink + sharelink;
	return ("<div class=\"divItemFooter\">" + riverConfig.getExtraFooterCallback (item, itemfooter) + "</div>");
	}
function expandableTextLink (theText, idLevel) {
	return ("<a class=\"aOutlineTextLink\" onclick=\"ecOutline (" + idLevel + ")\">" + theText + "</a>");
	}
function expandableTweetTextLink (theText, idTweet, idLevel) {
	return ("<a class=\"aOutlineTextLink\" onclick=\"ecTweet (" + idLevel + ", '" + idTweet + "')\">" + theText + "</a>");
	}
function expandableImageTextLink (theText, idLevel) {
	return ("<a class=\"aOutlineTextLink\" onclick=\"ecImage (" + idLevel + ")\">" + theText + "</a>");
	}
function riverGetPermalinkString (urlPermalink, permalinkString) {
	if (urlPermalink == undefined) {
		return ("");
		}
	if (permalinkString == undefined) { 
		permalinkString = "#";
		}
	return ("<div class=\"divOutlinePermalink\"><a href=\"" + urlPermalink + "\">" + permalinkString + "</a></div>");
	}
function riverRenderOutline (outline, flMarkdown, urlPermalink, permalinkString, flExpanded) {
	var htmltext = "", indentlevel = 0, permalink = riverGetPermalinkString (urlPermalink, permalinkString);
	var markdown = new Markdown.Converter ();
	if (flMarkdown === undefined) {
		flMarkdown = false;
		}
	if (flExpanded === undefined) { //10/23/14 by DW
		flExpanded = riverConfig.flOutlinesExpandedByDefault; //4/16/15 by DW
		}
	function add (s) {
		htmltext += filledString ("\t", indentlevel) + s + "\r\n";
		}
	function getHotText (outline) {
		var origtext = outline.text;
		var s = hotUpText (outline.text, outline.url);
		if (s != origtext) {
			return (s);
			}
		else {
			if (getBoolean (outline.bold)) { //12/6/14 by DW
				s = "<span class=\"spBoldHead\">" + s + "</span>";
				}
			return (expandableTextLink (s, serialnumForRiverRender));
			}
		}
	function hasSubs (outline) {
		return (outline.subs != undefined) && (outline.subs.length > 0);
		}
	function getImgHtml (imgatt) { //4/28/15 by DW
		if (imgatt === undefined) {
			return ("");
			}
		else {
			return ("<img style=\"float: right; margin-left: 24px; margin-top: 14px; margin-right: 14px; margin-bottom: 14px;\" src=\"" + imgatt +"\">");
			}
		}
	function gatherStylesFromOutline (outline) { //11/5/14 by DW
		var atts = new Object (), styles = new Object ();
		for (var x in outline) {
			switch (x) {
				case "color":
				case "direction":
				case "font-family":
				case "font-size":
				case "font-weight":
				case "letter-spacing":
				case "line-height":
				case "margin-left":
				case "text-decoration":
				case "text-shadow":
				case "text-transform":
				case "white-space":
				case "word-spacing":
					styles [x] = outline [x];
					break;
				}
			}
		return (styles);
		}
	function getStylesString (outline, flcollapsed) { //11/7/14 by DW
		var styles = gatherStylesFromOutline (outline), style = "";
		if (flcollapsed) {
			styles.display = "none";
			}
		for (var x in styles) {
			style += x + ": " + styles [x] + "; ";
			}
		if (style.length > 0) {
			style = " style=\"" + style + "\"";
			}
		return (style);
		}
	function getSubsMarkdownText (outline) {
		var s = "", style = getStylesString (outline, false);
		for (var i = 0; i < outline.subs.length; i++) {
			var child = outline.subs [i], img = "", imgatt = $(child).attr ("img");
			
			if (!getBoolean (child.isComment)) { //5/2/15 by DW
				s += getImgHtml (imgatt) + child.text + "\r\r";
				if (hasSubs (child)) {
					s += getSubsMarkdownText (child);
					}
				}
			
			}
		return (s);
		}
	function addSubs (outline, flcollapsed) {
		if (hasSubs (outline)) {
			var style = getStylesString (outline, flcollapsed);
			add ("<ul class=\"ulOutlineList\" id=\"idOutlineLevel" + serialnumForRiverRender++ + "\"" + style + ">"); indentlevel++;
			for (var i = 0; i < outline.subs.length; i++) {
				var child = outline.subs [i], flchildcollapsed = getBoolean (child.collapse), img = getImgHtml (child.img);
				if (!getBoolean (child.isComment)) { //5/2/15 by DW
					if (hasSubs (child)) {
						add ("<li>"); indentlevel++;
						add ("<div class=\"divOutlineText\">" + getIcon (serialnumForRiverRender, flchildcollapsed) + img + getHotText (child) + "</div>");
						addSubs (child, flchildcollapsed);
						add ("</li>"); indentlevel--;
						}
					else {
						add ("<li><div class=\"divOutlineText\">" + img + child.text + "</div></li>");
						}
					}
				}
			add ("</ul>"); indentlevel--;
			}
		}
	
	
	if (hasSubs (outline)) { //9/22/14 by DW
		var flTopLevelCollapsed = !flExpanded, theText = getHotText (outline);
		add ("<div class=\"divRenderedOutline\">"); indentlevel++;
		add ("<div class=\"divItemHeader divOutlineHead divOutlineHeadHasSubs\">" + getIcon (serialnumForRiverRender, flTopLevelCollapsed) + theText + permalink + "</div>");
		
		if (flMarkdown) {
			var markdowntext = getSubsMarkdownText (outline), style = "";
			if (flTopLevelCollapsed) { //10/23/14 by DW
				style = " style=\"display: none;\"";
				}
			var opendiv = "<div class=\"divMarkdownSubs\" id=\"idOutlineLevel" + serialnumForRiverRender++ + "\" " + style + ">";
			add (opendiv + markdown.makeHtml (markdowntext) + "</div>");
			}
		else {
			add ("<div class=\"divOutlineSubs\">"); indentlevel++;
			addSubs (outline, flTopLevelCollapsed);
			add ("</div>"); indentlevel--;
			}
		
		add ("</div>"); indentlevel--;
		
		serialnumForRiverRender++; //9/22/14 by DW
		}
	else {
		add ("<div class=\"divRenderedOutline\">"); indentlevel++;
		add ("<div class=\"divItemHeader divOutlineHead\">" + hotUpText (outline.text, outline.url) + permalink + "</div>");
		add ("</div>"); indentlevel--;
		}
	
	return (htmltext);
	}
function riverRenderTypedOutline (outline, urlPermalink, permalinkString, flExpanded) { //10/23/14 by DW -- experiment
	var itemhtml, permalink = riverGetPermalinkString (urlPermalink, permalinkString);
	if (flExpanded === undefined) {
		flExpanded = false;
		}
	
	
	switch (outline.type) {
		case "tweet":
			var flTweetCollapsed = true, style = "";
			if (flTweetCollapsed) {
				style = " style=\"display: none;\"";
				}
			var tweetlinetext = getIconForTweet (serialnumForRiverRender, outline.tweetid, flTweetCollapsed) + expandableTweetTextLink (outline.text, outline.tweetid, serialnumForRiverRender);
			var tweethead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + tweetlinetext  + "</div></div>";
			var idDiv = "idOutlineLevel" + serialnumForRiverRender++, idTweet = outline.tweetid;
			var tweetbody = "<div class=\"divTweetInRiver\" id=\"" + idDiv + "\"" + style + ">&lt;tweet id=" + idTweet + "></div>";
			itemhtml = tweethead + tweetbody;
			break;
		case "image":
			var imagelinetext = getIconForImage (serialnumForRiverRender, !flExpanded) + expandableImageTextLink (outline.text, serialnumForRiverRender);
			var style = " style=\"display: none;\"";
			if (flExpanded) {
				style = "";
				}
			var imagehead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + imagelinetext  + permalink + "</div></div>";
			var idDiv = "idOutlineLevel" + serialnumForRiverRender++, idTweet = outline.tweetid;
			var imgelement = "<img class=\"divRenderedImage\" src=\"" + outline.url + "\">";
			if (urlPermalink != undefined) { //10/25/14 by DW
				imgelement = "<a href=\"" + urlPermalink + "\">" + imgelement + "</a>";
				}
			var imagebody = "<div class=\"divImageInRiver\" id=\"" + idDiv + "\"" + style + ">" + imgelement + "</div>";
			itemhtml = imagehead + imagebody;
			break;
		case "outline":
			var flMarkdown = false; //2/17/15 by DW
			if (outline.flMarkdown !== undefined) {
				flMarkdown = getBoolean (outline.flMarkdown);
				}
			else {
				if (outline.flmarkdown !== undefined) {
					flMarkdown = getBoolean (outline.flmarkdown);
					}
				}
			itemhtml = riverRenderOutline (outline, flMarkdown, urlPermalink, permalinkString, flExpanded);
			break;
		default:
			itemhtml = riverRenderOutline (outline, true, urlPermalink, permalinkString, flExpanded);
			break;
		}
	itemhtml = emojiProcess (itemhtml); //11/4/14 by DW
	return (itemhtml);
	}
function freshRiverDisplay (idRiver) {
	var feeds = theRiver.updatedFeeds.updatedFeed, idSerialNum = 0;
	$("#" + idRiver).empty ();
	for (var i = 0; i < feeds.length; i++) {
		var feed = feeds [i], feedLink, whenFeedUpdated, favicon = "", items = "";
		if (riverConfig.includeFeedInRiverCallback (feed)) {
			//set feedLink
				feedLink = feed.feedTitle;
				if ((feed.websiteUrl != null) && (feed.websiteUrl.length > 0)) {
					feedLink = "<a href=\"" + feed.websiteUrl + "\" title=\"Web page\">" + feedLink + "</a>";
					favicon = "<img class=\"imgFavIcon\" src=\"" + getFavicon (feed.websiteUrl) + "\" width=\"16\" height=\"16\">";
					}
				if (feed.feedUrl.length > 0) {
					feedLink += " (<a href=\"" + feed.feedUrl + "\" title=\"Link to RSS feed\">Feed</a>)";
					}
			//set whenFeedUpdated
				whenFeedUpdated = feed.whenLastUpdate;
			//set items
				for (var j = 0; j < feed.item.length; j++) {
					var item = feed.item [j], title, body, itemlink, itemhtml, sharelink, idItem = "idItem" + idSerialNum++, enclosurelink = "";
					if (riverConfig.includeItemInRiverCallback (item)) {
						if (j > 0) {
							items += "<div class=\"divInterItemSpacer\"></div>";
							}
						if (item.outline != undefined) {
							switch (item.outline.type) {
								case "tweet":
									var flTweetCollapsed = true, style = "";
									if (flTweetCollapsed) {
										style = " style=\"display: none;\"";
										}
									var tweetlinetext = getIconForTweet (serialnumForRiverRender, item.outline.tweetid, flTweetCollapsed) + expandableTweetTextLink (item.outline.text, item.outline.tweetid, serialnumForRiverRender);
									var tweethead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + tweetlinetext  + "</div></div>";
									var idDiv = "idOutlineLevel" + serialnumForRiverRender++, idTweet = item.outline.tweetid;
									var tweetbody = "<div class=\"divTweetInRiver\" id=\"" + idDiv + "\"" + style + ">&lt;tweet id=" + idTweet + "></div>";
									itemhtml = tweethead + tweetbody + getItemFooter (item);
									break;
								case "image":
									var imagelinetext = getIconForImage (serialnumForRiverRender, true) + expandableImageTextLink (item.outline.text, serialnumForRiverRender);
									var style = " style=\"display: none;\"";
									var imagehead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + imagelinetext  + "</div></div>";
									var idDiv = "idOutlineLevel" + serialnumForRiverRender++, idTweet = item.outline.tweetid;
									var imagebody = "<div class=\"divImageInRiver\" id=\"" + idDiv + "\"" + style + "><img class=\"divRenderedImage\" src=\"" + item.outline.url + "\"></div>";
									itemhtml = imagehead + imagebody + getItemFooter (item);
									break;
								case "outline":
									var flMarkdown = true;
									if (item.outline.flMarkdown != undefined) {
										flMarkdown = getBoolean (item.outline.flMarkdown);
										}
									else {
										if (item.outline.flmarkdown != undefined) {
											flMarkdown = getBoolean (item.outline.flmarkdown);
											}
										}
									itemhtml = riverRenderOutline (item.outline, flMarkdown) + getItemFooter (item);
									break;
								default:
									itemhtml = riverRenderOutline (item.outline, true) + getItemFooter (item);  //11/3/14 by DW
									break;
								}
							}
						else {
							//set title, body
								if (item.title.length > 0) {
									title = item.title;
									body = item.body;
									}
								else {
									title = item.body;
									body = "";
									}
							//set itemlink
								if (item.link.length > 0) {
									itemlink = "<a href=\"" + item.link + "\">" + title + "</a>";
									}
								else {
									itemlink = title;
									}
								itemlink =  "<div class=\"divItemHeader\">" + itemlink + "</div>";
							
							var itembody = "<div class=\"divItemDescription\">" + body + "</div>";
							itemhtml = itemlink + itembody + getItemFooter (item);
							}
						
						items += "<div class=\"divItem\" id=\"" + idItem + "\">" + itemhtml + "</div>";
						}
					}
				items = emojiProcess (items); //10/11/14 by DW
			
			var title = "<div class=\"divFeedTitle\">" + favicon + feedLink+ "</div>";
			var updated = "<span class=\"spFeedUpdateTime\">" + dateFormat (whenFeedUpdated, "timeDate")  + "</span>";
			var head = "<div class=\"divItemHeader\">" + updated + title + "</div>";
			
			$("#" + idRiver).append ("<div class=\"divRiverSection\">" + head + items + "</div>");
			}
		}
	
	}
function onGetRiverStream (updatedFeeds) {
	}
function httpGetRiver (urlRiver, flSkipCache, idRiver, callback) {
	var whenstart = new Date ();
	if (flSkipCache == undefined) { //by default cache is off
		flSkipCache = true; 
		}
	if (idRiver == undefined) { //10/5/14 by DW
		idRiver = "idRiverDisplay";
		}
	urlLastRiverGet = urlRiver;
	if (!flSkipCache) {
		for (var i = 0; i < riverCache.length; i++) {
			var item = riverCache [i];
			if (item.url == urlRiver) {
				console.log ("httpGetRiver: found in cache at " + i + ".");
				theRiver = item.jstruct;
				freshRiverDisplay (idRiver);
				return;
				}
			}
		}
	$.ajax ({ 
		url: urlRiver,  
		jsonpCallback : "onGetRiverStream",
		success: function (data) {
			console.log ("httpGetRiver: read took " + secondsSince (whenstart) + " secs.");
			theRiver = data;
			freshRiverDisplay (idRiver);
			riverCache [riverCache.length] = {
				url: urlRiver,
				jstruct: data
				};
			if (callback != undefined) {
				callback ();
				}
			},
		error: function (status) {
			console.log ("httpGetRiver: error status == " + jsonStringify (status));
			if (callback != undefined) {
				callback ();
				}
			},
		dataType: "jsonp"
		});
	}
function clearRiverCache () {
	riverCache = new Array ();
	}
