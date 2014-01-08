var Services = angular.module('Services', [])
   .service('$api', [function () {
      var prefix = '/api';
      this.products ='/products';
      this.fetch = function (model, cb) {
          socket.get(prefix+model, function (data) {
             if(!cb) return data;
              return cb(data);
          });
      };

   }])