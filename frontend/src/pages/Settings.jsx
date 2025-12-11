import { useAuth} from "../context/AuthContext";
import{useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import apiClient from "../apiClient";
function Settings(){
   const {logout,updateUser,user} =useAuth();
   const navigate =useNavigate();
   const {register,handleSubmit,formState:{isDirty}} =useForm({mode:'onChange', values: {
        picture: user.image?user.image:'',
        username: user.username,
        bio: user?.bio || '',
        email: user.email,
        password: ''
    }});
   const[ errorMessage,setErrorMessage ]=useState('');
   const onFormSubmit =async(data)=>{
      const requestBody = {
        user:{
          image:data.picture,
          username:data.username,
          bio:data.bio,
          email:data.email,
          password:data.password
        }
      }
      //if not change the password, do not send it to the server 
      if(!data.password){
        delete requestBody.user.password;
      }

      try{
      const response =await apiClient.put('/user',requestBody)
      updateUser(response.data.user);
      navigate(`/profile/${response.data.user.username}`);
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
<div className="settings-page" key={user?.username}>
  <div className="container page">
    <div className="row">
      <div className="col-md-6 offset-md-3 col-xs-12">
        <h1 className="text-xs-center">Your Settings</h1>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          {errorMessage&&(<p className="error-messages">{errorMessage}</p>)}
          <fieldset>
            <fieldset className="form-group">
              <input className="form-control" type="text" placeholder="URL of profile picture" {...register('picture')}/>
            </fieldset>
            <fieldset className="form-group">
              <input className="form-control form-control-lg" type="text" placeholder="Your Name" {...register('username',{required:true})} />
            </fieldset>
            <fieldset className="form-group">
              <textarea
                className="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
                {...register('bio')}
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
                 {...register('password')}
              />
            </fieldset>
            <button className="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={!isDirty} >Update Settings</button>
          </fieldset>
        </form>
        <hr />
        <button className="btn btn-outline-danger" onClick={logout} >Or click here to logout.</button>
      </div>
    </div>
  </div>
</div>
    )
}
export default Settings;