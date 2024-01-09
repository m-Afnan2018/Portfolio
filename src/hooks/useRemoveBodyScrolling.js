import { useEffect } from "react";


const useRemoveBodyScrolling = (modal)=>{
    useEffect(() => {
        const remove = (modalOpen) => {
            console.log('modalOpen: ', modalOpen);
            const body = document.body;
            if (modalOpen) {
                const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
                body.style.position = 'fixed';
                body.style.top = `-${scrollY}`;
            } else if (!modalOpen) {
                const scrollY = body.style.top;
                body.style.position = '';
                body.style.top = '';
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            } else if (modalOpen) {
                document.body.style.overflowY = 'hidden';
            } else {
                document.body.style.overflowY = 'visible';
            }
        };
        
        remove(modal);
    }, [modal])
}


export default useRemoveBodyScrolling