const express = require('express')
const mysql = require('mysql');
require('dotenv').config();
const app = express()
const port = 3000;

app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})
db.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('conected')
    }
})
//add school POST
app.post('/addSchool', (req, res) => {

    const { name, address, latitude, longitude } = req.body;
    //validation
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'all fields required' })
    }
    const sql = 'INSERT INTO school_management (name ,address,latitude,longitude) VALUES(?,?,?,?)';
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            res.status(500).send('database error has occured');
        }
        res.status(200).json({ name, address, latitude, longitude })
    })
})

app.get('/listschool', (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        res.status(400).json({ error: 'latitude and longitude are required' })
    }
    const sql = 'SELECT *, (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance FROM schools ORDER BY distance';

    db.query(sql, [latitude, longitude, latitude], (err, result) => {
        if (err) {
            res.status(500).send('database error has occured');
        }
        res.json(result)
    })

})

app.listen(port, () => {
    console.log(`youtr app is on radio mrichi port no   http://localhost:${port}`)
})
