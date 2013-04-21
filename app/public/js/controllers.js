'use strict';

/* Controllers */

function AppCtrl($rootScope, $scope, $location, $http, $cookieStore, Profile) {
    
    $rootScope.getProfile = function(userid) {
        if (userid) {
            $rootScope.profile = Profile.get({}, function() {
                $cookieStore.put('userid', userid);
            });
        } else {
            userid = $cookieStore.get('userid');
            if (userid)
                $rootScope.profile = Profile.get();
        }
    };
    
    $rootScope.delProfile = function() {
        $cookieStore.remove('userid');
        delete $rootScope.profile;
    };
    
    $rootScope.isAuth = function() {
        if ($rootScope.profile && $rootScope.profile.login)
            return true;
        else
            return false;
    };
    
    if (!$rootScope.isAuth()) {
        $rootScope.getProfile();
    }

    $rootScope.logout = function() {
        $http.get('api/logout').
                success(function() {
            $rootScope.delProfile();
            $location.path("/");
        });
    };

    $rootScope.DateDiff = {
        inDays: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2 - t1) / (24 * 3600 * 1000));
        },
        inWeeks: function(d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
        },
        inMonths: function(d1, d2) {
            var d1Y = d1.getFullYear();
            var d2Y = d2.getFullYear();
            var d1M = d1.getMonth();
            var d2M = d2.getMonth();

            return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
        },
        inYears: function(d1, d2) {
            return d2.getFullYear() - d1.getFullYear();
        }
    };

    $rootScope.getDiffInWeeks = function(d1, d2) {
        var weeksNum = $rootScope.DateDiff.inWeeks(new Date(d1), new Date(d2)) + 1;
        return weeksNum;
    };

    $rootScope.getWeekName = function(num) {
        var lastDigit = (num + "").slice(-1);
        var weekStr = 'недель';
        if (lastDigit === '1')
            weekStr = 'неделя';
        if (lastDigit === '2' || lastDigit === '3' || lastDigit === '4')
            weekStr = 'недели';
        return weekStr;
    };

    $scope.getAuthTpl = function() {
        if ($rootScope.isAuth())
            return '';
        else
            return 'tpl/auth.html';
    };
}

function LoginFormCtrl($rootScope, $scope, $http) {
    $scope.reset = function() {
        delete $scope.result;
        delete $scope.user;
        $('#login').modal('hide');
    };
    $scope.submit = function() {
        $http.post('api/login', $scope.user).
                success(function(data, status) {
            $rootScope.getProfile($scope.user.login);
            $scope.reset();
        }).
                error(function(data, status) {
            delete $scope.user.passwd;
            $scope.result = false;
        });
    };
}

function SignupFormCtrl($rootScope, $scope, $http) {
    $scope.reset = function() {
        delete $scope.result;
        delete $scope.user;
        $('#signup').modal('hide');
    };
    $scope.submit = function() {
        //$scope.error = "Регистрация временно приостановлена.";
        var profile = {
            login: $scope.user.login,
            email: $scope.user.email,
            passwd: $scope.user.passwd,
            fullname: $scope.user.fullname
        };
        $http.post('api/register', profile).
                success(function(data, status) {
            $rootScope.getProfile(profile.login);
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
    $scope.orderProp = 'begin';
}

function CoursesCtrl($scope, Courses) {
    $scope.catalog = Courses.query();
    $scope.orderProp = 'begin';
}

function MyCoursesCtrl($rootScope, $scope, Courses, Profile) {
    $scope.catalog = Courses.query();
    $scope.orderProp = 'begin';

    //$scope.mycourses = MyCourses.query();

    $scope.getProgress = function(d1, d2) {
        var beginDate = new Date(d1).getTime();
        var endDate = new Date(d2).getTime();
        var currentDate = new Date().getTime();
        if (currentDate <= beginDate) {
            return 0;
        }
        if (currentDate >= endDate) {
            return 100;
        }

        return parseInt((currentDate - beginDate) * 100 / (endDate - beginDate));
    };

    $scope.unReg = function(courseid) {
        if (!$rootScope.isAuth())
            return false;

        // clone courses variable
        var courses = $rootScope.profile.courses.slice(0);
        // remove courseid from courses array
        for (var i in courses) {
            if (courses[i] === courseid) {
                courses.splice(i, 1);
                break;
            }
        }
        // save courses array to server
        var newProfile = new Profile({courses: courses});
        newProfile.$update({}, function() {
            $rootScope.profile.courses = courses;
        });
    };
}

function ProfileCtrl() {

}

function InfoCtrl($rootScope, $scope, $routeParams, Courses, Profile) {
    $scope.course = Courses.get({courseId: $routeParams.courseId}, function() {
        //$scope.course.id = $routeParams.courseId;
    });

    //$scope.mycourses = MyCourses.query();

    $scope.getContent = function() {
        return 'courses/' + $scope.course.id + '/tpl/info.html';
    };

    $scope.isReg = function(courseid) {
        if (!$rootScope.isAuth())
            return false;
        for (var i in $rootScope.profile.courses) {
            if (courseid === $rootScope.profile.courses[i])
                return true;
        }
        return false;
    };

    $scope.setReg = function(courseid) {
        if (!$rootScope.isAuth())
            return false;

        // clone courses variable
        var courses = $rootScope.profile.courses.slice(0);
        // add current course number to courses array
        courses.push(courseid);
        // save courses array to server
        var newProfile = new Profile({courses: courses});
        newProfile.$update({}, function() {
            $rootScope.profile.courses = courses;
        });
    };
}

function PartsCtrl($rootScope, $scope, $routeParams, $location, Courses, Parts) {
    /*
     if (!$rootScope.isAuth()) {
     $location.path('/');
     }
     */
    
    $scope.template = 'courses/tpl/' + $routeParams.partId + '.html';
    $scope.getContent = function() {
        return 'courses/' + $routeParams.courseId + '/tpl/' +
                $routeParams.partId + '.html';
    };
    $scope.getLogo = function() {
        return 'courses/' + $routeParams.courseId + '/img/logo.png';
    };
    
    $scope.modules = Parts.query({courseId: $routeParams.courseId}, function() {
        for (var i in $scope.modules) {
            if ($scope.modules[i].id === $routeParams.partId) {
                $scope.modules[i].active = true;
                break;
            }
        }
    });
    
    $scope.course = Courses.get({courseId: $routeParams.courseId});
    
/*
    $scope.part = Courses.get({courseId: $routeParams.courseId,
        partId: $routeParams.partId}, function() {
        $scope.part.id = $routeParams.partId;
        $scope.part.template = 'courses/tpl/' + $scope.part.id + '.html';
        $scope.getContent = function() {
            return 'courses/' + $routeParams.courseId + '/tpl/' +
                    $routeParams.partId + '.html';
        };
    });
*/

}

function NewsCtrl($scope, $routeParams, Courses) {
    $scope.currentEdit = -1;

    $scope.news = Courses.query({
        courseId: $routeParams.courseId,
        partId: $routeParams.partId
    });

    $scope.isEditor = function(id) {
        if ($scope.currentEdit === id)
            return true;
        else
            return false;
    };

    $scope.edit = function(id) {
        $scope.currentEdit = id;
        if (id >= 0) {
            $scope.curr = {
                //id: $scope.news[id]._id,
                title: $scope.news[id].title,
                description: $scope.news[id].description,
                date: $scope.news[id].date
            };
        } else {
            delete $scope.curr;
        }
    };

    $scope.update = function(id) {
        var newNews = new Courses($scope.curr);
        newNews.$update({courseId: $routeParams.courseId,
            partId: $routeParams.partId,
            itemId: $scope.news[id]._id}, function() {
            $scope.news[id].title = $scope.curr.title;
            $scope.news[id].description = $scope.curr.description;
            $scope.edit(-1);
        });
    };

    $scope.add = function() {
        var newNews = new Courses($scope.curr);
        newNews.$save({courseId: $routeParams.courseId,
            partId: $routeParams.partId}, function(data) {
            //$scope.news.push(data); // insert to last
            $scope.news.splice(0, 0, data); // insert to first
            $scope.edit(-1);
            $('#addpost').modal('hide');
        });
    };

    $scope.del = function(id) {
        Courses.remove({courseId: $routeParams.courseId,
            partId: $routeParams.partId,
            itemId: $scope.news[id]._id}, function() {
            $scope.news.splice(id, 1);
            $scope.edit(-1);
        });
    };

}

function StructCtrl($scope, $routeParams, Courses) {

    $scope.posts = Courses.query({courseId: $routeParams.courseId,
        partId: $routeParams.partId});

    // jQuery UI Sortable
    $scope.dragStart = function(e, ui) {
        ui.item.data('start', ui.item.index());
    };
    $scope.dragEnd = function(e, ui) {
        var start = ui.item.data('start'),
                end = ui.item.index();

        $scope.posts.splice(end, 0,
                $scope.posts.splice(start, 1)[0]);

        $scope.$apply();
    };
    $('#sortable').sortable({
        start: $scope.dragStart,
        update: $scope.dragEnd
    });
    
    

}