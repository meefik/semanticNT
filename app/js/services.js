'use strict';

/* Services */

angular.module('getCoursesService', ['ngResource']).
        factory('Course', function($resource) {
    var path = 'courses/:courseId:partId';
    return $resource(path, {}, {
        query: {method: 'GET', params: {courseId: 'list.json', partId: ''}, isArray: true}
    });

});

angular.module('getPartsService', ['ngResource']).
        factory('Part', function($resource) {
    var path = 'courses/:courseId/json/:partId.json';
    return $resource(path, {}, {
        query: {method: 'GET', params: {courseId: 'notfound', partId: 'summary'},
            isArray: true}
    });
});