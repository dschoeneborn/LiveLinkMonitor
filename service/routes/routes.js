var appRouter = function(app) {
    this.lldb = require('./livelink_DB');
    this.connect = new this.lldb("localhost", "dev", "devui5", "livelink");

    app.get("/lights/lastvalues", function(req, res) {
        var sql = "SELECT ID AS Light, OperatingTime AS Value FROM Last_Values";
        this.connect.responseQuery(sql, "OperatingTime", res);
    });
}

module.exports = appRouter;