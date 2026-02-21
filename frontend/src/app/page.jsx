"use client";

import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Container from '../components/layout/Container';
import ProjectList from '../components/projects/ProjectList';
import TaskList from '../components/tasks/TaskList';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import Notification from '../components/common/Notification';
import ProjectForm from '../components/projects/ProjectForm';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import { useNotifications } from '../hooks/useNotifications';
import { getStatusFromDate } from '../utils/dateUtils';
import styles from './page.module.css';

// Dados iniciais para teste
const initialProjects = [
  {
    id: '1',
    name: 'First Test',
    tasks: []
  },
  {
    id: '2',
    name: 'Homework',
    tasks: []
  },
  {
    id: '3',
    name: 'Personal Projects',
    tasks: [
      {
        id: '101',
        title: 'Run',
        responsible: 'Lucas',
        dueDate: '2026-02-23',
        status: 'PENDENTE',
        projectId: '3'
      }
    ]
  }
];

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Notificações
  const allTasks = projects.flatMap(p => p.tasks || []);
  const { notifications, removeNotification } = useNotifications(allTasks);

  // Carregar projetos
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      
      // Tenta carregar do backend, se falhar usa dados iniciais
      let data;
      try {
        data = await projectService.listAll();
      } catch (error) {
        console.log('Usando dados iniciais (backend não disponível)');
        data = initialProjects;
      }
      
      // Atualizar status das tarefas baseado na data
      const projectsWithUpdatedStatus = data.map(project => ({
        ...project,
        tasks: project.tasks?.map(task => ({
          ...task,
          status: getStatusFromDate(task.dueDate, task.status === 'CONCLUIDA')
        })) || []
      }));
      
      setProjects(projectsWithUpdatedStatus);
    } catch (error) {
      alert('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (name) => {
    try {
      // Se backend não disponível, cria localmente
      try {
        await projectService.create(name);
      } catch (error) {
        const newProject = {
          id: Date.now().toString(),
          name,
          tasks: []
        };
        setProjects(prev => [...prev, newProject]);
      }
      await loadProjects();
      setShowProjectModal(false);
    } catch (error) {
      alert('Erro ao criar projeto');
    }
  };

  const handleUpdateProject = async (name) => {
    try {
      try {
        await projectService.update(projectToEdit.id, name);
      } catch (error) {
        setProjects(prev => prev.map(p => 
          p.id === projectToEdit.id ? { ...p, name } : p
        ));
      }
      await loadProjects();
      setProjectToEdit(null);
    } catch (error) {
      alert('Erro ao atualizar projeto');
    }
  };

  const handleDeleteProject = async () => {
    try {
      try {
        await projectService.delete(projectToDelete.id);
      } catch (error) {
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      }
      await loadProjects();
      setProjectToDelete(null);
      
      if (selectedProject?.id === projectToDelete.id) {
        setSelectedProject(null);
      }
    } catch (error) {
      alert('Erro ao excluir projeto');
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      try {
        await taskService.create(taskData);
      } catch (error) {
        // Cria tarefa localmente
        const newTask = {
          id: Date.now().toString(),
          ...taskData,
          status: 'PENDENTE'
        };
        
        setProjects(prev => prev.map(project => 
          project.id === taskData.projectId 
            ? { ...project, tasks: [...(project.tasks || []), newTask] }
            : project
        ));
      }
      await loadProjects();
    } catch (error) {
      alert('Erro ao criar tarefa');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      try {
        await taskService.complete(taskId);
      } catch (error) {
        // Atualiza localmente
        setProjects(prev => prev.map(project => ({
          ...project,
          tasks: project.tasks?.map(task => 
            task.id === taskId ? { ...task, status: 'CONCLUIDA' } : task
          )
        })));
      }
      await loadProjects();
    } catch (error) {
      alert('Erro ao completar tarefa');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      try {
        await taskService.delete(taskId);
      } catch (error) {
        // Remove localmente
        setProjects(prev => prev.map(project => ({
          ...project,
          tasks: project.tasks?.filter(task => task.id !== taskId)
        })));
      }
      await loadProjects();
    } catch (error) {
      alert('Erro ao excluir tarefa');
    }
  };

  if (loading) {
    return (
      <>
        <Header projectCount={projects.length} />
        <Container>
          <Loading />
        </Container>
      </>
    );
  }

  return (
    <main className={styles.main}>
      <Header projectCount={projects.length} />
      
      <Notification 
        notifications={notifications}
        onClose={removeNotification}
      />

      <Container>
        {selectedProject ? (
          <TaskList
            project={selectedProject}
            tasks={selectedProject.tasks || []}
            onAddTask={handleAddTask}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onBack={() => setSelectedProject(null)}
          />
        ) : (
          <ProjectList
            projects={projects}
            onEdit={(project) => setProjectToEdit(project)}
            onDelete={(project) => setProjectToDelete(project)}
            onViewTasks={(project) => setSelectedProject(project)}
            onAddNew={() => setShowProjectModal(true)}
          />
        )}
      </Container>

      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Novo Projeto"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowProjectModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!projectToEdit}
        onClose={() => setProjectToEdit(null)}
        title="Editar Projeto"
      >
        <ProjectForm
          initialName={projectToEdit?.name}
          onSubmit={handleUpdateProject}
          onCancel={() => setProjectToEdit(null)}
          isEditing={true}
        />
      </Modal>

      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Confirmar exclusão"
        showConfirm={true}
        onConfirm={handleDeleteProject}
        confirmText="Excluir"
      >
        <p>Tem certeza que deseja excluir o projeto?</p>
        <p><strong>{projectToDelete?.name}</strong></p>
        <p>Esta ação também excluirá todas as tarefas relacionadas e não pode ser desfeita.</p>
      </Modal>
    </main>
  );
}