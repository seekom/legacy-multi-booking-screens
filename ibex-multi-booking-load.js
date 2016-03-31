function CrossDomainMessageHandler(){}function iBexFrame(){}String.prototype.trim=function(){return this.replace(/^\s*/,"").replace(/\s*$/,"")};CrossDomainMessageHandler.prototype.getCookie=function(a){var b=document.cookie.split(";");for(var c=0;c<b.length;c++){var d=b[c].trim().split("=");if(d[0]==a.trim())return unescape(d[1])}return""};CrossDomainMessageHandler.prototype.ReceiveMessage=function(a){var b=this.getCookie(a);if(b!=""){var c=new Date;c.setSeconds(c.getSeconds()-100);document.cookie=a+"=;path=/;expires="+c.toUTCString()+";";return b}return""};iBexFrame.SetHeight=function(a,b){var c=new CrossDomainMessageHandler;fh=parseInt(c.ReceiveMessage("SeekomContentHeight"));if(!isNaN(fh)&&fh>0){a.scrolling="no";a.height=fh}a.style.display="block";if(b==null||b===true)parent.scrollTo(0,0)}
/**
 *	iBex Multi Property Booking Load
 *
 *	Code that executes/sets up the iBex booking page. Requires the iFrame to be placed on the page already.
 */

var iBexMultiBookingFrameController = {	
	/*jshint forin: true, noarg: true, noempty: true, eqeqeq: true, bitwise: true, strict: true, undef: true, unused: true, curly: true, camelcase: true, plusplus: true, regexp: true, asi: false, multistr: false, maxerr: 50, white: false, smarttabs: false, browser: true, devel: false, jquery: true */
	
	/*global ibOperatorID: false, ibPropID: false, ibMsgAgentURL: false */

	/**
	 * Get a parameter from the URL, or the entire query string (sans-?) if no key is passed in
	 * @param string key
	 * @return string
	 */
	getURLParam: function(key){
		"use strict";
	
		if(typeof key === 'undefined'){
			var param = window.location.href.indexOf('?');
			return param < 0 ? '' : window.location.href.substr(param);
		}
		else {
			key = key.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
			var regexS = "[\\?&]" + key + "=([^&#]*)",
				regex = new RegExp( regexS ),
				results = regex.exec( window.location.href );
				
			return (typeof results === 'undefined' || results === null || results.length === 0) ? '' : results[1];
		}
	},
	
	/**
	 * Check if the browser is a Safari browser
	 * @return boolean
	 */
	isSafariBrowser: function(){
		"use strict";
		
		var isSafari = (navigator.userAgent.indexOf("Safari") > -1),
			isChrome = (navigator.userAgent.indexOf("Chrome") > -1);
		
		if (isChrome && isSafari){
			isSafari = false;
		}
		
		if(!isSafari){
			// Check for firefox
			if(navigator.userAgent.indexOf("Firefox") > -1){
				// Check for >= 22
				var version = navigator.userAgent.match(/Firefox\/(\d+)/i);
				if(version[1] !== undefined && parseFloat(version[1]) >= 22){
					return true;
				}
			}
		}
		
		return isSafari;
	},
	
	/**
	 * Execute Function, this loads the booking page source
	 */
	run: function(bookingFrameId){
		"use strict";

		var queryString = this.getURLParam(),
			bookURL;
		
		// Build the booking page URL based on the query string
		if(queryString.length > 0 && this.getURLParam('op').length > 0){
			bookURL = '//ibex.seekom.com/accommodation/PropertySearch.php' + queryString;
		}
		else {
			bookURL = '//ibex.seekom.com/accommodation/PropertySearch.php?reset=true&op=' + ibOperatorID;
		}
		
		bookURL +=  '&hostma=' + window.escape(ibMsgAgentURL);
		
		// Load the booking page
		bookingFrameId = (bookingFrameId.length === 0) ? "bookingPage" : bookingFrameId;
		
		// Safari iframe fixed
		if(this.isSafariBrowser() && this.getURLParam('redirect').length === 0){
			
			var safariFixURL = '//ibex.seekom.com/accommodation/distributions/safari_cookie_fix.php',
				redirectUrl = encodeURIComponent(location.href);
			
			window.location = safariFixURL + '?url=' + redirectUrl;
		}
		else if(typeof _gaq !== 'undefined' && typeof _gat !== 'undefined'){
			// Allow for GA support
			var pageTracker = _gat._getTrackerByName();
			bookURL = pageTracker._getLinkerUrl(bookURL);
		}
		
		document.getElementById(bookingFrameId).src = bookURL;
	}
	
};