window.onload = Calls.loadFavouriteDrinks();

function clickSaveButton() {
    var favDivs = document.getElementById("resultsDiv").children;
    var favDrinks = [];
    for (var i = 0; i < favDivs.length; i++) {
        var jsonDrink = {

        };
        jsonDrink.name = favDivs[i].children[0].children[0].innerHTML;
        jsonDrink.isAlcoholic = (favDivs[i].children[1].innerHTML == "ALCOHOLIC");
        jsonDrink.imageSource = favDivs[i].children[2].children[0].src;
        var str = favDivs[i].children[2].children[1].children[0].innerHTML;
        var res = str.replace(/<br>/g, "");
        jsonDrink.description = res;
        var ingredientsTable = favDivs[i].children[2].children[1].children[1];
        var ingredientsArray = [];
        var measuresArray = [];

        for (var j = 0; j < ingredientsTable.rows.length; j++) {
            var row = ingredientsTable.rows[j];
            ingredientsArray.push(row.cells[0].innerHTML);
            if (typeof row.cells[1] != "undefined") measuresArray.push(row.cells[1].innerHTML);
            else measuresArray.push("undefined");
        }

        jsonDrink.ingredients = ingredientsArray;
        jsonDrink.measures = measuresArray;

        favDrinks.push(jsonDrink);
    }
    Calls.saveChanges(favDrinks);
}

function clickCancelButton(drink) {
    var favDivs = drink.parentElement.children;
    for (var i = 0; i < favDivs.length; i++)
        if (drink == favDivs[i]) {
            var lastVersionDrink = (Calls.getFavouriteDrinks())[i];
            favDivs[i].children[0].children[0].innerHTML = lastVersionDrink.name;
            favDivs[i].children[2].children[1].children[0].innerHTML = lastVersionDrink.description;
            var ingredientsTable = favDivs[i].children[2].children[1].children[1];
            ingredientsTable.innerHTML = "";
            for (var j = 0; j < lastVersionDrink.ingredients.length; j++) {
                var row = ingredientsTable.insertRow(ingredientsTable.rows.length);
                var cellIngredient = row.insertCell(0);
                cellIngredient.setAttribute("contenteditable", "true");

                cellIngredient.innerHTML = lastVersionDrink.ingredients[j];
                cellIngredient.style.fontWeight = "bold";
                var cellMeasure = row.insertCell(1);
                cellMeasure.setAttribute("contenteditable", "true");
                cellMeasure.innerHTML = "";
                if (lastVersionDrink.measures[j] != "undefined")
                    cellMeasure.innerHTML = lastVersionDrink.measures[j];
                var cellDeleteRow = row.insertCell(2);
                var deleteRowButton = document.createElement("button");
                deleteRowButton.setAttribute("id", "deleteButton");
                deleteRowButton.style.setProperty("width", "25px");
                deleteRowButton.style.setProperty("height", "25px");
                deleteRowButton.setAttribute("onclick", "clickDeleteRowButton(this.parentElement.parentElement)");

                var cancelImage = document.createElement("img");
                cancelImage.setAttribute("src", "cancel.png");
                cancelImage.style.setProperty("width", "25px");
                cancelImage.style.setProperty("height", "25px");

                deleteRowButton.appendChild(cancelImage);
                cellDeleteRow.appendChild(deleteRowButton);
            }
        }
}

function clickDeleteFavouriteCocktail(favouriteDrink) {
    favouriteDrink.remove();
    clickSaveButton();
}

function clickDeleteRowButton(row) {
    row.remove();
}