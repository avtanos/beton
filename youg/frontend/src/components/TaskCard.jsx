import React from 'react'
import './TaskCard.css'

const priorityColors = {
  low: '#95a5a6',
  medium: '#3498db',
  high: '#e74c3c'
}

const priorityNames = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
}

function TaskCard({ task, onClick, isDragging }) {
  return (
    <div
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <span 
          className="task-priority"
          style={{ 
            backgroundColor: priorityColors[task.priority],
            color: 'white'
          }}
        >
          {priorityNames[task.priority]}
        </span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-card-footer">
        {task.assignee && (
          <div className="task-assignee">
            <div className="assignee-avatar">
              {task.assignee.charAt(0).toUpperCase()}
            </div>
            <span>{task.assignee}</span>
          </div>
        )}
        <div className="task-meta">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
          </svg>
          <span>{new Date(task.created_at).toLocaleDateString('ru-RU')}</span>
        </div>
      </div>
    </div>
  )
}

export default TaskCard

