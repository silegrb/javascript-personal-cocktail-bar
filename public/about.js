function clickSecretButton() {
    var password = prompt("Please enter password:");
    if (password != null && password != "") {
        Calls.tryToGetTheToken(password);
    }
}