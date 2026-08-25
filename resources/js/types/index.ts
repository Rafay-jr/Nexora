export type UserRole = 'visitor' | 'participant' | 'organizer' | 'admin';
export type AccountStatus = 'active' | 'suspended';
export type EventCategory = 'technical' | 'cultural' | 'sports' | 'workshop' | 'seminar' | 'competition';
export type EventStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type RegistrationStatus = 'confirmed' | 'cancelled' | 'waitlist';

export interface UserDetail {
  id: number;
  user_id: number;
  full_name: string;
  mobile?: string;
  department?: string;
  enrollment_no?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  detail?: UserDetail;
  created_at?: string;
}

export interface Event {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  category: EventCategory;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  max_participants: number;
  status: EventStatus;
  approval_status: ApprovalStatus;
  registration_deadline: string;
  cancellation_reason?: string;
  organizer?: User;
  confirmed_registrations?: number;
  available_seats?: number;
  is_full?: boolean;
  registrations_count?: number;
  attendances_count?: number;
  feedback_count?: number;
  feedback?: Feedback[];
  media?: MediaGallery[];
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: number;
  event_id: number;
  student_id: number;
  registered_at: string;
  status: RegistrationStatus;
  qr_code_token: string;
  event?: Event;
  student?: User;
}

export interface Attendance {
  id: number;
  event_id: number;
  student_id: number;
  attended: boolean;
  marked_at: string;
  marked_by: number;
  event?: Event;
  student?: User;
}

export interface Feedback {
  id: number;
  event_id: number;
  student_id: number;
  rating: number;
  venue_rating?: number;
  coordination_rating?: number;
  technical_rating?: number;
  hospitality_rating?: number;
  comments?: string;
  submitted_at: string;
  event?: Event;
  student?: User;
}

export interface Certificate {
  id: number;
  event_id: number;
  student_id: number;
  certificate_url: string;
  fee_paid: boolean;
  issued_at: string;
  event?: Event;
  student?: User;
}

export interface MediaGallery {
  id: number;
  event_id?: number;
  uploaded_by: number;
  file_type: 'image' | 'video';
  file_url: string;
  caption?: string;
  category: string;
  department?: string;
  year?: number;
  event?: Event;
  uploader?: User;
  created_at: string;
}

export interface EventWaitlist {
  id: number;
  event_id: number;
  user_id: number;
  waitlist_time: string;
  status: 'waiting' | 'confirmed' | 'cancelled';
  event?: Event;
  user?: User;
}

export interface CalendarSync {
  id: number;
  user_id: number;
  event_id: number;
  calendar_type: 'google' | 'outlook' | 'apple';
  ics_reference?: string;
  synced_at: string;
}

export interface NotificationItem {
  id: number;
  user_id?: number;
  target_role?: string;
  title: string;
  message: string;
  type: string;
  read_at?: string;
  created_at: string;
}

export interface BookmarkItem {
  id: number;
  user_id: number;
  event_id: number;
  event: Event;
}

export interface SavedMediaItem {
  id: number;
  user_id: number;
  media_id: number;
  media: MediaGallery;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  total: number;
}
