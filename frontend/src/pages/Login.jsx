import { Link,useNavigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import apiClient from '../apiClient';
import {set, useForm} from 'react-hook-form'
import { useState } from "react";
import { use } from "react";
function Login(){
   const {register,handleSubmit,formState:{isValid}} =useForm({mode:'onChange'});
   const {login} =useAuth();
   const [errorMessage,setErrorMessage ]=useState('');
   const onFormSubmit =async (data)=>{
      try{
         const response =await apiClient.post('/users/login',{user:data})
         login(response.data.user,response.data.user.token);
      }
      catch(error){
         if(!error.response){
            setErrorMessage('网络错误，请稍后重试');
            return;
         }
        if(error.response.status===401){
             setErrorMessage('邮箱或密码错误');
         }    
         if(error.response.status===422){
            const messages =Object.entries(error.response.data.errors).map(([field,errors])=>`${field} ${errors.join(',')}`);
            setErrorMessage(messages.join('; '));
         }
   }
}
 return(
    <div className="auth-page">
      <div className="container page">
         <div className="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
               <h1 className="text-xs-center">Sign in</h1>
               <p className="text-xs-center">
                  <Link to="/register">Need a account?</Link>
               </p>
               <form onSubmit={handleSubmit(onFormSubmit)}>
                  {errorMessage&&(<p className="error-messages">{errorMessage}</p>)}
                  <fieldset className="form-group">
                     <input className="form-control form-control-lg" type="text" placeholder="Email"{...register('email',{required:true})}/>
                  </fieldset>
                  <fieldset className="form-group">
                      <input className="form-control form-control-lg" type="password" placeholder="Password" {...register('password',{required:true})} />
                  </fieldset>
                  <button className="btn btn-lg btn-primary pull-xs-right" disabled={!isValid}>Sign in</button>
               </form>
               
            </div>
         </div>
      </div>
    </div>
 )
}

export default Login