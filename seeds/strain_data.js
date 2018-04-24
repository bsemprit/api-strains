const strainData = require('../data/strain');
let strains = [];
const races = [
	{description: "sativa"},
	{description: "indica"},
	{description: "hybrid"},
];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
	return knex('strain_effect').del()
		.then(function(){
				return knex('strain_flavor').del();
			}
		)
		.then(function(){
				return knex('effect').del();
			}
		)
		.then(function(){
				return knex('flavor').del();
			}
		)
		.then(function(){
				return knex('strain').del();
			}
		)
		.then(function(){
				return knex('race').del();
			}
		)
		.then( function() {
		// Inserts seed entries
		return knex('race').insert(races);
		})
		.then(function() {
			let effectsList = new Set();
			let flavorsList = new Set();
			let flavors = [];
			let effects = [];
			let strains = [];
			strainData.forEach((strain) => {
					const race_id = races.findIndex(function(race) {
						return race.description == strain.race;
					});
					const flattenedEffects = [strain.effects.positive, strain.effects.negative, strain.effects.medical];
					const id = strain.id;
					strains.push({name: strain.name, race_id, strain_id: id});
					for( let flavor of strain.flavors ) {
						flavors.push({flavor, id});
						flavorsList.add(flavor);
					}
					for( let effect of strain.effects.positive) {
						effects.push({description: effect, id});
						const effObj = {description: effect, type: "positive"};
						if(!effectsList.has(effObj)) effectsList.add(effObj);
					}
					for( let effect of strain.effects.negative) {
						effects.push({description: effect, id});
						const effObj = {description: effect, type: "negative"};
						if(!effectsList.has(effObj)) effectsList.add(effObj);
					}
					for( let effect of strain.effects.medical) {
						effects.push({description: effect, id});
						const effObj = {description: effect, type: "medical"};
						if(!effectsList.has(effObj)) effectsList.add(effObj);
					}
				})
			return Promise.all([
				createFlavors(knex, flavorsList),
				createEffects(knex, effectsList),
				createStrains(knex, strains),
				createStrainFlavors(knex, flavors),
				createStrainEffects(knex, effects),
			]).catch((err) =>{
				console.log("error", err);
			})
		});
};

function createStrains(knex, strains) {
	return knex('strain').insert(strains);
}

function createEffects(knex, effects) {
	effects = Array.from(effects);
	return knex('effect').insert(effects);
}

function createFlavors(knex, flavors) {
	flavors = Array.from(flavors);
	const values = flavors.map(function(flavor) {
		return {description: flavor};
	})
	return knex('flavor').insert(values);
}

function createStrainFlavors(knex, flavors) {
	let strainFlavors = [];
	return knex('flavor').select('description', 'flavor_id').then((flavorsArr) => {
		flavors.forEach((strainFlavor) => {
			flavorsArr.forEach((flavor) => {
				if(flavor.description == strainFlavor.description){
					strainFlavors.push({flavor_id: flavor.flavor_id, strain_id: strainFlavor.id});
				}
			})
		})
		return knex('strain_flavor').insert(strainFlavors);
	})
}
function createStrainEffects(knex, effects) {
	let strainEffects = [];
	return knex('effect').select('description', 'effect_id').then((effectsArr) => {
		effects.forEach((strainEffect)=> {
			effectsArr.forEach((effect)=> {
				if(effect.description == strainEffect.description) {
					strainEffects.push({effect_id: effect.effect_id, strain_id: strainEffect.id})
				}
			})
		})
		return knex('strain_effect').insert(strainEffects);
	})
}