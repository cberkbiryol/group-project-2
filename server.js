var express = require("express");
var bodyParser = require("body-parser")
var db = require("./models")

var app = express();
var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true}));

app.use(bodyParser.json());

app.use(express.static("public"));

require("./routes/api-job-routes.js")(app);
require("./routes/api-employer-routes.js")(app);
require("./routes/api-employee-routes.js")(app);
require("./routes/html-routes.js")(app);

// Start Server
db.sequelize.sync({force:true}).then(function(){
    app.listen(PORT,function(){
        console.log("Server listening on: http://localhost:" + PORT)
    });        
})
