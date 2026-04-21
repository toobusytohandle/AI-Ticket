import React, { useState } from 'react';
import { CheckSquare, Plus, X } from 'lucide-react';

export function TaskTrackerView({ users, tasks, createTask, updateTaskStatus, currentUser }) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    assignee: users[0]?.id || '',
    deadline: '',
    priority: 'medium',
  });

  const handleCreateTask = (event) => {
    event.preventDefault();
    createTask({
      title: formData.title,
      description: formData.desc,
      assignee: formData.assignee,
      creator: currentUser.id,
      status: 'todo',
      deadline: formData.deadline,
      priority: formData.priority,
      type: 'general',
    });
    setIsCreating(false);
    setFormData({
      title: '',
      desc: '',
      assignee: users[0]?.id || '',
      deadline: '',
      priority: 'medium',
    });
  };

  const TaskColumn = ({ title, tasksList }) => (
    <div className="bg-slate-100/50 border border-slate-200 p-3 sm:p-4 rounded-2xl flex flex-col min-h-[340px] lg:min-h-[600px] min-w-0 w-full overflow-hidden">
      <h3 className="font-bold text-slate-500 mb-5 flex justify-between items-center uppercase text-[10px] sm:text-xs tracking-widest">
        <span className="min-w-0 truncate">{title}</span>
        <span className="bg-white shadow-sm text-slate-600 px-2 py-0.5 rounded-full text-[10px] shrink-0">{tasksList.length}</span>
      </h3>
      <div className="flex-1 space-y-4">
        {tasksList.map((task) => (
          <div key={task.id} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group min-w-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 min-w-0">
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  task.priority === 'urgent'
                    ? 'bg-red-100 text-red-700'
                    : task.priority === 'high'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {task.priority}
              </span>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter shrink-0">{task.deadline}</span>
            </div>
            <h4 className="font-bold text-sm text-slate-800 leading-snug mb-1 break-words">{task.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 break-words">{task.description}</p>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-slate-100 min-w-0">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold border border-slate-200">
                {users.find((candidate) => candidate.id === task.assignee)?.name?.charAt(0)}
              </div>
              <select
                className="text-[10px] font-bold border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-600 outline-none w-full sm:w-auto min-w-0"
                value={task.status}
                onChange={(event) => updateTaskStatus(task.id, event.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">Doing</option>
                <option value="review">Review</option>
                <option value="completed">Done</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const mobileGroups = [
    { title: 'Pending', tasksList: tasks.filter((task) => task.status === 'todo' || task.status === 'pending') },
    { title: 'In-Progress', tasksList: tasks.filter((task) => task.status === 'in-progress') },
    { title: 'Review', tasksList: tasks.filter((task) => task.status === 'review') },
    { title: 'Completed', tasksList: tasks.filter((task) => task.status === 'completed') },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3 min-w-0">
          <CheckSquare className="text-indigo-600" /> Workspace Flow
        </h1>
        <button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all w-full sm:w-auto">
          <Plus size={18} /> New Assignment
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative">
            <button onClick={() => setIsCreating(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input required value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} type="text" className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500" placeholder="Task Title" />
              <textarea required value={formData.desc} onChange={(event) => setFormData({ ...formData, desc: event.target.value })} className="w-full border border-slate-200 rounded-xl p-3 h-24 outline-none focus:border-indigo-500" placeholder="Context..." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={formData.assignee} onChange={(event) => setFormData({ ...formData, assignee: event.target.value })} className="border border-slate-200 rounded-xl p-3 outline-none">
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <input required value={formData.deadline} onChange={(event) => setFormData({ ...formData, deadline: event.target.value })} type="date" className="border border-slate-200 rounded-xl p-3 outline-none" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl mt-4">
                Assign Task
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:hidden pb-4 min-w-0">
        {mobileGroups.map((group) => (
          <TaskColumn key={group.title} title={group.title} tasksList={group.tasksList} />
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 2xl:grid-cols-4 gap-6 flex-1 overflow-x-hidden pb-4 min-w-0">
        <TaskColumn title="Pending" tasksList={tasks.filter((task) => task.status === 'todo' || task.status === 'pending')} />
        <TaskColumn title="In-Progress" tasksList={tasks.filter((task) => task.status === 'in-progress')} />
        <TaskColumn title="Review" tasksList={tasks.filter((task) => task.status === 'review')} />
        <TaskColumn title="Completed" tasksList={tasks.filter((task) => task.status === 'completed')} />
      </div>
    </div>
  );
}
