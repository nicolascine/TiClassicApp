var 
    // get util library
	util = require("core/Util");


function InfoWindow() {
	var Window = Ti.UI.createWindow({
		title           : L("info"),
		navBarHidden    : false,
		barColor        : Theme.TabGroup.BarColor,
		navTintColor    : Theme.TabGroup.NavTintColor,
		backgroundColor : Theme.Windows.BackgroundColor,
		layout          : "vertical"
	}),
	infoTable,
	versionLabel;

	Window.addEventListener(
		"focus",
		function(e){
			infoTable    = buildInfoTable();
			versionLabel = getVersionLabel();

			infoTable.addEventListener( "click", function(e){ launchInfoWebView(e.index) } );

			Window.add(infoTable);
			Window.add(versionLabel);
		}
	);

	Window.addEventListener(
		"blur",
		function(e){
			// release info table for garbage collection
			// delay 500ms to allow window transition
			setTimeout(
				function(){
					Window.remove(infoTable);
					Window.remove(versionLabel);
					infoTable = null;
					versionLabel = null;
				},
				500
			);
			
		}
	);

	/*
	 * Create an info table
	 * 
	 * @return {Object} returns a Ti table object
	 */
	function getTable(){
		return Ti.UI.createTableView({
			top             : 10,
			borderRadius    : 6,
			borderWidth     : 1,
			borderColor     : Theme.Info.BorderColor,
			scrollable      : false,
			left            : 10,
			right           : 10,
			backgroundColor : Theme.Info.BackgroundColor
		});
	}

	/*
	 * Create an info table row
	 * 
	 * @param {String} text: the text label for the row
	 * @return {Object} returns a Ti table row object
	 */
	function getRow(text){
		return Ti.UI.createTableViewRow({
			height   : Theme.Info.RowHeight,
			hasChild : true,
			color    : Theme.Info.TextColor,
			title    : " " + text,
			selectedBackgroundColor : Theme.Info.SelectedBackgroundColor,
		});
	}

	/*
	 * Create info table
	 * 
	 * @return {Object} returns info table object
	 */
	function buildInfoTable(){
		var arrLength   = Config.INFO_SCREENS.length,
			table       = getTable(),
			rows        = [],
			tableHeight = Ti.UI.SIZE;

		for(var i=0; i<arrLength; i++){
			rows.push( getRow(Config.INFO_SCREENS[i].TITLE) );
		}
		
		table.height = tableHeight;
		table.setData(rows);

		return table;
	}

	/*
	 * Create version label
	 */
	function getVersionLabel(){
		return Ti.UI.createLabel({
			text         : L("version") + " " + Ti.App.version,
			top          : 20,
			height       : Theme.Info.VersionTextHeight,
			width        : Ti.UI.FILL,
			color        : Theme.Info.VersionTextColor,
			textAlign    : "center",
			shadowColor  : Theme.Info.VersionTextShadowColor,
			shadowOffset : Theme.Info.VersionTextShadowOffset,
			font         : {
				fontSize   : Theme.Info.VersionTextFontSize,
				fontWeight : Theme.Info.VersionTextFontWeight
			}
		});
	}

	/*
	 * Launch info screen webview
	 *
	 * @param {Number} index: the table row index
	 */
	function launchInfoWebView(index){
		Ti.App.fireEvent(
			"APP:SHOW_INFO_VIEW",
			{ "title" : Config.INFO_SCREENS[index].TITLE, "url" : Config.INFO_SCREENS[index].URL }
		);
	}

	return Window;
};

module.exports = InfoWindow;