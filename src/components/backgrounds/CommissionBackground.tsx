'use client';

import AnimatedBackground from '../AnimatedBackground';

interface CommissionBackgroundProps {
  woodType?: string;
  finishType?: string;
}

const CommissionBackground: React.FC<CommissionBackgroundProps> = ({ 
  woodType = 'oak', 
  finishType = 'matte'
}) => {
  // Convert string to the expected woodType format
  const convertedWoodType = (woodType === 'walnut' || woodType === 'cherry' || woodType === 'maple')
    ? woodType as 'walnut' | 'cherry' | 'maple'
    : 'oak';
      return (
    <AnimatedBackground 
      variant="commission" 
      woodType={convertedWoodType}
      finishType={finishType}
    />
  );
};

export default CommissionBackground;
