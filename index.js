const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request-promise');
const port = 8000;
const keyValue = "KFL3hYZyIAOiggufyTGD4FVYtLb0vE33";
let apiUrl = `https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=${keyValue}`;

app.use(cors())

// Make sure your output only contains the required information, 
//the name of the hotel, address, phone number, and the rate for a room.
const requestDetails = (searchParams) => {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      uri: `${apiUrl}${searchParams}`,
      json: true
    };
    request(reqOptions)
      .then(function (response) {
        const filteredHotelInfo = [];
        response.results.map((hotel, index) => {
          const hotelObj = {
            id: index,
            name: hotel.property_name,
            address: hotel.address,
            price: hotel.total_price,
            phoneNumber: hotel.contacts,
            location: hotel.location
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
  if (req && req.query && req.query.airport === undefined || req.query.startDate === undefined || req.query.endDate === undefined) {
    return res.status(404).send("Missing Required Params");
  }

  const constructParams = `&location=${req.query.airport}&check_in=${req.query.startDate}&check_out=${req.query.endDate}`

  requestDetails(constructParams).then((response) => {
    return res.json(response)
  }).catch((err) => {
    return res.status(404).send("API Error");
  })
})

app.listen(port, () => console.log(`SandMan app listening on port ${port}!`))