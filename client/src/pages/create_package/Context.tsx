import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultFormState, formSchemaType } from "./formSchema";
import { produce } from "immer";
import { Tab } from "@headlessui/react";
import {
  PackageInfoForm,
  SenderInfoForm,
  ReciverInfoForm,
  SummaryForm,
} from "./PackageMultiStepForm";

import { useNavigate } from "react-router-dom";
import { trpc } from "../../utils/trpc";

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

  const navigate = useNavigate();
  const { mutateAsync, isLoading, data } =
    trpc.package.createPackage.useMutation({
      onSuccess: (data) => {
        // console.log("success");
        const packageDetails = data?.package;
        navigate(`/package/${data?.package.package_id}`, {
          state: { data: packageDetails },
        });
      },
    });

  const calculatePrice = () => {
    const { packageSize, packageType, packageWeight } =
      form.steps.packageInfo.value;
    if (packageSize && packageType && packageWeight) {
      if (packageType === "envelope") {
        if (packageSize === "small") {
          return 5 * packageWeight;
        } else if (packageSize === "medium") {
          return 10 * packageWeight;
        } else {
          return 15 * packageWeight;
        }
      } else if (packageType === "box") {
        if (packageSize === "small") {
          return 20 * packageWeight;
        } else if (packageSize === "medium") {
          return 30 * packageWeight;
        } else {
          return 50 * packageWeight;
        }
      } else {
        return 30 * packageWeight;
      }
    } else {
      return 0;
    }
  };

  useEffect(() => {
    setForm(
      produce((form) => {
        form.steps.packageInfo.value.price = calculatePrice();
      })
    );
  }, [form.steps.packageInfo.value, setForm]);

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
                      isLoading={isLoading}
                    />
                  </Tab.Panel>

                  <div className="text-center w-full">
                    <p className="p-10 text-center">
                      COST: $ {form.steps.packageInfo.value.price}
                    </p>
                  </div>
                </Tab.Panels>
              </div>
            </div>
          </div>
        </Tab.Group>
      </div>
      {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
    </>
  );
};

export default MultiStepForm;
