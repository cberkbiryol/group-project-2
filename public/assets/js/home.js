$(function() {
    $.ajax("/api/job",{
        type:"GET"
    })
    .then(function(result){
        result.foreach(e=>{
            if (e.jobStage === 'New') {
                $("#open-jobs").append()
            } else if (e.jobStage === 'In Progress') {
                $("#in-progress").append()
            } else {
                $("#completed").append()
            }
           
        })
        
    })
});