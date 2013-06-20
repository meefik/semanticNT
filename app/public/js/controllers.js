'use strict';

/* Controllers */

function AppCtrl($rootScope, $scope, $location, $http, $cookieStore, Profile) {

    $rootScope.getProfile = function (userid) {
        if (userid) {
            $rootScope.profile = Profile.get({}, function () {
                $cookieStore.put('userid', userid);
            });
        } else {
            userid = $cookieStore.get('userid');
            if (userid)
                $rootScope.profile = Profile.get();
        }
    };

    $rootScope.delProfile = function () {
        $cookieStore.remove('userid');
        delete $rootScope.profile;
    };

    $rootScope.isAuth = function () {
        return !!($rootScope.profile && $rootScope.profile.login);
    };

    if (!$rootScope.isAuth()) {
        $rootScope.getProfile();
    }

    $rootScope.logout = function () {
        $http.get('api/logout').
            success(function () {
                $rootScope.delProfile();
                //$location.path("/");
            });
    };

    $rootScope.DateDiff = {
        inDays: function (d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2 - t1) / (24 * 3600 * 1000));
        },
        inWeeks: function (d1, d2) {
            var t2 = d2.getTime();
            var t1 = d1.getTime();

            return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
        },
        inMonths: function (d1, d2) {
            var d1Y = d1.getFullYear();
            var d2Y = d2.getFullYear();
            var d1M = d1.getMonth();
            var d2M = d2.getMonth();

            return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
        },
        inYears: function (d1, d2) {
            return d2.getFullYear() - d1.getFullYear();
        }
    };

    $rootScope.getDiffInWeeks = function (d1, d2) {
        var weeksNum = $rootScope.DateDiff.inWeeks(new Date(d1), new Date(d2)) + 1;
        return weeksNum;
    };

    $rootScope.getWeekName = function (num) {
        var lastDigit = (num + "").slice(-1);
        var weekStr = 'недель';
        if (lastDigit === '1')
            weekStr = 'неделя';
        if (lastDigit === '2' || lastDigit === '3' || lastDigit === '4')
            weekStr = 'недели';
        return weekStr;
    };

    $scope.getAuthTpl = function () {
        if ($rootScope.isAuth())
            return '';
        else
            return 'tpl/auth.html';
    };

    $scope.isActive = function (id) {
        if (id === $location.path())
            return true;
        else
            return false;
    };
}

function LoginFormCtrl($rootScope, $scope, $http) {
    $scope.reset = function () {
        delete $scope.result;
        delete $scope.user;
        $('#login').modal('hide');
    };
    $scope.submit = function () {
        $http.post('api/login', $scope.user).
            success(function (data, status) {
                $rootScope.getProfile($scope.user.login);
                $scope.reset();
            }).
            error(function (data, status) {
                delete $scope.user.passwd;
                $scope.result = false;
            });
    };
}

function SignupFormCtrl($rootScope, $scope, $http) {
    $scope.reset = function () {
        delete $scope.result;
        delete $scope.user;
        $('#signup').modal('hide');
    };
    $scope.submit = function () {
        //$scope.error = "Регистрация временно приостановлена.";
        var profile = {
            login: $scope.user.login,
            email: $scope.user.email,
            passwd: $scope.user.passwd,
            fullname: $scope.user.fullname
        };
        $http.post('api/register', profile).
            success(function (data, status) {
                $rootScope.getProfile(profile.login);
                $scope.reset();
            }).
            error(function (data, status) {
                delete $scope.user.passwd;
                delete $scope.user.repasswd;
                $scope.result = false;
            });
    };
}

function ForgotFormCtrl($scope, $http) {
    $scope.reset = function () {
        delete $scope.result;
        delete $scope.user;
        delete $scope.email;
        $('#forgot').modal('hide');
        $('#login').modal('show');
    };
    $scope.getStatus = function () {
        if (typeof $scope.result === 'undefined')
            return 0;
        else
            return $scope.result;
    };
    $scope.submit = function () {
        //if ($scope.user.key)
        //    $scope.user.email = $scope.email;

        $http.post('api/reset', $scope.user).
            success(function (data, status) {
                $scope.email = $scope.user.email;
                $scope.result = 2;
                //delete $scope.user;
                if ($scope.user.key)
                    $scope.reset();
            }).
            error(function (data, status) {
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

    $scope.getAuthors = function (data) {
        var authors = "";
        for (var i in data) {
            if (i > 0) {
                authors += ", ";
            }
            authors += data[i];
        }
        return authors;
    };
}

function CoursesCtrl($scope, Courses) {
    $scope.catalog = Courses.query();
    $scope.orderProp = 'begin';
}

function MyCoursesCtrl($rootScope, $scope, Courses, Profile) {
    $scope.catalog = Courses.query();

    $scope.getProgress = function (d1, d2) {
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

    $scope.unReg = function (courseid) {
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
        newProfile.$update({}, function () {
            $rootScope.profile.courses = courses;
        });
    };
}

function ProfileCtrl() {

}

function InfoCtrl($rootScope, $scope, $routeParams, Courses, Profile) {
    $scope.course = Courses.get({courseId: $routeParams.courseId}, function () {
        //$scope.course.id = $routeParams.courseId;
    });

    //$scope.mycourses = MyCourses.query();

    $scope.getContent = function () {
        return 'courses/' + $scope.course.id + '/tpl/info.html';
    };

    $scope.isReg = function (courseid) {
        if (!$rootScope.isAuth())
            return false;
        for (var i in $rootScope.profile.courses) {
            if (courseid === $rootScope.profile.courses[i])
                return true;
        }
        return false;
    };

    $scope.setReg = function (courseid) {
        if (!$rootScope.isAuth())
            return false;

        // clone courses variable
        var courses = $rootScope.profile.courses.slice(0);
        // add current course number to courses array
        courses.push(courseid);
        // save courses array to server
        var newProfile = new Profile({courses: courses});
        newProfile.$update({}, function () {
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
    /*
     $scope.template = 'courses/tpl/' + $routeParams.partId + '.html';
     $scope.content = 'courses/' + $routeParams.courseId + '/tpl/' +
     $routeParams.partId + '.html';
     */

    var part = $location.path().split('/')[3];
    $scope.logo = 'courses/' + $routeParams.courseId + '/img/logo.png';

    $scope.modules = Parts.query({courseId: $routeParams.courseId}, function () {
        for (var i in $scope.modules) {
            if ($scope.modules[i].id === part) {
                $scope.modules[i].active = true;
                break;
            }
        }
    });

    $scope.course = Courses.get({courseId: $routeParams.courseId});

    $scope.isModerator = function () {
        return !!($scope.course.moderators &&
            $scope.course.moderators.indexOf($scope.profile.login) >= 0)
    };
}

function NewsCtrl($scope, $routeParams, Courses) {
    $scope.template = 'courses/tpl/news.html';

    $scope.currentEdit = -1;

    $scope.news = Courses.query({
        courseId: $routeParams.courseId,
        partId: 'news'
    });

    $scope.isEditor = function (id) {
        if ($scope.currentEdit === id)
            return true;
        else
            return false;
    };

    $scope.edit = function (id) {
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

    $scope.update = function (id) {
        var newNews = new Courses($scope.curr);
        newNews.$update({courseId: $routeParams.courseId,
            partId: 'news',
            itemId: $scope.news[id]._id}, function () {
            $scope.news[id].title = $scope.curr.title;
            $scope.news[id].description = $scope.curr.description;
            $scope.edit(-1);
        });
    };

    $scope.add = function () {
        var newNews = new Courses($scope.curr);
        newNews.$save({courseId: $routeParams.courseId,
            partId: 'news'}, function (data) {
            //$scope.news.push(data); // insert to last
            $scope.news.splice(0, 0, data); // insert to first
            $scope.edit(-1);
            $('#addpost').modal('hide');
        });
    };

    $scope.del = function (id) {
        Courses.remove({courseId: $routeParams.courseId,
            partId: 'news',
            itemId: $scope.news[id]._id}, function () {
            $scope.news.splice(id, 1);
            $scope.edit(-1);
        });
    };
}

function LecturesCtrl($scope, $routeParams, $http) {
    $scope.template = 'courses/tpl/lectures.html';

    var courseId = $routeParams.courseId;
    $scope.courseId = courseId;

    $http(
        {
            "method": "GET",
            "url" : "courses/" + courseId + "/json/lectures.json"
        }
    ).success(function(data, status){
            $scope.content = data.content;
        });

    //$scope.content = [{"id" : 1}, {"id": 2}];
}

function WorkCtrl($scope) {
    $scope.template = 'courses/tpl/work.html';
}

function ShelfCtrl($scope, $routeParams, Courses) {
    $scope.template = 'courses/tpl/shelf.html';

    $scope.currentEdit = -1;

    $scope.posts = Courses.query({
        courseId: $routeParams.courseId,
        partId: 'shelf'}, function () {
        //$scope.updateToc();
    });

    // jQuery UI Sortable
    $scope.dragStart = function (e, ui) {
        ui.item.data('start', ui.item.index());
    };
    $scope.dragEnd = function (e, ui) {
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

    $scope.isEditor = function (id) {
        if ($scope.currentEdit === id)
            return true;
        else
            return false;
    };

    $scope.edit = function (id) {
        $scope.currentEdit = id;
        if (id >= 0) {
            $scope.curr = {
                //id: $scope.posts[id]._id,
                title: $scope.posts[id].title,
                text: $scope.posts[id].text,
                date: $scope.posts[id].date,
                author: $scope.posts[id].author
            };
            $('#sortable').sortable("disable");
        } else {
            delete $scope.curr;
            $('#sortable').sortable("enable");
        }
    };

    $scope.add = function (id) {
        if (typeof id === 'undefined') {
            id = $scope.posts.length - 1;
        }

        var post = {
            title: "Заголовок " + $scope.posts.length,
            text: "Содержание... "
        };
        var newPost = new Courses(post);
        newPost.$save({courseId: $routeParams.courseId,
            partId: 'shelf'}, function (data) {
            $scope.posts.splice(id + 1, 0, data);
        });
    };

    $scope.del = function (id) {
        var scope = this;
        Courses.remove({courseId: $routeParams.courseId,
            partId: 'shelf',
            itemId: $scope.posts[id]._id}, function () {
            scope.destroy(function () {
                $scope.posts.splice(id, 1);
            });
        });
    };

    $scope.update = function (id) {
        var newPost = new Courses($scope.curr);
        newPost.$update({courseId: $routeParams.courseId,
            partId: 'shelf',
            itemId: $scope.posts[id]._id}, function () {
            $scope.posts[id].title = $scope.curr.title;
            $scope.posts[id].text = $scope.curr.text;
            $scope.edit(-1);
        });
    };

    // title of content
    $scope.updateToc = function () {
        if (!$scope.$$phase) {
            $scope.$apply();
        }

        $("#tocbox").attr("class", "show");
        $("#toc").html('');
        $("#sortable").find("h1, h2, h3").each(function (i) {
            var current = $(this);
            current.attr("id", "post" + i);
            $("#toc").append('<p><a href="" id="link' + i + '" title="' + current.attr("tagName") + '">' + current.html() + '</a></p>');
            $("#link" + i).click(function () {
                // fixme: scroll wrong position
                $("body").scrollTop($('#post' + i).offset().top);
                return false;
            });
        });
    };
}

function StructCtrl($scope, $routeParams, Courses) {
    $scope.template = 'courses/tpl/struct.html';

    $scope.currentEdit = -1;

    $scope.posts = Courses.query({
        courseId: $routeParams.courseId,
        partId: 'struct'});

    // jQuery UI Sortable
    $scope.dragStart = function (e, ui) {
        ui.item.data('start', ui.item.index());
    };
    $scope.dragEnd = function (e, ui) {
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

    $scope.isEditor = function (id) {
        if ($scope.currentEdit === id)
            return true;
        else
            return false;
    };

    $scope.edit = function (id) {
        $scope.currentEdit = id;
        if (id >= 0) {
            $scope.curr = {
                //id: $scope.posts[id]._id,
                title: $scope.posts[id].title,
                text: $scope.posts[id].text,
                date: $scope.posts[id].date,
                author: $scope.posts[id].author
            };
            $('#sortable').sortable("disable");
        } else {
            delete $scope.curr;
            $('#sortable').sortable("enable");
        }
    };

    $scope.add = function (id) {
        if (typeof id === 'undefined') {
            id = $scope.posts.length - 1;
        }

        var post = {
            title: "Заголовок " + $scope.posts.length,
            text: "Содержание... "
        };
        var newPost = new Courses(post);
        newPost.$save({courseId: $routeParams.courseId,
            partId: 'struct'}, function (data) {
            $scope.posts.splice(id + 1, 0, data);
        });
    };

    $scope.del = function (id) {
        var scope = this;
        Courses.remove({courseId: $routeParams.courseId,
            partId: 'struct',
            itemId: $scope.posts[id]._id}, function () {
            scope.destroy(function () {
                $scope.posts.splice(id, 1);
            });
        });
    };

    $scope.update = function (id) {
        var newPost = new Courses($scope.curr);
        newPost.$update({courseId: $routeParams.courseId,
            partId: 'struct',
            itemId: $scope.posts[id]._id}, function () {
            $scope.posts[id].title = $scope.curr.title;
            $scope.posts[id].text = $scope.curr.text;
            $scope.edit(-1);
        });
    };
}

function ExamCtrl($scope, $location, $routeParams, $http, Exam, Question) {
    $scope.template = 'courses/tpl/exam.html';

    Exam.query({ courseId: $routeParams.courseId }, function (data) {
        if (data.length > 0) {
            //loading data from mongo
            $scope.exam = data;
        } else {
            //import data to mongo
            $http({
                "method": "GET",
                "url" : "courses/" + $routeParams.courseId + "/json/exam.json"
            }).success(function(exams, status){
                $scope.exam = exams;
                for (var i = 0; i < exams.length; i++) {
                    var newExam = new Exam({
                        courseId: exams[i].courseId,
                        author: exams[i].author,
                        deadline: exams[i].deadline,
                        title: exams[i].title,
                        description: exams[i].description
                    });
                    newExam.$save({ courseId: $routeParams.courseId }, function(exam, err) {
                        var questions;
                        for (var q = 0; q < $scope.exam.length; q++) {
                            if (exam.title == $scope.exam[q].title) {
                                questions = $scope.exam[q].questions;
                                break;
                            }
                        }
                        for (var j = 0; j < questions.length; j++) {
                            var newQuestion = new Question({
                                id: questions[j].id,
                                name: questions[j].name,
                                description: questions[j].description,
                                qtype: questions[j].qtype,
                                answer: questions[j].answer,
                                variants: questions[j].variants,
                                examId: exam._id
                            });
                            newQuestion.$save({courseId: $routeParams.courseId, examId: exam._id });
                        }
                    });
                }
                $("#refresh").modal('show');
            });

        }
    });

    $scope.isNotLoggedIn = function () {
        return $scope.profile == undefined || $scope.profile.login == undefined;
    }

    $scope.isModerator = function () {
        return (!!($scope.course.moderators &&
            $scope.course.moderators.indexOf($scope.profile.login) >= 0))
    };

    $scope.start = function (test) {
        if ($scope.profile != undefined || $scope.profile.login != undefined) {
            $location.path($location.path() + "/" + test._id);
        } else {
            $("#login").modal('show');
        }
    }

    //todo data on page is not updating
    $scope.remove = function(test) {
        if ($scope.profile != undefined || $scope.profile.login != undefined) {
            Exam.remove( {courseId: $routeParams.courseId, examId: test._id} );
        } else {
            $("#login").modal('show');
        }
    }
}

function TestCtrl ($scope, $routeParams, $location, Exam, Question, Answer) {
    $scope.template = 'courses/tpl/exam-test.html';

    $scope.start = function (test) {
        if ($scope.profile != undefined || $scope.profile.login != undefined) {
            $location.path($location.path() + "/" + test._id);
        } else {
            $("#login").modal('show');
        }
    };

    Exam.query({ courseId: $routeParams.courseId, _id: $routeParams.examId }, function (test) {
        if ($scope.profile.login == undefined) {
            $("#login").modal('show');
        } else {
            $scope.test = test;
            Question.query({courseId: $routeParams.courseId, examId : $routeParams.examId }, function (questions) {
                $scope.questions = questions;
                $scope.quantityOfAnswers = questions.length;
            });
        }
    });

    $scope.back = function () {
        var path = $location.path(),
            to = path.lastIndexOf('/');
        $location.path(path.substring(0, to));
    };

    $scope.isItRadio = function (id) {
        return (id.qtype == "oneSelect");
    }

    $scope.isItCheckbox = function (id) {
        return (id.qtype == "manySelect");
    }

    $scope.isItInputText = function (id) {
        return (id.qtype === 'text');
    }

    $scope.isItRestoreOrder = function (id) {
        return (id.qtype === 'order');
    }

    $scope.submitTest = function () {
        var inputs = $('label.question > input');
        var selects = $('label.question > select');

        var temp = $.merge( inputs, selects );
        var listAnswers = new Array();
        for (var i = 0; i < $scope.quantityOfAnswers; i++) {
            listAnswers.push(new Array());
        }

        //select all marked fields
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].parentNode.parentNode.style.display != 'none') {
                if (temp[i].localName == "input") {
                    if ((temp[i].type == 'radio' || temp[i].type == 'checkbox') && temp[i].checked) {
                        listAnswers[temp[i].name.substr(temp[i].name.lastIndexOf(" ")+1)-1].push(temp[i].value);
                    }
                    if (temp[i].type == 'text') {
                        listAnswers[temp[i].name.substr(temp[i].name.lastIndexOf(" ")+1)-1].push(temp[i].value);
                    }
                }
                if (temp[i].localName == "select") {
                    listAnswers[temp[i].name.substr(temp[i].name.lastIndexOf(" ")+1)-1].push(temp[i].value);
                }
            }
        }

        //calculate score
        var score = 0;
        var point = 0;
        for (var i = 0; i < $scope.quantityOfAnswers; i++) {
            if (listAnswers[i].length == $scope.questions[i].answer.length) {
                for (var j = 0; j < listAnswers[i].length; j++) {
                    if (listAnswers[i][j] == $scope.questions[i].answer[j]) {
                        score += 100/($scope.quantityOfAnswers*listAnswers[i].length);
                    }
                }
            }
        }
        $scope.score = Number((score).toFixed(2));

        //forming exit answer string array
        var outputAnswers = new Array($scope.quantityOfAnswers);
        for (var i = 0; i < $scope.quantityOfAnswers; i++) {
            var outputString = new String();
            for (var j = 0; j < listAnswers[i].length; j++) {
                outputString += listAnswers[i][j]+" ";
            }
            outputAnswers[i] = outputString.trim();
        }

        //send data to server
        var newAnswer = new Answer({
            user: $scope.profile.login,
            courseId: $routeParams.courseId,
            examId: $routeParams.examId,
            date: new Date(),
            answers: outputAnswers,
            score: $scope.score
        });
        newAnswer.$save({ courseId: $routeParams.courseId, examId: $routeParams.examId }, function(err, data) {
            $('#result').modal('show');
        });
    }

    $scope.returnToExams = function () {
        $('#result').modal('hide');
        $scope.back();
    }
}

function ForumTopicsCtrl($scope, $routeParams, $location, $anchorScroll, $http, Topic) {
    $scope.template = 'courses/tpl/forum.html';

    $scope.creationEnabled = false;
    $scope.hashProcessed = false;
    $scope.current = {};
    $scope.new = {};
    $scope.edited = null;
    Topic.query({ courseId: $routeParams.courseId }, function (data) {
        $scope.topics = data.reverse();
    });

    //refresh every 3 minutes
    var refreshingInterval = setInterval(function () {
        Topic.query({ courseId: $routeParams.courseId }, function (data) {
            $scope.topics = data.reverse();
        });
    }, 180000);

    $scope.$on("$destroy", function () {
        $location.hash('');
        clearInterval(refreshingInterval);
    });

    $scope.loadNew = function (cb) {
        var path = 'api/courses/' + $routeParams.courseId +
            '/forum/offset/' + $scope.topics.length;
        $http.get(path).success(function (data) {
            for (var i = 0, len = data.length; i < len; i++) {
                $scope.topics.unshift(new Topic(data[i]));
            }

            if(typeof cb == 'function') {
                cb();
            }
        });
    };

    $scope.enableCreation = function () {
        $scope.creationEnabled = true;
    };

    $scope.disableCreation = function () {
        $scope.new = {};
        $scope.creationEnabled = false;
    };

    $scope.add = function () {
        var topic = new Topic($scope.new);
        topic.$save({ courseId: $routeParams.courseId }, function (data) {
            $scope.disableCreation();
            $scope.loadNew();
        });
    };

    $scope.isAuthor = function (item) {
        return !!($scope.profile &&
            item.author === $scope.profile.login);
    };

    $scope.isEditorEnabled = function (item) {
        return $scope.edited === item;
    };

    $scope.edit = function (item) {
        $scope.edited = item;
        if (item) {
            $scope.current.title = item.title;
        } else {
            $scope.current = {};
        }
    };

    $scope.update = function (item) {
        item.title = $scope.current.title;
        item.$update(function () {
            $scope.edit(null);
        });
    };

    $scope.delete = function (item) {
        $('#removalModal').modal('show')
            .find('.btn-danger')
            .unbind('click.remove')
            .bind('click.remove', function (e) {
                item.$remove(function () {
                    $scope.topics.splice($scope.topics.indexOf(item), 1);
                });
            });
    };

    $scope.view = function (item) {
        $location.path($location.path() + "/" + item._id);
    };

    $scope.changeHash = function (item) {
        $location.hash(item._id);
    };

    $scope.processHash = function () {
        if($scope.hashProcessed) {
            return;
        }
        $scope.hashProcessed = true;

        setTimeout(function () {
            $anchorScroll();
        }, 1);
        $anchorScroll();
    };
}

function ForumPostsCtrl($scope, $routeParams, $http, $location, $anchorScroll, Post, Topic) {
    $scope.template = 'courses/tpl/forum-topic.html';

    $scope.creationEnabled = false;
    $scope.hashProcessed = false;
    $scope.edited = null;
    $scope.new = {};
    $scope.current = {};
    $scope.posts = Post.query({
        topicId: $routeParams.topicId
    });
    $scope.topic = Topic.get({
        courseId: $routeParams.courseId,
        topicId: $routeParams.topicId
    });

    //refresh every 3 minutes
    var refreshingInterval = setInterval(function () {
        $scope.posts = Post.query({
            topicId: $routeParams.topicId
        });
    }, 180000);

    $scope.$on("$destroy", function () {
        $location.hash('');
        clearInterval(refreshingInterval);
    });

    $scope.$on("$includeContentLoaded", function () {
        $('#crArea').markItUp(MarkItUpSettings);
    });

    $scope.loadNew = function (cb) {
        var path = 'api/courses/_/forum/' + $routeParams.topicId +
            '/posts/offset/' + $scope.posts.length;
        $http.get(path).success(function (data) {
            for (var i = 0, len = data.length; i < len; i++) {
                $scope.posts.push(new Post(data[i]));
            }

            if(typeof cb == 'function') {
                cb();
            }
        });
    };

    $scope.enableCreation = function () {
        $scope.creationEnabled = true;
    };

    $scope.disableCreation = function () {
        $scope.new = {};
        $scope.creationEnabled = false;
    };

    $scope.isAuthor = function (item) {
        return !!($scope.profile &&
            item.author === $scope.profile.login);
    };

    $scope.isEditorEnabled = function (item) {
        return $scope.edited === item;
    };

    $scope.getTextArea = function (id) {
        return $('#' + id + ' textarea');
    };

    $scope.edit = function (item) {
        if ($scope.edited) {
            $scope.getTextArea($scope.edited._id).markItUpRemove();
        }

        $scope.edited = item;
        if (item) {
            $scope.getTextArea(item._id).markItUp(MarkItUpSettings);
            $scope.current.body = item.body;
        } else {
            $scope.current = {};
        }
    };

    $scope.add = function () {
        //Model value update
        $scope.new.body = $('#crArea').val();

        var post = new Post($scope.new);
        post.$save({
            topicId: $routeParams.topicId
        }, function (data) {
            $scope.disableCreation();
            $scope.loadNew(function () {
                $("html, body").stop().animate({ scrollTop: $(document).height() }, 500);
            });
        });
    };

    $scope.update = function (item) {
        //Model value update
        item.body = $scope.current.body = $('.item#' + item._id + ' textarea').val();

        item.$update(function () {
            $scope.edit(null);
        });
    };

    $scope.delete = function (item) {
        $('#removalModal').modal('show')
            .find('.btn-danger')
            .unbind('click.remove')
            .bind('click.remove', function () {
                item.$remove(function () {
                    $scope.posts.splice($scope.posts.indexOf(item), 1);
                });
            });
    };

    $scope.isStarred = function (item) {
        return !!($scope.profile &&
            item.stars.indexOf($scope.profile.login) !== -1);
    };

    $scope.toggleStar = function (item) {
        if (!$scope.isAuth()) {
            return;
        }

        if (!$scope.isAuthor(item)) {
            if (!$scope.isStarred(item)) {
                item.$star();
            } else {
                item.$unstar();
            }
        }
    };

    $scope.reply = function (item) {
        $scope.new.body = '[quote=' + item.author + ']' + item.body + '[/quote]';
        $("html, body").stop().animate({ scrollTop: 0 }, 500);
        $scope.enableCreation();
    };

    $scope.changeHash = function (item) {
        $location.hash(item._id);
    };

    $scope.processHash = function () {
        if($scope.hashProcessed) {
            return;
        }
        $scope.hashProcessed = true;

        setTimeout(function () {
            $anchorScroll();
        }, 1);
        $anchorScroll();
    };

    $scope.back = function () {
        var path = $location.path(),
            to = path.lastIndexOf('/');
        $location.path(path.substring(0, to));
    };

    $scope.parseBody = function (body) {
        var search = [
            /\[b\](.*?)\[\/b\]/gi,
            /\[i\](.*?)\[\/i\]/gi,
            /\[u\](.*?)\[\/u\]/gi,
            /\[img\](.*?)\[\/img\]/gi,
            /\[url\="?(.*?)"?\](.*?)\[\/url\]/gi,
            /\[code]([\s\S]*?)\[\/code\]/gi,
            /\[quote]([\s\S]*?)\[\/quote\]/gi,
            /\[quote\=(.*?)\]([\s\S]*?)\[\/quote\]/gi,
            /\[list\=(.*?)\]([\s\S]*?)\[\/list\]/gi,
            /\[list\]([\s\S]*?)\[\/list\]/gi,
            /\[\*\]\s?(.*?)\n/gi
        ];

        var replace = [
            '<b>$1</b>',
            '<i>$1</i>',
            '<u>$1</u>',
            '<img src="$1" style="max-width: 400px;" alt="">',
            '<a target="_blank" href="$1">$2</a>',
            '<pre>$1</pre>',
            '<blockquote>$1</blockquote>',
            '<blockquote><i>$1 написал:</i><br><br>$2</blockquote>',
            '<ol start="$1">$2</ol>',
            '<ul>$1</ul>',
            '<li>$1</li>'
        ];

        var parsedBody;
        do {
            parsedBody = body;
            for (var i = 0; i < search.length; i++) {
                body = body.replace(search[i], replace[i]);
            }
        } while (body != parsedBody);

        return body;
    };
}

function ProgressCtrl($scope, $http, $routeParams, Courses, Answer, Exam) {
    $scope.template = 'courses/tpl/progress.html';
    $scope.course = Courses.get({courseId: $routeParams.courseId}, function () {});

    $scope.isLoggedIn = function () {
        return $scope.profile != undefined || $scope.profile.login != undefined;
    }

    $scope.isNotLoggedIn = function () {
        return $scope.profile == undefined || $scope.profile.login == undefined;
    }

    $scope.isModerator = function () {
        return (!!($scope.course.moderators &&
            $scope.course.moderators.indexOf($scope.profile.login) >= 0))
    };

    Exam.query( {courseId: $routeParams.courseId }, function(exams) {
        $http({
            "method" : "GET",
            "url" : "api/courses/" + $routeParams.courseId + "/progress"
        }).success(function(answers){
            var raw = answers;
            for (var i = 0; i < raw.length; i++) {
                for (var j = 0; j < exams.length; j++) {
                    if (raw[i].examId == exams[j]._id) {
                        raw[i].examId = exams[j].title;
                        break;
                    }
                }
            }
            $scope.milestones = raw;
        });
    });

    //todo doesn't used now
    $scope.del = function (answer) {
        var index = $scope.milestones.indexOf(answer);
        var scope = this;
        Answer.remove({_id: $scope.milestones[index]._id}, function () {
            scope.destroy(function () {
                $scope.milestones.splice(index, 1);
            });
        });
    };
}

function OntologyCtrl($scope) {
    $scope.template = 'courses/tpl/ontology.html';
}

function VideoCtrl($scope, $routeParams, $http){
    $scope.template = 'courses/tpl/video.html';
    $scope.videoId = $routeParams.videoId;

    var courseId = $routeParams.courseId;
    $scope.courseId = courseId;

    $http(
        {
            "method": "GET",
            "url" : "courses/" + courseId + "/video/" + $scope.videoId +".json"
        }
    ).success(function(data, status){
            $scope.name = data[0].name;
        });

    $scope.path = 'courses/' + $routeParams.courseId + '/video/' + $scope.videoId + ".json";
    $scope.frameSrc = "video/videoCnt.html";

}