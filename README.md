<<<<<<< HEAD
# CSV to DynamoDB
###*A library to push a csv file to dynamodb*

Simple Library to place data in a CSV file to a local dynamoDB, can be modified to work for a remote DynamoDB table.


- Includes Serverless.com framework
- Includes Lambda-Local for local testing
- Includes DynamoDB Local

##How to Start DynamoDB local
Run
`java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -inMemory` while in the dynamodb-local directory.
This will run dynamoDB locally in Memory and accessable to the library
More help for DynamoDB Local can be found by running
`java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -help`
Or visiting [Here](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html).

##How to Test Lambda Locally with the Package *Lambda-Local*
Run
`lambda-local -l handler.js -e node_modules/lambda-local/event-samples/s3-put.js`
Will run a s3
=======
# csvtodynamodb
>>>>>>> f57723c39804a9882a81721bbb508d50f50b07e6
