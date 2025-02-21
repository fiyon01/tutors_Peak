import React, { useEffect, useState } from "react";
import axios from "axios";
import ProgramCard from "./ProgramCard";

const ProgramsList = ({ openModal }) => {
  



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