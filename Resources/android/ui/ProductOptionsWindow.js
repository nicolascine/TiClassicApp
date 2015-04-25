// Add CartManager
var CartManager = require('core/CartManager');

/*
 * Create product options modal (Android)
 *
 * @param {Object} productObj: product object from ProductManager
 */
exports.create = function (productObj){
	var ProductOptions = Ti.UI.createWindow({
			height       : Ti.UI.FILL,
			width        : Ti.UI.FILL,
			navBarHidden : true,
			modal        : true
		}),
		view = Ti.UI.createView({
			top             : 10,
			bottom          : 10,
			left            : 10,
			right           : 10,
			borderColor     : Theme.ProductOptions.BorderColor,
			borderWidth     : 1,
			backgroundColor : Theme.ProductOptions.BackgroundColor,
			borderRadius    : 10
		}),
		title1 = Ti.UI.createLabel({
			text   : L("purchaseOptionsFor"),
			color  : Theme.ProductOptions.TitleColor,
			width  : Ti.UI.SIZE,
			height : parseInt(Theme.ProductOptions.TitleFontSize) + 6,
			font   : {
				fontSize   : Theme.ProductOptions.TitleFontSize,
				fontWeight : Theme.ProductOptions.TitleFontWeight
			},
			top    : 4
		}),
		title2 = Ti.UI.createLabel({
			text   : productObj.name,
			color  : Theme.ProductOptions.SubTitleColor,
			width  : Ti.UI.SIZE,
			height : parseInt(Theme.ProductOptions.SubTitleFontSize) + 6,
			font   : {
				fontSize   : Theme.ProductOptions.SubTitleFontSize,
				fontWeight : Theme.ProductOptions.SubTitleFontWeight
			},
			top    : 25
		}),
		table = Ti.UI.createTableView({
			top                : 50,
			bottom             : 41,
			borderColor        : "#666",
			borderWidth        : 1,
			backgroundColor    : "#fff",
			rowBackgroundColor : "#fff"
		}),
		buyButton = Ti.UI.createButton({
			title                   : " " + L("addToCart") + " ",
			backgroundColor         : Theme.ProductOptions.ButtonBackgroundColor,
			color                   : Theme.ProductOptions.ButtonColor,
			selectedColor           : Theme.ProductOptions.ButtonSelectedColor,
			height                  : 30,
			width                   : Ti.UI.SIZE,
			backgroundSelectedColor : Theme.ProductOptions.ButtonBackgroundSelectedColor,
			bottom                  : 5,
			right                   : 5
		}),
		optionsLength   = productObj.options.length,
		tableData       = [],
		groupIndex      = 0,
		selectedOptions = [];

	// assemble UI
	view.add(title1);
	view.add(title2);
	view.add(table);
	view.add(buyButton);
	ProductOptions.add(view);

	for(var i=0; i<optionsLength; i++){
		var option          = productObj.options[i],
			selectionLength = option.selections.length,
			isMultiSelect   = option.multiple;

		for(var x=0; x<selectionLength; x++){
			var isFirst = x==0,
				row = getRow(
					option.selections[x],
					isFirst ? option.name : undefined
				);

			row.groupIndex    = groupIndex;
			row.isMultiSelect = isMultiSelect;
			row.name          = option.selections[x];

			tableData.push(row);
		}
		groupIndex++;
	}

	table.setData(tableData);

	/*
	 * Create selection table row
	 * 
	 * @param {String} text: the text label for the row
	 * @return {Object} returns a Ti table row object
	 */
	function getRow(text, header){
		var row = Ti.UI.createTableViewRow({
			height          : 48,
			color           : "#000",
			backgroundColor : "#fff",
			title           : " " + text
		});

		if(header){
			row.header = header;
		}

		row.select = function(bool){
			row.hasCheck = bool;
		}

		return row;
	}

	buyButton.addEventListener(
		"click",
		function(e){
			for(var i=0, len = tableData.length; i<len; i++){
				if(tableData[i].hasCheck) {
					selectedOptions.push(tableData[i].name);
				}
			}
			ProductOptions.close();
			CartManager.addItem(productObj.id, selectedOptions);
		}
	);

	table.addEventListener(
		"click",
		function(e){
			// if multiple selection is not allowed then treat group as radio buttons
			if(!e.row.isMultiSelect){
				for(var i=0, len = tableData.length; i<len; i++){
					if(tableData[i].groupIndex == e.row.groupIndex){
						tableData[i].hasCheck = false;
					}
				}
				e.row.hasCheck = true;
			}
			// else treat as group as checkboxes
			else{
				e.row.hasCheck = (e.row.hasCheck) ? false : true;
			}
		}
	);

	return ProductOptions;
};
