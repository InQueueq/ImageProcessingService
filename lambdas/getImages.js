const pg = require('pg')

const pool = new pg.Pool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  database : process.env.DB_BASE,
  password : process.env.DB_PASSWORD,
  port     : process.env.DB_PORT
});

exports.handler = async (event,context) =>{
  try{
    const requestUsername = event.requestContext.authorizer.claims.email.split("@")[0];
    context.callbackWaitsForEmptyEventLoop = false;
    const res = await pool.query(`SELECT link from images WHERE images.user = '${requestUsername}'`)
    const links = res.rows.map(item=> item.link);
    return {
      statusCode: 200,
      body: JSON.stringify(links)
    }
  }
  catch(err){
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: err
        })
    }
  }
}