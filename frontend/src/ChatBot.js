import React, { useState, useRef, useEffect } from 'react';

const ChatBot = ({ student, onSubmitComplaint }) => {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: `Hi! 👋 I'm your Smart Troubleshooting Assistant!

I can help you with:
• 📶 WiFi and network issues
• 💻 Technical problems
• 🍽️ Mess and dining concerns
• 📚 Academic issues
• 🛡️ Safety and security

Describe your problem in detail and I’ll provide step-by-step solutions!`,
      isDetailed: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    const newMessages = [...messages, { type: 'user', text: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: messages.map(msg => `${msg.type}: ${msg.text}`)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botReply = data.reply;
        setMessages(prev => [...prev, { type: 'bot', text: botReply, isDetailed: true }]);

        if (
          botReply.toLowerCase().includes('formal complaint') ||
          botReply.toLowerCase().includes('submit a complaint')
        ) {
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                type: 'bot',
                text: '🎯 Ready to submit a formal complaint? I can help you create one based on our conversation!',
                showComplaintButton: true,
              },
            ]);
          }, 1500);
        }
      } else {
        setMessages(prev => [
          ...prev,
          { type: 'bot', text: '❌ Sorry, I encountered an error. Please try again.' },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { type: 'bot', text: "🔌 Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSubmitComplaint = () => {
    onSubmitComplaint(student.name, messages);
  };

  return (
    <div className="max-w-3xl mx-auto my-6 p-4 font-inter">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          🛠️ Smart Troubleshooting Assistant
        </h1>
        <p className="text-gray-500 text-sm">
          I’ll help diagnose and solve your college issues step-by-step!
        </p>
      </div>

      {/* Greeting */}
      <div className="mb-4 text-center bg-green-50 border border-green-200 rounded-md py-2">
        <span className="text-green-800 font-medium">
          ✅ Hi {student.name}! Let's solve your issues together!
        </span>
      </div>

      {/* Chat Box */}
      <div className="h-[450px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4 shadow-sm">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 flex ${
              msg.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white border border-gray-200 shadow-sm rounded-bl-sm'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              {msg.showComplaintButton && (
                <div className="mt-2 text-right">
                  <button
                    onClick={handleSubmitComplaint}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-full transition"
                  >
                    📝 Submit Complaint
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-3">
            <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-sm">
              🔍 Analyzing your issue...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
        <textarea
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows="1"
          className="flex-1 resize-none outline-none border-none text-sm text-gray-800 p-2 h-10 bg-transparent placeholder-gray-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !inputMessage.trim()}
          className={`px-4 py-2 rounded-md text-white text-sm font-medium transition ${
            loading || !inputMessage.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          ➤
        </button>
      </div>

      {/* Skip Complaint */}
      <div className="text-center mt-4">
        <button
          onClick={handleSubmitComplaint}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition"
        >
          Skip Chat & Submit Complaint
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
