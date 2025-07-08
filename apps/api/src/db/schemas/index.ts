import { questionsTable } from './questions.ts';
import { roomsTable } from './room.ts';

export const schema = {
  rooms: roomsTable,
  questions: questionsTable,
};
