

const express = require('express');
const https = require('https');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const baseUrlReq = "https://redsky.target.com/v3/pdp/tcin/"
const suffix = "?&key=candidate"
const mongourl = "mongodb://127.0.0.1:27017"


function GetPrice(ID, res){

	//returns the proper result once function is complete 
	return new Promise((resolve) => {

			//connection to locally hosted database
			MongoClient.connect(mongourl,{ useNewUrlParser: true, useUnifiedTopology: true },  function (err, client) {

					//If it fails, we send an error to the requestor 
					if(err){ res.send("Unable to connect to database.")
					return;	
					}	

					//Navigating to the right database
					const db = client.db('product-data');
					const products = db.collection('products');

					//building quary 
					const query = {productID:ID};

					//excluding the mongo assigned ID
					const options = {
					projection: { _id: 0, productID: 1, current_price: 1},
					};

					//executing the quary 
					const result = products.findOne(query, options);

					resolve(result);
					})
				});
}

function GetProductDetails(productID) {

	//returns the proper result once function is complete 
	return new Promise((resolve) => {

			//Sets up the URL scheme as given in the result
			var URL = baseUrlReq + productID.toString() + suffix

			//Gets data from location and peices together 
			const req = https.request(URL, (res) => {

					var body = [];

					res.on('data', function(chunk) {
							body.push(chunk);
							});

					res.on('end', function() {

							//constructs JSON object 
							body = JSON.parse(Buffer.concat(body).toString());
							resolve(body);

							});
					});

			// send the request
			req.end();
	});
}

const func = async (req, res) =>{

	//Getting PID from suplied URL 
	var PID = req.params.productID;

	console.log(PID);

	//functions to get product data and price 
	var detailjson = await GetProductDetails(PID);
	var pricejson = await GetPrice(PID, res);

	if (detailjson == null || pricejson == null){
		res.send("Item was not found");

	}
	else{
		//building combined json object 
		response = {"id": pricejson['productID'], "Name:" : detailjson['product']['item']['product_description']['title'], "current_price": pricejson['current_price']};

		//sending the service response 
		res.send(response);
	}

}	


function main(){

	//setting up server
	app.listen(5000, function() {
			console.log('listening on 5000')
			})

	//waiting for request 
	app.get('/products/:productID', func)
	
}

main()

