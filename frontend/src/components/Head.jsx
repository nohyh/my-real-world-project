import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
function Head (){
  const [islogin,setIslogin] =useState(false);
  const userId =1
  const userName ='nohyh'
    return (
    <>
    {islogin?(
    <nav className="navbar navbar-light">
      <div  className="container">
        <NavLink className="navbar-brand" to="/"> conduit</NavLink>
        <ul className='nav navbar-nav pull-xs-right'>
        <li class="nav-item">
         <NavLink className="nav-link"  to ="/"> Home</NavLink>
         </li>
         <li class="nav-item">
         <NavLink className="nav-link" to="/login">Sign in</NavLink>
         </li>
         <li class="nav-item">
         <NavLink className="nav-link" to ="/register"> Sign up</NavLink>
         </li>
         </ul>
      </div>
    </nav>):(
      <>
        <nav className="navbar navbar-light">
            <div  className="container">
                <NavLink className="navbar-brand" to="/"> conduit</NavLink>
                <ul className='nav navbar-nav pull-xs-right'>
                    <li className="nav-item">
                        <NavLink className="nav-link"  to ="/"> Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/editor"> 
                        <i className="ion-compose"></i>&nbsp;New Article </NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink className="nav-link" to="/settings">
                        <i className='ion-gear-a'></i>&nbsp;Settings</NavLink>
                    </li>
                    <li className='nav-item'>
                      <NavLink className="nav-link" to={`/profile/${userId}`}>
                        {userName}
                      </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
      </>
    )
    }
    </>
  )
}
export default Head