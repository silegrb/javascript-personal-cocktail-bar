let Calls = (function(){

    var favouriteDrinks = []

    function getCoctailsImpl(searchInput){
       fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
  .then(response => response.json())
  .then(json => {
      var drinks = json.drinks;
      console.log(drinks);
      for( var i = 0; i < drinks.length; i++ ){
            var newDiv = document.createElement("div");
            var p = document.createElement("p");
            p.innerHTML = drinks[i].strDrink;
            p.classList.add("drinkName");
            var img = styleImg(drinks[i].strDrinkThumb, "100", "100");
            newDiv.appendChild(p);
            newDiv.appendChild(img);
            if( i < drinks.length -1 ) {
                newDiv.style.borderBottom = "2px solid rgba(255,255,255,0.3)";
                newDiv.style.marginTop = "5px";
            }
            document.getElementById("resultsDiv").appendChild(newDiv);

      }
  })

    }
return {
    getCoctails: getCoctailsImpl
}

}())

function styleImg(src,width,height){
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    return img;
}