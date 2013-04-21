'use strict';

/* Directives */

angular.module('app.directives', [])
        .directive("repeatPassword", function() {
    return {
        require: "ngModel",
        link: function(scope, elem, attrs, ctrl) {
            var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

            ctrl.$parsers.push(function(value) {
                if (value === otherInput.$viewValue) {
                    ctrl.$setValidity("repeat", true);
                    return value;
                }
                ctrl.$setValidity("repeat", false);
            });

            otherInput.$parsers.push(function(value) {
                ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                return value;
            });
        }
    };
})
.directive("login", function() {
    var isValid = function(s) {
        return s && /^[a-zA-Z0-9]+$/.test(s);
    };
    return {
        require: "ngModel",
        link: function(scope, elm, attrs, ctrl) {

            ctrl.$parsers.push(function(value) {
                ctrl.$setValidity("login", isValid(value));
                return value;
            });

        }
    };
});