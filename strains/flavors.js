var knex = require('knex');
import throwError from 'app.js';

function newFlavors(trx, newFlavors, strainId) {
    return getFlavors(trx).then(function(flavors) {
        let flavorsIds = [];
        for(flavor in flavors) {
            for(newFlavor in newFlavors) {
                if(newFlavor == flavor.description){
                    flavorsIds.push({id, flavor_id: flavor.flavor_id});
                }
            }
        }
        if(flavorsIds.length) {
            return knex('strain_flavors')
              .transacting(trx)
              .batchInsert(flavorsIds);
        } else {
            return Promise.resolve();
        }
    })
}

function getFlavors(trx) {
    return knex('flavor')
        .transacting(trx)
        .select('*');
}