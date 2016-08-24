-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 10. Aug 2016 um 16:11
-- Server-Version: 5.7.13-0ubuntu0.16.04.2
-- PHP-Version: 7.0.8-0ubuntu0.16.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `livelink`
--
CREATE DATABASE IF NOT EXISTS `livelink` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `livelink`;

DELIMITER $$
--
-- Funktionen
--
CREATE DEFINER=`dev`@`%` FUNCTION `getLastOperatingTimeFromLight` (`id` CHAR(36)) RETURNS INT(11) NO SQL
  BEGIN
    DECLARE a INT;
    SELECT Value
    INTO a
    FROM OperatingTime
    WHERE Light_ID = id
    ORDER BY Timestamp DESC
    LIMIT 0,1;
    return a;
  END$$

CREATE DEFINER=`dev`@`%` FUNCTION `getLastPowerFromLight` (`id` CHAR(36)) RETURNS DOUBLE NO SQL
  BEGIN
    DECLARE a DOUBLE;
    SELECT Value
    INTO a
    FROM Power
    WHERE Light_iD = id
    ORDER BY Timestamp DESC
    LIMIT 0,1;
    return a;
  END$$

CREATE DEFINER=`dev`@`%` FUNCTION `getLastSwitchCountFromLight` (`id` CHAR(36)) RETURNS INT(11) NO SQL
  BEGIN
    DECLARE a INT;
    SELECT Value
    INTO a
    FROM SwitchCount
    WHERE Light_iD = id
    ORDER BY Timestamp DESC
    LIMIT 0,1;
    return a;
  END$$

CREATE DEFINER=`dev`@`%` FUNCTION `getLastTemperatureFromLight` (`id` CHAR(36)) RETURNS DOUBLE NO SQL
  BEGIN
    DECLARE a DOUBLE;
    SELECT Value
    INTO a
    FROM Temperature
    WHERE Light_iD = id
    ORDER BY Timestamp DESC
    LIMIT 0,1;
    return a;
  END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Groups`
--

CREATE TABLE `Groups` (
  `ID` char(36) NOT NULL,
  `Name` varchar(20) DEFAULT NULL,
  `Type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Stellvertreter-Struktur des Views `Last_Values`
--
CREATE TABLE `Last_Values` (
   `ID` char(36)
  ,`OperatingTime` int(11)
  ,`SwitchCount` int(11)
  ,`Power` double
  ,`Temperature` double
);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Lights`
--

CREATE TABLE `Lights` (
  `ID` char(36) NOT NULL,
  `Name` varchar(20) DEFAULT NULL,
  `Virtual` char(1) DEFAULT NULL,
  `Type` varchar(20) DEFAULT NULL,
  `Group_ID` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `OperatingTime`
--

CREATE TABLE `OperatingTime` (
  `Light_ID` char(36) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Value` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Power`
--

CREATE TABLE `Power` (
  `Light_ID` char(36) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Value` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `SwitchCount`
--

CREATE TABLE `SwitchCount` (
  `Light_ID` char(36) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Value` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Temperature`
--

CREATE TABLE `Temperature` (
  `Light_ID` char(36) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Value` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur des Views `Last_Values`
--
DROP TABLE IF EXISTS `Last_Values`;

CREATE ALGORITHM=UNDEFINED DEFINER=`dev`@`%` SQL SECURITY DEFINER VIEW `Last_Values`  AS  select `l`.`ID` AS `ID`,`getLastOperatingTimeFromLight`(`l`.`ID`) AS `OperatingTime`,`getLastSwitchCountFromLight`(`l`.`ID`) AS `SwitchCount`,`getLastPowerFromLight`(`l`.`ID`) AS `Power`,`getLastTemperatureFromLight`(`l`.`ID`) AS `Temperature` from `Lights` `l` ;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `Groups`
--
ALTER TABLE `Groups`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Groups_ID_uindex` (`ID`);

--
-- Indizes für die Tabelle `Lights`
--
ALTER TABLE `Lights`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Lights_ID_uindex` (`ID`),
  ADD KEY `Lights_Groups_ID_fk` (`Group_ID`);

--
-- Indizes für die Tabelle `OperatingTime`
--
ALTER TABLE `OperatingTime`
  ADD PRIMARY KEY (`Light_ID`,`Timestamp`);

--
-- Indizes für die Tabelle `Power`
--
ALTER TABLE `Power`
  ADD PRIMARY KEY (`Light_ID`,`Timestamp`);

--
-- Indizes für die Tabelle `SwitchCount`
--
ALTER TABLE `SwitchCount`
  ADD PRIMARY KEY (`Light_ID`,`Timestamp`);

--
-- Indizes für die Tabelle `Temperature`
--
ALTER TABLE `Temperature`
  ADD PRIMARY KEY (`Light_ID`,`Timestamp`);

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `Lights`
--
ALTER TABLE `Lights`
  ADD CONSTRAINT `Lights_Groups_ID_fk` FOREIGN KEY (`Group_ID`) REFERENCES `Groups` (`ID`);

--
-- Constraints der Tabelle `OperatingTime`
--
ALTER TABLE `OperatingTime`
  ADD CONSTRAINT `OperatingTime_Lights_ID_fk` FOREIGN KEY (`Light_ID`) REFERENCES `Lights` (`ID`);

--
-- Constraints der Tabelle `Power`
--
ALTER TABLE `Power`
  ADD CONSTRAINT `Power_Lights_ID_fk` FOREIGN KEY (`Light_ID`) REFERENCES `Lights` (`ID`);

--
-- Constraints der Tabelle `SwitchCount`
--
ALTER TABLE `SwitchCount`
  ADD CONSTRAINT `SwitchCount_Lights_ID_fk` FOREIGN KEY (`Light_ID`) REFERENCES `Lights` (`ID`);

--
-- Constraints der Tabelle `Temperature`
--
ALTER TABLE `Temperature`
  ADD CONSTRAINT `Temperature_Lights_ID_fk` FOREIGN KEY (`Light_ID`) REFERENCES `Lights` (`ID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
