
var 
	// get util library
	util = require("core/Util"),

	// get cart manager
	CartManager = require("core/CartManager");

/*
 * Create product options modal (Android)
 *
 * @param {Object} productObj: product object from ProductManager
 */
exports.create = function(productObj) {
	var ProductDetail = Ti.UI.createWindow({
			title           : L("details"),
			navBarHidden    : false,
			barColor        : Theme.TabGroup.BarColor,
			navTintColor    : Theme.TabGroup.NavTintColor,
			backgroundColor : Theme.Windows.BackgroundColor,
			layout          : "vertical"
		}),
		top = Ti.UI.createView({
			height          : Theme.ProductDetail.Top.Height,
			width           : Ti.UI.FILL,
			borderColor     : Theme.ProductDetail.Top.BorderColor,
			borderWidth     : Theme.ProductDetail.Top.BorderWidth,
			backgroundColor : Theme.ProductDetail.Top.BackgroundColor
		}),
		bottom = Ti.UI.createView({
			height          : Ti.UI.FILL,
			width           : Ti.UI.FILL,
			backgroundColor : Theme.ProductDetail.Bottom.BackgroundColor,
			layout          : "vertical"
		}),
		img  = Ti.UI.createImageView({
			image        : productObj.imgs.main,
			defaultImage : Config.PRODUCTS_DEFAULT_MAIN_IMAGE,
			height       : Theme.ProductDetail.Top.ImageHeight,
			left         : 1,
			width        : Theme.ProductDetail.Top.ImageWidth,
			top          : 1,
			borderWidth  : Theme.ProductDetail.Top.BorderWidth,
			borderColor  : Theme.ProductDetail.Top.BorderColor
		}),
		name = Ti.UI.createLabel({
			text   : productObj.name,
			width  : Theme.ProductDetail.Top.NameWidth,
			height : Theme.ProductDetail.Top.NameHeight,
			top    : 3,
			left   : 151,
			color  : Theme.ProductDetail.Top.NameColor,
			font   : {
				fontSize   : Theme.ProductDetail.Top.NameFontSize,
				fontWeight : Theme.ProductDetail.Top.NameFontWeight
			}
		}),
		price = Ti.UI.createLabel({
			text   : "$" + productObj.price,
			width  : Theme.ProductDetail.Top.PriceWidth,
			height : Theme.ProductDetail.Top.PriceHeight,
			top    : 50,
			left   : 151,
			color  : Theme.ProductDetail.Top.PriceColor,
			font   : {
				fontSize   : Theme.ProductDetail.Top.PriceFontSize,
				fontWeight : Theme.ProductDetail.Top.PriceFontWeight
			}
		}),
		info = Ti.UI.createWebView({
			visible : false,
			height  : Ti.UI.FILL,
			width   : Ti.UI.FILL,
			html    : [
				"<htm><head><style>body{margin:5px;padding:0}body,p,strong",
				"{font-family:helvetica;font-size:12px}</style></head><body>",
				productObj.desc.long,
				"</body></html>"
			].join("")
		});

	var buyButton = Ti.UI.createButton({
		title           : " " + L("addToCart") + " ",
		backgroundColor : Theme.ProductDetail.Top.ButtonBackgroundColor,
		color           : Theme.ProductDetail.Top.ButtonColor,
		selectedColor   : Theme.ProductDetail.Top.ButtonSelectedColor,
		backgroundSelectedColor : Theme.ProductDetail.Top.ButtonBackgroundSelectedColor,
		style           : Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		height          : parseInt(Theme.ProductDetail.Top.ButtonFontSize) + 10,
		width           : Ti.UI.FILL,
		top             : 80,
		left            : 150,
		font            : {
			fontSize   : Theme.ProductDetail.Top.ButtonFontSize,
			fontWeight : Theme.ProductDetail.Top.ButtonFontWeight
		}
	});

	// assemble UI
	top.add(img);
	top.add(name);
	top.add(price);
	ProductDetail.add(top);
	ProductDetail.add(bottom);

	top.add(buyButton);

	// Add webview to screen and display
	function setInfoHTML(){
		bottom.add(info);
		info.show();
	}

	// Add item to cart or show options modal
	function buyHandler(){
		if(productObj.options){
			require("ui/ProductOptionsWindow").create(productObj).open();
		}
		else{
			CartManager.addItem(productObj.id);
		}
	}

	ProductDetail.addEventListener(
		"focus",
		setInfoHTML
	);

	ProductDetail.addEventListener(
		"blur",
		function(e){
			setTimeout(
				function(){
					ProductDetail.close({animated : false});
				},
				300
			);
		}
	);

	buyButton.addEventListener(
		"click",
		buyHandler
	);

	return ProductDetail;
}
