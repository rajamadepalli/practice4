const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// get

app.get("/players/", async (request, response) => {
  const { playerId } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      cricket_team`;
  const book = await db.run(getBookQuery);
  response.send(book);
});

//get single object
app.get("/players/", async (request, response) => {
  const { playerId } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      cricket_team
    where playerId=${playerId}`;
  const book = await db.get(getBookQuery);
  response.send(book);
});

//post
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO
      (player_id,playerName,jerseyNumber,role)
    VALUES
      ('${player_id}',
      '${playerName}',
      '${jerseyNumber}',
      '${role}'  
      );`;

  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//put

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_id, playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
      playerId=${player_id};
      playerName='${playerName}',
      jerseyNumber=${jerseyNumber},
      role='${role}'
    WHERE
      player_id = ${playerId};`;
  const a = await db.get(updatePlayerQuery);
  response.send(a);
});

//delete

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      playerId = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
