const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const jwt = require("jsonwebtoken");
const { timeout } = require("./utils")

const config = {
	port: 9002,
	publicKey: fs.readFileSync("assets/public_key.pem"),
}

const users = {
	user1: {
		username: "user1",
		name: "User 1",
		date_of_birth: "7th October 1990",
		weight: 57,
	},
	john: {
		username: "john",
		name: "John Appleseed",
		date_of_birth: "12th September 1998",
		weight: 87,
	},
}

const app = express()
app.use(timeout)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/user-info", ((req, res) => {
	if(!req.headers.authorization) {
		res.status(401).send("Error: cannot authorize headers");
	}
	const token = req.headers.authorization.slice(7);
	jwt.verify(token, config.publicKey, {algorithms: ["RS256"]}, (err, payload) => {
		if (err) {
			res.status(401).send("Error: cannot authorize token");
		}
		try {
			const scopes = payload.scope.split(" ");
			const eachScope = scopes.map(itm => itm.slice(11));
			res.json({
				"name": users["john"].name,
				"date_of_birth": users["john"].date_of_birth
			})
		} catch (err) {
			res.status(401).send("Error: Something went wrong");
		}
	})


}))

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
})

// for testing purposes
module.exports = {
	app,
	server,
}
