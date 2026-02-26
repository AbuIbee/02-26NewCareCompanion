import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { createPatient } from '@/services/patientService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Patient } from '@/types';

interface AddPatientPageProps {
  onBack: () => void;
  onPatientAdded: () => void;
}

export default function AddPatientPage({ onBack, onPatientAdded }: AddPatientPageProps) {
  const { state } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    preferredName: '',
    dateOfBirth: '',
    location: '',
    address: '',
    dementiaStage: 'middle',
    diagnosisDate: '',
    affirmation: 'You are safe. You are loved. You are at home.',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
    },
    preferences: {
      language: 'en',
      fontSize: 'large',
      highContrast: false,
      audioEnabled: true,
      notificationsEnabled: true,
      tone: 'gentle',
    },
  });

  const handleInputChange = (field: keyof Patient, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field: keyof Patient['emergencyContact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      } as Patient['emergencyContact'],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.currentUser) {
      toast.error('You must be logged in to add a patient');
      return;
    }

    if (!formData.firstName || !formData.lastName) {
      toast.error('First name and last name are required');
      return;
    }

    setIsLoading(true);

    try {
      await createPatient(formData, state.currentUser.id, 'Primary Caregiver');
      toast.success('Patient added successfully!');
      onPatientAdded();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Add New Patient</h1>
          <p className="text-medium-gray">Enter patient information to get started</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-warm-bronze" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredName">Preferred Name</Label>
                <Input
                  id="preferredName"
                  value={formData.preferredName}
                  onChange={(e) => handleInputChange('preferredName', e.target.value)}
                  placeholder="What they like to be called"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dementiaStage">Dementia Stage</Label>
                <Select
                  value={formData.dementiaStage}
                  onValueChange={(value) => handleInputChange('dementiaStage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="early">Early Stage</SelectItem>
                    <SelectItem value="middle">Middle Stage</SelectItem>
                    <SelectItem value="late">Late Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
                <Input
                  id="diagnosisDate"
                  type="date"
                  value={formData.diagnosisDate}
                  onChange={(e) => handleInputChange('diagnosisDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">City/Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Raleigh, NC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContact?.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Input
                  id="emergencyRelationship"
                  value={formData.emergencyContact?.relationship}
                  onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                  placeholder="e.g., Daughter, Son"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyContact?.phone}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyEmail">Email</Label>
                <Input
                  id="emergencyEmail"
                  type="email"
                  value={formData.emergencyContact?.email}
                  onChange={(e) => handleEmergencyContactChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalization */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Personalization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="affirmation">Daily Affirmation</Label>
              <Textarea
                id="affirmation"
                value={formData.affirmation}
                onChange={(e) => handleInputChange('affirmation', e.target.value)}
                placeholder="A comforting message for the patient"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-warm-bronze hover:bg-deep-bronze text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Patient...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Patient
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
