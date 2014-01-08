module.exports.express = {

    customMiddleware: function (app) {
        var express = require('../node_modules/sails/node_modules/express');
        app.use(express.compress());
        app.use(express.static('../views/templates'));
        console.log('ok');
    }
}