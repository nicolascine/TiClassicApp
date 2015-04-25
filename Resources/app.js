var Theme, Config;

/*
 * Open top-level UI component (AppTabGroup) based os name
 */
(function() {
	// Set global Configuration Data
	Config = require("data/Config");

	// Set global Theme data
	Theme = require("theme/"+Config.THEME);

	var 
		AppTabGroup = require("ui/AppTabGroup"),
		util = require("core/Util"),
		App;

	Ti.UI.backgroundColor = Theme.AppBackgroundColor;

	//Using a local Product file
	Ti.include("data/SampleProducts.js");
	App = new AppTabGroup(ProductData);
	
	//Using a remote Product file
	// App = new AppTabGroup(Config.PRODUCT_LIST_URL);

	// Open Main App Window
	if (util.osname === "iphone" || util.osname === "ipad") {
		App.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP });
	}
	else{
		App.open();
	}
})();