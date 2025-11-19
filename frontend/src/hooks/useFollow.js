import { useMutation,useQueryClient } from "@tanstack/react-query";
import apiClient from '../apiClient';
const useFollow = (queryKey)=>{
    const queryClient = useQueryClient();
    const mutateFollow = useMutation({
        mutationFn :({username,following})=>{
        !following? apiClient.post(`/profiles/${username}/follow`):
        apiClient.delete(`/profiles/${username}/follow`);
    },
    //after mutation , we need to invalidate the query to refetch the profile
        onSuccess : () => {
        queryClient.invalidateQueries({queryKey})
        },});
    const handleFollow = ({username,following})=>{
        mutateFollow.mutate({username,following});
    }
    return {...mutateFollow,handleFollow};
};
export default useFollow;
