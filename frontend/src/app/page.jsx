"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ProjectList from "../components/projects/ProjectList";
import TaskList from "../components/tasks/TaskList";
import projectService from "../services/projectService";
import taskService from "../services/taskService";
import taskUtilsService from "../services/taskUtilsService";
import Modal from "../components/common/Modal";
import Loading from "../components/common/Loading";
import { useNotifications } from "../hooks/useNotifications";
import Notification from "../components/common/Notification";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [projectNameError, setProjectNameError] = useState("");
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectError, setEditProjectError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const allTasks = projects.flatMap((p) => p.tasks || []);
  const { notifications, removeNotification } = useNotifications(allTasks);

  async function loadData() {
    try {
      setLoading(true);
      
      //CARREGA TAREFAS VENCIDAS
      await taskUtilsService.updateOverdueTasks(); 
      const data = await projectService.listAll();
      setProjects(data);
      if (data.length > 0) {
        const current = data.find((p) => p.id === selectedProject?.id);
        setSelectedProject(current || data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

    //EXCLUIR PROJETO
  const handleConfirmDeleteProject = async () => {
    if (projectToDelete) {
      await projectService.delete(projectToDelete.id);
      setProjectToDelete(null);
      loadData();
    }
  };

  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      setProjectNameError("O nome do projeto é obrigatório");
      return;
    }
    try {
      await projectService.create(newProjectName);
      setNewProjectName("");
      setProjectNameError("");
      setShowAddProjectModal(false);
      await loadData();
    } catch (err) {
      console.error("Erro ao criar projeto", err);
      setProjectNameError("Erro ao criar projeto");
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
          onDeleteProject={(p) => setProjectToDelete(p)}
          onEditProject={(p) => {
            setProjectToEdit(p);
            setEditProjectName(p.name);
            setEditProjectError("");
          }}
        />
        {/* MODAL DE EDIÇÃO DE PROJETO */}
        <Modal
          isOpen={!!projectToEdit}
          onClose={() => {
            setProjectToEdit(null);
            setEditProjectName("");
            setEditProjectError("");
          }}
          title="Editar Projeto"
          showConfirm={true}
          onConfirm={async () => {
            if (!editProjectName.trim()) {
              setEditProjectError("O nome do projeto é obrigatório");
              return;
            }
            try {
              await projectService.update(projectToEdit.id, editProjectName);
              setProjectToEdit(null);
              setEditProjectName("");
              setEditProjectError("");
              await loadData();
            } catch (err) {
              setEditProjectError("Erro ao editar projeto");
            }
          }}
          confirmText="Salvar"
        >
          <div className={styles.modalFormGroup}>
            <input
              type="text"
              placeholder="Nome do projeto"
              className={`${styles.modalInput} ${editProjectError ? styles.inputError : ""}`}
              value={editProjectName}
              onChange={e => {
                setEditProjectName(e.target.value);
                if (editProjectError) setEditProjectError("");
              }}
            />
            {editProjectError && (
              <span className={styles.errorMessage}>{editProjectError}</span>
            )}
          </div>
        </Modal>
        <button
          className={styles.addNewBtn}
          onClick={() => setShowAddProjectModal(true)}
        >
          + Novo Projeto
        </button>
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
                console.error("Erro ao criar tarefa", err);
                alert("Erro ao criar tarefa");
              }
            }}
            onUpdateTask={async (taskId, taskData) => {
              try {
                await taskService.update(taskId, taskData);
                await loadData();
              } catch (err) {
                console.error("Erro ao editar tarefa", err);
                alert("Erro ao editar tarefa");
              }
            }}
            onCompleteTask={async (taskId, newStatus) => {
              try {
                if (newStatus) {
                  await taskService.update(taskId, { status: newStatus });
                } else {
                  await taskService.complete(taskId);
                }
                await loadData();
              } catch (err) {
                console.error("Erro ao completar/atualizar tarefa", err);
                alert("Erro ao completar tarefa");
              }
            }}
            onDeleteTask={async (taskId) => {
              try {
                console.log("Iniciando exclusão de tarefa ID:", taskId);
                await taskService.delete(taskId);
                console.log("Tarefa deletada, recarregando...");
                await loadData();
              } catch (err) {
                console.error("Erro completo ao deletar tarefa:", err);
                alert("Erro ao deletar tarefa");
              }
            }}
            onBack={() => setSelectedProject(null)}
          />
        ) : (
          <div className={styles.emptyState}>Selecione um projeto...</div>
        )}
      </section>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE PROJETO */}
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

      {/* MODAL PARA ADICIONAR NOVO PROJETO */}
      <Modal
        isOpen={showAddProjectModal}
        onClose={() => {
          setShowAddProjectModal(false);
          setNewProjectName("");
          setProjectNameError("");
        }}
        title="Novo Projeto"
      >
        <div className={styles.modalFormGroup}>
          <input
            type="text"
            placeholder="Nome do projeto"
            className={`${styles.modalInput} ${projectNameError ? styles.inputError : ""}`}
            value={newProjectName}
            onChange={(e) => {
              setNewProjectName(e.target.value);
              if (projectNameError) setProjectNameError("");
            }}
          />
          {projectNameError && (
            <span className={styles.errorMessage}>{projectNameError}</span>
          )}
          <div className={styles.modalActions}>
            <button
              className={styles.cancelBtn}
              onClick={() => {
                setShowAddProjectModal(false);
                setNewProjectName("");
                setProjectNameError("");
              }}
            >
              Cancelar
            </button>
            <button
              className={styles.createdBtn}
              onClick={handleAddProject}
            >
              Criar
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}