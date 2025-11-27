import React, { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser, getCompanies } from '../api'
import './UsersManagement.css'

function UsersManagement() {
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    role: 'member',
    company_id: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, companiesData] = await Promise.all([
        getUsers(),
        getCompanies()
      ])
      setUsers(usersData)
      setCompanies(companiesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({
      email: '',
      username: '',
      full_name: '',
      role: 'member',
      company_id: companies.length > 0 ? companies[0].id : ''
    })
    setIsModalOpen(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      company_id: user.company_id || ''
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingUser) {
        const updated = await updateUser(editingUser.id, {
          username: formData.username,
          full_name: formData.full_name,
          role: formData.role,
          company_id: formData.company_id || null
        })
        setUsers(users.map(u => u.id === updated.id ? updated : u))
      } else {
        const newUser = await createUser(formData)
        setUsers([...users, newUser])
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await deleteUser(userId)
        setUsers(users.filter(u => u.id !== userId))
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const getRoleName = (role) => {
    const roleNames = {
      admin: 'Администратор',
      manager: 'Менеджер',
      member: 'Участник'
    }
    return roleNames[role] || role
  }

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    return company ? company.name : 'Без компании'
  }

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  return (
    <div className="users-management">
      <div className="management-header">
        <div>
          <h1>Пользователи</h1>
          <p>Управление пользователями системы</p>
        </div>
        <button className="btn-create" onClick={handleCreate}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Создать пользователя
        </button>
      </div>

      <div className="management-content">
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Компания</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">{user.full_name}</div>
                        <div className="user-username">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td>{getCompanyName(user.company_id)}</td>
                  <td>
                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn-icon" onClick={() => handleEdit(user)} title="Редактировать">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(user.id)} title="Удалить">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Редактировать пользователя' : 'Создать пользователя'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!!editingUser}
                  placeholder="user@example.com"
                />
              </div>
              <div className="form-group">
                <label>Имя пользователя</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="username"
                />
              </div>
              <div className="form-group">
                <label>Полное имя</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Иван Иванов"
                />
              </div>
              <div className="form-group">
                <label>Роль</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="member">Участник</option>
                  <option value="manager">Менеджер</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
              <div className="form-group">
                <label>Компания</label>
                <select value={formData.company_id} onChange={(e) => setFormData({...formData, company_id: e.target.value})}>
                  <option value="">Без компании</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleSave}>
                  {editingUser ? 'Сохранить' : 'Создать'}
                </button>
                <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersManagement

