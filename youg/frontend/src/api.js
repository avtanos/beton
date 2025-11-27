import axios from 'axios'

// Используем переменную окружения или fallback на localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

console.log('🔧 API Base URL:', API_BASE_URL)

// Users API
export const getUsers = async (companyId = null) => {
  const params = companyId ? { company_id: companyId } : {}
  const response = await api.get('/users', { params })
  return response.data
}

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`)
  return response.data
}

export const createUser = async (userData) => {
  const response = await api.post('/users', userData)
  return response.data
}

export const updateUser = async (userId, updateData) => {
  const response = await api.patch(`/users/${userId}`, updateData)
  return response.data
}

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`)
  return response.data
}

// Companies API
export const getCompanies = async () => {
  const response = await api.get('/companies')
  return response.data
}

export const getCompany = async (companyId) => {
  const response = await api.get(`/companies/${companyId}`)
  return response.data
}

export const createCompany = async (companyData) => {
  const response = await api.post('/companies', companyData)
  return response.data
}

export const updateCompany = async (companyId, updateData) => {
  const response = await api.patch(`/companies/${companyId}`, updateData)
  return response.data
}

export const deleteCompany = async (companyId) => {
  const response = await api.delete(`/companies/${companyId}`)
  return response.data
}

// Projects API
export const getProjects = async (companyId = null) => {
  const params = companyId ? { company_id: companyId } : {}
  const response = await api.get('/projects', { params })
  return response.data
}

export const getProject = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`)
  return response.data
}

export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData)
  return response.data
}

export const updateProject = async (projectId, updateData) => {
  const response = await api.patch(`/projects/${projectId}`, updateData)
  return response.data
}

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`)
  return response.data
}

// Project Members API
export const getProjectMembers = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/members`)
  return response.data
}

export const addProjectMember = async (memberData) => {
  const response = await api.post('/project-members', memberData)
  return response.data
}

export const removeProjectMember = async (memberId) => {
  const response = await api.delete(`/project-members/${memberId}`)
  return response.data
}

// Roles API
export const getRoles = async (companyId = null) => {
  const params = companyId ? { company_id: companyId } : {}
  const response = await api.get('/roles', { params })
  return response.data
}

export const createRole = async (roleData) => {
  const response = await api.post('/roles', roleData)
  return response.data
}

export const deleteRole = async (roleId) => {
  const response = await api.delete(`/roles/${roleId}`)
  return response.data
}

// Boards API
export const getBoards = async () => {
  const response = await api.get('/boards')
  return response.data
}

export const getBoard = async (boardId) => {
  const response = await api.get(`/boards/${boardId}`)
  return response.data
}

export const createBoard = async (name, description = '', projectId = null) => {
  const response = await api.post('/boards', { name, description, project_id: projectId })
  return response.data
}

export const deleteBoard = async (boardId) => {
  const response = await api.delete(`/boards/${boardId}`)
  return response.data
}

// Tasks API
export const getTasks = async (boardId) => {
  const response = await api.get(`/boards/${boardId}/tasks`)
  return response.data
}

export const getTask = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`)
  return response.data
}

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData)
  return response.data
}

export const updateTask = async (taskId, updateData) => {
  const response = await api.patch(`/tasks/${taskId}`, updateData)
  return response.data
}

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`)
  return response.data
}

export default api

