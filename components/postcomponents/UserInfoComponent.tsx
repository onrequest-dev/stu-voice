import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import CustomIcon from './CustomIcon';
import { UserInfo } from './types';

interface UserInfoProps {
  userInfo: UserInfo;
}

const UserInfoComponent: React.FC<UserInfoProps> = ({ userInfo }) => {
  return (
    <div className="flex items-start justify-between w-full py-4 gap-2">
      {/* الجزء الأيسر - الدراسة */}
      <div className="flex-shrink-0 min-w-[40px]">
        {userInfo.study && (
          <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {userInfo.study}
          </span>
        )}
      </div>

      {/* الجزء الأيمن - معلومات المستخدم */}
      <div className="flex items-start flex-1 min-w-0">
        <div className="text-right mr-3 min-w-0 flex-1">
          <div className="flex flex-col items-end">
            <h3 className="font-medium text-gray-900 text-right w-full break-words whitespace-normal">
              {userInfo.fullName}
            </h3>
            <div className="flex items-center justify-end mt-1">
              <FaInfoCircle className="text-gray-400 ml-1 flex-shrink-0" size={10} />
              <span className="text-xs text-gray-500 break-all">
                @{userInfo.id}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <CustomIcon 
            icon={userInfo.iconName}
            iconColor={userInfo.iconColor}
            bgColor={userInfo.bgColor}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfoComponent;