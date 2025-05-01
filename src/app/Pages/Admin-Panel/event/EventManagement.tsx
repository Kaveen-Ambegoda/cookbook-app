"use client";

import React, { useState } from "react";
import { Calendar, Users, Edit, Trash2, Eye, EyeOff, Info, PlusCircle, X, Save } from "lucide-react";

// Define interfaces for type safety
interface Event {
  id: number;
  title: string;
  type: "competition" | "cooking_session" | "workshop" | "other";
  description: string;
  date: string;
  time: string;
  duration: string;
  host: string;
  maxParticipants: number;
  requirements: string[];
  visible: boolean;
  views: number;
  participants: string[];
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Italian Pasta Championship",
      type: "competition",
      description: "Compete with other chefs to create the best pasta dish. Winners will be featured on our homepage.",
      date: "2025-05-15",
      time: "14:00",
      duration: "3 hours",
      host: "Chef Marco",
      maxParticipants: 20,
      requirements: ["Own cooking equipment", "Camera setup", "Ingredients for pasta dish"],
      visible: true,
      views: 245,
      participants: ["user123", "user456", "user789", "user234", "user567"]
    },
    {
      id: 2,
      title: "Baking Basics Workshop",
      type: "workshop",
      description: "Learn the fundamentals of baking with our expert pastry chef. Perfect for beginners!",
      date: "2025-05-20",
      time: "10:00",
      duration: "2 hours",
      host: "Chef Elise",
      maxParticipants: 30,
      requirements: ["Basic baking tools", "Flour, sugar, eggs"],
      visible: true,
      views: 189,
      participants: ["user123", "user890", "user234"]
    },
    {
      id: 3,
      title: "Asian Fusion Cooking Session",
      type: "cooking_session",
      description: "Join us for a live cooking session exploring Asian fusion cuisine techniques.",
      date: "2025-05-25",
      time: "18:00",
      duration: "1.5 hours",
      host: "Chef Hiroshi",
      maxParticipants: 50,
      requirements: ["Wok or large pan", "Basic Asian ingredients"],
      visible: false,
      views: 0,
      participants: []
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showNewEventForm, setShowNewEventForm] = useState<boolean>(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id" | "views" | "participants">>({
    title: "",
    type: "cooking_session",
    description: "",
    date: "",
    time: "",
    duration: "",
    host: "",
    maxParticipants: 20,
    requirements: [""],
    visible: true
  });

  // Event actions
  const toggleVisibility = (id: number) => {
    setEvents(events.map(event => 
      event.id === id ? {...event, visible: !event.visible} : event
    ));
  };

  const deleteEvent = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(event => event.id !== id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
        setShowDetails(false);
        setIsEditing(false);
      }
    }
  };

  const viewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetails(true);
    setIsEditing(false);
  };

  const startEditing = () => {
    if (selectedEvent) {
      setEditedEvent({...selectedEvent});
      setIsEditing(true);
    }
  };

  const saveEditedEvent = () => {
    if (editedEvent) {
      setEvents(events.map(event => 
        event.id === editedEvent.id ? editedEvent : event
      ));
      setSelectedEvent(editedEvent);
      setIsEditing(false);
    }
  };

  const addRequirement = () => {
    if (isEditing && editedEvent) {
      setEditedEvent({
        ...editedEvent,
        requirements: [...editedEvent.requirements, ""]
      });
    } else if (showNewEventForm) {
      setNewEvent({
        ...newEvent,
        requirements: [...newEvent.requirements, ""]
      });
    }
  };

  const updateRequirement = (index: number, value: string) => {
    if (isEditing && editedEvent) {
      const updatedRequirements = [...editedEvent.requirements];
      updatedRequirements[index] = value;
      setEditedEvent({
        ...editedEvent,
        requirements: updatedRequirements
      });
    } else if (showNewEventForm) {
      const updatedRequirements = [...newEvent.requirements];
      updatedRequirements[index] = value;
      setNewEvent({
        ...newEvent,
        requirements: updatedRequirements
      });
    }
  };

  const removeRequirement = (index: number) => {
    if (isEditing && editedEvent) {
      const updatedRequirements = [...editedEvent.requirements];
      updatedRequirements.splice(index, 1);
      setEditedEvent({
        ...editedEvent,
        requirements: updatedRequirements
      });
    } else if (showNewEventForm) {
      const updatedRequirements = [...newEvent.requirements];
      updatedRequirements.splice(index, 1);
      setNewEvent({
        ...newEvent,
        requirements: updatedRequirements
      });
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setIsEditing(false);
  };

  const openNewEventForm = () => {
    setShowNewEventForm(true);
    setShowDetails(false);
  };

  const closeNewEventForm = () => {
    setShowNewEventForm(false);
  };

  const createNewEvent = () => {
    // Validate form
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.host) {
      alert("Please fill out all required fields.");
      return;
    }

    const nextId = Math.max(...events.map(event => event.id), 0) + 1;
    
    const createdEvent: Event = {
      ...newEvent,
      id: nextId,
      views: 0,
      participants: []
    };

    setEvents([...events, createdEvent]);
    setShowNewEventForm(false);
    
    // Reset the new event form
    setNewEvent({
      title: "",
      type: "cooking_session",
      description: "",
      date: "",
      time: "",
      duration: "",
      host: "",
      maxParticipants: 20,
      requirements: [""],
      visible: true
    });
  };

  // Helper to format type for display
  const formatEventType = (type: string) => {
    return type.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  // Event Form Component
  const EventForm = ({ 
    event, 
    setEvent, 
    isNew = false 
  }: { 
    event: Event | Omit<Event, "id" | "views" | "participants">, 
    setEvent: React.Dispatch<React.SetStateAction<any>>,
    isNew?: boolean
  }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title*</label>
        <input
          type="text"
          value={event.title}
          onChange={(e) => setEvent({...event, title: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Type*</label>
        <select
          value={event.type}
          onChange={(e) => setEvent({...event, type: e.target.value as any})}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="competition">Competition</option>
          <option value="cooking_session">Cooking Session</option>
          <option value="workshop">Workshop</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={event.description}
          onChange={(e) => setEvent({...event, description: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
          <input
            type="date"
            value={event.date}
            onChange={(e) => setEvent({...event, date: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time*</label>
          <input
            type="time"
            value={event.time}
            onChange={(e) => setEvent({...event, time: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            value={event.duration}
            onChange={(e) => setEvent({...event, duration: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g. 2 hours"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Host*</label>
          <input
            type="text"
            value={event.host}
            onChange={(e) => setEvent({...event, host: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Participants</label>
        <input
          type="number"
          value={event.maxParticipants}
          onChange={(e) => setEvent({...event, maxParticipants: parseInt(e.target.value)})}
          className="w-full p-2 border border-gray-300 rounded"
          min="1"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          <button 
            type="button" 
            onClick={addRequirement}
            className="text-blue-500 text-sm hover:text-blue-700 flex items-center gap-1"
          >
            <PlusCircle size={14} /> Add
          </button>
        </div>
        {event.requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={req}
              onChange={(e) => updateRequirement(index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="Requirement"
            />
            {event.requirements.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeRequirement(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id={isNew ? "newEventVisibility" : "editEventVisibility"}
          checked={event.visible}
          onChange={(e) => setEvent({...event, visible: e.target.checked})}
          className="mr-2"
        />
        <label htmlFor={isNew ? "newEventVisibility" : "editEventVisibility"} className="text-sm text-gray-700">
          Visible to users
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <button
          onClick={openNewEventForm}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusCircle size={18} />
          <span>New Event</span>
        </button>
      </div>

      {/* New Event Form */}
      {showNewEventForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-4">
          <div className="flex justify-between mb-4 items-center">
            <h3 className="text-xl font-bold">Create New Event</h3>
            <button 
              onClick={closeNewEventForm}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <EventForm 
            event={newEvent} 
            setEvent={setNewEvent} 
            isNew={true} 
          />
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={createNewEvent}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 w-full sm:w-auto"
            >
              <Save size={18} />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Event Details & Edit Form */}
      {showDetails && selectedEvent && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-4">
          <div className="flex justify-between mb-4 items-center">
            {isEditing ? (
              <h3 className="text-xl font-bold">Edit Event</h3>
            ) : (
              <h3 className="text-xl sm:text-2xl font-bold">{selectedEvent.title}</h3>
            )}
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={startEditing}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                >
                  <Edit size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              )}
              <button 
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {isEditing && editedEvent ? (
            <>
              <EventForm 
                event={editedEvent} 
                setEvent={setEditedEvent} 
              />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveEditedEvent}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 w-full sm:w-auto"
                >
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Type:</span> {formatEventType(selectedEvent.type)}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Host:</span> {selectedEvent.host}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Date:</span> {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Time:</span> {selectedEvent.time}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Duration:</span> {selectedEvent.duration}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Status:</span> 
                    <span className="inline-flex items-center gap-1 ml-1">
                      {selectedEvent.visible ? (
                        <>
                          <Eye size={16} className="text-green-600" />
                          <span className="text-green-600">Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={16} className="text-red-600" />
                          <span className="text-red-600">Hidden</span>
                        </>
                      )}
                    </span>
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Max Participants:</span> {selectedEvent.maxParticipants}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Current Participants:</span> {selectedEvent.participants.length}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Views:</span> {selectedEvent.views}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Participation Rate:</span> {
                      selectedEvent.views > 0 
                        ? `${((selectedEvent.participants.length / selectedEvent.views) * 100).toFixed(1)}%` 
                        : "N/A"
                    }
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2">Description:</h4>
                <p className="text-gray-700">{selectedEvent.description}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2">Requirements:</h4>
                <ul className="list-disc pl-5">
                  {selectedEvent.requirements.map((requirement, index) => (
                    <li key={index} className="text-gray-700">{requirement}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2">Participants:</h4>
                {selectedEvent.participants.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {selectedEvent.participants.map((user, index) => (
                      <li key={index} className="text-gray-700">{user}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No participants yet</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Events List */}
      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {formatEventType(event.type)}
                  </span>
                </div>
                <p className="text-gray-600">Host: {event.host}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Users size={14} />
                    {event.participants.length}/{event.maxParticipants}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Eye size={14} />
                    {event.views}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  {event.visible ? (
                    <>
                      <Eye size={16} className="text-green-600" />
                      <span className="text-green-600">Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} className="text-red-600" />
                      <span className="text-red-600">Hidden</span>
                    </>
                  )}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
                <button
                  onClick={() => viewDetails(event)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                  title="View Details"
                >
                  <Info size={16} /> 
                  <span>Details</span>
                </button>
                <button
                  onClick={() => toggleVisibility(event.id)}
                  className={`px-3 py-1 ${event.visible ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} text-white rounded flex items-center gap-1`}
                  title={event.visible ? "Hide Event" : "Show Event"}
                >
                  {event.visible ? (
                    <>
                      <EyeOff size={16} />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      <span>Show</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                  title="Delete Event"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {events.length === 0 && (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-700">No events available</p>
        </div>
      )}
    </div>
  );
}