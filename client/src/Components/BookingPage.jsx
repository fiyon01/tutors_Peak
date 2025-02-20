import React, { useState } from "react";
import { Plus, Trash2,Lock } from "lucide-react";
import { useLocation } from "react-router-dom";
import "./booking.css"
import "./paymentmodal.css"
import axios from "axios";
 const BookingForm = () => {
  const location = useLocation();
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "",
      grade: "",
    },
  ]);
  const [parentDetails, setParentDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [bookingError,setBookingError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false); // To track the submission state
  const [inputError, setInputError] = useState(false); // To track the submission state

  const [isPaymentPromptVisible, setIsPaymentPromptVisible] = useState(false); // Flag to show payment prompt
  const [newPhoneNumber, setNewPhoneNumber] = useState(""); // To store the new phone number

  const event = location.state?.program; // This will hold the program data passed from EventModal

  // If event is not found, display a message and don't proceed
  if (!event) {
    return <div className="text-white">Event not found. Please try again.</div>;
  }

  const addStudent = () => {
    const newStudent = {
      id: students.length + 1,
      name: "",
      grade: "",
    };
    setStudents([...students, newStudent]);
  };

  const removeStudent = (id) => {
    if (students.length > 1) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  const handleStudentChange = (id, field, value) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? {
              ...student,
              [field]: value,
            }
          : student
      )
    );
  };

  const handleParentChange = (field, value) => {
    setParentDetails({
      ...parentDetails,
      [field]: value,
    });
  };
  const totalPrice = parseFloat(event.registration_fee) * students.length;
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      parentDetails,
      students,
    });
  
    try {
      // Make sure to send POST request with data in the body
      const response = await axios.post("http://localhost:3500/api/registration", {
        parentDetails,
        students,
        totalPrice,
      });
  
      if (response.status === 201) {
        
        setIsPaymentPromptVisible(true)
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
      // Assuming setBoookingError is a function to set error state
      setBookingError("Error booking", error.message);
    }finally{
      setBookingError("")
    }
  };
  const handlePhoneNumberChange = (e) => {
    setNewPhoneNumber(e.target.value);
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
  

    // Check if the phone number is provided and is valid (length >= 10)
    if (!newPhoneNumber || newPhoneNumber.length < 10) {
      setInputError("Please provide a valid phone number.");
      setTimeout(() => {
        setInputError(""); // Clear error after 3 seconds
      }, 3000);
      return;
    } else {
      setInputError(""); // Clear any previous errors
  
      try {
        // Call your payment service API
        const response = await axios.post("http://localhost:3500/api/stk", {
          phoneNumber: newPhoneNumber,
          Amount: totalPrice,
        });
  
        if (response.status === 200) {
          console.log("Payment processed successfully:", response.data);
  
          // Reset the form fields after successful payment
          setParentDetails({
            name: "",
            email: "",
            phone: "",
          });
          setStudents([
            {
              id: 1,
              name: "",
              grade: "",
            },
          ]);
          
          // Close the payment prompt modal
          setIsPaymentPromptVisible(false);
          
          // Display success message
          alert("Payment prompt sent to: " + newPhoneNumber);
          
        } else {
          console.log("Payment request failed:", response.message);
        }
  
      } catch (error) {
        console.log("Error sending request:", error.message);
        setBookingError(`Error sending request: ${error.message}`);
      } finally {
        setBookingError(""); // Clear any errors
      }
    }
  };
  
  return (
    <div className="book-container min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {event.title ? event.title : "N/A"}
        </h1>
        <p className="text-lg text-gray-600 mt-1">
        Registration per Student:
              <span className="pr-1">Ksh</span>{event.registration_fee}
            </p>
        <form onSubmit={handleSubmit}>
          {/* Parent Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              Parent Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={parentDetails.name}
                  onChange={(e) => handleParentChange("name", e.target.value)}
                  className="w-full p-2 border border-gray-500 rounded-md focus:outline-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={parentDetails.phone}
                  onChange={(e) => handleParentChange("phone", e.target.value)}
                  className="w-full p-2 border-2 border-gray-500 rounded-md focus:outline-blue-500"
                  required
                />
              </div>
             
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={parentDetails.email}
                  onChange={(e) => handleParentChange("email", e.target.value)}
                  className="w-full p-2 border-2 border-gray-500 rounded-md focus:outline-blue-500"
                  placeholder="Enter email address (optional)"
                />
              </div>
              
            </div>
          </div>
          {/* Students Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Student Details
            </h2>
            <div className="space-y-4 ">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 border rounded-md bg-gray-50 border-gray-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-gray-600">
                      Student {student.id}
                    </h3>
                    {students.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStudent(student.id)}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) =>
                          handleStudentChange(
                            student.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-500 rounded-md focus:outline-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Grade
                      </label>
                      <select
                        value={student.grade}
                        onChange={(e) =>
                          handleStudentChange(
                            student.id,
                            "grade",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-500 rounded-md focus:outline-blue-500"
                        required
                      >
                        <option value="">Select Grade</option>
                        {[...Array(4)].map((_, i) => (
                          <option key={i + 1} value={`Grade ${i + 1}`}>
                            Form {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addStudent}
                className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Plus size={18} />
                <span>Add Another Student</span>
              </button>
            </div>
          </div>

          {/* Total Fee Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Total Fee: Ksh{totalPrice}
            </h3>
          </div>

          <button
            onClick = {handleSubmit}
            type="submit"
            className="cursor-pointer w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Mpesa Pay{totalPrice}
          </button>
        </form>
      </div>
      {/* Display booking error if any */}
      {bookingError && <p>{bookingError}</p>}

      {/* Payment prompt modal */}
      {/* Payment prompt modal */}
{isPaymentPromptVisible && (
  <div className="modal-overlay">
    <div className="modal flex flex-col  justify-center">
    <img className="w-24 h-24" src="https://inspireip.com/wp-content/uploads/2022/12/m-pesa-768x561.png" alt="mpesa"/>
      <h2 className="text-lg fot-semibold pb-2">Pay <span>ksh {totalPrice}</span> Now With Mpesa</h2>
      <p className="text-gray-400 sm:text-lg">
        Clicking "Pay Now" mpesa will send a payment prompt to the phone number:
      </p>
      {/* Display the phone number that will be used for the payment */}
      <p className="text-gray-600">{newPhoneNumber}</p>

      <div className="input-container">
      
        <input
          type="text"
          value={newPhoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Enter phone number" 
        />
      </div>
      {inputError && <p className="text-red-500 pb-2">{inputError}</p>}
      <button  className="sm:text-lg" onClick={handlePayNow}>Pay Now</button>
      <button
        className="close-modal sm:text-lg"
        onClick={() => setIsPaymentPromptVisible(false)}
      >
        Close
      </button>
      <div className="flex justify-center items-center pt-4">
        {/* Lock icon with text size applied */}
        <Lock className="mr-2 text-green-500 text-4xl" /> {/* Increased icon size to 4xl */}
        
        <p className="text-gray-400 pt-4">
          We use trusted payment gateways to provide a seamless and secure experience for you.
        </p>
      </div>

    
    </div>
  </div>
)}

    </div>
  );
};
export default BookingForm