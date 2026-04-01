import { PrimaryButton } from '../ui/PrimaryButton';

export function TouchControls({ actions }) {
  return (
    <div className="touch-controls glass-card">
      <button
        className="control-pad"
        onMouseDown={() => actions.setTouchDirection(-1)}
        onMouseUp={() => actions.setTouchDirection(0)}
        onTouchStart={() => actions.setTouchDirection(-1)}
        onTouchEnd={() => actions.setTouchDirection(0)}
      >
        ←
      </button>
      <PrimaryButton onClick={actions.shoot}>Disparar</PrimaryButton>
      <button
        className="control-pad"
        onMouseDown={() => actions.setTouchDirection(1)}
        onMouseUp={() => actions.setTouchDirection(0)}
        onTouchStart={() => actions.setTouchDirection(1)}
        onTouchEnd={() => actions.setTouchDirection(0)}
      >
        →
      </button>
    </div>
  );
}
