'use strict';

/* Services */

angular.module('app.services', ['ngResource'])
        .factory('Catalog', function($resource) {
    var path = 'courses/catalog.json';
    return $resource(path, {}, {
        query: {method: 'GET', params: {}, isArray: true}
    });
})
        .factory('Course', function($resource) {
    var path = 'courses/:courseId/json/:partId.json';
    return $resource(path, {}, {
        query: {method: 'GET', params: {courseId: 'unknown', partId: 'info'}, isArray: false}
    });
})
        .factory('Profile', function($resource) {
    var path = 'api/profile';
    return $resource(path, {}, {
        query: {method: 'GET', isArray: false}
    });
})
        .factory('MyCourses', function($resource) {
    var path = 'api/mycourses';
    return $resource(path, {}, {
        query: {method: 'GET', isArray: false}
    });
})
        .factory('News', function($resource) {
    var path = 'api/:courseId/news/:newsId';
    return $resource(path, {}, {
        update: {method: 'PUT'}
    });
});
