export interface User {
  email: string;
  password: string;
}

export interface Patient {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  birthday: string;
  address: string;
  snils: string;
}

export interface MyTokenPayload {
  role_id: number;
  user_id: number;
}

export interface Appointment {
  appoint_id: number;
  created_at: string;
  date: string;
  doctor_name: string;
  end_time: string;
  problem_description: string;
  specialty: string;
  start_time: string;
  status: boolean;
}

export interface AppointmentCreationRequest {
  scheduleId: string;
  problemDescription: string;
}

export interface Doctor {
  doctor_id: number;
  name: string;
  specialty: string;
}

export interface Schedule {
  schedule: any;
  schedule_id: number;
  doctor_id: number;
  date: Date;
  start_time:string;
  end_time: string;
  is_booked: boolean;
}


export interface Receipt {
  receipt_id: number;
  issue_date: string; // Дата выдачи рецепта
  expiry_date: string; // Дата истечения срока действия рецепта
  description: string; // Описание рецепта
  medication_name: string; // Название лекарства
  medication_qr: string; // QR-код лекарства, если применимо
  quantity: number; // Количество выписанного лекарства
  dosage: string; // Дозировка лекарства
}




