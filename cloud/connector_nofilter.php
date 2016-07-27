<?php
require_once 'Light.php';
//Datenbankkonfiguration
define("MYSQL_HOST", "localhost");
define("MYSQL_USER", "dev");
define("MYSQL_PW", "devui5");
define("MYSQL_DB", "livelink");

define("NEXTL", "</br>");

$client_data = "";

//Datenbankverbindung aufbauen
$conn = createDBConnection(MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB);

//JSON Daten aus POST holen
if (getenv('REQUEST_METHOD') == 'POST') {
    echo "POST empfangen" . NEXTL;
    $client_data = file_get_contents("php://input");
}
//Konvertiert JSON in assoziatives Array
$decoded = (json_decode($client_data));
//Erstellt Timestamp
$timestamp = date("Y-m-d H:i:s");
echo "Timestamp: " . $timestamp . " ertsellt" . NEXTL;
$lightCount = (count($decoded->{'rest/devices/lights'}->devices));

echo NEXTL;
if ($lightCount <= 0) {
    echo "Es wurden keine Leuchten übergeben" . NEXTL;
}
//Für jede Leuchte
for ($i = 0; $i < $lightCount; $i++) {
    echo "Light NR: " . $i . NEXTL;
    //Konvertiert Leuchtendaten aus JSON in Objekt
    $light = new Light();
    $light->id = ($decoded->{'rest/devices/lights'}->devices[$i]->id);
    $light->name = ($decoded->{'rest/devices/lights'}->devices[$i]->name);
    $light->setOperatingTime($decoded->{"rest/devices/lights/" . $light->id . "/statistic"}->operatingTime->value);
    $light->setSwitchCount($decoded->{"rest/devices/lights/" . $light->id . "/statistic"}->switchCount->value);
    $light->setPower($decoded->{"rest/devices/lights/" . $light->id . "/statistic"}->power->current->value);
    $light->setTemperature($decoded->{"rest/devices/lights/" . $light->id . "/statistic"}->temperature->current->value);
    $light->groupName = $decoded->{"rest/devices/lights/" . $light->id}->groups[0]->name;
    $light->groupId = $decoded->{"rest/devices/lights/" . $light->id}->groups[0]->id;

    echo "Übergebene Leuchte: " . NEXTL;
    $light->printInfos();
    echo NEXTL;
    //Statement zur Abfrage der letzten abgespeicherten Leuchtendaten
    $sql = 'SELECT * FROM Last_Values WHERE ID = "' . $light->id . '"';
    //echo $sql . NEXTL;
    //Query absetzen
    $result = $conn->query($sql);
    $lastLight = new Light();
    if ($result->num_rows == 1) {
        //Konvertiert letzte Leuchtendaten in ein Objekt
        $row = $result->fetch_array();
        $lastLight->id = $light->id;
        $lastLight->setOperatingTime($row["OperatingTime"]);
        $lastLight->setPower($row["Power"]);
        $lastLight->setSwitchCount($row["SwitchCount"]);
        $lastLight->setTemperature($row["Temperature"]);

        echo "Die Leuchte in der DB: " . NEXTL;
        $lastLight->printInfos();

        //echo sprintf("OperatingTime: %s </br>Power: %s</br>SwitchCount: %s</br>Temperature: %s </br>", $lastOperatingTime, $lastPower, $lastSwitchCount, $lastTemperature);
    } else if ($result->num_rows == 0) {
        echo "Leuchte noch nicht in Datenbank" . NEXTL;
        //Wenn keine Daten gefunden, lege Leuchte an
        if (!$light->isInDB($conn)) {
            $light->putMetaInDB($conn);
        }
    }

    //Füge neuen Datenzeitpunkt ein

    $light->updateOperatingTime($conn, $timestamp);
    $light->updatePower($conn, $timestamp);
    $light->updateSwitchCount($conn, $timestamp);
    $light->updateTemperature($conn, $timestamp);

    echo NEXTL;
    echo NEXTL;
    echo NEXTL;
}

//Datenbank Verbindung schließen
$conn = null;

function createDBConnection($host, $user, $pw, $db)
{
    // Create connection
    $conn = new mysqli($host, $user, $pw, $db);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        echo "DB Conection successed" . NEXTL;
        return $conn;
    }
}

?>