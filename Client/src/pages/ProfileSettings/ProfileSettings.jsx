import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate  } from 'react-router-dom';
import Topbar from '../../components/Navbar/NavbarPage'

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    profilePicture: null,
    biography: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userToken = localStorage.getItem('token');

      try {
        const response = await axios.get(`http://localhost:8080/api/user-details/user/${userToken}/get-details`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (response.data) {
          const { firstName, lastName } = response.data;
          setProfile((prevProfile) => ({
            ...prevProfile,
            firstName,
            lastName,
          }));
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      const userToken = localStorage.getItem('token');

      try {
        const profileResponse = await axios.get(`http://localhost:8080/api/setprofile/user/${userToken}`);
        if (profileResponse.data) {
          const { dateOfBirth, gender, contactNumber, biography, profilePicture } = profileResponse.data;

          // Format MongoDB date to a more readable format
          const formattedDateOfBirth = dateOfBirth ? format(new Date(dateOfBirth), 'yyyy-MM-dd') : '';

          setProfile((prevProfile) => ({
            ...prevProfile,
            dateOfBirth: formattedDateOfBirth,
            gender: gender || '',
            contactNumber: contactNumber || '',
            biography: biography || '',
            profilePicture: profilePicture || null,
          }));

          // If there's an existing profile picture, set the image preview
          if (profilePicture) {
            setImagePreview(`http://localhost:8080/profilepictures/${profilePicture}`);
          }
        }
      } catch (error) {
        console.error('Error fetching profile details:', error);
      }
    };

    fetchProfileDetails();
  }, []);

  const handleChange = (e) => {
    setProfile({
      
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: file,
        }));

        // Create a preview for the selected image
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
      } catch (error) {
        console.error('Error reading the file:', error);
      }
    }
  };

  const handleSave = async () => {
    const url = 'http://localhost:8080/api/setprofile';
    const userToken = localStorage.getItem('token');

    if (profile.contactNumber.length !== 11) {
      console.error('Contact number should be 11 digits. Form not saved.');
      alert("Contact number should be 11 digits. Form not saved.")
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', userToken);
      formData.append('profilePicture', profile.profilePicture);
      formData.append('firstName', profile.firstName);
      formData.append('lastName', profile.lastName);
      formData.append('dateOfBirth', profile.dateOfBirth);
      formData.append('gender', profile.gender);
      formData.append('contactNumber', profile.contactNumber);
      formData.append('biography', profile.biography);

      const { data } = await axios.post(
        url,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Profile Saved Successfully:', data);
      alert("Profile Updated")
      navigate('/home');
    } catch (error) {
      console.error('Error submitting profile information:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };
 

  return (
    <div>
      <Topbar/>
    
    <div className="pr-16 pl-16 mt-8 p-4 bg-white  mb-8">
      <div className="text-white bg-Teal text-3xl mb-8">Profile Settings</div>
      <div className="flex flex-row">
        {/* Div 1: Profile Picture and Select Picture Field */}
        <div className="w-1/3 pr-8">
          <div className="mb-8 justify-items-center">
            {profile.profilePicture && imagePreview && (
              <div className="mb-4 place-content-center">
                <label className="text-gray-600 text-l font-semibold">Profile Picture</label>
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-40 h-40 object-cover rounded-full border"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="text-gray-600 text-sm font-semibold">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full  mt-1 p-2 border "
              />
            </div>
          </div>
        </div>

        {/* Div 2: First Name, Last Name, and Contact */}
        <div className="w-1/3 pr-8">
          <div className="mb-8">
            <label className="text-gray-600 text-sm font-semibold">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border "
              placeholder="Enter first name"
            />
          </div>
          <div className="mb-8">
            <label className="text-gray-600 text-sm font-semibold">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="w-full mt-1 p-2 border "
              placeholder="Enter last name"
            />
          </div>

          <div className="mb-8">
            <label className="text-gray-600 text-sm font-semibold">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={profile.contactNumber}
              onChange={handleChange}
              className="w-full mt-1 p-2 border "
              placeholder="Enter contact number"
            />
          </div>
        </div>

        {/* Div 3: Remaining Fields */}
        <div className="w-1/3">
          <div className="mb-8">
            <label className="text-gray-600 text-sm font-semibold">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full mt-1 p-2 border "
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="text-gray-600 text-sm font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleChange}
              className="w-full mt-1 p-2 border "
            />
          </div>

          <div className="mb-8">
            <label className="text-gray-600 text-sm font-semibold">Biography</label>
            <textarea
              name="biography"
              value={profile.biography}
              onChange={handleChange}
              className="w-full mt-1 p-2 border "
              placeholder="Your biography should have at least 50 characters, links and coupon codes are not permitted."
            />
          </div>

         
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-6 py-3 w-[15%] font-bold text-white bg-Teal rounded-lg mr-4 text-sm hover:bg-gray-700"
      >
        Save
      </button>
    </div>
    </div>
  );
};

export default ProfileSettings;