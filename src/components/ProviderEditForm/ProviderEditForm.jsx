import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signupProvider } from "../../services/authService";
import Multiselect from 'multiselect-react-dropdown';
import { useAuth } from "../../context/AuthContext";
import { fetchProviderDetails } from "../../services/providerService";
import { updateProvider } from "../../services/providerService";

const providerFilters = {
    languages: [
        { name: "English" }, { name: "Spanish" }, { name: "Mandarin" }, { name: "French" }, 
        { name: "Arabic" }, { name: "Korean" }, { name: "Vietnamese" }, { name: "Hindi" }, 
        { name: "Bengali" }, { name: "Portuguese" }, { name: "Russian" }, { name: "Japanese" }, 
        { name: "Punjabi" }, { name: "German" }, { name: "Javanese" }, { name: "Urdu" }, 
        { name: "Italian" }, { name: "Thai" }, { name: "Turkish" }, { name: "Tamil" }, 
        { name: "Farsi" }, { name: "Tagalog" }, { name: "Other" }
    ],
    specialties: [
        { name: "Anxiety" }, { name: "Depression" }, { name: "Trauma" }, { name: "Relationships" }, 
        { name: "Stress" }, { name: "Family" }, { name: "Grief" }, { name: "LGBTQ+" }, 
        { name: "Addiction" }, { name: "Eating Disorders" }, { name: "OCD" }, { name: "PTSD" }, 
        { name: "Bipolar Disorder" }, { name: "Life Transitions" }, { name: "Career Counseling" }, 
        { name: "Chronic Illness" }, { name: "Self-Esteem" }, { name: "Sexual Abuse" }, 
        { name: "Anger Management" }, { name: "Other" }
    ],
    insuranceProviders: [
        { name: "Aetna" }, { name: "United Health Care" }, { name: "Blue Cross / Blue Shield" },
        { name: "Humana" }, { name: "Fidelis Care" }, { name: "Health Plus One" },
        { name: "Cigna" }, { name: "Medicare" }, { name: "Medicaid" }, { name: "Guardian" },
        { name: "MetLife" }, { name: "WellCare" }, { name: "Tri-care" }, { name: "AmeriGroup" },
        { name: "Anthem" }, { name: "Beacon Health" }, { name: "Community Health Choice" },
        { name: "HealthFirst" }, { name: "Optum" }, { name: "Out of pocket" }, { name: "Other" }
    ],
    sessionTypes: [
        { name: "In-Person" }, { name: "Video" }, { name: "Phone" }
    ]
};

const ProviderEditForm = () => {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordConf: "",
        firstName: "",
        lastName: "",
        credentials: "",
        bio: "",
        location: "",
        insuranceAccepted: [],
        specialties: [],
        yearsOfExperience: "",
        languages: [],
        licensureState: "",
        licenseNumber: "",
        sessionTypes: [],
        acceptingClients: true
    });

    //attempting to load provider here
    useEffect(() => {
        const loadProviderProfile = async () => {
            try {
                // console.log(user._id)
                const profile = await fetchProviderDetails(user._id);
                console.log(profile.provider)
                // Convert insurance string back to array of objects for Multiselect

                //TODO: insurance accepted, languages, specialties, and seession types are all arrays and need to be converted to work in our form autopopulate (example code below, not working)
                const insuranceAccepted = profile.provider.insuranceAccepted.map(name => ({ name }));

                const specialties = profile.provider.specialties.map(name => ({ name }));

                const languages = profile.provider.languages.map(name => ({ name }));

                const sessionTypes = profile.provider.sessionTypes.map(name => ({ name }));

                
                setFormData({
                    firstName: profile.provider.firstName,
                    lastName: profile.provider.lastName,
                    credentials: profile.provider.credentials,
                    bio: profile.provider.bio,
                    email: profile.provider.email,
                    password: "",
                    location: profile.provider.location,
                    insuranceAccepted: insuranceAccepted, 
                    specialties: specialties,
                    yearsOfExperience: profile.provider.yearsOfExperience,
                    languages: languages,
                    licensureState: profile.provider.licensureState,
                    licenseNumber: profile.provider.licenseNumber,
                    sessionTypes: sessionTypes,
                    acceptingClients: profile.provider.acceptingClients
                });
                // setFormData(profile.provider)
            } catch (err) {
                console.error('Failed to load profile');
                // navigate('/client/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        loadProviderProfile();
    }, [navigate]);


    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // console.log(formData)
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (formData.password !== formData.passwordConf) {
            errors.password = "Passwords do not match";
        }

        if (!formData.licenseNumber?.trim()) {
            errors.licenseNumber = "License number is required";
        }

        if (!formData.yearsOfExperience) {
            errors.yearsOfExperience = "Years of experience is required";
        }

        if (formData.insuranceAccepted.length === 0) {
            errors.insurance = "Please select at least one insurance provider";
        }

        if (formData.specialties.length === 0) {
            errors.specialties = "Please select at least one specialty";
        }

        if (formData.languages.length === 0) {
            errors.languages = "Please select at least one language";
        }

        if (formData.sessionTypes.length === 0) {
            errors.sessionTypes = "Please select at least one session type";
        }

        const requiredFields = [
            'email',
            'firstName',
            'lastName',
            'credentials',
            'bio',
            'location',
            'licensureState'
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
        setError("");

        try {
            const submissionData = {
                email: formData.email.trim(),
                password: formData.password,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                credentials: formData.credentials.trim(),
                bio: formData.bio.trim(),
                location: formData.location.trim(),
                insuranceAccepted: formData.insuranceAccepted.map(item => item.name),
                specialties: formData.specialties.map(item => item.name),
                yearsOfExperience: Number(formData.yearsOfExperience),
                languages: formData.languages.map(item => item.name),
                licensureState: formData.licensureState.trim(),
                licenseNumber: formData.licenseNumber.trim(),
                sessionTypes: formData.sessionTypes.map(item => item.name),
                acceptingClients: formData.acceptingClients
            };

            const response = await updateProvider(submissionData, user._id);
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
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

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                </div>
                
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

                {/* Professional Information Section */}
                <div className="border-b border-gray-200 pb-4 pt-4">
                    <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credentials</label>
                    <input
                        type="text"
                        name="credentials"
                        value={formData.credentials}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows="4"
                        required
                    ></textarea>
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

                {/* Specialties Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                    <Multiselect
                        options={providerFilters.specialties}
                        selectedValues={formData.specialties}
                        onSelect={(selectedList) => setFormData({ ...formData, specialties: selectedList })}
                        onRemove={(selectedList) => setFormData({ ...formData, specialties: selectedList })}
                        displayValue="name"
                        placeholder="Select specialties"
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

                {/* Insurance Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Accepted</label>
                    <Multiselect
                        options={providerFilters.insuranceProviders}
                        selectedValues={formData.insuranceAccepted}
                        onSelect={(selectedList) => setFormData({ ...formData, insuranceAccepted: selectedList })}
                        onRemove={(selectedList) => setFormData({ ...formData, insuranceAccepted: selectedList })}
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

                {/* Languages Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                    <Multiselect
                        options={providerFilters.languages}
                        selectedValues={formData.languages}
                        onSelect={(selectedList) => setFormData({ ...formData, languages: selectedList })}
                        onRemove={(selectedList) => setFormData({ ...formData, languages: selectedList })}
                        displayValue="name"
                        placeholder="Select languages"
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

                {/* Professional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                            min="0"
                            max="100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Licensure State</label>
                        <input
                            type="text"
                            name="licensureState"
                            value={formData.licensureState}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>

                {/* Session Types */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Types</label>
                    <Multiselect
                        options={providerFilters.sessionTypes}
                        selectedValues={formData.sessionTypes}
                        onSelect={(selectedList) => setFormData({ ...formData, sessionTypes: selectedList })}
                        onRemove={(selectedList) => setFormData({ ...formData, sessionTypes: selectedList })}
                        displayValue="name"
                        placeholder="Select session types"
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

                {/* Accepting Clients Checkbox */}
                <div>
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="acceptingClients"
                            checked={formData.acceptingClients}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Currently Accepting Clients</span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || success}
                    className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        transition-colors duration-150 ease-in-out
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
                    ) : success ? 'Registration Complete!' : 'Edit Provider Details'}
                </button>
            </form>
        </div>
    );
};

export default ProviderEditForm;

