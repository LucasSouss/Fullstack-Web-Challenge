import { useState, useEffect } from 'react';
import { isOverdue, isNearDue } from '../utils/dateUtils';

export const useNotifications = (tasks) => {
  const [notifications, setNotifications] = useState([]);
  const [shownNotifications, setShownNotifications] = useState(new Set());

  useEffect(() => {
    const checkTasks = () => {
      const newNotifications = [];

      tasks.forEach(task => {
        if (task.status === 'CONCLUIDA') return;

        const taskId = task.id;
        
        if (isOverdue(task.dueDate) && !shownNotifications.has(`${taskId}-overdue`)) {
          newNotifications.push({
            id: `${taskId}-overdue-${Date.now()}`,
            type: 'overdue',
            message: `⚠️ Tarefa "${task.title}" está VENCIDA!`,
          });
          setShownNotifications(prev => new Set([...prev, `${taskId}-overdue`]));
        }
        
        if (isNearDue(task.dueDate, 2) && !shownNotifications.has(`${taskId}-near`)) {
          newNotifications.push({
            id: `${taskId}-near-${Date.now()}`,
            type: 'nearDue',
            message: `⏰ Tarefa "${task.title}" vence em até 2 dias!`,
          });
          setShownNotifications(prev => new Set([...prev, `${taskId}-near`]));
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    };

    checkTasks();
    
    const interval = setInterval(checkTasks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, shownNotifications]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    removeNotification
  };
};