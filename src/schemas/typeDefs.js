const { gql } = require('apollo-server');

const typeDefs = gql`
  enum RoomType {
    single
    double
    suite
  }

  enum BookingStatus {
    pending
    confirmed
    cancelled
  }

  type Room {
    _id: ID!
    name: String!
    type: RoomType!
    pricePerNight: Float!
    features: [String!]!
    availability: Boolean!
  }

  type Customer {
    _id: ID!
    name: String!
    email: String!
    phone: String!
  }

  type Booking {
    _id: ID!
    customer: Customer!
    room: Room!
    startDate: String!
    endDate: String!
    nights: Int!
    totalPrice: Float!
    status: BookingStatus!
  }

  type Query {
    getRooms: [Room!]!
    getCustomers: [Customer!]!
    getBookings: [Booking!]!
  }

  type Mutation {
    createRoom(name: String!, type: RoomType!, pricePerNight: Float!, features: [String!]!, availability: Boolean!): Room!
    createCustomer(name: String!, email: String!, phone: String!): Customer!
    createBooking(customerId: ID!, roomId: ID!, startDate: String!, endDate: String!): Booking!
    updateBooking(id: ID!, status: BookingStatus!): Booking!
    deleteBooking(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
