import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiMapPin as FiLocation, FiPackage, FiTruck, FiCheckCircle, FiMapPin, FiInfo, FiBarChart2, FiFileText, FiCalendar, FiClock, FiZap, FiTrendingUp, FiCheck } from 'react-icons/fi';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { SafeIcon } from '../components/ui/SafeIcon';
import { colors } from '../constants/theme';

const MATERIAL_TYPES = [
  { id: 'electronics', label: 'Electronics', icon: 'hardware-chip' },
  { id: 'furniture', label: 'Furniture', icon: 'bed' },
  { id: 'food', label: 'Food Items', icon: 'fast-food' },
  { id: 'raw', label: 'Raw Materials', icon: 'cube' },
  { id: 'fragile', label: 'Fragile', icon: 'warning' },
  { id: 'other', label: 'Other', icon: 'apps' },
];

const TRUCK_TYPES = [
  { id: 'small', name: 'Small Truck', capacity: '500-1000 kg', icon: 'car', basePrice: 800 },
  { id: 'medium', name: 'Medium Truck', capacity: '1000-3000 kg', icon: 'bus', basePrice: 1500 },
  { id: 'large', name: 'Large Truck', capacity: '3000-8000 kg', icon: 'train', basePrice: 2500 },
  { id: 'trailer', name: 'Trailer', capacity: '8000+ kg', icon: 'boat', basePrice: 4000 },
];

export default function BookTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupDetails: '',
    dropLocation: '',
    dropDetails: '',
    materialType: '',
    weight: '',
    truckType: '',
    urgency: 'standard',
    date: '',
    time: '',
    notes: '',
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    router.push('/dashboard');
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Pickup & Drop Locations';
      case 2:
        return 'Material Details';
      case 3:
        return 'Truck & Schedule';
      case 4:
        return 'Review & Confirm';
      default:
        return '';
    }
  };

  const calculateEstimate = () => {
    const truck = TRUCK_TYPES.find((t) => t.id === formData.truckType);
    if (!truck) return 0;
    let price = truck.basePrice;
    if (formData.urgency === 'urgent') price *= 1.5;
    if (formData.urgency === 'express') price *= 2;
    return Math.round(price);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="flex items-center mb-6">
              <div className="mr-4">
                <SafeIcon Icon={FiMapPin} size={24} color={colors.primary} />
              </div>
              <h2 className="text-xl font-bold text-text">{getStepTitle()}</h2>
            </div>
            <Input label="Pickup Location" placeholder="Enter pickup address or landmark" value={formData.pickupLocation} onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })} icon="location" />
            <Input label="Pickup Details (Optional)" placeholder="Floor number, contact person, etc." value={formData.pickupDetails} onChange={(e) => setFormData({ ...formData, pickupDetails: e.target.value })} icon="information-circle" />
            <Input label="Drop Location" placeholder="Enter delivery address or landmark" value={formData.dropLocation} onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })} icon="navigate" />
            <Input label="Delivery Details (Optional)" placeholder="Floor number, contact person, etc." value={formData.dropDetails} onChange={(e) => setFormData({ ...formData, dropDetails: e.target.value })} icon="information-circle" />
          </div>
        );
      case 2:
        return (
          <div>
            <div className="flex items-center mb-6">
              <SafeIcon Icon={FiPackage} size={24} color={colors.primary} className="mr-4" />
              <h2 className="text-xl font-bold text-text">{getStepTitle()}</h2>
            </div>
            <div className="mb-4">
              <label className="text-base font-semibold text-text mb-4 block">Material Type</label>
              <div className="flex flex-wrap gap-2">
                {MATERIAL_TYPES.map((material) => (
                  <Chip key={material.id} label={material.label} icon={material.icon} selected={formData.materialType === material.id} onClick={() => setFormData({ ...formData, materialType: material.id })} />
                ))}
              </div>
            </div>
            <Input label="Estimated Weight (kg)" placeholder="Enter approximate weight" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} icon="barbell" type="number" />
            <Input label="Additional Notes (Optional)" placeholder="Special handling instructions, etc." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} icon="document-text" />
          </div>
        );
      case 3:
        return (
          <div>
            <div className="flex items-center mb-6">
              <SafeIcon Icon={FiTruck} size={24} color={colors.primary} className="mr-4" />
              <h2 className="text-xl font-bold text-text">{getStepTitle()}</h2>
            </div>
            <div className="mb-4">
              <label className="text-base font-semibold text-text mb-4 block">Select Truck Type</label>
              {TRUCK_TYPES.map((truck) => (
                <Card
                  key={truck.id}
                  onClick={() => setFormData({ ...formData, truckType: truck.id })}
                  className={`mb-4 cursor-pointer ${formData.truckType === truck.id ? 'border-2 border-primary bg-primary/8' : 'border-2 border-transparent'}`}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mr-4">
                      <SafeIcon Icon={FiTruck} size={28} color={colors.primary} />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-text mb-0.5">{truck.name}</div>
                      <div className="text-sm text-text-secondary">{truck.capacity}</div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="text-xs text-text-secondary">From</div>
                      <div className="text-lg font-bold text-primary">₹{truck.basePrice}</div>
                    </div>
                    {formData.truckType === truck.id && <SafeIcon Icon={FiCheck} size={24} color={colors.primary} />}
                  </div>
                </Card>
              ))}
            </div>
            <div className="mb-4">
              <label className="text-base font-semibold text-text mb-4 block">Urgency</label>
              <div className="flex flex-wrap gap-2">
                <Chip label="Standard" icon="time" selected={formData.urgency === 'standard'} onClick={() => setFormData({ ...formData, urgency: 'standard' })} />
                <Chip label="Urgent (24h)" icon="flash" selected={formData.urgency === 'urgent'} onClick={() => setFormData({ ...formData, urgency: 'urgent' })} />
                <Chip label="Express (6h)" icon="rocket" selected={formData.urgency === 'express'} onClick={() => setFormData({ ...formData, urgency: 'express' })} />
              </div>
            </div>
            <Input label="Preferred Pickup Date" placeholder="DD/MM/YYYY" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} icon="calendar" />
            <Input label="Preferred Time" placeholder="HH:MM" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} icon="time" />
          </div>
        );
      case 4:
        return (
          <div>
            <div className="flex items-center mb-6">
              <div className="mr-4">
                <SafeIcon Icon={FiCheckCircle} size={24} color={colors.success} />
              </div>
              <h2 className="text-xl font-bold text-text">{getStepTitle()}</h2>
            </div>
            <Card className="mb-4">
              <h3 className="text-base font-semibold text-text mb-2">Route</h3>
              <div className="flex items-center mb-1">
                <SafeIcon Icon={FiMapPin} size={16} color={colors.textSecondary} className="mr-2" />
                <span className="text-sm text-text-secondary">{formData.pickupLocation}</span>
              </div>
              <div className="w-0.5 h-4 bg-border ml-1.5 my-0.5" />
              <div className="flex items-center">
                <SafeIcon Icon={FiMapPin} size={16} color={colors.textSecondary} className="mr-2" />
                <span className="text-sm text-text-secondary">{formData.dropLocation}</span>
              </div>
            </Card>
            <Card className="bg-primary/10 border border-primary">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-text">Estimated Price</span>
                <span className="text-[30px] font-bold text-primary">₹{calculateEstimate()}</span>
              </div>
              <p className="text-xs text-text-secondary italic">
                Final price may vary based on actual distance and truck availability
              </p>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[800px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.back()} className="bg-transparent border-none cursor-pointer p-2">
            <SafeIcon Icon={FiArrowLeft} size={24} color={colors.text} />
          </button>
          <h1 className="text-xl font-bold text-text">Book Shipment</h1>
          <div className="w-10" />
        </div>

        <div className="flex justify-center items-center mb-6 py-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  s <= step ? 'bg-primary text-backgroundCard' : 'bg-border text-text-secondary'
                } ${s === step ? 'shadow-md' : ''}`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-0.5 mx-1 ${
                    s < step ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="mb-8">{renderStepContent()}</Card>

        <div className="flex gap-4">
          {step > 1 && (
            <Button title="Previous" onClick={handlePrevious} variant="outline" icon="arrow-back" className="flex-1" />
          )}
          <Button
            title={step === 4 ? 'Get Quotes' : 'Next'}
            onClick={step === 4 ? handleConfirm : handleNext}
            icon={step === 4 ? 'checkmark' : 'arrow-forward'}
            iconPosition="right"
            className="flex-1"
            fullWidth={step === 1}
          />
        </div>
      </div>
    </div>
  );
}
