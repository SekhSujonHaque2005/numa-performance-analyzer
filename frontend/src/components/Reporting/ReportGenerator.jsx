import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Button from "../ui/Button";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ReportGenerator({ data, config }) {
    const [generating, setGenerating] = useState(false);

    const generateReport = async () => {
        setGenerating(true);
        const element = document.getElementById("dashboard-content");

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#020617" });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Cover Page
            pdf.setFont("times", "bold");
            pdf.setFontSize(24);
            pdf.text("NUMA Performance Research Report", 20, 30);

            pdf.setFontSize(12);
            pdf.setFont("times", "normal");
            pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 40);

            pdf.setFontSize(14);
            pdf.text("Configuration:", 20, 55);
            pdf.setFontSize(10);
            pdf.text(`Nodes: ${config.nodes}`, 25, 62);
            pdf.text(`Threads: ${config.threads}`, 25, 68);
            pdf.text(`Blocks: ${config.blocks}`, 25, 74);
            pdf.text(`Policy: ${config.policy}`, 25, 80);

            pdf.setLineWidth(0.5);
            pdf.line(20, 85, 190, 85);

            // Dashboard Screenshot
            if (imgHeight < pdfHeight - 100) {
                pdf.addImage(imgData, "PNG", 0, 90, imgWidth, imgHeight);
            } else {
                pdf.addImage(imgData, "PNG", 0, 90, imgWidth, pdfHeight - 100);
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight - (pdfHeight - 100));
            }

            pdf.save("NUMA_Research_Report.pdf");
        } catch (err) {
            console.error("Report generation failed", err);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Button
            variant="secondary"
            onClick={generateReport}
            disabled={data.length === 0 || generating}
            className="w-full gap-2"
        >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {generating ? "Generating Report..." : "Download Research Report"}
        </Button>
    );
}
