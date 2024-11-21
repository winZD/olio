export default function Login() {
  /* const { t } = useTranslation();
  const formMethods = useRemixForm<FormData>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    stringifyAllValues: true,
  });
  const { handleSubmit } = formMethods; */

  return (
    <div className="flex h-full w-full items-center justify-center">
      LOOGIN
      {/*   <HookForm
          formMethods={formMethods}
          onSubmit={handleSubmit}
          method="POST"
          className="flex flex-col gap-4 rounded border p-8 shadow"
        >
          <InputField label="Email" name="email" />
          <InputField label="Lozinka" name="password" />
  
          <button type="submit" className="rounded bg-slate-200 p-4">
            {t('login')}
          </button>
        </HookForm> */}
    </div>
  );
}
