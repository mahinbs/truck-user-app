import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FiFilter, FiPackage, FiCheckCircle, FiDollarSign, FiSearch, FiFileText, FiChevronRight, FiMapPin, FiBarChart2, FiCalendar, FiUser, FiStar } from 'react-icons/fi';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Chip } from '../components/ui/Chip';
import { Input } from '../components/ui/Input';
import { SafeIcon } from '../components/ui/SafeIcon';
import { colors } from '../constants/theme';

const allTrips = [
  {
    id: '1',
    trackingId: 'TRK2024001',
    from: 'Mumbai, Maharashtra',
    to: 'Delhi, Delhi',
    status: 'delivered',
    date: '2024-01-05',
    material: 'Electronics',
    weight: '1200 kg',
    price: 1416,
  },
  {
    id: '2',
    trackingId: 'TRK2024002',
    from: 'Bangalore, Karnataka',
    to: 'Chennai, Tamil Nadu',
    status: 'in-transit',
    date: '2024-01-07',
    material: 'Furniture',
    weight: '2500 kg',
    price: 2800,
  },
];

export default function TripsHistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'delivered' | 'active'>('all');

  const filteredTrips = allTrips.filter((trip) => {
    const matchesSearch =
      trip.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && trip.status !== 'delivered') ||
      (filterStatus === 'delivered' && trip.status === 'delivered');
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-transit':
        return <Badge label="In Transit" variant="info" />;
      case 'delivered':
        return <Badge label="Delivered" variant="success" />;
      default:
        return <Badge label={status} variant="default" />;
    }
  };

  const stats = {
    total: allTrips.length,
    delivered: allTrips.filter((t) => t.status === 'delivered').length,
    active: allTrips.filter((t) => t.status !== 'delivered').length,
    totalSpent: allTrips.reduce((sum, t) => sum + t.price, 0),
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex justify-between items-center p-4 px-6 bg-backgroundCard shadow-sm">
        <h1 className="text-xl font-bold text-text">Shipments</h1>
        <button className="w-10 h-10 rounded-full bg-background border-none cursor-pointer flex items-center justify-center">
          <SafeIcon Icon={FiFilter} size={20} color={colors.text} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <Card className="flex-1 text-center p-4">
            <div className="mb-1">
              <SafeIcon Icon={FiPackage} size={24} color={colors.primary} />
            </div>
            <div className="text-xl font-bold text-text mb-0.5">{stats.total}</div>
            <div className="text-xs text-text-secondary">Total</div>
          </Card>
          <Card className="flex-1 text-center p-4">
            <div className="mb-1">
              <SafeIcon Icon={FiCheckCircle} size={24} color={colors.success} />
            </div>
            <div className="text-xl font-bold text-success mb-0.5">{stats.delivered}</div>
            <div className="text-xs text-text-secondary">Delivered</div>
          </Card>
          <Card className="flex-1 text-center p-4">
            <div className="mb-1">
              <SafeIcon Icon={FiDollarSign} size={24} color={colors.secondary} />
            </div>
            <div className="text-xl font-bold text-primary mb-0.5">₹{(stats.totalSpent / 1000).toFixed(1)}K</div>
            <div className="text-xs text-text-secondary">Total</div>
          </Card>
        </div>

        <div className="mb-4">
          <Input placeholder="Search by tracking ID, location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon="search" containerStyle={{ marginBottom: '16px' }} />
        </div>

        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'delivered'] as const).map((status) => (
            <Chip
              key={status}
              label={status.charAt(0).toUpperCase() + status.slice(1)}
              selected={filterStatus === status}
              onClick={() => setFilterStatus(status)}
            />
          ))}
        </div>

        <div>
          <h2 className="text-lg font-bold text-text mb-4">
            {filteredTrips.length} Shipment{filteredTrips.length !== 1 ? 's' : ''}
          </h2>

          {filteredTrips.map((trip) => (
            <Card
              key={trip.id}
              onClick={() => router.push(`/trip/${trip.id}`)}
              className="mb-4 cursor-pointer"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-base font-semibold text-text">{trip.trackingId}</span>
                  {getStatusBadge(trip.status)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/trip/${trip.id}/payment`);
                  }}
                  className="bg-transparent border-none cursor-pointer p-2"
                >
                  <SafeIcon Icon={FiFileText} size={20} color={colors.primary} />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-start">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                  <div className="ml-4 flex-1">
                    <div className="text-xs text-text-secondary mb-0.5">From</div>
                    <div className="text-sm text-text font-medium">{trip.from}</div>
                  </div>
                </div>
                <div className="w-0.5 h-5 bg-border ml-1 my-1" />
                <div className="flex items-start">
                  <div className="w-2.5 h-2.5 rounded-full bg-success mt-1" />
                  <div className="ml-4 flex-1">
                    <div className="text-xs text-text-secondary mb-0.5">To</div>
                    <div className="text-sm text-text font-medium">{trip.to}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <SafeIcon Icon={FiPackage} size={14} color={colors.textSecondary} />
                  <span className="text-xs text-text-secondary">{trip.material}</span>
                </div>
                <div className="flex items-center gap-1">
                  <SafeIcon Icon={FiBarChart2} size={14} color={colors.textSecondary} />
                  <span className="text-xs text-text-secondary">{trip.weight}</span>
                </div>
                <div className="flex items-center gap-1">
                  <SafeIcon Icon={FiCalendar} size={14} color={colors.textSecondary} />
                  <span className="text-xs text-text-secondary">{trip.date}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="text-sm text-text-secondary">Total Amount</div>
                <div className="text-lg font-bold text-primary">₹{trip.price}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
