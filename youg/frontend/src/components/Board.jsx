import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Column from './Column'
import TaskModal from './TaskModal'
import { getTasks, updateTask } from '../api'
import './Board.css'

function Board({ board }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [board.id])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await getTasks(board.id)
      setTasks(data)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const taskId = draggableId
    const newStatus = destination.droppableId

    try {
      await updateTask(taskId, { status: newStatus, position: destination.index })
      
      // Обновляем локальное состояние
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
      setTasks(updatedTasks)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      const updatedTask = await updateTask(taskId, updateData)
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleTaskCreate = (newTask) => {
    setTasks([...tasks, newTask])
  }

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  if (loading) {
    return (
      <div className="board-loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="board">
      <div className="board-header">
        <div>
          <h2>{board.name}</h2>
          {board.description && <p>{board.description}</p>}
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board-columns">
          {board.columns.map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              tasks={getTasksByStatus(columnId)}
              onTaskClick={handleTaskClick}
              onTaskCreate={handleTaskCreate}
              boardId={board.id}
            />
          ))}
        </div>
      </DragDropContext>

      {isModalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTask(null)
          }}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </div>
  )
}

export default Board

