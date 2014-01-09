module.exports = {
	feed: function (req, res, next) {
		Products.find(function (err, products) {
			if (err) return next(err);
			if (!products) return res.jsonp({err: 'No product Found'});

			products.forEach(function (product,index) {
				delete products[index].value;
				delete products[index].totalSold;
			});

			res.jsonp(products);
		})
	},
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

	_config: {}


};
