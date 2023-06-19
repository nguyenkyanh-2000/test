const BASE_URL = "https://steam-api-mass.onrender.com/";

// ------------------get all game----------------------------
const loadingText = document.getElementById('loading');
const getAllGames = async () => {
  loadingText.style.display = 'block';  
  try {
      const url = `${BASE_URL}games`;
      const res = await fetch(url);
      const data = res.json();
      return data;
    } catch (err) {
        console.log("err",err);
    } finally {
      loadingText.style.display = 'none';
    }
};
getAllGames().then((result) => {console.log(result)});
// Render a list of all game
const renderAllGames = async () => {
    try {
      const gameData = await getAllGames();
      const gameList = document.getElementById("showGame"); // dung id thi dc, query selector thi sai ???
    //   const perGame = gameList.children[0];
      gameList.innerHTML = "";

      gameData.data.forEach((game, index) => {
        const x = document.createElement("div");
        x.innerHTML = `<div class="game_wrap" data-appid=${game.appid}>
        <div class="coverGame" onclick="fetchGameDetails(${game.appid})">
           <img src=${game.header_image} alt="Game Picture">
           <div class="gameInfo">
             <p>${game.name}</p>
             <p>${game.price}$</p>
           </div>
        </div>
    </div>`;

        gameList.appendChild(x);
      });

    } catch (err) {
        console.log("err",err);
    }
};

// document
//    .getElementById("displayTitle")
//    .addEventListener("click",renderAllGames);
renderAllGames();

// Section: Get API Games by Search name of game in the search input
const search = document.getElementById("search_game_name");

const getGameByName = async () => {
  loadingText.style.display = 'block';  
  try {
    let queryString = "";
    if (search.value) {
      queryString += `games?q=${search.value}`;
    }

    const url = `${BASE_URL}${queryString}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;

  } catch (err) {
    console.log("error",err.message);
  } finally {
    loadingText.style.display = 'none';
  }
};

// ------------------Render games by input-----------------------------
const searchGames = async () => {
  const gamesdata = await getGameByName();
  const gameList = document.getElementById("showGame");
  gameList.innerHTML = "";
  gamesdata.data.forEach((game, index) => {
    const x = document.createElement("div");
    x.innerHTML = `<div class="game_wrap" data-appid=${game.appid}>
    <div class="coverGame" onclick="fetchGameDetails(${game.appid})">
       <img src=${game.header_image} alt="Game Picture">
       <div class="gameInfo">
         <p>${game.name}</p>
         <p>${game.price}$</p>
       </div>
    </div>
</div>`;

    gameList.appendChild(x);
    document.getElementById("displayTitle").textContent = `${search.value}`;
  });
}
document
  .getElementById("searchButton")
  .addEventListener("click",searchGames);

// --------------Section: Get API games by genres------------------------

async function genresGame(genre) {
  // loadingText.style.display = 'block'; 
  try {
    const param = `${genre}`;
    param.replace(/ /g, '%20');
    const url = `${BASE_URL}games?genres=${param}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Unable to fetch game details');
    }
    const gameData = await response.json();
    const gameList = document.getElementById("showGame");
    gameList.innerHTML = "";
    gameData.data.forEach((game, index) => {
      const x = document.createElement("div");
      x.innerHTML = `<div class="game_wrap" data-appid=${game.appid}>
      <div class="coverGame" onclick="fetchGameDetails(${game.appid})">
         <img src=${game.header_image} alt="Game Picture">
         <div class="gameInfo">
           <p>${game.name}</p>
           <p>${game.price}$</p>
         </div>
      </div>
  </div>`;
  
      gameList.appendChild(x);
      document.getElementById("displayTitle").textContent =`${genre}`;
      return gameList;
    });
  } catch (err) {
    console.log("error",err);
  // } finally {
  //   loadingText.style.display = 'none';
  // }
}
};

// ---------------- Render genres list------------------------------
const getGenresList = async () => {
  loadingText.style.display = 'block'; 
  try {
    const url = "https://steam-api-mass.onrender.com/genres";
    const response = await fetch(url);
    const data = response.json();
    return data;
  } catch (err) {
    console.log("err",err);
  } finally {
    loadingText.style.display = 'none';
  }
};

const renderGenresList = async () => {
  try {
    const dataGenre = await getGenresList();
    const genreList = document.getElementById("categoryGenre");
    genreList.innerHTML = "";

    dataGenre.data.forEach((game,index) => {
      const y = document.createElement("li");
      y.setAttribute("id",`${game.name}`);
      y.textContent = `${game.name}`;
      y.setAttribute("onclick", `genresGame('${game.name}')`);
      genreList.appendChild(y);
    });
  } catch (err) {
    console.log("err",err);
  }
};
renderGenresList();



// -------------------- Section: Get single game detail --------------------------------------

// Function to fetch game details
async function fetchGameDetails(appid) {
  const url = `https://steam-api-mass.onrender.com/single-game/${appid}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Unable to fetch game details');
    }

    const gamedata = await response.json();
    const gameDetails = gamedata.data;

    const gameList = document.getElementById("showGame");
    gameList.innerHTML = "";
    const x = document.createElement("div");
    x.innerHTML = `<div class="showing_game_detail">
    <div class="title_contain">
        <div class="title">${gameDetails.name}</div>
        <div class="game_price">${gameDetails.price}$</div>
    </div>

    <div class="img_detail">
        <img src=${gameDetails.header_image} alt="">
        <div class="game_detail">
            <div class="game_description">${gameDetails.description}</div>
            <div class="game_information">
                <p>RECENT REVIEWS: Very Positive</p>
                <p>RELEASE DATE: ${gameDetails.release_date}</p>
                <p>DEVELOPER: ${gameDetails.developer}</p>
                <p>Average Playtime: ${gameDetails.average_playtime}</p>
            </div>
        </div>
    </div>

    <div class="tags_contain">
        Popular user-defined tags for this product:
        <div class="tags">
            <div class="tag">Idler</div>
            <div class="tag">MMORPG</div>
            <div class="tag">Management</div>
            <div class="tag">Clicker</div>
            <div class="tag">Sandbox</div>
            <div class="tag">
                RPG</div>
        </div>
    </div>
</div>`;
    gameList.appendChild(x);
    return gameList;
  } catch (error) {

    console.error(error);
  }
};
