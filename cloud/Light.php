<?php

/**
 * Description of Light
 *
 * @author 012789
 */
class Light {
    public $id;
    public $name;
    public $type = "onofflight";
    public $groupName;
    public $groupId;
    public $groupType = "onofflight";
    public $virtual=0;
    
    private $operatingTime = null;
    private $switchCount = null;
    private $power = null;
    private $temperature = null;
    
    public function updateOperatingTime($conn, $timestamp) {
        $sql = sprintf("INSERT INTO OperatingTime (Light_ID, Timestamp, Value) "
                . "VALUES('%s', '%s', '%s')", $this->id, $timestamp, $this->operatingTime);
        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully</br>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    
    public function updateSwitchCount($conn, $timestamp) {
        $sql = sprintf("INSERT INTO SwitchCount (Light_ID, Timestamp, Value) "
                . "VALUES('%s', '%s', '%s')", $this->id, $timestamp, $this->switchCount);
        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully</br>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    
    public function updatePower($conn, $timestamp) {
        $sql = sprintf("INSERT INTO Power (Light_ID, Timestamp, Value) "
                . "VALUES('%s', '%s', '%s')", $this->id, $timestamp, $this->power);
        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully</br>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    
    public function updateTemperature($conn, $timestamp) {
        $sql = sprintf("INSERT INTO Temperature (Light_ID, Timestamp, Value) "
                . "VALUES('%s', '%s', '%s')", $this->id, $timestamp, $this->temperature);
        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully</br>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    
    public function updateAll($conn, $timestamp)
    {
        $this->updateOperatingTime($conn, $timestamp);
        $this->updatePower($conn, $timestamp);
        $this->updateSwitchCount($conn, $timestamp);
        $this->updateTemperature($conn, $timestamp);        
    }
    
    public function isInDB($conn) {
        $sql = 'SELECT ID FROM Lights WHERE ID = "' . $this->id . '"';
        //Query absetzen
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    
    public function putMetaInDB($conn) {
        if(!$this->isGroupInDB($conn))
        {
            $this->putGroupMetaInDB($conn);
        }
        $sql = sprintf("INSERT INTO Lights (ID, Name, Virtual, Type, Group_ID) "
                . "VALUES('%s', '%s', '%s', '%s', '%s')", $this->id, $this->name, $this->virtual, $this->type, $this->groupId);
        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully</br>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    
    private function isGroupInDB($conn)
    {
        $sql = 'SELECT ID FROM Groups WHERE ID = "' . $this->groupId . '"';
        //Query absetzen
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    
    private function putGroupMetaInDB($conn)
    {
        $sql = sprintf("INSERT INTO Groups (ID, Name, Type) "
                . "VALUES('%s', '%s', '%s')", $this->groupId, $this->groupName, $this->groupType);
        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully</br>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    
    public function printInfos()
    {
        echo "ID: " . $this->id . "</br>";
        echo "Name: " . $this->name . "</br>";
        echo "GroupID: : " . $this->groupId . "</br>";
        
        echo "OperatingTime: " . $this->operatingTime . "</br>";
        echo "SwitchCount: " . $this->switchCount . "</br>";
        echo "Power: " . $this->power . "</br>";
        echo "Temperature: " . $this->temperature. "</br>";
    }
    
    public function setPower($power)
    {
        if($power === NULL)
        {
            $this->power = NULL;
        }
        else
        {
            $this->power = (double)$power;
        }
    }
    
    public function setOperatingTime($ot)
    {
        if($ot === NULL)
        {
            $this->operatingTime = NULL;
        }
        else
        {
            $this->operatingTime = (int)$ot;
        } 
    }
    
    public function setSwitchCount($sc)
    {
        if($sc === NULL)
        {
            $this->switchCount = NULL;
        }
        else
        {
            $this->switchCount = (int)$sc;
        }
    }
    
    public function setTemperature($t)
    {
        if($t === NULL)
        {
            $this->temperature = NULL;
        }
        else
        {
            $this->temperature = (double)$t;
        }
    }
    
    public function getPower()
    {
        return $this->power;
    }
    
    public function getOperatingTime()
    {
        return $this->operatingTime;
    }
    
    public function getSwitchCount()
    {
        return $this->switchCount;
    }
    
    public function getTemperature()
    {
        return $this->temperature;
    }
}
