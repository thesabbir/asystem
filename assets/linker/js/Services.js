var Services = angular.module('Services', [])
   .service('$api', [function () {
      var prefix = '/api';
      this.products = '/products/';
      this.listen = function (model, cb) {
         socket.on('message', function (message) {
            var name = " & Name : ";
            message.data ? name += message.data.name : name = '';
            message.verb != 'destroy' ? message.verb += 'd ' : message.verb = 'Deleted';
            var msg = message.model.slice(0, -1).capF() + '-ID : ' + message.id + name + ' was ' + message.verb;
            fetch(model, function (data) {
                return cb(data, {
                   msg : msg,
                   type: 'success'
                });
            })
         });
      }
      var fetch = this.fetch = function (model, cb) {
         socket.get(prefix + model, function (data) {
            if (!cb) return data;
            return cb(data);
         });
      };
      this.update = function (model, data, cb) {
         socket.put(prefix + model + data.id, data, function (res) {
            if (!cb) return res;
            return cb(res);
         });
      };
      this.create = function (model, data, cb) {
         socket.post(prefix + model + data.id, data, function (res) {
            if (!cb) return res;
            return cb(res);
         })
      }
   }]);