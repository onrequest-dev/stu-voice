import UserProfileViewComponent from '../../../components/UserProfileViewComponent';
import PostComponent from '@/components/postcomponents/Posts/PostComponent';
import { UserInfo } from '../../../types/types';
import { PostProps } from '@/components/postcomponents/types';
import { supabase } from '@/lib/supabase';
import { transformPost } from '@/client_helpers/transformposttype';
import BackButton from '@/components/BackButton';
import ShareButton from '@/components/ShareButton';
// بيانات افتراضية للمستخدم


// بيانات افتراضية للمنشورات


let hasPosts = true

const getUserPosts = async (username:string) => {
    const isValid = /^[a-zA-Z0-9_]+$/.test(username);
    if (!isValid) {
      return new Response("Invalid username", { status: 400 });
    }
  
    const { data: postDataRaw, error: postError } = await supabase
      .rpc("get_posts_by_id_or_publisher", {
        target_id: null,
        target_username: username.toLocaleLowerCase(),
      });
      if(postError) {
        hasPosts = false;
        return [];
      }
      return postDataRaw.map(transformPost) as PostProps;


}

const getUserInfo = async (username:string) =>{

  const isValid = /^[a-zA-Z0-9_]+$/.test(username);
    if (!isValid) {
      return new Response("Invalid username", { status: 400 });
    }
  const {data:result,error} = await supabase
  .from("users")
  .select("icon,university,level,faculty,gender,info,last_time_updated,full_name")
  .eq('user_name', username.toLocaleLowerCase())
  .single()
  if(error) return <div>هذا المستخدم غير موجود </div>
  const userInfo:UserInfo = {
      id:username ,
      fullName: result.full_name,
      gender:result.gender ||"male",
      education:{
        level: result.level,
          grade:result.info?.grade ,
          track: "",
          degreeSeeking: result.info?.degreeSeeking,
          university: result.university, 
          faculty: result.faculty, 
          specialization: result.info?.specialization,
          year:result.info?.year ,
          studentId: result.info?.studentId ,
          icon: result.icon
      },
    };
    return userInfo;
}

export default async function UserProfilePage({ params }:{params:{id:string}}) {

  const [userInfo, posts] = await Promise.all([
    getUserInfo(params.id),
    getUserPosts(params.id)
  ]);
  return (
    <div className="container mx-auto my-0.5 px-1">
      <div className="fixed top-4 left-4 z-40"> {/* z-40 لتكون تحت أي عناصر أخرى قد تكون ذات z-index أعلى */}
        <BackButton/> <ShareButton/>
      </div>
      <div className=''>
        <UserProfileViewComponent userData={(userInfo as UserInfo)} />
      </div>
      {/* قسم المنشورات */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-bold text-right mb-4"></h2>
        
        <div className="space-y-4">
          {(posts as PostProps[]).map((post) => (
            <PostComponent 
              key={post.id}
              id={post.id}
              userInfo={{ ...post.userInfo, disableLinks: true }}
              opinion={post.opinion}
              poll={post.poll}
              createdAt={post.createdAt}
              showDiscussIcon={post.showDiscussIcon}
            />
          ))}
        </div>
        
        {(posts as PostProps[]).length === 0 || !hasPosts && (
          <div className="text-center py-8 text-gray-500">
            <p>لا توجد منشورات حتى الآن</p>
          </div>
        )}
      </div>
    </div>
  );
}