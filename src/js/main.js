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
            isPageRandom ? appendResult(response.results) : getRandomPage(url, response.total_pages);
        }).fail(function(error){ 
            console.log(error.statusText)
        }).always(function(){ 
            console.log('koniec');
        })
    }

    const appendResult = results => {
        let resultFilm = results[Math.floor(Math.random()*(results.length-1))];
        console.log(resultFilm.overview)
        let $resultDiv = $('#result');
        const title = resultFilm.title
        const imgSrc =`http://image.tmdb.org/t/p/w300${resultFilm.poster_path}`;
        const filmHref = `https://www.themoviedb.org/movie/${resultFilm.id}`

        let $toAppend = $(`
            <div class="row align-items-start">
                <div class="col">
                    <h3 class="text-center">${title}</h3>
                </div>
            </div>

            <div class="row align-items-center">
                <div class="col">
                    <div class="text-center">
                        <img src="${imgSrc}" class="rounded" alt="${title} poster">
                    </div>
                </div>
            </div>

            <div class="row align-items-end">
                <div class="col-12">
                    <a href="${filmHref}" target="_blank" class="tmdb-link"><h4 class="text-center">Film in TMDB</h4></a>
                </div>

                <div class="col-12">
                    <p class="text-justify">${resultFilm.overview}</p>
                </div>
            </div>
        `)

        $resultDiv.empty();
        $resultDiv.append($toAppend);    
    }

    const handleSubmit = () => {
        let $form = $('#film-form')

        $form.on('submit', validate)
    }

    handleSubmit();
})
