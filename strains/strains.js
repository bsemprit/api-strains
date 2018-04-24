import throwError from '../app';
var knex = require('knex')


export function createNewStrain(req, res) {
    const data = req.body.data;
    if(!data || !data.length) {
      return Error("There was no data, can't create a strain with that!");
    }
    const {name, effects, id, race, flavors} = data;
    if(!name || !effects || !race || !flavors) {
        return Error("There was no data, can't create a strain with that!");
    }
  
    newStrain(name, effects, id, race, flavors).then(function(result) {
        res.status(200).send(result);
    }).catch( function (err) {
        if (err) { res.status(500).send('Error'); }
    }); 
}

function getStrains(req, res) {
    const params = req.params;
    const {id, name, race, effect, flavor} = params;

    return findStrains(id, name, race, effect, flavor).then(function(result) {
        return res.status(200).send(result);
    }).catch( function (err) {
        if (err) { return res.status(500).send('Error'); }
    });
}

export function updateStrain(req, res) {
    const params = req.params;
    const data = req.body.data;
    if(!data || !params || !params.id) {
      return Error("There was no data, can't create a strain with that!");
    }
    return updateExistingStrain(params.id, data).then(function(result) {
        return res.status(200).send(result);
    }).catch( function (err) {
        if (err) { return res.status(500).send('Error'); }
    });
}

export function deleteStrain(req, res) {
    const params = req.params;
    if(!params || !params.id) {
      return Error("There was no data, can't create a strain with that!");
    }
    return deleteExistingStrain(params.id).then(function(result) {
        return res.status(200).send(result);
    }).catch( function (err) {
        if (err) { return res.status(500).send('Error'); }
    });
}

export function newStrain(name, effects, id, race, flavors) {
    return knex.transaction(function(trx) {
        return getRace(trx, race)
            .then(function(race_id){
                if(!race_id){
                    throwError('Invalid race.');
                }
                const values = {name, race_id};            
                knex.insert(values)
                    .transacting(trx)
                    .into('strain')
                    .then( function([strainId]) {
                        return Promise.all([
                            resolve(strainId),
                            newEffects(trx, effects, strainId),
                            newFlavors(trx, flavors, strainId)
                        ])
                });
            });
        
    });
}

function findStrains(id, name, race, effect, flavor) {
    let statement = knex.select(
            'strain.name',
            'strain.race_id',
            'race.description',
            'effect.description',
            'flavor.description'
        )
        .from('strain')
        .leftJoin('race', 'strain.race_id','race.race_id')
        .innerJoin('strain_effect', 'strain.strain_id','strain_effect.strain_id')
        .leftJoin('effect', 'strain_effect.effect_id','effect.effect_id')
        .innerJoin('strain_flavor', 'strain.strain_id','strain_flavor.strain_id')
        .leftJoin('flavor', 'strain_flavor.flavor_id','flavor.flavor_id')
        .orderBy('strain.strain_id');

        if(id) {
            statement += statement.where('strain.strain_id',id);
        }
        if(name) {
            statement += statement.where('strain.name',name);
        }
        if(race) {
            statement += statement.where('race.description',race);
        }
        if(effect) {
            statement += statement.where('effect.description',effect);
        }
        if(flavor) {
            statement += statement.where('flavor.description',flavor);
        }
        return statement;
}

function updateExistingStrain(id, data) {
    const {name, race, effects, flavors} = data;
    return knex.transaction(function(trx) {
        return getRace(trx, race)
            .then(function(race_id){
                if(!race_id){
                    throwError('Invalid race.');
                }
                const values = {name, race_id};            
                return knex.update(values)
                    .transacting(trx)
                    .into('strain')
                    .where('strain.strain_id', id);
            })
            .then( function() {
            return Promise.all([
                resolve(id),
                updateEffects(trx, effects, id),
                updateFlavors(trx, flavors, id)
            ])
        });
        
    });
    
}

function deleteExistingStrain(id) {
    return knex.transaction(function(trx) {
        return Promise.all([
            deleteEffects(trx, effects, id),
            deleteFlavors(trx, flavors, id)
        ])
        .then(function(){           
            return knex('strain')
                .transacting(trx)
                .where('strain_id')
                .del();
        })
    });
}
// return Promise(function (resolve, reject) {

// })