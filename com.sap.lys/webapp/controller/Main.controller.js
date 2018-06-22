sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"], function(Controller, History) {
	"use strict";
	var timer;

	return Controller.extend("com.sap.lys.controller.Main", {
		
		onInit: function() {
			var thingList = this.getView().byId("thingList");
			setTimeout(function(){
				var thingListBinding = thingList.getBinding("items");
				
				timer= window.setInterval(function(){
					thingListBinding.refresh(true);
				}, 1000);
			},5000);
			//oCtx = oItem.getBindingContext();
		},
		
		onExit: function() {
			clearInterval(timer);
		},
		
		onNavBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Launcher", {}, true);
		},
		
		
		onListItemPressed : function(oEvent){
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			this.getOwnerComponent().getRouter().navTo("Detail_binded",{
				ThingId : oCtx.getProperty("ThingId")
			});
		},
		
		/**
		 *@memberOf com.sap.lys.controller.Main
		 */
		action: function(oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function(oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function(prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		}
	});
});