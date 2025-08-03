import React, { useState } from 'react';
import UserInfoComponent from './UserInfoComponent';
import OpinionComponent from './OpinionComponent';
import PollComponent from './PollComponent';
import InteractionButtons from './InteractionButtons';
import { PostProps } from './types';

const PostComponent: React.FC<PostProps> = ({ id, userInfo, opinion, poll }) => {
  const [agreed, setAgreed] = useState<boolean | null>(null);
  const [localCounts, setLocalCounts] = useState({
    agree: opinion?.agreeCount || 0,
    disagree: opinion?.disagreeCount || 0,
    readers: opinion?.readersCount || poll?.votes?.reduce((sum, vote) => sum + vote, 0) || 0,
    comments: opinion?.commentsCount || 0
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
    <div id={`post-${id}`} className="w-full max-w-2xl mx-auto bg-white">
      <div className="pb-4">
        <UserInfoComponent userInfo={userInfo} />
        {opinion && <OpinionComponent opinion={opinion} />}
        {poll && <PollComponent poll={poll} />}
        
        <InteractionButtons
          postId={id}
          onAgree={handleAgree}
          onDisagree={handleDisagree}
          agreeCount={localCounts.agree}
          disagreeCount={localCounts.disagree}
          readersCount={localCounts.readers}
          commentsCount={localCounts.comments}
          agreed={agreed}
        />
      </div>
      <div className="border-b border-gray-200"></div>
    </div>
  );
};

export default PostComponent;