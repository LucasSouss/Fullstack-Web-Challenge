import styles from './Header.module.css';

export default function Header({ projectCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.logo}>Gerenciador de Projetos</span>
        <span className={styles.projectCount}>
          {projectCount} {projectCount === 1 ? 'Projeto' : 'Projetos'}
        </span>
      </div>
    </header>
  );
}