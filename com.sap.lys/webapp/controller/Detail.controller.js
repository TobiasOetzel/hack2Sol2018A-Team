sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"], function(Controller, History) {
	"use strict";
	return Controller.extend("com.sap.lys.controller.Detail", {
		
		onNavBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main", {}, true);
		},
		
		handleNavigationWithContext: function() {
			var that = this;
			var entitySet;
			var sRouteName;

			function _onBindingChange(oEvent) {
				// No data for the binding
				if (!that.getView().getBindingContext()) {
					//Need to insert default fallback route to load when requested route is not found.
					that.getOwnerComponent().getRouter().getTargets().display("");
				}
			}

			function _onRouteMatched(oEvent) {
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				oView = that.getView();
				oView.bindElement({
					path:   "/Things(ThingId='" + oArgs.ThingId + "')",
					events: {
						change: _onBindingChange.bind(that),
						dataRequested: function() {
							oView.setBusy(true);
						},
						dataReceived: function() {
							oView.setBusy(false);
						}
					}
				});
			}
			if (that.getOwnerComponent().getRouter) {
				var oRouter = that.getOwnerComponent().getRouter();
				var oManifest = this.getOwnerComponent().getMetadata().getManifest();
				var content = that.getView().getContent();
				if (content) {
					var oNavigation = oManifest["sap.ui5"].routing.additionalData;
					var oContext = oNavigation[that.getView().getViewName()];
					sRouteName = oContext.routeName;
					entitySet = oContext.entitySet;
					oRouter.getRoute(sRouteName).attachMatched(_onRouteMatched, that);
				}
			}
		},
		onInit: function() {
			this.handleNavigationWithContext();
		}
	});
});