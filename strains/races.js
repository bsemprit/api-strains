var knex = require('knex');
import throwError from 'app.js';

export function getRace(trx, race) {
  return knex('race')
    .transacting(trx)
    .select('*')
    .then(function(races) {
      const raceId = races.find((raceObject) => {
          if(raceObject.description == race) {
            return raceObject.race_id;
          }
      });
      if(raceId != -1) {
        return raceId;
      }
  
      return;
    });
  }
