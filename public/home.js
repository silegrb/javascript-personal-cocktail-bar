var currentInput = "";
var currentSearchMode = 1;
function saveInput(){
    currentInput += document.getElementById("searchInput").value;
}

function clickSearch(){
    switch(currentSearchMode){
        case 1:
            Calls.searchCocktails(currentInput);
            break;
        case 2:
            Calls.searchForCocktailsByIngredient(currentInput);
            break;
        case 3:
            Calls.searchForFilteredDrinks(currentInput,1);
            break;
        case 4:
            Calls.searchForFilteredDrinks(currentInput,0);
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

function pickAnOption(pickedOption){
    currentSearchMode = pickedOption;
    var searchBar = document.getElementById("searchInput");
    switch(pickedOption){
        case 1:
            searchBar.setAttribute("placeholder","Search for cocktails");
            break;
        case 2:
            searchBar.setAttribute("placeholder","Search for cocktails by ingredient");
            break;
        case 3:
            searchBar.setAttribute("placeholder","Search for only alcoholic cocktails");
            break;
        case 4:
            searchBar.setAttribute("placeholder","Search for only alcohol free cocktails");
            break;
        case 5:
            clickSearch();
            break;
        default:
    }
}