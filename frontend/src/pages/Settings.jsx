import { useAuth} from "../context/AuthContext";
import{useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";
function Settings({setIslogin}){
   const {logout} =useAuth();
   const navigate =useNavigate();
   const {register,handleSubmit,formState:{isValid}} =useForm({mode:'onChange'});
   cosnt[ errorMessage,setErrorMessage ]=useState('');
   const onFormSubmit =async(data)=>{
    try{
      const response =await apiClient.put('/user',{user:data})
      navigate('/login');
    }
    catch(error){
      if(!error.response){
         setErrorMessage('网络错误，请稍后重试');
         return;
      }
      if(error.response.status===422){
        const messages =Object.entries(error.response.data.errors).map(([field,errors])=>`${field} ${errors.join(',')}`);
        setErrorMessage(messages.join('; '));
      }
    }
   }
    return(
<div className="settings-page">
  <div className="container page">
    <div className="row">
      <div className="col-md-6 offset-md-3 col-xs-12">
        <h1 className="text-xs-center">Your Settings</h1>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          {errorMessage&&(<p className="error-messages">{errorMessage}</p>)}
          <fieldset>
            <fieldset className="form-group">
              <input className="form-control" type="text" placeholder="URL of profile picture" {...register('picture',{required:true})}/>
            </fieldset>
            <fieldset className="form-group">
              <input className="form-control form-control-lg" type="text" placeholder="Your Name" {...register('username',{required:true})} />
            </fieldset>
            <fieldset className="form-group">
              <textarea
                className="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
                {...register('bio',{required:true})}
              ></textarea>
            </fieldset>
            <fieldset className="form-group">
              <input className="form-control form-control-lg" type="text" placeholder="Email"  {...register('email',{required:true})} />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="password"
                placeholder="New Password"
                 {...register('password',{required:true})}
              />
            </fieldset>
            <button className="btn btn-lg btn-primary pull-xs-right" disabled={!isValid}>Update Settings</button>
          </fieldset>
        </form>
        <hr />
        <button className="btn btn-outline-danger" onClick={logout}>Or click here to logout.</button>
      </div>
    </div>
  </div>
</div>
    )
}
export default Settings;