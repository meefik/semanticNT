'use strict';

/* Services */

angular.module('app.services', ['ngResource'])
    .factory('Catalog', function ($resource) {
        return $resource('courses/catalog.json', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    })
    .factory('Profile', function ($resource) {
        return $resource('api/profile', {}, {
            update: { method: 'PUT' }
        });
    })
    .factory('Courses', function ($resource) {
        return $resource('api/courses/:courseId/:partId/:itemId', {}, {
            update: { method: 'PUT' }
        });
    })
    .factory('Topic', function ($resource) {
        return $resource('api/courses/:courseId/forum/:topicId', {
            courseId: '@courseid',
            topicId: '@_id'
        }, {
            update: { method: 'PUT' }
        });
    })
    .factory('Post', function ($resource) {
        return $resource('api/courses/:courseId/forum/:topicId/:postId', {
            courseId: '_',
            topicId: '@topic',
            postId: '@_id'
        }, {
            update: { method: 'PUT' }
        });
    })
    .factory('Parts', function ($resource) {
        return $resource('courses/:courseId/modules.json');
    });
