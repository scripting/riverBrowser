 
document.write ('<link href="http://fargo.io/code/ubuntuFont.css" rel="stylesheet" type="text/css">');
document.write ('<script src="http://fargo.io/code/node/shared/utils.js"></script>');
document.write ('<script src="http://api.nodestorage.io/api.js"></script>');
document.write ('<script src="http://fargo.io/code/shared/emojify.js"></script>');
document.write ('<script src="http://fargo.io/cms/dateFormat.js"></script>');
document.write ('<link rel="stylesheet" href="http://fargo.io/code/fontAwesome/css/font-awesome.min.css"/>');
document.write ('<link href="http://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic" rel="stylesheet" type="text/css">');
document.write ('<script src="http://fargo.io/code/browsers/outlinebrowser.js"></script>'); //6/18/15 by DW
document.write ('<link href="http://fargo.io/code/browsers/riverbrowser.css" rel="stylesheet" type="text/css">');

var riverBrowserData = {
	version: "0.41",
	enclosureIconHtml: "<i class=\"fa fa-headphones\"></i>",
	flEnclosureIcon: true,
	flShareIcon: true,
	flOutlinesExpandedByDefault: false, //4/16/15 by DW
	urlTwitterServer: "http://twitter2.radio3.io:5342/", //6/18/15 by DW
	theRiver: undefined,  //6/18/15 by DW -- used to be global
	getExtraFooterCallback: function (item, theFooter) {
		return (theFooter);
		},
	includeFeedInRiverCallback: function (feed) {
		return (true);
		},
	includeItemInRiverCallback: function (item) {
		return (true);
		},
	createLinkCallback: function (url, linktext, title) {
		var titleAtt = "";
		if (title !== undefined) {
			titleAtt = " title=\"" + title + "\"";
			}
		return ("<a href=\"" + url + "\"" + titleAtt + ">" + linktext + "</a>");
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
	var feeds = riverBrowserData.theRiver.updatedFeeds.updatedFeed, urlLinkBlogTool = "http://radio3.io/";
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
					}
				
				if (endsWith (urlShare, "&")) {
					urlShare = urlShare.substr (0, urlShare.length - 1); //pop last char
					}
				window.open (urlShare);
				return;
				}
			}
		}
	
	}
function riverInitTwitterServer () { //6/18/15 by DW
	if (twStorageData.urlTwitterServer === undefined) {
		twStorageData.urlTwitterServer = riverBrowserData.urlTwitterServer; 
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
		riverInitTwitterServer (); //6/18/15 by DW
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
	if (riverBrowserData.flShareIcon) {
		var sharescript = "shareClick ('" + item.id + "');";
		var sharelink = "<span class=\"spShareLink\"><a onclick=\"" + sharescript + "\" title=\"Share\"><i class=\"fa fa-share\"></i></a></span>";
		return (sharelink);
		}
	else {
		return ("");
		}
	}
function getEnclosureLink (item) { //9/22/14 by DW
	if (riverBrowserData.flEnclosureIcon) {
		var enclosurelink = "";
		if (item.enclosure != undefined) {
			var theEnclosure = item.enclosure [0];
			if ((theEnclosure != undefined) && (theEnclosure.url != undefined)) {
				}
				enclosurelink = "<span class=\"spEnclosureLink\"><a href=\"" + theEnclosure.url + "\" target=\"_blank\" title=\"Download enclosure\">" + riverBrowserData.enclosureIconHtml + "</a></span>";
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
	return ("<div class=\"divItemFooter\">" + riverBrowserData.getExtraFooterCallback (item, itemfooter) + "</div>");
	}
function expandableTweetTextLink (theText, idTweet, idLevel) {
	return ("<a class=\"aOutlineTextLink\" onclick=\"ecTweet (" + idLevel + ", '" + idTweet + "')\">" + theText + "</a>");
	}
function expandableImageTextLink (theText, idLevel) {
	return ("<a class=\"aOutlineTextLink\" onclick=\"ecImage (" + idLevel + ")\">" + theText + "</a>");
	}
function riverRenderOutline (outline, flMarkdown, urlPermalink, permalinkString, flExpanded) {
	return (renderOutlineBrowser (outline, flMarkdown, urlPermalink, permalinkString, flExpanded));
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
			var tweetlinetext = getIconForTweet (outlineBrowserData.serialNum, outline.tweetid, flTweetCollapsed) + expandableTweetTextLink (outline.text, outline.tweetid, outlineBrowserData.serialNum);
			var tweethead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + tweetlinetext  + "</div></div>";
			var idDiv = "idOutlineLevel" + outlineBrowserData.serialNum++, idTweet = outline.tweetid;
			var tweetbody = "<div class=\"divTweetInRiver\" id=\"" + idDiv + "\"" + style + ">&lt;tweet id=" + idTweet + "></div>";
			itemhtml = tweethead + tweetbody;
			break;
		case "image":
			var imagelinetext = getIconForImage (outlineBrowserData.serialNum, !flExpanded) + expandableImageTextLink (outline.text, outlineBrowserData.serialNum);
			var style = " style=\"display: none;\"";
			if (flExpanded) {
				style = "";
				}
			var imagehead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + imagelinetext  + permalink + "</div></div>";
			var idDiv = "idOutlineLevel" + outlineBrowserData.serialNum++, idTweet = outline.tweetid;
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

function createRiverLink (url, linktext, title) { //12/17/15 by DW
	return (riverBrowserData.createLinkCallback (url, linktext, title));
	}

function freshRiverDisplay (idRiver) {
	var feeds = riverBrowserData.theRiver.updatedFeeds.updatedFeed, idSerialNum = 0;
	$("#" + idRiver).empty ();
	for (var i = 0; i < feeds.length; i++) {
		var feed = feeds [i], feedLink, whenFeedUpdated, favicon = "", items = "";
		if (riverBrowserData.includeFeedInRiverCallback (feed)) {
			//set feedLink
				feedLink = feed.feedTitle;
				if ((feed.websiteUrl != null) && (feed.websiteUrl.length > 0)) {
					feedLink = createRiverLink (feed.websiteUrl, feedLink, "Web page"); //"<a href=\"" + feed.websiteUrl + "\" title=\"Web page\">" + feedLink + "</a>";
					favicon = "<img class=\"imgFavIcon\" src=\"" + getFavicon (feed.websiteUrl) + "\" width=\"16\" height=\"16\">";
					}
				if (feed.feedUrl.length > 0) {
					feedLink += " (" + createRiverLink (feed.feedUrl, "Feed", "Link to RSS feed") + ")"; //" (<a href=\"" + feed.feedUrl + "\" title=\"Link to RSS feed\">Feed</a>)";
					}
			//set whenFeedUpdated
				whenFeedUpdated = feed.whenLastUpdate;
			//set items
				for (var j = 0; j < feed.item.length; j++) {
					var item = feed.item [j], title, body, itemlink, itemhtml, sharelink, idItem = "idItem" + idSerialNum++, enclosurelink = "";
					if (riverBrowserData.includeItemInRiverCallback (item)) {
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
									var tweetlinetext = getIconForTweet (outlineBrowserData.serialNum, item.outline.tweetid, flTweetCollapsed) + expandableTweetTextLink (item.outline.text, item.outline.tweetid, outlineBrowserData.serialNum);
									var tweethead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + tweetlinetext  + "</div></div>";
									var idDiv = "idOutlineLevel" + outlineBrowserData.serialNum++, idTweet = item.outline.tweetid;
									var tweetbody = "<div class=\"divTweetInRiver\" id=\"" + idDiv + "\"" + style + ">&lt;tweet id=" + idTweet + "></div>";
									itemhtml = tweethead + tweetbody + getItemFooter (item);
									break;
								case "image":
									var imagelinetext = getIconForImage (outlineBrowserData.serialNum, true) + expandableImageTextLink (item.outline.text, outlineBrowserData.serialNum);
									var style = " style=\"display: none;\"";
									var imagehead = "<div class=\"divRenderedOutline\"><div class=\"divItemHeader divOutlineHead\">" + imagelinetext  + "</div></div>";
									var idDiv = "idOutlineLevel" + outlineBrowserData.serialNum++, idTweet = item.outline.tweetid;
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
									itemlink = createRiverLink (item.link, title, undefined); //"<a href=\"" + item.link + "\">" + title + "</a>";
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
function httpGetRiver (urlRiver, idRiver, callback) {
	var whenstart = new Date ();
	if (idRiver === undefined) { //10/5/14 by DW
		idRiver = "idRiverDisplay";
		}
	urlLastRiverGet = urlRiver;
	$.ajax ({ 
		url: urlRiver,  
		jsonpCallback : "onGetRiverStream",
		success: function (data) {
			console.log ("httpGetRiver: read took " + secondsSince (whenstart) + " secs.");
			riverBrowserData.theRiver = data;
			freshRiverDisplay (idRiver);
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
