const hotel = require('./hotel.js');
const restaurant = require('./restaurant.js');
const activity = require('./activity.js');
const mapboxgl = require("mapbox-gl");
const { Map } = mapboxgl;
const buildMarker = require('./marker.js');

//map token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g';

//create map
const map = new Map({
	container: 'map',
	center : [-74.009, 40.705], // FullStack coordinates
	zoom: 15,
	style: "mapbox://styles/mapbox/streets-v10"
})

//starting point
const marker = buildMarker('hotel', [-74.009, 40.705])
marker.addTo(map)

//Itinerary Object (state)
const itinerary = {hotel: [], restaurant: [], activity: []};

///LISTENING, add click listener to add button
const button = document.getElementsByClassName('options-btn');

for (let i = 0; i < button.length; i++){
	button[i].addEventListener('click', function (){
		let currentButton = button[i];
		let idtype;
		let category;
		let listname;
		//assign specifc buttons
		if (currentButton.id === 'hotels-add'){
			idtype = 'hotels-choices';
			category = 'hotel';
			listname = 'hotels-list'
		} else if (currentButton.id === 'restaurants-add'){
			idtype = 'restaurants-choices';
			category = 'restaurant';
			listname = 'restaurants-list'
		} else {
			idtype = 'activities-choices';
			category = 'activity'
			listname = 'activities-list'
		}
		let select = document.getElementById(idtype);
		let selectedId = select.value;

		//check for duplicates
		if (itinerary[category].includes(selectedId)) return;

		//add to itinerary list
		let selectionUL = document.createElement('li');
		selectionUL.innerHTML = selectedId;
		let currentList = document.getElementById(listname);
		currentList.appendChild(selectionUL);

		//add item to itinerary state
		itinerary[category].push(selectedId);

		//add the marker to map
		addMarkerToMap(selectedId, category);

		//give the itinerary list a delete button
		addDeleteButton(selectionUL, category);
	})
}

//store our markers for deletion
const markerReference = {};


//add marker, add marker to maker reference, fly to location of added marker
function addMarkerToMap(searchName, type) {
	let coordinates;
	fetch("http://localhost:3000/api")
	.then(res => res.json())
	.then(data => {
		let filteredData;
		if (type === 'hotel'){
			filteredData = data.hotels.filter(hotel => {
				if (hotel.name === searchName){
					return true;
				} else return false
			})
		} else if (type === 'restaurant'){
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
		if (searchName === 'National September 11th Memorial & Museum') {
			searchName = 'National September 11th Memorial';
		}
		markerReference[searchName] = [marker, coordinates];
		marker.addTo(map);
		map.flyTo({ center: coordinates, zoom: 15})
		return marker
	})
}


//gets name from element
function getName (str){
    let returnStr = '';
    for (let i = 0; i < str.length; i++){
        if (str[i] === '<') break;
        returnStr += str[i]
    }
    return returnStr;
}


//adds a working delete button, moves map to location and pauses before removal, removes marker from marker reference
function addDeleteButton(li, category) {
	let button = document.createElement('button');
	button.innerHTML = 'x';
	li.appendChild(button);
	button.onclick = function () {
	   let toRemove = getName(li.innerHTML);
	   if (toRemove === 'National September 11th Memorial &amp; Museum') {
		toRemove = 'National September 11th Memorial';
	}
		map.flyTo({ center: markerReference[toRemove][1], zoom: 13})
		li.remove();
		window.setTimeout(function () {
			markerReference[toRemove][0].remove();
			let index = itinerary[category].indexOf(toRemove);
			itinerary[category].splice(index, 1);
		}, 1500)
	}
}





// const selectedHotelName = button[0];
// const selectedRestaurantName = button[1];
// const selectedActivity = button[2];

// selectedHotelName.addEventListener('click', function (){
// 	//getting our selected option
// 	let select = document.getElementById(`hotels-choices`);
// 	//getting option's value
// 	let selectedId = select.value;

// 	if (itinerary.hotel.includes(selectedId)) return;
// 	//create new list item
// 	let selectionUL = document.createElement('li');
// 	//apply our selection's text to the list item
// 	selectionUL.innerHTML = selectedId;
// 	//getting our parent list
// 	let hotelItineraryList = document.getElementById('hotels-list')
// 	//appending our parent list
// 	hotelItineraryList.appendChild(selectionUL);
// 	//just in case
// 	itinerary.hotel.push(selectedId);

// 	addMarkerToMap(selectedId, 'hotels')

// 	addDeleteButton(selectionUL);
// })

// selectedRestaurantName.addEventListener('click', function (){
// 	let select = document.getElementById(`restaurants-choices`);
// 	let selectedId = select.value;

// 	if (itinerary.restaurant.includes(selectedId)) return;


// 	let selectionUL = document.createElement('li');
// 	//apply our selection's text to the list item
// 	selectionUL.innerHTML = selectedId;
// 	//getting our parent list
// 	let hotelItineraryList = document.getElementById('restaurants-list')
// 	//appending our parent list
// 	hotelItineraryList.appendChild(selectionUL);

// 	itinerary.restaurant.push(selectedId)


// 	addMarkerToMap(selectedId, 'restaurants')

// 	addDeleteButton(selectionUL);
// })

// selectedActivity.addEventListener('click', function (){
// 	let select = document.getElementById(`activities-choices`);
// 	let selectedId = select.value;

// 	if (itinerary.activity.includes(selectedId)) return;

// 	let selectionUL = document.createElement('li');
// 	//apply our selection's text to the list item
// 	selectionUL.innerHTML = selectedId;
// 	//getting our parent list
// 	let hotelItineraryList = document.getElementById('activities-list')
// 	//appending our parent list
// 	hotelItineraryList.appendChild(selectionUL);

// 	itinerary.activity.push(selectedId)

// 	let marker = addMarkerToMap(selectedId, 'activities')
// 	addDeleteButton(selectionUL);
// })


