export interface Excuse {
  id: number;
  type: 'sick' | 'permission' | 'other';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  excused_date: string;
  review_notes: string | null;
  reviewed_by: {
    id: number;
    name: string;
  } | null;
  attendance_record?: {
    id: number;
    status: string;
    scanned_at: string | null;
  } | null;
  created_at: string;
}

export interface CreateExcuseRequest {
  type: 'sick' | 'permission' | 'other';
  reason: string;
  excused_date: string;
  attendance_record_id?: number | null;
}
