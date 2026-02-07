import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface StatusPillProps {
    status: 'active' | 'completed' | 'cancelled' | 'pending' | 'in-transit' | 'delivered';
    style?: ViewStyle;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, style }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'active':
                return {
                    backgroundColor: '#DBEAFE',
                    textColor: '#2563EB',
                    label: 'Active',
                };
            case 'completed':
                return {
                    backgroundColor: '#D1FAE5',
                    textColor: '#059669',
                    label: 'Completed',
                };
            case 'cancelled':
                return {
                    backgroundColor: '#FEE2E2',
                    textColor: '#DC2626',
                    label: 'Cancelled',
                };
            case 'pending':
                return {
                    backgroundColor: '#FEF3C7',
                    textColor: '#D97706',
                    label: 'Pending',
                };
            case 'in-transit':
                return {
                    backgroundColor: '#EFF6FF',
                    textColor: '#1E40AF',
                    label: 'In Transit',
                };
            case 'delivered':
                return {
                    backgroundColor: '#D1FAE5',
                    textColor: '#059669',
                    label: 'Delivered',
                };
            default:
                return {
                    backgroundColor: '#F1F5F9',
                    textColor: '#64748B',
                    label: status,
                };
        }
    };

    const config = getStatusConfig();

    return (
        <View
            style={[
                styles.pill,
                { backgroundColor: config.backgroundColor },
                style,
            ]}
        >
            <Text style={[styles.text, { color: config.textColor }]}>
                {config.label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.full,
        alignSelf: 'flex-start',
    },
    text: {
        ...theme.typography.caption,
        fontWeight: '500',
    },
});
