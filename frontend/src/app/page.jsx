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

  useEffect(() => {
    loadData();
  }, []);

  const allTasks = projects.map((p) => p.tasks || []);
  const { notifications, removeNotification } = useNotifications(allTasks);

  async function loadData() {
    try {
      setLoading(true);
      // Atualiza tarefas vencidas no backend antes de carregar projetos
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
        />
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
                console.error("Status:", err.response?.status);
                console.error("Dados do erro:", err.response?.data);
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Nome do projeto"
            value={newProjectName}
            onChange={(e) => {
              setNewProjectName(e.target.value);
              if (projectNameError) setProjectNameError("");
            }}
            style={{
              padding: "0.75rem",
              border: projectNameError ? "2px solid #ef4444" : "1px solid #ccc",
              borderRadius: "0.375rem",
              fontSize: "1rem"
            }}
          />
          {projectNameError && (
            <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>{projectNameError}</span>
          )}
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setShowAddProjectModal(false);
                setNewProjectName("");
                setProjectNameError("");
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "#e5e7eb",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleAddProject}
              style={{
                padding: "0.5rem 1rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              Criar
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
