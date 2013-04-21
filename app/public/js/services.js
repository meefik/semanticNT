'use strict';

/* Services */

angular.module('app.services', ['ngResource'])
        .factory('Catalog', function($resource) {
    var path = 'courses/catalog.json';
    return $resource(path, {}, {
        query: {method: 'GET', params: {}, isArray: true}
    });
})
        .factory('Profile', function($resource) {
    var path = 'api/profile';
    return $resource(path, {}, {
        update: {method: 'PUT'}
    });
})
        .factory('Courses', function($resource) {
    var path = 'api/courses/:courseId/:partId/:itemId';
    return $resource(path, {}, {
        update: {method: 'PUT'}
    });
})
        .factory('Parts', function($resource) {
    var path = 'courses/:courseId/modules.json';
    return $resource(path);
});
