const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const app = express();
const cors = require('cors');
const schema = require('./schema/schema');
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://test:1234@gql-cluster.3ipfgax.mongodb.net/?retryWrites=true&w=majority").then(
    ()=>{
        console.log("connected")
    }
).catch((err)=>{
    console.log(err)
});

app.use(cors());
app.use('/graphql',graphqlHTTP({
schema,
graphiql:true
}));

app.listen(process.env.PORT||3000,()=>{
    console.log("server started");
})