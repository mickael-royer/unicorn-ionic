import { IonList, IonItem, IonLabel } from '@ionic/react';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

interface File {
  id: number;
  name: string;
}

const Drive: React.FC = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [data, setData] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
          const token = await getAccessTokenSilently();
          //console.log(token);         
          const response = await axios.get<File[]>(`${API_BASE_URL}/drive/files`, {
          headers: {
          'Authorization': `Bearer ${token}`,
          },          
        });
        
        setData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
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

  console.log(JSON.stringify(data, null, 2));

  return (
    <div className="profile-container">
      <h2>Google Drive Files</h2> 
      {error && <div>Error: {error}</div>}
        {data && (
          <div>
            <h2>Data from API:</h2>
            <IonList>
            {data.map((file) => (
              <IonItem key={file.id}>
                <IonLabel>
                  <h2>{file.name}</h2>                  
                </IonLabel>
              </IonItem>
            ))}
          </IonList>            
          </div>
        )}      
    </div>
  );
};

export default Drive;