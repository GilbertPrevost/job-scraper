import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection class
export class MongoDBConnection {
  private static instance: MongoDBConnection;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DATABASE;

    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    this.client = new MongoClient(uri);
  }

  // Singleton pattern to ensure only one connection
  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  // Connect to the database
  public async connect(): Promise<Db> {
    try {
      await this.client.connect();
      const dbName = process.env.MONGODB_DATABASE;
      
      if (!dbName) {
        throw new Error('Database name is not defined in environment variables');
      }

      this.db = this.client.db(dbName);
      console.log('Successfully connected to MongoDB');
      return this.db;
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }

  // Get the current database connection
  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  // Close the connection
  public async close(): Promise<void> {
    await this.client.close();
    this.db = null;
  }
}

// Example usage function
export async function testMongoDBConnection() {
  try {
    const connection = MongoDBConnection.getInstance();
    const db = await connection.connect();

    // Example: List collections in the database
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Close connection when done
    await connection.close();
  } catch (error) {
    console.error('Connection test failed', error);
  }
}
