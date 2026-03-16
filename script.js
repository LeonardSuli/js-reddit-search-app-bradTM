import reddit from "./redditapi.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Form Event Listener
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //   Get search term
  let searchTerm = searchInput.value;

  //   Get sort
  const sortBy = document.querySelector("input[name='sortby']:checked").value;

  //   Get limit
  const searchLimit = document.getElementById("limit").value;

  //   Check input
  if (searchTerm === "") {
    // Show message
    showMessage("Please add a search term", "alert alert-danger");
  }

  //   Clear input
  searchInput.value = "";

  //   Search Reddit
  reddit.search(searchTerm, searchLimit, sortBy).then((results) => {
    let output = '<div class="row gx-3 mt-3">';

    results.forEach((post) => {
      // Check for image
      const image = post.preview
        ? post.preview.images[0].source.url
        : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";

      output += `
      <div class="col mb-3">

        <div class="card">
      
            <img class="card-img-top" src="${image}" alt="Card image cap">
      
            <div class="card-body">
      
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${truncateText(post.selftext, 50)}</p>
                <a href="${post.url}" target="_blank" class="btn btn-primary">Read More</a>

                <hr>

                <span class="badge bg-secondary">Subreddit: ${post.subreddit}</span> 
                <span class="badge bg-dark">Score: ${post.score}</span>

            </div>
      
        </div>

      </div>
      `;
    });

    output += "</div>";

    document.getElementById("results").innerHTML = output;

    // Add Masonry
    const grid = document.querySelector(".row");

    imagesLoaded(grid, function () {
      new Masonry(grid, {
        itemSelector: ".col",
        percentPosition: true,
      });
    });

    console.log(results);
  });

  console.log(searchTerm);
  console.log(sortBy);
  console.log(searchLimit);
});

// Show message
function showMessage(message, className) {
  const alertMarkup = `<div class='${className}'>${message}</div>`;
  const searchContainer = document.getElementById("search-container");

  searchContainer.insertAdjacentHTML("afterbegin", alertMarkup);

  //   Timeout alert
  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 3000);
}

// Truncate text
function truncateText(text, limit) {
  const shortened = text.indexOf(" ", limit);

  if (shortened == -1) return text;
  return text.substring(0, shortened) + "...";
}
