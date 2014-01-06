(function (io) {
    var socket = io.connect();
    socket.on('connect', function socketConnected() {

        log(
            'Socket is now connected !'
        );
        socket.on('disconnect', function () {
            log("Socket is now Disconnected");

        });

    });
    window.socket = socket;

})(window.io);

window.log = function log() {
    if(typeof console !== 'undefined') {
        console.log.apply(console, arguments);
    }
};

var Module = angular.module('main', ['ngRoute']);
Module.factory('Fetch', [function () {
    return {
        get: function (url, cb) {
            socket.get(url, function (all) {
                return cb(all);
            });
        },
        post: function (url, data, cb) {
            socket.post(url, data, function (response) {
                return cb(response);
            });
        },
        update: function (url, data, cb) {
            socket.put(url, data, function (response) {
                return cb(response);
            });
        }
    }
}]);

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

    .controller('ProductList', ['$scope', '$location', 'Fetch', function ($scope, $location, Fetch) {
        var api = '/api/products/';

        //Get Initial Data and Subscribe to Products
        Fetch.get(api, function (products) {
            $scope.products = products;
            $scope.$apply();
        });

        $scope.show = function (action, id) {
            if(action) {
                switch (action) {
                    case 'add':
                        $scope.product = {}
                        $scope.mode = action;
                        break;
                        $scope.toggleForm('editForm');
                    case 'edit':
                        Fetch.get(api+id, function (product) {
                            $scope.mode = action;
                            $scope.product = product;
                            $scope.$apply();
                        });
                        $scope.toggleForm('editForm')
                        break;
                    case 'details':
                        Fetch.get(api+id, function (product) {
                            $scope.product = product;
                            $scope.$apply();
                            console.log(product);
                        });

                        break;
                    case 'close':
                        $scope.toggleForm('editForm');
                        break;
                    default :
                        console.log(action);
                }
            }

        };
        $scope.action = function () {
            if(!$scope.product.id && $scope.mode == 'add') {
                Fetch.post(api,$scope.product,function (response) {
                });
            } else if($scope.product.id && $scope.mode == 'edit') {
                Fetch.update(api,$scope.product,function (response) {
                    $scope.notify('Ok');
                });
            }


        }

    }])
    .controller('Boss', ['$scope', function ($scope) {
        $scope.sortBy = function (value) {

            $scope.reverse = !$scope.reverse;
            $scope.order = value;
        };
        $scope.toggleForm = function (form) {
            if(form) $scope[form] = !$scope[form];
        };
        $scope.notify = function (messages) {
          //  angular.isArray(messages) ? messages = [messages] : console.log('ok');;
            $scope.notification = false;
            setTimeout(function () {
                $scope.notification = true;
            }, 200);
        }

    }])
    .controller('Home', ['$scope', function ($scope) {

    }]);

