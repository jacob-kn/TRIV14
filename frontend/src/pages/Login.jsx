import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'wouter';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../slices/auth/usersApiSlice';
import { setCredentials } from '../slices/auth/authSlice';

import Button from '../components/Button';
import Input from '../components/Input';
import Divider from '../components/Divider';
import Loader from '../components/Loader';
import BgFlourish from '../components/BgFlourish';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const [location, navigate] = useLocation();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <BgFlourish flourish="2" />

      <div className="flex justify-center items-center w-screen h-full my-24">
        <div className="relative bg-surface w-3/4 max-w-md rounded-xl p-12">
          <img
            src={process.env.PUBLIC_URL + '/flourishes/auth-polygons.svg'}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[225%] max-w-none aspect-square -z-10"
          />

          <h1 className="text-white text-3xl font-bold text-center mb-4">
            Login
          </h1>

          <form onSubmit={onLogin}>
            <Input
              type="email"
              name="email"
              label="Email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
            <Input
              type="password"
              name="password"
              label="Password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
            <Button isSubmit type="secondary" className="w-full">
              Login
            </Button>
            <Divider content="or" />
            <Link to="/register">
              <Button type="primary" className="bg-gray-300 w-full">
                Sign up
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
