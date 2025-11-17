import React from 'react';
import { Link, NavLink,useParams,useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import apiClient from '../apiClient';
import { mockArticles } from '../data/mockData';
function Profile() {
  const queryClient = useQueryClient();
  const{user} = useAuth();
  const userName = user?.username || '';
  const cur_userName = useParams().username;
  const isFavoritesPage = useLocation().pathname.endsWith('/favorites');
  const mutateLike =useMutation({
      mutationFn : ({slug,favorited})=> {!favorited? apiClient.post(`/articles/${slug}/favorite`)
        :apiClient.delete(`/articles/${slug}/favorite`);
      },
      onSuccess : () => {
        queryClient.invalidateQueries({queryKey:['articles',cur_userName,isFavoritesPage]});
      },
    });
const mutateFollow = useMutation({
    mutationFn :({username,following})=>{
      !following? apiClient.post(`/profiles/${username}/follow`):
      apiClient.delete(`/profiles/${username}/follow`);
    },
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey:['profile',cur_userName]});
    }
});
  const fetchArticles = async(cur_userName)=>{
    if(import.meta.env.DEV&&userName=== 'test'){
      return mockArticles;
    }
    const {data} =isFavoritesPage
    ? await apiClient.get(`/articles?favorited=${cur_userName}`)
    : await apiClient.get(`/articles?author=${cur_userName}`);
    return data.articles;
  };
  const {data:articles,isLoading:areAriticleLoading,isError:areAriticleError} = useQuery({
    queryKey:['articles',cur_userName,isFavoritesPage],
    queryFn:()=>fetchArticles(cur_userName),
  });
  const fetchProfile = async(cur_userName)=>{
    if(import.meta.env.DEV&&userName=== 'test'){
      return {
        username:'test',
        bio:'This is a test user',
        image:'https://static.productionready.io/images/smiley-cyrus.jpg',
        following:false,
      };
    }
    const {data} =await apiClient.get(`/profiles/${cur_userName}`);
    return data.profile;
  }
  const {data:profile,isLoading:isProfileLoading,isError:isProfileError} = useQuery({
    queryKey:['profile',cur_userName],
    queryFn:()=>fetchProfile(cur_userName),
  });
  const handleLike = async(article)=>{
    mutateLike.mutate({slug:article.slug,favorited:article.favorited});
  };
  const handleFollow = async()=>{
    mutateFollow.mutate({username:cur_userName,following:profile.following});
  }
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
              <button className="btn btn-sm btn-outline-secondary action-btn" onClick={handleFollow} disabled={mutateFollow.isLoading}>
                <i className="ion-plus-round"></i>
                &nbsp; {!profile.following?(`Follow ${cur_userName}`):`Unfollow ${cur_userName}`}
              </button>
              ):(
              <button className="btn btn-sm btn-outline-secondary action-btn">
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
                    to={`/profile/${userName}`}
                    end
                  >
                    My Articles
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to={`/profile/${userName}/favorites`}
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
                    <button disabled={mutateLike.isLoading} className="btn btn-outline-primary btn-sm pull-xs-right">
                      <i className="ion-heart" onClick={()=>handleLike(article)} ></i> {article.favoritesCount}
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
              <li className="page-item active">
                <Link className="page-link" to="?page=1">1</Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="?page=2">2</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;