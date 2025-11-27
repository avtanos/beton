import React, { useState, useEffect } from 'react'
import { getCompanies, createCompany, updateCompany, deleteCompany, getUsers } from '../api'
import './UsersManagement.css'
import './Management.css'

function CompaniesManagement() {
  const [companies, setCompanies] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner_id: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [companiesData, usersData] = await Promise.all([
        getCompanies(),
        getUsers()
      ])
      setCompanies(companiesData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCompany(null)
    setFormData({
      name: '',
      description: '',
      owner_id: users.length > 0 ? users[0].id : ''
    })
    setIsModalOpen(true)
  }

  const handleEdit = (company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name,
      description: company.description,
      owner_id: company.owner_id
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingCompany) {
        const updated = await updateCompany(editingCompany.id, {
          name: formData.name,
          description: formData.description
        })
        setCompanies(companies.map(c => c.id === updated.id ? updated : c))
      } else {
        const newCompany = await createCompany(formData)
        setCompanies([...companies, newCompany])
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving company:', error)
    }
  }

  const handleDelete = async (companyId) => {
    if (window.confirm('Вы уверены? Это удалит все проекты компании!')) {
      try {
        await deleteCompany(companyId)
        setCompanies(companies.filter(c => c.id !== companyId))
      } catch (error) {
        console.error('Error deleting company:', error)
      }
    }
  }

  const getOwnerName = (ownerId) => {
    const owner = users.find(u => u.id === ownerId)
    return owner ? owner.full_name : 'Не указан'
  }

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  return (
    <div className="companies-management">
      <div className="management-header">
        <div>
          <h1>Компании</h1>
          <p>Управление компаниями и организациями</p>
        </div>
        <button className="btn-create" onClick={handleCreate}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Создать компанию
        </button>
      </div>

      <div className="management-content">
        <div className="companies-table">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Владелец</th>
                <th>Участников</th>
                <th>Создана</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id}>
                  <td>
                    <div className="company-name">{company.name}</div>
                  </td>
                  <td>{company.description || '-'}</td>
                  <td>{getOwnerName(company.owner_id)}</td>
                  <td>
                    <span className="members-count">{company.members_count}</span>
                  </td>
                  <td>{new Date(company.created_at).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-icon" onClick={() => handleEdit(company)} title="Редактировать">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(company.id)} title="Удалить">
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
              <h2>{editingCompany ? 'Редактировать компанию' : 'Создать компанию'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Название компании"
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Описание компании"
                  rows="4"
                />
              </div>
              {!editingCompany && (
                <div className="form-group">
                  <label>Владелец</label>
                  <select value={formData.owner_id} onChange={(e) => setFormData({...formData, owner_id: e.target.value})}>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.full_name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleSave}>
                  {editingCompany ? 'Сохранить' : 'Создать'}
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

export default CompaniesManagement

