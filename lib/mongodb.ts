import { MongoClient, type Collection, type Db, type Document } from "mongodb";

export type PulseUser = {
  name: string;
  email: string;
  passwordHash: string;
  workspaceName: string;
  emailVerified: boolean;
  role: "owner";
  createdAt: Date;
  updatedAt: Date;
};

export type VerificationCode = {
  email: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
};

let clientPromise: Promise<MongoClient> | null = null;
let indexesReady: Promise<void> | null = null;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  return uri;
}

export function getMongoClient() {
  if (!clientPromise) {
    const client = new MongoClient(getMongoUri());
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db();
}

async function collection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

export async function getUsersCollection() {
  await ensureIndexes();
  return collection<PulseUser>("users");
}

export async function getVerificationCodesCollection() {
  await ensureIndexes();
  return collection<VerificationCode>("verificationCodes");
}

export async function ensureIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();

      await Promise.all([
        db.collection<PulseUser>("users").createIndex({ email: 1 }, { unique: true }),
        db.collection<VerificationCode>("verificationCodes").createIndex({ email: 1 }, { unique: true }),
        db
          .collection<VerificationCode>("verificationCodes")
          .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      ]);
    })();
  }

  return indexesReady;
}
