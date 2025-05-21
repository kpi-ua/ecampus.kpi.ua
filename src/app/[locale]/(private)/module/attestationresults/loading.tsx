import SpinnerGap from '../../../../images/icons/SpinnerGap.svg';
import React from 'react';

export default async function AttestationResultsLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <SpinnerGap />
    </div>
  );
}
