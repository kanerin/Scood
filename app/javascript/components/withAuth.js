import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const { identifier } = useParams();

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await fetch(`/events/${identifier}/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('authToken');
        }
      };
      checkAuth();
    }, [identifier]);

    if (!isAuthenticated) {
      navigate(`/events/${identifier}/auth`);
      return null; // リダイレクト後は何もレンダリングしない
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
