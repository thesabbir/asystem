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
            type: 'email'
        },
        phone: {
            type: 'integer',
            required: true
        },
        ratings: {
            type: 'integer',
            defaultsTo: 0
        },
        notes: {
            type: 'string'
        }
    }

};
