/////////////// Import
const express = require('express');
const { Pool, Client } = require('pg');
const port = 4000;

/////////////// Connessione al database.
const database = new Client({
  user: "postgres",
  password: "postgresql",
  host:'127.0.0.1',
  port:"5432",
  database:"direttaDB",
	multipleStatements: true
});
database.connect()
.then(() => console.log("Connected successfuly"))
.catch(err => console.log(err));

/////////////// Avvio del server web.

const app = express();

var server = app.listen(port, () => {
	console.log("Ascolto richieste sulla porta: " + port);
});


///////////////////////////////
///                         ///
///          API            ///
///                         ///
///////////////////////////////

/*
ranking_goal/{season_tag}
*/
app.get('/api/ranking_goal/:season_tag', (req, res) => {
  var season_tag = req.params.season_tag;
  var query = "SELECT goals, name from scorers AS S JOIN players AS P ON S.player_id = P.player_id WHERE season_tag = '"+season_tag+"' ORDER BY goals DESC;";
  database.query(query, (err, result) => {
    if (err) {
      res.statusCode = 500;
      res.end();
    } else {
      res.statusCode = 200;
      var data = result.rows;
      res.json({
         data
      })
      res.end();
    }
  })
});



// ESEMPIO CON PIU PARAMETRI
/*
    app.get('/fruit/:fruitName&:fruitColor', function(request, response) {
       const name = request.params.fruitName
       const color = request.params.fruitColor
    });
*/
