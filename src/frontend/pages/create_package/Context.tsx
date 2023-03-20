import React, { createContext, useCallback, useContext, useState } from "react";
import { defaultFormState, formSchemaType } from "./formSchema";
import { produce } from "immer";
import { Tab } from "@headlessui/react";
import {
  PackageInfoForm,
  SenderInfoForm,
  ReciverInfoForm,
  SummaryForm,
} from "./PackageMultiStepForm";
import { api } from "src/server/utils/api";

const FORM_STEPS = [
  {
    label: `Package Details`,
  },
  {
    label: `Reciver Details`,
  },
  {
    label: `Sender Details`,
  },
  {
    label: `Summary`,
  },
];

export const FormStateContext = createContext({
  form: defaultFormState,
  setForm: (
    form:
      | typeof defaultFormState
      | ((form: typeof defaultFormState) => typeof defaultFormState)
  ) => {},
});

function MultiStepForm() {
  const [form, setForm] = useState(defaultFormState);

  return (
    <FormStateContext.Provider value={{ form, setForm }}>
      <CreateMultiStepForm />
    </FormStateContext.Provider>
  );
}

const CreateMultiStepForm = () => {
  const { form, setForm } = useContext(FormStateContext);

  function nextStep() {
    if (form.selectedIndex === 3) return;
    setForm(
      produce((form) => {
        form.selectedIndex += 1;
      })
    );
  }

  function prevStep() {
    if (form.selectedIndex === 0) return;
    setForm(
      produce((form) => {
        form.selectedIndex -= 1;
      })
    );
  }

  const setSelectedIndex = useCallback(
    (index: number) => {
      setForm(
        produce((form) => {
          form.selectedIndex = index;
        })
      );
    },
    [setForm]
  );

  const { mutateAsync } = api.package.createPackage.useMutation({
    onSuccess: () => {
      console.log("success");
    },
  });

  async function submitForm() {
    await mutateAsync(form);
  }

  const selectedIndex = form.selectedIndex;
  type tabName = keyof formSchemaType["steps"];
  const tabName = Object.keys(form.steps) as tabName[];

  return (
    <>
      <div className="w-full px-2 py-10 items-center">
        <Tab.Group selectedIndex={selectedIndex}>
          <div className="flex flex-col items-center align-middle justify-center">
            <div className="w-2/4">
              <div className="">
                <Tab.List className="flex space-x-1 rounded-xl darkColor p-1">
                  {FORM_STEPS.map((step, index) => (
                    <Tab
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5  ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2 ${
                        index === selectedIndex
                          ? "bg-[#3a3a39] shadow highlightText"
                          : "text-blue-100 hover:bg-white/[0.12] hover:"
                      }`}
                    >
                      {step.label}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
              <div className="darkColor rounded-md">
                <Tab.Panels className="mt-2 bg-[#333533] rounded-md">
                  <Tab.Panel>
                    <div className="">
                      <PackageInfoForm onNext={nextStep} />
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div>
                      <ReciverInfoForm onNext={nextStep} onPrev={prevStep} />
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div>
                      <SenderInfoForm onNext={nextStep} onPrev={prevStep} />
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <SummaryForm
                      onNext={nextStep}
                      onPrev={prevStep}
                      submitForm={submitForm}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              </div>
            </div>
          </div>
        </Tab.Group>
      </div>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </>
  );
};

export default MultiStepForm;
