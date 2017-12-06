import $ from "jquery";
import {handleSubmit} from './partials/handleSubmit';

require('../css/app.scss');
require('./countrySelect.min.js');

$(() => {
    $("#country").countrySelect();
    handleSubmit();
})
