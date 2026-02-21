import { useState } from 'react';
import styles from './TaskForm.module.css';

export default function TaskForm({ onSubmit, onCancel, projectId }) {
  const [formData, setFormData] = useState({
    title: '',
    responsible: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'O título da tarefa é obrigatório';
    }
    
    if (!formData.responsible.trim()) {
      newErrors.responsible = 'O nome do responsável é obrigatório';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'A data de conclusão é obrigatória';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'A data não pode ser no passado';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        projectId
      });
      setFormData({ title: '', responsible: '', dueDate: '' });
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Erro ao criar tarefa' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Título da Tarefa</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Digite o título da tarefa"
          className={errors.title ? styles.error : ''}
          disabled={loading}
        />
        {errors.title && <span className={styles.error}>{errors.title}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="responsible">Responsável</label>
        <input
          type="text"
          id="responsible"
          name="responsible"
          value={formData.responsible}
          onChange={handleChange}
          placeholder="Nome do responsável"
          className={errors.responsible ? styles.error : ''}
          disabled={loading}
        />
        {errors.responsible && <span className={styles.error}>{errors.responsible}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dueDate">Data de Conclusão</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className={errors.dueDate ? styles.error : ''}
          disabled={loading}
        />
        {errors.dueDate && <span className={styles.error}>{errors.dueDate}</span>}
      </div>

      {errors.submit && <span className={styles.error}>{errors.submit}</span>}

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
          {loading ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
}