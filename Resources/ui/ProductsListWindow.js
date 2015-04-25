
var 
	// get util library
	util = require("core/Util"),

	// get product manager
	ProductManager = require("core/ProductManager");

function ProductListWindow() {
	var Window = Ti.UI.createWindow({
			title           : L("products"),
			navBarHidden    : false,
			barColor        : Theme.TabGroup.BarColor,
			navTintColor    : Theme.TabGroup.NavTintColor,
			backgroundColor : Theme.Windows.BackgroundColor
		}),
		Table  = Ti.UI.createTableView({
			width           : Ti.UI.FILL,
			height          : Ti.UI.FILL,
			backgroundColor : "#FFFFFF"
		});

	// get product manager
	var products      = require("core/ProductManager"),
		productEvents = products.events;

	// assemble UI
	Window.add(Table);

	/*
	 * Product row factory method
	 *
	 * @param {String} name: the product name to display
	 * @param {String} image: the icon image to display
	 * @param {String} desc: description of item to display in row
	 * @param {String} itemId: item id used to load product page
	 */
	function createRow(name, image, desc, itemId){
		var row = Ti.UI.createTableViewRow({
				className : "product_rows",
				backgroundColor : Theme.ProductsList.RowsBackgroundColor,
				selectedBackgroundColor : Theme.ProductsList.SelectedBackgroundColor,
				hasChild  : true

			}),
			img  = Ti.UI.createImageView({
				image        : image,
				left         : 1,
				top          : 1,
				borderWidth  : 3,
				borderColor  : Theme.ProductsList.ImageBorderColor,
				defaultImage : Config.PRODUCTS_DEFAULT_THUMB_IMAGE
			}),
			bodyView = Ti.UI.createView({
				layout : "vertical"
			}),
			title = Ti.UI.createLabel({
				text            : name,
				minimumFontSize : 12,
				color           : Theme.ProductsList.TitleColor,
				height          : Ti.UI.SIZE,
				left            : 2,
				top             : 4,
				font : {
					fontSize   : Theme.ProductsList.TitleFontSize,
					fontWeight : Theme.ProductsList.TitleFontWeight
				}
			}),
			body = Ti.UI.createLabel({
				text   : desc,
				height : Ti.UI.SIZE,
				left   : 2,
				top    : 2,
				color  : Theme.ProductsList.DescriptionColor,
				font : {
					fontSize   : Theme.ProductsList.DescriptionFontSize,
					fontWeight : Theme.ProductsList.DescriptionFontWeight
				}
			});

		// assemble row
		bodyView.add(title);
		bodyView.add(body);
		row.add(img);

		if(util.osname==="android"){
			img.width       = Theme.ProductsList.ImageWidth + "dip";
			img.height      = Theme.ProductsList.ImageHeight + "dip";
			bodyView.left   = (Theme.ProductsList.ImageWidth + 1) + "dip";
			bodyView.right  = "3dip";
			bodyView.top    = 0;
			bodyView.bottom = 0;
			body.height     = Ti.UI.SIZE;
		}
		else{
			img.width       = 81;
			bodyView.left   = 82;
			bodyView.height = Ti.UI.SIZE;
		}

		row.add(bodyView);

		// handle featured item click event
		row.addEventListener(
			"click",
			function(e){
				Ti.App.fireEvent(
					"APP:SHOW_PRODUCT",
					{ "itemId" : itemId, "tab" : "Products" }
				);
			}
		);

		return row;
	}

	/*
	 * Product group factory method
	 * 
	 * @param {String} name: the name of the group/section
	 * @param {Array} products: array of products for this group/section
	 */
	function createProductGroup(name, products){
		var productGroupHeader = Ti.UI.createLabel({
		    	text            : " "+name, //add space for padding (border not working for left padding)
		    	textAlign       : Ti.UI.TEXT_ALIGNMENT_LEFT,
		    	color           : Theme.ProductsList.HeaderColor,
		    	backgroundColor : Theme.ProductsList.HeaderBackgroundColor,
		    	borderWidth     : 2,
		    	borderColor     : Theme.ProductsList.HeaderBackgroundColor,
		    	font            : {
		    		fontSize   : Theme.ProductsList.HeaderFontSize,
		    		fontWeight : Theme.ProductsList.HeaderFontWeight
		    	}
		    }),
		    productGroup = Ti.UI.createTableViewSection({
		    	headerView : productGroupHeader
		    });

		for(var i=0,l=products.length;i<l;i++){
			productGroup.add(
				createRow(
					products[i].name,
					products[i].imgs.thumb,
					products[i].desc.short,
					products[i].id
				)
			);
		}
		return productGroup;
	}

	/*
	 * Assemble product groups for table view
	 *
	 * @param {Object} groups: the groups object containing product arrays for each group/section
	 */
	function displayProducts(){
		var data = [],
			groups = require("core/ProductManager").getProductGroup("__ALL__");
		for(var key in groups){
			data.push(
				createProductGroup(
					key,
					groups[key]
				)
			);
		}
		Table.setData(data);
	}

	Window.addEventListener(
		"focus",
		displayProducts
	);

	return Window;
};

module.exports = ProductListWindow;