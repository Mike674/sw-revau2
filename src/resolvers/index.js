const Room = require('../models/Room');
const Customer = require('../models/Customer');
const Booking = require('../models/Booking');

const resolvers = {
    Query: {
        getRooms: async () => await Room.find(),
        getCustomers: async () => await Customer.find(),
        getBookings: async () => await Booking.find().populate('customer').populate('room'),
    },
    Mutation: {
        createRoom: async (_, { name, type, pricePerNight, features, availability }) => {
            return await Room.create({ name, type, pricePerNight, features, availability });
        },
        createCustomer: async (_, { name, email, phone }) => {
            return await Customer.create({ name, email, phone });
        },
        createBooking: async (_, { customerId, roomId, startDate, endDate }) => {
            const room = await Room.findById(roomId);
            if (!room.availability) {
                throw new Error('Habitacion no disponible.');
            }

            const overlappingBooking = await Booking.findOne({
                room: roomId,
                startDate: { $lt: endDate },
                endDate: { $gt: startDate },
            });

            if (overlappingBooking) {
                throw new Error('La habitacion ya esta reservada en esos dias.');
            }

            const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            if (nights <= 0) {
                throw new Error('La fecha de finalizacion debe de ser porterior a la de inicio.');
            }

            const basePrice = nights * room.pricePerNight;
            const totalPrice = nights > 7 ? basePrice * 0.9 : basePrice;

            const booking = await Booking.create({
                customer: customerId,
                room: roomId,
                startDate,
                endDate,
                nights,
                totalPrice,
                status: 'pending',
            });

            room.availability = false;
            await room.save();

            // Recupera el documento de la base de datos y haz populate:
            const populatedBooking = await Booking.findById(booking._id)
                .populate("customer")
                .populate("room");

            return populatedBooking;
        },
        updateBooking: async (_, { id, status }) => {
            const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true }).populate('customer').populate('room');
            if (!booking) {
                throw new Error('Reservacion no encontrada.');
            }
            return booking;
        },
        deleteBooking: async (_, { id }) => {
            const booking = await Booking.findById(id);
            if (!booking) {
                throw new Error('Reservacion no encontrada.');
            }

            const room = await Room.findById(booking.room);
            room.availability = true;
            await room.save();

            await Booking.findByIdAndDelete(id);
            return true;
        },
    },
};

module.exports = resolvers;
