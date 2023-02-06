//Creating NodeJS File System
const express = require("express");
const app = express();
const fs = require("fs");
const { dirname } = require("path");
const path = require("path");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started and running on ${PORT}`);
});

//To render static content to the from the server to browser
app.use(express.static("public"));

//body-parser nmpm packge hep us to get the form user/client when the form submitted.
app.use(bodyParser.urlencoded({ extended: true }));

// To return date & time in YYYY-MM-DD HH:MM:SS format
const dateTime = () => {
  let dateOject = new Date();
  let date = ("0" + dateOject.getDate()).slice(-2);

  let month = ("0" + (dateOject.getMonth() + 1)).slice(-2);
  let year = dateOject.getFullYear();
  let hours = dateOject.getHours();
  let minutes = dateOject.getMinutes();
  let seconds = dateOject.getSeconds();
  let dateTime =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    "." +
    minutes +
    "." +
    seconds;
  return dateTime;
};

const createFolder = (folderName) => {
  fs.mkdir(folderName, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`Folder ${folderName} created successfully!`);
  });
};

const createFile = (fileName, content) => {
  fs.writeFile(fileName, content, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`File ${dateTime()}.txt created successfully!`);
  });
};

//Home Route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Folder Routes
app.get("/createFolder", (req, res) => {
  res.sendFile(__dirname + "/folder.html");
});

app.post("/createFolder", (req, res) => {
  const folderName = `${__dirname}/${req.body.folderName}`;
  console.log(req.body.folderName);
  console.log(folderName);
  if (folderName !== null) {
    const created = createFolder(folderName);
    if (!created) {
      res.json({
        message: "Folder CREATED",
      });
    } else {
      res.status(400).json({
        message: "FAILED TO CREATE THE FOLDER",
      });
    }
  } else {
    res.redirect("/");
  }
});

//File Routes
app.get("/createFile", (req, res) => {
  res.sendFile(__dirname + "/file.html");
});

app.post("/createFile", (req, res) => {
  const fileName = `${__dirname}/AllTextFiles/${dateTime()}.txt`;
  const content = `Current Time Stamp: ${dateTime()}`;
  if (fileName !== null) {
    const created = createFile(fileName, content);
    if (!created) {
      res.json({
        message: "FILE CREATED",
      });
    } else {
      res.status(400).json({
        message: "FAILED TO CREATE THE FILE",
      });
    }
  } else {
    res.redirect("/");
  }
});

//Route for getting all the text file names
app.get("/getAllFiles", function (req, res) {
  let dir = `${__dirname}/AllTextFiles/`;
  const filesFolders = [];
  if (req.query.path !== null) {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log(err);
      }
      files.forEach((file) => {
        let type = path.extname(file);
        let detail = { name: file, type: type };
        filesFolders.push(detail);
      });
      res.json({
        data: filesFolders,
      });
    });
  } else {
    res.status(400).json({ message: "Please try again" });
    //res.redirect("/");
  }
});
