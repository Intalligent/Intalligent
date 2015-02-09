'use strict';

/* Filters */
angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);

app.filter('getByValue', function() {
    return function(input, value) {
        if (!input) return null;
        for (var i = 0 ; i < input.length; i++ ) {
            if (input[i].value == value) {
                return input[i];
            }
        }
        return null;
    }
});

app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});
