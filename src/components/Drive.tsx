import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const Drive: React.FC = () => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
          const token = await getAccessTokenSilently();
          //console.log(token);         
          const response = await axios.get(`${API_BASE_URL}/drive/files`, {
          headers: {
          'Authorization': `Bearer ${token}`,
          },          
        });
        
        setData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Now TypeScript knows `error` is of type `AxiosError`
          if (error.response?.status === 401) {
            // Handle 401 Unauthorized specifically
            console.log('Unauthorized, redirecting...');
            setError('Unauthorized, redirecting...');
            window.location.href = `${API_BASE_URL}/auth/google`;
          } else {
            console.error('Axios error:', error.message);
          }
        } else {
          console.error('Unknown error:', error);
          setError('Error fetching data from API');
        }      
      }
    };
    fetchDataFromApi();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div className="profile-container">
      <h2>Google Drive Files</h2> 
      {error && <div>Error: {error}</div>}
        {data && (
          <div>
            <h2>Data from API:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}      
    </div>
  );
};

export default Drive;