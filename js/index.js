import {saveTrip, getAll, deleteTrip} from "/js/db.js"


const newTripBtn = document.getElementById("newtrip");
const closeBtn = document.querySelector(".close-btn");

const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const newTripForm = document.getElementById("newTripForm");

const tripContainer = document.querySelector(".trip-grid")
const totalTrips = document.getElementById("totalTrips");
const activeTrips = document.getElementById("activeTrips");



const openModal = () => {
    modal.removeAttribute("hidden");
    overlay.removeAttribute("hidden");
}


const closeModal = () => {
    modal.classList.add("close-modal");
    overlay.classList.add("close-overlay");

    setTimeout(() => {
        modal.setAttribute("hidden", "true");
        overlay.setAttribute("hidden", "true");
        modal.classList.remove("close-modal");
        overlay.classList.remove("close-overlay");
    }, 300)
    
}


const handleEscape = (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
}


const renderTrips = async () => {
    const trips = await getAll("trips");
    
    trips.forEach(trip => {
        renderTrip(trip);
    })
}


const renderTrip = (trip) => {
    const card = document.createElement("div");
    card.className = "trip-card"
    card.dataset.id = trip.id;
    const img = document.createElement("img");
    img.src = URL.createObjectURL(trip.img);
    card.appendChild(img);
    img.onload = () => {
        URL.revokeObjectURL(img.src)
    }
    const status = getTripStatus(trip);
    
    card.innerHTML += `
        <div class="trip-content">
            <div class="trip-header">
            <h3>${trip.tripName}</h3>
            <span class="badge ${status.toLowerCase()}">${status}</span>
            </div>
            <p>📍 ${trip.destination}</p>
            <p>📅 ${trip.startDate} - ${trip.endDate}</p>
            <button class="del-btn" data-id="${trip.id}"></button>
        </div>
    `;
    attachDeleteTripListener(card);
    attachOpenTripCardListener(card);
    tripContainer.appendChild(card);
}


const getTripStatus = (trip) => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
 
    let status;
    if (startDate > today) {
        status = "Upcoming"
    } else if (endDate < today) {
        status = "Completed"
    } else {
        status = "Ongoing";
    }
    return status
}


const renderStats = async () => {
    const trips = await getAll("trips");
    let activeTrip = 0;
    totalTrips.textContent = trips.length;
    trips.forEach(trip => {
        const status = getTripStatus(trip);
        if (status === "Ongoing") {
            activeTrip ++;
        }
    })
    activeTrips.textContent = activeTrip;
}


const attachDeleteTripListener = (card) => {
    const delBtn = card.querySelector(".del-btn");
    const id = card.dataset.id
    delBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTrip("trips", Number(id));
        card.classList.add("close-overlay")
        renderStats();
        setTimeout(() => {
            card.remove();
        }, 300)  
    })
}


const attachOpenTripCardListener = (card) => {
    card.addEventListener("click", () => {
        window.location.href =  `trip.html?id=${card.dataset.id}`
    });
}

newTripBtn.addEventListener("click", openModal) 

closeBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", handleEscape);

newTripForm.addEventListener("submit", (event) => {
    event.preventDefault();
    closeModal();
    const formData = new FormData(newTripForm);
    const data = Object.fromEntries(formData);
    newTripForm.reset();
    saveTrip("trips", data);
});


const init = () => { renderTrips(); renderStats(); };
init();
