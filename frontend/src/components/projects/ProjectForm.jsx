import { useState } from 'react';
import styles from './ProjectForm.module.css';

export default function ProjectForm({ initialName = '', onSubmit, onCancel, isEditing = false }) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('O nome do projeto é obrigatório');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(name.trim());
      setName('');
      setError('');
    } catch (error) {
      setError('Erro ao salvar projeto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="projectName">Nome do Projeto</label>
        <input
          type="text"
          id="projectName"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Digite o nome do projeto"
          className={error ? styles.error : ''}
          disabled={loading}
          autoFocus
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Projeto'}
        </button>
      </div>
    </form>
  );
}