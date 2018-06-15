$(function () {
    loadPage();
});

/// INITIAL LOAD AND CATAGORIZED LOAD
var loadPage = function (category) {
    if (!category) {
        var route = "/api/job";
    } else {
        $("#open-jobs").empty();
        $("#in-progress").empty();
        $("#completed").empty();
        var route = "/api/job/" + category;
    }
    $.ajax(route, {
        type: "GET"
    })
        .then(function (result) {
            //console.log(JSON.stringify(result,null,2))
            result.job.forEach(e => {
                //console.log(e)
                if (e.jobStage === 'New') {
                    $("#open-jobs").prepend(`
                <div class="card">        
                <div class="card-body">
                  <h4 class="card-title">${e.title}</h4>
                  <p class="card-text">Category: ${e.category}</p>
                  <p class="card-text">Location: ${e.location}</p>
                  <p class="card-text">${e.description}</p>
                  <button class="btn btn-success modalBtn" data-toggle="modal" data-target="#acceptModal" data-jid='${e.id}' data-eid='${e.employerId}'>Accept Job</button>
                </div>
              </div>
              `)
                } else if (e.jobStage === 'In Progress') {
                    $("#in-progress").prepend(`
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">${e.title}</h4>
                        <p class="card-text">Category: ${e.category}</p>
                        <p class="card-text">Location: ${e.location}</p>
                        <p class="card-text">${e.description}</p>
                        <button class="btn btn-warning modalBtn" data-toggle="modal" data-target="#completeModal" data-jid='${e.id}' data-eid='${e.employerId}'>Mark Complete</button>
                    </div>
                </div>
              `)
                } else {
                    var stars="<span>";
                     for (i=1; i<=e.rating; i++) {
                         stars+="<i class='material-icons'>grade</i>"
                     };  
                     stars+="</span>";                                        
                $("#completed").append(`
                <div class="card">
                    <div class="card-header bg-dark text-white">
                        Completed Jobs
                        <button type="button" class="close deleteJob" data-jid=${e.id}>
                            <span style="color: red; font-size: 1.5rem; font-family: Times; opacity: 1">&times;</span>
                        </button>
                    </div>
                        <div class="card-body">
                            <h4 class="card-title">${e.title}</h4>
                            <p class="card-text">Category: ${e.category}</p>
                            <p class="card-text">Location: ${e.location}</p>
                            <p class="card-text">Rating:${stars}</p>
                            <p class="card-text"><b>${e.description}</b></p>
                        </div>
                    </div>
                `)
                }
                $(".modalBtn").click(function () {
                    var href = $(this).data('target');
                    var jid = $(this).data('jid');
                    var eid = $(this).data('eid');
                    $(href).data('jid', jid);
                    $(href).data('eid', eid);
                });                
            })
            // COMPLETED JOB DELETION
            $(".deleteJob").on("click",function(){
                var thisJobId = $(this).data("jid");
                $.ajax("/api/job/"+thisJobId,{
                    type:"DELETE"
                }).then (function(){
                    //console.log("Deleted Job ID " + thisJobId)
                    location.reload();
                })
            })
        });
}

/// JOB ACCEPTANCE CONTROL
$(".accept").on("submit", function (event) {
    event.preventDefault();
    var thisEmail = $("#employeeEmail").val().trim();
    var thisName = $("#employeeName").val().trim();
    var thisSkill = $("#employeeSkills").val().trim();
    var thisJobId = $("#acceptModal").data("jid");
    var thisemployeeId;

    var newEmployee = {
        name: thisName,
        email: thisEmail,
        biography: thisSkill
    };
    //console.log(newEmployee)

    var updatedJob = {
        employeeEmail: null,
        jobStage: "In Progress",
    }

    // check if the employee is already in the database
    $.get("/api/employee/" + newEmployee.email)
        .then(function (result) {
            // if already in database            
            if (result.employee !== null) {
                //add info to job table   
                //console.log(JSON.stringify(result,null,2))           
                updatedJob.employeeEmail = result.employee.email;
                //console.log(updatedJob)                             
                $.ajax("/api/job/" + thisJobId, {
                    type: "PUT",
                    data: updatedJob
                }).then(function () {
                    //console.log("Changed itemID " + id + " to " + newStat)
                    location.reload();
                });
                // if employee is not in the database
            } else {
                //create new employee
                $.ajax("/api/employee", {
                    type: "POST",
                    data: newEmployee
                }).then(function (result) {
                    //console.log("created new employee");   
                    //console.log(JSON.stringify(result,null,2))  
                    updatedJob.employeeEmail = result.email;
                    $.ajax("/api/job/" + thisJobId, {
                        type: "PUT",
                        data: updatedJob
                    }).then(function () {
                        //console.log("Changed itemID " + id + " to " + newStat)
                        location.reload();
                    })
                });
            }
        })
})


///  JOB COMPLETION CONTROL
$(".complete").on("submit", function (event) {
    event.preventDefault();
    var thisEmail = $("#managerEmail").val().trim();
    var thisPassword = $("#managerPassword").val().trim();
    var thisRating= Number($("#employee-rating").val());
    var thisJobId = $("#completeModal").data("jid");
    var thisEmployerId = $("#completeModal").data("eid");
    var thisEmployeeId;
    //console.log(thisEmail, thisPassword,thisRating,thisJobId, thisEmployerId)
    var updatedJob = {
        jobStage: "Completed",
        rating: thisRating
    }

    // check if the employer who initiated the job is marking it complete
    $.get("/api/employer/" + thisEmail)
        .then(function (result) {
            // if already in database
            //console.log(result.employer)
            if (result.employer.id === thisEmployerId) {
                // check if password correct
                if (thisPassword.toString() !== result.employer.password) {
                    alert("Password incorrect!");
                    return;
                }
                $.ajax("/api/job/" + thisJobId, {
                    type: "PUT",
                    data: updatedJob
                }).then(function () {
                    //console.log("Changed itemID " + id + " to " + newStat)
                    location.reload();
                });
                // if employer is not in the database
            } else {
                alert("You are not authorized or wrong user name (email)!");
            }
        })
})

/// JOB CATEGORY SEARCH
$(".findCat").on("submit", function (event) {
    event.preventDefault();
    var category = $("#work-type").val();
    loadPage(category);
})

