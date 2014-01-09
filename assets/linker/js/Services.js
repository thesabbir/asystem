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
      var validate = function (res) {
         console.log(res);
         angular.element(document.querySelector('.has-error')).removeClass('has-error');
         if (res.errors && res.errors[0].ValidationError) {
            var msg = [];
            for (var item in res.errors[0].ValidationError) {
               msg.push('Invalid ' + item + ' !');
               angular.element(document.querySelector('label[for=' + item + ']')).parent().addClass('has-error');
            }
            console.log( msg);
            return false;
         } else {
            return true;
         }
      }
      this.submit = function (obj, cb) {
         if (obj.edit) {
            socket.put(obj.model + obj.data.id, obj.data, function (res) {
               return  cb(validate(res));
            });
         } else {
            socket.post(obj.model, obj.data, function (res) {
               return  cb(validate(res));
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