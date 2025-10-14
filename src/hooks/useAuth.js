import { useDispatch, useSelector } from "react-redux";
import {
  signUpAction,
  verifyOtpAction,
  resendOtpAction,
  forgotPasswordAction,
  loginAction, // add login action
} from "@/store/actions/auth.action";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  // Sign up
  const createUser = async (body) => {
    return await dispatch(signUpAction(body));
  };

  // Verify OTP
  const verifyOtp = async ({ email, otp }) => {
    return await dispatch(verifyOtpAction({ email, otp }));
  };

  // Resend OTP
  const reSendOtp = async (email) => {
    return await dispatch(resendOtpAction(email));
  };

  // Forgot password
  const forgotPassword = async ({ email, role }) => {
    return await dispatch(forgotPasswordAction({ email, role }));
  };

  // Login
  const login = async ({ email, password, role }) => {
    return await dispatch(loginAction({ email, password, role }));
  };

  return {
    user,
    loading,
    createUser,
    verifyOtp,
    reSendOtp,
    forgotPassword,
    login, // export login
  };
};

export default useAuth;
