export interface ExamListItem {
  id: number;
  title: string;
  subject_name: string;
  duration_minutes: number;
  status: 'draft' | 'active' | 'completed';
  starts_at: string | null;
  ends_at: string | null;
  questions_count: number;
  attempt: {
    id: number;
    status: 'in_progress' | 'submitted' | 'graded';
    score: number | null;
  } | null;
}

export interface AnswerOption {
  id: number;
  option_text: string;
  sort_order: number;
}

export interface Question {
  id: number;
  prompt: string;
  type: 'multiple_choice' | 'essay';
  points: number;
  sort_order: number;
  explanation: string | null;
  answer_options: AnswerOption[];
}

export interface Exam {
  id: number;
  subject: { id: number; name: string };
  class: { id: number; name: string };
  title: string;
  instructions: string | null;
  duration_minutes: number;
  starts_at: string | null;
  ends_at: string | null;
  status: 'draft' | 'active' | 'completed';
  questions_count: number;
  questions: Question[];
  attempt: ExamAttempt | null;
}

export interface ExamResponse {
  id: number;
  question_id: number;
  answer_option_id: number | null;
  response_text: string | null;
}

export interface ExamAttempt {
  id: number;
  exam_id: number;
  started_at: string;
  submitted_at: string | null;
  status: 'in_progress' | 'submitted' | 'graded';
  score: number | null;
  responses: ExamResponse[];
  feedback: string | null;
}

export interface StartExamPayload {
  access_code?: string;
}

export interface SaveResponsePayload {
  question_id: number;
  answer_option_id?: number | null;
  response_text?: string | null;
}
