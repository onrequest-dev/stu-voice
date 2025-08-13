"use client"
import React, { useState } from 'react';
import UserInfoComponent from './UserInfoComponent';
import OpinionComponent from './OpinionComponent';
import PollComponent from './PollComponent';
import InteractionButtons from './InteractionButtons';
import { PostProps } from './types';
import { handelreactionInStorage } from '@/client_helpers/handelreaction';


const PostComponent: React.FC<PostProps> = ({ id, userInfo, opinion, poll ,createdAt}) => {
  const [agreed, setAgreed] = useState<boolean | null>(null);
  const [localCounts, setLocalCounts] = useState({
    agree: opinion?.agreeCount || 0,
    disagree: opinion?.disagreeCount || 0,
    readers: opinion?.readersCount || poll?.votes?.reduce((sum, vote) => sum + vote, 0) || 0,
    comments: opinion?.commentsCount || 0
  });

  const handleAgree = () => {
    // storing reaction 
    


    setLocalCounts(prev => {
      const newCounts = {...prev};
      
      if (agreed === true) {
        handelreactionInStorage('reactions', id,"upvote", 'remove');
        newCounts.agree -= 1;
        setAgreed(null);
      } else {
        handelreactionInStorage('reactions', id,"upvote", 'set');
        if (agreed === false){
          handelreactionInStorage('reactions', id,"downvote", 'remove');
           newCounts.disagree -= 1
          };
        newCounts.agree += 1;
        setAgreed(true);
      }
      
      return newCounts;
    });
  };

  const handleDisagree = () => {
        // storing reaction 
        
    setLocalCounts(prev => {
      const newCounts = {...prev};
      
      if (agreed === false) {
        handelreactionInStorage('reactions', id,"downvote", 'remove');
        newCounts.disagree -= 1;
        setAgreed(null);
      } else {
        handelreactionInStorage('reactions', id,"downvote", 'set');
        if (agreed === true) {
          handelreactionInStorage('reactions', id,"upvote", 'remove');
          newCounts.agree -= 1
        };
        newCounts.disagree += 1;
        setAgreed(false);
      }
      return newCounts;
    });
  };


  return (
    <div id={`post-${id}`} className="w-full max-w-2xl mx-auto bg-white">
      <div className="pb-1">
        <UserInfoComponent userInfo={userInfo} />
        {opinion && <OpinionComponent opinion={opinion} />}
        {poll && <PollComponent poll={poll} id={id} />}
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
        {createdAt && (
          <div className="text-xs text-gray-500 mb-1 text-left ml-auto pd-2 pl-2">
              {new Date(createdAt).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      <div className="border-b border-gray-200"></div>
      
    </div>
  );
};

export default PostComponent;