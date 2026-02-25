import styles from './ProjectList.module.css';
import { FaPen } from "react-icons/fa"

export default function ProjectList({ projects, onViewTasks, selectedId, onDeleteProject, onEditProject }) {
  return (
    <nav className={styles.nav}>
      {projects.map((project) => (
        <div key={project.id} className={styles.projectWrapper}>
          <button 
            className={`${styles.item} ${selectedId === project.id ? styles.active : ''}`}
            onClick={() => onViewTasks(project)}
          >
            {project.name} {selectedId === project.id && '>'}
          </button>
          <button 
            className={styles.editBtn}
            onClick={() => onEditProject && onEditProject(project)}
            >
            <FaPen />
          </button>
          <button 
            className={styles.deleteBtn}
            onClick={() => onDeleteProject(project)}
          >
            ×
          </button>
        </div>
      ))}
    </nav>
  );
}