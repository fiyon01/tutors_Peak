import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Cardskeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Skeleton for image */}
      <Skeleton height={192} width="100%" />
      
      <div className="p-4">
        {/* Skeleton for the subject */}
        <Skeleton width="40%" height={20} />

        {/* Skeleton for program name */}
        <Skeleton width="60%" height={24} className="mt-2" />
        
        <div className="space-y-2 mb-4">
          {/* Skeleton for start date */}
          <div className="flex items-center text-gray-600">
            <Skeleton height={16} width="50%" />
          </div>

          {/* Skeleton for time */}
          <div className="flex items-center text-gray-600">
            <Skeleton height={16} width="50%" />
          </div>

          {/* Skeleton for location */}
          <div className="flex items-center text-gray-600">
            <Skeleton height={16} width="50%" />
          </div>
        </div>
        
        {/* Skeleton for the button */}
        <Skeleton height={36} width="100%" />
      </div>
    </div>
  );
};

export default Cardskeleton;
