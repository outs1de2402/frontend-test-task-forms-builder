import { Link } from "react-router-dom";
import { useGetFormsQuery } from "../api/generated";

export const HomePage = () => {
  const { data, isLoading, error } = useGetFormsQuery();

  if (isLoading) {
    return <div className="page-state">Loading forms...</div>;
  }

  if (error) {
    return <div className="page-state page-state--error">Failed to load forms.</div>;
  }

  const forms = data?.forms || [];

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Forms Builder</p>
          <h1>Google Forms Lite clone</h1>
          <p className="hero-copy">
            Create forms, collect responses, and review submissions from a single monorepo app.
          </p>
        </div>
        <Link to="/forms/new" className="button button--primary">
          Create new form
        </Link>
      </section>

      <section className="section-stack">
        <div className="section-heading">
          <h2>Available forms</h2>
          <span>{forms.length} total</span>
        </div>

        {forms.length > 0 ? (
          <div className="card-grid">
            {forms.map((form) => (
              <article key={form.id} className="content-card">
                <div className="content-card__body">
                  <h3>{form.title}</h3>
                  <p>{form.description || "No description provided."}</p>
                </div>
                <div className="content-card__actions">
                  <Link to={`/forms/${form.id}/fill`} className="button button--secondary">
                    View form
                  </Link>
                  <Link to={`/forms/${form.id}/responses`} className="button button--ghost">
                    View responses
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No forms yet</h3>
            <p>Create your first form to start collecting responses.</p>
          </div>
        )}
      </section>
    </main>
  );
};
