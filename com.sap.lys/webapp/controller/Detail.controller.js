sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"], function(Controller, History) {
	"use strict";
	return Controller.extend("com.sap.lys.controller.Detail", {
		
		onNavBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main", {}, true);
		},
		
		onReplacedPressed : function(oEvent){
			var oItem = oEvent.getSource();
			var oCtx  = oItem.getBindingContext();
			var thingId =  oCtx.getProperty("ThingId");
			$.get("/api/bulb/change/"+thingId);
		},
		
		handleNavigationWithContext: function() {
			var that = this;
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
					parameters : {expand:'HierarchyElements, DYN_ENT_hack2sol_team0_hack2sol_ateam__bulbState, DYN_ENT_hack2sol_team0_hack2sol_ateam__bulbMetaData'},
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
					oRouter.getRoute(sRouteName).attachMatched(_onRouteMatched, that);
				}
			}
		},
		onInit: function() {
			this.handleNavigationWithContext();
		}
	});
});