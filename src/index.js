import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const searchValue = input.value.trim();
  if (searchValue === '') {
    cleanHtml();
    return;
  } else {
    fetchCountries(searchValue)
      .then(dataOfCountry => {
        if (dataOfCountry.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (dataOfCountry.length >= 2 && dataOfCountry.length <= 10) {
          renderCountryList(dataOfCountry);
        } else if (dataOfCountry.length === 1) {
          renderOneCountry(dataOfCountry);
        }
      })
      .catch(() => {
        cleanHtml();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="40" hight="35">
         <b>${country.name.official}</p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="40" hight="35">
         <b>${country.name.official}</b></p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function cleanHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}