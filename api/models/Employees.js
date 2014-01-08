module.exports = {

	attributes: {

		name: {
			type: 'string',
			required: true
		},
		username: {
			type: 'string',
			minLength: 5,
			unique: true,
			required: true
		},
		password: {
			type: 'string',
			required: true
		},
		totalSales: {
			type: 'integer',
			defaultsTo: 0
		},
		totalProfits: {
			type: 'integer',
			defaultsTo: 0
		},
		soldItems: {
			type: 'integer',
			defaultsTo: 0
		},
		notes: {
			type: 'string'
		},
		isAdmin: {
			type: 'boolean',
			defaultsTo: false
		},
		toJSON: function () {
			var obj = this.toObject();
			delete obj.password;
			delete  obj.username;
			return obj;
		}
	},
	beforeValidation: function (values, next) {
		if (typeof values.admin !== 'undefined') {
			if (values.admin === 'unchecked') {
				values.admin = false;
			} else if (values.admin[1] === 'on') {
				values.admin = true;
			}
		}
		next();
	},
	beforeCreate: function (values, next) {
		if (!values.password || values.password != values.confirm || values.password.length < 6) {
			return next({err: "Invalid password or passwords doesn't matches"});
		}

		require('bcrypt').hash(values.password, 10, function (err, encryptedPassword) {
			if (err) return next(err);
			values.password = encryptedPassword;
			next();
		});
	}


};
