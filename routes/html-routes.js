var db = require("../models");
var path = require("path");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "./views/home.html"))
    });

    app.get("/postJob", function (req, res) {
        res.sendFile(path.join(__dirname, "./views/post-job.html"))
    });
}