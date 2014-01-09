var Services = angular.module('Services', [])
   .service('$api', [function () {
      var prefix = '/api';
      this.products = prefix + '/products/';
      this.customers = prefix + '/customers/';
      this.sales = prefix + '/sales/';

      this.listen = function (model, cb) {
         socket.on('message', function (message) {
            var name = " & Name : ";
            message.data ? name += message.data.name : name = '';
            message.verb != 'destroy' ? message.verb += 'd ' : message.verb = 'Deleted';
            var msg = message.model.slice(0, -1).capF() + '-ID : ' + message.id + name + ' was ' + message.verb;
            fetch(model, function (data) {
               return cb(data, {
                  msg: msg,
                  type: 'success'
               });
            });
         });
      };

      var fetch = this.fetch = function (model, cb) {
         socket.get(model, function (data) {
            if (!cb) return data;
            return cb(data);
         });
      };

      this.submit = function (obj, cb) {
         if (obj.edit) {
            socket.put(obj.model + obj.data.id, obj.data, function (res) {
               console.log(obj.model + obj.data.id);
               if (!cb) return res;
               return cb(res);
            });
         } else {
            socket.post(obj.model, obj.data, function (res) {
               console.log(res);
               if (!cb) return res;
               return cb(res);
            });
         }
      };

      this['delete'] = function (model, data, cb) {
         socket.delete(model + data.id, function (res) {
            if (!cb) return res;
            return cb(res);
         });
      };

   }]);