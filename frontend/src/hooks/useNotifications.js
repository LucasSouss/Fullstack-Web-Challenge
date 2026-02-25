import { useState, useEffect, useCallback, useRef } from 'react';
import { isOverdue, isNearDue } from '../utils/dateUtils';

export const useNotifications = (tasks = []) => {
  const [notifications, setNotifications] = useState([]);
  

  const shownRef = useRef(new Set());

  const checkTasks = useCallback(() => {
    
    if (!tasks || tasks.length === 0) return;

    const newNotifications = [];
    const currentShown = shownRef.current;

    tasks.forEach(task => {
     
      if (task.status === 'CONCLUIDA') return;

      const taskId = task.id;
      const overdueKey = `${taskId}-overdue`;
      const nearKey = `${taskId}-near`;

      const rawDate = task.dueDate; 

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
      
      setNotifications(prev => [...newNotifications, ...prev]);
    }
  }, [tasks]);

  useEffect(() => {
    
    checkTasks();

    
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