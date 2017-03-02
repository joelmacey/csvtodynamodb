const fs = require('fs');
const async = require('async');
const parse = require('csv-parse');
const aws = require("aws-sdk");
const s3 = new aws.S3({
  apiVersion: '2006-03-01'
});
var csv = require('fast-csv');
aws.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});
var destFilePath = '';
var bucket = '';
var key ='';
var dynamodb = new aws.DynamoDB();

var params = {
  Bucket: bucket,
  Key: key,
};
var dbparams = {}

//Triggered by the event.
exports.handler = (event, context, callback) => {

  bucket = event.Records[0].s3.bucket.name;
  key =  decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  params = {
    Bucket: bucket,
    Key: key,
  };
  // Gets the object from the event and show its content type
  console.log('Triggered from s3 Event: ' + bucket + '/' + key);
  console.log('================================================================================');
  console.log('EVENT DATA:');
  console.log(JSON.stringify(event, null, 2));
  console.log('================================================================================');

  //Starts a waterfall, asynchronous flow of functions.
  async.waterfall([

    function defineTable(next){

      //Creates the table layout
      dbparams = {
        TableName : "inputTable",
        AttributeDefinitions: [
          { AttributeName: "color", AttributeType: "S" }, //S stands for String
          { AttributeName: "number", AttributeType: "N" } //N stands for Number
        ],
        KeySchema: [
          { AttributeName: "color", KeyType: "HASH"},  //Partition key
          { AttributeName: "number", KeyType: "RANGE"}  //Sort key
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10
        }
      }
      console.log('================================================================================');
      console.log('TABLE INFO:')
      console.log(JSON.stringify(dbparams,null,2));
      console.log('================================================================================');
      next(null);
    },
    function defineDownload(next) {

    console.log('Download from: ' + bucket + '/' + key);

    //Where the File Path is defined
    destFilePath='/tmp/' + key
    next(null);

    },
    //Creates the blank file ready to be written into
    function createLocalFile(next) {
      var destFile = fs.createWriteStream(destFilePath);
      console.log('File created locally.');
      console.log('Path: ' + destFilePath);
      next(null, destFile);
    },
    //Writes data from s3 file into blank file
    function saveFileLocally(destFile,next) {
      s3.getObject(params, (err, data) => {
        fs.writeFile(destFilePath, data.Body, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log('================================================================================');
            console.log('S3 FILE INFO:', JSON.stringify(destFile, null, 2));
            console.log('================================================================================');
            console.log('File filled with data from s3: ' + bucket + '/' + key);
            console.log('Path: ' + destFilePath);
            next(null);

        });
      });

    },
    //Creates a table if it doesnt already exist
    function createTable(next){
      dynamodb.createTable(dbparams, function(err, data) {
        if (err) {
          console.log('Table already exists "' + dbparams.TableName +'", continuing on.')
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
          next(null);
        } else {
          // console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
          console.log('Table Created: ' + dbparams.TableName + '.');
          next(null);
        }
      });

    },
    function addToTable(next){
      console.log("Importing data into DynamoDB.");
      var dataArr = [];
      fs.createReadStream(destFilePath)
      .pipe(csv())
      .on('data', function(data){
        dataArr.push(data); // Add a row
      })
      .on('end', function(){
        console.log('Color, Number');
        //Loop where it places into table
        for(var i=0; i<dataArr.length; i++){
          var color = dataArr[i][0];
          var number = dataArr[i][1];

          dynamodb.putItem(
            {
              "TableName": "inputTable",
              "Item": {
                "color": {"N": color},
                "number": {"S": number}
              }
            }
          );
          console.log(color + number);
        } //End of For Loop
        console.log('Imported successfully.');
        next(null, 'DONE.');
      }); //End of .on('end')
    }

  ],
  function (err) {
    if (err) {
      console.error("Error:" + err);
    } else {
      console.log('SUCCESS!');
    }
  }
  ); //End of Waterfall
};
