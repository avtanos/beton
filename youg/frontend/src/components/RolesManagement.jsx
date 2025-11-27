import React, { useState, useEffect } from 'react'
import { getRoles, createRole, deleteRole, getCompanies } from '../api'
import './UsersManagement.css'
import './Management.css'

function RolesManagement() {
  const [roles, setRoles] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    company_id: '',
    permissions: []
  })

  const availablePermissions = [
    { id: 'read', name: 'Чтение', description: 'Просмотр данных' },
    { id: 'write', name: 'Запись', description: 'Создание и редактирование' },
    { id: 'delete', name: 'Удаление', description: 'Удаление данных' },
    { id: 'manage_users', name: 'Управление пользователями', description: 'Добавление и удаление пользователей' },
    { id: 'manage_tasks', name: 'Управление задачами', description: 'Управление всеми задачами' },
    { id: 'manage_projects', name: 'Управление проектами', description: 'Создание и настройка проектов' },
    { id: 'admin', name: 'Администратор', description: 'Полный доступ ко всему' },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [rolesData, companiesData] = await Promise.all([
        getRoles(),
        getCompanies()
      ])
      setRoles(rolesData)
      setCompanies(companiesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      company_id: companies.length > 0 ? companies[0].id : '',
      permissions: []
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      const newRole = await createRole(formData)
      setRoles([...roles, newRole])
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving role:', error)
    }
  }

  const handleDelete = async (roleId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту роль?')) {
      try {
        await deleteRole(roleId)
        setRoles(roles.filter(r => r.id !== roleId))
      } catch (error) {
        console.error('Error deleting role:', error)
      }
    }
  }

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    return company ? company.name : 'Глобальная'
  }

  const togglePermission = (permissionId) => {
    const newPermissions = formData.permissions.includes(permissionId)
      ? formData.permissions.filter(p => p !== permissionId)
      : [...formData.permissions, permissionId]
    setFormData({...formData, permissions: newPermissions})
  }

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  return (
    <div className="roles-management">
      <div className="management-header">
        <div>
          <h1>Роли и права доступа</h1>
          <p>Управление ролями и правами пользователей</p>
        </div>
        <button className="btn-create" onClick={handleCreate}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Создать роль
        </button>
      </div>

      <div className="management-content">
        <div className="roles-grid">
          {roles.map(role => (
            <div key={role.id} className="role-card">
              <div className="role-header">
                <div>
                  <h3>{role.name}</h3>
                  <p className="role-company">{getCompanyName(role.company_id)}</p>
                </div>
                <button 
                  className="btn-icon delete" 
                  onClick={() => handleDelete(role.id)}
                  title="Удалить"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
              <p className="role-description">{role.description}</p>
              <div className="role-permissions">
                <strong>Права доступа:</strong>
                <div className="permissions-list">
                  {role.permissions.map(perm => (
                    <span key={perm} className="permission-badge">
                      {availablePermissions.find(p => p.id === perm)?.name || perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Создать роль</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Название роли</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Например: Разработчик"
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Описание роли"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Компания</label>
                <select value={formData.company_id} onChange={(e) => setFormData({...formData, company_id: e.target.value})}>
                  <option value="">Глобальная роль</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Права доступа</label>
                <div className="permissions-selector">
                  {availablePermissions.map(perm => (
                    <label key={perm.id} className="permission-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                      />
                      <div className="permission-info">
                        <strong>{perm.name}</strong>
                        <span>{perm.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleSave}>
                  Создать
                </button>
                <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .role-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .role-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .role-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .role-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 4px 0;
        }

        .role-company {
          font-size: 12px;
          color: #7f8c8d;
          margin: 0;
        }

        .role-description {
          font-size: 14px;
          color: #5f6368;
          margin: 0 0 16px 0;
        }

        .role-permissions strong {
          font-size: 12px;
          color: #7f8c8d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .permissions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .permission-badge {
          padding: 4px 10px;
          background: #e3f2fd;
          color: #2980b9;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .permissions-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .permission-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .permission-checkbox:hover {
          background: #e9ecef;
        }

        .permission-checkbox input {
          margin-top: 2px;
          cursor: pointer;
        }

        .permission-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .permission-info strong {
          font-size: 14px;
          color: #2c3e50;
          font-weight: 600;
        }

        .permission-info span {
          font-size: 12px;
          color: #7f8c8d;
        }
      `}</style>
    </div>
  )
}

export default RolesManagement

