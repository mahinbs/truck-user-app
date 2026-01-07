import React from 'react';
import { colors, spacing, typography } from '../../constants/theme';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message,
  size = 'large',
  color = colors.primary,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
      }}
    >
      <div
        style={{
          width: size === 'large' ? '48px' : '24px',
          height: size === 'large' ? '48px' : '24px',
          border: `3px solid ${color}20`,
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {message && (
        <p
          style={{
            marginTop: spacing.md,
            fontSize: typography.sizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {message}
        </p>
      )}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

