require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000




app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

//roverInfo 
app.post('/roverInfo', async (req, res) => {
    try {
        let images = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}/latest_photos?api_key=${process.env.API_KEY}`)
        .then(res => res.json())
        res.send(images);

    } catch (err) {
        console.log('error:', err);
    }
})



// Fetching images from NASA Apis
app.post('/fetchImage', async (req, res) => {
    try {
        const URL=`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.roverName}/photos?sol=1000&api_key=${process.env.API_KEY}`
        let roverData = await fetch(URL)
            .then(res => res.json())
            //send roverData
            res.send(roverData.photos)

    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))


