//Default Theme
var DEFAULT,
    viewscrollr = require("../core/ViewScrollrPro");

module.exports = {

	// Application
	App : {
		BackgroundColor : "#FFFFFF"
	},

	// Tab Group
	TabGroup : {
		TabsBackgroundColor : DEFAULT,
		TabsBackgroundSelectedColor : DEFAULT,// Android Only

		// iOS Only
		ShadowImage              : DEFAULT,
		BarColor                 : "#9F9F9F",
		ActiveTabIconTint        : DEFAULT,
		ActiveTabBackgroundImage : DEFAULT,
		TabsBackgroundImage      : DEFAULT,

		// iOS 7 Only
		TabsTintColor : DEFAULT,
		TintColor     : DEFAULT,
		NavTintColor  : DEFAULT
	},

	// Windows
	Windows : {
		BackgroundColor : "#CCCCCC"
	},

	// Home Window
	Home : {
		Spotlight : {
			AutoScroll         : true,
			NavStyle           : viewscrollr.NAV_STYLE.CIRCLE,
			NavSelectedColor   : "#000000",
			NavColor           : "#DDDDDD",
			NavShowBorder      : true,
			NavBorderColor     : "#000000",
			NavBackgroundColor : "transparent",
			NavOpacity         : 0.5,
			NavOnTop           : false,
			Height             : 210
		},
		Featured : {
			HeaderBackgroundColor   : "#CCCCCC",
			HeaderColor             : "#000000",
			HeaderFontSize          : 12,
			HeaderFontWeight        : "bold",
			RowsBackgroundColor     : "#FFFFFF",

			TitleColor              : "#000000",
			TitleFontSize           : 14,
			TitleFontWeight         : "bold",

			DescriptionColor        : "#000000",
			DescriptionFontSize     : 12,
			DescriptionFontWeight   : DEFAULT,

			ImageWidth              : 75,
			ImageHeight             : 56,
			ImageBorderColor        : "transparent",
			SelectedBackgroundColor : "#EEEEEE"
		}
	},
	ProductsList : {
		HeaderBackgroundColor   : "#CCCCCC",
		HeaderColor             : "#000000",
		HeaderFontSize          : 12,
		HeaderFontWeight        : "bold",
		RowsBackgroundColor     : "#FFFFFF",

		TitleColor              : "#000000",
		TitleFontSize           : 14,
		TitleFontWeight         : "bold",

		DescriptionColor        : "#000000",
		DescriptionFontSize     : 12,
		DescriptionFontWeight   : DEFAULT,

		ImageWidth              : 75,
		ImageHeight             : 56,
		ImageBorderColor        : "transparent",
		SelectedBackgroundColor : "#EEEEEE"
	},
	ProductDetail : {
		Top : {
			Height          : 120,
			BorderColor     : "#CCCCCC",
			BorderWidth     : 1,
			BackgroundColor : "#FFFFFF",
			ImageHeight     : 100,
			ImageWidth      : 140,
			BorderWidth     : 3,
			BorderColor     : "#FFFFFF",

			NameWidth       : 170,
			NameHeight      : 50,
			NameColor       : '#000000',
			NameFontSize    : 18,
			NameFontWeight  : "bold",

			PriceWidth      : 100,
			PriceHeight     : 20,
			PriceColor      : "#0000CC",
			PriceFontSize   : 16,
			PriceFontWeight : "bold",

			ButtonFontSize  : 14,
			ButtonFontWeight: "bold",
			ButtonColor     : "#FFFFFF",// iOS only
			ButtonSelectedColor   : "#F5785A",// iOS only
			ButtonBackgroundColor : "#006633",
			ButtonBackgroundSelectedColor : "#FF0000"// Android Only
		},
		Bottom : {
			BackgroundColor : "#FFFFFF"
		}
	},
	ProductOptions : {
		BackgroundColor       : "#EEEEEE",
		BorderColor           : "#666666", //Android Only

		TitleColor            : "#000000",
		TitleFontSize         : 16,
		TitleFontWeight       : "bold",

		SubTitleColor         : "#000000",
		SubTitleFontSize      : 16,
		SubTitleFontWeight    : "bold",

		ButtonColor           : "#FFFFFF",// iOS only
		ButtonSelectedColor   : "#F5785A",// iOS only
		ButtonBackgroundColor : "#006633",
		ButtonBackgroundSelectedColor : "#F5785A"// Android Only
	},
	Info : {
		BorderColor             : "#ABABAB",
		BackgroundColor         : "#FFFFFF",
		TextColor               : "#000000",
		RowHeight               : 44,
		SelectedBackgroundColor : "#EEEEEE",

		VersionTextHeight       : 20,
		VersionTextColor        : "#666666",
		VersionTextShadowColor  : "#FFFFFF",
		VersionTextShadowOffset : { x : 1, y : 1 },
		VersionTextFontSize     : 16,
		VersionTextFontWeight   : DEFAULT
	},
	Cart : {
		BackgroundColor         : "#FFFFFF",
		RowsBackgroundColor     : "#FFFFFF",
		SelectedBackgroundColor : "#EEEEEE",

		ImageHeight             : 40,
		ImageWidth              : 60,
		ImageBorderWidth        : 3,
		ImageBorderColor        : "transparent",

		TitleColor              : "#000000",
		TitleFontSize           : 14,
		TitleFontWeight         : "bold",

		OptionsColor            : "#5C5C5C",
		OptionsFontSize         : 11,
		OptionsFontWeight       : "normal",

		PriceColor              : "#0000CC",
		PriceFontSize           : 14,
		PriceFontWeight         : "normal",

		QuantityColor           : "#000000",
		QuantityFontSize        : 14,
		QuantityFontWeight      : "normal",

		SubTotalColor           : "#0000cc",
		SubTotalFontSize        : 16,
		SubTotalFontWeight      : "bold"
	}
};