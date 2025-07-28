import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaEye, FaUserGraduate, FaInfoCircle } from 'react-icons/fa';

interface UserInfo {
  id: string;
  iconColor: [number, number, number];
  fullName: string;
  study: string;
}

interface Opinion {
  text: string;
  agreeCount: number;
  disagreeCount: number;
  readersCount: number;
}

interface Poll {
  question: string;
  options: string[];
}

interface UserInfoProps {
  userInfo: UserInfo;
}
/**
 * مكون لعرض معلومات المستخدم
 * @param {UserInfo} userInfo - يحتوي على بيانات المستخدم
 *   - id: المعرف الفريد
 *   - iconColor: لون أيقونة المستخدم [R, G, B]
 *   - fullName: الاسم الكامل
 *   - study: مجال الدراسة
 */
const UserInfoComponent: React.FC<UserInfoProps> = ({ userInfo }) => {
  const iconColor = `rgb(${userInfo.iconColor.join(',')})`;

  return (
    <div className="flex items-start px-4">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 mt-1"
        style={{ backgroundColor: iconColor }}
      >
        <FaUserGraduate size={16} />
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
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {userInfo.study}
          </span>
        </div>
      </div>
    </div>
  );
};

interface OpinionProps {
  opinion: Opinion;
}
/**
 * مكون لعرض الرأي وأزرار الموافقة/الرفض
 * @param {Opinion} opinion - يحتوي على:
 *   - text: نص الرأي
 *   - agreeCount: عدد الموافقين
 *   - disagreeCount: عدد المعارضين
 *   - readersCount: عدد القراء
 */
const OpinionComponent: React.FC<OpinionProps> = ({ opinion }) => {
  const [agreed, setAgreed] = useState<boolean | null>(null);
  const [localCounts, setLocalCounts] = useState({
    agree: opinion.agreeCount,
    disagree: opinion.disagreeCount,
    readers: opinion.readersCount
  });

  const handleAgree = () => {
    setLocalCounts(prev => {
      const newCounts = {...prev};
      
      if (agreed === true) {
        newCounts.agree -= 1;
        setAgreed(null);
      } else {
        if (agreed === false) newCounts.disagree -= 1;
        newCounts.agree += 1;
        setAgreed(true);
      }
      
      return newCounts;
    });
  };

  const handleDisagree = () => {
    setLocalCounts(prev => {
      const newCounts = {...prev};
      
      if (agreed === false) {
        newCounts.disagree -= 1;
        setAgreed(null);
      } else {
        if (agreed === true) newCounts.agree -= 1;
        newCounts.disagree += 1;
        setAgreed(false);
      }
      
      return newCounts;
    });
  };

  return (
    <div className="px-4 pt-3 pb-2">
      <p className="text-gray-800 mb-4 text-right">{opinion.text}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-500 text-sm">
          <FaEye className="ml-1" size={14} />
          <span>{localCounts.readers} قراءات</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <button 
              onClick={handleAgree}
              className={`p-1.5 rounded-full ${agreed === true ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'} hover:bg-green-50 transition-colors`}
            >
              <FaArrowUp size={14} />
            </button>
            <span className="mx-1.5 text-sm text-gray-600">{localCounts.agree}</span>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={handleDisagree}
              className={`p-1.5 rounded-full ${agreed === false ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'} hover:bg-red-50 transition-colors`}
            >
              <FaArrowDown size={14} />
            </button>
            <span className="mx-1.5 text-sm text-gray-600">{localCounts.disagree}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PollProps {
  poll: Poll;
}
/**
 * مكون لعرض استطلاع رأي مع خيارات
 * @param {Poll} poll - يحتوي على:
 *   - question: سؤال الاستطلاع
 *   - options: مصفوفة الخيارات المتاحة
 */
const PollComponent: React.FC<PollProps> = ({ poll }) => {
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);

  const handlePollSelect = (index: number) => {
    setSelectedPollOption(index);
  };

  return (
    <div className="px-4 pt-2 pb-1">
      <h4 className="font-medium text-gray-900 mb-3 text-right">{poll.question}</h4>
      <div className="space-y-2">
        {poll.options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handlePollSelect(index)}
            className={`py-2 px-3 border rounded-lg cursor-pointer text-right transition-all ${
              selectedPollOption === index 
                ? 'border-blue-300 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

interface Props {
  userInfo: UserInfo;
  opinion: Opinion;
  poll: Poll;
}
/**
 * المكون الرئيسي الذي يجمع مكونات العرض معاً
 * @param {Props} props - يحتوي على:
 *   - userInfo: بيانات المستخدم
 *   - opinion: بيانات الرأي
 *   - poll: بيانات استطلاع الرأي
 */
const PostComponent: React.FC<Props> = ({ userInfo, opinion, poll }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white py-4 border-b border-gray-200">
      <UserInfoComponent userInfo={userInfo} />
      <OpinionComponent opinion={opinion} />
      <PollComponent poll={poll} />
    </div>
  );
};

export default PostComponent;