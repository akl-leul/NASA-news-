const apiKey = 'lBh1PCBkF58OZiUlmqwjKleRlDGBnCdYNZ4GZeH2';
let newsPage = 1;
let isLoading = false;
let currentQuery = 'news';

async function fetchNews(searchTerm = 'news', reset = false) {
    if (isLoading) return;
    isLoading = true;

    const response = await fetch(`https://images-api.nasa.gov/search?q=${searchTerm}&page=${newsPage}`);
    const data = await response.json();
    const newsList = document.getElementById("news-list");

    if (reset) newsList.innerHTML = ""; 

    data.collection.items.forEach(item => {
        const title = item.data[0].title;
        const description = item.data[0].description || "No description available";
        const shortDescription = description.substring(0, 150) + "...";
        const link = item.links ? item.links[0].href : '';

        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");

        newsItem.innerHTML = `
            <h3>${title}</h3>
            <p class="short-desc">${shortDescription}</p>
            <p class="full-desc hidden">${description}</p>
            ${link ? `<img src="${link}" alt="${title}" style="max-width:100%;border-radius:5px;">` : ""}
            <button class="read-more">Read More</button>
        `;

        const readMoreButton = newsItem.querySelector(".read-more");
        readMoreButton.addEventListener("click", () => {
            const fullDesc = newsItem.querySelector(".full-desc");
            const shortDesc = newsItem.querySelector(".short-desc");
            if (fullDesc.classList.contains("hidden")) {
                fullDesc.classList.remove("hidden");
                shortDesc.classList.add("hidden");
                readMoreButton.textContent = "Read Less";
            } else {
                fullDesc.classList.add("hidden");
                shortDesc.classList.remove("hidden");
                readMoreButton.textContent = "Read More";
            }
        });

        newsList.appendChild(newsItem);
    });

    newsPage++;
    isLoading = false;
}

function searchNews() {
    const query = document.getElementById("searchQuery").value.trim();
    if (query) {
        currentQuery = query;
        newsPage = 1;
        fetchNews(query, true);
    }
}

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchNews(currentQuery);
    }
});

fetchNews();

