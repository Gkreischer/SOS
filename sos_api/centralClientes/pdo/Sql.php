<?php

class Sql extends \PDO
{

    const HOSTNAME = "127.0.0.1";
    const PORT = "3306";
    const USERNAME = "root";
    const PASSWORD = "";
    const DBNAME = "dbmsk";

    private $conn;

    public function __construct($HOSTNAME = Sql::HOSTNAME, $USERNAME = Sql::USERNAME, $PASSWORD = Sql::PASSWORD, $DBNAME = Sql::DBNAME)
    {

        $this->conn = new \PDO(
            "mysql:dbname=" . $DBNAME . ";host=" . $HOSTNAME . ";charset=utf8",
            $USERNAME,
            $PASSWORD
        );

        setLocale(LC_ALL, 'pt_BR');
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
    }

    public function select($rawQuery, $params = array())
    {

        $stmt = $this->conn->prepare($rawQuery);

        $this->setParams($stmt, $params);

        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
