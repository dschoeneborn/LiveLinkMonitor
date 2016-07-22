<?php

define("NEXTL", "</br>");

define("MYSQL_HOST", "rdbms.strato.de");
define("MYSQL_USER", "U2584476");
define("MYSQL_PW", "livelink123");
define("MYSQL_DB", "DB2584476");

$client_data = "";

// Check connection
try {
    $conn = new PDO("mysql:host=" . MYSQL_HOST . ";dbname=" . MYSQL_DB, MYSQL_USER, MYSQL_PW);
// set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully </br>";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . NEXTL;
}


if (getenv('REQUEST_METHOD') == 'POST') {
    $client_data = file_get_contents("php://input");
}
echo "Client_Data_raw: </br>" . $client_data . NEXTL;


$decoded = (json_decode($client_data));
print_r($decoded);
echo NEXTL;
print_r($decoded->{'rest/devices/lights'});
echo NEXTL;

//timestamp erzeugen
$timestamp = time();
echo $timestamp . NEXTL;

//Wie viele Leuchten gibt es unter Lights?
$number = (count($decoded->{'rest/devices/lights'}->devices));
echo $number;
echo NEXTL;
for ($i = 0; $i < $number; $i++) {
//Nur reale Leuchten, keine virtuellen einbeziehen, auskommentiert für firmware ohne virtuelle Leuchten
//if($decoded->{'rest/devices/lights'}->devices[$i]->virtual != 1 && $decoded->{'rest/devices/lights'}->devices[$i]->visible == 1 ) {
//Energiedaten
    //Leuchten Id holen
    $leuchtenId = ($decoded->{'rest/devices/lights'}->devices[$i]->id);
//                      echo $leuchtenId;
//                      echo "\n";
    //Schaltungen der Leuchten holen
    $switchWert = $decoded->{"rest/devices/lights/" . $leuchtenId . "/statistic"}->switchCount->current->value;
//                      print_r ($switchWert);               
//                      echo "\n";
    //Betriebszeit der Leuchten holen
    $timeWert = $decoded->{"rest/devices/lights/" . $leuchtenId . "/statistic"}->operatingTime->current->value;
//                      print_r ($timeWert);               
//                      echo "\n";
    //Energiedaten der Leuchten holen
    $energieWert = $decoded->{"rest/devices/lights/" . $leuchtenId . "/statistic"}->power->current->value;
//                      print_r ($energieWert);               
//                      echo "\n";
    //Temperatur der Leuchten holen
    $temperaturWert = $decoded->{"rest/devices/lights/" . $leuchtenId . "/statistic"}->temperature->current->value;
//                      print_r ($temperaturWert);               
//                      echo "\n";
    //Gruppendaten der Leuchten holen
    $gruppeWert = $decoded->{"rest/devices/lights/" . $leuchtenId}->groups[0]->name;
//                      print_r ($gruppeWert);               
//                      echo "\n";
//Ab in die Datenbank
    try {
        $statement = $conn->prepare("INSERT INTO Leuchtendaten (lightId, timestamp, switchCount, operatingTime, power, temperature, ) VALUES (?, ?, ?, ?)");
        $statement->execute(array($leuchtenId, $timestamp, $switchWert, $timeWert, $energieWert, $temperaturWert, $gruppeWert));
        echo "Insertion successfully with insertion: " . $timestamp;
    } catch (Exception $e) {
        echo "Insertion failed: " . $e->getMessage();
    }


//}         Noch vom If der virtuellen Leuchten über                               
    //Virtuelle Leuchten behandeln
    /*
      if($decoded->rest->rest->{'rest/devices/lights'}->devices[$i]->virtual == 1 && $decoded->rest->rest->{'rest/devices/lights'}->devices[$i]->visible == 1 ) {
      //Leuchten Id der virtuellen Leuchten holen
      $leuchtenId = ($decoded->rest->rest->{'rest/devices/lights'}->devices[$i]->id);
      //echo $leuchtenId;
      //Farbtemperatur der virtuellen Leuchten holen
      $farbtemperaturWert=$decoded->rest->rest->{"rest/devices/lights/".$leuchtenId."/colorcontrol"}->colorTemperature->value;
      echo $farbtemperaturWert;
      //echo "\n";
      //timestamp erzeugen
      $timestamp=time();
      //Ab in die Datenbank
      $statement = $pdo->prepare("INSERT INTO Leuchtendaten (name, timestamp, cct) VALUES (?, ?, ?)");
      $statement->execute(array($leuchtenId, $timestamp, $farbtemperaturWert));
      } */
}
//Datenbank Verbindung schließen
$conn = null;
?>