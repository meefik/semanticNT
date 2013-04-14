'use strict';

/* Controllers */

function AppCtrl($rootScope, $scope, $location, $http, Profile) {
    $rootScope.profile = Profile.query();
    
    $rootScope.isAuth = function() {
        if ($rootScope.profile.email)
            return true;
        else
            return false;
    };
    
    $rootScope.logout = function() {
        $http.get('api/logout').
                success(function(data, status) {
            $rootScope.profile = '';
            $location.path("/");
        });
    };
    
    $scope.getAuthTpl = function() {
        if ($rootScope.isAuth())
            return '';
        else
            return 'tpl/auth.html';
    };
}

function LoginFormCtrl($rootScope, $scope, $http, Profile) {
    $scope.reset = function() {
        delete $scope.result;
        delete $scope.user;
        $('#login').modal('hide');
    };
    $scope.submit = function() {
        $http.post('api/login', $scope.user).
                success(function(data, status) {
            $rootScope.profile = Profile.query();
            $scope.reset();
        }).
                error(function(data, status) {
            delete $scope.user.passwd;
            $scope.result = false;
        });
    };
}

function SignupFormCtrl($rootScope, $scope, $http, Profile) {
    $scope.reset = function() {
        delete $scope.result;
        delete $scope.user;
        $('#signup').modal('hide');
    };
    $scope.checkPassword = function() {
        //$scope.signupForm.inputRePassword.$error.dontMatch = $scope.user.passwd !== $scope.user.repasswd;
        $scope.signupForm.inputRePassword.$invalid = $scope.user.passwd !== $scope.user.repasswd;
    };
    $scope.submit = function() {
        //$scope.error = "Регистрация временно приостановлена.";
        var profile = {
            email: $scope.user.email,
            passwd: $scope.user.passwd,
            nickname: $scope.user.nickname,
            fullname: $scope.user.fullname
        };
        $http.post('api/register', profile).
                success(function(data, status) {
            $rootScope.profile = Profile.query();
            $scope.reset();
        }).
                error(function(data, status) {
            delete $scope.user.passwd;
            delete $scope.user.repasswd;
            $scope.result = false;
        });
    };
}

function ForgotFormCtrl($scope, $http) {
    $scope.reset = function() {
        delete $scope.result;
        delete $scope.user;
        delete $scope.email;
        $('#forgot').modal('hide');
        $('#login').modal('show');
    };
    $scope.getStatus = function() {
        if (typeof $scope.result === 'undefined')
            return 0;
        else
            return $scope.result;
    };
    $scope.submit = function() {
        //if ($scope.user.key)
        //    $scope.user.email = $scope.email;
        
        $http.post('api/reset', $scope.user).
                success(function(data, status) {
            $scope.email = $scope.user.email;
            $scope.result = 2;
            //delete $scope.user;
            if ($scope.user.key)
                $scope.reset();
        }).
                error(function(data, status) {
            $scope.result = 1;
            $scope.email = $scope.user.email;
            //delete $scope.user;
            if ($scope.user.key)
                $scope.result = 3;
        });
    };
}

function AboutCtrl($scope) {

}

function TermsCtrl($scope) {

}

function HomeCtrl($scope, Catalog) {
    $scope.catalog = Catalog.query();
    $scope.orderProp = 'age';
}

function CoursesCtrl($scope, Catalog) {
    $scope.catalog = Catalog.query();
    $scope.orderProp = 'age';
}

function MyCoursesCtrl($scope, Catalog, MyCourses) {
    $scope.catalog = Catalog.query();
    $scope.orderProp = 'age';
    
    $scope.mycourses = MyCourses.query();
    
    $scope.unReg = function(courseid) {
        if (!$scope.mycourses)
            return false;
        // clone courses variable
        var courses = $scope.mycourses.courses.slice(0);
        // remove courseid from courses array
        for (var i in courses) {
            if (courses[i] === courseid) {
                courses.splice(i, 1);
                break;
            }
        }
        // save courses array to server
        var newMyCourses = new MyCourses({courses: courses});
        newMyCourses.$save({},function(){
            $scope.mycourses.courses = courses;
        });
        
        /*
        $http.post('api/mycourses', {courses: courses}).
                success(function(data, status) {
            $rootScope.courses = courses;
        });
         */
        
    };
}

function ProfileCtrl() {
    
}

function InfoCtrl($scope, $routeParams, Course, MyCourses) {
    $scope.course = Course.get({courseId: $routeParams.courseId, 
        partId: 'info'}, function() {
        $scope.course.id = $routeParams.courseId;
    });
    
    $scope.mycourses = MyCourses.query();
    
    $scope.isReg = function(courseid) {
        if (!$scope.mycourses) return false;
        for (var i in $scope.mycourses.courses) {
            if (courseid === $scope.mycourses.courses[i])
                return true;
        }
        return false;
    };
    
    $scope.setReg = function(courseid) {
        if (!$scope.isReg(courseid)) {
            // clone courses variable
            var courses = $scope.mycourses.courses.slice(0);
            // add current course number to courses array
            courses.push(courseid);
            // save courses array to server
            var newMyCourses = new MyCourses({courses: courses});
            newMyCourses.$save({}, function() {
                $scope.mycourses.courses = courses;
            });
            /*
            $http.post('api/mycourses', {courses: courses}).
                    success(function(data, status) {
                $scope.mycourses = courses;
            });
            */
        }
    };
}

function PartsCtrl($rootScope, $scope, $routeParams, $location, Course) {
    if (!$rootScope.isAuth()) {
        $location.path('/');
    }
    $scope.course = Course.get({courseId: $routeParams.courseId, 
        partId: 'info'}, function() {
        $scope.course.id = $routeParams.courseId;
        for (var i in $scope.course.parts) {
            if ($scope.course.parts[i].id === $routeParams.partId) {
                $scope.course.parts[i].status = "active";
                break;
            }
        }
    });

    $scope.part = Course.get({courseId: $routeParams.courseId,
        partId: $routeParams.partId}, function() {
        $scope.part.id = $routeParams.partId;
        $scope.part.template = 'courses/tpl/'+$scope.part.id+'.html';
        $scope.getContent = function() {
            return 'courses/' + $routeParams.courseId + '/tpl/' + 
                    $routeParams.partId + '.html';
        };
    });

}