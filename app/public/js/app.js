'use strict';

/* App Module */

angular.module('openITMO', ['ngCookies', 'app.services', 'app.filters', 'app.directives']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider.
        when('/', { templateUrl: 'tpl/home.html', controller: HomeCtrl }).
        when('/about', { templateUrl: 'tpl/about.html', controller: AboutCtrl }).
        when('/profile', { templateUrl: 'tpl/profile.html', controller: ProfileCtrl }).
        when('/terms', { templateUrl: 'tpl/terms.html', controller: TermsCtrl }).
        when('/mycourses', { templateUrl: 'tpl/mycourses.html', controller: MyCoursesCtrl }).
        when('/courses', { templateUrl: 'tpl/courses.html', controller: CoursesCtrl }).
        when('/courses/:courseId', { templateUrl: 'tpl/info.html', controller: InfoCtrl }).
        when('/courses/:courseId/struct', { templateUrl: 'tpl/parts.html', controller: StructCtrl }).
        when('/courses/:courseId/news', { templateUrl: 'tpl/parts.html', controller: NewsCtrl }).
        when('/courses/:courseId/lectures', { templateUrl: 'tpl/parts.html', controller: LecturesCtrl }).
        when('/courses/:courseId/work', { templateUrl: 'tpl/parts.html', controller: WorkCtrl }).
        when('/courses/:courseId/exam', { templateUrl: 'tpl/parts.html', controller: ExamCtrl }).
        when('/courses/:courseId/exam/:examId', { templateUrl: 'tpl/parts.html', controller: TestCtrl }).
        when('/courses/:courseId/forum', { templateUrl: 'tpl/parts.html', controller: ForumTopicsCtrl, reloadOnSearch: false }).
        when('/courses/:courseId/forum/:topicId', { templateUrl: 'tpl/parts.html', controller: ForumPostsCtrl, reloadOnSearch: false }).
        when('/courses/:courseId/shelf', { templateUrl: 'tpl/parts.html', controller: ShelfCtrl }).
        when('/courses/:courseId/progress', { templateUrl: 'tpl/parts.html', controller: ProgressCtrl }).
        when('/courses/:courseId/ontology', { templateUrl: 'tpl/parts.html', controller: OntologyCtrl }).
        otherwise({ redirectTo: '/' });
}]);

