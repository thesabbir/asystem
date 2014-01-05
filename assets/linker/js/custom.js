(function (io) {
    var socket = io.connect();
    socket.on('connect', function socketConnected () {

        socket.on('message', function messageReceived (message) {

            log('New message received :: ', message);

        });

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
}
var products_api = '/api/products/';
var Module = angular.module('main', ['ngRoute']);

Module.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/products', {
            controller: 'ProductList',
            templateUrl: '/templates/products.html'
        })
        .when('/', {
            controller: 'Home',
            templateUrl: '/templates/home.html'
        })

    //$locationProvider.html5Mode('on');
    $locationProvider.hashPrefix('!');
})
    .controller('ProductList', function ($scope, $location) {
        $scope.stat = true;
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
        $scope.action = function (mode, id) {
            if (mode == 'edit') {
                edit($scope);

            } else if (mode == 'add') {
                socket.post(products_api, $scope.product, function (message) {
                    if (message.errors != undefined) {
                        var msg = [];
                        for (var item in message.errors[0].ValidationError) {
                            msg.push('Invalid ' + item + ' !');
                        }
                        $scope.$apply(function () {
                            $scope.messages = msg;
                            $scope.ms_class = "error";
                        });
                    } else {
                        socket.emit('change');
                        update($scope, products_api, ["Success !"]);
                    }

                });
            } else {
                console.log(mode);
            }
        };
        update($scope, products_api);
        socket.on('update', function () {
            update($scope, products_api);
        });
        $scope.reverse = true;
        $scope.sortBy = function (value) {

            $scope.reverse = !$scope.reverse;
            $scope.order = value;
        };

    })
    .controller('Home', function ($scope) {

    });

function update ($scope, url, msg) {
    socket.get(url, function (products) {
        $scope.$apply(function () {
            $scope.products = products;
            $scope.total = products.length;
            $scope.messages = msg || "";
        });
    });
}
function edit($scope) {
    var url = products_api + $scope.id;
    socket.put(url, $scope.product, function (res) {
        socket.emit('change');
        socket.get(products_api, function (products) {
            update($scope, products_api, ["Success !"]);
        });

    });
}