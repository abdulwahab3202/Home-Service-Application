import React, { useContext, useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const GoogleAuthBtn = () => {
  const { googleLogin } = useContext(StoreContext);
  const navigate = useNavigate();
  
  const [buttonTheme, setButtonTheme] = useState('outline');

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setButtonTheme(isDark ? 'filled_black' : 'outline');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);

      if (result.success) {
        navigate('/');
      } else if (result.isNewUser) {
        navigate('/complete-profile', {
          state: {
            email: result.data.email,
            name: result.data.name,
            profileImage: result.data.picture
          }
        });
      }
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-6">

      <div className="w-full flex justify-center">
        <GoogleLogin 
          onSuccess={handleGoogleSuccess} 
          onError={() => console.log('Login Failed')} 
          useOneTap 
          theme={buttonTheme}
          shape="circle"     
          width="100%"       
          size="large"
          text="continue_with"
        />
      </div>
    </div>
  );
};

export default GoogleAuthBtn;