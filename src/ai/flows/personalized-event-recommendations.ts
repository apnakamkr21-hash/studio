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
  prompt: `You are an AI assistant designed to provide personalized event recommendations to college students. Your goal is to create a mix of relevance and discovery.

  Based on the student's interests and past activities, recommend a list of 3-5 events.

  - Prioritize events that directly match their interests.
  - Also include one or two "discovery" events that are popular or related to their interests in a less obvious way.
  - Do not recommend events they have already attended (listed in Past Activities).

  Student Profile:
  - Interests: {{interests}}
  - Past Activities (Attended Events): {{pastActivity}}

  Available Events (Do not recommend events not in this list):
  {{#each allEvents}}
  - {{this}}
  {{/each}}

  Please analyze the profile and available events carefully to provide a high-quality, personalized list. Only return the titles of the recommended events from the available list.
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
