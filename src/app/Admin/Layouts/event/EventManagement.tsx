"use client";

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Edit, Trash2, Plus } from 'lucide-react';
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEventById,
  CookingEvent
} from '@/app/Admin/Layouts/Data/eventData';
import { v4 as uuidv4 } from 'uuid';

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<CookingEvent[]>([]);
  const [formData, setFormData] = useState<Partial<CookingEvent>>({});
  const [editingEvent, setEditingEvent] = useState<CookingEvent | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((err) => console.error('Error loading events:', err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.chef) return;

    const newEvent: CookingEvent = {
      id: editingEvent ? editingEvent.id : uuidv4(),
      title: formData.title!,
      description: formData.description || '',
      date: formData.date!,
      time: formData.time || '10:00',
      duration: Number(formData.duration) || 120,
      location: formData.location || '',
      maxParticipants: Number(formData.maxParticipants) || 12,
      currentParticipants: editingEvent ? editingEvent.currentParticipants : 0,
      price: Number(formData.price) || 0,
      cuisine: formData.cuisine || '',
      difficulty: formData.difficulty as 'Beginner' | 'Intermediate' | 'Advanced' || 'Beginner',
      chef: formData.chef!,
      image: formData.image || '/api/placeholder/300/200',
      isVisible: true,
      createdAt: new Date().toISOString()
    };

    try {
      if (editingEvent) {
        await updateEvent(newEvent);
        setEvents(events.map(e => e.id === newEvent.id ? newEvent : e));
      } else {
        await createEvent(newEvent);
        setEvents([...events, newEvent]);
      }
      setFormData({});
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  const toggleVisibility = (id: string) => {
    const updated = events.map(e =>
      e.id === id ? { ...e, isVisible: !e.isVisible } : e
    );
    setEvents(updated);
  };

  const startEdit = (event: CookingEvent) => {
    setEditingEvent(event);
    setFormData(event);
    setShowForm(true);
  };

  const deleteEvent = async (id: string) => {
    if (confirm('Are you sure to delete this event?')) {
      await deleteEventById(id);
      setEvents(events.filter(e => e.id !== id));
    }
  };
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cooking Event Management</h1>
        <button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <input name="title" onChange={handleInputChange} value={formData.title || ''} placeholder="Title" className="border p-2 w-full" />
          <input name="chef" onChange={handleInputChange} value={formData.chef || ''} placeholder="Chef" className="border p-2 w-full" />
          <input name="date" type="date" onChange={handleInputChange} value={formData.date || ''} className="border p-2 w-full" />
          <input name="time" type="time" onChange={handleInputChange} value={formData.time || ''} className="border p-2 w-full" />
          <input name="duration" type="number" onChange={handleInputChange} value={formData.duration || ''} placeholder="Duration (minutes)" className="border p-2 w-full" />
          <input name="location" onChange={handleInputChange} value={formData.location || ''} placeholder="Location" className="border p-2 w-full" />
          <input name="maxParticipants" type="number" onChange={handleInputChange} value={formData.maxParticipants || ''} placeholder="Max Participants" className="border p-2 w-full" />
          <input name="price" type="number" onChange={handleInputChange} value={formData.price || ''} placeholder="Price" className="border p-2 w-full" />
          <input name="cuisine" onChange={handleInputChange} value={formData.cuisine || ''} placeholder="Cuisine" className="border p-2 w-full" />
          <select name="difficulty" onChange={handleInputChange} value={formData.difficulty || 'Beginner'} className="border p-2 w-full">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">{editingEvent ? 'Update' : 'Add'} Event</button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {events.map(event => (
          <div key={event.id} className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p><strong>Chef:</strong> {event.chef}</p>
            <p><strong>Date:</strong> {event.date} at {event.time}</p>
            <p><strong>Visibility:</strong> {event.isVisible ? 'Visible' : 'Hidden'}</p>

            <div className="flex gap-2">
              <button onClick={() => toggleVisibility(event.id)} className="text-sm px-2 py-1 bg-yellow-500 rounded text-white flex items-center">
                {event.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} Toggle
              </button>
              <button onClick={() => startEdit(event)} className="text-sm px-2 py-1 bg-blue-500 rounded text-white flex items-center">
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => deleteEvent(event.id)} className="text-sm px-2 py-1 bg-red-500 rounded text-white flex items-center">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventManagement;
