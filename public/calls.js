let Calls = (function() {

    var favouriteDrinks = []
    var drianks = [];

    function searchCocktailsImpl(searchInput) {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
            .then(response => response.json())
            .then(json => {

                var drinks = json.drinks;

                //Next line will clear complete div, so they don't append on next search...
                document.getElementById("resultsDiv").innerHTML = "";

                if (drinks == null) {
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any drinks :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchInputDiv);
                } else fillResultsDiv(drinks);
            })
    }

    function searchForCocktailsByIngredientImpl(searchInput) {

        fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + searchInput)
            .then(response => {
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json'))
                    return {
                        drinks: null
                    };

                return response.json();
            })
            .then(json => {

                var drinks = json.drinks;

                //Next line will clear complete div, so they don't append on next search...
                document.getElementById("resultsDiv").innerHTML = "";

                if (drinks == null && searchInput != "") {
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any drinks with that ingredient :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchInputDiv);
                } else {
                    var drinksWithSpecifiedIngredient = [];
                    const promises = drinks.map(drink =>
                        fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drink.idDrink).then(response => response.json()).then(json => {
                            drinksWithSpecifiedIngredient.push(json.drinks[0]);
                        }));
                    Promise.all(promises).then(function(ok) {
                        fillResultsDiv(drinksWithSpecifiedIngredient);
                    });
                }

            })
    }

    function searchForFilteredDrinksImpl(searchInput, isAlcoholic) {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
            .then(response => response.json())
            .then(json => {

                var drinks = json.drinks;

                //Next line will clear complete div, so they don't append on next search...
                document.getElementById("resultsDiv").innerHTML = "";

                if (drinks == null) {
                    var alcoholicSign = "";
                    if (isAlcoholic) alcoholicSign = "alcoholic";
                    else alcoholicSign = "alcohol free";
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any " + alcoholicSign + " drinks :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    document.getElementById("resultsDiv").appendChild(noSearchInputDiv);
                } else {
                    //1 is for alcoholic drinks, 0 is for alcohol free (isAlcoholic parameter value)
                    if (isAlcoholic) {
                        for (var i = 0; i < drinks.length; i++)
                            if (drinks[i].strAlcoholic != "Alcoholic") {
                                drinks.splice(i, 1);
                                i--;
                            }
                    } else {
                        for (var i = 0; i < drinks.length; i++)
                            if (drinks[i].strAlcoholic == "Alcoholic") {
                                drinks.splice(i, 1);
                                i--;
                            }
                    }
                    fillResultsDiv(drinks);
                }
            })
    }

    function listTenRandomCocktailsImpl() {

        //Next line will clear complete div, so they don't append on next search...
        document.getElementById("resultsDiv").innerHTML = "";

        // https://www.thecocktaildb.com/api/json/v1/1/random.php
        var randomDrinks = [];
        var cheatLoop = (new Array(10)).fill(0);
        const promises = cheatLoop.map(drink =>
            fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(response => response.json()).then(json => {
                randomDrinks.push(json.drinks[0]);
            }));
        Promise.all(promises).then(function(ok) {
            fillResultsDiv(randomDrinks);
        });

    }

    function shakeCocktailImpl() {
        var shaker = document.getElementById("shaker");
        shaker.innerHTML = "";

        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php').
        then(response => response.json()).
        then(json => {
            var drink = json.drinks[0];
            var drinkDiv = document.createElement("div");
            drinkDiv.setAttribute("id", "shakedCocktail");
            drinkDiv.style.setProperty("padding", "15px");
            drinkDiv.style.setProperty("background", "rgba(0, 0, 0, 0.2)");
            drinkDiv.style.setProperty("border-radius", "20px");

            var cocktailName = generateBarmansRecommandation(drink.strDrink);
            var alcoholAlertParagraph = generateAlcoholAlertParagraph(drink.strAlcoholic);
            var cocktailInfoDiv = generateCocktailInfoDiv(drink);
            var addToFavouritesButtonDiv = generateAddToFavouritesButtonDiv();

            drinkDiv.appendChild(cocktailName);
            drinkDiv.appendChild(alcoholAlertParagraph);
            drinkDiv.appendChild(cocktailInfoDiv);
            drinkDiv.appendChild(addToFavouritesButtonDiv);



            var shakeButton = document.createElement("button");
            shakeButton.innerHTML = "SHAKE";
            shakeButton.setAttribute("id", "shakeButton");
            shakeButton.setAttribute("onclick", "shakeACocktail()");

            shaker.append(drinkDiv);
            shaker.append(shakeButton);
        });
    }

    function shakeAnotherCocktailImpl() {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php').
        then(response => response.json()).
        then(json => {
            var drink = json.drinks[0];
            var drinkDiv = document.getElementById("shakedCocktail");
            drinkDiv.innerHTML = "";
            var cocktailName = generateBarmansRecommandation(drink.strDrink);
            var alcoholAlertParagraph = generateAlcoholAlertParagraph(drink.strAlcoholic);
            var cocktailInfoDiv = generateCocktailInfoDiv(drink);
            var addToFavouritesButtonDiv = generateAddToFavouritesButtonDiv();

            drinkDiv.appendChild(cocktailName);
            drinkDiv.appendChild(alcoholAlertParagraph);
            drinkDiv.appendChild(cocktailInfoDiv);
            drinkDiv.appendChild(addToFavouritesButtonDiv);

        });
    }

    function writeFavouriteCocktailsFileImpl(jsonDrink) {
        console.log(jsonDrink);
    }

    return {
        searchCocktails: searchCocktailsImpl,
        searchForCocktailsByIngredient: searchForCocktailsByIngredientImpl,
        searchForFilteredDrinks: searchForFilteredDrinksImpl,
        listTenRandomCocktails: listTenRandomCocktailsImpl,
        shakeCocktail: shakeCocktailImpl,
        shakeAnotherCocktail: shakeAnotherCocktailImpl,
        writeFavouriteCocktailsFile: writeFavouriteCocktailsFileImpl
    }

}())

function generateImage(src, width, height) {
    var image = document.createElement("img");
    image.src = src;
    image.width = width;
    image.height = height;
    return image;
}

function generateErrorDiv(message, imageSource) {

    var noSearchResultDiv = document.createElement("div");
    noSearchResultDiv.style.padding = "15px";
    noSearchResultDiv.style.textAlign = "center";

    var errorMessage = document.createElement("p");
    errorMessage.innerHTML = message;
    errorMessage.classList.add("wrongSearch");

    var errorImage = generateImage(imageSource, "200", "200");

    noSearchResultDiv.appendChild(errorMessage);
    noSearchResultDiv.appendChild(errorImage);
    return noSearchResultDiv;
}

function generateCocktailName(cocktailName) {
    var nameParagraph = document.createElement("p");
    nameParagraph.innerHTML = cocktailName.toUpperCase();
    nameParagraph.style.fontSize = "20px";
    nameParagraph.classList.add("drinkName");
    return nameParagraph;
}

function generateBarmansRecommandation(cocktailName) {
    var header = document.createElement("div");
    header.style.setProperty("display", "flex");

    var recommendedMessage = document.createElement("p");
    recommendedMessage.innerHTML = "RECOMMENDED";
    recommendedMessage.setAttribute("id", "recommendedMessage");

    var img = document.createElement("img");
    img.setAttribute("src", "star.png");
    img.setAttribute("id", "starImage");

    var nameParagraph = document.createElement("p");
    nameParagraph.innerHTML = cocktailName.toUpperCase();
    nameParagraph.classList.add("drinkName");



    header.appendChild(recommendedMessage);
    header.appendChild(img);
    header.appendChild(nameParagraph);
    return header;
}

function generateAlcoholAlertParagraph(alcoholSign) {
    var alcoholAlertParagraph = document.createElement("p");
    if (alcoholSign == "Alcoholic") {
        alcoholAlertParagraph.innerHTML = "ALCOHOLIC";
        alcoholAlertParagraph.classList.add("alcoholic");
    } else {
        alcoholAlertParagraph.innerHTML = "ALCOHOL FREE";
        alcoholAlertParagraph.classList.add("alcoholFree");
    }
    return alcoholAlertParagraph;
}

function generateAddToFavouritesButtonDiv() {
    var buttonDiv = document.createElement("div");
    var addToFavouritesButton = document.createElement("button");
    addToFavouritesButton.setAttribute("id", "addToFavourites");
    addToFavouritesButton.setAttribute("onclick", "clickAddToFavourites(this.parentElement.parentElement)");
    addToFavouritesButton.innerHTML = "ADD TO FAVOURITES";
    buttonDiv.appendChild(addToFavouritesButton);
    return buttonDiv;
}

function generateCocktailInfoDiv(drink) {
    var cocktailInfoDiv = document.createElement("div");
    cocktailInfoDiv.style.display = "inline-block";

    var cocktailImage = generateImage(drink.strDrinkThumb, "180", "200");
    cocktailImage.style.float = "left";

    var cocktailDescription = generateCocktailDescription(drink);

    cocktailInfoDiv.appendChild(cocktailImage);
    cocktailInfoDiv.appendChild(cocktailDescription);
    return cocktailInfoDiv;
}

function generateCocktailDescription(drink) {
    var cocktailDescription = document.createElement("p");
    cocktailDescription.style.float = "left";
    cocktailDescription.style.color = "white";
    cocktailDescription.style.paddingLeft = "5px";

    var backSpaceMatched = false;
    var cocktailDescriptionParagraph = document.createElement("p");
    cocktailDescriptionParagraph.style.fontSize = "15px";
    for (var i = 0; i < drink.strInstructions.length; i++) {
        if (backSpaceMatched && drink.strInstructions[i] == ' ') {
            cocktailDescriptionParagraph.innerHTML += "<br>";
            backSpaceMatched = false;
        }
        if (i != 0 && i % 40 == 0) {
            if (drink.strInstructions[i] == ' ')
                cocktailDescriptionParagraph.innerHTML += "<br>";
            else backSpaceMatched = true;
        }
        cocktailDescriptionParagraph.innerHTML += drink.strInstructions[i];
    }

    cocktailDescriptionParagraph.innerHTML += "<br>";
    cocktailDescriptionParagraph.innerHTML += "<br>";


    var ingredientsTable = document.createElement("table");
    ingredientsTable.id = "ingredientsTable";

    var counter = 1;
    while (drink["strIngredient" + counter.toString()] != null && drink["strIngredient" + counter.toString()] != "") {
        var row = ingredientsTable.insertRow(ingredientsTable.rows.length);

        var cellDrop = row.insertCell(0);
        var imageDrop = generateImage("drop.png", "20", "20");
        cellDrop.appendChild(imageDrop);

        var cellIngredient = row.insertCell(1);
        cellIngredient.innerHTML = drink["strIngredient" + counter.toString()];
        cellIngredient.style.fontWeight = "bold";

        if (drink["strMeasure" + counter.toString()] != null) {
            var cellMeasure = row.insertCell(2);
            cellMeasure.innerHTML = drink["strMeasure" + counter.toString()];
        }

        counter++;
    }

    cocktailDescription.appendChild(cocktailDescriptionParagraph);
    cocktailDescription.appendChild(ingredientsTable);
    return cocktailDescription;
}

function fillResultsDiv(drinks) {
    console.log(drinks);
    var resultsDiv = document.getElementById("resultsDiv");
    for (var i = 0; i < drinks.length; i++) {
        var drinkDiv = document.createElement("div");
        drinkDiv.style.padding = "15px";

        var cocktailName = generateCocktailName(drinks[i].strDrink);
        var alcoholAlertParagraph = generateAlcoholAlertParagraph(drinks[i].strAlcoholic);
        var cocktailInfoDiv = generateCocktailInfoDiv(drinks[i]);
        var addToFavouritesButtonDiv = generateAddToFavouritesButtonDiv();

        drinkDiv.appendChild(cocktailName);
        drinkDiv.appendChild(alcoholAlertParagraph);
        drinkDiv.appendChild(cocktailInfoDiv);
        drinkDiv.appendChild(addToFavouritesButtonDiv);

        if (i < drinks.length - 1) {
            drinkDiv.style.borderBottom = "2px solid rgba(255,255,255,0.3)";
            drinkDiv.style.marginTop = "5px";
        }

        resultsDiv.appendChild(drinkDiv);

    }
    resultsDiv.style.overflowY = "auto";
    resultsDiv.style.height = "55vh";
}