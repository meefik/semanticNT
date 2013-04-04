'use strict';

/* Controllers */

function AboutCtrl($scope) {

}

function CoursesCtrl($scope, Course) {
    $scope.courses = Course.query();
    $scope.orderProp = 'age';
}

function MainCtrl($rootScope, $cookieStore, $location) {
    if (!$rootScope.profile)
        $rootScope.profile = $cookieStore.get('profile');
    
    $rootScope.isAuth = function() {
        if ($rootScope.profile)
            return true;
        else
            return false;
    };
    
    $rootScope.logout = function() {
        $rootScope.profile = '';
        $cookieStore.remove('profile');
        $location.path("/");
    };
}

function LoginFormCtrl($rootScope, $scope, $cookieStore) {
    $scope.submitLoginForm = function(user) {
        if ((user.email === "teach@cde.ifmo.ru") && (user.password === "teach")) {
            $scope.error = false;
            // get profile from DB
            $rootScope.profile = {
                "login": "student",
                "courses": [],
                "email": "student@example.com",
                "fullname": "Ivanov S."
            };
            $cookieStore.put('profile', $rootScope.profile);
            $('#login').modal('hide');
            $scope.user = {};
        } else {
            $scope.error = true;
        }
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
    $scope.course = Course.get({courseId: $routeParams.courseId, 
        partId: '/json/info.json'}, function() {
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

function PartsCtrl($rootScope, $scope, $routeParams, $location, Course, Part) {
    if (!$rootScope.isAuth()) {
        $location.path('/');
    }
    $scope.course = Course.get({courseId: $routeParams.courseId, 
        partId: '/json/info.json'}, function() {
        $scope.course.id = $routeParams.courseId;
        for (var i in $scope.course.parts) {
            if ($scope.course.parts[i].id === $routeParams.partId) {
                $scope.course.parts[i].status = "active";
                break;
            }
        }
    });

    $scope.part = Part.get({courseId: $routeParams.courseId,
        partId: $routeParams.partId}, function() {
        $scope.part.id = $routeParams.partId;
        $scope.part.template = 'courses/tpl/'+$scope.part.id+'.html';
        $scope.getContent = function() {
            return 'courses/' + $routeParams.courseId + '/tpl/' + 
                    $routeParams.partId + '.html';
        };
    });

}