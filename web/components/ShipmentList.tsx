import React, { useState } from 'react';
import { ShipmentCard } from './ShipmentCard';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

type TabType = 'active' | 'delivered' | 'all';

interface Shipment {
  id: string;
  name: string;
  from: string;
  to: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'pending' | 'completed' | 'active';
  price: string;
}

interface ShipmentListProps {
  shipments: Shipment[];
  onShipmentPress: (id: string) => void;
}

export const ShipmentList: React.FC<ShipmentListProps> = ({ shipments, onShipmentPress }) => {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const filteredShipments = shipments.filter((shipment) => {
    if (activeTab === 'active') {
      return ['on-track', 'at-risk', 'delayed', 'active'].includes(shipment.status);
    }
    if (activeTab === 'delivered') {
      return shipment.status === 'completed';
    }
    return true;
  });

  return (
    <div style={{ flex: 1, backgroundColor: colors.background, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', backgroundColor: colors.backgroundCard, padding: spacing.xs, borderRadius: borderRadius.md, marginBottom: spacing.md }}>
        {(['active', 'delivered', 'all'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: `${spacing.sm} 0`,
              textAlign: 'center',
              borderRadius: borderRadius.sm,
              border: 'none',
              backgroundColor: activeTab === tab ? colors.primary : 'transparent',
              color: activeTab === tab ? '#FFFFFF' : colors.textSecondary,
              fontSize: typography.sizes.sm,
              fontWeight: activeTab === tab ? typography.weights.semibold : typography.weights.medium,
              cursor: 'pointer',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredShipments.length === 0 ? (
          <div style={{ padding: spacing.xl, textAlign: 'center' }}>
            <span style={{ fontSize: typography.sizes.md, color: colors.textSecondary }}>No shipments found</span>
          </div>
        ) : (
          filteredShipments.map((shipment) => (
            <ShipmentCard
              key={shipment.id}
              {...shipment}
              onPress={() => onShipmentPress(shipment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

