import {getTrip} from "/js/db.js"


const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));
const trip =  await getTrip("trips", id);

const tripName = document.getElementById("tripName");
const destination = document.getElementById("destination");
const date = document.getElementById("date");
const group = document.getElementById("group");

const startDate = new Date(trip.startDate);
const endDate = new Date(trip.endDate);

tripName.textContent = trip.tripName;
destination.textContent = trip.destination;
date.textContent = `${startDate.toLocaleDateString('en-GB')} - ${
                        endDate.toLocaleDateString('en-GB')}`;
group.textContent = trip.participants;


