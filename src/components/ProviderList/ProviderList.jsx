import React, { useState, useEffect, useMemo, useCallback } from "react";
import { theme } from "../../styles/theme";
import { fetchProviders } from "../../services/providerService";
import { ProviderDetails } from "../ProviderDetails/ProviderDetails";
import { debounce } from "lodash";

// Filter Configuration Constants
const providerSearchFilters = {
  categories: {
    languages: {
      label: "Languages",
      icon: (
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
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
      options: [
        "English",
        "Spanish",
        "Mandarin",
        "French",
        "Arabic",
        "Korean",
        "Vietnamese",
        "Hindi",
        "Bengali",
        "Portuguese",
        "Russian",
        "Japanese",
        "Punjabi",
        "German",
        "Javanese",
        "Urdu",
        "Italian",
        "Thai",
        "Turkish",
        "Tamil",
        "Farsi",
        "Tagalog",
        "Other",
      ],
    },
    sessionTypes: {
      label: "Session Types",
      icon: (
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
      ),
      options: ["In-Person", "Video", "Phone"],
    },
    specialties: {
      label: "Specialties",
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      options: [
        "Anxiety",
        "Depression",
        "Trauma",
        "Relationships",
        "Stress",
        "Family",
        "Grief",
        "LGBTQ+",
        "Addiction",
        "Eating Disorders",
        "OCD",
        "PTSD",
        "Bipolar Disorder",
        "Life Transitions",
        "Career Counseling",
        "Chronic Illness",
        "Self-Esteem",
        "Sexual Abuse",
        "Anger Management",
        "Other",
      ],
    },
    insuranceProviders: {
      label: "Insurance",
      icon: (
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
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      ),
      options: [
        "Aetna",
        "United Health Care",
        "Blue Cross / Blue Shield",
        "Humana",
        "Fidelis Care",
        "Health Plus One",
        "Cigna",
        "Medicare",
        "Medicaid",
        "Guardian",
        "MetLife",
        "WellCare",
        "Tri-care",
        "AmeriGroup",
        "Anthem",
        "Beacon Health",
        "Community Health Choice",
        "HealthFirst",
        "Optum",
        "Out of pocket",
        "Other",
      ],
    },
  },
  // Helper functions
  getIcon: (filterType) => providerSearchFilters.categories[filterType]?.icon,
  getLabel: (filterType) => providerSearchFilters.categories[filterType]?.label,
  getOptions: (filterType) =>
    providerSearchFilters.categories[filterType]?.options || [],
};

// Provider Card Component
const ProviderCard = React.memo(({ provider, onClick }) => {
  if (!provider) {
    return null;
  }
  const initials =
    provider.firstName && provider.lastName
      ? `${provider.firstName[0]}${provider.lastName[0]}`
      : "";

  return (
    <div
      onClick={() => onClick(provider)}
      className="bg-white rounded-xl border border-alice_blue-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      <div className="p-6">
        {/* Provider Header */}
        <div className="flex items-start gap-4 mb-4">
          {provider.profileImage ? (
            <img
              src={provider.profileImage}
              alt={`${provider.firstName || ""} ${provider.lastName || ""}`}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-celestial_blue-100 flex items-center justify-center">
              <span className="text-2xl font-medium text-celestial_blue-500">
                {initials}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-prussian_blue-500 group-hover:text-celestial_blue-500 transition-colors duration-300">
                  {provider.firstName &&
                    provider.lastName &&
                    `Dr. ${provider.firstName} ${provider.lastName}`}
                </h2>
                <p className="text-sm text-prussian_blue-400">
                  {provider.title}
                </p>
              </div>
              {provider.acceptingClients && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-celadon-100 text-celadon-800">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Accepting Clients
                </span>
              )}
            </div>
            {provider.location && (
              <div className="flex items-center gap-1 mt-1 text-sm text-prussian_blue-400">
                <svg
                  className="w-4 h-4"
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
                </svg>
                <span>{provider.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Specialties Tags */}
        {provider.specialties && provider.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {provider.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={`${specialty}-${index}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-celestial_blue-50 text-celestial_blue-500"
              >
                {specialty}
              </span>
            ))}
            {provider.specialties.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-alice_blue-100 text-alice_blue-500">
                +{provider.specialties.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Insurance Tags */}
        {provider.insuranceAccepted &&
          provider.insuranceAccepted.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {provider.insuranceAccepted
                .slice(0, 2)
                .map((insurance, index) => (
                  <span
                    key={`${insurance}-${index}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-celadon-50 text-celadon-100"
                  >
                    {insurance}
                  </span>
                ))}
              {provider.insuranceAccepted.length > 2 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-alice_blue-100 text-alice_blue-500">
                  +{provider.insuranceAccepted.length - 2} more
                </span>
              )}
            </div>
          )}

        {/* Session Types */}
        {provider.sessionTypes && provider.sessionTypes.length > 0 && (
          <div className="flex gap-4 mb-4">
            {provider.sessionTypes.map((type, index) => (
              <div
                key={`${type}-${index}`}
                className="flex items-center text-sm text-prussian_blue-400"
              >
                {/* ... rest of the session type code ... */}
              </div>
            ))}
          </div>
        )}

        {/* Bio */}
        {provider.bio && (
          <p className="text-sm text-prussian_blue-400 line-clamp-2">
            {provider.bio}
          </p>
        )}

        {/* View Profile Button */}
        <div className="mt-4 pt-4 border-t border-alice_blue-200">
          <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-celestial_blue-500 hover:text-celestial_blue-600 transition-colors duration-300">
            View Full Profile
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

// Pagination Component
const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
  // Helper to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-12 flex flex-col items-center space-y-4">
      <div className="flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-300 
            ${
              currentPage === 1
                ? "bg-alice_blue-100 text-alice_blue-500 cursor-not-allowed"
                : "bg-white text-alice_blue-100 border border-alice_blue-200 hover:-translate-y-0.5 hover:shadow-md"
            }
          `}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="w-10 text-center text-prussian_blue-400"
              >
                •••
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium
                  transition-all duration-300 
                  ${
                    currentPage === page
                      ? "bg-celestial_blue-500 text-white shadow-md"
                      : "bg-white text-prussian_blue-500 border border-alice_blue-200 hover:-translate-y-0.5 hover:shadow-md"
                  }
                `}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-300 
            ${
              currentPage === totalPages
                ? "bg-alice_blue-100 text-alice_blue-500 cursor-not-allowed"
                : "bg-white text-prussian_blue-500 border border-alice_blue-200 hover:-translate-y-0.5 hover:shadow-md"
            }
          `}
        >
          Next
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Page Info */}
      <div className="text-sm text-prussian_blue-400">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
});

export const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    specialties: "",
    insuranceAccepted: "",
    languages: "",
    sessionTypes: "",
  });
  const [inputValue, setInputValue] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9,
  });
  // Memoized filter function
  const filteredProviders = useMemo(() => {
    return Array.isArray(providers) ? providers : [];
  }, [providers]);

  // fix keystroke
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      setFilters((prev) => ({ ...prev, search: value }));
    }, 300),
    []
  );
  // Memoized paginated providers
  const paginatedProviders = useMemo(() => {
    if (!Array.isArray(filteredProviders)) {
      return [];
    }
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return filteredProviders.slice(
      startIndex,
      startIndex + pagination.itemsPerPage
    );
  }, [filteredProviders, pagination.currentPage, pagination.itemsPerPage]);

  console.log("Current state:", {
    loading,
    providers,
    error,
    filteredProviders,
    paginatedProviders,
  });

  // Callback functions
  const handlePageChange = useCallback((newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    const filterMapping = {
      specialties: "specialties",
      insuranceProviders: "insurance",
      languages: "languages",
      sessionTypes: "sessionType",
      location: "location",
    };

    console.log("Filter type:", filterType, "Value:", value); // Debug log
    const backendFilterName = filterMapping[filterType];
    console.log("Mapped to:", backendFilterName); // Debug log

    if (backendFilterName) {
      setFilters((prev) => ({ ...prev, [backendFilterName]: value }));
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, []);

  const handleSearch = () => {
    console.log("Handling search with value:", inputValue);
    setSearchTerm(inputValue);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };
  const clearSearch = () => {
    console.log("Clearing search");
    setInputValue("");
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Load providers
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true);
        const params = {
          search: searchTerm,
          specialty: filters.specialties,
          insurance: filters.insurance,
          languages: filters.languages,
          sessionType: filters.sessionTypes,
          location: filters.location,
        };

        console.log("Filters:", filters); // Debug log
        console.log("Params being sent:", params); // Debug log

        // remove empty params
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key];
        });

        const data = await fetchProviders(params);
        setProviders(data);
        setPagination((prev) => ({
          ...prev,
          totalPages: Math.ceil(data.length / prev.itemsPerPage),
          totalItems: data.length,
        }));
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("Failed to load providers");
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [filters, searchTerm, pagination.currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${theme.status.error} p-4 max-w-2xl mx-auto mt-8 rounded-lg`}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-28 pb-16">
      <h1 className={`${theme.text.heading} text-3xl mb-8`}>
        Find Your Provider
      </h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
        {/* Search Bar */}
        <div className="p-6 border-b border-alice_blue-200">
          <div className="relative flex gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-prussian_blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, title, or location..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full pl-12 pr-4 py-3 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
              />
              {inputValue && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-prussian_blue-400 hover:text-celestial_blue-500 transition-colors duration-200"
                >
                  <svg
                    className="h-5 w-5"
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
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-celestial_blue-500 text-white rounded-lg hover:bg-celestial_blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              Search
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.keys(providerSearchFilters.categories).map((filterType) => (
              <div key={filterType} className="relative">
                <label className="block text-sm font-medium text-prussian_blue-500 mb-2 flex items-center gap-2">
                  {providerSearchFilters.getIcon(filterType)}
                  {providerSearchFilters.getLabel(filterType)}
                </label>
                <div className="relative">
                  <select
                    value={
                      filters[
                        filterType === "insuranceProviders"
                          ? "insurance"
                          : filterType
                      ]
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        filterType === "insuranceProviders"
                          ? "insuranceProviders"
                          : filterType,
                        e.target.value
                      )
                    }
                    className="block w-full pl-4 pr-10 py-2.5 bg-white border border-alice_blue-200 rounded-lg 
                     appearance-none focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 
                     transition-colors duration-200 text-prussian_blue-500 hover:border-celestial_blue-300"
                  >
                    <option value="">
                      All {providerSearchFilters.getLabel(filterType)}
                    </option>
                    {providerSearchFilters
                      .getOptions(filterType)
                      .map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-prussian_blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Filters */}
          {Object.entries(filters).some(([_, value]) => value) && (
            <div className="flex flex-wrap items-center gap-2 pb-4">
              <span className="text-sm font-medium text-prussian_blue-400">
                Active Filters:
              </span>
              {Object.entries(filters).map(([key, value]) =>
                value ? (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                bg-celestial_blue-50 text-celestial_blue-500 border border-celestial_blue-200"
                  >
                    {value}
                    <button
                      onClick={() => handleFilterChange(key, "")}
                      className="hover:text-celestial_blue-700 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
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
                  </span>
                ) : null
              )}
              <button
                onClick={() => {
                  setFilters({
                    location: "",
                    specialty: "",
                    insurance: "",
                    languages: "",
                    sessionType: "",
                  });
                  setInputValue("");
                  setSearchTerm("");
                }}
                className="text-sm text-prussian_blue-400 hover:text-celestial_blue-500 transition-colors duration-200"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-prussian_blue-400">
              Found {filteredProviders.length} providers
              {Object.values(filters).some((value) => value) &&
                " matching your criteria"}
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-prussian_blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-celestial_blue-500"></div>
                Updating results...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProviders.map((provider) => (
          <ProviderCard
            key={provider._id}
            provider={provider}
            onClick={() => setSelectedProvider(provider)}
          />
        ))}
      </div>
      {/* Pagination */}
      {filteredProviders.length > pagination.itemsPerPage && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal */}
      {selectedProvider && (
    <ProviderDetails
        isModal={true}
        modalProvider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
    />
)}

      {filteredProviders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 mb-6 rounded-full bg-alice_blue-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-celestial_blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-prussian_blue-500 mb-2">
            No providers found
          </h3>
          <p className="text-prussian_blue-400 text-center mb-6 max-w-md">
            Try adjusting your filters or search terms to find more providers.
          </p>
          <button
            onClick={() => {
              setFilters({
                location: "",
                specialty: "",
                insurance: "",
                language: "",
                gender: "",
                sessionType: "",
              });
              setSearchTerm("");
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-celestial_blue-500 hover:text-celestial_blue-600 transition-colors duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
