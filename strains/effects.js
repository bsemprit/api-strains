var knex = require('knex');
import throwError from 'app.js';


export function newEffects(trx, newEffects, id) {
	const flattenedEffects = [newEffects.positive, newEffects.negative, newEffects.medical];
	return getEffects(trx).then(function(effects) {
		let effectsIds = [];
		for(effect in effects) {
			for(newEffect in flattenedEffects) {
				if(newEffect == effect.description){
					effectsIds.push({id, effect_id: effect.effect_id});
				}
			}
		}
		if(effectsIds.length) {
			return knex('strain_effects')
				.transacting(trx)
				.batchInsert(effectsIds);
		} else {
			return Promise.resolve();
		}
	});
}

export function updateEffects(trx, effects, id) {
	
}

function getEffects(trx) {
    return knex('effect')
        .transacting(trx)
        .select('*');
}