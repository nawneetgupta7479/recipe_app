const searchbtn = document.querySelector("#searchbtn");
const searchinput = document.querySelector("#inputsearch");
const recipename = document.querySelector(".recipename");
const recipecontainer = document.querySelector(".recipecontainer");

const fetchRecipes = async () => {
    const query = searchinput.value.trim();
    if (!query) {
        recipename.textContent = "Please enter a recipe name.";
        recipecontainer.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.meals) {
            console.log(data.meals);
            displayRecipes(data.meals);
        } else {
            console.log("No recipes found");
            recipename.textContent = "No recipes found";
            recipecontainer.innerHTML = "";
        }
    } catch (error) {
        console.error('Error fetching the recipe:', error);
        recipename.textContent = "An error occurred. Please try again later.";
        recipecontainer.innerHTML = "";
    }
};

const displayRecipes = (recipes) => {
    recipename.textContent = "Recipe Results:";
    recipecontainer.innerHTML = recipes.map(recipe => `
        <div class="recipe">
            <h3>${recipe.strMeal}</h3>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h4>Instructions:</h4>
            <p>${recipe.strInstructions}</p>
            <h4>Ingredients:</h4>
            <ul>
                ${Object.keys(recipe)
                    .filter(key => key.startsWith('strIngredient') && recipe[key])
                    .map(key => `<li>${recipe[key]} - ${recipe[`strMeasure${key.match(/\d+/)[0]}`]}</li>`)
                    .join('')}
            </ul>
        </div>
    `).join('');
};

searchbtn.addEventListener("click", (e) => {
    e.preventDefault();
    fetchRecipes();
});

searchinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        fetchRecipes();
    }
});
