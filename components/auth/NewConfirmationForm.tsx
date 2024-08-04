"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { BeatLoader, HashLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { confirmEmail } from "@/actions/confirm-email";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

export const NewConfirmationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    
    if (!token) {
      setError("Missing token");
      return;
    }
    confirmEmail(token)
      .then((res) => {
        if (res.error) {
          setError(res.message);
          return;
        }
        setSuccess(res.message);
      })
      .catch(() => {
        setError("Something Went Wrong");
      });


  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirm Your Email"
      backButtonHref="/auth/login"
      backButtonLabel="Back to Login"
    >
      <div className="flex flex-col gap-y-6 items-center w-full justify-center">
        {!success && !error && <BeatLoader color="#1e293b" size={15} />}
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};
