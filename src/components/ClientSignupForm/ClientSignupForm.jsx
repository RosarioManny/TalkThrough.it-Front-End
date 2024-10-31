import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupClient } from "../../services/authService";
import Multiselect from "multiselect-react-dropdown";

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
  { name: "Other" },
];

export const ClientSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    passwordConf: "",
    location: "",
    insuranceProvider: [],
    therapyGoals: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      "email",
      "firstName",
      "lastName",
      "location",
      "therapyGoals",
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
        ...formData,
        insuranceProvider: formData.insuranceProvider
          .map((item) => item.name)
          .join(", "),
      };

      await signupClient(submissionData);
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-prussian_blue-500">
            Create Your Account
          </h1>
          <p className="mt-2 text-prussian_blue-400">
            Join TalkThrough.it to connect with mental health professionals
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
            {/* Personal Information Section */}
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
                  Personal Information
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

                {/* Account Information Section */}
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
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold text-prussian_blue-500">
                      Account Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Email */}
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
                            placeholder="Create a password"
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

                {/* Insurance & Location Section */}
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold text-prussian_blue-500">
                      Insurance & Location
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                        Your Location
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
                        This helps us find providers in your area
                      </p>
                    </div>

                    {/* Insurance Provider */}
                    <div>
                      <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                        Insurance Provider
                      </label>
                      <Multiselect
                        options={insuranceOptions}
                        selectedValues={formData.insuranceProvider}
                        onSelect={(selectedList) =>
                          setFormData({
                            ...formData,
                            insuranceProvider: selectedList,
                          })
                        }
                        onRemove={(selectedList) =>
                          setFormData({
                            ...formData,
                            insuranceProvider: selectedList,
                          })
                        }
                        displayValue="name"
                        placeholder="Select your insurance provider"
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
                      <p className="mt-1.5 text-sm text-prussian_blue-400">
                        Select all insurance providers you have
                      </p>
                    </div>
                  </div>
                </section>
                {/* Therapy Goals Section */}
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold text-prussian_blue-500">
                      Therapy Goals
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-prussian_blue-500 mb-2">
                        What are your therapy goals?
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
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <textarea
                          name="therapyGoals"
                          value={formData.therapyGoals}
                          onChange={handleChange}
                          rows="4"
                          className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200 resize-none"
                          placeholder="Tell us about what you hope to achieve through therapy..."
                          required
                        />
                      </div>
                      <p className="mt-1.5 text-sm text-prussian_blue-400">
                        This helps us match you with providers who can best
                        support your needs
                      </p>
                    </div>
                  </div>
                </section>

                {/* Submit Section */}
                <section className="mt-10">
                  <div className="bg-alice_blue-50 rounded-xl p-6 mb-6">
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
                          Privacy Note
                        </h4>
                        <p className="mt-1 text-sm text-prussian_blue-400">
                          Your information is protected and will only be shared
                          with healthcare providers you choose to connect with.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isLoading || success}
                      className={`
        flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white
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
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Registration Complete!
                        </>
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

                    <Link to="/" className="flex-1">
                      <button
                        type="button"
                        className="w-full bg-white text-prussian_blue-500 px-6 py-3 rounded-lg font-medium border border-alice_blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-prussian_blue-500/10 flex items-center justify-center gap-2"
                      >
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
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        <span>Cancel</span>
                      </button>
                    </Link>
                  </div>

                  <p className="mt-6 text-center text-sm text-prussian_blue-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-celestial_blue-500 hover:text-celestial_blue-600 font-medium"
                    >
                      Sign in here
                    </Link>
                  </p>
                </section>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};
