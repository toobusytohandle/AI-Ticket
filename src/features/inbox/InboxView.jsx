import React, { useEffect, useState } from 'react';
import { Mail, Zap } from 'lucide-react';
import { callGroq } from '../../services/groq';

export function InboxView({ emailThreads, setEmailThreads, notify }) {
  const [selectedThreadId, setSelectedThreadId] = useState(emailThreads[0]?.id || null);
  const [analyzing, setAnalyzing] = useState(false);

  const selectedThread = emailThreads.find((thread) => thread.id === selectedThreadId) || null;

  useEffect(() => {
    if (!selectedThread && emailThreads[0]) {
      setSelectedThreadId(emailThreads[0].id);
    }
  }, [emailThreads, selectedThread]);

  const handleAIProcess = async () => {
    if (!selectedThread) return;

    setAnalyzing(true);
    const emailContent = selectedThread.messages.map((message) => `${message.sender}: ${message.text}`).join('\n');
    const prompt = `Analyze this email thread and extract clear action items. Thread:\n${emailContent}`;
    const aiResponse = await callGroq(prompt, 'You are a task extractor AI.');

    setEmailThreads((prev) =>
      prev.map((thread) =>
        thread.id === selectedThread.id
          ? { ...thread, analyzed: true, aiSummary: aiResponse }
          : thread,
      ),
    );
    setAnalyzing(false);
    notify('AI analyzed the thread and extracted action points.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[70vh] lg:h-[80vh] min-w-0">
      <div className="w-full lg:w-80 lg:max-w-80 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-slate-50 min-w-0">
        <div className="p-4 border-b border-slate-200 font-bold flex items-center gap-2">
          <Mail size={18} className="text-indigo-600" /> Mail Center
        </div>
        <div className="flex-1 overflow-y-auto max-h-[35vh] lg:max-h-none">
          {emailThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThreadId(thread.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-all ${
                selectedThread?.id === thread.id ? 'bg-white border-l-4 border-indigo-600 shadow-sm' : 'hover:bg-slate-100 border-l-4 border-transparent'
              }`}
            >
              <div className="font-bold text-xs text-slate-800 truncate mb-1">{thread.subject}</div>
              <div className="text-[10px] text-slate-500 truncate">{thread.participants[0]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selectedThread ? (
          <>
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white shadow-sm min-w-0">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 break-words">{selectedThread.subject}</h2>
                <div className="text-xs text-slate-400 mt-1 break-words">{selectedThread.participants.join(', ')}</div>
              </div>
              <button
                onClick={handleAIProcess}
                disabled={analyzing || selectedThread.analyzed}
                className={`self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  selectedThread.analyzed ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                }`}
              >
                <Zap size={14} className={analyzing ? 'animate-pulse' : ''} />
                {analyzing ? 'AI Reading...' : 'AI Extract'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/20 min-w-0">
              {selectedThread.aiSummary && (
                <div className="bg-indigo-600 text-white p-5 rounded-2xl text-xs leading-relaxed shadow-lg whitespace-pre-wrap">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <Zap size={14} /> AI Insights
                  </div>
                  {selectedThread.aiSummary}
                </div>
              )}

              {selectedThread.messages.map((message) => (
                <div key={message.id} className={`flex flex-col ${message.isMe ? 'items-end' : 'items-start'}`}>
                  <div className="text-[10px] text-slate-400 mb-1 px-1">{message.sender}</div>
                  <div className={`p-4 rounded-2xl text-sm max-w-[92%] sm:max-w-[80%] shadow-sm break-words ${message.isMe ? 'bg-indigo-100 text-indigo-900' : 'bg-white text-slate-800 border border-slate-100'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">Select a thread.</div>
        )}
      </div>
    </div>
  );
}
