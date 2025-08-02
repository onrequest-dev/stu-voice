import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import CustomIcon from './CustomIcon';
import { UserInfo } from './types';

interface UserInfoProps {
  userInfo: UserInfo;
}

const UserInfoComponent: React.FC<UserInfoProps> = ({ userInfo }) => {
  return (
    <div className="flex items-start justify-between px-4 pt-3 w-full">
      {/* الدراسة في أقصى اليسار - تظهر دائماً حتى لو فارغة */}
      <div className="min-w-[120px]"> {/* عرض ثابت لمنع تغير المسافات */}
        {userInfo.study && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {userInfo.study}
          </span>
        )}
      </div>

      {/* الأيقونة وبيانات المستخدم في أقصى اليمين */}
      <div className="flex items-start">
        <div className="text-right mr-3">
          <h3 className="font-medium text-gray-900">{userInfo.fullName}</h3>
          <div className="flex items-center justify-end mt-1">
            <FaInfoCircle className="text-gray-400 ml-1" size={10} />
            <span className="text-xs text-gray-500">@{userInfo.id}</span>
          </div>
        </div>
        <CustomIcon 
          icon={userInfo.iconName}
          iconColor={userInfo.iconColor}
          bgColor={userInfo.bgColor}
        />
      </div>
    </div>
  );
};

export default UserInfoComponent;