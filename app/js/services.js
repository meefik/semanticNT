'use strict';

/* Services */

angular.module('getCoursesService', ['ngResource']).
        factory('Course', function($resource) {
    var path = 'courses/:courseId.json';
    return $resource(path, {}, {
        query: {method: 'GET', params: {courseId: 'list'}, isArray: true}
    });

});

angular.module('getPartsService', ['ngResource']).
        factory('Part', function($resource) {
    var path = 'courses/:courseId/:partId.json';
    return $resource(path, {}, {
        query: {method: 'GET', params: {courseId: 'courseid', partId: 'partid'},
            isArray: true}
    });
});