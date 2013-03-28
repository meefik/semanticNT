'use strict';

/* App Module */

angular.module('openLMS', ['ngCookies', 'coursesListFilter', 'profileCoursesFilter', 'getCoursesService', 'getPartsService']).
        config(['$routeProvider', '$locationProvider', function($routeProvider) {
        $routeProvider.
                when('/', {templateUrl: 'template/main.html', controller: ListCtrl}).
                when('/about', {templateUrl: 'template/about.html', controller: AboutCtrl}).
                when('/profile', {templateUrl: 'template/profile.html', controller: ProfileCtrl}).
                when('/courses', {templateUrl: 'template/courses.html', controller: CoursesCtrl}).
                when('/courses/:courseId', {templateUrl: 'template/info.html', controller: InfoCtrl}).
                when('/courses/:courseId/:partId', {templateUrl: 'template/parts.html', controller: PartsCtrl}).
                otherwise({redirectTo: '/'});
    }]);
