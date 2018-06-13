var db = require("../models");

module.exports = function (app) {
    app.get("/api/employer", function (req, res) {
        db.employer.findAll({
            include: [db.job],
            order: [['createdAt', 'ASC']]
        })
        .then(function (data) {
            var Uobj = {
                employer: data
            };
            console.log("HERE IS DATA", JSON.stringify(Uobj, null, 2));
            res.send(Uobj);
        });
    });

    app.get("/api/employer/:email", function (req, res) {
        db.employer.findOne({
            where: {
                email:req.params.email
            },
            include: [db.job],            
        })
        .then(function (data) {
            var Uobj = {
                employer: data
            };
            console.log("HERE IS DATA", JSON.stringify(Uobj, null, 2));
            res.send(Uobj);
        });
    });

    app.post("/api/employer", function (req, res) {
        db.employer.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }).then(function (data) {
            res.json(data)
        }).catch(function (err) {
            res.json(err)
        });
    });
    
    app.put("/api/employer/:id", function (req, res) {
        var newdata={
            rating: req.body.rating
        }
        db.employer.update(newdata,{
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