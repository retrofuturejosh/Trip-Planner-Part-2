let activityList = document.getElementById('activities-choices')

fetch("http://localhost:3000/api")
.then(res => res.json())
.then(content => {
    let activityNames = content.activities.map(activity => {
        return activity.name;
    })

    activityNames.forEach(activity => {
        let activityOption = document.createElement('option');
        activityOption.innerHTML = activity;
        activityList.appendChild(activityOption);
    })

    return content;
})
.catch(err => {
    console.log(`There was an error: ${err.status}`)
})