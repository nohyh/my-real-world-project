import { useAuth } from "../context/AuthContext";
function ActionButtons({ article,  isAuthor, handleLike, handleFollow, deleteArticle, navigate }) {
    const {isLogin} = useAuth();
return(
    <>
<button className="btn btn-sm btn-outline-primary" onClick={isLogin ? () => handleLike({ slug: article.slug, favorited: article.favorited }) : () => navigate('/login')}>
              <i className="ion-heart"></i>
              &nbsp; Favorite Article <span className="counter">({article.favoritesCount})</span>
            </button>
            {!isAuthor ? <button className="btn btn-sm btn-outline-secondary" onClick={isLogin ? () => handleFollow({ username: article.author.username, following: article.author.following }) : () => navigate('/login')}>
              <i className="ion-plus-round"></i>
              &nbsp; {article.author.following ? `Unfollow ${article.author.username}` : `Follow ${article.author.username}`}
            </button> : (
              <>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/editor/${article.slug}`)}>
                  <i className="ion-edit"></i> Edit Article
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteArticle(article.slug)}  >
                  <i className="ion-trash-a"></i> Delete Article
                </button>
              </>)}
            </>
)}
export default ActionButtons;