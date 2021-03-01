// public and free no need to hide https://api.nasa.gov/planetary/apod

const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

//NASA API
const count = 5;
const apiKey = "3qHY2UPMciBAaStCdu6hPumwcWP7wEPE3UsGh1pO";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

function createDOMNodes(page) {
  const pageToRender =
    page === "results" ? resultsArray : Object.values(favorites);

  pageToRender.forEach(result => {
    //Card container
    const card = document.createElement("div");
    card.classList.add("card");
    //link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    //image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the Day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    //card-body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    //card-title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    //Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to Favorites";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "Remove Favorite";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }
    //card text
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    //footer
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    //date
    const date = document.createElement("strong");
    date.textContent = result.date;
    //copyright
    const copyright = document.createElement("span");
    copyright.textContent = result.copyright ? ` ${result.copyright}` : "";

    ///append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);

    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  //get favs from local storage
  if (localStorage.getItem("nasaFavs"))
    favorites = JSON.parse(localStorage.getItem("nasaFavs"));
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

//Get images from NASA api
async function getNasaPictures() {
  //show loading animation
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();

    updateDOM("results");
  } catch (err) {
    console.log(err);
  }
}
//show save confirmation
function showSaveStatus(msg) {
  saveConfirmed.textContent = msg;
  saveConfirmed.hidden = false;
  setTimeout(() => (saveConfirmed.hidden = true), 2000);
}

// Add to favorites
function saveFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    showSaveStatus("You had bookmarked it earlier.");
    return;
  }
  favorites[itemUrl] = resultsArray.filter(item =>
    item.url.includes(itemUrl)
  )[0];
  showSaveStatus("Added.");
  //local storage
  localStorage.setItem("nasaFavs", JSON.stringify(favorites));
}

//remove fav
function removeFavorite(itemUrl) {
  delete favorites[itemUrl];
  localStorage.setItem("nasaFavs", JSON.stringify(favorites));
  showSaveStatus("Removed");
  updateDOM("favs");
}

//onload
getNasaPictures();
