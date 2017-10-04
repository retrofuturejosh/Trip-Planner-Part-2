let restaurantList = document.getElementById('restaurants-choices')

fetch("http://localhost:3000/api")
.then(res => res.json())
.then(content => {
    let restaurantNames = content.restaurants.map(restaurant => {
        return restaurant.name;
    })

    restaurantNames.forEach(restaurant => {
        let restaurantOption = document.createElement('option');
        restaurantOption.innerHTML = restaurant;
        restaurantList.appendChild(restaurantOption);
    })

    return content;
})
.catch(err => {
    console.log(`There was an error: ${err.status}`)
})