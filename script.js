zIndexCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
    function addIcon(windowElement, ImageElement){
        taskbarDiv = document.getElementById("bottom-taskbar").children[1];
        const newIcon = document.createElement("div");
        newIcon.classList.add("icon");
        newImage = document.createElement("img");
        newImage.classList.add("icon-image");
        newImage.src = ImageElement;
        
        windowString = windowElement.id;
        indexOfDash = windowString.indexOf("-");
        nameElement = windowString.substring(0, indexOfDash);

        newImage.name = nameElement;
        newIcon.appendChild(newImage);
        taskbarDiv.appendChild(newIcon);
        updateImageDetection();
    }

    function updateHypterlinks(){
        // Make all hyperlinks open in a new tab
        document.querySelectorAll('a').forEach(function(link) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    } 
    function updateExitAndMinimize(){
        // Make all exit symbols close their respective window
        const exits = document.querySelectorAll(".title-bar-controls");
        exits.forEach((exit) => {
            const windowElement = exit.closest(".window");
            buttons = exit.querySelectorAll("button");
            minimize = buttons[0];
            close = buttons[1];
            
            minimize.addEventListener("click", function(e) {
                // makes sure to mimize correct window
                if (e.target !== windowElement && !windowElement.contains(e.target))
                    return;

                windowString = windowElement.id;
                indexOfDash = windowString.indexOf("-");
                imageElement = "icons\\" + windowString.substring(0, indexOfDash) + "-icon.png"

                addIcon(windowElement, imageElement);

                document.getElementById(windowElement.id).style.display = "none";
            })
            close.addEventListener("click", function(e) {
                // makes sure to close correct window
                if (e.target !== windowElement && !windowElement.contains(e.target))
                    return;
                
                document.getElementById(windowElement.id).style.display = "none";
            })
            
        })
    }
    function updateImageDetection(){
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
                const windowName = image.name + "-window";
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
        windows.forEach((windowElement) => {
            // Moves a window to the front if it is clicked
            windowElement.addEventListener("click", function() {
                
                const windowName = windowElement.id
                document.getElementById(windowName).style.zIndex = zIndexCounter;
                zIndexCounter++;
            });
            windowElement.addEventListener("mouseover", function(e) {
                resizeBound = 10;
                const rect = windowElement.getBoundingClientRect();
                
            })
        });
    }
    function updateHeaderDetection(){
        // Goes through all headers to check for updates
        const headers = document.querySelectorAll(".title-bar");
        headers.forEach((header) => {
            header.addEventListener("mousedown", function (e) {
                //Find window associated with header
                const windowElement = header.closest(".window");

                // Bring to front
                windowElement.style.zIndex = zIndexCounter++;
                
                // Stops dragging the wrong element by accident. Checks for the correct window and correct header combination
                if (e.target !== windowElement && !windowElement.contains(e.target))
                    return;
                
                // Prevents text selection on other windows
                document.body.style.userSelect = "none";

                // Find offsets from mouse to window
                let dX = e.clientX - windowElement.offsetLeft;
                let dY = e.clientY - windowElement.offsetTop;

                function onMouseMove(e) {
                    windowElement.style.left = (e.clientX - dX) + 'px';
                    windowElement.style.top = (e.clientY - dY) + 'px';
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
    }

    
    updateExitAndMinimize();
    updateHypterlinks();
    updateImageDetection();
    updateHeaderDetection();
});

