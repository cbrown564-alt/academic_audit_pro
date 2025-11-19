import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AuditResult, InputData } from "../types";

// Define the schema for strict JSON output
const rubricSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallGrade: {
      type: Type.STRING,
      description: "The qualitative grade (e.g., 'Distinction', 'High 2:1', 'B+').",
    },
    overallScore: {
      type: Type.INTEGER,
      description: "A weighted total score from 0 to 100 representing the overall quality.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief executive summary of the audit.",
    },
    assignmentTaskSummary: {
      type: Type.STRING,
      description: "A concise summary of the core tasks/questions required by the assignment brief.",
    },
    rubricContext: {
      type: Type.STRING,
      description: "A summary of the grading criteria structure and weightings found in the brief.",
    },
    rubricBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: { type: Type.STRING, description: "Name of the criterion directly from the brief's rubric." },
          score: { type: Type.NUMBER, description: "The raw score awarded for this specific criterion." },
          maxScore: { type: Type.NUMBER, description: "The maximum marks available for this criterion as per the brief. If not specified, default to 100." },
          performance: { type: Type.STRING, enum: ["Excellent", "Good", "Needs Improvement", "Poor"] },
          feedback: { type: Type.STRING, description: "Comprehensive feedback. USE MARKDOWN BOLD (**text**) to highlight the specific reason for the score deduction or success." },
        },
        required: ["criterion", "score", "maxScore", "performance", "feedback"],
      },
    },
    criticalImprovements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific, actionable bullet points. USE BACKTICKS (`variable_name`) for code snippets, file names, or technical terms.",
    },
    reachingForTheStars: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Advanced, optional suggestions to elevate the work to a professional or publication standard (e.g., advanced visualizations, interdisciplinary links).",
    },
  },
  required: ["overallGrade", "overallScore", "summary", "assignmentTaskSummary", "rubricContext", "rubricBreakdown", "criticalImprovements", "reachingForTheStars"],
};

export const analyzeAssignment = async (
  brief: InputData,
  submission: InputData
): Promise<AuditResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: any[] = [];

  // System Instruction / Context
  parts.push({
    text: `You are an expert academic auditor. Your task is to rigorously audit a student submission against an assignment brief/rubric.
    
    STEP 1: ANALYZE THE BRIEF
    - Identify the specific "Core Tasks" the student was asked to do.
    - Identify the "Assessment Rubric" or grading criteria defined in the text.
    - IMPORTANT: Identify the exact weighting/marks available for each section (e.g., "Introduction: 10 marks", "Methodology: 40 marks").

    STEP 2: AUDIT THE SUBMISSION
    - Evaluate the submission specifically against the identified rubric criteria.
    - Assign a raw score based on the maximum marks available for that section (e.g., 7/10, 32/40).
    - Calculate performance level based on the percentage of marks achieved.
    - Provide detailed, constructive feedback for each section. 
    - **CRITICAL**: In the feedback text, bold the key phrase that explains *why* a specific score was given (e.g., "**marks were deducted for lack of citations**" or "**excellent use of vectorization**").
    
    STEP 3: CRITICAL IMPROVEMENTS
    - Identify the top 3-5 issues that are dragging the grade down.
    - Format technical terms, variable names, and file paths using markdown backticks (e.g., \`random_state\`, \`pandas\`).

    STEP 4: REACHING FOR THE STARS
    - Suggest 3 creative or advanced ways to make this submission truly exceptional (e.g., "Use interactive Plotly charts instead of static images", "Compare results with a recent 2024 paper", "Adopt a specific professional style guide"). These are bonus tips.

    Be strict but constructive. Provide a detailed JSON response.`,
  });

  // Add Brief
  parts.push({ text: "\n\n--- ASSIGNMENT BRIEF / RUBRIC ---\n" });
  if (brief.type === 'file' && brief.mimeType) {
    parts.push({
      inlineData: {
        mimeType: brief.mimeType,
        data: brief.content,
      },
    });
  } else {
    parts.push({ text: brief.content });
  }

  // Add Submission
  parts.push({ text: "\n\n--- STUDENT SUBMISSION ---\n" });
  if (submission.type === 'file' && submission.mimeType) {
    parts.push({
      inlineData: {
        mimeType: submission.mimeType,
        data: submission.content,
      },
    });
  } else {
    parts.push({ text: submission.content });
  }

  try {
    // Using gemini-3-pro-preview for complex reasoning tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: rubricSchema,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AuditResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};