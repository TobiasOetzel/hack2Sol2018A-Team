sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function(Controller) {
	"use strict";
	return Controller.extend("com.sap.lys.controller.App", {
		onShowWorkItems: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Workitems");
		}
	});
});