let Calls = (function() {

    var favouriteDrinks = [];

    function searcForCocktailsImpl(searchInput) {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
            .then(response => response.json())
            .then(json => {

                var drinks = json.drinks;
                var searchResultsDiv = document.getElementById("searchResultsDiv");
                //Next line will clear complete div, so they don't append on next search...
                searchResultsDiv.innerHTML = "";

                if (drinks == null) {
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any drinks :(", "brokenSearch.png");
                    searchResultsDiv.appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    searchResultsDiv.appendChild(noSearchInputDiv);
                } else fillSearchResultsDiv(drinks);
            });
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
                var searchResultsDiv = document.getElementById("searchResultsDiv");
                //Next line will clear complete div, so they don't append on next search...
                searchResultsDiv.innerHTML = "";

                if (drinks == null && searchInput != "") {
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any drinks with that ingredient :(", "brokenSearch.png");
                    searchResultsDiv.appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    searchResultsDiv.appendChild(noSearchInputDiv);
                } else {
                    var drinksWithSpecifiedIngredient = [];
                    const promises = drinks.map(drink =>
                        fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drink.idDrink).then(response => response.json()).then(json => {
                            drinksWithSpecifiedIngredient.push(json.drinks[0]);
                        }));
                    Promise.all(promises).then(function(ok) {
                        fillSearchResultsDiv(drinksWithSpecifiedIngredient);
                    });
                }
            });
    }

    function searchForFilteredDrinksImpl(searchInput, isAlcoholic) {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
            .then(response => response.json())
            .then(json => {

                var drinks = json.drinks;
                var searchResultsDiv = document.getElementById("searchResultsDiv");
                //Next line will clear complete div, so they don't append on next search...
                searchResultsDiv.innerHTML = "";

                if (drinks == null) {
                    var alcoholicSign = "alcohol free";
                    if (isAlcoholic) alcoholicSign = "alcoholic";
                    var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find any " + alcoholicSign + " drinks :(", "brokenSearch.png");
                    searchResultsDiv.appendChild(noSearchResultDiv);
                } else if (searchInput == "") {
                    var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(", "brokenSearch.png");
                    searchResultsDiv.appendChild(noSearchInputDiv);
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
                    fillSearchResultsDiv(drinks);
                }
            });
    }

    function listTenRandomCocktailsImpl() {

        var searchResultsDiv = document.getElementById("searchResultsDiv");
        //Next line will clear complete div, so they don't append on next search...
        searchResultsDiv.innerHTML = "";

        var randomDrinks = [];
        var cheatLoop = (new Array(10)).fill(0);
        const promises = cheatLoop.map(notUsed =>
            fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(response => response.json()).then(json => {
                randomDrinks.push(json.drinks[0]);
            }));
        Promise.all(promises).then(function(ok) {
            fillSearchResultsDiv(randomDrinks);
        });

    }

    function shakeCocktailImpl() {
        var shakeComponent = document.getElementById("shakeComponent");
        shakeComponent.innerHTML = "";

        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php').
        then(response => response.json()).
        then(json => {
            var drink = json.drinks[0];
            var randomDrinkDiv = document.createElement("div");
            randomDrinkDiv.setAttribute("id", "randomDrinkDiv");

            var cocktailName = generateBarmansRecommandationTitle(drink.strDrink);
            var alcoholAlertParagraph = generateAlcoholAlertParagraph(drink.strAlcoholic);
            var cocktailInfoDiv = generateCocktailInfoDiv(drink, false);
            var addToFavouritesButtonDiv = generateAddToFavouritesButton();

            randomDrinkDiv.appendChild(cocktailName);
            randomDrinkDiv.appendChild(alcoholAlertParagraph);
            randomDrinkDiv.appendChild(cocktailInfoDiv);
            randomDrinkDiv.appendChild(addToFavouritesButtonDiv);

            var shakeButton = document.createElement("button");
            shakeButton.innerHTML = "SHAKE";
            shakeButton.setAttribute("id", "shakeButton");
            shakeButton.setAttribute("onclick", "clickShakeButton()");

            shakeComponent.append(randomDrinkDiv);
            shakeComponent.append(shakeButton);
        });
    }

    function shakeAnotherCocktailImpl() {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php').
        then(response => response.json()).
        then(json => {
            var drink = json.drinks[0];
            var drinkDiv = document.getElementById("shakedCocktail");
            drinkDiv.innerHTML = "";
            var cocktailName = generateBarmansRecommandationTitle(drink.strDrink);
            var alcoholAlertParagraph = generateAlcoholAlertParagraph(drink.strAlcoholic);
            var cocktailInfoDiv = generateCocktailInfoDiv(drink, false);
            var addToFavouritesButtonDiv = generateAddToFavouritesButton();

            drinkDiv.appendChild(cocktailName);
            drinkDiv.appendChild(alcoholAlertParagraph);
            drinkDiv.appendChild(cocktailInfoDiv);
            drinkDiv.appendChild(addToFavouritesButtonDiv);

        });
    }

    function writeFavouriteCocktailsFileImpl(jsonFavouriteDrink, cellNotificationMessage) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                if (response.alertMessage)
                    cellNotificationMessage.innerHTML = response.alertMessage;
                else
                    cellNotificationMessage.innerHTML = response.confirmedAdding;
                favouriteDrinks = response.favourites;
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("POST", "addFavourite", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({
            name: jsonFavouriteDrink.name,
            isAlcoholic: jsonFavouriteDrink.isAlcoholic,
            imageSource: jsonFavouriteDrink.imageSource,
            description: jsonFavouriteDrink.description,
            ingredients: jsonFavouriteDrink.ingredients,
            measures: jsonFavouriteDrink.measures
        }));



    }

    function loadFavouriteDrinksImpl() {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                favouriteDrinks = response.favourites;
                fillFavouriteDrinksImpl();
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "favs", true);
        ajax.send();
    }

    function fillFavouriteDrinksImpl() {
        var favouriteDrinksDiv = document.getElementById("favouriteDrinksDiv");
        favouriteDrinksDiv.innerHTML = "";

        for (var i = 0; i < favouriteDrinks.length; i++) {
            var favouriteDrinkDiv = document.createElement("div");
            favouriteDrinkDiv.style.setProperty("padding", "30px");

            var cocktailName = generateDrinkTitle(favouriteDrinks[i].name, true);

            var alcoholSign = "AlcoholFree";
            if (favouriteDrinks[i].isAlcoholic) alcoholSign = "Alcoholic";
            var alcoholAlertParagraph = generateAlcoholAlertParagraph(alcoholSign);

            var additionDrinkInfo = {
                strDrinkThumb: favouriteDrinks[i].imageSource,
                strInstructions: favouriteDrinks[i].description
            };

            for (var j = 0; j < favouriteDrinks[i].ingredients.length; j++) {
                additionDrinkInfo["strIngredient" + (j + 1).toString()] = favouriteDrinks[i].ingredients[j];
                if (favouriteDrinks[i].measures[j] != "undefined") additionDrinkInfo["strMeasure" + (j + 1).toString()] = favouriteDrinks[i].measures[j];
            }

            var drinkInfoDiv = generateCocktailInfoDiv(additionDrinkInfo, true);

            /*We need to modify it a bit, because it's not the same on 'favourites.html'.*/
            var descriptionParagraph = drinkInfoDiv.children[1].children[0];
            descriptionParagraph.setAttribute("id", "descriptionParagraph");
            descriptionParagraph.setAttribute("contenteditable", "true");
            descriptionParagraph.style.setProperty("padding", "10px");

            var edittingControlButtonsDiv = document.createElement("div");
            edittingControlButtonsDiv.setAttribute("id", "edittingControlButtonsDiv");
            var saveButton = document.createElement("a");
            saveButton.setAttribute("href", "#popup1");
            saveButton.setAttribute("id", "saveButton");
            saveButton.setAttribute("onclick", "clickSaveButton()");
            saveButton.innerHTML = "SAVE";

            var cancelButton = document.createElement("button");
            cancelButton.setAttribute("id", "cancelEdittingButton");
            cancelButton.innerHTML = "CANCEL";
            cancelButton.setAttribute("onclick", "clickCancelButton(this.parentElement.parentElement)");

            edittingControlButtonsDiv.appendChild(saveButton);
            edittingControlButtonsDiv.appendChild(cancelButton);

            var ingredientsTable = drinkInfoDiv.children[1].children[1];
            ingredientsTable.setAttribute("id", "favouriteIngredientsTable");

            favouriteDrinkDiv.appendChild(cocktailName);
            favouriteDrinkDiv.appendChild(alcoholAlertParagraph);
            favouriteDrinkDiv.appendChild(drinkInfoDiv);
            favouriteDrinkDiv.appendChild(edittingControlButtonsDiv);

            if (i < favouriteDrinks.length - 1) {
                favouriteDrinkDiv.style.setProperty("border-bottom", "2px solid rgba(255,255,255,0.3)");
                favouriteDrinkDiv.style.setProperty("margin-top", "5px");
            }

            favouriteDrinksDiv.appendChild(favouriteDrinkDiv);
        }
    }

    function getFavouriteDrinksImpl() {
        return favouriteDrinks;
    }

    function saveChangesImpl(data) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                favouriteDrinks = response.favourites;
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("POST", "refreshFavourites", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({
            favourites: data
        }));
    }

    return {
        searcForCocktails: searcForCocktailsImpl,
        searchForCocktailsByIngredient: searchForCocktailsByIngredientImpl,
        searchForFilteredDrinks: searchForFilteredDrinksImpl,
        listTenRandomCocktails: listTenRandomCocktailsImpl,
        shakeCocktail: shakeCocktailImpl,
        shakeAnotherCocktail: shakeAnotherCocktailImpl,
        writeFavouriteCocktailsFile: writeFavouriteCocktailsFileImpl,
        loadFavouriteDrinks: loadFavouriteDrinksImpl,
        fillFavouriteDrinks: fillFavouriteDrinksImpl,
        getFavouriteDrinks: getFavouriteDrinksImpl,
        saveChanges: saveChangesImpl
    }

}())

function generateImage(src, width, height) {
    var image = document.createElement("img");
    image.setAttribute("src", src);
    image.style.setProperty("width", width);
    image.style.setProperty("height", height);
    return image;
}

function generateErrorDiv(message, imageSource) {

    var errorDiv = document.createElement("div");
    errorDiv.setAttribute("id", "errorDiv");

    var errorMessage = document.createElement("p");
    errorMessage.setAttribute("id", "wrongSearch")
    errorMessage.innerHTML = message;

    var errorImage = generateImage(imageSource, "200px", "200px");

    errorDiv.appendChild(errorMessage);
    errorDiv.appendChild(errorImage);

    return errorDiv;
}

function generateDrinkTitle(cocktailName, withDeleteButton) {
    var drinkTitle = document.createElement("p");
    drinkTitle.innerHTML = cocktailName;
    drinkTitle.classList.add("drinkTitle");

    if (withDeleteButton) {
        var drinkTitleDiv = document.createElement("div");
        drinkTitleDiv.style.setProperty("display", "flex");

        drinkTitle.className = "";
        drinkTitle.setAttribute("id", "favouriteDrinkTitle");
        drinkTitle.setAttribute("contenteditable", "true");

        var removeFavouriteDrinkButton = document.createElement("button");
        removeFavouriteDrinkButton.setAttribute("id", "removeFavouriteDrinkButton");
        removeFavouriteDrinkButton.setAttribute("onclick", "clickRemoveFavouriteDrinkButton(this.parentElement.parentElement)");

        var cancelImage = document.createElement("img");
        cancelImage.setAttribute("id", "removeFavouriteDrinkIcon");
        cancelImage.setAttribute("src", "cancel.png");

        removeFavouriteDrinkButton.appendChild(cancelImage);

        drinkTitleDiv.appendChild(drinkTitle);
        drinkTitleDiv.appendChild(removeFavouriteDrinkButton);

        return drinkTitleDiv;
    } else return drinkTitle;
}

function generateBarmansRecommandationTitle(cocktailName) {
    var titleDiv = document.createElement("div");
    titleDiv.style.setProperty("display", "flex");

    var recommendedMessage = document.createElement("p");
    recommendedMessage.setAttribute("id", "recommendedMessage");
    recommendedMessage.innerHTML = "RECOMMENDED";

    var starIcon = document.createElement("img");
    starIcon.setAttribute("src", "star.png");
    starIcon.setAttribute("id", "starIcon");

    var drinkTitle = document.createElement("p");
    drinkTitle.innerHTML = cocktailName;
    drinkTitle.classList.add("drinkTitle");

    titleDiv.appendChild(recommendedMessage);
    titleDiv.appendChild(starIcon);
    titleDiv.appendChild(drinkTitle);

    return titleDiv;
}

function generateAlcoholAlertParagraph(alcoholSign) {
    var alcoholAlertParagraph = document.createElement("p");
    alcoholAlertParagraph.innerHTML = "ALCOHOL FREE";
    alcoholAlertParagraph.classList.add("alcoholFree");

    if (alcoholSign == "Alcoholic") {
        alcoholAlertParagraph.className = "";
        alcoholAlertParagraph.classList.add("alcoholic");
        alcoholAlertParagraph.innerHTML = "ALCOHOLIC";
    }

    return alcoholAlertParagraph;
}

function generateAddToFavouritesButton() {
    var buttonDiv = document.createElement("div");
    var button = document.createElement("button");
    button.innerHTML = "ADD TO FAVOURITES";
    button.setAttribute("id", "addToFavouritesButton");
    button.setAttribute("onclick", "clickAddToFavouritesButton(this.parentElement.parentElement)");
    buttonDiv.appendChild(button);

    return buttonDiv;
}

function generateCocktailInfoDiv(drink, isOnFavourite) {
    var cocktailInfoDiv = document.createElement("div");
    cocktailInfoDiv.style.setProperty("display", "inline-block");

    var imageWidth = "180px";
    var imageHeight = "200px";
    if (isOnFavourite) {
        imageWidth = "280px";
        imageHeight = "300px";
    }

    var cocktailImage = generateImage(drink.strDrinkThumb, imageWidth, imageHeight);
    cocktailImage.style.setProperty("float", "left");

    var cocktailDescription = generateCocktailDescription(drink, isOnFavourite);

    cocktailInfoDiv.appendChild(cocktailImage);
    cocktailInfoDiv.appendChild(cocktailDescription);
    return cocktailInfoDiv;
}

function generateCocktailDescription(drink, isFavouriteSite) {
    var breakSize = 40;
    var drinkDescriptionDiv = document.createElement("div");
    drinkDescriptionDiv.setAttribute("id", "drinkDescriptionDiv");

    var drinkDescription = document.createElement("p");

    var ingredientsTable = document.createElement("table");
    ingredientsTable.setAttribute("id", "ingredientsTable");

    if (isFavouriteSite) {
        drinkDescriptionDiv.style.setProperty("display", "flex");
        drinkDescriptionDiv.style.setProperty("margin-left", "50px");
        drinkDescription.style.setProperty("font-size", "25px");
        breakSize = 50;

        /*Ingredients table on 'home.html doesn't have headers, but
        on 'favourites.html' has.*/
    }

    var backSpaceMatched = false;
    for (var i = 0; i < drink.strInstructions.length; i++) {
        if (backSpaceMatched && drink.strInstructions[i] == ' ') {
            drinkDescription.innerHTML += "<br>";
            backSpaceMatched = false;
        }
        if (i != 0 && i % breakSize == 0) {
            if (drink.strInstructions[i] == ' ')
                drinkDescription.innerHTML += "<br>";
            else backSpaceMatched = true;
        }
        drinkDescription.innerHTML += drink.strInstructions[i];
    }

    drinkDescription.innerHTML += "<br>";
    drinkDescription.innerHTML += "<br>";

    var counter = 1;

    if (isFavouriteSite) {
        /* This 'if' is used for adding mentioned headers*/
        var titleHeader = document.createElement("th");

        var titleHeaderDiv = document.createElement("div");
        titleHeaderDiv.setAttribute("id", "titleHeaderDiv");

        var dropImageHeader = document.createElement("img");
        dropImageHeader.setAttribute("id", "dropImageHeader");
        dropImageHeader.setAttribute("src", "drop.png");

        var ingredientsHeader = document.createElement("p");
        ingredientsHeader.setAttribute("id", "ingredientsHeader");
        ingredientsHeader.innerHTML = "Ingredients";

        titleHeaderDiv.appendChild(dropImageHeader);
        titleHeaderDiv.appendChild(ingredientsHeader);

        titleHeader.appendChild(titleHeaderDiv);

        var addIngredientHeader = document.createElement("th");
        addIngredientHeader.setAttribute("colspan", "2");

        var addIngredientButtonHeader = generateAddToFavouritesButton();
        /* ADD TO FAVOURITES button is very similar to ADD button, so
        we will simply modify generated ADD TO FAVOURITES button and use it. */
        addIngredientButtonHeader.setAttribute("id", "addIngredientButton");
        addIngredientButtonHeader.setAttribute("onclick", "clickAddIngredientButton(this.parentElement.parentElement)");
        addIngredientButtonHeader.innerHTML = "ADD";

        addIngredientHeader.appendChild(addIngredientButtonHeader);

        ingredientsTable.appendChild(titleHeader);
        ingredientsTable.appendChild(addIngredientHeader);
    }
    while (drink["strIngredient" + counter.toString()] != null && drink["strIngredient" + counter.toString()] != "") {
        var row = ingredientsTable.insertRow(ingredientsTable.rows.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        if (isFavouriteSite) {
            cell1.setAttribute("contenteditable", "true");
            cell1.innerHTML = drink["strIngredient" + counter.toString()];

            cell2.setAttribute("contenteditable", "true");
            cell2.innerHTML = "";
            if (drink["strMeasure" + counter.toString()] != null)
                cell2.innerHTML = drink["strMeasure" + counter.toString()];

            var removeIngredientButton = document.createElement("button");
            removeIngredientButton.setAttribute("id", "removeIngredientButton");
            removeIngredientButton.setAttribute("onclick", "clickRemoveIngredientButton(this.parentElement.parentElement)");

            var removeIngredientImage = document.createElement("img");
            removeIngredientImage.setAttribute("id", "removeIngredientImage");
            removeIngredientImage.setAttribute("src", "cancel.png");

            removeIngredientButton.appendChild(removeIngredientImage);

            cell3.appendChild(removeIngredientButton);
        } else {
            var dropIcon = generateImage("drop.png", "20px", "20px");
            cell1.appendChild(dropIcon);

            cell2.setAttribute("contenteditable", "true");
            cell2.innerHTML = drink["strIngredient" + counter.toString()];

            cell3.setAttribute("contenteditable", "true");
            cell3.innerHTML = "";
            if (drink["strMeasure" + counter.toString()] != null)
                cell3.innerHTML = drink["strMeasure" + counter.toString()];
        }
        counter++;
    }

    drinkDescriptionDiv.appendChild(drinkDescription);
    drinkDescriptionDiv.appendChild(ingredientsTable);
    return drinkDescriptionDiv;
}

function fillSearchResultsDiv(drinks) {
    var resultsDiv = document.getElementById("searchResultsDiv");
    for (var i = 0; i < drinks.length; i++) {
        var drinkDiv = document.createElement("div");
        drinkDiv.style.padding = "15px";

        var cocktailName = generateDrinkTitle(drinks[i].strDrink, false);
        var alcoholAlertParagraph = generateAlcoholAlertParagraph(drinks[i].strAlcoholic);
        var cocktailInfoDiv = generateCocktailInfoDiv(drinks[i], false);
        var addToFavouritesButtonDiv = generateAddToFavouritesButton();

        drinkDiv.appendChild(cocktailName);
        drinkDiv.appendChild(alcoholAlertParagraph);
        drinkDiv.appendChild(cocktailInfoDiv);
        drinkDiv.appendChild(addToFavouritesButtonDiv);

        if (i < drinks.length - 1) {
            drinkDiv.style.setProperty("border-bottom", "2px solid rgba(255,255,255,0.3)");
            drinkDiv.style.setProperty("margin-top", "5px");
        }

        resultsDiv.appendChild(drinkDiv);

    }
    resultsDiv.style.setProperty("overflow-y", "auto");
    resultsDiv.style.setProperty("height", "55vh");
}