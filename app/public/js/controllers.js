'use strict';

/* Controllers */

function AppCtrl($rootScope, $scope, $location, $http, $cookieStore, Profile, Rating) {

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
    
    $scope.setLike = function (likeid) {
        var liked = $('#'+likeid).attr('class');
        $('#'+likeid).toggleClass('likeup');
        var count = $('#' + likeid).find('.counter').html();
        console.log(liked);
        if (liked.indexOf('likeup') > -1) {
            (new Rating({likeid: likeid})).$unlike();
            count--;
        } else {
            (new Rating({likeid: likeid})).$like();
            count++;
        }
        if (count < 1) count = '';
        $('#' + likeid).find('.counter').html(count);
    };
    
    $scope.isLiked = function(likeid) {
        setTimeout(function() {
            var data = Rating.get({likeId: likeid}, function() {
                if (data.liked) {
                    $('#' + likeid).toggleClass('likeup');
                }
                if (data.count > 0) {
                    $('#' + likeid).find('.counter').html(data.count);
                }
            });
        }, 1000);
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

function ExamCtrl($scope, $location, $routeParams, $http, Exam, Question, Answer) {
    $scope.template = 'courses/tpl/exam.html';

    var loadFromJsonToDb = function() {
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
                                hint:  questions[j].hint,
                                variants: questions[j].variants,
                                examId: exam._id
                            });
                            newQuestion.$save({courseId: $routeParams.courseId, examId: exam._id });
                        }
                    });
                }

            });
    }

    $scope.isNotLoggedIn = function () {
        return $scope.profile == undefined || $scope.profile.login == undefined;
    }

    $scope.isModerator = function () {
        return !!($scope.course.moderators &&
            $scope.course.moderators.indexOf($scope.profile.login) >= 0)
    };

    $scope.isExhausted = function (counts) {
        return counts >= 3;
    }

    $scope.isSuccess = function (test) {
        var threshold = 60;
        var successes = 0;
        for (var i = 0; i < $scope.progress.length; i++) {
            if ($scope.progress[i].examId == test._id) {
                successes += $scope.progress[i].score >= threshold ? 1 : 0;
            }
        }
        return successes > 0;
    }

    Exam.query({ courseId: $routeParams.courseId }, function (data) {
        if (data.length == 0) {
            loadFromJsonToDb();
            $("#refresh").modal('show');
        }
        $scope.exam = data;
    });

    $http({
        "method": "GET",
        "url" : "/api/courses/" + $routeParams.courseId + "/answers/user/" + $scope.profile.login
    }).success(function(progress, status){
        $scope.progress = progress;
    });


    $scope.tries = function(test) {
        var count = 0;
        for (var i = 0; i < $scope.progress.length; i++) {
            if ($scope.progress[i].examId == test._id) {
                count++;
            }
        }
        return count;
    }

    $scope.start = function (test) {
        if ($scope.profile != undefined || $scope.profile.login != undefined) {
            $location.path($location.path() + "/" + test._id);
        } else {
            $("#login").modal('show');
        }
    }

    $scope.remove = function(test) {
        if ($scope.profile != undefined || $scope.profile.login != undefined) {
            Exam.remove(
                {courseId: $routeParams.courseId, examId: test._id},
                function (data) {
                    $scope.exam.splice($scope.exam.indexOf(test), 1);
                });
        } else {
            $("#login").modal('show');
        }
    }
}

function TestCtrl ($scope, $routeParams, $location, Exam, Question, Answer) {
    $scope.template = 'courses/tpl/exam-test.html';

    var shuffle = function shuffle(o){
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    var populateBooleanArray = function(l) {
        var tmp = new Array(l);
        for (var i = 0; i < l; i++) {
            tmp[i] = false;
        }
        return tmp;
    }

    Exam.get({ courseId: $routeParams.courseId, examId: $routeParams.examId }, function (test) {
        if ($scope.profile.login == undefined) {
            $("#login").modal('show');
        } else {
            $scope.test = test;
            $scope.isLate = new Date(test.deadline) < new Date();
        }
    });

    Question.query({courseId: $routeParams.courseId, examId : $routeParams.examId }, function (questions) {
        $scope.questions = new Array();
        var question;
        for (var i = 0; i < questions.length; i++) {
            question = questions[i];
            question.variants = shuffle(question.variants);
            $scope.questions.push(question);
        }
        $scope.hints = populateBooleanArray(questions.length);
        $scope.quantityOfQuestions = questions.length;
    });

    $scope.back = function () {
        var path = $location.path(),
            to = path.lastIndexOf('/');
        $location.path(path.substring(0, to));
    };

    $scope.registerHint = function(question) {
        $scope.hints[$scope.questions.indexOf(question)] = true;
    }

    $scope.isHintShowed = function(question) {
        return $scope.hints[$scope.questions.indexOf(question)];
    }

    $scope.hintClass = function(question) {
        return $scope.hints[$scope.questions.indexOf(question)] ? "" : "hidden";
    }

    $scope.isItRadio = function (id) {
        return (id.qtype == "radio");
    }

    $scope.isItCheckbox = function (id) {
        return (id.qtype == "checkbox");
    }

    $scope.isItInputText = function (id) {
        return (id.qtype == "text");
    }

    $scope.isItRestoreOrder = function (id) {
        return (id.qtype == "order");
    }

    $scope.remove = function (question) {
        Question.remove({courseId: $routeParams, examId: question.examId, questionId: question._id},
            function () {
                $scope.questions.splice($scope.questions.indexOf(question), 1);
            });
    }

    $scope.edit = function () {
        //todo ever write
    }

    $scope.submitTest = function () {
        var inputs = $('label.question > input:visible');
        var selects = $('label.question > select:visible');

        var temp = $.merge( inputs, selects );

        var listAnswers = new Array();

        //select all marked fields
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].parentNode.parentNode.style.display != 'none') {
                if (temp[i].localName == "input") {
                    if ((temp[i].type == 'radio' || temp[i].type == 'checkbox') && temp[i].checked) {
                        if (listAnswers[temp[i].name] == undefined) {
                            listAnswers[temp[i].name] = new Array();
                        }
                        listAnswers[temp[i].name].push(temp[i].value);
                    }
                    if (temp[i].type == 'text') {
                        if (listAnswers[temp[i].name] == undefined) {
                            listAnswers[temp[i].name] = new Array();
                        }
                        listAnswers[temp[i].name].push(temp[i].value);
                    }
                }
                if (temp[i].localName == "select") {
                    if (listAnswers[temp[i].name] == undefined) {
                        listAnswers[temp[i].name] = new Array();
                    }
                    listAnswers[temp[i].name].push(temp[i].value);
                }
            }
        }

        //calculate score
        var score = 0;
        var point = 0;
        for (var i = 0; i < $scope.questions.length; i++) {
            var questionName = $scope.questions[i].name;
            var quantityOfRightAnswers = $scope.questions[i].answer.length;
            var quantityOfUserAnswers = (listAnswers[questionName] == undefined) ? -1 : listAnswers[questionName].length;
            for (var j = 0; j < quantityOfUserAnswers; j++) {
                var multiplier = $scope.hints[i] ? 1.25 : 1;
                if ($scope.questions[i].qtype == "order") {
                    if (listAnswers[questionName][j] == $scope.questions[i].answer[j]) {
                        score += 100/($scope.quantityOfQuestions*quantityOfRightAnswers*multiplier);
                    }
                } else {
                    if ($.inArray(listAnswers[questionName][j],$scope.questions[i].answer) >= 0) {
                        score += 100/($scope.quantityOfQuestions*quantityOfRightAnswers*multiplier);
                    }
                }
            }
        }
        $scope.score = Number((score).toFixed(2));

        //forming exit answer string array
        var outputAnswers = new Array($scope.quantityOfQuestions);
        for (var i = 0; i < $scope.quantityOfQuestions; i++) {
            var questionName = $scope.questions[i].name;
            var outputString = $scope.questions[i].id+ ":";
            if (listAnswers[questionName] == undefined) continue;
            for (var j = 0; j < listAnswers[questionName].length; j++) {
                outputString += listAnswers[questionName][j]+" ";
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
            hints: $scope.hints,
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

function ProgressCtrl($scope, $http, $routeParams, Courses, Answer, Exam, $location) {
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
        var url;
        if ($scope.isModerator() ) {
            url = "api/courses/" + $routeParams.courseId + "/answers";
        } else {
            url = "api/courses/" + $routeParams.courseId + "/answers/user/" + $scope.profile.login;
        }
        $http({
            "method" : "GET",
            "url" : url
        }).success(function(answers){
            var raw = answers;
            for (var i = 0; i < raw.length; i++) {
                for (var j = 0; j < exams.length; j++) {
                    if (raw[i].examId == exams[j]._id) {
                        Object.defineProperty(raw[i],"title",{ value : exams[j].title });
                        break;
                    }
                }
            }
            $scope.milestones = raw;
        });
    });

    $scope.protocol = function(answer) {
        if ($scope.profile != undefined || $scope.profile.login != undefined) {
            $location.path($location.path() + "/" + answer.examId + "/" + answer._id);
        } else {
            $("#login").modal('show');
        }
    }

    $scope.deleteInactual = function() {
        for (var i = 0; $scope.milestones.length; i++) {
            if ($scope.milestones[i].title == undefined) {
                $scope.del($scope.milestones[i]);
            }
        }
    }

    $scope.deleteAll = function() {
        for (var i =0; $scope.milestones.length; i++) {
            $scope.del($scope.milestones[i]);
        }
    }

    $scope.del = function (answer) {
        var index = $scope.milestones.indexOf(answer);
        $http.delete("/api/courses/" + $routeParams.courseId + "/answers/" + $scope.milestones[index]._id)
            .success(function() {
                $scope.milestones.splice(index, 1);
        });
    };
}

function ProtocolCtrl($scope, $routeParams, $http, $location, Answer, Exam, Question) {
    $scope.template = 'courses/tpl/protocol.html';

    var shuffle = function shuffle(o){
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    var getQuestionById = function (id) {
        for (var i = 0; i < $scope.questions.length; i++) {
            if ($scope.questions[i].id == id) return $scope.questions[i];
        }
        return null;
    }

    var getAnswersByQuestionId = function(id) {
        for (var i = 0; i < $scope.answer.answers.length; i++) {
            if ($scope.answer.answers[i] == null) continue;
            var record = $scope.answer.answers[i].split(":");
            if (record[0] == id) {
                return (record[1].lastIndexOf(" ") > 0) ? record[1].split(" ") : record[1];
            }
        }
    }

    $http.get("/api/courses/" + $routeParams.courseId + "/answers/"+$routeParams.answerId)
        .success(function(answer) {
            if ($scope.profile.login == undefined) {
                $("#login").modal('show');
            } else {
                $scope.answer = answer[0];
                $scope.hints = answer[0].hints
                Exam.get({ courseId: $routeParams.courseId, examId: $routeParams.examId }, function (test) {
                    $scope.test = test;
                });
            }
        });

    Question.query({courseId: $routeParams.courseId, examId : $routeParams.examId }, function (questions) {
        $scope.questions = new Array();
        var question;
        for (var i = 0; i < questions.length; i++) {
            question = questions[i];
            question.variants = shuffle(question.variants);
            $scope.questions.push(question);
        }
    });

    $scope.back = function () {
        var path = $location.path(),
            to = path.lastIndexOf('/');
            path = path.substring(0, to);
            to = path.lastIndexOf('/');
        $location.path(path.substring(0, to));
    };

    $scope.hintClass = function(question) {
        return ($scope.hints != undefined && $scope.hints[$scope.questions.indexOf(question)]) ? "" : "hidden";
    }

    $scope.isItRadio = function (id) {
        return (id.qtype == "radio");
    }

    $scope.isItCheckbox = function (id) {
        return (id.qtype == "checkbox");
    }

    $scope.isItInputText = function (id) {
        return (id.qtype == "text");
    }

    $scope.isItRestoreOrder = function (id) {
        return (id.qtype == "order");
    }

    $scope.icon = function (question,item) {
        if ((question.qtype  == "radio" || question.qtype  == "checkbox") && $scope.isChecked(question,item)) {
            return ($.inArray(item.variantId,question.answer) >= 0) ? "icon-ok" : "icon-remove";
        }
        if (question.qtype == "text") {
            var value = $("#" + question.id + " label.question > input:visible")[0].value;
            return ($.inArray(value,question.answer) >= 0) ? "icon-ok" : "icon-remove";
        }
        if (question.qtype == "order") {
            if ($("#" + item._id)[0] != undefined) {
                var index = $("#" + item._id)[0].innerText.substr(0,$("#" + item._id)[0].innerText.lastIndexOf("."))-1;
                var value = $("#" + item._id)[0].parentNode.children[1].value
                return (value == question.answer[index]) ? "icon-ok" : "icon-remove";
            }
        }
    }

    $scope.isChecked = function (question,item) {
        if (question.qtype  == "radio") {
            var answers = getAnswersByQuestionId(question.id);
            return item.variantId == answers;
        }
        if (question.qtype == "checkbox") {
            var answers = getAnswersByQuestionId(question.id);
            if (typeof answers == "string") {
                return item.variantId == answers;
            }
            if (typeof answers == "object") {
                return ($.inArray(item.variantId,answers) >= 0);
            }
        }
    }

    $scope.setValue = function (question) {
        if (question.qtype == "text") {
            var field = $("#" + question.id + " label.question > input:visible")[0];
            field.value = getAnswersByQuestionId(question.id);
        }
        if (question.qtype == "order") {
            var fields = $("#" + question.id + " label.question > select:visible");
            for (var i = 0; i < fields.length; i++) {
                fields[i].value = getAnswersByQuestionId(question.id)[i];
            }
        }
    }

    $scope.markVariants = function() {
        var inputs = $('label.question > input:visible');
        var selects = $('label.question > select:visible');

        var fields = $.merge( inputs, selects );

        for (var i = 0; i < fields.length; i++) {
            if (fields[i].localName == "input") {
                var id = fields[i].parentNode.parentNode.parentNode.id;
                if (fields[i].type == 'radio' || fields[i].type == 'checkbox') {
                    var answers = getAnswersByQuestionId(id);
                    if ($.inArray(fields[i].value,answers) >= 0) {
                        fields[i].checked = true;
                    }
                }
                if (fields[i].type == 'text') {
                    var answers = getAnswersByQuestionId(id);
                    if ($.inArray(fields[i].value,answers) >= 0) {
                        fields[i].value = answers;
                    }
                }
            }
            if (fields[i].localName == "select") {
                var id = fields[i].parentNode.parentNode.parentNode.id;
                var answers = getAnswersByQuestionId(id);
                //todo make it
                if ($.inArray(fields[i].value,answers) >= 0) {
                    fields[i].value = true;
                }
            }
        }
    }
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