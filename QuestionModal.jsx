import { PrimaryButton } from '../ui/PrimaryButton';

export function QuestionModal({
  question,
  secondsLeft,
  onAnswer,
  onSpeak,
  speechSupported,
}) {
  if (!question) {
    return null;
  }

  return (
    <div className="overlay-panel">
      <div className="glass-card modal-card question-modal">
        <div className="modal-topline">
          <span>Pregunta de inglés</span>
          <span>Tiempo: {secondsLeft || question.timeLimit}s</span>
        </div>
        <h2>{question.prompt}</h2>
        <p>{question.aidMode !== 'minimal' ? question.hint : 'Piensa y responde rápido.'}</p>

        <div className="option-grid">
          {question.options.map((option) => (
            <PrimaryButton key={option} variant="secondary" onClick={() => onAnswer(option)}>
              {option}
            </PrimaryButton>
          ))}
        </div>

        <div className="modal-actions">
          <PrimaryButton
            variant="ghost"
            onClick={() => onSpeak(question.voiceText)}
            disabled={!speechSupported}
          >
            {speechSupported ? 'Escuchar pregunta' : 'Audio no disponible'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
