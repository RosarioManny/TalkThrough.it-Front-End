import React, { useState, useEffect, useMemo, useCallback } from "react";
import { theme } from '../../styles/theme';
import { fetchProviders } from "../../services/providerService";
import ProviderDetails from "../ProviderDetails/ProviderDetails";

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
        "Aetna", "United Health Care", "Blue Cross / Blue Shield", "Humana",
        "Fidelis Care", "Health Plus One", "Cigna", "Medicare", "Medicaid",
        "Guardian", "MetLife", "WellCare", "Tri-care", "AmeriGroup",
        "Anthem", "Beacon Health", "Community Health Choice", "HealthFirst",
        "Optum", "Out of pocket", "Other"
    ],
    filterLabels: {
        specialty: "Specialties",
        insurance: "Insurance",
        language: "Languages",
        sessionType: "Session Types",
        gender: "Gender",
    }
};

// Separate Provider Card Component
const ProviderCard = React.memo(({ provider, onClick }) => (
    <div 
        onClick={() => onClick(provider)}
        className={`${theme.card.default} ${theme.card.hover} cursor-pointer`}
    >
        <div className="p-6">
            <div className="flex items-center mb-4">
                {provider.profileImage ? (
                    <img
                        src={provider.profileImage}
                        alt={`${provider.firstName} ${provider.lastName}`}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-celestial_blue-100 mr-4 flex items-center justify-center">
                        <span className="text-2xl text-celestial_blue-500">
                            {provider.firstName[0]}{provider.lastName[0]}
                        </span>
                    </div>
                )}
                <div>
                    <h2 className={`${theme.text.heading} text-xl`}>
                        {provider.firstName} {provider.lastName}
                    </h2>
                    <p className="text-prussian_blue-400">{provider.title}</p>
                    <p className="text-prussian_blue-400">{provider.location}</p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                    {provider.specialties?.slice(0, 3).map((specialty, index) => (
                        <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                            {specialty}
                        </span>
                    ))}
                    {provider.specialties?.length > 3 && (
                        <span className="text-prussian_blue-300 text-xs">
                            +{provider.specialties.length - 3} more
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-1">
                    {provider.insuranceAccepted?.slice(0, 2).map((insurance, index) => (
                        <span 
                            key={index} 
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                            {insurance}
                        </span>
                    ))}
                    {provider.insuranceAccepted?.length > 2 && (
                        <span className="text-prussian_blue-300 text-xs">
                            +{provider.insuranceAccepted.length - 2} more
                        </span>
                    )}
                </div>
                <p className="text-prussian_blue-400 text-sm line-clamp-2 mt-2">
                    {provider.bio}
                </p>
                {provider.acceptingClients && (
                    <span className={theme.badges.verified}>
                        Accepting New Clients
                    </span>
                )}
            </div>
        </div>
    </div>
));

// Separate Pagination Component
const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center space-x-2 mt-8">
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${theme.button.outline} px-4 py-2 rounded-lg disabled:opacity-50 text-white bg-celestial_blue-500 hover:bg-celestial_blue-600 transition-colors`}
        >
            Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page 
                        ? theme.button.primary 
                        : 'text-white bg-celestial_blue-500 hover:bg-celestial_blue-600'
                }`}
            >
                {page}
            </button>
        ))}
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${theme.button.outline} px-4 py-2 rounded-lg disabled:opacity-50 text-white bg-celestial_blue-500 hover:bg-celestial_blue-600 transition-colors`}
        >
            Next
        </button>
    </div>
));


const ProviderList = () => {
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
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
                provider.location,
                provider.title
            ].map(field => field?.toLowerCase());
            
            const searchMatch = !searchTerm || 
                searchFields.some(field => field?.includes(searchTerm.toLowerCase()));

            const filterMatches = Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                
                switch(key) {
                    case 'location':
                        return provider.location?.toLowerCase().includes(value.toLowerCase());
                    case 'specialty':
                        return provider.specialties?.some(s => s === value);
                    case 'insurance':
                        return provider.insuranceAccepted?.some(i => i === value);
                    case 'language':
                        return provider.languages?.some(l => l === value);
                    case 'gender':
                        return provider.gender === value;
                    case 'sessionType':
                        return provider.sessionTypes?.includes(value);
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500"></div>
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
        <div className="container mx-auto px-4 py-8">
            <h1 className={`${theme.text.heading} text-3xl mb-8`}>Find Your Provider</h1>

            {/* Search and Filter Section */}
            <div className={`${theme.card.default} mb-8 p-6`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Bar */}
                    <div className="lg:col-span-2">
                        <input
                            type="text"
                            placeholder="Search by name, title, or location..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full p-2 border border-alice_blue-300 rounded-lg focus:ring-2 focus:ring-celestial_blue-500"
                        />
                    </div>

                    {/* Filters */}
                    {Object.keys(providerSearchFilters.filterLabels).map((filterType) => (
                        <div key={filterType}>
                            <select
                                value={filters[filterType]}
                                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                                className="w-full p-2 border border-alice_blue-300 rounded-lg focus:ring-2 focus:ring-celestial_blue-500"
                            >
                                <option value="">
                                    {providerSearchFilters.filterLabels[filterType]}
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
                <div className="text-center py-8 text-prussian_blue-400">
                    No providers found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default ProviderList;
