
const cont
window.fetch("http://localhost:3000/api")
    .then(res => res.json())
.then(content => {
  cont = content;
console.log("content", content)

      return content;
})
.catch(err => {
    console.log(`There was an error: ${err.status}`)
})

module.exports = {

    cont
}