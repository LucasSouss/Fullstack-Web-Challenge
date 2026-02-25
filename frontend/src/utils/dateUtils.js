export const formatDate = (dateString) => {
  if (!dateString) return "";
  // Converter ISO string para local date
  const [yearsMonthDay] = dateString.split("T");
  const [year, month, day] = yearsMonthDay.split("-");
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
};

export const parseLocalDate = (dateString) => {
  if (!dateString) return new Date();
  // Parse YYYY-MM-DD como data local
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const toISODateString = (date) => {
  // Converte data local para YYYY-MM-DD para enviar ao servidor
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const todayStr = toISODateString(today);
  
  const dueStr = dateString.split("T")[0];
  return dueStr < todayStr;
};

export const isNearDue = (dateString, days = 2) => {
  if (!dateString) return false;
  const today = new Date();
  const todayStr = toISODateString(today);
  const dueStr = dateString.split("T")[0];

  const [dueY, dueM, dueD] = dueStr.split("-").map(Number);
  const [todayY, todayM, todayD] = todayStr.split("-").map(Number);

  const dueDate = new Date(dueY, dueM - 1, dueD);
  const todayDate = new Date(todayY, todayM - 1, todayD);

  const diffTime = dueDate.getTime() - todayDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= days;
};

export const getStatusText = (status) => {
  const statusMap = {
    PENDENTE: "Pendente",
    CONCLUIDA: "Concluída",
    VENCIDA: "Vencida",
  };
  return statusMap[status] || status;
};

export const getStatusFromDate = (dueDate, isCompleted) => {
  if (isCompleted) return "CONCLUIDA";
  return isOverdue(dueDate) ? "VENCIDA" : "PENDENTE";
};
