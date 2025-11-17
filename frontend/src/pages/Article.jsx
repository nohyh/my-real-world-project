import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../apiClient';
import { useQuery } from '@tanstack/react-query';
import { mockArticle, mockComments } from '../data/mockData.js';

function Article() {
  const { user } = useAuth();
  const userName = user?.username || '';
  const { slug } = useParams();

  const fetchArticle = async (slug) => {
    if (import.meta.env.DEV && userName === 'test') {
      return mockArticle;
    }
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
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round"></i>
              &nbsp; {`Follow ${article.author.username}`} <span className="counter">(10)</span>
            </button>
            &nbsp;&nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart"></i>
              &nbsp; Favorite Post <span className="counter">({article.favoritesCount})</span>
            </button>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-edit"></i> Edit Article
            </button>
            <button className="btn btn-sm btn-outline-danger">
              <i className="ion-trash-a"></i> Delete Article
            </button>
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>
              Web development technologies have evolved at an incredible clip
              over the past few years.
            </p>
            <h2 id="introducing-ionic">Introducing RealWorld.</h2>
            <p>It's a great solution for learning how other frameworks work.</p>
            <ul className="tag-list">
              <li className="tag-default tag-pill tag-outline">realworld</li>
              <li className="tag-default tag-pill tag-outline">implementations</li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <div className="article-meta">
            <Link to="/profile/eric-simons">
              <img src="http://i.imgur.com/Qr71crq.jpg" alt="Author Profile" />
            </Link>
            <div className="info">
              <Link to="/profile/eric-simons" className="author">
                Eric Simons
              </Link>
              <span className="date">January 20th</span>
            </div>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round"></i>
              &nbsp; Follow Eric Simons
            </button>
            &nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart"></i>
              &nbsp; Favorite Article <span className="counter">(29)</span>
            </button>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-edit"></i> Edit Article
            </button>
            <button className="btn btn-sm btn-outline-danger">
              <i className="ion-trash-a"></i> Delete Article
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows="3"
                ></textarea>
              </div>
              <div className="card-footer">
                <img
                  src="http://i.imgur.com/Qr71crq.jpg"
                  className="comment-author-img"
                  alt="Comment author"
                />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>
            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <Link to="/profile/author" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                    alt="Comment author"
                  />
                </Link>
                &nbsp;
                <Link to="/profile/jacob-schmidt" className="comment-author">
                  Jacob Schmidt
                </Link>
                <span className="date-posted">Dec 29th</span>
              </div>
            </div>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <Link to="/profile/author" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                    alt="Comment author"
                  />
                </Link>
                &nbsp;
                <Link to="/profile/jacob-schmidt" className="comment-author">
                  Jacob Schmidt
                </Link>
                <span className="date-posted">Dec 29th</span>
                <span className="mod-options">
                  <i className="ion-trash-a"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Article;