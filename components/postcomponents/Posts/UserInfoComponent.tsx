import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { BsPatchCheckFill } from 'react-icons/bs'; // ✅ أيقونة احترافية
import CustomIcon from '../CustomIcon';
import { UserInfo } from '../types';
import Link from 'next/link';


interface UserInfoProps {
  userInfo: UserInfo;
}

const UserInfoComponent: React.FC<UserInfoProps> = ({ userInfo }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const disableLinks = userInfo.disableLinks || false;

  const handleLinkClick = () => {
    if (!disableLinks) {
      setIsLoading(true);
    }
  };

  const isVerified = userInfo.id === 'stuvoice';

  // دالة لتغليف المحتوى برابط أو بدون حسب القيمة
  const wrapWithLink = (content: React.ReactNode, href: string, key?: string) => {
    if (disableLinks) {
      return <div key={key} className="inline-block">{content}</div>;
    }
    
    return (
      <Link 
        key={key}
        href={href} 
        onClick={handleLinkClick}
        className="inline-block"
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="flex items-start justify-between w-full py-4 gap-2">
      {/* الجزء الأيسر - الدراسة */}
      <div className="flex-shrink-0 min-w-[40px] ml-4">
        {userInfo.study && (
          <span
            className={`inline-block text-xs text-gray-500 px-2 py-1 rounded ${
              isVerified ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            {userInfo.study}
          </span>
        )}
      </div>

      {/* الجزء الأيمن - معلومات المستخدم */}
      <div className="flex items-start flex-1 min-w-0 mr-1">
        <div className="text-right mr-3 min-w-0 flex-1">
          <div className="flex flex-col items-end">
            {wrapWithLink(
              <div className="font-medium text-gray-900 text-right break-words whitespace-normal flex flex-row-reverse items-center gap-1">
                {userInfo.fullName}
                {isVerified && (
                  <BsPatchCheckFill className="text-green-500 mx-1" size={14} />
                )}
              </div>,
              `/showuserdata/${userInfo.id}`,
              'name-link'
            )}
            <div className="flex items-center justify-end mt-1">
              <FaInfoCircle className="text-gray-400 ml-1 flex-shrink-0" size={10} />
              {wrapWithLink(
                <span className="text-xs text-gray-500 break-all">
                  @{userInfo.id}
                </span>,
                `/showuserdata/${userInfo.id}`,
                'id-link'
              )}
            </div>
          </div>
        </div>
        {wrapWithLink(
          <CustomIcon 
            icon={userInfo.iconName}
            iconColor={userInfo.iconColor}
            bgColor={userInfo.bgColor}
          />,
          `/showuserdata/${userInfo.id}`,
          'icon-link'
        )}
      </div>
    </div>
  );
};

export default UserInfoComponent;