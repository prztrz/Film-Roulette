import $ from "jquery";

require('../css/app.scss');
require('./countrySelect.min.js');

$(() => {
    $("#country").countrySelect();
})
