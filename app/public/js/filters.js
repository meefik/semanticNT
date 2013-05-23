'use strict';

/* Filters */

angular.module('app.filters', [])
    .filter('checkmark', function () {
        return function (input) {
            return input ? '\u2713' : '\u2718';
        };
    })
    .filter('isStatus', function () {
        return function (input, courses) {
            var out = [];
            if (courses) {
                for (var i = 0; i < input.length; i++) {
                    for (var j = 0; j < courses.length; j++) {
                        if (input[i].id === courses[j]) {
                            out.push(input[i]);
                            break;
                        }
                    }
                }
            }
            return out;
        };
    })
    .filter('dateToText', function () {
        return function (dateString, format) {
            var d = new Date(dateString);
            var day = function (d) {
                return d.getDate();
            };
            var month = function (d) {
                var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
                return months[d.getMonth()];
            };
            var year = function (d) {
                return d.getFullYear();
            };
            var time = function (d) {
                var hh = d.getHours();
                var mm = d.getMinutes();
                var ss = d.getSeconds();
                if (hh < 10) {
                    hh = "0" + hh;
                }
                if (mm < 10) {
                    mm = "0" + mm;
                }
                if (ss < 10) {
                    ss = "0" + ss;
                }
                return hh + ":" + mm + ":" + ss;
            };
            var date = function (d) {
                return day(d) + " " + month(d) + " " + year(d) + " г. ";
            };
            switch (format) {
                case 'day':
                    return day(d);
                case 'month':
                    return month(d);
                case 'year':
                    return year(d);
                case 'time':
                    return time(d);
                case 'date':
                    return date(d);
                default:
                    return date(d) + " " + time(d);
            }
        };
    });
