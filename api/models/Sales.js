module.exports = {

   attributes: {
      customerName: {
         type: 'string'
      },
      product: {
         type: 'array'
      },
      by : {
         type: 'string'
      }

   },
   beforeValidation: function (values, next) {
       console.log(typeof values.product);
      next()
   }

};
