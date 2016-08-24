# TriluxLiveLinkMonitor
Ermöglicht das Monitoring einer LiveLink Anlage.
* Laufzeit
* Höchsttemperatur
* Temperatur
* Stromverbrauch
* Schaltvorgänge

##Installation
1. Import database.sql in mySQL Database
2. Replace `serviceHost : "http://txui5t01..."` with your host
3. Let push your data from LiveLink-Controller to `cloud/connector.php` or `cloud/connector_nofilter.php`