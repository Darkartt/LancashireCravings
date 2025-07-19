'use client';

import CleanBackground from '../CleanBackground';

interface CommissionBackgroundProps {
  woodType?: string;
  finishType?: string;
}

const CommissionBackground: React.FC<CommissionBackgroundProps> = ({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  woodType = 'oak', 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  finishType = 'matte'
}) => {
  return <CleanBackground variant="commission" />;
};

export default CommissionBackground;
