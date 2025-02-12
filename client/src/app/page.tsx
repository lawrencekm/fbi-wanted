"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
// person object defined here. don't repeat it

type Person = {
  uid: string;
  age_range?: string | null;
  weight?: string | null;
  occupations?: string | null;
  field_offices?: string | null;
  locations?: string | null;
  reward_text?: string | null;
  sex?: string | null;
  hair?: string | null;
  ncic?: string | null;
  dates_of_birth_used?: string | null;
  caution?: string | null;
  nationality?: string | null;
  age_min: number;
  age_max: number;
  scars_and_marks?: string | null;
  subjects: string[];
  aliases?: string | null;
  race_raw: string;
  suspects?: string | null;
  publication: string;
  title: string;
  coordinates: string[];
  hair_raw?: string | null;
  languages?: string | null;
  complexion?: string | null;
  build?: string | null;
  details: string;
  status?: string | null;
  legat_names?: string | null;
  eyes?: string | null;
  person_classification: string;
  description: string;
  images: {
    large: string;
    caption?: string | null;
    thumb: string;
    original: string;
  }[];  
  reward_min: number;
  reward_max: number;
  race: string;
  height_max: number;
  place_of_birth?: string | null;
  height_min: number;
  poster_classification: string;
  warning_message?: string | null;
  pathId: string;
  files?: { url: string; name: string }[];
};


export default function Home() {
  const [mostWanted, setMostWanted] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMostWanted = async () => {
    try {
        //const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;
        const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + "/wanted", {
        params: {  },
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

  useEffect(() => {
    fetchMostWanted();
  }, []);



  return (
    <div className="min-h-screen bg-gray-100 p-6 font-[family-name:var(--font-geist-sans)]">
      <section className="bg-blue-500 text-white py-12 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          Discover the FBI&apos;s Most Wanted
        </h1>
        <p className="text-lg sm:text-xl mb-8">
          Join the fight against crime by keeping an eye out for these dangerous individuals. Your tip could help bring them to justice!
        </p>
        <div className="flex justify-center gap-6">
          <button
            className="px-6 py-3 bg-blue-700 rounded-lg text-white text-lg"
            onClick={() => window.location.href = "/auth/signup"}
          >
            Sign Up to See More
          </button>
          <button
            className="px-6 py-3 border border-white rounded-lg text-white text-lg"
            onClick={() => window.location.href = "/auth/signin"}
          >
            Sign in
          </button>
        </div>
      </section>

      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6">FBI&apos;s Most Wanted</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : mostWanted.length === 0 ? (
            <p>No data available.</p>
          ) : (
            mostWanted.slice(0, 3).map((person) => (
              <motion.div
                key={person.uid}
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
                    objectFit="cover" // Crops im to fill the given width and height
                    layout="intrinsic" // Ensures the imge scales according to its aspect ratio
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{person.title}</h3>
                    <p className="text-sm text-gray-600">Published: {person.publication}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>


      </div>

      <footer className="flex gap-6 flex-wrap items-center justify-center mt-12">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          onClick={() => window.location.href = "/api/auth/signin"}
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign in for advanced search & filter →
        </a>
      </footer>
    </div>
  );
}
