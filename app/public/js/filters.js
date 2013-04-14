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
});