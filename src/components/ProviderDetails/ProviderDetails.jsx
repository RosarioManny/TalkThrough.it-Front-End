import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";
import {
  fetchProviderDetails,
  getProviderAvailability,
  getProviderReviews,
  saveProvider,
} from "../../services/providerService";

const ProviderDetails = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadProviderData = async () => {
      try {
        setLoading(true);
        const [providerData, availabilityData, reviewsData] = await Promise.all([
          fetchProviderDetails(providerId),
          getProviderAvailability(providerId, selectedDate),
          getProviderReviews(providerId),
        ]);

        setProvider(providerData);
        setAvailability(availabilityData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error loading provider data:", err);
        setError("Failed to load provider information");
      } finally {
        setLoading(false);
      }
    };

    loadProviderData();
  }, [providerId, selectedDate]);

  const handleSaveProvider = async () => {
    try {
      await saveProvider(providerId);
      // Show success message
    } catch (err) {
      // Show error message
    }
  };

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${providerId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-alice_blue-500">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500"></div>
          <p className="mt-4 text-prussian_blue-400">Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${theme.status.error} p-4 max-w-2xl mx-auto mt-8 rounded-lg`}>
        {error}
      </div>
    );
  }

  return (
    <div className="bg-alice_blue-500 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Provider Header */}
        <div className={`${theme.card.default} mb-8`}>
          <div className="flex flex-col md:flex-row md:items-start p-8 gap-8">
            <div className="flex-shrink-0">
              {provider?.profileImage ? (
                <img
                  src={provider.profileImage}
                  alt={`${provider.firstName} ${provider.lastName}`}
                  className="w-32 h-32 rounded-xl object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-celestial_blue-100 flex items-center justify-center">
                  <span className="text-3xl text-celestial_blue-500 font-semibold">
                    {provider?.firstName[0]}
                    {provider?.lastName[0]}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-grow space-y-4">
              <div>
                <h1 className={`${theme.text.heading} text-3xl mb-2`}>
                  Dr. {provider?.firstName} {provider?.lastName}
                </h1>
                <p className="text-prussian_blue-400 mb-2">{provider?.title}</p>
                <p className="text-prussian_blue-400 mb-4">{provider?.location}</p>
                
                {provider?.acceptingClients && (
                  <span className={theme.badges.verified}>
                    Accepting New Clients
                  </span>
                )}
              </div>

              {user?.type === "client" && (
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleBookAppointment}
                    className={`${theme.button.primary} px-6 py-2 rounded-lg`}
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={handleSaveProvider}
                    className={`${theme.button.outline} px-6 py-2 rounded-lg`}
                  >
                    Save Provider
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Provider Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="md:col-span-2 space-y-8">
            <div className={theme.card.default}>
              <div className="p-8">
                <h2 className={`${theme.text.heading} text-xl mb-6`}>About</h2>
                <p className="text-prussian_blue-400 mb-8 leading-relaxed">
                  {provider?.bio}
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className={`${theme.text.heading} text-lg mb-3`}>Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {provider?.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="bg-celestial_blue-50 text-celestial_blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={`${theme.text.heading} text-lg mb-3`}>Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {provider?.languages.map((language) => (
                        <span
                          key={language}
                          className="bg-alice_blue-100 text-prussian_blue-500 px-3 py-1 rounded-full text-sm"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className={theme.card.default}>
              <div className="p-8">
                <h2 className={`${theme.text.heading} text-xl mb-6`}>Reviews</h2>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-alice_blue-200 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-prussian_blue-500">
                              {review.clientName}
                            </p>
                            <p className="text-sm text-prussian_blue-300">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex text-sunglow-500">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating ? "fill-current" : "text-alice_blue-300"
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-prussian_blue-400">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-prussian_blue-300 text-center py-8">
                    No reviews yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Insurance & Fees */}
            <div className={theme.card.default}>
              <div className="p-8">
                <h2 className={`${theme.text.heading} text-xl mb-6`}>
                  Insurance & Fees
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className={`${theme.text.heading} text-lg mb-3`}>
                      Accepted Insurance
                    </h3>
                    <ul className="space-y-2">
                      {provider?.insuranceAccepted.map((insurance) => (
                        <li 
                          key={insurance} 
                          className="text-prussian_blue-400 flex items-center"
                        >
                          <span className="mr-2">•</span>
                          {insurance}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className={`${theme.text.heading} text-lg mb-3`}>
                      Session Fees
                    </h3>
                    <p className="text-prussian_blue-400">
                      ${provider?.sessionFee}/session
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Types */}
            <div className={theme.card.default}>
              <div className="p-8">
                <h2 className={`${theme.text.heading} text-xl mb-6`}>
                  Session Types
                </h2>
                <div className="space-y-4">
                  {provider?.sessionTypes.map((type) => (
                    <div 
                      key={type}
                      className="flex items-center text-prussian_blue-400"
                    >
                      <span className="mr-3">
                        {type === 'Video' && (
                          <svg className="w-5 h-5 text-celestial_blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                        {type === 'In-Person' && (
                          <svg className="w-5 h-5 text-celestial_blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                        {type === 'Phone' && (
                          <svg className="w-5 h-5 text-celestial_blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        )}
                      </span>
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;
