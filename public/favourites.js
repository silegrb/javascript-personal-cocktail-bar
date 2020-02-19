window.onload = Calls.loadFavouriteDrinks();

/*##########################
######### FUNCTIONS ########
############################*/
function clickRemoveFavouriteDrinkButton(favouriteDrink) {
    favouriteDrink.remove();
    //Save button is used to save changes to favourites.json.
    clickSaveButton();
}

function clickSaveButton() {

    var favouriteDrinkDivs = document.getElementById("favouriteDrinksDiv").children;
    var jsonFavouriteDrinks = [];
    for (var i = 0; i < favouriteDrinkDivs.length; i++) {
        var jsonFavouriteDrink = {};
        jsonFavouriteDrink.name = favouriteDrinkDivs[i].children[0].children[0].innerHTML;
        jsonFavouriteDrink.isAlcoholic = (favouriteDrinkDivs[i].children[1].innerHTML == "ALCOHOLIC");
        jsonFavouriteDrink.imageSource = favouriteDrinkDivs[i].children[2].children[0].src;

        var unformattedDrinkDescription = favouriteDrinkDivs[i].children[2].children[1].children[0].children[0].innerHTML;
        var formattedDrinkDescription = unformattedDrinkDescription.replace(/<br>/g, "");
        jsonFavouriteDrink.description = formattedDrinkDescription;

        var ingredientsTable = favouriteDrinkDivs[i].children[2].children[1].children[1];

        var ingredientsArray = [];
        var measuresArray = [];

        for (var j = 0; j < ingredientsTable.rows.length; j++) {
            var row = ingredientsTable.rows[j];
            ingredientsArray.push(row.cells[0].innerHTML);
            if (typeof row.cells[1] != "undefined") measuresArray.push(row.cells[1].innerHTML);
            else measuresArray.push("undefined");
        }

        jsonFavouriteDrink.ingredients = ingredientsArray;
        jsonFavouriteDrink.measures = measuresArray;

        jsonFavouriteDrinks.push(jsonFavouriteDrink);
    }
    Calls.saveChanges(jsonFavouriteDrinks);
}

function clickCancelButton(clickedFavouriteDrinkDiv) {
    var favouriteDrinkDivs = clickedFavouriteDrinkDiv.parentElement.children;

    for (var i = 0; i < favouriteDrinkDivs.length; i++)
        if (clickedFavouriteDrinkDiv == favouriteDrinkDivs[i]) {
            /*This 'if' is used to set this div to its last version
            since 'Cancel' button was clicked. */
            var lastVersionDrink = (Calls.getFavouriteDrinks())[i];

            favouriteDrinkDivs[i].children[0].children[0].innerHTML = lastVersionDrink.name;
            favouriteDrinkDivs[i].children[2].children[1].children[0].children[0].innerHTML = lastVersionDrink.description;

            //We need to clear the ingredients table and generate a new one.
            var ingredientsTable = favouriteDrinkDivs[i].children[2].children[1].children[1];
            ingredientsTable.innerHTML = "";

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
            addIngredientButtonHeader.setAttribute("id", "addIngredientButton");
            addIngredientButtonHeader.setAttribute("onclick", "clickAddIngredientButton(this.parentElement.parentElement)");
            addIngredientButtonHeader.innerHTML = "ADD";

            addIngredientHeader.appendChild(addIngredientButtonHeader);

            ingredientsTable.appendChild(titleHeader);
            ingredientsTable.appendChild(addIngredientHeader);

            for (var j = 0; j < lastVersionDrink.ingredients.length; j++) {
                var row = ingredientsTable.insertRow(ingredientsTable.rows.length);

                var cellIngredient = row.insertCell(0);
                cellIngredient.setAttribute("class", "cellIngredient")
                cellIngredient.setAttribute("contenteditable", "true");
                cellIngredient.innerHTML = lastVersionDrink.ingredients[j];

                var cellMeasure = row.insertCell(1);
                cellMeasure.setAttribute("contenteditable", "true");
                cellMeasure.innerHTML = "";
                if (lastVersionDrink.measures[j] != "undefined")
                    cellMeasure.innerHTML = lastVersionDrink.measures[j];

                var cellRemoveIngredient = row.insertCell(2);
                var removeIngredientButton = document.createElement("button");
                removeIngredientButton.setAttribute("id", "removeIngredientButton");
                removeIngredientButton.setAttribute("onclick", "clickRemoveIngredientButton(this.parentElement.parentElement)");

                var removeIngredientImage = document.createElement("img");
                removeIngredientImage.setAttribute("id", "removeIngredientImage");
                removeIngredientImage.setAttribute("src", "cancel.png");

                removeIngredientButton.appendChild(removeIngredientImage);
                cellRemoveIngredient.appendChild(removeIngredientButton);
            }
        }
}

function clickAddIngredientButton(table) {
    var row = table.insertRow(table.rows.length);

    var cellIngredient = row.insertCell(0);
    cellIngredient.setAttribute("class", "cellIngredient")
    cellIngredient.setAttribute("contenteditable", "true");
    cellIngredient.innerHTML = "New ingredient";

    var cellMeasure = row.insertCell(1);
    cellMeasure.setAttribute("contenteditable", "true");
    cellMeasure.innerHTML = "New measure";

    var cellRemoveIngredient = row.insertCell(2);
    var removeIngredientButton = document.createElement("button");
    removeIngredientButton.setAttribute("id", "removeIngredientButton");
    removeIngredientButton.setAttribute("onclick", "clickRemoveIngredientButton(this.parentElement.parentElement)");

    var removeIngredientImage = document.createElement("img");
    removeIngredientImage.setAttribute("id", "removeIngredientImage");
    removeIngredientImage.setAttribute("src", "cancel.png");

    removeIngredientButton.appendChild(removeIngredientImage);
    cellRemoveIngredient.appendChild(removeIngredientButton);
}

function clickRemoveIngredientButton(row) {
    row.remove();
}