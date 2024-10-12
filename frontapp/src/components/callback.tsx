import React, { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash).get('access_token');
    
    if (token) {
      // Store the token, redirect, or whatever logic you need
      console.log('Access Token:', token);
    } else {
      console.error('No access token found in URL');
    }
  }, []);

  return <div>Loading...</div>;
};

export default Callback;
