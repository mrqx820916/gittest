export default {
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/meituan',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  saltRounds: 10
} 