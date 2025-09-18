import { Mail, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setEmail, setPassword } from '@/slices/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { email, password } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        <div className="w-1/2 bg-blue-500 flex flex-col items-center justify-center p-10 text-white">
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-full shadow-lg mb-4 flex items-center justify-center">
              <img
                src="/karja.png"
                alt="CIB Logo"
                className="h-24 w-24 object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold">INTRASITE</h1>
            <p className="mt-2 text-blue-100 text-sm text-center">
              Please sign in to continue to dashboard
            </p>
          </div>
        </div>

        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Hello! Welcome Back
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Log in with your credentials you entered during
              <br />
              your registration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2 text-sm"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                  className="w-full outline-none text-sm"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2 text-sm"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Lock className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => dispatch(setPassword(e.target.value))}
                  className="w-full outline-none text-sm"
                  placeholder="Enter Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition-all duration-300 text-sm"
            >
              Login To Dashboard
            </button>

            <div className="text-center">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot Password?
              </a>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Copyright © Credit Information Bureau of Nepal.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              By logging in you accept our{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
