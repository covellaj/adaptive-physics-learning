import os
import json
import aiohttp
from openai import OpenAI
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional
from abc import ABC, abstractmethod

# Load environment variables
load_dotenv()

class ModelBackend(ABC):
    @abstractmethod
    async def get_response(self, messages: List[Dict[str, str]]) -> str:
        pass

class OpenAIBackend(ModelBackend):
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
    async def get_response(self, messages: List[Dict[str, str]]) -> str:
        response = await self.client.chat.completions.create(
            model="gpt-4-0125-preview",
            messages=messages,
            temperature=0.7,
            max_tokens=500,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        return response.choices[0].message.content

class OllamaBackend(ModelBackend):
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.base_url = "http://localhost:11434/api/chat"
        
    async def get_response(self, messages: List[Dict[str, str]]) -> str:
        # Convert messages to Ollama format
        ollama_messages = [
            {"role": msg["role"], "content": msg["content"]}
            for msg in messages
        ]
        
        payload = {
            "model": self.model_name,
            "messages": ollama_messages,
            "stream": False
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(self.base_url, json=payload) as response:
                if response.status == 200:
                    result = await response.json()
                    return result["message"]["content"]
                else:
                    error_text = await response.text()
                    raise Exception(f"Ollama API error: {error_text}")

class AIManager:
    def __init__(self):
        self.conversation_history: Dict[str, List[Dict[str, str]]] = {}
        self.model_backends = {
            'gpt4': OpenAIBackend(),
            'ollama-mistral': OllamaBackend('mistral'),
            'ollama-llama2': OllamaBackend('llama2'),
            'ollama-neural-chat': OllamaBackend('neural-chat')
        }
        
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

    async def get_response(self, user_id: str, message: str, model: Optional[str] = None) -> str:
        """Get a response from the AI Manager"""
        # Add user message to history
        self.add_to_history(user_id, "user", message)
        
        try:
            # Use specified model or default to GPT-4
            model_name = model or 'gpt4'
            if model_name not in self.model_backends:
                raise ValueError(f"Unknown model: {model_name}")
                
            backend = self.model_backends[model_name]
            ai_message = await backend.get_response(self.get_conversation_history(user_id))
            
            # Store response
            self.add_to_history(user_id, "assistant", ai_message)
            return ai_message
            
        except Exception as e:
            print(f"Error getting AI response: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."

    def clear_history(self, user_id: str):
        """Clear conversation history for a specific user"""
        if user_id in self.conversation_history:
            del self.conversation_history[user_id]