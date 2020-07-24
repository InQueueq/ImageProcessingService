const pg = require('pg')

const pool = new pg.Pool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  database : process.env.DB_BASE,
  password : process.env.DB_PASSWORD,
  port     : process.env.DB_PORT
});

exports.handler = async context =>{
  try{
    context.callbackWaitsForEmptyEventLoop = false;
    const res = await pool.query("SELECT link from images");
    const links = res.rows.map(item=> item.link);
    return {
      statusCode: 200,
      body: JSON.stringify(links)
    }
  }
  catch(err){
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: err
        })
    }
  }
}
