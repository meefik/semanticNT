'use strict';

/* App Module */

angular.module('openITMO', ['ngCookies', 'CatalogFilter', 'MyCoursesFilter', 'CatalogService', 'CourseService']).
        config(['$routeProvider', '$locationProvider', function($routeProvider) {
        $routeProvider.
                when('/', {templateUrl: 'template/home.html', controller: HomeCtrl}).
                when('/about', {templateUrl: 'template/about.html', controller: AboutCtrl}).
                when('/profile', {templateUrl: 'template/profile.html', controller: ProfileCtrl}).
                when('/mycourses', {templateUrl: 'template/mycourses.html', controller: MyCoursesCtrl}).
                when('/courses', {templateUrl: 'template/courses.html', controller: CoursesCtrl}).
                when('/courses/:courseId', {templateUrl: 'template/info.html', controller: InfoCtrl}).
                when('/courses/:courseId/:partId', {templateUrl: 'template/parts.html', controller: PartsCtrl}).
                otherwise({redirectTo: '/'});
    }]);
