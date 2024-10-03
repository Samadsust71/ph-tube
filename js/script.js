// fetch data from api
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};
const loadVideos = (search = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${search}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};
const removeActiveBtn = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for (const button of buttons) {
    button.classList.remove("active");
  }
};
const loadCatagoriesVideo = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const activeBtn = document.getElementById(`btn-${id}`);
      removeActiveBtn();
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch((error) => console.log(error));
};

// display button
const displayCategories = (categories) => {
  const btnContainer = document.getElementById("btn-container");
  categories.forEach((item) => {
    const btnContent = document.createElement("div");
    btnContent.innerHTML = `
    <button id="btn-${item?.category_id}" onclick="loadCatagoriesVideo(${item?.category_id})" class="btn category-btn">
      ${item?.category}
    </button>
    `;
    btnContainer.append(btnContent);
  });
};

// time formating
const timeFormat = (seconds) => {
  const days = parseInt(seconds / 86400);
  const years = parseInt(days / 365);
  const day = days % 365;
  const remainigH = seconds % 86400;
  const hour = parseInt(remainigH / 3600);
  let remainigS = remainigH % 3600;
  const min = parseInt(remainigS / 60);
  if (days >= 365) {
    return `${years} year ${day} day ${hour} hours ${min} min ago`;
  } else if (days < 365 && days >= 1) {
    return `${day} day ${hour} hours ${min} min ago`;
  } else {
    return `${hour} hours ${min} min ago`;
  }
};
// displays videos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos-container");
  videoContainer.innerHTML = "";
  if (videos.length == 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
    <div class ="flex flex-col min-h-60 justify-center items-center space-y-6 my-10">
      <img src="./assests/Icon.png"/>
      <p class="font-bold text-2xl text-black text-center">Oops!! Sorry, There is no <br> content here</p>
    </div>
    `;
  } else {
    videoContainer.classList.add("grid");
  }
  videos.forEach((video) => {
    const videoContent = document.createElement("div");
    videoContent.classList = "card card-compact";
    videoContent.innerHTML = `
   <figure class="h-[200px] relative">
    <img
      class="h-full w-full object-cover"
      src=${video?.thumbnail}
      alt="${video?.title}" />
      ${
        video?.others?.posted_date
          ? `<div class="absolute top-3/4 right-[8%] bg-black text-white p-2 rounded-md text-[10px]">
       ${timeFormat(video?.others?.posted_date)}
      </div>`
          : ""
      }
   </figure>
   
   <div class="flex gap-2 py-2 px-0">
     <div>
        <img class="h-10 w-10 rounded-full object-cover" src=${
          video.authors[0]?.profile_picture
        } alt="">
     </div>
     <div>
        <h3 class="font-bold">${video?.title}</h3>
        <div class="flex items-center gap-2">
          <p>${video.authors[0].profile_name}</p>
          ${
            video.authors[0]?.verified
              ? `<img class="h-5 w-5" src="https://img.icons8.com/?size=48&id=nNYp7INJQs7d&format=png"/>`
              : ""
          }
        </div>
        <p>
         ${video?.others?.views} views
       </p>
     </div>  
   </div>

    `;
    videoContainer.append(videoContent);
  });
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
});

loadCategories();
loadVideos();
