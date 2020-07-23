'use strict';

const pg = require('pg')

const pool = new pg.Pool({
  host     : process.env.dbhost,
  user     : process.env.dbuser,
  database : process.env.dbbase,
  password : process.env.dbpassword,
  port     : process.env.dbport
});

exports.handler = (event, context, callback) =>{
  context.callbackWaitsForEmptyEventLoop = false;
  pool.query("SELECT link from images", (err, res) => {
    if(err)callback(err)
    else 
    {
      const links = res.rows.map(item=> item.link);
      callback(null, 
        {
          statusCode: 200,
          body: JSON.stringify(links)
        })
      }
    })
}
