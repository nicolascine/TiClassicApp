// Include Order Processing callbacks
Ti.include("/core/ProcessOrder.js");

// Add PayPal (requires module package)
var PaypalModule = require("ti.paypal");

// Add CartManager
var CartManager = require("core/CartManager");

// Add ProductManager
var ProductManager = require("core/ProductManager");

// Get Util Library
var Util = require("core/Util");

// Get Configuration Data
var config = require("data/Config");

// get loading indicator
var LoadingIndicator = require("ui/Indicator");

var PayPalConts = {
	"SANDBOX"    : PaypalModule.PAYPAL_ENV_SANDBOX,
	"LIVE"       : PaypalModule.PAYPAL_ENV_LIVE,
	"NONE"       : PaypalModule.PAYPAL_ENV_NONE,
	"HARD_GOODS" : PaypalModule.PAYMENT_TYPE_HARD_GOODS,
	"SERVICE"    : PaypalModule.PAYMENT_TYPE_SERVICE,
	"PERSONAL"   : PaypalModule.PAYMENT_TYPE_PERSONAL,
	"PAY"        : PaypalModule.PAYPAL_TEXT_PAY,
	"DONATE"     : PaypalModule.PAYPAL_TEXT_DONATE
};

exports.create = function(){
var blah = CartManager.getCartData();

	var total = CartManager.getSubTotal(),
		checkoutWin = Ti.UI.createWindow({
			modal           : true,
			barColor        : "#000000",
			navTintColor    : "#FFFFFF",
			title           : L("checkout"),
			backgroundColor : "#FFFFFF"
		}),
		checkoutLbl = Ti.UI.createLabel({
			text      : L("total") + ": $" + total,
			textAlign : "center",
			height    : 30,
			top       : 100,
			color     : "#000000"
		}),
		cartData  = CartManager.getCartData(),
		paypalBtn = getPayPalButton(total, cartData),
		cancelButton;

	if(Util.iOS){
		cancelButton = Ti.UI.createButton({
			title : L("cancel"),
			bottom : 20,
			left : 10,
			right : 10,
			height : 50
		});
		checkoutWin.add(cancelButton);

		cancelButton.addEventListener(
			"click",
			function(){
				checkoutWin.close();
			}
		);
	}
	checkoutWin.add(checkoutLbl);
	checkoutWin.add(paypalBtn);

	paypalBtn.addEventListener(
		"paymentCancelled",
		function(e) {
			ProcessOrder.cancelled(cartData);
			checkoutWin.close();
		}
	);
	
	paypalBtn.addEventListener(
		"paymentSuccess",
		function(e) {
			CartManager.empty();
			checkoutWin.close();
			ProcessOrder.success(cartData, e.transactionID);
		}
	);
	paypalBtn.addEventListener(
		"paymentError",
		function(e) {
			ProcessOrder.failed(cartData, e.errorCode, e.errorMessage);
			checkoutWin.close();
		}
	);
	paypalBtn.addEventListener(
		"buttonDisplayed",
		function () {
			setTimeout(
				function(){
					if(LoadingIndicator.isOpen()){
						LoadingIndicator.hide();
					}
				}, 1000
			);
		}
	);
	paypalBtn.addEventListener(
		"buttonError",
		function (e) {
			ProcessOrder.failed(cartData, e.errorCode, e.errorMessage);
			checkoutWin.close();		}
	);

	checkoutWin.addEventListener(
		"open",
		function(e){
			LoadingIndicator.show();
			setTimeout(
				function(){
					if(LoadingIndicator.isOpen()){
						LoadingIndicator.hide();
					}
				}, 4000
			);
		}
	);

	return checkoutWin;
}

/*
 * Create PayPal Button object
 *
 * @param {Number} amount: The total amount of the order
 * @param {Number} tax: Tax amount to apply to transaction
 * @param {Number} shipping: Shipping cost to apply to transaction
 * @param {String} memo: Description (not required)
 * @returns {Object} PayPal button UI object
 */
function getPayPalButton(amount, cartData, tax, shipping, memo){
	return PaypalModule.createPaypalButton({
		// NOTE: height/width only determine the size of the view that 
		// the button is embedded in - the actual button size
		// is determined by the buttonStyle property!
		appId             : config.PAYPAL_APP_ID,
		language          : L("paypal_lang"),
		textStyle         : PayPalConts[config.PAYPAL_PAYMENT_TYPE], // Set to "Pay" or "Donate"
		buttonStyle       : PaypalModule.BUTTON_194x37, // The style & size of the button
		paypalEnvironment : PayPalConts[config.PAYPAL_ENVIRONMENT],
		feePaidByReceiver : false, // This will only be applied when the transaction type is Personal
		enableShipping    : config.PAYPAL_ENABLE_SHIPPING, // Whether or not to select/send shipping information
		width             : 194,
		height            : 37,
		top               : 150,
	
		payment : { // The payment itself
			paymentType     : PayPalConts[config.PAYPAL_TRANSACTION_TYPE], // The type of payment
			subtotal        : amount, // The total cost of the order, excluding tax and shipping
			tax             : tax || 0,
			shipping        : shipping || 0,
			currency        : config.PAYPAL_CURRENCY_TYPE,
			recipient       : config.PAYPAL_RECIPIENT,
			ipnUrl          : config.PAYPAL_IPN_URL,
			memo            : memo || " ",
			merchantName    : config.MERCHANT_NAME,
 			invoiceItems    : cartData
		}
	});
}