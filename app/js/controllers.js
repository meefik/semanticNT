'use strict';

/* Controllers */

function AboutCtrl($scope) {

}

function ContactCtrl($scope) {

}

function MenuCtrl($rootScope, $scope, $cookieStore, $location) {
    if (!$rootScope.profile)
        $rootScope.profile = $cookieStore.get('profile');
    
    $scope.isAuth = function() {
        if ($rootScope.profile)
            return 1;
        else
            return 0;
    };
    
    $scope.logout = function() {
        $rootScope.profile = '';
        $cookieStore.remove('profile');
        $location.path("/");
    };
}

function LoginFormCtrl($rootScope, $scope, $cookieStore) {
    $scope.submitLoginForm = function() {
        // get profile from DB
        $rootScope.profile = {
            "login": "student",
            "courses": [],
            "email": "student@example.com",
            "fullname": "Ivanov S."
        };
        $cookieStore.put('profile', $rootScope.profile);

        $('#login').modal('hide');
        //console.log('signin');
    };
}

function ListCtrl($scope, Course) {
    $scope.courses = Course.query();
    $scope.orderProp = 'age';
}

function ProfileCtrl($rootScope, $scope, $cookieStore, Course) {
    $scope.courses = Course.query();
    $scope.orderProp = 'age';

    $scope.unReg = function(courseid) {
        if (!$rootScope.profile)
            return false;
        var arr = $rootScope.profile.courses;
        for (var i in arr) {
            if (arr[i] === courseid) {
                $rootScope.profile.courses.splice(i,1);
                break;
            }
        }
        $cookieStore.put('profile', $rootScope.profile);
    };
}

function InfoCtrl($rootScope, $scope, $cookieStore, $routeParams, Course) {
    $scope.course = Course.get({courseId: $routeParams.courseId}, function() {
        $scope.course.id = $routeParams.courseId;
    });
    
    $scope.isReg = function(courseid) {
        if (!$rootScope.profile) return false;
        for (var i in $rootScope.profile.courses) {
            if (courseid === $rootScope.profile.courses[i])
                return true;
        }
        return false;
    };
    
    $scope.setReg = function(courseid) {
        if (!$rootScope.profile) return false;
        if (!$scope.isReg(courseid)) {
            $rootScope.profile.courses.push(courseid);
            $cookieStore.put('profile', $rootScope.profile);
        }
    };
}

function PartsCtrl($scope, $routeParams, Course, Part) {
    $scope.course = Course.get({courseId: $routeParams.courseId}, function(course) {
        $scope.course.id = $routeParams.courseId;
        for (var i in course.parts) {
            if ($scope.course.parts[i].id === $routeParams.partId) {
                $scope.course.parts[i].status = "active";
                break;
            }
        }
    });
    $scope.part = Part.get({courseId: $routeParams.courseId,
        partId: $routeParams.partId}, function(part) {
        $scope.part.id = $routeParams.partId;
        $scope.getContent = function() {
            return 'template/courses/' + part.id + '.html';
        };
    });
}