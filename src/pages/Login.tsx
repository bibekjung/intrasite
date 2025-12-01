import { setIsAnimationComplete } from '@/slices/authSlice';
import { RootState } from '@/store/store';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { type LoginInput } from '@/api/schemas/authSchema';
import { useLdapLogin } from '@/hooks/useLogin';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isAnimationComplete, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { mutate: login, isPending } = useLdapLogin();

  const { register, handleSubmit } = useForm<Omit<LoginInput, 'portal'>>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setIsAnimationComplete(true));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const onSubmit = (data: Omit<LoginInput, 'portal'>) => {
    // hard code portal as 'partner'
    const loginPayload = {
      ...data,
      portal: 'admin',
    };
    login(loginPayload);
  };

  // next page after authentication
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-4">
      <div className="rounded-2xl shadow-lg w-full max-w-5xl min-h-[600px] overflow-hidden relative">
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label
                    htmlFor="username"
                    className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
                  >
                    Username or Email
                  </Label>
                  <div className="flex items-center border rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 border-gray-300">
                    <Mail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username or email"
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...register('username')}
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
                  >
                    Password
                  </Label>
                  <div className="flex items-center border rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 border-gray-300">
                    <Lock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...register('password')}
                      disabled={isPending}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login To Dashboard'
                  )}
                </Button>

                <div className="text-center">
                  <a
                    href="#"
                    className="text-sm md:text-base text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot Password?
                  </a>
                </div>
              </form>

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
