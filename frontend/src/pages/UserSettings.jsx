import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiSlice } from '../slices/apiSlice';
import { useLocation } from 'wouter';
import { toast } from 'react-toastify';
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../slices/auth/usersApiSlice';
import { setCredentials, logout } from '../slices/auth/authSlice';

import Button from '../components/Button';
import Loader from '../components/Loader';
import Input from '../components/Input';
import BgFlourish from '../components/BgFlourish';
import DeleteButton from '../components/DeleteButton';
import { ExclamationCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

function UserSettings() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    newPassword: '',
  });
  const { email, username, oldPassword, newPassword } = formData;
  const [isHovered, setIsHovered] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const [location, navigate] = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // Avatars dialog
  const avatars = Array.from({ length: 30 }, (_, index) => index + 1);
  const closeAvatarDialog = () => {
    setIsAvatarDialogOpen(false);
  };

  const handleAvatarSelection = async (avatarNumber) => {
    closeAvatarDialog();
    if (avatarNumber === user.avatar) {
      return;
    }
    try {
      await updateUser({ avatar: avatarNumber }).unwrap();
      toast.success('Updated avatar');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Form
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Delete account
  const handleDelete = async () => {
    try {
      await deleteUser().unwrap();
      toast.success(`Deleted user "${userInfo.username}"`);
      dispatch(logout());
      // Clear the redux cache on logout to make way for a new user session
      dispatch(apiSlice.util.resetApiState());
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Change account details
  const onChangeInfo = async (e) => {
    e.preventDefault();
    if (email === '' && username === '' && newPassword === '') {
      toast.error('Please fill in a field to change');
      return;
    }
    try {
      await updateUser({ email, username, password: newPassword }).unwrap();
      const updatedCredentials = { _id: userInfo._id };
      updatedCredentials.email = email === '' ? userInfo.email : email;
      updatedCredentials.username =
        username === '' ? userInfo.username : username;
      dispatch(setCredentials(updatedCredentials));
      toast.success('Account details updated');
      setFormData({
        email: '',
        username: '',
        newPassword: '',
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isError) {
    return (
      <div className="flex justify-center mt-16">
        <h2 className="flex flex-col items-center text-gray-200 text-2xl">
          <ExclamationCircleIcon className="w-8 h-8" />
          {error?.data?.message || error?.error}
        </h2>
      </div>
    );
  }

  if (isLoading || isFetching || isUpdating || isDeleting) {
    return <Loader />;
  }

  return (
    <>
      <BgFlourish flourish="3" />

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-24 p-6">
        <div className="flex flex-col justify-self-end items-center gap-6">
          <div
            className="relative rounded-full p-6 bg-blue-violet/50 border-4 border-white/70 hover:cursor-pointer hover:bg-surface"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsAvatarDialogOpen(true)}
          >
            {isHovered && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100">
                <PencilIcon className="w-10 h-10 text-white" />
              </div>
            )}
            <img
              className={`w-28 aspect-square ${isHovered && 'opacity-50'}`}
              src={
                process.env.PUBLIC_URL + `/avatars/avatar-${user.avatar}.svg`
              }
              alt={`Avatar ${user.avatar}`}
            />
          </div>
          {isAvatarDialogOpen && (
            <>
              <div
                className="fixed z-40 w-screen h-screen inset-0 bg-black bg-opacity-50"
                onClick={closeAvatarDialog}
              />
              <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col bg-surface rounded-lg p-6 w-[90vw] max-w-lg">
                  <h2 className="text-xl text-white font-bold">
                    Select Avatar
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 my-6 max-h-[70vh] overflow-scroll">
                    {avatars.map((avatar) => (
                      <img
                        key={avatar}
                        className="w-16 aspect-square cursor-pointer hover:opacity-80"
                        src={
                          process.env.PUBLIC_URL +
                          `/avatars/avatar-${avatar}.svg`
                        }
                        alt={`Avatar ${avatar}`}
                        onClick={() => handleAvatarSelection(avatar)}
                      />
                    ))}
                  </div>
                  <Button type="secondary" onClick={closeAvatarDialog}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
          <h1 className="text-white text-3xl font-bold text-center">
            {user.username}
          </h1>
          <DeleteButton
            type="button"
            message="Are you sure you want to delete your account?"
            onConfirm={handleDelete}
          >
            Delete Account
          </DeleteButton>
        </div>

        <div className="relative bg-surface w-[90%] sm:w-3/4 sm:max-w-md rounded-xl px-6 py-10 sm:p-12">
          <h1 className="text-white text-3xl font-bold text-center mb-4">
            Change Account Details
          </h1>

          <form onSubmit={onChangeInfo}>
            <Input
              type="email"
              name="email"
              label="Email"
              value={email}
              placeholder={user.email}
              onChange={onChange}
            />
            <Input
              type="text"
              name="username"
              label="Username"
              value={username}
              placeholder={user.username}
              onChange={onChange}
            />
            <Input
              type="password"
              name="newPassword"
              label="New Password"
              value={newPassword}
              placeholder="Enter new password"
              onChange={onChange}
            />
            <Button isSubmit type="secondary" className="w-full">
              Change Info
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserSettings;
