import ProjectCard from './ProjectCard';
import styles from './ProjectList.module.css';

export default function ProjectList({ projects, onEdit, onDelete, onViewTasks, onAddNew }) {
  if (projects.length === 0) {
    return (
      <div className={styles.projectList}>
        <div className={styles.emptyState}>
          <p>Nenhum projeto encontrado</p>
          <p>Comece criando seu primeiro projeto</p>
          <button onClick={onAddNew}>
            + Novo Projeto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectList}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewTasks={onViewTasks}
        />
      ))}
      <button onClick={onAddNew} className={styles.addButton}>
        Novo Projeto
      </button>
    </div>
  );
}