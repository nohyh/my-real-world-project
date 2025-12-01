import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { useQuery } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { useState } from 'react';
import useLikeArticle from '../hooks/useLikeArticle';
import ArticleList from '../components/ArticleList';
import Pagination from '../components/Pagination';
function Home() {
    const navigate = useNavigate();
    const { user, isLogin } = useAuth();
    const [isMyFeed, setIsMyFeed] = useState(false);
    const [selectedTag, setSelectedTag] = useState('');
    const userName = user?.username || '';
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const { handleLike } = useLikeArticle(['articles', userName, isMyFeed]);
    const [totalPage, setTotalPage] = useState(0);
    const fetchArticles = async () => {
        const offset = (currentPage - 1) * limit;
        const { data } =
            selectedTag ? await apiClient.get(`/articles?tag=${selectedTag}&offset=${offset}&limit=${limit}`) : isMyFeed
                ? await apiClient.get(`/articles/feed?offset=${offset}&limit=${limit}`)
                : await apiClient.get(`/articles?offset=${offset}&limit=${limit}`);
        setTotalPage(Math.ceil(data.articlesCount / limit));
        return data.articles;
    }
    const { data: articles, isLoading: areAriticleLoading, isError: areAriticleError } = useQuery({
        queryKey: ['articles', userName, isMyFeed, selectedTag, currentPage],
        queryFn: () => fetchArticles(),
    });

    const handleTagClick = (tag) => {
        setIsMyFeed(null);
        setSelectedTag(tag);
        setCurrentPage(1);
    }
    const handleFeedClick = (isMyFeed) => {
        if (isMyFeed) {
            if (!userName) {
                navigate('/login');
                return;
            }
            setIsMyFeed(true);
            setSelectedTag('');
            setCurrentPage(1);
        }
        else {
            setIsMyFeed(false);
            setSelectedTag('');
            setCurrentPage(1);
        }

    }
    const fetchPopular = async () => {
        const { data } = await apiClient.get('/tags');
        return data.tags;
    }
    const { data: tags, isError: areTagsError, isLoading: areTagsLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: () => fetchPopular(),
    })
    const isLoading = areAriticleLoading || areTagsLoading;
    const isError = areAriticleError || areTagsError;
    return (
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
                                    <button className={`nav-link ${isMyFeed && !selectedTag ? "active" : ""}`} onClick={() => handleFeedClick(true)}>Your Feed</button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${isMyFeed || selectedTag ? "" : "active"}`} onClick={() => handleFeedClick(false)}>Global Feed</button>
                                </li>
                                {selectedTag && (
                                    <li className="nav-item">
                                        <button className="nav-link active" >{selectedTag}</button>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <ArticleList articles={articles} isLoading={isLoading} isError={isError} handleLike={handleLike} navigate={navigate} />
                        <Pagination totalPage={totalPage} setCurrentPage={setCurrentPage} />
                    </div>
                    <div className="col-md-3">
                        <div className="sidebar">
                            <p>Popular Tags</p>
                            <div className="tag-list">
                                {tags?.map((tag) => (
                                    <Link key={tag} onClick={() => handleTagClick(tag)} className="tag-pill tag-default">{tag}</Link>
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