export type DatabaseType = 'sybase' | 'oracle';

export interface DatabaseConnection {
  type: DatabaseType;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  connectionString?: string;
}

export interface CodeFile {
  id: string;
  name: string;
  content: string;
  type: 'table' | 'procedure' | 'trigger' | 'other';
  status?: 'pending' | 'converting' | 'success' | 'error';
}

export interface ConversionResult {
  id: string;
  originalFile: CodeFile;
  aiGeneratedCode: string; // Original AI-generated Oracle code
  convertedCode: string;
  issues: ConversionIssue[];
  dataTypeMapping?: DataTypeMapping[];
  performance?: PerformanceMetrics;
  status: 'success' | 'warning' | 'error';
  explanations?: string[];
}

export interface ConversionIssue {
  id: string;
  lineNumber?: number;
  description: string;
  severity: 'info' | 'warning' | 'error';
  suggestedFix?: string;
  originalCode?: string;
}

export interface DataTypeMapping {
  sybaseType: string;
  oracleType: string;
  description?: string;
}

export interface PerformanceMetrics {
  originalComplexity?: number;
  convertedComplexity?: number;
  improvementPercentage?: number;
  conversionTimeMs?: number;
  performanceScore?: number;
  maintainabilityIndex?: number;
  codeQuality?: {
    totalLines: number;
    codeLines: number;
    commentRatio: number;
    complexityLevel: 'Low' | 'Medium' | 'High';
  };
  // Enhanced metrics for performance analysis
  linesReduced?: number;
  loopsReduced?: number;
  originalLines?: number;
  convertedLines?: number;
  originalLoops?: number;
  convertedLoops?: number;
  recommendations?: string[];
  notes?: string[];
  // Add scalabilityMetrics for dashboard and file breakdown
  scalabilityMetrics?: {
    bulkOperationsUsed: boolean;
    bulkCollectUsed: boolean;
    modernOracleFeaturesCount: number;
    scalabilityScore: number;
    maintainabilityScore: number;
  };
}

export interface ConversionReport {
  timestamp: string;
  filesProcessed: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
  results: ConversionResult[];
  summary: string;
}

export type ConversionStep = 'connection' | 'upload' | 'review' | 'report';

// Re-export unreviewed files types
export * from './unreviewedFiles';

// Re-export chatbot types
export * from './chatbot';

// Re-export comment types
export * from './comments';

// Re-export rewrite prompts types
export * from './rewritePrompts';
