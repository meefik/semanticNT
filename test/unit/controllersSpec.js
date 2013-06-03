'use strict';

/* jasmine specs for controllers go here */

describe('openITMO controllers', function () {

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    beforeEach(module('app.services'));

    it('should have a ForumTopicsCtrl', function () {
        expect(ForumTopicsCtrl).not.toEqual(null);
    });

    it('should have a ForumPostsCtrl', function () {
        expect(ForumPostsCtrl).not.toEqual(null);
    });

    describe('ForumTopicsCtrl', function () {
        var scope, ctrl, httpBackend, location, topicsUrl,
            topics = [
                { title: "Title1", date: "2012-12-19T06:01:17.171Z", author: "author1",
                    courseid: "CS0001", _id: "507f1f77bcf86cd799439011" },
                { title: "Title2", date: "2012-12-19T06:01:17.171Z", author: "author2",
                    courseid: "CS0001", _id: "507f1f77bcf86cd799439012" }
            ];

        beforeEach(inject(function ($httpBackend, $rootScope, $compile, $location, $routeParams, $controller) {
            location = $location;
            $routeParams.courseId = 'CS0001';
            topicsUrl = 'api/courses/' + $routeParams.courseId + '/forum';

            httpBackend = $httpBackend;
            httpBackend.whenGET(topicsUrl)
                .respond(topics);

            scope = $rootScope.$new();
            scope.profile = { login: "author1" };

            ctrl = $controller(ForumTopicsCtrl, { $scope: scope });

            httpBackend.flush();
        }));

        it('should get and reverse topics list at the beginning', function () {
            expect(scope.topics).toEqualData(topics.reverse());
        });

        it('should process hash on calling hashProcessed', function () {
            expect(scope.hashProcessed).toBe(false);
            scope.processHash();
            expect(scope.hashProcessed).toBe(true);
        });

        it('should determinate whether the user is the author', function () {
            expect(scope.isAuthor(scope.topics[0])).toBe(true);
            expect(scope.isAuthor(scope.topics[1])).toBe(false);
        });

        it('should provide the ability to add new topic and load all new topics after adding', function () {
            expect(scope.creationEnabled).toBe(false);
            expect(scope.new).toEqual({});

            scope.enableCreation();
            expect(scope.creationEnabled).toBe(true);

            //create new topics
            scope.new = { title: "New topic added by me" };
            topics.push({ title: scope.new.title, author: "author1",
                date: "2012-12-19T06:01:17.171Z",
                courseid: "CS0001", _id: "507f1f77bcf86cd799439013" });
            topics.push({ title: "New topic added by another", author: "author2",
                date: "2012-12-19T06:01:17.171Z",
                courseid: "CS0001", _id: "507f1f77bcf86cd799439014" });

            //add new one and get new ones
            httpBackend.expectPOST(topicsUrl)
                .respond(topics[scope.topics.length]);
            httpBackend.expectGET(topicsUrl + '/offset/' + scope.topics.length)
                .respond(topics.slice(scope.topics.length));
            scope.add();
            httpBackend.flush();

            expect(scope.new).toEqual({});
            expect(scope.creationEnabled).toBe(false);
            expect(scope.topics).toEqualData(topics.reverse());
        });

        it('should provide the ability to edit topics', function () {
            var newTitle = "New title";

            expect(scope.current).toEqual({});
            expect(scope.edited).toBe(null);

            //edit first topic
            scope.edit(scope.topics[0]);
            expect(scope.current.title).toBe(scope.topics[0].title);
            scope.current.title = newTitle;

            //then switch to another
            scope.edit(scope.topics[1]);
            expect(scope.edited).toBe(scope.topics[1]);
            expect(scope.current.title).toBe(scope.topics[1].title);
            scope.current.title = newTitle;

            //save changes it
            httpBackend.expectPUT(topicsUrl + "/" + scope.edited._id)
                .respond({
                    title: scope.current.title,
                    author: scope.edited.author,
                    date: scope.edited.date,
                    courseid: scope.edited.courseid,
                    _id: scope.edited._id
                });
            scope.update(scope.edited);
            httpBackend.flush();

            expect(scope.topics[1].title).toBe(newTitle);
            expect(scope.edited).toBe(null);
            expect(scope.current).toEqual({});
        });

        it('should not remove topic immediately', function () {
            var topic = scope.topics[1],
                count = scope.topics.length;

            //there should not be any unhandled requests
            scope.delete(scope.topics[1]);

            expect(topic).toBeDefined();
            expect(scope.topics.length).toBe(count);
        });

        it('should have the anchor navigation', function () {
            var topic;

            topic = scope.topics[1];
            expect(location.hash()).toBe('');
            scope.changeHash(topic);
            expect(location.hash()).toBe(topic._id);

            topic = scope.topics[0];
            scope.changeHash(topic);
            expect(location.hash()).toBe(topic._id);

        });

        it('should open topics', function () {
            var topic = scope.topics[1];

            expect(location.path()).toBe('');
            scope.view(topic);
            expect(location.path()).toBe('/' + topic._id);
        });
    });

    describe('ForumPostsCtrl', function () {
        var scope, ctrl, httpBackend, location, routeParams, postsUrl, topicUrl,
            topic = { title: "Topic", date: "2012-12-19T06:01:17.171Z", author: "author1",
                courseid: "CS0001", _id: "508f1f77bcf86cd8064320101" },
            posts = [
                { body: "Some text with [b][i]bb tags[/i][/b]", date: "2012-12-19T06:01:17.171Z", author: "author1",
                    stars: [],
                    topic: "508f1f77bcf86cd8064320101", _id: "507f1f77bcf86cd799439011" },
                { body: "Some text with [b][i]bb tags[/i][/b]", date: "2012-12-19T06:01:17.171Z", author: "author2",
                    stars: [],
                    topic: "508f1f77bcf86cd8064320101", _id: "507f1f77bcf86cd799439012" }
            ];

        beforeEach(inject(function ($httpBackend, $rootScope, $location, $routeParams, $controller) {
            location = $location;
            routeParams = $routeParams;
            routeParams.courseId = 'CS0001';
            routeParams.topicId = '508f1f77bcf86cd8064320101';
            topicUrl = 'api/courses/' + routeParams.courseId + '/forum/' + routeParams.topicId;
            postsUrl = 'api/courses/_/forum/' + routeParams.topicId + '/posts';

            httpBackend = $httpBackend;
            httpBackend.whenGET(topicUrl)
                .respond(topic);
            httpBackend.whenGET(postsUrl)
                .respond(posts);

            scope = $rootScope.$new();
            scope.profile = { login: "author1" };
            scope.isAuth = function () {
                return true;
            };

            ctrl = $controller(ForumPostsCtrl, { $scope: scope });

            httpBackend.flush();
        }));

        it('should get topic data at the beginning', function () {
            expect(scope.topic).toEqualData(topic);
        });

        it('should get posts of the topic at the beginning', function () {
            expect(scope.posts).toEqualData(posts);
        });

        it('should process hash on calling hashProcessed', function () {
            expect(scope.hashProcessed).toEqualData(false);
            scope.processHash();
            expect(scope.hashProcessed).toEqualData(true);
        });

        it('should determinate whether the user is the author', function () {
            expect(scope.isAuthor(scope.posts[0])).toBe(true);
            expect(scope.isAuthor(scope.posts[1])).toBe(false);
        });

        it('should provide the ability to add new post and load all new posts after adding', function () {
            expect(scope.creationEnabled).toBe(false);
            expect(scope.new).toEqual({});

            scope.enableCreation();
            expect(scope.creationEnabled).toBe(true);

            //create new posts
            scope.new = { body: "New post added by me" };
            posts.push({ title: scope.new.body, author: "author1",
                date: "2012-12-19T06:01:17.171Z",
                topic: routeParams.topicId, _id: "507f1f77bcf86cd799439013" });
            posts.push({ title: "New topic added by another", author: "author2",
                date: "2012-12-19T06:01:17.171Z",
                topic: routeParams.topicId, _id: "507f1f77bcf86cd799439014" });

            //add new one and get new ones
            httpBackend.expectPOST(postsUrl)
                .respond(posts[scope.posts.length]);
            httpBackend.expectGET(postsUrl + '/offset/' + scope.posts.length)
                .respond(posts.slice(scope.posts.length));
            scope.add();
            httpBackend.flush();

            expect(scope.new).toEqual({});
            expect(scope.creationEnabled).toBe(false);
            expect(scope.posts).toEqualData(posts);
        });

        it('should provide the ability to edit posts', function () {
            var newBody = "New post";

            expect(scope.current).toEqual({});
            expect(scope.edited).toBe(null);

            //edit first post
            scope.edit(scope.posts[0]);
            expect(scope.current.body).toBe(scope.posts[0].body);
            scope.current.body = newBody;

            //then switch to another
            scope.edit(scope.posts[1]);
            expect(scope.edited).toBe(scope.posts[1]);
            expect(scope.current.body).toBe(scope.posts[1].body);
            scope.current.body = newBody;

            //save changes it
            httpBackend.expectPUT(postsUrl + "/" + scope.edited._id)
                .respond({
                    body: scope.current.body,
                    author: scope.edited.author,
                    date: scope.edited.date,
                    topic: scope.edited.topic,
                    _id: scope.edited._id
                });
            scope.update(scope.edited);
            httpBackend.flush();

            expect(scope.posts[1].body).toBe(newBody);
            expect(scope.edited).toBe(null);
            expect(scope.current).toEqual({});
        });

        it('should not remove post immediately', function () {
            var post = scope.posts[1],
                count = scope.posts.length;

            //there should not be any unhandled requests
            scope.delete(scope.posts[1]);

            expect(post).toBeDefined();
            expect(scope.posts.length).toBe(count);
        });

        it('should have the anchor navigation', function () {
            var post;

            post = scope.posts[1];
            expect(location.hash()).toBe('');
            scope.changeHash(post);
            expect(location.hash()).toBe(post._id);

            post = scope.posts[0];
            scope.changeHash(post);
            expect(location.hash()).toBe(post._id);
        });

        it('should parse bb tags correctly', function () {
            var before = [
                '[b][i][u]Bold[/u][/i][/b]',
                '[img]http://anyimagelink[/img]',
                '[url=http://anylink]Click[/url]',
                '[code]Code[/code]',
                '[quote]Quote[quote]Quote in quote[/quote][/quote]',
                '[quote=author]Quote[quote]Quote in quote[/quote][/quote]',
                '[list=1][*] Item\n[/list]',
                '[list][*] Item\n[/list]'
            ];

            var after = [
                '<b><i><u>Bold</u></i></b>',
                '<img src="http://anyimagelink" style="max-width: 400px;" alt="">',
                '<a target="_blank" href="http://anylink">Click</a>',
                '<pre>Code</pre>',
                '<blockquote>Quote<blockquote>Quote in quote</blockquote></blockquote>',
                '<blockquote><i>author написал:</i><br><br>Quote<blockquote>Quote in quote</blockquote></blockquote>',
                '<ol start="1"><li>Item</li></ol>',
                '<ul><li>Item</li></ul>'
            ];

            for (var i = 0, len = before.length; i < len; i++) {
                expect(scope.parseBody(before[i])).toBe(after[i]);
            }
        });

        it('should have the ability to reply on messages', function () {
            var post = scope.posts[1];

            expect(scope.creationEnabled).toBe(false);
            expect(scope.new).toEqual({});

            scope.reply(post);

            expect(scope.creationEnabled).toBe(true);
            expect(scope.new.body).toBe('[quote=' + post.author + ']' + post.body + '[/quote]');
        });

        it('should have the ability to star and unstar posts', function () {
            var post = scope.posts[1];

            //star post
            httpBackend.expectPOST(postsUrl + '/' + post._id + '/star')
                .respond({
                    body: post.body,
                    author: post.author,
                    date: post.date,
                    topic: post.topic,
                    _id: post._id,
                    stars: [scope.profile.login]
                });
            scope.toggleStar(post);
            httpBackend.flush();

            expect(post.stars).toEqual([scope.profile.login]);

            //unstar post
            httpBackend.expectDELETE(postsUrl + '/' + post._id + '/star')
                .respond({
                    body: post.body,
                    author: post.author,
                    date: post.date,
                    topic: post.topic,
                    _id: post._id,
                    stars: []
                });
            scope.toggleStar(post);
            httpBackend.flush();

            expect(post.stars).toEqual([]);
        });
    });
});
