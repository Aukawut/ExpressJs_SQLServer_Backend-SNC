const express = require("express");
const cors = require("cors");
const app = express();
const sql = require("mssql");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();
const port = process.env.PORT;
const DB_USER = process.env.DB_USER;
const DB_SERVER = process.env.DB_SERVER;
const DB_PASS = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const config = {
  user: DB_USER,
  password: DB_PASS,
  server: DB_SERVER,
  database: DB_NAME,
  options: {
    encrypt: false, // for Azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};
const pool = new sql.ConnectionPool(config);

app.get("/", (req, res) => {
  res.json({
    msg: "Hello my route.",
  });
});

app.get("/pmcomputer", (req, res) => {
  pool.connect((err) => {
    if (err) {
      console.log(`Error connecting to database: ${err}`);
      return res.status(500).json({
        err: true,
        message: "Error connecting to database.",
      });
    }

    const request = pool.request();
    const query = "SELECT * FROM Tbl_PM_COMPUTER";
    request.query(query, (err, result) => {
      pool.close(); // Close the connection after the query is executed

      if (err) {
        console.log(`Error executing query: ${err}`);
        return res.status(500).json({
          err: true,
          message: "Error executing database query.",
        });
      }

      res.json({
        err: false,
        result: result.recordset,
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
