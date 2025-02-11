'use client'

// chat-reclutadores/app/page.tsx

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';


export default function ChatReclutadores() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Hubo un error al procesar tu pregunta." }]);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-grow overflow-auto border p-4 rounded-xl">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <p className={`p-2 my-1 inline-block rounded-xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <Input className="flex-grow" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Haz una pregunta sobre mi experiencia laboral..." />
        <Button onClick={sendMessage} className="ml-2">Enviar</Button>
      </div>
    </div>
  );
}
