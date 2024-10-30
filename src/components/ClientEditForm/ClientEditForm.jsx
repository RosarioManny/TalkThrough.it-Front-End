import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateClient, fetchClientProfile } from '../../services/dashboardService';
import { toast } from 'react-toastify';
import Multiselect from 'multiselect-react-dropdown';

const insuranceOptions = [
    { name: "Aetna" }, 
    { name: "United Health Care" }, 
    { name: "Blue Cross / Blue Shield" },
    { name: "Humana" }, 
    { name: "Fidelis Care" }, 
    { name: "Health Plus One" },
    { name: "Cigna" }, 
    { name: "Medicare" }, 
    { name: "Medicaid" }, 
    { name: "Guardian" },
    { name: "MetLife" }, 
    { name: "WellCare" }, 
    { name: "Tri-care" }, 
    { name: "AmeriGroup" },
    { name: "Anthem" }, 
    { name: "Beacon Health" }, 
    { name: "Community Health Choice" },
    { name: "HealthFirst" }, 
    { name: "Optum" }, 
    { name: "Out of pocket" }, 
    { name: "Other" }
];

const ClientEditForm = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        location: '',
        insuranceProvider: [],
        therapyGoals: '',
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadClientProfile = async () => {
            try {
                const profile = await fetchClientProfile();
                // Convert insurance string back to array of objects for Multiselect
                const insuranceProviders = profile.insuranceProvider.split(', ')
                    .map(name => ({ name }));
                
                setFormData({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    location: profile.location,
                    insuranceProvider: insuranceProviders,
                    therapyGoals: profile.therapyGoals,
                });
            } catch (err) {
                toast.error('Failed to load profile');
                navigate('/client/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        loadClientProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const submissionData = {
                ...formData,
                insuranceProvider: formData.insuranceProvider.map(item => item.name).join(', ')
            };

            await updateClient(submissionData);
            toast.success('Profile updated successfully');
            navigate('/client/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
                    <Multiselect
                        options={insuranceOptions}
                        selectedValues={formData.insuranceProvider}
                        onSelect={(selectedList) => setFormData({ ...formData, insuranceProvider: selectedList })}
                        onRemove={(selectedList) => setFormData({ ...formData, insuranceProvider: selectedList })}
                        displayValue="name"
                        placeholder="Select insurance providers"
                        showCheckbox={true}
                        className="rounded-md"
                        customClasses={{
                            searchBox: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm",
                            inputField: "text-gray-900 placeholder-gray-500",
                            chips: "bg-blue-600 text-white px-2 py-1 rounded-md",
                            optionContainer: "bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto",
                            option: "px-4 py-2 text-gray-900 hover:bg-gray-100 cursor-pointer"
                        }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Therapy Goals</label>
                    <textarea
                        name="therapyGoals"
                        value={formData.therapyGoals}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows="4"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                    >
                        {isLoading ? 'Updating...' : 'Save Changes'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => navigate('/client/dashboard')}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
export default ClientEditForm