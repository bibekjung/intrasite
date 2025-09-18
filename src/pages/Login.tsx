import { Mail, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className=" rounded-2xl shadow-lg w-full max-w-5xl min-h-[600px] overflow-hidden relative">
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-6 py-10 md:px-10 text-white transition-transform duration-1000 ease-in-out"
          style={{
            transform: isAnimationComplete
              ? 'translateX(-25%)'
              : 'translateX(0)',
          }}
        >
          <div className="relative z-10 flex flex-col items-center">
            <img
              src="/logo.png"
              alt="KSKL"
              className="h-32 w-auto object-contain"
            />
            <div className="flex flex-col items-center text-center max-w-sm">
              <h1 className="text-xl md:text-3xl font-bold mb-4">INTRASITE</h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                Please sign in to continue to dashboard
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-blue-500 -z-10"></div>
        </div>
        <div
          className="absolute top-0 right-0 w-1/2 h-full px-6 py-8 md:px-12 md:py-10 flex flex-col justify-center bg-white transition-transform duration-1000 ease-in-out overflow-y-auto"
          style={{
            transform: isAnimationComplete
              ? 'translateX(0)'
              : 'translateX(100%)',
          }}
        >
          {isAnimationComplete && (
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Hello! Welcome Back
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Log in with your credentials you entered during your
                  registration.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full outline-none text-sm md:text-base"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <Lock className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full outline-none text-sm md:text-base"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-sm md:text-base"
                >
                  Login To Dashboard
                </button>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-sm md:text-base text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs md:text-sm text-gray-500 mb-2">
                  Copyright © Credit Information Bureau of Nepal.
                </p>
                <p className="text-xs md:text-sm text-gray-500">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
