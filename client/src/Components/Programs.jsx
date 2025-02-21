import React, { useEffect, useState } from "react";
import axios from "axios";
import ProgramCard from "./ProgramCard";

const ProgramsList = ({ openModal }) => {
  const [programs, setPrograms] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await axios.get(
          "https://tutors-peak-server.vercel.app/api/fetchprograms"
        );
        if (response.status === 200) {
          setPrograms(response.data); // Correctly update the state
          console.log(response.data);
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.error("Error fetching programs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner while fetching data
  }

  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Upcoming Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              openModal={openModal}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsList;