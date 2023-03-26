function pass() {
    if (document.getElementById(`password`).getAttribute("type") === "text") {
        document.getElementById(`password`).type = `password`;
        document.getElementById(`pass-icon`).src = `image/hide-pass.png`;
    }
    else {
        document.getElementById(`password`).type = `text`;
        document.getElementById(`pass-icon`).src = `image/show-pass.png`;
    }
}