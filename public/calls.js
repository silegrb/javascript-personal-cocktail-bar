let Calls = (function(){

    var favouriteDrinks = []

    function getCoctailsImpl(searchInput){
       fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput)
  .then(response => response.json())
  .then(json => {
      var drinks = json.drinks;
      document.getElementById("resultsDiv").innerHTML = "";
      console.log(drinks);
      if( drinks == null  ){
          var newDiv = document.createElement("div");
          newDiv.style.padding = "15px";
          newDiv.style.textAlign ="center";
          var p = document.createElement("p");
          var img = styleImg("brokenSearch.png","200","200");
          p.innerHTML = "OOPS! We couldnt't find that drink :(";
          p.classList.add("wrongSearch");
          newDiv.appendChild(p);
          newDiv.appendChild(img);
          document.getElementById("resultsDiv").appendChild(newDiv);
      }
      else if(searchInput == ""){
        var newDiv = document.createElement("div");
        newDiv.style.padding = "15px";
        newDiv.style.textAlign ="center";
        var p = document.createElement("p");
        var img = styleImg("brokenSearch.png","200","200");
        p.innerHTML = "OOPS! Empty search :(";
        p.classList.add("wrongSearch");
        newDiv.appendChild(p);
        newDiv.appendChild(img);
        document.getElementById("resultsDiv").appendChild(newDiv);
      }
      else{
      for( var i = 0; i < drinks.length; i++ ){
            var newDiv = document.createElement("div");
            newDiv.style.padding = "15px";
            var p = document.createElement("p");
            p.innerHTML = drinks[i].strDrink;
            p.classList.add("drinkName");
            var alcoholAlertParagraph = document.createElement("p");
            alcoholAlertParagraph.style.whiteSpace = "nowrap";
        if( drinks[i].strAlcoholic == "Alcoholic" ){
            alcoholAlertParagraph.innerHTML = "ALCOHOLIC";
            alcoholAlertParagraph.classList.add("alcoholic");
        }else{
            alcoholAlertParagraph.innerHTML = "ALCOHOL FREE";
            alcoholAlertParagraph.classList.add("alcoholFree");
        }
            var img = styleImg(drinks[i].strDrinkThumb, "100", "100");
            newDiv.appendChild(p);
            newDiv.appendChild(alcoholAlertParagraph);
            newDiv.appendChild(img);
            if( i < drinks.length -1 ) {
                newDiv.style.borderBottom = "2px solid rgba(255,255,255,0.3)";
                newDiv.style.marginTop = "5px";
            }
            document.getElementById("resultsDiv").appendChild(newDiv);

      }
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