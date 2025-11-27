import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import BoardSelector from './components/BoardSelector'
import Board from './components/Board'
import UsersManagement from './components/UsersManagement'
import CompaniesManagement from './components/CompaniesManagement'
import ProjectsManagement from './components/ProjectsManagement'
import RolesManagement from './components/RolesManagement'
import QuickCreateModal from './components/QuickCreateModal'
import { getBoards, createBoard } from './api'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quickAction, setQuickAction] = useState(null)

  useEffect(() => {
    loadBoards()
  }, [])

  const loadBoards = async () => {
    try {
      const data = await getBoards()
      setBoards(data)
      if (data.length > 0 && !selectedBoard) {
        setSelectedBoard(data[0])
      }
    } catch (error) {
      console.error('Error loading boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBoard = async (name, description) => {
    try {
      const newBoard = await createBoard(name, description)
      setBoards([...boards, newBoard])
      setSelectedBoard(newBoard)
    } catch (error) {
      console.error('Error creating board:', error)
    }
  }

  const handleSelectBoard = (board) => {
    setSelectedBoard(board)
    setCurrentView('boards')
  }

  const handleQuickAction = (action) => {
    setQuickAction(action)
  }

  const handleQuickCreateSuccess = (result) => {
    // Обновляем данные в зависимости от типа создания
    if (quickAction === 'create-task') {
      // Можно перезагрузить доски или показать уведомление
      console.log('Задача создана:', result)
    } else if (quickAction === 'create-board') {
      loadBoards()
    }
    // Показываем уведомление об успехе
    alert(`✅ ${getSuccessMessage(quickAction)}`)
  }

  const getSuccessMessage = (action) => {
    const messages = {
      'create-task': 'Задача успешно создана!',
      'create-project': 'Проект успешно создан!',
      'create-board': 'Доска успешно создана!',
      'create-user': 'Пользователь успешно создан!',
      'create-company': 'Компания успешно создана!'
    }
    return messages[action] || 'Успешно создано!'
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'boards':
        return (
          <div className="boards-view">
            <BoardSelector
              boards={boards}
              selectedBoard={selectedBoard}
              onSelectBoard={handleSelectBoard}
              onCreateBoard={handleCreateBoard}
            />
            {selectedBoard ? (
              <Board key={selectedBoard.id} board={selectedBoard} />
            ) : (
              <div className="no-board-selected">
                <h2>Выберите доску или создайте новую</h2>
                <p>Начните работу с выбора существующей доски или создания новой</p>
              </div>
            )}
          </div>
        )
      case 'projects':
        return <ProjectsManagement />
      case 'users':
        return <UsersManagement />
      case 'companies':
        return <CompaniesManagement />
      case 'roles':
        return <RolesManagement />
      default:
        return <Dashboard />
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header onQuickAction={handleQuickAction} />
      <div className="app-container">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        {renderContent()}
      </div>
      
      {quickAction && (
        <QuickCreateModal
          type={quickAction}
          onClose={() => setQuickAction(null)}
          onSuccess={handleQuickCreateSuccess}
        />
      )}
    </div>
  )
}

export default App

