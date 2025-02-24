import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const WebForm = () => {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    email: '',
    AddressLine1: '',
    AddressLine2: '',
    City: '',
    State: '',
    PostalCode: '',
    Country: '',
    SSN: '',
    DateOfBirth: ''
  });

  const [outcome, setOutcome] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const usStateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateFirstName = (name) => {
    const namePattern = /^[A-Za-z\s-]+$/;
    return namePattern.test(name);
  };

  const validateState = (state) => {
    return usStateAbbreviations.includes(state.toUpperCase());
  };

  const validateZipCode = (postalCode) => {
    const postalCodePattern = /^[0-9]{5}(-[0-9]{4})?$/;
    return postalCodePattern.test(postalCode);
  };

  const validateCountry = (country) => {
    return country.toUpperCase() === 'US';
  };

  const validateDateOfBirth = (dob) => {
    const iso8601Pattern = /^\d{4}-\d{2}-\d{2}$/;
    return iso8601Pattern.test(dob);
  };

  const validateSSN = (ssn) => {
    const ssnPattern = /^\d{9}$/;
    return ssnPattern.test(ssn);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!validateFirstName(formData.FirstName)) {
      alert('Please enter a valid first name. Use only letters, spaces, or hyphens.');
      return;
    }

    if (!validateState(formData.State)) {
      alert('Please enter a valid two-letter US state abbreviation.');
      return;
    }

    if (!validateZipCode(formData.PostalCode)) {
      alert('Please enter a valid ZIP code.');
      return;
    }

    if (!validateCountry(formData.Country)) {
      alert('Please enter "US" as the country.');
      return;
    }

    if (!validateDateOfBirth(formData.DateOfBirth)) {
      alert('Please enter a valid date of birth in YYYY-MM-DD format.');
      return;
    }

    if (!validateSSN(formData.SSN)) {
    alert('Please enter a valid 9-digit SSN without dashes.');
    return;
    }

try {
      const response = await axios.post('http://127.0.0.1:5000/submit', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const outcomeField = response.data.summary?.outcome;
      if (outcomeField !== undefined) {
        setOutcome(outcomeField);
      } else {
        setOutcome('Outcome not available');
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('There was an error!', error);
      setOutcome('There was an error');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            required
            
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            required
            
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}

          />
        </div>
        <div className="form-group">
          <label>Address Line 1:</label>
          <input
            type="text"
            name="AddressLine1"
            value={formData.AddressLine1}
            onChange={handleChange}
            
          />
        </div>
        <div className="form-group">
          <label>Address Line 2:</label>
          <input
            type="text"
            name="AddressLine2"
            value={formData.AddressLine2}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            name="City"
            value={formData.City}
            onChange={handleChange}
            
          />
        </div>
        <div className="form-group">
          <label>State:</label>
          <input
            type="text"
            name="State"
            value={formData.State}
            onChange={handleChange}
            
          />
        </div>
        <div className="form-group">
          <label>Postal Code:</label>
          <input
            type="text"
            name="PostalCode"
            value={formData.PostalCode}
            onChange={handleChange}
            
          />
        </div>
        <div className="form-group">
          <label>Country:</label>
          <input
            type="text"
            name="Country"
            value={formData.Country}
            onChange={handleChange}
            
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="DateOfBirth"
            value={formData.DateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>SSN:</label>
          <input
            type="text"
            name="SSN"
            value={formData.SSN}
            onChange={handleChange}
            
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Outcome Modal"
                style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '30px',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '90%'
          }
        }}
      >
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Outcome</h2>
        <div style={{ fontSize: '18px', lineHeight: '1.6' }}>{outcome}</div> {/* Larger font size for readability */}
        <button onClick={closeModal} style={{ marginTop: '20px', padding: '10px 20px' }}>Close</button>
      </Modal>
    </div>
  );
};

export default WebForm;
