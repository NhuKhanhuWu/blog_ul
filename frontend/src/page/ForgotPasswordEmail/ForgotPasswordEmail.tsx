/** @format */

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { emaiSchema } from "../../utils/form-schema";
import EmailField from "../../component/input/EmailField";
import AuthHeader from "../../component/auth/AuthHeader/AuthHeader";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthFooter from "../../component/auth/AuthFooter/AuthFooter";
import useForgotPasswordEmail from "../../hook/auth/useForgotPasswordEmail";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const formSchema = yup.object().shape({
  email: emaiSchema,
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function ForgotPassword() {
  // form
  const {
    register,
    handleSubmit,
    resetField,
    control,
    formState: { errors: formErrors },
  } = useForm<FormSchemaProps>({
    resolver: yupResolver(formSchema),
  });

  // api call
  const { mutate, isPending, isError, error } = useForgotPasswordEmail();

  // redirect to next step (otp)
  const navigate = useNavigate();

  function submitHandler(data: FormSchemaProps) {
    mutate(data.email, {
      onSuccess: () => {
        // show toast message
        toast.success("OTP sended");

        // redirect to otp page
        navigate("verify-otp");
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <AuthHeader
        subtitle="An OTP code will be sended to your mail"
        title="Validate your account"
      />

      {isError && <p className="error-mgs">{error.message}</p>}

      <EmailField
        control={control}
        errors={formErrors}
        register={register}
        resetField={resetField}
      />

      <button
        type="submit"
        className={`btn-primary ${isPending && "disabled"}`}>
        Send OTP
      </button>

      <AuthFooter type="signup" />
    </form>
  );
}

export default ForgotPassword;
