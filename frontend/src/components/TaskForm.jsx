import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const TaskForm = ({ task, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        status: 'pending'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                deadline: task.deadline.split('T')[0],
                status: task.status
            });
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (task) {
                await axios.put(`http://localhost:5000/api/tasks/${task._id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/tasks', formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-morphism animate-fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>{error}</div>}

                    <label>Title</label>
                    <input 
                        type="text" 
                        placeholder="Task title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <label>Description</label>
                    <textarea 
                        rows="3" 
                        placeholder="Describe the task..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        style={{ width: '100%', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', padding: '0.75rem' }}
                    ></textarea>

                    <label>Deadline</label>
                    <input 
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
