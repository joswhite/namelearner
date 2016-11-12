angular.module('app')
    .filter('firstName', function() {
        return function(name) {
            return name.split(/\s+/)[0];
        }
    })
    .filter('lastName', function() {
        return function(name) {
            return name.split(/\s+/).slice(1).join(' ');
        }
    });