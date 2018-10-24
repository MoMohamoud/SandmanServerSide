const express = require('express')
const app = express()
const request = require('request-promise');
const port = 8000;
const keyValue =  "KFL3hYZyIAOiggufyTGD4FVYtLb0vE33";
let apiUrl = `https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=${keyValue}`;
const example = "https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=KFL3hYZyIAOiggufyTGD4FVYtLb0vE33&location=BOS&check_in=2018-12-15&check_out=2018-12-16";

// Make sure your output only contains the required information, 
//the name of the hotel, address, phone number, and the rate for a room.
const requestDetails = (values) => {
    return new Promise ((resolve, reject) => {
    const reqOptions = {
        uri: example,
        json: true 
    };
    request(reqOptions)
    .then(function (response) {
        const filteredHotelInfo = [];
        response.results.map( (hotel) => {
            const hotelObj = {
                name: hotel.property_name,
                address: hotel.address,
                price: hotel.total_price,
                phoneNumber: hotel.contacts
            }
            filteredHotelInfo.push(hotelObj)
        })
        resolve(filteredHotelInfo)
    })
    .catch(function (err) {
        reject(err)
    });
        })
};



app.get('/', (req, res) => {
    if(req && req.query && req.query.airport === undefined || req.query.startDate === undefined) {
        return res.status(404).send("Missing Required Params");
        }
    const location = {

    };
    const date = req.query.startDate;
    const constructParams = `&location=${req.query.airport}&check_in=${req.query.startDate}&check_out=${req.query.endDate}`

    requestDetails(location).then( (response) => {
        return res.json(response)

    }).catch( (err) => {
        console.log(err)&location=BOS
        return res.status(404).send("API Error");
    })
    console.log('teste', req.query)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))