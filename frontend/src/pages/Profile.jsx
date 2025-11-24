import { Link, NavLink,useParams,useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import apiClient from '../apiClient';
import useLikeArticle from '../hooks/useLikeArticle';
import useFollow from '../hooks/useFollow';
import { useState,useEffect } from 'react';
function Profile() {
  const queryClient = useQueryClient();
  const navigate =useNavigate();
  const{user,isLogin} = useAuth();
  const userName = user?.username || '';
  const cur_userName = useParams().username;
  const limit = 5;
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPage, setTotalPage] = useState(0);
  //we need to know if we are on favorites page to fetch accordingly
  const isFavoritesPage = useLocation().pathname.endsWith('/favorites');
  //use custom hook for like article and follow user
  const {handleLike,...mutateLike} = useLikeArticle(['articles',cur_userName,isFavoritesPage]);
  const {handleFollow,...mutateFollow}= useFollow(['profile',cur_userName]);

  const fetchArticles = async(cur_userName)=>{
    const offset = (currentPage - 1) * limit;
    const {data} =isFavoritesPage
    ? await apiClient.get(`/articles?favorited=${cur_userName}&offset=${offset}&limit=${limit}`)
    : await apiClient.get(`/articles?author=${cur_userName}&offset=${offset}&limit=${limit}`);
    setTotalPage(Math.ceil(data.articlesCount / limit));
    return data.articles;
  };
  const {data:articles,isLoading:areAriticleLoading,isError:areAriticleError} = useQuery({
    queryKey:['articles',cur_userName,isFavoritesPage,currentPage],
    queryFn:()=>fetchArticles(cur_userName),
  });
  
  const fetchProfile = async(cur_userName)=>{
    const {data} =await apiClient.get(`/profiles/${cur_userName}`);
    return data.profile;
  }
  const {data:profile,isLoading:isProfileLoading,isError:isProfileError} = useQuery({
    queryKey:['profile',cur_userName],
    queryFn:()=>fetchProfile(cur_userName),
  });
    useEffect(()=>{
    setCurrentPage(1);
  },[isFavoritesPage]);
  if(isProfileLoading||areAriticleLoading){
    return <div>Loading...</div>;
  }
  if(isProfileError||areAriticleError){
    return <div>Error</div>;
  }
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" alt="User profile" />
              <h4>{profile.username}</h4>
              <p>
                {profile.bio}
              </p>
              {userName !== profile.username ?(
              <button className="btn btn-sm btn-outline-secondary action-btn" onClick={isLogin?()=>handleFollow({username:profile.username,following:profile.following}):()=>navigate('/login')} disabled={mutateFollow.isPending}>
                <i className="ion-plus-round"></i>
                &nbsp; {!profile.following?(`Follow ${cur_userName}`):`Unfollow ${cur_userName}`}
              </button>
              ):(
              <button className="btn btn-sm btn-outline-secondary action-btn" onClick={()=>navigate('/settings')}>
                <i className="ion-gear-a"></i>
                &nbsp; Edit Profile Settings
              </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={`/profile/${cur_userName}`}
                    end
                  >
                    My Articles
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={`/profile/${cur_userName}/favorites`}
                  >
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>
              {articles.length==0?(
                <div>No articles are here... yet.</div>
              ):(
              articles.map((article)=>(
                <div className="article-preview" key={article.slug}>
                  <div className="article-meta">
                    <Link to={`/profile/${article.author.username}`}><img src={article.author.image} alt="Article author" /></Link>
                    <div className="info">
                      <Link to={`/profile/${article.author.username}`} className="author">{article.author.username}</Link>
                      <span className="date">{new Date(article.createdAt).toDateString()}</span>
                    </div>
                    <button disabled={mutateLike.isPending} className="btn btn-outline-primary btn-sm pull-xs-right"  onClick={isLogin?()=>handleLike({slug:article.slug,favorited:article.favorited}):()=>navigate('/login')}>
                      <i className="ion-heart" ></i> {article.favoritesCount}
                    </button>
                  </div>
                  <Link to={`/article/${article.slug}`} className='preview-link'>
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    <span>Read more...</span>
                    <ul className="tag-list">
                      {article.tagList.map((tag)=>(
                        <li className="tag-default tag-pill tag-outline" key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </Link>
                </div>
              )))}
            <ul className="pagination">
               {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
                    <li className="page-item" key={page}>
                        <NavLink className="page-link" onClick={() => setCurrentPage(page)}>{page}</NavLink>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;