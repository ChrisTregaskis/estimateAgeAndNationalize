//grab input and store in var
document.getElementById('name-submit').addEventListener('click', (e) => {
    e.preventDefault()
    let name;
    name = document.getElementById('name').value;
    getAge(name)
    getNationalize(name)
    document.getElementById('display-name').innerText = name;

});

//grab age data
async function getAge(nameInput) {
    let data = await fetch(`https://api.agify.io?name=${nameInput}`);
    let result = await data.json();
    let age = result.age;
    document.getElementById('age-returned').innerText = age;
    document.getElementById('main-text').classList.remove('hidden')
}

//grab nationalize data
async function getNationalize(nameInput) {
    let data = await fetch(`https://api.nationalize.io?name=${nameInput}`);
    let countryResults = await data.json();
    console.log(countryResults);

    //grab country id for labels
    let country_1 = countryResults.country[0].country_id;
    let country_2 = countryResults.country[1].country_id;
    let country_3 = countryResults.country[2].country_id;

    //grab country probability data
    let countryData_1 = countryResults.country[0].probability;
    let countryData_2 = countryResults.country[1].probability;
    let countryData_3 = countryResults.country[2].probability;

    console.log(country_1, countryData_1);

    var ctx = document.getElementById('pie-chart-canvas');

    var displayData = {
        labels: [country_1, country_2, country_3],
        datasets: [
            {
                label: "label",
                data: [countryData_1, countryData_2, countryData_3],
                backgroundColor: [
                    "#9b59b6",
                    "#1abc9c",
                    "#f1c40f"
                ],
            }
        ]
    };

    var chart = new Chart(ctx, {
        type: "pie",
        data: displayData,
        options: {}
    });

}



