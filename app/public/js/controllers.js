'use strict';

/* Controllers */

function AboutCtrl($scope) {

}

function HomeCtrl($scope, Catalog) {
    $scope.catalog = Catalog.query();
    $scope.orderProp = 'age';
}

function AppCtrl($rootScope, $scope, $location, $http) {
    if (!$rootScope.profile) {
        $http.get('api/profile').
                success(function(data, status) {
            $rootScope.profile = data;
            //console.log(status + ": " + data);
        });
    }
    
    $rootScope.isAuth = function() {
        if ($rootScope.profile)
            return true;
        else
            return false;
    };
    
    $rootScope.logout = function() {
        $http.get('api/logout').
                success(function(data, status) {
            $rootScope.profile = '';
            //$cookieStore.remove('profile');
            $location.path("/");
        });
    };
    
    $scope.getAuthWindow = function() {
        if ($rootScope.isAuth())
            return '';
        else
            return 'tpl/auth.html';
    };
}

function LoginFormCtrl($rootScope, $scope, $cookieStore, $http) {
    $scope.submitLoginForm = function() {
        /*
        if ((!user) || ((user.email.length === 0) || (user.password.length === 0))) {
            $scope.error = "Не заполнены все обязательные поля!";
            return false;
        };
        var re = /\S+@\S+\.\S+/;
        if (!re.test(user.email)) {
            $scope.error = "Адрес электронной почты не соответствует формату!";
            return false;
        }
        if (user.password.length < 4) {
            $scope.error = "Длина пароля меньше четырех символов!";
            return false;
        }
        if ((user.email === "teach@cde.ifmo.ru") && (user.password === "teach")) {
        */    
        $http.post('api/login', $scope.user).
                success(function(data, status) {
            $scope.error = "";
            $scope.user = {};
            $rootScope.profile = data;
            $('#login').modal('hide');
        }).
                error(function(data, status) {
            $scope.error = "Доступ запрещен! Проверьте правильность введенных данных.";
            console.log(status + ": " + data);
        });
            /*
            $scope.error = "";
            // get profile from DB
            $rootScope.profile = {
                "login": "teach",
                "courses": [],
                "email": user.email,
                "fullname": "Ivanov S."
            };
            $cookieStore.put('profile', $rootScope.profile);
            $('#login').modal('hide');
            $scope.user = {};
            */
        /*} else {
            $scope.error = "Введен неправильный адрес электронной почты или пароль!";
            return false;
        }*/
        //console.log('signin');
    };
}

function SignupFormCtrl($rootScope, $scope, $cookieStore, $http) {
    $scope.submitSignupForm = function() {
        //$scope.error = "Регистрация временно приостановлена.";
        if (!$scope.user)
            return $scope.error = "Ошибка ввода данных!";
        var profile = {
            email: $scope.user.email,
            passwd: $scope.user.passwd,
            nickname: $scope.user.nickname,
            fullname: $scope.user.fullname,
        };
        $http.post('api/signup', profile).
                success(function(data, status) {
            $scope.error = "";
            $scope.user = {};
            $rootScope.profile = data;
            $('#signup').modal('hide');
        }).
                error(function(data, status) {
            $scope.error = "Ошибка регистрации! Повторите попытку позже.";
            console.log(status + ": " + data);
        });
    };
}

function CoursesCtrl($scope, Catalog) {
    $scope.catalog = Catalog.query();
    $scope.orderProp = 'age';
}

function MyCoursesCtrl($rootScope, $scope, $cookieStore, Catalog) {
    $scope.catalog = Catalog.query();
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

function ProfileCtrl() {
    
}

function InfoCtrl($rootScope, $scope, $cookieStore, $routeParams, Course) {
    $scope.course = Course.get({courseId: $routeParams.courseId, 
        partId: 'info'}, function() {
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