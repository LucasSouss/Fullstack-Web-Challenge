import { isOverdue } from './dateUtils';

test('deve retornar verdadeiro para uma data de ontem', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  expect(isOverdue(yesterday)).toBe(true);
});

test('deve retornar falso para uma data de amanhã', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  expect(isOverdue(tomorrow)).toBe(false);
});