// JavaScript code for link saver site

// Function to toggle between light and dark mode
function toggleSwitch() {
  var body = document.body;
  var themeSwitch = document.getElementById("themeSwitch");

  if (themeSwitch.checked) {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
  }
}

// Function to save the YouTube link
function saveLink() {
  var linkInput = document.getElementById("youtubeLink");
  var linkList = document.getElementById("linkList");

  if (linkInput.value !== "") {
    var videoId = getVideoId(linkInput.value);
    if (videoId) {
      fetchVideoName(videoId)
        .then(function (videoName) {
          var linkItem = createLinkItem(videoName, linkInput.value);
          linkList.appendChild(linkItem);
          linkInput.value = "";
          saveLinksToLocalStorage();
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      console.error("Invalid YouTube link");
    }
  }
}

// Function to delete a saved link
function deleteLink(deleteButton) {
  var listItem = deleteButton.parentNode;
  var linkList = listItem.parentNode;
  linkList.removeChild(listItem);
  saveLinksToLocalStorage();
}

// Function to extract the video ID from the YouTube link
function getVideoId(url) {
  var videoId = null;
  var regex = /[?&]v=([^?&]+)/;
  var match = url.match(regex);
  if (match) {
    videoId = match[1];
  }
  return videoId;
}

// Function to fetch the video name using the YouTube API
function fetchVideoName(videoId) {
  var apiKey = "YOUR_YOUTUBE_API_KEY"; // Replace with your YouTube API key
  var apiUrl =
    "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" +
    videoId +
    "&key=" +
    apiKey;

  return fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var videoName = data.items[0].snippet.title;
      return videoName;
    });
}

// Function to create a link item element
function createLinkItem(videoName, videoUrl) {
  var linkItem = document.createElement("li");
  linkItem.className = "link-item";
  linkItem.innerHTML =
    '<input type="checkbox" class="link-item-checkbox"><a href="' +
    videoUrl +
    '">' +
    videoName +
    '</a><button class="delete-button" onclick="deleteLink(this)">Delete</button>';
  return linkItem;
}

// Function to save the links to local storage
function saveLinksToLocalStorage() {
  var linkList = document.getElementById("linkList");
  var links = [];

  for (var i = 0; i < linkList.children.length; i++) {
    var linkItem = linkList.children[i];
    var linkUrl = linkItem.querySelector("a").getAttribute("href");
    links.push(linkUrl);
  }

  localStorage.setItem("savedLinks", JSON.stringify(links));
}

// Function to load the links from local storage
function loadLinksFromLocalStorage() {
  var linkList = document.getElementById("linkList");
  var links = JSON.parse(localStorage.getItem("savedLinks"));

  if (links && links.length > 0) {
    for (var i = 0; i < links.length; i++) {
      var linkUrl = links[i];
      var linkItem = createLinkItem("Loading...", linkUrl);
      linkList.appendChild(linkItem);

      fetchVideoName(getVideoId(linkUrl))
        .then(function (videoName) {
          linkItem.innerHTML =
            '<input type="checkbox" class="link-item-checkbox"><a href="' +
            linkUrl +
            '">' +
            videoName +
            '</a><button class="delete-button" onclick="deleteLink(this)">Delete</button>';
          saveLinksToLocalStorage();
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }
}

// Load the links from local storage when the page loads
window.addEventListener("load", function () {
  loadLinksFromLocalStorage();
});
