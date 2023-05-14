import React, { useEffect, useState } from "react";
import data from "../../../shared/data/data.json";
import useMultiStepHook from "../../../shared/custom-hooks/useMultiStepForm";
import { FormNavigation } from "../../../shared/components/form/screening";
import renderQuestion from "./helper/renderQuestion";
import { useNavigate } from "react-router-dom";

const MultiStepForm = ({
  selectedSection,
  selectedSubSection,
  handleSelectedSection,
  formData,
  setFormData,
  handleGetRecommendations
}) => {
  //defining states for component
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [currentSection, setCurrentSection] = useState(
    data.data.find((data) => data.id === selectedSection)
  );
  const [canSubmit, setCanSubmit] = useState(false);

  //get the subsections of the current section
  let subSectionsArr = [];
  data.data.map((item) => subSectionsArr.push(...item.subSections));

  //Pass subsections as steps
  const {
    steps,
    step,
    currentStepIndex,
    setCurrentStepIndex,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
  } = useMultiStepHook(subSectionsArr);

  const navigate = useNavigate();

  //set the step to the first step whenever the selected section changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [selectedSection]);

  //check if all the fields of the current step are filled, and then set the isStepComplete accordingly
  useEffect(() => {
    const currentStep = steps[currentStepIndex]; //get the current step

    const isCurrentStepComplete = currentStep.questions.every((question) => {
      const fieldValue = formData[question.name];
      if (typeof fieldValue === "undefined") {
        return false;
      } else if (typeof fieldValue == "string") {
        if (fieldValue === "") {
          return false;
        }
        return true;
      } else if (fieldValue === null) {
        return false;
      } else {
        return true;
      }
    }); // logic to check if the current step is complete
    setIsStepComplete(isCurrentStepComplete);
  }, [formData, selectedSection, selectedSubSection, step]);

  //change the selectedsubsection or step accordingly once the step changes
  useEffect(() => {
    const newSection = data.data.find((section) =>
      section.subSections.some((subSection) => subSection.id === step.id)
    );
    handleSelectedSection(newSection.id, step.id);
  }, [step]);

  //change the currentstepindex whenver the selected section and selected subsection changes
  useEffect(() => {
    setCurrentSection(data.data.find((data) => data.id === selectedSection));
    const currentStep = steps.find((step) => step.id === selectedSubSection);
    setCurrentStepIndex(steps.indexOf(currentStep));
  }, [selectedSection, selectedSubSection]);

  //handle input change of form
  const handleFormInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //handle submit of form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isStepComplete) {
      return;
    }
    console.log("Form submitted:", formData);
    console.log("greater");

    const index = data.data.indexOf(currentSection); //find the index of the currentSection
    console.log(index);
    console.log(data.data.length);

    if (index + 1 < data.data.length) {
      //if the index is less than the length of the data i.e if it is not the last index
      const nextSection = data.data[index + 1]; //get the next section i.e the next index
      handleSelectedSection(nextSection.id); //pass the next section's id into the handleselected section function
    } else {
      handleGetRecommendations()
    }
  };

  const handleNextStep = () => {
    if (!isStepComplete) return; //cross check to very the step is complete
    nextStep(); //move to the next step
  };

  return (
    <div className="px-5 pb-5 h-full pr-20">
      <h1 className="screening_heading">{currentSection.name}</h1>

      <form className="space-y-7 h-[500px] overflow-auto px-5">
        {steps.map((step, index) => (
          <div
            key={index}
            style={{ display: currentStepIndex === index ? "block" : "none" }}
          >
            {step.questions.map((question, index) =>
              renderQuestion(
                question,
                index,
                steps,
                formData,
                currentStepIndex,
                handleFormInputChange,
                step
              )
            )}
          </div>
        ))}
      </form>

      <FormNavigation
        user={formData?.fullName ?? ""}
        onPreviousPageClick={previousStep}
        onNextPageClick={handleNextStep}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        handleFormSubmit={handleFormSubmit}
        isStepComplete={isStepComplete}
      />
    </div>
  );
};

export default MultiStepForm;
