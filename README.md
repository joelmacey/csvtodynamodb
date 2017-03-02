# CSV to DynamoDB
###*A library to push a csv file to dynamodb*

Simple Library to place data in a CSV file to a local dynamoDB, can be modified to work for a remote DynamoDB table.


- Includes Serverless.com framework
- Includes Lambda-Local for local testing
- Includes DynamoDB Local

###Please Configure your AWS Creditials in the .aws/Creditials file before running any of these.
##How to Start DynamoDB local
Run
```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -inMemory
```
while in the dynamodb-local directory.
This will run dynamoDB locally in Memory and accessable to the library
More help for DynamoDB Local can be found by running
```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -help
```
or visiting [Here](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html).

##How to Test Lambda Locally with the Package *Lambda-Local*
Run
```
lambda-local -l handler.js -e node_modules/lambda-local/event-samples/s3-put.js
```
Will run a s3 put event.
To set this to your own bucket & key edit the s3-put.js file.
