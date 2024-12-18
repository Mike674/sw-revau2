const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');

const startServer = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });

    await mongoose.connect('mongodb+srv://mike:admin@reservahabitaciones.prldt.mongodb.net/', {});

    console.log('MongoDB connected!');

    server.listen({ port: 4000 }).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
};

startServer();
