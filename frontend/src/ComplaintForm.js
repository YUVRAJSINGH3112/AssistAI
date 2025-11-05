import React, { useState, useEffect } from 'react';

const ComplaintForm = ({
  initialStudentName = '',
  studentId = '',
  chatHistory = [],
  onBackToChat,
  onComplaintSubmitted,
}) => {
  const [studentName, setStudentName] = useState(initialStudentName);
  const [complaintText, setComplaintText] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chatHistory.length > 0) {
      const userMessages = chatHistory
        .filter((msg) => msg.type === 'user')
        .map((msg) => msg.text);
      if (userMessages.length > 0) {
        setComplaintText(userMessages.join(' '));
      }
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !complaintText.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/classify-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          student_name: studentName,
          complaint_text: complaintText,
          complaint_type: complaintType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          id: data.id,
          category: data.category,
          sentiment: data.sentiment,
          status: data.status,
        });
        setComplaintText('');
        if (onComplaintSubmitted) setTimeout(() => onComplaintSubmitted(), 2000);
      } else {
        setResult({ error: data.error });
      }
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 font-inter">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          📝 Submit Complaint
        </h1>
        {onBackToChat && (
          <button
            onClick={onBackToChat}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition"
          >
            ← Back to Chat
          </button>
        )}
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md border border-gray-200 rounded-lg p-6 space-y-5"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="studentName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Name
          </label>
          <input
            id="studentName"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Complaint Type */}
        <div>
          <label
            htmlFor="complaintType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Complaint Type
          </label>
          <select
            id="complaintType"
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">
              Select complaint type (optional - AI will classify)
            </option>
            <option value="Mess">🍽️ Mess/Food Issues</option>
            <option value="WiFi/Network">📶 WiFi/Network Problems</option>
            <option value="Technical Issue">🔧 Technical Issues</option>
            <option value="Academic/Teacher">📚 Academic/Teacher Issues</option>
            <option value="Safety/Security">🛡️ Safety/Security Concerns</option>
          </select>
        </div>

        {/* Complaint Text */}
        <div>
          <label
            htmlFor="complaint"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Complaint
          </label>
          <textarea
            id="complaint"
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            placeholder="e.g., The WiFi is not working in the library..."
            rows="5"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-medium transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {loading ? 'Analyzing...' : 'Submit Complaint'}
        </button>
      </form>

      {/* Result Card */}
      {result && (
        <div
          className={`mt-6 p-5 rounded-md border ${
            result.error
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}
        >
          {result.error ? (
            <p className="font-semibold">❌ Error: {result.error}</p>
          ) : (
            <>
              <h3 className="font-semibold text-lg mb-2">
                ✅ Complaint Submitted Successfully!
              </h3>
              <p>
                <strong>Complaint ID:</strong> #{result.id}
              </p>
              <p>
                <strong>Category:</strong> {result.category}
              </p>
              <p>
                <strong>Priority:</strong> {result.sentiment.toUpperCase()}
              </p>
              <p>
                <strong>Status:</strong> Pending Review
              </p>
              <p className="mt-3 text-sm italic">
                💡 Your complaint has been logged and will be reviewed soon.
              </p>
              {chatHistory.length > 0 && (
                <p className="mt-3 text-gray-500 text-xs bg-gray-100 p-2 rounded-md inline-block">
                  📋 Based on your chat conversation
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Footer Links */}
      <div className="flex justify-center gap-3 mt-6">
        {!onBackToChat && (
          <a
            href="/"
            className="text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white text-sm px-4 py-2 rounded-md transition"
          >
            🤖 Chat Assistant
          </a>
        )}
        <a
          href="/admin"
          className="text-gray-700 border border-gray-400 hover:bg-gray-700 hover:text-white text-sm px-4 py-2 rounded-md transition"
        >
          🔧 Admin Dashboard
        </a>
      </div>
    </div>
  );
};

export default ComplaintForm;
