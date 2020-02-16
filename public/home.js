window.onload = Calls.shakeCocktail();

var currentInput = "";
var currentSearchMode = 1;

function saveInput() {
    currentInput += document.getElementById("searchInput").value;
}

function clickSearch() {
    switch (currentSearchMode) {
        case 1:
            Calls.searchCocktails(currentInput);
            break;
        case 2:
            Calls.searchForCocktailsByIngredient(currentInput);
            break;
        case 3:
            Calls.searchForFilteredDrinks(currentInput, 1);
            break;
        case 4:
            Calls.searchForFilteredDrinks(currentInput, 0);
            break;
        case 5:
            Calls.listTenRandomCocktails();
            currentSearchMode = 1;
            break;
        default:
    }
    currentInput = "";
    document.getElementById("searchInput").value = "";
}

function pickAnOption(pickedOption) {
    currentSearchMode = pickedOption;
    var searchBar = document.getElementById("searchInput");
    switch (pickedOption) {
        case 1:
            searchBar.setAttribute("placeholder", "Search for cocktails");
            break;
        case 2:
            searchBar.setAttribute("placeholder", "Search for cocktails by ingredient");
            break;
        case 3:
            searchBar.setAttribute("placeholder", "Search for only alcoholic cocktails");
            break;
        case 4:
            searchBar.setAttribute("placeholder", "Search for only alcohol free cocktails");
            break;
        case 5:
            clickSearch();
            break;
        default:
    }
}

function clickAddToFavourites(clickedDrinkDiv) {
    var notificationsTable = document.getElementById("nofitications");

    var newRow = notificationsTable.insertRow(notificationsTable.rows.length);

    var cellNotificationMessage = newRow.insertCell(0);
    var drinkName = clickedDrinkDiv.children[0];
    if (drinkName.tagName == "DIV") drinkName = drinkName.children[2];
    drinkName = drinkName.innerHTML;
    cellNotificationMessage.style.color = "white";
    var cellCancelImage = newRow.insertCell(1);

    var cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "cancelButton");
    cancelButton.setAttribute("onclick", "clickRemoveNotificationButton(this.parentElement.parentElement)");

    var cancelImage = document.createElement("img");
    cancelImage.setAttribute("src", "cancel.png");
    cancelImage.setAttribute("id", "cancel");

    cancelButton.appendChild(cancelImage);
    cellCancelImage.appendChild(cancelButton);

    var jsonDrink = {

    };

    jsonDrink.name = drinkName;
    jsonDrink.isAlcoholic = (clickedDrinkDiv.children[1].innerHTML == "ALCOHOLIC");
    jsonDrink.imageSource = clickedDrinkDiv.children[2].children[0].src;
    var str = clickedDrinkDiv.children[2].children[1].children[0].innerHTML;
    var res = str.replace(/<br>/g, "");
    jsonDrink.description = res;
    var ingredientsTable = clickedDrinkDiv.children[2].children[1].children[1];
    var ingredientsArray = [];
    var measuresArray = [];

    for (var i = 0; i < ingredientsTable.rows.length; i++) {
        var row = ingredientsTable.rows[i];
        ingredientsArray.push(row.cells[1].innerHTML);
        if (typeof row.cells[2] != "undefined") measuresArray.push(row.cells[2].innerHTML);
        else measuresArray.push("undefined");
    }

    jsonDrink.ingredients = ingredientsArray;
    jsonDrink.measures = measuresArray;

    Calls.writeFavouriteCocktailsFile(jsonDrink, cellNotificationMessage);

}

function clickRemoveNotificationButton(notification) {
    notification.remove();
}

function shakeACocktail() {
    Calls.shakeAnotherCocktail();
}