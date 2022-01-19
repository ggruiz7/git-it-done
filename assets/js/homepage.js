const userFormEl = document.querySelector('#user-form');
const nameInputEl = document.querySelector('#username');
const repoContainerEl = document.querySelector('#repos-container');
const repoSearchTerm = document.querySelector('#repo-search-term');

const formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    const username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);

        // clear old content
        repoContainerEl.textContent = "";
        nameInputEl.value = "";
    }
    else {
        alert("Please Enter a GitHub Username")
    }
};

const getUserRepos = function(user) {
    // format the github api url
    const apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                displayRepos(data, user);
            })
        }
        else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error) {
        // notice this '.catch()' getting chained onto the end of the '.then()'
        alert("Unable to Connect to GitHub.");
    })
}; 

const displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear old cantent
    repoContainerEl.textContent = "";

    // insert new content
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (let i = 0; i < repos.length; i++) {
        // format repo name
        const repoName = repos[i].owner.login + "/" + repos[i].name;

        const repo = "./single-repo.html?repo=" + repoName;

        // create a link for each repo
        const repoEl = document.createElement('a');
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute('href', repo);

        // create a span element to hold repo name
        const titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        const statusEl = document.createElement('span');
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-succcess'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to DOM
        repoContainerEl.appendChild(repoEl);
    }
}

// event listener for form
userFormEl.addEventListener('submit', formSubmitHandler);
