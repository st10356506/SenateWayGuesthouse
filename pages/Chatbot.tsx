import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const quickQuestions = [
  'What are your room rates?',
  'What facilities do you offer?',
  'How far from the airport?',
  'Do you have parking?',
  'What are check-in times?',
  'Is WiFi available?',
];

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm the Senate Way Guesthouse assistant. How can I help you today? Feel free to ask about our rooms, facilities, location, or anything else!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      console.log('Starting Gemini AI request...');
      console.log('User message:', userMessage);
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      console.log('Gemini API Key found:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO');
      console.log('Full env check:', import.meta.env);
      
      if (!apiKey) {
        console.error('Gemini API key not configured');
        throw new Error('Gemini API key not configured');
      }
      
      console.log('Making request to Gemini API...');
          const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-pro';
          const response = await fetch(
           `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a helpful assistant for a guesthouse in Kimberley, South Africa.
                Answer briefly (<=120 words), friendly, and encourage contacting us for bookings.
                Facts: 10 rooms (R400–R1600), free WiFi, free parking, pool, check-in 2:00 PM, check-out 10:00 AM, near airport (6 km) and malls (1.9 km).
                Question: "${userMessage}"`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            }
          })
        }
      );
      
      console.log('Gemini response status:', response.status);
      console.log('Gemini response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API request failed:', errorText);
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      console.log('Gemini response data:', data);

      // Extract text robustly from all parts
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      const joinedText = parts
        .map((p: any) => p?.text)
        .filter(Boolean)
        .join('\n')
        .trim();

      // Safety/empty handling fallbacks
      const finishReason = data?.candidates?.[0]?.finishReason;
      if (!joinedText) {
        if (finishReason && finishReason !== 'STOP') {
          console.warn('Gemini finishReason:', finishReason);
        }
        // Simple domain fallbacks for common FAQs
        const q = userMessage.toLowerCase();
        if (q.includes('wifi')) return 'Yes, free WiFi is available throughout the property.';
        if (q.includes('parking')) return 'Yes, we offer free private parking for guests.';
        if (q.includes('airport')) return 'We’re about 6 km from Kimberley Airport (around 10 minutes by car).';
        return "I'm having trouble answering that right now. Please try again in a moment, or contact us at +27 123 456 789 or info@senateway.co.za.";
      }

      console.log('Gemini response text:', joinedText);
      return joinedText;
    } catch (error) {
      console.error('Gemini API error:', error);
      return "I'm having trouble connecting right now. Please try again later or contact us directly at +27 123 456 789 or info@senateway.co.za.";
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponseText = await getBotResponse(inputValue);
      const botResponse: Message = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "I'm having trouble connecting right now. Please try again later or contact us directly at +27 123 456 789 or info@senateway.co.za.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="py-16 bg-muted/50 min-h-[calc(100vh-200px)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-primary mb-4">AI Assistant</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Ask me anything about Senate Way Guesthouse - rooms, facilities, location, pricing, and more!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Quick Questions */}
          <div className="mb-6">
            <p className="text-sm mb-3 text-center text-muted-foreground">Quick questions:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-sm"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <Card className="overflow-hidden">
            {/* Messages */}
            <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-white/80' : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-accent-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-secondary rounded-lg p-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question here..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send • Powered by Google Gemini AI
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
