console.log("connected");

let movieDBWrapper = document.querySelector('section');
let editHidden = true;
let headersHidden = true;

let displayHeaders = document.getElementById('blackStrip');
if (headersHidden) {
    displayHeaders.style.display = 'none';
}

function generateMovieElements (movieData) {
    headersHidden = false;
    displayHeaders.style.display = 'flex';

    let horizontalRow = document.createElement('hr');
    movieDBWrapper.appendChild(horizontalRow);

    let dataRow = document.createElement('div');
    dataRow.className = 'dataFeed';
    
    let movieTitle = document.createElement('h3');
    movieTitle.innerHTML = movieData.title;
    
    let movieYear = document.createElement('h4');
    movieYear.innerHTML = movieData.year;
    
    let movieLead = document.createElement('p');
    movieLead.innerHTML = movieData.lead_actor;

    let movieGenre = document.createElement('p');
    movieGenre.innerHTML = movieData.genre;

    let movieDuration = document.createElement('h4');
    movieDuration.innerHTML = movieData.duration;
    
    dataRow.appendChild(movieTitle);
    dataRow.appendChild(movieYear);
    dataRow.appendChild(movieLead);
    dataRow.appendChild(movieGenre);
    dataRow.appendChild(movieDuration);

    let buttonContainer = document.createElement('div');
    buttonContainer.id = 'modifyDataButtons';

    // Add edit elements 
    let editWrapper = document.createElement('div');
    editWrapper.id = 'editWrapper'+ movieData.id;
    editWrapper.className = 'editWrapper';
    editWrapper.style.display = 'none';

    let editTitleInput = document.createElement('input');
    let editYearInput = document.createElement('input');
    let editLeadInput = document.createElement('input');
    let editGenreInput = document.createElement('input');
    let editDurationInput = document.createElement('input');
    
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit"
    editButton.onclick = function() {
        let editInputs = document.getElementById('editWrapper'+movieData.id);
        let editButtons = document.getElementById('saveChangesWrapper'+ movieData.id);

        editTitleInput.id = 'editTitle'+ movieData.id;
        editTitleInput.value = movieData.title;
        editYearInput.id = 'editYear'+ movieData.id;
        editYearInput.value = movieData.year;
        editLeadInput.id = 'editLead'+ movieData.id;
        editLeadInput.value = movieData.lead_actor;
        editGenreInput.id = 'editGenre'+ movieData.id;
        editGenreInput.value = movieData.genre;
        editDurationInput.id = 'editDuration'+ movieData.id;
        editDurationInput.value = movieData.duration;

        if (editHidden) {
            editHidden = false;
            editInputs.style.display = 'flex';
            editButtons.style.display = 'flex';
        } else {
            editHidden = true;
            editInputs.style.display = 'none';
            editButtons.style.display = 'none';
        }
    }
    buttonContainer.appendChild(editButton);
    
    let deletButton = document.createElement("button");
    deletButton.innerHTML = "Delete"
    deletButton.onclick = function() {
        // will need the movie id to edit
        if (confirm("Are you sure you want to delete this review?")) {
            deleteMovieFromServer(movieData.id);
        }
    }
    buttonContainer.appendChild(deletButton);

    dataRow.appendChild(buttonContainer);
    
    movieDBWrapper.appendChild(dataRow);

    
    
    // editTitleInput.id = 'editTitle'+ movieData.id;
    // editTitleInput.value = movieData.title;
    // editYearInput.id = 'editYear'+ movieData.id;
    // editYearInput.value = movieData.year;
    // editLeadInput.id = 'editLead'+ movieData.id;
    // editLeadInput.value = movieData.lead_actor;
    // editGenreInput.id = 'editGenre'+ movieData.id;
    // editGenreInput.value = movieData.genre;
    // editDurationInput.id = 'editDuration'+ movieData.id;
    // editDurationInput.value = movieData.duration;

    editWrapper.appendChild(editTitleInput);
    editWrapper.appendChild(editYearInput);
    editWrapper.appendChild(editLeadInput);
    editWrapper.appendChild(editGenreInput);
    editWrapper.appendChild(editDurationInput);
    
    movieDBWrapper.appendChild(editWrapper);

    let saveButtonWrapper = document.createElement('div');
    saveButtonWrapper.id = 'saveChangesWrapper'+ movieData.id;
    saveButtonWrapper.className = 'saveChangesWrapper';
    saveButtonWrapper.style.display = 'none';

    let saveButton = document.createElement('button');
    saveButton.className = 'saveItButtons';
    saveButton.id = 'save-button'+ movieData.id;
    saveButton.innerHTML = 'Save';
    saveButton.onclick = () => {            
        if (editTitleInput.value == "" || editYearInput.value == "" || editLeadInput.value == "" || editGenreInput.value == "" || editDurationInput.value == "") {
            if (editTitleInput.value == "") {
                editTitleInput.value = movieData.title;
            }
            if (editYearInput.value == "") {
                editYearInput.value = movieData.year;
            }
            if (editLeadInput.value == "") {
                editLeadInput.value = movieData.lead_actor;
            }
            if (editGenreInput.value == "") {
                editGenreInput.value = movieData.genre;
            }
            if (editDurationInput.value == "") {
                editDurationInput.value = movieData.duration;
            }
        } 
        editMoveDataOnServer(movieData.id, editTitleInput.value, editYearInput.value, editLeadInput.value, editGenreInput.value, editDurationInput.value);
    }

    let cancelButton = document.createElement('button');
    cancelButton.className = 'saveItButtons';
    cancelButton.id = 'cancel-button'+ movieData.id;
    cancelButton.innerHTML = 'Cancel';
    cancelButton.onclick = () => {
        editHidden = true;
        let editInputs = document.getElementById('editWrapper'+movieData.id);
        let editButtons = document.getElementById('saveChangesWrapper'+ movieData.id);
        editInputs.style.display = 'none';
        editButtons.style.display = 'none';
        for (let i = 0; i < editInputs.children.length; i++) {
            editInputs.children[i].value = "";
        }
    }

    saveButtonWrapper.appendChild(saveButton);
    saveButtonWrapper.appendChild(cancelButton);

    movieDBWrapper.appendChild(saveButtonWrapper);
}

function deleteMovieFromServer(movie_id) {
    fetch(`http://127.0.0.1:8080/movies/`+ movie_id, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        }
    }).then(function(response) {
            if (response.ok) {
                loadMoviesFromServer();
            }
        })
}

function loadMoviesFromServer() {
    movieDBWrapper.innerHTML = "";
    fetch(`http://127.0.0.1:8080/movies`)
        .then(function(response){
            response.json()
            .then(function(data){
                let movies = data;
                movies.forEach(generateMovieElements)
            })
        })
}

let addhidden = true;
let dataEntry = document.getElementById("dataEntry");
if (addhidden) {
    dataEntry.style.display = "none";
}

let addDataButton = document.getElementById("add-data-button");
addDataButton.onclick = addNewData;

function addNewData() {
    if (addhidden) {
        dataEntry.style.display = "flex";
        addhidden = false;
    } else {
        let isComplete = true;
        for (let i = 0; i < dataEntry.children.length; i++) {
            if (dataEntry.children[i].value == "") {
                isComplete = false;
                break;
            }
        }
        if (isComplete) {
            createNewMovieOnServer();
        }
        inputmovieTitle.value = "";
        inputmovieYear.value = "";
        inputmovieLead.value = "";
        inputmovieGenre.value = "";
        inputmovieDuration.value = "";
        dataEntry.style.display = "none";
        addhidden = true;
    }
}

let inputmovieTitle = document.getElementById("input-movie-title");
let inputmovieYear = document.getElementById("input-movie-year");
let inputmovieLead = document.getElementById("input-movie-lead");
let inputmovieGenre = document.getElementById('input-movie-genre');
let inputmovieDuration = document.getElementById('input-movie-duration');

function editMoveDataOnServer(edit_ID, newTitle, newYear, newLead, newGenre, newDuration) {
    let data = "title=" + encodeURIComponent(newTitle);
    data += "&year=" + encodeURIComponent(newYear);
    data += "&lead_actor=" + encodeURIComponent(newLead);
    data += "&genre=" + encodeURIComponent(newGenre);
    data += "&duration=" + encodeURIComponent(newDuration);

    fetch(`http://127.0.0.1:8080/movies/`+ edit_ID,{
        method: "PUT", 
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function(response){
        loadMoviesFromServer();
    })
}

function createNewMovieOnServer() {
    let data = "title=" + encodeURIComponent(inputmovieTitle.value);
    data += "&year=" + encodeURIComponent(inputmovieYear.value);
    data += "&lead_actor=" + encodeURIComponent(inputmovieLead.value);
    data += "&genre=" + encodeURIComponent(inputmovieGenre.value);
    data += "&duration=" + encodeURIComponent(inputmovieDuration.value);

    fetch(`http://127.0.0.1:8080/movies`,{
        method: "POST", 
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function(response){
        loadMoviesFromServer();
    })
}

loadMoviesFromServer();