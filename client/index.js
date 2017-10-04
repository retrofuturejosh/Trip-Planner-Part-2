const hotel = require('./hotel.js');
const restaurant = require('./restaurant.js');
const activity = require('./activity.js');
// const pg = require('pg');
// const fs = require('fs');
const mapboxgl = require("mapbox-gl");
const { Map } = mapboxgl;
const buildMarker = require('./marker.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g';

const map = new Map({
	container: 'map',
	center : [-74.009, 40.705], // FullStack coordinates
	zoom: 15,
	style: "mapbox://styles/mapbox/streets-v10"
})

const marker = buildMarker('hotels', [-74.009, 40.705])
marker.addTo(map)

//Itinerary Object
const itinerary = {hotel: [], restaurant: [], activity: []};


///LISTENING
const button = document.getElementsByClassName('options-btn');
const selectedHotelName = button[0];
const selectedRestaurantName = button[1];
const selectedActivity = button[2];

selectedHotelName.addEventListener('click', function (){
	//getting our selected option
	let select = document.getElementById(`hotels-choices`);
	//getting option's value
	let selectedId = select.value;
	//create new list item
	let selectionUL = document.createElement('li');
	//apply our selection's text to the list item
	selectionUL.innerHTML = selectedId;
	//getting our parent list
	let hotelItineraryList = document.getElementById('hotels-list')
	//appending our parent list
	hotelItineraryList.appendChild(selectionUL);
	//just in case
	itinerary.hotel.push(selectedId);

	addMarkerToMap(selectedId, 'hotels')

	addDeleteButton(selectionUL);
})

selectedRestaurantName.addEventListener('click', function (){
	let select = document.getElementById(`restaurants-choices`);
	let selectedId = select.value;
	let selectionUL = document.createElement('li');
	//apply our selection's text to the list item
	selectionUL.innerHTML = selectedId;
	//getting our parent list
	let hotelItineraryList = document.getElementById('restaurants-list')
	//appending our parent list
	hotelItineraryList.appendChild(selectionUL);

	itinerary.restaurant.push(selectedId)


	addMarkerToMap(selectedId, 'restaurants')

	addDeleteButton(selectionUL);
})

selectedActivity.addEventListener('click', function (){
	let select = document.getElementById(`activities-choices`);
	let selectedId = select.value;
	let selectionUL = document.createElement('li');
	//apply our selection's text to the list item
	selectionUL.innerHTML = selectedId;
	//getting our parent list
	let hotelItineraryList = document.getElementById('activities-list')
	//appending our parent list
	hotelItineraryList.appendChild(selectionUL);

	itinerary.activity.push(selectedId)

	let marker = addMarkerToMap(selectedId, 'activities')
	console.log(marker);
	addDeleteButton(selectionUL);
})


function addMarkerToMap(searchName, type) {
	let coordinates;
	fetch("http://localhost:3000/api")
	.then(res => res.json())
	.then(data => {
		let filteredData;
		if (type === 'hotels'){
			filteredData = data.hotels.filter(hotel => {
				if (hotel.name === searchName){
					return true;
				} else return false
			})
		} else if (type === 'restaurants'){
			filteredData = data.restaurants.filter(restaurant => {
				if (restaurant.name === searchName){
					return true;
				} else return false
			})
		} else {
			filteredData = data.activities.filter(activity => {
				if (activity.name === searchName){
					return true;
				} else return false
			})
		}
		return filteredData[0].place.location
	})
	.then(coordinates => {
		let marker = buildMarker(type, coordinates);
		marker.addTo(map);
		return marker
	})
}


function addDeleteButton(li) {
	let button = document.createElement('button');
	button.innerHTML = 'x';
	li.appendChild(button);
	button.onclick = function () {
		li.remove();
	}
}

