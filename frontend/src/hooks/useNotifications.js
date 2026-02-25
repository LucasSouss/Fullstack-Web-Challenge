import { useState, useEffect, useCallback, useRef } from 'react';
import { isOverdue, isNearDue } from '../utils/dateUtils';

export const useNotifications = (tasks = []) => {
  const [notifications, setNotifications] = useState([]);
  
  // useRef mantém a lista de notificações já disparadas para não repetir alertas
  const shownRef = useRef(new Set());

  const checkTasks = useCallback(() => {
    // Se não houver tarefas, não há o que verificar
    if (!tasks || tasks.length === 0) return;

    const newNotifications = [];
    const currentShown = shownRef.current;

    tasks.forEach(task => {
      // 1. Regra de Negócio: Tarefa concluída não gera notificação
      if (task.status === 'CONCLUIDA') return;

      const taskId = task.id;
      const overdueKey = `${taskId}-overdue`;
      const nearKey = `${taskId}-near`;

      // IMPORTANTE: Usamos task.dueDate (string) pois o dateUtils usa .split()
      const rawDate = task.dueDate; 

      // 2. Lógica de Vencimento (Já passou do prazo)
      // Passamos a string rawDate para evitar erro de .split() no dateUtils
      if (isOverdue(rawDate)) {
        if (!currentShown.has(overdueKey)) {
          newNotifications.push({
            id: `${overdueKey}-${Date.now()}`,
            type: 'overdue',
            message: `⚠️ Tarefa "${task.title}" está VENCIDA!`,
          });
          currentShown.add(overdueKey);
        }
      } 
      // 3. Lógica de Próximo do Vencimento (Vence em até 2 dias e NÃO está vencida)
      else if (isNearDue(rawDate, 2)) {
        if (!currentShown.has(nearKey)) {
          newNotifications.push({
            id: `${nearKey}-${Date.now()}`,
            type: 'nearDue',
            message: `⏰ Tarefa "${task.title}" vence em até 2 dias!`,
          });
          currentShown.add(nearKey);
        }
      }
    });

    if (newNotifications.length > 0) {
      // Adicionamos as novas notificações no topo da lista
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  }, [tasks]);

  useEffect(() => {
    // Verifica assim que as tarefas carregam
    checkTasks();

    // Cria um intervalo para monitorar a passagem do tempo enquanto a página está aberta
    const interval = setInterval(checkTasks, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [checkTasks]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    removeNotification
  };
};