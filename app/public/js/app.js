'use strict';

/* App Module */

angular.module('openITMO', ['ngCookies', 'CatalogFilter', 'MyCoursesFilter', 'CatalogService', 'CourseService']).
        config(['$routeProvider', '$locationProvider', function($routeProvider) {
        $routeProvider.
                when('/', {templateUrl: 'tpl/home', controller: HomeCtrl}).
                when('/about', {templateUrl: 'tpl/about', controller: AboutCtrl}).
                when('/profile', {templateUrl: 'tpl/profile.html', controller: ProfileCtrl}).
                when('/mycourses', {templateUrl: 'tpl/mycourses', controller: MyCoursesCtrl}).
                when('/courses', {templateUrl: 'tpl/courses', controller: CoursesCtrl}).
                when('/courses/:courseId', {templateUrl: 'tpl/info', controller: InfoCtrl}).
                when('/courses/:courseId/:partId', {templateUrl: 'tpl/parts', controller: PartsCtrl}).
                otherwise({redirectTo: '/'});
    }]);
