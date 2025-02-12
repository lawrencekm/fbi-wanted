"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ViewMore({ person }) {
    const router = useRouter();

    console.log('Person:', person);
  if (!person) return <p>Error: No data available.</p>;
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{person.title}</h1>
      <div className="flex justify-center mb-6">
        <Image
          src={person.images?.[0]?.original || "https://via.placeholder.com/150"}
          alt={person.title}
          width={500}
          height={300}
          className="object-cover rounded-lg"
        />
      </div>

      <table className="min-w-full border-collapse table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Attribute</th>
            <th className="px-4 py-2 border">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border">Name</td>
            <td className="px-4 py-2 border">{person.title}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Description</td>
            <td className="px-4 py-2 border">{person.description}</td>
          </tr>

          <tr>
            <td className="px-4 py-2 border">Age</td>
            <td className="px-4 py-2 border">{person.age_range || "Unknown"}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Sex</td>
            <td className="px-4 py-2 border">{person.sex}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Hair</td>
            <td className="px-4 py-2 border">{person.hair}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Eyes</td>
            <td className="px-4 py-2 border">{person.eyes}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Race</td>
            <td className="px-4 py-2 border">{person.race}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Weight</td>
            <td className="px-4 py-2 border">{person.weight || "Unknown"}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border">Scars & Marks</td>
            <td className="px-4 py-2 border">{person.scars_and_marks || "None"}</td>
          </tr>  
        </tbody>
      </table>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
