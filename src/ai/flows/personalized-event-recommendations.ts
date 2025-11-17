'use server';

/**
 * @fileOverview Provides personalized event recommendations based on student interests and past activity.
 *
 * - getPersonalizedEventRecommendations - A function that returns personalized event recommendations.
 * - PersonalizedEventRecommendationsInput - The input type for the getPersonalizedEventRecommendations function.
 * - PersonalizedEventRecommendationsOutput - The return type for the getPersonalizedEventRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEventRecommendationsInputSchema = z.object({
  studentId: z.string().describe('The ID of the student for whom to generate recommendations.'),
  interests: z.array(z.string()).describe('The interests of the student.'),
  pastActivity: z.array(z.string()).describe('The student\'s past activities, such as events attended.'),
  allEvents: z.array(z.string()).describe('A list of all available events on campus.'),
});
export type PersonalizedEventRecommendationsInput = z.infer<typeof PersonalizedEventRecommendationsInputSchema>;

const PersonalizedEventRecommendationsOutputSchema = z.object({
  recommendedEvents: z.array(z.string()).describe('A list of event IDs recommended for the student.'),
});
export type PersonalizedEventRecommendationsOutput = z.infer<typeof PersonalizedEventRecommendationsOutputSchema>;

export async function getPersonalizedEventRecommendations(input: PersonalizedEventRecommendationsInput): Promise<PersonalizedEventRecommendationsOutput> {
  return personalizedEventRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEventRecommendationsPrompt',
  input: {schema: PersonalizedEventRecommendationsInputSchema},
  output: {schema: PersonalizedEventRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized event recommendations to college students.

  Based on a student's interests, past activities, and all available events, you will provide the best event recommendations.

  Interests: {{interests}}
  Past Activities: {{pastActivity}}
  All Events: {{allEvents}}

  Please recommend events that align with the student's interests and past activities. Only return the names of events that are available.
  Return the event recommendations in JSON format.
  `,
});

const personalizedEventRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedEventRecommendationsFlow',
    inputSchema: PersonalizedEventRecommendationsInputSchema,
    outputSchema: PersonalizedEventRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
