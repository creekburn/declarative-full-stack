import { useState, useImperativeHandle, forwardRef } from 'react';

function ButtonOrContent({label, open, children}, ref) {
  const [isOpen, setIsOpen] = useState(!!open);

  useImperativeHandle(ref, () => ({
    close: () => {
      setIsOpen(false);
    },
    open: () => {
      setIsOpen(true);
    }
  }));

  const handleClick = (event) => {
    setIsOpen(true);
  };

  const content = () => {
    if (isOpen) {
      return children;
    } else {
      return <button onClick={handleClick}>{label}</button>;
    }
  }

  return (<div>
    {content(isOpen)}
  </div>);
}

export default forwardRef(ButtonOrContent);