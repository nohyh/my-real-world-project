import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../apiClient';
import { useQuery } from '@tanstack/react-query';
import useLikeArticle from '../hooks/useLikeArticle';
import useFollow from '../hooks/useFollow';
import Comment from '../components/Comment';
function Article() {
  const navigate =useNavigate();
  const { user,isLogin} = useAuth();
  const userName = user?.username || '';
  const { slug } = useParams();
  const {handleLike,...mutateLike} = useLikeArticle(['article',slug]);
  const {handleFollow,...mutateFollow} = useFollow(['article',slug]);
  const fetchArticle = async (slug) => {
    const { data } = await apiClient.get(`/articles/${slug}`);
    return data.article;
  };
  const {
    data: article,
    isLoading: isArticleLoading,
    isError: isArticleError,
  } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticle(slug),
  });
  if (isArticleLoading) {
    return <div>Loading article...</div>;
  }

  if (isArticleError) {
    return <div>Error loading article.</div>;
  }
const deleteArticle = async(slug)=>{
  try{
    const response = await apiClient.delete(`/articles/${slug}`);
    console.log(response.data);
    navigate('/');
  }
  catch(error){
    console.log(error);
  }
}
  const isAuthor = userName === article.author.username;
  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src="http://i.imgur.com/Qr71crq.jpg" alt="Author Profile" />
            </Link>
            <div className="info">
              <Link to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{new Date(article.createdAt).toDateString()}</span>
            </div>
            <button className="btn btn-sm btn-outline-primary" onClick={isLogin?()=>handleLike({slug:article.slug,favorited:article.favorited}):()=>navigate('/login')}>
              <i className="ion-heart"></i>
              &nbsp; Favorite Article <span className="counter">({article.favoritesCount})</span>
            </button>
            {!isAuthor?<button className="btn btn-sm btn-outline-secondary" onClick={isLogin?()=>handleFollow({username:article.author.username,following:article.author.following}):()=>navigate('/login')}>
              <i className="ion-plus-round"></i>
               &nbsp; {article.author.following?`Unfollow ${article.author.username}`:`Follow ${article.author.username}`}
            </button>:(
              <>
            <button className="btn btn-sm btn-outline-secondary" onClick={()=>navigate(`/editor/${article.slug}`)}>
              <i className="ion-edit"></i> Edit Article
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteArticle(article.slug)}  >
              <i className="ion-trash-a"></i> Delete Article
            </button>
              </>)}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>
              {article.body}
            </p>
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">{tag}</li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <div className="article-meta">
            <Link to= {`/profile/${article.author.username}`}>
              <img src= {article.author.image} alt="Author Profile" />
            </Link>
            <div className="info">
              <Link to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{new Date(article.createdAt).toDateString()}</span>
            </div>
            <button className="btn btn-sm btn-outline-primary" onClick={isLogin?()=>handleLike({slug:article.slug,favorited:article.favorited}):()=>navigate('/login')}>
              <i className="ion-heart"></i>
              &nbsp; Favorite Article <span className="counter">({article.favoritesCount})</span>
            </button>
            {!isAuthor?<button className="btn btn-sm btn-outline-secondary" onClick={isLogin?()=>handleFollow({username:article.author.username,following:article.author.following}):()=>navigate('/login')}>
              <i className="ion-plus-round"></i>
               &nbsp; {article.author.following?`Unfollow ${article.author.username}`:`Follow ${article.author.username}`}
            </button>:(
              <>
            <button className="btn btn-sm btn-outline-secondary" onClick={()=>navigate(`/editor/${article.slug}`)}>
              <i className="ion-edit"></i> Edit Article
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteArticle(article.slug)}  >
              <i className="ion-trash-a"></i> Delete Article
            </button>
              </>)}
          </div>
        </div>
        <Comment slug={article.slug}/>
      </div>
    </div>
  );
}
export default Article;