export interface RubricItem {
  criterion: string;
  score: number; // Raw score awarded
  maxScore: number; // Maximum score available for this criterion
  performance: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor';
  feedback: string;
}

export interface AuditResult {
  overallGrade: string; // e.g., "High 2:1", "Distinction"
  overallScore: number; // 0 to 100
  summary: string;
  assignmentTaskSummary: string; // New: Extracted core tasks
  rubricContext: string; // New: Extracted rubric summary
  rubricBreakdown: RubricItem[];
  criticalImprovements: string[];
  reachingForTheStars: string[]; // New: Exceptional suggestions
}

export interface InputData {
  type: 'text' | 'file';
  content: string; // Text content or Base64 string
  mimeType?: string; // e.g., 'application/pdf'
  fileName?: string;
}

export interface AppState {
  brief: InputData;
  submission: InputData;
  isAnalyzing: boolean;
  result: AuditResult | null;
  error: string | null;
}