var currentInput = "";

function saveInput(){
    currentInput += document.getElementById("searchInput").value;
}

function clickSearch(){
    Calls.getCoctails(currentInput);
    currentInput = "";
    document.getElementById("searchInput").value = "";
    
}