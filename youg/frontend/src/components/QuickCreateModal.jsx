import React, { useState, useEffect } from 'react'
import { createTask, createProject, createBoard, createUser, createCompany, getCompanies, getUsers, getProjects, getBoards } from '../api'
import './QuickCreateModal.css'

function QuickCreateModal({ type, onClose, onSuccess }) {
  const [formData, setFormData] = useState({})
  const [companies, setCompanies] = useState([])
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [type])

  const loadData = async () => {
    try {
      if (type === 'create-task') {
        const [boardsData] = await Promise.all([getBoards()])
        setBoards(boardsData)
        if (boardsData.length > 0) {
          setFormData({ board_id: boardsData[0].id, title: '', status: 'todo', priority: 'medium' })
        }
      } else if (type === 'create-project') {
        const [companiesData, usersData] = await Promise.all([getCompanies(), getUsers()])
        setCompanies(companiesData)
        setUsers(usersData)
        if (companiesData.length > 0 && usersData.length > 0) {
          setFormData({ company_id: companiesData[0].id, owner_id: usersData[0].id, name: '', color: '#3498db' })
        }
      } else if (type === 'create-board') {
        const [projectsData] = await Promise.all([getProjects()])
        setProjects(projectsData)
        if (projectsData.length > 0) {
          setFormData({ project_id: projectsData[0].id, name: '' })
        }
      } else if (type === 'create-user') {
        const [companiesData] = await Promise.all([getCompanies()])
        setCompanies(companiesData)
        setFormData({ email: '', username: '', full_name: '', role: 'member', company_id: companiesData[0]?.id || '' })
      } else if (type === 'create-company') {
        const [usersData] = await Promise.all([getUsers()])
        setUsers(usersData)
        if (usersData.length > 0) {
          setFormData({ name: '', owner_id: usersData[0].id })
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result
      switch (type) {
        case 'create-task':
          result = await createTask(formData)
          break
        case 'create-project':
          result = await createProject(formData)
          break
        case 'create-board':
          result = await createBoard(formData.name, formData.description, formData.project_id)
          break
        case 'create-user':
          result = await createUser(formData)
          break
        case 'create-company':
          result = await createCompany(formData)
          break
        default:
          break
      }

      if (onSuccess) {
        onSuccess(result)
      }
      onClose()
    } catch (error) {
      console.error('Error creating:', error)
      alert('Ошибка при создании. Проверьте консоль.')
    } finally {
      setLoading(false)
    }
  }

  const titles = {
    'create-task': 'Создать задачу',
    'create-project': 'Создать проект',
    'create-board': 'Создать доску',
    'create-user': 'Создать пользователя',
    'create-company': 'Создать компанию'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content quick-create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titles[type]}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          {type === 'create-task' && (
            <>
              <div className="form-group">
                <label>Название задачи *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Введите название задачи"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Описание задачи (опционально)"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Доска *</label>
                  <select
                    value={formData.board_id || ''}
                    onChange={(e) => setFormData({...formData, board_id: e.target.value})}
                    required
                  >
                    {boards.map(board => (
                      <option key={board.id} value={board.id}>{board.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Приоритет</label>
                  <select
                    value={formData.priority || 'medium'}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'create-project' && (
            <>
              <div className="form-group">
                <label>Название проекта *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Введите название проекта"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Описание проекта (опционально)"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Компания *</label>
                  <select
                    value={formData.company_id || ''}
                    onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                    required
                  >
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Владелец *</label>
                  <select
                    value={formData.owner_id || ''}
                    onChange={(e) => setFormData({...formData, owner_id: e.target.value})}
                    required
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'create-board' && (
            <>
              <div className="form-group">
                <label>Название доски *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Введите название доски"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Описание доски (опционально)"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Проект *</label>
                <select
                  value={formData.project_id || ''}
                  onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                  required
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {type === 'create-user' && (
            <>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="user@example.com"
                  required
                  autoFocus
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Имя пользователя *</label>
                  <input
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="username"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Полное имя *</label>
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Роль</label>
                  <select
                    value={formData.role || 'member'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="member">Участник</option>
                    <option value="manager">Менеджер</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Компания</label>
                  <select
                    value={formData.company_id || ''}
                    onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                  >
                    <option value="">Без компании</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'create-company' && (
            <>
              <div className="form-group">
                <label>Название компании *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Введите название компании"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Описание компании (опционально)"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Владелец *</label>
                <select
                  value={formData.owner_id || ''}
                  onChange={(e) => setFormData({...formData, owner_id: e.target.value})}
                  required
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.full_name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Создание...' : 'Создать'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuickCreateModal

