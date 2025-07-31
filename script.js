zIndexCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
    // Helper function for the 
    function addIcon(windowElement, ImageElement){
        const taskbarDiv = document.getElementById("icons-taskbar");

        // get base name of element
        const windowString = windowElement.id;
        const indexOfDash = windowString.indexOf("-");
        const nameElement = windowString.substring(0, indexOfDash);

        // Prevent duplicates
        const existingIcon = taskbarDiv.querySelector(`img[name="${nameElement}"]`);
        if (existingIcon) return;

        // create new icon div
        const newIcon = document.createElement("div");
        newIcon.classList.add("icon");

        // add image to icon div
        const newImage = document.createElement("img");
        newImage.classList.add("icon-image");
        newImage.src = ImageElement;
        newImage.name = nameElement;

        // add all listeners
        attachIconEvents(newImage);

        // add hierarchy
        newIcon.appendChild(newImage);
        taskbarDiv.appendChild(newIcon);
    }


    function attachIconEvents(image) {
        // Prevent attaching events multiple times
        if (image.dataset.initialized) return;

        // all hover functions
        image.addEventListener("mouseleave", () => {
            image.classList.remove("dark", "bright");
        });

        image.addEventListener("mouseover", () => {
            image.classList.add("bright");
        });

        image.addEventListener("mousedown", () => {
            image.classList.add("dark");
            image.classList.remove("bright");
        });

        image.addEventListener("mouseup", () => {
            image.classList.remove("dark");
        });

        // clicking an icon functions
        image.addEventListener("click", () => {
            const windowName = image.name + "-window";
            const windowElement = document.getElementById(windowName);

            // Toggle minimized
            windowElement.classList.toggle("open");

            // Bring to front
            windowElement.style.zIndex = zIndexCounter++;
        });

        // Mark image as initialized
        image.dataset.initialized = "true";
    }

    function updateHyperlinks(){
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

                // remove open class
                windowElement.classList.remove("open");

                addIcon(windowElement, imageElement);
            })
            close.addEventListener("click", function(e) {
                // makes sure to close correct window
                if (e.target !== windowElement && !windowElement.contains(e.target))
                    return;

                d// remove open class
                windowElement.classList.remove("open");
            })
            
        })
    }
    function updateIconDetection(containerID) {
        const container = document.getElementById(containerID);
        if (!container) return;

        const iconImages = container.querySelectorAll(".icon img");
        iconImages.forEach(attachIconEvents);
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
    updateHyperlinks();
    updateIconDetection("icons-desktop");
    updateIconDetection("icons-taskbar");
    updateHeaderDetection();
});

