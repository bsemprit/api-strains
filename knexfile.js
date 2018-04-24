// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      // host: 'flourish-backend-challenges.cu3xm4sqc8wn.us-east-1.rds.amazonaws.com',
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'strains'
    },
    pool: { min: 0, max: 7 }
  }
};
