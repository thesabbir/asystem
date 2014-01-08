module.exports = {

	attributes: {

		name: {
			type: 'string',
			required: true
		},
		username: {
			type: 'integer',
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
		}
	}

};
