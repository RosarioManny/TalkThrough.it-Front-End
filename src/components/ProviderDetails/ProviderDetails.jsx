import React, { useState, useEffect } from "react";
import { useParams, useNavigate, redirect } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";
import {
  fetchProviderPublicDetails,
  fetchProviderDetails,
  saveProvider,
  removeSavedProvider,
} from "../../services/providerService";
import { getProviderAvailability } from "../../services/availabilityService";
import { fetchSavedProviders } from "../../services/dashboardService";

export const ProviderDetails = ({
  isModal = false,
  modalProvider = null,
  onClose = null,
}) => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [provider, setProvider] = useState(modalProvider);
  const [loading, setLoading] = useState(!modalProvider);
  const [availability, setAvailability] = useState([]);
  // const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState("");
  const [savedProviders, setSavedProviders] = useState([]);

  const formatDateForApi = (date) => {
    return date.toISOString().split("T")[0];
  };

  // For modal usage
  useEffect(() => {
    if (isModal) {
      if (modalProvider) {
        console.log("Modal: Setting provided data");
        setProvider(modalProvider);
        setLoading(false);
      } else {
        console.log("Modal: No provider data");
        setLoading(true);
      }
    }
  }, [modalProvider, isModal]);

  // For standalone page usage
  useEffect(() => {
    const loadProviderData = async () => {
      // Only load if not in modal mode
      if (isModal) return;

      try {
        setLoading(true);
        setError(null);

        const activeProviderId = providerId;
        console.log("Page: Loading provider data for ID:", activeProviderId);

        const [providerData, availabilityData] = await Promise.all([
          fetchProviderDetails(activeProviderId),
          getProviderAvailability(
            activeProviderId,
            formatDateForApi(selectedDate)
          ),
        ]);

        console.log("Page: Loaded provider data:", providerData);
        setProvider(providerData.provider || providerData);
        setAvailability(availabilityData);
      } catch (err) {
        console.error("Error loading provider data:", err);
        setError("Failed to load provider information");
      } finally {
        setLoading(false);
      }
    };

    if (providerId && !isModal) {
      loadProviderData();
    }
  }, [providerId, isModal, selectedDate]);

  useEffect(() => {
    console.log("Current provider state:", provider);
  }, [provider]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    console.log("Checking saved status:", {
      savedProviders,
      currentProvider: provider,
      matches: savedProviders.map((p) => ({
        savedId: p._id,
        savedProviderId: p.providerId?._id,
        currentProviderId: provider?._id,
        isMatch: p.providerId?._id === provider?._id,
      })),
    });
  }, [savedProviders, provider]);

  useEffect(() => {
    const loadSavedProviders = async () => {
      if (user?.type === "client") {
        try {
          const res = await fetchSavedProviders();
          console.log("Fetched saved providers:", res);
          setSavedProviders(res);
        } catch (error) {
          console.log("Error loading saved providers:", error);
          setSavedProviders([]);
        }
      } else {
        setSavedProviders([]);
      }
    };

    loadSavedProviders();
  }, [user, provider, successMessage]);

  const handleSaveProvider = async () => {
    try {
      // First check if user is logged in and is a client
      if (!user) {
        console.log("No user logged in, redirecting to login");
        navigate("/login", {
          state: { from: location.pathname },
        });
        return;
      }

      if (user.type !== "client") {
        console.log("User is not a client");
        setError("Only clients can save providers");
        return;
      }

      // Determine which ID to use
      const idToSave = isModal ? provider?._id : providerId;

      console.log("Save provider attempt:", {
        userType: user.type,
        isModal,
        providerId,
        providerId_fromState: provider?._id,
        idToSave,
      });

      if (!idToSave) {
        console.error("No provider ID available for saving");
        setError("Unable to save provider: No ID available");
        return;
      }

      const result = await saveProvider(idToSave);
      console.log("Save provider result:", result);

      setSuccessMessage("Provider saved successfully");

      // Refresh saved providers list
      const updatedProviders = await fetchSavedProviders();
      setSavedProviders(updatedProviders);

      // Only navigate if in modal mode
      if (isModal && onClose) {
        onClose();
      }

      // Don't navigate to dashboard, let user stay on current page
      // navigate("/client/dashboard");
    } catch (err) {
      console.error("Save provider error:", err);
      if (err.response?.status === 401) {
        navigate("/login", {
          state: { from: location.pathname },
        });
        return;
      }
      setError(err.response?.data?.message || "Failed to save provider");
    }
  };

  // const handleBookAppointment = () => {
  //   if (!user) {
  //     navigate("/signin", {
  //       state: { from: `/book-appointment/${providerId || provider?._id}` },
  //     });
  //     return;
  //   }
  //   if (user.type === "provider") {
  //     return;
  //      }
  // };
  // providers can't book appointments
  const handleRemoveSavedProvider = async () => {
    try {
      const savedRelationship = savedProviders.find(
        (saved) => saved.providerId?._id === provider?._id
      );

      if (!savedRelationship) {
        console.error("Could not find saved relationship");
        return;
      }

      await removeSavedProvider(savedRelationship._id);

      // Immediately update local state
      setSavedProviders((prev) =>
        prev.filter((saved) => saved._id !== savedRelationship._id)
      );

      setSuccessMessage("Provider removed from favorites");

      if (isModal && onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Error removing saved provider:", err);
      setError("Failed to remove provider from favorites");
    }
  };

  const handleBookAppointment = () => {
    if (isModal) {
      onClose();
    }
    navigate(`/book-appointment/${providerId || provider?._id}`);
  };

  if (loading) {
    return (
      <div
        className={`${
          isModal ? "p-8" : "min-h-screen"
        } flex justify-center items-center bg-alice_blue-500`}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500"></div>
          <p className="mt-4 text-prussian_blue-400">
            Loading provider details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${theme.status.error} p-4 ${
          isModal ? "mx-4" : "max-w-2xl mx-auto"
        } mt-8 rounded-lg`}
      >
        {error}
      </div>
    );
  }

  const content = (
    <div
      className={`${
        isModal ? "divide-y divide-alice_blue-200" : "space-y-6 pt-28 pb-16"
      }`}
    >
      {successMessage && (
        <div
          className={`${theme.status.success} p-4 rounded-lg mb-4 transition-opacity duration-500`}
        >
          {successMessage}
        </div>
      )}

      {/* Provider Header */}
      <div className={`${isModal ? "pb-6" : `${theme.card.default} p-6 mb-6`}`}>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0">
            {provider?.profileImage ? (
              <img
                src={provider.profileImage}
                alt={`${provider.firstName} ${provider.lastName}`}
                className="w-24 h-24 rounded-xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-celestial_blue-100 flex items-center justify-center">
                <span className="text-3xl text-celestial_blue-500 font-semibold">
                  {provider?.firstName[0]}
                  {provider?.lastName[0]}
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow space-y-4">
            <div>
              <h1 className={`${theme.text.heading} text-2xl mb-2`}>
                Dr. {provider?.firstName} {provider?.lastName}
              </h1>
              <p className="text-prussian_blue-400 mb-2">{provider?.title}</p>
              <p className="text-prussian_blue-400">{provider?.location}</p>

              {provider?.acceptingClients && (
                <span className={`${theme.badges.verified} mt-2 inline-block`}>
                  Accepting New Clients
                </span>
              )}
            </div>

            {user?.type === "client" && (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleBookAppointment}
                  className={`${theme.button.primary} px-6 py-2 rounded-lg hover:-translate-y-0.5 hover:shadow-md `}
                >
                  Book Appointment
                </button>
                {(() => {
                  // Log the current data
                  console.log("Checking saved state:", {
                    savedProviders: savedProviders,
                    currentProvider: provider,
                  });

                  const isProviderSaved = savedProviders.some((saved) => {
                    // Log each comparison
                    console.log("Comparing IDs:", {
                      savedProviderId: saved.providerId?._id,
                      currentProviderId: provider?._id,
                      isMatch: saved.providerId?._id === provider?._id,
                    });
                    return saved.providerId?._id === provider?._id;
                  });

                  console.log("Is provider saved:", isProviderSaved);

                  return isProviderSaved ? (
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={handleRemoveSavedProvider}
                        className={`${theme.button} text-white bg-sunglow-400 hover:bg-amber-500 hover:-translate-y-0.5 hover:shadow-md rounded-lg px-6 py-2 duration-200 `}
                      >
                        Favorited ☆
                      </button>
                      <button
                        className={`${theme.button} text-white bg-celadon-300 hover:bg-celadon-400 hover:-translate-y-0.5 hover:shadow-md rounded-lg px-6 py-2 duration-200`}
                      >
                        Message
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={handleSaveProvider}
                        className={`${theme.button.primary} hover:-translate-y-0.5 bg-sunglow-400 hover:shadow-md hover:bg-sunglow-500 text- px-6 py-2 rounded-lg`}
                      >
                        Save Provider
                      </button>
                      <button
                        className={`${theme.button} text-white bg-celadon-300 hover:bg-celadon-400 hover:-translate-y-0.5 hover:shadow-md rounded-lg px-6 py-2 duration-200`}
                      >
                        Message
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className={`${isModal ? "py-6" : `${theme.card.default} p-6`}`}>
        <h3 className={`${theme.text.heading} text-xl mb-4`}>About</h3>
        <p className="text-prussian_blue-400 leading-relaxed">
          {provider?.bio}
        </p>
      </div>

      {/* Specialties Section */}
      <div className={`${isModal ? "py-6" : `${theme.card.default} p-6`}`}>
        <h3 className={`${theme.text.heading} text-xl mb-4`}>Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {provider?.specialties?.map((specialty) => (
            <span
              key={specialty}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Insurance Section */}
      <div className={`${isModal ? "py-6" : `${theme.card.default} p-6`}`}>
        <h3 className={`${theme.text.heading} text-xl mb-4`}>Insurance</h3>
        <div className="flex flex-wrap gap-2">
          {provider?.insuranceAccepted.map((insurance) => (
            <span
              key={insurance}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              {insurance}
            </span>
          ))}
        </div>
      </div>

      {/* Session Types Section */}
      <div className={`${isModal ? "py-6" : `${theme.card.default} p-6`}`}>
        <h3 className={`${theme.text.heading} text-xl mb-4`}>Session Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {provider?.sessionTypes.map((type) => (
            <div
              key={type}
              className="flex items-center gap-3 bg-alice_blue-50 p-3 rounded-lg"
            >
              <span className="text-celestial_blue-500">
                {type === "Video" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {type === "In-Person" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
                {type === "Phone" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                )}
              </span>
              <span className="text-prussian_blue-400">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 bg-prussian_blue-500/75 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-prussian_blue-400 hover:text-prussian_blue-500 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{content}</div>
  );
};
