import React, { useState,useEffect } from "react";
import axios from "axios"
import Navbar from "./Navbar";
import EventModal from "./EventModal";
import Hero from "./Hero";
import { Calendar, Clock, MapPin } from "lucide-react";
import Features from "./Features";
import Stats from "./Stats";
import Footer from "./Footer";


function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programs, setPrograms] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await axios.get("https://tutors-peak-server.vercel.app/api/programs");
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
  
  const openModal = (program) => {
    setIsModalOpen(true);
    setSelectedProgram(program);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProgram("");
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        
        <section className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Upcoming Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={program.image_url} alt={program.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="text-sm font-medium text-blue-600 mb-2 block">{program.subject}</span>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{program.name}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{program.start_date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">{program.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{program.location}</span>
          </div>
        </div>
        <button onClick={() => openModal(program)} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
          ))}
        </div>
      </div>
    </section>
        <Features />
        <Stats />
      </main>
      <Footer />
      {isModalOpen && <EventModal program={selectedProgram} closeModal={closeModal} />}
    </div>
  );
}

export default Home;
