$(function(){
    $(".postJob").on("submit", function (event) {
        event.preventDefault();
        var thisEmail = $("#email").val().trim();
        var thisName = $("#name").val().trim();
        var thisPassword = $("#password").val().trim();
        var employerId;
    
        if (!thisName || !thisPassword) {
            alert("Please Enter a name & password!");
                return;
        }
        
        var newJob = {
            title: $("#job-name").val().trim(),
            description:$("#description").val().trim(),
            category:$("#work-type").val(),
            location:$("#location").val().trim(),
            employerId:null
        };             

        var newEmployer = {
                name: thisName,
                email: thisEmail,
                password: thisPassword
        };
        // check if the employer is already in the database
        $.get("/api/employer/"+ newEmployer.email)
        .then(function(result){
            // if already in database
            //console.log(result)
            if (result.employer !== null){    
                // check if password correct
                if (newEmployer.password !== result.employer.password){
                    alert("Password incorrect!");
                    return;
                }
                //add job to job table              
                newJob.employerId=result.employer.id;                                 
            $.ajax("/api/job/",{
                type: "POST",
                data: newJob
            }).then(function () {
                //console.log("Changed itemID " + id + " to " + newStat)
                location.assign("/");
            }); 
             // if employer is not in the database
            } else {                
                //create new employer
                $.ajax("/api/employer", {
                    type: "POST",
                    data: newEmployer
                }).then(function (result) {
                    //console.log("created new user");   
                    console.log(JSON.stringify(result,null,2))  
                    newJob.employerId=result.id;             
                    $.ajax("/api/job", {
                        type: "POST",
                        data: newJob
                    }).then(function () {
                        //console.log("Changed itemID " + id + " to " + newStat)
                        location.assign("/");
                    })           
                });
            } 
        })    
    });
})
