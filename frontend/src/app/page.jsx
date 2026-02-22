"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import ProjectList from '../components/projects/ProjectList';
import TaskList from '../components/tasks/TaskList';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import { useNotifications } from '../hooks/useNotifications';
import Notification from '../components/common/Notification';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null); // Novo estado
  
  useEffect(() => {
    loadData();
  }, []);

  const allTasks = projects.flatMap(p => p.tasks || []);
  const { notifications, removeNotification } = useNotifications(allTasks);

  async function loadData() {
    try {
      setLoading(true);
      const data = await projectService.listAll();
      setProjects(data);
      if (data.length > 0) {
        const current = data.find(p => p.id === selectedProject?.id);
        setSelectedProject(current || data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmDeleteProject = async () => {
    if (projectToDelete) {
      await projectService.delete(projectToDelete.id);
      setProjectToDelete(null);
      loadData();
    }
  };

  if (loading) return <Loading />;

  return (
    <main className={styles.mainContainer}>
      <Notification 
        notifications={notifications} 
        onClose={removeNotification} 
      />
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Projects</h2>
        <ProjectList 
          projects={projects} 
          selectedId={selectedProject?.id}
          onViewTasks={(p) => setSelectedProject(p)}
          onDeleteProject={(p) => setProjectToDelete(p)} // Nova prop
        />
        <button className={styles.addNewBtn}>+ New Project</button>
      </aside>

      <section className={styles.contentArea}>
        {selectedProject ? (
          <TaskList 
            project={selectedProject} 
            tasks={selectedProject.tasks || []} 
            onAddTask={async (taskData) => {
              try {
                await taskService.create(taskData);
                await loadData();
              } catch (err) {
                console.error('Erro ao criar tarefa', err);
                alert('Erro ao criar tarefa');
              }
            }}
            onCompleteTask={async (taskId, newStatus) => {
              try {
                if (newStatus) {
                  // toggle back to PENDENTE or set explicit status
                  await taskService.update(taskId, { status: newStatus });
                } else {
                  await taskService.complete(taskId);
                }
                await loadData();
              } catch (err) {
                console.error('Erro ao completar/atualizar tarefa', err);
                alert('Erro ao completar tarefa');
              }
            }}
            onDeleteTask={async (taskId) => {
              try {
                console.log('Iniciando exclusão de tarefa ID:', taskId);
                await taskService.delete(taskId);
                console.log('Tarefa deletada, recarregando...');
                await loadData();
              } catch (err) {
                console.error('Erro completo ao deletar tarefa:', err);
                console.error('Status:', err.response?.status);
                console.error('Dados do erro:', err.response?.data);
                alert('Erro ao deletar tarefa');
              }
            }}
            onBack={() => setSelectedProject(null)}
          />
        ) : (
          <div className={styles.emptyState}>Selecione um projeto...</div>
        )}
      </section>

      {/* MODAL DE CONFIRMAÇÃO IGUAL AO DE TAREFAS */}
      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Confirmar exclusão"
        showConfirm={true}
        onConfirm={handleConfirmDeleteProject}
        confirmText="Excluir"
      >
        <p>Tem certeza que deseja excluir o projeto <strong>{projectToDelete?.name}</strong>?</p>
        <p>Todas as tarefas relacionadas serão removidas permanentemente.</p>
      </Modal>
    </main>
  );
}