// src/components/UI/LoadingSpinner.tsx
interface LoadingSpinnerProps {
    fullPage?: boolean;
  }
  
  const LoadingSpinner = ({ fullPage = false }: LoadingSpinnerProps) => {
    return (
      <div className={`loading-spinner ${fullPage ? 'full-page' : ''}`}>
        <div className="spinner"></div>
      </div>
    );
  };
  

  
  export default LoadingSpinner;