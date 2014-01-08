module.exports = {

	create: function (req, res, next) {
		if (!req.body.username || !req.body.password) {
			return res.json({err: 'Username and Password is Required'})
		}
		Employees.findOneByUsername(req.body.username, function (err, user) {
			if (err) return next(err);
			if (!user) return res.json({err: 'No user found !'});

			require('bcrypt').compare(req.body.password, user.password, function (err, valid) {

				if (err) return next(err);
				if (!valid) return res.json({err: 'Password mismatch !'});
				req.session.authenticated = true;
				req.session.User = user;
				res.json({authorized : true, user: user})


			});

		});
	},
	_config: {

	}
};
