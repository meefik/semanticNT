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
        return $resource('api/courses/_/forum/:topicId/posts/:postId/:additional', {
            topicId: '@topic',
            postId: '@_id'
        }, {
            update: { method: 'PUT' },
            star: { method: 'POST', params: { additional: 'star' } },
            unstar: { method: 'DELETE', params: { additional: 'star' } }
        });
    })
    .factory('Parts', function ($resource) {
        return $resource('courses/:courseId/modules.json');
    })

    .factory('Answer', function ($resource) {
        return $resource('api/courses/:courseId/exam/:examId/answers/:answerId', {
            courseId: '@courseId',
            examId: '@examId',
            answerId: '@_id'
        }, {
            update: { method: 'PUT' }
        });
    })
    .factory('Exam', function ($resource) {
        return $resource('api/courses/:courseId/exam/:examId', {
            courseId: '@courseId',
            examId: '@_id'
        }, {
            update: { method: 'PUT' }
        });
    })
    .factory('Question', function ($resource) {
        return $resource('api/courses/:courseId/exam/:examId/question/:questionId', {
            courseId: '@courseId',
            examId: '@examId',
            questionId: '@_id'
        }, {
            update: { method: 'PUT' }
        });
    });
