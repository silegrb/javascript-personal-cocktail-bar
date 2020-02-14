var DRINKS = [];

let Calls = (function(){

    var favouriteDrinks = []
    var drianks = [];
    function searchCocktailsImpl(searchInput){
       fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
        .then(response => response.json())
        .then(json => {

            var drinks = json.drinks;

            //Next line will clear complete div, so they don't append on next search...
            document.getElementById("resultsDiv").innerHTML = "";
      
            if( drinks == null  ){
                var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find that drink :(","brokenSearch.png");
                document.getElementById("resultsDiv").appendChild(noSearchResultDiv);
            }
            else if(searchInput == ""){
                var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(","brokenSearch.png");
                document.getElementById("resultsDiv").appendChild(noSearchInputDiv);
            }
            else fillResultsDiv(drinks);
        })
    }

    function searchForCocktailsByIngredientImpl(searchInput){

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
      
            if( drinks == null && searchInput != ""  ){
                var noSearchResultDiv = generateErrorDiv("OOPS! We couldnt't find that drink :(","brokenSearch.png");
                document.getElementById("resultsDiv").appendChild(noSearchResultDiv);
            }
            else if(searchInput == ""){
                var noSearchInputDiv = generateErrorDiv("OOPS! Empty search :(","brokenSearch.png");
                document.getElementById("resultsDiv").appendChild(noSearchInputDiv);
            }
            else {
                const promises = drinks.map(drink => 
                    fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drink.idDrink).
                    then(response => response.json()).
                    then(json => {
                    DRINKS.push(json.drinks[0]);
                }));
                Promise.all(promises).then(function(ok){
                    fillResultsDiv(DRINKS);
                });
            }
            
        })
    }

return {
    searchCocktails: searchCocktailsImpl,
    searchForCocktailsByIngredient: searchForCocktailsByIngredientImpl
}

}())

function generateImage(src,width,height){
    var image = document.createElement("img");
    image.src = src;
    image.width = width;
    image.height = height;
    return image;
}

function generateErrorDiv(message, imageSource){

    var noSearchResultDiv = document.createElement("div");
    noSearchResultDiv.style.padding = "15px";
    noSearchResultDiv.style.textAlign ="center";
    
    var errorMessage = document.createElement("p");
    errorMessage.innerHTML = message;
    errorMessage.classList.add("wrongSearch");

    var errorImage = generateImage(imageSource,"200","200");

    noSearchResultDiv.appendChild(errorMessage);
    noSearchResultDiv.appendChild(errorImage);
    return noSearchResultDiv;
}

function generateCocktailName(cocktailName){
    var nameParagraph = document.createElement("p");
    nameParagraph.innerHTML = cocktailName.toUpperCase();
    nameParagraph.style.fontSize = "20px";
    nameParagraph.classList.add("drinkName");
    return nameParagraph;
}

function generateAlcoholAlertParagraph(alcoholSign){
    var alcoholAlertParagraph = document.createElement("p");
    if( alcoholSign == "Alcoholic" ){
        alcoholAlertParagraph.innerHTML = "ALCOHOLIC";
        alcoholAlertParagraph.classList.add("alcoholic");
    }
    else{
       alcoholAlertParagraph.innerHTML = "ALCOHOL FREE";
       alcoholAlertParagraph.classList.add("alcoholFree");
    }
    return alcoholAlertParagraph;
}

function generateAddToFavouritesButtonDiv(){
    var buttonDiv = document.createElement("div");
    var addToFavouritesButton = document.createElement("button");
    addToFavouritesButton.id = "addToFavourites";
    addToFavouritesButton.innerHTML = "ADD TO FAVOURITES";
    buttonDiv.appendChild(addToFavouritesButton);
    return buttonDiv;
}

function generateCocktailInfoDiv(drink){
    var cocktailInfoDiv = document.createElement("div");
    cocktailInfoDiv.style.display ="inline-block";

    var cocktailImage = generateImage(drink.strDrinkThumb, "200", "250");
    cocktailImage.style.float = "left";

    var cocktailDescription = generateCocktailDescription(drink);

    cocktailInfoDiv.appendChild(cocktailImage);
    cocktailInfoDiv.appendChild(cocktailDescription);
    return cocktailInfoDiv;
}

function generateCocktailDescription(drink){
    var cocktailDescription = document.createElement("p");
    cocktailDescription.style.float = "left";
    cocktailDescription.style.color = "white";
    cocktailDescription.style.paddingLeft = "5px";
    
    var backSpaceMatched = false;
    for( var i = 0; i < drink.strInstructions.length; i++ ){
        if( backSpaceMatched &&  drink.strInstructions[i] == ' '){
            cocktailDescription.innerHTML += "<br>";
            backSpaceMatched = false;
        }
        if( i != 0 && i % 40 == 0 ){
            if( drink.strInstructions[i] == ' ')
                cocktailDescription.innerHTML += "<br>";
            else backSpaceMatched = true;
        }
        cocktailDescription.innerHTML += drink.strInstructions[i];
    }

    cocktailDescription.innerHTML += "<br>";
    cocktailDescription.innerHTML += "<br>";

    var ingredientsTable = document.createElement("table");
    ingredientsTable.id = "ingredientsTable";

    var counter = 1;
    while(drink["strIngredient" + counter.toString()] != null && drink["strIngredient" + counter.toString()] != ""){
        var row = ingredientsTable.insertRow( ingredientsTable.rows.length );
        
        var cellDrop = row.insertCell(0);
        var imageDrop = generateImage("drop.png","20","20");
        cellDrop.appendChild(imageDrop);

        var cellIngredient = row.insertCell(1);
        cellIngredient.innerHTML = drink["strIngredient" + counter.toString()];
        cellIngredient.style.fontWeight = "bold";

        if( drink["strMeasure" + counter.toString()] != null ){
            var cellMeasure = row.insertCell(2);
            cellMeasure.innerHTML = drink["strMeasure" + counter.toString()];
        }

        counter++;
    }

    cocktailDescription.appendChild(ingredientsTable);
    return cocktailDescription;
}

function fillResultsDiv(drinks) {
    console.log(drinks)
    for( var i = 0; i < drinks.length; i++ ){
        var drinkDiv = document.createElement("div");
        drinkDiv.style.padding = "15px";

        var cocktailName = generateCocktailName( drinks[i].strDrink );
        var alcoholAlertParagraph = generateAlcoholAlertParagraph( drinks[i].strAlcoholic );
        var cocktailInfoDiv = generateCocktailInfoDiv(drinks[i]);
        var addToFavouritesButtonDiv = generateAddToFavouritesButtonDiv();

        drinkDiv.appendChild(cocktailName);
        drinkDiv.appendChild(alcoholAlertParagraph);
        drinkDiv.appendChild(cocktailInfoDiv);
        drinkDiv.appendChild(addToFavouritesButtonDiv);

        if( i < drinks.length - 1 ) {
            drinkDiv.style.borderBottom = "2px solid rgba(255,255,255,0.3)";
            drinkDiv.style.marginTop = "5px";
        }

        document.getElementById("resultsDiv").appendChild(drinkDiv);
  }
}

function test( drinks ){
    return new Promise(function(resolve,reject){
       
        for( var i = 0; i < drinks.length; i++ ){
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinks[i].idDrink).
            then(response => response.json()).
            then(json => {
                DRINKS.push(json.drinks[0]);
            });

          
        }
        resolve(true)
    })
}