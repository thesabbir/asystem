/**
 * Customers
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true

        },
        email: {
            type: 'string'
        },
        phone: {
            type: 'integer',
            required: true
        },
        rating: {
            type: 'integer',
            defaultsTo: 5
        },
        note: {
            type: 'string'
        }
    }

};
