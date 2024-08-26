const API_KEY = "854e950529ed421c970a4fe7c38ece7d";
// const API_KEY = "ffb22ab997e7475b9c0124d055392d99";
// const API_KEY = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
const url = "https://newsapi.org/v2/everything?q=";

function reload() {
    localStorage.removeItem('currentSelectedNav');
    localStorage.removeItem('searchQuery');

    window.location.reload();
}


window.addEventListener("load", () => {
    const storedSearchQuery = localStorage.getItem('searchQuery');
    const selectedNavId = localStorage.getItem('currentSelectedNav');

    // If there is a stored search query, fetch news and populate the search input
    if (storedSearchQuery) {
        searchText.value = storedSearchQuery;
        fetchNews(storedSearchQuery);
    } else if (selectedNavId) {
        // If there is a selectedNavId in localStorage, fetch news for that category
        fetchNews(selectedNavId);

        // Highlight the corresponding navigation link
        const selectedNavItem = document.getElementById(selectedNavId);
        if (selectedNavItem) {
            selectedNavItem.classList.add('active');
            currentSelectedNav = selectedNavItem;
        }
    } else {
        // Fetch default news (for example, "World" category)
        fetchNews("World");
    }
});




async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();  
    // It returns a Promise that resolves to a JavaScript object parsed from the JSON data.

    bindData(data.articles);
}


function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // clears the previous content
    cardsContainer.innerHTML = "";

    if (articles.length === 0) {
        // If there are no search results, display a sorry message
        const msgContainer = document.createElement("div");
        msgContainer.classList.add("msg-container");
    
        const msg1 = document.createElement("div");
        msg1.textContent = "404";
        msg1.classList.add("msg1");
        msgContainer.appendChild(msg1);
    
        const msg2 = document.createElement("div");
        msg2.textContent = "Not Found";
        msg2.classList.add("msg2");
        msgContainer.appendChild(msg2);
    
        const msg3 = document.createElement("div");
        msg3.textContent = "The resource requested could not be found on this server!";
        msg3.classList.add("msg3");
        msgContainer.appendChild(msg3);
    
        cardsContainer.appendChild(msgContainer);
    }    
    else {
        // Sort articles by publishedAt in descending order (latest to oldest)
        articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        // When you subtract new Date(b.publishedAt) from new Date(a.publishedAt), if a.publishedAt is more recent than b.publishedAt, the result will be a positive number. This means a should be placed before b in the sorted array

        articles.forEach((article) => {
            if (!article.urlToImage) return;

            // The true argument for cloneNode indicates a deep clone, meaning it copies the template's content and its children.
            const cardClone = newsCardTemplate.content.cloneNode(true);

            // populate the cloned news card template with the specific data from the given article object
            fillDataInCard(cardClone, article);

            cardsContainer.appendChild(cardClone);
        });
    }
}



function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");


    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    newsDesc.innerHTML = article.description;


    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}




// *****************************************************************************
const navList = document.getElementById("nav-list");

navList.addEventListener("click", (event) => {
    const targetNavItem = event.target.closest('.js-nav-item');
    if (targetNavItem) {
        onNavItemClick(targetNavItem.id);
    }
});

let currentSelectedNav = null;
function onNavItemClick(id) {
    if (currentSelectedNav) {
        currentSelectedNav.classList.remove("active");
    }

    currentSelectedNav = document.getElementById(id);
    currentSelectedNav.classList.add("active");
    fetchNews(id);


    localStorage.setItem('currentSelectedNav', id);

    // Clear the text from the input field
    searchText.value = null;
    localStorage.removeItem('searchQuery');

    window.scrollTo(0, 0); // Scroll to the top of the page
}




// *****************************************************************************
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("text-input");

function performSearch() {
    const query = searchText.value;

    if (!query) return;

    // Remove active class from nav items
    // ?. syntax checks if curSelectedNav is not null or undefined
    currentSelectedNav?.classList.remove("active");
    currentSelectedNav = null;
    localStorage.removeItem('currentSelectedNav');

    fetchNews(query);
    localStorage.setItem('searchQuery', query);

    window.scrollTo(0, 0);
}


searchButton.addEventListener("click", performSearch);

searchText.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});




// *****************************************************************************
const logo = document.getElementById("logo");
const icon = document.getElementById("icon");

function toggleDarkTheme() {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        logo.src = "logo_light.png";
        icon.src = "sun.png";
        localStorage.setItem("theme", "dark"); 
    } else {
        logo.src = "logo.png";
        icon.src = "moon.png";
        localStorage.setItem("theme", "light"); 
    }
}

// Check if there's a stored theme preference in localStorage
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark") {
    toggleDarkTheme();
}

icon.addEventListener("click", toggleDarkTheme);



