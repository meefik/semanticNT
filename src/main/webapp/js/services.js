'use strict';

/* Services */

angular.module('CatalogService', ['ngResource']).
        factory('Catalog', function($resource) {
    var path = 'courses/catalog.json';
    return $resource(path, {}, {
        query: {method: 'GET', params: {}, isArray: true}
    });

});

angular.module('CourseService', ['ngResource']).
        factory('Course', function($resource) {
    var path = 'courses/:courseId/json/:partId.json';
    return $resource(path, {}, {
        query: {method: 'GET', params: {courseId: 'unknown', partId: 'info'}, isArray: true}
    });

});
