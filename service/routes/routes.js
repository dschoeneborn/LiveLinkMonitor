
var appRouter = function(app) {
    this.self = this;
    this.lldb = require('./livelink_DB');
    this.connect = new this.lldb("localhost", "dev", "devui5", "livelink");

    app.get("/lights/last", function(req, res) {
        var sql = "SELECT ID AS Light, OperatingTime AS Value FROM Last_Values";

        self.connect.responseQuery(sql, "OperatingTime", res);
    });

    app.get("/groups/:id/operatingtime/last/", function(req, res) {
        var sql = "SELECT lv.ID AS Light, lv.OperatingTime AS Value "
        +"FROM Last_Values lv, Lights l "
        +"WHERE lv.ID = l.ID "
        +"AND l.Group_ID = '" + req.params.id + "'";

        self.connect.responseQuery(sql, "OperatingTime", res);
    });

    app.get("/lights/:id/operatingtime/last", function(req, res) {
        var sql = "SELECT ID, OperatingTime AS Value FROM Last_Values WHERE ID='" + req.params.id + "'";

        self.connect.responseQuery(sql, "OperatingTime", res);
    });

//TODO: {"OperatingTime": undefined} fixen
    app.get("/lights/temperature/:from/:to/max", function(req, res) {
        var sql = "SELECT t.Light_ID AS Light, max(t.Value) AS Value, t.Timestamp AS Time "
        +"FROM Temperature t "
        +"WHERE Timestamp BETWEEN '" + req.params.from + "' AND '" + req.params.to + "' "
        +"GROUP BY t.Light_ID";

        self.connect.responseQuery(sql, "Temperature", res);
    });

    app.get("/groups/:id/temperature/:from/:to/max", function(req, res) {
        var sql = "SELECT l.ID AS Light, max(t.Value) AS Value "
        +"FROM Temperature t, Lights l "
        +"WHERE l.Group_ID = '" + req.params.id +"' "
        +"AND t.Timestamp BETWEEN '" + req.params.from + "' AND '" + req.params.to + "' "
        +"GROUP BY l.ID";

        self.connect.responseQuery(sql, "Temperature", res);
    });

    app.get("/lights/:id/temperature/:from/:to", function(req, res) {
        var sql = "SELECT t.Value AS Value, t.Timestamp "
        +"FROM Temperature t "
        +"WHERE Timestamp BETWEEN '" + req.params.from + "' AND '" + req.params.to + "' "
        +"AND Light_ID = '" + req.params.id + "'";

        self.connect.responseQuery(sql, "Temperature", res);
    });
};

module.exports = appRouter;