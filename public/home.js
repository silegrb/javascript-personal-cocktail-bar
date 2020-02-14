var currentInput = "";

function saveInput(){
    currentInput += document.getElementById("searchInput").value;
}

function clickSearch(){
    Calls.searchForCocktailsByIngredient(currentInput);
    currentInput = "";
    document.getElementById("searchInput").value = ""; 
}