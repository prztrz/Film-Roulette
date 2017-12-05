import $ from "jquery";

require('../css/app.scss');
require('./countrySelect.min.js');

$(() => {
    $("#country").countrySelect();

    const validate = e => {
        e.preventDefault();

        let $yearFrom = $('#year-from');
        let $yearTo = $('#year-to');
        let $genres = $('#genres');
        let $country = $('#country_code');


        createQuery(getDate($yearFrom.val(), true), getDate($yearTo.val(), false), $genres.val().toString(), $country.val().toUpperCase())
    }

    const getDate = (year, isYearFrom) => {
        return isYearFrom ? `${year}-01-01` : `${year}-12-31`
    }

    const createQuery = (dateFrom, dateTo, genres, region) => {
        let apiKey = '1b4cfa94e2a33cd1296ab9424550a781'

        let url = `https://api.themoviedb.org/3/discover/movie?region=${region}&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&with_genres=${genres}&api_key=${apiKey}`

        sendQuery(url, false);
    }

    const getRandomPage = (url, totalPages) => {
        const randomPage = Math.floor(Math.random()*totalPages) + 1;

        url += `&page=${randomPage}`
        sendQuery(url, true)
    }

    const sendQuery = (url, isPageRandom) => {
        $.ajax({
            url: url,
            method: 'get', 
            dataType: 'json', 
        }).done(function(response){ 
            isPageRandom ? console.log(response) : getRandomPage(url, response.total_pages);
        }).fail(function(error){ 
            console.log(error.statusText)
        }).always(function(){ 
            console.log('koniec');
        })
    }

    const appendResult = results => {
        let result = results[Math.floor(Math.random()*(results.length-1))];

        
    }

    const handleSubmit = () => {
        let $form = $('#film-form')

        $form.on('submit', validate)
    }

    handleSubmit();
})
