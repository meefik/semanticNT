'use strict';

/* App Module */

angular.module('openLMS', ['ngCookies', 'coursesListFilter', 'profileCoursesFilter', 'getCoursesService', 'getPartsService']).
        config(['$routeProvider', '$locationProvider', function($routeProvider) {
        $routeProvider.
                when('/', {templateUrl: 'template/list.html', controller: ListCtrl}).
                when('/about', {templateUrl: 'template/about.html', controller: AboutCtrl}).
                when('/contact', {templateUrl: 'template/contact.html', controller: ContactCtrl}).
                when('/profile', {templateUrl: 'template/profile.html', controller: ProfileCtrl}).
                when('/courses/:courseId', {templateUrl: 'template/info.html', controller: InfoCtrl}).
                when('/courses/:courseId/:partId', {templateUrl: 'template/parts.html', controller: PartsCtrl}).
                otherwise({redirectTo: '/'});
    }]);
