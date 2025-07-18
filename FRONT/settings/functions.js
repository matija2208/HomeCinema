async function saveMovie() {
    let errorLabel =document.getElementById("movieErrorLabel");
    errorLabel.style.display = "none";

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
    if (poster) {
        formData.append("poster", poster);
    }

    for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
    }
}

async function saveUser()
{
    let errorLabel =document.getElementById("userErrorLabel");
    errorLabel.style.display = "none";



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

}

async function saveSerie()
{
    // console.log(1);
    let errorLabel =document.getElementById("serieErrorLabel");
    errorLabel.style.display = "none";

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

        let episodesEl = seasonEl.querySelectorAll(".episode");
        episodesEl.forEach(episodeEl => {
            
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

            let episodeFile = episodeEl.querySelector("input[type=\"file\"]").files[0];

            if (!episodeFile) {
                errorLabel.innerHTML = "Please select a file to upload: " + seasonNumber + ":" + episodeNumber;
                errorLabel.style.display = "flex";
                return;
            }

            let filename = episodeFile?.name;

            formData.append("files", episodeFile);
            episodes.push({ name: episodeName, episodeNumber: Number(episodeNumber), fileName: filename });
        });
        seasons.push({ seasonName: seasonName, seasonNumber: Number(seasonNumber), episode: episodes });

    });

    let serie = {
        name: name,
        year: Number(year),
        category: category,
        posterName: poster?.name,
        seasons: seasons,
        noOfSeasons: seasons.length
    }

    formData.append("serie", serie);
    // console.log(serie);

    for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
    }

}

async function saveSeason()
{
    console.log(6);
    let errorLabel =document.getElementById("serieErrorLabel");
    errorLabel.style.display = "none";

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

    let season = { seasonName: seasonName, seasonNumber: Number(seasonNumber), episodes: episodes };
    formData.append("serieName", name);
    formData.append("year", year);
    formData.append("season", season);

    for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
    }
    console.log(season);
}

async function saveEpisode()
{
    let errorLabel =document.getElementById("serieErrorLabel");
    errorLabel.style.display = "none";

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

    let episode = { episodeName: episodeName, episodeNumber: Number(episodeNumber), fileName: filename };

    let formData = new FormData();

    formData.append("file", episodeFile);
    formData.append("serieName", name);
    formData.append("year", year);
    formData.append("seasonNumber", seasonNumber);
    formData.append("episode", episode);

    for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
    }
}

async function search(searchParam)
{
    if (searchParam.length > 3)
    {
            
        let sp = "%"+searchParam.split('').join("%")+"%";

        console.log(sp);
    }

}