export interface NewRequestProps {
  title: string;
  amount: string;
  status?: string;
  user_id?: string;
}

export interface PaymentTypes {
  id: string;
  title: string;
  amount: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user_profiles: {
    id: string;
    email: string;
  };
}
