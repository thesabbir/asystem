/**
 * ProductsController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    limit: function (req, res) {

        if (req.query.from) var skip = Number(req.query.from);
        if (req.query.limit) var limit = Number(req.query.limit);

        Products.find()
            .paginate({
                page: skip,
                limit: limit
            })
            .exec(function (err, result) {
                res.json(result);
        });

    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ProductsController)
     */
    _config: {}


};
