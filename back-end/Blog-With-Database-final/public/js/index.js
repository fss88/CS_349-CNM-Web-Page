'use strict'

const SELECTOR = document.querySelector('[data-selectItems-role="trigger"]');
const apiKey = 'fa4e0a37946e4caa8692c487250889cb';
let state = SELECTOR.value;
let url = 'https://api.covidactnow.org/v2/state/' + state + '.json?apiKey=' + apiKey;

const cumulativeCases = document.querySelector('[data-panel-role="cumulative-cases"]');
const dailyPositiveCases = document.querySelector('[data-panel-role="daily-positive-cases"]');
const cumulativeDeaths = document.querySelector('[data-panel-role="cumulative-deaths"]');
const deathsToday = document.querySelector('[data-panel-role="deaths-today"]');
const cumulativeTests = document.querySelector('[data-panel-role="cumulative-tests"]');
const testsToday = document.querySelector('[data-panel-role="tests-today"]');
const casesHospitalized = document.querySelector('[data-panel-role="cases-hospitalized"]');
const casesICU = document.querySelector('[data-panel-role="cases-ICU"]');
const stateUI = document.querySelector('[data-state-role="target"]');
const dateUI = document.querySelector('[data-date-role="today"]');

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showdate() {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
    //let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    return date;
}

const updateUISuccess = function(parsedData) {
    cumulativeCases.textContent = numberWithCommas(parsedData.actuals.cases);
    dailyPositiveCases.textContent = numberWithCommas(parsedData.actuals.newCases);
    cumulativeDeaths.textContent = numberWithCommas(parsedData.actuals.deaths);
    deathsToday.textContent = numberWithCommas(parsedData.actuals.newDeaths);
    cumulativeTests.textContent = numberWithCommas(parsedData.actuals.positiveTests + parsedData.actuals.negativeTests);
    casesHospitalized.textContent = numberWithCommas(parsedData.actuals.hospitalBeds.currentUsageCovid);
    casesICU.textContent = numberWithCommas(parsedData.actuals.icuBeds.currentUsageCovid);
    stateUI.textContent = SELECTOR.options[SELECTOR.selectedIndex].text;
    dateUI.textContent = showdate();
}

const updateUIError = function(error) {
    console.log(error);
}

const handleErrors = function(response) {
    if(!response.ok) {
        throw (response.status + ": " + response.statusText);
    }
    return response.json();
}

const createFetchRequest = function(url, succeed, fail) {
    fetch(url)
    .then((response) => handleErrors(response))
    .then((data) => succeed(data))
    .catch((error) => fail(error));
};

window.addEventListener('DOMContentLoaded', () => {
    createFetchRequest(url, updateUISuccess, updateUIError);
})

SELECTOR.addEventListener("change", (event) => {
    state = event.target.value;
    url = 'https://api.covidactnow.org/v2/state/' + state + '.json?apiKey=' + apiKey;
    createFetchRequest(url, updateUISuccess, updateUIError);

})
