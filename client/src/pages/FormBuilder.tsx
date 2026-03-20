import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFormMutation } from "../api/generated";
import { useFormBuilder } from "../api/features/form-builder/hooks/useFormBuilder";
import { questionTypeOptions } from "../features/form-builder/questionTypes";

export const FormBuilder = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    addQuestion,
    updateQuestion,
    updateQuestionType,
    removeQuestion,
    addOption,
    removeOption,
  } = useFormBuilder();
  const [createForm, { isLoading }] = useCreateFormMutation();

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMessage("Form title is required.");
      return;
    }

    setErrorMessage("");

    try {
      await createForm({
        title: title.trim(),
        description: description.trim(),
        questions,
      }).unwrap();
      navigate("/");
    } catch {
      setErrorMessage("Failed to save the form. Please try again.");
    }
  };

  return (
    <main className="page-shell page-shell--narrow">
      <section className="panel">
        <div className="section-heading">
          <h1>Create new form</h1>
          <button type="button" className="button button--ghost" onClick={() => navigate("/")}>
            Back to home
          </button>
        </div>

        <label className="field-group">
          <span>Form title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Customer feedback survey" />
        </label>

        <label className="field-group">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tell respondents what this form is for."
            rows={4}
          />
        </label>

        <div className="section-heading">
          <h2>Questions</h2>
          <button type="button" className="button button--secondary" onClick={addQuestion}>
            Add question
          </button>
        </div>

        <div className="section-stack">
          {questions.map((question, questionIndex) => (
            <article key={`${question.type}-${questionIndex}`} className="question-card">
              <div className="question-card__header">
                <label className="field-group field-group--grow">
                  <span>Question label</span>
                  <input
                    value={question.label}
                    onChange={(event) => updateQuestion(questionIndex, { label: event.target.value })}
                    placeholder="What would you like to ask?"
                  />
                </label>

                <label className="field-group">
                  <span>Type</span>
                  <select
                    value={question.type}
                    onChange={(event) => updateQuestionType(questionIndex, event.target.value as typeof question.type)}
                  >
                    {questionTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {(question.type === "MULTIPLE_CHOICE" || question.type === "CHECKBOX") && (
                <div className="section-stack">
                  <div className="section-heading">
                    <h3>Options</h3>
                    <button type="button" className="button button--ghost" onClick={() => addOption(questionIndex)}>
                      Add option
                    </button>
                  </div>

                  {question.options?.map((option, optionIndex) => (
                    <div key={`${questionIndex}-${optionIndex}`} className="option-row">
                      <input
                        value={option ?? ""}
                        onChange={(event) => {
                          const nextOptions = [...(question.options ?? [])];
                          nextOptions[optionIndex] = event.target.value;
                          updateQuestion(questionIndex, { options: nextOptions });
                        }}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <button
                        type="button"
                        className="button button--danger"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="question-card__footer">
                <button type="button" className="button button--danger" onClick={() => removeQuestion(questionIndex)}>
                  Delete question
                </button>
              </div>
            </article>
          ))}

          {questions.length === 0 && (
            <div className="empty-state">
              <h3>No questions yet</h3>
              <p>Add at least one question to make the form useful.</p>
            </div>
          )}
        </div>

        {errorMessage && <p className="inline-message inline-message--error">{errorMessage}</p>}

        <div className="actions-row">
          <button type="button" className="button button--primary" disabled={isLoading} onClick={handleSave}>
            {isLoading ? "Saving..." : "Save form"}
          </button>
        </div>
      </section>
    </main>
  );
};
