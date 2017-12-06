import $ from "jquery";

const resetStyles = (...objects) => {
    objects.forEach( (object) => {
        object.removeAttr('style')
    })
}

const isYearValid = ($year) => {
    let yearInt = parseInt($year.val(), 10);
    let date = new Date();

    return (yearInt >= 1900 && yearInt <= date.getFullYear())
}

const areYearsProper = ($from, $to) => {
    let from = parseInt($from.val());
    let to = parseInt($to.val());

    return (from <= to)
}

const validate = e => {
    e.preventDefault();
    let isValid = true;
    $('.invalid-msg').removeClass('invalid');

    let $yearFrom = $('#year-from');
    let $yearTo = $('#year-to');
    let $genres = $('#genres');
    let $country = $('#country_code');

    resetStyles($yearFrom, $yearTo, $genres)

    if (!isYearValid($yearFrom) || !isYearValid($yearTo)) {
        isValid = false;
        $('#year-invalid').addClass('invalid');

        if (!isYearValid($yearFrom)) {
            $yearFrom.css({'background-color': 'rgba(255,0,0,0.2)', 'border-color': 'red'})
        }

        if (!isYearValid($yearTo)) {
            $yearTo.css({'background-color': 'rgba(255,0,0,0.2)', 'border-color': 'red'})
        }
    } else if (!areYearsProper($yearFrom, $yearTo)){
        isValid = false;
        $('#years-same').addClass('invalid');
        $yearFrom.css({'background-color': 'rgba(255,0,0,0.2)', 'border-color': 'red'})
        $yearTo.css({'background-color': 'rgba(255,0,0,0.2)', 'border-color': 'red'})
    }
    
    if ($genres.val().length <= 0) {
        $('#genres-invalid').addClass('invalid');
        $genres.css({'background-color': 'rgba(255,0,0,0.2)', 'border-color': 'red'})
        isValid = false;
    }

    if (isValid) {
        createQuery(getDate($yearFrom.val(), true), getDate($yearTo.val(), false), $genres.val().toString(), $country.val())
    }
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

const putLoadingPlaceholder = () => {
    const $resultDiv = $('#result');
    $resultDiv.empty();
    let $toAppend = $(`
        <div class="row align-items-center justify-content-center" style="height:100%">
            <span class='loading-placeholder'><i class="fa fa-film" aria-hidden="true"></i></span>
        </div>
    `)

    $resultDiv.append($toAppend)
    console.log($toAppend)
}

const sendQuery = (url, isPageRandom) => {
    putLoadingPlaceholder();

    $.ajax({
        url: url,
        method: 'get', 
        dataType: 'json', 
    }).done(function(response){ 
       isPageRandom ? appendResult(response.results) : getRandomPage(url, response.total_pages);
    }).fail(function(error){ 
        console.log(error.statusText)
    })
}

const appendResult = results => {
    let $toAppend = '';
    const $resultDiv = $('#result');
    if (results.length !== 0){
        let resultFilm = results[Math.floor(Math.random()*(results.length-1))];
        const title = resultFilm.title
        const imgSrc =`http://image.tmdb.org/t/p/w300${resultFilm.poster_path}`;
        const filmHref = `https://www.themoviedb.org/movie/${resultFilm.id}`

        $toAppend = $(`
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
                    <p class="text-justify">${resultFilm.overview !== '' ? resultFilm.overview : 'Overview unavailable'}</p>
                </div>
            </div>
        `)
    } else {
        $toAppend = $(`
            <div style="height:100%; display: flex; justify-content: center; align-items:center">
            <p>Sorry, we did not find any film matching your criteria</p>
            </div>
        `)
    }

    $resultDiv.empty();
    $resultDiv.append($toAppend);    
}

const handleSubmit = () => {
    let $form = $('#film-form')

    $form.on('submit', validate)
}

export {handleSubmit}