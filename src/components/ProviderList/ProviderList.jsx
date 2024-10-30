import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchProviders } from "../../services/providerService";

// Separate Provider Card Component
const ProviderCard = React.memo(({ provider }) => (
    <Link to={`/providerlist/${provider._id}`} className="block">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
                {provider.profileImage ? (
                    <img
                        src={provider.profileImage}
                        alt={`${provider.firstName} ${provider.lastName}`}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                        <span className="text-2xl text-gray-600">
                            {provider.firstName[0]}{provider.lastName[0]}
                        </span>
                    </div>
                )}
                <div>
                    <h2 className="text-xl font-semibold">
                        {provider.firstName} {provider.lastName}
                    </h2>
                    <p className="text-gray-600">{provider.location}</p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                    {provider.specialties.map((specialty, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {specialty}
                        </span>
                    ))}
                </div>
                <div className="flex flex-wrap gap-1">
                    {provider.insuranceAccepted.map((insurance, index) => (
                        <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {insurance}
                        </span>
                    ))}
                </div>
                <div className="flex flex-wrap gap-1">
                    {provider.languages.map((language, index) => (
                        <span key={index} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {language}
                        </span>
                    ))}
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {provider.bio}
                </p>
            </div>
        </div>
    </Link>
));

// Separate Pagination Component
const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center space-x-2 mt-8">
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
            Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-lg border ${
                    currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-50"
                }`}
            >
                {page}
            </button>
        ))}
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
            Next
        </button>
    </div>
));

// Filter Configuration Constants
const providerSearchFilters = {
    languages: [
        "English", "Spanish", "Mandarin", "French", "Arabic", "Korean", 
        "Vietnamese", "Hindi", "Bengali", "Portuguese", "Russian", "Japanese", 
        "Punjabi", "German", "Javanese", "Urdu", "Italian", "Thai", 
        "Turkish", "Tamil", "Farsi", "Tagalog", "Other"
    ],
    sessionTypes: ["In-Person", "Video", "Phone"],
    genderOptions: ["Male", "Female", "Non-Binary", "Other"],
    specialties: [
        "Anxiety", "Depression", "Trauma", "Relationships", "Stress", 
        "Family", "Grief", "LGBTQ+", "Addiction", "Eating Disorders", 
        "OCD", "PTSD", "Bipolar Disorder", "Life Transitions", 
        "Career Counseling", "Chronic Illness", "Self-Esteem", 
        "Sexual Abuse", "Anger Management", "Other"
    ],
    insuranceProviders: [
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
        "Other"
    ],
    filterLabels: {
        specialty: "Specialties",
        insurance: "Insurance",
        language: "Languages",
        sessionType: "Session Types",
        gender: "Gender",
    }
};

const ProviderList = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        location: "",
        specialty: "",
        insurance: "",
        language: "",
        gender: "",
        sessionType: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 9,
    });

    // Memoized filter function
    const filteredProviders = useMemo(() => {
        return providers.filter(provider => {
            const searchFields = [
                provider.firstName,
                provider.lastName,
                provider.location
            ].map(field => field.toLowerCase());
            
            const searchMatch = !searchTerm || 
                searchFields.some(field => field.includes(searchTerm.toLowerCase()));

            const filterMatches = Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                
                switch(key) {
                    case 'location':
                        return provider.location.toLowerCase().includes(value.toLowerCase());
                    case 'specialty':
                        return provider.specialties.some(s => s === value);
                    case 'insurance':
                        return provider.insuranceAccepted.some(i => i === value);
                    case 'language':
                        return provider.languages.some(l => l === value);
                    case 'gender':
                        return provider.gender === value;
                    case 'sessionType':
                        return provider.sessionTypes.includes(value);
                    default:
                        return true;
                }
            });

            return searchMatch && filterMatches;
        });
    }, [providers, searchTerm, filters]);

    // Memoized paginated providers
    const paginatedProviders = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        return filteredProviders.slice(startIndex, startIndex + pagination.itemsPerPage);
    }, [filteredProviders, pagination.currentPage, pagination.itemsPerPage]);

    // Callback functions
    const handlePageChange = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    }, []);

    const handleFilterChange = useCallback((filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, []);

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, []);

    // Load providers
    useEffect(() => {
        const loadProviders = async () => {
            try {
                setLoading(true);
                const data = await fetchProviders();
                setProviders(data);
                setPagination(prev => ({
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
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Find Your Provider</h1>

            {/* Search and Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Bar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Filters */}
                    {Object.keys(providerSearchFilters.filterLabels).map((filterType) => (
                        <div key={filterType}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {providerSearchFilters.filterLabels[filterType]}
                            </label>
                            <select
                                value={filters[filterType]}
                                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">
                                    All {providerSearchFilters.filterLabels[filterType]}
                                </option>
                                {providerSearchFilters[
                                    filterType === 'specialty' ? 'specialties' :
                                    filterType === 'insurance' ? 'insuranceProviders' :
                                    filterType === 'language' ? 'languages' :
                                    filterType === 'sessionType' ? 'sessionTypes' :
                                    'genderOptions'
                                ].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Provider List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProviders.map((provider) => (
                    <ProviderCard key={provider._id} provider={provider} />
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

            {filteredProviders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No providers found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default ProviderList;
