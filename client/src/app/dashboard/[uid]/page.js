'use client';
import ViewMore from "../../../components/ui/ViewMore";
import { useEffect, useState } from 'react';
import axios from 'axios';


const SinglePersonPage = ({ params }) => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { uid } = params;  // This will be automatically passed in by Next.js

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
      
        const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + "/wanted/"+ uid , { 
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            Referer: "http://www.fbi.gov",
          },
        });

        setPerson(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch person data');
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchPersonData();
    }
  }, [uid]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <ViewMore person={person} />;
};

export default SinglePersonPage;
