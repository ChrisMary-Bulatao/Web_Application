import { useEffect, useState } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  return (
    <div style={{ marginTop:'50px'}}>
      <h1>Salary List Application</h1>
      {isClient && (
        <p>This site allows user to insert data (Title and Salary), get the list of data and upload file. </p>
        
      )}
    </div>
  );
}
