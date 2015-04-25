// get util library
var Util = require("core/Util"),
	DEFAULT;

Util.mixin(exports, {

	// Set App Theme
	THEME : "default",

	// Default thumb image
	PRODUCTS_DEFAULT_THUMB_IMAGE : "<<IMAGE PATH>>",

	// Default main image
	PRODUCTS_DEFAULT_MAIN_IMAGE : "<<IMAGE PATH>>",

	// Default spotlight image
	PRODUCTS_DEFAULT_SPOTLIGHT_IMAGE : "<<IMAGE PATH>>",

	// Info screens (titles & webview urls)
	INFO_SCREENS : [
		{
			TITLE : "About Us",
			URL   : "http://Mode54.com"
		},
		{
			TITLE : "Our Blog",
			URL   : "http://mode54.com/blog"
		}
	],

	// URL for product list on your server
	PRODUCT_LIST_URL : "<<JSON PATH>>",

	// PayPal App ID Issued by PayPal
	PAYPAL_APP_ID : "APP-80W284485P519543T",// Use this id for sandbox testing only,

	// PayPal payment recipient email (so you get paid)
	PAYPAL_RECIPIENT : "<<PAYPAL EMAIL>>",

	// PayPal transaction type (HARD_GOODS, SERVICE or PERSONAL)
	PAYPAL_TRANSACTION_TYPE : "SERVICE",

	// PayPal payment environment (LIVE, SANDBOX or NONE)
	PAYPAL_ENVIRONMENT : "SANDBOX",

	// Whether or not to select/send PayPal shipping information
	PAYPAL_ENABLE_SHIPPING : false,

	// PayPal payment type (Causes the button's text to change from "Pay" to "Donate")
	PAYPAL_PAYMENT_TYPE : "PAY",

	// Your Instant Payment Notification URL. This will be hit by Paypal server on completion of payment.
	PAYPAL_IPN_URL : DEFAULT,

	// PayPal currency type
	PAYPAL_CURRENCY_TYPE : "USD",

	// Merchant Name used in PayPal transaction (default to app name)
	MERCHANT_NAME : Ti.App.name,

	// Successful Payment Message
	PAYMENT_SUCCESS_MESSAGE : {
		TITLE   : "Payment successful!",
		MESSAGE : "Thank You for your purchase!"
	}
});