import React, { useState, useEffect } from 'react'
import { getUsers, getCompanies, getProjects, getTasks, getBoards } from '../api'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    projects: 0,
    boards: 0,
    tasks: {
      total: 0,
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [users, companies, projects, boards] = await Promise.all([
        getUsers(),
        getCompanies(),
        getProjects(),
        getBoards()
      ])

      // Загружаем задачи из всех досок
      const allTasks = []
      for (const board of boards) {
        const tasks = await getTasks(board.id)
        allTasks.push(...tasks)
      }

      const taskStats = allTasks.reduce((acc, task) => {
        acc.total++
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      }, { total: 0, todo: 0, in_progress: 0, review: 0, done: 0 })

      setStats({
        users: users.length,
        companies: companies.length,
        projects: projects.length,
        boards: boards.length,
        tasks: taskStats
      })

      // Формируем недавнюю активность
      const activity = [
        ...allTasks.slice(0, 5).map(task => ({
          type: 'task',
          title: task.title,
          time: new Date(task.created_at).toLocaleString('ru-RU')
        })),
        ...projects.slice(0, 3).map(project => ({
          type: 'project',
          title: project.name,
          time: new Date(project.created_at).toLocaleString('ru-RU')
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8)

      setRecentActivity(activity)
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Дашборд</h1>
        <p>Обзор системы управления задачами</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card users">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.users}</div>
            <div className="stat-label">Пользователей</div>
          </div>
        </div>

        <div className="stat-card companies">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.companies}</div>
            <div className="stat-label">Компаний</div>
          </div>
        </div>

        <div className="stat-card projects">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.projects}</div>
            <div className="stat-label">Проектов</div>
          </div>
        </div>

        <div className="stat-card boards">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.boards}</div>
            <div className="stat-label">Досок</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section tasks-overview">
          <h2>Задачи</h2>
          <div className="tasks-stats">
            <div className="task-stat">
              <div className="task-stat-label">Всего</div>
              <div className="task-stat-value">{stats.tasks.total}</div>
            </div>
            <div className="task-stat todo">
              <div className="task-stat-label">К выполнению</div>
              <div className="task-stat-value">{stats.tasks.todo}</div>
            </div>
            <div className="task-stat in-progress">
              <div className="task-stat-label">В процессе</div>
              <div className="task-stat-value">{stats.tasks.in_progress}</div>
            </div>
            <div className="task-stat review">
              <div className="task-stat-label">На проверке</div>
              <div className="task-stat-value">{stats.tasks.review}</div>
            </div>
            <div className="task-stat done">
              <div className="task-stat-label">Завершено</div>
              <div className="task-stat-value">{stats.tasks.done}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section recent-activity">
          <h2>Недавняя активность</h2>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'task' ? '✓' : '📁'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-activity">Нет активности</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

