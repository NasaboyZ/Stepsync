"use client";



import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { handleSignup } from "@/actions/auth-actions";
import { FormWrapper } from "./form-wrapper";

// interface RegisterFormProps {
//   setForm: Dispatch<SetStateAction<SessionForm>>;
// }

interface RegisterFormInputs {
  email: string;
  firstname: string;
  lastname: string;
  weight: number;
  height: number;
  username: string;
  goals: string;
  gender: string;
  date_of_birth: string;
  password: string;
}

export const RegisterForm = () => {
  const methods = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    // call the server action 'handleSignup' and await the response
    const response = await handleSignup(
      data.email,
      data.password,
      data.username,
      data.height,
      data.weight,
      data.goals,
      data.gender,
      data.date_of_birth,
      data.firstname,
      data.lastname
    );

    // if the response is successful console.log the response
    if (response.status === 201) {
      console.log("Signup successful: ", response);
    } else {
      console.log("Signup failed: ", response);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormWrapper onSubmit={methods.handleSubmit(onSubmit)}>
        <TextInput
          placeholder="E-mail"
          name="email"
          type="text"
          required
          validateAs="email"
        />
        <TextInput
          placeholder="Password"
          name="password"
          type="password"
          required
          validateAs="password"
        />
        <div className="flex gap-1 justify-end -mt-6">
          <p>Already a member?</p>
          <Button
            onClick={() => setForm(SessionForm.LOGIN)}
            isSimple
            className="mb-8"
          >
            Login now
          </Button>
        </div>
        <Button type="submit">Register</Button>
      </FormWrapper>
    </FormProvider>
  );
};
