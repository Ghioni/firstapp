sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment" ,
    "sap/m/Dialog",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment,Dialog,JSONModel) {
        "use strict";

        return Controller.extend("create.firstapp.controller.Home", {
            onInit: function () {
                let modelloXDati = this.getOwnerComponent().getModel("modelloDati")
                this.getView().setBusy(true)
                // debugger
                Promise.all([
                            this._getDbPromised("/Suppliers", "/Fornitori"),
])
                               .then((odata) => {
                        for (let i = 0; i < odata.length; i++) {
                                        modelloXDati.setProperty(Object.keys(odata[i])[0], odata[i][Object.keys(odata[i])[0]])
                                        console.log(Object.keys(odata[i])[0])
                                        console.log(odata[i][Object.keys(odata[i])[0]])
                                    }
                                    // debugger
                                    this.getView().setBusy(false)
})
                               .catch(err => {
                                    debugger
                               })
            },
            _getDbPromised: function (entity, property) {
                let model =  this.getOwnerComponent().getModel()
                return new Promise((resolve, reject) => {
                    model.read(entity, {
                        success: (odata) =>{
                            let sProp = property
                            resolve(
                                {
                                    [sProp]: odata.results
                                }
                                )
                        },
                        error: (error) =>{
                            reject(error)
                        }
                    })
                })
            },
            onPressDialog : function () {

            // create dialog lazily
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "create.firstapp.view.fragments.formDialog"
                });
            } 
            this.pDialog.then(function(oDialog) {
                oDialog.open();
            });
        },
        closeOnPress: function(oEvent){
            // var oDialog = this.getView().byId("helloDialog");     
            this.byId("helloDialog").close();
        },
        addOnPress: function(oEvent){
           var oForm = structuredClone(this.getView().getModel("FormModel").getData());
           // structureClone crea una copia non referenziata (vattelo a cercare)
           var aTable = structuredClone(this.getView().getModel("modelloDati").getProperty("/Fornitori"));
           aTable.push(oForm);
           this.getView().getModel("modelloDati").setProperty("/Fornitori",aTable); 
           
        },
        onRiga: function(oEvent) {
            //funzione per l' estrapolazione dei dati da ogni riga
            var oRiga = oEvent.getSource().getBindingContext("modelloDati").getObject();//tiro fuori le risorse
            this.getView().setModel(new JSONModel(oRiga), "oForm"); //creo modello json
            //nel set(scrivere)Model passo un nuovo modello JSON con il parametro della variabile precendete e gli do il nome
            this.onPressDialog2(oRiga);

            this.getView().setModel(new JSONModel(oRiga), "Riga")
        
          },
        onPressDialog2 : function () {

            // create dialog lazily
            if (!this.oDialog2) {
                this.oDialog2 = this.loadFragment({
                    name: "create.firstapp.view.fragments.editDialog"
                });
            } 
            this.oDialog2.then(function(oDialog2) {
                oDialog2.open();
            });

        },
            onPressChange: function(oEvent){

                let modelloXDati = this.getOwnerComponent().getModel();
                let oForm = this.getView().getModel("oForm").getData();
                var aTable = structuredClone(this.getView().getModel("modelloDati").getProperty("/Fornitori"))
                console.log(aTable)
                this.getView().getModel("Riga").setProperty("/Fornitori",aTable)
                this.getView().getModel("modelloDati").updateBindings();
                this.close();
                  
        },
        
        close: function(oEvent){
            this.byId("editDialog").close()
        },

        onDelete: function(oEvent) {      
            var aTable = this.getView().getModel("modelloDati").getProperty("/Fornitori");            
            aTable.splice(aTable, 1)
            this.getView().getModel("modelloDati").setProperty("/Fornitori",aTable)
          }
        });
    });

    
        // UPDATE DA BACKEND 
        // onPressChange: function(){
        //     let modelloXDati = this.getOwnerComponent().getModel();
        //     let oForm = this.getView().getModel("oForm").getData();
        //     let sKey = oForm.SupplierID;
        //     let sPath = "/Suppliers('" + sKey + "')";
        //     modelloXDati.setUseBatch(false);
        //     modelloXDati.update(sPath,oForm,{
            
        //         success: function(oDatain,oResponse){
        //             debugger
        //         },
        //         error: function(error){
        //             debugger
        //         }
                
        //     })
        // },