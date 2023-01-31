const graphql = require('graphql');
const { pathToArray } = require('graphql/jsutils/Path');
const {GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema} = graphql;
const _ = require('lodash');

const Author = require('../Models/author');
const Book = require('../Models/book');

var books = [
    {id:"1",name:'Hello SciFi',genre:"Scifi",authorId:"1"},
    {id:"2",name:'Hello Comic',genre:"Comic",authorId:"2"},
    {id:"3",name:'Hello Adventure',genre:"Adventure",authorId:"2"}
]

var authors = [
    {id:"1",name:'Ram',age:12},
    {id:"2",name:'Sita',age:45},
    {id:"3",name:'Raman',age:42}
]

const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                return Author.findById(parent.authorId); 
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:graphql.GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                console.log(parent.id);
                // return _.filter(books,{authorId:parent.id})
                return Book.find({authorId:parent.id});
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){ 
                // return _.find(books,{id:args.id});
                return Book.findById(args.id);
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){ 
                // return _.find(authors,{id:args.id});
                return Author.findById(args.id);
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({});
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            resolve(parent,args){
                return Author.find({});
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            resolve(parent,args){
                let author = new Author({
                    name:args.name,
                    age:args.age
                })
                author.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{type:GraphQLString},
                genre:{type:GraphQLString},
                authorId:{type:GraphQLString}
            },
            resolve(parent,args){
                let author = new Book({
                    name:args.name,
                    genre:args.genre,
                    authorId:args.authorId
                })
                author.save();
            }
        }
    }
})

module.exports = new graphql.GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
    
})