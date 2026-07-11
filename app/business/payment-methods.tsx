import React from 'react';
import { ProfileSubScreen } from '../../components/shared/ProfileSubScreen';
import { PayoutAccountForm } from '../../components/shared/PayoutAccountForm';

export default function PaymentMethodsScreen() {
  return (
    <ProfileSubScreen title="Payment Methods">
      <PayoutAccountForm hint="Add the bank account or UPI ID where wallet withdrawals should be sent. Admin approves each withdrawal request." />
    </ProfileSubScreen>
  );
}
