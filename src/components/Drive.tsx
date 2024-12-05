import { IonList, IonItem, IonLabel, IonListHeader, IonCheckbox, IonButton, IonIcon } from '@ionic/react';
import { eyeOutline, downloadOutline } from 'ionicons/icons';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "https://api.royerm.fr";

interface File {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink: string;
}

// Function to group files by extension
function groupFilesByExtension(files: File[]): Map<string, File[]> {
  const groupedFiles = new Map<string, File[]>();

  files.forEach((file) => {
    // Extract the file extension
    const extension = file.name.split(".").pop(); // Get the part after the last dot
    if (extension) {
      // Initialize array if not already present
      if (!groupedFiles.has(extension)) {
        groupedFiles.set(extension, []);
      }
      // Add the file to the corresponding group
      groupedFiles.get(extension)?.push(file);
    }
  });

  return groupedFiles;
}

const Drive: React.FC = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [data, setData] = useState<Map<string, File[]>>(new Map());
  const [error, setError] = useState<string | null>(null);  
  const [checkedFiles, setCheckedFiles] = useState<Set<string>>(new Set());

  // Function to handle Checked files
  const handleCheckboxChange = (fileId: string, isChecked: boolean) => {
    setCheckedFiles((prev) => {
      const updated = new Set(prev);
      isChecked ? updated.add(fileId) : updated.delete(fileId);
      return updated;
    });
  };

  // Function to handle ConvertMD action on checked files
  const handleConvertMD = async () => {
    const fileIds = Array.from(checkedFiles);
    // Construct the API URL
    const url = `${apiBaseUrl}/drive/update-file-extension`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds }),
      });
      const result = await response.json();
      //console.log('Update result:', result);
      setData(groupFilesByExtension(result));
    } catch (error: any) {
      console.error('Error updating file extensions:', error.message);
    }
  };

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const token = await getAccessTokenSilently();
        // Construct the API URL
        const url = `${apiBaseUrl}/drive/files`;
      
        // Make the fetch request
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      
        // Check for HTTP errors
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, redirecting...');
            setError('Unauthorized, redirecting...');
            window.location.href = `${apiBaseUrl}/auth/google`;
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        // Parse the JSON response
        const data = await response.json(); // Assuming the response is JSON
        console.log('Data:', data);
      
        // Process and set the data
        setData(groupFilesByExtension(data));
      } catch (error) {
        console.error('Error fetching data from API:', error);
        setError('Error fetching data from API');
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
            <IonList>
              {Array.from(data.entries()).map(([extension, files]) => (
                <div key={extension}>
                  <IonListHeader>
                    <h3>.{extension}</h3>
                  </IonListHeader>
                  <ul>
                    {files.map((file) => (
                      <IonItem key={file.id}>
                        {extension === 'txt' && (
                          <IonCheckbox
                            slot="start"
                            onIonChange={(e) => handleCheckboxChange(file.id, e.detail.checked)}
                          />
                        )}
                        <IonLabel>{file.name}</IonLabel>
                        {/* Preview button */}
                        <IonButton fill="clear" href={file.webViewLink} target="_blank" rel="noopener noreferrer">
                          <IonIcon icon={eyeOutline} slot="icon-only" />
                        </IonButton>
                        {/* Download button */}
                        <IonButton fill="clear" href={file.webContentLink} target="_blank" rel="noopener noreferrer">
                          <IonIcon icon={downloadOutline} slot="icon-only" />
                        </IonButton>
                      </IonItem>
                    ))}
                  </ul>
                </div>
              ))}
            </IonList>
            <IonButton onClick={handleConvertMD} disabled={checkedFiles.size === 0}>
              Convert to Markdown
            </IonButton>            
          </div>
        )}      
    </div>
  );
};

export default Drive;