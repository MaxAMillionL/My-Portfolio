document.addEventListener('DOMContentLoaded', () => {
    
    
    const images = document.querySelectorAll(".icon-image")
    images.forEach((image) => {

        // goes through all icon images and gives them hover and click attributes for style
        image.addEventListener("mouseleave", function() {
            image.classList.remove("dark");
            image.classList.remove("bright")
        });
        image.addEventListener("mouseover", function() {
            image.classList.add("bright");
        });

        image.addEventListener("mousedown", function() {
            image.classList.add("dark");
            image.classList.remove("bright")
        });

        image.addEventListener("mouseup", function() {
            image.classList.remove("dark");
        });

        // if you click an icon, it will open the appropriate window on the desktop
        image.addEventListener("click", function() {
            const windowName = image.id + "-window"; 
            displayType = window.getComputedStyle(document.getElementById(windowName)).display;
            if(displayType == "block"){
                document.getElementById(windowName).style.display = "none";
            }
            else{
                document.getElementById(windowName).style.display = "block";
            }
        });
    });
});




