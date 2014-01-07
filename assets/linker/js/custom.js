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
};
window.log = function log() {
    if(typeof console !== 'undefined') {
        console.log.apply(console, arguments);
    }
};

var Module = angular.module('main', ['ngRoute', 'ui.bootstrap']);
Module.service('api', [function () {
    var prefix = '/api';
    this.products = prefix + '/products/';

}]);
Module.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/products', {
                controller : 'ProductList',
                templateUrl : '/templates/products.html',
                resolve : {
                    products : ['$q',function ($q) {
                        var deferred = $q.defer();
                        socket.get('/api/products', function (data) {
                            deferred.resolve(data);
                        })
                        return deferred.promise;
                    }]
                }
            })
            .when('/', {
                controller : 'Home',
                templateUrl : '/templates/home.html'
            });

        $locationProvider.hashPrefix('!');
    }])

    .controller('ProductList', ['$scope', '$location', '$modal', 'api', 'products',
        function ($scope, $location, $modal, api, products) {

            $scope.products = products;
            $scope.total = $scope.products.length;

            socket.on('message', function (message) {
                var name = " & Name : ";
                message.data ? name += message.data.name : name = '';
                message.verb != 'destroy' ? message.verb += 'd ' : message.verb = 'Deleted';
                var msg = message.model.slice(0, -1).capF() + '-ID : ' + message.id + name + ' was ' + message.verb;
                $scope.notify({
                    msg : msg,
                    type : 'success'
                });
                socket.get(api.products, function (data) {
                    $scope.$apply(function () {
                        $scope.products = data;
                        $scope.total = $scope.products.length;

                    });
                });
            });

            $scope.editDialog = function (product, mode) {
                var modalInstance = $modal.open({
                    templateUrl : '/templates/form.html',
                    controller : 'FormCtrl',
                    resolve : {
                        product : function () {
                            return product;
                        },
                        mode : function () {
                            return mode;
                        },
                        url : function () {
                            return api.products;
                        }
                    }
                })
            }
            $scope.showDetails = function (product) {
                var modalInstance = $modal.open({
                    templateUrl : '/templates/details.html',
                    controller : 'showDetailsCtrl',
                    resolve : {
                        product : function () {
                            return product;
                        },
                        editDialog : function () {
                            return $scope.editDialog;
                        }
                    }
                })
            }
            $scope.deleteDialog = function (data) {
                var modalInstance = $modal.open({
                    templateUrl : '/templates/delete_dialog.html',
                    controller : 'DeleteCtrl',
                    resolve : {
                        data : function () {
                            return data;
                        },
                        url : function () {
                            return api.products;
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
            $scope.$apply(function () {
                $scope.notices.push(msg);
            });
            setTimeout(function () {

                $scope.$apply(function () {
                    $scope.closeNotice(0);
                });
            }, 8000);
        };
        $scope.closeNotice = function (index) {
            $scope.notices.splice(index, 1);
        };

    }])
    .controller('Home', ['$scope', function ($scope) {

    }])
    .controller('FormCtrl', ['$scope', '$modalInstance', 'product', 'mode', 'url',
        function ($scope, $modalInstance, product, mode, url) {

            $scope.product = product;

            $scope.mode = mode;

            $scope.submit = function () {
                switch (mode) {
                    case 'Edit':
                        socket.put(url + product.id, product);
                        break;
                    default :
                        socket.post(url, product)

                }

                $modalInstance.close('close');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }]).controller('showDetailsCtrl', ['$scope', '$modalInstance', 'product', 'editDialog',
        function ($scope, $modalInstance, product, editDialog) {
            $scope.product = product;
            $scope.edit = function () {
                $scope.ok();
                return editDialog(product, 'edit');
            }
            $scope.ok = function () {
                $modalInstance.close('ok');
            }

        }])
    .controller('DeleteCtrl', ['$scope', '$modalInstance', 'data', 'url',
        function ($scope, $modalInstance, data, url) {
            $scope.data = data;
            $scope.cancel = function () {
                $modalInstance.dismiss('cancelled');
            }
            $scope.delete = function () {
                socket.delete(url + data.id, data, function () {
                    $modalInstance.close('deleted');
                });
            }
        }]);

