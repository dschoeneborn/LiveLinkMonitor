var appRouter = function(app) {
    this.lldb = require('./livelink_DB');
    this.connect = new this.lldb("localhost", "dev", "devui5", "livelink");

    app.get("/lights/lastvalues", function(req, res) {
        var sql = "SELECT ID AS Light, OperatingTime AS Value FROM Last_Values";

        this.connect.responseQuery(sql, "OperatingTime", res);
    });

    app.get("/group/:id/operatingtime/last/", function(req, res) {
        var sql = "SELECT lv.ID AS Light, lv.OperatingTime AS Value "
        +"FROM Last_Values lv, Lights l "
        +"WHERE lv.ID = l.ID "
        +"AND l.Group_ID = '" + req.params.id + "'";

        this.connect.responseQuery(sql, "OperatingTime", res);
    });

    app.get("/light/:id/operatingtime/last", function(req, res) {
        var sql = "SELECT ID, OperatingTime AS Value FROM Last_Values WHERE ID='" + req.params.id + "'";

        this.connect.responseQuery(sql, "OperatingTime", res);
    });
}

module.exports = appRouter;