import React, { useState } from 'react';
import { Database, Eye, FileText, HardDrive, RefreshCw, Search } from 'lucide-react';
import { callGroq } from '../../services/groq';

export function SmartDriveView({ files, notify }) {
  const [query, setQuery] = useState('');
  const [log, setLog] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    const prompt = `User query: ${query}. Available metadata: ${JSON.stringify(files)}. Map the request to a file and explain the automation trigger.`;
    const aiResponse = await callGroq(prompt, 'You are a data retrieval agent.');
    setLog(aiResponse);
    setSearching(false);
    notify('AI identified the document across the corporate drive.', 'success');
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
        <HardDrive className="text-blue-500" /> Semantic Drive
      </h1>
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-2xl relative overflow-hidden min-w-0">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Database size={150} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2">Internal Knowledge Retrieval</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-2xl">Search your organization's entire data lake using natural language.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="e.g. Find the latest Clevertap guide..."
            className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-sm outline-none focus:border-indigo-400 transition-all"
          />
          <button onClick={handleSearch} disabled={searching} className="w-full sm:w-auto bg-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all">
            {searching ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />} Search
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 min-w-0 h-auto xl:h-72 overflow-y-auto">
          <h3 className="font-bold text-slate-800 text-sm mb-4 border-b pb-2">AI Reasoning Engine</h3>
          <div className="text-xs text-slate-500 font-mono leading-relaxed break-words whitespace-pre-wrap">{log || 'Awaiting search parameters...'}</div>
        </div>
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 min-w-0 h-auto xl:h-72 overflow-y-auto space-y-2">
          <h3 className="font-bold text-slate-800 text-sm mb-4 border-b pb-2">Indexed Documents</h3>
          {files.map((file) => (
            <div key={file.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3 hover:bg-indigo-50 transition-all min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={16} className="text-indigo-500" />
                <span className="text-xs font-bold text-slate-700 break-words">{file.name}</span>
              </div>
              <Eye size={14} className="text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
