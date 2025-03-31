import { z } from "zod";

// export const maxAnswerLength = 16;
// export const maxQuestionLength = 160;

export const typicalAvailableSurvey: AvailableSurvey = {
  uuid: "41a78253-d791-4959-93c8-5e36755b9010",
  title: "", // TODO: Does an empty title mean anything? I've seen it on a survey that simply returns an empty array of questions, so maybe it's an indicator of a non-existent survey
  reward: 5,
  responded: false,
};

export const mySurveys: AvailableSurveys = [typicalAvailableSurvey];

export const typicalSurveyQuestions: SurveyQuestions = [
  {
    uuid: "2109fa7e-510f-4a9f-b9c7-1dce77c28184",
    question_type: "mcsa", // Multiple-Choice, Single-Answer
    prompt: "How are you feeling today?",
    alternatives: ["Good", "Bad"],
  },
  {
    uuid: "20182594-8a69-4f98-8cbb-f214b8d38b4b",
    question_type: "mcsa", // Multiple-Choice, Single-Answer
    prompt: "What flavor of cookie should we make more of?",
    alternatives: ["Chocolate Chip", "Oatmeal Raisin", "Peanut Butter", "Jalapeño Fire"],
  },
  {
    uuid: "20182594-8a69-4f98-8cbb-f214b8d38b4b",
    question_type: "mcma", // Multiple-Choice, Multiple-Answer
    prompt: "Which flavors of cookie should we destroy?",
    alternatives: ["Chocolate Chip", "Oatmeal Raisin", "Peanut Butter", "Jalapeño Fire"],
  },
];

const AvailableSurveySchema = z.object({
  uuid: z.string(),
  title: z.string(),
  reward: z.number(),
  responded: z.boolean(),
});

export type AvailableSurvey = z.infer<typeof AvailableSurveySchema>;

export const AvailableSurveysSchema = z.array(AvailableSurveySchema);
export type AvailableSurveys = z.infer<typeof AvailableSurveysSchema>;

const SurveyQuestionCommonSchema = z.object({
  question_type: z.string(),
  prompt: z.string(),
  alternatives: z.array(z.string()),
});

export const SurveyQuestionSchema = SurveyQuestionCommonSchema.extend({
  uuid: z.string(),
});
export type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;

export const SurveyQuestionsSchema = z.array(SurveyQuestionSchema);
export type SurveyQuestions = z.infer<typeof SurveyQuestionsSchema>;

// interface SurveyQuestion {
//   data: {
//     uuid: string;
//     prompt: string;
//     alternatives: string[];
//   }[];
// }
