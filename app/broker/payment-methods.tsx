import React from 'react';
import { PayoutAccountForm } from '../../components/shared/PayoutAccountForm';
import { ProfileSubScreen } from '../../components/shared/ProfileSubScreen';

export default function BrokerPaymentMethodsScreen() {
  return (
    <ProfileSubScreen title="Bank Payout Account">
      <PayoutAccountForm hint="Add bank or UPI for commission withdrawals. Admin approves each payout request from the Earnings tab." />
    </ProfileSubScreen>
  );
}
