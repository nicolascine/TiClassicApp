var Currency = {
	add : function(a,b){
		return Math.round(a*100 + b*100)/100;
	},
	subtract : function(a,b){
		return Math.round(a*100 - b*100)/100;
	},
	multiply : function(a,b){
		var log_10 = function (c) { return Math.log(c) / Math.log(10); },
		    ten_e  = function (d) { return Math.pow(10, d); },
		    pow_10 = -Math.floor(Math.min(log_10(a), log_10(b))) + 1;

		return Math.round(((a * ten_e(pow_10)) * (b * ten_e(pow_10))) / ten_e(pow_10 * 2)*100)/100;
	}
};

// Private Parameters
var _hasItems       = false,
	_subTotal       = 0,
	_items          = [],
	_itemCount      = 0,
	_ProductManager = require("core/ProductManager"),
	_this           = this,
	_events         = {
		"change" : "CartManager::Cart_Changed"
	};

// Private Methods
var _compareOptions = function(optionsA, optionsB){
		if(typeof optionsA == "undefined" || typeof optionsB == "undefined"){
			return false;
		}
		return optionsA === optionsB;
	},
	_findItemIndex = function(id, options){
		var i         = 0,
			len       = _items.length,
			options   = (typeof options == "string") ? options : options.join(", "),
			itemIndex = null,
			hasSameOptions,
			item;

		for(; i<len;i++){
			item = _items[i];
			hasSameOptions = _compareOptions(item.options, options);
			if(id===item.id && hasSameOptions){
				itemIndex = i;
				break;
			}
		}
		return itemIndex;
	},
	_addItem = function(product, options){
		_items.push({
			"id"       : product.id,
			"name"     : product.name,
			"quantity" : 1,
			"price"    : product.price,
			"options"  : (typeof options == "string") ? options : options.join(", ")
			
		});
	},
	_fireEvent = function(event){
		Ti.App.fireEvent(event);
	};

// Public Methods
exports.hasItems = function(){
	return _hasItems;
};

exports.addItem = function(id, options, itemIndex, howMany){
	var options    = options || [],
		indexToAdd = itemIndex || _findItemIndex(id, options),
		product,
		item;

	if(indexToAdd===null){
		product = _ProductManager.getProduct(id);
		_addItem(product, options);
		_subTotal = Currency.add(product.price, _subTotal);
	}
	else{
		item = _items[indexToAdd];
		item.quantity += howMany || 1;
		_subTotal = Currency.add(_subTotal, Currency.multiply(item.price, howMany || 1));
	}
	_itemCount += howMany || 1;
	_hasItems = true;
	_fireEvent(_events.change);
};

exports.setItemQuantity = function(id, options, quantity){
	var options   = options || [],
		itemIndex = _findItemIndex(id, options),
		item;

	if(itemIndex===null){
		return;
	}

	item = _items[itemIndex];

	if(quantity<1){
		this.removeItem(id, options, itemIndex);
	}
	else if(quantity<item.quantity){
		this.removeItem(id, options, itemIndex, item.quantity - quantity);
	}
	else if(quantity>item.quantity){
		this.addItem(id, options, itemIndex, quantity - item.quantity);
	}
}

exports.removeItem = function(id, options, itemIndex, howMany){
	var options = options || [],
		indexToRemove = itemIndex || _findItemIndex(id, options),
		removedItem,
		item;

	if(indexToRemove===null){
		return;
	}

	if(howMany){
		item           = _items[indexToRemove];
		item.quantity -= parseInt(howMany);
		_subTotal      = Currency.subtract(_subTotal, Currency.multiply(item.price, howMany));
		_itemCount    -= parseInt(howMany);

		_fireEvent(_events.change);

		return;
	}

	removedItem = _items.splice(indexToRemove, 1)[0];

	if(_items.length<1){
		this.empty();
	}
	else{
		_subTotal  = Currency.subtract(_subTotal, Currency.multiply(removedItem.price, removedItem.quantity));
		_itemCount = Currency.subtract(_itemCount, removedItem.quantity);
	}
	_fireEvent(_events.change);
};

exports.findItem = function(id){
	var i   = 0,
		len = _items.length;
	for(;i<len;i++){
		if(id==_items[i].id){
			return _items[i];
		}
	}
	return false;
};

exports.empty = function(){
	if(this.hasItems()){
		_subTotal  = 0;
		_items     = [];
		_itemCount = 0;
		_hasItems  = false;

		_fireEvent(_events.change);
	}
};

exports.getCartData = function(){
	var cartData = [],
		i        = 0,
		len      = _items.length,
		item, price, total;
	for(;i<len;i++){
		item = _items[i];
		price = item.price;
		total = item.price * item.quantity;
		cartData.push({
			"itemId" : item.id,
			"name" : item.name + ((item.options) ? " (" + item.options + ")" : ""),
			"itemCount" : Math.round(item.quantity*100)/100,
			"itemPrice" : Math.round(item.price*100)/100,
			"totalPrice" : Math.round(item.price*100 * item.quantity)/100
		});
	}
	return cartData;
}

exports.getRawCartData = function(){
	return _items;
}

exports.getSubTotal = function(){
	return _subTotal;
}

exports.getItemCount = function(){
	return _itemCount;
}

exports.events = _events;