import { useMutation,useQueryClient } from "@tanstack/react-query";
import apiClient from '../apiClient';
// use mutation to manage like and follow actions
const useLikeArticle = (queryKey)=>{
    const queryClient = useQueryClient();
    const mutateLike =useMutation({
        mutationFn : ({slug,favorited})=> {!favorited? apiClient.post(`/articles/${slug}/favorite`)
        :apiClient.delete(`/articles/${slug}/favorite`);
        },
        //after mutation , we need to invalidate the query to refetch the articles
        onSuccess : () => {
        queryClient.invalidateQueries({queryKey});
      },
    });
    const handleLike =( {slug,favorited})=>{
      mutateLike.mutate({slug,favorited});
    }
    return {...mutateLike,handleLike};
}
export default useLikeArticle;
