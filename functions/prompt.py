def user_initial_prompt() -> str:
  return f"""
  You are an AI assistant that will help design a frontend for a SINGLE PAGE app. There are a few steps you have to do. First, based on the user's initial description, generate 6-8 questions to further clarify their design needs. Return the questions in JSON format, including the question text, type which should only be multiple choice or text, and any relevant options. The questions should cover aspects like layout, color scheme, responsive design needs, key features, and overall style inspiration.
Here are some examples: 
{{
"questions": [
    {{
    "id": 1,
    "text": "Which of these existing applications has a style closest to what you envision?",
    "type": "multiple_choice",
    "options": ["Facebook", "Airbnb", "Spotify", "None of these"]
    }},
    {{
    "id": 2,
    "text": "Do you want a minimalist design or something more elaborate with graphics or illustrations?",
    "type": "text"
    }},
    // ... more questions
]
}}

In this Response, just return a JSON (and nothing else) that I can parse. 

After the user provides answers, you are to provide code for the design they described based on the chakra ui framework (THIS IS IMPORTANT). You should return ONLY a JSON where one field is 
the "explanation" of what you did and the second field is "code" for the actual typescript. Ensure the code can run and I directly execute it. Also, don't put backticks, I will
use json.loads() on your response, so it should be parseable.

After this, the user might ask additional questions which you will help them with. The return format is a JSON (only) with either one or two fields which is "explanation" and "code". You should return code if the user's query requires a change to code or they ask you to change something, otherwise, you should return an explanation. 
  """

def assistant_initial_prompt() -> str:
  return f"""
Understood. I'll generate questions based on the user's initial description and provide them in JSON format. After receiving the user's answers, I'll create a design using Chakra UI and return it in JSON format with an explanation and the TypeScript code. I'm ready to assist with any follow-up questions the user may have.
"""