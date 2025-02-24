
import './ProgressBar.css'

const ProgressBar = ({ value, max }) => {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
};

export default ProgressBar;
