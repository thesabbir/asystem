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
			required: true
		},
		inStock: {
			type: 'integer',
			defaultsTo: 0
		},
		totalSold: {
			type: 'integer',
			defaultsTo: 0
		},
		toFeed: function () {
			var obj = this.toObject();
			delete obj.value;
			delete obj.totalSold;
			return obj;
		}
	}


};
