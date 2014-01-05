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
        //Subscribing to Socket
        update($scope, products_api);
        //Listening for notification
        socket.on('message', function (message) {
            var msg = message.model.toUpperCase().slice(0, -1) + ' : ' + message.data.name + ' ' + message.verb + 'd ';

            update($scope, products_api);
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
        $scope.action = function (mode, id) {
            if (mode == 'edit') {
                edit($scope);

            } else if (mode == 'add') {
                add($scope);
            } else {
                console.log(mode);
            }
        };


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
        handle(res);

    });
}
function add($scope) {
    socket.post(products_api, $scope.product, function (res) {
        handle(res);
    });
};
function handle(res) {
    if (res.errors != undefined) {
        var msg = [];
        for (var item in res.errors[0].ValidationError) {
            msg.push('Invalid ' + item + ' !');
        }
        $scope.$apply(function () {
            $scope.messages = msg;
            $scope.ms_class = "error";
        });
    } else {
        return false;
    }
}