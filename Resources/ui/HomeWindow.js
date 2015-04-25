function HomeWindow() {
	
	var 
		// get util library
		util = require("core/Util"),

		// get spotlight component
		viewscrollr = require("core/ViewScrollrPro"),

		// create home window UI components
		Window = Ti.UI.createWindow({
			title           : L("storeName"),
			navBarHidden    : false,
			layout          : "vertical",
			barColor        : Theme.TabGroup.BarColor,
			navTintColor    : Theme.TabGroup.NavTintColor,
			backgroundColor : Theme.Windows.BackgroundColor
		}),
		Featured = require("ui/Featured").create({
			width  : Ti.UI.FILL,
			height : Ti.UI.FILL
		}),
		FeaturedHeader = Ti.UI.createLabel({
			text            : " " + L("featuredTitle"), //add space for padding (border not working for left padding)
			textAlign       : Ti.UI.TEXT_ALIGNMENT_LEFT,
			color           : Theme.Home.Featured.HeaderColor,
			backgroundColor : Theme.Home.Featured.HeaderBackgroundColor,
			borderWidth     : 5,
			borderColor     : "transparent",
			font            : {
				fontSize   : Theme.Home.Featured.HeaderFontSize,
				fontWeight : Theme.Home.Featured.HeaderFontWeight
			}
		}),
		FeaturedRows = Ti.UI.createTableViewSection({
			headerView : FeaturedHeader
		}),

		spotlightProducts = [],
		nonLabelOptions = "delay duration fade moveFrom offset".split(" "),
		Spotlight, SpotlightScrollableView, undef;

	// get product manager
	var products      = require("core/ProductManager"),
		productEvents = products.events;

	// assemble UI
	var FeaturedObj  = Featured.get();

	// event handlers
	var spotlightReadyHandler = function(e){
			 assembleSpotlightViews(products.getSpotlightProducts());
			 Ti.App.removeEventListener(productEvents.SPOTLIGHTS_READY, spotlightReadyHandler);
		},
		featuredReadyHandler = function(e){
			assembleFeaturedRows(products.getFeaturedProducts());
			Ti.App.removeEventListener(productEvents.FEATURED_READY, featuredReadyHandler);
		},
		launchProduct = function(e){
			Ti.App.fireEvent(
				"APP:SHOW_PRODUCT",
				{ "itemId" : spotlightProducts[e.currentPage], "tab" : "Home" }
			);
		};

	// bind events
	Ti.App.addEventListener(
		productEvents.SPOTLIGHTS_READY,
		spotlightReadyHandler
	);

	Ti.App.addEventListener(
		productEvents.FEATURED_READY,
		featuredReadyHandler
	);

	Window.addEventListener(
		"focus",
		function(){
			if(Spotlight){
				Spotlight.$.start();
			}
		}
	);

	Window.addEventListener(
		"blur",
		function(){
			if(Spotlight){
				Spotlight.$.stop();
			}
		}
	);

	/*
	 * Assemble featured table using list of featured products
	 *
	 * @param {Array} list: array list of featured row properties
	 */
	function assembleFeaturedRows(list){
		for(var i=0, l=list.length;i<l;i++){
			FeaturedRows.add(
				Featured.createRow(
					list[i].name,
					list[i].img,
					list[i].desc,
					list[i].id
				)
			);
		}
		FeaturedObj.setData([FeaturedRows]);
	}

	/*
	 * Assemble spotlight scrollable view using list of spotlight properties
	 *
	 * @param {Array} list: array list of spotlight view properties
	 */
	function assembleSpotlightViews(list){
		var slides = [];

		for(var i=0, l=list.length;i<l;i++){
			spotlightProducts.push(list[i].id);

			slides.push({
				"image"  : list[i].img,
				"blocks" : (
					function(){
						if(!list[i].config){ return undef; }
						var blocks = [];
						list[i].config.forEach(
							function(obj, index, arr){
								blocks.push(createContentBlock(obj));
							}
						);
						return blocks;
					}
				)()
			});
		}

		Spotlight = viewscrollr.create({
			height : Theme.Home.Spotlight.Height,
			scale  : true,
			auto   : Theme.Home.Spotlight.AutoScroll,
			navigation : {
				opacity         : Theme.Home.Spotlight.NavOpacity,
				onTop           : Theme.Home.Spotlight.NavOnTop,
				style           : Theme.Home.Spotlight.NavStyle,
				selectedColor   : Theme.Home.Spotlight.NavSelectedColor,
				color           : Theme.Home.Spotlight.NavColor,
				showBorder      : Theme.Home.Spotlight.NavShowBorder,
				borderColor     : Theme.Home.Spotlight.NavBorderColor,
				backgroundColor : Theme.Home.Spotlight.NavBackgroundColor
			},
			slides : slides
		});
		
		Spotlight.addEventListener(
			viewscrollr.EVENT.SlideSingleTap,
			launchProduct
		);

		Window.add(Spotlight);
		Window.add(FeaturedObj);

		Spotlight.$.start();
	}

	/**
	 * Create ViewScrollrPro animated content block
	 *
	 * @param {Object} options: settings for content block
	 */
	function createContentBlock(options){
		var contentBlock = {};

		util.mixin(contentBlock, {
			delay    : options.delay,
			duration : options.duration,
			fade     : options.fade,
			moveFrom : options.moveFrom,
			offset   : options.offset
		});

		nonLabelOptions.forEach(function(param, index, arr){
			delete options[param];
		});

		contentBlock.view = Ti.UI.createLabel(options);

		return contentBlock;
	}

	return Window;
};

module.exports = HomeWindow;
