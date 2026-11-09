export interface InterviewQuestion {
  id: string;
  category: 'hr' | 'it' | 'accounting' | 'civilService' | 'unrwa' | 'engineering' | 'all';
  categoryName: string;
  institutionTarget: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  title: string;
  context: string;
  modelAnswer: string;
  evaluatorAdvice: string;
  commonMistakes: string;
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface ExamPaperSummary {
  id: string;
  title: string;
  institution: string;
  institutionTag: string;
  field: string;
  durationMinutes: number;
  passingScorePercentage: number;
  badgeColor: string;
  icon: string;
  description: string;
  questionsCount: number;
}

export interface ExamPaperDetail extends ExamPaperSummary {
  questions: ExamQuestion[];
}

export interface ExamBreakdownItem {
  questionId: string;
  questionText: string;
  options: string[];
  userAnswerIndex: number | null;
  userAnswerText: string;
  correctAnswerIndex: number;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ExamSubmitResult {
  examId: string;
  examTitle: string;
  institution: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  scorePercentage: number;
  passingScorePercentage: number;
  hasPassed: boolean;
  evaluationFeedback: string;
  submittedAt: string;
  breakdown: ExamBreakdownItem[];
}

export interface InstitutionTipsMap {
  civilService?: {
    name: string;
    tips: string[];
  };
  unrwa?: {
    name: string;
    tips: string[];
  };
  banks?: {
    name: string;
    tips: string[];
  };
  tech?: {
    name: string;
    tips: string[];
  };
  [key: string]: any;
}
