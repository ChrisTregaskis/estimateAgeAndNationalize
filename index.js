//initialize chart structure
let displayId = document.getElementById('pie-chart-canvas').getContext('2d');
let configOptions = {};
let chart = new Chart(displayId, configOptions);

//grab input and store in var
document.getElementById('name-submit').addEventListener('click', (e) => {
    e.preventDefault();
    let name;
    name = document.getElementById('name').value;
    getAge(name);
    getNationalize(name);
    document.getElementById('display-name').innerText = name;

});

//grab age data https://api.agify.io
async function getAge(nameInput) {
    let data = await fetch(`https://api.agify.io?name=${nameInput}`);
    let result = await data.json();
    document.getElementById('age-returned').innerText = result.age;
    document.getElementById('main-text').classList.remove('hidden');
    document.getElementById('pie-desc').classList.remove('hidden')
}

//grab nationalize data https://api.nationalize.io
async function getNationalize(nameInput) {
    let data = await fetch(`https://api.nationalize.io?name=${nameInput}`);
    let countryResults = await data.json();

    //grab country id for labels
    let country_1 = countryResults.country[0].country_id;
    let country_2 = countryResults.country[1].country_id;
    let country_3 = countryResults.country[2].country_id;

    //grab country probability ISO code
    let countryData_1 = Math.round(countryResults.country[0].probability * 100);
    let countryData_2 = Math.round(countryResults.country[1].probability * 100);
    let countryData_3 = Math.round(countryResults.country[2].probability * 100);

    //generate pie chart graph data inputs
    let countryDataTotal = countryData_1 + countryData_2 + countryData_3;
    let chartData_1 = ((100 / countryDataTotal) * countryData_1).toFixed(0);
    let chartData_2 = ((100 / countryDataTotal) * countryData_2).toFixed(0);
    let chartData_3 = ((100 / countryDataTotal) * countryData_3).toFixed(0);

    //grab full country name probability based on country code https://restcountries.eu/
    let countryFullName_1 = await fetch(`https://restcountries.eu/rest/v2/alpha/${country_1}`);
    let countryFullNameResult_1 = await countryFullName_1.json();
    let countryFullName_2 = await fetch(`https://restcountries.eu/rest/v2/alpha/${country_2}`);
    let countryFullNameResult_2 = await countryFullName_2.json();
    let countryFullName_3 = await fetch(`https://restcountries.eu/rest/v2/alpha/${country_3}`);
    let countryFullNameResult_3 = await countryFullName_3.json();

    //grab full name from fetched full country name data
    let countryLabel_1 = countryFullNameResult_1.name;
    let countryLabel_2 = countryFullNameResult_2.name;
    let countryLabel_3 = countryFullNameResult_3.name;

    //set chart data with results
    let displayData = {
        labels: [countryLabel_1, countryLabel_2, countryLabel_3],
        datasets: [
            {
                label: "label",
                data: [chartData_1, chartData_2, chartData_3],
                backgroundColor: [
                    "#9b59b6",
                    "#1abc9c",
                    "#f1c40f"
                ],
            }
        ]
    };

    //populate config options
    let configOptions = {
        type: "pie",
        data: displayData,
        options: {
            tooltips: {
                callbacks: {
                    label: function(tooltipItems, data) {
                        return data.labels[tooltipItems.index] + " : " +
                            data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' %';
                    }
                }
            }
        }
    };

    //clear current chart and replace with new data
    chart.destroy();
    chart = new Chart(displayId, configOptions);
}