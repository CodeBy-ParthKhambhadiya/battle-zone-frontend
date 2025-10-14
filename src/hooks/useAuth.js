import { useDispatch, useSelector } from "react-redux";
import { signUpAction, verifyOtpAction, resendOtpAction } from "@/store/actions/auth.action";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const createUser = async (body) => {
    return await dispatch(signUpAction(body));
  };

  const verifyOtp = async ({ email, otp }) => {
    return await dispatch(verifyOtpAction({ email, otp }));
  };

  const reSendOtp = async (email) => {
    return await dispatch(resendOtpAction(email));
  };

  return {
    user,
    loading,
    createUser,
    verifyOtp,
    reSendOtp,
  };
};

export default useAuth;
