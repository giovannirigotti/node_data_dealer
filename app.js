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
ranking/teams/{season_tag}
*/
app.get('/ranking/teams/:season_tag', (req, res) => {
  var season_tag = req.params.season_tag;
  var query = "SELECT position, name, points FROM rankings AS R join teams AS T on R.team_id = T.team_id WHERE season_tag = '"+ season_tag +"' ORDER BY points DESC;";
  database.query(query, (err, result) => {
    if (err) {
      res.statusCode = 500;
      res.json({
         'message':'Internal Server Error',
         'data': err
      })
    } else {
      var data = result.rows;
      if (data.length == 0) {
        res.statusCode = 404;
        res.json({
           'message':'Data not present on the DB'
        })
      } else {
        res.statusCode = 200;
        res.json({
          'message':'Success',
          'data': data
        })
      }
    }
    res.end();
  })
});
/*
ranking/goals/{season_tag}
*/
app.get('/ranking/goals/:season_tag', (req, res) => {
  var season_tag = req.params.season_tag;
  var query = "SELECT goals, name from scorers AS S JOIN players AS P ON S.player_id = P.player_id WHERE season_tag = '"+season_tag+"' ORDER BY goals DESC;";
  database.query(query, (err, result) => {
    if (err) {
      res.statusCode = 500;
      res.json({
         'message':'Internal Server Error',
         'data': err
      })
    } else {
      var data = result.rows;
      if (data.length == 0) {
        res.statusCode = 404;
        res.json({
           'message':'Data not present on the DB'
        })
      } else {
        res.statusCode = 200;
        res.json({
          'message':'Success',
          'data': data
        })
      }
    }
    res.end();
  })
});



// ESEMPIO CON PIU PARAMETRI
/*
    app.get('/fruit/:fruitName&:fruitColor', function(request, response) {
       const name = request.params.fruitName
       const color = request.params.fruitColor
    });
*/
