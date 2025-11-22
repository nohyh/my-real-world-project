import { useAuth } from "../context/AuthContext";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import apiClient from "../apiClient";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
function Comment({slug}) {
    const {user,isLogin} = useAuth();
    const [commentInput,setCommentInput] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fetchComments = async (slug) => {
        const { data } = await apiClient.get(`/articles/${slug}/comments`);
        return data.comments;
    };
    const {data:comments,isLoading:isCommentsLoading,isError:isCommentsError}=useQuery({
        queryKey:['comments',slug],
        queryFn:()=>fetchComments(slug)
    })
    const mutateComment = useMutation({
        mutationFn:async (id)=>{
            const {data} = await apiClient.delete (`/articles/${slug}/comments/${id}`);
            return data;
        },
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey:['comments',slug]})
        }   
    })
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            const response = await apiClient.post(`/articles/${slug}/comments`,{comment:{body:commentInput}});
            console.log(response.data);
            queryClient.invalidateQueries({queryKey:['comments',slug]});
        }
        catch(error){
            console.log(error);
        }
        setCommentInput('');
    }
    if(isCommentsLoading){
        return <div>Loading comments...</div>;
    }
    if(isCommentsError){
        return <div>Error loading comments.</div>;
    }
    return (
       <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isLogin?(
            <form onSubmit={handleSubmit} className="card comment-form">
              <div className="card-block">
                <textarea   
                  value={commentInput}
                  onChange={(e)=>setCommentInput(e.target.value)}
                  className="form-control"
                  placeholder="Write a comment..."
                  rows="3"
                ></textarea>
              </div>
              <div className="card-footer">
                <img
                  src={user?.image}
                  className="comment-author-img"
                  alt="Comment author"
                />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>):(
                <div>
                    <Link to='/login'>Sign in</Link>
                    or
                    <Link to='/register'>Sign up</Link>
                    to add comments on this article.
                </div>
            )}
            {
                comments.map((comment)=>(
                    <>
                    <div className="card" key={comment.id}>
                        <div className="card-block">
                            <p className="card-text">
                                {comment.body}
                            </p>
                        </div>
                        <div className="card-footer">
                            <Link to={`/profile/${comment.author.username}`} className="comment-author">
                                <img
                                    src={comment.author.image}
                                    className="comment-author-img"
                                    alt="Comment author"
                                />
                            </Link>
                            &nbsp;
                            <Link to={`/profile/${comment.author.username}`} className="comment-author">
                                {comment.author.username}
                            </Link>
                            <span className="date-posted">{new Date(comment.createdAt).toDateString()}</span>
                            { isLogin&&comment.author.username===user.username&&(
                                <span className="mod-options">
                                    <i className="ion-trash-a" onClick={()=>mutateComment.mutate(comment.id)}></i>
                                </span>
                            )}
                        </div>
                    </div>
                    </>
                ))
            }
          </div>
        </div> 
    )
}   
export default Comment;