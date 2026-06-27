/** @format */

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import styles from "../../component/auth/Auth.module.scss";
import { emaiSchema } from "../../utils/form-schema";
import AuthHeader from "../../component/auth/AuthHeader";
import { Email } from "../../component/auth/AuthInputs";
import AuthFooter from "../../component/auth/AuthFooter";
import useSignUpEmailStep from "../../hook/auth/useSignUpEmailStep";

const formSchema = yup.object().shape({
  email: emaiSchema,
});

type FormSchemaProps = yup.InferType<typeof formSchema>;

function SignUpEmail() {
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

  // request
  const { mutate, isPending, isError, error } = useSignUpEmailStep();

  function submitHandler(data: FormSchemaProps) {
    mutate(data.email);
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
        <AuthHeader subtitle="Create a blogie account" title="Join us now" />

        {isError && <p className="error-mgs">{error.message}</p>}

        <Email
          isLoading={isPending}
          control={control}
          errors={formErrors}
          register={register}
          resetField={resetField}
        />

        <button
          type="submit"
          className={`btn-primary ${styles.submitBtn} ${isPending && ".disabled"}`}>
          Sign up
        </button>

        <AuthFooter type="signup" />
      </form>
    </div>
  );
}

export default SignUpEmail;
