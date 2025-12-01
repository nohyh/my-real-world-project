import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ArticleMeta from "./ArticleMeta";
function ArticleList({ articles, isLoading, isError, handleLike, navigate }) {
    const { isLogin } = useAuth();
    return (
        <>
            {isLoading ? (
                <div>Loading articles...</div>
            ) : isError ? (
                <div>Error loading articles.</div>
            ) : (
                articles.map((article) => (
                    <div className="article-preview" key={article.slug}>
                        <div className="article-meta">
                            <ArticleMeta article={article}/>
                            <button className="btn btn-outline-primary btn-sm pull-xs-right" onClick={isLogin ? () => handleLike({ slug: article.slug, favorited: article.favorited }) : () => navigate('/login')}>
                                <i className="ion-heart"></i> {article.favoritesCount}
                            </button>
                            <div className="spacer"></div>
                            <Link to={`/article/${article.slug}`} className='preview-link'>
                                <h1>{article.title}</h1>
                                <p>{article.description}</p>
                                <span>Read more...</span>
                                <ul className="tag-list">
                                    {article.tagList.map((tag) => (
                                        <li className="tag-default tag-pill tag-outline" key={tag}>{tag}</li>
                                    ))}
                                </ul>
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </>
    )
}
export default ArticleList;