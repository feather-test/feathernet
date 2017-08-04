const contains = require('../utils/contains.js');
const deepEqual = require('deep-equal');
const each = require('seebigs-each');

function matchesRequest (mock, request) {
    let matches = true;

    each(mock.exact, function (value, predicate) {
        if (typeof value === 'object') {
            each(value, function (v, k) {
                if (!request[predicate] || !deepEqual(request[predicate][k], v, { strict: true })) {
                    matches = false;
                    return false; // drop out of loop
                }
            });
        } else {
            if (request[predicate] !== value) {
                matches = false;
                return false; // drop out of loop
            }
        }
    });

    each(mock.contains, function (value, predicate) {
        if (typeof value === 'object') {
            each(value, function (v, k) {
                if (!request[predicate] || !contains(request[predicate][k], v)) {
                    matches = false;
                    return false; // drop out of loop
                }
            });
        } else {
            if (request[predicate].indexOf(value) === -1) {
                matches = false;
                return false; // drop out of loop
            }
        }
    });

    return matches;
}

module.exports = matchesRequest;
