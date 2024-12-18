import React from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2pdf from 'html2pdf.js';

export const use_LstvPrintModal = () => {

    
    const componentRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);

    const handleSaveAsPDF = () => {
        const element = componentRef.current;
        if (!element) return;
    
        const options = {
            filename: 'download.pdf',
            jsPDF: { format: 'a4' },
            html2canvas: { scale: 2 },
        };
    
        html2pdf().from(element).set(options).save();
    };

    const handlePrint = useReactToPrint({
        documentTitle: "Print This Document",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        // Reset any state or focus that might interfere with interaction
    };

    const handlePrintOnClick = () => {
        handlePrint(null, () => componentRef.current);
    };

    const handleSavePDFOnClick = () => {
        handleSaveAsPDF();
    };

    return {handleSavePDFOnClick, handlePrintOnClick, handleClose, handleClickOpen, componentRef, open}
}