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
                if (e.jobStage === 'New') {
                    $("#open-jobs").prepend(`
                <div class="card card1  border border-dark">        
                <div class="card-body">
                  <h4 class="card-title">${e.title}</h4>
                  <p class="card-text text-muted">Category: ${e.category}</p>
                  <p class="card-text">Location: ${e.location}</p>
                  <p class="card-text">${e.description}</p>
                  <p class="card-text">-${e.employer.name}-</p>                  
                  <a class="btn btn-success modalBtn border border-dark" data-toggle="modal" data-target="#acceptModal" data-jid='${e.id}' data-eid='${e.employerId}'>Accept Job</a>                  
                </div>
              </div>
              `)
                } else if (e.jobStage === 'In Progress') {
                    $("#in-progress").prepend(`
                <div class="card card1 border border-dark">
                    <div class="card-body">
                        <h4 class="card-title">${e.title}</h4>
                        <p class="card-text text-muted">Category: ${e.category}</p>
                        <p class="card-text">Posted by: ${e.employer.name}</p>
                        <p class="card-text">Undertaken by: ${e.employee.name}</p>
                        <p class="card-text" style="font-style: italic">"${e.employee.biography}"</p>
                        <p class="card-text">-${e.employee.name}-</p>
                        <div class="btn-group btn-group-justified">
                        <a class="btn btn-warning border border-dark modalBtn infoBtn" data-toggle="modal" data-target="#employeeModal" data-jid='${e.id}' data-eid='${e.employeeId}'>Info for ${e.employee.name}</a>
                        <a class="btn btn-warning border border-dark modalBtn" data-toggle="modal" data-target="#completeModal" data-jid='${e.id}' data-eid='${e.employerId}'>Mark Complete</a>
                        </div>
                    </div>
                </div>
              `)
                } else {
                    thisStars = stars(e.rating,5)                                    
                    $("#completed").append(`
                    <div class="card card1  border border-dark">
                        <div class="card-header bg-dark text-white">
                            ${e.title}
                            <button type="button" class="close deleteJob" data-jid=${e.id}>
                                <span style="color: yellow; font-size: 1.5rem; font-family: Times; opacity: 1">&times;</span>
                            </button>
                        </div>
                            <div class="card-body">
                                <h4 class="card-title">Completed by:
                                    <a class="btn btn-outline-dark btn-large modalBtn infoBtn" data-toggle="modal" data-target="#employeeModal" data-jid='${e.id}' data-eid='${e.employeeId}'> 
                                        ${e.employee.name}
                                    </a>
                                </h4>
                                <p class="card-text text-muted">Category: ${e.category}</p>
                                <p class="card-text">Posted by: ${e.employer.name}</p>                            
                                <p class="card-text">Rating:${thisStars}</p>
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
            });
            // COMPLETED JOB DELETION
            $(".deleteJob").on("click",function(){
                var thisJobId = $(this).data("jid");
                $.ajax("/api/job/"+thisJobId,{
                    type:"DELETE"
                }).then (function(){
                    //console.log("Deleted Job ID " + thisJobId)
                    location.reload();
                })
            });
            /// DISPLAY EMPLOYEE INFO
            $(".infoBtn").on("click",function(){
                var empId=$(this).data("eid");
                $.ajax("/api/jobEmp/"+empId,{
                    type:"GET"
                }).then(function(result){
                    //console.log(JSON.stringify(result.job,null,2))
                    $("#empInfoTitle").empty().append(`Employee Info for ${result.job[0].employee.name}`);
                    $("#empInfoEmail").empty().append(`Employee Email: ${result.job[0].employee.email}`);
                    $("#empInfoNote").empty().append(`Employee Note: ${result.job[0].employee.biography}`);
                    var ratings=[];
                    var dates=[];
                    ratCounts=[];
                    // get dates of completion and ratings into arrays
                    result.job.forEach(e=> {if (e.rating!==null) {ratings.push(e.rating);dates.push(e.updatedAt)}});
                    // calculate average rating
                    var avRate= ratings.reduce((sum,e)=>{return sum + e},0)/ratings.length;
                    // tally the ratings 
                    var rateObj =ratings.reduce(function (acc, curr) {acc[curr] += 1;return acc;}, {1:0,2:0,3:0,4:0,5:0});
                    for (p in rateObj){ratCounts.push(rateObj[p])};
                    // get stars html based on the average rating
                    var thisStars = stars(avRate,5);
                    if (isNaN(avRate)) avRate=0;
                    $("#empInfoRate").empty().append(`Employee Rating: ${thisStars} (${avRate.toFixed(1)})`);                    
                    // Plot charts for the data calculated above
                    var ctx1 = $("#chart1");
                    var ctx2 = $("#chart2");
                    ctx1.empty();
                    ctx2.empty();
                    chartThis1(ctx1,["Very Poor","Poor","OK","Good","Excellent"],ratCounts,'bar','# of Ratings');
                    chartThis1(ctx2,dates,ratings,'line','Ratings in Time');
                })
            })
        });
    };

/// JOB ACCEPTANCE CONTROL
$(".accept").on("submit", function (event) {
    event.preventDefault();
    var thisEmail = $("#employeeEmail").val().trim();
    var thisName = $("#employeeName").val().trim();
    var thisSkill = $("#employeeSkills").val().trim();
    var thisJobId = $("#acceptModal").data("jid");

    var newEmployee = {
        name: thisName,
        email: thisEmail,
        biography: thisSkill
    };
    //console.log(newEmployee)

    var updatedJob = {
        employeeId: null,
        jobStage: "In Progress",
    }

    // check if the employee is already in the database
    $.get("/api/employee/" + newEmployee.email)
        .then(function (result) {
            // if already in database            
            if (result.employee !== null) {
                //add employee info to job table   
                //console.log(JSON.stringify(result,null,2))           
                updatedJob.employeeId = result.employee.id;
                //console.log(updatedJob)
                $.ajax("/api/employee/"+result.employee.id,{
                    type: "PUT",
                    data:{biography:thisSkill}  
                }).then(function(result){
                    $.ajax("/api/job/" + thisJobId, {
                        type: "PUT",
                        data: updatedJob
                    }).then(function () {
                        //console.log("Changed itemID " + id + " to " + newStat)
                        location.reload();
                    });
                })                                            
                // if employee is not in the database
            } else {
                //create new employee
                $.ajax("/api/employee", {
                    type: "POST",
                    data: newEmployee
                }).then(function (result) {
                    //console.log("created new employee");   
                    //console.log(JSON.stringify(result,null,2))  
                    updatedJob.employeeId = result.id;
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

var stars = function(num,num2){
    var thisStars="<span>";   
    if (isNaN(num)){
        thisStars+="Not Enough ratings yet...</span>"        
        return thisStars
    }
    for (i=1; i<=num2; i++) {
        if (i>num){
            if (Math.ceil(num)===i) {
                thisStars+="<i class='material-icons'>star_half</i>"
            } else {
                thisStars+="<i class='material-icons'>star_border</i>"
            }            
        } else {
            thisStars+="<i class='material-icons'>star</i>"
        }
        
    };  
    return thisStars+="</span>";   
};

function chartThis1(ctx,xval,yval,type,label){ 
    Chart.defaults.global.defaultFontFamily = 'Comfortaa';
    Chart.defaults.global.defaultFontSize = 14;
    Chart.defaults.global.defaultFontColor = 'rgba(215,215,215,1)';
    Chart.defaults.global.elements.rectangle.borderColor='rgba(255,255,0,.8)';
    Chart.defaults.global.elements.rectangle.backgroundColor='rgba(255,255,0,.6)';     
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: xval,
            datasets: [{
                label: label,
                data: yval,
                backgroundColor: [                                    
                    'rgba(255,255,0,.6)'
                ],
                borderWidth: 3
            }]
        },
        options: {            
            scales: {
                yAxes: [{
                    gridLines:{
                        color:'rgba(155,155,155,1)',
                    },
                    ticks: {
                        color:'rgba(255,255,255,1)',                        
                        beginAtZero:true
                    }
                }],
                xAxes: [{
                    gridLines:{
                        color:'rgba(155,155,155)',
                    },
                    ticks: {
                        color:'rgba(255,255,255)',
                    }
                }]
            }                                     
        }                        
    });
    if (type==='line') {
        myChart.options.scales = {
            xAxes: [{
                type: 'time',
                time: {
                    unit:'month',
                    displayFormats: {
                        day: 'MMM D'
                    }
                }
            }]
        }
        myChart.update()        
    } 
};