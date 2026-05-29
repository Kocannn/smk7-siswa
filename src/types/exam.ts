export interface Exam {
  id: number;
  title: string;
  subject: string | null;
  duration_minutes: number;
  starts_at: string | null;
  ends_at: string | null;
  status: string;
  attempt: ExamAttempt | null;
  can_start: boolean;
  has_access_code: boolean;
}

export interface ExamAttempt {
  id: number;
  status: 'in_progress' | 'submitted';
  started_at: string;
  submitted_at: string | null;
  score: number | null;
}

export interface ExamDetail {
  exam: {
    id: number;
    title: string;
    subject: string | null;
    duration_minutes: number;
    starts_at: string | null;
    ends_at: string | null;
    status: string;
  };
  attempt: ExamAttempt;
  questions: Question[];
}

export interface Question {
  id: number;
  prompt: string;
  type: 'multiple_choice' | 'essay';
  points: number;
  sort_order: number;
  answer_options: AnswerOption[];
  response: QuestionResponse | null;
}

export interface AnswerOption {
  id: number;
  option_text: string;
  sort_order: number;
}

export interface QuestionResponse {
  answer_option_id: number | null;
  response_text: string | null;
}
