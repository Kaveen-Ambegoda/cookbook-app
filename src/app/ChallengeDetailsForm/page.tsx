"use client";
import React, { useState } from "react";
import axios from "axios";

// Define the type for your form state
type ChallengeFormState = {
  title: string;
  subtitle: string;
  date: string;
  sponsor: string;
  description: string;
  requirements: string[];
  timelineRegistration: string;
  timelineJudging: string;
  timelineWinnersAnnounced: string;
  image: File | null;
};

const initialState: ChallengeFormState = {
  title: "",
  subtitle: "",
  date: "",
  sponsor: "",
  description: "",
  requirements: [""],
  timelineRegistration: "",
  timelineJudging: "",
  timelineWinnersAnnounced: "",
  image: null,
};

const ChallengeDetailForm = () => {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
      setForm({ ...form, image: files[0] });
    } else if (name.startsWith("requirement")) {
      const idx = Number(name.replace("requirement", ""));
      const newReqs = [...form.requirements];
      newReqs[idx] = value;
      setForm({ ...form, requirements: newReqs });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addRequirement = () => {
    setForm({ ...form, requirements: [...form.requirements, ""] });
  };

  const removeRequirement = (index: number) => {
    if (form.requirements.length > 1) {
      const newReqs = form.requirements.filter((_, idx) => idx !== index);
      setForm({ ...form, requirements: newReqs });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("Title", form.title);
    formData.append("Subtitle", form.subtitle);
    formData.append("Date", form.date);
    formData.append("Sponsor", form.sponsor);
    formData.append("Description", form.description);
    form.requirements.forEach((req, idx) =>
      formData.append(`Requirements[${idx}]`, req)
    );
    formData.append("TimelineRegistration", form.timelineRegistration);
    formData.append("TimelineJudging", form.timelineJudging);
    formData.append("TimelineWinnersAnnounced", form.timelineWinnersAnnounced);
    if (form.image) formData.append("Image", form.image);

    try {
      const response = await axios.post(
        "https://localhost:7205/api/challenges/add-details",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data;
      if (response.status === 200) {
        setMessage("✅ Challenge details added successfully!");
        setForm(initialState);
      } else {
        setMessage(`❌ ${result.error || "Failed to add challenge details."}`);
      }
    } catch (err) {
      setMessage("❌ Error submitting form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formStyles = {
    container: {
      maxWidth: '600px',
      margin: '20px auto',
      padding: '30px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      textAlign: 'center' as const,
      color: '#333',
      marginBottom: '30px',
      fontSize: '28px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#555'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px',
      transition: 'border-color 0.3s',
      boxSizing: 'border-box' as const
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px',
      minHeight: '100px',
      resize: 'vertical' as const,
      boxSizing: 'border-box' as const
    },
    requirementContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      gap: '10px'
    },
    requirementInput: {
      flex: '1',
      padding: '10px',
      border: '2px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px'
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    removeButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer'
    },
    submitButton: {
      backgroundColor: isLoading ? '#6c757d' : '#28a745',
      color: 'white',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '18px',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      width: '100%',
      marginTop: '20px'
    },
    message: {
      marginTop: '15px',
      padding: '12px',
      borderRadius: '6px',
      textAlign: 'center' as const,
      fontSize: '16px',
      backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
      color: message.includes('✅') ? '#155724' : '#721c24',
      border: message.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
    }
  };

  return (
    <div style={formStyles.container}>
      <h1 style={formStyles.title}>🏆 Add Challenge Details</h1>
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Challenge Title *</label>
          <input 
            style={formStyles.input}
            name="title" 
            placeholder="e.g., Mystery Box Challenge" 
            value={form.title} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Subtitle *</label>
          <input 
            style={formStyles.input}
            name="subtitle" 
            placeholder="e.g., Cook with Creativity!" 
            value={form.subtitle} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Challenge Date *</label>
          <input 
            style={formStyles.input}
            name="date" 
            placeholder="e.g., 26 APRIL 2025 - 3 JUNE 2025" 
            value={form.date} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Sponsor *</label>
          <input 
            style={formStyles.input}
            name="sponsor" 
            placeholder="e.g., Chef's Co" 
            value={form.sponsor} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Description *</label>
          <textarea 
            style={formStyles.textarea}
            name="description" 
            placeholder="Describe the challenge in detail..." 
            value={form.description} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Requirements *</label>
          {form.requirements.map((req, idx) => (
            <div key={idx} style={formStyles.requirementContainer}>
              <input
                style={formStyles.requirementInput}
                name={`requirement${idx}`}
                placeholder={`Requirement ${idx + 1}`}
                value={req}
                onChange={handleChange}
                required
              />
              {form.requirements.length > 1 && (
                <button 
                  type="button" 
                  style={formStyles.removeButton}
                  onClick={() => removeRequirement(idx)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" style={formStyles.button} onClick={addRequirement}>
            + Add Requirement
          </button>
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Registration Timeline *</label>
          <input 
            style={formStyles.input}
            name="timelineRegistration" 
            placeholder="e.g., Apr 1-25, 2025" 
            value={form.timelineRegistration} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Judging Timeline *</label>
          <input 
            style={formStyles.input}
            name="timelineJudging" 
            placeholder="e.g., May 26-28, 2025" 
            value={form.timelineJudging} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Winners Announcement *</label>
          <input 
            style={formStyles.input}
            name="timelineWinnersAnnounced" 
            placeholder="e.g., May 30, 2025" 
            value={form.timelineWinnersAnnounced} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Challenge Image *</label>
          <input 
            style={formStyles.input}
            type="file" 
            name="image" 
            accept="image/*" 
            onChange={handleChange} 
            required 
          />
          <small style={{ color: '#666', fontSize: '14px' }}>
            Upload a high-quality image for your challenge (JPG, PNG, etc.)
          </small>
        </div>

        <button 
          type="submit" 
          style={formStyles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "🔄 Submitting..." : "🚀 Create Challenge"}
        </button>

        {message && <div style={formStyles.message}>{message}</div>}
      </form>
    </div>
  );
};

export default ChallengeDetailForm;