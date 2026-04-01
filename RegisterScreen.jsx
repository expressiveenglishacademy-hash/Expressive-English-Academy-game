import { useState } from 'react';
import { LogoBadge } from '../ui/LogoBadge';
import { PrimaryButton } from '../ui/PrimaryButton';

export function RegisterScreen({ controller }) {
  const { actions } = controller;
  const [form, setForm] = useState({ name: '', group: '' });

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.group.trim()) {
      return;
    }
    actions.register(form);
  }

  return (
    <main className="screen form-screen">
      <section className="glass-card form-card">
        <LogoBadge compact />
        <h2>Registro del jugador</h2>
        <p>Escribe el nombre real del estudiante y su grupo para guardar progreso y ranking.</p>

        <form className="academy-form" onSubmit={handleSubmit}>
          <label>
            Nombre real
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ej. Camila Torres"
            />
          </label>
          <label>
            Grupo
            <input
              value={form.group}
              onChange={(event) => setForm((prev) => ({ ...prev, group: event.target.value }))}
              placeholder="Ej. A2 Teens"
            />
          </label>

          <div className="form-actions">
            <PrimaryButton type="submit">Guardar y seguir</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={actions.goToHome}>
              Volver
            </PrimaryButton>
          </div>
        </form>
      </section>
    </main>
  );
}
