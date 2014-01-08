/**
 * Products
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		category: {
			type: 'string'
			//required: true
		},
		name: {
			type: 'string',
			required: true
		},
		price: {
			type: 'integer',
			required: true
		},
		details: {
			type: 'string'
		},
		value: {
			type: 'integer',
			required: 'true'
		},
		inStock: {
			type: 'integer',
			defaultsTo: 0
		},
		totalSold: {
			type: 'integer',
			defaultsTo: 0
		},
		profit: function () {
			return this.price - this.value;
		}
	}


};
