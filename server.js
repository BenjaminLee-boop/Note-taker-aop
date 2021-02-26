const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const uuid = require("uuid");
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  let rawdata = fs.readFileSync("./db/db.json");
  let jsonObject = JSON.parse(rawdata);
  res.header("Content-Type", "application/json");
  res.send(jsonObject);
});

app.delete("/api/notes/:id", (req, res) => {
  console.log(req.params.id);
  let rawdata = fs.readFileSync("./db/db.json");
  let jsonObject = JSON.parse(rawdata);
  jsonObject = jsonObject.filter(function (item) {
    if (item.id === req.params.id) {
      jsonObject.pop(item);
    }
  });
  let c = JSON.stringify(jsonObject);
  fs.writeFile("./db/db.json", c, function (err, result) {
    if (err) console.log("error", err);
  });
  res.sendStatus(200);
});

app.post("/api/notes", (req, res) => {
  let dataToWrite = {
    id: uuid.v1(),
    title: `${req.body.title}`,
    text: `${req.body.text}`,
  };
  let rawdata = fs.readFileSync("./db/db.json");
  let jsonObject = JSON.parse(rawdata);
  console.log(jsonObject);
  jsonObject.push(dataToWrite);
  console.log(jsonObject);
  let c = JSON.stringify(jsonObject);

  fs.writeFile("./db/db.json", c, function (err, result) {
    if (err) console.log("error", err);
  });

  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
