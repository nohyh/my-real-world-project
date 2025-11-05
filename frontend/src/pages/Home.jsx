import { Link,NavLink } from "react-router-dom"

function Home(){
    const userId =55656
    const Username ='nohyh'
    return(
    <>
    <div className="home-page">
        <div className="banner">
             <h1 class="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
        </div>
    </div>
    <div className="container page">
        <div className="row">
            <div className="col-md-9">
                <div className="feed-toggle">
                    <ul className="nav nav-pills outline-active">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Your Feed</NavLink>
                        </li>
                         <li className="nav-item">
                            <NavLink className="nav-link" to="">Global Feed</NavLink>
                        </li>
                    </ul>
                </div>
                <div className="article-preview">
                    <div className="article-meta">
                        <Link to={`/profile/${userId}`} ><img src="http://i.imgur.com/Qr71crq.jpg" /></Link>
                        <div className="info">
                            <Link to= {`/profile/${userId}`} className="author">{Username}</Link>
                            <span className="date" > January 20th</span>
                        </div>
                        <button class="btn btn-outline-primary btn-sm pull-xs-right">
                        <i className="ion-heart"></i>20
                        </button>
                    </div>
                    <Link className="preview-link">
                        <h1> to to build webapps that scale</h1>
                        <p> this is the description for the post</p>
                        <span> read more...</span>
                        <ul className="tag-list">
                            <li className="tag-default tag-pill tag-outline">realworld</li>
                             <li className="tag-default tag-pill tag-outline">implementations</li>
                        </ul>
                    </Link>
                </div>
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
                        <Link className="tag-pill tag-default">programming</Link>
                        <Link className="tag-pill tag-default">react</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
    )
}
export default Home