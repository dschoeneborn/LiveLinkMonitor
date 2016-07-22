<?php

/**
 * Created by PhpStorm.
 * User: 012789
 * Date: 14.07.2016
 * Time: 08:23
 */
class LiveLink_DB
{
    private $host;
    private $user;
    private $pw;
    private $db;
    private $connection;

    /**
     * LiveLink_DB constructor.
     * @param $host
     * @param $user
     * @param $pw
     * @param $db
     */
    public function __construct($host, $user, $pw, $db)
    {
        $this->host = $host;
        $this->user = $user;
        $this->pw = $pw;
        $this->db = $db;



        $this->connectWithDB();
    }


    public function getJSONfromSelect($sql, $topic)
    {
        $result = mysqli_query($this->connection, $sql) or die("Error in Selecting " . mysqli_error($this->connection));

        $emparray = array();
        while($row =mysqli_fetch_assoc($result))
        {
            $emparray[] = $row;
        }
        $json = json_encode($emparray);
        $json = "{\"" . $topic . "\": " . $json . "}";

        return $json;
    }

    public function connectWithDB()
    {
        if(isset($this->host, $this->user, $this->pw, $this->db))
        {
            $this->connection = mysqli_connect($this->host, $this->user, $this->pw, $this->db) or die("Error " . mysqli_error($this->connection));
        }

    }

    /**
     * @param mixed $host
     */
    public function setHost($host)
    {
        $this->host = $host;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @param mixed $pw
     */
    public function setPw($pw)
    {
        $this->pw = $pw;
    }

    /**
     * @param mixed $db
     */
    public function setDb($db)
    {
        $this->db = $db;
    }


}