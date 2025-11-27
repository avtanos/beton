import React, { useState, useRef, useEffect } from 'react'
import './Header.css'

function Header({ onQuickAction }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleAction = (action) => {
    setIsMenuOpen(false)
    if (onQuickAction) {
      onQuickAction(action)
    }
  }

  const actions = [
    {
      id: 'create-task',
      label: 'Создать задачу',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
        </svg>
      ),
      color: '#3498db'
    },
    {
      id: 'create-project',
      label: 'Создать проект',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
        </svg>
      ),
      color: '#9b59b6'
    },
    {
      id: 'create-board',
      label: 'Создать доску',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      ),
      color: '#1abc9c'
    },
    {
      id: 'create-user',
      label: 'Создать пользователя',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
        </svg>
      ),
      color: '#e74c3c'
    },
    {
      id: 'create-company',
      label: 'Создать компанию',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
        </svg>
      ),
      color: '#f39c12'
    }
  ]

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#3498db"/>
            <path d="M8 12h16M8 16h16M8 20h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h1>TeamS Tracker</h1>
        </div>
        <div className="header-actions" ref={menuRef}>
          <button 
            className="header-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
            </svg>
            Быстрое действие
          </button>
          
          {isMenuOpen && (
            <div className="quick-menu">
              {actions.map((action) => (
                <button
                  key={action.id}
                  className="quick-menu-item"
                  onClick={() => handleAction(action.id)}
                >
                  <span className="quick-menu-icon" style={{ color: action.color }}>
                    {action.icon}
                  </span>
                  <span className="quick-menu-label">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

