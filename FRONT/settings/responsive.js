function addListenersForFiles() {
    const fileInputs = document.querySelectorAll("input[type=\"file\"]");

    fileInputs.forEach(el => {
        el.addEventListener('change', function () {
            let filename = this.files[0]?.name;

            if (this.className === "episodeFiles") {

                
                // console.log(111);
                let form = this.parentElement.parentElement;
                let episodesButtons = form.querySelector('div[class="episodesButtons"] button[class="addButton"]');
                let episodes = form.querySelector('div[class="episodes"]');

                episodes.innerHTML = "";

                for (let i = 0; i < this.files.length; i++)
                {
                    episodesButtons.click();
                }

                let fileUploads = episodes.querySelectorAll('div[class="wrapper"]');

                fileUploads.forEach((f)=>{
                    f.style.display = "none";
                })


                if (this.files.length === 0) {
                    filename = null;
                }
                else {
                    filename = this.files.length + " file" + ((this.files.length === 1) ? "" : "s") + " selected"
                }
                // console.log(this.files);
            }

            //console.log(filename);

            let div = this.closest('div');

            //console.log(div);

            let label = div.querySelector('label');
            //console.log(label);
            if (label) {
                if (filename) {
                    // console.log(1);
                    label.innerHTML = filename;
                }
                else
                    label.innerHTML = label.id;
            }
        });
    });
}
addListenersForFiles();

const radioSelects = document.querySelectorAll('input[type = "radio"][name="mode"]');

radioSelects.forEach(radio => {
    radio.addEventListener('change', function () {
        if (this.checked) {
            // console.log(1);
            let s = this.value;

            if (s === 'USER') {
                document.getElementById("userForm").style = "display:flex;";
                document.getElementById("movieForm").style = "display:none";
                document.getElementById("serieForm").style = "display:none";
                document.getElementById("seasonForm").style = "display:none";
                document.getElementById("episodeForm").style = "display:none;";
            }
            else if (s === 'MOVIE') {
                document.getElementById("userForm").style = "display:none;";
                document.getElementById("movieForm").style = "display:flex";
                document.getElementById("serieForm").style = "display:none";
                document.getElementById("seasonForm").style = "display:none";
                document.getElementById("episodeForm").style = "display:none;";
            }
            else if (s === 'SERIE') {
                document.getElementById("userForm").style = "display:none;";
                document.getElementById("movieForm").style = "display:none";
                document.getElementById("serieForm").style = "display:flex";
                document.getElementById("seasonForm").style = "display:none";
                document.getElementById("episodeForm").style = "display:none;";
            }
            else if (s === 'SEASON') {
                document.getElementById("userForm").style = "display:none;";
                document.getElementById("movieForm").style = "display:none";
                document.getElementById("serieForm").style = "display:none";
                document.getElementById("seasonForm").style = "display:flex";
                document.getElementById("episodeForm").style = "display:none;";
            }
            else if (s === 'EPISODE') {
                document.getElementById("userForm").style = "display:none;";
                document.getElementById("movieForm").style = "display:none";
                document.getElementById("serieForm").style = "display:none";
                document.getElementById("seasonForm").style = "display:none";
                document.getElementById("episodeForm").style = "display:flex;";
            }

        }
    })
});

const radioOptions = document.querySelectorAll('input[type="radio"][name="action"]');

radioOptions.forEach(radio => {
    radio.addEventListener('change',function () {
        if (this.checked)
        {
            if (this.value === "POST")
            {
                document.getElementById("modeForm").style.display = "flex";

                radioSelects.forEach(radio=>{
                    radio.checked = false;
                })

                
                document.getElementById("cardContainer").style.display = "none";
                document.getElementById("searchBox").style.display = "none";
            }
            else if (this.value === "DELETE")
            {

                document.getElementById("modeForm").style.display = "none";

                document.getElementById("userForm").style = "display:none;";
                document.getElementById("movieForm").style = "display:none";
                document.getElementById("serieForm").style = "display:none";
                document.getElementById("seasonForm").style = "display:none";
                document.getElementById("episodeForm").style = "display:none;";

                document.getElementById("cardContainer").style.display = "grid";
                document.getElementById("searchBox").style.display = "flex";

            }
        }
    })
})

function addSeasonButton()
{
    let div = document.getElementById("seasons");

    let seasonDiv = document.createElement('div');
    seasonDiv.className = "season";
    seasonDiv.innerHTML += `
                <div class="noNaWrapper">
                    <input type="number" class="number-input" id="seasonNumber${div.children.length}" placeholder="Enter season number" required>
                    <input type="text" class="seasonName-input" id="seasonName${div.children.length}" placeholder="Enter season name">
                </div>

                <div class = "addWrapper">
                    <input type="checkbox" class="multipleEpisodes" id="multipleEpisodesCheckbox${div.children.length}" onchange="checkBoxChange(this,this.parentElement.parentElement)">
                    
                    <label for="multipleEpisodesCheckbox${div.children.length}"class="addLabel"><span class="custom-checkbox"></span> Upload all files at once</label>
                </div>

                <div class = "wrapper" style="display: none;">
                    <input class="episodeFiles" id="episodeFiles${div.children.length}" type="file" accept="video/*" multiple hidden>
                    <label for="episodeFiles${div.children.length}" class="file-input" id="uploadEpisodes${div.children.length}">Upload Files</label>
                </div>

                <div class="episodes" id="episodes" style="display:contents;">
                    
                    

                </div>
                <div class = "episodesButtons">
                    <div class = "addWrapper">
                        <button onclick="event.preventDefault();addEpisode(this,${div.children.length});" class="addButton" id="addEpisode${div.children.length}">+</button>
                        <label for="addEpisode${div.children.length}" class="addLabel">Add episode</label>
                    </div>

                    <div class = "addWrapper" style="display:none;">
                        <button onclick="event.preventDefault();removeEpisode(this);" class="addButton" id="removeEpisode${div.children.length}">-</button>
                        <label for="removeEpisode${div.children.length}" class="addLabel">Remove episode</label>
                    </div>
                </div>`;
    
    div.appendChild(seasonDiv);

    addListenersForFiles();
    
    let serieForm = (div.parentElement);
    // console.log(serieForm);
    let button = (serieForm.querySelectorAll(".seasonsButtons div[class=\"addWrapper\"]")[1]);
    button.style = "display:flex;";
    
}

function removeSeasonButton()
{
    let div = document.getElementById("seasons");
    div.removeChild(div.lastElementChild);
    // console.log(div.children.length);
    if (div.children.length === 0)
    {
        let serieForm = (div.parentElement);
        // console.log(serieForm);
        let button = (serieForm.querySelectorAll(".seasonsButtons div[class=\"addWrapper\"]")[1]);
        button.style = "display:none;";
    }
}

function addEpisode(button, seasonNumber)
{
    let divEpisodes = button.parentElement.parentElement.parentElement.querySelector("div[class=\"episodes\"]");
    
    let div = document.createElement('div');
    div.className="episode"
    div.innerHTML += `
            <div class="noNaWrapper">
                <input type="number" class="number-input" id="episodeNumberS${seasonNumber}E${divEpisodes.children.length}" placeholder="Enter episode number" required>
                <input type="text" class="seasonName-input" id="episodeNameS${seasonNumber}E${divEpisodes.children.length}" placeholder="Enter episode name">
            </div>
            <div class = "wrapper">
                <input type="file" id="episodeFileS${seasonNumber}E${divEpisodes.children.length}" accept="video/*" hidden>
                <label for="episodeFileS${seasonNumber}E${divEpisodes.children.length}" class="file-input" id="Upload File">Upload File</label>
            </div>`;
    
    divEpisodes.appendChild(div);
    
    let buttonContainer = (button.parentElement.parentElement.querySelectorAll('div[class="addWrapper"]')[1]);
    
    buttonContainer.style = "display:flex;";
    addListenersForFiles();
}

function removeEpisode(button)
{
    let divEpisodes = button.parentElement.parentElement.parentElement.querySelector("div[class=\"episodes\"]");
    divEpisodes.removeChild(divEpisodes.lastElementChild);
    if (divEpisodes.children.length === 0)
    {
        let buttonContainer = (button.parentElement.parentElement.querySelectorAll('div[class="addWrapper"]')[1]);
        buttonContainer.style = "display:none;"
    }
}

function checkBoxChange(checkbox, form) {
    let episodeButtons = form.querySelector('div[class="episodesButtons"]')
    let uploadFiles = form.querySelector('div[class="wrapper"]');
    
    if (checkbox.checked) {
        episodeButtons.style.display = "none";

        uploadFiles.style.display = "flex";
    }
    else
    {
        episodeButtons.style.display = "flex";

        uploadFiles.style.display = "none";
    }
}


        