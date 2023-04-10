//Show more buttons
const showMoreButtonsHandler = () => {
  const cardDescriptions = document.querySelectorAll(".card-description");

  cardDescriptions.forEach((cardDescription) => {
    const parentEl = cardDescription.parentElement;
    const content = cardDescription.innerText.trim();
    const isMoreBtn = parentEl.querySelector(".moreLink");

    if (content.length > 80 && !isMoreBtn) {
      //Add button
      const showMoreBtn = document.createElement("a");
      showMoreBtn.classList.add("moreLink");
      showMoreBtn.setAttribute("href", "#");
      showMoreBtn.innerHTML = "Show more...";

      cardDescription.insertAdjacentHTML("afterend", showMoreBtn.outerHTML);

      // Add handler
      const newMoreLink = parentEl.querySelector(".moreLink");
      newMoreLink.addEventListener("click", (e) => {
        e.preventDefault();
        const cardDesc = newMoreLink.previousElementSibling;
        cardDesc.classList.toggle("full");
        if (cardDesc.classList.contains("full")) {
          newMoreLink.textContent = "Show less...";
        } else {
          newMoreLink.textContent = "Show more...";
        }
      });
    }

    if (content.length <= 80 && !isMoreBtn) {
      cardDescription.classList.add("sm");
    }
  });
};

//Random description
const getRandomDescription = () => {
  function getRandomNumber(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }
  const descriptions = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, impedit enim. Error nulla doloribus quisquam nostrum aperiam repellat obcaecati, explicabo aliquid hic. Molestiae quod non reprehenderit minima ipsa labore atque?",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, placeat.",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur ut doloremque veniam accusantium repellendus mollitia obcaecati delectus ad in accusamus!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, voluptatem, enim deleniti asperiores voluptatibus delectus vero nihil repellendus odio quia voluptatum totam consectetur amet minus commodi eos laudantium quis cupiditate vel laborum tempore dicta quidem. ",
    "Lorem ipsum dolor sit amet consectetur adipisicing.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt assumenda eveniet optio culpa quam corrupti tempore inventore nesciunt harum aut. Consectetur illum iure aut in, modi beatae animi eaque magnam officia numquam libero voluptatem ipsam laudantium laborum impedit quas! Quasi veritatis debitis vitae aperiam quia sint alias soluta expedita laborum.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam itaque accusantium culpa. Quod, neque culpa",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti modi enim odio ex voluptate reiciendis velit saepe quas voluptatum fugit similique praesentium mollitia atque quidem, ullam, facilis fugiat quibusdam explicabo illo! Dolorem, neque blanditiis. Asperiores vitae ducimus maiores nisi cumque mollitia sequi cum ipsam, alias provident impedit ad expedita?",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis magnam sint saepe!",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis labore enim itaque quae velit? Sint, quod.",
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel, debitis delectus!",
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident, sed.",
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam consequuntur molestias dolorum ducimus! Nemo.",
  ];

  return descriptions[getRandomNumber(0, descriptions.length - 1)];
};

// Push new cards
const addCards = (cards) => {
  const cardsWrapper = document.querySelector(".cardsWrapper");

  cards.forEach((card) => {
    const cardHtml = `
       <div class="card-col">
          <div class="card">
               <img src="${`https://picsum.photos/id/${card.id}/500/333`}" alt="Thumb" class="card-img-top">
               <div class="card-body">
                    <h2>${card.author}, ${card.id}</h2>
                    <p class="card-description">${getRandomDescription()}</p>
               </div>
               <footer class="d-flex">
                    <a class="btn btn-primary" href="#" role="button">Save to collection</a>
                    <a class="btn btn-outline-primary" href="#">Share</a>
               </footer>
          </div>
     </div>
       `;
    cardsWrapper.insertAdjacentHTML("beforeend", cardHtml);
  });
};

// Loading cards
const getCards = () => {
  let page = 1;
  const limit = 4;

  const request = async () => {
    await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json, text/html",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length) {
          page += 1;
          return addCards(data);
        }
        loadingAction("done");
      })
      .catch((error) => console.error(error));
  };

  return request;
};

// Request instance
const getCardsInstance = getCards();

//Loading action
const loadingAction = (action) => {
  const wrapper = document.querySelector(".loadingWrapper");
  const loadBtn = `<a class="btn btn-outline-primary loadMoreBtn" href="#">Load more</a>`;
  const loadSpinner = ` <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;

  switch (action) {
    case "pending":
      wrapper.innerHTML = loadSpinner;
      break;

    case "loaded":
      wrapper.innerHTML = loadBtn;
      const loadingBtn = document.querySelector(".loadMoreBtn");
      loadingBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loadCards();
      });
      break;

    case "done":
      wrapper.innerHTML = "";
      break;
  }
};

//Load cards
const loadCards = () => {
  const data = getCardsInstance();
  loadingAction("pending");
  data.then((res) => {
    showMoreButtonsHandler();
    loadingAction("loaded");
  });
};

//Ready
loadCards();

// Infinite scroll
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const loadMoreBtn = document.querySelector(".loadMoreBtn");
  if (loadMoreBtn && scrollTop + clientHeight >= loadMoreBtn.offsetTop - 5) {
    loadCards();
  }
});

//Theme switcher
const setThemeSwitchWrapperPosition = () => {
  const windowWidth = window.innerWidth;
  const containerLeft = document.querySelector(".container").offsetLeft;
  let left;
  windowWidth >= 992 ? (left = `${containerLeft + 16}px`) : (left = "");

  document.querySelector(".themeSwitchWrapper").style.left = `${left}`;
};

window.addEventListener("load", setThemeSwitchWrapperPosition);
window.addEventListener("resize", setThemeSwitchWrapperPosition);

//Toggle theme
function toggleDarkMode() {
  const switcher = document.getElementById("themeSwitcher");
  const body = document.querySelector("body");

  if (localStorage.getItem("theme") === "dark") {
    body.setAttribute("data-theme", "dark");
    switcher.checked = true;
  }

  switcher.addEventListener("change", function () {
    if (this.checked) {
      body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      body.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    }
  });
}

toggleDarkMode();
