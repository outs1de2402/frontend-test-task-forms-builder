import { useNavigate, useParams } from "react-router-dom";
import { useGetFormQuery, useGetResponsesQuery } from "../api/generated";
import { formatAnswerValue } from "../features/form-responses/responseUtils";

export const FormResponses = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: formData, isLoading: formLoading, error: formError } = useGetFormQuery({
    id: id || "",
  });
  const {
    data: responsesData,
    isLoading: responsesLoading,
    error: responsesError,
  } = useGetResponsesQuery({ formId: id || "" });

  if (formLoading || responsesLoading) {
    return <div className="page-state">Loading responses...</div>;
  }

  if (formError || responsesError || !formData?.form) {
    return <div className="page-state page-state--error">Failed to load responses.</div>;
  }

  const responses = responsesData?.responses || [];

  return (
    <main className="page-shell">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Responses</p>
            <h1>{formData.form.title}</h1>
          </div>
          <button type="button" className="button button--ghost" onClick={() => navigate("/")}>
            Back to home
          </button>
        </div>

        {responses.length === 0 ? (
          <div className="empty-state">
            <h3>No responses yet</h3>
            <p>Responses submitted for this form will show up here.</p>
          </div>
        ) : (
          <div className="section-stack">
            {responses.map((response, responseIndex) => (
              <article key={response.id} className="content-card">
                <div className="section-heading">
                  <h2>Submission #{responseIndex + 1}</h2>
                  <span>{response.id}</span>
                </div>

                <div className="response-grid">
                  {formData.form.questions.map((question) => {
                    const answer = response.answers.find(
                      (responseAnswer) => responseAnswer.questionId === question.id,
                    );

                    return (
                      <div key={question.id} className="response-item">
                        <h3>{question.label}</h3>
                        <ul>
                          {formatAnswerValue(answer?.value ?? []).map((value) => (
                            <li key={`${question.id}-${value}`}>{value}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
