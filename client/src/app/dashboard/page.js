"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  console.log('Session:', session);
  console.log('Current Pathname:', pathname);

  // States for data, loading, and error handling
  const [mostWanted, setMostWanted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    hairColor: "",
    eyeColor: "",
    race: "",
    heightMax: "",
    weightMin: "",
    hair: "",
    ageMin: "",
    sex: "",
    titleSearch: "",
  });

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log('Backend URL', backendUrl);

  // Fetch the Most Wanted data
  useEffect(() => {
    const fetchMostWanted = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + "/wanted", {
        params: { page },
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Referer: "http://www.fbi.gov",
        },
      });

      if (response.data.data.length > 0) {
        setMostWanted((prevState) => [...prevState, ...response.data.data]); // Append new results
      } else {
        setError("No more data available.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
    };

    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else {
      fetchMostWanted();
    }
  }, [status, router, page]); //filter

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
    setLoading(true); // Set loading to true when fetching the next page
  };

const handleLogout = async () => {
  await signOut({ redirect: false });
  setTimeout(() => {
    router.push("/"); 
  }, 100);
};

//const handleLogouts = async () => {
//  await signOut({ redirect: false });
//  router.push("/");  
//};

  
  // Filter most wanted persons based on filter state
  const filteredPersons = mostWanted.filter((person) => {
    return (
      (!filter.hairColor || person.hair_raw === filter.hairColor) &&
      (!filter.eyeColor || person.eyes_raw === filter.eyeColor) &&
      (!filter.race || person.race === filter.race) &&
      (!filter.heightMax || person.height_max <= filter.heightMax) &&
      (!filter.weightMin || person.weight_min >= filter.weightMin) &&
      (!filter.hair || person.hair_raw.includes(filter.hair)) &&
      (!filter.ageMin || person.age_min >= filter.ageMin) &&
      (!filter.sex || person.sex === filter.sex) &&
      (!filter.titleSearch || person.title.toLowerCase().includes(filter.titleSearch.toLowerCase()))
    );
  });

  // Loading and error handling
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
       <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600">
          Logout
        </button><br/>
      <h1 className="text-3xl font-bold mb-6">FBI&apos;s Most Wanted</h1>

      <div className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={filter.titleSearch}
            onChange={(e) =>
              setFilter({ ...filter, titleSearch: e.target.value })
            }
            className="p-2 border"
          />
        </div>

        <div className="mb-4">
          <select
            onChange={(e) => setFilter({ ...filter, hairColor: e.target.value })}
            className="mr-4 p-2 border"
          >
            <option value="">Hair Color</option>
            <option value="Blond">Blond</option>
            <option value="Black">Black</option>
            <option value="Brown">Brown</option>
          </select>
          <select
            onChange={(e) => setFilter({ ...filter, eyeColor: e.target.value })}
            className="mr-4 p-2 border"
          >
            <option value="">Eye Color</option>
            <option value="Blue">Blue</option>
            <option value="Brown">Brown</option>
            <option value="Green">Green</option>
          </select>
          <select
            onChange={(e) => setFilter({ ...filter, race: e.target.value })}
            className="mr-4 p-2 border"
          >
            <option value="">Race</option>
            <option value="White">White</option>
            <option value="Black">Black</option>
            <option value="Hispanic">Hispanic</option>
          </select>
          <select
            onChange={(e) => setFilter({ ...filter, sex: e.target.value })}
            className="mr-4 p-2 border"
          >
            <option value="">Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Min age"
            value={filter.ageMin}
            onChange={(e) =>
              setFilter({ ...filter, ageMin: e.target.value })
            }
            className="mr-4 p-2 border"
          />
          <input
            type="number"
            placeholder="Min weight"
            value={filter.weightMin}
            onChange={(e) =>
              setFilter({ ...filter, weightMin: e.target.value })
            }
            className="mr-4 p-2 border"
          />
          <input
            type="number"
            placeholder="Max height"
            value={filter.heightMax}
            onChange={(e) =>
              setFilter({ ...filter, heightMax: e.target.value })
            }
            className="mr-4 p-2 border"
          />
        </div>

      
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {filteredPersons.map((person, index) => (
          <motion.div
            key={`${person.uid}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl shadow-lg overflow-hidden">
              <Image
                src={person.images?.[0]?.original || "https://via.placeholder.com/150"}
                alt={person.title}
                className="w-full h-48 object-cover rounded-t-2xl"
                width={500}
                height={300}
                layout="intrinsic" // Ensures the image scales according to its aspect ratio
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{person.title}</h3>
                <p className="text-sm text-gray-600">{person.description || "No description available."}</p>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() =>
                  router.push(`/dashboard/${person.uid}`)
                }
              >
                See More
              </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {loading && !error && <p>Loading more...</p>}

      {!loading && !error && mostWanted.length > 0 && (
        <div className="text-center my-6">
          <button
            className="px-6 py-2 bg-blue-700 rounded-lg text-white"
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}

    </div>
  );
}
