import { useEffect } from "react";


const useRemoveBodyScrolling = (modal)=>{
    useEffect(() => {
      const body = document.body;

      // Save the scroll position when the modal opens
      const saveScrollPosition = () => {
        body.style.top = `-${window.scrollY}px`;
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
      };
  
      // Restore the scroll position when the modal closes
      const restoreScrollPosition = () => {
        const scrollY = Math.abs(parseInt(body.style.top || '0', 10));
        body.style.overflow = 'visible';
        body.style.position = '';
        body.style.top = '';
        window.scrollTo(0, scrollY);
      };
  
      if (modal) {
        saveScrollPosition();
      } else {
        restoreScrollPosition();
      }
    }, [modal])
}


export default useRemoveBodyScrolling