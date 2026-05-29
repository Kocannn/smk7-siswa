export interface AttendanceRecord {
  id: number;
  status: 'present' | 'late' | 'absent' | 'excused' | 'bolos';
  scanned_at: string | null;
  session: AttendanceSession;
}

export interface AttendanceSession {
  type: string;
  subject: string | null;
  starts_at: string | null;
  ends_at: string | null;
}

export interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  absent: number;
}

export interface AttendanceResponse {
  records: PaginatedData<AttendanceRecord>;
  stats: AttendanceStats;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
