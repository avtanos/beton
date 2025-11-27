import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'
import { createTask } from '../api'
import './Column.css'

const columnNames = {
  todo: 'К выполнению',
  in_progress: 'В процессе',
  review: 'На проверке',
  done: 'Завершено'
}

const columnColors = {
  todo: '#95a5a6',
  in_progress: '#3498db',
  review: '#f39c12',
  done: '#27ae60'
}

function Column({ columnId, tasks, onTaskClick, onTaskCreate, boardId }) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    try {
      const newTask = await createTask({
        title: newTaskTitle,
        status: columnId,
        board_id: boardId
      })
      onTaskCreate(newTask)
      setNewTaskTitle('')
      setIsAddingTask(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title">
          <span 
            className="column-indicator" 
            style={{ backgroundColor: columnColors[columnId] }}
          />
          <h3>{columnNames[columnId]}</h3>
          <span className="task-count">{tasks.length}</span>
        </div>
        <button
          className="add-task-btn"
          onClick={() => setIsAddingTask(true)}
          title="Добавить задачу"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
        </button>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task)}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {isAddingTask && (
              <form className="add-task-form" onSubmit={handleCreateTask}>
                <textarea
                  placeholder="Введите название задачи..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleCreateTask(e)
                    }
                    if (e.key === 'Escape') {
                      setIsAddingTask(false)
                      setNewTaskTitle('')
                    }
                  }}
                />
                <div className="form-actions">
                  <button type="submit" className="btn-create">
                    Добавить
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setIsAddingTask(false)
                      setNewTaskTitle('')
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default Column

