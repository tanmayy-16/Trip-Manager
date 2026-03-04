const newTrip = document.getElementById("newtrip");
newTrip.addEventListener("click", () => {

    const modal = document.querySelector(".modal");
    modal.removeAttribute("hidden");
}) 

const closeButton = document.querySelector(".close-btn");
closeButton.addEventListener("click", () => {

    const modal = document.querySelector(".modal");
    modal.setAttribute("hidden", "true");
})