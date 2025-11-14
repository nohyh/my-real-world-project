import { Link,useNavigate} from "react-router-dom"
import apiClient from '../apiClient';
import { useState } from "react";
import {useForm} from 'react-hook-form'
import { useAuth } from "../context/AuthContext";
function Register(){
   const {login} =useAuth();
   const navigate =useNavigate();
   const {register,handleSubmit,formState:{isValid}} =useForm({mode:'onChange'});
   const onFormSubmit=async(data)=>{
      try{
         const response =await apiClient.post('/users',{user:data});
         login(response.data.user,response.data.user.token);
      }
      catch(error){
         console.error("something is wrong",error);
      }

   }
 return(
    <div className="auth-page">
      <div className="container page">
         <div className="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
               <h1 className="text-xs-center">Sign up</h1>
               <p className="text-xs-center">
                  <Link to="/login">Have an account?</Link>
               </p>
               <form onSubmit={handleSubmit(onFormSubmit)}>
                  <fieldset className="form-group">
                     <input className="form-control form-control-lg" type="text" placeholder="Username" {...register('username',{required:true})}/>
                  </fieldset>
                  <fieldset className="form-group">
                     <input className="form-control form-control-lg" type="text" placeholder="Email" {...register('email',{required:true})} />
                  </fieldset>
                  <fieldset className="form-group">
                      <input className="form-control form-control-lg" type="password" placeholder="Password" {...register('password',{required:true})}/>
                  </fieldset>
                  <button className="btn btn-lg btn-primary pull-xs-right" disabled={!isValid}>Sign up</button>
               </form>
            </div>
         </div>
      </div>
    </div>
 )
}

export default Register