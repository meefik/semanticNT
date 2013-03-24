'use strict';

/* Filters */

angular.module('coursesListFilter', []).
        filter('checkmark', function() {
    return function(input) {
        return input ? '\u2713' : '\u2718';
    };
});

angular.module('profileCoursesFilter', [])
        .filter('isStatus', function($rootScope) {
    return function(input) {
        var out = [];
        var reg = $rootScope.profile.courses;
        for (var i = 0; i < input.length; i++) {
            for (var j = 0; j < reg.length; j++){
                if (input[i].id === reg[i]) {
                    out.push(input[i]);
                    break;
                }
            }
        }
        return out;
    };
});