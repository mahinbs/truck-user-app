import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiBarChart2, FiBell, FiCalendar, FiCheckCircle, FiChevronRight, FiClock, FiDollarSign, FiFileText, FiHelpCircle, FiPackage, FiPlus, FiSearch } from 'react-icons/fi';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { colors } from '../constants/theme';

import { SafeIcon } from '../components/ui/SafeIcon';

const mockStats = {
  activeShipments: 5,
  completedShipments: 23,
  totalSpent: 45200,
};

const mockShipments = [
  {
    id: '1',
    trackingId: 'TRK2024001',
    from: 'Mumbai, Maharashtra',
    to: 'Delhi, Delhi',
    status: 'in-transit',
    progress: 65,
    expectedDelivery: '2024-01-08',
    material: 'Electronics',
    weight: '1200 kg',
  },
  {
    id: '2',
    trackingId: 'TRK2024002',
    from: 'Bangalore, Karnataka',
    to: 'Chennai, Tamil Nadu',
    status: 'pending',
    progress: 0,
    expectedDelivery: '2024-01-10',
    material: 'Furniture',
    weight: '2500 kg',
  },
  {
    id: '3',
    trackingId: 'TRK2024003',
    from: 'Pune, Maharashtra',
    to: 'Hyderabad, Telangana',
    status: 'delivered',
    progress: 100,
    deliveredOn: '2024-01-05',
    material: 'Raw Materials',
    weight: '3000 kg',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-transit':
        return <Badge label="In Transit" variant="info" />;
      case 'pending':
        return <Badge label="Pending" variant="warning" />;
      case 'delivered':
        return <Badge label="Delivered" variant="success" />;
      case 'cancelled':
        return <Badge label="Cancelled" variant="error" />;
      default:
        return <Badge label={status} variant="default" />;
    }
  };

  const filteredShipments = mockShipments.filter((shipment) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return shipment.status !== 'delivered' && shipment.status !== 'cancelled';
    if (selectedFilter === 'completed') return shipment.status === 'delivered';
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex justify-between items-center p-4 px-6">
        <div>
          <h1 className="text-xl font-bold text-text mb-0.5">
            Hello, Welcome Back!
          </h1>
          <p className="text-sm text-text-secondary">Manage your shipments</p>
        </div>
        <button className="w-11 h-11 rounded-full bg-backgroundCard border-none cursor-pointer flex items-center justify-center relative shadow-sm">
          <SafeIcon Icon={FiBell} size={24} color={colors.text} />
          <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full bg-error text-backgroundCard text-[10px] flex items-center justify-center font-bold">
            3
          </span>
        </button>
      </div>

      <div className="px-6 pb-8">
        {/* Stats Cards */}
        <div className="flex gap-6 mb-6">
          <Card className="flex-1 text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <SafeIcon Icon={FiClock} size={24} color={colors.primary} />
            </div>
            <div className="text-xl font-bold text-text mb-0.5">
              {mockStats.activeShipments}
            </div>
            <div className="text-xs text-text-secondary">Active</div>
          </Card>

          <Card className="flex-1 text-center p-4">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
              <SafeIcon Icon={FiCheckCircle} size={24} color={colors.success} />
            </div>
            <div className="text-xl font-bold text-text mb-0.5">
              {mockStats.completedShipments}
            </div>
            <div className="text-xs text-text-secondary">Completed</div>
          </Card>

          <Card className="flex-1 text-center p-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-2">
              <SafeIcon Icon={FiDollarSign} size={24} color={colors.secondary} />
            </div>
            <div className="text-xl font-bold text-text mb-0.5">
              ₹{(mockStats.totalSpent / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-text-secondary">Total Spent</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-text mb-4">
            Quick Actions
          </h2>
          <div className="flex gap-4">
            {[
              { icon: FiPlus, label: 'New Shipment', color: colors.primary, route: '/book-trip' },
              { icon: FiSearch, label: 'Track', color: colors.info, route: '/track' },
              { icon: FiFileText, label: 'History', color: colors.success, route: '/history' },
              { icon: FiHelpCircle, label: 'Support', color: colors.warning, route: '/support' },
            ].map((action, idx) => {
              const IconComponent = action.icon;
              return (
                <Card
                  key={idx}
                  onClick={() => router.push(action.route)}
                  className="flex-1 text-center p-4 cursor-pointer"
                >
                  <div className="mb-1 flex justify-center">
                    <SafeIcon Icon={IconComponent} size={32} color={action.color} />
                  </div>
                  <div className="text-xs font-medium text-text">
                    {action.label}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Shipments Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text">
              My Shipments
            </h2>
            <button
              onClick={() => router.push('/trips')}
              className="bg-transparent border-none text-primary text-sm font-semibold cursor-pointer"
            >
              See All
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {['all', 'active', 'completed'].map((filter) => (
              <Chip
                key={filter}
                label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                selected={selectedFilter === filter}
                onClick={() => setSelectedFilter(filter)}
              />
            ))}
          </div>

          {/* Shipment Cards */}
          {filteredShipments.map((shipment) => (
            <Card
              key={shipment.id}
              onClick={() => router.push(`/trip/${shipment.id}`)}
              className="mb-6 cursor-pointer"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-text">
                    {shipment.trackingId}
                  </span>
                  {getStatusBadge(shipment.status)}
                </div>
                <SafeIcon Icon={FiChevronRight} size={20} color={colors.textSecondary} />
              </div>

              <div className="mb-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                  <div className="ml-4 flex-1">
                    <div className="text-xs text-text-secondary mb-0.5">From</div>
                    <div className="text-sm text-text font-medium">
                      {shipment.from}
                    </div>
                  </div>
                </div>

                <div className="w-0.5 h-6 bg-border ml-1.5 my-1" />

                <div className="flex items-start">
                  <div className="w-3 h-3 rounded-full bg-success mt-1" />
                  <div className="ml-4 flex-1">
                    <div className="text-xs text-text-secondary mb-0.5">To</div>
                    <div className="text-sm text-text font-medium">
                      {shipment.to}
                    </div>
                  </div>
                </div>
              </div>

              {shipment.status === 'in-transit' && (
                <div className="mb-4">
                  <div className="h-1.5 bg-border rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-text-secondary text-right">
                    {shipment.progress}% Complete
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  <SafeIcon Icon={FiPackage} size={14} color={colors.textSecondary} />
                  <span className="text-xs text-text-secondary">{shipment.material}</span>
                </div>
                <div className="flex items-center gap-1">
                  <SafeIcon Icon={FiBarChart2} size={14} color={colors.textSecondary} />
                  <span className="text-xs text-text-secondary">{shipment.weight}</span>
                </div>
                <div className="flex items-center gap-1">
                  <SafeIcon Icon={FiCalendar} size={14} color={colors.textSecondary} />
                  <span className="text-xs text-text-secondary">
                    {shipment.status === 'delivered' ? shipment.deliveredOn : shipment.expectedDelivery}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => router.push('/book-trip')}
        className="fixed bottom-8 right-6 w-[60px] h-[60px] rounded-full bg-primary border-none cursor-pointer flex items-center justify-center shadow-lg z-[1000]"
      >
        <SafeIcon Icon={FiPlus} size={32} color={colors.backgroundCard} />
      </button>
    </div>
  );
}
