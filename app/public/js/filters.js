'use strict';

/* Filters */

angular.module('app.filters', [])
        .filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '\u2718';
    };
})
        .filter('isStatus', function() {
    return function(input, courses) {
        var out = [];
        if (courses) {
            for (var i = 0; i < input.length; i++) {
                for (var j = 0; j < courses.length; j++) {
                    if (input[i].id === courses[j]) {
                        out.push(input[i]);
                        break;
                    }
                }
            }
        }
        return out;
    };
})
        .filter('dateToText', function() {
    return function(dateString, format) {
        var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        var d = new Date(dateString);
        var str = d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear()+" г.";
        if (format === 'time') {
            var hh = d.getHours();
            var mm = d.getMinutes();
            var ss = d.getSeconds();
            if (hh < 10) {hh = "0"+hh;}
            if (mm < 10) {mm = "0"+mm;}
            if (ss < 10) {ss = "0"+ss;}
            str = str+" "+hh+":"+mm+":"+ss;
        }
        return str;
    };
});
