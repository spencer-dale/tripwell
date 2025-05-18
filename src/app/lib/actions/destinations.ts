'use server';

import { createDestination, updateDestination, deleteDestination } from '../db/destinations';
import { DestinationFormState } from '../../ui/trip/destination-form/types';

export async function handleCreateDestination(tripId: string, data: DestinationFormState) {
  try {
    const destination = await createDestination(tripId, data);
    return { success: true, data: destination };
  } catch (error) {
    console.error('Error creating destination:', error);
    return { success: false, error: 'Failed to create destination' };
  }
}

export async function handleUpdateDestination(destinationId: string, data: DestinationFormState) {
  console.log('Updating destination:', destinationId, data);
  try {
    const destination = await updateDestination(destinationId, data);
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