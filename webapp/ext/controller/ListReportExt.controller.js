sap.ui.controller("createscccr.ext.controller.ListReportExt", {
    onInit: function () {
      sap.ui
        .getCore()
        .getConfiguration()
        .getFormatSettings()
        .setLegacyDateFormat(3);
      this._checkIsStoreAssigned();
      this.getView().byId("createscccr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--template::Share").setVisible(false);
//comment
      this.getView().byId("createscccr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--listReport").setSmartVariant();      
      this.getView().byId("createscccr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--listReportFilter").setPersistencyKey(true);
    },
    _checkIsStoreAssigned: function () {
      var that = this;
      var oModel = this.getOwnerComponent().getModel();
      oModel.read("/SCCHeader", {
        success: function (oData, response) {
          var storeHeaderText =
            "SCC Name :" +
            " " +
            oData.results[0].Name +
            "\n" +
            oData.results[0].AddressLine_1 +
            ((oData.results[0].AddressLine_2 !== '') ? ", " : "")
            +
            oData.results[0].AddressLine_2 +
            "\n" +
            oData.results[0].City +
            ", " +
            oData.results[0].State +
            ", " +
            oData.results[0].ZipCode +
            ", " +
            oData.results[0].Country;
          var assignSCCHeaderModel = new sap.ui.model.json.JSONModel({
            pageTitle: storeHeaderText,
          });
  
          that.getView().setModel(assignSCCHeaderModel, "assignSCCHeaderModel");
  
          that
            .getView()
            .byId(
              "createscccr::sap.suite.ui.generic.template.ListReport.view.ListReport::GetInvoiceHdr--template:::ListReportPage:::DynamicPageTitle"
            )
            .getHeading()
            .setProperty("wrapping", true);
        },
  
        error: function (oError) {
          sap.m.MessageBox.alert("Techincal Error Occured - SCCHeader Header");
        },
      });
    },
    onPressCRlist: function (oEvt) {
      this.InvoiceNo = oEvt
        .getSource()
        .getBindingContext()
        .getObject().PsplInvoice;
  
      if (!this._ListNoofCRsDialog) {
        this._ListNoofCRsDialog = sap.ui.xmlfragment(
          "createscccr.ext.fragments.ListNoofCR",
          this
        );
        this.getView().addDependent(this._ListNoofCRsDialog);
      }
      this._ListNoofCRsDialog.open();
      var sDialog = sap.ui.getCore().byId("NoofCRPopup");
      sDialog.setTitle("Selected Invoice No" + " " + this.InvoiceNo);
    },
    onNooFCRClose: function () {
      this._ListNoofCRsDialog.close();
    },
    onNoofCRNavigate: function (oEvent) {
      if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
        var oCrossAppNav = sap.ushell.Container.getService(
          "CrossApplicationNavigation"
        );
        oCrossAppNav.toExternal({
          target: { semanticObject: "scccrmanagement", action: "manage" },
          params: { PsplInvoice: [this.InvoiceNo] },
        });
      }
    },
   /* onListNavigationExtension: function (oEvent) {
      this.oNavigationController = this.extensionAPI.getNavigationController();
      var oBindingContext = oEvent.getSource().getBindingContext();
      var oObject = oBindingContext.getObject();
      var that = this;
      if (oObject.NOOFCR !== "") {
        sap.m.MessageBox.warning(
          "They are " +
            oObject.NOOFCR +
            "CR's already eixst would you like to create a New CR's",
          {
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            onClose: function (sAction) {
              if (sAction === "OK") {
                return false;
              } else {
                return true;
              }
            }
  
          }
        );
  
        return false;
      }
      // for notebooks we trigger external navigation for all others we use internal navigation
      /* if (oObject.ProductCategory == "Notebooks") {
          oNavigationController.navigateExternal("EPMProductManageSt");
       } else {
          // return false to trigger the default internal navigation
          return false;
       }
       // return true is necessary to prevent further default navigation
       return true;
    },  */
  });
  