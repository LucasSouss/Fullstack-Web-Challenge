import { useState } from 'react';
import { getStatusFromDate } from '../../utils/dateUtils';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import Modal from '../common/Modal';
import styles from './TaskList.module.css';

export default function TaskList({ 
  project, 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onCompleteTask, 
  onDeleteTask,
  onBack 
}) {
  // Rotina automática: atualiza status local de tarefas vencidas
  const normalizedTasks = tasks.map(task => {
    if (task.status !== 'CONCLUIDA') {
      const newStatus = getStatusFromDate(task.dueDate, false);
      if (newStatus !== task.status) {
        return { ...task, status: newStatus };
      }
    }
    return task;
  });
  const [filter, setFilter] = useState('TODAS');
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const filterTasks = () => {
    if (filter === 'TODAS') return normalizedTasks;
    if (filter === 'PENDENTES') return normalizedTasks.filter(t => t.status === 'PENDENTE');
    if (filter === 'CONCLUIDAS') return normalizedTasks.filter(t => t.status === 'CONCLUIDA');
    if (filter === 'VENCIDAS') return normalizedTasks.filter(t => t.status === 'VENCIDA');
    return normalizedTasks;
  };

  const filteredTasks = filterTasks();

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const taskStats = {
    total: normalizedTasks.length,
    completed: normalizedTasks.filter(t => t.status === 'CONCLUIDA').length,
    pending: normalizedTasks.filter(t => t.status === 'PENDENTE').length,
    overdue: normalizedTasks.filter(t => t.status === 'VENCIDA').length,
  };

  return (
    <div className={styles.taskList}>
      <button onClick={onBack} className={styles.backButton}>
        Voltar para Projetos
      </button>

      <div className={styles.projectInfo}>
        <h3>{project?.name}</h3>
        <div className={styles.taskStats}>
          <span className={styles.completed}>✅ {taskStats.completed}</span>
          <span className={styles.pending}>⏳ {taskStats.pending}</span>
          <span className={styles.overdue}>⚠️ {taskStats.overdue}</span>
        </div>
      </div>

      <div className={styles.header}>
        <h2 className={styles.titleHeader}>Tarefas</h2>
        <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${filter === 'TODAS' ? styles.active : ''}`}
              onClick={() => setFilter('TODAS')}
            >
              Todas ({taskStats.total})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'PENDENTES' ? styles.active : ''}`}
              onClick={() => setFilter('PENDENTES')}
            >
              Pendentes ({taskStats.pending})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'CONCLUIDAS' ? styles.active : ''}`}
              onClick={() => setFilter('CONCLUIDAS')}
            >
              Concluídas ({taskStats.completed})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'VENCIDAS' ? styles.active : ''}`}
              onClick={() => setFilter('VENCIDAS')}
            >
              Vencidas ({taskStats.overdue})
            </button>
        </div>
      </div>

      {/* LISTA DE TAREFAS */}
      <div className={styles.tasks}>
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyTasks}>
            <p>Nenhuma tarefa encontrada</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TaskItem
                task={task}
                onComplete={onCompleteTask}
                onDelete={handleDeleteClick}
              />
              {/* ACRESCENTADO: Botão de Edição */}
              <button 
                onClick={() => setTaskToEdit(task)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Editar tarefa"
              >
                ✏️
              </button>
            </div>
          ))
        )}
      </div>

      
      <button 
        className={styles.addTaskBtn} 
        onClick={() => setShowAddModal(true)}
      >
        + Adicionar Tarefa
      </button>


      {/* MODAL DE ADIÇÃO */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Nova Tarefa"
      >
        <TaskForm
            onSubmit={async (taskData) => {
              await onAddTask({
                ...taskData,
                projectId: project.id 
              });
              setShowAddModal(false);
            }}
            onCancel={() => setShowAddModal(false)}
            projectId={project?.id}
          />
      </Modal>

      {/* ACRESCENTADO: MODAL DE EDIÇÃO */}
      <Modal
        isOpen={!!taskToEdit}
        onClose={() => setTaskToEdit(null)}
        title="Editar Tarefa"
      >
        <TaskForm
          initialData={taskToEdit}
          onSubmit={async (taskData) => {
            await onUpdateTask(taskToEdit.id, taskData);
            setTaskToEdit(null);
          }}
          onCancel={() => setTaskToEdit(null)}
          projectId={project?.id}
        />
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Confirmar exclusão"
        showConfirm={true}
        onConfirm={handleConfirmDelete}
        confirmText="Excluir"
      >
        <p>Tem certeza que deseja excluir a tarefa?</p>
        <p><strong>{taskToDelete?.title}</strong></p>
        <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
}