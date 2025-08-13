import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import CustomIcon from '../CustomIcon';
import { UserInfo } from '../types';
import Link from 'next/link';
import LoadingSpinner from '../../LoadingSpinner';

interface UserInfoProps {
  userInfo: UserInfo;
}

const UserInfoComponent: React.FC<UserInfoProps> = ({ userInfo }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLinkClick = () => {
    setIsLoading(true);
  };

  return (
    <div className="flex items-start justify-between w-full py-4 gap-2">
      {/* الجزء الأيسر - الدراسة */}
      <div className="flex-shrink-0 min-w-[40px] ml-4">
        {userInfo.study && (
          <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {userInfo.study}
          </span>
        )}
      </div>

      {/* الجزء الأيمن - معلومات المستخدم */}
      <div className="flex items-start flex-1 min-w-0 mr-1">
        <div className="text-right mr-3 min-w-0 flex-1">
          <div className="flex flex-col items-end">
            <Link 
              href={`/showdatauser/${userInfo.id}`} 
              className="font-medium text-gray-900 text-right break-words whitespace-normal "
              onClick={handleLinkClick}
            >
              {userInfo.fullName}
            </Link>
            <div className="flex items-center justify-end mt-1">
              <FaInfoCircle className="text-gray-400 ml-1 flex-shrink-0" size={10} />
              <Link 
                href={`/showdatauser/${userInfo.id}`} 
                className="text-xs text-gray-500 break-all "
                onClick={handleLinkClick}
              >
                @{userInfo.id}
              </Link>
            </div>
          </div>
        </div>
        <Link 
          href={`/showdatauser/${userInfo.id}`} 
          className="flex-shrink-0"
          onClick={handleLinkClick}
        >
          <CustomIcon 
            icon={userInfo.iconName}
            iconColor={userInfo.iconColor}
            bgColor={userInfo.bgColor}
          />
        </Link>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default UserInfoComponent;