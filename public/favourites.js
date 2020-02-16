window.onload = Calls.loadFavouriteDrinks();

function clickSaveButton() {
    var favDivs = document.getElementById("resultsDiv").children;
    var favDrinks = [];
    for (var i = 0; i < favDivs.length; i++) {
        var jsonDrink = {

        };
        jsonDrink.name = favDivs[i].children[0].innerHTML;
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
            ingredientsArray.push(row.cells[1].innerHTML);
            if (typeof row.cells[2] != "undefined") measuresArray.push(row.cells[2].innerHTML);
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
            favDivs[i].children[0].innerHTML = lastVersionDrink.name;
            favDivs[i].children[2].children[1].children[0].innerHTML = lastVersionDrink.description;
            var ingredientsTable = favDivs[i].children[2].children[1].children[1];
            for (var j = 0; j < ingredientsTable.rows.length; j++) {
                var row = ingredientsTable.rows[j];
                row.cells[1].innerHTML = lastVersionDrink.ingredients[j];
                row.cells[2].innerHTML = "";
                if (lastVersionDrink.measures[j] != "undefined") row.cells[2].innerHTML = lastVersionDrink.measures[j];
            }
        }
}