'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function HabitForm({ onSubmit, loading, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    targetFrequency: initialData.targetFrequency || 1,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.targetFrequency || formData.targetFrequency <= 0) {
      newErrors.targetFrequency = 'Target frequency must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Habit Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="mt-1"
            placeholder="e.g., Drink 8 glasses of water"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1"
            placeholder="Describe your habit..."
            rows={4}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <Label htmlFor="targetFrequency">Target Frequency *</Label>
          <Input
            id="targetFrequency"
            type="number"
            min="1"
            value={formData.targetFrequency}
            onChange={handleChange}
            className="mt-1"
            placeholder="e.g., 1 (daily)"
          />
          {errors.targetFrequency && (
            <p className="text-red-600 text-sm mt-1">{errors.targetFrequency}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Saving...' : initialData.id ? 'Update Habit' : 'Create Habit'}
        </Button>
        
        {initialData.id && (
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}