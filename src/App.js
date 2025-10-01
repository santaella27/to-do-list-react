import React, { useState, useEffect, useMemo } from 'react';

// --- Ícones SVG como Componentes ---
const EditIcon = () => (
  <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ListIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);


// --- Componente: Item da Tarefa (TaskItem) ---
const TaskItem = ({ task, onEdit, onDelete, onUpdateStatus }) => {

    const statusConfig = {
    pendente: { bg: 'bg-yellow-200', text: 'text-yellow-800', label: 'Pendente' },
    'em andamento': { bg: 'bg-blue-200', text: 'text-blue-800', label: 'Em Andamento' },
    concluída: { bg: 'bg-green-200', text: 'text-green-800', label: 'Concluída' },
  };

  const categoryConfig = {
    Trabalho: { bg: 'bg-gray-800', text: 'text-white' },
    Pessoal: { bg: 'bg-indigo-200', text: 'text-indigo-800' },
    Estudos: { bg: 'bg-purple-200', text: 'text-purple-800' },
  };

  const currentStatus = statusConfig[task.status] || statusConfig.pendente;
  const currentCategory = categoryConfig[task.category] || categoryConfig.Trabalho;
  
  const formatDate = (dateString) => {
      if (!dateString) return 'Sem data';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500 flex flex-col justify-between transition-transform transform hover:scale-105">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 break-words">{task.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${currentCategory.bg} ${currentCategory.text}`}>
            {task.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-2 break-words">{task.description}</p>
        <p className="text-xs text-gray-500 font-medium">Vencimento: {formatDate(task.dueDate)}</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
        <span className={`px-3 py-1 text-sm font-bold rounded-full ${currentStatus.bg} ${currentStatus.text}`}>
          {currentStatus.label}
        </span>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {task.status !== 'concluída' && (
             <select 
                onChange={(e) => onUpdateStatus(task.id, e.target.value)} 
                value={task.status}
                className="text-xs bg-gray-100 border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="pendente">Pendente</option>
                <option value="em andamento">Em Andamento</option>
                <option value="concluída">Concluída</option>
             </select>
          )}
          <button onClick={() => onEdit(task)} className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-200" title="Editar">
            <EditIcon />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200" title="Excluir">
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Componente: Formulário de Tarefa (TaskForm) ---
const TaskForm = ({ onSubmit, taskToEdit, onCancel }) => {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [task, setTask] = useState({ title: '', description: '', category: 'Trabalho', dueDate: getTodayString() });

  useEffect(() => {
    if (taskToEdit) {
      setTask({ ...taskToEdit, dueDate: taskToEdit.dueDate || getTodayString() });
    } else {
      setTask({ title: '', description: '', category: 'Trabalho', dueDate: getTodayString() });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    onSubmit(task);
    setTask({ title: '', description: '', category: 'Trabalho', dueDate: getTodayString() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos existentes: title, description, category */}
           <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div className="flex gap-4 mb-6">
            <div className="w-1/2">
                <label htmlFor="category" className="block text-gray-700 font-medium mb-1">Categoria</label>
                <select
                id="category"
                name="category"
                value={task.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                <option value="Trabalho">Trabalho</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Estudos">Estudos</option>
                </select>
            </div>
            <div className="w-1/2">
                <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-1">Data Venc.</label>
                <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200">
              {taskToEdit ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};