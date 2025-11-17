import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env");
}

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  // Extend the global type to include mongoose cache
  var mongooseCache: MongooseCache | undefined;
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached: MongooseCache;

if (!global.mongooseCache) {
  cached = global.mongooseCache = { conn: null, promise: null };
} else {
  cached = global.mongooseCache;
}

export async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
    };
    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB");
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("❌ MongoDB connection error:", error.message);
        
        // Provide helpful error messages for common issues
        if (error.message?.includes("IP") || error.message?.includes("whitelist")) {
          console.error("\n🔒 IP Whitelist Issue Detected!");
          console.error("To fix this:");
          console.error("1. Go to MongoDB Atlas Dashboard");
          console.error("2. Navigate to Network Access");
          console.error("3. Add your current IP address (or 0.0.0.0/0 for all IPs - less secure)");
          console.error("4. Wait a few minutes for changes to propagate");
        } else if (error.message?.includes("authentication")) {
          console.error("\n🔑 Authentication Issue Detected!");
          console.error("Check your MONGODB_URI connection string - verify username and password");
        } else if (error.message?.includes("ENOTFOUND") || error.message?.includes("DNS")) {
          console.error("\n🌐 DNS/Network Issue Detected!");
          console.error("Check your internet connection and MongoDB Atlas cluster status");
        }
        
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
