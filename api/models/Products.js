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
            type: 'STRING'
            //required: true
        },
        name: {
            type: 'STRING',
            required: true
        },
        price: {
            type: 'INTEGER',
            required: true
        },
        details: {
            type: 'STRING'
        }


    }

};
