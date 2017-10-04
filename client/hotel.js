let hotelList = document.getElementById('hotels-choices')

fetch("http://localhost:3000/api")
    .then(res => res.json())
.then(content => {
    let hotelNames = content.hotels.map(hotel => {
        return hotel.name;
    })
    hotelNames.forEach(hotel => {
        let hotelOption = document.createElement('option');
        hotelOption.innerHTML = hotel;
        hotelList.appendChild(hotelOption);
    })
    return content;
})
.catch(err => {
    console.log(`There was an error: ${err.status}`)
})