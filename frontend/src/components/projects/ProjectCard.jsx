import { formatDate } from '../../utils/dateUtils';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project, onEdit, onDelete, onViewTasks }) {
  
  const firstTask = project.tasks?.[0];
  
  const taskStats = {
    completed: project.tasks?.filter(t => t.status === 'CONCLUIDA').length || 0,
    pending: project.tasks?.filter(t => t.status === 'PENDENTE').length || 0,
    overdue: project.tasks?.filter(t => t.status === 'VENCIDA').length || 0,
  };

  return (
    <div className={styles.projectCard}>
      <div className={styles.projectHeader}>
        <h3>{project.name}</h3>
        <div className={styles.actions}>
          <button className={styles.editButton} onClick={() => onEdit(project)}>
            Editor
          </button>
          <button className={styles.deleteButton} onClick={() => onDelete(project)}>
            Excluir
          </button>
        </div>
      </div>

      <div className={styles.tasks}>
        {firstTask ? (
          <div className={styles.taskItem}>
            <div className={styles.taskContent}>
              <div className={styles.taskTitle}>
                {firstTask.title}
                <span>@{firstTask.responsible?.toLowerCase()}</span>
              </div>
              <div className={styles.taskMeta}>
                <span className={styles.taskResponsible}>
                  {firstTask.responsible}
                </span>
                <span className={styles.taskDueDate}>
                  {formatDate(firstTask.dueDate)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noTasks}>
            Nenhuma tarefa ainda
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{taskStats.completed}</span>
          <span className={styles.statLabel}>CONCLUÍDAS</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{taskStats.pending}</span>
          <span className={styles.statLabel}>PENDENTES</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{taskStats.overdue}</span>
          <span className={styles.statLabel}>VENCIDAS</span>
        </div>
      </div>

      <button className={styles.viewButton} onClick={() => onViewTasks(project)}>
        Ver todas as tarefas
      </button>
    </div>
  );
}