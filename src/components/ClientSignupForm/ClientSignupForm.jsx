import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupClient } from '../../services/authService';
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

const ClientSignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordConf: '',
        location: '',
        insuranceProvider: [],
        therapyGoals: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (formData.password !== formData.passwordConf) {
            errors.password = "Passwords do not match";
        }

        if (formData.insuranceProvider.length === 0) {
            errors.insurance = "Please select at least one insurance provider";
        }

        const requiredFields = [
            'email',
            'firstName',
            'lastName',
            'location',
            'therapyGoals'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]?.trim()) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }
        });

        return Object.keys(errors).length === 0 ? null : errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (validationErrors) {
            setError(Object.values(validationErrors).join(", "));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const submissionData = {
                ...formData,
                insuranceProvider: formData.insuranceProvider.map(item => item.name).join(', ')
            };

            await signupClient(submissionData);
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
            {success && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Registration successful! Redirecting to login page...
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Registration</h2>

                {/* Basic Information */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="passwordConf"
                            value={formData.passwordConf}
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
                        disabled={isLoading || success}
                        className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${isLoading || success 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </div>
                        ) : success ? 'Registration Complete!' : 'Sign Up'}
                    </button>
                    
                    <Link 
                        to="/"
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ClientSignupForm;
