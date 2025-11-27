import React, { useState } from 'react'
import { deleteTask } from '../api'
import './TaskModal.css'

function TaskModal({ task, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [priority, setPriority] = useState(task.priority)
  const [assignee, setAssignee] = useState(task.assignee || '')

  const handleSave = () => {
    onUpdate(task.id, {
      title,
      description,
      priority,
      assignee: assignee || null
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await deleteTask(task.id)
        onDelete(task.id)
        onClose()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Детали задачи</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Название задачи"
                />
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Описание задачи"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Приоритет</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Исполнитель</label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Имя исполнителя"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={handleSave}>
                  Сохранить
                </button>
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="view-mode">
              <div className="field">
                <label>Название</label>
                <p className="field-value title">{task.title}</p>
              </div>

              {task.description && (
                <div className="field">
                  <label>Описание</label>
                  <p className="field-value">{task.description}</p>
                </div>
              )}

              <div className="field-row">
                <div className="field">
                  <label>Приоритет</label>
                  <span className={`priority-badge priority-${task.priority}`}>
                    {task.priority === 'low' ? 'Низкий' : task.priority === 'medium' ? 'Средний' : 'Высокий'}
                  </span>
                </div>

                <div className="field">
                  <label>Статус</label>
                  <span className="status-badge">
                    {task.status === 'todo' ? 'К выполнению' :
                     task.status === 'in_progress' ? 'В процессе' :
                     task.status === 'review' ? 'На проверке' : 'Завершено'}
                  </span>
                </div>
              </div>

              {task.assignee && (
                <div className="field">
                  <label>Исполнитель</label>
                  <div className="assignee-info">
                    <div className="assignee-avatar-large">
                      {task.assignee.charAt(0).toUpperCase()}
                    </div>
                    <span>{task.assignee}</span>
                  </div>
                </div>
              )}

              <div className="field-row">
                <div className="field">
                  <label>Создано</label>
                  <p className="field-value">
                    {new Date(task.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>

                <div className="field">
                  <label>Обновлено</label>
                  <p className="field-value">
                    {new Date(task.updated_at).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                  Редактировать
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskModal

