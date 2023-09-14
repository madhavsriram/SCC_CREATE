sap.ui.define(
    [
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "createscccr/ext/model/formatter",
      "sap/ui/core/ValueState",
      "sap/m/Dialog",
      "sap/m/DialogType",
      "sap/m/Button",
      "sap/m/ButtonType",
      "sap/m/Text",
      "sap/ui/core/routing/History",
    ],
    function (
      JSONModel,
      Filter,
      FilterOperator,
      formatter,
      ValueState,
      Dialog,
      DialogType,
      Button,
      ButtonType,
      Text,
      History
    ) {
      "use strict";
      var pressDialog;
      var damage;
      var mediaType;
      var fileName;
      var size;
      var data;
      var removedFileShortage = [];
      var uploadedFileShortage = [];
      var removedFileDamage = [];
      var removedFileQuality = [];
      var uploadedFileDamage = [];
      var uploadedFileQuality = [];
      var CRNo;
      var path = {};
      var crqty;
      var critm;
      var arr = [];
      var oAttachmentsModel, oAttachmentsModel1,oAttachmentsModel2, invoicedata;
      var Deliveryfeeitem;
      var PageThis;
      var gMaterial,
        selProduct,
        itemdata,
        deleteID,
        submitID,
        bTPCRItem,
        attachmentPIssue,
        icondata,
        Attachmentid,
        oAttachmentUpl,
        oAttachmentUpl1,
        oAttachmentUpl2,
        crItemCount,
        NsComment,
        sTotalOpenQty,
        CRopenqty;
      return {
        formatter: formatter,
        onInit: function () {
          this.extensionAPI.attachPageDataLoaded(
            function (oEvent) {
                PageThis=this;
              CRNo = this.getView().byId(
                "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
              ).mProperties.value;
              this.getView()
                .byId(
                  "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::Table"
                )
                .setUseExportToExcel();
                this.getView().byId("createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--template::Share").setVisible(false);
              var oFilterR = new sap.ui.model.Filter();
              var oModel = this.getOwnerComponent().getModel();
              if (CRNo === null) {
                // this.getView().byId("delbtnButton").setVisible(true);
                // this.getView().byId("revertBtnButton").setVisible(false);
                if (
                    this.getView().byId(
                      "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DeliveryFeeCreated::Field"
                    ).mProperties.value === "Y"
                  ) {
                // Begin of changes done by Bala on 3rd July 2023
                    this.getView().byId("delbtnButton").setVisible(false);
                    this.getView().byId("revertBtnButton").setVisible(false);    
                // End of changes done by Bala on 3rd July 2023        
                    }else{
                    this.getView().byId("delbtnButton").setVisible(false);
                    this.getView().byId("revertBtnButton").setVisible(false);        
                    }
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var PsId = this.getView().byId(
                  "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::SCCDesc::Field"
                ).mProperties.value;
                var oFilterR = new sap.ui.model.Filter({
                  filters: [new sap.ui.model.Filter("PsId", "EQ", PsId)],
                });
                oModel.read("/SCCRegion", {
                  filters: [oFilterR],
                  success: function (oResponse) {
                    if (oResponse.results.length > 0) {
                      that.SCCID = oResponse.results[0].Id;
                      that.RegionIdID = oResponse.results[0].RegionId;
                      // Begin of Bala on 31st May 2023
                      that.oIsSap = oResponse.results[0].ISSAP ;
                      // End of Bala on 31st May 2023
                    }
                  },
                  error: function (err) {},
                });
              } else if (
                this.getView().byId(
                  "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DeliveryFeeCreated::Field"
                ).mProperties.value === "Y"
              ) {
                this.getView().byId("delbtnButton").setVisible(false);
                oFilterR = new sap.ui.model.Filter({
                  filters: [
                    new sap.ui.model.Filter("BTPCRNo_BTPCRNO", "EQ", CRNo),
                    new sap.ui.model.Filter("ItemType", "EQ", "D"),
                    new sap.ui.model.Filter("StatusCode_Id", "NE", 10),
                  ],
                  and: true,
                });
                var that = this;
                oModel.read("/CreditReqItem", {
                  filters: [oFilterR],
                  success: function (oResponse) {
                    if (oResponse.results.length > 0) {
                      that.getView().setModel(
                        {
                          items: oResponse.results[0],
                        },
                        "Deliveryfeeitem"
                      );
                      that.getView().byId("revertBtnButton").setVisible(true);
                    } else {
                      that.getView().byId("revertBtnButton").setVisible(false);
                    }
                  }.bind(that),
                  error: function (err) {},
                });
              } else {
                this.getView().byId("delbtnButton").setVisible(true);
                this.getView().byId("revertBtnButton").setVisible(false);
              }
              if (CRNo != undefined) {
                oFilterR = [];
                var rowIDData = new Filter("RowId", FilterOperator.EQ, 0);
                var cRNoData = new Filter(
                  "CRNO_BTPCRNO",
                  FilterOperator.EQ,
                  CRNo
                );
                oFilterR.push(rowIDData, cRNoData);
                var path = "/CRCommit?$count";
                var that = this;
                oModel.read(path, {
                  filters: oFilterR,
                  success: function (oData) {
                    if (oData.results.length > 0) {
                      sap.ui
                        .getCore()
                        .byId(
                          "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton2"
                        )
                        .setType("Emphasized");
                    } else {
                      sap.ui
                        .getCore()
                        .byId(
                          "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton2"
                        )
                        .setType("Default");
                    }
                  },
                  error: function (error) {},
                });
              } else {
                sap.ui
                  .getCore()
                  .byId(
                    "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton2"
                  )
                  .setType("Default");
              }
               //swaraj added to validate delivery credit 
          var oModel = this.getOwnerComponent().getModel();
          var oFilterR = new sap.ui.model.Filter({
             filters: [
               new sap.ui.model.Filter("ItemNo", "EQ", "DC"),
              // new sap.ui.model.Filter("ItemType", "EQ", "D"),
              new sap.ui.model.Filter("PsplInvoice_PsplInvoice", "EQ", this.getView().byId("createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac2::PsplInvoice::Field").mProperties.value),
               new sap.ui.model.Filter("SalesOrderNo", "EQ", this.getView().byId("createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac2::SalesOrderNo::Field").mProperties.value),
             ],
             and: true,
           });
           var that = this;
           oModel.read("/GetInvoiceItems", {
             filters: [oFilterR],
             success: function (oResponse) {
               if (oResponse.results.length > 0) {
                
                 
               } else {
                 if(this.getView().byId("createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DeliveryFeeCreated::Field").mProperties.value === "N" || this.getView().byId("createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DeliveryFeeCreated::Field").mProperties.value === ""){
                   this.getView().byId("delbtnButton").setVisible(false);
                 }
               }
               if (oResponse.results.length === 0) {
                     
                this.getView().byId("delbtnButton").setVisible(false);
              }
              // Begin of changes done by  Bala on 3rd July 2023
              for (let index = 0; index <oResponse.results.length; index++) {
                // Begin of changes done by  Bala on 19th July 2023
                if(oResponse.results[index].ItemNo == 'DC' && oResponse.results[0].OpenQty > 0 ){
                   // End of changes done by Bala on 19th July 2023
                  this.getView().byId("delbtnButton").setVisible(true);
                }               
              }
              // End of changes done by Bala on 3rd July 2023

             }.bind(that),
             error: function (err) {},
           });
            }.bind(this)
          );
         
          // The below function will get called for every binding change
          var Deliveryfeeitem = new sap.ui.model.json.JSONModel();
          this.getOwnerComponent().setModel(Deliveryfeeitem, "Deliveryfeeitem");
          this.getOwnerComponent().setModel(
            oAttachmentsModel,
            "oAttachmentsModel"
          );
          this.getOwnerComponent().setModel(
            oAttachmentsModel1,
            "oAttachmentsModel1"
          );
          this.getOwnerComponent().setModel(
            oAttachmentsModel2,
            "oAttachmentsModel2"
          );
          oAttachmentsModel = new sap.ui.model.json.JSONModel();
          this.getOwnerComponent().setModel(
            oAttachmentsModel,
            "oAttachmentsModel"
          );
          oAttachmentsModel1 = new sap.ui.model.json.JSONModel();
          this.getOwnerComponent().setModel(
            oAttachmentsModel1,
            "oAttachmentsModel1"
          );
          oAttachmentsModel2 = new sap.ui.model.json.JSONModel();
          this.getOwnerComponent().setModel(
            oAttachmentsModel2,
            "oAttachmentsModel2"
          );
          var productIssueModel = new JSONModel();
          this.getOwnerComponent().setModel(
            productIssueModel,
            "productIssueModel"
          );
          var headerCommentsModel = new JSONModel();
          this.getOwnerComponent().setModel(
            headerCommentsModel,
            "headerCommentsModel" 
          );
          var itemCommentsModel = new JSONModel();
          this.getOwnerComponent().setModel(
            itemCommentsModel,
            "itemCommentsModel"
          );
          var data = {
            ProductName: "",
            ProductIssue: [],
            UseByDate: null,
            JulianDate: null,
            QLotCode: "",
            ManufactureDate: null,
            ExpirationDate: null,
            BestBeforeDate: null,
          };
          var qualityModel = new JSONModel(data);
          this.getOwnerComponent().setModel(qualityModel, "qualityModel");
  
          var data = {
            crNo: "",
          };
          var uniModel = new JSONModel(data);
          this.getOwnerComponent().setModel(uniModel, "uniModel");
  
          this.getOwnerComponent()
            .getRouter()
            .attachRouteMatched(this._onRouteMatched, this);
          this.extensionAPI.attachPageDataLoaded(
            function (oEvent) {
              //  this._read();
              var invoicepath = oEvent.context.sPath;
              invoicedata = this.getView().getModel().getProperty(invoicepath);
            }.bind(this)
          );
        },
        onAfterRendering: function() {
          var oModl = this.getView().getModel();
        },
  
        _onRouteMatched: function (oEvent) {
          if (oEvent.getParameter("name") === "PSInvoiceHdrquery") {
            this.itemComments = "";
            this.headComments = "";
          }

        

        },
  
        onHeaderCommentPost: function (evt) {
          CRNo = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
          ).mProperties.value;
          var oDataModel = this.getView().getModel(),
            Path = "/CRCommit",
            commentText = sap.ui.getCore().byId("idHeaderCTA").getValue(),
            that = this,
            obj = {
              CRNO_BTPCRNO: CRNo,
              CRNO_OrgStrucEleCode_Id: 1,
              RowId: 0,
              Comment: commentText,
            };
          oDataModel.create(Path, obj, {
            method: "POST",
            success: function (oData) {
              sap.ui.getCore().byId("idHeaderCTA").setValue("");
              sap.ui
                .getCore()
                .byId(
                  "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton2"
                )
                .setType("Emphasized");
              that
                .getOwnerComponent()
                .getModel("headerCommentsModel")
                .updateBindings(true);
              that.getOwnerComponent().getModel("headerCommentsModel").refresh();
              that.openHeaderComments();
            },
            error: function (Error) {
              var errorMsg = JSON.parse(Error.responseText).error.message.value;
              sap.m.MessageBox.error(errorMsg);
            },
          });
        },
  
        openHeaderComments: function (evt) {
          CRNo = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
          ).mProperties.value;
          if (CRNo === undefined || CRNo === null) {
            sap.m.MessageToast.show("Credit Request Number Has Not Been Created");
          } else {
            var oDataModel = this.getView().getModel(),
              uFilters = [];
            var rowIDData = new Filter("RowId", FilterOperator.EQ, 0);
            var cRNoData = new Filter("CRNO_BTPCRNO", FilterOperator.EQ, CRNo);
            uFilters.push(rowIDData, cRNoData);
            var path = "/CRCommit";
            var that = this;
            oDataModel.read(path, {
              filters: uFilters,
              success: function (oData) {
                that
                  .getOwnerComponent()
                  .getModel("headerCommentsModel")
                  .setProperty("/", oData);
                that.openHeaderDialog();
                var saveButtonId = sap.ui.getCore().byId("sendHeader");
                saveButtonId.setEnabled(false);
              },
              error: function (error) {},
            });
          }
        },
  
        liveChangeHeader: function (evt) {
          var enteredText = evt.getParameter("value");
          var saveButtonId = sap.ui.getCore().byId("sendHeader");
          if (enteredText === "") {
            saveButtonId.setEnabled(false);
          } else {
            saveButtonId.setEnabled(true);
          }
        },
  
        openItemComments: function (evt) {
          if (evt !== undefined) {
            if (evt.getSource().getBindingContext().getObject().ItemNo === "DC" ||
                evt.getSource().getBindingContext().getObject().ItemNo === "CDF") {
              return;
            }
            if (
              evt.getSource().getBindingContext().getObject().CRQty ===
                undefined ||
              evt.getSource().getBindingContext().getObject().CRQty === "" ||
              evt.getSource().getBindingContext().getObject().CRQty === null
            ) {
              sap.m.MessageToast.show("Credit Request Item Has Not Been Created");
              return;
            }
            var material = evt.getSource().getBindingContext().getObject().ItemNo;
          } else {
            var material = gMaterial;
          }
          gMaterial = material;
          var oDataModel = this.getView().getModel();
          CRNo = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
          ).mProperties.value;
          var BTCRNO = new sap.ui.model.Filter({
            path: "BTPCRNo_BTPCRNO",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: CRNo,
          });
          var Description = new sap.ui.model.Filter({
            path: "Material",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: material,
          });
          var StatusCode = new sap.ui.model.Filter({
            path: "StatusCode_Id",
            operator: sap.ui.model.FilterOperator.NE,
            value1: 10,
          });
          var oFilter = new Array();
          oFilter.push(BTCRNO);
          oFilter.push(Description);
          oFilter.push(StatusCode);
  
          var path = "/CreditReqItem";
          var that = this;
          oDataModel.read(path, {
            filters: oFilter,
            urlParameters: {
              $expand: "CRCommit",
            },
            success: function (oData) {
              if (oData.results.length > 0) {
                that
                  .getOwnerComponent()
                  .getModel("itemCommentsModel")
                  .setProperty("/", oData.results[0].CRCommit);
              } else {
                that
                  .getOwnerComponent()
                  .getModel("itemCommentsModel")
                  .setProperty("/");
              }
              that.CreditReqItem_BTPCRItem = oData.results[0].BTPCRItem;
              that.openItemCommentPopup();
              var saveButtonId = sap.ui.getCore().byId("sendItem");
              saveButtonId.setEnabled(false);
            },
            error: function (error) {},
          });
        },
  
        onHeaderCommentsClose: function () {
          this._headerCommentsDialog.close();
        },
  
        openHeaderDialog: function () {
          if (!this._headerCommentsDialog) {
            this._headerCommentsDialog = sap.ui.xmlfragment(
              "createscccr.ext.fragments.HeaderComments",
              this
            );
  
            this.getView().addDependent(this._headerCommentsDialog);
          }
          this._headerCommentsDialog.open();
        },
  
        liveChangeItem: function (evt) {
          var enteredText = evt.getParameter("value");
          var saveButtonId = sap.ui.getCore().byId("sendItem");
          if (enteredText === "") {
            saveButtonId.setEnabled(false);
          } else {
            saveButtonId.setEnabled(true);
          }
        },
  
        onSubmit: function (oEvent) {
          this._itemCRCount();
        },
  
        _itemCRCount: function () {
          CRNo = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
          ).mProperties.value;
  
          var oDataModel = this.getView().getModel(),
            Path = "/CreditReqItem";
          var uFilters = [];
          var BTPCRNo_BTPCRNOData = new Filter(
            "BTPCRNo_BTPCRNO",
            FilterOperator.EQ,
            CRNo
          );
          var StatusCodeData = new Filter("StatusCode_Id", FilterOperator.NE, 10);
          uFilters.push(BTPCRNo_BTPCRNOData, StatusCodeData);
          var that = this;
          oDataModel.read(Path, {
            filters: uFilters,
            success: function (oData) {
              crItemCount = oData.results;
              CRNo = that
                .getView()
                .byId(
                  "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                ).mProperties.value;
              if (CRNo === undefined || CRNo === null) {
                sap.m.MessageToast.show(
                  "Credit Request Number Has Not Been Created"
                );
              } else {
                if (crItemCount.length > 0) {
                //   that.onWarningSubmitPress();
                //submit for sap
                  that._finalSubmit();
                } else {
                  sap.m.MessageBox.warning("No Items for the Credit Request");
                }
              }
            },
            error: function (Error) {
              var errorMsg = JSON.parse(Error.responseText).error.message.value;
              sap.m.MessageBox.error(errorMsg);
            },
          });
        },
  
        // onWarningSubmitPress: function () {
        //   if (!this.oWarningSubmitDialog) {
        //     this.oWarningSubmitDialog = new Dialog({
        //       type: DialogType.Message,
        //       title: "Warning",
        //       state: ValueState.Warning,
        //       content: new Text({ text: "Do you want to submit?" }),
        //       beginButton: new Button({
        //         type: ButtonType.Emphasized,
        //         text: "Yes",
        //         press: function () {
        //           this.oWarningSubmitDialog.close();
        //           this._finalSubmit();
        //         }.bind(this),
        //       }),
        //       endButton: new Button({
        //         type: ButtonType.Default,
        //         text: "No",
        //         press: function () {
        //           this.oWarningSubmitDialog.close();
        //         }.bind(this),
        //       }),
        //     });
        //   }
  
        //   this.oWarningSubmitDialog.open();
        // },

//==================================
//Consultant/Developer - Sheshnath agrahari
//Comment - Modification of Submission Date Time format
//==================================
  
        _finalSubmit: function () {
          var oDataModel = this.getView().getModel(),
            that = this;
            // var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

            //     pattern: "yyyy-MM-dd" + "T" + "HH:mm:ss" + "Z"

            // });

            // var DateTime = oDateFormat.format(new Date());
          oDataModel.callFunction("/UpdateStatus", {
            method: "POST",
            //urlParameters: { BTPCRNO: CRNo, SubmissionDateTime: DateTime  },
            urlParameters: { BTPCRNO: CRNo, SubmissionDateTime: new Date()  },
            success: function (oData) {
              that.extensionAPI.refresh(); 
              sap.m.MessageBox.success(
                "Credit Request : " + CRNo + " Submitted Successfully",
                {
                  actions: [sap.m.MessageBox.Action.OK],
                  onClose: function (sAction) {
                    //  MessageToast.show("Action selected: " + sAction);
                    if (sAction == "OK") {
                      window.history.go(-1);
                    }
                  },
                }
              );
              that
                .getView()
                .byId(
                  "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton"
                )
                .setEnabled(false);
            },
            error: function (Error) {
              var errorMsg = JSON.parse(Error.responseText).error.message.value;
              sap.m.MessageBox.error(errorMsg);
            },
          });
        }, 
        onBeforeRebindTableExtension: function (oEvent) {
            this._table = oEvent.getSource().getTable();
          },
        onWarningDeletePress: function () {
            var cr_qty=sap.ui.getCore().byId("createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable").getSelectedItem()
            .getBindingContext().getObject().CRQty;

                var cr_type=sap.ui.getCore().byId( "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable")
   .getSelectedItem().getBindingContext().getObject().CRTypeDesc;

                if(cr_qty==null || cr_type==null){

                            sap.m.MessageBox.warning("No CR data available for deletion");  
                            this._table.removeSelections();
                            this.getView().byId("createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--REPLACE_WITH_ACTION_IDButton").setEnabled(false);


                        return;

                }
          if (!this.oWarningMessageDialog) {
           
            this.oWarningMessageDialog = new Dialog({
              type: DialogType.Message,
              title: "Warning",
              state: ValueState.Warning,
              content: new Text({
                text: "Do you want to delete?",
              }),
              beginButton: new Button({
                type: ButtonType.Emphasized,
                text: "Yes",
                press: function () {
                  this.oWarningMessageDialog.close();
                  this.onDelete();
                }.bind(this),
              }),
              endButton: new Button({
                type: ButtonType.Default,
                text: "No",
                press: function () {
                  this.oWarningMessageDialog.close();
                }.bind(this),
              }),
            });
          }
          this.oWarningMessageDialog.open();
        },
  
        onDelete: function () {
          CRNo = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
          ).mProperties.value;
          var item = sap.ui
            .getCore()
            .byId(
              "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable"
            )
            .getSelectedItem()
            .getBindingContext()
            .getObject().ItemNo;
           
          var oDataModel = this.getView().getModel(),
            Path = "/CreditReqItem";
          var uFilters = [];
          var BTPCRNo_BTPCRNOData = new Filter(
            "BTPCRNo_BTPCRNO",
            FilterOperator.EQ,
            CRNo
          );
          var materialData = new Filter("Material", FilterOperator.EQ, item);
          uFilters.push(BTPCRNo_BTPCRNOData, materialData);
          var that = this;
          oDataModel.read(Path, {
            filters: uFilters,
            success: function (oData) {
              bTPCRItem = oData.results[0].BTPCRItem;
              that._crStatusDelete(item);
            },
            error: function (Error) {
              var errorMsg = JSON.parse(Error.responseText).error.message.value;
              sap.m.MessageBox.error(errorMsg);
            },
          });
        },
  
        _crStatusDelete: function (item) {
          var masters = this.getView().getModel("store"),
            that = this,
            del = "Delete",
            uFilters = [];
          var delState = new Filter("StatusDescription", FilterOperator.EQ, del);
          uFilters.push(delState);
          var path = "/CRStatus";
          masters.read(path, {
            filters: uFilters,
            success: function (oData) {
              deleteID = oData.results[0].Id;
              that._deleteBTPCRItem(item);
            },
            error: function (error) {},
          });
        },
  
        _deleteBTPCRItem: function (item) {
          var oDataModel = this.getView().getModel(),
            Path = "/CreditReqItem" + "(" + bTPCRItem + ")";
          var that = this,
            obj = {
              StatusCode_Id: 10,
            };
          oDataModel.update(Path, obj, {
            success: function (oData) {
                if(item=="DC"){
                that.updateDeleteItemDeliveryFee();
                return;
                }
              that.extensionAPI.refresh();
            },
            error: function (Error) {
              var errorMsg = JSON.parse(Error.responseText).error.message.value;
              sap.m.MessageBox.error(errorMsg);
            },
          });
        },
  
        openItemCommentPopup: function () {
          CRNo = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
          ).mProperties.value;
          if (CRNo === undefined || CRNo === null) {
            sap.m.MessageToast.show("Credit Request Number Has Not Been created");
          } else {
            if (!this._itemCommentsDialog) {
              this._itemCommentsDialog = sap.ui.xmlfragment(
                "createscccr.ext.fragments.ItemComments",
                this
              );
              this.getView().addDependent(this._itemCommentsDialog);
            }
            this._itemCommentsDialog.open();
          }
        },
  
        // Posting Item Comments
        onItemsCommentPost: function (evt) {
          var material = gMaterial;
          var oDataModel = this.getView().getModel();
          var Path = "/CRCommit",
            //   commentText = evt.getSource().getValue(),
            commentText = sap.ui.getCore().byId("idItemCTA").getValue(),
            that = this,
            obj = {
              CRNO_BTPCRNO: CRNo,
              CRNO_OrgStrucEleCode_Id: 1,
              Material: material,
              Comment: commentText,
              CreditReqItem_BTPCRItem: that.CreditReqItem_BTPCRItem,
            };
          oDataModel.create(Path, obj, {
            method: "POST",
            success: function (oData) {
              sap.ui.getCore().byId("idItemCTA").setValue("");
              that
                .getOwnerComponent()
                .getModel("itemCommentsModel")
                .updateBindings(true);
              that.getOwnerComponent().getModel("itemCommentsModel").refresh();
              that.extensionAPI.refresh();
              that.openItemComments();
            },
            error: function (Error) {
              var errorMsg = JSON.parse(Error.responseText).error.message.value;
              sap.m.MessageBox.error(errorMsg);
            },
          });
        },
  
        onItemsCommentsClose: function () {
          this._itemCommentsDialog.close();
        },
  
        onAddIcon: function (oEvent) {
          if (oEvent.getSource().getBindingContext().getObject().ItemNo === "DC" ||
            oEvent.getSource().getBindingContext().getObject().ItemNo === "CDF" ) {
            // this.spath = oEvent.getSource().getParent().getBindingContextPath();
            // this.onItemDeliveryCreate();
            return;
          }
          CRNo = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
          ).mProperties.value;
          var PsplInvoice = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac2::PsplInvoice::Field"
          ).mProperties.value;
          var itemMat = oEvent.getSource().getBindingContext().getObject().ItemNo;
          var that = this;
          that.item = itemMat;
          this.spath = oEvent.getSource().getParent().getBindingContextPath();
          this.oModel = this.getView().getModel();
  
          var sQty = oEvent.getSource().getBindingContext().getObject().CRQty;
          var sOpenQty = oEvent.getSource().getBindingContext().getObject()
            .OpenQty;
          sTotalOpenQty = sQty + sOpenQty;
  
          var creditQty = this.getView().getModel().getProperty(this.spath).CRQty;
          if (creditQty == 0 || creditQty == "" || creditQty == undefined) {
            var itemFilters = [];
            var PsplInvoiceData = new Filter(
              "PsplInvoice",
              FilterOperator.EQ,
              PsplInvoice
            );
            var matData = new Filter("Material", FilterOperator.EQ, itemMat);
  
            itemFilters.push(PsplInvoiceData, matData);
            this.oModel.read("/MaterialValidation?$count", {
              filters: [itemFilters],
              success: function (oData) {
                if (oData.results.length > 0) {
                  // that.iconDialog = "X";
                  sap.m.MessageBox.information(
                    "Credit(s) exists for same item; review for duplicates.  Do you wish to proceed?",
                    {
                      actions: [
                        sap.m.MessageBox.Action.OK,
                        sap.m.MessageBox.Action.CANCEL,
                      ],
                      onClose: function (sAction) {
                        if (sAction == "OK") {
                          that.OnItemDetails(oEvent);
                        } else {
                          //pressDialog.close();
                        }
                      },
                    }
                  );
                } else {
                  that.OnItemDetails(oEvent);
                }
              },
              error: function (e) {},
            });
          } else {
            that.OnItemDetails(oEvent);
          }
        },
  
        OnItemDetails: function (oEvent) {
          CRNo = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
          ).mProperties.value;
          var that = this;
          this.oModel = this.getView().getModel();
          this.oModel.setUseBatch(false);
          var pathdata = this.getView().getModel().getProperty(this.spath);
          var productType = pathdata.ProductType;
          var productTypeFilter = new sap.ui.model.Filter({
            path: "Desc",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: productType,
          });
          var oFilter = new Array();
          oFilter.push(productTypeFilter);
          if (productType != null) {
            that.oModel.read("/ProductName", {
              filters: [oFilter],
              success: function (oData) {
                if (oData.results.length != 0) {
                  that.oModel.read(
                    "/ProductName" +
                      "(" +
                      oData.results[0].Id +
                      ")/" +
                      "ProductIssue",
                    {
                      success: function (oData) {
                        that
                          .getOwnerComponent()
                          .getModel("productIssueModel")
                          .setProperty("/", oData.results);
                      },
                      error: function (e) {},
                    }
                  );
                }
              },
              error: function (e) {},
            });
          }
          pressDialog = sap.ui.getCore().byId("ListDialog");
          if (!pressDialog) {
            pressDialog = sap.ui.xmlfragment(
              "createscccr.ext.fragments.IconDialog",
              this
            );
            this.getView().addDependent(pressDialog);
            sap.ui.getCore().byId("ProductName").setValue(productType);
            sap.ui.getCore().byId("openqty").setText(sTotalOpenQty);
            oAttachmentUpl = sap.ui.getCore().byId("attachmentUpl");
            oAttachmentUpl1 = sap.ui.getCore().byId("attachmentUpl1");
            oAttachmentUpl2 = sap.ui.getCore().byId("attachmentUpl2");
            if (CRNo == undefined) {
              var crqty = sap.ui.getCore().byId("idstep").getValue();
              var oQty = parseInt(pathdata.Qty);
              if (crqty == 0) {
                sap.ui.getCore().byId("idcbox").setEnabled(false);
                sap.ui.getCore().byId("Idsave").setEnabled(false);
                sap.ui.getCore().byId("idstep").setMin(0);
              } else {
                sap.ui.getCore().byId("idcbox").setEnabled(true);
                sap.ui.getCore().byId("Idsave").setEnabled(true);
              }
              sap.ui.getCore().byId("idstep").setValue(0);
              sap.ui.getCore().byId("idstep").setMax(oQty);
              sap.ui.getCore().byId("idstep").setMin(0);
            } else {
              var BTCRNO = new sap.ui.model.Filter({
                path: "BTPCRNo_BTPCRNO",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: CRNo,
              });
              var Description = new sap.ui.model.Filter({
                path: "Material",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: pathdata.ItemNo,
              });
              var StatusCode = new sap.ui.model.Filter({
                path: "StatusCode_Id",
                operator: sap.ui.model.FilterOperator.NE,
                value1: deleteID,
              });
              var oFilter = new Array();
              oFilter.push(BTCRNO);
              oFilter.push(Description);
              oFilter.push(StatusCode);
              this.oModel.read("/CreditReqItem", {
                filters: [oFilter],
                urlParameters: {
                  $expand: "Attachment/AttachmentPIssue",
                },
                success: function (oData) {
                  icondata = oData;
                  if (oData.results.length !== 0) {
                    var t1 = [];
                    for (var i in oData.results[0].Attachment.results[0]
                      .AttachmentPIssue.results) {
                      t1.push(
                        oData.results[0].Attachment.results[0].AttachmentPIssue.results[
                          i
                        ].ProductIssueMaster_Id.toString()
                      );
                    }
                    sap.ui
                      .getCore()
                      .byId("Quality")
                      .getContent()[4]
                      .setSelectedKeys(t1);
                    Attachmentid =
                      oData.results[0].Attachment.results[0].AttachmentId;
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance(
                      {
                        pattern: "MM-dd-yyyy",
                        UTC: "true",
                      }
                    );
                    sap.ui
                      .getCore()
                      .byId("Quality")
                      .getContent()[4]
                      .setEnabled(true);
                    sap.ui
                      .getCore()
                      .byId("Quality")
                      .getContent()[6]
                      .setEnabled(true)
                      .setValue(
                        oData.results[0].Attachment.results[0].UseByDate == null
                          ? ""
                          : oDateFormat.format(
                              new Date(
                                oData.results[0].Attachment.results[0].UseByDate
                              )
                            )
                      );
                    sap.ui
                      .getCore()
                      .byId("Quality")
                      .getContent()[8]
                      .setEnabled(true)
                      .setValue(
                        oData.results[0].Attachment.results[0].JulianDate == null
                          ? ""
                          : oDateFormat.format(
                              new Date(
                                oData.results[0].Attachment.results[0].JulianDate
                              )
                            )
                      );
                    sap.ui
                      .getCore()
                      .byId("Quality")
                      .getContent()[11]
                      .setEnabled(true)
                      .setValue(oData.results[0].Attachment.results[0].LotCode);
                    sap.ui
                      .getCore()
                      .byId("Quality")
                      .getContent()[13]
                      .setEnabled(true)
                      .setValue(
                        oData.results[0].Attachment.results[0].MfgDate == null
                          ? ""
                          : oDateFormat.format(
                              new Date(
                                oData.results[0].Attachment.results[0].MfgDate
                              )
                            )
                      );
                    sap.ui
                      .getCore()
                      .byId("Quality")
                      .getContent()[15]
                      .setEnabled(true)
                      .setValue(
                        oData.results[0].Attachment.results[0].ExpirationDate ==
                          null
                          ? ""
                          : oDateFormat.format(
                              new Date(
                                oData.results[0].Attachment.results[0].ExpirationDate
                              )
                            )
                      );
                    sap.ui
                      .getCore()
                      .byId("Quality")
                      .getContent()[17]
                      .setEnabled(true)
                      .setValue(
                        oData.results[0].Attachment.results[0].BestBeforeDate ==
                          null
                          ? ""
                          : oDateFormat.format(
                              new Date(
                                oData.results[0].Attachment.results[0].BestBeforeDate
                              )
                            )
                      );
                    // sap.ui
                    //   .getCore()
                    //   .byId("idReClasi")
                    //   .setValue(
                    //     oData.results[0].Attachment.results[0].Classification
                    //   );
                      sap.ui.getCore().byId("idReClasi").setSelectedKey(oData.results[0].Attachment.results[0].Classification);
 
                    that.oModel.read(
                      "/Attachment(AttachmentId=" +
                        Attachmentid +
                        ")/AttachmentRow",
                      {
                        success: function (oData) {
                          oAttachmentsModel.setProperty("/", []);
                          oAttachmentsModel.setProperty("/", oData);
                          oAttachmentUpl
                            .setModel(oAttachmentsModel)
                            .bindAggregation(
                              "items",
                              "/results",
                              new sap.m.upload.UploadSetItem({
                                fileName: "{FileName}",
                                mediaType: "{MediaType}",
                                visibleEdit: false,
                                visibleRemove: true,
                                url: "{Url}",
                                openPressed: that.onOpenPressed,
                              })
                            );
                          oAttachmentsModel1.setProperty("/", []);
                          oAttachmentsModel1.setProperty("/", oData);
                          oAttachmentUpl1
                            .setModel(oAttachmentsModel1)
                            .bindAggregation(
                              "items",
                              "/results",
                              new sap.m.upload.UploadSetItem({
                                fileName: "{FileName}",
                                mediaType: "{MediaType}",
                                visibleEdit: false,
                                visibleRemove: true,
                                url: "{Url}",
                                openPressed: that.onOpenPressed,
                              })
                            );
                            oAttachmentsModel2.setProperty("/", []);
                            oAttachmentsModel2.setProperty("/", oData);
                            oAttachmentUpl2
                              .setModel(oAttachmentsModel2)
                              .bindAggregation(
                                "items",
                                "/results",
                                new sap.m.upload.UploadSetItem({
                                  fileName: "{FileName}",
                                  mediaType: "{MediaType}",
                                  visibleEdit: false,
                                  visibleRemove: true,
                                  url: "{Url}",
                                  openPressed: that.onOpenPressed,
                                })
                              );
                          sap.ui
                            .getCore()
                            .byId("LotCode")
                            .setValue(
                              icondata.results[0].Attachment.results[0].LotCode
                            );
                        //   sap.ui
                        //     .getCore()
                        //     .byId("coments")
                        //     .setValue(
                        //       icondata.results[0].Attachment.results[0].Comment
                        //     );
                        //   sap.ui
                        //     .getCore()
                        //     .byId("Nscomments")
                        //     .setValue(
                        //       icondata.results[0].Attachment.results[0].Comment
                        //     );
                          sap.ui
                            .getCore()
                            .byId("idstep")
                            .setValue(icondata.results[0].Qty);
                          var oQty1 = icondata.results[0].Qty;
                          var oQuantity = parseInt(pathdata.Qty);
                          sap.ui.getCore().byId("idstep").setMax(oQuantity);
                          if (
                            icondata.results[0].Attachment.results[0].ExpDate !=
                            null
                          ) {
                            var d = oDateFormat.format(
                              new Date(
                                icondata.results[0].Attachment.results[0].ExpDate
                              )
                            );
                            sap.ui.getCore().byId("Expdate").setValue(d);
                          }
                          if (
                            icondata.results[0].Attachment.results[0]
                              .DeliveryDate != null
                          ) {
                            var Deliverydate = oDateFormat.format(
                              new Date(
                                icondata.results[0].Attachment.results[0].DeliveryDate
                              )
                            );
                            sap.ui
                              .getCore()
                              .byId("DeliveryDate")
                              .setValue(Deliverydate);
                          }
                          if (icondata.results[0].CRType_Id == 1) {
                            sap.ui.getCore().byId("idcbox").setEnabled(false);
                            sap.ui.getCore().byId("idcbox").setSelectedKey(1);
                            sap.ui.getCore().byId("Damage").setVisible(true);
                            sap.ui.getCore().byId("Shortage").setVisible(false);
                            sap.ui.getCore().byId("NotShipped").setVisible(false);
                            sap.ui.getCore().byId("Quality").setVisible(false);
                            sap.ui
                              .getCore()
                              .byId("idQualityPhoto")
                              .setVisible(false);
                            sap.ui
                              .getCore()
                              .byId("idReClasiLabel")
                              .setVisible(false);
                            sap.ui.getCore().byId("idReClasi").setVisible(false);
                          } else if (icondata.results[0].CRType_Id == 2) {
                            sap.ui.getCore().byId("idcbox").setEnabled(false);
                            sap.ui.getCore().byId("idcbox").setSelectedKey(2);
                            sap.ui.getCore().byId("Damage").setVisible(false);
                            sap.ui.getCore().byId("Shortage").setVisible(true);
                            sap.ui.getCore().byId("NotShipped").setVisible(false);
                            sap.ui
                              .getCore()
                              .byId("idReClasiLabel")
                              .setVisible(false);
                            sap.ui.getCore().byId("idReClasi").setVisible(false);
                          } else if (icondata.results[0].CRType_Id == 3) {
                            sap.ui.getCore().byId("idcbox").setEnabled(false);
                            sap.ui.getCore().byId("idcbox").setSelectedKey(3);
                            sap.ui.getCore().byId("Damage").setVisible(false);
                            sap.ui.getCore().byId("Shortage").setVisible(false);
                            sap.ui.getCore().byId("NotShipped").setVisible(false);
                            sap.ui.getCore().byId("Quality").setVisible(true);
                            sap.ui
                              .getCore()
                              .byId("idQualityPhoto")
                              .setVisible(true);
                            sap.ui
                              .getCore()
                              .byId("idReClasiLabel")
                              .setVisible(true);
                            sap.ui.getCore().byId("idReClasi").setVisible(true);
                          } else if (icondata.results[0].CRType_Id == 4) {
                            sap.ui.getCore().byId("idcbox").setEnabled(false);
                            sap.ui.getCore().byId("idcbox").setSelectedKey(4);
                            sap.ui.getCore().byId("Damage").setVisible(false);
                            sap.ui.getCore().byId("Shortage").setVisible(false);
                            sap.ui.getCore().byId("NotShipped").setVisible(true);
                            sap.ui.getCore().byId("Quality").setVisible(false);
                            sap.ui
                              .getCore()
                              .byId("idQualityPhoto")
                              .setVisible(false);
                            sap.ui
                              .getCore()
                              .byId("idReClasiLabel")
                              .setVisible(false);
                            sap.ui.getCore().byId("idReClasi").setVisible(false);
                          }
                          pressDialog.open();
                        },
                        error: function (e) {},
                      }
                    );
                  } else {
                    sap.ui.getCore().byId("LotCode").setValue();
        //            sap.ui.getCore().byId("coments").setValue();
                    sap.ui.getCore().byId("idstep").setValue(0);
                    var crqty = sap.ui.getCore().byId("idstep").getValue();
                    var oQty = parseInt(pathdata.Qty);
                    if (crqty == 0) {
                      sap.ui.getCore().byId("idcbox").setEnabled(false);
                      sap.ui.getCore().byId("Idsave").setEnabled(false);
                      sap.ui.getCore().byId("idstep").setMin(0);
                    } else {
                      sap.ui.getCore().byId("idcbox").setEnabled(true);
                      sap.ui.getCore().byId("Idsave").setEnabled(true);
                    }
                    sap.ui.getCore().byId("idstep").setValue(0);
                    sap.ui.getCore().byId("idstep").setMax(oQty);
                    sap.ui.getCore().byId("idstep").setMin(0);
                    pressDialog.open();
                  }
                },
                error: function (error) {},
              });
            }
          } else {
            pressDialog.open();
          }
          pressDialog.open();
        },
  
        onChange: function (oEvent) {
          var oValues = sap.ui.getCore().byId("idstep");
          var oValues2 = sap.ui.getCore().byId("idcbox");

          // Begin of Bala on 31st May 2023
          var oBoxItems = [], oProp = {};
          var oItems = oValues2.getItems();
          if(this.oIsSap == 'Y'){
            
                  if(this.getView().getModel('boxModel') == undefined){
                    for (let index = 0; index < oItems.length; index++) {
                      if(oValues2.getItems()[index].getProperty('key') != 4){
                        oProp.key = oItems[index].getProperty("key");
                        oProp.text = oItems[index].getProperty("text");
                        oBoxItems.push(oProp);
                        oProp = {};
                      } 
                    }
                    var oJson = new JSONModel();
                    oJson.setData(oBoxItems);
                    this.getView().setModel(oJson,"boxModel");
                  }
            
                    oValues2.bindAggregation("items",{
                      path:"boxModel>/",
                      template: new sap.ui.core.Item({
                        key:"{boxModel>key}",
                        text:"{boxModel>text}"
                      })
                    });
          }
         // End of Bala on 31st May 2023

          var oValue = oValues.getValue();
          var oValue2 = oValues2.getValue();
          
          oValues.setMax(sTotalOpenQty);
          if (oValue > sTotalOpenQty) {
            sap.ui.getCore().byId("idstep").setValueState("Error");
            sap.m.MessageBox.warning(
              "Credit Request Quantity should not be greater than Max Quantity"
            );
            sap.ui.getCore().byId("Idsave").setEnabled(false);
            sap.ui.getCore().byId("idcbox").setEnabled(false);
            return false;
          }
          var oValue = sap.ui.getCore().byId("idstep").getValue();
          if (CRNo == undefined) {
            if (oValue == 0) {
              sap.ui.getCore().byId("idcbox").setEnabled(false);
              sap.ui.getCore().byId("Idsave").setEnabled(false);
            } else {
              sap.ui.getCore().byId("idcbox").setEnabled(true);
              sap.ui.getCore().byId("Idsave").setEnabled(true);
            }
          } else {
            var pathdata = this.getView().getModel().getProperty(this.spath);
            if (
              pathdata.CRQty == 0 ||
              pathdata.CRQty == undefined ||
              pathdata.CRQty == ""
            ) {
              if (oValue == 0 && oValue2 == "") {
                sap.ui.getCore().byId("idcbox").setEnabled(false);
                sap.ui.getCore().byId("Idsave").setEnabled(false);
              } else if (oValue > 0 && oValue2 != "") {
                sap.ui.getCore().byId("idcbox").setEnabled(true);
                // sap.ui.getCore().byId("Idsave").setEnabled(true);
              } else {
                sap.ui.getCore().byId("idcbox").setEnabled(true);
                sap.ui.getCore().byId("Idsave").setEnabled(false);
              }
            } else {
              if (oValue == 0) {
                sap.ui.getCore().byId("idcbox").setEnabled(false);
                sap.ui.getCore().byId("Idsave").setEnabled(false);
              } else if (oValue > 0 && oValue2 != "") {
                sap.ui.getCore().byId("idcbox").setEnabled(false);
                // sap.ui.getCore().byId("Idsave").setEnabled(true);
              } else {
                sap.ui.getCore().byId("idcbox").setEnabled(false);
                // sap.ui.getCore().byId("Idsave").setEnabled(true);
              }
            }
          }
          if (oValue == 0 || oValue2 == "") {
            sap.ui.getCore().byId("Idsave").setEnabled(false);
            return
        }
        else{
            sap.ui.getCore().byId("Idsave").setEnabled(true);
        }
        },
  
        oSelectionchange: function (oevt) {
            if(oevt.getSource().getSelectedItem()===null){
                sap.ui.getCore().byId("Idsave").setEnabled(false);
      }
          var oSelectedkey = oevt.getSource().getSelectedItem().getKey();
          if (oSelectedkey !== "") {
            sap.ui.getCore().byId("Idsave").setEnabled(true);
        }
        else{
            sap.ui.getCore().byId("Idsave").setEnabled(false);
        }
          if (oSelectedkey == "1") {
            sap.ui.getCore().byId("Damage").setVisible(true);
            sap.ui.getCore().byId("Shortage").setVisible(false);
            sap.ui.getCore().byId("Idsave").setEnabled(true);
            sap.ui.getCore().byId("NotShipped").setVisible(false);
            sap.ui.getCore().byId("Quality").setVisible(false);
            sap.ui.getCore().byId("idQualityPhoto").setVisible(false);
            sap.ui.getCore().byId("idReClasiLabel").setVisible(false);
            sap.ui.getCore().byId("idReClasi").setVisible(false);
          } else if (oSelectedkey == "2") {
            sap.ui.getCore().byId("Damage").setVisible(false);
            sap.ui.getCore().byId("Shortage").setVisible(true);
            sap.ui.getCore().byId("Idsave").setEnabled(true);
            sap.ui.getCore().byId("NotShipped").setVisible(false);
            sap.ui.getCore().byId("Quality").setVisible(false);
            sap.ui.getCore().byId("idQualityPhoto").setVisible(false);
            sap.ui.getCore().byId("idReClasiLabel").setVisible(false);
            sap.ui.getCore().byId("idReClasi").setVisible(false);
          } else if (oSelectedkey == "3") {
            sap.ui.getCore().byId("Damage").setVisible(false);
            sap.ui.getCore().byId("Shortage").setVisible(false);
            sap.ui.getCore().byId("NotShipped").setVisible(false);
            sap.ui.getCore().byId("Quality").setVisible(true);
            sap.ui.getCore().byId("idQualityPhoto").setVisible(true);
            sap.ui.getCore().byId("Idsave").setEnabled(true);
            sap.ui.getCore().byId("idReClasiLabel").setVisible(true);
            sap.ui.getCore().byId("idReClasi").setVisible(true);
          } else if (oSelectedkey == "4") {
            sap.ui.getCore().byId("Damage").setVisible(false);
            sap.ui.getCore().byId("Shortage").setVisible(false);
            sap.ui.getCore().byId("Idsave").setEnabled(true);
            sap.ui.getCore().byId("NotShipped").setVisible(true);
            sap.ui.getCore().byId("Quality").setVisible(false);
            sap.ui.getCore().byId("idQualityPhoto").setVisible(false);
            sap.ui.getCore().byId("idReClasiLabel").setVisible(false);
            sap.ui.getCore().byId("idReClasi").setVisible(false);
          }
        },
  
        onClose: function () {
          pressDialog.close();
          this._itemDialogDestroy();
          pressDialog.destroy();
        },
  
        onAfterItemAdded: function (oEvent) {
          var oCalledEvent = oEvent.getParameter("id");
          var item = oEvent.getParameter("item");
          this._createEntity(item, oCalledEvent);
        },
  
        onUploadCompleted: function (oEvent) {
          oAttachmentUpl.removeAllIncompleteItems();
        },
  
        _uploadContent: function (item, result, oCalledEvent) {
          var Url = result.__metadata.media_src.replaceAll("'", "");
          Url = Url.replace("$value", "Content");
          Url = Url.replace("guid", "");
          item.setUploadUrl(Url);
          item.setUrl(Url);
          oAttachmentUpl.setHttpRequestMethod("PUT");
          oAttachmentUpl.uploadItem(item);
          if (oCalledEvent === "attachmentUpl") {
            var data = {
              id: result.Id,
              MediaType: item.getMediaType(),
              FileName: item.getFileName(),
              Size: item.getFileObject().size,
            };
            uploadedFileDamage.push(data);
          } else if (oCalledEvent === "attachmentUpl1") {
            data = {
              id: result.Id,
              MediaType: item.getMediaType(),
              FileName: item.getFileName(),
              Size: item.getFileObject().size,
            };
            uploadedFileQuality.push(data);
          } else if (oCalledEvent === "attachmentUpl2") {
            data = {
              id: result.Id,
              MediaType: item.getMediaType(),
              FileName: item.getFileName(),
              Size: item.getFileObject().size,
            };
            uploadedFileShortage.push(data);
          }
        },
  
        _createEntity: function (item, oCalledEvent) {
          var data = {
            MediaType: item.getMediaType(),
            FileName: item.getFileName(),
            Size: item.getFileObject().size,
          };
          var that = this;
          this.oModel.create("/AttachmentRow", data, {
            method: "POST",
            success: function (data) {
              that._uploadContent(item, data, oCalledEvent);
            },
            error: function (data) {
              sap.m.MessageBox.error("Error");
            },
          });
        },
  
        // ###### Upload Items
        onBeforeItemAdded: function (oEvent) {
          oAttachmentUpl = sap.ui.getCore().byId(oEvent.getParameter("id"));
          var oItem = oEvent.getParameter("item");
          oItem.setVisibleEdit(false);
          var Data = oAttachmentUpl.getModel().getData();
        //   if (Data !== null) {
        //     var fileIndex = Data.results.findIndex(
        //       (x) => x.FileName === oItem.getFileName()
        //     );
        //     if (fileIndex >= 0) {
        //       oEvent.preventDefault();
        //       sap.m.MessageToast.show("File with same name already exists");
        //       return;
        //     }
        //   }
        //   if (uploadedFileDamage.length > 0) {
        //     fileIndex = uploadedFileDamage.findIndex(
        //       (x) => x.FileName === oItem.getFileName()
        //     );
        //     if (fileIndex >= 0) {
        //       oEvent.preventDefault();
        //       sap.m.MessageToast.show("File with same name already exists");
        //       return;
        //     }
        //   }
        //   if (uploadedFileShortage.length > 0) {
        //     fileIndex = uploadedFileShortage.findIndex(
        //       (x) => x.FileName === oItem.getFileName()
        //     );
        //     if (fileIndex >= 0) {
        //       oEvent.preventDefault();
        //       sap.m.MessageToast.show("File with same name already exists");
        //       return;
        //     }
        //   }
        //   if (uploadedFileQuality.length > 0) {
        //     fileIndex = uploadedFileQuality.findIndex(
        //       (x) => x.FileName === oItem.getFileName()
        //     );
        //     if (fileIndex >= 0) {
        //       oEvent.preventDefault();
        //       sap.m.MessageToast.show("File with same name already exists");
        //       return;
        //     }
        //   }
        },
  
        onRemoveItem: function (evt) {
          var oItem = evt.getParameter("item");
          var oCalledEvent = sap.ui.getCore().byId(evt.getParameter("id")).sId;
          var Data = sap.ui
            .getCore()
            .byId(evt.getParameter("id"))
            .getModel()
            .getData();
          if (Data !== null) {
            sap.ui.getCore().byId(evt.getParameter("id")).removeItem(oItem);
            if(Data.results.length>0){
                var ID = Data.results.filter(
                    (x) => x.FileName === oItem.getFileName()
                  )[0].Id;
                  if (oCalledEvent === "attachmentUpl") {
                    removedFileDamage.push(ID);
                  } else if (oCalledEvent === "attachmentUpl1") {
                    removedFileQuality.push(ID);
                  } else if (oCalledEvent === "attachmentUpl2") {
                      removedFileShortage.push(ID);
                    }
            }
           
            
          } else {
            sap.ui.getCore().byId(evt.getParameter("id")).removeItem(oItem);
            if (oCalledEvent === "attachmentUpl") {
              var fileIndex = uploadedFileDamage.findIndex(
                (x) => x.FileName === oItem.getFileName()
              );
              uploadedFileDamage.splice(fileIndex, 1);
            } else if (oCalledEvent === "attachmentUpl1") {
              var fileIndex = uploadedFileQuality.findIndex(
                (x) => x.FileName === oItem.getFileName()
              );
              uploadedFileQuality.splice(fileIndex, 1);
            } else if (oCalledEvent === "attachmentUpl2") {
                var fileIndex = uploadedFileShortage.findIndex(
                  (x) => x.FileName === oItem.getFileName()
                );
                uploadedFileShortage.splice(fileIndex, 1);
              }
          }
        },
  
        onOpenPressed: function (oEvent) {
          var oItem = oEvent.getParameter("item");
          var oCalledEvent = oEvent.getParameters().item.getParent().getId();
          if (oCalledEvent === "attachmentUpl") {
            var oData = this.getModel("oAttachmentsModel").getData().results;
          } else if (oCalledEvent === "attachmentUpl1") {
            oData = this.getModel("oAttachmentsModel1").getData().results;
          }  else if (oCalledEvent === "attachmentUpl2") {
            oData = this.getModel("oAttachmentsModel2").getData().results;
          }
          var Url = oData.find((x) => x.FileName === oItem.getFileName())
            .__metadata.media_src;
          oItem.setUrl(Url);
        },
  
        onProductName: function (evt) {
          selProduct = evt.getSource().getSelectedItem().getKey();
          this._productIssueData();
        },
  
        _productIssueData: function () {
          var oDataModel = this.getView().getModel();
          var sel = parseInt(selProduct);
          var path = "/ProductName" + "(" + sel + ")/" + "ProductIssue";
          var that = this;
          oDataModel.read(path, {
            success: function (oData) {
              that
                .getOwnerComponent()
                .getModel("productIssueModel")
                .setProperty("/", oData.results);
            },
            error: function (error) {},
          });
        },
  
        //#####post CR data and generating CR No.
        onSave: function () {
          crqty = sap.ui.getCore().byId("idstep").getValue();
          critm = sap.ui.getCore().byId("idcbox").getSelectedItem().getText();
          NsComment =""; 
          //sap.ui.getCore().byId("Nscomments").getValue();
          if (crqty === 0) {
            sap.ui.getCore().byId("idstep").setValueState("Error");
            sap.m.MessageBox.warning("Credit Request Quantity should not be Zero");
            return false;
          }
          if (
            sap.ui.getCore().byId("idcbox").getSelectedKey() === "3" &&
            (sap.ui.getCore().byId("idProductIssueMCB").getSelectedKeys()
              .length === 0 ||
              sap.ui.getCore().byId("idReClasi").getValue() === "")
          ) {
            sap.m.MessageBox.error(
              "Please populate required fields before saving"
            );
            return;
          }
          if (CRNo == undefined) {
            // var oModel = this.getOwnerComponent().getModel();
            // oModel.read("/GetCSR_ID", {

            //     success: function (oResponse) {
    
                   
            //         this.CSR=oResponse.results[0].CRS_ID;
            //       this._crCreate();
    
                   
    
            //     }.bind(this),
            //     error: function (oError) {
    
            //         console.log(oError);
                 
    
            //     }
            // });
            this._crCreate();
          } else {
            this._ItemAddtocr();
          }
        },
  
        fnChange: function (oEvt) {
          var date = new Date();
          var gSelectedDate = oEvt.getParameters().newValue;
          gSelectedDate = new Date(gSelectedDate);
          var sID = oEvt.getSource().getId();
          if (gSelectedDate > date) {
            sap.ui.getCore().byId(sID).setValueState("Error");
            sap.m.MessageBox.error("Future date is not allowed");
            sap.ui.getCore().byId("Idsave").setEnabled(false);
            return false;
          } else {
            sap.ui.getCore().byId("Idsave").setEnabled(true);
            sap.ui.getCore().byId(sID).setValueState("Success");
          }
        },
  
        convertToJSONDate: function (oStarttestDate) {
          var sDate = "";
          if (oStarttestDate === "") {
            sDate = "";
            return sDate;
          } else {
            var sdate = new Date(oStarttestDate); // Or the date you'd like converted.
            var isoDateTime = new Date(
              sdate.getTime() - sdate.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 10);
            return isoDateTime;
          }
        },

//==================================
//Consultant/Developer - Sheshnath agrahari
//Comment - Draft CR creation popup modification
//==================================

        _crCreate: function () {
          var that = this;
          var selKey = sap.ui.getCore().byId("idcbox").getSelectedKey();
          var qualityModel = this.getOwnerComponent().getModel("qualityModel");
          var productName = qualityModel.getProperty("/ProductName");
          var productIssue = qualityModel.getProperty("/ProductIssue");
          var path = this.spath;
          itemdata = this.getView().getModel().getProperty(path);
          var HeaderPath = this.getView().getBindingContext().getPath();
          var HeaderData = this.getView().getModel().getProperty(HeaderPath);
          var AttachmentPIssue = [];
          for (var i in productIssue) {
            var obj = {
              ProductIssueMaster_Id: productIssue[i],
            };
            AttachmentPIssue.push(obj);
          }
        //   if (selKey === "4" && NsComment === "") {
        //     sap.m.MessageBox.error(
        //       "Please populate required fields before saving"
        //     );
        //     return;
        //   } else 
          if (selKey === "") {
            sap.m.MessageBox.error("Please select Credit Type");
            return;
          } else {
            var lComment;
            if (selKey === "1") {
              lComment = "";
              //sap.ui.getCore().byId("coments").getValue();
            } else if (selKey === "4") {
              lComment = NsComment;
            }
            var lLotcode;
            var reClassify;
            if (selKey === "1") {
              lLotcode = sap.ui.getCore().byId("LotCode").getValue();
            } else if (selKey === "3") {
              lLotcode = sap.ui.getCore().byId("QLotCode").getValue();
              reClassify = sap.ui.getCore().byId("idReClasi").getSelectedKey();
              //sap.ui.getCore().byId("idReClasi").getValue();
            }
            sap.ui.getCore().byId("Idsave").setEnabled(false);
            var obj = {
              CRDocDate: new Date(),
              PSInvoiceHdr_PsplInvoice: HeaderData.PsplInvoice,
              SalesOrderNo: HeaderData.SalesOrderNo,
              AccessCR: HeaderData.AccessCR,
              DomicasCR: HeaderData.DomicasCR,
              SAPCR: HeaderData.SAPCR,
              ChangedDateTime: new Date(),
              CreatedDateTime: new Date(),
              SCC_Id: this.SCCID,
              SCC_RegionId: this.RegionIdID,
              PSInvoiceStoreId: HeaderData.StoreId,
              PSInvoiceFrnId: HeaderData.FranchiseId,
              StatusCode_Id: 4,
              StatusCode_ObjectType_Id: 1,
              OrgStrucEleCode_Id: 1,
            //   CSR_ID:this.CSR,
              CreditReqItem: [
                {
                  Material: itemdata.ItemNo,
                  Description: itemdata.Description,
                  Qty: sap.ui.getCore().byId("idstep").getValue(),
                  ApproveQty: sap.ui.getCore().byId("idstep").getValue(),
                  UnitPrice: itemdata.UnitPrice,
                  Tax: itemdata.Tax,
                  Total: itemdata.Total,
                  StatusCode_Id: 1,
                  StatusCode_ObjectType_Id: 1,
                  PSInvoiceQty: itemdata.Qty,
                  UnitCost: itemdata.UnitCost,
                  UnitFreight: itemdata.UnitFreight,
                  UOM: itemdata.UOM,
                  TaxAmount: itemdata.TaxAmount,
                  CRType_Id: sap.ui.getCore().byId("idcbox").getSelectedKey(),
                  ProductType: itemdata.ProductType,
                  CRRowID: itemdata.InvoiceSequenceNumber,
                  Attachment: [
                    {
                      CRType_Id: sap.ui.getCore().byId("idcbox").getSelectedKey(),
                      LotCode: lLotcode,
                      Comment: lComment,
                      ExpDate: this.convertToJSONDate(
                        sap.ui.getCore().byId("Expdate").getValue()
                      )
                        ? this.convertToJSONDate(
                            sap.ui.getCore().byId("Expdate").getValue()
                          )
                        : null,
                      DeliveryDate: this.convertToJSONDate(
                        sap.ui.getCore().byId("DeliveryDate").getValue()
                      )
                        ? this.convertToJSONDate(
                            sap.ui.getCore().byId("DeliveryDate").getValue()
                          )
                        : null,
                      ExpirationDate: this.convertToJSONDate(
                        sap.ui.getCore().byId("ExpirationDate").getValue()
                      )
                        ? this.convertToJSONDate(
                            sap.ui.getCore().byId("ExpirationDate").getValue()
                          )
                        : null,
                      MfgDate: this.convertToJSONDate(
                        sap.ui.getCore().byId("ManufactureDate").getValue()
                      )
                        ? this.convertToJSONDate(
                            sap.ui.getCore().byId("ManufactureDate").getValue()
                          )
                        : null,
                      UseByDate: this.convertToJSONDate(
                        sap.ui.getCore().byId("UseByDate").getValue()
                      )
                        ? this.convertToJSONDate(
                            sap.ui.getCore().byId("UseByDate").getValue()
                          )
                        : null,
                      JulianDate: this.convertToJSONDate(
                        sap.ui.getCore().byId("JulianDate").getValue()
                      )
                        ? this.convertToJSONDate(
                            sap.ui.getCore().byId("JulianDate").getValue()
                          )
                        : null,
                      BestBeforeDate: this.convertToJSONDate(
                        sap.ui.getCore().byId("BestBeforeDate").getValue()
                      )
                        ? this.convertToJSONDate(
                            sap.ui.getCore().byId("BestBeforeDate").getValue()
                          )
                        : null,
                      AttachmentPIssue: AttachmentPIssue,
                      Classification: reClassify,
                    },
                  ],
                },
              ],
            };
            this.oModel.create("/CreditReqHdr", obj, {
              method: "POST",
              success: function (data) {
                CRNo = that
                  .getView()
                  .byId(
                    "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                  ).mProperties.value;
                that
                  .getOwnerComponent()
                  .getModel("uniModel")
                  .setProperty("/crNo", CRNo);
                if (data.CreditReqItem.results[0].Attachment.results.length > 0) {
                  that.updateAttachmentID(
                    data.CreditReqItem.results[0].Attachment.results[0]
                      .AttachmentId,
                    data.CreditReqItem.results[0].CRType_Id
                  );
                }
                sap.m.MessageBox.success(
                  "Draft CR : " + data.BTPCRNO + " Add Items or press Submit",
                  {
                    title:"Item Added to Draft",
                    icon: sap.m.MessageBox.Icon.WARNING,
                // sap.m.MessageBox.success(
                //   "Credit Request : " + data.BTPCRNO + " Created Successfully",
                //   {
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (sAction) {
                      if (sAction == "OK") {
                        if (
                          that
                            .getView()
                            .byId(
                              "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DeliveryFeeCreated::Field"
                            ).mProperties.value === "Y"
                        ) {
                          that.getView().byId("delbtnButton").setVisible(false);
                          that
                            .getView()
                            .byId("revertBtnButton")
                            .setVisible(false);
                        } else {
                          that.getView().byId("delbtnButton").setVisible(true);
                          that
                            .getView()
                            .byId("revertBtnButton")
                            .setVisible(false);
                        }
                        that.extensionAPI.refresh();
                      }
                    },
                  }
                );
                that
                  .getView()
                  .byId(
                    "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton"
                  )
                  .setEnabled(true);
                pressDialog.close();
                that._itemDialogDestroy();
                pressDialog.destroy();
              },
              error: function (e) {
                sap.m.MessageBox.error(JSON.parse(e.responseText).error.message
                .value);

                that.extensionAPI.refresh();
                pressDialog.close();
                that._itemDialogDestroy();
                pressDialog.destroy();
              },
            });
          }
        },
  
//==================================
//Consultant/Developer - Sheshnath agrahari
//Comment - Draft CR creation popup modification
//==================================
        
        _ItemAddtocr: function () {
          var that = this;
          var selKey = sap.ui.getCore().byId("idcbox").getSelectedKey();
          var qualityModel = this.getOwnerComponent().getModel("qualityModel");
          var productName = qualityModel.getProperty("/ProductName");
          var productIssue = qualityModel.getProperty("/ProductIssue");
          var path = this.spath;
          itemdata = this.getView().getModel().getProperty(path);
          var HeaderPath = this.getView().getBindingContext().getPath();
          var HeaderData = this.getView().getModel().getProperty(HeaderPath);
          var qualityModel = this.getOwnerComponent().getModel("qualityModel");
          var lComment;
          if (selKey === "1") {
            lComment = "";
            //sap.ui.getCore().byId("coments").getValue();
          } else if (selKey === "4") {
            lComment = NsComment;
          }
          var lLotcode;
          var reClassify;
          if (selKey === "1") {
            lLotcode = sap.ui.getCore().byId("LotCode").getValue();
          } else if (selKey === "3") {
            lLotcode = sap.ui.getCore().byId("QLotCode").getValue();
            reClassify = sap.ui.getCore().byId("idReClasi").getSelectedKey();
            //sap.ui.getCore().byId("idReClasi").getValue();
          }
          var AttachmentPIssue = [];
          for (var i in productIssue) {
            var obj = {
              ProductIssueMaster_Id: productIssue[i],
            };
            AttachmentPIssue.push(obj);
          }
        //   if (selKey === "4" && NsComment === "") {
        //     sap.m.MessageBox.error(
        //       "Please populate required fields before saving"
        //     );
        //     return;
        //   } else
           if (selKey === "") {
            sap.m.MessageBox.error("Please select Credit Type");
            return;
          }
          sap.ui.getCore().byId("Idsave").setEnabled(false);
          var obj1 = {
            Material: itemdata.ItemNo,
            Description: itemdata.Description,
            Qty: sap.ui.getCore().byId("idstep").getValue(),
            ApproveQty: sap.ui.getCore().byId("idstep").getValue(),
            UnitPrice: itemdata.UnitPrice,
            Tax: itemdata.Tax,
            BTPCRNo_BTPCRNO: CRNo,
            BTPCRNo_OrgStrucEleCode_Id: 1,
            Total: itemdata.Total,
            StatusCode_Id: 1,
            StatusCode_ObjectType_Id: 1,
            PSInvoiceQty: itemdata.Qty,
            UnitCost: itemdata.UnitCost,
            UnitFreight: itemdata.UnitFreight,
            UOM: itemdata.UOM,
            TaxAmount: itemdata.TaxAmount,
            CRType_Id: sap.ui.getCore().byId("idcbox").getSelectedKey(),
            ProductType: itemdata.ProductType,
            CRRowID: itemdata.InvoiceSequenceNumber,
            Attachment: [
              {
                CRType_Id: sap.ui.getCore().byId("idcbox").getSelectedKey(),
                LotCode: lLotcode,
                Comment: lComment,
                ExpDate: this.convertToJSONDate(
                  sap.ui.getCore().byId("Expdate").getValue()
                )
                  ? this.convertToJSONDate(
                      sap.ui.getCore().byId("Expdate").getValue()
                    )
                  : null,
                DeliveryDate: this.convertToJSONDate(
                  sap.ui.getCore().byId("DeliveryDate").getValue()
                )
                  ? this.convertToJSONDate(
                      sap.ui.getCore().byId("DeliveryDate").getValue()
                    )
                  : null,
                ExpirationDate: this.convertToJSONDate(
                  sap.ui.getCore().byId("ExpirationDate").getValue()
                )
                  ? this.convertToJSONDate(
                      sap.ui.getCore().byId("ExpirationDate").getValue()
                    )
                  : null,
                MfgDate: this.convertToJSONDate(
                  sap.ui.getCore().byId("ManufactureDate").getValue()
                )
                  ? this.convertToJSONDate(
                      sap.ui.getCore().byId("ManufactureDate").getValue()
                    )
                  : null,
                UseByDate: this.convertToJSONDate(
                  sap.ui.getCore().byId("UseByDate").getValue()
                )
                  ? this.convertToJSONDate(
                      sap.ui.getCore().byId("UseByDate").getValue()
                    )
                  : null,
                JulianDate: this.convertToJSONDate(
                  sap.ui.getCore().byId("JulianDate").getValue()
                )
                  ? this.convertToJSONDate(
                      sap.ui.getCore().byId("JulianDate").getValue()
                    )
                  : null,
                BestBeforeDate: this.convertToJSONDate(
                  sap.ui.getCore().byId("BestBeforeDate").getValue()
                )
                  ? this.convertToJSONDate(
                      sap.ui.getCore().byId("BestBeforeDate").getValue()
                    )
                  : null,
                AttachmentPIssue: AttachmentPIssue,
                Classification: reClassify,
              },
            ],
          };
          var pathdata = this.getView().getModel().getProperty(this.spath);
          var BTCRNO = new sap.ui.model.Filter({
            path: "BTPCRNo_BTPCRNO",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: CRNo,
          });
          var Description = new sap.ui.model.Filter({
            path: "Material",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: pathdata.ItemNo,
          });
  
          var StatusCode = new sap.ui.model.Filter({
            path: "StatusCode_Id",
            operator: sap.ui.model.FilterOperator.NE,
            value1: 10,
          });
          var oFilter = new Array();
          oFilter.push(BTCRNO);
          oFilter.push(Description);
          oFilter.push(StatusCode);
  
          this.oModel.read("/CreditReqItem", {
            filters: [oFilter],
            urlParameters: {
              $expand: "Attachment",
            },
            success: function (oData) {
              if (oData.results.length == 0) {
                that.oModel.create("/CreditReqItem", obj1, {
                  method: "POST",
                  success: function (data) {
                    if (data.Attachment.results.length > 0) {
                      that.updateAttachmentID(
                        data.Attachment.results[0].AttachmentId,
                        data.CRType_Id
                      );
                    }
                    var oTable1 = that
                      .getView()
                      .byId(
                        "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable"
                      );
                    // sap.m.MessageBox.success("Item Added to Credit Request No." + CRNo + "", {
                      sap.m.MessageBox.success(
                        "Draft CR : " + CRNo + " Add Items or press Submit",
                        {
                          title:"Item Added to Draft",
                          icon: sap.m.MessageBox.Icon.WARNING,
                      actions: [sap.m.MessageBox.Action.OK],
                      onClose: function (sAction) {
                        if (sAction == "OK") {
                          that.extensionAPI.refresh();
                        }
                      },
                    });
                    pressDialog.close();
                    that._itemDialogDestroy();
                    pressDialog.destroy();
                  },
                  error: function (e) {
                    sap.m.MessageBox.error("Error");
                  },
                });
              } else {
                var BTPCRItem = oData.results[0].BTPCRItem;
                Attachmentid =
                  oData.results[0].Attachment.results[0].AttachmentId;
                that.oModel.setUseBatch(true);
                for (var i = 0; i < removedFileDamage.length; i++) {
                  var sPath = "/AttachmentRow(" + removedFileDamage[i] + ")";
                  that.oModel.remove(sPath, {
                    method: "POST",
                    success: function (data) {},
                    error: function (e) {},
                  });
                }
                for (var i = 0; i < removedFileQuality.length; i++) {
                  var sPath = "/AttachmentRow(" + removedFileQuality[i] + ")";
                  that.oModel.remove(sPath, {
                    method: "POST",
                    success: function (data) {},
                    error: function (e) {},
                  });
                }
                for (var i = 0; i < removedFileShortage.length; i++) {
                    var sPath = "/AttachmentRow(" + removedFileShortage[i] + ")";
                    that.oModel.remove(sPath, {
                      method: "POST",
                      success: function (data) {},
                      error: function (e) {},
                    });
                  }
                
                var Path = "/CreditReqItem" + "(" + BTPCRItem + ")";
                obj1.Attachment[0]["AttachmentId"] = Attachmentid;
                that.oModel.update(Path, obj1, {
                  success: function (oData) {
                    if (oData.Attachment.results.length > 0) {
                      that.updateAttachmentID(
                        oData.Attachment.results[0].AttachmentId,
                        oData.CRType_Id
                      );
                    }
                    var oTable1 = that
                      .getView()
                      .byId(
                        "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--ItemId::responsiveTable"
                      );
                    sap.m.MessageBox.success(
                      "Item updated to Credit Request No." + CRNo + "",
                      {
                        actions: [sap.m.MessageBox.Action.OK],
                        onClose: function (sAction) {
                          //  MessageToast.show("Action selected: " + sAction);
                          if (sAction == "OK") {
                            that.extensionAPI.refresh();
                          }
                        },
                      }
                    );
                    pressDialog.close();
                    that._itemDialogDestroy();
                    pressDialog.destroy();
                  },
                  error: function (Error) {
                    var errorMsg = JSON.parse(Error.responseText).error.message
                      .value;
                    sap.m.MessageBox.error(errorMsg);
                  },
                });
              }
            },
            error: function (Error) {
              var errorMsg = JSON.parse(Error.responseText).error.message.value;
              sap.m.MessageBox.error(errorMsg);
              that.extensionAPI.refresh();
                pressDialog.close();
                that._itemDialogDestroy();
                pressDialog.destroy();
            },
          });
        },

        _itemDialogDestroy() {
          sap.ui.getCore().byId("DeliveryDate").destroy();
          if (sap.ui.getCore().byId("idstep") !== undefined) {
            sap.ui.getCore().byId("idstep").destroy();
          }
          sap.ui.getCore().byId("idcbox").destroy();
          sap.ui.getCore().byId("Expdate").destroy();
    //      sap.ui.getCore().byId("coments").destroy();
          sap.ui.getCore().byId("LotCode").destroy();
          sap.ui.getCore().byId("attachmentUpl").destroy();
          if (sap.ui.getCore().byId("attachmentUpl-uploader") !== undefined) {
            sap.ui.getCore().byId("attachmentUpl-uploader").destroy();
          }
          if (sap.ui.getCore().byId("attachmentUpl-toolbar") !== undefined) {
            sap.ui.getCore().byId("attachmentUpl-toolbar").destroy();
          }
          if (sap.ui.getCore().byId("attachmentUpl-list") !== undefined) {
            sap.ui.getCore().byId("attachmentUpl-list").destroy();
          }
          sap.ui.getCore().byId("attachmentUpl1").destroy();
          if (sap.ui.getCore().byId("attachmentUpl1-uploader") !== undefined) {
            sap.ui.getCore().byId("attachmentUpl1-uploader").destroy();
          }
          if (sap.ui.getCore().byId("attachmentUpl1-toolbar") !== undefined) {
            sap.ui.getCore().byId("attachmentUpl1-toolbar").destroy();
          }
          if (
            sap.ui.getCore().byId("'attachmentUpl1-deleteDialog'") !== undefined
          ) {
            sap.ui.getCore().byId("'attachmentUpl1-deleteDialog'").destroy();
          }
          if (sap.ui.getCore().byId("attachmentUpl1-list") !== undefined) {
            sap.ui.getCore().byId("attachmentUpl1-list").destroy();
          }
          sap.ui.getCore().byId("attachmentUpl2").destroy();
          if (sap.ui.getCore().byId("attachmentUpl2-uploader") !== undefined) {
            sap.ui.getCore().byId("attachmentUpl2-uploader").destroy();
          }
          if (sap.ui.getCore().byId("attachmentUpl2-toolbar") !== undefined) {
            sap.ui.getCore().byId("attachmentUpl2-toolbar").destroy();
          }
          if (sap.ui.getCore().byId("attachmentUpl2-list") !== undefined) {
            sap.ui.getCore().byId("attachmentUpl2-list").destroy();
          }
          sap.ui.getCore().byId("Damage").destroy();
          sap.ui.getCore().byId("Shortage").destroy();
          this.PISelectedkeys = [];
          sap.ui.getCore().byId("Quality").getContent()[4].setSelectedKeys([]);
          sap.ui.getCore().byId("Quality").getContent()[6].setValue(null);
          sap.ui.getCore().byId("Quality").getContent()[8].setValue(null);
          sap.ui.getCore().byId("Quality").getContent()[11].setValue(null);
          sap.ui.getCore().byId("Quality").getContent()[13].setValue(null);
          sap.ui.getCore().byId("Quality").getContent()[15].setValue(null);
          sap.ui.getCore().byId("Quality").getContent()[17].setValue(null);
          sap.ui.getCore().byId("Quality").destroy();
          sap.ui.getCore().byId("Idsave").destroy();
          removedFileDamage = [];
          removedFileQuality = [];
          uploadedFileDamage = [];
          uploadedFileQuality = [];
          removedFileShortage = [];
          uploadedFileShortage = [];
        },
  
        onProductissue: function (evt) {
          this.PISelectedkeys = sap.ui
            .getCore()
            .byId("idProductIssueMCB")
            .getSelectedKeys();
        },
  
        _productIssueKeys: function () {
          var Selectedkeys = sap.ui
            .getCore()
            .byId("idProductIssueMCB")
            .getSelectedKeys();
        },
  
        onRevertPress: function () {
          CRNo = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
          ).mProperties.value;
          var deliveryFeeCreated = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DeliveryFeeCreated::Field"
          ).mProperties.value;
          if (deliveryFeeCreated === "Y") {
            var that = this;
            var oModel = that.getOwnerComponent().getModel();
            var oFilterR = new sap.ui.model.Filter({
              filters: [
                new sap.ui.model.Filter("ItemType", "EQ", "D"),
                new sap.ui.model.Filter("StatusCode_Id", "NE", "10"),
                new sap.ui.model.Filter("BTPCRNo_BTPCRNO", "EQ", CRNo),
              ],
              and: true,
            });
            oModel.read("/CreditReqItem", {
              filters: [oFilterR],
              success: function (oResponse) {
                that.credititemdata = oResponse.results[0];
                that.updateRevertDelivery();
              },
              error: function (err) {
                sap.m.MessageBox.alert("Delivery fee is in different Credit Request");
              },
            });
          }
        },
        updateRevertDelivery: function () {
          var that = this;
          sap.m.MessageBox.show("Do you want to Revert fee back?", {
            icon: sap.m.MessageBox.Icon.QUESTION,
            title: "Confirm",
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            onClose: function (oAction) {
              if (oAction === "OK") {
                var oModel = that.getOwnerComponent().getModel();
                var creditReqItem = that.getView().getModel("Deliveryfeeitem")
                  .items.BTPCRItem;
                var path1 = "/CreditReqItem(BTPCRItem=" + creditReqItem + ")";
                var path2 =
                  "/CreditReqHdr(BTPCRNO=" +
                  CRNo +
                  ",OrgStrucEleCode_Id=" +
                  1 +
                  ")";
                var obj = {
                  StatusCode_Id: 10,
                };
                var obj2 = {
                  DeliveryFee: 0,
                };
                oModel.sDefaultUpdateMethod = "PATCH";
                oModel.update(path1, obj, {
                  success: function (oSuccess) {
                    oModel.sDefaultUpdateMethod = "PATCH";
                    oModel.update(path2, obj2, {
                      success: function (oSuccess) {
                        sap.m.MessageToast.show(" Delivery Fee Reverted");
                        oModel.sDefaultUpdateMethod = "MERGE";
                        that.getView().byId("delbtnButton").setVisible(true);
                        that.getView().byId("revertBtnButton").setVisible(false);
                        that.extensionAPI.refresh();
                      }.bind(that),
                      error: function (oError) {
                        oModel.sDefaultUpdateMethod = "MERGE";
                        sap.m.MessageBox.alert("Techincal Error Occured -");
                      },
                    });
                  },
                  error: function (oError) {
                    sap.m.MessageBox.alert("Techincal Error Occured -");
                  },
                });
              }
            },
          });
        },
        onDeliveryCreate: function (oEvent) {
          var that = this;
          if (!this._deliveryFeeDialog) {
            this._deliveryFeeDialog = sap.ui.xmlfragment(
              "createscccr.ext.fragments.Deliveryfee",
              this
            );
            this.getView().addDependent(this._deliveryFeeDialog);
          }
          else{
            this._deliveryFeeDialog.getContent()[0].setSelectedKey("");
            this._deliveryFeeDialog.getButtons()[0].setEnabled(false);
          }
          this._deliveryFeeDialog.open();
        },
        onCloseDeliveryFee: function () {
            this._deliveryFeeDialog.getContent()[0].setSelectedKey("");

          this._deliveryFeeDialog.close();
          
        },
       
        onSelectCredit: function (oEvent) {
          var that = this;
          var Id = oEvent.getSource().getSelectedKey();
          this.SelectedCRType=Id;
          var InvoiceDate = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac2::InvoiceDate::Field"
          ).mProperties.value;
          var PsplInvoice = this.getView().byId(
            "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac2::PsplInvoice::Field"
          ).mProperties.value;
          this._deliveryFeeDialog.getButtons()[0].setEnabled(true);
        //   var oFilterR = new sap.ui.model.Filter({
        //     filters: [
        //       new sap.ui.model.Filter("BTP_DelvFee_Setup_CRType_Id", "EQ", Id),
        //       new sap.ui.model.Filter("FromDate", "LE", InvoiceDate),
        //       new sap.ui.model.Filter("ToDate", "GE", InvoiceDate),
        //     ],
        //     and: true,
        //   });
          var oModel = this.getOwnerComponent().getModel();
          var oFilterR = new sap.ui.model.Filter({
            filters: [
            new sap.ui.model.Filter("PsplInvoice_PsplInvoice", "EQ",PsplInvoice),
            new sap.ui.model.Filter("ItemNo", "EQ", "DC")
            ],
            and: true
            });
                                                    
            oModel.read("/GetInvoiceItems", {
            filters: [oFilterR],
            success: function (oResponse) {
            console.log(oResponse);
            if (oResponse.results.length > 0) {
                that.getView().setModel(new sap.ui.model.json.JSONModel({
                    items: oResponse.results
                }), "DelvFeeModel");
                //  that.updateCRItems(oResponse.results);
            }
            
            },
            error: function (err) {},
            });
        //   oModel.read("/BTP_DelvFee_Setup_Dtl", {
        //     filters: [oFilterR],
        //     success: function (oResponse) {
        //       if (oResponse.results.length > 0) {
        //         that.getView().setModel(
        //           new sap.ui.model.json.JSONModel({
        //             items: oResponse.results,
        //           }),
        //           "DelvFeeModel"
        //         );
        //       }
        //     }.bind(that),
        //     error: function (err) {
        //       sap.m.MessageBox.alert(
        //         "Delivery Credit fee not maintained for the credit type in the invoice period"
        //       );
        //     },
        //   });
        },
        onDeliveryFeeSave_old: function (oEvent) {
            
            CRNo = this.getView().byId(
              "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
            ).mProperties.value;
            var that = this;
            var oModel = that.getOwnerComponent().getModel();
            if (typeof that.getView().getModel("DelvFeeModel") == "undefined") {
              sap.m.MessageBox.alert(
                "Delivery Credit fee not maintained for the credit type in the invoice period"
              );
            } else {
              var Amt = that.getView().getModel("DelvFeeModel").getData().items[0]
                .ByAmount;
              var CrId = that.getView().getModel("DelvFeeModel").getData().items[0]
                .BTP_DelvFee_Setup_CRType_Id;
    
              var obj = {
                BTPCRNo_BTPCRNO: CRNo,
                BTPCRNo_OrgStrucEleCode_Id: 1,
                Material: "DC",
                Description: "Delivery Service Admin Fee",
                StatusCode_Id: 1,
                StatusCode_ObjectType_Id: 1,
                Qty: 1,
                ApproveQty: 1,
                PSInvoiceQty: 1,
                UnitPrice: Amt,
                Total: 1,
                ItemType: "D",
                CRType_Id: CrId,
                UOM: "EA",
              };
              var path =
                "/CreditReqHdr(BTPCRNO=" + CRNo + ",OrgStrucEleCode_Id=" + 1 + ")";
              var obj2 = {
                DeliveryFee: Amt,
              };
    
              oModel.create("/CreditReqItem", obj, {
                success: function (oSuccess) {
                  that.getView().setModel(
                    {
                      items: oSuccess,
                    },
                    "Deliveryfeeitem"
                  );
                  oModel.refresh();
                  oModel.sDefaultUpdateMethod = "PATCH";
                  oModel.update(path, obj2, {
                    success: function (oSuccess) {
                      that.getView().byId("delbtnButton").setVisible(false);
                      that.getView().byId("revertBtnButton").setVisible(true);
                      sap.m.MessageToast.show(" Delivery Fee Added");
                      oModel.refresh();
                      that._deliveryFeeDialog.close();
                      oModel.sDefaultUpdateMethod = "MERGE";
                    }.bind(that),
                    error: function (oError) {
                      oModel.sDefaultUpdateMethod = "MERGE";
                      sap.m.MessageBox.alert("Techincal Error Occured -");
                    },
                  });
                },
                error: function (oError) {
                  sap.m.MessageBox.alert("Techincal Error Occured -");
                },
              });
            }
          },
          onDeliveryFeeSave: function (oEvent) {
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            var PsplInvoice = this.getView().byId(
                "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac2::PsplInvoice::Field"
              ).mProperties.value;
            var oFilterR = new sap.ui.model.Filter({
                filters: [
                new sap.ui.model.Filter("PsplInvoice_PsplInvoice", "EQ",PsplInvoice),
                new sap.ui.model.Filter("ItemNo", "EQ", "DC")
                ],
                and: true
                });
            oModel.read("/GetInvoiceItems", {
              filters: [oFilterR],
              success: function (oResponse) {
               console.log(oResponse);
               that.onItemDeliveryFeeSave(oResponse.results[0]);
               
              },
              error: function (err) {},
            });               
          },
  
        updateAttachmentID: function (attachmentID, CRType) {
          this.oModel.setUseBatch(true);
          if (CRType === 1) {
            var uploadedFile = uploadedFileDamage;
          } else if (CRType === 3) {
            uploadedFile = uploadedFileQuality;
          } else if (CRType === 2) {
            uploadedFile = uploadedFileShortage;
          }  
           else {
            uploadedFile = [];
          }
          for (var i = 0; i < uploadedFile.length; i++) {
            var sPath = "/AttachmentRow(" + uploadedFile[i].id + ")";
            var obj = {
              AttachmentID_AttachmentId: attachmentID,
            };
            this.oModel.update(sPath, obj, {
              success: function (oData) {},
              error: function (Error) {
                var errorMsg = JSON.parse(Error.responseText).error.message.value;
                sap.m.MessageBox.error(errorMsg);
              },
            });
          }
        },

        //Line Item Deliveryfee Code
        onSelectCredit2: function (oEvent) {
            var that = this;
            var Id = oEvent.getSource().getSelectedKey();
            var InvoiceDate = this.getView().byId(
              "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac2::InvoiceDate::Field"
            ).mProperties.value;
            this._itemdeliveryFeeDialog.getButtons()[0].setEnabled(true);
            var oFilterR = new sap.ui.model.Filter({
              filters: [
                new sap.ui.model.Filter("BTP_DelvFee_Setup_CRType_Id", "EQ", Id),
                new sap.ui.model.Filter("FromDate", "LE", InvoiceDate),
                new sap.ui.model.Filter("ToDate", "GE", InvoiceDate),
              ],
              and: true,
            });
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/BTP_DelvFee_Setup_Dtl", {
              filters: [oFilterR],
              success: function (oResponse) {
                if (oResponse.results.length > 0) {
                  that.getView().setModel(
                    new sap.ui.model.json.JSONModel({
                      items: oResponse.results,
                    }),
                    "DelvFeeModel"
                  );
                }
              }.bind(that),
              error: function (err) {
                sap.m.MessageBox.alert(
                  "Delivery Credit fee not maintained for the credit type in the invoice period"
                );
              },
            });
          },
        onItemDeliveryCreate: function (oEvent) {
            var that = this;
            if(this.getView().byId(
                "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DeliveryFeeCreated::Field"
              ).mProperties.value=="Y"){
                  return;
              }
            if (!this._itemdeliveryFeeDialog) {
              this._itemdeliveryFeeDialog = sap.ui.xmlfragment(
                "createscccr.ext.fragments.ItemDeliveryfee",
                this
              );
              this.getView().addDependent(this._itemdeliveryFeeDialog);
            }
            else{
                this._itemdeliveryFeeDialog.getContent()[0].setSelectedKey("");
                this._itemdeliveryFeeDialog.getButtons()[0].setEnabled(true);
              }
            this._itemdeliveryFeeDialog.open();
          },
          onCloseItemDeliveryFee: function () {
           this._itemdeliveryFeeDialog.getContent()[0].setSelectedKey("");
         //   sap.ui.getCore().byId("DeliveryType2").destroy();
          this._itemdeliveryFeeDialog.close();
          
        },
          onItemDeliveryFeeSave: function (itemdata,oEvent) {
             
            CRNo = this.getView().byId(
              "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
            ).mProperties.value;
            if(CRNo!=null){
                this._DeliveryFeeSave();
                this.onCloseDeliveryFee();
                return;
            }
            var that = this;
            var oModel = that.getOwnerComponent().getModel();
            if (typeof that.getView().getModel("DelvFeeModel") == "undefined") {
              sap.m.MessageBox.alert(
                "Delivery Credit fee not maintained for the credit type in the invoice period"
              );
            } else {
            //   var path = this.spath;
            //   itemdata = this.getView().getModel().getProperty(path);
              var HeaderPath = this.getView().getBindingContext().getPath();
              var HeaderData = this.getView().getModel().getProperty(HeaderPath);
            //   var CrId = that.getView().getModel("DelvFeeModel").getData().items[0]
            //       .BTP_DelvFee_Setup_CRType_Id;
                  var Amt = that.getView().getModel("DelvFeeModel").getData().items[0]
                  .UnitPrice;   
     
     var obj = {
                  CRDocDate: new Date(),
                  PSInvoiceHdr_PsplInvoice: HeaderData.PsplInvoice,
                  SalesOrderNo: HeaderData.SalesOrderNo,
                  AccessCR: HeaderData.AccessCR,
                  DomicasCR: HeaderData.DomicasCR,
                  SAPCR: HeaderData.SAPCR,
                  ChangedDateTime: new Date(),
                  CreatedDateTime: new Date(),
                  SCC_Id: this.SCCID,
                  SCC_RegionId: this.RegionIdID,
                  PSInvoiceStoreId: HeaderData.StoreId,
                  PSInvoiceFrnId: HeaderData.FranchiseId,
                  StatusCode_Id: 4,
                  StatusCode_ObjectType_Id: 1,
                  OrgStrucEleCode_Id: 1,
                  DeliveryFee: Amt,
                  CreditReqItem: [
                    {
                      Material: itemdata.ItemNo,
                      Description: itemdata.Description,
                      Qty: 1,
                      ApproveQty: 1,
                      UnitPrice: itemdata.UnitPrice,
                      Tax: itemdata.Tax,
                      Total: itemdata.Total,
                      StatusCode_Id: 1,
                      StatusCode_ObjectType_Id: 1,
                      PSInvoiceQty: itemdata.Qty,
                      UnitCost: itemdata.UnitCost,
                      UnitFreight: itemdata.UnitFreight,
                      UOM: itemdata.UOM,
                      TaxAmount: itemdata.TaxAmount,
                      CRType_Id: this.SelectedCRType,
                      ItemType: "D",
                      ProductType: itemdata.ProductType,
                      CRRowID: itemdata.InvoiceSequenceNumber,
                      Attachment: [],
                    },
                  ],
                };
                that.onCloseDeliveryFee();
                oModel.create("/CreditReqHdr", obj, {
                  method: "POST",
                  success: function (data) {
                    CRNo = data.BTPCRNO;
                    // that
                    //   .getView()
                    //   .byId(
                    //     "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
                    //   ).mProperties.value;
                    that
                      .getOwnerComponent()
                      .getModel("uniModel")
                      .setProperty("/crNo", CRNo);
                    
                    sap.m.MessageBox.success(
                      "Credit Request : " + data.BTPCRNO + " Created Successfully",
                      {
                        actions: [sap.m.MessageBox.Action.OK],
                        onClose: function (sAction) {
                          if (sAction == "OK") {
                            that.getDCItem();
                               setTimeout(function() { 
                        if (  that
                                .getView()
                                .byId(
                                  "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DeliveryFeeCreated::Field"
                                ).mProperties.value === "Y"
                            ) {
                              that.getView().byId("delbtnButton").setVisible(false);
                              that
                                .getView()
                                .byId("revertBtnButton")
                                .setVisible(true);
                            } else {
                              that.getView().byId("delbtnButton").setVisible(true);
                              that
                                .getView()
                                .byId("revertBtnButton")
                                .setVisible(false);
                            }
                          //  that._itemdeliveryFeeDialog.close();
                            },4000); 
                           
                            that.extensionAPI.refresh();
                          }
                        },
                      }
                    );
                    that
                      .getView()
                      .byId(
                        "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--action::REPLACE_WITH_ACTION_IDButton"
                      )
                      .setEnabled(true);
                    // that.onCloseDeliveryFee();
                    
                  },
                  error: function (e) {
                    sap.m.MessageBox.error("Error");
                  },
                });
  
            }
          },
          _DeliveryFeeSave: function (oEvent) {
            CRNo = this.getView().byId(
              "createscccr::sap.suite.ui.generic.template.ObjectPage.view.Details::GetInvoiceHdr--header::headerEditable::reffac3::DrfBTPCRNO::Field"
            ).mProperties.value;
            var that = this;
            var oModel = that.getOwnerComponent().getModel();
            if (typeof that.getView().getModel("DelvFeeModel") == "undefined") {
              sap.m.MessageBox.alert(
                "Delivery Credit fee not maintained for the credit type in the invoice period"
              );
            } else {
                var Amt = that.getView().getModel("DelvFeeModel").getData().items[0].UnitPrice;
                var Description=that.getView().getModel("DelvFeeModel").getData().items[0].Description;

            //   var CrId = that.getView().getModel("DelvFeeModel").getData().items[0]
            //     .BTP_DelvFee_Setup_CRType_Id;
    
              var obj = {
                BTPCRNo_BTPCRNO: CRNo,
                BTPCRNo_OrgStrucEleCode_Id: 1,
                Material: "DC",
                Description: Description,
                StatusCode_Id: 1,
                StatusCode_ObjectType_Id: 1,
                Qty: 1,
                ApproveQty: 1,
                PSInvoiceQty: 1,
                UnitPrice: Amt,
                Total: 1,
                ItemType: "D",
                CRType_Id: this.SelectedCRType,
                UOM: "EA",
              };
              var path =
                "/CreditReqHdr(BTPCRNO=" + CRNo + ",OrgStrucEleCode_Id=" + 1 + ")";
              var obj2 = {
                DeliveryFee: Amt,
              };
    
              oModel.create("/CreditReqItem", obj, {
                success: function (oSuccess) {
                  that.getView().setModel(
                    {
                      items: oSuccess,
                    },
                    "Deliveryfeeitem"
                  );
                  oModel.refresh();
                  oModel.sDefaultUpdateMethod = "PATCH";
                  oModel.update(path, obj2, {
                    success: function (oSuccess) {
                      that.getView().byId("delbtnButton").setVisible(false);
                      that.getView().byId("revertBtnButton").setVisible(true);
                      sap.m.MessageToast.show(" Delivery Fee Added");
                      oModel.refresh();
                      oModel.sDefaultUpdateMethod = "MERGE";
                    }.bind(that),
                    error: function (oError) {
                      oModel.sDefaultUpdateMethod = "MERGE";
                      sap.m.MessageBox.alert("Techincal Error Occured -");
                    },
                  });
                },
                error: function (oError) {
                  sap.m.MessageBox.alert("Techincal Error Occured -");
                },
              });
            }
          },
          updateDeleteItemDeliveryFee: function () {
            var that = this;
            var oModel = that.getOwnerComponent().getModel();
            var path2 =
                    "/CreditReqHdr(BTPCRNO=" +
                    CRNo +
                    ",OrgStrucEleCode_Id=" +
                    1 +
                    ")";
                    var obj2 = {
                        DeliveryFee: 0,
                      };
                      oModel.sDefaultUpdateMethod = "PATCH";    
                      oModel.update(path2, obj2, {
                        success: function (oSuccess) {
                          oModel.sDefaultUpdateMethod = "MERGE";
                          that.getView().byId("delbtnButton").setVisible(true);
                          that.getView().byId("revertBtnButton").setVisible(false);
                          that.extensionAPI.refresh();
                        }.bind(that),
                        error: function (oError) {
                          oModel.sDefaultUpdateMethod = "MERGE";
                          sap.m.MessageBox.alert("Techincal Error Occured -");
                        },
                      });      
           
          },
          getDCItem:function(){
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            
           var oFilterR = new sap.ui.model.Filter({
                filters: [
                  new sap.ui.model.Filter("BTPCRNo_BTPCRNO", "EQ", CRNo),
                  new sap.ui.model.Filter("ItemType", "EQ", "D"),
                  new sap.ui.model.Filter("StatusCode_Id", "NE", 10),
                ],
                and: true,
              });
              oModel.read("/CreditReqItem", {
                filters: [oFilterR],
                success: function (oResponse) {
                  if (oResponse.results.length > 0) {
                    that.getView().setModel(
                      {
                        items: oResponse.results[0],
                      },
                      "Deliveryfeeitem"
                    );
                    that.getView().byId("revertBtnButton").setVisible(true);
                  } else {
                    that.getView().byId("revertBtnButton").setVisible(false);
                  }
                }.bind(that),
                error: function (err) {},
              });
          }
      };
    }
  );
  