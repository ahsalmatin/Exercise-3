async function getDataFromRemoteURL (url){
    const response = await fetch(url)
    const responseBody = await response.json()
    return responseBody
}
async function getPlanets(){
    let planetsArray = []
    try {
        let nextResponse = null
        const response = await getDataFromRemoteURL(`https://swapi.co/api/planets/`)
        planetsArray = planetsArray.concat(response.results)
        while (planetsArray.length < response.count){
            const nextUrl = nextResponse ? nextResponse.next : response.next
            if (nextUrl !== null){
                nextResponse = await getDataFromRemoteURL(nextUrl)
                planetsArray = planetsArray.concat(nextResponse.results)
            }
        }
        return planetsArray
    } catch (error) {
        console.log(error)
    }
}
function insertIntoHTML (planets){
    let htmlString = ''
    for (let index = 0; index < planets.length; index++) {
        const planet = planets[index];
        htmlString += `
        <tr>
                <th scope="row">${index + 1}</th>
                <td>${planet.name}</td>
                <td>${planet.rotation_period}</td>
                <td>${planet.orbital_period}</td>
                <td>${planet.diameter}</td>
                <td>${planet.climate}</td>
                <td>${planet.gravity}</td>
                <td>${planet.terrain}</td>
                <td>${planet.surface_water}</td>
                <td>${planet.population}</td>
        </tr>
        `
        
    }
    document.querySelector('tbody').insertAdjacentHTML('beforeend', htmlString)
}

function handleInputEmail (event){
    const inputValue = event.target.inputValue
    const trElement = document.querySelectorAll('tbody tr')
    for (let index = 0; index < trElement.length; index++){
        const element = trElement[index];
        let displayRow = false
        const tdElement = element.querySelectorAll('td')
        for (let index = 0; index < tdElement.length; index++){
            const element = tdElement[index].innerText;
            displayRow = displayRow || element.toLowerCase().includes(inputValue.toLowerCase())
        }

        trElement[index].classList.toggle('d-none', !displayRow)
    }
}

async function init(){
    const planets = await getPlanets()
    insertIntoHTML(planets)
}
init()
document.getElementById('search-entry').addEventListener('input', handleInputEmail)