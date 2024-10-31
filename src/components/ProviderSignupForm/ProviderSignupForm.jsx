import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupProvider } from "../../services/authService";
import Multiselect from "multiselect-react-dropdown";

const providerFilters = {
  languages: [
    { name: "English" },
    { name: "Spanish" },
    { name: "Mandarin" },
    { name: "French" },
    { name: "Arabic" },
    { name: "Korean" },
    { name: "Vietnamese" },
    { name: "Hindi" },
    { name: "Bengali" },
    { name: "Portuguese" },
    { name: "Russian" },
    { name: "Japanese" },
    { name: "Punjabi" },
    { name: "German" },
    { name: "Javanese" },
    { name: "Urdu" },
    { name: "Italian" },
    { name: "Thai" },
    { name: "Turkish" },
    { name: "Tamil" },
    { name: "Farsi" },
    { name: "Tagalog" },
    { name: "Other" },
  ],
  specialties: [
    { name: "Anxiety" },
    { name: "Depression" },
    { name: "Trauma" },
    { name: "Relationships" },
    { name: "Stress" },
    { name: "Family" },
    { name: "Grief" },
    { name: "LGBTQ+" },
    { name: "Addiction" },
    { name: "Eating Disorders" },
    { name: "OCD" },
    { name: "PTSD" },
    { name: "Bipolar Disorder" },
    { name: "Life Transitions" },
    { name: "Career Counseling" },
    { name: "Chronic Illness" },
    { name: "Self-Esteem" },
    { name: "Sexual Abuse" },
    { name: "Anger Management" },
    { name: "Other" },
  ],
  insuranceProviders: [
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
    { name: "Other" },
  ],
  sessionTypes: [{ name: "In-Person" }, { name: "Video" }, { name: "Phone" }],
};

export const ProviderSignupForm = () => {
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
    acceptingClients: true,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
      "email",
      "firstName",
      "lastName",
      "credentials",
      "bio",
      "location",
      "licensureState",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
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
        insuranceAccepted: formData.insuranceAccepted.map((item) => item.name),
        specialties: formData.specialties.map((item) => item.name),
        yearsOfExperience: Number(formData.yearsOfExperience),
        languages: formData.languages.map((item) => item.name),
        licensureState: formData.licensureState.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        sessionTypes: formData.sessionTypes.map((item) => item.name),
        acceptingClients: formData.acceptingClients,
      };

      const response = await signupProvider(submissionData);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-alice_blue-500 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-prussian_blue-500">
            Provider Registration
          </h1>
          <p className="mt-2 text-prussian_blue-400">
            Join our network of mental health professionals
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-celadon-50 border-l-4 border-celadon-500 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-celadon-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-celadon-700">
                Registration successful! Redirecting to login page...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-sunglow-50 border-l-4 border-sunglow-500 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-sunglow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sunglow-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Sections */}
            <div className="space-y-8">
              {/* Basic Information Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-alice_blue-200">
                  <svg
                    className="w-5 h-5 text-celestial_blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <h2 className="text-xl font-semibold text-prussian_blue-500">
                    Basic Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <input
                          type="password"
                          name="passwordConf"
                          value={formData.passwordConf}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Professional Information Section */}
              <section className="mt-10">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-alice_blue-200">
                  <svg
                    className="w-5 h-5 text-celestial_blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h2 className="text-xl font-semibold text-prussian_blue-500">
                    Professional Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Credentials */}
                  <div>
                    <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                      Professional Credentials
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="credentials"
                        value={formData.credentials}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                        placeholder="e.g., PhD, LMFT, LCSW"
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-prussian_blue-400">
                      Enter your professional titles and certifications
                    </p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                      Professional Bio
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
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
                            d="M4 6h16M4 12h16M4 18h7"
                          />
                        </svg>
                      </div>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200 resize-none"
                        placeholder="Tell us about your experience, approach, and areas of expertise..."
                        required
                      ></textarea>
                      <p className="mt-1.5 text-sm text-prussian_blue-400">
                        Write a brief description of your professional
                        background and therapeutic approach
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                      Practice Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                        placeholder="City, State"
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-prussian_blue-400">
                      Enter your primary practice location
                    </p>
                  </div>

                  {/* Experience Years */}
                  <div>
                    <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                        placeholder="Enter years of experience"
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-prussian_blue-400">
                      Total years of professional practice
                    </p>
                  </div>
                </div>
              </section>

              {/* Specialties & Insurance Section */}
              <section className="mt-10">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-alice_blue-200">
                  <svg
                    className="w-5 h-5 text-celestial_blue-500"
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
                  <h2 className="text-xl font-semibold text-prussian_blue-500">
                    Specialties & Services
                  </h2>
                </div>

                <div className="space-y-8">
                  {/* Specialties Multiselect */}
                  <div>
                    <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                      Areas of Specialty
                    </label>
                    <div className="relative">
                      <Multiselect
                        options={providerFilters.specialties}
                        selectedValues={formData.specialties}
                        onSelect={(selectedList) =>
                          setFormData({
                            ...formData,
                            specialties: selectedList,
                          })
                        }
                        onRemove={(selectedList) =>
                          setFormData({
                            ...formData,
                            specialties: selectedList,
                          })
                        }
                        displayValue="name"
                        placeholder="Select your areas of specialty"
                        showCheckbox={true}
                        style={{
                          chips: {
                            background: "#1b98e0",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            margin: "2px",
                          },
                          searchBox: {
                            border: "1px solid #f4faff",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            minHeight: "45px",
                          },
                          optionContainer: {
                            borderRadius: "8px",
                            marginTop: "4px",
                            border: "1px solid #f4faff",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          },
                          option: {
                            padding: "8px 12px",
                            color: "#13293d",
                          },
                        }}
                        className="rounded-lg"
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-prussian_blue-400">
                      Select all areas in which you specialize
                    </p>
                  </div>

                  {/* Insurance Providers Multiselect */}
                  <div>
                    <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                      Insurance Providers Accepted
                    </label>
                    <div className="relative">
                      <Multiselect
                        options={providerFilters.insuranceProviders}
                        selectedValues={formData.insuranceAccepted}
                        onSelect={(selectedList) =>
                          setFormData({
                            ...formData,
                            insuranceAccepted: selectedList,
                          })
                        }
                        onRemove={(selectedList) =>
                          setFormData({
                            ...formData,
                            insuranceAccepted: selectedList,
                          })
                        }
                        displayValue="name"
                        placeholder="Select accepted insurance providers"
                        showCheckbox={true}
                        style={{
                          chips: {
                            background: "#1b98e0",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            margin: "2px",
                          },
                          searchBox: {
                            border: "1px solid #f4faff",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            minHeight: "45px",
                          },
                          optionContainer: {
                            borderRadius: "8px",
                            marginTop: "4px",
                            border: "1px solid #f4faff",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          },
                          option: {
                            padding: "8px 12px",
                            color: "#13293d",
                          },
                        }}
                        className="rounded-lg"
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-prussian_blue-400">
                      Select all insurance providers you accept
                    </p>
                  </div>

                  {/* Languages Multiselect */}
                  <div>
                    <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                      Languages Spoken
                    </label>
                    <div className="relative">
                      <Multiselect
                        options={providerFilters.languages}
                        selectedValues={formData.languages}
                        onSelect={(selectedList) =>
                          setFormData({ ...formData, languages: selectedList })
                        }
                        onRemove={(selectedList) =>
                          setFormData({ ...formData, languages: selectedList })
                        }
                        displayValue="name"
                        placeholder="Select languages you speak"
                        showCheckbox={true}
                        style={{
                          chips: {
                            background: "#1b98e0",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            margin: "2px",
                          },
                          searchBox: {
                            border: "1px solid #f4faff",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            minHeight: "45px",
                          },
                          optionContainer: {
                            borderRadius: "8px",
                            marginTop: "4px",
                            border: "1px solid #f4faff",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          },
                          option: {
                            padding: "8px 12px",
                            color: "#13293d",
                          },
                        }}
                        className="rounded-lg"
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-prussian_blue-400">
                      Select all languages you are fluent in
                    </p>
                  </div>

                  {/* Session Types Multiselect */}
                  <div>
                    <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                      Session Types Offered
                    </label>
                    <div className="relative">
                      <Multiselect
                        options={providerFilters.sessionTypes}
                        selectedValues={formData.sessionTypes}
                        onSelect={(selectedList) =>
                          setFormData({
                            ...formData,
                            sessionTypes: selectedList,
                          })
                        }
                        onRemove={(selectedList) =>
                          setFormData({
                            ...formData,
                            sessionTypes: selectedList,
                          })
                        }
                        displayValue="name"
                        placeholder="Select session types you offer"
                        showCheckbox={true}
                        style={{
                          chips: {
                            background: "#1b98e0",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            margin: "2px",
                          },
                          searchBox: {
                            border: "1px solid #f4faff",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            minHeight: "45px",
                          },
                          optionContainer: {
                            borderRadius: "8px",
                            marginTop: "4px",
                            border: "1px solid #f4faff",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          },
                          option: {
                            padding: "8px 12px",
                            color: "#13293d",
                          },
                        }}
                        className="rounded-lg"
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-prussian_blue-400">
                      Select all session types you provide
                    </p>
                  </div>
                </div>
              </section>

              {/* Credentials & Licensing Section */}
              <section className="mt-10">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-alice_blue-200">
                  <svg
                    className="w-5 h-5 text-celestial_blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <h2 className="text-xl font-semibold text-prussian_blue-500">
                    Credentials & Licensing
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Licensure State & Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                        Licensure State
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="licensureState"
                          value={formData.licensureState}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                          placeholder="e.g., California"
                          required
                        />
                      </div>
                      <p className="mt-1.5 text-sm text-prussian_blue-400">
                        State where you are licensed to practice
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                        License Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                          placeholder="Enter your license number"
                          required
                        />
                      </div>
                      <p className="mt-1.5 text-sm text-prussian_blue-400">
                        Your professional license number
                      </p>
                    </div>
                  </div>

                  {/* Accepting Clients Toggle */}
                  <div className="bg-alice_blue-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-prussian_blue-500">
                          Currently Accepting Clients
                        </label>
                        <p className="mt-1 text-sm text-prussian_blue-400">
                          Toggle this if you're currently accepting new clients
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleChange({
                              target: {
                                name: "acceptingClients",
                                type: "checkbox",
                                checked: !formData.acceptingClients,
                              },
                            })
                          }
                          className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
              transition-colors duration-200 ease-in-out focus:outline-none
              ${formData.acceptingClients ? "bg-celadon-400" : "bg-red-300"}
            `}
                          role="switch"
                          aria-checked={formData.acceptingClients}
                        >
                          <span
                            className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                transition duration-200 ease-in-out
                ${formData.acceptingClients ? "translate-x-5" : "translate-x-0"}
              `}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Professional Commitment Notice */}
                  <div className="bg-alice_blue-50 rounded-xl p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-celestial_blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-prussian_blue-500">
                          Professional Commitment
                        </h4>
                        <p className="mt-1 text-sm text-prussian_blue-400">
                          By submitting this form, you confirm that all provided
                          information is accurate and that you maintain current
                          professional licensing and insurance as required by
                          your state of practice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || success}
                className={`
                  w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                  ${
                    isLoading || success
                      ? "bg-prussian_blue-300 cursor-not-allowed"
                      : "bg-celestial_blue-500 hover:shadow-celestial_blue-500/20"
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : success ? (
                  "Registration Complete!"
                ) : (
                  <>
                    <span>Create Account</span>
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
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
