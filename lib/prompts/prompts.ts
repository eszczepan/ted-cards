import { getLanguage } from "../utils";
import { CreateGenerationCommand } from "@/types";

export const generateFlashcardsPrompt = (options: CreateGenerationCommand) => {
  const { source_text, front_language, back_language, count, cefr_level } = options;

  const frontLanguage = getLanguage(front_language);
  const backLanguage = getLanguage(back_language);
  const generationCount = count ? `Create exactly ${count} flashcards. ` : "";
  const generationDifficulty = cefr_level ? `Focus on ${cefr_level} difficulty level. ` : "";

  return `
    You are tasked with generating flashcards from a given text. Your goal is to extract the most useful and practical vocabulary, phrasal verbs, and phrases from the text and create flashcards that will help language learners improve their skills.

    Here is the text you will be working with:

    <text>
    ${source_text}
    </text>

    To complete this task, follow these steps:

    1. Carefully read through the text and identify important vocabulary words, phrasal verbs, and phrases that would be valuable for language learners. Focus on items that are:
    - Frequently used in the language
    - Essential for understanding the main ideas of the text
    - Likely to be unfamiliar to learners at various levels

    2. For each identified item, create a flashcard using the following structure:
    - Front content: The word, phrasal verb, or phrase in ${frontLanguage}
    - Back content: 
        a) An exact translation in ${backLanguage}
        b) An example sentence using the item in ${frontLanguage}

    3. Assign a CEFR (Common European Framework of Reference for Languages) level to each flashcard. Use your best judgment based on the complexity and usage frequency of the item. The levels are:
    - A1: Beginner
    - A2: Elementary
    - B1: Intermediate
    - B2: Upper Intermediate
    - C1: Advanced
    - C2: Proficiency

    4. Format your output as a JSON object with the following structure:

    {
    "flashcards": [
        {
        "front_content": "...",
        "back_content": "...",
        "cefr_level": "..."
        },
        ...
    ]
    }

    Ensure that your output strictly adheres to this JSON schema. The "flashcards" array should contain multiple flashcard objects, each with "front_content", "back_content", and "cefr_level" properties.

    Here's an example of how a single flashcard in your output might look:

    {
    "flashcards": [
        {
            "front_content": "fast-paced",
            "back_content": "Szybko zmieniający się, dynamiczny \nExample: Living in a fast-paced city can be both exciting and stressful.",
            "cefr_level": "B1"
        },
        {
            "front_content": "search for",
            "back_content": "Szukać, poszukiwać \nExample: Many people search for meaning in their everyday lives.",
            "cefr_level": "A2"
        },
    ]
    }

    Create as many flashcards as you deem appropriate based on the content of the text. Aim for a minimum of 5 flashcards and a maximum of 20, depending on the length and complexity of the text.

    Remember to focus on quality over quantity. Choose items that will be most beneficial for language learners and provide clear, concise, and accurate translations and examples.
    ${generationCount} ${generationDifficulty}
`;
};
