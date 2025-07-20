zIndexCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
    
    // Goes through all icons to check for updates
    const images = document.querySelectorAll(".icon-image")
    images.forEach((image) => {

        // Goes through all icon images and gives them hover and click attributes for style
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

        // Opens a program if the icon is clicked. Limited by naming scheme
        image.addEventListener("click", function() {
            const windowName = image.id + "-window"; 
            displayType = window.getComputedStyle(document.getElementById(windowName)).display;
            if(displayType == "block"){
                document.getElementById(windowName).style.display = "none";
            }
            else{
                document.getElementById(windowName).style.display = "block";
            }

            // This changes the z-index of the iamge to move to the front. Limited by the max value of a number
            document.getElementById(windowName).style.zIndex = zIndexCounter;
            zIndexCounter++;
        });
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

    // Goes through all headers to check for updates
    const headers = document.querySelectorAll(".title-bar");
    headers.forEach((header) => {
        header.addEventListener("mousedown", function (e) {
            //Find window associated with header
            const window = header.closest(".window");

            // Bring to front
            window.style.zIndex = zIndexCounter++;
            
            // Stops dragging the wrong element by accident. Checks for the correct window and correct header combination
            if (e.target !== window && !window.contains(e.target))
                return;
            
            // Prevents text selection on other windows
            document.body.style.userSelect = "none";

            // Find offsets from mouse to window
            let dX = e.clientX - window.offsetLeft;
            let dY = e.clientY - window.offsetTop;

            function onMouseMove(e) {
                window.style.left = (e.clientX - dX) + 'px';
                window.style.top = (e.clientY - dY) + 'px';
            }

            function onMouseUp() {
                // Restore text selection
                document.body.style.userSelect = "";

                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    })
});

