module.exports = {

	create: function (req, res, next) {
		if (!req.body.username || !req.body.password) {
			return next({err: 'Username and Password is Required'})
		}
		User.findOneByUsername(req.body.username, function (err, user) {
			if (err) return next(err);
			if (!user) return next({err: 'No user found !'});

			bcrypt.compare(req.body.password, user.password, function (err, valid) {

				if (err) return next(err);
				if (!valid) return next({err: 'Password mismatch !'});
				res.json(user);

			});

		});
	},
	_config: {

	}
};
