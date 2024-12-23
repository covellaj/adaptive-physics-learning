import os
from openai import OpenAI
from dotenv import load_dotenv
from typing import List, Dict, Any

# Load environment variables
load_dotenv()

class AIManager:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.conversation_history: Dict[str, List[Dict[str, str]]] = {}
        
        # System message defining the AI Manager's role
        self.system_message = """You are an AI Educational Manager for an adaptive physics learning platform. Your role is to:
1. Help students understand physics concepts
2. Guide them through their learning journey
3. Provide explanations and examples
4. Answer questions about the platform
5. Track their progress and adjust difficulty
6. Offer encouragement and motivation
7. Make recommendations for what to study next

Keep responses clear, encouraging, and focused on helping students learn physics effectively.
Use analogies and real-world examples when explaining concepts.
If a student is struggling, break down complex topics into simpler parts."""

    def get_conversation_history(self, user_id: str) -> List[Dict[str, str]]:
        """Get conversation history for a specific user"""
        return self.conversation_history.get(user_id, [])

    def add_to_history(self, user_id: str, role: str, content: str):
        """Add a message to the user's conversation history"""
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
            # Add system message at the start of a new conversation
            self.conversation_history[user_id].append({
                "role": "system",
                "content": self.system_message
            })
        
        self.conversation_history[user_id].append({
            "role": role,
            "content": content
        })

    async def get_response(self, user_id: str, message: str) -> str:
        """Get a response from the AI Manager"""
        # Add user message to history
        self.add_to_history(user_id, "user", message)
        
        try:
            # Get completion from OpenAI
            response = await self.client.chat.completions.create(
                model="gpt-4-0125-preview",  # Using GPT-4-mini
                messages=self.get_conversation_history(user_id),
                temperature=0.7,
                max_tokens=500,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            
            # Extract and store response
            ai_message = response.choices[0].message.content
            self.add_to_history(user_id, "assistant", ai_message)
            
            return ai_message
            
        except Exception as e:
            print(f"Error getting AI response: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."

    def clear_history(self, user_id: str):
        """Clear conversation history for a specific user"""
        if user_id in self.conversation_history:
            del self.conversation_history[user_id]