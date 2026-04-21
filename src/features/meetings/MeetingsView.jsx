import React, { useState } from 'react';
import { RefreshCw, Video, Zap } from 'lucide-react';
import { callGroq } from '../../services/groq';

export function MeetingsView({ meetings, setMeetings, notify }) {
  const [generating, setGenerating] = useState(null);

  const handleSummarize = async (meeting) => {
    setGenerating(meeting.id);
    const prompt = `Summarize meeting "${meeting.title}" with attendees ${meeting.attendees.join(', ')}. Extract action items.`;
    const response = await callGroq(prompt, 'You are a meeting AI agent.');
    setMeetings((prev) => prev.map((entry) => (entry.id === meeting.id ? { ...entry, aiSummary: response } : entry)));
    setGenerating(null);
    notify('AI Summary added to the meeting log.', 'success');
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
        <Video className="text-indigo-600" /> Meeting Intelligence
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all min-w-0 flex flex-col">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-start gap-4 bg-slate-50/50 min-w-0">
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {meeting.date} • {meeting.time}
                </div>
                <h4 className="font-bold text-slate-800 break-words">{meeting.title}</h4>
              </div>
              <div className={`p-2 rounded-lg shrink-0 ${meeting.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <Video size={18} />
              </div>
            </div>

            <div className="p-4 sm:p-6 flex-1 min-w-0">
              {meeting.aiSummary ? (
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl text-[11px] leading-relaxed text-indigo-900 whitespace-pre-wrap font-sans break-words">
                  <div className="font-bold mb-2 flex items-center gap-1.5">
                    <Zap size={12} /> AI Summary
                  </div>
                  {meeting.aiSummary}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-10">
                  {meeting.status === 'completed' ? (
                    <button onClick={() => handleSummarize(meeting)} disabled={generating === meeting.id} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 mx-auto">
                      {generating === meeting.id ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />} Generate Summary
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Upcoming Session</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

