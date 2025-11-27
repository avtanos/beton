import React, { useState } from 'react'
import './BoardSelector.css'

function BoardSelector({ boards, selectedBoard, onSelectBoard, onCreateBoard }) {
  const [isCreating, setIsCreating] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [newBoardDesc, setNewBoardDesc] = useState('')

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (newBoardName.trim()) {
      onCreateBoard(newBoardName, newBoardDesc)
      setNewBoardName('')
      setNewBoardDesc('')
      setIsCreating(false)
    }
  }

  return (
    <div className="board-selector">
      <div className="board-selector-header">
        <h2>Доски</h2>
        <button
          className="create-board-btn"
          onClick={() => setIsCreating(!isCreating)}
          title="Создать новую доску"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
        </button>
      </div>

      {isCreating && (
        <form className="create-board-form" onSubmit={handleCreateSubmit}>
          <input
            type="text"
            placeholder="Название доски"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            autoFocus
          />
          <textarea
            placeholder="Описание (опционально)"
            value={newBoardDesc}
            onChange={(e) => setNewBoardDesc(e.target.value)}
            rows="3"
          />
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Создать
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsCreating(false)
                setNewBoardName('')
                setNewBoardDesc('')
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="boards-list">
        {boards.map((board) => (
          <div
            key={board.id}
            className={`board-item ${selectedBoard?.id === board.id ? 'active' : ''}`}
            onClick={() => onSelectBoard(board)}
          >
            <div className="board-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <div className="board-info">
              <div className="board-name">{board.name}</div>
              {board.description && (
                <div className="board-desc">{board.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BoardSelector

