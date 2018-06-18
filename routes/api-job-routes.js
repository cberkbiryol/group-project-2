var db = require("../models");

module.exports = function (app) {
  app.get("/api/job", function (req, res) {
    db.job.findAll({
      include: [db.employer, db.employee],
      order: [['createdAt', 'ASC']]
    })
      .then(function (data) {
        var Jobj = {
          job: data
        };
        //console.log("HERE IS DATA", JSON.stringify(Jobj, null, 2));
        res.send(Jobj);
      });
  });

  app.get("/api/job/:category", function (req, res) {
    db.job.findAll({
      include: [db.employer, db.employee],
      where: {
        category: req.params.category
      },
      order: [['createdAt', 'ASC']]
    })
      .then(function (data) {
        var Jobj = {
          job: data
        };
        //console.log("HERE IS DATA by CATEGORY", JSON.stringify(Jobj, null, 2));
        res.send(Jobj);
      });
  });

  app.get("/api/jobEmp/:id", function (req, res) {
    db.job.findAll({
      include: [db.employer, db.employee],
      where: {
        employeeId: req.params.id
      },
      order: [['createdAt', 'ASC']]
    })
      .then(function (data) {
        var Jobj = {
          job: data
        };
        //console.log("HERE IS DATA by CATEGORY", JSON.stringify(Jobj, null, 2));
        res.send(Jobj);
      });
  });

  app.post("/api/job", function (req, res) {
    db.job.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      employerId: req.body.employerId
    }).then(function (data) {
      res.json(data)
    }).catch(function (err) {
      res.json(err)
    });
  });

  app.put("/api/job/:id", function (req, res) {
    db.job.update(req.body, {
      where: {
        id: req.params.id
      }
    }).then(function (data) {
      if (data.changedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    });
  });

  app.delete("/api/job/:id", function (req, res) {
    db.job.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (data) {
      if (data.affectedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    }).catch(function (err) {
      res.json(err);
    });
  });
}