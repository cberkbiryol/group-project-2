var db = require("../models");

module.exports = function (app) {
    app.get("/api/employee", function (req, res) {
        db.employee.findAll({
            order: [['createdAt', 'ASC']]
        })
        .then(function (data) {
            var Uobj = {
                employer: data
            };
            console.log("HERE IS DATA", JSON.stringify(Uobj, null, 2));
            res.send(Jobj);
        });
    });

    app.get("/api/employee/:email", function (req, res) {
        db.employee.findOne({
            where: {
                email:req.params.id
            },
            include: [db.job],            
        })
        .then(function (data) {
            var Uobj = {
                employer: data
            };
            console.log("HERE IS DATA", JSON.stringify(Uobj, null, 2));
            res.send(Jobj);
        });
    });

    app.post("/api/employee", function (req, res) {
        db.employee.create({
            name: req.body.name,
            email: req.body.email,
            biography: req.body.password,
        }).then(function (data) {
            res.json(data)
        }).catch(function (err) {
            res.json(err)
        });
    });
    
    app.put("/api/employee/:id", function (req, res) {
        var newdata={
            rating: req.body.rating
        }
        db.employee.update(newdata,{
            where: {
                id:req.params.id
            }
        }).then(function(data){
            if (data.changedRows == 0) {
                // If no rows were changed, then the ID must not exist, so 404
                return res.status(404).end();
              } else {
                res.status(200).end();
              }      
        });
    });
}