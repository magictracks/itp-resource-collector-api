# ITP Resource Collector API

This is a repo for the backend server, db, and api for the [itp-resource-collector].

It is a general purpose REST API for serving up data, submiting resources, and handling user auth.

## Setup
In the following order...

1. Install the dependencies. **In terminal windown #1**
```
npm install
```

2. Run Mongodb. **In terminal windown #2**
```
mongod
```


3. Load up some data. **In terminal windown #1**
```
npm run importCodingTrain2Mongo
```

4. Run the server
```
npm start
```

5. Test a request
```
# Retrieves a list of all the coding train tags
curl -i http://127.0.0.1:5000/api/tags
```
