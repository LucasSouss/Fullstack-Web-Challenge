export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const isOverdue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const isNearDue = (dueDate, days = 2) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= days;
};

export const getStatusText = (status) => {
  const statusMap = {
    'PENDENTE': 'Pendente',
    'CONCLUIDA': 'Concluída',
    'VENCIDA': 'Vencida'
  };
  return statusMap[status] || status;
};

export const getStatusFromDate = (dueDate, isCompleted) => {
  if (isCompleted) return 'CONCLUIDA';
  return isOverdue(dueDate) ? 'VENCIDA' : 'PENDENTE';
};