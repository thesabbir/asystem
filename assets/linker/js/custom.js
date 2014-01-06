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
String.prototype.capF = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
window.log = function log() {
    if(typeof console !== 'undefined') {
        console.log.apply(console, arguments);
    }
};

var Module = angular.module('main', ['ngRoute', 'ui.bootstrap']);
Module.service('api', [function () {
    var prefix = '/api';
    this.products = prefix + '/products/';

}])
Module.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/products', {
                controller : 'ProductList',
                templateUrl : '/templates/products.html',
                resolve : {
                    products : function ($q) {
                        var deferred = $q.defer();
                        socket.get('/api/products', function (data) {
                            deferred.resolve(data);
                        })
                        return deferred.promise;
                    }
                }
            })
            .when('/', {
                controller : 'Home',
                templateUrl : '/templates/home.html'
            });

        //$locationProvider.html5Mode('on');
        $locationProvider.hashPrefix('!');
    }])

    .controller('ProductList', ['$scope', '$location', '$modal', 'products',
        function ($scope, $location, $modal, products) {

            $scope.products = products;
            socket.on('message', function (message) {
                var msg = message.model.slice(0, -1).capF() + ' : ' + message.data.name + ' ' + message.verb + 'd ';
                $scope.notify({
                    msg : msg,
                    type : 'success'
                })
                socket.get('/api/products', function (data) {
                    $scope.$apply(function () {
                        $scope.products = data;
                    })
                })
            });

            $scope.openDialog = function (product, mode) {
                var modalInstance = $modal.open({
                    templateUrl : '/templates/form.html',
                    controller : 'FormCtrl',
                    resolve : {
                        product : function () {
                            return product;
                        },
                        mode : function () {
                            return mode;
                        }
                    }
                })
            }

        }])
    .controller('Boss', ['$scope', function ($scope) {
        $scope.sortBy = function (value) {

            $scope.reverse = !$scope.reverse;
            $scope.order = value;
        };

        $scope.notices = [];
        $scope.notify = function (msg) {
            $scope.notices.push(msg);
            $scope.$apply();
            setTimeout(function () {
                $scope.closeNotice(0);
                $scope.$apply();
            }, 8000);
        }
        $scope.closeNotice = function (index) {
            $scope.notices.splice(index, 1);
        }

    }])
    .controller('Home', ['$scope', function ($scope) {

    }])
    .controller('FormCtrl', function ($scope, api, $modalInstance, product, mode) {
        var url = api.products + product.id;

        $scope.product = product;

        $scope.submit = function () {
            switch (mode) {
                case 'edit':
                    socket.put(url, product, function (res) {
                        console.log(res);
                    });
                    break;
                default :
                    socket.post(api.products, product, function (res) {
                        console.log(res);
                    });

            }

            $modalInstance.close('close');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    })

