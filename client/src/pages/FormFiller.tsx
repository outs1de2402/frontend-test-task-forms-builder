import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetFormQuery, useSubmitResponseMutation } from "../api/generated";
import {
  formatAnswersForSubmission,
  updateAnswerState,
  type AnswerState,
} from "../features/form-filler/answerUtils";

export const FormFiller = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { data, isLoading, error } = useGetFormQuery({ id: id || "" });
  const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();
  const [answersState, setAnswersState] = useState<AnswerState>({});

  if (isLoading) {
    return <div className="page-state">Loading form...</div>;
  }

  if (error || !data?.form) {
    return <div className="page-state page-state--error">Form not found.</div>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await submitResponse({
        formId: id || "",
        answers: formatAnswersForSubmission(answersState),
      }).unwrap();

      setFeedbackMessage("Form submitted successfully.");
      setTimeout(() => navigate("/"), 600);
    } catch {
      setFeedbackMessage("Failed to submit the form.");
    }
  };

  return (
    <main className="page-shell page-shell--narrow">
      <section className="panel">
        <div className="section-heading">
          <div>
            <h1>{data.form.title}</h1>
            <p>{data.form.description || "No description provided."}</p>
          </div>
          <button type="button" className="button button--ghost" onClick={() => navigate("/")}>
            Back to home
          </button>
        </div>

        <form className="section-stack" onSubmit={handleSubmit}>
          {data.form.questions.map((question) => (
            <article key={question.id} className="question-card">
              <label className="field-group">
                <span>{question.label}</span>

                {question.type === "TEXT" && (
                  <input
                    type="text"
                    required
                    onChange={(event) =>
                      setAnswersState((previousState) =>
                        updateAnswerState(previousState, question.id, event.target.value),
                      )
                    }
                  />
                )}

                {question.type === "DATE" && (
                  <input
                    type="date"
                    required
                    onChange={(event) =>
                      setAnswersState((previousState) =>
                        updateAnswerState(previousState, question.id, event.target.value),
                      )
                    }
                  />
                )}
              </label>

              {question.type === "MULTIPLE_CHOICE" && (
                <div className="choice-list">
                  {question.options?.map((option, index) => (
                    <label key={`${question.id}-${index}`} className="choice-item">
                      <input
                        type="radio"
                        name={question.id}
                        required
                        onChange={() =>
                          setAnswersState((previousState) =>
                            updateAnswerState(previousState, question.id, option || ""),
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "CHECKBOX" && (
                <div className="choice-list">
                  {question.options?.map((option, index) => (
                    <label key={`${question.id}-${index}`} className="choice-item">
                      <input
                        type="checkbox"
                        onChange={() =>
                          setAnswersState((previousState) =>
                            updateAnswerState(previousState, question.id, option || "", true),
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </article>
          ))}

          {feedbackMessage && <p className="inline-message">{feedbackMessage}</p>}

          <div className="actions-row">
            <button type="submit" className="button button--primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit response"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
