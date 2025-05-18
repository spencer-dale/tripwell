'use server';

import { createDestination, updateDestination, deleteDestination } from '../db/destinations';
import { DestinationFormState } from '../../ui/trip/destination-form/types';
import { Destination } from '../types';

export async function handleCreateDestination(tripId: string, data: DestinationFormState) {
  try {
    // Convert form state to destination format
    const destinationData: Partial<Destination> = {
      start_date: data.start_date,
      end_date: data.end_date,
      country: data.country,
      city: data.city,
      region: data.region,
      accommodation: {
        name: data.accommodation.name,
        type: data.accommodation.type,
        address: data.accommodation.address,
        total_cost: data.accommodation.cost,
        currency: data.accommodation.currency
      }
    };
    const destination = await createDestination(tripId, destinationData);
    return { success: true, data: destination };
  } catch (error) {
    console.error('Error creating destination:', error);
    return { success: false, error: 'Failed to create destination' };
  }
}

export async function handleUpdateDestination(destinationId: string, data: DestinationFormState) {
  console.log('Updating destination:', destinationId, data);
  try {
    // Convert form state to destination format
    const destinationData: Partial<Destination> = {
      start_date: data.start_date,
      end_date: data.end_date,
      country: data.country,
      city: data.city,
      region: data.region,
      accommodation: {
        name: data.accommodation.name,
        type: data.accommodation.type,
        address: data.accommodation.address,
        total_cost: data.accommodation.cost,
        currency: data.accommodation.currency
      }
    };
    const destination = await updateDestination(destinationId, destinationData);
    if (!destination) {
      return { success: false, error: 'Destination not found' };
    }
    return { success: true, data: destination };
  } catch (error) {
    console.error('Error updating destination:', error);
    return { success: false, error: 'Failed to update destination' };
  }
}

export async function handleDeleteDestination(destinationId: string) {
  try {
    const success = await deleteDestination(destinationId);
    if (!success) {
      return { success: false, error: 'Destination not found' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting destination:', error);
    return { success: false, error: 'Failed to delete destination' };
  }
} 