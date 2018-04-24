exports.up = function (knex) {
    return Promise.all([ 
        knex.schema.createTable('race', function (t) {
            t.increments('race_id').primary().unsigned();
            t.string('description');
        }),
        knex.schema.createTable('flavor', function (t) {
            t.increments('flavor_id').primary().unsigned();
            t.string('description');
        }),
        knex.schema.createTable('effect', function (t) {
            t.increments('effect_id').primary().unsigned();
            t.string('description');
            t.string('type');
        }),
        knex.schema.createTable('strain', function (t) {
            t.increments('strain_id').primary().unsigned();
            t.string('name');
            t.integer('race_id'); 
        }),
        knex.schema.createTable('strain_effect', function (t) {
            t.increments('strain_effect_id').primary();
            t.integer('strain_id'); 
            t.integer('effect_id'); 
        }),
        knex.schema.createTable('strain_flavor', function (t) {
            t.increments('strain_flavor_id').primary();
            t.integer('strain_id'); 
            t.integer('flavor_id'); 
        })
    ])
}

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('strain_effect')
    .then(function(){
            return knex.schema.dropTableIfExists('strain_flavor');
        }
    )
    .then(function(){
            return knex.schema.dropTableIfExists('effect');
        }
    )
    .then(function(){
            return knex.schema.dropTableIfExists('flavor');
        }
    )
    .then(function(){
            return knex.schema.dropTableIfExists('strain');
        }
    )
    .then(function(){
            return knex.schema.dropTableIfExists('race');
        }
    )
}