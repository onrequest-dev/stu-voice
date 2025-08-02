import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import CustomIcon from './CustomIcon';
import { UserInfo } from './types';

interface UserInfoProps {
  userInfo: UserInfo;
}

const UserInfoComponent: React.FC<UserInfoProps> = ({ userInfo }) => {
  return (
    <div className="flex items-start px-4 pt-3">
      <div className="mr-3">
        <CustomIcon 
          icon={userInfo.iconName}
          iconColor={userInfo.iconColor}
          bgColor={userInfo.bgColor}
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{userInfo.fullName}</h3>
            <div className="flex items-center mt-1">
              <FaInfoCircle className="text-gray-400 mr-1" size={10} />
              <span className="text-xs text-gray-500">@{userInfo.id}</span>
            </div>
          </div>
          {userInfo.study && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {userInfo.study}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoComponent;