// app/Layouts/Data/eventData.ts
import axios from 'axios';

export interface CookingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  cuisine: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  chef: string;
  image: string;
  isVisible: boolean;
  createdAt: string;
}

const API_BASE = 'https://localhost:7155/api/CookingEvents';


export const fetchEvents = async (): Promise<CookingEvent[]> => {
  const res = await axios.get<CookingEvent[]>(API_BASE);
  return res.data;
};

export const createEvent = async (event: CookingEvent): Promise<void> => {
  await axios.post(API_BASE, event);
};

export const updateEvent = async (event: CookingEvent): Promise<void> => {
  await axios.put(`${API_BASE}/${event.id}`, event);
};

export const deleteEventById = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};
