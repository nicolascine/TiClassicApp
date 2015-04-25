function CartWindow() {
	var CartWindow = Ti.UI.createWindow({
			title           : L("cart"),
			navBarHidden    : false,
			barColor        : Theme.TabGroup.BarColor,
			navTintColor    : Theme.TabGroup.NavTintColor,
			backgroundColor : Theme.Windows.BackgroundColor
		}),
		buttons = [{
			title   : L("checkout"),
			enabled : false
		}],
		checkoutButton = Ti.UI.createButtonBar({
			labels          : buttons,
			backgroundColor : "#006633",
			style           : Ti.UI.iPhone.SystemButtonStyle.BAR,
			height          : 30
		}),
		table = Ti.UI.createTableView({
			allowsSelectionDuringEditing : false,
			allowsSelection              : false,
			editable                     : true,
			width                        : Ti.UI.FILL,
			backgroundColor              : Theme.Cart.BackgroundColor,
			bottom                       : 44,
			top                          : 0
		}),
		editButton = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.EDIT,
			enabled      : false
		}),
		cancelButton = Ti.UI.createButton({
			title : L("done"),
			style : Ti.UI.iPhone.SystemButtonStyle.DONE
		}),
		emptyCartRow = Ti.UI.createTableViewRow({
			className       : "empty_cart",
			height          : Ti.UI.FILL,
			backgroundColor : Theme.Cart.RowsBackgroundColor
		}),
		emptyCartLbl = Ti.UI.createLabel({
			text      : L("yourCartIsEmpty"),
			textAlign : "center",
			font      : {
				fontSize   : 16,
				fontWeight : "bold"
			}
		}),
		subTotalView = Ti.UI.createView({
			width  : Ti.UI.FILL,
			height : 44,
			bottom : 0,
			layout : "horizontal"
		}),
		subTotalLbl = Ti.UI.createLabel({
			text      : L("subtotal") + ": ",
			textAlign : "right",
			height    : 44,
			width     : 230,
			font      : {
				fontSize   : Theme.Cart.SubTotalFontSize,
				fontWeight : Theme.Cart.SubTotalFontWeight
			}
		}),
		subTotalAmountLbl = Ti.UI.createLabel({
			text      : "$0.00",
			width     : 80,
			height    : 44,
			left      : 10,
			textAlign : "left",
			color     : Theme.Cart.SubTotalColor,
			font      : {
				fontSize   : Theme.Cart.SubTotalFontSize,
				fontWeight : Theme.Cart.SubTotalFontWeight
			}
		});

	// Add CartManager
	var CartManager = require("core/CartManager");
	
	// Add ProductManager
	var ProductManager = require("core/ProductManager");

	// Cart Data (as table row components) and other vars
	var CartItems = [emptyCartRow];

	// Assemble Cart UI
	subTotalView.add(subTotalLbl);
	subTotalView.add(subTotalAmountLbl);
	emptyCartRow.add(emptyCartLbl);
	CartWindow.setRightNavButton(checkoutButton);
	CartWindow.setLeftNavButton(editButton);
	CartWindow.add(table);
	CartWindow.add(subTotalView);

	/*
	 * check if cart contains any items
	 *
	 * @return {Boolean}
	 */
	CartWindow.hasItems = function(){
		return CartManager.hasItems();
	};

	/*
	 * add an item to the cart
	 *
	 * @param {String} id: unique id of product to add to cart
	 */
	CartWindow.addItem = function(id, options){
		CartManager.addItem(id, options);
	};

	/*
	 * remove an item from the cart
	 *
	 * @param {String} id: unique id of product to remove from cart
	 */
	CartWindow.removeItem = function(id, options){
		CartManager.removeItem(id, options);
	};

	/*
	 * Empty Cart
	 */
	CartWindow.empty = function(){
		subTotalAmountLbl.text = "$0.00";
		CartItems              = [emptyCartRow];
		buttons[0].enabled     = false;
	    checkoutButton.labels  = buttons;
		table.allowsSelection  = false;
		editButton.enabled     = false;

		if(table.editing == true){
			CartWindow.setLeftNavButton(editButton);
			CartWindow.setRightNavButton(checkoutButton);
			table.editing = false;
		}
		table.setData(CartItems);
		CartManager.empty();
	};

	function setCartTable(){
		var cartData  = CartManager.getRawCartData(),
			tableRows = [],
			i         = 0,
			len       = cartData.length,
			product;

		for(; i<len; i++){
			product = ProductManager.getProduct(cartData[i].id);
			tableRows.push(createRow(product, cartData[i].options, cartData[i].quantity));
		}
		if(CartManager.hasItems()){
		    buttons[0].enabled    = true;
		    checkoutButton.labels = buttons;
			table.allowsSelection = true;
			editButton.enabled    = true;
			CartItems             = tableRows;

			table.setData(tableRows);
		}
		else{
			CartWindow.empty();
		}
	}

	function createRow(product, options, quantity){
		var row  = Ti.UI.createTableViewRow({
				className               : "cart_item",
				backgroundColor         : Theme.Cart.RowsBackgroundColor,
				selectedBackgroundColor : Theme.Cart.SelectedBackgroundColor,
				hasChild                : true
			}),
			bodyView = Ti.UI.createView({
				height : Ti.UI.SIZE,
				width  : Ti.UI.FILL
			}),
			img  = Ti.UI.createImageView({
				image       : product.imgs.thumb,
				height      : Theme.Cart.ImageHeight,
				width       : Theme.Cart.ImageWidth,
				borderWidth : Theme.Cart.ImageBorderWidth,
				borderColor : Theme.Cart.ImageBorderColor,
				left        : 3,
				top         : 3
			}),
			title = Ti.UI.createLabel({
				text            : product.name,
				minimumFontSize : 13,
				width           : 220,
				height          : 16,
				color           : Theme.Cart.TitleColor,
				left            : parseInt(Theme.Cart.ImageWidth) + 20,
				top             : 4,
				font            : {
					fontSize   : Theme.Cart.TitleFontSize,
					fontWeight : Theme.Cart.TitleFontWeight
				}
			}),
			optionsList = Ti.UI.createLabel({
				color  : Theme.Cart.OptionsColor,
				left   : 55,
				height : Ti.UI.SIZE,
				width  : 220,
				top    : 42,
				left   : 80,
				text   : "",
				font   : {
					fontSize   : Theme.Cart.OptionsFontSize,
					fontWeight : Theme.Cart.OptionsFontWeight
				}
			}),
			price = Ti.UI.createLabel({
				text   : "$" + product.price,
				width  : 55,
				height : Ti.UI.SIZE,
				left   : 80,
				top    : 22,
				color  : Theme.Cart.PriceColor,
				font   : {
					fontSize   : Theme.Cart.PriceFontSize,
					fontWeight : Theme.Cart.PriceFontWeight
				}
			}),
			qty = Ti.UI.createLabel({
				text   : "Qty: " + (quantity || 1),
				width  : 100,
				height : Ti.UI.SIZE,
				left   : 140,
				top    : 22,
				color  : Theme.Cart.QuantityColor,
				font   : {
					fontSize   : Theme.Cart.QuantityFontSize,
					fontWeight : Theme.Cart.QuantityFontWeight
				}
			}),
			qtyField = Ti.UI.createTextField({
				width   : 30,
				height  : Ti.UI.SIZE,
				left    : 180,
				top     : 22,
				visible : false,
				font    : {
					fontSize   : 16,
					fontWeight : "normal"
				},
				borderRadius : 4,
				borderWidth  : 1,
				paddingLeft  : 3,
				paddingRight : 3,
				textAlign    : "right",
				keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD
			});

		bodyView.add(img);
		bodyView.add(title);
		bodyView.add(price);
		bodyView.add(qty);
		bodyView.add(qtyField);
		row.add(bodyView);

		row.id       = product.id;
		row.quantity = quantity || 1;
		row.qtyLbl   = qty;
		row.qtyFld   = qtyField;
		row.price    = product.price;
		row.name     = product.name;
		row.options  = options;

		if(options!==""){
			optionsList.text = options;
			row.options      = optionsList.text;

			bodyView.add(optionsList);
		}

		row.addEventListener(
			"click",
			function(e){
				Ti.App.fireEvent(
					"APP:SHOW_PRODUCT",
					{ "itemId" : product.id, "tab" : "Cart" }
				);
			}
		);
		return row;
	}

	/*
	 * Bind Events & Handlers
	 */
	table.addEventListener(
		"delete",
		function(e){
			CartWindow.removeItem(e.row.id, e.row.options);
		}
	);

	Ti.App.addEventListener(
		CartManager.events.change,
		function(e){
			if(table.editing){ return; }
			if(!CartManager.hasItems()){
				CartWindow.empty();
			}
			else{
				setCartTable();
				subTotalAmountLbl.text = "$" + CartManager.getSubTotal();
			}
		}
	);

	CartWindow.addEventListener(
		"focus",
		function(e){
			//hack to disable buttonbar buttons (http://m54.co/1)
			checkoutButton.labels = buttons;
			setCartTable();
		}
	);

	editButton.addEventListener(
		"click",
		function(e){
			CartWindow.setLeftNavButton(cancelButton);
			CartWindow.setRightNavButton();
			table.editing = true;

			for(var i=0,len=CartItems.length;i<len;i++){
				CartItems[i].qtyFld.visible = true;
				CartItems[i].qtyFld.value   = CartItems[i].quantity;
				CartItems[i].qtyLbl.text    = "Qty:";
			}
		}
	);

	checkoutButton.addEventListener(
		"click",
		function(e){
			if(e.index==0){// make sure button is clicked
				var modal = require("ui/CheckoutModal").create();
				modal.open();
			}
		}
	);

	cancelButton.addEventListener(
		"click", 
		function(e){
			var hasQuantityChanged = false,
				i                  = 0,
				len                = CartItems.length,
				tempQuantity,
				item;

			CartWindow.setLeftNavButton(editButton);
			CartWindow.setRightNavButton(checkoutButton);

			table.editing = false;

			for(;i<len;i++){
				item = CartItems[i];
				if(item.qtyFld.value!=="" && !isNaN(item.qtyFld.value-0)){
					tempQuantity = Math.floor(item.qtyFld.value - 0);
					if(!hasQuantityChanged && item.quantity!==tempQuantity){
						hasQuantityChanged = true;
					}
					item.quantity =  tempQuantity;
				}
				CartManager.setItemQuantity(item.id, item.options, item.quantity);
			}
			if(!hasQuantityChanged){
				setCartTable();
			}
		}
	);

	return CartWindow;
};

module.exports = CartWindow;