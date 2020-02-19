window.onload = Calls.shakeCocktail();

/*##########################
##### GLOBAL VARIABLES #####
############################*/
var currentSearchInput = "";
var currentSearchMode = 1;

/*##########################
######### FUNCTIONS ########
############################*/
function clickShakeButton() {
    Calls.shakeAnotherCocktail();
}

function pickSearchMode(pickedOption) {
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

function appendSearchInput() {
    currentSearchInput += document.getElementById("searchInput").value;
}

function clickSearchButton() {
    switch (currentSearchMode) {
        case 1:
            Calls.searcForCocktails(currentSearchInput);
            break;
        case 2:
            Calls.searchForCocktailsByIngredient(currentSearchInput);
            break;
        case 3:
            Calls.searchForFilteredDrinks(currentSearchInput, 1);
            break;
        case 4:
            Calls.searchForFilteredDrinks(currentSearchInput, 0);
            break;
        case 5:
            Calls.listTenRandomCocktails();
            currentSearchMode = 1;
            break;
        default:
    }
    currentSearchInput = "";
    document.getElementById("searchInput").value = "";
}

function clickEnterKeyToSearch(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
}

function clickAddToFavouritesButton(clickedDrinkDiv) {
    var notificationsTable = document.getElementById("nofiticationsTable");

    var newRow = notificationsTable.insertRow(notificationsTable.rows.length);

    var cellNotificationMessage = newRow.insertCell(0);
    cellNotificationMessage.setAttribute("class", "cellNotificationMessage");

    var drinkTitle = clickedDrinkDiv.children[0];
    /*shakeComponent has standard drink title formatted as
    "Recommended \\star.png\\ 'Drink Title'", so we have to 
    extract it from that div with next line if that's the case*/
    if (drinkTitle.tagName == "DIV") drinkTitle = drinkTitle.children[2];
    drinkTitle = drinkTitle.innerHTML;

    var cellRemoveNotification = newRow.insertCell(1);

    var removeNotificationButton = document.createElement("button");
    removeNotificationButton.setAttribute("id", "removeNotificationButton");
    removeNotificationButton.setAttribute("onclick", "clickRemoveNotificationButton(this.parentElement.parentElement)");

    var cancelImage = document.createElement("img");
    cancelImage.setAttribute("id", "cancelIcon");
    cancelImage.setAttribute("src", "cancel.png");

    removeNotificationButton.appendChild(cancelImage);

    cellRemoveNotification.appendChild(removeNotificationButton);

    var jsonFavouriteDrink = {};
    jsonFavouriteDrink.name = drinkTitle;
    jsonFavouriteDrink.isAlcoholic = (clickedDrinkDiv.children[1].innerHTML == "ALCOHOLIC");
    jsonFavouriteDrink.imageSource = clickedDrinkDiv.children[2].children[0].src;
    var unformattedDrinkDescription = clickedDrinkDiv.children[2].children[1].children[0].children[0].innerHTML;
    var formattedDrinkDescription = unformattedDrinkDescription.replace(/<br>/g, "");
    jsonFavouriteDrink.description = formattedDrinkDescription;
    var ingredientsTable = clickedDrinkDiv.children[2].children[1].children[1];
    var ingredientsArray = [];
    var measuresArray = [];

    for (var i = 0; i < ingredientsTable.rows.length; i++) {
        var row = ingredientsTable.rows[i];
        ingredientsArray.push(row.cells[1].innerHTML);
        if (typeof row.cells[2] != "undefined") measuresArray.push(row.cells[2].innerHTML);
        else measuresArray.push("undefined");
    }

    jsonFavouriteDrink.ingredients = ingredientsArray;
    jsonFavouriteDrink.measures = measuresArray;

    Calls.writeFavouriteCocktailsFile(jsonFavouriteDrink, cellNotificationMessage);
}

function clickRemoveNotificationButton(notification) {
    notification.remove();
}