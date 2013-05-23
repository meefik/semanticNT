'use strict';

/* Directives */

angular.module('app.directives', [])
    .directive("repeatPassword", function () {
        return {
            require: "ngModel",
            link: function (scope, elem, attrs, ctrl) {
                var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

                ctrl.$parsers.push(function (value) {
                    if (value === otherInput.$viewValue) {
                        ctrl.$setValidity("repeat", true);
                        return value;
                    }
                    ctrl.$setValidity("repeat", false);
                });

                otherInput.$parsers.push(function (value) {
                    ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                    return value;
                });
            }
        };
    })
    .directive("login", function () {
        var isValid = function (s) {
            return s && /^[a-zA-Z0-9]+$/.test(s);
        };
        return {
            require: "ngModel",
            link: function (scope, elm, attrs, ctrl) {

                ctrl.$parsers.push(function (value) {
                    ctrl.$setValidity("login", isValid(value));
                    return value;
                });

            }
        };
    })
    .directive('fadey', function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                var duration = parseInt(attrs.fadey);
                if (isNaN(duration)) {
                    duration = 500;
                }
                elm = jQuery(elm);
                elm.hide();
                elm.fadeIn(duration, function () {
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });

                scope.destroy = function (complete) {
                    elm.fadeOut(duration, function () {
                        if (complete) {
                            scope.$apply(complete);
                        }
                    });
                };
            }
        };
    })
    .directive('compile', function ($compile) {
        // directive factory creates a link function
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    })
    .directive('stopBubbling', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind(attr.stopBubbling, function (e) {
                    e.stopPropagation();
                });
            }
        }
    });
