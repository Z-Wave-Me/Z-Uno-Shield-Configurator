function slideAction(slide, event) {
    var x = document.getElementById(slide);
    if (x.style.display === "block") {
        x.style.display = "none";
        event.innerHTML = "Show code"
    } else {
        x.style.display = "block";
        event.innerHTML = "Hide code"
    }
}