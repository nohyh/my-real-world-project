import { Link } from "react-router-dom";
function ArticleMeta({ article }) {
  return (
    <>
      <Link to={`/profile/${article.author.username}`}>
        <img src={article.author.image} alt="Article author" />
      </Link>
      <div className="info">
        <Link to={`/profile/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">{new Date(article.createdAt).toDateString()}</span>
      </div>
    </>
  );
}
export default ArticleMeta;
