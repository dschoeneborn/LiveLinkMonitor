sap.ui.define([
    'jquery.sap.global',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel'
], function (jQuery, MessageToast, Fragment, Controller, Filter, JSONModel) {
    "use strict";
    var CController;
    CController = Controller.extend("sap.m.sample.SplitApp.C", {
        serviceHost : "http://livelink.schoeneborn-consulting.de/rest/",
        onInit: function () {
            this.getSplitAppObj().setHomeIcon({
                'icon': 'desktop.ico'
            });
            jQuery.sap.require("sap.m.MessageBox");
            //this.getSplitAppObj().setMode("PopoverMode");
            this.initSwitchCountViz();
            this.initPowerViz();
            this.initHTemperatureViz();
            this.initOperatingTimeViz();
            this.initLights();
            this.initGroups();
        },
        onPressNavToDetail: function (oEvent) {
            this.getSplitAppObj().to(this.createId("detailDetail"));
        },
        onPressDetailBack: function () {
            this.getSplitAppObj().backDetail();
        },
        onPressMasterBack: function () {
            this.getSplitAppObj().backMaster();
        },
        onPressGoToOverallDetail: function () {
            this.getSplitAppObj().toDetail(this.createId("overallDetail"));
        },
        onPressGoToLightsMaster: function () {
            this.getSplitAppObj().toMaster(this.createId("lightsMaster"));
        },
        onPressGoToGroupsMaster: function () {
            this.getSplitAppObj().toMaster(this.createId("groupsMaster"));
        },
        onLightItemPress: function (oEvent) {
            var id = oEvent.getParameter("listItem").getTitle();
            this.initLOverview(id);
            this.initLTemperatureViz(id);
            this.initLPowerViz(id);
            var view = this.byId("lightDetail");
            view.data("id", id);
            this.getSplitAppObj().toDetail(view);
        },
        onGroupItemPress: function (oEvent) {
            var id = oEvent.getParameter("listItem").getCustomData()[0].getValue();
            this.initGOperatingTimeViz(id);
            this.initGSwitchCountViz(id);
            this.initGHTemperatureViz(id);
            this.initGPowerViz(id);
            var view = this.byId("groupDetail");
            view.data("gId", id);
            this.getSplitAppObj().toDetail(view);
        },
        getSplitAppObj: function () {
            var result = this.byId("Monitoring");
            if (!result) {
                jQuery.sap.log.info("SplitApp object can't be found");
            }
            return result;
        },
        initSwitchCountViz: function () {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizSwitchCount");
//      2.Create a JSON Model and set the data

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", this.serviceHost+"switchcount/last", true); // false for synchronous request
            xmlHttp.onload = function (e) {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        var oModel = new JSONModel();
                        var data = JSON.parse(xmlHttp.responseText);

                        oModel.setData(data);
                        oVizFrame.setModel(oModel);
                    }
                }
            }
            xmlHttp.send(null);

//      Set Viz properties
            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range()
                },
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Schaltvorgänge"
                }
            });
        },
        setPowerViz: function (from, to) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});
            var oVizFrame = this.getView().byId("vizPower");
            var oModel = new JSONModel();

            oVizFrame.setModel(oModel);
            /*oModel.attachRequestCompleted(function() {
                var data = oModel.getData();
                data.Power.forEach(function (elem) {
                    var dt   = parseInt(elem.Timestamp.substring(8,10));
                    var mon  = parseInt(elem.Timestamp.substring(6,8));
                    var yr   = parseInt(elem.Timestamp.substring(0,4));
                    var hr   = parseInt(elem.Timestamp.substring(11,13));
                    var min   = parseInt(elem.Timestamp.substring(14,16));
                    var sek   = parseInt(elem.Timestamp.substring(17,19));
                    MessageToast.show(hr+" "+min+" "+sek);
                    elem.Timestamp = new Date(yr, mon-1, dt, hr, min, sek).getTime();
                });
            });*/
            oModel.loadData(this.serviceHost+"power/sum/" + oDateFormat.format(from) + "/" + oDateFormat.format(to));
        },
        initPowerViz: function () {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizPower");
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});
            var now = new Date();
            var dateFromMS = now.getTime() - 604800000;
            var dateFrom = new Date(dateFromMS);
            this.byId("powDateTo").setDateValue(now);
            this.byId("powTimeTo").setDateValue(now);
            this.byId("powDateFrom").setDateValue(dateFrom);
            this.byId("powTimeFrom").setDateValue(dateFrom);
//      2.Create a JSON Model and set the data
            this.setPowerViz(dateFrom, now);
            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range(),
                    marker: {
                        visible: false
                    }
                },
               /* xAxis : {
                    scale : {
                        fixedRange : true,
                        minValue: 7274432000,
                        maxValue: now.getTime()
                    }
                },*/
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Gesamter Stromverbrauch der Anlage vom " + oDateFormat.format(dateFrom) + " - " + oDateFormat.format(now)
                }
            });
        },
        setHTemperatureViz: function (from, to) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});

            var oVizFrame = this.getView().byId("vizTemperature");
            var oModel = new JSONModel();

            oModel.loadData(this.serviceHost+"temperature/max/" + oDateFormat.format(from) + "/" + oDateFormat.format(to));
            oVizFrame.setModel(oModel);
        },
        initHTemperatureViz: function () {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizTemperature");
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});
            var now = new Date();
            var dateFromMS = now.getTime() - 604800000;
            var dateFrom = new Date(dateFromMS);
            this.byId("tempDateTo").setDateValue(now);
            this.byId("tempTimeTo").setDateValue(now);
            this.byId("tempDateFrom").setDateValue(dateFrom);
            this.byId("tempTimeFrom").setDateValue(dateFrom);

            this.setHTemperatureViz(dateFrom, now);
//      2.Create a JSON Model and set the data
            //var axis = new sap.viz.ui5.types.Axis().setScale(new sap.viz.ui5.types.Axis_scale().setMinValue(oDateFormat.format(dateFrom)).setMaxValue(oDateFormat.format(now)));
            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range()
                },
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Höchsttemperatur aller Leuchten vom " + oDateFormat.format(dateFrom) + " - " + oDateFormat.format(now)
                }
            });
        },
        initOperatingTimeViz: function () {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizOperatingTime");
//      2.Create a JSON Model and set the data
            var oModel = new JSONModel();

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", this.serviceHost+"operatingtime/last", true); // false for synchronous request
            xmlHttp.onload = function (e) {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        var data = JSON.parse(xmlHttp.responseText);
                        //Minuten auf Stunden bringen
                        data.OperatingTime.forEach(function (elem) {
                            elem.Value = parseInt(elem.Value / 60);
                        });

                        oModel.setData(data);
                        oVizFrame.setModel(oModel);
                    }
                }
            }
            xmlHttp.send(null);

            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range()
                },
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Laufzeiten aller Leuchten"
                }
            });
        },
        initLights: function () {
            var oModel = new JSONModel();
            oModel.loadData(this.serviceHost+"lights");
            this.byId("lightList").setModel(oModel);
        },
        initGroups: function () {
            var oModel = new JSONModel();
            oModel.loadData(this.serviceHost+"groups");
            this.byId("groupList").setModel(oModel);
        },
        setLTempViz: function (id, from, to) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});

            var oVizFrame = this.getView().byId("vizLTemp");
            var oModel = new JSONModel();
            var url = this.serviceHost+"temperature/" + id + "/" + oDateFormat.format(from) + "/" + oDateFormat.format(to);

            oModel.loadData(url);
            oVizFrame.setModel(oModel);
        },
        initLTemperatureViz: function (id) {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizLTemp");
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});
            var now = new Date();
            var dateFromMS = now.getTime() - 604800000;
            var dateFrom = new Date(dateFromMS);
            this.byId("tempDateToL").setDateValue(now);
            this.byId("tempTimeToL").setDateValue(now);
            this.byId("tempDateFromL").setDateValue(dateFrom);
            this.byId("tempTimeFromL").setDateValue(dateFrom);
//      2.Create a JSON Model and set the data
            this.setLTempViz(id, dateFrom, now);
            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range(),
                    marker:{
                        visible : false
                    }
                },
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Temperatur der Leuchte vom " + oDateFormat.format(dateFrom) + " - " + oDateFormat.format(now)
                }
            });
        },
        setLPowerViz: function (id, from, to) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});

            var oVizFrame = this.getView().byId("vizLPower");
            var oModel = new JSONModel();
            var url = this.serviceHost+"power/" + id + "/" + oDateFormat.format(from) + "/" + oDateFormat.format(to);
            oModel.loadData(url);
            oVizFrame.setModel(oModel);
        },
        initLPowerViz: function (id) {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizLPower");
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});
            var now = new Date();
            var dateFromMS = now.getTime() - 604800000;
            var dateFrom = new Date(dateFromMS);
            this.byId("powerDateToL").setDateValue(now);
            this.byId("powerTimeToL").setDateValue(now);
            this.byId("powerDateFromL").setDateValue(dateFrom);
            this.byId("powerTimeFromL").setDateValue(dateFrom);
//      2.Create a JSON Model and set the data
            this.setLPowerViz(id, dateFrom, now);
            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range(),
                    marker:{
                        visible : false
                    }
                },
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Stromverbrauch der Leuchte vom " + oDateFormat.format(dateFrom) + " - " + oDateFormat.format(now)
                }
            });
        },
        initLOverview: function (id) {

            var otMC = this.byId("otMC");
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", this.serviceHost+"operatingtime/last/" + id, true); // false for synchronous request

            xmlHttp.onload = function (e) {
                if (xmlHttp.readyState === 4) {

                    if (xmlHttp.status === 200) {
                        var oModel1 = new JSONModel();
                        var data = JSON.parse(xmlHttp.responseText);
                        //Minuten auf Stunden bringen
                        data.OperatingTime.forEach(function (elem) {
                            elem.Value = parseInt(elem.Value / 60);
                        });

                        oModel1.setData(data);
                        otMC.setModel(oModel1);
                    }
                }
            };
            xmlHttp.send(null);

            var xmlHttp2 = new XMLHttpRequest();
            var scMC = this.byId("scMC");
            xmlHttp2.open("GET", this.serviceHost+"switchcount/last/" + id, true); // false for synchronous request

            xmlHttp2.onload = function (e) {
                if (xmlHttp2.readyState === 4) {

                    if (xmlHttp2.status === 200) {
                        var oModel2 = new JSONModel();
                        var data = JSON.parse(xmlHttp2.responseText);
                        oModel2.setData(data);
                        scMC.setModel(oModel2);
                    }
                }
            };
            xmlHttp2.send(null);
        },
        initGOperatingTimeViz: function (id) {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizOperatingTimeG");
//      2.Create a JSON Model and set the data
            var oModel = new JSONModel();

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", this.serviceHost+"operatingtime/last/group/" + id, true); // false for synchronous request
            xmlHttp.onload = function (e) {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        var data = JSON.parse(xmlHttp.responseText);
                        //Minuten auf Stunden bringen
                        data.OperatingTime.forEach(function (elem) {
                            elem.Value = parseInt(elem.Value / 60);
                        });

                        oModel.setData(data);
                        oVizFrame.setModel(oModel);
                    }
                }
            }
            xmlHttp.send(null);

            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range()
                },
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Laufzeiten der Leuchten"
                }
            });
        },
        initGSwitchCountViz: function (id) {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizSwitchCountG");
//      2.Create a JSON Model and set the data

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", this.serviceHost+"switchcount/last/group/" + id, true); // false for synchronous request
            xmlHttp.onload = function (e) {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        var oModel = new JSONModel();
                        var data = JSON.parse(xmlHttp.responseText);

                        oModel.setData(data);
                        oVizFrame.setModel(oModel);
                    }
                }
            }
            xmlHttp.send(null);

//      Set Viz properties
            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range()
                },
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Schaltvorgänge"
                }
            });
        },
        setGHTemperatureViz: function (id, from, to) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});

            var oVizFrame = this.getView().byId("vizTemperatureG");
            var oModel = new JSONModel();

            oModel.loadData(this.serviceHost+"temperature/max/group/"+ id + "/" + oDateFormat.format(from) + "/" + oDateFormat.format(to));
            oVizFrame.setModel(oModel);
        },
        initGHTemperatureViz : function (id) {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizTemperature");
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});
            var now = new Date();
            var dateFromMS = now.getTime() - 604800000;
            var dateFrom = new Date(dateFromMS);
            this.byId("tempDateToG").setDateValue(now);
            this.byId("tempTimeToG").setDateValue(now);
            this.byId("tempDateFromG").setDateValue(dateFrom);
            this.byId("tempTimeFromG").setDateValue(dateFrom);

            this.setGHTemperatureViz(id, dateFrom, now);
//      2.Create a JSON Model and set the data
            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range()
                },
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Höchsttemperatur der Leuchten vom " + oDateFormat.format(dateFrom) + " - " + oDateFormat.format(now)
                }
            });
        },
        setGPowerViz: function (id, from, to) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});
            var oVizFrame = this.getView().byId("vizPowerG");
            var oModel = new JSONModel();

            oVizFrame.setModel(oModel);
            oModel.loadData(this.serviceHost+"power/sum/group/"+ id + "/" + oDateFormat.format(from) + "/" + oDateFormat.format(to));
        },
        initGPowerViz: function (id) {
            //      1.Get the id of the VizFrame
            var oVizFrame = this.getView().byId("vizPowerG");
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd HH:mm:ss"});
            var now = new Date();
            var dateFromMS = now.getTime() - 604800000;
            var dateFrom = new Date(dateFromMS);
            this.byId("powDateToG").setDateValue(now);
            this.byId("powTimeToG").setDateValue(now);
            this.byId("powDateFromG").setDateValue(dateFrom);
            this.byId("powTimeFromG").setDateValue(dateFrom);
//      2.Create a JSON Model and set the data
            this.setGPowerViz(id, dateFrom, now);
            oVizFrame.setVizProperties({
                legend: {
                    title: {
                        visible: false
                    }
                },
                plotArea: {
                    colorPalette: d3.scale.category20().range(),
                    marker:{
                        visible : false
                    }
                },
                valueAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    text: "Gesamter Stromverbrauch der Gruppe vom " + oDateFormat.format(dateFrom) + " - " + oDateFormat.format(now)
                }
            });
        },
        htempChange: function (e) {
            var to = new Date();
            var dFrom = this.byId("tempDateFrom").getDateValue();
            var tFrom = this.byId("tempTimeFrom").getDateValue();
            var dTo = this.byId("tempDateTo").getDateValue();
            var tTo = this.byId("tempTimeTo").getDateValue();
            var from = new Date();
            from.setDate(dFrom.getDate());
            from.setMonth(dFrom.getMonth());
            from.setFullYear(dFrom.getFullYear());

            from.setSeconds(tFrom.getSeconds());
            from.setMinutes(tFrom.getMinutes());
            from.setHours(tFrom.getHours());

            to.setDate(dTo.getDate());
            to.setMonth(dTo.getMonth());
            to.setFullYear(dTo.getFullYear());

            to.setSeconds(tTo.getSeconds());
            to.setMinutes(tTo.getMinutes());
            to.setHours(tTo.getHours());

            this.setHTemperatureViz(from, to);
        },
        powerChange: function (e) {
            var to = new Date();
            var dFrom = this.byId("powDateFrom").getDateValue();
            var tFrom = this.byId("powTimeFrom").getDateValue();
            var dTo = this.byId("powDateTo").getDateValue();
            var tTo = this.byId("powTimeTo").getDateValue();
            var from = new Date();
            from.setDate(dFrom.getDate());
            from.setMonth(dFrom.getMonth());
            from.setFullYear(dFrom.getFullYear());

            from.setSeconds(tFrom.getSeconds());
            from.setMinutes(tFrom.getMinutes());
            from.setHours(tFrom.getHours());

            to.setDate(dTo.getDate());
            to.setMonth(dTo.getMonth());
            to.setFullYear(dTo.getFullYear());

            to.setSeconds(tTo.getSeconds());
            to.setMinutes(tTo.getMinutes());
            to.setHours(tTo.getHours());

            this.setPowerViz(from, to);
        },
        gHTempChange: function (e) {
            var to = new Date();
            var dFrom = this.byId("tempDateFromG").getDateValue();
            var tFrom = this.byId("tempTimeFromG").getDateValue();
            var dTo = this.byId("tempDateToG").getDateValue();
            var tTo = this.byId("tempTimeToG").getDateValue();
            var from = new Date();
            from.setDate(dFrom.getDate());
            from.setMonth(dFrom.getMonth());
            from.setFullYear(dFrom.getFullYear());

            from.setSeconds(tFrom.getSeconds());
            from.setMinutes(tFrom.getMinutes());
            from.setHours(tFrom.getHours());

            to.setDate(dTo.getDate());
            to.setMonth(dTo.getMonth());
            to.setFullYear(dTo.getFullYear());

            to.setSeconds(tTo.getSeconds());
            to.setMinutes(tTo.getMinutes());
            to.setHours(tTo.getHours());
            var gId = this.byId("groupDetail").data("gId");
            this.setGHTemperatureViz(gId, from, to);
        },
        gPowerChange: function (e) {
            var to = new Date();
            var dFrom = this.byId("powDateFromG").getDateValue();
            var tFrom = this.byId("powTimeFromG").getDateValue();
            var dTo = this.byId("powDateToG").getDateValue();
            var tTo = this.byId("powTimeToG").getDateValue();
            var from = new Date();
            from.setDate(dFrom.getDate());
            from.setMonth(dFrom.getMonth());
            from.setFullYear(dFrom.getFullYear());

            from.setSeconds(tFrom.getSeconds());
            from.setMinutes(tFrom.getMinutes());
            from.setHours(tFrom.getHours());

            to.setDate(dTo.getDate());
            to.setMonth(dTo.getMonth());
            to.setFullYear(dTo.getFullYear());

            to.setSeconds(tTo.getSeconds());
            to.setMinutes(tTo.getMinutes());
            to.setHours(tTo.getHours());
            var gId = this.byId("groupDetail").data("gId");
            this.setGPowerViz(gId, from, to);
        },
        lTempChange: function (e) {
            var to = new Date();
            var dFrom = this.byId("tempDateFromL").getDateValue();
            var tFrom = this.byId("tempTimeFromL").getDateValue();
            var dTo = this.byId("tempDateToL").getDateValue();
            var tTo = this.byId("tempTimeToL").getDateValue();
            var from = new Date();
            from.setDate(dFrom.getDate());
            from.setMonth(dFrom.getMonth());
            from.setFullYear(dFrom.getFullYear());

            from.setSeconds(tFrom.getSeconds());
            from.setMinutes(tFrom.getMinutes());
            from.setHours(tFrom.getHours());

            to.setDate(dTo.getDate());
            to.setMonth(dTo.getMonth());
            to.setFullYear(dTo.getFullYear());

            to.setSeconds(tTo.getSeconds());
            to.setMinutes(tTo.getMinutes());
            to.setHours(tTo.getHours());
            var id = this.byId("lightDetail").data("id");
            this.setLTempViz(id, from, to);
        },
        lPowerChange: function (e) {
            var to = new Date();
            var dFrom = this.byId("powerDateFromL").getDateValue();
            var tFrom = this.byId("powerTimeFromL").getDateValue();
            var dTo = this.byId("powerDateToL").getDateValue();
            var tTo = this.byId("powerTimeToL").getDateValue();
            var from = new Date();
            from.setDate(dFrom.getDate());
            from.setMonth(dFrom.getMonth());
            from.setFullYear(dFrom.getFullYear());

            from.setSeconds(tFrom.getSeconds());
            from.setMinutes(tFrom.getMinutes());
            from.setHours(tFrom.getHours());

            to.setDate(dTo.getDate());
            to.setMonth(dTo.getMonth());
            to.setFullYear(dTo.getFullYear());

            to.setSeconds(tTo.getSeconds());
            to.setMinutes(tTo.getMinutes());
            to.setHours(tTo.getHours());

            var id = this.byId("lightDetail").data("id");
            this.setLPowerViz(id, from, to);
        }
    });
    return CController;
});
