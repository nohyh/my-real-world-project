import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../apiClient';
import { useQuery } from '@tanstack/react-query';
import useLikeArticle from '../hooks/useLikeArticle';
import useFollow from '../hooks/useFollow';
import Comment from '../components/Comment';
import Markdown from 'react-markdown';
import ArticleMeta from '../components/ArticleMeta';
import ActionButtons from '../components/ActionButtons';
function Article() {
  const navigate = useNavigate();
  const { user, isLogin } = useAuth();
  const userName = user?.username || '';
  const { slug } = useParams();
  const { handleLike, ...mutateLike } = useLikeArticle(['article', slug]);
  const { handleFollow, ...mutateFollow } = useFollow(['article', slug]);
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
  const deleteArticle = async (slug) => {
    try {
      const response = await apiClient.delete(`/articles/${slug}`);
      console.log(response.data);
      navigate('/');
    }
    catch (error) {
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
            <ArticleMeta article={article} />
              <ActionButtons article={article} isAuthor={isAuthor} handleLike={handleLike} handleFollow={handleFollow} deleteArticle={deleteArticle} navigate={navigate} />
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div className="article-content-markdown">
              <Markdown>
                {article.body}
              </Markdown>
            </div>
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
            <ArticleMeta article={article} />
            <ActionButtons article={article}  isAuthor={isAuthor} handleLike={handleLike} handleFollow={handleFollow} deleteArticle={deleteArticle} navigate={navigate} />
          </div>
        </div>
        <Comment slug={article.slug} />
      </div>
    </div>
  );
}
export default Article;