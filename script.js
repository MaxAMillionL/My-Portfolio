zIndexCounter = 1;

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

        // opens a tab if an icon is clicked
        image.addEventListener("click", function() {
            const windowName = image.id + "-window"; 
            displayType = window.getComputedStyle(document.getElementById(windowName)).display;
            if(displayType == "block"){
                document.getElementById(windowName).style.display = "none";
            }
            else{
                document.getElementById(windowName).style.display = "block";
            }
            document.getElementById(windowName).style.zIndex = zIndexCounter;
            zIndexCounter++;
        });


        // this changes the z-index of the iamge
    });

    // Goes through all windows to check for updates
    const windows = document.querySelectorAll(".window")
    windows.forEach((window) => {
        // Moves a window to the front if it is clicked
        window.addEventListener("click", function() {
            const windowName = window.id
            document.getElementById(windowName).style.zIndex = zIndexCounter;
            zIndexCounter++;
        });
        
    });
});


