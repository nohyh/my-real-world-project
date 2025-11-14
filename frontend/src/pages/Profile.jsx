import React from 'react';
import { Link, NavLink,useParams,useLocation, data } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import {useQuery} from '@tanstack/react-query';
import apiClient from '../apiClient';
function Profile() {
  const{user} = useAuth();
  const userName = user?.username || '';
  const cur_userName = useParams().username;
  const isFavoritesPage = useLocation().pathname.endsWith('/favorites');
  const fetchArticles = async(cur_userName)=>{
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
  if(isProfileLoading){
    return <div>Loading...</div>;
  }
  if(isProfileError){
    return <div>Error loading profile.</div>;
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
              <button className="btn btn-sm btn-outline-secondary action-btn">
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
            {!import.meta.env.DEV&&userName=== 'test'?(
              <div>
                hello world
                </div>
            ):(
              <>
            <div className="article-preview">
              <div className="article-meta">
                <Link to="/profile/eric-simons"><img src="http://i.imgur.com/Qr71crq.jpg" alt="Article author" /></Link>
                <div className="info">
                  <Link to="/profile/eric-simons" className="author">Eric Simons</Link>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart"></i> 29
                </button>
              </div>
              <Link to="/article/how-to-buil-webapps-that-scale" className="preview-link">
                <h1>How to build webapps that scale</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  <li className="tag-default tag-pill tag-outline">realworld</li>
                  <li className="tag-default tag-pill tag-outline">implementations</li>
                </ul>
              </Link>
            </div>

            <div className="article-preview">
              <div className="article-meta">
                <Link to="/profile/albert-pai"><img src="http://i.imgur.com/N4VcUeJ.jpg" alt="Article author" /></Link>
                <div className="info">
                  <Link to="/profile/albert-pai" className="author">Albert Pai</Link>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart"></i> 32
                </button>
              </div>
              <Link to="/article/the-song-you" className="preview-link">
                <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  <li className="tag-default tag-pill tag-outline">Music</li>
                  <li className="tag-default tag-pill tag-outline">Song</li>
                </ul>
              </Link>
            </div>
            </>
            )}

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