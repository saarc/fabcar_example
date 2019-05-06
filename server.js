// ExpressJS Setup
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
// Constants
const PORT = 8080;
const HOST = '10.0.2.15';


 // Hyperledger Bridge
//var Fabric_Client = require('fabric-client');
//var util = require('util');
//var os = require('os');

//
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));


const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

//Attach the middleware
app.get('/', function (req, res) {
  fs.readFile('index.html', function (error, data) {
              res.send(data.toString());

  });
});

app.get('/api/query', async function (req, res) {
		// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllCars');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

			console.log(result);
//                        res.status(200).json({response: result.toString()});
//			res.end(JSON.stringify(result));
});
// 192.168.1.56:8080/api/querycar?carno=CAR5
app.get('/api/querycar/', async function (req, res) {
                // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    try {
//  fs.readFile('querycar.html', function (error, data) {
//                res.send(data.toString());
//		});
	var carno = req.query.carno;
	console.log(carno);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryCar', carno);

        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
});

app.get('/api/createcar', function (req, res) {
  fs.readFile('createcar.html', function (error, data) {
              res.send(data.toString());

  });
});

app.post('/api/createcar/', async function (req, res) {
    try {
	var carno = req.body.carno;
	var colour = req.body.colour;
	var make = req.body.make;
	var model = req.body.model;
	var owner = req.body.owner;

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } }); 

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
//        await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
        await contract.submitTransaction('createCar', carno, make, model, colour, owner);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }   

});

app.get('/api/changeowner', function (req, res) {
  fs.readFile('changeowner.html', function (error, data) {
              res.send(data.toString());

  }); 
});

app.post('/api/changeowner/', async function (req, res) {
    try {
        var carno = req.body.carno;
        var owner = req.body.owner;

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } }); 

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
//        await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
        await contract.submitTransaction('changeCarOwner', carno, owner);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }   

});


app.listen(PORT, HOST);
console.log(`Running on http://localhost:${PORT}`);


