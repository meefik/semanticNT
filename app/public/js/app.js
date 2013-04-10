'use strict';

/* App Module */

angular.module('openITMO', ['ngCookies', 'CatalogFilter', 'MyCoursesFilter', 'CatalogService', 'CourseService']).
        config(['$routeProvider', '$locationProvider', function($routeProvider) {
        $routeProvider.
                when('/', {templateUrl: 'tpl/home.html', controller: HomeCtrl}).
                when('/about', {templateUrl: 'tpl/about.html', controller: AboutCtrl}).
                when('/profile', {templateUrl: 'tpl/profile.html', controller: ProfileCtrl}).
                when('/mycourses', {templateUrl: 'tpl/mycourses.html', controller: MyCoursesCtrl}).
                when('/courses', {templateUrl: 'tpl/courses.html', controller: CoursesCtrl}).
                when('/courses/:courseId', {templateUrl: 'tpl/info.html', controller: InfoCtrl}).
                when('/courses/:courseId/:partId', {templateUrl: 'tpl/parts.html', controller: PartsCtrl}).
                otherwise({redirectTo: '/'});
    }]);
