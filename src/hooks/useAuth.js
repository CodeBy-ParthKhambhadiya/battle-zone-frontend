import { useDispatch, useSelector } from "react-redux";
import {
  signUpAction,
  verifyOtpAction,
  resendOtpAction,
  forgotPasswordAction,
  loginAction,
  fetchUserAction,
  updateUserAction, // add login action
} from "@/store/actions/auth.action";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  // Sign up
  const createUser = async (body) => {
    return await dispatch(signUpAction(body));
  };

  // Verify OTP
  const verifyOtp = async ({ email, otp, role }) => {
    return await dispatch(verifyOtpAction({ email, otp, role }));
  };

  // Resend OTP
  const reSendOtp = async ({ email, role }) => {
    return await dispatch(resendOtpAction({ email, role }));
  };

  // Forgot password
  const forgotPassword = async ({ email, mobile, role, newPassword }) => {
    return await dispatch(forgotPasswordAction({ email, mobile, role, newPassword }));
  };

  // Login
  const login = async ({ email, password, role }) => {
    return await dispatch(loginAction({ email, password, role }));
  };

  const fetchUser = async () => {
    return await dispatch((fetchUserAction()));
  };

  const updateUser = async (userId, data) => {
    return await dispatch(updateUserAction({ userId, data }));
  };


  return {
    user,
    loading,
    createUser,
    verifyOtp,
    reSendOtp,
    forgotPassword,
    login, // export login
    fetchUser,
    updateUser,
  };
};

export default useAuth;
