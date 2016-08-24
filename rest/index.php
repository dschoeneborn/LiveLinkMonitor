<?php
require_once __DIR__.'/vendor/autoload.php';
require_once 'LiveLink_DB.php';

//Datenbankkonfiguration
define("MYSQL_HOST", "localhost");
define("MYSQL_USER", "dev");
define("MYSQL_PW", "devui5");
define("MYSQL_DB", "livelink");

$app = new Silex\Application();
//
$app->get('/operatingtime/last', function () {
    $sql = "SELECT ID AS Light, OperatingTime AS Value FROM Last_Values";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "OperatingTime");

    return $json;
});
//
$app->get('/operatingtime/last/group/{id}', function ($id) {

    $sql = "SELECT lv.ID AS Light, lv.OperatingTime AS Value
        FROM Last_Values lv, Lights l
        WHERE lv.ID = l.ID
        AND l.Group_ID = '" . $id . "'";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "OperatingTime");

    return $json;
});
//
$app->get('/operatingtime/last/{id}', function ($id) {

    $sql = "SELECT ID, OperatingTime AS Value FROM Last_Values WHERE ID='" . $id . "'";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "OperatingTime");
    
    return $json;
});
//
$app->get('/temperature/max/{from}/{to}', function ($from, $to) {
    $sql = "SELECT t.Light_ID AS Light, max(t.Value) AS Value, t.Timestamp AS Time
        FROM Temperature t
        WHERE Timestamp BETWEEN '" . $from . "' AND '" . $to . "'
        GROUP BY t.Light_ID";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "Temperature");

    return $json;
});
//
$app->get('/temperature/max/group/{id}/{from}/{to}', function ($id, $from, $to) {
    $sql = "SELECT l.ID AS Light, max(t.Value) AS Value
      FROM Temperature t, Lights l
      WHERE l.Group_ID = '" . $id ."'
      AND t.Timestamp BETWEEN '" . $from . "' AND '" . $to . "'
      GROUP BY l.ID";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "Temperature");

    return $json;
});
//
$app->get('/temperature/{id}/{from}/{to}', function ($id, $from, $to) {
    $sql = "SELECT t.Value AS Value, t.Timestamp
        FROM Temperature t
        WHERE Timestamp BETWEEN '" . $from . "' AND '" . $to . "'
        AND Light_ID = '" . $id . "'";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "Temperature");

    return $json;
});
//
$app->get('/power/sum/{from}/{to}', function ($from, $to) {
    $sql = "SELECT Timestamp, sum(Value) AS Value
        FROM Power
        WHERE Timestamp BETWEEN '" . $from . "' AND '" . $to . "'
        GROUP BY Timestamp";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "Power");

    return $json;
});
//
$app->get('/power/sum/group/{id}/{from}/{to}', function ($id, $from, $to) {
    $sql = "SELECT p.Timestamp, sum(p.Value) AS Value
        FROM Power p, Lights l
        WHERE Timestamp BETWEEN '" . $from . "' AND '" . $to . "'
        AND l.Group_ID = '" . $id . "'
        GROUP BY Timestamp";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "Power");

    return $json;
});
//
$app->get('/power/{id}/{from}/{to}', function ($id, $from, $to) {
    $sql = "SELECT t.Value AS Value, t.Timestamp
        FROM Power t
        WHERE Timestamp BETWEEN '" . $from . "' AND '" . $to . "'
        AND Light_ID = '" . $id . "'";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "Power");

    return $json;
});
//
$app->get('/switchcount/last', function () {
    $sql = "SELECT ID AS Light, SwitchCount AS Value FROM Last_Values";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "SwitchCount");
    
    return $json;
});
//
$app->get('/switchcount/last/group/{id}', function ($id) {
    $sql = "SELECT lv.ID AS Light, lv.SwitchCount AS Value
        FROM Last_Values lv, Lights l
        WHERE lv.ID = l.ID
        AND l.Group_ID = '" . $id . "'";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "SwitchCount");
    
    return $json;
});
//
$app->get('/switchcount/last/{id}', function ($id) {
    $sql = "SELECT ID, SwitchCount AS Value FROM Last_Values WHERE ID='" . $id . "'";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "SwitchCount");
    
    return $json;
});

$app->get('/lights', function () {
    $sql = "SELECT ID, Group_ID FROM Lights";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "Lights");

    
    return $json;
});

$app->get('/groups', function () {
    $sql = "SELECT ID, Name FROM Groups";

    $ll = new LiveLink_DB(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);
    $json = $ll->getJSONFromSelect($sql, "Groups");
    
    return $json;
});

$app->run();
