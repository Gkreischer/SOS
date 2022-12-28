<?php

require(dirname(__FILE__) . '/data_connection.php');
require(dirname(__FILE__) . '/../cors/cors.php');

class Sql extends \PDO
{
    private $conn;

    public function __construct($HOSTNAME = HOSTNAME, $USERNAME = USERNAME, $PASSWORD = PASSWORD, $DBNAME = DBNAME)
    {

        $this->conn = new \PDO(
            "mysql:dbname=" . $DBNAME . ";host=" . $HOSTNAME . ";charset=utf8mb4",
            $USERNAME,
            $PASSWORD,
            [
            PDO::MYSQL_ATTR_FOUND_ROWS => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]
        );

        setLocale(LC_ALL, 'pt_BR');
        setLocale(LC_MONETARY, 'pt_BR');

        // DEFININDO O TIMEZONE ABAIXO
        date_default_timezone_set('America/Sao_Paulo');

    }

    private function setParams($statement, $parameters = array())
    {

        foreach ($parameters as $key => $value) {

            $this->bindParam($statement, $key, $value);
        }
    }

    private function bindParam($statement, $key, $value)
    {

        $statement->bindParam($key, $value);
    }

    public function Sqlquery($rawQuery, $params = array())
    {

        $stmt = $this->conn->prepare($rawQuery);

        $this->setParams($stmt, $params);

        $stmt->execute();

        $count = $stmt->rowCount();

        if($count > 0){
            return true;
        } else {
            return false;
        }
        
    }

    public function select($rawQuery, $params = array())
    {

        $stmt = $this->conn->prepare($rawQuery);

        $this->setParams($stmt, $params);

        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
