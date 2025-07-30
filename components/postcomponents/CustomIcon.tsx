import React from 'react';
import { getIconByName } from './icons';

interface IconProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  size?: number;
}

const CustomIcon: React.FC<IconProps> = ({ icon, iconColor, bgColor, size = 16 }) => {
  const IconComponent = getIconByName(icon);
  
  return (
    <div 
      className={`w-8 h-8 rounded-full flex items-center justify-center`}
      style={{ backgroundColor: bgColor }}
    >
      <div style={{ color: iconColor, fontSize: size }}>
        {IconComponent}
      </div>
    </div>
  );
};

export default CustomIcon;