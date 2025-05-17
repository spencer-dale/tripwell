import { Accommodation, AccommodationType } from '@/src/app/lib/types';

export interface DestinationFormState {
  id?: string;
  start_date: Date;
  end_date: Date;
  country: string;
  city?: string;
  region?: string;
  accommodation: {
    name: string;
    type: AccommodationType;
    address: string;
    cost: number;
    currency: string;
  };
}

export interface DestinationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DestinationFormState) => void;
  initialData?: DestinationFormState;
} 