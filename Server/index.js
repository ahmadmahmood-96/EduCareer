require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const io = require('socket.io')(8000, {
  pingTimeout: 6000,
  cors: {
    origin: 'http://localhost:5173',
  },
});
const connection = require('./db');
const bodyParser = require('body-parser');

// Import routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const passwordResetRoutes = require('./routes/resetpassword');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const profileRoutes = require('./routes/profile');
const ModuleRoute = require('./routes/module');
const AssRoute = require('./routes/Assignmnet');
const courseDetailsRoutes = require('./routes/coursedetails');
const accesscontentRoutes = require('./routes/accesscontent');
const uploadAssignmentRoutes = require('./routes/UploadAssignment');
const logoutRoutes = require('./routes/logout');
const ExpelRoute = require('./routes/Expel');
const CartRoute = require('./routes/cart');
const ComRoute = require('./routes/Conversation');
const MessageRoute = require('./routes/Message');
const stripe = require('./routes/stripewebhook')
const MeetingRoute=require('./routes/meeting')
const quizRoute=require('./routes/quiz')
const quizdetailRoute=require ('./routes/dissemination')
const displayQuizRoute=require('./routes/displayquiz')
const quizScoreRoute=require('./routes/quizscore')
const orderRoutes=require('./routes/orders')
const supportRoute=require('./routes/support');
const adminRoute = require('./routes/admin')
// Database connection
connection();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/profilepictures', express.static('profilepictures'));
app.use('/files', express.static('files'));
app.use('/subfiles', express.static('subfiles'));
app.use('/modules', express.static('modules'));
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/expel', ExpelRoute);
app.use('/api', courseDetailsRoutes);
app.use('/api', accesscontentRoutes);
app.use('/api', uploadAssignmentRoutes);
app.use('/api', CartRoute);
app.use('/api', profileRoutes);
app.use('/', ModuleRoute);
app.use('/', AssRoute);
app.use('/', MessageRoute);
app.use('/', ComRoute);
app.use('/api/logout', logoutRoutes);
app.use('/api/stripe', stripe)
app.use("/api",MeetingRoute);
app.use("/api",quizRoute);
app.use("/api",quizdetailRoute);
app.use("/api",quizScoreRoute);
app.use("/api",displayQuizRoute);
app.use("/api",orderRoutes);
app.use('/api',supportRoute);
app.use('/api',adminRoute);

let users = [];

io.on('connection', socket => {
 // console.log('User socket Connected', socket.id);

  socket.on('addUser', ({ senderId, receiverId }) => {
    const isSenderExist = users.find(user => user.userId === senderId);
    const isReceiverExist = users.find(user => user.userId === receiverId);

    if (!isSenderExist) {
      const sender = { userId: senderId, socketId: socket.id };
      users.push(sender);
      io.emit('getUsers', users);
    }

    if (!isReceiverExist) {
      const receiver = { userId: receiverId, socketId: socket.id };
      users.push(receiver);
      io.emit('getUsers', users);
    }
  });

  socket.on('sendMessage', ({ senderId, receiverId, message, conversationId }) => {
    console.log('Sender ID:', senderId);
    const receiver = users.find(user => user.userId === receiverId);
    const sender = users.find(user => user.userId === senderId);
    console.log('Receiver:', receiver);
    console.log('Sender:', sender);

    if (receiver && sender) {
      io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
        senderId,
        message,
        conversationId,
        receiverId,
      });
      console.log('Message sent successfully!');
    } else {
      console.log('Failed to send message. Receiver or sender not found.');
    }
  });
});

// Port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening on port ', port);
});