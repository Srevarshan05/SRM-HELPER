
import fetch from 'node-fetch';

// This is the main function that Vercel will run when your frontend calls /api/chat
export default async function handler(request, response) {
    // 1. Check if the request is a POST request (your frontend will send a POST)
    if (request.method !== 'POST') {
        // If not POST, send an error response
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Get the Groq API Key from Vercel's Environment Variables
    //    process.env.YOUR_VARIABLE_NAME is how Node.js accesses environment variables.
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        // If the API key isn't set (e.g., you forgot to add it in Vercel settings)
        return response.status(500).json({ error: 'Server configuration error: API key not set.' });
    }

    // 3. Extract the user's message sent from your frontend
    //    The frontend will send data in the request body as JSON.
    const { message } = request.body;

    if (!message) {
        // If no message is sent in the request body
        return response.status(400).json({ error: 'Bad Request: Message content is missing.' });
    }

    try {
        // 4. Make the actual request to the Groq API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`, // Use the securely accessed key
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are HELPER GPT, a personal AI tutor and study assistant. Provide clear, concise, and accurate responses tailored for students. Solve math and science problems with step-by-step explanations. Explain complex concepts in detail with examples. Assist with homework, assignments, projects, and coding tasks. Be encouraging and supportive in your responses. Avoid emojis and unnecessary symbols.'
                    },
                    {
                        role: 'user',
                        content: message // Pass the user's message received from frontend
                    }
                ],
                model: 'llama-3.3-70b-versatile', // Your chosen model
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false
            })
        });

        // 5. Check if the Groq API call was successful
        if (!groqResponse.ok) {
            const errorData = await groqResponse.json();
            console.error('Groq API error:', errorData); // Log the error for debugging
            return response.status(groqResponse.status).json({ error: errorData.error?.message || 'Error from Groq API.' });
        }

        // 6. Get the response from Groq
        const data = await groqResponse.json();
        const reply = data.choices?.[0]?.message?.content || 'No response generated from AI.';

        // 7. Send the AI's reply back to your frontend
        response.status(200).json({ reply });

    } catch (error) {
        // 8. Handle any errors during the process
        console.error('Serverless function error:', error);
        response.status(500).json({ error: 'Internal Server Error while communicating with AI.' });
    }
}