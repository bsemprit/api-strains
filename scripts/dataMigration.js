import createNewStrain from '../strains/strains';
import connection from '../sqlConnection';

startImport().catch( function(err) {
    console.log(err);
});

export function startImport() {
    return new Promise(function (resolve, reject) {
        connection.beginTransaction(function(err) {
            if (err) { return reject(err) }

            let createRaceQuery = `CREATE TABLE
                race (
                    race_id INT AUTO_INCREMENT PRIMARY KEY,
                    description STRING
                );`;

            let createEffectQuery = `CREATE TABLE
                effect (
                    effect_id INT AUTO_INCREMENT PRIMARY KEY,
                    description STRING,
                    type STRING
                );`;

            
            let createFlavorQuery = `CREATE TABLE
                flavor (
                    flavor_id INT AUTO_INCREMENT PRIMARY KEY,
                    description STRING
                );`;

            let createStrainQuery = `CREATE TABLE 
                strain (
                    strain_id INT AUTO_INCREMENT PRIMARY KEY, 
                    name STRING, 
                    race_id INT NOT NULL,
                    FOREIGN KEY (race_id) REFERENCES race(race_id)
                );`;

            let createStrainEffectQuery = `CREATE TABLE
                strain_effect (
                    strain_effect_id INT AUTO_INCREMENT PRIMARY KEY,
                    effect_id INT,
                    FOREIGN KEY (effect_id) REFERENCES effect(effect_id)
                );`;

            
            let createStrainFlavorQuery = `CREATE TABLE
                strain_flavor (
                    strain_flavor_id INT AUTO_INCREMENT PRIMARY KEY,
                    flavor_id INT,
                    FOREIGN KEY (flavor_id) REFERENCES flavor(flavor_id)
                );`;

            const query = createRaceQuery + createEffectQuery + createFlavorQuery + createStrainQuery +
                createStrainEffectQuery + createStrainFlavorQuery;
            connection.query('CREATE DATABASE IF NOT EXISTS strains', function (err) {
                if (err) throw err;
                connection.query(query, function(err,result) {
                    if(err) {
                        throw err;
                    }
                    
                    resolve(result.insertId);
                });
            });
        });
    });
}

// function dataMigration(data) {
//     for(strain in data) {
//         createNewStrain(strain);
//     }
// }