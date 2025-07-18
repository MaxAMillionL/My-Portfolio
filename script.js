document.addEventListener('DOMContentLoaded', () => {
    const myImage = document.getElementById('icon');

    // Check if the element was found before adding the event listener
    

    myImage.addEventListener("mouseleave", function() {
        myImage.classList.remove("dark"); // Remove the class if the mouse leaves while held down
        myImage.classList.remove("bright") // Remove the class if the mouse leaves while held down
    });

    myImage.addEventListener("mouseover", function() {
        myImage.classList.add("bright"); // Add the class on mouse hover
    });

    myImage.addEventListener("mousedown", function() {
        myImage.classList.add("dark"); // Add the class on click down
        myImage.classList.remove("bright") // Remove the class if the mouse leaves while held down  
    });

    myImage.addEventListener("mouseup", function() {
        myImage.classList.remove("dark"); // Remove the class on click release
    });
});
