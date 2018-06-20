sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function(Controller) {
	"use strict";
	return Controller.extend("com.sap.lys.controller.App", {
		
				/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.sap.lys.view.SensorDetailView
		 */
		onAfterRendering: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Overview");
		},
	});
});