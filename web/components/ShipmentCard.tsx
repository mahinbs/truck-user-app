import React from 'react';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { colors, spacing, typography } from '../constants/theme';

interface ShipmentCardProps {
  id: string;
  name: string;
  from: string;
  to: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'pending' | 'completed' | 'active';
  price: string;
  onPress: () => void;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({
  name,
  from,
  to,
  status,
  price,
  onPress,
}) => {
  return (
    <div onClick={onPress} style={{ cursor: 'pointer', marginBottom: spacing.md }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <span style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.text, flex: 1 }}>
            {name}
          </span>
          <StatusBadge status={status} />
        </div>
        
        <div style={{ marginBottom: spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.xs }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: colors.success, marginRight: spacing.sm }} />
            <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>{from}</span>
          </div>
          <div style={{ width: '1px', height: '12px', backgroundColor: colors.border, marginLeft: '4px', marginBottom: spacing.xs }} />
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.xs }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: colors.primary, marginRight: spacing.sm }} />
            <span style={{ fontSize: typography.sizes.sm, color: colors.textSecondary }}>{to}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text }}>
            {price}
          </span>
        </div>
      </Card>
    </div>
  );
};

