import React, { useState, useEffect } from 'react'
import { getProjects, createProject, updateProject, deleteProject, getCompanies, getUsers } from '../api'
import './UsersManagement.css'
import './Management.css'

function ProjectsManagement() {
  const [projects, setProjects] = useState([])
  const [companies, setCompanies] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    company_id: '',
    owner_id: '',
    color: '#3498db',
    status: 'active'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [projectsData, companiesData, usersData] = await Promise.all([
        getProjects(),
        getCompanies(),
        getUsers()
      ])
      setProjects(projectsData)
      setCompanies(companiesData)
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingProject(null)
    setFormData({
      name: '',
      description: '',
      company_id: companies.length > 0 ? companies[0].id : '',
      owner_id: users.length > 0 ? users[0].id : '',
      color: '#3498db',
      status: 'active'
    })
    setIsModalOpen(true)
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description,
      company_id: project.company_id,
      owner_id: project.owner_id,
      color: project.color,
      status: project.status
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingProject) {
        const updated = await updateProject(editingProject.id, {
          name: formData.name,
          description: formData.description,
          color: formData.color,
          status: formData.status
        })
        setProjects(projects.map(p => p.id === updated.id ? updated : p))
      } else {
        const newProject = await createProject(formData)
        setProjects([...projects, newProject])
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleDelete = async (projectId) => {
    if (window.confirm('Вы уверены? Это удалит все доски и задачи проекта!')) {
      try {
        await deleteProject(projectId)
        setProjects(projects.filter(p => p.id !== projectId))
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    return company ? company.name : 'Не указана'
  }

  const getOwnerName = (ownerId) => {
    const owner = users.find(u => u.id === ownerId)
    return owner ? owner.full_name : 'Не указан'
  }

  const statusNames = {
    active: 'Активный',
    archived: 'Архивный',
    completed: 'Завершённый'
  }

  const colors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#16a085'
  ]

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  return (
    <div className="projects-management">
      <div className="management-header">
        <div>
          <h1>Проекты</h1>
          <p>Управление проектами компании</p>
        </div>
        <button className="btn-create" onClick={handleCreate}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Создать проект
        </button>
      </div>

      <div className="management-content">
        <div className="projects-table">
          <table>
            <thead>
              <tr>
                <th>Проект</th>
                <th>Компания</th>
                <th>Владелец</th>
                <th>Статус</th>
                <th>Обновлён</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>
                    <div className="project-cell">
                      <div className="project-color" style={{backgroundColor: project.color}}></div>
                      <div>
                        <div className="project-name">{project.name}</div>
                        {project.description && (
                          <div className="project-desc">{project.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{getCompanyName(project.company_id)}</td>
                  <td>{getOwnerName(project.owner_id)}</td>
                  <td>
                    <span className={`status-badge ${project.status}`}>
                      {statusNames[project.status]}
                    </span>
                  </td>
                  <td>{new Date(project.updated_at).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-icon" onClick={() => handleEdit(project)} title="Редактировать">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(project.id)} title="Удалить">
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
              <h2>{editingProject ? 'Редактировать проект' : 'Создать проект'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Название проекта"
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Описание проекта"
                  rows="4"
                />
              </div>
              {!editingProject && (
                <>
                  <div className="form-group">
                    <label>Компания</label>
                    <select value={formData.company_id} onChange={(e) => setFormData({...formData, company_id: e.target.value})}>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Владелец</label>
                    <select value={formData.owner_id} onChange={(e) => setFormData({...formData, owner_id: e.target.value})}>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.full_name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Цвет</label>
                <div className="color-picker">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{backgroundColor: color}}
                      onClick={() => setFormData({...formData, color})}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Статус</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="active">Активный</option>
                  <option value="archived">Архивный</option>
                  <option value="completed">Завершённый</option>
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleSave}>
                  {editingProject ? 'Сохранить' : 'Создать'}
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

export default ProjectsManagement

