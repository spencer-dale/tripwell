import { connectDb } from './conn';
import { Transport as TransportType, CreateTransportInput, UpdateTransportInput } from '../types/transport';
import { v4 as uuidv4 } from 'uuid';
import { Document } from 'mongoose';
import { Transport } from './schemas/transport';

// Helper type to ensure lean documents match our Transport interface
type TransportDocument = Document & TransportType;

export async function createTransport(input: CreateTransportInput): Promise<TransportType> {
  const db = await connectDb();
  if (!db) throw new Error('Database connection failed');

  const transport = new Transport({
    transport_id: uuidv4(),
    ...input,
  });

  await transport.save();
  return transport.toObject() as TransportType;
}

export async function getTransportById(transportId: string): Promise<TransportType | null> {
  const db = await connectDb();
  if (!db) throw new Error('Database connection failed');

  const transport = await Transport.findOne({ transport_id: transportId }).lean();
  return transport as TransportType | null;
}

export async function getTransportsByTripId(tripId: string): Promise<TransportType[]> {
  const db = await connectDb();
  if (!db) throw new Error('Database connection failed');

  const transports = await Transport.find({ trip_id: tripId })
    .sort({ departure_time: 1 })
    .lean<TransportDocument[]>();
  return transports;
}

export async function updateTransport(
  transportId: string,
  input: UpdateTransportInput
): Promise<TransportType | null> {
  const db = await connectDb();
  if (!db) throw new Error('Database connection failed');

  const transport = await Transport.findOneAndUpdate(
    { transport_id: transportId },
    { $set: input },
    { new: true }
  ).lean<TransportDocument>();

  return transport;
}

export async function deleteTransport(transportId: string): Promise<boolean> {
  const db = await connectDb();
  if (!db) throw new Error('Database connection failed');

  const result = await Transport.deleteOne({ transport_id: transportId });
  return result.deletedCount === 1;
}

export async function getTransportsBetweenDestinations(
  fromDestinationId: string,
  toDestinationId: string
): Promise<TransportType[]> {
  const db = await connectDb();
  if (!db) throw new Error('Database connection failed');

  const transports = await Transport.find({
    from_destination_id: fromDestinationId,
    to_destination_id: toDestinationId,
  })
    .sort({ departure_time: 1 })
    .lean<TransportDocument[]>();

  return transports;
} 