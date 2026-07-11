import React from 'react';
import { ProfileSubScreen } from '../../components/shared/ProfileSubScreen';
import { PayoutAccountForm } from '../../components/shared/PayoutAccountForm';

export default function BankAccountScreen() {
  return (
    <ProfileSubScreen title="Bank Account">
      <PayoutAccountForm hint="Add where you want trip earnings sent. Withdrawals are reviewed by admin before payout." />
    </ProfileSubScreen>
  );
}
