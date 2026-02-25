import { formatDate, isOverdue, isNearDue, getStatusText } from '../../utils/dateUtils';
import styles from './TaskItem.module.css';

export default function TaskItem({ task, onComplete, onDelete }) {
  const isTaskOverdue = task.status !== 'CONCLUIDA' && isOverdue(task.dueDate);
  const isTaskNearDue = task.status !== 'CONCLUIDA' && isNearDue(task.dueDate);

  const getStatusClass = () => {
    if (task.status === 'CONCLUIDA') return styles.concluida;
    if (task.status === 'VENCIDA') return styles.vencida;
    return styles.pendente;
  };

  const handleToggle = () => {

  const newStatus = task.status === 'CONCLUIDA' ? 'PENDENTE' : 'CONCLUIDA';
  onComplete(task.id, newStatus); 
}; 


  return (
    <div className={`${styles.taskItem} ${task.status === 'CONCLUIDA' ? styles.completed : ''}`}>
      <input 
  type="checkbox" 
  checked={task.status === 'CONCLUIDA'} 
  onChange={handleToggle} 
/>
      
      <div className={styles.taskInfo}>
        <div className={styles.taskHeader}>
          <h4>{task.title}</h4>
          <span className={styles.responsible}>{task.responsible}</span>
        </div>
        
        <div className={styles.taskMeta}>
          <span className={`${styles.dueDate} ${isTaskOverdue ? styles.overdue : ''} ${isTaskNearDue ? styles.nearDue : ''}`}>
            {formatDate(task.dueDate)}
          </span>
          <span className={`${styles.status} ${getStatusClass()}`}>
            {getStatusText(task.status)}
          </span>
        </div>
      </div>
      
      <div className={styles.actions}>
        {task.status !== 'CONCLUIDA' && (
          <button
            className={styles.completeButton}
            onClick={() => onComplete(task.id)}
            title="Marcar como concluída"
          >
            Concluir
          </button>
        )}
        <button
          className={styles.deleteTaskButton}
          onClick={() => onDelete(task)}
          title="Excluir tarefa"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}