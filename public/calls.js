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
            p.innerHTML = drinks[i].strDrink.toUpperCase();
            p.style.fontSize = "20px";
            p.classList.add("drinkName");

            var alcoholAlertParagraph = document.createElement("p");
            if( drinks[i].strAlcoholic == "Alcoholic" ){
                alcoholAlertParagraph.innerHTML = "ALCOHOLIC";
                alcoholAlertParagraph.classList.add("alcoholic");
            }
            else{
                alcoholAlertParagraph.innerHTML = "ALCOHOL FREE";
                alcoholAlertParagraph.classList.add("alcoholFree");
            }

            var wrapperDivImgDesc = document.createElement("div");
            wrapperDivImgDesc.style.display ="inline-block";
            var img = styleImg(drinks[i].strDrinkThumb, "200", "250");
            img.style.float = "left";

            var description = document.createElement("p");
            var innerHTMLFormatted = "";
            var backSpaceMatched = false;
            for( var j = 0; j < drinks[i].strInstructions.length; j++ ){
                if( backSpaceMatched &&  drinks[i].strInstructions[j] == ' '){
                    innerHTMLFormatted += "<br>";
                    backSpaceMatched = false;
                }
                if( j != 0 && j % 40 == 0){
                    if( drinks[i].strInstructions[j] == ' ')
                        innerHTMLFormatted += "<br>";
                    else backSpaceMatched = true;
                }
                innerHTMLFormatted += drinks[i].strInstructions[j];
            }
            innerHTMLFormatted += "<br><br>"
            var counter = 1;
            innerHTMLFormatted += "<table id=\"ingredientsTable\">"
            while(drinks[i]["strIngredient" + counter.toString()] != null){
                innerHTMLFormatted += "<tr><td><img id=\"drop\" src=\"drop.png\"></td>";
                innerHTMLFormatted += "<td><b>" + drinks[i]["strIngredient" + counter.toString()] + "</b></td>";
                if( drinks[i]["strMeasure" + counter.toString()] != null ) innerHTMLFormatted += "<td>(" + drinks[i]["strMeasure" + counter.toString()] + ")</td>";
                innerHTMLFormatted += "</tr>";
                counter++;
            }
            innerHTMLFormatted += "</table>";
            description.innerHTML =  innerHTMLFormatted;
            description.style.fontFamily = 'Abel';
            description.style.paddingLeft = "5px";
            description.style.color = "white";
            description.style.float = "left";

            wrapperDivImgDesc.appendChild(img);
            wrapperDivImgDesc.appendChild(description);

            newDiv.appendChild(p);
            newDiv.appendChild(alcoholAlertParagraph);
            newDiv.appendChild(wrapperDivImgDesc);
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