import { Link,NavLink ,useNavigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import{useQuery} from '@tanstack/react-query';
import apiClient from '../apiClient';
import {useState} from 'react';
import useLikeArticle from '../hooks/useLikeArticle';
function Home(){
    const navigate = useNavigate();
     const{user,isLogin} = useAuth();
    const [isMyFeed,setIsMyFeed] = useState(false);
    const [selectedTag,setSelectedTag] = useState('');
    const userName = user?.username || '';
    const {handleLike} = useLikeArticle(['articles',userName,isMyFeed]);
    const fetchArticles = async()=>{
        const {data} = 
        selectedTag ? await apiClient.get(`/articles?tag=${selectedTag}`) : isMyFeed
        ? await apiClient.get(`/articles/feed`)
        : await apiClient.get('/articles');
        return data.articles;
    }
    const {data:articles,isLoading:areAriticleLoading,isError:areAriticleError} = useQuery({
        queryKey:['articles',userName,isMyFeed,selectedTag],
        queryFn:()=>fetchArticles(),
    });

    const handleTagClick = (tag)=>{
        setIsMyFeed(null);
        setSelectedTag(tag);
    }
    const fetchPopular =async()=>{
        const {data} =await apiClient.get('/tags');
        return data.tags;
    }
    const {data:tags,isError:areTagsError,isLoading:areTagsLoading} = useQuery({
        queryKey:['tags'],
        queryFn:()=>fetchPopular(),
    })
   const isLoading = areAriticleLoading || areTagsLoading;
   const isError = areAriticleError || areTagsError;
    return(
    <>
    <div className="home-page">
        <div className="banner">
             <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
        </div>
    </div>
    <div className="container page">
        <div className="row">
            <div className="col-md-9">
                <div className="feed-toggle">
                    <ul className="nav nav-pills outline-active">
                        <li className="nav-item">
                            <button className={`nav-link ${isMyFeed&&!selectedTag?"active":""}`} onClick={userName?()=>{setIsMyFeed(true);setSelectedTag('')} :()=>navigate('/login')}>Your Feed</button>
                        </li>
                         <li className="nav-item">
                            <button className={`nav-link ${isMyFeed||selectedTag?"":"active"}`} onClick={()=>{setIsMyFeed(false);setSelectedTag('')}}>Global Feed</button>
                        </li>
                        {selectedTag && (
                            <li className="nav-item">
                                <button className="nav-link active" >{selectedTag}</button>
                            </li>
                        )}
                    </ul>
                </div>  
                {isLoading ? (
                    <div>Loading articles...</div>
                ) : isError ? (
                    <div>Error loading articles.</div>
                ) : (
                    articles.map((article) => (
                        <div className="article-preview" key={article.slug}>
                            <div className="article-meta">
                                <Link to={`/profile/${article.author.username}`}><img src={article.author.image} alt="Article author" /></Link>
                                <div className="info">
                                    <Link to={`/profile/${article.author.username}`} className="author">{article.author.username}</Link>
                                <span className="date">{new Date(article.createdAt).toDateString()}</span>
                            </div>
                            <button className="btn btn-outline-primary btn-sm pull-xs-right" onClick={isLogin?()=>handleLike({slug:article.slug,favorited:article.favorited}):()=>navigate('/login')}>
                                <i className="ion-heart"></i> {article.favoritesCount}
                            </button>
                            <div className="spacer"></div>
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
                        </div>
                    )))}
                <ul className="pagination">
                    <li class="page-item">
                        <NavLink className="page-link" to="">1</NavLink>
                    </li>
                    <li class="page-item">
                        <NavLink className="page-link" to="">2</NavLink>
                    </li>
                </ul>
            </div>
            <div className="col-md-3">
                <div className="sidebar">
                    <p>Popular Tags</p>
                    <div className="tag-list">
                        {tags?.map((tag)=>(
                            <Link key={tag} onClick={()=>handleTagClick(tag)} className="tag-pill tag-default">{tag}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
    )
}
export default Home