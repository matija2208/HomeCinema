async function saveMovie() {
    let errorLabel =document.getElementById("movieErrorLabel");
    errorLabel.style.display = "none";
    errorLabel.style.color="red";

    let name = document.getElementById("movieName").value;
    let year = document.getElementById("movieYear").value;


    if (!name || !year || isNaN(year) || year < 1888 || year > new Date().getFullYear())
    {
        errorLabel.innerHTML = "Please enter a valid movie name and year.";
        errorLabel.style.display = "flex";
        return;
    }

    let category = document.getElementById("movieCategory").value;
    if (!category) {
        category = null;
    }

    let file = document.getElementById("movieFile").files[0];
    if (!file) {
        errorLabel.innerHTML = "Please select a file to upload.";
        errorLabel.style.display = "flex";
        return;
    }

    let poster = document.getElementById("moviePoster").files[0];
    if (!poster) {
        poster = null;
    }

    let movie = {
        name: name,
        year: Number(year),
        category: category,
    };

    // console.log("Movie details:", JSON.stringify(movie));

    let formData = new FormData();
    formData.append("movie", JSON.stringify(movie));
    formData.append("file", file);
    formData.append("poster", poster);

    for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
    }

    try
    {
        let response = await axios.post(LINK+"api/movies/",formData);
        if(response.status===201)
        {
            document.getElementById("movieName").value = "";
            document.getElementById("movieYear").value = "";
            document.getElementById("moviePoster").value="";
            document.getElementById("movieFile").value="";
            document.getElementById("movieCategory").value="";

            errorLabel.style.color="green";
            errorLabel.innerHTML="Episode saved!";
            errorLabel.style.display="flex";
        }

    }
    catch(err)
    {
        console.log(err);
        errorLabel.innerHTML=err.message;
        errorLabel.style.display="flex";
    }
}

async function saveUser()
{
    let errorLabel =document.getElementById("userErrorLabel");
    errorLabel.style.display = "none";
    errorLabel.style.color="red";



    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!username || !password)
    {
        errorLabel.innerHTML = "Please enter username and password.";
        errorLabel.style.display = "flex";
    }

    let user = {
        name: username,
        password:password
    }

    console.log(user);

    try
    {
        let response = await axios.post(LINK+"auth/register",user);
        if(response.status===200)
        {
            document.getElementById("username").value="";
            document.getElementById("password").value="";

            errorLabel.style.color="green";
            errorLabel.innerHTML="User saved!";
            errorLabel.style.display="flex";
        }
    }
    catch(err)
    {
        console.log(err);
        errorLabel.innerHTML=err.message;
        errorLabel.style.display="flex";
    }

}

async function saveSerie()
{
    // console.log(1);
    let errorLabel =document.getElementById("serieErrorLabel");
    errorLabel.style.display = "none";
    errorLabel.style.color = "red";

    // console.log(errorLabel);

    let name = document.getElementById("serieName").value;
    let year = document.getElementById("serieYear").value;

    if (!name || !year || isNaN(year) || year < 1888 || year > new Date().getFullYear())
    {
        // console.log(2);
        errorLabel.innerHTML = "Please enter a valid serie name and year.";
        errorLabel.style.display = "flex";
        return;
    }

    let category = document.getElementById("serieCategory").value;
    if (!category) {
        category = null;
    }

    let formData = new FormData();

    let poster = document.getElementById("seriePoster").files[0];
    if (!poster)
    {
        poster = null;
    }
    else
    {
        formData.append("poster", poster);
    }

    // console.log({
    //     name: name, year: year, category: category, posteName: poster?.name
    // });

    let seasons = [];

    let seasonsEl = document.querySelectorAll("#serieForm .season");
    // console.log(seasonsEl);
    seasonsEl.forEach(seasonEl => {

        let seasonName = seasonEl.querySelector(".seasonName-input").value;
        let seasonNumber = seasonEl.querySelector(".number-input").value;

        if (!seasonName) {
            seasonName = null;
        }
        if (seasonNumber <= 0) {
            errorLabel.innerHTML = "Illegal seasonNumber: " + seasonNumber;
            errorLabel.style.display = "flex";
            return;
        }

        let episodes = []

        let files = null;
        let checkBox=(seasonEl.querySelector("input[type=\"checkbox\"]"));

        console.log(checkBox.checked)

        if (checkBox.checked)
        {
            files = seasonEl.querySelector('input[type="file"][class="episodeFiles"]').files;
            console.log(files);
            if (files !== null && files.length > 0)
            {
                for (let i = 0; i < files.length; i++)
                    formData.append("files", files[i]);
            }
        }

        let i = 0;
        let episodesEl = seasonEl.querySelectorAll(".episode");

        console.log(episodesEl.length);

        if (files!==null && files.length !== episodesEl.length)
        {
            errorLabel.innerHTML = "Diferent number of files and added episodes.";
            errorLabel.style.display = "flex";
            return;
        }
        console.log(5);
        episodesEl.forEach(episodeEl => {
            console.log(7);
            let episodeNumber = episodeEl.querySelector(".number-input").value;
            let episodeName = episodeEl.querySelector(".seasonName-input").value;

            if (episodeNumber <= 0) {
                errorLabel.innerHTML = "Illegal episodeNumber: " + seasonNumber + ":" + episodeNumber;
                errorLabel.style.display = "flex";
                return;
            }
            if (!episodeName) {
                episodeName = null;
            }


            console.log(seasonEl.querySelector("input[type=\"checkbox\"]").checked);
            if (!checkBox.checked)
            {
                let episodeFile = episodeEl.querySelector("input[type=\"file\"]").files[0];

                if (!episodeFile) {
                    errorLabel.innerHTML = "Please select a file to upload: " + seasonNumber + ":" + episodeNumber;
                    errorLabel.style.display = "flex";
                    return;
                }

                let filename = episodeFile?.name;

                formData.append("files", episodeFile);
                episodes.push({ name: episodeName, episodeNumber: Number(episodeNumber), fileName: filename });
            }
            else
            {
                console.log(2);
                let filename = files[i]?.name;
                episodes.push({ name: episodeName, episodeNumber: Number(episodeNumber), fileName: filename });
            }
        });
        console.log(8);

        seasons.push({ name: seasonName, seasonNumber: Number(seasonNumber), episodes: episodes });

    });

    let serie = {
        name: name,
        year: Number(year),
        category: category,
        posterName: poster?.name,
        seasons: seasons,
        noOfSeasons: seasons.length
    }

    formData.append("serie", JSON.stringify(serie));
    // console.log(serie);

    for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
    }

    try
    {
        let response = await axios.post(LINK+"api/series/one",formData);
        if(response.status===201)
        {
            document.getElementById("serieName").value = "";
            document.getElementById("serieYear").value = "";
            document.getElementById("seriePoster").value="";
            document.getElementById("serieCategory").value="";
            document.getElementById("seasons").innerHTML="";
            let serieForm = document.getElementById("serieForm");
            // console.log(serieForm);
            let button = (serieForm.querySelectorAll(".seasonsButtons div[class=\"addWrapper\"]")[1]);
            button.style = "display:none;";

            errorLabel.style.color="green";
            errorLabel.innerHTML="Serie saved!";
            errorLabel.style.display="flex";
        }
    }
    catch (err)
    {
        console.log(err);
        errorLabel.innerHTML=err.message;
        errorLabel.style.display="flex";
    }
}

async function saveSeason()
{
    console.log(6);
    let errorLabel =document.getElementById("seasonErrorLabel");
    errorLabel.style.display = "none";
    errorLabel.style.color="red"

    // console.log(errorLabel);

    let name = document.getElementById("serieNameSeason").value;
    let year = document.getElementById("serieYearSeason").value;

    if (!name || !year || isNaN(year) || year < 1888 || year > new Date().getFullYear())
    {
        // console.log(2);
        errorLabel.innerHTML = "Please enter a valid serie name and year.";
        errorLabel.style.display = "flex";
        return;
    }

    let formData = new FormData();

    let seasonEl = document.getElementById("seasonForm");


    let seasonName = seasonEl.querySelector(".seasonName-input").value;
    let seasonNumber = seasonEl.querySelector("div[class=\"noNaWrapper season-width-fix\"] .number-input").value;

    console.log(2);
    if (!seasonName) {
        seasonName = null;
    }
    if (seasonNumber <= 0) {
        errorLabel.innerHTML = "Illegal seasonNumber: " + seasonNumber;
        errorLabel.style.display = "flex";
        return;
    }

    let episodes = []

    let files = null;
    let checkBox=(seasonEl.querySelector("input[type=\"checkbox\"]"));

    console.log(checkBox.checked)

    if (checkBox.checked)
    {
        files = seasonEl.querySelector('input[type="file"][class="episodeFiles"]').files;
        console.log(files);
        if (files !== null && files.length > 0)
        {
            for (let i = 0; i < files.length; i++)
                formData.append("files", files[i]);
        }
    }

    let i = 0;
    let episodesEl = seasonEl.querySelectorAll(".episode");

    console.log(episodesEl.length);

    if (files!==null && files.length !== episodesEl.length)
    {
        errorLabel.innerHTML = "Diferent number of files and added episodes.";
        errorLabel.style.display = "flex";
        return;
    }
    console.log(5);
    episodesEl.forEach(episodeEl => {
        console.log(7);
        let episodeNumber = episodeEl.querySelector(".number-input").value;
        let episodeName = episodeEl.querySelector(".seasonName-input").value;

        if (episodeNumber <= 0) {
            errorLabel.innerHTML = "Illegal episodeNumber: " + seasonNumber + ":" + episodeNumber;
            errorLabel.style.display = "flex";
            return;
        }
        if (!episodeName) {
            episodeName = null;
        }


        console.log(seasonEl.querySelector("input[type=\"checkbox\"]").checked);
        if (!checkBox.checked)
        {
            let episodeFile = episodeEl.querySelector("input[type=\"file\"]").files[0];

            if (!episodeFile) {
                errorLabel.innerHTML = "Please select a file to upload: " + seasonNumber + ":" + episodeNumber;
                errorLabel.style.display = "flex";
                return;
            }

            let filename = episodeFile?.name;

            formData.append("files", episodeFile);
            episodes.push({ name: episodeName, episodeNumber: Number(episodeNumber), fileName: filename });
        }
        else
        {
            console.log(2);
            let filename = files[i]?.name;
            episodes.push({ name: episodeName, episodeNumber: Number(episodeNumber), fileName: filename });
        }
    });
    console.log(8);

    let season = { name: seasonName, seasonNumber: Number(seasonNumber), episodes: episodes };
    formData.append("serieName", name);
    formData.append("year", year.toString());
    formData.append("season", JSON.stringify(season));

    for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }
    console.log(season);

    try
    {
        let response = await axios.post(LINK+"api/seasons/one",formData);
        if(response.status===201)
        {
            document.getElementById("serieNameSeason").value="";
            document.getElementById("serieYearSeason").value="";
            seasonEl.querySelector(".seasonName-input").value="";
            seasonEl.querySelector("div[class=\"noNaWrapper season-width-fix\"] .number-input").value="";
            checkBox.checked = false;
            checkBox.dispatchEvent('change',{ bubbles: true })

            errorLabel.style.color="green";
            errorLabel.innerHTML="Season saved!";
            errorLabel.style.display="flex";
        }
    }
    catch (err) {
        console.log(err);
        errorLabel.innerHTML = err.message;
        errorLabel.style.display = "flex";
    }
}

async function saveEpisode()
{
    let errorLabel =document.getElementById("episodeErrorLabel");
    errorLabel.style.display = "none";
    errorLabel.style.color = "red";

    // console.log(errorLabel);

    let name = document.getElementById("serieNameEpisode").value;
    let year = document.getElementById("serieYearEpisode").value;

    if (!name || !year || isNaN(year) || year < 1888 || year > new Date().getFullYear())
    {
        // console.log(2);
        errorLabel.innerHTML = "Please enter a valid serie name and year.";
        errorLabel.style.display = "flex";
        return;
    }


    let seasonNumber = document.getElementById("seasonNumberEpisode").value;

    if (seasonNumber <= 0) {
        errorLabel.innerHTML = "Illegal seasonNumber: " + seasonNumber;
        errorLabel.style.display = "flex";
        return;
    }

    let episodeName = document.getElementById("episodeName").value;
    let episodeNumber = document.getElementById("episodeNumber").value;

    let episodeFile = document.getElementById("episodeFile").files[0];

    if (episodeNumber <= 0)
    {
        errorLabel.innerHTML = "Illegal episodeNumber: " + seasonNumber + ":" + episodeNumber;
        errorLabel.style.display = "flex";
        return;
    }
    if (!episodeName) {
        episodeName = null;
    }

    
    if (!episodeFile) {
        errorLabel.innerHTML = "Please select a file to upload: " + seasonNumber + ":" + episodeNumber;
        errorLabel.style.display = "flex";
        return;
    }

    let filename = episodeFile?.name;

    let episode = { name: episodeName, episodeNumber: Number(episodeNumber), fileName: filename };

    let formData = new FormData();

    formData.append("file", episodeFile);
    formData.append("serieName", name);
    formData.append("year", year);
    formData.append("seasonNumber", seasonNumber);
    formData.append("episode", JSON.stringify(episode));

    for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
    }

    try
    {
        let response = await axios.post(LINK+"api/episodes/one",formData);
        if(response.status===201)
        {

            document.getElementById("serieNameEpisode").value="";
            document.getElementById("serieYearEpisode").value="";
            document.getElementById("seasonNumberEpisode").value="";
            document.getElementById("episodeName").value="";
            document.getElementById("episodeNumber").value="";

            document.getElementById("episodeFile").value="";

            document.getElementById("episodeFile").dispatchEvent('change',{ bubbles: true })

            errorLabel.style.color="green";
            errorLabel.innerHTML="Episode saved!";
            errorLabel.style.display="flex";
        }
    }
    catch (err) {
        console.log(err);
        errorLabel.innerHTML = err.message;
        errorLabel.style.display = "flex";
    }
}

async function search(searchParam)
{
    if (searchParam.length > 3)
    {
        try
        {
            searchParam=searchParam.split(' ').join('%25');

            let response = await axios.get(LINK+"api/search/all?searchParam="+searchParam);

            let results=response.data;

            let cardContainer =
                document.getElementById("cardContainer");

            cardContainer.innerHTML='';

            for(let result of results)
            {
                console.log(result);
                let card = document.createElement('div');
                card.className="card";

                if(result.type === 'movie' || result.type==='serie') {
                    card.innerHTML = `
                        <div class = "card-content" style="opacity: 1;pointer-events: auto;z-index: 1;">
                            <p class = "extra">${result.type}</p>
                            <p class="title">${result.name}</p>
                            <p class = "extra">${result.year}</p>
                            ${result.category!==null? `<p class = "extra">${result.category}</p>`:""}
                        </div>
                    `;
                    cardContainer.appendChild(card);
                    card.onclick=()=>deleteDl(result.type,result.name,result.year,null,null);
                }
                else if(result.type === 'season')
                {
                    card.innerHTML =`
                        <div class = "card-content" style="opacity: 1;pointer-events: auto;z-index: 1;">
                            <p class = "extra">${result.type}</p>
                            <p class="extra">${result.name+" "+ result.year}</p>
                            <p class = "title">${result.seasonNumber+(result.seasonName!==null?" "+result.seasonName:"")}</p>
                        </div>
                    `;
                    cardContainer.appendChild(card);
                    card.onclick=()=>deleteDl(result.type,result.name,result.year,result.seasonNumber,null);

                }
                else if(result.type === 'episode')
                {
                    card.innerHTML =`
                        <div class = "card-content" style="opacity: 1;pointer-events: auto;z-index: 1;">
                            <p class = "extra">${result.type}</p>
                            <p class="extra">${result.name+" "+ result.year}</p>
                            <p class = "extra">${result.seasonNumber+(result.seasonName!==null?" "+result.seasonName:"")}</p>
                            <p class = "title">${result.episodeNumber+(result.episodeName!==null?" "+result.episodeName:"")}</p>
                        </div>
                    `;
                    cardContainer.appendChild(card);
                    card.onclick=()=>deleteDl(result.type,result.name,result.year,result.seasonNumber,result.episodeNumber);

                }
            }


            console.log(response);
        }
        catch (err)
        {
            console.log(err);
        }
    }

}

function deleteDl(type,name,year,seasonNumber,episodeNumber)
{
    if(type==='movie')
    {
        document.getElementById("deleteDialogYesButton").onclick=()=>{deleteMovie(name,year);document.getElementById("deleteDialog").style.display="none"}
        document.getElementById("deleteDialogNoButton").onclick=()=>{document.getElementById("deleteDialog").style.display="none"};
        document.getElementById("deleteDialogText").innerHTML=`${type} ${name} - ${year}`;
    }
    else if(type==='serie')
    {
        document.getElementById("deleteDialogYesButton").onclick=()=>{deleteSerie(name,year);document.getElementById("deleteDialog").style.display="none"}
        document.getElementById("deleteDialogNoButton").onclick=()=>{document.getElementById("deleteDialog").style.display="none"};
        document.getElementById("deleteDialogText").innerHTML=`${type} ${name} - ${year}`;
    }
    else if(type==='season')
    {
        document.getElementById("deleteDialogYesButton").onclick=()=>{deleteSeason(name,year,seasonNumber);document.getElementById("deleteDialog").style.display="none"}
        document.getElementById("deleteDialogNoButton").onclick=()=>{document.getElementById("deleteDialog").style.display="none"};
        document.getElementById("deleteDialogText").innerHTML=`${type} ${name} - ${year} S${seasonNumber}`;
    }
    else if(type==='episode')
    {
        document.getElementById("deleteDialogYesButton").onclick=()=>{deleteEpisode(name,year,seasonNumber,episodeNumber);document.getElementById("deleteDialog").style.display="none"}
        document.getElementById("deleteDialogNoButton").onclick=()=>{document.getElementById("deleteDialog").style.display="none"};
        document.getElementById("deleteDialogText").innerHTML=`${type} ${name} - ${year} S${seasonNumber}E${episodeNumber}`;
    }

    document.getElementById("deleteDialog").style.display="flex";
}

async function deleteMovie(name,year)
{
    try
    {
        let response = await axios.delete(LINK+"api/movies/one",{
            params:{
                name:name,
                year:year
            }
        })
        console.log(response)
        search(document.getElementById("searchBox").value);
    }
    catch (err)
    {
        console.log(err);
    }
}

async function deleteSerie(name,year)
{
    try
    {
        let response = await axios.delete(LINK+"api/series/one",{
            params:{
                serieName:name,
                year:year,
            }
        })
        console.log(response)
        search(document.getElementById("searchBox").value);
    }
    catch (err)
    {
        console.log(err);
    }
}

async function deleteSeason(name,year,seasonNumber)
{
    try
    {
        let response = await axios.delete(LINK+"api/seasons/one",{
            params:{
                serieName:name,
                year:year,
                seasonNumber:seasonNumber
            }
        })
        console.log(response)
        search(document.getElementById("searchBox").value);
    }
    catch (err)
    {
        console.log(err);
    }
}

async function deleteEpisode(name,year,seasonNumber, episodeNumber)
{
    try
    {
        let response = await axios.delete(LINK+"api/episodes/one",{
            params:{
                serieName:name,
                year:year,
                seasonNumber:seasonNumber,
                episodeNumber:episodeNumber
            }
        })
        console.log(response)
        search(document.getElementById("searchBox").value);
    }
    catch (err)
    {
        console.log(err);
    }
}

const target = document.getElementById("userContainer") // or any specific element

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const display = getComputedStyle(target).display;
            if (display === 'flex') {
                console.log('Div is now visible as flex');
                loadUsers();
            }
        }
    }
});

observer.observe(target, { attributes: true, attributeFilter: ['style'] });

async function loadUsers()
{
    try
    {
        let response = await axios.get(LINK+"auth/all");
        let usernames = response.data;

        console.log(usernames)

        let userContainer = document.getElementById("userContainer");

        let div=``



        for(let username of usernames)
        {
            div+=`
            <div class="user">
                <p class="username">${username}</p>
                <button class="deleteUserButton" onclick="document.getElementById('deleteDialogYesButton').onclick=()=>{deleteUser('${username}');document.getElementById('deleteDialog').style.display='none'};
                                                          document.getElementById('deleteDialogNoButton').onclick=()=>{document.getElementById('deleteDialog').style.display='none'};
                                                          document.getElementById('deleteDialogText').innerHTML=\`user ${username}\`;
                                                          document.getElementById('deleteDialog').style.display='flex'">Delete</button>
            </div>`
        }
        userContainer.innerHTML=div;
    }
    catch (err)
    {
        console.log(err);
    }
}

async function deleteUser(username)
{
    try
    {
        let response = await axios.delete(LINK+"auth/one",{
            params:{
                username:username
            }
        })
        console.log(response);
        await loadUsers();
    }
    catch(err)
    {
        console.log(err);
    }
}

async function logOut()
{
    try
    {
        let response = await axios.post(LINK+"auth/logout");

        location.href=LINK;
    }
    catch(err)
    {
        console.log(err);
    }
}

