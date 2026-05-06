import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter, LogOut, CheckCircle, Circle, Trash2, Calendar, Clock } from 'lucide-react';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tasks');
            setTasks(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`http://localhost:5000/api/tasks/${id}`);
                setTasks(tasks.filter(t => t._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const toggleStatus = async (task) => {
        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            const res = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { status: newStatus });
            setTasks(tasks.map(t => t._id === task._id ? res.data.data : t));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (task) => {
        setCurrentTask(task);
        setShowModal(true);
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ? true : task.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="dashboard-wrapper">
            <nav className="navbar glass-morphism">
                <a href="/" className="logo">TaskFlow</a>
                <div className="user-nav">
                    <span style={{ color: 'var(--text-muted)' }}>Hi, <strong>{user?.name}</strong></span>
                    <button onClick={logout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            <div className="dashboard-container">
                <header className="filter-bar">
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            className="search-input" 
                            style={{ paddingLeft: '45px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ marginBottom: 0, width: 'auto' }}
                        >
                            <option value="all">All Tasks</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button 
                            className="btn-primary" 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => { setCurrentTask(null); setShowModal(true); }}
                        >
                            <Plus size={20} /> New Task
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading tasks...</div>
                ) : (
                    <div className="task-list">
                        {filteredTasks.length === 0 ? (
                            <div className="glass-morphism" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No tasks found. Create one to get started!
                            </div>
                        ) : (
                            filteredTasks.map(task => (
                                <div key={task._id} className="task-item glass-morphism animate-fade">
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <button 
                                            onClick={() => toggleStatus(task)}
                                            style={{ background: 'none', border: 'none', padding: 0, marginTop: '4px' }}
                                        >
                                            {task.status === 'completed' ? 
                                                <CheckCircle color="var(--accent-green)" /> : 
                                                <Circle color="var(--text-muted)" />
                                            }
                                        </button>
                                        <div className="task-info">
                                            <h3 style={{ 
                                                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                                color: task.status === 'completed' ? 'var(--text-muted)' : 'white'
                                            }}>{task.title}</h3>
                                            <p>{task.description}</p>
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Calendar size={14} /> {new Date(task.deadline).toLocaleDateString()}
                                                </span>
                                                <span className={`status-badge status-${task.status}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="task-actions">
                                        <button onClick={() => handleEdit(task)} className="btn-outline" style={{ padding: '8px' }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(task._id)} className="btn-outline" style={{ padding: '8px', color: 'var(--accent-red)' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {showModal && (
                <TaskForm 
                    task={currentTask} 
                    onClose={() => setShowModal(false)} 
                    onSuccess={() => { fetchTasks(); setShowModal(false); }}
                />
            )}
        </div>
    );
};

export default Dashboard;
