
// import React, { useState } from 'react';

// const FeedbackForm = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         message: ''
//     });

//     const [errors, setErrors] = useState({});
//     const [submitted, setSubmitted] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//         if (errors[name]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [name]: ''
//             }));
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.name.trim()) {
//             newErrors.name = 'Name is required';
//         }

//         if (!formData.email.trim()) {
//             newErrors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = 'Email is invalid';
//         }

//         if (!formData.message.trim()) {
//             newErrors.message = 'Message is required';
//         }

//         return newErrors;
//     };

//     const handleSubmit = () => {
//         const newErrors = validateForm();

//         if (Object.keys(newErrors).length === 0) {
//             console.log('Form submitted:', formData);
//             setSubmitted(true);

//             setTimeout(() => {
//                 setFormData({ name: '', email: '', message: '' });
//                 setSubmitted(false);
//             }, 3000);
//         } else {
//             setErrors(newErrors);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-2xl w-full">

//                 <div className="text-center mb-12">
//                     <h1 className="text-4xl font-bold text-gray-900 mb-2">Feedback</h1>
//                 </div>

//                 <div className="bg-white p-8 md:p-12">
//                     {submitted ? (
//                         <div className="text-center py-12">
//                             <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//                                 <svg
//                                     className="w-8 h-8 text-green-500"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M5 13l4 4L19 7"
//                                     />
//                                 </svg>
//                             </div>
//                             <h3 className="text-2xl font-semibold text-gray-900 mb-2">
//                                 Thank You!
//                             </h3>
//                             <p className="text-gray-600">
//                                 Your feedback has been submitted successfully.
//                             </p>
//                         </div>
//                     ) : (
//                         <div>
//                             <div className="mb-6">
//                                 <label
//                                     htmlFor="name"
//                                     className="block text-gray-700 text-sm font-medium mb-2"
//                                 >
//                                     Name <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="name"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     placeholder="Your Name..."
//                                     className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
//                                 />
//                                 {errors.name && (
//                                     <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//                                 )}
//                             </div>

//                             <div className="mb-6">
//                                 <label
//                                     htmlFor="email"
//                                     className="block text-gray-700 text-sm font-medium mb-2"
//                                 >
//                                     Email Address <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="Your Email Address..."
//                                     className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
//                                 />
//                                 {errors.email && (
//                                     <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                                 )}
//                             </div>

//                             <div className="mb-8">
//                                 <label
//                                     htmlFor="message"
//                                     className="block text-gray-700 text-sm font-medium mb-2"
//                                 >
//                                     Message <span className="text-red-500">*</span>
//                                 </label>
//                                 <textarea
//                                     id="message"
//                                     name="message"
//                                     value={formData.message}
//                                     onChange={handleChange}
//                                     placeholder="Your Message..."
//                                     rows="6"
//                                     className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none`}
//                                 />
//                                 {errors.message && (
//                                     <p className="text-red-500 text-xs mt-1">{errors.message}</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <button
//                                     onClick={handleSubmit}
//                                     className="w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white font-semibold px-12 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                                 >
//                                     Submit
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default FeedbackForm;

// src/components/FeedbackForm.jsx
import React, { useState } from 'react';

const FeedbackForm = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
  const endpoint = `${API_BASE.replace(/\/$/, '')}/feedback`;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    // If this is called from button onClick with no event, still protect.
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setServerError('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }

      if (!res.ok) {
        // If server returns validation details, map them
        if (data && data.details && Array.isArray(data.details)) {
          // convert to field-level errors when possible (best-effort)
          const mapped = {};
          data.details.forEach(d => {
            // simple heuristic: "email is not a valid email" => put under email
            const lower = (d || '').toLowerCase();
            if (lower.includes('email')) mapped.email = d;
            else if (lower.includes('name')) mapped.name = d;
            else if (lower.includes('message')) mapped.message = d;
          });
          setErrors(prev => ({ ...prev, ...mapped }));
        }

        // show server message if present
        setServerError(data && (data.error || data.message) ? (data.error || data.message) : `Request failed with status ${res.status}`);
        setLoading(false);
        return;
      }

      // success
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });

      // keep thank-you visible for 3s then hide
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Feedback submit error:', err);
      setServerError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Feedback</h1>
        </div>

        <div className="bg-white p-8 md:p-12">
          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your feedback has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name..."
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email Address..."
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message..."
                  rows="6"
                  className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              {serverError && <p className="text-red-600 text-sm mb-4">{serverError}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full md:w-auto ${loading ? 'opacity-70 pointer-events-none' : ''} bg-gray-900 hover:bg-gray-800 text-white font-semibold px-12 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
