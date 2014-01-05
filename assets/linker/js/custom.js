(function (io) {
    var socket = io.connect();
    socket.on('connect', function socketConnected () {

        log(
            'Socket is now connected !'
        );
        socket.on('disconnect', function () {
            log("Socket is now Disconnected");

        });

    });
    window.socket = socket;

})(window.io);

window.log = function log () {
    if (typeof console !== 'undefined') {
        console.log.apply(console, arguments);
    }
};
var products_api = '/api/products/';
var Module = angular.module('main', ['ngRoute']);
Module.service('shake', function () {
    var popup = $('.notification');
    var notify = this.notify = function ($scope, msg) {
        typeof msg != 'object' ? msg = [msg]: msg;
        $scope.messages = msg;
        popup.show(100);
        popup.fadeOut(3000);

    };
    this.get = function ($scope, url) {
        socket.get(url, function (products) {
            $scope.$apply(function () {
                $scope.products = products;
                $scope.total = products.length;
            });
        });
    };

    this.put = function ($scope) {
        var url = products_api + $scope.id;
        socket.put(url, $scope.product, function (res) {
            handle($scope, res);

        });
    };
    this.post = function ($scope) {
        socket.post(products_api, $scope.product, function (res) {
            handle($scope, res);
        });
    };
    var handle = function ($scope, res) {
        if (res.errors != undefined) {
            var msg = [];
            for (var item in res.errors[0].ValidationError) {
                msg.push('Invalid ' + item + ' !');
            }
            $scope.$apply(function () {
                notify($scope, msg);
                $scope.ms_class = "error";
            });
        }
    }
});

Module.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/products', {
                controller: 'ProductList',
                templateUrl: '/templates/products.html'
            })
            .when('/', {
                controller: 'Home',
                templateUrl: '/templates/home.html'
            });

        //$locationProvider.html5Mode('on');
        $locationProvider.hashPrefix('!');
    }])

    .controller('ProductList', ['$scope', '$location', 'shake', function ($scope, $location, shake) {
        //Subscribing to Socket
        shake.get($scope, products_api);
        //Listening for notification
        socket.on('message', function (message) {
            var msg = message.model.toUpperCase().slice(0, -1) + ' : ' + message.data.name + ' ' + message.verb + 'd ';

            shake.get($scope, products_api);
            shake.notify($scope, msg);
        });

        $scope.stat = true;
        $scope.reverse = true;

        $scope.toggleForm = function (mode, id) {
            $scope.stat = !$scope.stat;
            $scope.messages = "";
            $scope.mode = mode;
            if (mode == 'edit') {
                var u = products_api + id;
                $scope.id = id;
                socket.get(u, function (product) {
                    $scope.$apply(function () {
                        $scope.product = product;
                    });
                });

            } else {
                $scope.product = {};
            }

        };
        $scope.action = function (mode) {
            if (mode == 'edit') {
                shake.put($scope);

            } else if (mode == 'add') {
                shake.post($scope);
            } else {
                console.log(mode);
            }
        };

        $scope.sortBy = function (value) {

            $scope.reverse = !$scope.reverse;
            $scope.order = value;
        };

    }])
    .controller('Home', ['$scope', function ($scope) {

    }]);

