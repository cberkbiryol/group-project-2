$(function() {
    $.ajax("/api/job",{
        type:"GET"
    })
    .then(function(result){
        result.foreach(e=>{
            if (e.jobStage === 'New') {
                $("#open-jobs").prepend(`
                <div class="card">        
                <div class="card-body">
                  <h4 class="card-title">${e.title}</h4>
                  <p class="card-text">Category: ${e.category}</p>
                  <p class="card-text">Location: ${e.location}</p>
                  <p class="card-text">Description:</p>
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
                        <p class="card-text">Description:</p>
                        <p class="card-text">${e.description}</p>
                        <button class="btn btn-warning modalBtn" data-toggle="modal" data-target="#completeModal" data-jid='${e.id}' data-eid='${e.employerId}'>Mark Complete</button>
                    </div>
                </div>
              `)
            } else {
                $("#completed").append(`
                <div class="card">
                    <div class="card-header bg-dark text-white">Completed Jobs</div>
                        <div class="card-body">
                            <h4 class="card-title">${e.title}</h4>
                            <p class="card-text">Category: ${e.category}</p>
                            <p class="card-text">Location: ${e.location}</p>
                            <p class="card-text">Description:</p>
                            <p class="card-text"><b>${e.description}</b></p>
                        </div>
                    </div>
                `)
            }
           
        })
        
    })
});