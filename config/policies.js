module.exports.policies = {


	'*': true,
	login: {
		'*': true
	},
	products: {
//		'*': 'isAuth',
		feed: true
	}

}