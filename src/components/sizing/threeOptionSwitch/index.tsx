export const ThreeOptionSwitch = (props: {
  options: {
    label: React.ReactNode;
    value: string;
    className?: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  const { options, value, onChange, className = '' } = props;

  const handleOptionClick = (option: string) => {
    onChange(option);
  };

  const handleKeyDown = (event: React.KeyboardEvent, option: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChange(option);
    }
  };

  return (
    <div
      className={`relative inline-flex  bg-gray-100 rounded-full p-1 transition-all duration-300 ease-in-out w-full ${className}`}
      role="tablist"
      aria-label="Three option switch"
    >
      {options.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            onKeyDown={e => handleKeyDown(e, option.value)}
            className={`
              relative flex-1 px-4 py-2 rounded-full text-sm font-medium transition-transform duration-300 ease-in-out
              
              ${
                isSelected
                  ? 'text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg transform scale-105'
                  : 'text-gray-700 bg-transparent hover:text-gray-900'
              }
            `}
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            aria-label={`Option ${index + 1}: ${option.value}`}
          >
            {option.label}
            {isSelected && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse opacity-20" />
            )}
          </button>
        );
      })}
    </div>
  );
};
