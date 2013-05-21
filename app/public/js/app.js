'use strict';

/* App Module */

angular.module('openITMO', ['ngCookies', 'app.services', 'app.filters', 'app.directives']).
        config(['$routeProvider', '$locationProvider', function($routeProvider) {
        $routeProvider.
                when('/', { templateUrl: 'tpl/home.html', controller: HomeCtrl }).
                when('/about', { templateUrl: 'tpl/about.html', controller: AboutCtrl }).
                when('/profile', { templateUrl: 'tpl/profile.html', controller: ProfileCtrl }).
                when('/terms', { templateUrl: 'tpl/terms.html', controller: TermsCtrl }).
                when('/mycourses', { templateUrl: 'tpl/mycourses.html', controller: MyCoursesCtrl }).
                when('/courses', { templateUrl: 'tpl/courses.html', controller: CoursesCtrl }).
                when('/courses/:courseId', { templateUrl: 'tpl/info.html', controller: InfoCtrl }).
                when('/courses/:courseId/:partId', { templateUrl: 'tpl/parts.html', controller: PartsCtrl }).
                when('/courses/:courseId/:partId/:itemId', { templateUrl: 'tpl/parts.html', controller: PartsCtrl }).
                otherwise({ redirectTo: '/' });
    }]);

