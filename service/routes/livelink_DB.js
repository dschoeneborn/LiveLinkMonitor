/**
 * Created by 012789 on 28.07.2016.
 */
var lldb = function LiveLink_DB(host, user, pw, db) {
    this.hos = host;
    this.use = user;
    this.pw = pw;
    this.db = db;
    this.connection = undefined;



    this.connectWithDB = function () {
        var mysql = require('mysql');
        this.connection = mysql.createConnection({
            host     : this.hos,
            user     : this.use,
            password : this.pw,
            database : this.db
        });

        this.connection.connect(function (err) {
            if(err){
                console.error('error connecting: ' + err.stack);
            }
        });
    };
    this.connectWithDB();
    this.responseQuery = function (sql, topic, res) {
        var json = '';
        this.connection.query(sql, function (err, rows, fields) {
            json = JSON.stringify(rows);

            var result = '{"' + topic + '": ' + json + '}';
            console.log(result);
            res.send(result);
        });
    };

};

module.exports = lldb;